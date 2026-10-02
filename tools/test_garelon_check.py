#!/usr/bin/env python3
"""Autoprueba del validador: cada mutación típica que rompe la instalación debe FALLAR.

Copia el tema a una carpeta temporal, aplica una mutación y comprueba que
tools/garelon_check.py devuelve error. El tema intacto debe pasar.
Uso: python3 tools/test_garelon_check.py
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']


def run(path):
    return subprocess.run([sys.executable, os.path.join(HERE, 'garelon_check.py'), path],
                          capture_output=True, text=True).returncode


def jload(p):
    return json.load(open(p, encoding='utf-8'))


def jsave(p, d):
    json.dump(d, open(p, 'w', encoding='utf-8'), indent=2, ensure_ascii=False)


def first_section(t):
    idx = jload(f'{t}/templates/index.json')
    return idx, idx['order'][0]


def m_remove(rel):
    return lambda t: os.remove(f'{t}/{rel}')


def m_section_type(t):
    idx, sid = first_section(t); idx['sections'][sid]['type'] = 'no-existe'; jsave(f'{t}/templates/index.json', idx)


def m_setting(t):
    idx, sid = first_section(t); idx['sections'][sid].setdefault('settings', {})['ajuste_inventado'] = 1; jsave(f'{t}/templates/index.json', idx)


def m_select(t):
    idx = jload(f'{t}/templates/index.json')
    for sid, sec in idx['sections'].items():
        for k, v in (sec.get('settings') or {}).items():
            if k == 'color_scheme':
                sec['settings'][k] = 'scheme-inventado'; jsave(f'{t}/templates/index.json', idx); return
    raise AssertionError('sin color_scheme que mutar')


def m_block_type(t):
    idx = jload(f'{t}/templates/index.json')
    for sec in idx['sections'].values():
        if sec.get('blocks'):
            next(iter(sec['blocks'].values()))['type'] = 'bloque-inventado'; jsave(f'{t}/templates/index.json', idx); return
    raise AssertionError('sin bloques que mutar')


def m_block_order(t):
    idx = jload(f'{t}/templates/index.json')
    for sec in idx['sections'].values():
        if sec.get('block_order'):
            sec['block_order'].append('fantasma'); jsave(f'{t}/templates/index.json', idx); return
    raise AssertionError('sin block_order')


def m_order(t):
    idx = jload(f'{t}/templates/index.json'); idx['order'].append('fantasma'); jsave(f'{t}/templates/index.json', idx)


def m_dup_key(t):
    p = f'{t}/templates/index.json'; s = open(p, encoding='utf-8').read()
    s = s.replace('"sections": {', '"sections": {}, "sections": {', 1); open(p, 'w', encoding='utf-8').write(s)


def m_app_block(t):
    idx = jload(f'{t}/templates/index.json')
    for sec in idx['sections'].values():
        if sec.get('blocks') is not None:
            sec['blocks']['app'] = {'type': 'shopify://apps/judge-me-reviews/blocks/review_widget/123', 'settings': {}}
            sec.setdefault('block_order', []).append('app'); jsave(f'{t}/templates/index.json', idx); return
    raise AssertionError('sin sección con bloques')


def schema_mutation(fn):
    def apply(t):
        for f in sorted(os.listdir(f'{t}/sections')):
            if not f.endswith('.liquid'):
                continue
            p = f'{t}/sections/{f}'; s = open(p, encoding='utf-8').read()
            m = re.search(r'({%-?\s*schema\s*-?%})(.*?)({%-?\s*endschema\s*-?%})', s, re.S)
            if not m:
                continue
            sc = json.loads(m.group(2))
            if fn(sc):
                s = s[:m.start(2)] + json.dumps(sc, ensure_ascii=False, indent=2) + s[m.end(2):]
                open(p, 'w', encoding='utf-8').write(s); return
        raise AssertionError('sin schema que mutar')
    return apply


def long_block_name(sc):
    for b in sc.get('blocks', []):
        if b['type'] not in ('@app', '@theme'):
            b['name'] = 'Nombre de bloque demasiado largo'; return True
    return False


def empty_text_default(sc):
    for st in sc.get('settings', []):
        if st.get('type') == 'text':
            st['default'] = ''; return True
    return False


def bad_range(sc):
    for st in sc.get('settings', []):
        if st.get('type') == 'range':
            st['max'] = st['min'] + 1000 * st.get('step', 1); return True
    return False


def m_missing_asset(t):
    p = f'{t}/layout/theme.liquid'; s = open(p, encoding='utf-8').read()
    s = s.replace('</head>', "{{ 'no-existe-garelon.css' | asset_url | stylesheet_tag }}\n</head>", 1); open(p, 'w', encoding='utf-8').write(s)


def m_missing_snippet(t):
    p = f'{t}/layout/theme.liquid'; s = open(p, encoding='utf-8').read()
    s = s.replace('</body>', "{% render 'snippet-inexistente' %}\n</body>", 1); open(p, 'w', encoding='utf-8').write(s)


def m_image_ref(t):
    idx = jload(f'{t}/templates/index.json')
    for sec in idx['sections'].values():
        sec.setdefault('settings', {})
    p = f'{t}/sections'
    # busca una sección de la home con image_picker y le pone una imagen de Files
    for sid, sec in idx['sections'].items():
        src = open(f'{p}/{sec["type"]}.liquid', encoding='utf-8').read()
        m = re.search(r'"id":\s*"(\w+)",\s*"type":\s*"image_picker"|"type":\s*"image_picker",\s*"id":\s*"(\w+)"', src)
        if m:
            sec['settings'][m.group(1) or m.group(2)] = 'shopify://shop_images/no-existe.webp'
            jsave(f'{t}/templates/index.json', idx); return
    raise AssertionError('sin image_picker en la home')


def m_missing_image(t):
    for f in sorted(os.listdir(f'{t}/assets')):
        if f.startswith('producto-') and f.endswith('.webp'):
            os.remove(f'{t}/assets/{f}'); return
    raise AssertionError('sin imágenes de producto')


def m_missing_translation(t):
    p = f'{t}/locales/fr.json'
    d = jload(p)
    d.setdefault('garelon', {}).pop('legal', None)
    jsave(p, d)


MUTATIONS = [
    ('falta templates/index.json', m_remove('templates/index.json')),
    ('falta layout/theme.liquid', m_remove('layout/theme.liquid')),
    ('falta config/settings_schema.json', m_remove('config/settings_schema.json')),
    ('falta config/settings_data.json', m_remove('config/settings_data.json')),
    ('index.json: tipo de sección inexistente', m_section_type),
    ('index.json: ajuste inexistente', m_setting),
    ('index.json: esquema de color inexistente', m_select),
    ('index.json: tipo de bloque inexistente', m_block_type),
    ('index.json: block_order con id inexistente', m_block_order),
    ('index.json: order con id inexistente', m_order),
    ('index.json: clave duplicada', m_dup_key),
    ('index.json: referencia a bloque de app', m_app_block),
    ('index.json: imagen de Files que puede no existir', m_image_ref),
    ('schema: nombre de bloque > 25 bytes', schema_mutation(long_block_name)),
    ('schema: default de texto vacío', schema_mutation(empty_text_default)),
    ('schema: range con más de 101 pasos', schema_mutation(bad_range)),
    ('asset referenciado que no existe', m_missing_asset),
    ('snippet renderizado que no existe', m_missing_snippet),
    ('imagen de producto por clave que no existe', m_missing_image),
    ('traducción que falta en un idioma', m_missing_translation),
]


def main():
    results = []
    with tempfile.TemporaryDirectory(prefix='garelon-mut-') as base:
        clean = os.path.join(base, 'clean')
        for d in DIRS:
            shutil.copytree(os.path.join(ROOT, d), os.path.join(clean, d))
        results.append(('tema intacto → OK', run(clean) == 0))
        for name, fn in MUTATIONS:
            t = os.path.join(base, 'm')
            shutil.rmtree(t, ignore_errors=True)
            shutil.copytree(clean, t)
            try:
                fn(t)
            except AssertionError as e:
                results.append((f'{name} → no aplicable ({e})', None))
                continue
            results.append((f'{name} → ERROR detectado', run(t) != 0))
    bad = 0
    for name, passed in results:
        mark = 'SKIP' if passed is None else ('PASS' if passed else 'FAIL')
        bad += passed is False
        print(f'{mark}\t{name}')
    print(f'TOTAL {sum(1 for _, p in results if p)}/{sum(1 for _, p in results if p is not None)}')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
