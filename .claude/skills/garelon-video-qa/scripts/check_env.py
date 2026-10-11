"""Report which dependencies are present. Never installs anything."""
from __future__ import annotations

import importlib
import shutil
import subprocess
import sys

INSTALL_HINT = """Instalación sugerida (NO se ejecuta automáticamente):
  python3 -m venv .venv-qa
  .venv-qa/bin/pip install "opencv-python-headless==4.*" numpy pillow
  # y ejecutar la skill con .venv-qa/bin/python"""


def main() -> int:
    ok = True
    for tool in ("ffmpeg", "ffprobe"):
        path = shutil.which(tool)
        if not path:
            print(f"✘ {tool}: no encontrado")
            ok = False
            continue
        ver = subprocess.run([tool, "-version"], capture_output=True, text=True).stdout.splitlines()[0]
        print(f"✔ {tool}: {ver}")
    if shutil.which("ffmpeg"):
        filters = subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True, text=True).stdout
        for flt in ("ssim", "psnr", "scdet", "freezedetect", "blackdetect", "signalstats"):
            mark = "✔" if f" {flt} " in filters else "✘"
            ok &= mark == "✔"
            print(f"  {mark} filtro {flt}")
        print(f"  {'✔' if ' libvmaf ' in filters else '–'} libvmaf (opcional, VMAF)")
    print(f"✔ python {sys.version.split()[0]} ({sys.executable})")
    for mod in ("cv2", "numpy", "PIL"):
        try:
            m = importlib.import_module(mod)
            print(f"✔ {mod} {getattr(m, '__version__', '')}")
        except ImportError:
            print(f"✘ {mod}: falta")
            ok = False
    try:
        importlib.import_module("lpips")
        print("– lpips instalado (no usado en v1)")
    except ImportError:
        print("– lpips: no instalado (previsto para v2)")
    if not ok:
        print("\n" + INSTALL_HINT)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
