#!/usr/bin/env python3
"""GARELON · comprobación ligera de la documentación (sin dependencias).

Evita que el código y los documentos diverjan sin que nadie se entere. Comprueba:

  * existen los 5 documentos canónicos, el registro de decisiones y el manifest;
  * cada documento lleva cabecera con versión, fecha, repositorio, rama fuente, commit
    fuente (que existe en git) y la advertencia de snapshot;
  * las rutas del repositorio citadas en los documentos y en la skill existen
    (admite comodines `*`; ignora plantillas con `<…>` o `{{…}}`);
  * los enlaces Markdown internos (archivos y anclas) no están rotos;
  * no quedan términos obsoletos (AutoDS, sérum, fondue, secciones 1.x…) salvo en
    líneas que los presentan como historia («histórico», «ya no», «en lugar de»…);
  * la skill: `name` = carpeta, descripción ≤ 1024 caracteres, cada reference citada
    existe y cada reference existente está citada en SKILL.md;
  * `current-store-state.md` es un SNAPSHOT con commit, y ese commit es el último que
    cambió el tema (si el tema ha cambiado después, el snapshot está desfasado);
  * el manifest coincide con el SHA-256 real de los 5 documentos.

No valida el tema (eso es `tools/garelon_check.py`) ni la semántica de los textos.

Uso:
  python3 tools/garelon_docs_check.py [--root RAÍZ] [--git-repo REPO]
  python3 tools/garelon_docs_check.py --update-manifest
  python3 tools/garelon_docs_check.py --zip SALIDA.zip      # comprueba y empaqueta los 5 documentos
Sale con código 1 si hay errores.
"""
import argparse
import glob
import hashlib
import io
import os
import re
import subprocess
import sys
import zipfile

DOCS = 'docs/garelon'
CANONICAL = [
    'GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md',
    'GARELON_MASTER_TEMPLATE.md',
    'GARELON_PRODUCT_BRIEF_TEMPLATE.md',
    'GARELON_MIGRATION_PROMPT_TEMPLATE.md',
    'GARELON_PRODUCT_MIGRATION_CHECKLIST.md',
]
DECISION_LOG = 'GARELON_DECISION_LOG.md'
MANIFEST = 'GARELON_PROJECT_FILES_MANIFEST.md'
SKILL_DIR = '.claude/skills/garelon-ecommerce-operator'
STATE = SKILL_DIR + '/references/current-store-state.md'
THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']
HEADER_FIELDS = ['**Versión:**', '**Fecha:**', '**Repositorio:**', '**Rama fuente:**', '**Commit fuente:**']

# Términos que describen estados ya superados. Solo se admiten en líneas que los
# presentan como historia (CONTEXT_OK). El registro de decisiones está exento.
OBSOLETE = [
    (r'\bAutoDS\b', 'AutoDS ya no es la integración (actual: DSers)'),
    (r'CJ ?Dropshipping', 'CJ Dropshipping fue el proveedor de productos anteriores'),
    (r'\bs[ée]rum\b', 'el sérum fue un producto anterior'),
    (r'\b[Ff]ondue\b', 'la Taza Fondue fue un producto anterior'),
    (r'garelon-(?:trust-bar|benefits|packs\b|url|free-shipping|ingredients|how-to-use|final-cta|sticky-atc|fallback-image|srcset|wordmark|rosario-|assurance|features|colors)',
     'archivo de la arquitectura 1.x que ya no existe'),
    (r'claude/rosary-bracelet|claude/fondue-mug|baseline/garelon-', 'rama histórica'),
    (r'letras doradas', 'el logo con letras doradas no es el actual'),
    # «Envío gratis desactivado» como estado actual es obsoleto; como hipótesis («si se desactiva»,
    # «con el ajuste desactivado», una fila de tabla «activado/desactivado») es documentación válida.
    (r'[Ee]nvío gratis[^.\n]*desactivad', 'el envío gratis está activo',
     r'(?i)\b(?:si|con|cuando|sin)\b[^.\n]*env[ií]o gratis[^.\n]*desactivad|activad[oa]/desactivad|\|\s*env[ií]o gratis\s*\*\*desactivad'),
]
CONTEXT_OK = re.compile(r'históric|ya no|no AutoDS|en lugar de|sustitu|antiguo|dejan de|no es el (?:logo )?actual|anterior', re.I)

