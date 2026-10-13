// SOLO TEST · Fase V: nombres finales de las ofertas (propietario, 2026-10-12, D39). «1 pulsera», «Compra 2 y llévate 1 de
// regalo» (recibe 3) y «Compra 3 y llévate 2 de regalo» (recibe 5), variantes reales con cantidad 1. El tema calcula las
// unidades con garelon-pack-units (suma de números si el nombre habla de regalo). Precios SIMULADOS (mode=final:
// 19,99 / 29,99 / 34,99 €): el tema no los conoce ni los escribe.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '774f5ca'; // HEAD antes de la ronda V
const ROUND_HEAD = '6c021f3'; // Ronda W: commit del tema de la ronda V (alcance fijado a V, como en T y U)
const REPO = fs.existsSync(THEME + '/.git');
const NAMES = ['1 pulsera', 'Compra 2 y llévate 1 de regalo', 'Compra 3 y llévate 2 de regalo'];
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Compra 2 y llévate 1 de regalo Recibes 3 pulseras Perfecto para regalar 10,00 € por pulsera Ahorras 9,99 € 29,99 €', // D41: ahorro solo sobre las pagadas
  'Mejor precio por pulsera Compra 3 y llévate 2 de regalo Recibes 5 pulseras Para ti y para compartir 7,00 € por pulsera Ahorras 24,98 € 34,99 €'];
const src = (f) => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '').replace(/{%-?\s*schema\s*-?%}[\s\S]*?{%-?\s*endschema\s*-?%}/g, '');
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const buy = (html, u) => (u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };

