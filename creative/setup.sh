#!/usr/bin/env bash
# Instala el GARELON Creative Lab. Idempotente: se puede ejecutar en cada sesión nueva.
#   creative/setup.sh                 dependencias (Remotion + faster-whisper)
#   creative/setup.sh --model small   además descarga un modelo de Whisper (necesita huggingface.co / *.hf.co)
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODEL=""
[ "${1:-}" = "--model" ] && MODEL="${2:?falta el nombre del modelo}"

ok()   { printf '  \033[32m✔\033[0m %s\n' "$*"; }
fail() { printf '  \033[31m✘\033[0m %s\n' "$*"; exit 1; }

echo "1/4 Herramientas del sistema"
command -v ffmpeg >/dev/null && ok "$(ffmpeg -version | head -1 | cut -d' ' -f1-3)" || fail "falta ffmpeg"
command -v ffprobe >/dev/null || fail "falta ffprobe"
command -v node >/dev/null || fail "falta Node.js (≥ 18)"
[ "$(node -p 'process.versions.node.split(".")[0]')" -ge 18 ] && ok "node $(node -v)" || fail "Node.js ≥ 18"
command -v python3 >/dev/null && ok "$(python3 --version)" || fail "falta python3"

echo "2/4 Remotion (versiones fijadas en package-lock.json)"
( cd "$DIR/remotion" && npm ci --no-audit --no-fund --loglevel=error ) && ok "remotion $(node -p "require('$DIR/remotion/node_modules/remotion/package.json').version")"

echo "3/4 faster-whisper en creative/.venv"
if command -v uv >/dev/null; then
  [ -x "$DIR/.venv/bin/python" ] || uv venv -q "$DIR/.venv"
  uv pip install -q --python "$DIR/.venv/bin/python" -r "$DIR/requirements.txt"
else
  [ -x "$DIR/.venv/bin/python" ] || python3 -m venv "$DIR/.venv"
  "$DIR/.venv/bin/pip" install -q -r "$DIR/requirements.txt"
fi
ok "faster-whisper $("$DIR/.venv/bin/python" -I -c 'import faster_whisper; print(faster_whisper.__version__)')"

echo "4/4 Carpetas de trabajo (fuera de git)"
mkdir -p "$DIR/media/00_originales" "$DIR/media/01_intermedio" "$DIR/media/02_renders" "$DIR/media/03_finales" "$DIR/.cache/whisper"
ok "creative/media/{00_originales,01_intermedio,02_renders,03_finales}"

if [ -n "$MODEL" ]; then
  echo "Modelo Whisper: $MODEL"
  "$DIR/.venv/bin/python" -I -c "
from faster_whisper import WhisperModel
WhisperModel('$MODEL', device='cpu', compute_type='int8', download_root='$DIR/.cache/whisper')
print('  modelo listo')" || fail "no se pudo descargar: permite huggingface.co y *.hf.co en la red del entorno"
fi
echo "Listo. Prueba: creative/lab --help"
