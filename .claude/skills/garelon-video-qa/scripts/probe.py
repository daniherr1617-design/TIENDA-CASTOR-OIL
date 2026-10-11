"""Technical probe with ffprobe: resolution, aspect ratio, fps, duration, bitrate, codec."""
from __future__ import annotations

import json
from fractions import Fraction

from common import Issue, run


def _fps(rate: str | None) -> float | None:
    try:
        f = Fraction(rate)
        return float(f) if f else None
    except (TypeError, ValueError, ZeroDivisionError):
        return None


def probe(path: str) -> dict:
    res = run(["ffprobe", "-v", "error", "-print_format", "json",
               "-show_format", "-show_streams", path])
    if res.returncode != 0:
        return {"ok": False, "error": res.stderr.strip()[:500]}
    data = json.loads(res.stdout or "{}")
    vstreams = [s for s in data.get("streams", []) if s.get("codec_type") == "video"]
    if not vstreams:
        return {"ok": False, "error": "sin pista de vídeo"}
    v = vstreams[0]
    fmt = data.get("format", {})
    w, h = int(v.get("width", 0)), int(v.get("height", 0))
    rotation = 0
    for sd in v.get("side_data_list", []) or []:
        if "rotation" in sd:
            rotation = int(sd["rotation"])
    if abs(rotation) in (90, 270):
        w, h = h, w
    r_fps, avg_fps = _fps(v.get("r_frame_rate")), _fps(v.get("avg_frame_rate"))
    duration = float(v.get("duration") or fmt.get("duration") or 0)
    bitrate = v.get("bit_rate") or fmt.get("bit_rate")
    return {
        "ok": True,
        "path": path,
        "width": w,
        "height": h,
        "rotation": rotation,
        "aspect": round(w / h, 4) if h else None,
        "fps": round(avg_fps or r_fps or 0, 3),
        "fps_r": r_fps,
        "fps_avg": avg_fps,
        "vfr": bool(r_fps and avg_fps and abs(r_fps - avg_fps) > 0.05),
        "duration_s": round(duration, 3),
        "nb_frames": int(v["nb_frames"]) if str(v.get("nb_frames", "")).isdigit() else None,
        "bitrate_kbps": round(int(bitrate) / 1000) if bitrate else None,
        "codec": v.get("codec_name"),
        "profile": v.get("profile"),
        "pix_fmt": v.get("pix_fmt"),
        "has_audio": any(s.get("codec_type") == "audio" for s in data.get("streams", [])),
        "container": fmt.get("format_name"),
        "size_bytes": int(fmt.get("size", 0) or 0),
    }


def check_technical(info: dict, th: dict, stage: str, final: bool) -> list[Issue]:
    """Delivery checks. In stage 'pre' the target is informative only (an upscale is expected)."""
    issues: list[Issue] = []
    if not info.get("ok"):
        return [Issue("CRITICA", "tecnico", f"No se puede leer el vídeo: {info.get('error')}")]
    t = th["target"]
    informative = stage == "pre"
    w, h = info["width"], info["height"]
    if (w, h) != (t["width"], t["height"]):
        same_ratio = abs(w / h - t["width"] / t["height"]) < 0.01
        if informative:
            sev = "BAJA"
        else:
            sev = "CRITICA" if final else "ALTA"
        hint = "mismo 9:16, falta escalar" if same_ratio else "aspect ratio distinto de 9:16"
        issues.append(Issue(sev, "tecnico",
                            f"Resolución {w}×{h}, objetivo {t['width']}×{t['height']} ({hint})",
                            evidence={"width": w, "height": h}))
    fps = info["fps"]
    if fps and not any(abs(fps - a) < 0.05 for a in t["fps_allowed"]):
        issues.append(Issue("MEDIA", "tecnico", f"FPS no estándar: {fps}"))
    if info["vfr"]:
        issues.append(Issue("MEDIA", "tecnico",
                            f"FPS variable (r={info['fps_r']:.3f}, media={info['fps_avg']:.3f})"))
    if not informative:
        if info["codec"] not in t["codecs_ok"]:
            issues.append(Issue("ALTA", "tecnico", f"Codec {info['codec']} no recomendado para redes"))
        if info["pix_fmt"] not in t["pix_fmts_ok"]:
            issues.append(Issue("MEDIA", "tecnico", f"Pixel format {info['pix_fmt']} (recomendado yuv420p)"))
        br = info["bitrate_kbps"]
        if br is not None and br < t["min_bitrate_kbps"] and (w, h) == (t["width"], t["height"]):
            issues.append(Issue("MEDIA", "tecnico",
                                f"Bitrate {br/1000:.1f} Mbps (< {t['min_bitrate_kbps']/1000:.0f} Mbps recomendado para {w}×{h})"))
    if t.get("max_duration_s") and info["duration_s"] > t["max_duration_s"]:
        issues.append(Issue("MEDIA", "tecnico",
                            f"Duración {info['duration_s']} s > máximo {t['max_duration_s']} s"))
    if info["duration_s"] <= 0:
        issues.append(Issue("CRITICA", "tecnico", "Duración 0 o desconocida"))
    return issues


def check_pipeline_limits(info: dict, th: dict) -> list[Issue]:
    issues = []
    for model, lim in th.get("pipeline_limits", {}).items():
        if model.startswith("_"):
            continue
        mx = lim.get("max_input_s")
        if mx and info.get("duration_s", 0) > mx:
            issues.append(Issue("BAJA", "tecnico",
                                f"{model} procesa como máximo {mx} s; el clip dura {info['duration_s']} s. Elegir tramo antes de enviar."))
    return issues
