#!/usr/bin/env python3
"""GARELON · infografía «Detalles de la pulsera»: única fuente → WebP del tema.

La ÚNICA fuente autorizada de la clave `infografia` es «NUEVA IMAGEN 1.png» (raíz del repo,
subida y aprobada por el propietario). Es inmutable: esta herramienta solo la lee, nunca la
reescribe. Su versión vigente es la que fija SOURCE_SHA256 (snapshot aprobado actual, D36: sin las
líneas indicadoras, que el propietario quitó a propósito). El único proceso permitido es:

    NUEVA IMAGEN 1.png → reducción proporcional (LANCZOS, solo si el ancho es menor) → WebP lossless

Sin IA, sin recorte, sin reencuadre, sin filtros y sin ampliar. Los anchos salen del snippet
`snippets/garelon-image.liquid` (when 'infografia'), no de esta herramienta.

Familia versionada (D35, D36): assets/producto-infografia-v3-<ancho>.webp. Cada versión de la fuente
tiene su propia familia, con un nombre (y una URL) que no se repite. Las familias anteriores
(producto-infografia-<ancho>.webp y producto-infografia-v2-<ancho>.webp) están retiradas: ni sus
archivos ni sus referencias pueden volver al tema, y el contenido de sus versiones se reconoce por su
SHA-256 (RETIRED_SHA256). Las versiones anteriores de la fuente, también (RETIRED_SOURCE_SHA256).

Uso:
  python3 tools/garelon_infografia.py --build           genera assets/producto-infografia-v3-<ancho>.webp
  python3 tools/garelon_infografia.py                   comprueba el repositorio (lo mismo que --check)
  python3 tools/garelon_infografia.py --check --theme CARPETA [--source PNG]
                                                        comprueba otra copia del tema (p. ej. el ZIP
                                                        descomprimido) contra la fuente del repo
  python3 tools/garelon_infografia.py --identify IMAGEN [IMAGEN…]
                                                        dice si una imagen (p. ej. descargada de la tienda)
                                                        es «NUEVA IMAGEN 1.png» o una versión antigua

Si el propietario sustituye la fuente: pasar el SHA-256 actual a RETIRED_SOURCE_SHA256 y la familia
actual a RETIRED_SHA256, poner el nuevo SOURCE_SHA256, subir la versión de la familia (v4…),
regenerar con --build y registrarlo en el Decision Log. Ninguna otra imagen (antiguas, de Git, de
otras ramas) puede usarse como fuente.
"""
import hashlib
import io
import os
import re
import sys

