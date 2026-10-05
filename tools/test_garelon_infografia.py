#!/usr/bin/env python3
"""Autoprueba de tools/garelon_infografia.py: cada alteración de la infografía debe FALLAR.

Copia el tema y la fuente a una carpeta temporal, aplica una mutación (recorte, línea movida,
filtro, compresión con pérdida, PNG servido, otra fuente, ampliación…) y comprueba que el
comprobador devuelve error. La copia intacta debe pasar. Nunca toca la fuente del repositorio.
Uso: python3 tools/test_garelon_infografia.py
"""
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']
SOURCE = 'NUEVA IMAGEN 1.png'


def asset(t, w):
    return f'{t}/theme/assets/producto-infografia-{w}.webp'


def resave(t, w, fn, **kw):
    im = Image.open(asset(t, w)).convert('RGB')
    fn(im).save(asset(t, w), 'WEBP', **(kw or dict(lossless=True, quality=100, method=6)))


def m_crop(t):
    resave(t, 720, lambda im: im.crop((12, 12, 708, 708)).resize((720, 720), Image.LANCZOS))


def m_shift(t):
    resave(t, 1080, lambda im: im.transform(im.size, Image.AFFINE, (1, 0, 3, 0, 1, 0)))


def m_line(t):
    def draw(im):
        ImageDraw.Draw(im).line((300, 260, 420, 330), fill=(196, 150, 60), width=2)
        return im
    resave(t, 1254, draw)


def m_sharpen(t):
    resave(t, 480, lambda im: im.filter(ImageFilter.SHARPEN))


def m_lossy(t):
    resave(t, 480, lambda im: im, quality=90, method=6)


def m_png(t):
    Image.open(asset(t, 480)).save(f'{t}/theme/assets/producto-infografia-480.png')


def m_missing(t):
    os.remove(asset(t, 720))


def m_aspect(t):
    resave(t, 480, lambda im: im.resize((480, 400), Image.LANCZOS))


def m_upscale(t):
    p = f'{t}/theme/snippets/garelon-image.liquid'
    s = open(p, encoding='utf-8').read().replace("'480,720,1080,1254'", "'480,720,1080,1254,1500'")
    open(p, 'w', encoding='utf-8').write(s)
    Image.open(asset(t, 1254)).resize((1500, 1500), Image.LANCZOS).save(asset(t, 1500), 'WEBP', lossless=True)


def m_other_source(t):
    im = Image.open(f'{t}/{SOURCE}').convert('RGB')
    ImageDraw.Draw(im).line((0, 0, 50, 50), fill=(0, 0, 0))
    im.save(f'{t}/{SOURCE}')


def m_old_source(t):
    shutil.copy(f'{t}/{SOURCE}', f'{t}/Imagen 1.png')


def m_png_ref(t):
    p = f'{t}/theme/sections/garelon-details.liquid'
    open(p, 'a', encoding='utf-8').write("\n{{ 'producto-infografia-1254.png' | asset_url }}\n")


MUTATIONS = [
    ('recorte (12 px por lado, reencuadrado)', m_crop),
    ('desplazamiento de 3 px', m_shift),
    ('una línea indicadora añadida o movida', m_line),
    ('filtro de enfoque', m_sharpen),
    ('WebP con pérdida (calidad 90)', m_lossy),
    ('PNG de la infografía en assets/', m_png),
    ('falta un ancho (720)', m_missing),
    ('proporción distinta (480x400)', m_aspect),
    ('ancho ampliado por encima de la fuente (1500)', m_upscale),
    ('otra fuente (SHA-256 distinto)', m_other_source),
    ('la fuente retirada «Imagen 1.png» vuelve', m_old_source),
    ('referencia a un PNG de la infografía', m_png_ref),
]


def run(t):
    return subprocess.run([sys.executable, os.path.join(HERE, 'garelon_infografia.py'), '--check',
                           '--theme', f'{t}/theme', '--source', f'{t}/{SOURCE}'],
                          capture_output=True, text=True).returncode


def fresh():
    t = tempfile.mkdtemp(prefix='garelon-infografia-')
    for d in DIRS:
        shutil.copytree(os.path.join(ROOT, d), f'{t}/theme/{d}')
    shutil.copy(os.path.join(ROOT, SOURCE), f'{t}/{SOURCE}')
    return t


def main():
    fails = 0
    t = fresh()
    good = run(t) == 0
    shutil.rmtree(t)
    print(('✓' if good else '✗') + ' copia intacta: pasa')
    fails += not good
    for name, fn in MUTATIONS:
        t = fresh()
        fn(t)
        caught = run(t) != 0
        shutil.rmtree(t)
        print(('✓' if caught else '✗') + f' {name}: detectado')
        fails += not caught
    total = len(MUTATIONS) + 1
    print(f'{total - fails}/{total}')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
