// SOLO TEST · Fase C: portada (H1, precio de Shopify, CTA, imagen LCP, primera pantalla).
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage } = T;
const fs = require('fs');
module.exports = async function (browser) {
  await reset();
  let r = await get('/');
  const h1 = [...r.html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1]).trim());
  ok('C1 home: un único H1 = «Pulsera Rosario Virgen María» (portada)', h1.length === 1 && h1[0] === 'Pulsera Rosario Virgen María', h1);
  const hero = (r.html.match(/<section[^>]*class="g-hero[\s\S]*?<\/section>/) || [''])[0];
  ok('C2 portada sin precio: ni .g-hero__price ni importes en €', !/g-hero__price/.test(hero) && !/€|\d+,\d{2}/.test(text(hero)), text(hero).match(/\d+,\d+ €/));
  await setState('mode=pack3save'); r = await get('/');
  const hero3 = (r.html.match(/<section[^>]*class="g-hero[\s\S]*?<\/section>/) || [''])[0];
  ok('C3 precio que varía entre packs: ninguna «A partir de» en la home ni precio en la portada', !/A partir de/i.test(text(r.html)) && !/g-hero__price|€/.test(hero3));
  await setState('catalog=none'); r = await get('/');
  ok('C4 sin ningún producto: / → 200, sin precio y con H1 y CTA', r.status === 200 && !/g-hero__price/.test(r.html) && /Elegir mi pulsera/.test(r.html));
  await reset(); r = await get('/');
  ok('C5 un único CTA en la portada: «Elegir mi pulsera» → /#comprar; sin «Ver los detalles»', /href="\/#comprar" class="button button--primary g-hero__button">Elegir mi pulsera/.test(hero) && count(hero, /<a\s/g) === 1 && !/g-link-arrow|Ver los detalles/.test(hero), count(hero, /<a\s/g));
  const img = (hero.match(/<img[^>]*>/) || [''])[0];
  ok('C6 imagen de portada: eager + fetchpriority high + srcset + sizes + width/height + alt', /loading="eager"/.test(img) && /fetchpriority="high"/.test(img) && /srcset="[^"]*480w[^"]*720w[^"]*1080w"/.test(img) && /sizes="/.test(img) && /width="1080"/.test(img) && /height="1080"/.test(img) && /alt="Pulsera rosario/.test(img), img);
  ok('C7 solo una imagen con fetchpriority="high" en la home', count(r.html, /fetchpriority="high"/g) === 1, count(r.html, /fetchpriority="high"/g));
  // Ronda M (D30): se descuenta la única referencia de app autorizada, el Review Widget de Judge.me (su UUID
  // contiene «4160», que el patrón de ids de variante tomaría por uno). Todo lo demás se sigue vigilando.
  const idx = fs.readFileSync(T.THEME + '/templates/index.json', 'utf8').split('shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8').join('');
  ok('C8 ningún precio, SKU ni id de variante escrito en index.json', !/€|\d+[.,]\d{2}\s*(€|EUR)|"sku"|variant_id|"variant"|\b41\d\d\b/i.test(idx));
  for (const [w, h] of [[320, 640], [360, 740], [375, 667], [390, 844], [430, 932]]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: h });
    const m = await page.evaluate(() => { const b = (s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width) }; };
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, img: b('.g-hero__img'), h1: b('.g-hero__heading'), price: b('.g-hero__price'), cta: b('.g-hero__button') }; });
    ok(`C9 ${w}×${h}: imagen, H1 y CTA en la primera pantalla, sin precio; sin scroll horizontal`, m.sw <= m.cw && m.img && m.img.b <= h && m.cta && m.cta.b <= h && !m.price && errs.length === 0, m);
    await page.close();
  }
  for (const w of [768, 1024, 1440]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: 900 });
    const m = await page.evaluate(() => { const i = document.querySelector('.g-hero__media').getBoundingClientRect(); const c = document.querySelector('.g-hero__content').getBoundingClientRect();
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, imgRight: i.left > c.left, cta: document.querySelector('.g-hero__button').getBoundingClientRect().bottom }; });
    ok(`C10 ${w}px: dos columnas (texto · imagen), CTA visible sin scroll, sin scroll horizontal`, m.sw <= m.cw && m.imgRight && m.cta <= 900 && errs.length === 0, m);
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
      return { inOffer: !!(first && first.closest('#comprar .g-offer')), firstText: first && first.textContent.trim().slice(0, 40), aboveFold: vis.filter(e => !e.closest('#comprar .g-offer')).map(e => e.textContent.trim().slice(0, 30)), hero: !!document.querySelector('.g-hero').textContent.match(/€|A partir de/i) };
    });
    ok(`C11 ${w}px: ningún precio fuera de «Elige tu oferta» en la primera pantalla; el primer € visible está en las tarjetas`, m.aboveFold.length === 0 && !m.hero && m.inOffer && errs.length === 0, m);
    await page.close();
  }
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('.g-hero__button'); await page.waitForTimeout(700);
    const m = await page.evaluate(() => { const cards = [...document.querySelectorAll('#comprar .g-offer__card')];
      const trust = document.querySelector('#comprar .g-trust, #comprar [class*="trust"]');
      return { url: location.hash, n: cards.length, prices: cards.map(c => (c.textContent.match(/\d+,\d{2} €/) || [''])[0]), titles: cards.map(c => c.textContent.replace(/\s+/g, ' ').trim()), visible: cards.every(c => { const r = c.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) }; });
    ok('C12 tras «Elegir mi pulsera»: #comprar con las 3 tarjetas (1/2/3 pulseras) y sus precios', m.url === '#comprar' && m.n === 3 && m.prices.every(Boolean) && /1 pulsera/.test(m.titles[0]) && /2 pulseras/.test(m.titles[1]) && /3 pulseras/.test(m.titles[2]) && m.visible && errs.length === 0, m);
    await page.close();
  }
  await reset();
  const idx2 = JSON.parse(fs.readFileSync(T.THEME + '/templates/index.json', 'utf8')).sections.portada.settings;
  ok('C13 index.json portada: show_price false, segundo CTA vacío, botón principal «Elegir mi pulsera» (vacío = /#comprar)', idx2.show_price === false && idx2.button2_label === '' && idx2.button2_link === '' && idx2.button_label === 'Elegir mi pulsera' && (idx2.button_link === '' || idx2.button_link === '/#comprar'), idx2);
};
