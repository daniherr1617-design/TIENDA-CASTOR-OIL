// SOLO TEST · Fase D: compra en la home (featured-product de Dawn + packs como variantes reales).
// Precios SIMULADOS: 19,99 / 34,99 / 47,99 € (con ahorro) o 19,99 / 39,98 / 59,97 € (sin ahorro).
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B } = T;
const fs = require('fs');
const section = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
const visibleText = (html) => text(html.replace(/<template[\s\S]*?<\/template>/g, ''));

module.exports = async function (browser) {
  await reset();
  let r = await get('/');
  const order = [...r.html.matchAll(/id="shopify-section-template--1__(\w+)"/g)].map(m => m[1]);
  ok('D1 home: portada → compra (#comprar)', order[0] === 'portada' && order[1] === 'compra' && /<section\s+id="comprar"/.test(r.html), order);
  let s = section(r.html);
  ok('D2 una sola variante: sin selector, sin tabla de packs y sin aviso para el cliente', !/variant-selects|g-packs|g-offer|g-editor-note/.test(s));
  ok('D3 galería con las 5 imágenes del tema (completa → detalle → infografía → principal → oración), lazy, con alt', count(s, /class="g-gallery__slide[ "]/g) === 5 && /producto-completa-1080[\s\S]*producto-detalle-600[\s\S]*producto-infografia-1254[\s\S]*producto-principal-1080[\s\S]*producto-oracion-1080/.test(s) && count(s, /loading="lazy"/g) >= 5 && !/alt=""/.test((s.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0]));
  ok('D4 frase de fe una sola vez en la página, antes del botón', count(r.html, /Un símbolo de tu fe, contigo cada día\./g) === 1 && s.indexOf('g-trust__phrase') > 0 && s.indexOf('g-trust__phrase') < s.indexOf('ProductSubmitButton'));
  ok('D5 título del producto como H2 (el H1 es la portada) y botón de pago dinámico', /<h2 class="product__title h1"/.test(s) && /shopify-payment-button/.test(s));
  ok('D6 sin selector de cantidad (cada pack = una variante con cantidad 1)', !/quantity-input|name="quantity"/.test(s));
  ok('D7 un único Product JSON-LD en la home', count(r.html, /"@type":\s*"Product"/g) === 1, count(r.html, /"@type":\s*"Product"/g));
  ok('D8 sin claims prohibidos en la home', !/14 ?k|oro real|chapad|hipoalerg|waterproof|resistente al agua|no se oxida|bendici|protecci[oó]n|milagro|suerte|energ[ií]a/i.test(visibleText(r.html)));
  await setState('design=1'); r = await get('/');
  ok('D9 editor sin packs en Shopify: aviso solo en el editor', /g-editor-note/.test(section(r.html)) && /opción «Pack»/.test(r.html));
  await setState('design=0&mode=pack3save'); r = await get('/'); s = section(r.html);
  const rows = [...s.matchAll(/<label[^>]*class="g-offer__card[^"]*"[^>]*>([\s\S]*?)<\/label>/g)].map(m => text(m[1]).trim());
  ok('D10 tarjetas con ahorro real: precio de cada pack + precio/pulsera y ahorro solo en 2 y 3', JSON.stringify(rows) === JSON.stringify(['1 pulsera Ideal para ti 19,99 €', 'Recomendado 2 pulseras Perfecto para regalar 17,50 € por pulsera Ahorras 4,99 € 34,99 €', '3 pulseras Ahorra más por unidad 16,00 € por pulsera Ahorras 11,98 € 47,99 €']) && /Ahorro calculado frente a comprar cada pulsera por separado\./.test(s), rows);
  ok('D11 tarjetas dentro del <variant-selects> de Dawn con «1 pulsera · 2 pulseras · 3 pulseras»', /<variant-selects[^>]*class="g-offer"/.test(s) && ['1 pulsera', '2 pulseras', '3 pulseras'].every(v => new RegExp(`value="${v}"`).test(s)) && count(s, /<variant-selects/g) === 1);
  await setState('mode=pack3'); r = await get('/'); s = section(r.html);
  ok('D12 packs sin ahorro real (mismo precio por unidad): ni «ahorras», ni precio por pulsera, ni «Ahorra más por unidad», ni nota de ahorro', /g-offer__card/.test(s) && !/ahorras|por pulsera|Ahorra más|Ahorro calculado/i.test(s));
  await setState('mode=other'); r = await get('/'); s = section(r.html);
  ok('D13 producto con otra opción (Color): sin tarjetas, selector estándar de Dawn y precio visible', /variant-selects/.test(s) && !/g-packs|g-offer__card/.test(s) && !/g-price--offer/.test(s) && /19,99 €/.test(s));
  await setState('mode=single&reviews=summary'); r = await get('/'); s = section(r.html);
  ok('D14 valoración REAL (metafields simulados) junto al precio: 4.6 / 5 (12)', /class="rating"/.test(s) && /4\.6\s*\/\s*5/.test(text(s)) && /\(12\)/.test(s));
  await setState('reviews=none'); r = await get('/'); s = section(r.html);
  ok('D15 sin valoración: ni estrellas ni «0 opiniones»', !/class="rating"|rating-count|0 opiniones/.test(s));
  await setState('catalog=none'); r = await get('/');
  ok('D16 sin productos: / → 200, el cliente no ve una ficha de ejemplo', r.status === 200 && !/<section\s+id="comprar"|onboarding|Título de ejemplo|Example product/i.test(r.html));
  await setState('catalog=none&design=1'); r = await get('/');
  ok('D17 sin productos en el editor: la sección se ve como marcador', /product-info/.test(r.html));
  await reset();

  // Interacción real con el JS de Dawn.
  await setState('mode=pack3save&reset=1');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('.g-hero__button'); await page.waitForTimeout(700);
    const top = await page.evaluate(() => document.getElementById('comprar').getBoundingClientRect().top);
    ok('D18 «Elegir mi pulsera» lleva a #comprar', Math.abs(top) < 120 && page.url().endsWith('/#comprar'), { top, url: page.url() });
    await page.click('label:has-text("2 pulseras")'); await page.waitForTimeout(900);
    const price = await page.evaluate(() => document.querySelector('[id^="price-"] .price-item--regular, [id^="price-"] .price-item--sale').textContent.trim());
    const idv = await page.evaluate(() => document.querySelector('#comprar form[id^="product-form-template"] input[name="id"]').value);
    ok('D19 elegir «2 pulseras» actualiza precio (34,99 €) y variante del formulario (4102)', /34,99/.test(price) && idv === '4102', { price, idv });
    await page.click('#comprar [id^="ProductSubmitButton-"]'); await page.waitForTimeout(1200);
    const st = await (await fetch(B + '/__state')).json();
    const last = st.log[st.log.length - 1] || {};
    ok('D20 «Añadir al carrito» envía la variante del pack (4102) con cantidad 1 (sin quantity = 1 en Shopify)', last.id === '4102' && (last.quantity === undefined || last.quantity === '1') && st.cart.length === 1 && st.cart[0].quantity === 1, last);
    const drawer = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); return d && d.classList.contains('active') ? d.innerText : ''; });
    ok('D21 se abre el cajón del carrito con «Pack: 2 pulseras» × 1', /2 pulseras/.test(drawer) && /34,99/.test(drawer), drawer.slice(0, 200));
    ok('D22 sin errores JS durante la compra', errs.length === 0, errs);
    await page.close();
  }
  await setState('mode=pack3save&soldout=4103&reset=1');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('label:has-text("3 pulseras")'); await page.waitForTimeout(900);
    const btn = await page.evaluate(() => { const b = document.querySelector('#comprar [id^="ProductSubmitButton-"]'); return { dis: b.disabled, t: b.innerText.trim() }; });
    const row = await page.evaluate(() => [...document.querySelectorAll('#comprar .g-offer__card')].map(r => r.innerText.replace(/\s+/g, ' ')).find(t => /3 pulseras/.test(t)));
    ok('D23 pack agotado: botón «Agotado» desactivado y la tarjeta lo indica', btn.dis && /Agotado/i.test(btn.t) && /Agotado/.test(row), { btn, row });
    await page.close();
  }
  await reset();
  for (const [w, h] of [[320, 640], [360, 740], [375, 667], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
    await setState('mode=pack3save');
    const { page, errs } = await openPage(browser, '/', { width: w, height: h });
    const m = await page.evaluate(() => { const cards = [...document.querySelectorAll('#comprar .g-offer__card')]; const rects = cards.map(c => c.getBoundingClientRect());
      const prices = cards.map(c => { const p = c.querySelector('.g-offer__price').getBoundingClientRect(); const r = c.getBoundingClientRect(); return p.right <= r.right + 0.5 && p.left >= r.left; });
      const chips = [...document.querySelectorAll('#comprar .g-trust__chip')].map(c => c.getBoundingClientRect()); const q = document.querySelector('#comprar .g-trust__phrase').getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, n: cards.length, hs: rects.map(r => Math.round(r.height)), oneCol: new Set(rects.map(r => Math.round(r.left))).size === 1, prices,
        chipCols: new Set(chips.map(c => Math.round(c.left))).size, chipRows: new Set(chips.map(c => Math.round(c.top))).size, chipH: chips.map(c => Math.round(c.height)), quoteH: Math.round(q.height),
        btn: Math.round(document.querySelector('#comprar [id^="ProductSubmitButton-"]').getBoundingClientRect().height) }; });
    ok(`D24 ${w}px: compra sin scroll horizontal; 3 tarjetas apiladas ≥ 44 px con el precio dentro; garantías 2 × 2 (≥ 44 px); frase compacta (≤ 80 px); botón ≥ 44 px`, m.sw <= m.cw && m.n === 3 && m.oneCol && m.hs.every(x => x >= 44) && m.prices.every(Boolean) && m.chipCols === 2 && m.chipRows === 2 && m.chipH.every(x => x >= 44) && m.btn >= 44 && m.quoteH <= 80 && errs.length === 0, m);
    await page.close();
  }
  await reset();
};
