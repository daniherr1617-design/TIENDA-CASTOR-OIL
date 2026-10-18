// SOLO TEST · Fase AD: imágenes nuevas, packs 1 / 2+1 / 3+1, «Comprar ahora» único en móvil y «Detalles» compactos
// (propietario, 2026-10-15, D47).
// 1) La tienda usa solo «IMAGEN 1/2/3.png» (main 8ee1206): completa ← 1, oracion ← 2, principal ← 3; sin infografía.
// 2) Ofertas «1 pulsera» 19,99 € · «2 pulseras y 1 de regalo» 29,99 € (3) · «3 pulseras y 1 de regalo» 34,99 € (4):
//    precios, precio por pulsera y ahorro salen de las variantes simuladas (mode=d47), nada escrito en el tema.
// 3) En móvil, «Comprar ahora» es el único botón principal de la compra; pagos acelerados nativos debajo si Shopify
//    los ofrece (wallet=1), sin botón genérico; el escritorio no cambia.
// 4) «Detalles de la pulsera» en 6 tarjetas compactas, sin imagen.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, count, text, B, THEME } = T;
const fs = require('fs');
const { execSync, spawnSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '4b031c6'; // HEAD antes de la ronda AD
const ROUND_HEAD = '260cd8e'; // Ronda AE: commit del tema de la ronda AD (alcance fijado a AD, como en T…AC)
const OWNER_UPLOAD = '8ee1206'; // subida del propietario a main (2026-10-15): «IMAGEN 1.png», «IMAGEN 2.png», «IMAGEN 3.png»
const REPO = fs.existsSync(THEME + '/.git');
const D47 = 'mode=d47&reviews=both&rating=4.9&rcount=28';
const buy = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
const main = (html) => (html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
const det = (h) => (h.match(/<section[^>]*id="detalles"[\s\S]*?<\/section>/) || [''])[0];
const log = async () => (await (await fetch(B + '/__state')).json()).log;
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };
const PACKS = [['1 pulsera', 4101, '19,99'], ['2 pulseras y 1 de regalo', 4102, '29,99'], ['3 pulseras y 1 de regalo', 4103, '34,99']];
const CARDS = ['1 pulsera Ideal para ti 19,99 €',
  '2 pulseras y 1 de regalo Recibes 3 pulseras Perfecto para regalar 10,00 € por pulsera Ahorras 9,99 € 29,99 €',
  'Mejor precio por pulsera 3 pulseras y 1 de regalo Recibes 4 pulseras Para ti y para compartir 8,75 € por pulsera Ahorras 24,98 € 34,99 €'];
const SPECS = ['Acero inoxidable', 'Medalla de la Virgen María', 'Cruz integrada', 'Cuentas tricolor', 'Longitud', 'Ajuste'];

module.exports = async function (browser) {
  await reset();
  // 1 · Fuentes y assets: solo las tres imágenes aprobadas, reducidas sin retoque; nada de la infografía
  if (REPO) {
    const blob = (rev, f) => spawnSync('git', ['-C', THEME, 'cat-file', 'blob', `${rev}:${f}`], { maxBuffer: 64 * 1024 * 1024 }).stdout;
    const srcs = ['IMAGEN 1.png', 'IMAGEN 2.png', 'IMAGEN 3.png'];
    ok('AD1 «IMAGEN 1/2/3.png» son byte a byte las subidas por el propietario a main (8ee1206)', srcs.every(f => fs.existsSync(`${THEME}/${f}`) && fs.readFileSync(`${THEME}/${f}`).equals(blob(OWNER_UPLOAD, f))));
    ok('AD2 fuentes antiguas retiradas de la raíz («NUEVA IMAGEN 1/3/4.png», «imagen 2.png»)', ['NUEVA IMAGEN 1.png', 'NUEVA IMAGEN 3.png', 'NUEVA IMAGEN 4.png', 'imagen 2.png'].every(f => !fs.existsSync(`${THEME}/${f}`)));
    const chk = spawnSync('python3', [`${THEME}/tools/garelon_fotos.py`, '--check'], { encoding: 'utf8' });
    ok('AD3 tools/garelon_fotos.py --check: cada WebP es la reducción de su fuente (completa ← 1, oracion ← 2, principal ← 3), sin ampliar ni retocar', chk.status === 0, chk.stdout.trim().split('\n').slice(-4));
  }
  const fotos = fs.readdirSync(`${THEME}/assets`).filter(f => /^producto-/.test(f)).sort();
  ok('AD4 assets: solo producto-{completa,oracion,principal}-{480,720,1080}.webp (9 archivos), ninguno de la infografía',
    JSON.stringify(fotos) === JSON.stringify(['completa', 'oracion', 'principal'].flatMap(k => [1080, 480, 720].map(w => `producto-${k}-${w}.webp`))), fotos);
  const grepInf = execSync(`grep -rlE "infografia|alt_infografia|g-zoom" ${THEME}/assets ${THEME}/config ${THEME}/layout ${THEME}/locales ${THEME}/sections ${THEME}/snippets ${THEME}/templates || true`).toString().trim();
  ok('AD5 el tema no tiene ninguna referencia a la infografía ni a «Ampliar»', grepInf === '', grepInf);

  // 2 · Galerías: las tres fotos, en el mismo orden en home y ficha, la completa primera (LCP), sin repetir ninguna
  await setState(D47);
  const home = (await get('/')).html; const pdp = (await get(P)).html;
  for (const [n, g] of [['home', gallery(buy(home))], ['ficha', gallery(pdp)]]) {
    ok(`AD6 ${n}: galería completa (IMAGEN 1) → principal (IMAGEN 3) → oración (IMAGEN 2), 3 diapositivas «1 / 3»…«3 / 3», la 1.ª eager`,
      JSON.stringify(slides(g)) === JSON.stringify(['completa', 'principal', 'oracion']) && count(g, /class="g-gallery__slide/g) === 3 && /3 \/ 3/.test(g) && !/4 \/ /.test(g)
      && /<img[^>]*producto-completa-[^>]*loading="eager"|loading="eager"[^>]*producto-completa-/.test(g), slides(g));
  }
  ok('AD7 «Detalles» de home y ficha sin imagen (la infografía se retira)', !/<img/.test(det(home)) && !/<img/.test(det(pdp)) && /g-details--compact/.test(det(home) + det(pdp)));

  // 3 · Navegador: fotos cargadas, rejilla de escritorio sin huecos, móvil deslizable a todo el ancho
  for (const [u, vp] of [['/', { width: 390, height: 844 }], ['/', { width: 1440, height: 900 }], [P, { width: 390, height: 844 }], [P, { width: 1440, height: 900 }], [P, { width: 320, height: 568 }], [P, { width: 1024, height: 768 }]]) {
    await reset(); await setState(D47);
    const { page, errs } = await openPage(browser, u, vp);
    const m = await page.evaluate(async () => {
      const g = document.querySelector('.g-gallery'); const imgs = [...g.querySelectorAll('img')];
      for (const i of imgs) { i.loading = 'eager'; await i.decode().catch(() => {}); }
      const r = [...g.querySelectorAll('.g-gallery__slide')].map(s => { const b = s.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; });
      const track = g.querySelector('.g-gallery__track').getBoundingClientRect();
      return { n: imgs.length, broken: imgs.filter(i => !(i.complete && i.naturalWidth > 0)).length, r, tw: Math.round(track.width), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    const desk = vp.width >= 750;
    const layout = desk
      ? Math.abs(m.r[0][2] - m.tw) <= 1 && m.r[1][1] === m.r[2][1] && m.r[1][1] > m.r[0][1] && Math.abs(m.r[1][2] - m.r[2][2]) <= 1 && Math.abs(m.r[1][3] - m.r[2][3]) <= 1
      : m.r.every(x => Math.abs(x[2] - m.tw) <= 1 && x[1] === m.r[0][1]);
    ok(`AD8 ${u === '/' ? 'home' : 'ficha'} ${vp.width}px: 3 fotos cargadas, ${desk ? 'la 1.ª a todo el ancho y las otras dos en una fila igual (sin huecos)' : 'deslizables a todo el ancho'}, sin scroll horizontal ni peticiones fallidas`,
      m.n === 3 && m.broken === 0 && layout && m.sw <= m.cw && errs.length === 0, { ...m, errs });
    await page.close();
  }

  // 4 · Packs: tarjetas con las unidades y los precios de las variantes; ahorro solo sobre las pulseras pagadas
  await reset(); await setState(D47);
  for (const [n, u, pick] of [['home', '/', buy], ['ficha', P, main]]) {
    const s = pick((await get(u)).html);
    const c = [...s.matchAll(/<label[^>]*class="g-offer__card[^"]*"[\s\S]*?<\/label>/g)].map(x => text(x[0]).trim());
    ok(`AD9 ${n}: «2 pulseras y 1 de regalo · Recibes 3 · 10,00 €/u · Ahorras 9,99 €» y «3 pulseras y 1 de regalo · Recibes 4 · 8,75 €/u · Ahorras 24,98 €», distintivo en la 3.ª`, JSON.stringify(c) === JSON.stringify(CARDS), c);
    const vals = [...s.matchAll(/class="g-offer__input"[^>]*value="([^"]+)"|value="([^"]+)"[^>]*class="g-offer__input"/g)].map(x => x[1] || x[2]);
    ok(`AD10 ${n}: cada tarjeta lleva el valor exacto de su variante (1 pulsera / 2 pulseras y 1 de regalo / 3 pulseras y 1 de regalo)`, JSON.stringify(vals) === JSON.stringify(PACKS.map(p => p[0])), vals);
  }
  for (const id of [4101, 4102, 4103]) await addToCart(id);
  {
    const r = await get('/cart'); const m = (r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]; const d = (r.html.match(/<cart-drawer[\s\S]*?<\/cart-drawer>/) || [''])[0];
    for (const [n, h] of [['/cart', m], ['cajón', d]]) {
      const lines = [...h.matchAll(/<div class="product-option g-cart-pack">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g)].map(x => text(x[1]).trim());
      ok(`AD11 ${n}: «Incluye 1 pulsera» / «Recibes 3 pulseras (2 pulseras y 1 de regalo)» / «Recibes 4 pulseras (3 pulseras y 1 de regalo)»`,
        JSON.stringify(lines) === JSON.stringify(['Incluye 1 pulsera', 'Recibes 3 pulseras (2 pulseras y 1 de regalo)', 'Recibes 4 pulseras (3 pulseras y 1 de regalo)']), lines);
    }
    const st = await (await fetch(B + '/__state')).json();
    ok('AD12 cada oferta entra como una línea de cantidad 1 de su variante (4101/4102/4103), total 84,97 €', JSON.stringify(st.cart) === '[{"id":4101,"quantity":1},{"id":4102,"quantity":1},{"id":4103,"quantity":1}]' && /84,97/.test(text(r.html)), st.cart);
  }
  const snippets = ['snippets/garelon-offer.liquid', 'snippets/garelon-pack-prices.liquid', 'snippets/garelon-pack-units.liquid', 'snippets/garelon-cart-option.liquid', 'templates/index.json', 'templates/product.json'].map(f => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')).join('\n');
  ok('AD13 sin precios ni nombres de pack escritos en el tema (19,99 / 29,99 / 34,99 / 8,75 / «de regalo»)', !/19[,.]99|29[,.]99|34[,.]99|8[,.]75|\d+ de regalo/.test(snippets));

  // 5 · Móvil: «Comprar ahora» único botón principal; cada pack llega al pago con su variante × 1
  const MOBILE = [[320, 568], [360, 740], [375, 667], [390, 844], [430, 932]];
  for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    for (const [w, h] of MOBILE) {
      await reset(); await setState(D47);
      const { page, errs } = await openPage(browser, u, { width: w, height: h });
      const m = await page.evaluate(() => {
        const root = document.querySelector('#comprar') || document.querySelector('product-info[id^="MainProduct-"]');
        const vis = [...root.querySelectorAll('.product-form__buttons button, .product-form__buttons a')].filter(b => b.offsetParent !== null && getComputedStyle(b).visibility !== 'hidden').map(b => b.textContent.replace(/\s+/g, ' ').trim());
        const bn = root.querySelector('[data-garelon-buy-now]').getBoundingClientRect();
        return { vis, h: Math.round(bn.height), w: Math.round(bn.width), wrap: Math.round(root.querySelector('.product-form__buttons').getBoundingClientRect().width), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
      });
      ok(`AD14 ${name} ${w}px: un único botón visible en la compra, «Comprar ahora · 19,99 €» a todo el ancho (≥ 44 px), sin «Añadir al carrito» ni botón genérico`,
        m.vis.length === 1 && /^Comprar ahora/.test(m.vis[0]) && /19,99 €/.test(m.vis[0]) && m.h >= 44 && Math.abs(m.w - m.wrap) <= 1 && m.sw <= m.cw && errs.length === 0, { ...m, errs });
      await page.close();
    }
  }
  for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    for (const [label, id, price] of PACKS) {
      await reset(); await setState(D47);
      const { page, errs } = await openPage(browser, u, { width: 390, height: 844 });
      await page.click(T.card(label)); await page.waitForTimeout(900);
      const btn = await page.evaluate(() => document.querySelector('[data-garelon-buy-now]').textContent.replace(/\s+/g, ' ').trim());
      await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
      const lines = await page.$$eval('#lines li', (li) => li.map((l) => [Number(l.dataset.variant), Number(l.dataset.qty)])).catch(() => []);
      const last = (await log()).pop() || {};
      ok(`AD15 ${name} «${label}»: «Comprar ahora · ${price} €» → /cart/update.js {${id}: 1} → pago de Shopify con solo esa variante × 1`,
        btn.includes(`${price} €`) && JSON.stringify(last.update) === JSON.stringify({ [id]: 1 }) && /\/checkout$/.test(page.url()) && JSON.stringify(lines) === JSON.stringify([[id, 1]]) && errs.length === 0, { btn, last, url: page.url(), lines, errs });
      await page.close();
    }
  }
  {
    // La compra fija (al bajar) compra el mismo pack que las tarjetas.
    await reset(); await setState(D47);
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click(T.card('3 pulseras y 1 de regalo')); await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(700);
    const st = await page.evaluate(() => ({ title: document.querySelector('[data-sticky-title]').textContent.trim(), label: document.querySelector('[data-sticky-button]').textContent.trim() }));
    await page.click('[data-sticky-button]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
    const lines = await page.$$eval('#lines li', (li) => li.map((l) => [Number(l.dataset.variant), Number(l.dataset.qty)])).catch(() => []);
    ok('AD16 compra fija con «3 pulseras y 1 de regalo» y «Comprar ahora» → pago con 4103 × 1', st.title === '3 pulseras y 1 de regalo' && st.label === 'Comprar ahora' && JSON.stringify(lines) === JSON.stringify([[4103, 1]]) && errs.length === 0, { st, lines, errs });
    await page.close();
  }
  {
    // Con otro pack ya en el carrito (p. ej. añadido desde el ordenador), «Comprar ahora» no lo manda al pago: abre el carrito.
    await reset(); await setState(D47); await addToCart(4101);
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click(T.card('3 pulseras y 1 de regalo')); await page.waitForTimeout(900);
    await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/cart$/, { timeout: 5000 }).catch(() => {});
    const st = await (await fetch(B + '/__state')).json();
    ok('AD17 con otro pack en el carrito, «Comprar ahora» lo conserva y abre el carrito para revisar (nunca un pago con una variante que no se eligió)',
      /\/cart$/.test(page.url()) && JSON.stringify(st.cart) === JSON.stringify([{ id: 4101, quantity: 1 }, { id: 4103, quantity: 1 }]) && errs.length === 0, { url: page.url(), cart: st.cart, errs });
    await page.close();
  }

  // 6 · Pago acelerado nativo: en móvil debajo de «Comprar ahora» si Shopify lo ofrece; nunca el botón genérico
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    for (const wallet of [1, 0]) {
      await reset(); await setState(D47 + `&wallet=${wallet}`);
      const { page, errs } = await openPage(browser, P, { width: w, height: h });
      const m = await page.evaluate(() => {
        const root = document.querySelector('product-info[id^="MainProduct-"]'); const v = (s) => { const e = root.querySelector(s); return !!e && e.offsetParent !== null; };
        const bn = root.querySelector('[data-garelon-buy-now]').getBoundingClientRect(); const wl = root.querySelector('[data-testid="wallet"]');
        return { buyNow: v('[data-garelon-buy-now]'), atc: v('[id^="ProductSubmitButton-"]'), wallet: v('[data-testid="wallet"]'), more: v('.shopify-payment-button__more-options'), generic: v('.shopify-payment-button__button--unbranded'),
          below: wl ? wl.getBoundingClientRect().top >= bn.bottom : null };
      });
      const want = w < 750
        ? (wallet ? m.buyNow && !m.atc && m.wallet && m.below && !m.more : m.buyNow && !m.atc && !m.generic)
        : (wallet ? !m.buyNow && m.atc && m.wallet && m.more : !m.buyNow && m.atc && m.generic);
      ok(`AD18 ficha ${w}px ${wallet ? 'con' : 'sin'} pago acelerado: ${w < 750 ? (wallet ? 'botón nativo bajo «Comprar ahora», sin «Más opciones de pago»' : 'solo «Comprar ahora», sin botón genérico') : (wallet ? 'escritorio como antes (Añadir al carrito + botón nativo + más opciones)' : 'escritorio como antes (Añadir al carrito + «Comprar ya» genérico)')}`,
        want && errs.length === 0, { ...m, errs });
      await page.close();
    }
  }
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const j = JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8'));
    const bb = Object.values(j.sections[f.includes('index') ? 'compra' : 'main'].blocks).find(b => b.type === 'buy_buttons');
    ok(`AD19 ${f}: «Comprar ahora» activo, pago acelerado nativo permitido en móvil y pago dinámico de escritorio intacto`, bb.settings.garelon_buy_now === true && bb.settings.garelon_mobile_wallets === true && bb.settings.show_dynamic_checkout === true, bb.settings);
  }

  // 7 · Escritorio y tableta: compra igual que antes («Añadir al carrito» relleno, sin «Comprar ahora»)
  for (const [w, h] of [[768, 1024], [1024, 768], [1440, 900]]) {
    for (const [name, u] of [['home', '/'], ['ficha', P]]) {
      await reset(); await setState(D47);
      const { page, errs } = await openPage(browser, u, { width: w, height: h });
      const m = await page.evaluate(() => {
        const root = document.querySelector('#comprar') || document.querySelector('product-info[id^="MainProduct-"]'); const atc = root.querySelector('[id^="ProductSubmitButton-"]');
        return { bn: getComputedStyle(root.querySelector('[data-garelon-buy-now]')).display, atc: atc.offsetParent !== null, bg: getComputedStyle(atc).backgroundColor, pay: getComputedStyle(root.querySelector('.shopify-payment-button')).display };
      });
      ok(`AD20 ${name} ${w}px: «Añadir al carrito» relleno y pago dinámico como antes; sin «Comprar ahora»`, m.bn === 'none' && m.atc && m.bg === 'rgb(134, 103, 47)' && m.pay !== 'none' && errs.length === 0, { ...m, errs });
      await page.close();
    }
  }
  {
    await reset(); await setState(D47);
    const { page, errs } = await openPage(browser, P, { width: 1440, height: 900 });
    await page.click('main ' + T.card('3 pulseras y 1 de regalo')); await page.waitForTimeout(800);
    await page.click('main .product-form__submit'); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok('AD21 escritorio: «Añadir al carrito» con el 3.er pack abre el cajón con «Recibes 4 pulseras (3 pulseras y 1 de regalo)», 34,99 €, 4103 × 1', /Recibes 4 pulseras \(3 pulseras y 1 de regalo\)/.test(d) && /34,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, [d.slice(0, 200), s.cart, errs]);
    await page.close();
  }

  // 8 · «Detalles de la pulsera»: 6 tarjetas compactas con la información confirmada, sin imagen
  for (const [n, h] of [['home', home], ['ficha', pdp]]) {
    const titles = [...det(h).matchAll(/<h3 class="g-spec__title">([\s\S]*?)<\/h3>/g)].map(x => text(x[1]).trim());
    const t = text(det(h));
    ok(`AD22 ${n}: «Detalles de la pulsera» con 6 tarjetas: ${SPECS.join(' · ')}; medalla, cruz integrada, tricolor, 20 cm y 3 aros`,
      JSON.stringify(titles) === JSON.stringify(SPECS) && /Detalles de la pulsera/.test(t) && /dorado pulido/.test(t) && /detalles brillantes/.test(t) && /Forma parte de la pulsera/.test(t) && /Medalla ovalada con la imagen de la Virgen María, rodeada de detalles brillantes/.test(t)
      && /dorado, plateado y rosado/.test(t) && /20 cm \(7,87 pulgadas\)/.test(t) && /3 aros/.test(t), titles);
    ok(`AD23 ${n}: sin afirmaciones nuevas (14K, hipoalergénico, resistente al agua, no se oxida…)`, !/14\s?k|hipoalerg|waterproof|resistente al agua|no se oxida|no pierde/i.test(t));
  }
  for (const [w, h, maxH] of [[320, 568, 620], [390, 844, 520], [768, 1024, 520], [1440, 900, 460]]) {
    await reset(); await setState(D47);
    const { page, errs } = await openPage(browser, P, { width: w, height: h });
    const m = await page.evaluate(() => {
      const d = document.querySelector('#detalles'); const cards = [...d.querySelectorAll('.g-spec')].map(c => c.getBoundingClientRect());
      const cols = new Set(cards.map(c => Math.round(c.left))).size; const over = [...d.querySelectorAll('.g-spec, .g-spec *')].some(e => e.scrollWidth > e.clientWidth + 1);
      return { h: Math.round(d.getBoundingClientRect().height), cols, n: cards.length, over, img: d.querySelectorAll('img').length, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    ok(`AD24 ficha ${w}px: «Detalles» en ${w < 750 ? 2 : 3} columnas, ${m.h} px de alto (≤ ${maxH}; antes ${w < 750 ? '1122-1155' : '751'} px con la infografía), sin desbordes ni imagen`,
      m.n === 6 && m.cols === (w < 750 ? 2 : 3) && m.h <= maxH && !m.over && m.img === 0 && m.sw <= m.cw && errs.length === 0, { ...m, errs });
    await page.close();
  }

  // 9 · Alcance frente a la v1.24: solo imágenes, galería, detalles, botones móviles, textos alternativos y plantillas
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .sort();
    const allowed = /^(assets\/producto-(completa|principal|oracion)-(480|720|1080)\.webp|assets\/producto-infografia-v4-(480|720|1080|1254)\.webp|assets\/garelon\.css|locales\/[\w.-]+\.json|sections\/(featured-product|main-product|garelon-details|garelon-hero|garelon-image-text)\.liquid|snippets\/(garelon-image|garelon-gallery|garelon-pack-units|buy-buttons)\.liquid|templates\/(index|product)\.json)$/;
    const bad = changed.filter(f => !allowed.test(f));
    ok('AD25 alcance: solo fotos, CSS, textos alternativos, secciones con selector de imagen o de compra, galería, detalles, botones y las dos plantillas (sin layout, config, JS, cabecera, pie, opiniones ni FAQ)', bad.length === 0 && !changed.includes('assets/garelon.js'), bad);
    const tpl = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- templates`).toString().split('\n').filter(l => /^[+-]\s/.test(l)).map(l => l.trim());
    const okTpl = tpl.every(l => /gallery_keys|garelon_mobile_wallets|"image_key"|"image_alt"|"layout"|"padding_(top|bottom)"|"icon"|"title"|"text"|"type": "item"|"settings": \{|^[+-]\s*"d[1-6]"|^[+-]\s*\}|^[+-]\s*"d6": \{/.test(l));
    ok('AD26 plantillas: solo cambian galería, pago acelerado en móvil, imagen/alt de «Detalles» y «Significado», y los bloques y el diseño de «Detalles»', okTpl, tpl.filter(l => !/gallery_keys|garelon_mobile_wallets|"image_key"|"image_alt"|"layout"|"padding_(top|bottom)"|"icon"|"title"|"text"|"type": "item"|"settings": \{|^[+-]\s*"d[1-6]"|^[+-]\s*\}|^[+-]\s*"d6": \{/.test(l)));
    const loc = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- locales`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    ok('AD27 locales: solo se retiran los textos de la infografía («alt_infografia», «Ampliar») y cambia el texto alternativo de la foto de la IMAGEN 2', loc.every(l => /alt_infografia|"zoom|alt_oracion|"alt_completa"/.test(l)), loc.filter(l => !/alt_infografia|"zoom|alt_oracion|"alt_completa"/.test(l)).slice(0, 5));
  }
};
