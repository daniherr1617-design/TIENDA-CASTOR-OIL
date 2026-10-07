#!/usr/bin/env python3
"""GARELON Creative Lab: herramienta única para el flujo de vídeo.

  lab ingest <archivo> --name NOMBRE --origen ia|real|proveedor|editado-ia [--herramienta X]
                                       copia el original (solo lectura + SHA-256 + origen) y prepara la copia de trabajo
  lab analyze NOMBRE                   silencios, cambios de plano, sonoridad, hojas de fotogramas y tira del hook (0-3 s)
  lab fidelity NOMBRE --ref IMG …      referencias del producto junto a fotogramas del vídeo (revisión de fidelidad)
  lab transcribe NOMBRE                transcripción local con faster-whisper (tiempos por palabra)
  lab cuts NOMBRE                      propone cortes sin silencios y reubica las palabras en la línea final
  lab check props/ID.json              claims prohibidos + coherencia de las props
  lab pack props/ID.json               crea packs/ID.md (copy, descripciones, hashtags, hipótesis) a partir de las props
  lab check packs/ID.md [--final]      claims + límites de cada plataforma + hashtags + etiqueta IA
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
PACKS = ROOT / "packs"
ORIGINS = {"ia": "generado con IA", "real": "grabación o foto real propia", "proveedor": "material del proveedor",
           "editado-ia": "real retocado con IA"}

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
    # Origen del material: decide la etiqueta de IA (TikTok, Meta, Ley de IA art. 50) y el nivel de revisión de fidelidad.
    meta = {"nombre": a.name, "archivo": dst.name, "origen": a.origen, "herramienta": a.herramienta or "",
            "ingestado": dt.datetime.now().isoformat(timespec="seconds"), "sha256": digest}
    (ORIG / f"{a.name}.origen.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n")
    print(f"  origen: {ORIGINS[a.origen]}{' (' + a.herramienta + ')' if a.herramienta else ''}")
    if a.origen in ("ia", "editado-ia"):
        print("  ⚠ material con IA: revisar fidelidad (lab fidelity) y activar la etiqueta de IA al publicar")

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
    # Tira del hook: 0-3 s cada 0,25 s, donde se decide si el scroll se para.
    hook_end = min(3.0, dur)
    # Un fotograma por cada cuarto de segundo (a 30 fps 0,25 s no es un número entero de fotogramas).
    vf = (rf"trim=end={hook_end},select='isnan(prev_t)+gt(floor((t+0.001)*4)\,floor((prev_t+0.001)*4))',scale=270:-2,"
          r"drawtext=font='DejaVu Sans':fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6:x=6:y=6:"
          r"text='%{pts\:hms}',"
          "tile=6x2:padding=4:color=white")
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(work), "-vf", vf, "-an", "-fps_mode", "vfr",
         "-frames:v", "1", str(sheets / "hook_0-3s.jpg")])
    res["sheets"] = sorted(p.name for p in sheets.glob("sheet_*.jpg"))
    res["hook_sheet"] = "hook_0-3s.jpg"
    res["sheet_seconds_per_frame"] = step
    (d / "analysis.json").write_text(json.dumps(res, indent=2, ensure_ascii=False))

    print(f"{a.name}: {dur:.2f}s")
    if has_audio:
        print(f"  primer sonido: {res['first_sound']}s · silencios ≥{a.min_silence}s: {len(res['silences'])}")
        if "loudness" in res:
            print(f"  sonoridad: {res['loudness']['integrated_lufs']} LUFS, pico {res['loudness']['true_peak_db']} dBTP")
    print(f"  cambios de plano: {res['scene_changes'] or 'ninguno'}")
    print(f"  hojas: {len(res['sheets'])} en {sheets.relative_to(ROOT)} (1 fotograma cada {step}s) + hook_0-3s.jpg")


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
    path = Path(a.props)
    info = []
    if path.suffix == ".md":
        errors, warns, info = check_pack(path, a.final)
    else:
        errors, warns = check_props(path)
    for i in info:
        print(f"  INFO   {i}")
    for w in warns:
        print(f"  AVISO  {w}")
    for e in errors:
        print(f"  ERROR  {e}")
    print("OK" if not errors else f"{len(errors)} errores")
    if errors:
        sys.exit(1)


# ---------------------------------------------------------------- fidelity
def cmd_fidelity(a):
    """Referencias aprobadas del producto arriba y fotogramas del vídeo abajo, en una sola imagen.

    Sirve para avisar si un vídeo (sobre todo generado con IA) cambia forma, piezas, colores o materiales.
    """
    d = workdir(a.name)
    work = d / "work.mp4"
    dur = duration(work)
    refs = []
    for r in a.ref:
        f = Path(r)
        if not f.exists():
            hits = sorted(ORIG.glob(f"{r}.*"))
            hits = [h for h in hits if h.suffix.lower() in IMAGE_EXT]
            f = hits[0] if hits else f
        if not f.exists():
            sys.exit(f"No encuentro la referencia {r} (ruta o nombre en 00_originales)")
        refs.append(f)
    refs = refs[:4]
    n = a.frames
    times = [round(dur * (i + 0.5) / n, 2) for i in range(n)]
    cell = "scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2:color=white"
    label = "drawtext=font='DejaVu Sans':fontsize=24:fontcolor=white:box=1:boxcolor=black@0.7:x=6:y=6:text="
    inputs, filt = [], []
    for i, f in enumerate(refs):
        inputs += ["-i", str(f)]
        filt.append(f"[{i}:v]{cell},{label}'REF {i + 1}'[r{i}]")
    for j, tt in enumerate(times):
        k = len(refs) + j
        inputs += ["-ss", str(tt), "-i", str(work)]
        filt.append(f"[{k}:v]trim=end_frame=1,{cell},{label}'{tt}s'[v{j}]")
    row = "".join(f"[r{i}]" for i in range(len(refs)))
    filt.append(f"{row}hstack=inputs={len(refs)},pad=1080:480:0:0:color=0x2A2622[refs]" if len(refs) > 1
                else "[r0]pad=1080:480:0:0:color=0x2A2622[refs]")
    rows = []
    for rix in range(0, n, 4):
        ids = list(range(rix, min(rix + 4, n)))
        name = f"fr{rix}"
        src = "".join(f"[v{j}]" for j in ids)
        filt.append(f"{src}hstack=inputs={len(ids)},pad=1080:480:0:0:color=white[{name}]" if len(ids) > 1
                    else f"{src}pad=1080:480:0:0:color=white[{name}]")
        rows.append(f"[{name}]")
    filt.append(f"[refs]{''.join(rows)}vstack=inputs={1 + len(rows)}")
    out = d / "sheets" / "fidelidad.jpg"
    out.parent.mkdir(exist_ok=True)
    run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", ";".join(filt),
         "-frames:v", "1", str(out)])
    print(f"{a.name}: {len(refs)} referencias + {n} fotogramas ({', '.join(f'{x}s' for x in times)})")
    print(f"  → {out.relative_to(ROOT)}: comparar forma, piezas, colores, medalla, cruz, cierre y escala")


# ---------------------------------------------------------------- pack
PACK_TEMPLATE = """# {id}

