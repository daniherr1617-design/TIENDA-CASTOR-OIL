// SOLO TEST · Fase F: ficha de producto, compra fija, 404, contacto y carrito.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B } = T;
const P = '/products/pulsera-rosario-virgen-maria';
const main = (html) => (html.match(/<main[\s\S]*?<\/main>/) || [''])[0];

module.exports = async function (browser) {
  await setState('reset=1&mode=pack3save&soldout=&design=0&catalog=ok&reviews=none&contact=ok&refund=ok&shipping=ok');
  let r = await get(P); let m = main(r.html);
  const h1 = [...m.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(x => text(x[1]).trim());
  ok('F1 ficha → 200; un único H1 = título del producto de Shopify', r.status === 200 && r.tpl === 'product' && h1.length === 1 && h1[0] === 'Pulsera Rosario Virgen María', [r.status, h1]);
  const order = [...r.html.matchAll(/id="shopify-section-template--1__(\w+)"/g)].map(x => x[1]);
  ok('F2 orden de la ficha: producto → tranquilidad → opiniones → detalles → preguntas → compra fija', JSON.stringify(order) === JSON.stringify(['main', 'tranquilidad', 'opiniones', 'detalles', 'preguntas', 'compra_fija']), order);
  ok('F3 galería del tema: 5 imágenes, la primera prioritaria (LCP)', count(m, /class="g-gallery__slide[ "]/g) === 5 && count(r.html, /fetchpriority="high"/g) === 1 && /<img[^>]*producto-completa[^>]*loading="eager"/.test(m));
  ok('F4 antetítulo, resumen, frase, garantías, tarjetas de oferta con precio, botón y pago dinámico', /Joyería con significado/.test(m) && /19,99 €/.test(m) && /Acero inoxidable con acabado dorado, medalla de la Virgen María, cruz y cuentas tricolor\./.test(m) && count(r.html, /Un símbolo de tu fe, contigo cada día/g) === 1 && /<variant-selects/.test(m) && /g-offer__card/.test(m) && /ProductSubmitButton-/.test(m) && /shopify-payment-button/.test(m));
  ok('F5 sin selector de cantidad en la ficha', !/quantity-input|name="quantity"/.test((m.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0]));
  ok('F6 descripción de Shopify y pestaña «Envíos y devoluciones» con políticas', /Descripción de prueba/.test(m) && /Envíos y devoluciones/.test(m) && /href="\/policies\/shipping-policy"/.test(m) && /href="\/policies\/refund-policy"/.test(m));
  ok('F7 un único Product JSON-LD en la ficha', count(r.html, /"@type":\s*"Product"/g) === 1);
  ok('F8 opiniones sin datos reales: no se pintan en la ficha', !/g-reviews/.test(m));
  await setState('reviews=both'); r = await get(P); m = main(r.html);
  ok('F9 con datos reales: valoración junto al precio y sección de opiniones con el widget', /class="rating"/.test(m) && /g-reviews/.test(m) && /data-test="app-reviews"/.test(m));
  await setState('reviews=none'); r = await get(P + '?variant=4102'); m = main(r.html);
  ok('F10 ?variant=4102 marca «2 pulseras» y muestra su precio', /value="2 pulseras"[^>]*checked|checked[^>]*value="2 pulseras"/.test(m.replace(/\s+/g, ' ')) && /34,99 €/.test((m.match(/id="price-[^"]*"[\s\S]*?<\/div>\s*<\/div>/) || [''])[0]));
  {
    await setState('reset=1&soldout=');
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    const hiddenAtTop = await page.evaluate(() => { const s = document.querySelector('[data-garelon-sticky]'); return !s.classList.contains('is-visible') && s.hasAttribute('inert'); });
    await page.click('label:has-text("3 pulseras")'); await page.waitForTimeout(900);
    const url = page.url();
    await page.evaluate(() => window.scrollTo(0, document.querySelector('[id^="ProductSubmitButton-"]').getBoundingClientRect().bottom + window.scrollY + 300)); await page.waitForTimeout(600);
    const st = await page.evaluate(() => { const s = document.querySelector('[data-garelon-sticky]'); return { vis: s.classList.contains('is-visible'), inert: s.hasAttribute('inert'), price: s.querySelector('[data-sticky-price]').textContent.trim(), label: s.querySelector('[data-sticky-button]').textContent.trim(), h: Math.round(s.querySelector('[data-sticky-button]').getBoundingClientRect().height) }; });
    ok('F11 elegir «3 pulseras» en la ficha actualiza la URL (?variant=4103)', /variant=4103/.test(url), url);
    ok('F12 compra fija: oculta arriba; aparece al pasar el botón con el precio del pack (47,99 €) y «Añadir al carrito» (≥ 44 px)', hiddenAtTop && st.vis && !st.inert && /47,99/.test(st.price) && /Añadir al carrito/.test(st.label) && st.h >= 44, st);
    await page.click('[data-sticky-button]'); await page.waitForTimeout(1200);
    const s2 = await (await fetch(B + '/__state')).json(); const last = s2.log[s2.log.length - 1] || {};
    const drawer = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); return d && d.classList.contains('active'); });
    ok('F13 la compra fija añade el pack elegido (4103) con cantidad 1 y abre el cajón', last.id === '4103' && (last.quantity === undefined || last.quantity === '1') && drawer, last);
    ok('F14 sin errores JS en la ficha', errs.length === 0, errs);
    await page.close();
  }
  {
    await setState('reset=1&soldout=4102');
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click('label:has-text("2 pulseras")'); await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, 3000)); await page.waitForTimeout(500);
    const st = await page.evaluate(() => { const b = document.querySelector('[data-sticky-button]'); return { dis: b.disabled, label: b.textContent.trim() }; });
    ok('F15 pack agotado: la compra fija se desactiva con «Agotado»', st.dis && /Agotado/i.test(st.label), st);
    await page.close();
  }
  await setState('reset=1&soldout=');
  for (const [w, h] of [[320, 640], [360, 740], [375, 667], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
    const { page, errs } = await openPage(browser, P, { width: w, height: h });
    const res = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sticky: getComputedStyle(document.querySelector('[data-garelon-sticky]')).display }));
    ok(`F16 ${w}px: ficha sin scroll horizontal; compra fija solo en móvil`, res.sw <= res.cw && (w >= 750 ? res.sticky === 'none' : res.sticky !== 'none') && errs.length === 0, res);
    await page.close();
  }
  // 404
  for (const u of ['/esto-no-deberia-existir-garelon-test', '/ruta-inexistente-garelon']) {
    r = await get(u); m = main(r.html);
    ok(`F17 ${u} → HTTP 404 con la 404 limpia (H1 «Página no encontrada», «Seguir comprando» → /)`, r.status === 404 && /<h1 class="title">\s*Página no encontrada/.test(m) && /href="\/" class="button">\s*Seguir comprando/.test(m) && !/Esta URL|request\.path|404 de la home|plantilla/.test(text(m)), text(m).slice(0, 120));
  }
  // Contacto
  r = await get('/pages/contacto'); m = main(r.html);
  ok('F18 /pages/contacto → 200 con la plantilla contact (formulario, un H1)', r.status === 200 && r.tpl === 'page.contact' && /form_type" value="contact"/.test(m) && count(m, /<h1[\s>]/g) === 1, [r.status, r.tpl, count(m, /<h1[\s>]/g)]);
  // Carrito
  await setState('reset=1&mode=pack3save');
  r = await get('/cart'); m = main(r.html);
  ok('F19 carrito vacío: «Seguir comprando» → home (no al catálogo)', r.status === 200 && /href="\/" class="button">\s*Seguir comprando/.test(m) && !/\/collections/.test(m));
  await fetch(B + '/cart/add', { method: 'POST', body: (() => { const f = new FormData(); f.append('id', '4102'); return f; })() });
  r = await get('/cart'); m = main(r.html);
  ok('F20 carrito: producto, variante «Pack: 2 pulseras», cantidad, eliminar, subtotal y «Finalizar compra»', /Pulsera Rosario Virgen María/.test(m) && /Pack:\s*<\/dt>\s*<dd>2 pulseras|Pack: 2 pulseras/.test(m.replace(/\s+/g, ' ')) && /name="updates\[\]"/.test(m) && /cart-remove-button/.test(m) && /34,99 €/.test(m) && /name="checkout"/.test(m), text(m).slice(0, 200));
  // Casos límite y regresión final.
  await setState('reset=1&mode=single&design=1');
  for (const u of ['/', P, '/pages/contacto', '/cart']) {
    const { page, errs } = await openPage(browser, u, { width: 390, height: 844 });
    ok(`F21 editor (design_mode) ${u}: carga sin errores JS`, errs.length === 0, errs);
    await page.close();
  }
  await setState('reset=1&design=0&catalog=none');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    const t = await page.evaluate(() => ({ h1: document.querySelectorAll('h1').length, compra: !!document.getElementById('comprar'), sticky: !!document.querySelector('[data-garelon-sticky]') }));
    ok('F22 tienda sin productos: home con su H1, sin compra ni errores JS', t.h1 === 1 && !t.compra && errs.length === 0, { t, errs });
    await page.close();
  }
  await setState('reset=1&catalog=ok&mode=pack3save');
  r = await get('/');
  ok('F23 SEO: <title>, canonical y Open Graph (Dawn)', /<title>[\s\S]*GARELON[\s\S]*<\/title>/.test(r.html) && /<link rel="canonical"/.test(r.html) && /property="og:title"/.test(r.html));
  ok('F24 «Saltar al contenido» apunta a #MainContent, que existe', /class="skip-to-content-link[^"]*" href="#MainContent"/.test(r.html) && /id="MainContent"/.test(r.html));
  // Todos los enlaces internos de las páginas principales llevan a una URL que existe.
  const pages = ['/', P, '/pages/contacto', '/cart', '/ruta-inexistente-garelon'];
  const links = new Set();
  for (const u of pages) { const h = (await get(u)).html.replace(/<template[\s\S]*?<\/template>/g, ''); for (const x of h.matchAll(/href="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) links.add(x[1] || '/'); }
  const skip = (u) => u.startsWith('/assets/') || u.startsWith('/account') || u.startsWith('/cart/') || u.startsWith('/__');
  const broken = [];
  for (const u of [...links].filter(x => !skip(x))) { const st = (await fetch(B + u)).status; if (st !== 200) broken.push(`${u} ${st}`); }
  ok(`F25 enlaces internos (${[...links].filter(x => !skip(x)).length}) → todos responden 200`, broken.length === 0, broken);
  await reset();
};