from PIL import Image, ImageChops, ImageFilter, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
KEY = 'infografia'
SOURCE = 'NUEVA IMAGEN 1.png'
# Snapshot aprobado actual (D36, 2026-10-06): la versión sin líneas indicadoras que el propietario subió a main
# (a173b6a, con el nombre «IMAGENN 1.png»), copiada byte a byte como «NUEVA IMAGEN 1.png».
SOURCE_SHA256 = '0e0ad4ea3ce30ddad5e66408ce3f37d8b85808655556248533dc00c6bc0700eb'
# Versiones anteriores de «NUEVA IMAGEN 1.png»: retiradas, nunca pueden volver a ser fuente.
RETIRED_SOURCE_SHA256 = {
    '3795161cabb89ae32b7a4d9ac9acb8b770dc76f62c5795817743a9a6ddb3db0e': 'versión anterior (main 4365050, D33-D35, con líneas indicadoras)',
}
SOURCE_SIZE = (1254, 1254)
OLD_SOURCES = ['Imagen 1.png']  # retiradas: nunca pueden volver a ser fuente
VERSION = 'v3'
ASSET = 'producto-%s-%s' % (KEY, VERSION)  # familia versionada (D35, D36): nombre nuevo, sin caché ni referencias antiguas
# Familias anteriores, retiradas (producto-infografia-<ancho> y producto-infografia-v2-<ancho>). Sus versiones
# (solo el SHA-256; los archivos no se recuperan) no pueden volver al tema con ningún nombre.
OLD_FAMILY = re.compile(r'producto-%s-(?!%s\b)' % (KEY, VERSION))
RETIRED_SHA256 = {
    'bdc7392adff6dd1fa5913ee52a3ee3a0b49ce59929d0b3c9e1ff6aef0c46abb4': 'producto-infografia-480.webp de «Imagen 1.png» (57ba415, flechas antiguas)',
    '2f921fe7ca7a2346d3f3fb0e74893940765b8c16522d39dd7b3aea341b6a6c79': 'producto-infografia-720.webp de «Imagen 1.png» (57ba415, flechas antiguas)',
    '1c6b594a79a5a4d08e70fa9f051f082184e0d33344e2cfb009ce34f4b5b27ff1': 'producto-infografia-1080.webp de «Imagen 1.png» (57ba415, flechas antiguas)',
    'e9ac0491fea35ddaecb38a69d40d9fde35fbd73d2ed3474c8d46fc3a28d60ff7': 'producto-infografia-1254.webp de «Imagen 1.png» (57ba415, flechas antiguas)',
    'c8aea2efb409a3242860ffa5cb721c08c426e122b5522e5be112c6c14fafa8dd': 'producto-infografia-480.webp con pérdida (27c3904, calidad 90)',
    'a1e5988ab5fcceabfcdd99cfc29370ad9bb1b46a09b4d2d9fc28d29ad8d8d738': 'producto-infografia-720.webp con pérdida (27c3904, calidad 90)',
    '53ec1fcfe1a47ce5dd35494ac13f1ec65182d67dd04b18585a53101a169c8f63': 'producto-infografia-1080.webp con pérdida (27c3904, calidad 90)',
    '0ff73dd250542fcb68876936972b0f05515a730ce1c35f751aa7203f9455dc04': 'producto-infografia-1254.webp con pérdida (27c3904, calidad 90)',
    'a903932c55442ac1cf8b5d7524b3595e9bc6511dffb62227966d94ea6cd9c917': 'producto-infografia-v2-480.webp de la fuente anterior (894ec79, con líneas indicadoras)',
    '707fd828d158ac2211b61bf2d800dc08d86c9197a50e55d8c5682e9e86b80195': 'producto-infografia-v2-720.webp de la fuente anterior (894ec79, con líneas indicadoras)',
    '1dc83de577d2140a864001b93665787add2dbd07a33a53edc51a7caaaeb0c89e': 'producto-infografia-v2-1080.webp de la fuente anterior (894ec79, con líneas indicadoras)',
    '956073f8ca2f8775550fd30820ac4a009703e211efd33660168d385ea2f5b530': 'producto-infografia-v2-1254.webp de la fuente anterior (894ec79, con líneas indicadoras)',
}
ENCODE = dict(lossless=True, quality=100, method=6)  # lossless: sin submuestreo de color en líneas y textos

# Zonas de la composición (fracciones del lado) que deben seguir exactamente en su sitio.
REGIONS = {
    'título «Detalles de la pulsera»': (0.20, 0.04, 0.80, 0.13),
    'círculo ampliado de la medalla': (0.07, 0.13, 0.27, 0.33),
    'círculo ampliado de la cruz': (0.74, 0.13, 0.94, 0.34),
    'etiqueta «Medalla de la Virgen María»': (0.02, 0.36, 0.20, 0.51),
    'etiqueta «Cruz de Jesús»': (0.80, 0.36, 0.97, 0.50),
    'pulsera (cierre, cuentas, cadena, medalla, cruz)': (0.24, 0.17, 0.75, 0.64),
    'centro de la pulsera': (0.32, 0.29, 0.69, 0.50),
    'texto «Aprox. 20 cm / 7,87 in»': (0.37, 0.38, 0.64, 0.43),
    'círculo ampliado de las cuentas': (0.05, 0.65, 0.24, 0.85),
    'círculo ampliado del cierre': (0.29, 0.65, 0.48, 0.85),
    'círculo ampliado de la cadena ajustable': (0.53, 0.65, 0.72, 0.85),
    'círculo ampliado del regalo': (0.77, 0.65, 0.96, 0.85),
    'etiquetas inferiores': (0.02, 0.84, 0.98, 0.96),
    'esquina superior izquierda (cinta)': (0.00, 0.00, 0.08, 0.08),
    'esquina superior derecha (flores)': (0.86, 0.00, 1.00, 0.14),
    'esquina inferior izquierda': (0.00, 0.92, 0.08, 1.00),
    'esquina inferior derecha': (0.92, 0.92, 1.00, 1.00),
}
# Tolerancias: lossless con el mismo Pillow da 0; el margen solo absorbe redondeos de otra versión
# de Pillow al reducir. Un recorte, desplazamiento, retoque o una fuente distinta da mucho más.
MAX_MEAN = 0.5
MAX_PIXEL = 16  # una flecha o línea desplazada deja diferencias de ~100/255 en sus píxeles
MAX_REGION_MEAN = 1.0
# Diferencias concentradas (algo añadido, quitado o movido: una línea, un punto, un texto): la diferencia en gris,
# con un filtro de mediana 3x3 que borra el ruido suelto de la compresión, por encima de 40/255. Calibrado con la
# fuente actual: recomprimida con pérdida (WebP o JPEG, calidad 60-90, 480-1254 px) da 0 por cada 10 000 píxeles;
# la misma imagen con unas líneas finas de más da 24-65. No depende de dónde estén esas líneas.
STRUCT_LEVEL = 40
MAX_STRUCT = 1.0  # por cada 10 000 píxeles


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def snippet_text(theme):
    return open(os.path.join(theme, 'snippets', 'garelon-image.liquid'), encoding='utf-8').read()


