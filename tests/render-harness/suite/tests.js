// SOLO TEST · Batería incremental del tema GARELON reconstruido (render local, NO es Shopify).
// PHASE=A|B|…|L ejecuta las pruebas de esa fase y de todas las anteriores (por defecto, la última).
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const THEME = path.resolve(process.env.THEME || path.join(__dirname, '..', '..', '..'));
const B = 'http://localhost:' + (process.env.PORT || 8810);
const PHASES = 'ABCDEFGHIJKLM'; const PH = PHASES.indexOf(process.env.PHASE || PHASES.slice(-1));
const at = (p) => PHASES.indexOf(p) <= PH;
const results = []; const ok = (n, c, i) => results.push([c ? 'PASS' : 'FAIL', n, i === undefined ? '' : JSON.stringify(i).slice(0, 300)]);
const setState = (q) => fetch(`${B}/__state?${q}`).then(r => r.json());
const reset = () => setState('mode=single&soldout=&design=0&catalog=ok&contact=ok&refund=ok&shipping=ok&cookies=none&noindex=0&reviews=none&accounts=1&media=0&freeship=&taxes=included&reset=1');
const get = async (u) => { const r = await fetch(B + u, { redirect: 'manual' }); const t = await r.text(); return { status: r.status, tpl: r.headers.get('x-test-template'), html: t }; };
const count = (s, re) => (s.match(re) || []).length;
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const SCRATCH = __dirname;
const STUB = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'standard-events-stub.js'), 'utf8');
// Abre una página y recoge errores JS y peticiones fallidas al propio servidor (las de cdn.shopify.com las bloquea el proxy del entorno).
async function openPage(browser, u, vp) {
  const page = await browser.newPage(vp ? { viewport: vp } : undefined); const errs = [];
  await page.route('https://cdn.shopify.com/storefront/standard-events.js', r => r.fulfill({ contentType: 'text/javascript', body: STUB }));
  page.on('pageerror', e => errs.push('pageerror: ' + String(e)));
  page.on('requestfailed', r => { if (r.url().startsWith(B)) errs.push('requestfailed: ' + r.url()); });
  page.on('response', r => { if (r.url().startsWith(B) && r.status() >= 400 && r.url() !== B + u) errs.push(r.status() + ' ' + r.url()); });
  await page.goto(B + u, { waitUntil: 'networkidle' }); await page.waitForTimeout(300);
  return { page, errs };
}
// Chromium: CHROMIUM_PATH si se indica; si no, el de playwright-core; si no, cualquier chromium-* de PLAYWRIGHT_BROWSERS_PATH.
async function launchChromium() {
  if (process.env.CHROMIUM_PATH) return chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  try { return await chromium.launch(); } catch (e) {
    const dir = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
    const found = (fs.existsSync(dir) ? fs.readdirSync(dir) : []).filter(d => /^chromium-\d+$/.test(d)).sort().reverse()
      .map(d => path.join(dir, d, 'chrome-linux', 'chrome')).find(f => fs.existsSync(f));
    if (!found) throw new Error('No se encuentra Chromium: ejecuta «npx playwright-core install chromium» o define CHROMIUM_PATH.\n' + e.message);
    return chromium.launch({ executablePath: found });
  }
}
module.exports = { at, ok, get, setState, reset, count, text, B, THEME, SCRATCH, openPage };

async function phaseA(browser) {
  await reset();
  let r = await get('/');
  ok('A1 GET / → 200 plantilla index', r.status === 200 && r.tpl === 'index', [r.status, r.tpl]);
  // Fase A: el H1 lo pone el logo de Dawn; desde la B el logo deja de ser H1 y desde la C lo pone la portada.
  const h1 = count(r.html, /<h1[\s>]/g);
  ok('A2 home: como mucho 1 <h1> (exactamente 1 desde la fase C)', at('C') ? h1 === 1 : h1 <= 1, h1);
  for (const u of ['/ruta-inexistente-garelon', '/esto-no-deberia-existir-garelon-test', '/products/taza-fondue-chocolate', '/pages/no-existe']) {
    r = await get(u); ok(`A3 ${u} → 404 plantilla 404`, r.status === 404 && r.tpl === '404', [r.status, r.tpl]);
  }
  r = await get('/ruta-inexistente-garelon');
  ok('A4 404 limpia: sin diagnósticos de ruta ni /404 en el texto', !/Esta URL|request\.path|\/404/.test(text(r.html)), text(r.html).match(/.{0,40}\/404.{0,40}/));
  await setState('catalog=none'); r = await get('/'); ok('A5 sin producto publicado: / sigue en 200 index', r.status === 200 && r.tpl === 'index', [r.status, r.tpl]);
  await setState('catalog=ok&contact=none&refund=none&shipping=none'); r = await get('/'); ok('A6 sin contacto ni políticas: / sigue en 200', r.status === 200 && r.tpl === 'index');
  await setState('noindex=1'); r = await get('/'); ok('A7 (control del render) tema sin index → / da 404', r.status === 404 && r.tpl === '404');
  await reset();
  const { page, errs } = await openPage(browser, '/');
  ok('A8 navegador: / se queda en / (sin redirecciones JS)', new URL(page.url()).pathname === '/', page.url());
  ok('A9 navegador: sin errores JS ni peticiones fallidas del tema en la home', errs.length === 0, errs);
  await page.close();
}

(async () => {
  const browser = await launchChromium();
  try {
    await phaseA(browser);
    for (const p of PHASES.slice(1)) if (at(p) && fs.existsSync(`${SCRATCH}/tests-${p}.js`)) await require(`${SCRATCH}/tests-${p}.js`)(browser);
  } catch (e) { ok('EXCEPCIÓN', false, String(e.stack)); }
  await browser.close();
  for (const r of results) console.log(r.join('\t'));
  const fail = results.filter(r => r[0] === 'FAIL').length;
  console.log(`TOTAL ${results.length - fail}/${results.length}`); process.exit(fail ? 1 : 0);
})();