| Campo | Valor |
|---|---|
| Vídeo | `media/03_finales/{id}.mp4` |
| Ángulo | PENDIENTE |
| Variable que probamos | {variable} |
| Control | PENDIENTE (ID del anuncio con el que se compara) |
| Hipótesis | PENDIENTE (qué métrica debería mejorar y por qué) |
| Métrica de decisión | PENDIENTE (hook rate · hold · CTR de enlace · CVR…) |
| Plataformas | PENDIENTE (TikTok orgánico · TikTok Ads · Instagram Reels · Meta Ads · YouTube Shorts) |
| Origen del material | {origen} |
| Etiqueta IA | {etiqueta} |
| Estado | borrador |

## Hook

{hook}

## Texto del vídeo

{texto}

## CTA

{cta}

## TikTok orgánico

**Descripción:** PENDIENTE (palabra clave que buscaría el cliente en los primeros 100 caracteres)
**Hashtags:** PENDIENTE (3-5)

## TikTok Ads

**Texto del anuncio:** PENDIENTE (máx. 100 caracteres; en Spark Ads se usa la descripción del post orgánico)

## Instagram Reels

**Descripción:** PENDIENTE (lo importante en los primeros ~125 caracteres)
**Hashtags:** PENDIENTE (máx. 5 entre descripción y primer comentario)

