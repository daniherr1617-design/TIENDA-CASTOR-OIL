#!/usr/bin/env python3
"""Autoprueba de tools/garelon_infografia.py: cada alteración de la infografía debe FALLAR.

Copia el tema y la fuente a una carpeta temporal, aplica una mutación (recorte, línea movida,
filtro, compresión con pérdida, PNG servido, otra fuente, ampliación, familia retirada, imagen del
editor, la fuente anterior…) y comprueba que el comprobador devuelve error. La copia intacta debe
pasar. También prueba --identify (la fuente reducida se reconoce; un recorte, una versión con pérdida
o una con líneas añadidas, no). Las líneas que añaden estas pruebas son mutaciones sobre copias
temporales: no reconstruyen nada de la fuente.
Nunca toca la fuente del repositorio.
Uso: python3 tools/test_garelon_infografia.py
"""
import hashlib
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
    return f'{t}/theme/assets/producto-infografia-v3-{w}.webp'


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


def m_old_family_file(t):
    shutil.copy(asset(t, 480), f'{t}/theme/assets/producto-infografia-480.webp')


def m_old_family_ref(t):
    p = f'{t}/theme/sections/garelon-details.liquid'
    open(p, 'a', encoding='utf-8').write("\n{{ 'producto-infografia-1254.webp' | asset_url }}\n")


def edit_snippet(t, old, new):
    p = f'{t}/theme/snippets/garelon-image.liquid'
    s = open(p, encoding='utf-8').read()
    assert old in s
    open(p, 'w', encoding='utf-8').write(s.replace(old, new))


def m_v2_file(t):
    shutil.copy(asset(t, 480), f'{t}/theme/assets/producto-infografia-v2-480.webp')


def m_v2_ref(t):
    p = f'{t}/theme/sections/garelon-details.liquid'
    open(p, 'a', encoding='utf-8').write("\n{{ 'producto-infografia-v2-1254.webp' | asset_url }}\n")


def m_snippet_v2(t):
    edit_snippet(t, "assign asset = 'producto-infografia-v3'", "assign asset = 'producto-infografia-v2'")


def m_retired_source(t):
    # La versión anterior de la fuente vuelve como «NUEVA IMAGEN 1.png». Sin recuperarla de Git: se simula
    # registrando como fuente retirada el SHA-256 de la copia de prueba.
    return ('source', hashlib.sha256(open(f'{t}/{SOURCE}', 'rb').read()).hexdigest())


def m_unversioned(t):
    edit_snippet(t, "    assign asset = 'producto-infografia-v3'\n", '')


def m_editor_override(t):
    edit_snippet(t, "if image != blank and key != 'infografia'", 'if image != blank')


def m_retired(t):
    # Una versión antigua (por su SHA-256) con cualquier nombre. Sin recuperar archivos de Git: se simula
    # registrando como retirado el SHA-256 de un archivo de prueba.
    p = f'{t}/theme/assets/copia-antigua.webp'
    Image.new('RGB', (8, 8), (200, 160, 90)).save(p, 'WEBP', lossless=True)
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()


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
    ('vuelve un archivo de la familia retirada (producto-infografia-480.webp)', m_old_family_file),
    ('referencia a la familia retirada (producto-infografia-1254.webp)', m_old_family_ref),
    ('el snippet deja de usar la familia versionada', m_unversioned),
    ('la imagen del editor vuelve a poder sustituir a la infografía', m_editor_override),
    ('una versión retirada (por SHA-256) con otro nombre', m_retired),
    ('vuelve un archivo de la familia v2 (producto-infografia-v2-480.webp)', m_v2_file),
    ('referencia a la familia v2 (producto-infografia-v2-1254.webp)', m_v2_ref),
    ('el snippet vuelve a la familia v2', m_snippet_v2),
    ('la versión anterior de «NUEVA IMAGEN 1.png» (SHA-256 retirado) vuelve como fuente', m_retired_source),
]


def run(t, retired=None):
    if retired:
        table = 'RETIRED_SOURCE_SHA256' if isinstance(retired, tuple) else 'RETIRED_SHA256'
        digest = retired[1] if isinstance(retired, tuple) else retired
        code = ('import sys; sys.dont_write_bytecode = True; sys.path.insert(0, sys.argv[1]); import garelon_infografia as g; '
                f"g.{table}[sys.argv[2]] = 'versión retirada (prueba)'; sys.exit(g.check(sys.argv[3], sys.argv[4]))")
        return subprocess.run([sys.executable, '-c', code, HERE, digest, f'{t}/theme', f'{t}/{SOURCE}'],
                              capture_output=True, text=True).returncode
    return subprocess.run([sys.executable, os.path.join(HERE, 'garelon_infografia.py'), '--check',
                           '--theme', f'{t}/theme', '--source', f'{t}/{SOURCE}'],
                          capture_output=True, text=True).returncode


def identify(f):
    return subprocess.run([sys.executable, os.path.join(HERE, 'garelon_infografia.py'), '--identify', f],
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
        retired = fn(t)
        caught = run(t, retired) != 0
        shutil.rmtree(t)
        print(('✓' if caught else '✗') + f' {name}: detectado')
        fails += not caught
    # --identify: lo que se descargue de la tienda se reconoce (0), o no (1 con pérdida, 2 distinto).
    t = fresh()
    a = asset(t, 1254)
    Image.open(a).convert('RGB').crop((25, 25, 1229, 1229)).save(f'{t}/recorte.png')
    Image.open(asset(t, 720)).convert('RGB').save(f'{t}/perdida.webp', 'WEBP', quality=80)
    Image.open(asset(t, 480)).save(f'{t}/copia.png')  # mismos píxeles, otros bytes (p. ej. una captura sin escalar)
    # Unas líneas finas de más (como las indicadoras que el propietario quitó), en una copia temporal con pérdida:
    # no basta con «parecerse»; las diferencias concentradas la delatan.
    im = Image.open(asset(t, 720)).convert('RGB')
    d = ImageDraw.Draw(im)
    d.line((140, 140, 330, 330), fill=(196, 150, 60), width=2)
    d.line((560, 160, 420, 260), fill=(196, 150, 60), width=2)
    d.ellipse((322, 322, 334, 334), fill=(255, 255, 255))
    im.save(f'{t}/lineas.webp', 'WEBP', quality=90)
    checks = [('--identify reconoce el WebP de 1254 (ES la fuente)', identify(a) == 0),
              ('--identify reconoce el WebP de 480 (ES la fuente)', identify(asset(t, 480)) == 0),
              ('--identify certifica una copia píxel a píxel con otros bytes (PNG)', identify(f'{t}/copia.png') == 0),
              ('--identify marca la versión con pérdida (no píxel a píxel)', identify(f'{t}/perdida.webp') == 1),
              ('--identify rechaza un recorte', identify(f'{t}/recorte.png') == 2),
              ('--identify rechaza una copia con líneas añadidas, aunque esté recomprimida', identify(f'{t}/lineas.webp') == 2)]
    shutil.rmtree(t)
    for name, good in checks:
        print(('✓' if good else '✗') + f' {name}')
        fails += not good
    total = len(MUTATIONS) + 1 + len(checks)
    print(f'{total - fails}/{total}')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
