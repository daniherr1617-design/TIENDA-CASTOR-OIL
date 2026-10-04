#!/usr/bin/env bash
# GARELON · bootstrap del stack externo de skills para Claude Code.
#
# Lo ejecuta el hook SessionStart de .claude/settings.json en cada arranque
# (startup/resume). Todo se instala a nivel de usuario (HOME, caché de npm/pip,
# ~/.claude); nada se escribe dentro del repositorio.
#
# - Fast path: si el stack ya está completo, sale en ~1 s sin instalar nada.
# - Si falta algo, instala solo esa pieza, con versiones fijadas.
# - Lock con flock (o directorio atómico): un único bootstrap a la vez.
# - Sin credenciales, sin login, sin Shopify auth, sin cuentas externas.
# - Salida 0 = stack completo. Salida 1 = falta una pieza esencial (ERROR).
#
# Jerarquía: las skills externas nunca sobrescriben las reglas GARELON;
# .claude/skills/garelon-ecommerce-operator sigue siendo el orquestador.

set -u
umask 022

# Evitar recursión: una ejecución anidada (p. ej. desde un comando lanzado por
# el propio bootstrap) sale inmediatamente.
if [ -n "${GARELON_BOOTSTRAP_ACTIVE:-}" ]; then exit 0; fi
export GARELON_BOOTSTRAP_ACTIVE=1

# El hook entrega JSON por stdin; se descarta sin bloquear si es un terminal.
[ -t 0 ] || cat >/dev/null 2>&1 || true

# Privacidad y ruido para los procesos que lanza este script.
export SHOPIFY_CLI_NO_ANALYTICS=1 OPT_OUT_INSTRUMENTATION=true DO_NOT_TRACK=1 DISABLE_TELEMETRY=1
export npm_config_update_notifier=false npm_config_fund=false npm_config_audit=false
export PIP_DISABLE_PIP_VERSION_CHECK=1 GIT_TERMINAL_PROMPT=0

# --- Versiones fijadas (verificadas) ----------------------------------------
SHOPIFY_CLI_VERSION=4.8.4
PLAYWRIGHT_VERSION=1.56.0
SKILLS_CLI=skills@1.7.0
LIQUID_MARKETPLACE=Shopify/liquid-skills            # sin tags; se comprueba el commit
LIQUID_COMMIT=ae3e4cc3f454923e388bbd841fd931f0c7bf5be4
TOOLKIT_MARKETPLACE='Shopify/shopify-ai-toolkit#v2.1.0'   # tag v2.1.0 = 8692e6a
TOOLKIT_COMMIT=8692e6a449ff7f088a0c3883a357688aba9a3235
PLUGINS="liquid-skills@liquid-skills liquid-lsp@liquid-skills shopify-plugin@shopify-ai-toolkit"

# repo|commit|skills
SKILL_SOURCES="
anthropics/skills|8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4|webapp-testing frontend-design
coreyhaines31/marketingskills|dda3841f0b294e01e93b1541486beefbfab0915e|product-marketing cro copywriting analytics seo-audit schema ads ad-creative ab-testing customer-research pricing offers social
mardab96/ecommerce-claude-skills|969f3b2381a395de9f4b216dfd0b0557794dc0fc|product-page-conversion-review-ecommerce checkout-friction-finder-ecommerce launch-readiness-check-ecommerce review-objection-miner-ecommerce paid-traffic-waste-triage-ecommerce
nexscope-ai/eCommerce-Skills|ee0fb29433d02ccc22e3e6cea9ab4586d49fd42e|dropshipping-product-research market-gap-analysis
"
REFS_REPO=mardab96/ecommerce-claude-skills
REFS_COMMIT=969f3b2381a395de9f4b216dfd0b0557794dc0fc
REFS_FILES="output-standard.md getting-your-data.md"
# skill-creator llega sincronizada desde Claude.ai: no se instala aquí.

SKILLS_DIR="$HOME/.claude/skills"
OPT_OUT="$HOME/.config/shopify-ai-toolkit/opt-out"
STATE_DIR="$HOME/.cache/garelon-stack"
LOG="$STATE_DIR/bootstrap.log"
mkdir -p "$STATE_DIR"

say() { printf '%s\n' "$*"; }
log() { printf '[%s] %s\n' "$(date -u +%H:%M:%S)" "$*" >> "$LOG"; }

