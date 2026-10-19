// SOLO TEST · Fase AL: ninguna mención visible al seguimiento de los pedidos (propietario, 2026-10-19, D55).
// «Envío gratis + seguimiento» → «Oferta especial · Envío GRATIS» en la garantía de envío y en la barra superior (y en la
// etiqueta de las ofertas, que sigue apagada desde D54); la respuesta de envío de la FAQ pierde la frase del número de
// seguimiento y conserva la política. Sin «sin seguimiento» ni explicaciones, sin temporizadores ni plazos de la oferta.
// Las páginas de cuenta de cliente de Shopify (pedido con su enlace de seguimiento) son funcionales y no cambian.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '1699485'; // commit del tema antes de la ronda AL
const REPO = fs.existsSync(THEME + '/.git');
const NEW = 'Oferta especial · Envío GRATIS';
const CHIPS = [NEW, 'Pago seguro', '14 días para cambiar de opinión'];
const chips = (html) => [...html.matchAll(/<li class="g-trust__chip">[\s\S]*?<span>([\s\S]*?)<\/span>/g)].map(m => m[1].replace(/&nbsp;/g, ' ').trim());
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras Ahorras 9,99 € (25 %) 29,99 €',
  'Mayor ahorro 3 pulseras Para ti y para compartir Ahorras 24,98 € (42 %) 34,99 €'];
const TRACK = /seguimiento|rastreo|tracking/i;
const NEGATIVE = /sin seguimiento|no (ofrecemos|incluye) seguimiento/i;
// Regalos (D52): «Envío GRATIS» es el envío, no un regalo; fuera de ese texto, ningún «GRATIS» ni regalo.
const GIFT = /GRATIS|\d gratis|de regalo|\b[23] ?\+ ?[12]\b|[Mm]ás popular|Recibes \d/;
const TIMER = /solo hoy|termina en|quedan \d|hasta (el|fin)|\b\d{1,2}:\d{2}\b|countdown|cuenta atr[aá]s/i;

module.exports = async function (browser) {
  // 1 · Render: garantía, barra, FAQ y resto de la compra
  for (const mode of ['live', 'd49']) {
    await reset(); await setState(`mode=${mode}`);
    for (const [n, u] of [['home', '/'], ['ficha', P]]) {
      const html = (await get(u)).html; const t = text(html); const b = buy(html, u);
      ok(`AL1 ${mode} ${n}: garantías «${CHIPS.join('» · «')}», una sola franja`, JSON.stringify(chips(html)) === JSON.stringify(CHIPS), chips(html));
      ok(`AL2 ${mode} ${n}: barra superior «${NEW}»`, html.includes(`<p class="g-bar__line">${NEW}</p>`));
      ok(`AL3 ${mode} ${n}: ninguna mención visible al seguimiento ni frases negativas`, !TRACK.test(t) && !NEGATIVE.test(t), (t.match(/.{0,50}(seguimiento|rastreo|tracking).{0,30}/i) || [])[0]);
      ok(`AL4 ${mode} ${n}: sin regalos ni temporizadores ni plazos de la oferta (aparte de «Envío GRATIS»)`, !GIFT.test(t.split(NEW).join(' ')) && !TIMER.test(t), (t.split(NEW).join(' ').match(new RegExp('.{0,40}(' + GIFT.source + '|' + TIMER.source + ').{0,40}', 'i')) || [])[0]);
      ok(`AL5 ${mode} ${n}: sin etiqueta encima de las ofertas; tarjetas, precios y ahorros sin cambios; 4 fotos y aviso del estuche`,
        !/g-offer__promo/.test(b) && JSON.stringify(cards(offer(b))) === JSON.stringify(WANT) && (b.match(/class="g-gallery__slide/g) || []).length === 4 && b.includes('<p class="g-gallery__note">Estuche y elementos decorativos no incluidos.</p>'), cards(offer(b)));
      const faq = (html.match(/¿Cuánto cuesta el envío y cuándo recibiré mi pedido\?[\s\S]*?<\/details>/) || [''])[0];
      ok(`AL6 ${mode} ${n}: FAQ de envío con la frase de envío del tema y la política de envíos, sin seguimiento`, /g-faq__facts/.test(faq) && /href="\/policies\/shipping-policy"/.test(faq) && /Encontrarás los plazos y todas las condiciones de entrega/.test(faq) && !TRACK.test(text(faq)), text(faq).slice(0, 200));
    }
  }
  await reset();
  { const t = text((await get('/cart')).html); ok('AL7 /cart: sin seguimiento visible y barra con el texto nuevo', !TRACK.test(t) && t.includes(NEW)); }
  // 2 · Navegador: la garantía nueva cabe en la franja (misma fila y altura) en móvil y escritorio
  for (const [u, w] of [['/', 320], ['/', 390], ['/', 1440], [P, 320], [P, 390], [P, 1440]]) {
    await reset(); await setState('mode=live');
    const { page, errs } = await openPage(browser, u, { width: w, height: 900 });
    const m = await page.evaluate(() => {
      const root = document.querySelector('#comprar product-info') || document.querySelector('main product-info');
      const cs = [...root.querySelectorAll('.g-trust__chip')].map(c => { const b = c.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.height), c.scrollWidth > c.clientWidth + 1]; });
      const bar = document.querySelector('.g-bar').getBoundingClientRect();
      return { cs, bar: Math.round(bar.height), hs: document.documentElement.scrollWidth > innerWidth };
    });
    const vis = await page.evaluate(() => /seguimiento|rastreo|tracking/i.test(document.body.innerText));
    ok(`AL8 ${u === '/' ? 'home' : 'ficha'} ${w}px: 3 garantías en una fila, misma altura, sin desbordes; barra ≤ 80 px; nada de seguimiento visible`,
      !!m && m.cs.length === 3 && m.cs.every(c => c[0] === m.cs[0][0] && c[1] === m.cs[0][1] && !c[2]) && m.bar <= 80 && !m.hs && !vis && errs.length === 0, { m, vis, errs });
    await page.close();
  }
  // 3 · Alcance: solo los textos de envío
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    const lines = execSync(`git -C ${THEME} diff -U0 ${BASE} -- assets config layout locales sections snippets templates`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AL9 alcance: solo los textos de envío (garantía, barra, etiqueta apagada, FAQ y ayudas del editor); sin CSS, Liquid, locales ni imágenes',
      changed.every(f => /^(templates\/(index|product)\.json|sections\/(header-group\.json|featured-product\.liquid|main-product\.liquid)|config\/settings_schema\.json)$/.test(f))
      && lines.every(l => /^[+-]\s*"(chip_1_text|promo_text|fallback_text|answer|default|content|info)"/.test(l)) && lines.filter(l => l.startsWith('+')).every(l => !/seguimiento/.test(l)),
      [changed, lines.filter(l => !/"(chip_1_text|promo_text|fallback_text|answer|default|content|info)"/.test(l)).slice(0, 4)]);
  }
};
