#!/usr/bin/env python3
"""GARELON · infografía «Detalles de la pulsera»: única fuente → WebP del tema.

La ÚNICA fuente autorizada de la clave `infografia` es «NUEVA IMAGEN 1.png» (raíz del repo,
subida y aprobada por el propietario). Es inmutable: esta herramienta solo la lee, nunca la
reescribe. El único proceso permitido es:

    NUEVA IMAGEN 1.png → reducción proporcional (LANCZOS, solo si el ancho es menor) → WebP lossless

Sin IA, sin recorte, sin reencuadre, sin filtros y sin ampliar. Los anchos salen del snippet
`snippets/garelon-image.liquid` (when 'infografia'), no de esta herramienta.

Uso:
  python3 tools/garelon_infografia.py --build           genera assets/producto-infografia-<ancho>.webp
  python3 tools/garelon_infografia.py                   comprueba el repositorio (lo mismo que --check)
  python3 tools/garelon_infografia.py --check --theme CARPETA [--source PNG]
                                                        comprueba otra copia del tema (p. ej. el ZIP
                                                        descomprimido) contra la fuente del repo

Si el propietario sustituye la fuente, hay que actualizar SOURCE_SHA256 aquí, regenerar con
--build y registrarlo en el Decision Log. Ninguna otra imagen (antiguas, de Git, de otras ramas)
puede usarse como fuente.
"""
import hashlib
import io
import os
import re
import sys

from PIL import Image, ImageChops, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
KEY = 'infografia'
SOURCE = 'NUEVA IMAGEN 1.png'
SOURCE_SHA256 = '3795161cabb89ae32b7a4d9ac9acb8b770dc76f62c5795817743a9a6ddb3db0e'  # main 4365050, aprobada
SOURCE_SIZE = (1254, 1254)
OLD_SOURCES = ['Imagen 1.png']  # retiradas: nunca pueden volver a ser fuente
ENCODE = dict(lossless=True, quality=100, method=6)  # lossless: sin submuestreo de color en líneas y textos

# Zonas de la composición (fracciones del lado) que deben seguir exactamente en su sitio.
REGIONS = {
    'título «Detalles de la pulsera»': (0.20, 0.04, 0.80, 0.13),
    'círculo ampliado de la medalla': (0.07, 0.13, 0.27, 0.33),
    'círculo ampliado de la cruz': (0.74, 0.13, 0.94, 0.34),
    'etiqueta «Medalla de la Virgen María»': (0.02, 0.36, 0.20, 0.51),
    'etiqueta «Cruz de Jesús»': (0.80, 0.36, 0.97, 0.50),
    'pulsera (cierre, cuentas, cadena, medalla, cruz)': (0.24, 0.17, 0.75, 0.64),
    'círculo central punteado': (0.32, 0.29, 0.69, 0.50),
    'texto «Aprox. 20 cm / 7,87 in»': (0.37, 0.38, 0.64, 0.43),
    'círculo ampliado de las cuentas': (0.05, 0.65, 0.24, 0.85),
    'círculo ampliado del cierre': (0.29, 0.65, 0.48, 0.85),
    'círculo ampliado de la cadena ajustable': (0.53, 0.65, 0.72, 0.85),
    'círculo ampliado del regalo': (0.77, 0.65, 0.96, 0.85),
    'etiquetas inferiores': (0.02, 0.84, 0.98, 0.96),
}
# Tolerancias: lossless con el mismo Pillow da 0; el margen solo absorbe redondeos de otra versión
# de Pillow al reducir. Un recorte, desplazamiento, retoque o una fuente distinta da mucho más.
MAX_MEAN = 0.5
MAX_PIXEL = 16  # una flecha o línea desplazada deja diferencias de ~100/255 en sus píxeles
MAX_REGION_MEAN = 1.0


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def widths(theme):
    snippet = open(os.path.join(theme, 'snippets', 'garelon-image.liquid'), encoding='utf-8').read()
    m = re.search(r"when '%s'\s*assign widths = '([\d,]+)'" % KEY, snippet)
    if not m:
        raise SystemExit("garelon-image.liquid no define los anchos de 'infografia'")
    return [int(w) for w in m.group(1).split(',')]


def reference(src, w):
    """La fuente al ancho w: idéntica si w es su ancho; si es menor, reducida en proporción. Nunca ampliada."""
    if w == src.width:
        return src
    return src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)


def load_source(path):
    if not os.path.isfile(path):
        raise SystemExit(f'FALTA la fuente aprobada: {path}')
    digest = sha256(path)
    if digest != SOURCE_SHA256:
        raise SystemExit(f'La fuente {path} no es la aprobada (SHA-256 {digest}, esperado {SOURCE_SHA256})')
    src = Image.open(path)
    src.load()
    if src.size != SOURCE_SIZE:
        raise SystemExit(f'Dimensiones de la fuente {src.size}, esperadas {SOURCE_SIZE}')
    return src.convert('RGB'), digest