# --- Privacidad: opt-out del Shopify AI Toolkit, antes de cualquier uso ------
ensure_opt_out() {
  mkdir -p "$(dirname "$OPT_OUT")" || return 1
  if [ ! -f "$OPT_OUT" ]; then
    : > "$OPT_OUT"
  elif grep -qiE '^[[:space:]]*(false|0|no|off)[[:space:]]*$' "$OPT_OUT" 2>/dev/null; then
    : > "$OPT_OUT"   # un contenido "false/0/no/off" anularía el opt-out
  fi
  [ -f "$OPT_OUT" ]
}

# --- Comprobaciones (sin red) ------------------------------------------------
cli_ok() {
  local bin pkg
  bin=$(command -v shopify 2>/dev/null) || return 1
  pkg="$(dirname "$(readlink -f "$bin")")/../package.json"
  [ -f "$pkg" ] && grep -q "\"version\": \"$SHOPIFY_CLI_VERSION\"" "$pkg"
}
playwright_ok() {
  [ "$(python3 -c 'import importlib.metadata as m; print(m.version("playwright"))' 2>/dev/null)" = "$PLAYWRIGHT_VERSION" ] \
    && python3 -c 'import playwright.sync_api' >/dev/null 2>&1
}
# Imprime los plugins que faltan (instalados + habilitados + carpeta presente).
missing_plugins() {
  python3 - "$HOME" $PLUGINS <<'PY' 2>/dev/null || printf '%s\n' $PLUGINS
import json, os, sys
home, wanted = sys.argv[1], sys.argv[2:]
def load(p):
    try:
        with open(p) as f: return json.load(f)
    except Exception: return {}
inst = load(os.path.join(home, ".claude/plugins/installed_plugins.json")).get("plugins", {})
enabled = load(os.path.join(home, ".claude/settings.json")).get("enabledPlugins", {})
for p in wanted:
    entries = [e for e in inst.get(p, []) if e.get("scope") == "user"]
    ok = bool(entries) and os.path.isdir(entries[0].get("installPath", "")) and enabled.get(p) is True
    if not ok: print(p)
PY
}
plugin_commit() {
  python3 - "$HOME" "$1" <<'PY' 2>/dev/null
import json, os, sys
p = os.path.join(sys.argv[1], ".claude/plugins/installed_plugins.json")
try: e = json.load(open(p))["plugins"][sys.argv[2]][0]; print(e.get("gitCommitSha", ""))
except Exception: print("")
PY
}
toolkit_skill_dir() {
  find "$HOME/.claude/plugins/cache/shopify-ai-toolkit" -type d -path '*/skills/shopify' 2>/dev/null | sort -V | tail -1
}
validator_ok() {
  local d; d=$(toolkit_skill_dir)
  [ -n "$d" ] && [ -d "$d/node_modules" ]
}
missing_skills() {
  local skills s
  printf '%s\n' "$SKILL_SOURCES" | while IFS='|' read -r _ _ skills; do
    for s in $skills; do [ -f "$SKILLS_DIR/$s/SKILL.md" ] || echo "$s"; done
  done
}
refs_ok() {
  local f
  for f in $REFS_FILES; do [ -s "$SKILLS_DIR/references/$f" ] || return 1; done
}

stack_complete() {
  [ -f "$OPT_OUT" ] && cli_ok && playwright_ok && [ -z "$(missing_plugins)" ] \
    && validator_ok && [ -z "$(missing_skills)" ] && refs_ok
}

skill_count() {
  local n=0 skills s
  while IFS='|' read -r _ _ skills; do
    for s in $skills; do [ -f "$SKILLS_DIR/$s/SKILL.md" ] && n=$((n + 1)); done
  done <<EOF
$SKILL_SOURCES
EOF
  echo "$n"
}
plugin_count() { echo $(( 3 - $(missing_plugins | grep -c .) )); }

summary() {
  say "- skills standalone: $(skill_count)/22"
  say "- plugins: $(plugin_count)/3"
  if cli_ok; then say "- Shopify CLI $SHOPIFY_CLI_VERSION OK"; else say "- Shopify CLI: FALTA"; fi
  if playwright_ok; then say "- Playwright $PLAYWRIGHT_VERSION OK"; else say "- Playwright: FALTA"; fi
  if refs_ok; then say "- referencias ecommerce OK"; else say "- referencias ecommerce: FALTAN"; fi
  if [ -f "$OPT_OUT" ]; then say "- privacy opt-out OK"; else say "- privacy opt-out: FALTA"; fi
}