def widths(theme):
    m = re.search(r"when '%s'\s*assign widths = '([\d,]+)'" % KEY, snippet_text(theme))
    if not m:
        raise SystemExit("garelon-image.liquid no define los anchos de 'infografia'")
    return [int(w) for w in m.group(1).split(',')]


def asset_name(w):
    return f'{ASSET}-{w}.webp'


def reference(src, w):
    """La fuente al ancho w: idéntica si w es su ancho; si es menor, reducida en proporción. Nunca ampliada."""
    if w == src.width:
        return src
    return src.resize((w, round(src.height * w / src.width)), Image.LANCZOS)


def structural(a, b):
    """Píxeles (por cada 10 000) con una diferencia concentrada entre a y b: ver STRUCT_LEVEL."""
    d = ImageChops.difference(a, b).convert('L').filter(ImageFilter.MedianFilter(3))
    return sum(d.histogram()[STRUCT_LEVEL:]) * 1e4 / (a.width * a.height)


def load_source(path):
    if not os.path.isfile(path):
        raise SystemExit(f'FALTA la fuente aprobada: {path}')
    digest = sha256(path)
    if digest in RETIRED_SOURCE_SHA256:
        raise SystemExit(f'La fuente {path} es una versión RETIRADA ({RETIRED_SOURCE_SHA256[digest]}, SHA-256 {digest}); '
                         f'la aprobada es {SOURCE_SHA256}')
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
        dst = os.path.join(ROOT, 'assets', asset_name(w))
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
    expected = {asset_name(w) for w in ws}
    present = {f for f in os.listdir(assets) if KEY in f}
    if present != expected:
        errors.append(f'assets de la clave {KEY}: sobran {sorted(present - expected)}, faltan {sorted(expected - present)}')
    if max(ws) > src.width:
        errors.append(f'el ancho mayor {max(ws)} supera la fuente ({src.width}): ampliaría')
    report = []
    for w in ws:
        p = os.path.join(assets, asset_name(w))
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
        struct = structural(im, ref)
        if total > MAX_MEAN or peak > MAX_PIXEL or bad or struct > MAX_STRUCT:
            errors.append(f'{p}: no coincide con {SOURCE} (diferencia media {total:.3f}, máxima {peak}; zonas distintas: {bad}; '
                          f'diferencias concentradas {struct:.2f}/10 000 px)')
        if w == src.width and ImageChops.difference(im, src).getbbox() is not None:
            errors.append(f'{p}: al ancho de la fuente debe ser idéntico píxel a píxel')
        report.append(f'  {w}x{w}  {len(raw):>9} bytes  diferencia media {total:.3f}, máxima {peak}/255')
    for old in OLD_SOURCES:
        if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(source)), old)):
            errors.append(f'la fuente retirada «{old}» ha vuelto al repositorio')
    for fn in sorted(os.listdir(assets)):
        if sha256(os.path.join(assets, fn)) in RETIRED_SHA256:
            errors.append(f'assets/{fn}: es una versión retirada ({RETIRED_SHA256[sha256(os.path.join(assets, fn))]})')
    snippet = snippet_text(theme)
    if not re.search(r"if key == '%s'\s*assign asset = '%s'" % (KEY, ASSET), snippet):
        errors.append(f"garelon-image.liquid: la clave '{KEY}' no usa la familia versionada {ASSET}-<ancho>.webp")
    if not re.search(r"if image != blank and key != '%s'\s*assign use_editor = true" % KEY, snippet):
        errors.append(f"garelon-image.liquid: una imagen del editor podría sustituir a la infografía aprobada")
    for d in ['config', 'layout', 'locales', 'sections', 'snippets', 'templates', 'blocks']:
        for dp, _, fns in os.walk(os.path.join(theme, d)):
            for fn in fns:
                text = open(os.path.join(dp, fn), encoding='utf-8', errors='replace').read()
                if re.search(r'producto-infografia[^"\'\s]*\.(png|jpe?g)', text) or any(o in text for o in OLD_SOURCES):
                    errors.append(f'{os.path.join(dp, fn)}: referencia a un PNG/JPG o a la fuente retirada')
                if OLD_FAMILY.search(text):
                    errors.append(f'{os.path.join(dp, fn)}: referencia a la familia retirada producto-{KEY}-<ancho> (debe ser {ASSET}-<ancho>)')
    print(f'Fuente: {source}  {src.width}x{src.height}  SHA-256 {digest}')
    print('\n'.join(report))
    if errors:
        print('ERRORES:\n  ' + '\n  '.join(errors))
        return 1
    print(f'OK: {len(ws)} WebP lossless {ASSET}-<ancho> que salen solo de «{SOURCE}», sin recorte ni ampliación; '
          'ni la familia retirada ni sus versiones antiguas están en el tema')
    return 0