module.exports = async function (browser) {
  // 1 · Tarjetas con los nombres finales: cantidad real, precio por pulsera y ahorro calculados desde Shopify
  await reset(); await setState('mode=final');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const s = buy(r.html, u); const c = cards(s);
    ok(`V1 ${n}: «Compra 2 y llévate 1 de regalo · Recibes 3 pulseras» y «Compra 3 y llévate 2 de regalo · Recibes 5 pulseras», con el precio por pulsera de las unidades reales`, JSON.stringify(c) === JSON.stringify(WANT), c);
    const vals = [...s.matchAll(/<input\s+type="radio"[^>]*value="([^"]*)"[^>]*>/g)].map(m => m[1]);
    ok(`V2 ${n}: cada radio lleva el nombre exacto de la variante`, JSON.stringify(vals) === JSON.stringify(NAMES), vals);
    const radios = [...s.matchAll(/<input\s+type="radio"[^>]*>/g)].map(m => /\schecked/.test(m[0]));
    const lab = [...s.matchAll(/<label[^>]*class="g-offer__card[^"]*"[\s\S]*?<\/label>/g)].map(m => m[0]);
    ok(`V3 ${n}: «Mejor precio por pulsera» solo en la 3.ª tarjeta, sin preseleccionarla`, JSON.stringify(radios) === '[true,false,false]' && count(s, /class="g-offer__badge"/g) === 1 && /g-offer__badge/.test(lab[2]) && /g-offer__card--badge/.test(lab[2]), radios);
    ok(`V4 ${n}: sin precio tachado (ni en las tarjetas ni en el precio de Dawn, que no está «en oferta»), sin porcentajes, sin «más vendido» ni urgencia`, !/g-offer__was|price--on-sale/.test(s) && !/\d+ ?%|m[aá]s vendid|m[aá]s popular|quedan|últimas|cuenta atrás/i.test(text(s)));
    ok(`V5 ${n}: el ahorro se explica (D41: solo las pulseras pagadas, frente a comprarlas sueltas) y la 1.ª tarjeta no dice «Recibes»`, /Ahorro calculado solo sobre las unidades que pagas, frente a comprarlas sueltas a 19,99 € cada una\./.test(text(s)) && !/Recibes/.test(text(lab[0])));
  }
  await setState('mode=final&soldout=4102');
  {
    const r = await get(P); const s = buy(r.html, P); const lab = [...s.matchAll(/<label[^>]*class="g-offer__card[^"]*"[\s\S]*?<\/label>/g)].map(m => m[0]);
    ok('V6 «Compra 2 y llévate 1 de regalo» agotada: tarjeta «Agotado» y las otras dos disponibles', /g-offer__card--soldout/.test(lab[1]) && /Agotado/.test(text(lab[1])) && !/soldout/.test(lab[0] + lab[2]));
  }

  // 2 · Carrito y cajón: lo que recibe el cliente, una línea de cantidad 1 por oferta
  await reset(); await setState('mode=final');
  for (const id of [4101, 4102, 4103]) await addToCart(id);
  {
    const r = await get('/cart'); const m = (r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]; const d = (r.html.match(/<cart-drawer[\s\S]*?<\/cart-drawer>/) || [''])[0];
    for (const [n, h] of [['/cart', m], ['cajón', d]]) {
      const lines = [...h.matchAll(/<div class="product-option g-cart-pack">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g)].map(x => text(x[1]).trim());
      ok(`V7 ${n}: «Incluye 1 pulsera» / «Recibes 3 pulseras (Compra 2 y llévate 1 de regalo)» / «Recibes 5 pulseras (Compra 3 y llévate 2 de regalo)»`, JSON.stringify(lines) === JSON.stringify(['Incluye 1 pulsera', 'Recibes 3 pulseras (Compra 2 y llévate 1 de regalo)', 'Recibes 5 pulseras (Compra 3 y llévate 2 de regalo)']), lines);
      ok(`V8 ${n}: precios de línea 19,99 / 29,99 / 34,99 € (los de la variante) y total 84,97 €`, /19,99/.test(text(h)) && /29,99/.test(text(h)) && /34,99/.test(text(h)));
    }
    ok('V8 total del carrito 84,97 € (una unidad de cada oferta)', /84,97/.test(text(r.html)));
    const st = await (await fetch(B + '/__state')).json();
    ok('V9 cada oferta es una línea de cantidad 1 (la variante, no 3 ni 5 unidades)', JSON.stringify(st.cart) === '[{"id":4101,"quantity":1},{"id":4102,"quantity":1},{"id":4103,"quantity":1}]', st.cart);
  }
  await reset(); await setState('mode=final');
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click('main label:has-text("Compra 3 y llévate 2 de regalo")'); await page.waitForTimeout(800);
    const sel = await page.evaluate(() => ({ id: document.querySelector('main form[id^="product-form-"] input[name="id"]').value, url: location.search }));
    await page.click('main .product-form__submit'); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok('V10 navegador: 3.ª oferta → id 4103, cajón con «Recibes 5 pulseras (Compra 3 y llévate 2 de regalo)», 34,99 €, cantidad 1', sel.id === '4103' && /variant=4103/.test(sel.url) && /Recibes 5 pulseras \(Compra 3 y llévate 2 de regalo\)/.test(d) && /34,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, [sel, d.slice(0, 200)]);
    await page.close();
  }

  // 3 · Móvil y escritorio: tarjetas legibles, sin desbordes
  for (const w of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
    const { page, errs } = await openPage(browser, P, { width: w, height: 844 });
    const m = await page.evaluate(() => {
      const cs = [...document.querySelectorAll('main .g-offer__card')];
      return { hs: document.documentElement.scrollWidth > innerWidth, over: cs.some(c => c.scrollWidth > c.clientWidth + 1),
        names: cs.map(c => { const n = c.querySelector('.g-offer__name').getBoundingClientRect(); const p = c.querySelector('.g-offer__price').getBoundingClientRect(); return n.right <= p.left + 1; }),
        qty: cs.map(c => (c.querySelector('.g-offer__qty') || {}).textContent || ''), h: cs.map(c => Math.round(c.getBoundingClientRect().height)) };
    });
    ok(`V11 ${w}px: sin scroll horizontal ni desbordes; el nombre no pisa el precio; «Recibes 3/5 pulseras» visible`, !m.hs && !m.over && m.names.every(Boolean) && JSON.stringify(m.qty) === '["","Recibes 3 pulseras","Recibes 5 pulseras"]' && errs.length === 0, m);
    await page.close();
  }
  await reset();

  // 4 · Nada escrito a mano y alcance de la ronda
  const theme = ['snippets/garelon-offer.liquid', 'snippets/garelon-cart-option.liquid', 'snippets/garelon-pack-prices.liquid', 'snippets/garelon-pack-units.liquid'].map(src).join('\n')
    + fs.readFileSync(`${THEME}/templates/product.json`, 'utf8') + fs.readFileSync(`${THEME}/templates/index.json`, 'utf8');
  ok('V12 el tema no escribe precios, nombres de oferta ni cantidades (salen de la variante de Shopify)', !/19,99|29,99|34,99|Compra \d|llévate|\b[35] pulseras\b/.test(theme));
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    const allowed = /^(locales\/[\w.-]+\.json|snippets\/(garelon-offer|garelon-cart-option|garelon-pack-prices|garelon-pack-units)\.liquid)$/;
    ok('V13 alcance: solo el cálculo de unidades (oferta, carrito, lista de precios) y la clave de locale', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    const loc = execSync(`git -C ${THEME} diff ${BASE} ${ROUND_HEAD} -- locales`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    const okLine = (l) => /^\+\s+("units_count": \{|"one": |"other": |\},?$)|^[-+]\s+"receives"/.test(l);
    ok('V14 locales: solo se añade garelon.offer.units_count (una/varias)', loc.every(okLine), loc.filter(l => !okLine(l)).slice(0, 4));
  }
};
