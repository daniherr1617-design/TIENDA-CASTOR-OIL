// SOLO TEST · Batería incremental del tema GARELON reconstruido (render local, NO es Shopify).
// PHASE=A|B|…|Z|AA ejecuta las pruebas de esa fase y de todas las anteriores (por defecto, la última).
const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const THEME = path.resolve(process.env.THEME || path.join(__dirname, '..', '..', '..'));
const B = 'http://localhost:' + (process.env.PORT || 8810);
// Tras la Z, las rondas siguen con AA, AB… (ronda AA, D44).
const PHASES = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL']; const PH = PHASES.indexOf(process.env.PHASE || PHASES[PHASES.length - 1]);
const at = (p) => PHASES.indexOf(p) <= PH;
// Fases que solo probaban algo que el propietario retiró: no se ejecutan desde la ronda indicada (con PHASE anterior, sí).
// Q, R y S validaban la infografía «NUEVA IMAGEN 1.png» (fuente, familia versionada, píxel a píxel); D47 la retira de la
// tienda y AD4-AD5 comprueban que no vuelve (assets, referencias y textos).
const RETIRED = { Q: 'AD', R: 'AD', S: 'AD' };
const RETIRED_WHY = { Q: 'infografía retirada (D47)', R: 'infografía retirada (D47)', S: 'infografía retirada (D47)' };
const results = [];
// Pruebas sustituidas por una decisión posterior del propietario: se listan como SUSTITUIDA y no cuentan (como RETIRED con
// las fases). D48 (ronda AE, 2026-10-16): el ahorro se calcula sobre TODAS las pulseras que se reciben, con su porcentaje,
// y la plantilla muestra solo 2 ofertas con «Recomendado» en la 2.ª. Lo que estas pruebas comprobaban del ahorro D41 (solo
// las pagadas, sin porcentajes) y del distintivo en la 3.ª ya no es lo pedido; AE1-AE5 y AE15-AE17 prueban lo vigente.
// D49 (ronda AF, 2026-10-17): vuelven las 3 ofertas, sin regalos (1 / 2 / 3 pulseras), con «Recomendado» en la 2.ª y
// «Mayor ahorro» en la 3.ª; la nota del ahorro ya no habla de regalo. AE1-AE9 y AE15/AE17 probaban las 2 ofertas con regalo
// de D48 en las plantillas y G10 la nota antigua; AF1-AF19 prueban lo vigente (la lógica de ahorro D48 sigue probada con offer=v125).
const SUPERSEDED = [[/^(D10|T2|T6|U4|U16|U20|U22|V1|V4|V5|W13|X1|X2|X3|X4|X24|AD9) /, 'AE', 'ahorro sobre todas las pulseras con porcentaje y solo 2 ofertas (D48)'],
  [/^(G10|AE1|AE2|AE3|AE4|AE5|AE6|AE7|AE8|AE9|AE15|AE17) /, 'AF', '3 ofertas sin regalos, «Recomendado» y «Mayor ahorro», nota del ahorro nueva (D49)'],
  // D50 (ronda AG, 2026-10-18): la 2.ª tarjeta pasa a «Para ti y para regalar» con el subtítulo «Una para ti y otra para quien
  // quieras»; T1 y las pruebas AF que fijaban «Recomendado» o «Perfecto para regalar» las sustituyen AG1-AG7.
  [/^(T1|AF1|AF5|AF6|AF7|AF11|AF19) /, 'AG', 'etiqueta «Para ti y para regalar» en el pack de 2 (D50)'],
  // D51 (ronda AH, 2026-10-18): los dos distintivos con el mismo color (se retira el tono suave); AH1-AH4 sustituyen a AG2.
  [/^AG2 /, 'AH', 'los dos distintivos con el mismo color (D51)'],
  // D52 (ronda AI, 2026-10-18): sin regalos en ninguna parte. Las unidades son el primer número del valor de la variante y
  // la tarjeta, la compra fija y el carrito dicen «N pulseras» aunque Shopify siga con «… y 1 de regalo»; ya no hay
  // «Recibes N pulseras (… de regalo)». Estas pruebas esperaban esos textos o la suma de regalos; AI1-AI12 prueban lo vigente.
  // AC10 fijaba la altura del botón con la línea «Recibes N» en las tarjetas, que desaparece.
  [/^(U21|U24|U25|U28|V7|V10|V11|W14|W15|X23|AC10|AC11|AD11|AD16|AD21) /, 'AI', 'sin regalos: unidades y nombres por el primer número (D52)'],
  // D53 (ronda AJ, 2026-10-19): cuarta foto «IMAGEN CON CAJA.png» (estuche) al final de la galería, sin «€ por pulsera» en
  // los packs y «Envío gratis + seguimiento» en lugar del texto de octubre (barra y etiqueta de las ofertas). Estas pruebas
  // fijaban 3 fotos, el texto de octubre o la línea del precio por pulsera; AJ1-AJ12 prueban lo vigente.
  [/^(B7|D3|F3|J8|J9|L4|L5|T3|T5|T10|T12|U3|U7|U15|U19|U32|X17|X18|Y3|Y10|Y14|Y16|AA6|AD4|AD6|AD8|AG1|AG4|AI1|AI4) /, 'AJ', 'cuarta foto, sin precio por pulsera y «Envío gratis + seguimiento» (D53)'],
  // D54 (ronda AK, 2026-10-19): fuera la etiqueta «Envío gratis + seguimiento» encima de las ofertas (repetía la garantía) y
  // el aviso pasa a «Estuche y elementos decorativos no incluidos.». AJ2, AJ4, G14, U31 y AG6 fijaban lo anterior (la etiqueta encendida o su texto); AK1-AK7 prueban lo vigente.
  [/^(AJ2|AJ4|G14|U31|AG6) /, 'AK', 'sin etiqueta encima de las ofertas y aviso «Estuche y elementos decorativos no incluidos.» (D54)'],
  // D55 (ronda AL, 2026-10-19): ninguna mención visible al seguimiento. «Envío gratis + seguimiento» → «Oferta especial ·
  // Envío GRATIS» (garantía y barra) y la respuesta de envío de la FAQ sin la frase del número de seguimiento. Estas pruebas
  // fijaban el texto anterior o vetaban «GRATIS» en mayúsculas (D52, pensado para regalos; el propietario pide ahora
  // «Envío GRATIS»). AL1-AL9 prueban lo vigente, también que no vuelve ningún texto de regalo.
  [/^(G15|H9|H11|K13|X15|Z2|Z3|Z6|AF3|AI3|AK1|AK4) /, 'AL', 'sin seguimiento: «Oferta especial · Envío GRATIS» (D55)']];
