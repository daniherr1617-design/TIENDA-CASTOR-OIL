"""Aligned comparison original vs result (post-upscale / post-edit).

Full-frame SSIM and PSNR per frame via ffmpeg (the original is scaled to the
result resolution and resampled to its fps). Sharpness (Laplacian variance)
on sampled frames via OpenCV. All numbers are signals for the report; they do
not decide product fidelity on their own.
"""
from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

from common import Issue, group_runs


def ssim_psnr_series(original: str, result: str, width: int, height: int, fps: float) -> list[dict]:
    lavfi = (f"[1:v]scale={width}:{height}:flags=bicubic,fps={fps},format=yuv420p,split[r1][r2];"
             f"[0:v]format=yuv420p,split[d1][d2];"
             f"[d1][r1]ssim=stats_file=ssim.log:eof_action=endall;"
             f"[d2][r2]psnr=stats_file=psnr.log:eof_action=endall")
    with tempfile.TemporaryDirectory(prefix="gvqa_") as tmp:
        subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-v", "error",
                        "-i", str(Path(result).resolve()), "-i", str(Path(original).resolve()),
                        "-lavfi", lavfi, "-f", "null", "-"],
                       capture_output=True, text=True, timeout=1800, cwd=tmp)
        s_txt = Path(tmp, "ssim.log").read_text() if Path(tmp, "ssim.log").exists() else ""
        p_txt = Path(tmp, "psnr.log").read_text() if Path(tmp, "psnr.log").exists() else ""
    out: dict[int, dict] = {}
    for line in s_txt.splitlines():
        m = re.search(r"n:(\d+).*All:([\d.]+)", line)
        if m:
            n = int(m.group(1)) - 1
            out.setdefault(n, {"n": n, "t": n / fps})["ssim"] = float(m.group(2))
    for line in p_txt.splitlines():
        m = re.search(r"n:(\d+).*psnr_avg:(inf|[\d.]+)", line)
        if m:
            n = int(m.group(1)) - 1
            v = 99.0 if m.group(2) == "inf" else float(m.group(2))
            out.setdefault(n, {"n": n, "t": n / fps})["psnr"] = v
    return [out[k] for k in sorted(out)]


def analyze(original: str, result: str, rinfo: dict, oinfo: dict, th: dict, stage: str) -> tuple[list[Issue], dict]:
    c = th["compare_aligned"]
    issues: list[Issue] = []
    series = ssim_psnr_series(original, result, rinfo["width"], rinfo["height"], rinfo["fps"] or 30)
    summary: dict = {"frames_comparados": len(series)}
    if not series:
        issues.append(Issue("ALTA", "comparacion", "No se pudo calcular SSIM/PSNR (¿vídeos incompatibles?)"))
        return issues, summary
    ssims = [f["ssim"] for f in series if "ssim" in f]
    psnrs = [f["psnr"] for f in series if "psnr" in f]
    summary.update({
        "ssim_media": round(sum(ssims) / len(ssims), 4) if ssims else None,
        "ssim_min": round(min(ssims), 4) if ssims else None,
        "psnr_media": round(sum(psnrs) / len(psnrs), 2) if psnrs else None,
        "peores_frames": sorted(series, key=lambda f: f.get("ssim", 1))[:5],
    })
    if abs(oinfo["duration_s"] - rinfo["duration_s"]) > 0.25:
        issues.append(Issue("MEDIA", "comparacion",
                            f"Duración distinta: original {oinfo['duration_s']} s, resultado {rinfo['duration_s']} s "
                            "(la comparación frame a frame puede desalinearse)"))
    # In post-edit, low full-frame SSIM is expected where the edit happened: informative only.
    sev_warn = "BAJA" if stage == "post-edit" else "ALTA"
    bad = [(f["n"], f["t"]) for f in series if f.get("ssim", 1) < c["ssim_warn"]]
    for run_ in group_runs(bad):
        if len(run_) < c["min_bad_run_frames"]:
            continue
        vals = [f["ssim"] for f in series if run_[0][0] <= f["n"] <= run_[-1][0]]
        issues.append(Issue(sev_warn, "comparacion",
                            f"SSIM bajo ({min(vals):.3f}–{max(vals):.3f} < {c['ssim_warn']}) respecto al original"
                            + (" (esperable si esta zona fue editada)" if stage == "post-edit" else ""),
                            t_start=run_[0][1], t_end=run_[-1][1], frames=[n for n, _ in run_][:20]))
    if ssims and stage != "post-edit" and c["ssim_warn"] <= summary["ssim_media"] < c["ssim_ok"]:
        issues.append(Issue("MEDIA", "comparacion",
                            f"SSIM medio {summary['ssim_media']} (entre {c['ssim_warn']} y {c['ssim_ok']}): revisar detalle en la lámina"))
    if psnrs and stage != "post-edit" and summary["psnr_media"] < c["psnr_warn_db"]:
        issues.append(Issue("MEDIA", "comparacion", f"PSNR medio {summary['psnr_media']} dB (< {c['psnr_warn_db']})"))
    return issues, summary


def sharpness(img) -> float:
    import cv2
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return float(cv2.Laplacian(g, cv2.CV_64F).var())


def sharpness_check(pairs: list[tuple[float, object, object]], th: dict) -> tuple[list[Issue], list[dict]]:
    """pairs: (t, original_frame_resized_to_result, result_frame)."""
    issues, rows = [], []
    ratio_warn = th["compare_aligned"]["sharpness_loss_ratio_warn"]
    for t, o, r in pairs:
        so, sr = sharpness(o), sharpness(r)
        ratio = sr / so if so > 1e-6 else 1.0
        rows.append({"t": round(t, 3), "nitidez_original": round(so, 1), "nitidez_resultado": round(sr, 1),
                     "ratio": round(ratio, 3)})
    low = [r for r in rows if r["ratio"] < ratio_warn]
    if low:
        issues.append(Issue("MEDIA", "comparacion",
                            f"Pérdida de nitidez en {len(low)}/{len(rows)} frames muestreados (ratio < {ratio_warn})",
                            t_start=low[0]["t"], t_end=low[-1]["t"], evidence={"muestras": low[:5]}))
    return issues, rows


def worst_tiles(orig, res, grid: int = 6, n: int = 2) -> list[tuple[float, object, object]]:
    """Regions where result differs most from original (no product localisation needed)."""
    from product import ssim_gray
    h, w = res.shape[:2]
    th_, tw = h // grid, w // grid
    out = []
    for gy in range(grid):
        for gx in range(grid):
            y, x = gy * th_, gx * tw
            a, b = orig[y:y + th_, x:x + tw], res[y:y + th_, x:x + tw]
            if a.std() < 4:          # flat background: not informative
                continue
            out.append((ssim_gray(a, b), a, b))
    return sorted(out, key=lambda r: r[0])[:n]
