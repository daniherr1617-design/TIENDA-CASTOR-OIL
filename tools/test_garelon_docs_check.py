#!/usr/bin/env python3
"""Autoprueba de tools/garelon_docs_check.py: cada rotura típica debe detectarse y el
sistema documental intacto debe pasar. Trabaja sobre una copia temporal (no toca el repo).

Uso: python3 tools/test_garelon_docs_check.py
"""
import os
import re
import shutil
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import garelon_docs_check as dc  # noqa: E402

M = 'docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md'
MT = 'docs/garelon/GARELON_MASTER_TEMPLATE.md'
SK = '.claude/skills/garelon-ecommerce-operator/SKILL.md'
ST = '.claude/skills/garelon-ecommerce-operator/references/current-store-state.md'
REF = '.claude/skills/garelon-ecommerce-operator/references'


def edit(root, rel, fn):
    p = os.path.join(root, rel)
    text = open(p, encoding='utf-8').read()
    new = fn(text)
    assert new != text, f'la mutación no cambió {rel}'
    open(p, 'w', encoding='utf-8').write(new)


def append(text):
    return lambda s: s + '\n' + text + '\n'


def stale_commit():
    """Un commit anterior a algún cambio del tema (el snapshot quedaría desfasado)."""
    return dc.git(REPO, 'log', '--format=%h', '-n', '1', '--skip', '1', '--', *dc.THEME_DIRS)


CASES = [
    ('falta un documento canónico', lambda r: os.remove(os.path.join(r, 'docs/garelon/GARELON_PRODUCT_BRIEF_TEMPLATE.md')), 'no existe'),
    ('cabecera sin commit fuente', lambda r: edit(r, MT, lambda s: s.replace('**Commit fuente:**', '**Commit:**', 1)), 'cabecera sin'),
    ('commit fuente inexistente', lambda r: edit(r, MT, lambda s: re.sub(r'(\*\*Commit fuente:\*\* `)\w+', r'\g<1>deadbee', s, 1)), 'no existe en git'),
    ('ruta citada inexistente', lambda r: edit(r, MT, append('Ver `snippets/garelon-inexistente.liquid`.')), 'ruta citada inexistente'),
    ('comodín sin coincidencias', lambda r: edit(r, MT, append('Ver `assets/garelon-nada-*.webp`.')), 'ninguna ruta coincide'),
    ('documento .md citado inexistente', lambda r: edit(r, M, append('Lee `GARELON_NO_EXISTE.md`.')), 'documento citado inexistente'),
    ('enlace a archivo roto', lambda r: edit(r, M, append('[x](no-existe.md)')), 'enlace roto'),
    ('ancla rota', lambda r: edit(r, M, append('[x](#seccion-que-no-existe)')), 'ancla inexistente'),
    ('término obsoleto en contexto actual', lambda r: edit(r, M, append('La integración es AutoDS.')), 'término obsoleto'),
    ('sección 1.x citada como actual', lambda r: edit(r, MT, append('La portada usa `garelon-trust-bar`.')), 'término obsoleto'),
    ('name de la skill distinto de la carpeta', lambda r: edit(r, SK, lambda s: s.replace('name: garelon-ecommerce-operator', 'name: garelon', 1)), 'name debe ser'),
    ('description demasiado larga', lambda r: edit(r, SK, lambda s: re.sub(r'^(description: .*)$', lambda m: m.group(1) + ' x' * 600, s, 1, re.M)), 'description de'),
    ('reference huérfana', lambda r: open(os.path.join(r, REF, 'huerfana.md'), 'w').write('# x\n'), 'no lo cita'),
    ('reference citada inexistente', lambda r: edit(r, SK, append('Lee `references/no-existe.md`.')), 'que no está en references'),
    ('snapshot sin marcador de commit', lambda r: edit(r, ST, lambda s: re.sub(r'<!-- snapshot-commit: \w+ -->', '', s)), 'sin marcador'),
    ('snapshot desfasado', lambda r: edit(r, ST, lambda s: re.sub(r'<!-- snapshot-commit: \w+ -->', f'<!-- snapshot-commit: {stale_commit()} -->', s)), 'snapshot desfasado'),
    ('manifest desactualizado', lambda r: edit(r, MT, append('Cambio sin actualizar el manifest.')), 'desactualizado'),
]


def main():
    tmp = tempfile.mkdtemp(prefix='garelon-docs-check-')
    base = os.path.join(tmp, 'base')
    ignore = shutil.ignore_patterns('.git', '*.png', 'node_modules')
    shutil.copytree(REPO, base, ignore=ignore)
    failures = 0
    try:
        found = dc.run(base, REPO)
        ok = not found
        print(('PASS' if ok else 'FAIL'), 'sistema documental intacto → sin errores', '' if ok else found[:3])
        failures += not ok
        for name, mutate, expect in CASES:
            work = os.path.join(tmp, 'case')
            shutil.rmtree(work, ignore_errors=True)
            shutil.copytree(base, work)
            mutate(work)
            found = dc.run(work, REPO)
            ok = any(expect in e for e in found)
            print(('PASS' if ok else 'FAIL'), f'{name} → «{expect}»', '' if ok else found[:3])
            failures += not ok
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    total = len(CASES) + 1
    print(f'test_garelon_docs_check: {total - failures}/{total}')
    sys.exit(1 if failures else 0)


if __name__ == '__main__':
    main()
