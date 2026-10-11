#!/usr/bin/env python3
"""garelon-video-qa entry point.

  qa.py run      --stage {pre,post-upscale,post-edit,post-generate} --result VIDEO
                 [--original VIDEO] [--refs refs.json] [--target 1080x1920] [--final]
                 [--id CREATIVE_ID] [--platform tiktok] [--qa-root DIR]
  qa.py finalize --run RUN_DIR --visual visual_review.json
  qa.py check-env

Read-only on inputs. Writes only inside a NEW run directory:
  <qa-root>/<video_name>/<YYYY-MM-DD_HHMMSS>/
No network, no Higgsfield, no credits.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path

os.environ.setdefault("OPENCV_FFMPEG_LOGLEVEL", "-8")  # silence decoder spam; errors are reported by anomalies.py
sys.path.insert(0, str(Path(__file__).resolve().parent))

from common import fmt_ts, load_thresholds, write_json  # noqa: E402

STAGES = ("pre", "post-upscale", "post-edit", "post-generate")


def default_qa_root() -> Path:
    if os.environ.get("GARELON_QA_ROOT"):
        return Path(os.environ["GARELON_QA_ROOT"])
    if Path("/mnt/project-files/creative").is_dir():
        return Path("/mnt/project-files/creative/_qa")
    return Path.cwd() / "creative" / "_qa"


def new_run_dir(root: Path, name: str) -> Path:
    base = root / name / datetime.now().strftime("%Y-%m-%d_%H%M%S")
    d, n = base, 1
    while d.exists():
        n += 1
        d = Path(f"{base}_{n}")
    d.mkdir(parents=True)
    (d / "frames").mkdir()
    return d


def cmd_run(a) -> int:
    import cv2  # noqa: F401  (fail early with a clear message if missing)
    import anomalies, compare, frames as fr, probe, product
    from report import DEFAULT_PARTS, build

    th = load_thresholds()
    if a.target:
        w, h = (int(x) for x in a.target.lower().split("x"))
        th["target"]["width"], th["target"]["height"] = w, h
    result = str(Path(a.result).resolve())
    original = str(Path(a.original).resolve()) if a.original else None
    for p in [result, original, a.refs]:
        if p and not Path(p).exists():
            print(f"ERROR: no existe {p}", file=sys.stderr)
            return 2
    if a.stage in ("post-upscale", "post-edit") and not original:
        print(f"ERROR: --stage {a.stage} necesita --original", file=sys.stderr)
        return 2

    name = a.name or Path(result).stem
    root = Path(a.qa_root) if a.qa_root else default_qa_root()
    run_dir = new_run_dir(root, name)
    print(f"Run: {run_dir}")

    rinfo = probe.probe(result)
    oinfo = probe.probe(original) if original else None
    issues = [i.to_dict() for i in probe.check_technical(rinfo, th, a.stage, a.final)]
    if not rinfo.get("ok"):
        state = {"name": name, "stage": a.stage, "result_info": rinfo, "issues": issues,
                 "target": [th["target"]["width"], th["target"]["height"]]}
        build(state, run_dir)
        print(open(run_dir / "report.md", encoding="utf-8").read())
        return 1
    if a.stage == "pre":
        issues += [i.to_dict() for i in probe.check_pipeline_limits(rinfo, th)]

    an_issues, an_summary = anomalies.analyze(result, th, rinfo["fps"] or 30)
    issues += [i.to_dict() for i in an_issues]

    aligned = a.stage in ("post-upscale", "post-edit") and original
    cmp_summary, sharp_rows = None, []
    if aligned:
        c_issues, cmp_summary = compare.analyze(original, result, rinfo, oinfo, th, a.stage)
        issues += [i.to_dict() for i in c_issues]

    flagged = [i["t_start"] for i in issues if i.get("t_start") is not None]
    if cmp_summary and cmp_summary.get("peores_frames"):
        flagged += [f["t"] for f in cmp_summary["peores_frames"][:3]]
    ts = fr.select_timestamps(rinfo["duration_s"], an_summary.get("scene_cuts", []), flagged, th)

    rows = []
    if aligned:
        pairs = []
        for t in ts:
            o, r = fr.read_frame(original, t), fr.read_frame(result, t)
            if o is not None and r is not None:
                pairs.append((t, fr.resize_to(o, r.shape[1], r.shape[0]), r))
        s_issues, sharp_rows = compare.sharpness_check(pairs, th)
        issues += [i.to_dict() for i in s_issues]
        worst = sorted(pairs, key=lambda pr: compare.sharpness(pr[2]) / max(compare.sharpness(pr[1]), 1e-6))[:2]
        for t, o, r in worst:
            cells = []
            for k, (sv, tile_o, tile_r) in enumerate(compare.worst_tiles(o, r)):
                cells += [(f"ORIGINAL zona {k + 1}", tile_o), (f"RESULTADO zona {k + 1} · SSIM {sv:.2f}", tile_r)]
            if cells:
                rows.append({"label": f"ZONAS {fmt_ts(t)}", "cells": cells,
                             "note": "zonas con más diferencia original/resultado"})

    product_summary, visual_parts = None, DEFAULT_PARTS
    if a.refs:
        refs = product.load_refs(a.refs)
        visual_parts = [p["name"] for p in refs["parts"]]
        p_issues, product_summary, per_part = product.analyze(
            result, ts, refs, th, a.stage, original if aligned else None, rinfo, oinfo)
        issues += [i.to_dict() for i in p_issues]
        rows += product.lamina_rows(per_part, bool(aligned))
    else:
        issues.append({"severity": "MEDIA", "category": "producto", "t_start": None, "t_end": None, "frames": [],
                       "evidence": {}, "message": "Sin referencias de producto (--refs): fidelidad no verificada"})

    # Full-frame rows: always present so the human review never depends on detection succeeding.
    worst_ts = [f["t"] for f in (cmp_summary or {}).get("peores_frames", [])[:2]]
    show_ts = sorted(set([t for t in worst_ts] + ts[:: max(1, len(ts) // 3)]))[:4]
    for t in show_ts:
        r = fr.read_frame(result, t)
        cells = []
        if original:
            o = fr.read_frame(original, t)
            cells.append((f"ORIGINAL {fmt_ts(t)}", o))
        cells.append((f"RESULTADO {fmt_ts(t)}", r))
        rows.append({"label": f"FRAME {fmt_ts(t)}", "cells": cells, "note": "frame completo"})
    fr.side_by_side_rows(rows, run_dir / "lamina_lado_a_lado.jpg",
                         f"{name} · {a.stage} · " + ("referencia | original | resultado" if original else "referencia | resultado"))
    fr.contact_sheet(result, ts, run_dir / "contact_sheet.jpg", th, f"{name} · frames representativos")
    cited = sorted({round(i["t_start"], 2) for i in issues if i.get("t_start") is not None})[:12]
    for t in cited:
        fr.save_frame(result, t, run_dir / "frames" / f"result_{t:07.2f}s.jpg")
        if original:
            fr.save_frame(original, t, run_dir / "frames" / f"original_{t:07.2f}s.jpg")

    fps = rinfo["fps"] or 30
    for i in issues:
        if not i["frames"]:
            pts = i.get("evidence", {}).get("ts") or ([i["t_start"], i["t_end"]] if i.get("t_start") is not None else [])
            i["frames"] = sorted({int(round(t * fps)) for t in pts if t is not None})

    state = {
        "name": name, "id": a.id, "platform": a.platform, "stage": a.stage, "final": a.final,
        "created": datetime.now().isoformat(timespec="seconds"),
        "target": [th["target"]["width"], th["target"]["height"]],
        "result_info": rinfo, "original_info": oinfo, "refs": a.refs,
        "anomalies_summary": an_summary, "compare_summary": cmp_summary, "sharpness": sharp_rows,
        "product_summary": product_summary, "visual_required_parts": visual_parts,
        "timestamps_representativos": [round(t, 3) for t in ts],
        "issues": issues, "visual_done": False, "visual": None,
        "thresholds_version": th.get("_nota", "")[:40],
    }
    write_json(run_dir / "state.json", state)
    build(state, run_dir)
    print((run_dir / "report.md").read_text(encoding="utf-8"))
    return 0


def cmd_finalize(a) -> int:
    from report import build, visual_issues
    run_dir = Path(a.run)
    state = json.loads((run_dir / "state.json").read_text(encoding="utf-8"))
    visual = json.loads(Path(a.visual).read_text(encoding="utf-8"))
    v_issues, complete = visual_issues(visual, state["visual_required_parts"])
    fps = state["result_info"].get("fps") or 30
    for i in v_issues:
        ts = visual["piezas"][i["evidence"]["pieza"]].get("timestamps") or []
        i["frames"] = sorted({int(round(t * fps)) for t in ts})
    # A part reviewed as "ok" resolves the automatic signals for that part (they are only signals).
    ok_parts = {n for n, v in visual.get("piezas", {}).items() if v.get("estado") == "ok"}
    for i in state["issues"]:
        pieza = (i.get("evidence") or {}).get("pieza")
        if i["category"] == "producto" and pieza in ok_parts and i["severity"] != "BAJA":
            i["evidence"]["severidad_original"] = i["severity"]
            i["severity"] = "BAJA"
            i["message"] += " (resuelto: ok en revisión visual)"
    state["issues"] = [i for i in state["issues"] if i["category"] != "visual"] + v_issues
    state["visual"] = visual
    state["visual_done"] = complete
    if not complete:
        missing = [p for p in state["visual_required_parts"] if p not in visual.get("piezas", {})]
        print(f"AVISO: revisión visual incompleta, faltan: {', '.join(missing)}", file=sys.stderr)
    write_json(run_dir / "visual_review.json", visual)
    write_json(run_dir / "state.json", state)
    build(state, run_dir)
    print((run_dir / "report.md").read_text(encoding="utf-8"))
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="GARELON video QA (local, read-only, sin créditos)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run")
    r.add_argument("--stage", required=True, choices=STAGES)
    r.add_argument("--result", required=True, help="vídeo a revisar (en 'pre', el vídeo fuente)")
    r.add_argument("--original", help="vídeo original (obligatorio en post-upscale y post-edit)")
    r.add_argument("--refs", help="refs.json de creative/_references/product/")
    r.add_argument("--target", default="1080x1920")
    r.add_argument("--final", action="store_true", help="entrega final: resolución distinta del objetivo = FAIL")
    r.add_argument("--id", help="ID de la creatividad")
    r.add_argument("--platform", help="tiktok | reels | shorts")
    r.add_argument("--name", help="nombre de carpeta (por defecto, nombre del vídeo)")
    r.add_argument("--qa-root", help="carpeta raíz de informes (por defecto creative/_qa)")
    f = sub.add_parser("finalize")
    f.add_argument("--run", required=True)
    f.add_argument("--visual", required=True)
    sub.add_parser("check-env")
    a = ap.parse_args()
    if a.cmd == "run":
        return cmd_run(a)
    if a.cmd == "finalize":
        return cmd_finalize(a)
    from check_env import main as ce
    return ce()


if __name__ == "__main__":
    sys.exit(main())
