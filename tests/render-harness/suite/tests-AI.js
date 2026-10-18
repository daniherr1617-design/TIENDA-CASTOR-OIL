// SOLO TEST · Fase AI: corrección definitiva de ofertas sin regalos (propietario, 2026-10-18, D52).
// Las unidades son el primer número del valor de la variante y nunca suman regalos; el nombre de la tarjeta y la línea
// del carrito salen de esas unidades. Así los ahorros son 9,99 € (25 %) y 24,98 € (42 %) aunque en Shopify las variantes
// sigan llamándose «2 pulseras y 1 de regalo» / «3 pulseras y 2 de regalo» (mode=live, nombres leídos el 2026-10-18).
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'acfbcb4'; // commit del tema antes de la ronda AI
const REPO = fs.existsSync(THEME + '/.git');
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const visible = (html) => text(html.replace(/<input[^>]*>/g, ''));
// «Envío gratis» es el envío (D26), no un regalo: «GRATIS» en mayúsculas y «N gratis».
const GIFT = /GRATIS|\d gratis|de regalo|\b[23] ?\+ ?[12]\b|Recibes \d/;
const log = async () => (await (await fetch(B + '/__state')).json()).log;
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras 15,00 € por pulsera Ahorras 9,99 € (25 %) 29,99 €',
  'Mayor ahorro 3 pulseras Para ti y para compartir 11,66 € por pulsera Ahorras 24,98 € (42 %) 34,99 €'];

