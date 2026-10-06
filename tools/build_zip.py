#!/usr/bin/env python3
"""GARELON · genera el ZIP del tema SOLO si pasa la validación de instalabilidad.

1. Ejecuta tools/garelon_check.py sobre el repositorio y tools/garelon_infografia.py (la infografía
   es solo la familia producto-infografia-v3-*, que sale de «NUEVA IMAGEN 1.png» en WebP lossless,
   sin recorte; ni las familias retiradas ni sus versiones antiguas). Si algo falla, no hay ZIP.
2. Empaqueta únicamente assets/ config/ layout/ locales/ sections/ snippets/ templates/
   en la raíz del ZIP (sin carpeta contenedora, sin ocultos, sin .md, sin docs ni tools).
   Fechas fijas: el mismo árbol da siempre el mismo SHA-256.
3. Descomprime el ZIP en una carpeta temporal NUEVA, vuelve a validar esa copia con
   --strict-root, comprueba sus WebP de la infografía contra la fuente del repo y compara byte
   a byte con el repositorio. Si algo falla, borra el ZIP.

Uso: python3 tools/build_zip.py SALIDA.zip
"""
import hashlib
import os
import subprocess
import sys
import tempfile
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']
FIXED_DATE = (2026, 1, 1, 0, 0, 0)


def check(path, *extra):
    r = subprocess.run([sys.executable, os.path.join(HERE, 'garelon_check.py'), path, *extra])
    return r.returncode == 0


def check_infografia(theme):
    r = subprocess.run([sys.executable, os.path.join(HERE, 'garelon_infografia.py'), '--check', '--theme', theme,
                        '--source', os.path.join(ROOT, 'NUEVA IMAGEN 1.png')])
    return r.returncode == 0


def theme_files(root):
    files = []
    for d in THEME_DIRS:
        for dp, dns, fns in os.walk(os.path.join(root, d)):
            dns[:] = sorted(x for x in dns if not x.startswith('.'))
            for fn in sorted(fns):
                if fn.startswith('.') or fn.lower().endswith('.md'):
                    continue
                files.append(os.path.relpath(os.path.join(dp, fn), root).replace(os.sep, '/'))
    return files


def fail(msg, out=None):
    print('✗ ' + msg)
    if out and os.path.exists(out):
        os.remove(out)
    sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    out = os.path.abspath(sys.argv[1])
    print('== 1/3 Validación del repositorio')
    if not check(ROOT):
        fail('el tema no pasa garelon_check: NO se genera el ZIP')
    if not check_infografia(ROOT):
        fail('la infografía no sale fielmente de «NUEVA IMAGEN 1.png»: NO se genera el ZIP')

    print('== 2/3 Empaquetado')
    files = theme_files(ROOT)
    if os.path.exists(out):
        os.remove(out)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for rel in files:
            info = zipfile.ZipInfo(rel, FIXED_DATE)
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            with open(os.path.join(ROOT, rel), 'rb') as fh:
                z.writestr(info, fh.read())

    print('== 3/3 Validación del ZIP descomprimido en una carpeta nueva')
    with zipfile.ZipFile(out) as z:
        names = z.namelist()
        tops = sorted({n.split('/')[0] for n in names})
        if tops != THEME_DIRS:
            fail(f'raíz del ZIP inesperada: {tops}', out)
        if 'templates/index.json' not in names or 'layout/theme.liquid' not in names:
            fail('el ZIP no contiene templates/index.json o layout/theme.liquid', out)
        if any(n.lower().endswith('.md') or '/.' in '/' + n for n in names):
            fail('el ZIP contiene markdown u ocultos', out)
        with tempfile.TemporaryDirectory(prefix='garelon-unzip-') as tmp:
            z.extractall(tmp)
            if not check(tmp, '--strict-root'):
                fail('la copia descomprimida no pasa garelon_check', out)
            if not check_infografia(tmp):
                fail('los WebP de la infografía del ZIP no salen fielmente de «NUEVA IMAGEN 1.png»', out)
            for rel in files:
                a = open(os.path.join(ROOT, rel), 'rb').read()
                b = open(os.path.join(tmp, rel), 'rb').read()
                if a != b:
                    fail(f'{rel} difiere entre el repositorio y el ZIP', out)
            extracted = sorted(theme_files(tmp))
            if extracted != sorted(files):
                fail('la lista de archivos del ZIP no coincide con el repositorio', out)

    sha = hashlib.sha256(open(out, 'rb').read()).hexdigest()
    print(f'OK · {os.path.basename(out)} · {len(files)} archivos · {os.path.getsize(out)} bytes')
    print(f'SHA-256 {sha}')


if __name__ == '__main__':
    main()
