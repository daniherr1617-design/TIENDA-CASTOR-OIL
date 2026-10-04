// SOLO TEST · Fase G (CRO honesto): tarjetas «Elige tu oferta», un solo precio visible, zona de confianza,
// detalles/FAQ, opiniones (Judge.me simulado), teclado, regresión de home/404/carrito. Precios SIMULADOS.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const P = '/products/pulsera-rosario-virgen-maria';
const buy = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
const mainP = (html) => (html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const cards = (s) => [...s.matchAll(/<label[^>]*class="g-offer__card[^"]*"[^>]*>([\s\S]*?)<\/label>/g)].map(m => text(m[1]).trim());
const visible = (html) => text(html.replace(/<template[\s\S]*?<\/template>/g, ''));

module.exports = async function (browser) {
  // 1 · Un solo precio visible (el de las tarjetas); el de Dawn queda para lectores de pantalla y su JS.
  await setState('reset=1&mode=pack3save&design=0&reviews=none&soldout=');
  let r = await get('/'); let s = buy(r.html);
  ok('G1 home con packs: el precio de Dawn bajo el título existe (id price-…, role=status) pero es visually-hidden', /<div id="price-[^"]+" class="g-price--offer visually-hidden" role="status"/.test(s));
  ok('G2 la nota de impuestos/envío va bajo las tarjetas y no se repite bajo el título', /class="g-offer__tax"/.test(s) && !/class="product__tax/.test(s));
  r = await get(P); let m = mainP(r.html);
  ok('G3 ficha con packs: mismo comportamiento (precio de Dawn oculto, tarjetas presentes)', /class="g-price--offer visually-hidden"/.test(m) && count(m, /class="g-offer__card/g) === 3 && !/class="product__tax/.test(m));
  await setState('mode=single'); r = await get('/'); s = buy(r.html);
  ok('G4 sin variantes: el precio de Dawn se ve con normalidad y no hay tarjetas', !/g-price--offer/.test(s) && /19,99 €/.test(s) && !/g-offer/.test(s));
  r = await get(P); m = mainP(r.html);
  ok('G5 ficha sin variantes: precio visible y sin tarjetas', !/g-price--offer/.test(m) && /19,99 €/.test(m) && !/g-offer__card/.test(m));
  await setState('mode=twoopt'); r = await get('/'); s = buy(r.html);
  ok('G6 dos opciones (Color × Pack): selector normal de Dawn, precio visible, sin tarjetas', /<variant-selects/.test(s) && !/g-offer__card|g-price--offer/.test(s));
  await setState('mode=single&design=1'); r = await get('/'); s = buy(r.html);
  ok('G7 editor sin opción Pack: aviso de «Elige tu oferta» solo en el editor', /Elige tu oferta» muestra el selector normal/.test(s));
  await setState('design=0'); r = await get('/');
  ok('G8 cliente sin opción Pack: sin avisos del editor', !/g-editor-note/.test(r.html));

  // 2 · Precio comparado y ahorro: solo con datos reales.
  await setState('mode=compare'); r = await get('/'); s = buy(r.html);
  let c = cards(s);
  ok('G9 precio comparado tachado SOLO en las variantes que lo tienen (1 y 2), con «Precio habitual» para lectores', count(s, /<s class="g-offer__was">/g) === 2 && /Precio habitual\s*24,99 €/.test(text(s)) && /Precio habitual\s*39,98 €/.test(text(s)) && !/Precio habitual[^€]*€\s*47,99/.test(c[2]), c);
  ok('G10 ahorro: frente al precio comparado (5,00 € y 4,99 €) o, sin él, frente a 3 sueltas (11,98 €) con su nota', /Ahorras 5,00 €/.test(c[0]) && /Ahorras 4,99 €/.test(c[1]) && /Ahorras 11,98 €/.test(c[2]) && /Ahorro calculado frente a comprar cada pulsera por separado/.test(s), c);
  await setState('mode=pack3save'); r = await get('/'); s = buy(r.html);
  const offerHtml = (s.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
  ok('G11 sin compare_at_price en Shopify: nada tachado en las tarjetas', offerHtml.length > 0 && !/g-offer__was|<s[\s>]/.test(offerHtml));
  await setState('mode=nosave'); r = await get('/'); s = buy(r.html); c = cards(s);
  ok('G12 sin ahorro real: ni «Ahorras», ni precio por unidad, ni «Ahorra más por unidad», ni nota', c.length === 3 && !/Ahorr|por pulsera/i.test(s.replace(/<script[\s\S]*?<\/script>/g, '')), c);

  // 3 · Distintivo, promo, confianza.
  await setState('mode=pack3save'); r = await get('/'); s = buy(r.html); c = cards(s);
  ok('G13 distintivo editable en un solo pack (2): «Recomendado»; nunca «Más popular» por defecto', count(s, /class="g-offer__badge"/g) === 1 && /^Recomendado 2 pulseras/.test(c[1]) && !/Más popular/.test(visible(r.html)), c);
  ok('G14 promoción apagada por defecto (sin texto promocional ni contador)', !/g-offer__promo|Oferta especial/.test(s));
  const chips = [...s.matchAll(/<li class="g-trust__chip">[\s\S]*?<span>([^<]+)<\/span>/g)].map(x => x[1]);
  ok('G15 zona de confianza: frase + 3 garantías en orden, con icono (sin «Envíos internacionales», D32)', /<p class="g-trust__phrase">Un símbolo de tu fe, contigo cada día\.<\/p>/.test(s) && JSON.stringify(chips) === JSON.stringify(['Envío gratis + seguimiento', 'Pago seguro', '14 días para cambiar de opinión']) && count(s, /<li class="g-trust__chip"><svg\s+class="g-icon"/g) === 3, chips);
  ok('G16 orden de compra: título → frase → garantías → «Elige tu oferta» → Añadir al carrito', ['product__title', 'g-trust__phrase', 'g-trust__grid', 'g-offer__legend', 'ProductSubmitButton'].map(k => s.indexOf(k)).every((v, i, a) => v > 0 && (i === 0 || v > a[i - 1])));
  ok('G17 sin dark patterns: ni contador, ni «últimas unidades», ni «X personas viendo», ni «oferta termina»', !/countdown|data-countdown|[uú]ltimas \d|quedan \d|personas viendo|viendo (esto|ahora)|oferta termina|termina en/i.test(visible(r.html)));
  const idx = fs.readFileSync(THEME + '/templates/index.json', 'utf8');
  ok('G18 index.json: sin precios, ids, compare_at ni stock escritos a mano', !/\d+[.,]\d{2}\s*(€|EUR)|variant_id|compare_at|inventory|"sku"/.test(idx));

  // 4 · Interacción real con el JS de Dawn (home): tarjeta → variante, formulario, precio, carrito.
  await setState('reset=1&mode=pack3save&soldout=');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    const before = await page.evaluate(() => getComputedStyle(document.querySelector('#comprar .g-offer__input:checked + .g-offer__card')).borderColor);
    await page.click('#comprar .g-offer__card:has-text("3 pulseras")');
    const instant = await page.evaluate(() => document.querySelector('#comprar .g-offer__input:checked').value);
    await page.waitForTimeout(900);
    const st = await page.evaluate(() => ({
      checked: document.querySelector('#comprar .g-offer__input:checked').value,
      idv: document.querySelector('#comprar form[id^="product-form-template"] input[name="id"]').value,
      hidden: document.querySelector('#comprar [id^="price-"] .price-item--regular').textContent.trim(),
      sel: getComputedStyle(document.querySelector('#comprar .g-offer__input:checked + .g-offer__card')).borderColor,
      others: [...document.querySelectorAll('#comprar .g-offer__input:not(:checked) + .g-offer__card')].map(e => getComputedStyle(e).borderColor) }));
    ok('G19 pulsar la tarjeta «3 pulseras» la marca al instante y Dawn actualiza variante (4103) y precio (47,99 €)', instant === '3 pulseras' && st.checked === '3 pulseras' && st.idv === '4103' && /47,99/.test(st.hidden), st);
    ok('G20 la tarjeta elegida destaca (borde dorado #86672f) y las demás no', st.sel === 'rgb(134, 103, 47)' && before === st.sel && st.others.every(x => x !== st.sel), st);
    await page.click('#comprar [id^="ProductSubmitButton-"]'); await page.waitForTimeout(1200);
    const s2 = await (await fetch(B + '/__state')).json(); const last = s2.log[s2.log.length - 1] || {};
    const drawer = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); return d && d.classList.contains('active') ? d.innerText : ''; });
    ok('G21 Añadir al carrito: variante 4103 con cantidad 1 y cajón con «3 pulseras» × 47,99 €', last.id === '4103' && (last.quantity === undefined || last.quantity === '1') && /3 pulseras/.test(drawer) && /47,99/.test(drawer), { last, drawer: drawer.slice(0, 160) });
    ok('G22 sin errores JS', errs.length === 0, errs);
    await page.close();
  }
  // 5 · Teclado: Tab entra en el grupo, flechas cambian de pack, foco visible.
  await setState('reset=1&mode=pack3save');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.focus('#comprar .g-offer__input:checked');
    await page.keyboard.press('ArrowDown'); await page.waitForTimeout(1000);
    const st = await page.evaluate(() => { const a = document.activeElement; const card = a && a.nextElementSibling; return { tag: a && a.tagName, val: a && a.value, checked: a && a.checked,
      outline: card ? getComputedStyle(card).outlineStyle + ' ' + getComputedStyle(card).outlineWidth : '', idv: document.querySelector('#comprar form[id^="product-form-template"] input[name="id"]').value }; });
    ok('G23 teclado: flecha abajo pasa a «2 pulseras», actualiza la variante (4102), conserva el foco y el contorno es visible', st.tag === 'INPUT' && st.val === '2 pulseras' && st.checked && st.idv === '4102' && /solid 2px/.test(st.outline), st);
    ok('G24 sin errores JS con teclado', errs.length === 0, errs);
    await page.close();
  }
  // 6 · Ficha: tarjeta → URL ?variant=, compra fija con el precio del pack.
  await setState('reset=1&mode=pack3save');
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click('.g-offer__card:has-text("2 pulseras")'); await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, document.querySelector('[id^="ProductSubmitButton-"]').getBoundingClientRect().bottom + window.scrollY + 300)); await page.waitForTimeout(600);
    const st = await page.evaluate(() => ({ url: location.search, sticky: document.querySelector('[data-sticky-price]').textContent.trim(), vis: document.querySelector('[data-garelon-sticky]').classList.contains('is-visible') }));
    ok('G25 ficha: tarjeta «2 pulseras» → ?variant=4102 y la compra fija muestra 34,99 €', /variant=4102/.test(st.url) && /34,99/.test(st.sticky) && st.vis, st);
    ok('G26 ficha sin errores JS', errs.length === 0, errs);
    await page.close();
  }
  // 7 · Opiniones (widget simulado con las clases de Judge.me; datos de prueba).
  await setState('reset=1&mode=pack3save&reviews=app'); r = await get('/');
  ok('G27 bloque de app sin valoración sincronizada (0 opiniones) y «Ocultar sin opiniones»: el cliente no ve la sección', !/g-reviews|data-test="app-reviews"/.test(r.html));
  await setState('design=1'); r = await get('/');
  ok('G28 en el editor sí se ve, con el aviso de por qué está oculta', /data-test="app-reviews"/.test(r.html) && /valoración sincronizada con Shopify es 0/.test(r.html));
  await setState('design=0&reviews=both'); r = await get('/');
  ok('G29 con opiniones reales: sección con título neutro y widget de la app dentro de la tarjeta GARELON', /Opiniones sobre esta pulsera/.test(r.html) && /<div class="g-reviews__app"><div class="test-app-block jdgm-widget/.test(r.html.replace(/\s+/g, ' ').replace(/> </g, '><')));
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    const st = await page.evaluate(() => ({ title: getComputedStyle(document.querySelector('.jdgm-rev-widg__title')).display, star: getComputedStyle(document.querySelector('[data-test="jdgm-star"]')).color,
      btn: getComputedStyle(document.querySelector('[data-test="jdgm-write"]')).borderTopLeftRadius, rating: getComputedStyle(document.querySelector('#comprar .rating-star')).getPropertyValue('--color-rating-star').trim() }));
    ok('G30 widget integrado: sin título duplicado, estrellas doradas, botón redondeado; estrellas doradas junto al título', st.title === 'none' && st.star === 'rgb(134, 103, 47)' && st.btn === '40px' && /86672f|134, 103, 47/i.test(st.rating), st);
    ok('G31 sin errores JS con opiniones', errs.length === 0, errs);
    await page.close();
  }
  await setState('reviews=summary'); r = await get('/');
  ok('G32 solo valoración de Shopify (sin app): nota 4,6, estrellas y «12 opiniones»', /<span class="g-reviews__score" aria-hidden="true">4,6<\/span>/.test(r.html) && /12 opiniones/.test(r.html) && /aria-label="4,6 de 5 estrellas"/.test(r.html));
  await setState('reviews=none'); r = await get('/');
  ok('G33 sin opiniones: ni sección, ni estrellas, ni «0 opiniones»', !/g-reviews|class="rating"|0 opiniones/.test(r.html));

  // 8 · FAQ y detalles.
  r = await get('/');
  ok('G34 FAQ: «¿Qué longitud tiene y cómo se ajusta?» y «¿Qué incluye mi pedido?» con los textos nuevos', /¿Qué longitud tiene y cómo se ajusta\?<\/h3>[\s\S]*?La pulsera tiene una longitud aproximada de 20 cm y cuenta con 3 aros para ajustar el cierre\./.test(r.html) && /¿Qué incluye mi pedido\?<\/h3>[\s\S]*?Recibirás el número de pulseras correspondiente al pack que elijas: 1, 2 o 3 unidades\./.test(r.html));

  // 9 · Regresión de lo crítico.
  r = await get('/'); ok('G35 / → 200 con la home (plantilla index)', r.status === 200 && r.tpl === 'index');
  r = await get('/ruta-inexistente-garelon'); ok('G36 ruta inexistente → 404', r.status === 404 && r.tpl === '404');
  const idxJson = JSON.parse(idx);
  ok('G37 index.json: 9 secciones, el mismo orden y la compra con titulo → valoracion → precio → confianza → oferta → comprar', idxJson.order.join() === 'portada,compra,tranquilidad,opiniones,significado,detalles,regalo,preguntas,cierre' && idxJson.sections.compra.block_order.join() === 'titulo,valoracion,precio,confianza,oferta,comprar');

  // 10 · Responsive de la ficha (la home la cubre D24).
  for (const [w, h] of [[320, 640], [360, 740], [375, 667], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
    const { page, errs } = await openPage(browser, P, { width: w, height: h });
    const st = await page.evaluate(() => { const cs = [...document.querySelectorAll('.g-offer__card')]; return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, n: cs.length,
      inside: cs.every(c => { const p = c.querySelector('.g-offer__price').getBoundingClientRect(), r = c.getBoundingClientRect(); return p.right <= r.right + 0.5; }),
      badge: (() => { const b = document.querySelector('.g-offer__badge').getBoundingClientRect(); const c = document.querySelector('.g-offer__badge').closest('.g-offer__card').getBoundingClientRect(); return b.right <= c.right && b.width > 0; })(),
      chips: new Set([...document.querySelectorAll('.g-trust__chip')].map(c => Math.round(c.getBoundingClientRect().left))).size }; });
    ok(`G38 ${w}px ficha: tarjetas sin desbordar, distintivo dentro, garantías en 2 columnas, sin scroll horizontal`, st.sw <= st.cw && st.n === 3 && st.inside && st.badge && st.chips === 2 && errs.length === 0, st);
    await page.close();
  }
  await reset();
};