def identify(files, source):
    """Para una imagen sacada de la tienda (o de cualquier sitio): ¿es «NUEVA IMAGEN 1.png»?

    0 = byte a byte uno de los WebP del tema, o píxel a píxel la fuente reducida (certificado);
    1 = misma composición recomprimida (solo ruido de compresión: ninguna zona distinta y ninguna
        diferencia concentrada): no se certifica byte a byte, hay que usar el WebP original;
    2 = versión retirada, proporción distinta (recorte, deformación) o contenido distinto (algo
        añadido, quitado o movido, como unas líneas indicadoras).
    """
    src, _ = load_source(source)
    ours = {}
    for w in widths(ROOT):
        p = os.path.join(ROOT, 'assets', asset_name(w))
        if os.path.isfile(p):
            ours[sha256(p)] = asset_name(w)
    worst = 0
    for f in files:
        digest = sha256(f)
        im = Image.open(f)
        im.load()
        im = im.convert('RGB')
        if digest in ours:
            verdict, code = f'ES «{SOURCE}»: byte a byte assets/{ours[digest]}', 0
        elif digest in RETIRED_SHA256:
            verdict, code = f'VERSIÓN RETIRADA: {RETIRED_SHA256[digest]}', 2
        elif digest in RETIRED_SOURCE_SHA256:
            verdict, code = f'FUENTE RETIRADA: «{SOURCE}» {RETIRED_SOURCE_SHA256[digest]}', 2
        elif im.width * src.height != im.height * src.width:
            verdict, code = f'NO es la infografía aprobada: proporción {im.width}x{im.height} (recortada o deformada)', 2
        else:
            # A su mismo tamaño: la fuente reducida (o, solo para comparar, ampliada) con LANCZOS.
            ref = src if im.size == src.size else src.resize(im.size, Image.LANCZOS)
            total = mean_diff(im, ref)
            peak = max(e[1] for e in ImageChops.difference(im, ref).getextrema())
            regions = {}
            for name, (x0, y0, x1, y1) in REGIONS.items():
                box = (round(x0 * im.width), round(y0 * im.height), round(x1 * im.width), round(y1 * im.height))
                regions[name] = mean_diff(im.crop(box), ref.crop(box))
            bad = [f'{n} ({d:.1f})' for n, d in regions.items() if d > 10]
            struct = structural(im, ref)
            if total <= MAX_MEAN and peak <= MAX_PIXEL and max(regions.values()) <= MAX_REGION_MEAN and struct <= MAX_STRUCT:
                verdict, code = f'ES «{SOURCE}»: píxel a píxel (diferencia media {total:.2f}/255)', 0
            elif total <= 4 and not bad and struct <= MAX_STRUCT:
                verdict, code = (f'misma composición que «{SOURCE}», pero recomprimida (diferencia media {total:.2f}/255, '
                                 'sin diferencias concentradas): no se certifica byte a byte; usa el WebP original'), 1
            else:
                verdict, code = (f'NO coincide con «{SOURCE}» (diferencia media {total:.2f}/255; zonas distintas: {bad or "ninguna"}; '
                                 f'diferencias concentradas {struct:.1f}/10 000 px: algo añadido, quitado o movido)'), 2
        worst = max(worst, code)
        print(f'{f}: {im.width}x{im.height}, SHA-256 {digest[:16]}… → {verdict}')
    return worst


def main(argv):
    if '--identify' in argv:
        files = [a for a in argv[argv.index('--identify') + 1:] if not a.startswith('--')]
        return identify(files, os.path.join(ROOT, SOURCE))
    if '--build' in argv:
        build()
        return check(ROOT, os.path.join(ROOT, SOURCE))
    theme = argv[argv.index('--theme') + 1] if '--theme' in argv else ROOT
    source = argv[argv.index('--source') + 1] if '--source' in argv else os.path.join(ROOT, SOURCE)
    return check(theme, source)


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
