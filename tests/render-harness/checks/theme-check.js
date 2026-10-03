// SOLO TEST · Theme Check oficial (@shopify/theme-check-node) sobre un tema.
// Uso: node checks/theme-check.js [tema] [filtro-de-ruta]
// Cada aviso se etiqueta como BASELINE DAWN (Dawn 16.0.0 oficial ya lo da: mismo archivo, regla y mensaje)
// o GARELON (nuevo respecto a Dawn). Para un ZIP descomprimido, la base se toma del repositorio de
// GARELON_REPO (o de este clon). Sin git disponible, «sin clasificar».
// Sale con código 1 si hay errores.
const { themeCheckRun } = require('@shopify/theme-check-node');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const git = (repo, ...a) => { try { return execFileSync('git', ['-C', repo, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch (e) { return null; } };

// Avisos de Dawn 16.0.0 oficial (commit base): se ejecuta Theme Check sobre ese commit extraído con git archive.
// Un aviso del tema con el mismo archivo, regla y mensaje que en Dawn es BASELINE DAWN; el resto es GARELON.
async function dawnBaseline() {
  const repo = [process.env.GARELON_REPO, path.join(__dirname, '..', '..', '..')].find(r => r && git(r, 'rev-parse', '--git-dir'));
  const base = repo && git(repo, 'log', '--format=%h', '--grep=Dawn 16.0.0 oficial', '-n', '1');
  if (!base) return null;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'garelon-dawn-'));
  try {
    execFileSync('sh', ['-c', `git -C "${repo}" archive ${base} ${DIRS.join(' ')} | tar -x -C "${tmp}"`]);
    const { offenses } = await themeCheckRun(tmp, undefined, () => {});
    return { base, keys: new Set(offenses.map(o => key(o, tmp))) };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
const key = (o, root) => `${o.uri.replace('file://' + root + '/', '')}|${o.check}|${o.message}`;

(async () => {
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', '..'));
  const filter = process.argv[3];
  const { offenses } = await themeCheckRun(root, undefined, () => {});
  const sev = ['error', 'warning', 'info'];
  const g = await dawnBaseline();
  const rows = offenses.filter(o => !filter || o.uri.includes(filter));
  const c = {}; const origin = { 'BASELINE DAWN': 0, GARELON: 0, 'sin clasificar': 0 };
  for (const o of rows) {
    const rel = o.uri.replace('file://' + root + '/', '');
    const who = !g ? 'sin clasificar' : g.keys.has(key(o, root)) ? 'BASELINE DAWN' : 'GARELON';
    origin[who]++; c[sev[o.severity]] = (c[sev[o.severity]] || 0) + 1;
    console.log(`${sev[o.severity]}\t${who}\t${o.check}\t${rel}:${o.start.line + 1}\t${o.message.slice(0, 160)}`);
  }
  console.log('TOTAL', JSON.stringify(c), 'ORIGEN', JSON.stringify(origin), g ? `(base Dawn ${g.base})` : '(sin git: sin clasificar)');
  process.exit(c.error ? 1 : 0);
})();
