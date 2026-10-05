#!/usr/bin/env node
// SOLO TEST · Validación completa de un tema GARELON, en orden:
//   1. tools/garelon_check.py (instalabilidad)      2. tools/test_garelon_check.py (solo en el repo)
//   3. tools/garelon_infografia.py (WebP de la infografía = «NUEVA IMAGEN 1.png»)
//   4. tools/test_garelon_infografia.py (solo en el repo)
//   5. Theme Check oficial                            6. Liquid estricto (gema liquid de Ruby)
//   7. batería de render (run.js)
// Uso: node validate.js [--theme <carpeta>] [--zip]
//   --zip: el tema es un ZIP descomprimido (añade --strict-root: solo las 7 carpetas en la raíz).
// Un paso que no se puede ejecutar (p. ej. falta Ruby) se marca NO EJECUTADO y la validación falla.
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const REPO = path.resolve(__dirname, '..', '..');
const THEME = path.resolve(opt('--theme', REPO));
const ZIP = args.includes('--zip');
const has = (cmd) => spawnSync(cmd, ['--version'], { stdio: 'ignore' }).status === 0;

const steps = [
  ['garelon_check', 'python3', [path.join(REPO, 'tools', 'garelon_check.py'), THEME, ...(ZIP ? ['--strict-root'] : [])]],
  ...(THEME === REPO ? [['test_garelon_check', 'python3', [path.join(REPO, 'tools', 'test_garelon_check.py')]]] : []),
  // Infografía: los WebP del tema (o del ZIP) salen solo de «NUEVA IMAGEN 1.png» del repo, lossless, sin recorte.
  ['garelon_infografia', 'python3', [path.join(REPO, 'tools', 'garelon_infografia.py'), '--check', '--theme', THEME, '--source', path.join(REPO, 'NUEVA IMAGEN 1.png')]],
  ...(THEME === REPO ? [['test_garelon_infografia', 'python3', [path.join(REPO, 'tools', 'test_garelon_infografia.py')]]] : []),
  ['Theme Check', process.execPath, [path.join(__dirname, 'checks', 'theme-check.js'), THEME], { GARELON_REPO: REPO }],
  ['Liquid estricto', 'ruby', [path.join(__dirname, 'checks', 'liquid-strict.rb'), THEME, 'strict']],
  ['Batería de render', process.execPath, [path.join(__dirname, 'run.js'), '--theme', THEME]],
];
const summary = [];
for (const [name, cmd, a, env] of steps) {
  console.log(`\n== ${name}`);
  if (cmd === 'ruby' && !has('ruby')) { summary.push([name, 'NO EJECUTADO (falta Ruby)']); continue; }
  const r = spawnSync(cmd, a, { stdio: 'inherit', env: { ...process.env, ...(env || {}) } });
  summary.push([name, r.status === 0 ? 'OK' : `FALLA (código ${r.status})`]);
}
console.log('\n== RESUMEN · tema ' + THEME);
for (const [n, s] of summary) console.log(`${s.padEnd(28)} ${n}`);
process.exit(summary.every(([, s]) => s === 'OK') ? 0 : 1);