PATH_RE = re.compile(r'(?<![\w/.{<-])((?:\.claude|assets|config|layout|locales|sections|snippets|templates|tools|docs)/[\w./*-]*)')
MD_NAME_RE = re.compile(r'`([\w.-]+\.md)`')
LINK_RE = re.compile(r'\[[^\]]*\]\(([^)\s]+)\)')

errors = []


def err(where, msg):
    errors.append(f'{where}: {msg}')


def git(repo, *args):
    r = subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None


def read(root, rel):
    return open(os.path.join(root, rel), encoding='utf-8').read()


def slug(heading):
    h = re.sub(r'[`*_]', '', heading.strip().lower())
    h = re.sub(r'[^\w\- ]', '', h)
    return h.replace(' ', '-')


def doc_files(root):
    files = [f'{DOCS}/{d}' for d in CANONICAL + [DECISION_LOG, MANIFEST]]
    files += [SKILL_DIR + '/SKILL.md'] + sorted(
        os.path.relpath(p, root) for p in glob.glob(os.path.join(root, SKILL_DIR, 'references', '*.md')))
    return [f for f in files if os.path.exists(os.path.join(root, f))]


def check_existence(root):
    for d in CANONICAL + [DECISION_LOG, MANIFEST]:
        if not os.path.exists(os.path.join(root, DOCS, d)):
            err(f'{DOCS}/{d}', 'no existe')
    for f in (SKILL_DIR + '/SKILL.md', STATE):
        if not os.path.exists(os.path.join(root, f)):
            err(f, 'no existe')


def header_of(text):
    head = '\n'.join(text.splitlines()[:8])
    fields = {}
    for name in ('Versión', 'Fecha', 'Repositorio', 'Rama fuente', 'Commit fuente'):
        m = re.search(r'\*\*' + name + r':\*\*\s*`?([^`·\n]+?)`?\s*(?:·|$)', head, re.M)
        fields[name] = m.group(1).strip() if m else None
    return fields


def check_headers(root, gitrepo):
    for d in CANONICAL + [DECISION_LOG]:
        rel = f'{DOCS}/{d}'
        if not os.path.exists(os.path.join(root, rel)):
            continue
        text = read(root, rel)
        head = '\n'.join(text.splitlines()[:8])
        for f in HEADER_FIELDS:
            if f not in head:
                err(rel, f'cabecera sin {f}')
        if d in CANONICAL and 'Snapshot generado desde' not in head:
            err(rel, 'cabecera sin la advertencia «Snapshot generado desde …; ante discrepancias manda el repo»')
        commit = header_of(text)['Commit fuente']
        if commit and git(gitrepo, 'cat-file', '-e', commit + '^{commit}') is None:
            err(rel, f'el commit fuente {commit} no existe en git')


def check_paths(root, rel, text):
    for m in PATH_RE.finditer(text):
        p = m.group(1).rstrip('.')
        nxt = text[m.end():m.end() + 1]
        if nxt in ('<', '{') or p.endswith('-') or '…' in p:
            continue  # plantilla: assets/producto-<clave>-<ancho>.webp
        full = os.path.join(root, p)
        if '*' in p:
            if not glob.glob(full):
                err(rel, f'ninguna ruta coincide con «{p}»')
        elif not os.path.exists(full):
            err(rel, f'ruta citada inexistente «{p}»')
    for m in MD_NAME_RE.finditer(text):
        name = m.group(1)
        if '/' in name:
            continue
        candidates = [os.path.join(root, DOCS, name), os.path.join(root, SKILL_DIR, 'references', name), os.path.join(root, name)]
        if not any(os.path.exists(c) for c in candidates):
            err(rel, f'documento citado inexistente «{name}»')


