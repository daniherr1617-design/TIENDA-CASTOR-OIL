// SOLO TEST · Fase T: primera ronda CRO (2026-10-08). Pack de 3 como foco editorial («Mejor precio por pulsera»,
// sin preseleccionarlo), campaña temática «Octubre, mes del Rosario» sin descuento, packs más arriba en móvil (confianza
// debajo del botón), galería móvil sin hueco, opiniones antes de «Compra con tranquilidad», «Tu pack incluye N …» en el
// carrito y selector nativo de país en el pie. Precios SIMULADOS (mode=real: 19,99 / 29,99 / 34,99 €): el tema no los conoce.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'aa9c01a'; // HEAD antes de la ronda T (la próxima ronda fija aquí también el commit final de T)
const REPO = fs.existsSync(THEME + '/.git');
const MOBILE = [320, 360, 375, 390, 430];
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const PROMO = 'Octubre es el mes del Rosario. Llévala tú y comparte las otras dos con quien quieras.';
const BAR = 'Octubre, mes del Rosario · Envío gratis con seguimiento';
const CLAIM = /m[aá]s popular|m[aá]s vendid|best ?sell|top ventas/i;
const URGENCY = /quedan|últimas unidades|últimos días|termina en|cuenta atrás|solo hoy|personas (están )?viendo|\d+:\d\d:\d\d/i;
const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const buy = (html, u) => (u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };

module.exports = async function (browser) {
  // 1 · Configuración de «Elige tu oferta» (home y ficha): textos aprobados, distintivo en el pack de 3, promo de octubre
  const tp = json('templates/product.json'); const ti = json('templates/index.json');
  const offers = [ti.sections.compra.blocks.oferta.settings, tp.sections.main.blocks.oferta.settings];
  ok('T1 home y ficha: pack 1 «Ideal para ti», pack 2 «Perfecto para regalar», pack 3 «Para ti y para compartir»', offers.every(o => o.sub_1 === 'Ideal para ti' && o.sub_2 === 'Perfecto para regalar' && o.sub_3 === 'Para ti y para compartir'), offers.map(o => [o.sub_1, o.sub_2, o.sub_3]));
  ok('T2 home y ficha: distintivo en el pack de 3, «Mejor precio por pulsera»', offers.every(o => o.badge_pack === '3' && o.badge_text === 'Mejor precio por pulsera'), offers.map(o => [o.badge_pack, o.badge_text]));
  ok('T3 home y ficha: texto de octubre activo en la promo, exacto', offers.every(o => o.show_promo === true && o.promo_text === PROMO));
  const tpl = JSON.stringify([tp, ti, json('sections/header-group.json'), json('sections/footer-group.json')]);
  ok('T4 plantillas: sin «Más vendido»/«Más popular», sin urgencia, sin código ni descuento', !CLAIM.test(tpl) && !URGENCY.test(tpl) && !/ROSARIO10|descuento|% ?dto|-\s?\d+ ?%/i.test(tpl));
  ok('T5 barra superior: «Octubre, mes del Rosario · Envío gratis con seguimiento» (un solo anuncio, sin rotación)', (() => { const a = json('sections/header-group.json').sections['announcement-bar']; return a.block_order.length === 1 && a.blocks[a.block_order[0]].settings.text === BAR && a.settings.auto_rotate === false; })());

  // 2 · Render con los importes reales simulados: precio por unidad y ahorro calculados por el tema desde los precios
  await reset(); await setState('mode=real');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const s = buy(r.html, u); const c = cards(s);
    ok(`T6 ${n}: tarjetas con precio por pulsera y ahorro calculados desde los precios de la variante`, JSON.stringify(c) === JSON.stringify(['1 pulsera Ideal para ti 19,99 €', '2 pulseras Perfecto para regalar 15,00 € por pulsera Ahorras 9,99 € 29,99 €', 'Mejor precio por pulsera 3 pulseras Para ti y para compartir 11,66 € por pulsera Ahorras 24,98 € 34,99 €']), c);
    ok(`T7 ${n}: un solo distintivo, un solo «Ahorras» por pack y ninguna frase de ahorro repetida en el pack de 3`, count(s, /class="g-offer__badge"/g) === 1 && count(s, /class="g-offer__save"/g) === 2 && !/Ahorra más por unidad/.test(s), c);
    ok(`T8 ${n}: sin precio tachado (sin compare_at) y sin contador`, !/g-offer__was/.test(s) && !URGENCY.test(text(s)));
    const radios = [...s.matchAll(/<input\s+type="radio"[^>]*>/g)].map(m => /\schecked/.test(m[0]));
    ok(`T9 ${n}: el pack de 3 no se preselecciona (la variante inicial es la de Shopify: pack de 1)`, JSON.stringify(radios) === '[true,false,false]' && /name="id" value="4101"/.test(s), radios);
    const iPromo = s.indexOf('class="g-offer__promo"');
    ok(`T10 ${n}: el texto de octubre va debajo de las tarjetas y antes del botón, como párrafo discreto`, iPromo > s.lastIndexOf('g-offer__card') && iPromo < s.indexOf('ProductSubmitButton') && s.includes(`<p class="g-offer__promo">${PROMO}</p>`));
    ok(`T11 ${n}: el CTA sigue siendo el nativo «Añadir al carrito»`, /<span>\s*Añadir al carrito\s*<\/span>/.test(s));
  }
  const r0 = await get('/');
  ok('T12 la barra superior se pinta con el texto de octubre', r0.html.includes(BAR) && !URGENCY.test(text((r0.html.match(/<div class="announcement-bar[\s\S]*?<\/div>/) || [''])[0])));

  // 3 · «Mejor precio» solo si es verdad (lo decide el tema con los precios de Shopify)
  for (const [mode, want] of [['pack3save', '3'], ['compare', '3'], ['nosave', ''], ['pack3', '']]) {
    await setState(`mode=${mode}`); const r = await get(P); const s = buy(r.html, P);
    const b = [...s.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].filter(m => /g-offer__badge/.test(m[0])).map(m => (/(\d) pulseras?/.exec(text(m[0])) || [])[1]);
    ok(`T13 ${mode}: «Mejor precio por pulsera» ${want ? 'en el pack de 3' : 'oculto (ningún pack tiene un precio por unidad más bajo)'}`, JSON.stringify(b) === JSON.stringify(want ? [want] : []), b);
  }

  // 4 · Orden de secciones: compra → opiniones → «Compra con tranquilidad» (más compacta, mismo texto legal)
  ok('T14 ficha: main → opiniones → tranquilidad; confianza debajo del botón', tp.order.slice(0, 3).join() === 'main,opiniones,tranquilidad' && tp.sections.main.block_order.join() === 'antetitulo,titulo,valoracion,precio,resumen,oferta,comprar,confianza,descripcion,envios', [tp.order, tp.sections.main.block_order]);
  ok('T15 home: portada → compra → opiniones → tranquilidad; confianza debajo del botón', ti.order.slice(0, 4).join() === 'portada,compra,opiniones,tranquilidad' && ti.sections.compra.block_order.join() === 'titulo,valoracion,precio,oferta,comprar,confianza', [ti.order, ti.sections.compra.block_order]);
  const tq = [tp, ti].map(t => t.sections.tranquilidad);
  ok('T16 «Compra con tranquilidad» más compacta (H2, 36 px) con el texto legal y el enlace intactos', tq.every(t => t.blocks.titulo.settings.heading_size === 'h2' && t.settings.padding_top === 36 && t.settings.padding_bottom === 36 && /14 días naturales desde la recepción del pedido para ejercer tu derecho de desistimiento\. Además, tus derechos frente a faltas de conformidad están cubiertos por la garantía legal aplicable\./.test(t.blocks.texto.settings.text) && t.blocks.enlace.settings.button_link === '/policies/refund-policy'));
  if (REPO) {
    const at = (f) => JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString());
    ok('T17 Judge.me: la sección «GARELON Opiniones» (widget, ajustes y nota) es idéntica a la de antes de la ronda en home y ficha', ['templates/index.json', 'templates/product.json'].every((f, i) => JSON.stringify(at(f).sections.opiniones) === JSON.stringify([ti, tp][i].sections.opiniones)));
  }
  await setState('mode=real&reviews=both');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const ids = [...r.html.matchAll(/id="shopify-section-template--1__(\w+)"/g)].map(m => m[1]);
    ok(`T18 ${n}: en la página, opiniones (Judge.me) antes de «Compra con tranquilidad»`, ids.indexOf('opiniones') > 0 && ids.indexOf('opiniones') < ids.indexOf('tranquilidad'), ids);
  }
  await setState('reviews=none');

  // 5 · Móvil: packs más arriba, sin hueco bajo la galería, infografía entera; sin scroll horizontal en ningún ancho
  for (const [n, u, root] of [['ficha', P, 'main'], ['home', '/', '#comprar']]) {
    for (const w of VPS) {
      const { page, errs } = await openPage(browser, u, { width: w, height: 844 });
      const m = await page.evaluate((root) => {
        const R = document.querySelector(root); const top = (s) => { const e = R.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top + scrollY) : null; };
        const tr = R.querySelector('.g-gallery__track'); const sl = [...R.querySelectorAll('.g-gallery__slide')];
        const info = R.querySelector('.g-gallery__slide img[src*="infografia"]');
        return { title: top('.product__title'), legend: top('.g-offer__legend'), card1: top('.g-offer__card'), atc: top('.product-form__submit'), trust: top('.g-trust'),
          gap: Math.round(tr.getBoundingClientRect().bottom - sl[0].getBoundingClientRect().bottom), widths: sl.map(s => Math.round(s.getBoundingClientRect().width)), track: Math.round(tr.getBoundingClientRect().width),
          info: info && { w: info.getBoundingClientRect().width, h: info.getBoundingClientRect().height, fit: getComputedStyle(info).objectFit, nw: info.naturalWidth, nh: info.naturalHeight },
          hscroll: document.documentElement.scrollWidth > window.innerWidth };
      }, root);
      ok(`T19 ${n} ${w}px: sin scroll horizontal y sin errores JS`, !m.hscroll && errs.length === 0, errs);
      ok(`T20 ${n} ${w}px: título → «Elige tu oferta» → botón → confianza`, m.title < m.legend && m.legend < m.card1 && m.card1 < m.atc && m.atc < m.trust, m);
      ok(`T21 ${n} ${w}px: infografía entera (cuadrada, sin recorte)`, m.info && Math.abs(m.info.w - m.info.h) <= 1 && m.info.nw === m.info.nh, m.info);
      if (w < 750) {
        ok(`T22 ${n} ${w}px: galería móvil sin hueco (cada foto al ancho de la pista; bajo la 1.ª solo queda la línea «Ampliar», ≤ 32 px)`, m.widths.every(x => Math.abs(x - m.track) <= 1) && m.gap <= 32, [m.gap, m.widths, m.track]);
        // Antes de la ronda T (aa9c01a, mode=real, 390×844): ficha «Elige tu oferta» a 868 px y botón a 1308 px.
        if (n === 'ficha') ok(`T23 ficha ${w}px: «Elige tu oferta» empieza en la primera pantalla (< 760 px) y la 1.ª tarjeta asoma (< 844 px)`, m.legend < 760 && m.card1 < 844, m);
        else ok(`T23 home ${w}px: «Elige tu oferta» a ≤ 110 px del título (antes ~265 px)`, m.legend - m.title <= 110, m);
      }
      await page.close();
    }
  }

  // 6 · Cambio real de variante con teclado (radios de Dawn): precio, id, URL
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.focus('main .g-offer__input'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(700); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(900);
    const st = await page.evaluate(() => ({ id: document.querySelector('main form[id^="product-form-"] input[name="id"]').value, url: location.search, checked: [...document.querySelectorAll('main .g-offer__input')].map(i => i.checked), focus: document.activeElement.className, outline: getComputedStyle(document.activeElement.nextElementSibling).outlineStyle + '|' + getComputedStyle(document.activeElement.nextElementSibling).boxShadow }));
    ok('T24 teclado: flechas → pack de 3, id 4103 y ?variant=4103, sin errores', st.id === '4103' && /variant=4103/.test(st.url) && JSON.stringify(st.checked) === '[false,false,true]' && errs.length === 0, st);
    await page.close();
  }

  // 7 · Carrito y cajón: «Tu pack incluye N …» desde el valor real de la variante; envío gratis; sin upsells ni casillas
  await reset(); await setState('mode=real');
  for (const id of [4101, 4102, 4103]) await addToCart(id);
  {
    const r = await get('/cart'); const m = (r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]; const d = (r.html.match(/<cart-drawer[\s\S]*?<\/cart-drawer>/) || [''])[0];
    for (const [n, h] of [['/cart', m], ['cajón', d]]) {
      const lines = [...h.matchAll(/<div class="product-option g-cart-pack">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g)].map(x => text(x[1]).trim());
      ok(`T25 ${n}: «Incluye 1 pulsera» / «Tu pack incluye 2 pulseras» / «Tu pack incluye 3 pulseras»`, JSON.stringify(lines) === JSON.stringify(['Incluye 1 pulsera', 'Tu pack incluye 2 pulseras', 'Tu pack incluye 3 pulseras']), lines);
      ok(`T26 ${n}: sin «Pack: N» visible duplicado (la etiqueta queda para lectores de pantalla)`, count(h, /<dt class="visually-hidden">Pack:<\/dt>/g) === 3 && !/<dt>Pack:<\/dt>/.test(h));
    }
    ok('T27 /cart y cajón: «Impuestos incluidos. Envío gratis.» y sin recomendaciones, upsells ni casillas premarcadas', /Impuestos incluidos\. Envío gratis\./.test(text(d)) && /Impuestos incluidos\. Envío gratis\./.test(text(r.html.match(/id="main-cart-footer"[\s\S]*$/)[0])) && !/product-recommendations|complementary|cart-upsell|type="checkbox"[^>]*checked/.test(m + d));
  }
  const cartSrc = ['snippets/garelon-cart-option.liquid', 'snippets/cart-drawer.liquid', 'sections/main-cart-items.liquid'].map(f => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '')).join('\n');
  ok('T28 el número de pulseras no está escrito en el tema (sale de option.value)', !/\b[123] pulseras?\b/.test(cartSrc) && /option\.value \| split: ' ' \| first \| plus: 0/.test(cartSrc));
  await reset(); await setState('mode=other'); await addToCart(4101);
  { const r = await get('/cart'); ok('T29 otra opción (Color): se ve como en Dawn («Color: Dorado»), sin «pack incluye»', /<dt>Color:<\/dt>\s*<dd>\s*Dorado/.test(r.html) && !/pack incluye/i.test(r.html)); }
  await reset(); await setState('mode=real');
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click('main label:has-text("3 pulseras")'); await page.waitForTimeout(800);
    await page.click('main .product-form__submit'); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok('T30 navegador: pack de 3 → cajón abierto con «Tu pack incluye 3 pulseras», 34,99 €, cantidad 1', /Tu pack incluye 3 pulseras/.test(d) && /34,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, d.slice(0, 200));
    await page.close();
  }

  // 8 · Selector nativo de país/región en el pie (Dawn): solo con más de un país; sin países ni monedas en el tema
  const fg = json('sections/footer-group.json').sections.footer.settings;
  ok('T31 pie: selector de país activo y de idioma desactivado (Dawn nativo)', fg.enable_country_selector === true && fg.enable_language_selector === false);
  await reset();
  { const r = await get('/'); ok('T32 un solo mercado: el pie no pinta selector (degrada sin hueco ni error)', !/FooterCountryForm/.test(r.html)); }
  await setState('countries=multi');
  {
    const r = await get('/'); const f = (r.html.match(/<localization-form>[\s\S]*?<\/localization-form>/) || [''])[0];
    ok('T33 varios mercados: formulario nativo «localization» con los países y monedas que da Shopify', /form_type" value="localization"/.test(f) && /País\/región/.test(f) && ['ES', 'MX', 'CL', 'CO'].every(c => f.includes(`data-value="${c}"`)) && /MXN/.test(f), f.length);
    const src = ['sections/footer.liquid', 'snippets/country-localization.liquid'].map(x => fs.readFileSync(`${THEME}/${x}`, 'utf8')).join('');
    ok('T34 el tema no escribe países ni monedas (los lee de localization)', !/México|Chile|Colombia|MXN|CLP|COP/.test(src));
    for (const w of [320, 390, 1440]) {
      const { page, errs } = await openPage(browser, '/', { width: w, height: 844 });
      const btn = page.locator('#FooterCountryForm button.disclosure__button');
      await btn.scrollIntoViewIfNeeded(); await btn.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
      const st = await page.evaluate(() => { const b = document.querySelector('#FooterCountryForm button.disclosure__button'); const r = b.getBoundingClientRect(); return { h: Math.round(r.height), exp: b.getAttribute('aria-expanded'), hs: document.documentElement.scrollWidth > innerWidth }; });
      ok(`T35 ${w}px: botón del selector ≥ 44 px, se abre con teclado (aria-expanded) y sin scroll horizontal`, st.h >= 44 && st.exp === 'true' && !st.hs && errs.length === 0, st);
      await page.close();
    }
  }
  await reset();

  // 9 · Alcance: solo los archivos de la ronda; ninguna imagen, ajuste global, precio ni Judge.me tocados
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .concat(execSync(`git -C ${THEME} ls-files --others --exclude-standard -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean));
    const allowed = /^(assets\/garelon\.css|locales\/[\w.-]+\.json|sections\/(featured-product|main-product|main-cart-items)\.liquid|sections\/(header|footer)-group\.json|snippets\/(cart-drawer|garelon-offer|garelon-trust|garelon-cart-option)\.liquid|templates\/(index|product)\.json)$/;
    ok('T36 alcance: solo CSS, locales, oferta, carrito, confianza, plantillas, barra y pie', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    ok('T37 sin cambios en imágenes, WebP, config (ajustes globales y App Embeds) ni layout', !changed.some(f => /\.(webp|png|jpe?g|svg)$|^config\/|^layout\//.test(f)));
    const imgSrc = execSync(`git -C ${THEME} diff --name-only ${BASE} -- "NUEVA IMAGEN 1.png" "NUEVA IMAGEN 3.png" "imagen 2.png" "imagen 4.png"`).toString().trim();
    ok('T38 imágenes fuente intactas (incluida «NUEVA IMAGEN 1.png»)', imgSrc === '', imgSrc);
    const loc = execSync(`git -C ${THEME} diff ${BASE} -- locales`).toString().split('\n').filter(l => /^[+-]\s/.test(l) && !/taxes_at_checkout/.test(l));
    ok('T39 locales: solo se añaden garelon.cart.pack_includes(_one)', loc.every(l => /^\+\s+"pack_includes(_one)?":/.test(l)), loc.slice(0, 4));
  }
};