## Meta Ads

**Texto principal:** PENDIENTE (~125 caracteres visibles en el feed; en Reels se ve menos)
**Título:** PENDIENTE (≤27 recomendado, 40 máx.)
**Descripción:** PENDIENTE (≤27 recomendado, 30 máx.)

## YouTube Shorts

**Título:** PENDIENTE (máx. 100)
**Descripción:** PENDIENTE
**Hashtags:** PENDIENTE (3-5; se muestran 3 junto al título)

## Comentario fijado

PENDIENTE

## Respuestas a comentarios

PENDIENTE (preguntas previsibles → respuesta fiel a lo confirmado; lo no confirmado se responde «lo comprobamos y te decimos», sin inventar)

## Variantes de descripción

PENDIENTE (cada variante cambia una sola cosa: ángulo, primera frase o CTA)

## Hashtags: por qué

PENDIENTE (los principales, una línea cada uno: nicho · producto · intención · tendencia · amplio)

## Antes de publicar

- [ ] Precio y envío del copy = Shopify el día de publicación
- [ ] Etiqueta IA: {etiqueta_corta}
- [ ] Mejoras automáticas con IA desactivadas (Advantage+ Creative en Meta, Smart+ Creative en TikTok) y vista previa revisada en cada ubicación
- [ ] Nombre del anuncio en la plataforma = `{id}`
- [ ] Música de la biblioteca comercial de la plataforma o con licencia
- [ ] Ninguna persona generada con IA presentada como cliente real ni dando testimonio

## Notas internas