say "GARELON bootstrap"
say "- comprobando stack"

if ! ensure_opt_out; then
  say "ERROR: no se pudo crear $OPT_OUT" >&2
fi

# Fast path sin lock: lectura pura.
if stack_complete; then
  summary
  say "- bootstrap completado (fast path, nada que instalar)"
  say "Prioridad: garelon-ecommerce-operator y las reglas GARELON mandan sobre cualquier skill externa."
  exit 0
fi

# --- Lock: un único bootstrap activo; los demás esperan y revalidan ----------
LOCK="$STATE_DIR/bootstrap.lock"
LOCKDIR=""
if command -v flock >/dev/null 2>&1; then
  exec 9>"$LOCK"
  if ! flock -n 9; then
    say "- otro bootstrap en curso; esperando a que termine"
    if ! flock -w 600 9; then
      say "ERROR: el bootstrap concurrente no terminó en 600 s" >&2
      exit 1
    fi
  fi
else
  LOCKDIR="$STATE_DIR/bootstrap.lock.d"
  waited=0
  until mkdir "$LOCKDIR" 2>/dev/null; do
    pid=$(cat "$LOCKDIR/pid" 2>/dev/null || true)
    if [ -n "$pid" ] && ! kill -0 "$pid" 2>/dev/null; then
      rm -rf "$LOCKDIR"; continue   # lock huérfano de un proceso muerto
    fi
    [ "$waited" -eq 0 ] && say "- otro bootstrap en curso; esperando a que termine"
    [ "$waited" -ge 600 ] && { say "ERROR: el bootstrap concurrente no terminó en 600 s" >&2; exit 1; }
    sleep 2; waited=$((waited + 2))
  done
  echo $$ > "$LOCKDIR/pid"
fi

TMP=$(mktemp -d "${TMPDIR:-/tmp}/garelon-bootstrap.XXXXXX") || { say "ERROR: mktemp falló" >&2; exit 1; }
cleanup() {
  rm -rf "$TMP"
  [ -n "$LOCKDIR" ] && rm -rf "$LOCKDIR"
}
trap cleanup EXIT
trap 'exit 130' INT TERM
# Los instaladores (skills CLI, git) crean sus temporales dentro de $TMP.
export TMPDIR="$TMP"

# Otro proceso pudo completar el stack mientras se esperaba el lock.
if stack_complete; then
  summary
  say "- bootstrap completado (lo instaló otro proceso)"
  say "Prioridad: garelon-ecommerce-operator y las reglas GARELON mandan sobre cualquier skill externa."
  exit 0
fi

: > "$LOG"
WARNS=0
warn() { say "WARN: $*"; WARNS=$((WARNS + 1)); }
# Ejecuta un paso con salida al log; si falla, muestra la última línea útil.
run() {
  local label=$1; shift
  log "\$ $*"
  # </dev/null: ningún instalador consume el stdin de los bucles `while read`.
  # 9>&-: los procesos hijos no heredan el descriptor del lock.
  if ( cd "$HOME" && exec "$@" </dev/null 9>&- ) >> "$LOG" 2>&1; then return 0; fi
  local last; last=$(grep -v '^[[:space:]]*$' "$LOG" | tail -1 | cut -c1-200)
  say "  fallo en $label: $last"
  return 1
}

# 1. Shopify CLI
if ! cli_ok; then
  say "- instalando Shopify CLI $SHOPIFY_CLI_VERSION"
  run "Shopify CLI" npm install -g --ignore-scripts --no-audit --no-fund "@shopify/cli@$SHOPIFY_CLI_VERSION"
  hash -r
fi

# 2. Playwright Python (los navegadores los aporta el entorno: PLAYWRIGHT_BROWSERS_PATH)
if ! playwright_ok; then
  say "- instalando Playwright $PLAYWRIGHT_VERSION"
  run "Playwright" python3 -m pip install -q "playwright==$PLAYWRIGHT_VERSION"
fi

# 3. Plugins (los subcomandos `claude plugin` no abren sesión ni disparan hooks)
if [ -n "$(missing_plugins)" ]; then
  if command -v claude >/dev/null 2>&1; then
    say "- instalando plugins: $(missing_plugins | tr '\n' ' ')"
    run "marketplace liquid-skills" claude plugin marketplace add "$LIQUID_MARKETPLACE"
    run "marketplace shopify-ai-toolkit" claude plugin marketplace add "$TOOLKIT_MARKETPLACE"
    for p in $(missing_plugins); do
      run "$p" claude plugin install "$p" -s user
    done
    PLUGINS_INSTALLED_NOW=1
  else
    say "  fallo en plugins: comando claude no disponible"
  fi
