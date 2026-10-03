#!/usr/bin/env node
// SOLO TEST · Lanzador de la batería de render GARELON.
// Arranca src/server.js (Shopify SIMULADO con liquidjs) en un puerto libre, ejecuta suite/tests.js
// contra el tema indicado y apaga el servidor. Sale con el código de la batería (0 = todo PASS).
//
//   node run.js                       tema = raíz del repositorio, todas las fases
//   node run.js --theme <carpeta>     otro tema (p. ej. el ZIP descomprimido)
//   node run.js --phase F             solo las fases A…F
//   node run.js --port 8810           puerto fijo (por defecto, uno libre)
//   node run.js --server              solo arranca el servidor (para depurar en el navegador)
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const THEME = path.resolve(opt('--theme', path.join(__dirname, '..', '..')));
const PHASE = opt('--phase', process.env.PHASE || '');
const SERVER_ONLY = args.includes('--server');

if (!fs.existsSync(path.join(THEME, 'layout', 'theme.liquid'))) {
  console.error(`No es un tema Shopify (falta layout/theme.liquid): ${THEME}`); process.exit(2);
}
if (!fs.existsSync(path.join(__dirname, 'node_modules', 'liquidjs'))) {
  console.error('Faltan dependencias: ejecuta «npm ci» en tests/render-harness.'); process.exit(2);
}

const freePort = () => new Promise((res, rej) => { const s = net.createServer(); s.unref(); s.on('error', rej); s.listen(0, () => { const p = s.address().port; s.close(() => res(p)); }); });

(async () => {
  const port = Number(opt('--port', 0)) || await freePort();
  const env = { ...process.env, THEME, PORT: String(port) };
  const server = spawn(process.execPath, [path.join(__dirname, 'src', 'server.js')], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  server.stderr.on('data', d => { log += d; });
  await new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('El servidor no arrancó en 15 s:\n' + log)), 15000);
    server.stdout.on('data', d => { log += d; if (/listening/.test(log)) { clearTimeout(t); res(); } });
    server.on('exit', c => { clearTimeout(t); rej(new Error(`El servidor terminó (código ${c}):\n${log}`)); });
  }).catch(e => { console.error(e.message); process.exit(2); });
  console.log(`servidor de prueba en http://localhost:${port} · tema ${THEME}`);
  if (SERVER_ONLY) { server.stdout.pipe(process.stdout); server.stderr.pipe(process.stderr); return; }
  const tests = spawn(process.execPath, [path.join(__dirname, 'suite', 'tests.js')], { env: { ...env, ...(PHASE ? { PHASE } : {}) }, stdio: 'inherit' });
  tests.on('exit', (code) => { server.kill(); process.exit(code === null ? 1 : code); });
})();