def mean_diff(a, b):
    return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3


def build():
    path = os.path.join(ROOT, SOURCE)
    src, before = load_source(path)
    ws = widths(ROOT)
    if max(ws) > src.width:
        raise SystemExit(f'Anchos {ws}: ampliaría por encima de {src.width} px')
    for w in ws:
        dst = os.path.join(ROOT, 'assets', f'producto-{KEY}-{w}.webp')
        buf = io.BytesIO()
        reference(src, w).save(buf, 'WEBP', **ENCODE)
        with open(dst, 'wb') as f:
            f.write(buf.getvalue())
        print(f'{dst}: {w}x{w}, {buf.tell()} bytes')
    after = sha256(path)
    if after != before:
        raise SystemExit('LA FUENTE HA CAMBIADO DURANTE LA CONVERSIÓN')
    print(f'Fuente intacta: {SOURCE} SHA-256 {after}')


def check(theme, source):
    errors = []
    src, digest = load_source(source)
    ws = widths(theme)
    assets = os.path.join(theme, 'assets')
    expected = {f'producto-{KEY}-{w}.webp' for w in ws}
    present = {f for f in os.listdir(assets) if KEY in f}
    if present != expected:
        errors.append(f'assets de la clave {KEY}: sobran {sorted(present - expected)}, faltan {sorted(expected - present)}')
    if max(ws) > src.width:
        errors.append(f'el ancho mayor {max(ws)} supera la fuente ({src.width}): ampliaría')
    report = []
    for w in ws:
        p = os.path.join(assets, f'producto-{KEY}-{w}.webp')
        if not os.path.isfile(p):
            continue
        raw = open(p, 'rb').read()
        if raw[:4] != b'RIFF' or raw[8:12] != b'WEBP' or raw[12:16] != b'VP8L':
            errors.append(f'{p}: no es WebP lossless')
        im = Image.open(p)
        im.load()
        ref = reference(src, w)
        if im.size != ref.size or im.width * src.height != im.height * src.width:
            errors.append(f'{p}: {im.size}, esperado {ref.size} (misma proporción que la fuente, sin recorte)')
            continue
        im = im.convert('RGB')
        total = mean_diff(im, ref)
        peak = max(e[1] for e in ImageChops.difference(im, ref).getextrema())
        bad = []
        for name, (x0, y0, x1, y1) in REGIONS.items():
            box = (round(x0 * w), round(y0 * w), round(x1 * w), round(y1 * w))
            if mean_diff(im.crop(box), ref.crop(box)) > MAX_REGION_MEAN:
                bad.append(name)
        if total > MAX_MEAN or peak > MAX_PIXEL or bad:
            errors.append(f'{p}: no coincide con {SOURCE} (diferencia media {total:.3f}, máxima {peak}; zonas distintas: {bad})')
        if w == src.width and ImageChops.difference(im, src).getbbox() is not None:
            errors.append(f'{p}: al ancho de la fuente debe ser idéntico píxel a píxel')
        report.append(f'  {w}x{w}  {len(raw):>9} bytes  diferencia media {total:.3f}, máxima {peak}/255')
    for old in OLD_SOURCES:
        if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(source)), old)):
            errors.append(f'la fuente retirada «{old}» ha vuelto al repositorio')
    for d in ['config', 'layout', 'locales', 'sections', 'snippets', 'templates']:
        for dp, _, fns in os.walk(os.path.join(theme, d)):
            for fn in fns:
                text = open(os.path.join(dp, fn), encoding='utf-8', errors='replace').read()
                if re.search(r'producto-infografia[^"\'\s]*\.(png|jpe?g)', text) or any(o in text for o in OLD_SOURCES):
                    errors.append(f'{os.path.join(dp, fn)}: referencia a un PNG/JPG o a la fuente retirada')
    print(f'Fuente: {source}  {src.width}x{src.height}  SHA-256 {digest}')
    print('\n'.join(report))
    if errors:
        print('ERRORES:\n  ' + '\n  '.join(errors))
        return 1
    print(f'OK: {len(ws)} WebP lossless de «{KEY}» que salen solo de «{SOURCE}», sin recorte ni ampliación')
    return 0


def main(argv):
    if '--build' in argv:
        build()
        return check(ROOT, os.path.join(ROOT, SOURCE))
    theme = argv[argv.index('--theme') + 1] if '--theme' in argv else ROOT
    source = argv[argv.index('--source') + 1] if '--source' in argv else os.path.join(ROOT, SOURCE)
    return check(theme, source)


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
