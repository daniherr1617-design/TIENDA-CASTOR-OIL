#!/usr/bin/env python3
"""Utilidades de la investigación semanal (solo lectura/escritura de archivos locales; sin red).

  research.py window                      ventana de búsqueda: desde la última ejecución correcta hasta hoy
  research.py check  reports/AAAA-MM-DD.md   valida el informe (formato, evidencia, límites) y la memoria
  research.py preflight                   antes del push: rama de investigación, solo creative/research/, sin merges
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
REPO = HERE.parent.parent
RUNS = HERE / "runs.csv"
SEEN = HERE / "seen-urls.txt"
KNOWLEDGE = HERE / "marketing-current-knowledge.md"
TZ = ZoneInfo("Europe/Madrid")
BASELINE_DAYS = 30

# La Routine solo trabaja en esta rama y solo dentro de creative/research/.
RESEARCH_BRANCH = "claude/garelon-marketing-research"
LAB_BRANCH = "claude/festive-clarke-jub9rm"  # solo lectura para la Routine (contexto del Lab)
ALLOWED_PREFIX = "creative/research/"

SECTIONS = [
    "1. Novedades", "2. Qué podemos aplicar a GARELON", "3. Qué no está suficientemente verificado",
    "4. Recomendaciones", "5. Qué merece probarse", "6. Cambios en la memoria",
    "7. Propuestas que necesitan tu aprobación", "8. Fuentes",
]
HEADER_KEYS = ("**Ejecución:**", "**Rama:**", "**Ventana:**", "**Consultas realizadas:**",
               "**Fuentes leídas completas:**", "**Limitaciones y errores:**")
# Jerarquía de evidencia: subsecciones de «1. Novedades», de más fuerte a más débil.
TIERS = ["Oficial", "Estudios y datasets", "Medios especializados", "Comunidad", "Hipótesis"]
VERIF = ["VERIFICADO EN FUENTE ORIGINAL", "FUENTE OFICIAL NO ACCESIBLE DIRECTAMENTE", "FUENTE SECUNDARIA",
         "COMUNIDAD / EXPERIENCIA DE ANUNCIANTES", "HIPÓTESIS / INTERPRETACIÓN"]
ALLOWED_VERIF = {
    "Oficial": {VERIF[0], VERIF[1]},
    "Estudios y datasets": {VERIF[0], VERIF[2]},
    "Medios especializados": {VERIF[2]},
    "Comunidad": {VERIF[3]},
    "Hipótesis": {VERIF[4]},
}
OFFICIAL_DOMAINS = (
    "tiktok.com", "facebook.com", "fb.com", "meta.com", "instagram.com", "whatsapp.com", "shopify.com",
    "shopify.dev", "google.com", "youtube.com", "blog.youtube", "europa.eu", "boe.es", "aepd.es",
    "consumo.gob.es", "remotion.dev", "github.com/SYSTRAN", "higgsfield.ai",
)
MAX_NOVEDADES = 8   # novedades con fuente (Oficial … Comunidad)
MAX_HIPOTESIS = 3
MAX_RECS = 5
MAX_TESTS = 5
EMOJIS = ("🔴", "🟠", "🟢", "⚪")
URL_RE = re.compile(r"https?://[^\s)>\]]+")
DATE_RE = re.compile(r"\b20\d\d-\d\d-\d\d\b")

K_FIELDS = ("**Tema:**", "**Fecha:**", "**Fuente:**", "**Evidencia:**", "**Estado:**", "**Impacto GARELON:**")
K_STATES = ("vigente", "dudoso")  # «obsoleto» no se queda en el cuerpo: pasa al historial


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


def git(*args: str) -> str:
    return subprocess.run(["git", "-C", str(REPO), *args], text=True, capture_output=True, check=True).stdout


def cmd_window(_a):
    ok = [r for r in runs() if r["estado"] == "ok"]
    today = dt.datetime.now(TZ).date()
    if ok:
        since = max(dt.date.fromisoformat(r["ventana_hasta"]) for r in ok)
        print(f"{since.isoformat()} {today.isoformat()} (desde la última ejecución correcta)")
    else:
        since = today - dt.timedelta(days=BASELINE_DAYS)
        print(f"{since.isoformat()} {today.isoformat()} (primera ejecución: línea base de {BASELINE_DAYS} días)")


def split_sections(text: str, level: str = "## ") -> dict[str, str]:
    parts = re.split(rf"^{level}", text, flags=re.M)
    return {p.splitlines()[0].strip(): p for p in parts[1:] if p.strip()}


def field(block: str, name: str) -> str:
    m = re.search(rf"\*\*{re.escape(name)}:\*\*\s*(.+)", block)
    return m.group(1).strip() if m else ""


def is_official(url: str) -> bool:
    host_path = re.sub(r"^https?://", "", url)
    host = host_path.split("/")[0]
    return any(host == d or host.endswith("." + d) or host_path.startswith(d) for d in OFFICIAL_DOMAINS)


def check_report(path: Path) -> tuple[list[str], list[str], dict]:
    text = path.read_text()
    errors, warns = [], []
    if "## 3. TikTok" in text and "**Rama:**" not in text:
        warns.append("Informe en formato v1 (anterior a los ajustes del 2026-10-07): no se valida")
        return errors, warns, {"novedades": 0, "rojas": 0, "naranjas": 0, "verificadas": 0, "fuentes": 0,
                               "urls": {norm_url(u) for u in URL_RE.findall(text)}}
    head = text.split("\n## ")[0]
    for key in HEADER_KEYS:
        if key not in head:
            errors.append(f"Falta {key} en la cabecera")
    rama = field(head, "Rama").strip("` ")
    if rama and rama != RESEARCH_BRANCH:
        errors.append(f"Rama «{rama}»: la investigación solo trabaja en {RESEARCH_BRANCH}")
    leidas_txt = field(head, "Fuentes leídas completas")
    leidas = {norm_url(u) for u in URL_RE.findall(leidas_txt)}

    secs = split_sections(text)
    for s in SECTIONS:
        if s not in secs:
            errors.append(f"Falta la sección «## {s}»")

    nov = secs.get(SECTIONS[0], "")
    tiers = split_sections(nov, "### ")
    for t in TIERS:
        if t not in tiers:
            errors.append(f"«1. Novedades» sin la subsección «### {t}» (si no hay nada, escribir «Nada esta semana»)")
    counts = {e: 0 for e in EMOJIS}
    n_items = n_hip = n_verif = 0
    for tier, body in tiers.items():
        if tier not in TIERS:
            errors.append(f"Subsección desconocida en «1. Novedades»: «{tier}»")
            continue
        for block in re.split(r"^#### ", body, flags=re.M)[1:]:
            title = block.splitlines()[0]
            short = title[:60]
            if tier == "Hipótesis":
                n_hip += 1
            else:
                n_items += 1
            if not title.startswith(EMOJIS):
                errors.append(f"Novedad sin importancia 🔴🟠🟢⚪: «{short}»")
            else:
                counts[title[0]] += 1
            if tier != "Hipótesis" and not DATE_RE.search(title) and "fecha no confirmada" not in title.lower():
                errors.append(f"Novedad sin fecha (AAAA-MM-DD o «fecha no confirmada»): «{short}»")
            for f in ("Qué", "Importancia", "Para GARELON", "Verificación"):
                if not field(block, f):
                    errors.append(f"«{short}»: falta **{f}:**")
            v = field(block, "Verificación")
            label = next((x for x in VERIF if v.startswith(x)), None)
            if v and not label:
                errors.append(f"«{short}»: verificación «{v[:40]}» no es una de las 5 etiquetas")
            elif label and label not in ALLOWED_VERIF[tier]:
                errors.append(f"«{short}»: «{label}» no encaja en «{tier}» (admite: {', '.join(sorted(ALLOWED_VERIF[tier]))})")
            urls = {norm_url(u) for u in URL_RE.findall(block)}
            if tier == "Hipótesis":
                if not field(block, "Base"):
                    errors.append(f"«{short}»: una hipótesis necesita **Base:** (en qué novedades o datos se apoya)")
            elif not urls:
                errors.append(f"Novedad sin URL de fuente: «{short}»")
            if tier == "Oficial" and urls and not any(is_official(u) for u in urls):
                errors.append(f"«{short}»: está en «Oficial» sin URL de un dominio oficial. Si solo hay medios, va en «Medios especializados»")
            if label == VERIF[0]:
                n_verif += 1
                if not urls & leidas:
                    errors.append(f"«{short}»: VERIFICADO EN FUENTE ORIGINAL exige que su URL esté en «Fuentes leídas completas» "
                                  "(abierta con WebFetch; un resumen de búsqueda no cuenta)")
            elif label and re.search(r"confirmad|✔", block, flags=re.I):
                errors.append(f"«{short}»: dice «confirmado» o ✔ sin estar VERIFICADO EN FUENTE ORIGINAL")
    if n_items > MAX_NOVEDADES:
        errors.append(f"{n_items} novedades (máximo {MAX_NOVEDADES}): calidad antes que cantidad")
    if n_hip > MAX_HIPOTESIS:
        errors.append(f"{n_hip} hipótesis (máximo {MAX_HIPOTESIS})")
    if n_items == 0 and "nada" not in nov.lower():
        warns.append("Sin novedades: la sección 1 debe decirlo y explicar qué se buscó")
    if n_items > n_verif and not re.search(r"^\s*[-\d]", secs.get(SECTIONS[2], "").split("\n", 1)[-1], flags=re.M):
        errors.append("Hay novedades sin verificar en fuente original y «3. Qué no está suficientemente verificado» está vacía")

    recs = re.findall(r"^\d+\.\s", secs.get(SECTIONS[3], "").split("\n", 1)[-1], flags=re.M)
    if len(recs) > MAX_RECS:
        errors.append(f"Recomendaciones: {len(recs)} (máximo {MAX_RECS})")
    tests = re.findall(r"^\d+\.\s.*$", secs.get(SECTIONS[4], "").split("\n", 1)[-1], flags=re.M)
    if len(tests) > MAX_TESTS:
        errors.append(f"Tests: {len(tests)} (máximo {MAX_TESTS})")
    for t in tests:
        if "Variable:" not in t or "Métrica:" not in t:
            errors.append(f"Test sin «Variable:» o «Métrica:» (una variable por test): {t[:70]}")

    src = secs.get(SECTIONS[7], "")
    src_urls = {norm_url(u) for u in URL_RE.findall(src)}
    for line in src.splitlines():
        if URL_RE.search(line) and not (DATE_RE.search(line) or "fecha no indicada" in line.lower()):
            errors.append(f"Fuente sin fecha de publicación: {line.strip()[:90]}")
    body_urls = {norm_url(u) for s in SECTIONS[:7] for u in URL_RE.findall(secs.get(s, ""))} | leidas
    for u in sorted(body_urls - src_urls):
        warns.append(f"URL citada que no está en «8. Fuentes»: {u}")
    repeated = sorted(src_urls & seen())
    if repeated:
        warns.append(f"{len(repeated)} fuentes ya usadas en informes anteriores (solo válido si es una actualización): "
                     + ", ".join(repeated[:5]))
    stats = {"novedades": n_items, "rojas": counts["🔴"], "naranjas": counts["🟠"], "verificadas": n_verif,
             "fuentes": len(src_urls), "urls": src_urls}
    return errors, warns, stats


def check_knowledge(path: Path = KNOWLEDGE) -> tuple[list[str], list[str]]:
    errors, warns = [], []
    text = path.read_text()
    body = text.split("## Historial de cambios")[0]
    if "## Historial de cambios" not in text:
        errors.append("Memoria: falta «## Historial de cambios»")
    ids = re.findall(r"^### \[(K-[A-Z]+-\d+)\]", body, flags=re.M)
    dup = sorted({i for i in ids if ids.count(i) > 1})
    if dup:
        errors.append(f"Memoria: IDs repetidos {', '.join(dup)}")
    for block in re.split(r"^### (?=\[K-)", body, flags=re.M)[1:]:
        block = block.split("\n## ")[0]
        kid = block.split("]")[0] + "]"
        for f in K_FIELDS:
            if f not in block:
                errors.append(f"Memoria {kid}: falta {f}")
        estado = field(block, "Estado").lower()
        if estado and not estado.startswith(K_STATES):
            errors.append(f"Memoria {kid}: estado «{estado[:30]}» (vigente o dudoso; lo obsoleto pasa al historial explicando el cambio)")
        ev = field(block, "Evidencia")
        if ev and not any(x in ev for x in VERIF):
            errors.append(f"Memoria {kid}: la evidencia no lleva una de las 5 etiquetas de verificación")
        if re.search(r"(?<!\w)✔", block) and VERIF[0] not in ev:
            errors.append(f"Memoria {kid}: ✔ sin VERIFICADO EN FUENTE ORIGINAL")
    m = re.search(r"\*\*Última actualización:\*\*\s*(\d{4}-\d\d-\d\d)", text)
    if not m:
        errors.append("Memoria: falta «**Última actualización:** AAAA-MM-DD»")
    return errors, warns


def cmd_check(a):
    errors, warns, st = check_report(Path(a.report))
    k_err, k_warn = check_knowledge()
    errors += k_err
    warns += k_warn
    for w in warns:
        print(f"  AVISO  {w}")
    for e in errors:
        print(f"  ERROR  {e}")
    print(f"novedades {st['novedades']} (🔴 {st['rojas']} · 🟠 {st['naranjas']} · verificadas en fuente original "
          f"{st['verificadas']}) · fuentes {st['fuentes']}")
    print("OK" if not errors else f"{len(errors)} errores")
    sys.exit(1 if errors else 0)


def cmd_preflight(_a):
    """Antes de cada push: rama correcta, solo creative/research/, sin merges y sin reescribir historia."""
    errors = []
    try:
        branch = git("rev-parse", "--abbrev-ref", "HEAD").strip()
        if branch != RESEARCH_BRANCH:
            errors.append(f"Rama actual «{branch}»: solo se trabaja en {RESEARCH_BRANCH}")
        base = f"origin/{RESEARCH_BRANCH}"
        git("fetch", "-q", "origin", RESEARCH_BRANCH)
        if subprocess.run(["git", "-C", str(REPO), "merge-base", "--is-ancestor", base, "HEAD"]).returncode:
            errors.append(f"HEAD no desciende de {base}: haría falta force-push (prohibido). Hacer git pull --rebase")
        if git("rev-list", "--merges", f"{base}..HEAD").strip():
            errors.append("Hay commits de merge: prohibido. Rehacer con git pull --rebase")
        changed = set(git("diff", "--name-only", f"{base}..HEAD").split())
        changed |= {ln[3:].split(" -> ")[-1] for ln in git("status", "--porcelain").splitlines()}
        outside = sorted(p for p in changed if p and not p.startswith(ALLOWED_PREFIX))
        if outside:
            errors.append("Cambios fuera de creative/research/: " + ", ".join(outside[:10]))
    except subprocess.CalledProcessError as e:  # noqa: PERF203
        errors.append(f"git falló: {' '.join(e.cmd[3:])}: {e.stderr.strip()[:200]}")
    for e in errors:
        print(f"  ERROR  {e}")
    if errors:
        print("NO hacer push")
        sys.exit(1)
    print(f"OK · push permitido solo con: git push origin HEAD:refs/heads/{RESEARCH_BRANCH}")


def knowledge_changed() -> str:
    try:
        out = git("status", "--porcelain", "--", str(KNOWLEDGE))
        return "sí" if out.strip() else "no"
    except Exception:  # noqa: BLE001
        return "NO DISPONIBLE"


def cmd_register(a):
    path = Path(a.report).resolve()
    errors, _warns, st = check_report(path)
    errors += check_knowledge()[0]
    m = re.search(r"\*\*Ventana:\*\*\s*desde (\S+) hasta (\S+)", path.read_text())
    since, until = (m.group(1), m.group(2)) if m else ("?", "?")
    # Una limitación conocida (p. ej. red) no invalida la ejecución; un error sí: la próxima ventana empezará antes.
    estado = "informe-invalido" if errors else ("con-errores" if a.errores else "ok")
    row = {
        "fecha_ejecucion": dt.datetime.now(TZ).isoformat(timespec="minutes"),
        "tipo": a.tipo, "ventana_desde": since, "ventana_hasta": until,
        "informe": str(path.relative_to(HERE)), "consultas": a.consultas, "fuentes": st["fuentes"],
        "novedades": st["novedades"], "rojas": st["rojas"], "naranjas": st["naranjas"],
        "verificadas": st["verificadas"],
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
    sub.add_parser("preflight").set_defaults(fn=cmd_preflight)
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
