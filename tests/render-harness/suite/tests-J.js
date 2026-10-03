// SOLO TEST · Fase J: retoques finales (envío gratis bajo los packs, sello en «Compra con tranquilidad», orden de galería).
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '57ba415';
// Alcance de la ronda J: rango 57ba415..955bcc3 (fijado al versionar la batería; las rondas siguientes tienen su propia prueba de alcance).
const ROUND_HEAD = '955bcc3';
const REPO = fs.existsSync(THEME + '/.git');
// Frase antigua bajo los packs (products.product.shipping_policy_html). La nota del cajón del carrito es de Dawn y queda fuera del scope.
const OLD = /se calculan en la pantalla de pago|gastos de envío<\/a>|Shipping<\/a> calculated/;
const form = (html) => (html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const taxOf = (html) => text((html.match(/<p class="g-offer__tax">[\s\S]*?<\/p>/) || [''])[0]).trim();
const tranq = (html) => (html.match(/id="shopify-section-[^"]*__tranquilidad"[\s\S]*?(?=id="shopify-section-)/) || [''])[0];
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];

module.exports = async function (browser) {
  await setState('mode=pack3save&reset=1');
  // 1 · Texto de envío bajo los packs
  let r = await get('/');
  const home = r;
  ok('J1 home → 200', r.status === 200 && r.tpl === 'index');
  ok('J2 home: bajo los packs «Impuestos incluidos. Envío gratis.»', taxOf(r.html) === 'Impuestos incluidos. Envío gratis.', taxOf(r.html));
  ok('J3 home: ya no aparece «Los gastos de envío se calculan en la pantalla de pago»', !OLD.test(r.html) && !/pantalla de pago/.test(form(r.html)) && count(r.html, /class="g-offer__tax"/g) === 1);
  r = await get(P);
  const prod = r;
  ok('J4 ficha → 200 con el mismo texto y sin la frase antigua', r.status === 200 && r.tpl === 'product' && taxOf(r.html) === 'Impuestos incluidos. Envío gratis.' && !OLD.test(r.html) && !/pantalla de pago/.test(form(r.html)), taxOf(r.html));
  await setState('shipping=none');
  r = await get('/');
  ok('J5 sin política de envío publicada: sigue «Envío gratis» (no depende de la política)', taxOf(r.html) === 'Impuestos incluidos. Envío gratis.', taxOf(r.html));
  await setState('shipping=ok');

  // 2 · Sello en «Compra con tranquilidad»
  for (const [n, h] of [['home', home.html], ['ficha', prod.html]]) {
    const t = tranq(h);
    ok(`J6 ${n}: «Compra con tranquilidad» lleva el sello de escudo con check, decorativo, antes del subtítulo y con el texto legal intacto`,
      /<div class="g-seal g-seal--center" aria-hidden="true">\s*<span class="g-seal__ring"><svg\s+class="g-icon"[\s\S]*?d="M12 3l7 3v5c0 4\.6-3 8\.3-7 10-4-1\.7-7-5\.4-7-10V6z"[\s\S]*?d="M9 12l2\.2 2\.2L15\.5 10"/.test(t) &&
      t.indexOf('g-seal') < t.indexOf('14 días para cambiar de opinión') && /Compra con tranquilidad/.test(t) &&
      /En compras online dispones de 14 días naturales desde la recepción del pedido para ejercer tu derecho de desistimiento\./.test(t) && /href="\/policies\/refund-policy"/.test(t));
    ok(`J7 ${n}: un solo sello en la página (las demás secciones de texto no cambian)`, count(h, /class="g-seal /g) === 1);
  }

  // 3 · Orden de galería
  ok('J8 home: completa → detalle → infografía → principal → oración', JSON.stringify(slides(gallery((home.html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0]))) === JSON.stringify(['completa', 'detalle', 'infografia', 'principal', 'oracion']));
  const pg = gallery((prod.html.match(/<main[\s\S]*?<\/main>/) || [''])[0]);
  ok('J9 ficha: completa → principal → detalle → infografía → oración; la 1.ª (completa) es la única eager', JSON.stringify(slides(pg)) === JSON.stringify(['completa', 'principal', 'detalle', 'infografia', 'oracion']) && /<img[^>]*producto-completa-[^>]*loading="eager"|loading="eager"[^>]*producto-completa-/.test(pg) && count(pg, /loading="eager"/g) === 1, slides(pg));

  // 4 · Responsive
  for (const u of ['/', P]) for (const w of VPS) {
    const { page, errs } = await openPage(browser, u, { width: w, height: w < 750 ? 844 : 900 });
    const res = await page.evaluate(() => {
      const cw = document.documentElement.clientWidth; const out = [];
      const tax = document.querySelector('.g-offer__tax'); const tb = tax.getBoundingClientRect(); const card = tax.closest('variant-selects').getBoundingClientRect();
      const ring = document.querySelector('.g-seal__ring'); const rb = ring.getBoundingClientRect();
      const box = ring.closest('.rich-text').getBoundingClientRect(); const cap = ring.closest('.rich-text__blocks').querySelector('.rich-text__caption').getBoundingClientRect();
      const icon = ring.querySelector('svg').getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, cw, tax: tax.innerText.trim(), taxIn: tb.left >= card.left - 1 && tb.right <= card.right + 1, taxLines: Math.round(tb.height / parseFloat(getComputedStyle(tax).lineHeight)),
        ring: [Math.round(rb.width), Math.round(rb.height)], centered: Math.abs((rb.left + rb.right) / 2 - (box.left + box.right) / 2) <= 1.5, inside: rb.left > box.left && rb.right < box.right && rb.top > box.top,
        gap: Math.round(cap.top - rb.bottom), iconMid: Math.abs((icon.left + icon.right) / 2 - (rb.left + rb.right) / 2) <= 1 };
    });
    const mob = w < 750; const n = `${u === '/' ? 'home' : 'ficha'} ${w}px`;
    ok(`J10 ${n}: sin scroll horizontal; texto de envío en 1 línea dentro de la zona de packs`, res.sw <= res.cw && res.tax === 'Impuestos incluidos. Envío gratis.' && res.taxIn && res.taxLines === 1, res);
    ok(`J11 ${n}: sello redondo ${mob ? '64' : '72'} px, centrado en la tarjeta, dentro de ella y separado del subtítulo`, res.ring[0] === res.ring[1] && res.ring[0] === (mob ? 64 : 72) && res.centered && res.inside && res.iconMid && res.gap >= 12 && res.gap <= 24, res);
    ok(`J12 ${n}: sin errores JS`, errs.length === 0, errs);
    await page.close();
  }

  // 5 · Variante y carrito con el texto nuevo
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('label:has-text("2 pulseras")'); await page.waitForTimeout(900);
    const st = await page.evaluate(() => ({ id: document.querySelector('#comprar form[id^="product-form-template"] input[name="id"]').value, tax: document.querySelector('.g-offer__tax').innerText.trim() }));
    ok('J13 al cambiar a «2 pulseras» la variante cambia (4102) y el texto de envío se mantiene', st.id === '4102' && st.tax === 'Impuestos incluidos. Envío gratis.', st);
    await page.click('#comprar [id^="ProductSubmitButton-"]'); await page.waitForTimeout(1200);
    const s = await (await fetch(T.B + '/__state')).json();
    ok('J14 añadir al carrito: 1 línea, cantidad 1, sin errores JS', s.cart.length === 1 && s.cart[0].quantity === 1 && errs.length === 0, { cart: s.cart, errs });
    await page.close();
  }
  r = await get('/cart'); ok('J15 /cart → 200', r.status === 200 && r.tpl === 'cart');
  await reset();
  r = await get('/ruta-inexistente-garelon'); ok('J16 ruta inexistente → 404', r.status === 404 && r.tpl === '404');

  // 6 · Locales y schema
  const locs = fs.readdirSync(`${THEME}/locales`).filter(f => !/schema/.test(f));
  ok('J17 «free_shipping» en los 31 idiomas (es: «Envío gratis.»)', locs.length === 31 && locs.every(f => JSON.parse(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')).garelon.offer.free_shipping) && JSON.parse(fs.readFileSync(`${THEME}/locales/es.json`, 'utf8')).garelon.offer.free_shipping === 'Envío gratis.');
  const schema = (f) => JSON.parse(fs.readFileSync(`${THEME}/sections/${f}`, 'utf8').match(/{% schema %}([\s\S]*){% endschema %}/)[1]);
  const fsOk = ['featured-product.liquid', 'main-product.liquid'].every(f => { const s = schema(f).blocks.find(b => b.type === 'garelon_offer').settings.find(x => x.id === 'free_shipping'); return s && s.type === 'checkbox' && s.default === true; });
  const rb = schema('rich-text.liquid').settings.find(x => x.id === 'garelon_badge');
  ok('J18 schema: «Envío gratis» activo por defecto en el bloque de packs; «Sello GARELON» en rich-text con «none» por defecto', fsOk && rb && rb.default === 'none' && rb.options.map(o => o.value).join() === 'none,escudo,candado');

  if (!REPO) return;
  // 7 · Plantillas: solo los cambios previstos frente a 57ba415
  const walk = (a, b, p, d) => { if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) d.push(p); return; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k, d); return d; };
  const diff = (f) => walk(JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString()), JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8')), '', []).sort();
  const di = diff('templates/index.json'); const dp = diff('templates/product.json');
  ok('J19 index.json intacto salvo el orden de la galería de compra y el sello de tranquilidad', JSON.stringify(di) === JSON.stringify(['.sections.compra.settings.garelon_gallery_keys', '.sections.tranquilidad.settings.garelon_badge']), di);
  ok('J20 product.json: solo orden de galería y sello', JSON.stringify(dp) === JSON.stringify(['.sections.main.settings.garelon_gallery_keys', '.sections.tranquilidad.settings.garelon_badge']), dp);
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(f => f && !/^locales\//.test(f));
  ok('J21 archivos tocados limitados al scope', JSON.stringify(changed.sort()) === JSON.stringify(['assets/garelon.css', 'sections/featured-product.liquid', 'sections/main-product.liquid', 'sections/rich-text.liquid', 'snippets/garelon-offer.liquid', 'templates/index.json', 'templates/product.json']), changed);
};
