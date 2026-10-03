// SOLO TEST · Fase K: distintivo por defecto honesto («Recomendado») y envío gratis coherente en packs,
// ficha, cajón del carrito y /cart (ajuste global «Envío gratis» + nota común garelon-shipping-note).
const T = require('./tests.js');
const { ok, get, setState, reset, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'c265802'; // HEAD antes de la ronda K
// Alcance de K23-K26 fijado al rango c265802..974eadd (fijado en la ronda L; las rondas siguientes tienen su propia prueba de alcance).
const ROUND_HEAD = '974eadd';
const atRound = (f) => execSync(`git -C ${THEME} show ${ROUND_HEAD}:${f}`).toString();
const REPO = fs.existsSync(THEME + '/.git');
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const FREE = 'Impuestos incluidos. Envío gratis.';
// Frases de Dawn que dicen que el envío se calcula después (en español y en inglés).
const AT_CHECKOUT = /env[ií]o calculados en la pantalla de pago|gastos de env[ií]o[\s\S]{0,40}se calculan|shipping calculated at checkout/i;
const CLAIM = /m[aá]s popular|m[aá]s vendid|best ?sell|top ventas|n\.?º ?1 en ventas/i;

const taxOf = (html) => text((html.match(/<p class="g-offer__tax">[\s\S]*?<\/p>/) || [''])[0]).trim();
const productNote = (html) => text((html.match(/<div class="product__tax caption rte">[\s\S]*?<\/div>/) || [''])[0]).trim();
const drawerNote = (html) => text(((html.match(/<cart-drawer[\s\S]*?<\/cart-drawer>/) || [''])[0].match(/<small class="tax-note[\s\S]*?<\/small>/) || [''])[0]).trim();
const pageNote = (html) => text(((html.match(/id="main-cart-footer"[\s\S]*?<\/cart-footer>|id="main-cart-footer"[\s\S]*$/) || [''])[0].match(/<small class="tax-note[\s\S]*?<\/small>/) || [''])[0]).trim();
const chips = (html) => [...html.matchAll(/<li class="g-trust__chip">[\s\S]*?<span>([^<]*)<\/span>/g)].map(m => m[1].trim());
const schema = (f) => JSON.parse(fs.readFileSync(`${THEME}/sections/${f}`, 'utf8').match(/{% schema %}([\s\S]*){% endschema %}/)[1]);
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };
// Defaults de todos los schemas (secciones, bloques y ajustes globales) con su ruta.
function allDefaults() {
  const out = [];
  for (const f of fs.readdirSync(`${THEME}/sections`).filter(x => x.endsWith('.liquid'))) {
    const m = fs.readFileSync(`${THEME}/sections/${f}`, 'utf8').match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/); if (!m) continue;
    const sc = JSON.parse(m[1]);
    (sc.settings || []).forEach(s => 'default' in s && out.push([`${f}:${s.id}`, s.default]));
    (sc.blocks || []).forEach(b => (b.settings || []).forEach(s => 'default' in s && out.push([`${f}:${b.type}.${s.id}`, s.default])));
    (sc.presets || []).forEach(p => out.push([`${f}:preset`, JSON.stringify(p)]));
  }
  JSON.parse(fs.readFileSync(`${THEME}/config/settings_schema.json`, 'utf8')).forEach(g => (g.settings || []).forEach(s => 'default' in s && out.push([`settings_schema:${s.id}`, s.default])));
  return out;
}

module.exports = async function (browser) {
  // 1 · Distintivo
  const offerDef = (f) => schema(f).blocks.find(b => b.type === 'garelon_offer').settings.find(s => s.id === 'badge_text');
  const defs = ['featured-product.liquid', 'main-product.liquid'].map(offerDef);
  ok('K1 schema: el texto del distintivo es «Recomendado» por defecto en la home y en la ficha', defs.every(d => d && d.default === 'Recomendado'), defs.map(d => d && d.default));
  const bad = allDefaults().filter(([, v]) => CLAIM.test(String(v)));
  ok('K2 ningún default de schema (secciones, bloques, presets, ajustes globales) sugiere «Más popular», «Más vendido» o similares', bad.length === 0, bad);
  ok('K3 el texto de ayuda sigue explicando la regla: «Más popular» solo con datos de ventas reales', defs.every(d => /M[aá]s popular/.test(d.info) && /datos de ventas reales/.test(d.info)));
  const tpls = ['index.json', 'product.json'].map(f => JSON.parse(fs.readFileSync(`${THEME}/templates/${f}`, 'utf8')));
  ok('K4 plantillas: ningún texto de la tienda usa «Más popular» o «Más vendido»', tpls.every(t => !CLAIM.test(JSON.stringify(t))));
  await setState('mode=pack3save&reset=1');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u);
    const badges = [...r.html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => [/(\d) pulseras?/.exec(text(m[0]))?.[1], (/<span class="g-offer__badge">([^<]*)<\/span>/.exec(m[0]) || [])[1]]).filter(([, b]) => b);
    ok(`K5 ${n}: el pack de 2 sigue mostrando «Recomendado» (y solo ese)`, JSON.stringify(badges) === JSON.stringify([['2', 'Recomendado']]) && !CLAIM.test(text(r.html)), badges);
  }

  // 2 · Envío gratis activo (valor del tema): packs, ficha, cajón y /cart dicen lo mismo
  const gs = JSON.parse(fs.readFileSync(`${THEME}/config/settings_schema.json`, 'utf8')).find(g => (g.settings || []).some(s => s.id === 'garelon_free_shipping'));
  const gset = gs && gs.settings.find(s => s.id === 'garelon_free_shipping');
  const dj = JSON.parse(fs.readFileSync(`${THEME}/config/settings_data.json`, 'utf8')); const sd = typeof dj.current === 'string' ? dj.presets[dj.current] : dj.current;
  ok('K6 ajuste global «Envío gratis» en Configuración del tema › Carrito, activo por defecto y en settings_data (confirmado por el propietario)',
    gs && gs.name === 't:settings_schema.cart.name' && gset.type === 'checkbox' && gset.default === true && sd.garelon_free_shipping === true && /Shopify Admin/.test(gset.info));
  ok('K7 el bloque de packs ya no tiene un ajuste de envío propio que pueda contradecir al global', ['featured-product.liquid', 'main-product.liquid'].every(f => !schema(f).blocks.find(b => b.type === 'garelon_offer').settings.some(s => /shipping/.test(s.id))));
  const liquids = ['sections', 'snippets', 'layout'].flatMap(d => fs.readdirSync(`${THEME}/${d}`).filter(f => f.endsWith('.liquid')).map(f => [`${d}/${f}`, fs.readFileSync(`${THEME}/${d}/${f}`, 'utf8')]));
  const users = liquids.filter(([, s]) => /garelon\.offer\.free_shipping|garelon\.cart\.taxes_at_checkout/.test(s)).map(([f]) => f);
  const callers = liquids.filter(([, s]) => /render 'garelon-shipping-note'/.test(s)).map(([f]) => f).sort();
  ok('K8 fuente única: solo garelon-shipping-note pinta «Envío gratis.»; la usan packs, ficha, home, cajón y /cart', JSON.stringify(users) === JSON.stringify(['snippets/garelon-shipping-note.liquid']) &&
    JSON.stringify(callers) === JSON.stringify(['sections/featured-product.liquid', 'sections/main-cart-footer.liquid', 'sections/main-product.liquid', 'snippets/cart-drawer.liquid', 'snippets/garelon-offer.liquid']) &&
    !liquids.some(([, s]) => /block\.settings\.free_shipping|garelon_free_shipping/.test(s.replace(/settings\.garelon_free_shipping/g, ''))), { users, callers });

  await setState('mode=pack3save&reset=1'); await addToCart(4102);
  let home = await get('/'); let prod = await get(P); let cart = await get('/cart');
  ok('K9 packs (home y ficha): «Impuestos incluidos. Envío gratis.»', taxOf(home.html) === FREE && taxOf(prod.html) === FREE, [taxOf(home.html), taxOf(prod.html)]);
  ok('K10 cajón del carrito (con artículo): «Impuestos incluidos. Envío gratis.»', drawerNote(home.html) === FREE && drawerNote(prod.html) === FREE, drawerNote(home.html));
  ok('K11 /cart → 200 y nota «Impuestos incluidos. Envío gratis.» (página y cajón)', cart.status === 200 && cart.tpl === 'cart' && pageNote(cart.html) === FREE && drawerNote(cart.html) === FREE, [pageNote(cart.html), drawerNote(cart.html)]);
  ok('K12 en ninguna página aparece «envío calculado en la pantalla de pago» junto a «Envío gratis»', [home, prod, cart].every(r => !AT_CHECKOUT.test(text(r.html))), [home, prod, cart].map(r => (text(r.html).match(AT_CHECKOUT) || [''])[0]));
  ok('K13 la garantía «Envío gratis + seguimiento» es coherente con el ajuste (activo)', chips(home.html).includes('Envío gratis + seguimiento') && chips(prod.html).includes('Envío gratis + seguimiento'), chips(home.html));
  await setState('mode=single&reset=1'); // el carrito se vacía: la variante 4102 no existe sin packs
  const single = await get('/');
  ok('K14 producto sin packs: la nota bajo el precio también dice «Impuestos incluidos. Envío gratis.»', productNote(single.html) === FREE, productNote(single.html));
  await setState('mode=pack3save'); await addToCart(4102);

  // 3 · Envío gratis desactivado: vuelve la nota de Shopify/Dawn y no se promete envío gratis
  await setState('freeship=0');
  home = await get('/'); cart = await get('/cart');
  ok('K15 desactivado · packs: «Impuestos incluidos.» + enlace a la política de envío de Dawn, sin «Envío gratis»', /^Impuestos incluidos\. Los gastos de envío se calculan en la pantalla de pago\.$/.test(taxOf(home.html)) && /href="\/policies\/shipping-policy"/.test((home.html.match(/<p class="g-offer__tax">[\s\S]*?<\/p>/) || [''])[0]), taxOf(home.html));
  ok('K16 desactivado · cajón y /cart: nota original de Dawn (envío calculado en la pantalla de pago, con enlace a la política)',
    drawerNote(home.html) === 'Impuestos incluidos. Descuentos y envío calculados en la pantalla de pago.' && pageNote(cart.html) === drawerNote(home.html) && /<small class="tax-note[^>]*>[\s\S]*?href="\/policies\/shipping-policy"/.test(cart.html), [drawerNote(home.html), pageNote(cart.html)]);
  ok('K17 desactivado · ninguna nota de packs, ficha ni carrito promete «Envío gratis.»', ![taxOf(home.html), drawerNote(home.html), pageNote(cart.html), drawerNote(cart.html)].some(t => /Envío gratis/.test(t)));
  await setState('shipping=none'); cart = await get('/cart'); home = await get('/');
  ok('K18 desactivado y sin política de envío: Dawn sin enlace; packs solo «Impuestos incluidos.»', pageNote(cart.html) === 'Impuestos incluidos. Descuentos y envío calculados en la pantalla de pago.' && !/<small class="tax-note[^>]*>[^]*?href="\/policies\/shipping-policy"[^]*?<\/small>/.test(cart.html) && taxOf(home.html) === 'Impuestos incluidos.', [pageNote(cart.html), taxOf(home.html)]);
  await setState('shipping=ok&freeship=');

  // 4 · Información fiscal conservada con envío gratis (no se eliminan ni se inventan afirmaciones)
  const cases = [['both', 'Aranceles e impuestos incluidos. Envío gratis.', 'Aranceles e impuestos incluidos. Envío gratis.'],
    ['duties', 'Aranceles incluidos. Impuestos calculados en la pantalla de pago. Envío gratis.', 'Aranceles incluidos. Envío gratis.'],
    ['excluded', 'Impuestos calculados en la pantalla de pago. Envío gratis.', 'Envío gratis.']];
  for (const [tx, cartWant, packWant] of cases) {
    await setState(`taxes=${tx}`); cart = await get('/cart'); home = await get('/');
    ok(`K19 impuestos «${tx}»: carrito «${cartWant}» · packs «${packWant}» (como Dawn en producto)`, pageNote(cart.html) === cartWant && drawerNote(cart.html) === cartWant && taxOf(home.html) === packWant, [pageNote(cart.html), taxOf(home.html)]);
  }
  await setState('taxes=included');

  // 5 · Navegador: cajón dinámico tras añadir, /cart y responsive
  await setState('mode=pack3save&reset=1');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('label:has-text("2 pulseras")'); await page.waitForTimeout(700);
    await page.click('#comprar [id^="ProductSubmitButton-"]'); await page.waitForTimeout(1300);
    const st = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); const n = d && d.querySelector('.tax-note'); return { open: !!d && d.classList.contains('active'), note: n ? n.innerText.trim() : null }; });
    ok('K20 navegador: tras «Añadir al carrito» el cajón se abre (re-renderizado por Dawn) con «Impuestos incluidos. Envío gratis.»', st.open && st.note === FREE && errs.length === 0, { st, errs });
    await page.close();
  }
  for (const w of VPS) for (const u of ['/', '/cart']) {
    const { page, errs } = await openPage(browser, u, { width: w, height: w < 750 ? 844 : 900 });
    if (u === '/') { await page.evaluate(() => document.querySelector('cart-drawer').open()); await page.waitForTimeout(600); }
    const res = await page.evaluate((isCart) => {
      const n = isCart ? document.querySelector('#main-cart-footer .tax-note') : document.querySelector('cart-drawer .tax-note');
      const box = (isCart ? document.querySelector('#main-cart-footer .cart__blocks') : document.querySelector('cart-drawer .drawer__inner')).getBoundingClientRect();
      const b = n.getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, note: n.innerText.trim(), visible: b.width > 0 && b.height > 0,
        inside: b.left >= box.left - 1 && b.right <= box.right + 1, lines: Math.round(b.height / parseFloat(getComputedStyle(n).lineHeight)) };
    }, u === '/cart');
    ok(`K21 ${u === '/' ? 'cajón' : '/cart'} ${w}px: nota de envío gratis visible, dentro de su caja, ≤ 2 líneas, sin scroll horizontal ni errores JS`,
      res.note === FREE && res.visible && res.inside && res.lines <= 2 && res.sw <= res.cw && errs.length === 0, { ...res, errs });
    await page.close();
  }
  await reset();

  // 6 · Locales
  const locs = fs.readdirSync(`${THEME}/locales`).filter(f => !/schema/.test(f));
  const lv = (f) => JSON.parse(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')).garelon;
  ok('K22 «garelon.cart.taxes_at_checkout» en los 31 idiomas (es: «Impuestos calculados en la pantalla de pago.»; el resto en inglés, como los demás textos GARELON)',
    locs.length === 31 && locs.every(f => lv(f).cart && lv(f).cart.taxes_at_checkout) && lv('es.json').cart.taxes_at_checkout === 'Impuestos calculados en la pantalla de pago.' && lv('es.json').offer.free_shipping === 'Envío gratis.' &&
    locs.filter(f => f !== 'es.json').every(f => lv(f).cart.taxes_at_checkout === 'Taxes calculated at checkout.'));

  if (!REPO) return;
  // 7 · Alcance de la ronda K frente a c265802
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout sections snippets templates`).toString().trim().split('\n').filter(Boolean);
  const all = [...new Set(changed)].sort();
  ok('K23 archivos del tema tocados limitados al scope (badge + nota de envío)', JSON.stringify(all) === JSON.stringify(['config/settings_data.json', 'config/settings_schema.json', 'sections/featured-product.liquid', 'sections/main-cart-footer.liquid', 'sections/main-product.liquid', 'snippets/cart-drawer.liquid', 'snippets/garelon-offer.liquid', 'snippets/garelon-shipping-note.liquid']), all);
  const flat = (o, p = '', out = {}) => { for (const [k, v] of Object.entries(o)) (v && typeof v === 'object') ? flat(v, p + k + '.', out) : (out[p + k] = v); return out; };
  const locDiff = locs.map(f => { const a = flat(JSON.parse(execSync(`git -C ${THEME} show ${BASE}:locales/${f}`).toString())); const b = flat(JSON.parse(atRound(`locales/${f}`)));
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]); });
  ok('K24 locales: el único cambio es la clave nueva garelon.cart.taxes_at_checkout', locDiff.every(d => JSON.stringify(d) === '["garelon.cart.taxes_at_checkout"]'), locDiff.filter(d => d.length !== 1).slice(0, 2));
  const same = (f) => execSync(`git -C ${THEME} show ${BASE}:${f}`).toString() === atRound(f);
  ok('K25 plantillas, grupos de cabecera y pie, CSS y JS sin cambios (packs, hero, galería, FAQ, footer intactos)', ['templates/index.json', 'templates/product.json', 'sections/header-group.json', 'sections/footer-group.json', 'assets/garelon.css', 'assets/garelon.js'].every(same));
  const dataDiff = (() => { const a = flat(JSON.parse(execSync(`git -C ${THEME} show ${BASE}:config/settings_data.json`).toString())); const b = flat(JSON.parse(atRound('config/settings_data.json'))); return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]); })();
  ok('K26 settings_data: solo se añade garelon_free_shipping = true', dataDiff.length === 1 && /\.garelon_free_shipping$/.test(dataDiff[0]), dataDiff);
};