(No se revisa con `lab check`.)
"""


def origin_of(src: str) -> dict | None:
    parts = Path(src).parts
    name = parts[1] if parts[0] == "01_intermedio" else Path(src).stem
    f = ORIG / f"{name}.origen.json"
    return json.loads(f.read_text()) if f.exists() else {"nombre": name, "origen": None}


def cmd_pack(a):
    path = Path(a.props).resolve()
    props = json.loads(path.read_text())
    ad_id = props["id"]
    PACKS.mkdir(exist_ok=True)
    out = PACKS / f"{ad_id}.md"
    if out.exists() and not a.force:
        sys.exit(f"{out.relative_to(ROOT)} ya existe (usa --force para regenerarlo desde las props)")
    srcs = sorted({s["src"] for s in props["segments"]})
    origins = [origin_of(s) for s in srcs]
    lines, uses_ai, unknown = [], False, False
    for o in origins:
        if o["origen"] is None:
            unknown = True
            lines.append(f"{o['nombre']}: NO REGISTRADO")
        else:
            uses_ai |= o["origen"] in ("ia", "editado-ia")
            lines.append(f"{o['nombre']}: {o['origen']}{' (' + o['herramienta'] + ')' if o.get('herramienta') else ''}")
    if uses_ai:
        etiqueta = "SÍ (material generado o retocado con IA)"
        corta = "activar «contenido generado por IA» en TikTok; revisar «Información de IA» en Meta"
    elif unknown:
        etiqueta = "PENDIENTE (hay material sin origen registrado)"
        corta = "decidir cuando se conozca el origen de todo el material"
    else:
        etiqueta = "NO (sin material generado con IA)"
        corta = "no aplica"
    m = re.match(r"^[A-Z0-9]+_AD\d+_([A-Z0-9]+)-([A-Z0-9-]+)_V\d+$", ad_id)
    variable = f"{m.group(1).capitalize()} ({m.group(2).lower()})" if m else "PENDIENTE"
    hook = props.get("hook", {}).get("text") or "PENDIENTE (hook visual: describir el primer plano)"
    texts = [o["text"] for o in props.get("overlays", [])]
    words = props.get("captions", {}).get("words", [])
    if words:
        texts.append("Subtítulos: " + " ".join(w["text"] for w in words))
    cta = props.get("cta")
    out.write_text(PACK_TEMPLATE.format(
        id=ad_id, variable=variable, origen=" · ".join(lines), etiqueta=etiqueta, etiqueta_corta=corta, hook=hook,
        texto="\n".join(f"- {x}" for x in texts) or "PENDIENTE",
        cta=f"{cta['text']}" + (f" · {cta['sub']}" if cta.get("sub") else "") if cta else "PENDIENTE"))
    print(f"+ {out.relative_to(ROOT)}  (origen: {' · '.join(lines)})")
    print("  Rellenar los PENDIENTE y validar con: lab check " + str(out.relative_to(ROOT)) + " --final")


INTERNAL_SECTIONS = ("Hashtags: por qué", "Antes de publicar", "Notas internas")
HASHTAG_RE = re.compile(r"#[^\s#.,;:!?¿¡()]+")


def check_pack(path: Path, final: bool) -> tuple[list[str], list[str], list[str]]:
    text = path.read_text()
    rules = json.loads((CONFIG / "claims.json").read_text())["reglas"]
    plat = json.loads((CONFIG / "platforms.json").read_text())
    errors, warns, info = [], [], []
    parts = re.split(r"^## ", text, flags=re.M)
    head, secs = parts[0], {p.splitlines()[0].strip(): p.split("\n", 1)[1] if "\n" in p else "" for p in parts[1:]}
    table = {k.strip(): v.strip() for k, v in re.findall(r"^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|\s*$", head, flags=re.M)}

    if not head.startswith(f"# {path.stem}"):
        errors.append(f"El título debe ser «# {path.stem}» (= nombre del archivo y del anuncio)")
    for k in ("Vídeo", "Ángulo", "Variable que probamos", "Hipótesis", "Origen del material", "Etiqueta IA"):
        if k not in table:
            errors.append(f"Falta la fila «{k}» en la tabla")
    if re.search(r"\b(ia|editado-ia)\b", table.get("Origen del material", ""), re.I) and \
            not table.get("Etiqueta IA", "").upper().startswith(("SÍ", "SI")):
        errors.append("Hay material con IA y «Etiqueta IA» no es SÍ (TikTok y Meta lo exigen; Ley de IA art. 50)")
    if "NO REGISTRADO" in table.get("Origen del material", ""):
        (errors if final else warns).append("Origen del material NO REGISTRADO: no se puede decidir la etiqueta de IA")
    if not (FINAL / f"{path.stem}.mp4").exists():
        warns.append(f"No está media/03_finales/{path.stem}.mp4 en este contenedor (normal si es otra sesión)")

    pend = [k for k, v in table.items() if "PENDIENTE" in v] + \
           [s for s, body in secs.items() if s != "Notas internas" and "PENDIENTE" in body]
    if pend:
        (errors if final else warns).append(f"Por completar: {', '.join(pend)}")

    for name, body in secs.items():
        if name in INTERNAL_SECTIONS:
            continue
        for r in rules:
            for m in re.finditer(r["patron"], body, re.I):
                msg = f"{name}: «{m.group(0)}» → {r['motivo']}"
                (errors if r["nivel"] == "error" else warns).append(msg)

    why = secs.get("Hashtags: por qué", "").lower()
    for name, spec in plat["secciones"].items():
        body = secs.get(name)
        if body is None:
            continue
        fields = {}
        for m in re.finditer(r"^\*\*(.+?):\*\*[ \t]*(.*?)(?=^\*\*.+?:\*\*|\Z)", body, flags=re.M | re.S):
            fields[m.group(1).strip()] = m.group(2).strip()
        for fname, lim in spec.get("campos", {}).items():
            val = fields.get(fname)
            if val is None:
                errors.append(f"{name}: falta el campo **{fname}:**")
                continue
            if "PENDIENTE" in val:
                continue
            full = val + (" " + fields["Hashtags"] if fname == spec.get("hashtags_en") and fields.get("Hashtags") else "")
            n = len(full)
            if lim.get("max") and n > lim["max"]:
                errors.append(f"{name} · {fname}: {n} caracteres (máx. {lim['max']})")
            elif lim.get("recomendado") and n > lim["recomendado"]:
                warns.append(f"{name} · {fname}: {n} caracteres (recomendado ≤{lim['recomendado']}; se puede cortar)")
            if lim.get("visible") and n > lim["visible"]:
                info.append(f"{name} · {fname}: se ven ~{lim['visible']} de {n} caracteres antes de «más»")
        hs_spec = spec.get("hashtags")
        tags = [h for v in fields.values() if "PENDIENTE" not in v for h in HASHTAG_RE.findall(v)]
        raw = fields.get("Hashtags", "")
        if raw and "PENDIENTE" not in raw:
            bad = [w for w in raw.split() if not w.startswith("#")]
            if bad:
                errors.append(f"{name}: en **Hashtags:** solo hashtags sin espacios (sobra: {' '.join(bad[:5])})")
        if not hs_spec:
            if tags:
                warns.append(f"{name}: lleva hashtags ({' '.join(tags[:5])}); en este formato no aportan")
            continue
        low = [h.lower() for h in tags]
        if len(set(low)) < len(low):
            warns.append(f"{name}: hashtags repetidos")
        if hs_spec.get("max") and len(tags) > hs_spec["max"]:
            errors.append(f"{name}: {len(tags)} hashtags (máx. {hs_spec['max']}: {hs_spec.get('motivo', '')})")
        lo, hi = hs_spec.get("recomendado", [0, 99])
        if tags and not lo <= len(tags) <= hi and not (hs_spec.get("max") and len(tags) > hs_spec["max"]):
            warns.append(f"{name}: {len(tags)} hashtags (recomendado {lo}-{hi})")
        for h in tags:
            if h[1:].lower() in plat["hashtags_genericos"] and h.lower() not in why:
                warns.append(f"{name}: {h} es genérico; úsalo solo si «Hashtags: por qué» explica qué aporta")
    return errors, warns, info



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

    s = sub.add_parser("ingest"); s.add_argument("file"); s.add_argument("--name", required=True)
    s.add_argument("--origen", required=True, choices=list(ORIGINS), help="ia · real · proveedor · editado-ia")
    s.add_argument("--herramienta", help="p. ej. Higgsfield (si es IA)"); s.set_defaults(fn=cmd_ingest)
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
    s = sub.add_parser("fidelity"); s.add_argument("name")
    s.add_argument("--ref", nargs="+", required=True, help="imágenes aprobadas del producto (ruta o nombre en 00_originales)")
    s.add_argument("--frames", type=int, default=8); s.set_defaults(fn=cmd_fidelity)
    s = sub.add_parser("check"); s.add_argument("props", help="props/ID.json o packs/ID.md")
    s.add_argument("--final", action="store_true", help="pack: los PENDIENTE pasan a ser errores")
    s.set_defaults(fn=cmd_check)
    s = sub.add_parser("pack"); s.add_argument("props"); s.add_argument("--force", action="store_true")
    s.set_defaults(fn=cmd_pack)
    s = sub.add_parser("render"); s.add_argument("props"); s.add_argument("--concurrency", type=int)
    s.set_defaults(fn=cmd_render)
    s = sub.add_parser("qa"); s.add_argument("file"); s.add_argument("--platform", default="universal")
    s.set_defaults(fn=cmd_qa)

    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