fi
for p in liquid-skills@liquid-skills liquid-lsp@liquid-skills; do
  c=$(plugin_commit "$p")
  [ -n "$c" ] && [ "$c" != "$LIQUID_COMMIT" ] && warn "$p instalado en ${c:0:7} (verificado: ${LIQUID_COMMIT:0:7}); el marketplace no admite fijar commit"
done
c=$(plugin_commit shopify-plugin@shopify-ai-toolkit)
[ -n "$c" ] && [ "$c" != "$TOOLKIT_COMMIT" ] && warn "Shopify AI Toolkit en ${c:0:7} (verificado: ${TOOLKIT_COMMIT:0:7})"

# 4. Dependencias del validador del Toolkit (sin scripts de terceros)
if ! validator_ok; then
  SP=$(toolkit_skill_dir)
  if [ -n "$SP" ] && [ -f "$SP/package.json" ]; then
    say "- instalando dependencias del validador Shopify"
    ( cd "$SP" && exec npm install --ignore-scripts --no-audit --no-fund -q </dev/null 9>&- ) >> "$LOG" 2>&1 \
      || warn "dependencias del validador Shopify no instaladas (el Toolkit funciona sin validar código)"
  fi
fi

# 5. Skills standalone: solo los repos con alguna skill ausente, en el commit verificado
MISSING=$(missing_skills)
if [ -n "$MISSING" ]; then
  say "- instalando skills: $(echo $MISSING | wc -w) ausentes"
  while IFS='|' read -r repo commit skills; do
    [ -n "$repo" ] || continue
    need=""
    for s in $skills; do [ -f "$SKILLS_DIR/$s/SKILL.md" ] || need="$need $s"; done
    [ -n "$need" ] || continue
    if ! run "$repo" npx -y "$SKILLS_CLI" add "$repo#$commit" --skill $need -g -a claude-code -y --copy; then
      warn "$repo no disponible en ${commit:0:7}; se usa la rama por defecto"
      run "$repo" npx -y "$SKILLS_CLI" add "$repo" --skill $need -g -a claude-code -y --copy
    fi
  done <<EOF
$SKILL_SOURCES
EOF
fi

# 6. Referencias ecommerce (solo los dos archivos necesarios)
if ! refs_ok; then
  say "- descargando referencias ecommerce"
  if run "referencias" git init -q "$TMP/refs" \
     && run "referencias" git -C "$TMP/refs" fetch -q --depth 1 "https://github.com/$REFS_REPO.git" "$REFS_COMMIT" \
     && run "referencias" git -C "$TMP/refs" checkout -q FETCH_HEAD -- $(printf 'references/%s ' $REFS_FILES); then
    mkdir -p "$SKILLS_DIR/references"
    for f in $REFS_FILES; do cp "$TMP/refs/references/$f" "$SKILLS_DIR/references/$f"; done
  fi
fi

# --- Verificación final -----------------------------------------------------
ensure_opt_out >/dev/null 2>&1
summary
ERRORS=""
[ -f "$OPT_OUT" ]           || ERRORS="$ERRORS opt-out"
cli_ok                      || ERRORS="$ERRORS shopify-cli"
playwright_ok               || ERRORS="$ERRORS playwright"
for p in $(missing_plugins); do ERRORS="$ERRORS $p"; done
for s in $(missing_skills); do ERRORS="$ERRORS $s"; done
refs_ok                     || ERRORS="$ERRORS referencias-ecommerce"

if [ -n "$ERRORS" ]; then
  say "ERROR: faltan piezas esenciales:$ERRORS (detalle en ~/.cache/garelon-stack/bootstrap.log)" >&2
  say "- bootstrap INCOMPLETO"
  exit 1
fi
if [ -n "${PLUGINS_INSTALLED_NOW:-}" ]; then
  say "- plugins recién instalados: Claude Code los activa al siguiente inicio de sesión o con /reload-plugins"
fi
if [ "$WARNS" -gt 0 ]; then say "- bootstrap completado ($WARNS avisos)"; else say "- bootstrap completado"; fi
say "Prioridad: garelon-ecommerce-operator y las reglas GARELON mandan sobre cualquier skill externa."
exit 0