const ok = (n, c, i) => {
  const sup = SUPERSEDED.find(([re, from]) => re.test(n) && at(from));
  results.push([sup ? 'SUSTITUIDA' : c ? 'PASS' : 'FAIL', n + (sup ? ` [${sup[2]}]` : ''), i === undefined ? '' : JSON.stringify(i).slice(0, 300)]);
};
const setState = (q) => fetch(`${B}/__state?${q}`).then(r => r.json());
// Ronda AE (D48): las fases anteriores a AE prueban «Elige tu oferta» con los ajustes de la v1.25 (offer=v125);
// desde AE, con los de las plantillas (solo 2 ofertas).
const OFFER = { legacy: true };
const reset = () => setState(`offer=${OFFER.legacy ? 'v125' : ''}&` + 'mode=single&soldout=&design=0&catalog=ok&contact=ok&refund=ok&shipping=ok&cookies=none&legal=policy&contactinfo=0&noindex=0&reviews=none&accounts=1&media=0&freeship=&taxes=included&reset=1');
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
// Nombre base de los WebP de una clave: producto-<clave>, salvo una familia versionada en garelon-image
// (infografia → producto-infografia-v4 desde la ronda AB, D45; v3 en las rondas S…AA, D36; v2 en la ronda R, D35).
function assetBase(key) {
  const snip = fs.readFileSync(path.join(THEME, 'snippets', 'garelon-image.liquid'), 'utf8');
  const m = snip.match(new RegExp(`if key == '${key}'\\s*assign asset = '([\\w-]+)'`));
  return m ? m[1] : `producto-${key}`;
}
// SHA-256 de la versión aprobada vigente de «NUEVA IMAGEN 1.png»: la fija tools/garelon_infografia.py (SOURCE_SHA256).
// El propietario puede sustituir la fuente (D36); los tests leen la vigente en vez de fijar una versión antigua.
// Desde la ronda AD (D47) la herramienta está retirada (con la infografía): devuelve undefined.
function approvedSourceSha() {
  const file = path.resolve(__dirname, '..', '..', '..', 'tools', 'garelon_infografia.py');
  if (!fs.existsSync(file)) return undefined;
  const tool = fs.readFileSync(file, 'utf8');
  return (tool.match(/^SOURCE_SHA256 = '([0-9a-f]{64})'/m) || [])[1];
}
// «Añadir al carrito» de la compra. Desde la ronda AD (D47) no se muestra en móvil (allí el único botón es «Comprar
// ahora»); las pruebas que lo usan solo para llenar el carrito lo pulsan igual por debajo de 750 px con un clic
// del DOM (mismo envío del formulario de Dawn). Visible (escritorio, tableta), clic real de Playwright.
async function clickAtc(page, sel) {
  const visible = await page.$eval(sel, (b) => b.offsetParent !== null);
  if (visible) return page.click(sel);
  return page.$eval(sel, (b) => b.click());
}
// Ronda AI (D52): la tarjeta ya no muestra el nombre con regalo de Shopify sino sus unidades («2 pulseras y 1 de regalo» →
// «2 pulseras»). Las fases anteriores que pulsan una tarjeta por ese nombre la localizan, desde AI, por sus unidades.
const card = (label) => {
  if (!at('AI')) return `.g-offer__card:has-text("${label}")`;
  const n = Number((label.split('(')[0].match(/\d+/) || ['1'])[0]);
  return `.g-offer__card:has(.g-offer__name:text-is("${n === 1 ? '1 pulsera' : n + ' pulseras'}"))`;
};
module.exports = { card, OFFER, at, ok, get, setState, reset, count, text, B, THEME, SCRATCH, openPage, assetBase, approvedSourceSha, clickAtc };

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
  // Una excepción cuenta como FAIL de su fase y no impide ejecutar las demás (ronda AD).
  try { await phaseA(browser); } catch (e) { ok('EXCEPCIÓN fase A', false, String(e.stack)); }
  for (const p of PHASES.slice(1)) {
    if (!at(p) || !fs.existsSync(`${SCRATCH}/tests-${p}.js`)) continue;
    OFFER.legacy = PHASES.indexOf(p) < PHASES.indexOf('AE');
    if (RETIRED[p] && at(RETIRED[p])) { console.log(`# fase ${p} retirada desde la ronda ${RETIRED[p]}: ${RETIRED_WHY[p]}`); continue; }
    try { await require(`${SCRATCH}/tests-${p}.js`)(browser); } catch (e) { ok(`EXCEPCIÓN fase ${p}`, false, String(e.stack)); }
  }
  await browser.close();
  for (const r of results) console.log(r.join('\t'));
  const fail = results.filter(r => r[0] === 'FAIL').length;
  const sup = results.filter(r => r[0] === 'SUSTITUIDA').length; if (sup) console.log(`# ${sup} pruebas sustituidas por decisiones posteriores (no cuentan)`);
  console.log(`TOTAL ${results.length - fail - sup}/${results.length - sup}`); process.exit(fail ? 1 : 0);
})();
