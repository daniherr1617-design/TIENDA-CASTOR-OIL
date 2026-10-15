// SOLO TEST · Fase W: confianza y opiniones (propietario, 2026-10-13, D40). Valoración «★★★★★ 4,9/5 · 29 opiniones» junto
// al título, leída de los metafields reviews.rating / reviews.rating_count que sincroniza Judge.me, enlazada a #opiniones y
// oculta sin datos; nota de origen transparente sin tecnicismos; FAQ sin «según el proveedor»; nombres de oferta publicados
// en Shopify («2 pulseras y 1 de regalo», «3 pulseras y 2 de regalo», mode=live). Valoraciones y precios SIMULADOS.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'b02c016'; // HEAD antes de la ronda W
const ROUND_HEAD = '98dfa30'; // Ronda X: commit del tema de la ronda W (alcance fijado a W, como en T, U y V)
const REPO = fs.existsSync(THEME + '/.git');
const NOTE = 'Incluye opiniones de compradores de este mismo modelo en otra tienda online; no corresponden a pedidos de GARELON.';
const src = (f) => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '');
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const rating = (s) => (s.match(/<a\s+href="#opiniones"\s+class="g-rating"[\s\S]*?<\/a>/) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };

module.exports = async function (browser) {
  // 1 · Valoración junto al título, con los datos sincronizados (simulados: 4,6 y 12)
  await reset(); await setState('mode=live&reviews=both');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const s = buy(r.html, u); const a = rating(s);
    ok(`W1 ${n}: «4,6/5 · 12 opiniones» con estrellas al 92 %`, /4,6\s*\/5\s*·\s*12 opiniones/.test(text(a)) && /class="g-stars g-rating__stars" style="--g-rating: 92(\.0)?%;"/.test(a), text(a));
    const iT = s.search(/class="product__title[\s"]/); const iR = s.indexOf('class="g-rating"'); const iP = s.search(/id="price-/);
    ok(`W2 ${n}: está entre el título y el precio, una sola vez`, iT > -1 && iT < iR && iR < iP && count(s, /class="g-rating"/g) === 1, [iT, iR, iP]);
    ok(`W3 ${n}: enlace a #opiniones con etiqueta accesible y el destino existe una vez`, /aria-label="Valoración media 4,6 de 5, 12 opiniones\. Ir a las opiniones"/.test(a) && count(r.html, /\sid="opiniones"/g) === 1);
  }
  // Redondeo, singular y estados seguros
  for (const [q, want] of [['rating=4.86&rcount=29', '4,9/5 · 29 opiniones'], ['rating=5&rcount=1', '5,0/5 · 1 opinión'], ['rating=4&rcount=3', '4,0/5 · 3 opiniones']]) {
    await setState(`reviews=both&${q}`); const r = await get(P);
    ok(`W4 ${q}: «${want}»`, text(rating(buy(r.html, P))).replace(/\s+/g, ' ').replace(/ \/5/, '/5').trim() === want, text(rating(buy(r.html, P))));
  }
  for (const q of ['reviews=none', 'reviews=app', 'reviews=both&rating=0&rcount=0', 'reviews=both&rating=4.5&rcount=0']) {
    await setState('rating=&rcount='); await setState(q);
    for (const u of ['/', P]) {
      const r = await get(u); const s = buy(r.html, u);
      ok(`W5 ${q} ${u}: sin valoración, sin estrellas vacías ni «0 opiniones»`, !/g-rating|rating-star|0 opiniones|0\/5/.test(s), rating(s));
    }
  }
  await setState('rating=&rcount=');

  // 2 · Navegador: el enlace lleva a las opiniones por debajo de la cabecera fija; responsive sin desbordes
  await setState('reviews=both');
  for (const u of [P, '/']) {
    const { page, errs } = await openPage(browser, u, { width: 390, height: 844 });
    await page.click('main .g-rating'); await page.waitForTimeout(900);
    const m = await page.evaluate(() => {
      const o = document.getElementById('opiniones').getBoundingClientRect(); const h = document.querySelector('sticky-header, .section-header');
      return { hash: location.hash, top: Math.round(o.top), head: h ? Math.round(h.getBoundingClientRect().bottom) : 0 };
    });
    ok(`W6 ${u}: el clic lleva a #opiniones y el título no queda bajo la cabecera`, m.hash === '#opiniones' && m.top >= m.head - 1 && m.top < 220 && errs.length === 0, m);
    await page.close();
  }
  for (const w of [320, 360, 390, 430, 768, 1024, 1440]) {
    const { page, errs } = await openPage(browser, P, { width: w, height: 900 });
    const m = await page.evaluate(() => {
      const a = document.querySelector('main .g-rating'); const b = a.getBoundingClientRect(); const c = a.closest('.product__info-container') || a.parentElement;
      return { hs: document.documentElement.scrollWidth > innerWidth, h: Math.round(b.height), inside: b.right <= c.getBoundingClientRect().right + 1, txt: a.innerText.replace(/\s+/g, ' ').trim(), color: getComputedStyle(a.querySelector('.g-rating__stars')).backgroundImage };
    });
    ok(`W7 ${w}px: valoración legible, zona táctil ≥ 44 px, sin desbordes`, !m.hs && m.h >= 44 && m.h <= 72 && m.inside && m.txt === '4,6/5 · 12 opiniones' && /rgb\(134, 103, 47\)/.test(m.color) && errs.length === 0, m);
    await page.close();
  }

  // 3 · Transparencia: nota de origen, FAQ y ninguna mención a proveedores en el texto visible
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const t = text(r.html);
    // D41: la nota se reescribe y queda plegada en «Información sobre las opiniones» (W la tenía abierta con NOTE).
    ok(`W8 ${n}: nota de origen transparente tras el widget («no corresponden a pedidos realizados en GARELON»)`, /<div class="g-reviews__note rte">[\s\S]*?No corresponden a pedidos realizados en GARELON/.test(r.html) && /class="g-reviews__app"[\s\S]*g-reviews__note/.test(r.html) && !r.html.includes(NOTE));
    ok(`W9 ${n}: sin «proveedor», AliExpress, DSers, dropshipping, terceros ni Judge.me en el texto visible`, !/proveedor|ali ?express|dsers|dropship|terceros|judge\.?me/i.test(t), (t.match(/.{40}(proveedor|aliexpress|dsers|dropship|terceros|judge\.?me).{40}/i) || [''])[0]);
    ok(`W10 ${n}: sin compras verificadas, certificados, escasez ni urgencia inventados`, !/compra verificada|verified|certificad|garant[ií]a de por vida|quedan \d|últimas unidades|cuenta atrás|\+\s?\d+[.\d]* clientes/i.test(t));
  }
  {
    const r = await get('/');
    ok('W11 FAQ del material sin «según la información del proveedor» (D42: «Es de acero inoxidable con un acabado dorado pulido…»)', /<p>Es de acero inoxidable con un acabado dorado pulido /.test(r.html) && !/Según la información del proveedor/.test(r.html));
  }
  if (REPO) {
    const at = (f, c) => JSON.parse(execSync(`git -C ${THEME} show ${c}:${f}`).toString()).sections.opiniones;
    const same = (f) => { const x = at(f, BASE), y = at(f, ROUND_HEAD); delete x.settings.note; delete y.settings.note; return JSON.stringify(x) === JSON.stringify(y); };
    ok('W12b Judge.me: widget, bloques y ajustes de «GARELON Opiniones» intactos en home y ficha (solo cambia la nota)', ['templates/index.json', 'templates/product.json'].every(same));
  }
  ok('W12 rendimiento: un solo widget de Judge.me por página y sin scripts nuevos (la valoración es Liquid + CSS)', ['templates/index.json', 'templates/product.json'].every(f => (fs.readFileSync(`${THEME}/${f}`, 'utf8').match(/blocks\/review_widget\//g) || []).length === 1) && !/<script|\.js/.test(src('snippets/garelon-rating.liquid')));

  // 4 · Nombres de oferta publicados en Shopify (mode=live, opción «PACK»): unidades, precio por pulsera y carrito
  await reset(); await setState('mode=live');
  const WANT = ['1 pulsera Ideal para ti 19,99 €',
    '2 pulseras y 1 de regalo Recibes 3 pulseras Perfecto para regalar 10,00 € por pulsera Ahorras 9,99 € 29,99 €', // D41: ahorro solo sobre las pagadas
    'Mejor precio por pulsera 3 pulseras y 2 de regalo Recibes 5 pulseras Para ti y para compartir 7,00 € por pulsera Ahorras 24,98 € 34,99 €'];
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const c = cards(buy(r.html, u));
    ok(`W13 ${n}: «2 pulseras y 1 de regalo · Recibes 3» (10,00 €/u) y «3 pulseras y 2 de regalo · Recibes 5» (7,00 €/u), no 15,00 € ni 11,66 €`, JSON.stringify(c) === JSON.stringify(WANT) && !/15,00|11,66/.test(c.join(' ')), c);
  }
  for (const id of [4101, 4102, 4103]) await addToCart(id);
  {
    const r = await get('/cart'); const m = (r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0];
    const lines = [...m.matchAll(/<div class="product-option g-cart-pack">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g)].map(x => text(x[1]).trim());
    ok('W14 carrito: «Incluye 1 pulsera» / «Recibes 3 pulseras (2 pulseras y 1 de regalo)» / «Recibes 5 pulseras (3 pulseras y 2 de regalo)», total 84,97 €', JSON.stringify(lines) === JSON.stringify(['Incluye 1 pulsera', 'Recibes 3 pulseras (2 pulseras y 1 de regalo)', 'Recibes 5 pulseras (3 pulseras y 2 de regalo)']) && /84,97/.test(text(r.html)), lines);
  }
  await reset(); await setState('mode=live&reviews=both');
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click('main label:has-text("3 pulseras y 2 de regalo")'); await page.waitForTimeout(800);
    const id = await page.evaluate(() => document.querySelector('main form[id^="product-form-"] input[name="id"]').value);
    await T.clickAtc(page, 'main .product-form__submit'); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok('W15 navegador con valoración visible: 3.ª oferta → id 4103 → cajón «Recibes 5 pulseras (3 pulseras y 2 de regalo)», 34,99 €, cantidad 1', id === '4103' && /Recibes 5 pulseras \(3 pulseras y 2 de regalo\)/.test(d) && /34,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, [id, d.slice(0, 160)]);
    await page.close();
  }
  await reset();

  // 5 · Nada escrito a mano y alcance de la ronda
  const theme = src('snippets/garelon-rating.liquid') + fs.readFileSync(`${THEME}/templates/product.json`, 'utf8') + fs.readFileSync(`${THEME}/templates/index.json`, 'utf8');
  ok('W16 el tema no escribe la nota ni el número de opiniones (4,9 / 29 salen de los metafields)', !/4[,.]9|\b29 opiniones|\b29 reseñas|★/.test(theme));
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    const allowed = /^(assets\/garelon\.css|locales\/[\w.-]+\.json|sections\/(main-product|featured-product)\.liquid|snippets\/garelon-rating\.liquid|templates\/(index|product)\.json)$/;
    ok('W17 alcance: valoración (snippet, bloque rating de Dawn, CSS, locale), nota de origen y FAQ; sin tocar config, ofertas ni carrito', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    const diff = (p) => execSync(`git -C ${THEME} diff ${BASE} ${ROUND_HEAD} -- ${p}`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    const tpl = diff('templates');
    ok('W18 plantillas: solo cambian la nota de origen y la respuesta del material', tpl.length === 8 && tpl.every(l => /"note": "<p>Incluye opiniones|"answer": "<p>(Según la información del proveedor, es|Es) de acero inoxidable/.test(l)), tpl.slice(0, 4));
    const sec = diff('sections');
    ok('W19 secciones: solo el bloque «rating» de Dawn pasa a usar garelon-rating', sec.filter(l => l[0] === '+').every(l => /garelon-rating|GARELON: «★/.test(l)) && !sec.some(l => /when '/.test(l)), sec.filter(l => l[0] === '+'));
    const loc = diff('locales');
    ok('W20 locales: solo se añade garelon.reviews.rating_link', loc.every(l => /^\+\s+"rating_link": /.test(l) || /^[-+]\s+"editor_waiting": /.test(l)), loc.filter(l => !/rating_link|editor_waiting/.test(l)).slice(0, 4));
  }
};
