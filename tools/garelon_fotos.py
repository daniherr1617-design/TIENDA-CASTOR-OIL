#!/usr/bin/env python3
"""GARELON · fotos del producto: las tres imágenes aprobadas → WebP del tema (D47).

Desde D47 (2026-10-15) la tienda usa ÚNICAMENTE las tres imágenes que el propietario subió a main
(8ee1206) y se copiaron byte a byte a la raíz del repo:

    IMAGEN 1.png → completa   (pulsera entera sobre marfil)
    IMAGEN 2.png → oracion    (pulsera puesta, mano en la muñeca)
    IMAGEN 3.png → principal  (pulsera en la muñeca con medalla y cruz)

Las fuentes son inmutables: esta herramienta solo las lee. El único proceso permitido es la
reducción proporcional (LANCZOS, nunca ampliar) a los anchos de `snippets/garelon-image.liquid` y la
codificación WebP (calidad 82). Sin IA, sin recorte, sin retoque y sin filtros.

La infografía («NUEVA IMAGEN 1.png», familia producto-infografia-v4) y las fuentes anteriores
(«NUEVA IMAGEN 3.png», «NUEVA IMAGEN 4.png», «imagen 2.png»…) están retiradas: ni sus archivos ni sus
referencias pueden volver al tema.

Uso:
  python3 tools/garelon_fotos.py --build                  genera assets/producto-<clave>-<ancho>.webp
  python3 tools/garelon_fotos.py [--check]                comprueba el repositorio
  python3 tools/garelon_fotos.py --check --theme CARPETA  comprueba otra copia del tema (p. ej. el ZIP
                                                          descomprimido) contra las fuentes del repo
"""
import hashlib
import os
import re
import sys

from PIL import Image, ImageChops, ImageStat

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
# clave → (fuente en la raíz, SHA-256 de la subida del propietario a main 8ee1206)
SOURCES = {
    'completa': ('IMAGEN 1.png', 'ffdf23100fd1e1f1e99b6c6c92ab6c2e850ff9b28d9eb9a68062b1b1a9d82e28'),
    'oracion': ('IMAGEN 2.png', 'f6867f4f2c6a4b3200bea73eca40dc13b484ab6984923b74fd6e69ccf031e273'),
    'principal': ('IMAGEN 3.png', 'fa7904239cdb7f31a9d0f7e3671114016662c5af83b94f86318ce56fff8f5ee1'),
    # D53: cuarta foto, subida por el propietario a main (667668c) el 2026-10-19.
    'estuche': ('IMAGEN CON CAJA.png', 'c4787d295d1e67063bf5899579284df0150bf4d928fcd3faae2c7ee84426f115'),
}
RETIRED_SOURCES = ['NUEVA IMAGEN 1.png', 'NUEVA IMAGEN 3.png', 'NUEVA IMAGEN 4.png', 'imagen 2.png',
                   'imagen 3.png', 'imagen 4.png', 'Imagen 1.png', 'IMAGENN 1.png']
ENCODE = dict(quality=82, method=6)
MAX_MEAN = 3.0  # diferencia media máxima (0-255) con la fuente reducida: WebP con pérdida, nada más
THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']


def sha(path):
    return hashlib.sha256(open(path, 'rb').read()).hexdigest()


def widths(theme):
    src = open(os.path.join(theme, 'snippets', 'garelon-image.liquid'), encoding='utf-8').read()
    return {k: [int(w) for w in ws.split(',')] for k, ws in re.findall(r"when '([\w-]+)'\s*assign widths = '([\d,]+)'", src)}


def build():
    ws = widths(ROOT)
    for key, (name, _) in SOURCES.items():
        src = Image.open(os.path.join(ROOT, name)).convert('RGB')
        for w in ws[key]:
            if w > src.width:
                sys.exit(f'✗ {key}: {w} px ampliaría «{name}» ({src.width} px)')
            h = round(src.height * w / src.width)
            src.resize((w, h), Image.LANCZOS).save(os.path.join(ROOT, 'assets', f'producto-{key}-{w}.webp'), 'WEBP', **ENCODE)
            print(f'  producto-{key}-{w}.webp ← {name}')


def check(theme, source_root):
    errors = []
    ws = widths(theme)
    if sorted(ws) != sorted(SOURCES):
        errors.append(f'snippets/garelon-image.liquid: claves {sorted(ws)}; se esperaban solo {sorted(SOURCES)}')
    for key, (name, digest) in SOURCES.items():
        path = os.path.join(source_root, name)
        if not os.path.exists(path):
            errors.append(f'falta la fuente «{name}»')
            continue
        if sha(path) != digest:
            errors.append(f'«{name}» no es la imagen aprobada (SHA-256 distinto)')
            continue
        src = Image.open(path).convert('RGB')
        for w in ws.get(key, []):
            f = os.path.join(theme, 'assets', f'producto-{key}-{w}.webp')
            if not os.path.exists(f):
                errors.append(f'falta assets/producto-{key}-{w}.webp')
                continue
            a = Image.open(f)
            h = round(src.height * w / src.width)
            if a.size != (w, h) or w > src.width:
                errors.append(f'producto-{key}-{w}.webp mide {a.size}, se esperaba {(w, h)} sin ampliar')
                continue
            ref = src.resize((w, h), Image.LANCZOS)
            mean = sum(ImageStat.Stat(ImageChops.difference(a.convert('RGB'), ref)).mean) / 3
            if mean > MAX_MEAN:
                errors.append(f'producto-{key}-{w}.webp no es la reducción de «{name}» (diferencia media {mean:.2f}/255)')
            else:
                print(f'  ok producto-{key}-{w}.webp ← {name} (diferencia media {mean:.2f}/255)')
    # Nada de la infografía ni de fotos que no sean de estas tres claves.
    for f in sorted(os.listdir(os.path.join(theme, 'assets'))):
        m = re.match(r'producto-([a-z]+)-', f)
        if m and m.group(1) not in SOURCES:
            errors.append(f'assets/{f}: foto retirada (solo {", ".join(sorted(SOURCES))})')
    for d in THEME_DIRS:
        for dp, _, fns in os.walk(os.path.join(theme, d)):
            for fn in fns:
                if not fn.endswith(('.liquid', '.json', '.css', '.js')):
                    continue
                txt = open(os.path.join(dp, fn), encoding='utf-8', errors='replace').read()
                rel = os.path.relpath(os.path.join(dp, fn), theme)
                if re.search(r'producto-infografia|alt_infografia|\binfografia\b', txt):
                    errors.append(f'{rel}: referencia a la infografía retirada')
                for old in RETIRED_SOURCES:
                    if old in txt:
                        errors.append(f'{rel}: referencia a la fuente retirada «{old}»')
    if source_root == ROOT:
        for old in RETIRED_SOURCES:
            if os.path.exists(os.path.join(ROOT, old)):
                errors.append(f'la fuente retirada «{old}» sigue en la raíz del repositorio')
    return errors


def main(argv):
    if '--build' in argv:
        build()
    theme = ROOT
    if '--theme' in argv:
        theme = os.path.abspath(argv[argv.index('--theme') + 1])
    errors = check(theme, ROOT)
    for e in errors:
        print('✗ ' + e)
    if errors:
        print(f'ERROR · {len(errors)} problema(s) en las fotos del producto ({theme})')
        return 1
    print(f'OK · fotos del producto: solo IMAGEN 1/2/3 e IMAGEN CON CAJA, reducidas sin ampliar ni retocar ({theme})')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
