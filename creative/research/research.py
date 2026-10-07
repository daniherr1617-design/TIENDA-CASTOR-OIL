#!/usr/bin/env python3
"""Utilidades de la investigación semanal (solo lectura/escritura de archivos locales; sin red).

  research.py window                      ventana de búsqueda: desde la última ejecución correcta hasta hoy
  research.py check  reports/AAAA-MM-DD.md   valida la estructura del informe
  research.py register reports/AAAA-MM-DD.md --tipo programada|manual --consultas N [--limitaciones "..."] [--errores "..."]
                                          anota la ejecución en runs.csv y las fuentes nuevas en seen-urls.txt
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import re
import subprocess
import sys
from pathlib import Path
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
RUNS = HERE / "runs.csv"
SEEN = HERE / "seen-urls.txt"
KNOWLEDGE = HERE / "marketing-current-knowledge.md"
SECTIONS = [
    "1. Novedades importantes", "2. Impacto para GARELON", "3. TikTok", "4. Meta", "5. Creatividad",
    "6. IA y automatización", "7. Recomendaciones", "8. Tests propuestos", "9. Fuentes",
]
EMOJIS = ("🔴", "🟠", "🟢", "⚪")
URL_RE = re.compile(r"https?://[^\s)>\]]+")
DATE_RE = re.compile(r"\b20\d\d-\d\d-\d\d\b")
BASELINE_DAYS = 30
TZ = ZoneInfo("Europe/Madrid")


def runs() -> list[dict]:
    if not RUNS.exists():
        return []
    with RUNS.open() as fh:
        return list(csv.DictReader(fh))


def seen() -> set[str]:
    if not SEEN.exists():
        return set()
    return {line.split()[0] for line in SEEN.read_text().splitlines() if line.strip()}


def norm_url(u: str) -> str:
    return u.rstrip(".,;:").split("#")[0].rstrip("/")


def cmd_window(_a):
    ok = [r for r in runs() if r["estado"] == "ok"]
    today = dt.datetime.now(TZ).date()
    if ok:
        since = max(dt.date.fromisoformat(r["ventana_hasta"]) for r in ok)
        print(f"{since.isoformat()} {today.isoformat()} (desde la última ejecución correcta)")
    else:
        since = today - dt.timedelta(days=BASELINE_DAYS)
        print(f"{since.isoformat()} {today.isoformat()} (primera ejecución: línea base de {BASELINE_DAYS} días)")


def split_sections(text: str) -> dict[str, str]:
    parts = re.split(r"^## ", text, flags=re.M)
    return {p.splitlines()[0].strip(): p for p in parts[1:]}


def check(path: Path) -> tuple[list[str], list[str], dict]:
    text = path.read_text()
    errors, warns = [], []
    secs = split_sections(text)
    for s in SECTIONS:
        if s not in secs:
            errors.append(f"Falta la sección «## {s}»")
    for key in ("**Ejecución:**", "**Ventana:**", "**Consultas realizadas:**", "**Limitaciones y errores:**"):
        if key not in text.split("## ")[0]:
            errors.append(f"Falta {key} en la cabecera")

    nov = secs.get(SECTIONS[0], "")
    items = re.findall(r"^### (.+)$", nov, flags=re.M)
    if not items:
        warns.append("Sin novedades en la sección 1 (válido si la semana no trajo nada relevante; debe decirlo)")
    counts = {e: 0 for e in EMOJIS}
    for blocks in re.split(r"^### ", nov, flags=re.M)[1:]:
        title = blocks.splitlines()[0]
        if not title.startswith(EMOJIS):
            errors.append(f"Novedad sin clasificación 🔴🟠🟢⚪: «{title[:60]}»")
        else:
            counts[title[0]] += 1
        if not DATE_RE.search(title) and "fecha no confirmada" not in title.lower():
            errors.append(f"Novedad sin fecha (AAAA-MM-DD o «fecha no confirmada»): «{title[:60]}»")
        if not URL_RE.search(blocks):
            errors.append(f"Novedad sin URL de fuente: «{title[:60]}»")
        if not re.search(r"OFICIAL|ESTUDIO|MEDIO|AGREGADOR|COMUNIDAD", blocks):
            errors.append(f"Novedad sin nivel de evidencia: «{title[:60]}»")

    recs = re.findall(r"^\d+\.\s", secs.get(SECTIONS[6], "").split("\n", 1)[-1], flags=re.M)  # sin el título
    if len(recs) > 5:
        errors.append(f"Recomendaciones: {len(recs)} (máximo 5)")

    src = secs.get(SECTIONS[8], "")
    src_urls = {norm_url(u) for u in URL_RE.findall(src)}
    for line in src.splitlines():
        if URL_RE.search(line) and not (DATE_RE.search(line) or "fecha no indicada" in line.lower()):
            errors.append(f"Fuente sin fecha de publicación: {line.strip()[:90]}")
    body_urls = {norm_url(u) for s in SECTIONS[:8] for u in URL_RE.findall(secs.get(s, ""))}
    for u in sorted(body_urls - src_urls):
        warns.append(f"URL citada que no está en «9. Fuentes»: {u}")
    repeated = sorted(src_urls & seen())
    if repeated:
        warns.append(f"{len(repeated)} fuentes ya usadas en informes anteriores (solo válido si es una actualización): "
                     + ", ".join(repeated[:5]))
    stats = {"novedades": len(items), "rojas": counts["🔴"], "naranjas": counts["🟠"], "fuentes": len(src_urls),
             "urls": src_urls}
    return errors, warns, stats


def cmd_check(a):
    errors, warns, st = check(Path(a.report))
    for w in warns:
        print(f"  AVISO  {w}")
    for e in errors:
        print(f"  ERROR  {e}")
    print(f"novedades {st['novedades']} (🔴 {st['rojas']} · 🟠 {st['naranjas']}) · fuentes {st['fuentes']}")
    print("OK" if not errors else f"{len(errors)} errores")
    sys.exit(1 if errors else 0)


def knowledge_changed() -> str:
    try:
        out = subprocess.run(["git", "-C", str(HERE), "status", "--porcelain", "--", str(KNOWLEDGE)],
                             text=True, capture_output=True, check=True).stdout
        return "sí" if out.strip() else "no"
    except Exception:  # noqa: BLE001
        return "NO DISPONIBLE"


def cmd_register(a):
    path = Path(a.report).resolve()
    errors, _warns, st = check(path)
    m = re.search(r"\*\*Ventana:\*\*\s*desde (\S+) hasta (\S+)", path.read_text())
    since, until = (m.group(1), m.group(2)) if m else ("?", "?")
    # Una limitación conocida (p. ej. red) no invalida la ejecución; un error sí: la próxima ventana empezará antes.
    estado = "informe-invalido" if errors else ("con-errores" if a.errores else "ok")
    row = {
        "fecha_ejecucion": dt.datetime.now(TZ).isoformat(timespec="minutes"),
        "tipo": a.tipo, "ventana_desde": since, "ventana_hasta": until,
        "informe": str(path.relative_to(HERE)), "consultas": a.consultas, "fuentes": st["fuentes"],
        "novedades": st["novedades"], "rojas": st["rojas"], "naranjas": st["naranjas"],
        "conocimiento_actualizado": knowledge_changed(),
        "limitaciones": a.limitaciones or "ninguna",
        "errores": "; ".join(errors + ([a.errores] if a.errores else [])) or "ninguno", "estado": estado,
    }
    new = not RUNS.exists() or not RUNS.read_text().strip()
    with RUNS.open("a", newline="") as fh:
        wr = csv.DictWriter(fh, fieldnames=list(row))
        if new:
            wr.writeheader()
        wr.writerow(row)
    known = seen()
    fresh = sorted(u for u in st["urls"] if u not in known)
    with SEEN.open("a") as fh:
        for u in fresh:
            fh.write(f"{u} {path.stem}\n")
    print(f"registrado: estado={estado} · novedades={st['novedades']} · fuentes nuevas={len(fresh)}")
    if errors:
        sys.exit(1)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("window").set_defaults(fn=cmd_window)
    s = sub.add_parser("check"); s.add_argument("report"); s.set_defaults(fn=cmd_check)
    s = sub.add_parser("register"); s.add_argument("report")
    s.add_argument("--tipo", choices=["programada", "manual"], required=True)
    s.add_argument("--consultas", type=int, required=True)
    s.add_argument("--limitaciones", default="", help="limitaciones conocidas que no invalidan la ejecución")
    s.add_argument("--errores", default="", help="fallos reales: la ejecución no cuenta para la siguiente ventana")
    s.set_defaults(fn=cmd_register)
    a = p.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
