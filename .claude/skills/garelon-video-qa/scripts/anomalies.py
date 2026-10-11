"""Decode errors and visual anomalies using ffmpeg filters only.

One decode pass for errors, one filtered pass (at reduced scale) for
freeze / black / scene cuts / per-frame luma stats.
"""
from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

from common import Issue, group_runs


def decode_errors(path: str) -> list[str]:
    res = subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-v", "error", "-i", path,
                          "-map", "0:v:0", "-f", "null", "-"],
                         capture_output=True, text=True, timeout=900)
    lines = [l.strip() for l in res.stderr.splitlines() if l.strip()]
    if res.returncode != 0 and not lines:
        lines = [f"ffmpeg salió con código {res.returncode}"]
    return lines


def frame_stats(path: str, th: dict) -> list[dict]:
    """Per-frame metadata: t, YAVG, YDIF, scene score, freeze/black markers."""
    a = th["anomalies"]
    vf = (f"scale=360:-2,"
          f"freezedetect=n={a['freeze_noise_db']}dB:d={a['freeze_min_s']},"
          f"blackdetect=d={a['black_min_s']}:pix_th={a['black_pix_th']},"
          f"scdet=threshold={a['scene_threshold']},"
          f"signalstats,metadata=mode=print:file=meta.txt")
    with tempfile.TemporaryDirectory(prefix="gvqa_") as tmp:
        subprocess.run(["ffmpeg", "-hide_banner", "-nostdin", "-v", "error",
                        "-i", str(Path(path).resolve()), "-map", "0:v:0", "-vf", vf, "-f", "null", "-"],
                       capture_output=True, text=True, timeout=900, cwd=tmp)
        meta = Path(tmp, "meta.txt")
        text = meta.read_text(errors="replace") if meta.exists() else ""
    frames: list[dict] = []
    cur: dict | None = None
    for line in text.splitlines():
        m = re.match(r"frame:(\d+)\s+pts:\S+\s+pts_time:([\d.eE+-]+)", line)
        if m:
            cur = {"n": int(m.group(1)), "t": float(m.group(2))}
            frames.append(cur)
            continue
        if cur is None or "=" not in line:
            continue
        k, v = line.split("=", 1)
        k = k.replace("lavfi.", "")
        try:
            cur[k] = float(v)
        except ValueError:
            cur[k] = v
    return frames


def analyze(path: str, th: dict, fps: float) -> tuple[list[Issue], dict]:
    a = th["anomalies"]
    issues: list[Issue] = []
    errs = decode_errors(path)
    if errs:
        issues.append(Issue("CRITICA", "anomalia",
                            f"Errores de decodificación ({len(errs)}): posible archivo o frames corruptos",
                            evidence={"stderr": errs[:10]}))
    frames = frame_stats(path, th)
    summary = {"decode_errors": len(errs), "frames_analizados": len(frames), "scene_cuts": []}
    if not frames:
        issues.append(Issue("CRITICA", "anomalia", "No se pudo analizar ningún frame"))
        return issues, summary

    # Scene cuts
    cuts = [f["t"] for f in frames if "scd.time" in f]
    summary["scene_cuts"] = [round(t, 3) for t in cuts]

    # Freeze intervals
    start = None
    for f in frames:
        if "freezedetect.freeze_start" in f:
            start = float(f["freezedetect.freeze_start"])
        if "freezedetect.freeze_end" in f and start is not None:
            end = float(f["freezedetect.freeze_end"])
            issues.append(Issue("MEDIA", "anomalia", f"Imagen congelada {end - start:.2f} s",
                                t_start=start, t_end=end))
            start = None
    if start is not None:
        end = frames[-1]["t"]
        issues.append(Issue("MEDIA", "anomalia", f"Imagen congelada hasta el final ({end - start:.2f} s)",
                            t_start=start, t_end=end))

    # Black intervals
    bstart = None
    for f in frames:
        if "black_start" in f:
            bstart = float(f["black_start"])
        if "black_end" in f and bstart is not None:
            bend = float(f["black_end"])
            issues.append(Issue("MEDIA", "anomalia", f"Tramo negro {bend - bstart:.2f} s",
                                t_start=bstart, t_end=bend))
            bstart = None
    if bstart is not None:
        issues.append(Issue("MEDIA", "anomalia", "Tramo negro hasta el final",
                            t_start=bstart, t_end=frames[-1]["t"]))

    # Duplicate frames (stutter) not already explained by a long freeze
    dups = [(f["n"], f["t"]) for f in frames[1:]
            if isinstance(f.get("signalstats.YDIF"), float) and f["signalstats.YDIF"] < a["duplicate_ydif"]]
    freeze_spans = [(i.t_start, i.t_end) for i in issues if "congelada" in i.message]
    for run_ in group_runs(dups, max_gap_frames=1):
        t0, t1 = run_[0][1], run_[-1][1]
        if len(run_) < a["duplicate_run_frames"]:
            continue
        if any(s is not None and s - 0.05 <= t0 and t1 <= (e or 1e9) + 0.05 for s, e in freeze_spans):
            continue
        issues.append(Issue("BAJA", "anomalia", f"{len(run_)} frames duplicados seguidos (posible tirón)",
                            t_start=t0, t_end=t1, frames=[n for n, _ in run_][:20]))

    # Flicker: brightness jumps that are not scene cuts
    cut_set = {round(t, 2) for t in cuts}
    jumps = []
    for prev, f in zip(frames, frames[1:]):
        ya, yb = prev.get("signalstats.YAVG"), f.get("signalstats.YAVG")
        if isinstance(ya, float) and isinstance(yb, float) and abs(yb - ya) > a["flicker_yavg_jump"]:
            if round(f["t"], 2) not in cut_set:
                jumps.append((f["n"], f["t"]))
    for run_ in group_runs(jumps, max_gap_frames=int(max(fps, 1) // 2)):
        issues.append(Issue("MEDIA", "anomalia",
                            f"Saltos bruscos de brillo sin corte de escena ({len(run_)}): posible parpadeo",
                            t_start=run_[0][1], t_end=run_[-1][1], frames=[n for n, _ in run_][:20]))
    summary["yavg"] = [round(f.get("signalstats.YAVG", 0), 1) for f in frames[:: max(1, len(frames) // 60)]]
    return issues, summary