def check_links(root, rel, text):
    base = os.path.dirname(os.path.join(root, rel))
    anchors = {slug(h) for h in re.findall(r'^#{1,6}\s+(.*)$', text, re.M)}
    for target in LINK_RE.findall(text):
        if re.match(r'^[a-z]+:', target):
            continue
        path, _, anchor = target.partition('#')
        if path:
            dest = os.path.normpath(os.path.join(base, path))
            if not os.path.exists(dest):
                err(rel, f'enlace roto «{target}»')
                continue
            if anchor and dest.endswith('.md'):
                other = {slug(h) for h in re.findall(r'^#{1,6}\s+(.*)$', open(dest, encoding='utf-8').read(), re.M)}
                if anchor not in other:
                    err(rel, f'ancla inexistente «{target}»')
        elif anchor and anchor not in anchors:
            err(rel, f'ancla inexistente «#{anchor}»')


def check_obsolete(root, rel, text):
    if rel.endswith(DECISION_LOG):
        return
    for n, line in enumerate(text.splitlines(), 1):
        if CONTEXT_OK.search(line):
            continue
        for pattern, why, *allowed in OBSOLETE:
            if re.search(pattern, line) and not (allowed and re.search(allowed[0], line)):
                err(f'{rel}:{n}', f'término obsoleto ({why}): «{line.strip()[:110]}»')


def check_skill(root):
    rel = SKILL_DIR + '/SKILL.md'
    if not os.path.exists(os.path.join(root, rel)):
        return
    text = read(root, rel)
    fm = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    if not fm:
        err(rel, 'sin frontmatter YAML')
        return
    name = re.search(r'^name:\s*(\S+)', fm.group(1), re.M)
    desc = re.search(r'^description:\s*(.+)$', fm.group(1), re.M)
    if not name or name.group(1) != os.path.basename(SKILL_DIR):
        err(rel, f'name debe ser «{os.path.basename(SKILL_DIR)}»')
    if not desc:
        err(rel, 'sin description')
    else:
        d = desc.group(1)
        if len(d) > 1024:
            err(rel, f'description de {len(d)} caracteres (máx. 1024)')
        if '<' in d or '>' in d:
            err(rel, 'description con < o >')
    if len(text.splitlines()) > 500:
        err(rel, 'SKILL.md de más de 500 líneas: mueve detalle a references/')
    cited = set(re.findall(r'`(?:references/)?([\w-]+\.md)`', text))
    refs = {os.path.basename(p) for p in glob.glob(os.path.join(root, SKILL_DIR, 'references', '*.md'))}
    for r in sorted(refs - cited):
        err(rel, f'references/{r} existe pero SKILL.md no lo cita')
    for c in sorted(cited):
        if c.startswith('GARELON_'):
            continue
        if c not in refs:
            err(rel, f'cita «{c}», que no está en references/')


def check_state(root, gitrepo):
    if not os.path.exists(os.path.join(root, STATE)):
        return
    text = read(root, STATE)
    if 'SNAPSHOT' not in text:
        err(STATE, 'debe declararse SNAPSHOT')
    m = re.search(r'<!-- snapshot-commit: (\w+) -->', text)
    if not m:
        err(STATE, 'sin marcador <!-- snapshot-commit: … -->')
        return
    commit = m.group(1)
    if git(gitrepo, 'cat-file', '-e', commit + '^{commit}') is None:
        err(STATE, f'el commit del snapshot {commit} no existe en git')
        return
    if '<!-- snapshot:start -->' not in text or '<!-- snapshot:end -->' not in text:
        err(STATE, 'sin bloque <!-- snapshot:start --> … <!-- snapshot:end -->')
    changed = git(gitrepo, 'diff', '--name-only', commit, 'HEAD', '--', *THEME_DIRS)
    if changed:
        last = git(gitrepo, 'log', '-1', '--format=%h', '--', *THEME_DIRS)
        err(STATE, f'snapshot desfasado: el tema cambió después de {commit} (último cambio {last}). '
                   'Ejecuta scripts/garelon_store_snapshot.py --update-state y revisa las notas')


