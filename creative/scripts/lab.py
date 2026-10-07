#!/usr/bin/env python3
"""GARELON Creative Lab: herramienta única para el flujo de vídeo.

  lab ingest <archivo> --name NOMBRE   copia el original (solo lectura + SHA-256) y prepara la copia de trabajo
  lab analyze NOMBRE                   silencios, cambios de plano, sonoridad y hojas de fotogramas
  lab transcribe NOMBRE                transcripción local con faster-whisper (tiempos por palabra)
  lab cuts NOMBRE                      propone cortes sin silencios y reubica las palabras en la línea final
  lab check props/ID.json              claims prohibidos + coherencia de las props
  lab render props/ID.json             check → Remotion → sonoridad/faststart → QA → manifest
  lab qa archivo.mp4                   especificaciones, sonoridad y fotogramas con zonas seguras

Todo lo pesado vive en creative/media (fuera de git). Los originales nunca se modifican.
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import hashlib
import json
import os
import re
import shutil
import stat
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # creative/
MEDIA = ROOT / "media"
ORIG = MEDIA / "00_originales"
WORK = MEDIA / "01_intermedio"
RENDERS = MEDIA / "02_renders"
FINAL = MEDIA / "03_finales"
CONFIG = ROOT / "config"
REMOTION = ROOT / "remotion"
CACHE = ROOT / ".cache" / "whisper"
MANIFEST = ROOT / "manifest.csv"

VIDEO_EXT = {".mp4", ".mov", ".m4v", ".mkv", ".webm", ".avi"}
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp"}
AUDIO_EXT = {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"}
NAME_RE = re.compile(r"^[A-Z0-9][A-Z0-9_-]*$")
LOUDNESS = "loudnorm=I=-14:TP=-1.5:LRA=11"  # práctica habitual para redes; las plataformas normalizan


def run(cmd: list[str], capture: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, check=True, text=True, capture_output=capture)


def ffmpeg_log(args: list[str]) -> str:
    """Ejecuta ffmpeg sin salida de vídeo y devuelve su log (stderr)."""
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], text=True, capture_output=True)
    if p.returncode != 0:
        sys.exit(p.stderr[-2000:])
    return p.stderr


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for block in iter(lambda: fh.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def probe(path: Path) -> dict:
    out = run(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(path)]).stdout
    return json.loads(out)


def duration(path: Path) -> float:
    return float(probe(path)["format"]["duration"])


def workdir(name: str) -> Path:
    d = WORK / name
    if not d.exists():
        sys.exit(f"No existe {d}. Ejecuta primero: lab ingest <archivo> --name {name}")
    return d


# ---------------------------------------------------------------- ingest
def cmd_ingest(a):
    src = Path(a.file).expanduser().resolve()
    if not src.is_file():
        sys.exit(f"No encuentro {src}")
    if not NAME_RE.match(a.name):
        sys.exit("--name en MAYÚSCULAS, cifras, _ y - (p. ej. ROSARIO_ORIGINAL_01)")
    ext = src.suffix.lower()
    dst = ORIG / f"{a.name}{ext}"
    ORIG.mkdir(parents=True, exist_ok=True)
    if dst.exists():
        if sha256(dst) != sha256(src):
            sys.exit(f"{dst.name} ya existe con otro contenido. Usa otro --name: los originales no se sobrescriben.")
        print(f"= {dst.name} ya estaba ingestado (mismo SHA-256)")
    else:
        shutil.copy2(src, dst)
        dst.chmod(stat.S_IRUSR | stat.S_IRGRP | stat.S_IROTH)
        print(f"+ original: {dst.relative_to(ROOT)} (solo lectura)")
    digest = sha256(dst)
    (ORIG / f"{a.name}{ext}.sha256").write_text(f"{digest}  {dst.name}\n")

    if ext in IMAGE_EXT or ext in AUDIO_EXT:
        print(f"  sha256 {digest[:16]}…  (imagen/audio: se usa directamente desde 00_originales)")
        return
    if ext not in VIDEO_EXT:
        sys.exit(f"Extensión no soportada: {ext}")

    d = WORK / a.name
    d.mkdir(parents=True, exist_ok=True)
    info = probe(dst)
    (d / "probe.json").write_text(json.dumps(info, indent=2))
    v = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
    has_audio = any(s["codec_type"] == "audio" for s in info["streams"])
    # Copia de trabajo: 30 fps constantes (Remotion corta por fotograma), H.264, rotación aplicada.
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(dst), "-map", "0:v:0"]
    if has_audio:
        cmd += ["-map", "0:a:0", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
    cmd += ["-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "16",
            "-movflags", "+faststart", str(d / "work.mp4")]
    run(cmd)
    if has_audio:
        run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(dst), "-vn", "-ac", "1", "-ar", "16000",
             str(d / "audio16k.wav")])
    print(f"+ trabajo: {(d / 'work.mp4').relative_to(ROOT)}  {v['width']}x{v['height']}  "
          f"{float(info['format']['duration']):.2f}s  audio={'sí' if has_audio else 'no'}")
    print(f"  sha256 {digest[:16]}…")


# ---------------------------------------------------------------- analyze
def cmd_analyze(a):
    d = workdir(a.name)
    work = d / "work.mp4"
    dur = duration(work)
    res: dict = {"name": a.name, "duration": round(dur, 3)}

    has_audio = (d / "audio16k.wav").exists()
    if has_audio:
        log = ffmpeg_log(["-i", str(work), "-af", f"silencedetect=noise={a.noise}dB:d={a.min_silence}", "-vn", "-f", "null", "-"])
        starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
        ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
        res["silences"] = [{"start": round(s, 3), "end": round(e if i < len(ends) else dur, 3)}
                           for i, (s, e) in enumerate(zip(starts, ends + [dur] * (len(starts) - len(ends))))]
        log = ffmpeg_log(["-i", str(work), "-af", "loudnorm=print_format=json", "-vn", "-f", "null", "-"])
        m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log, re.S)
        if m:
            ln = json.loads(m.group(0))
            res["loudness"] = {"integrated_lufs": float(ln["input_i"]), "true_peak_db": float(ln["input_tp"])}
        first_sound = 0.0
        if res["silences"] and res["silences"][0]["start"] <= 0.05:
            first_sound = res["silences"][0]["end"]
        res["first_sound"] = round(first_sound, 3)

    log = ffmpeg_log(["-i", str(work), "-vf", f"scdet=threshold={a.scene}", "-an", "-f", "null", "-"])
    res["scene_changes"] = [round(float(t), 3) for t in re.findall(r"lavfi\.scd\.time: ([\d.]+)", log)]

    # Hojas de fotogramas con marca de tiempo: así se "ve" el vídeo sin reproducirlo.
    sheets = d / "sheets"
    shutil.rmtree(sheets, ignore_errors=True)
    sheets.mkdir()
    step = a.every
    cols, rows = 6, 4
    # select (no fps=): fps= a baja frecuencia toma fotogramas desplazados ~0,24 s; select conserva el tiempo real.
    vf = (rf"select='eq(n\,0)+gte(t-prev_selected_t\,{step}-0.001)',scale=300:-2,"
          r"drawtext=font='DejaVu Sans':fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6:x=6:y=6:"
          r"text='%{pts\:hms}',"
          f"tile={cols}x{rows}:padding=4:color=white")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(work), "-vf", vf, "-an", "-fps_mode", "vfr",
         str(sheets / "sheet_%02d.jpg")])
    res["sheets"] = sorted(p.name for p in sheets.glob("*.jpg"))
    res["sheet_seconds_per_frame"] = step
    (d / "analysis.json").write_text(json.dumps(res, indent=2, ensure_ascii=False))

    print(f"{a.name}: {dur:.2f}s")
    if has_audio:
        print(f"  primer sonido: {res['first_sound']}s · silencios ≥{a.min_silence}s: {len(res['silences'])}")
        if "loudness" in res:
            print(f"  sonoridad: {res['loudness']['integrated_lufs']} LUFS, pico {res['loudness']['true_peak_db']} dBTP")
    print(f"  cambios de plano: {res['scene_changes'] or 'ninguno'}")
    print(f"  hojas: {len(res['sheets'])} en {sheets.relative_to(ROOT)} (1 fotograma cada {step}s)")


# ---------------------------------------------------------------- transcribe
def cmd_transcribe(a):
    d = workdir(a.name)
    wav = d / "audio16k.wav"
    if not wav.exists():
        sys.exit("Este vídeo no tiene audio.")
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        sys.exit("faster-whisper no está instalado: ejecuta creative/setup.sh")
    CACHE.mkdir(parents=True, exist_ok=True)
    try:
        model = WhisperModel(a.model, device="cpu", compute_type="int8", download_root=str(CACHE))
    except Exception as e:  # noqa: BLE001
        sys.exit(f"No se pudo cargar el modelo '{a.model}': {type(e).__name__}: {str(e)[:300]}\n"
                 "Si es un 403, la red no permite huggingface.co / *.hf.co (ver creative/README.md).")
    t0 = dt.datetime.now()
    segments, info = model.transcribe(str(wav), language=a.lang, word_timestamps=True, vad_filter=True, beam_size=5)
    words, segs = [], []
    for s in segments:
        segs.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip()})
        for w in s.words or []:
            words.append({"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3),
                          "p": round(w.probability, 3)})
    out = {"model": a.model, "language": info.language, "duration": round(info.duration, 3),
           "segments": segs, "words": words}
    (d / "transcript.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    (d / "transcript.srt").write_text(to_srt(segs))
    secs = (dt.datetime.now() - t0).total_seconds()
    dudosas = [w["text"] for w in words if w["p"] < 0.5]
    print(f"{a.name}: {len(words)} palabras, {len(segs)} frases en {secs:.1f}s (modelo {a.model})")
    print("  " + " ".join(s["text"] for s in segs)[:600])
    if dudosas:
        print(f"  palabras dudosas (p<0.5), revisar: {', '.join(dudosas[:20])}")


def to_srt(segs: list[dict]) -> str:
    def ts(t: float) -> str:
        ms = int(round(t * 1000))
        return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    return "\n".join(f"{i}\n{ts(s['start'])} --> {ts(s['end'])}\n{s['text']}\n" for i, s in enumerate(segs, 1))


# ---------------------------------------------------------------- cuts
def cmd_cuts(a):
    d = workdir(a.name)
    dur = duration(d / "work.mp4")
    tpath = d / "transcript.json"
    if tpath.exists():
        words = json.loads(tpath.read_text())["words"]
        speech = [(w["start"], w["end"]) for w in words]
        source = "transcript"
    else:
        an = d / "analysis.json"
        if not an.exists():
            sys.exit("Necesito transcript.json o analysis.json (lab analyze).")
        sil = json.loads(an.read_text()).get("silences", [])
        speech, cur = [], 0.0
        for s in sil:
            if s["start"] > cur:
                speech.append((cur, s["start"]))
            cur = s["end"]
        if cur < dur:
            speech.append((cur, dur))
        words, source = [], "silencedetect"
    if not speech:
        sys.exit("No se detecta voz ni sonido.")

    # Une tramos separados por pausas cortas y añade un margen para no cortar sílabas.
    keep: list[list[float]] = []
    for s, e in speech:
        s, e = max(0.0, s - a.pad), min(dur, e + a.pad)
        if keep and s - keep[-1][1] <= a.max_gap:
            keep[-1][1] = max(keep[-1][1], e)
        else:
            keep.append([s, e])
    keep = [[round(s, 3), round(e, 3)] for s, e in keep if e - s >= 0.2]

    # Palabras en la línea de tiempo FINAL (después de quitar los huecos).
    remapped, offset = [], 0.0
    for s, e in keep:
        for w in words:
            if w["start"] >= s and w["end"] <= e + 0.01:
                remapped.append({"text": w["text"], "start": round(offset + w["start"] - s, 3),
                                 "end": round(offset + w["end"] - s, 3)})
        offset += e - s
    out = {"source": source, "original_duration": round(dur, 3), "edited_duration": round(offset, 3),
           "keep": keep, "segments": [{"type": "video", "src": f"01_intermedio/{a.name}/work.mp4", "from": s, "to": e}
                                      for s, e in keep],
           "words": remapped}
    (d / "cuts.json").write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"{a.name}: {dur:.2f}s → {offset:.2f}s ({dur - offset:.2f}s de silencio fuera) en {len(keep)} tramos [{source}]")
    for s, e in keep:
        print(f"  conservar {s:7.2f} → {e:7.2f}")
    print(f"  → {(d / 'cuts.json').relative_to(ROOT)}: copia 'segments' y 'words' a las props del anuncio")


# ---------------------------------------------------------------- check
TEXT_KEYS = {"text", "sub", "debugLabel"}


def iter_texts(node, path=""):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == "words" and isinstance(v, list):
                yield f"{path}.words", " ".join(w.get("text", "") for w in v)
            elif k in TEXT_KEYS and isinstance(v, str):
                yield f"{path}.{k}", v
            else:
                yield from iter_texts(v, f"{path}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from iter_texts(v, f"{path}[{i}]")


def check_props(path: Path) -> tuple[list[str], list[str]]:
    props = json.loads(path.read_text())
    rules = json.loads((CONFIG / "claims.json").read_text())["reglas"]
    errors, warns = [], []
    for where, text in iter_texts(props):
        for r in rules:
            for m in re.finditer(r["patron"], text, re.I):
                msg = f"{where}: «{m.group(0)}» → {r['motivo']}"
                (errors if r["nivel"] == "error" else warns).append(msg)

    if path.stem != props.get("id"):
        errors.append(f"El archivo se llama {path.stem} pero id = {props.get('id')}: deben coincidir")
    total = 0.0
    for i, s in enumerate(props.get("segments", [])):
        f = MEDIA / s["src"]
        if not f.exists():
            errors.append(f"segments[{i}].src no existe: media/{s['src']}")
        if s["type"] == "video":
            if s["to"] <= s["from"]:
                errors.append(f"segments[{i}]: to ≤ from")
            elif f.exists() and s["to"] > duration(f) + 0.05:
                errors.append(f"segments[{i}].to={s['to']} supera la duración del clip")
            total += s["to"] - s["from"]
        else:
            total += s["duration"]
    if total <= 0:
        errors.append("No hay segmentos")
    for key in ("hook", "cta"):
        b = props.get(key)
        if b and b["start"] >= total:
            errors.append(f"{key} empieza después del final ({total:.2f}s)")
    if not props.get("hook"):
        warns.append("Sin hook de texto (válido si el hook es solo visual)")
    elif props["hook"]["start"] > 0.3:
        warns.append("El hook de texto no aparece en el primer instante")
    if not props.get("cta"):
        warns.append("Sin CTA")
    for src in [props.get("music", {}).get("src")] + [s["src"] for s in props.get("sfx", [])]:
        if src and not (MEDIA / src).exists():
            errors.append(f"audio no existe: media/{src}")
    return errors, warns + [f"(duración calculada: {total:.2f}s)"]


def cmd_check(a):
    errors, warns = check_props(Path(a.props))
    for w in warns:
        print(f"  AVISO  {w}")
    for e in errors:
        print(f"  ERROR  {e}")
    print("OK" if not errors else f"{len(errors)} errores")
    if errors:
        sys.exit(1)


# ---------------------------------------------------------------- render
def git_head(path: Path) -> str:
    """Commit en el que están las props; marca si el archivo tiene cambios sin commit (no reconstruible aún)."""
    try:
        head = run(["git", "-C", str(ROOT), "rev-parse", "--short", "HEAD"]).stdout.strip()
        dirty = run(["git", "-C", str(ROOT), "status", "--porcelain", "--", str(path)]).stdout.strip()
        return f"{head}+SIN-COMMIT" if dirty else head
    except Exception:  # noqa: BLE001
        return "NO DISPONIBLE"


def cmd_render(a):
    path = Path(a.props).resolve()
    errors, warns = check_props(path)
    for w in warns:
        print(f"  AVISO  {w}")
    if errors:
        for e in errors:
            print(f"  ERROR  {e}")
        sys.exit("Render bloqueado: corrige los errores (reglas GARELON / props).")
    props = json.loads(path.read_text())
    ad_id = props["id"]
    RENDERS.mkdir(parents=True, exist_ok=True)
    FINAL.mkdir(parents=True, exist_ok=True)
    raw = RENDERS / f"{ad_id}.mp4"
    t0 = dt.datetime.now()
    cmd = ["npx", "remotion", "render", "src/index.ts", "AdVertical", str(raw), f"--props={path}",
           f"--public-dir={MEDIA}", "--enforce-audio-track", "--log=error"]
    if a.concurrency:
        cmd.append(f"--concurrency={a.concurrency}")
    subprocess.run(cmd, cwd=REMOTION, check=True)
    secs = (dt.datetime.now() - t0).total_seconds()

    final = FINAL / f"{ad_id}.mp4"
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw), "-c:v", "copy",
         "-af", LOUDNESS, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", str(final)])
    print(f"render {secs:.1f}s → {final.relative_to(ROOT)}")
    qa(final, props.get("platform", "universal"), props)

    sources = sorted({s["src"] for s in props["segments"]})
    row = {"fecha": dt.datetime.now().isoformat(timespec="seconds"), "id": ad_id,
           "archivo": f"media/03_finales/{final.name}", "sha256": sha256(final),
           "duracion_s": f"{duration(final):.2f}", "plataforma": props.get("platform", "universal"),
           "props": str(path.relative_to(ROOT)), "commit_props": git_head(path), "fuentes": " ".join(sources)}
    new = not MANIFEST.exists()
    with MANIFEST.open("a", newline="") as fh:
        wr = csv.DictWriter(fh, fieldnames=list(row))
        if new:
            wr.writeheader()
        wr.writerow(row)
    print(f"manifest: {MANIFEST.relative_to(ROOT)} (+1 fila)")


# ---------------------------------------------------------------- qa
def qa(path: Path, platform: str = "universal", props: dict | None = None):
    info = probe(path)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    au = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
    dur = float(info["format"]["duration"])
    checks = [
        ("1080x1920", f"{v['width']}x{v['height']}" == "1080x1920", f"{v['width']}x{v['height']}"),
        ("H.264", v["codec_name"] == "h264", v["codec_name"]),
        ("yuv420p · rango TV · BT.709", v.get("pix_fmt") == "yuv420p" and v.get("color_range") == "tv"
         and v.get("color_space") == "bt709", f"{v.get('pix_fmt')} · {v.get('color_range')} · {v.get('color_space')}"),
        ("30 fps", v["r_frame_rate"] in ("30/1", "30000/1001"), v["r_frame_rate"]),
        ("audio AAC", bool(au) and au["codec_name"] == "aac", au["codec_name"] if au else "sin audio"),
        ("audio = vídeo", bool(au) and abs(float(au.get("duration", 0)) - float(v.get("duration", 0))) < 0.05,
         f"{au.get('duration') if au else '-'} / {v.get('duration')} s"),
        ("tamaño", True, f"{os.path.getsize(path) / 1e6:.1f} MB · {dur:.2f}s · {int(info['format']['bit_rate']) // 1000} kb/s"),
    ]
    log = ffmpeg_log(["-i", str(path), "-af", "loudnorm=print_format=json", "-vn", "-f", "null", "-"])
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", log, re.S)
    if m:
        ln = json.loads(m.group(0))
        checks.append(("sonoridad", True, f"{ln['input_i']} LUFS, pico {ln['input_tp']} dBTP (objetivo ≈ -14 LUFS)"))
    for name, ok, val in checks:
        print(f"  {'✔' if ok else '✘'} {name}: {val}")

    # Fotogramas clave con la zona segura dibujada.
    z = json.loads((CONFIG / "safe-zones.json").read_text())[platform]
    times = [0.4]
    if props and props.get("hook"):
        times.append(min(props["hook"]["end"] - 0.3, dur - 0.1))
    times.append(dur / 2)
    if props and props.get("cta"):
        times.append(min(props["cta"]["start"] + 0.8, dur - 0.1))
    times.append(max(0, dur - 0.15))
    times = sorted({round(t, 2) for t in times if 0 <= t < dur})
    if len(times) < 2:
        times = [0.0, round(max(0.0, dur - 0.05), 2)]
    qa_dir = path.parent / "qa"
    qa_dir.mkdir(exist_ok=True)
    box = (f"drawbox=x={z['left']}:y={z['top']}:w={1080 - z['left'] - z['right']}:h={1920 - z['top'] - z['bottom']}"
           ":color=red@0.9:t=6")
    inputs, filt = [], []
    for i, t in enumerate(times):
        inputs += ["-ss", str(t), "-i", str(path)]
        filt.append(f"[{i}:v]trim=end_frame=1,{box},scale=360:-2,"
                    f"drawtext=font='DejaVu Sans':fontsize=26:fontcolor=white:box=1:boxcolor=black@0.7:x=8:y=8:text='{t}s'[f{i}]")
    filt.append("".join(f"[f{i}]" for i in range(len(times))) + f"hstack=inputs={len(times)}")
    sheet = qa_dir / f"{path.stem}_qa.jpg"
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(filt),
         "-frames:v", "1", str(sheet)])
    print(f"  fotogramas QA ({', '.join(f'{t}s' for t in times)}): {sheet.relative_to(ROOT)}")


def cmd_qa(a):
    qa(Path(a.file).resolve(), a.platform)


# ---------------------------------------------------------------- main
def main():
    p = argparse.ArgumentParser(prog="lab", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("ingest"); s.add_argument("file"); s.add_argument("--name", required=True); s.set_defaults(fn=cmd_ingest)
    s = sub.add_parser("analyze"); s.add_argument("name")
    s.add_argument("--noise", type=float, default=-35, help="umbral de silencio en dB (def. -35)")
    s.add_argument("--min-silence", type=float, default=0.35, help="silencio mínimo en s (def. 0.35)")
    s.add_argument("--scene", type=float, default=10, help="sensibilidad de cambio de plano scdet (def. 10)")
    s.add_argument("--every", type=float, default=0.5, help="segundos entre fotogramas de la hoja (def. 0.5)")
    s.set_defaults(fn=cmd_analyze)
    s = sub.add_parser("transcribe"); s.add_argument("name")
    s.add_argument("--model", default="large-v3-turbo", help="small | medium | large-v3-turbo (def.) | large-v3")
    s.add_argument("--lang", default="es"); s.set_defaults(fn=cmd_transcribe)
    s = sub.add_parser("cuts"); s.add_argument("name")
    s.add_argument("--max-gap", type=float, default=0.3, help="pausa máxima que se conserva (s)")
    s.add_argument("--pad", type=float, default=0.08, help="margen alrededor de cada tramo (s)")
    s.set_defaults(fn=cmd_cuts)
    s = sub.add_parser("check"); s.add_argument("props"); s.set_defaults(fn=cmd_check)
    s = sub.add_parser("render"); s.add_argument("props"); s.add_argument("--concurrency", type=int)
    s.set_defaults(fn=cmd_render)
    s = sub.add_parser("qa"); s.add_argument("file"); s.add_argument("--platform", default="universal")
    s.set_defaults(fn=cmd_qa)

    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
