#!/usr/bin/env python3
"""Autoprueba de tools/garelon_fotos.py: cada alteración de las fotos del producto debe FALLAR (D47).

Copia el tema y las fuentes a una carpeta temporal, aplica una mutación (recorte, filtro, otra fuente,
ampliación, infografía de vuelta, referencia a una fuente retirada…) y comprueba que el comprobador
devuelve error. La copia intacta debe pasar. Nunca toca el repositorio.
Uso: python3 tools/test_garelon_fotos.py
"""
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']


def resave(t, name, fn):
    p = f'{t}/assets/{name}'
    fn(Image.open(p).convert('RGB')).save(p, 'WEBP', quality=82, method=6)


def m_crop(t):
    resave(t, 'producto-completa-720.webp', lambda im: im.crop((40, 40, 680, 680)).resize((720, 720), Image.LANCZOS))


def m_blur(t):
    resave(t, 'producto-principal-480.webp', lambda im: im.filter(ImageFilter.GaussianBlur(3)))


def m_swap(t):
    shutil.copy(f'{t}/assets/producto-oracion-1080.webp', f'{t}/assets/producto-completa-1080.webp')


def m_tone(t):
    resave(t, 'producto-oracion-720.webp', lambda im: im.point(lambda v: min(255, int(v * 1.12))))


def m_size(t):
    resave(t, 'producto-principal-720.webp', lambda im: im.resize((700, 700), Image.LANCZOS))


def m_missing(t):
    os.remove(f'{t}/assets/producto-completa-480.webp')


def m_infografia_asset(t):
    shutil.copy(f'{t}/assets/producto-completa-480.webp', f'{t}/assets/producto-infografia-v4-480.webp')


def m_infografia_ref(t):
    p = f'{t}/sections/garelon-details.liquid'
    s = open(p, encoding='utf-8').read().replace('{ "value": "none", "label": "Ninguna" },',
                                                  '{ "value": "none", "label": "Ninguna" },\n        { "value": "infografia", "label": "x" },', 1)
    open(p, 'w', encoding='utf-8').write(s)


def m_retired_source(t):
    p = f'{t}/snippets/garelon-image.liquid'
    open(p, 'a', encoding='utf-8').write('{%- comment -%} NUEVA IMAGEN 4.png {%- endcomment -%}\n')


def m_extra_key(t):
    shutil.copy(f'{t}/assets/producto-completa-480.webp', f'{t}/assets/producto-detalle-480.webp')


MUTATIONS = [
    ('recorte reescalado de una foto', m_crop),
    ('foto desenfocada', m_blur),
    ('una foto sustituida por otra de las tres', m_swap),
    ('foto aclarada (color alterado)', m_tone),
    ('foto con un tamaño distinto del de su nombre', m_size),
    ('falta un ancho', m_missing),
    ('vuelve un WebP de la infografía', m_infografia_asset),
    ('vuelve la opción «infografia» a una sección', m_infografia_ref),
    ('referencia a una fuente retirada', m_retired_source),
    ('foto con una clave retirada (detalle)', m_extra_key),
]


def run(theme):
    return subprocess.run([sys.executable, os.path.join(HERE, 'garelon_fotos.py'), '--check', '--theme', theme],
                          capture_output=True, text=True).returncode


def main():
    results = []
    with tempfile.TemporaryDirectory(prefix='garelon-fotos-') as tmp:
        base = os.path.join(tmp, 'base')
        for d in DIRS:
            shutil.copytree(os.path.join(ROOT, d), os.path.join(base, d))
        results.append(('copia intacta → OK', run(base) == 0))
        for name, fn in MUTATIONS:
            t = os.path.join(tmp, 'm')
            shutil.rmtree(t, ignore_errors=True)
            shutil.copytree(base, t)
            fn(t)
            results.append((f'{name} → ERROR detectado', run(t) != 0))
    for name, passed in results:
        print(('PASS' if passed else 'FAIL') + '\t' + name)
    fails = sum(1 for _, p in results if not p)
    print(f'TOTAL {len(results) - fails}/{len(results)}')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
