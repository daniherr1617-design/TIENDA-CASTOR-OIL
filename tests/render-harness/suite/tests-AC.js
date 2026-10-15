// SOLO TEST · Fase AC: compra rápida en móvil (propietario, 2026-10-15, D46).
// «Comprar ahora» solo por debajo de 750 px, con el precio del pack dentro del botón: fija en el carrito la variante
// elegida con su cantidad (/cart/update.js, nativo) y abre el pago de Shopify; si el carrito tenía otros productos,
// abre el carrito. «Añadir al carrito» queda debajo como alternativa; los botones de pago acelerado no se repiten en
// móvil (salen en «Pago exprés» al principio del pago). Compra fija también en la home. Escritorio sin cambios.
// El pago de Shopify no existe en local: /checkout es una página simulada que solo enseña qué llegó.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, count, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'f1d3e17'; // HEAD antes de la ronda AC
const ROUND_HEAD = '045ee0a'; // Ronda AD: commit del tema de la ronda AC (alcance fijado a AC, como en T…AB)
const REPO = fs.existsSync(THEME + '/.git');
const buy = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
const main = (html) => (html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const log = async () => (await (await fetch(B + '/__state')).json()).log;
const LIVE = 'mode=live&reviews=both&rating=4.9&rcount=28';

module.exports = async function (browser) {
  // 1 · Marcado: un «Comprar ahora» por compra, nativo, después de «Añadir al carrito» en el HTML
  await reset(); await setState(LIVE);
  for (const [name, u, pick] of [['home', '/', buy], ['ficha', P, main]]) {
    const s = pick((await get(u)).html);
    const btn = (s.match(/<button[^>]*data-garelon-buy-now[\s\S]*?<\/button>/) || [''])[0];
    ok(`AC1 ${name}: un «Comprar ahora» con el precio del pack elegido (19,99 €), submit, dentro del formulario de Dawn y después de «Añadir al carrito»`,
      count(s, /data-garelon-buy-now/g) === 1 && /type="submit"/.test(btn) && !/name="add"/.test(btn) && /Comprar ahora/.test(btn) && /19,99 €/.test(btn)
      && s.indexOf('ProductSubmitButton-') < s.indexOf('data-garelon-buy-now') && s.indexOf('data-garelon-buy-now') < s.lastIndexOf('</form>'), btn.slice(0, 200));
    ok(`AC2 ${name}: solo rutas nativas de Shopify (/cart/update.js, /checkout, /cart), sin variant IDs escritos en el tema`,
      /data-update-url="\/cart\/update\.js"/.test(btn) && /data-checkout-url="\/checkout"/.test(btn) && /data-cart-url="\/cart"/.test(btn) && !/\/cart\/\d+:\d+/.test(s));
    // Desde la ronda AD (D47) el pago acelerado nativo se permite en móvil (AD18-AD19): sin la clase g-buy--no-wallets.
    ok(`AC3 ${name}: botones con clase de compra rápida${T.at('AD') ? ' (pago acelerado nativo permitido en móvil desde D47)' : ' y sin pagos acelerados repetidos en móvil (ajuste por defecto)'}`, T.at('AD') ? /product-form__buttons g-buy--now"/.test(s) : /product-form__buttons g-buy--now g-buy--no-wallets/.test(s));
  }
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const j = JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8'));
    const sec = j.sections[f.includes('index') ? 'compra' : 'main'];
    const bb = Object.values(sec.blocks).find(b => b.type === 'buy_buttons');
    ok(`AC4 ${f}: «Comprar ahora» activo, pagos acelerados en móvil ${T.at('AD') ? 'permitidos (D47)' : 'desactivados'} y pago dinámico intacto (escritorio)`,
      bb.settings.garelon_buy_now === true && bb.settings.garelon_mobile_wallets === T.at('AD') && bb.settings.show_dynamic_checkout === true, bb.settings); // D47: true desde la ronda AD
  }
  for (const f of ['sections/featured-product.liquid', 'sections/main-product.liquid']) {
    const schema = JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8').split('{% schema %}')[1].split('{% endschema %}')[0]);
    const st = schema.blocks.find(b => b.type === 'buy_buttons').settings;
    const g = (id) => st.find(x => x.id === id) || {};
    ok(`AC5 ${f}: ajustes «Comprar ahora en móvil» (sí) y «pagos acelerados también en móvil» (no) en el bloque de botones`,
      g('garelon_buy_now').default === true && g('garelon_mobile_wallets').default === false);
  }
  const idx = JSON.parse(fs.readFileSync(`${THEME}/templates/index.json`, 'utf8'));
  ok('AC6 home: compra fija al final del orden, como en la ficha', idx.order[idx.order.length - 1] === 'compra_fija' && idx.sections.compra_fija.type === 'garelon-sticky-cta');

  // 2 · Móvil: botón principal visible y primero, «Añadir al carrito» con contorno debajo, sin pagos repetidos
  const MOBILE = [[320, 568], [360, 740], [375, 667], [390, 844], [430, 932]];
  for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    for (const [w, h] of MOBILE) {
      await reset(); await setState(LIVE);
      const { page, errs } = await openPage(browser, u, { width: w, height: h });
      const m = await page.evaluate(() => {
        const root = document.querySelector('#comprar') || document.querySelector('product-info[id^="MainProduct-"]');
        const r = (e) => e && e.getBoundingClientRect();
        const bn = root.querySelector('[data-garelon-buy-now]'); const atc = root.querySelector('[id^="ProductSubmitButton-"]');
        const pay = root.querySelector('.shopify-payment-button'); const wrap = root.querySelector('.product-form__buttons');
        const cs = getComputedStyle(atc);
        return { bn: { t: r(bn).top, b: r(bn).bottom, h: r(bn).height, w: r(bn).width }, wrapW: r(wrap).width, atcT: r(atc).top, atcH: r(atc).height, atcBg: cs.backgroundColor,
          bnBg: getComputedStyle(bn).backgroundColor, pay: pay ? getComputedStyle(pay).display : 'none', legend: r(root.querySelector('.g-offer__legend')).top + scrollY,
          sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
      });
      // Desde la ronda AD (D47) «Añadir al carrito» no se muestra en móvil: «Comprar ahora» es el único botón (AD14).
      if (T.at('AD')) ok(`AC7 ${name} ${w}px: «Comprar ahora» relleno, a todo el ancho y ≥ 44 px, sin «Añadir al carrito» visible (D47) ni scroll horizontal`,
        m.bn.h >= 44 && Math.abs(m.bn.w - m.wrapW) <= 1 && m.atcH === 0 && !/rgba\(0, 0, 0, 0\)/.test(m.bnBg) && m.sw <= m.cw && errs.length === 0, { ...m, errs });
      else ok(`AC7 ${name} ${w}px: «Comprar ahora» relleno, a todo el ancho y ≥ 44 px, encima de «Añadir al carrito» (contorno, ≥ 44 px); sin pagos repetidos ni scroll horizontal`,
        m.bn.h >= 44 && Math.abs(m.bn.w - m.wrapW) <= 1 && m.bn.b <= m.atcT && m.atcH >= 44 && /rgba\(0, 0, 0, 0\)|transparent/.test(m.atcBg) && !/rgba\(0, 0, 0, 0\)/.test(m.bnBg)
        && m.pay === 'none' && m.sw <= m.cw && errs.length === 0, { ...m, errs });
      if (w === 390 && name === 'home') ok('AC8 home 390×844: «Elige tu oferta» empieza en la primera pantalla y «Comprar ahora» queda por encima de 1300 px (antes «Añadir al carrito» a 1349 px)', m.legend < 844 && m.bn.t + 0 < 1300, m);
      if (w === 430 && name === 'home') ok('AC9 home 430×932: «Elige tu oferta» en la primera pantalla', m.legend < 932, m);
      await page.close();
    }
  }

  // 3 · Escritorio y tableta: sin «Comprar ahora», con el pago dinámico y «Añadir al carrito» relleno, como antes
  for (const [w, h] of [[768, 1024], [1024, 768], [1440, 900]]) {
    for (const [name, u] of [['home', '/'], ['ficha', P]]) {
      await reset(); await setState(LIVE);
      const { page, errs } = await openPage(browser, u, { width: w, height: h });
      const m = await page.evaluate(() => {
        const root = document.querySelector('#comprar') || document.querySelector('product-info[id^="MainProduct-"]');
        const atc = root.querySelector('[id^="ProductSubmitButton-"]');
        return { bn: getComputedStyle(root.querySelector('[data-garelon-buy-now]')).display, pay: getComputedStyle(root.querySelector('.shopify-payment-button')).display,
          atcBg: getComputedStyle(atc).backgroundColor, atcTop: Math.round(atc.getBoundingClientRect().top + scrollY), sticky: getComputedStyle(document.querySelector('[data-garelon-sticky]')).display };
      });
      const expected = { '1440home': 1002, '1440ficha': 1110 }[w + name];
      ok(`AC10 ${name} ${w}px: sin «Comprar ahora» ni compra fija; «Añadir al carrito» relleno y pago dinámico como antes${expected ? ` (botón a ${expected} px, igual que antes)` : ''}`,
        m.bn === 'none' && m.pay !== 'none' && m.sticky === 'none' && m.atcBg === 'rgb(134, 103, 47)' && (!expected || Math.abs(m.atcTop - expected) <= 2) && errs.length === 0, { ...m, errs });
      await page.close();
    }
  }

  // 4 · Cada pack: precio en el botón y en la compra fija; compra directa al pago con la variante y cantidad reales
  const packs = [['1 pulsera', 4101, '19,99'], ['2 pulseras y 1 de regalo', 4102, '29,99'], ['3 pulseras y 2 de regalo', 4103, '34,99']];
  for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    for (const [label, id, price] of packs) {
      await reset(); await setState(LIVE);
      const { page, errs } = await openPage(browser, u, { width: 390, height: 844 });
      await page.click(`.g-offer__card:has-text("${label}")`); await page.waitForTimeout(900);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(600);
      const st = await page.evaluate(() => ({ btn: document.querySelector('[data-garelon-buy-now]').textContent.replace(/\s+/g, ' ').trim(),
        title: document.querySelector('[data-sticky-title]').textContent.trim(), price: document.querySelector('[data-sticky-price]').textContent.trim(),
        label: document.querySelector('[data-sticky-button]').textContent.trim(), vis: document.querySelector('[data-garelon-sticky]').classList.contains('is-visible') }));
      ok(`AC11 ${name} «${label}»: «Comprar ahora · ${price} €» y compra fija con el pack, ${price} € y «Comprar ahora»`,
        st.btn.includes(`${price} €`) && st.title === label && st.price.includes(price) && st.label === 'Comprar ahora' && st.vis, st);
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
      await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
      const lines = await page.$$eval('#lines li', (li) => li.map((l) => [Number(l.dataset.variant), Number(l.dataset.qty)])).catch(() => []);
      const last = (await log()).pop() || {};
      ok(`AC12 ${name} «${label}»: «Comprar ahora» fija ${id} × 1 con /cart/update.js y abre el pago con solo ese pack`,
        JSON.stringify(last.update) === JSON.stringify({ [id]: 1 }) && /\/checkout$/.test(page.url()) && JSON.stringify(lines) === JSON.stringify([[id, 1]]) && errs.length === 0, { last, url: page.url(), lines, errs });
      await page.close();
    }
  }

  // 5 · Volver atrás y pulsar otra vez no duplica el pack; con otros productos en el carrito, se abre el carrito
  {
    await reset(); await setState(LIVE);
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('.g-offer__card:has-text("3 pulseras y 2 de regalo")'); await page.waitForTimeout(900);
    await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
    await page.goBack({ waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    await page.waitForTimeout(900);
    const busy = await page.evaluate(() => document.querySelector('[data-garelon-buy-now]').getAttribute('aria-busy'));
    // Sin volver a pulsar la tarjeta: el pack que el navegador deja marcado al volver es el que se compra.
    const back = await page.evaluate(() => ({ checked: document.querySelector('.g-offer__input:checked').value, btn: document.querySelector('[data-garelon-buy-now]').textContent.replace(/\s+/g, ' ').trim() }));
    await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
    const lines = await page.$$eval('#lines li', (li) => li.map((l) => [Number(l.dataset.variant), Number(l.dataset.qty)])).catch(() => []);
    ok('AC13 volver atrás desde el pago: sigue marcado el pack de 5 con su precio en el botón (34,99 €), el botón no se queda cargando y al pulsar otra vez el pack sigue × 1 (no se duplica)',
      busy !== 'true' && back.checked === '3 pulseras y 2 de regalo' && /34,99 €/.test(back.btn) && JSON.stringify(lines) === JSON.stringify([[4103, 1]]) && errs.length === 0, { busy, back, lines, errs });
    await page.close();
  }
  {
    await reset(); await setState(LIVE);
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await T.clickAtc(page, '[id^="ProductSubmitButton-"]'); await page.waitForTimeout(1200); // «Añadir al carrito» (1 pulsera) abre el cajón
    const drawer = await page.evaluate(() => document.querySelector('cart-drawer').classList.contains('active'));
    await page.keyboard.press('Escape'); await page.waitForTimeout(500);
    await page.click('.g-offer__card:has-text("2 pulseras y 1 de regalo")'); await page.waitForTimeout(900);
    await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/cart$/, { timeout: 5000 }).catch(() => {});
    const st = await (await fetch(B + '/__state')).json();
    ok('AC14 «Añadir al carrito» sigue igual (cajón); con otro pack ya en el carrito, «Comprar ahora» lo conserva y abre el carrito para revisar antes de pagar',
      drawer && /\/cart$/.test(page.url()) && JSON.stringify(st.cart) === JSON.stringify([{ id: 4101, quantity: 1 }, { id: 4102, quantity: 1 }]) && errs.length === 0, { url: page.url(), cart: st.cart, errs });
    await page.close();
  }

  // 6 · Agotado y error: botón desactivado como «Añadir al carrito»; si Shopify rechaza, mensaje y sin salir de la página
  {
    await reset(); await setState(LIVE + '&soldout=4102');
    const { page } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('.g-offer__card:has-text("2 pulseras y 1 de regalo")'); await page.waitForTimeout(900);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(600);
    const dis = await page.evaluate(() => { const bn = document.querySelector('[data-garelon-buy-now]'); return { bn: bn.disabled, text: bn.innerText.replace(/\s+/g, ' ').trim(), atc: document.querySelector('[id^="ProductSubmitButton-"]').disabled, sticky: document.querySelector('[data-sticky-button]').textContent.trim(), stickyDis: document.querySelector('[data-sticky-button]').disabled }; });
    ok('AC15 pack agotado: «Comprar ahora» desactivado y con «Agotado» sin precio, igual que «Añadir al carrito» y la compra fija', dis.bn && dis.atc && dis.text === 'Agotado' && dis.sticky === 'Agotado' && dis.stickyDis, dis);
    await page.close();
  }
  {
    await reset(); await setState(LIVE);
    const { page } = await openPage(browser, '/', { width: 390, height: 844 });
    await setState('soldout=4101'); // se agota después de cargar la página: Shopify responde 422
    await page.click('[data-garelon-buy-now]'); await page.waitForTimeout(1200);
    const m = await page.evaluate(() => { const w = document.querySelector('#comprar .product-form__error-message-wrapper'); return { url: location.pathname, shown: !w.hidden, msg: w.textContent.trim(), busy: document.querySelector('[data-garelon-buy-now]').getAttribute('aria-busy') }; });
    ok('AC16 si Shopify rechaza el pack (422), se queda en la página con el mensaje de error y el botón libre', m.url === '/' && m.shown && /Agotado/.test(m.msg) && m.busy !== 'true', m);
    await page.close();
  }
  // Sin JS: el botón envía el formulario nativo de Dawn (/cart/add) con la variante elegida
  {
    await reset(); await setState(LIVE);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await ctx.newPage(); await page.goto(B + '/', { waitUntil: 'networkidle' });
    await page.click('[data-garelon-buy-now]'); await page.waitForLoadState('networkidle');
    const last = (await log()).pop() || {};
    ok('AC17 sin JS, «Comprar ahora» envía el formulario nativo /cart/add con la variante de la página (alternativa segura)', last.id === '4101' && last.form_type === 'product', last);
    await ctx.close();
  }

  // 7 · Compra fija en la home: oculta arriba, aparece al pasar el botón, no tapa el pie ni los enlaces legales
  for (const [w, h] of MOBILE) {
    await reset(); await setState(LIVE);
    const { page, errs } = await openPage(browser, '/', { width: w, height: h });
    const top = await page.evaluate(() => document.querySelector('[data-garelon-sticky]').classList.contains('is-visible'));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(700);
    const m = await page.evaluate(() => {
      const s = document.querySelector('[data-garelon-sticky]'); const sb = s.getBoundingClientRect();
      const links = [...document.querySelectorAll('footer a')].filter(a => a.offsetParent !== null);
      const covered = links.filter(a => { const r = a.getBoundingClientRect(); return r.bottom > sb.top && r.top < innerHeight; }).map(a => a.textContent.trim());
      return { vis: s.classList.contains('is-visible'), h: Math.round(sb.height), btn: Math.round(s.querySelector('[data-sticky-button]').getBoundingClientRect().height), covered, n: links.length };
    });
    ok(`AC18 home ${w}px: compra fija oculta arriba; al final visible (botón ≥ 44 px) sin tapar ningún enlace del pie`, !top && m.vis && m.btn >= 44 && m.covered.length === 0 && m.n > 0 && errs.length === 0, { top, ...m, errs });
    await page.close();
  }

  // 8 · Rendimiento: misma LCP (primera foto) y sin saltos de diseño al cargar en móvil
  for (const [w, h] of [[320, 568], [390, 844], [430, 932]]) {
    await reset(); await setState(LIVE);
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(() => { window.__cls = 0; window.__lcp = ''; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); new PerformanceObserver(l => { const e = l.getEntries().pop(); window.__lcp = e.element ? e.element.className : ''; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
    await page.goto(B + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    const m = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }));
    ok(`AC19 home ${w}×${h}: CLS 0 y la LCP sigue siendo la primera foto de la galería`, m.cls < 0.001 && /g-gallery__img/.test(m.lcp), m);
    await page.close();
  }

  // 9 · Alcance: solo compra rápida en móvil (botones, ajustes, compra fija, CSS, JS, textos y plantillas)
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
    ok('AC20 alcance: garelon.css, garelon.js, buy-buttons, compra fija, ajustes de las dos secciones de compra y las dos plantillas (sin imágenes, precios ni layout)',
      JSON.stringify(changed) === JSON.stringify(['assets/garelon.css', 'assets/garelon.js', 'sections/featured-product.liquid', 'sections/garelon-sticky-cta.liquid', 'sections/main-product.liquid', 'snippets/buy-buttons.liquid', 'templates/index.json', 'templates/product.json']), changed);
    const loc = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- locales`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AC21 locales: solo se añaden los textos garelon.buy (31 idiomas, 4 líneas cada uno), sin borrar nada', loc.every(l => l[0] === '+') && loc.length === 31 * 4, loc.length);
    const sec = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- sections/featured-product.liquid sections/main-product.liquid`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AC22 secciones de compra: solo se añaden los dos ajustes del bloque de botones (sin quitar nada)', sec.filter(l => l[0] === '-').every(l => /^-\s*}$/.test(l)) && sec.some(l => /garelon_buy_now/.test(l)), sec.filter(l => l[0] === '-'));
  }
};