def sha256(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def manifest_rows(root):
    rows = []
    for d in CANONICAL:
        p = os.path.join(root, DOCS, d)
        if not os.path.exists(p):
            continue
        h = header_of(open(p, encoding='utf-8').read())
        rows.append((d, h['Versión'] or '?', h['Fecha'] or '?', h['Commit fuente'] or '?', sha256(p),
                     len(open(p, encoding='utf-8').read().splitlines())))
    return rows


def manifest_table(rows):
    out = ['| Documento | Versión | Fecha | Commit fuente | Líneas | SHA-256 |', '|---|---|---|---|---|---|']
    out += [f'| `{d}` | {v} | {f} | `{c}` | {n} | `{s}` |' for d, v, f, c, s, n in rows]
    return '\n'.join(out)


def check_manifest(root):
    rel = f'{DOCS}/{MANIFEST}'
    if not os.path.exists(os.path.join(root, rel)):
        return
    block = re.search(r'<!-- manifest:start -->(.*?)<!-- manifest:end -->', read(root, rel), re.S)
    if not block:
        err(rel, 'falta el bloque <!-- manifest:start --> … <!-- manifest:end -->')
        return
    text = block.group(1)
    for d, _v, _f, _c, sha, _n in manifest_rows(root):
        row = re.search(r'^\|\s*`' + re.escape(d) + r'`.*$', text, re.M)
        if not row:
            err(rel, f'no lista {d}')
        elif sha not in row.group(0):
            err(rel, f'SHA-256 de {d} desactualizado: ejecuta --update-manifest')


def update_manifest(root):
    rel = f'{DOCS}/{MANIFEST}'
    text = read(root, rel)
    new, n = re.subn(r'<!-- manifest:start -->.*?<!-- manifest:end -->',
                     lambda _m: '<!-- manifest:start -->\n' + manifest_table(manifest_rows(root)) + '\n<!-- manifest:end -->',
                     text, flags=re.S)
    if n != 1:
        sys.exit(f'{rel}: falta el bloque <!-- manifest:start --> … <!-- manifest:end -->')
    open(os.path.join(root, rel), 'w', encoding='utf-8').write(new)
    print(f'{rel}: actualizado')


def build_zip(root, out):
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
        for d in CANONICAL:
            info = zipfile.ZipInfo(d, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            z.writestr(info, open(os.path.join(root, DOCS, d), 'rb').read())
    data = buf.getvalue()
    with zipfile.ZipFile(io.BytesIO(data)) as z:  # verificación: exactamente los 5, en la raíz, idénticos
        names = z.namelist()
        if sorted(names) != sorted(CANONICAL):
            sys.exit(f'ZIP inesperado: {names}')
        for d in CANONICAL:
            if z.read(d) != open(os.path.join(root, DOCS, d), 'rb').read():
                sys.exit(f'ZIP: {d} no coincide byte a byte')
    open(out, 'wb').write(data)
    print(f'{out}: {len(CANONICAL)} documentos · {len(data)} bytes · SHA-256 {hashlib.sha256(data).hexdigest()}')


def run(root, gitrepo):
    errors.clear()
    check_existence(root)
    check_headers(root, gitrepo)
    for rel in doc_files(root):
        text = read(root, rel)
        check_paths(root, rel, text)
        check_links(root, rel, text)
        check_obsolete(root, rel, text)
    check_skill(root)
    check_state(root, gitrepo)
    check_manifest(root)
    return list(errors)


def main():
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--root', default=here, help='raíz con los archivos (por defecto, el repositorio)')
    ap.add_argument('--git-repo', default=None, help='repositorio git para commits (por defecto, --root)')
    ap.add_argument('--update-manifest', action='store_true')
    ap.add_argument('--zip', metavar='SALIDA')
    args = ap.parse_args()
    gitrepo = args.git_repo or args.root
    if args.update_manifest:
        update_manifest(args.root)
    found = run(args.root, gitrepo)
    for e in found:
        print('ERROR', e)
    if found:
        print(f'garelon_docs_check: {len(found)} error(es)')
        sys.exit(1)
    print(f'garelon_docs_check: OK ({len(doc_files(args.root))} documentos revisados)')
    if args.zip:
        build_zip(args.root, args.zip)


if __name__ == '__main__':
    main()
