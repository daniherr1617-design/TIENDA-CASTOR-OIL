// SOLO TEST · Fase C: primera pantalla de la home (H1, precio de Shopify, CTA, imagen LCP).
// Ronda AA (D44): sin «GARELON Portada»; la compra abre la home, su título es el H1 y su primera foto la LCP.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage } = T;
const fs = require('fs');
module.exports = async function (browser) {
  await reset();
  let r = await get('/');
  const h1 = [...r.html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1]).trim());
  const buy = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
  ok('C1 home: un único H1 = título del producto, dentro de la compra (#comprar)', h1.length === 1 && h1[0] === 'Pulsera Rosario Virgen María' && /<h1 class="product__title h1"/.test(buy(r.html)), h1);
  const first = (r.html.match(/id="shopify-section-template--1__(\w+)"/) || [])[1];
  ok('C2 sin portada: la primera sección de la home es la compra y no queda ningún .g-hero', first === 'compra' && !/g-hero/.test((r.html.match(/<main[\s\S]*?<\/main>/) || [''])[0]), first);
  await setState('mode=pack3save'); r = await get('/');
  ok('C3 precio que varía entre packs: ninguna «A partir de» en la home', !/A partir de/i.test(text(r.html)) && /g-offer__card/.test(buy(r.html)));
  await setState('catalog=none'); r = await get('/');
  ok('C4 sin ningún producto: / → 200, sin compra ni precios (el cierre sigue con «Elegir mi pulsera»)', r.status === 200 && !/<section\s+id="comprar"/.test(r.html) && !/€/.test(text((r.html.match(/<main[\s\S]*?<\/main>/) || [''])[0])) && /Elegir mi pulsera/.test(r.html));
  await reset(); r = await get('/');
  const s0 = buy(r.html);
  ok('C5 CTA de la primera pantalla: «Añadir al carrito» y pago dinámico en la compra; sin «Elegir mi pulsera» ni «Ver los detalles» arriba', /ProductSubmitButton-/.test(s0) && /shopify-payment-button/.test(s0) && !/Elegir mi pulsera|Ver los detalles|g-link-arrow/.test(r.html.slice(0, r.html.indexOf('</product-info>'))));
  const img = (s0.match(/<img[^>]*class="g-gallery__img[^>]*>|<img[^>]*>/) || [''])[0];
  ok('C6 primera foto de la compra (LCP): eager + fetchpriority high + srcset + sizes + width/height + alt', /loading="eager"/.test(img) && /fetchpriority="high"/.test(img) && /srcset="[^"]*480w[^"]*720w[^"]*1080w"/.test(img) && /sizes="/.test(img) && /width="1080"/.test(img) && /height="1080"/.test(img) && /alt="[^"]{20,}"/.test(img), img);
  ok('C7 solo una imagen con fetchpriority="high" en la home', count(r.html, /fetchpriority="high"/g) === 1, count(r.html, /fetchpriority="high"/g));
  // Ronda M (D30): se descuenta la única referencia de app autorizada, el Review Widget de Judge.me (su UUID
  // contiene «4160», que el patrón de ids de variante tomaría por uno). Todo lo demás se sigue vigilando.
  const idx = fs.readFileSync(T.THEME + '/templates/index.json', 'utf8').split('shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8').join('');
  ok('C8 ningún precio, SKU ni id de variante escrito en index.json', !/€|\d+[.,]\d{2}\s*(€|EUR)|"sku"|variant_id|"variant"|\b41\d\d\b/i.test(idx));
  await setState('mode=pack3save'); // con packs, para medir dónde empieza «Elige tu oferta»
  for (const [w, h] of [[320, 640], [360, 740], [375, 667], [390, 844], [430, 932]]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: h });
    const m = await page.evaluate(() => { const b = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width) }; };
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, img: b('#comprar .g-gallery__img'), h1: b('#comprar h1'), offer: b('#comprar .g-offer__legend'), hero: !!document.querySelector('.g-hero') }; });
    // La foto empieza justo bajo la cabecera, el H1 cabe en la primera pantalla y «Elige tu oferta» llega con un desplazamiento corto.
    ok(`C9 ${w}×${h}: foto de la compra bajo la cabecera, H1 en la primera pantalla, «Elige tu oferta» cerca; sin scroll horizontal`, m.sw <= m.cw && !m.hero && m.img && m.img.t <= 160 && m.h1 && m.h1.b <= h && m.offer && m.offer.t <= h + 200 && errs.length === 0, m);
    await page.close();
  }
  for (const w of [768, 1024, 1440]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: 900 });
    const m = await page.evaluate(() => { const i = document.querySelector('#comprar .g-gallery').getBoundingClientRect(); const c = document.querySelector('#comprar .product__info-wrapper').getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, imgLeft: i.left < c.left, top: Math.round(Math.min(i.top, c.top)), h1: Math.round(document.querySelector('#comprar h1').getBoundingClientRect().bottom), offer: Math.round(document.querySelector('#comprar .g-offer__legend').getBoundingClientRect().bottom) }; });
    ok(`C10 ${w}px: dos columnas (galería · compra) bajo la cabecera, H1 y «Elige tu oferta» sin scroll, sin scroll horizontal`, m.sw <= m.cw && m.imgLeft && m.top <= 200 && m.h1 <= 900 && m.offer <= 900 && errs.length === 0, m);
    await page.close();
  }
  // Recorrido final: el primer precio visible de la home está dentro del selector «Elige tu oferta».
  await setState('mode=pack3save&reset=1');
  for (const [w, h] of [[320, 640], [390, 844], [768, 1024], [1440, 900]]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: h });
    const m = await page.evaluate(() => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let first = null, n;
      while ((n = walker.nextNode())) {
        if (!/€/.test(n.textContent)) continue;
        const el = n.parentElement; if (!el || el.closest('[hidden], .visually-hidden, template, script, noscript, cart-drawer')) continue;
        const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || !el.getClientRects().length) continue;
        first = el; break;
      }
      const vis = [...document.querySelectorAll('body *')].filter(e => { if (e.closest('cart-drawer, .visually-hidden')) return false; const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0 && [...e.childNodes].some(c => c.nodeType === 3 && /€|A partir de/i.test(c.textContent)); });
      return { inOffer: !!(first && first.closest('#comprar .g-offer')), firstText: first && first.textContent.trim().slice(0, 40), aboveFold: vis.filter(e => !e.closest('#comprar .g-offer')).map(e => e.textContent.trim().slice(0, 30)), hero: !!document.querySelector('.g-hero') };
    });
    ok(`C11 ${w}px: ningún precio fuera de «Elige tu oferta» en la primera pantalla; el primer € visible está en las tarjetas`, m.aboveFold.length === 0 && !m.hero && m.inOffer && errs.length === 0, m);
    await page.close();
  }
  {
    // D44: sin portada, los enlaces a /#comprar (cierre, menú) llevan a la compra, que es lo primero de la home.
    const { page, errs } = await openPage(browser, '/#comprar', { width: 390, height: 844 });
    const m = await page.evaluate(() => { const cards = [...document.querySelectorAll('#comprar .g-offer__card')];
      const trust = document.querySelector('#comprar .g-trust, #comprar [class*="trust"]');
      return { url: location.hash, n: cards.length, prices: cards.map(c => (c.textContent.match(/\d+,\d{2} €/) || [''])[0]), titles: cards.map(c => c.textContent.replace(/\s+/g, ' ').trim()), visible: cards.every(c => { const r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) }; });
    ok('C12 /#comprar: la compra con las 3 tarjetas (1/2/3 pulseras) y sus precios', m.url === '#comprar' && m.n === 3 && m.prices.every(Boolean) && /1 pulsera/.test(m.titles[0]) && /2 pulseras/.test(m.titles[1]) && /3 pulseras/.test(m.titles[2]) && m.visible && errs.length === 0, m);
    await page.close();
  }
  await reset();
  const idx2 = JSON.parse(fs.readFileSync(T.THEME + '/templates/index.json', 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
  ok('C13 index.json: sin sección «GARELON Portada»; la compra va primera con «Primera sección de la página» (H1 + foto prioritaria)', idx2.order[0] === 'compra' && !Object.values(idx2.sections).some(x => x.type === 'garelon-hero') && idx2.sections.compra.settings.garelon_primary === true, [idx2.order[0], idx2.sections.compra.settings.garelon_primary]);
};