module.exports = async function (browser) {
  // 1 · Con los nombres de Shopify sin renombrar (live) y renombrados (d49), las mismas tres ofertas y los mismos ahorros
  for (const mode of ['live', 'd49']) {
    await reset(); await setState(`mode=${mode}`);
    for (const [n, u] of [['home', '/'], ['ficha', P]]) {
      const html = (await get(u)).html; const s = offer(buy(html, u));
      ok(`AI1 ${mode} ${n}: exactamente 3 ofertas «1 pulsera» / «2 pulseras» / «3 pulseras», 9,99 € (25 %) y 24,98 € (42 %)`, JSON.stringify(cards(s)) === JSON.stringify(WANT), cards(s));
      const vals = [...s.matchAll(/<input[^>]*class="g-offer__input[^"]*"[^>]*>/g)].map(x => (x[0].match(/value="([^"]+)"/) || [])[1]);
      ok(`AI2 ${mode} ${n}: cada radio sigue siendo el valor real de su variante de Shopify`, JSON.stringify(vals) === JSON.stringify(mode === 'live' ? ['1 pulsera', '2 pulseras y 1 de regalo', '3 pulseras y 2 de regalo'] : ['1 pulsera', '2 pulseras', '3 pulseras']), vals);
      const t = visible(html);
      ok(`AI3 ${mode} ${n}: ningún texto visible de regalo («GRATIS», «de regalo», «2 + 1», «3 + 2», «Recibes N»)`, !GIFT.test(t), (t.match(new RegExp('.{0,40}(' + GIFT.source + ').{0,40}')) || [])[0]);
    }
  }
  // 2 · Unidades: el primer número, nunca la suma con regalos (el JSON de la variante elegida no es texto visible)
  {
    await reset(); await setState('mode=regalo'); const s = offer(buy((await get(P)).html, P));
    ok('AI4 nombres con paréntesis («2 + 1 de regalo (3 pulseras)»): 2 y 3 pulseras, sin sumar el regalo ni leer el paréntesis', /^Para ti y para regalar 2 pulseras .*15,00 € por pulsera Ahorras 9,99 € \(25 %\) 29,99 €$/.test(cards(s)[1]) && /^Mayor ahorro 3 pulseras /.test(cards(s)[2]), cards(s));
  }
  // 3 · Compra: cada oferta al pago con su variante × 1; carrito con 1, 2 y 3 pulseras aunque los nombres sigan con regalo
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    for (const [label, id] of [['1 pulsera', 4101], ['2 pulseras', 4102], ['3 pulseras', 4103]]) {
      await reset(); await setState('mode=live');
      const { page, errs } = await openPage(browser, P, { width: w, height: h });
      await page.click(`.g-offer__card:has(.g-offer__name:text-is("${label}"))`); await page.waitForTimeout(900);
      if (w < 750) {
        await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
        const last = (await log()).pop() || {};
        ok(`AI5 ${w}px «${label}»: «Comprar ahora» → pago con ${id} × 1`, JSON.stringify(last.update) === JSON.stringify({ [id]: 1 }) && /\/checkout$/.test(page.url()) && errs.length === 0, { last, url: page.url(), errs });
      } else {
        await page.click('main .product-form__submit'); await page.waitForTimeout(1500);
        const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
        const s = await (await fetch(B + '/__state')).json(); const want = label === '1 pulsera' ? 'Incluye 1 pulsera' : `Tu pack incluye ${label}`;
        ok(`AI6 ${w}px «${label}»: «Añadir al carrito» → cajón «${want}», ${id} × 1, sin regalo`, d.includes(want) && !GIFT.test(d) && JSON.stringify(s.cart) === JSON.stringify([{ id, quantity: 1 }]) && errs.length === 0, [d.slice(0, 160), s.cart, errs]);
      }
      await page.close();
    }
  }
  {
    await reset(); await setState('mode=live'); await addToCart(4101); await addToCart(4102); await addToCart(4103);
    const r = await get('/cart'); const t = text((r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]);
    ok('AI7 /cart con los nombres sin renombrar: «Incluye 1 pulsera», «Tu pack incluye 2 pulseras», «Tu pack incluye 3 pulseras», 84,97 €, sin regalo', /Incluye 1 pulsera/.test(t) && /Tu pack incluye 2 pulseras/.test(t) && /Tu pack incluye 3 pulseras/.test(t) && /84,97/.test(text(r.html)) && !GIFT.test(t), t.slice(0, 260));
  }
  // 4 · Navegador: tres tarjetas, sin desbordes, en móvil y escritorio
  for (const [u, w] of [['/', 320], ['/', 390], [P, 390], [P, 1440], ['/', 1440]]) {
    await reset(); await setState('mode=live');
    const { page, errs } = await openPage(browser, u, { width: w, height: 844 });
    const m = await page.evaluate(() => { const l = document.querySelector('variant-selects.g-offer .g-offer__list'); return { n: [...l.querySelectorAll('.g-offer__card')].filter(c => c.offsetParent !== null).length, names: [...l.querySelectorAll('.g-offer__name')].map(e => e.innerText.trim()), over: [...l.querySelectorAll('.g-offer__card, .g-offer__card *')].some(e => e.scrollWidth > e.clientWidth + 1), hs: document.documentElement.scrollWidth > document.documentElement.clientWidth }; });
    ok(`AI8 ${u === '/' ? 'home' : 'ficha'} ${w}px: 3 tarjetas «1 pulsera / 2 pulseras / 3 pulseras», sin desbordes ni scroll horizontal`, m.n === 3 && JSON.stringify(m.names) === '["1 pulsera","2 pulseras","3 pulseras"]' && !m.over && !m.hs && errs.length === 0, { ...m, errs });
    await page.close();
  }
  await reset();
  // 5 · Código: sin precios escritos, sin textos de regalo en los locales de ofertas y alcance
  const loc = JSON.parse(fs.readFileSync(`${THEME}/locales/es.json`, 'utf8')).garelon;
  ok('AI9 locales: fuera «Recibes …» de las tarjetas y del carrito; ninguna clave de ofertas o carrito habla de regalo', !('receives' in loc.offer) && !('pack_receives' in loc.cart) && !/regalo|gratis \d/i.test(JSON.stringify(loc.offer) + JSON.stringify(loc.cart)));
  const src = ['snippets/garelon-offer.liquid', 'snippets/garelon-pack-units.liquid', 'snippets/garelon-cart-option.liquid', 'snippets/garelon-pack-prices.liquid'].map(f => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')).join('\n');
  ok('AI10 snippets: sin precios ni ahorros escritos y sin suma de unidades de regalo', !/19[,.]99|29[,.]99|34[,.]99|9[,.]99|24[,.]98/.test(src) && !/n_sum|has_gift|pack_receives|offer\.receives/.test(src));
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .concat(execSync(`git -C ${THEME} ls-files --others --exclude-standard -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)).sort();
    const bad = changed.filter(f => !/^(locales\/[\w-]+(\.default)?\.json|snippets\/garelon-(offer|pack-units|pack-prices|cart-option)\.liquid)$/.test(f));
    ok('AI11 alcance: solo los snippets de ofertas, unidades y línea del carrito y sus textos (sin CSS, JS, plantillas, secciones, imágenes ni pago)', bad.length === 0, bad);
    const lc = execSync(`git -C ${THEME} diff -U0 ${BASE} -- locales`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AI12 locales: solo se retiran «receives» y «pack_receives»', lc.every(l => /^-\s*"(receives|pack_receives)"|^[+-]\s*"pack_includes_one"/.test(l)), lc.slice(0, 4));
  }
};
