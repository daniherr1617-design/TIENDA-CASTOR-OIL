// SOLO TEST · Fase AA: la compra abre la home (propietario, 2026-10-14, D44). Sin «GARELON Portada» ni su botón
// «Elegir mi pulsera»: lo primero tras la barra y la cabecera es la sección de compra de siempre (galería, título,
// valoración, garantías, campaña, packs, entrega y botones), con su título como único H1 y su primera foto como LCP.
// El resto de la home, la ficha, los packs, la FAQ y las opiniones no cambian. Precios y valoraciones SIMULADOS.
const T = require('./tests.js');
const { ok, get, setState, reset, count, openPage, THEME, B } = T;
const fs = require('fs'); const path = require('path');
const STUB = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'standard-events-stub.js'), 'utf8');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '67c09df'; // HEAD antes de la ronda AA
const ROUND_HEAD = 'f0a502b'; // Ronda AB: commit del tema de la ronda AA (alcance fijado a AA, como en T…Z)
const REPO = fs.existsSync(THEME + '/.git');
const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const buy = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
const order = (html) => [...html.matchAll(/id="shopify-section-template--1__(\w+)"/g)].map(m => m[1]);
const AFTER = ['compra', 'opiniones', 'tranquilidad', 'significado', 'detalles', 'regalo', 'preguntas', 'cierre'];

module.exports = async function (browser) {
  // 1 · Plantilla: solo sale la portada y la compra se marca como primera sección
  const idx = json('templates/index.json');
  ok('AA1 index.json: sin «portada» (GARELON Portada); las otras 8 secciones en el mismo orden', JSON.stringify(idx.order.filter(x => x !== 'compra_fija')) === JSON.stringify(AFTER) /* D46: compra fija al final */ && !idx.sections.portada && !Object.values(idx.sections).some(s => s.type === 'garelon-hero'), idx.order);
  ok('AA2 la compra lleva «Primera sección de la página» (H1 + foto prioritaria); la sección sigue disponible en el editor', idx.sections.compra.settings.garelon_primary === true && fs.existsSync(`${THEME}/sections/garelon-hero.liquid`));

  // 2 · Render: compra primero, un H1, una LCP
  await reset(); await setState('mode=live&reviews=both');
  let r = await get('/'); const s = buy(r.html);
  ok('AA3 home: la compra es la primera sección y no queda rastro de la portada («Joyería con significado», «Elegir mi pulsera» arriba, .g-hero)',
    order(r.html)[0] === 'compra' && !/g-hero/.test(r.html) && !/Joyería con significado/.test((r.html.match(/<main[\s\S]*?<\/main>/) || [''])[0]) && !/Elegir mi pulsera/.test(r.html.slice(0, r.html.indexOf('</product-info>'))), order(r.html).slice(0, 3));
  const h1 = [...r.html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].trim());
  ok('AA4 un único H1 en la home = título del producto (Shopify), dentro de la compra', h1.length === 1 && /<h1 class="product__title h1"[^>]*>\s*Pulsera Rosario Virgen María\s*<\/h1>/.test(s), h1);
  const imgs = [...s.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
  ok('AA5 LCP: la primera foto de la galería es la única eager/fetchpriority high de la página; las demás lazy',
    /loading="eager"/.test(imgs[0]) && /fetchpriority="high"/.test(imgs[0]) && count(r.html, /fetchpriority="high"/g) === 1 && count(r.html, /loading="eager"/g) === 1 && imgs.slice(1).every(i => /loading="lazy"/.test(i)), imgs[0]);
  const zone = ['g-gallery', 'product__title', 'g-rating', 'g-trust--chips', 'g-offer__promo', 'g-offer__legend', 'g-offer__card', 'product-form__submit', 'shopify-payment-button', 'g-trust__phrase'];
  const pos = zone.map(c => s.indexOf(c));
  ok('AA6 compra completa y en su orden: galería → título → valoración → garantías → campaña → «Elige tu oferta» → packs → botón → pago → frase',
    pos.every(p => p > 0) && pos.every((p, i) => i === 0 || p > pos[i - 1]) && count(s, /class="g-offer__card/g) === 3 && /Especial octubre · Mes del Rosario/.test(s), Object.fromEntries(zone.map((c, i) => [c, pos[i]])));
  r = await get(P);
  ok('AA7 ficha intacta: su H1 sigue siendo el título y su primera foto la eager', count(r.html, /<h1[\s>]/g) === 1 && /class="product__title"[^>]*>\s*<h1>\s*Pulsera Rosario Virgen María\s*<\/h1>/.test(r.html) && count(r.html, /fetchpriority="high"/g) === 1);

  // 3 · Navegador: primera pantalla en móvil y escritorio, sin hueco del antiguo hero ni saltos
  for (const [w, h] of [[320, 640], [360, 740], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
    await page_cls(w, h);
  }
  async function page_cls(w, h) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await page.route('https://cdn.shopify.com/storefront/standard-events.js', x => x.fulfill({ contentType: 'text/javascript', body: STUB }));
    const errs = []; page.on('pageerror', e => errs.push(String(e)));
    await page.goto(B + '/', { waitUntil: 'networkidle' }); await page.waitForTimeout(500);
    const m = await page.evaluate(() => {
      const b = (q) => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left) }; };
      const head = document.querySelector('.section-header, header'); const main = document.querySelector('main');
      return { header: Math.round(head.getBoundingClientRect().bottom), mainTop: Math.round(main.getBoundingClientRect().top), gallery: b('#comprar .g-gallery'), info: b('#comprar .product__info-wrapper'), h1: b('#comprar h1'), offer: b('#comprar .g-offer__legend'), lcp: b('#comprar .g-gallery__img'),
        lcpDone: (() => { const i = document.querySelector('#comprar .g-gallery__img'); return i.complete && i.naturalWidth > 0; })(), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, cls: Math.round(window.__cls * 1000) / 1000 };
    });
    const top = Math.min(m.gallery.t, m.info.t);
    // Hueco entre la cabecera y la compra = solo el margen superior de la sección (40 px en escritorio, 30 px en móvil).
    ok(`AA8 ${w}×${h}: la compra empieza bajo la cabecera sin hueco del antiguo hero (≤ 48 px), H1 en la primera pantalla, foto cargada, sin scroll horizontal`,
      top - m.header >= 0 && top - m.header <= 48 && m.mainTop - m.header <= 1 && m.h1.b <= h && m.lcpDone && m.sw <= m.cw && errs.length === 0, { ...m, gap: top - m.header, errs });
    ok(`AA9 ${w}×${h}: «Elige tu oferta» ${w < 750 ? 'a menos de 200 px de la primera pantalla' : 'visible sin desplazarse'} y sin saltos de diseño (CLS < 0,1)`,
      (w < 750 ? m.offer.t <= h + 200 : m.offer.b <= h) && m.cls < 0.1, { offer: m.offer, cls: m.cls });
    await page.close();
  }

  // 4 · Compra real desde la home en escritorio (en móvil la cubre D18-D23)
  await setState('mode=pack3save&reset=1');
  {
    const { page, errs } = await openPage(browser, '/', { width: 1440, height: 900 });
    await page.click('#comprar label:has-text("3 pulseras")'); await page.waitForTimeout(900);
    const idv = await page.evaluate(() => document.querySelector('#comprar form[id^="product-form-template"] input[name="id"]').value);
    await T.clickAtc(page, '#comprar [id^="ProductSubmitButton-"]'); await page.waitForTimeout(1200);
    const st = await (await fetch(B + '/__state')).json(); const last = st.log[st.log.length - 1] || {};
    const drawer = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); return d && d.classList.contains('active') ? d.innerText : ''; });
    ok('AA10 escritorio: elegir «3 pulseras» y «Añadir al carrito» desde la home envía la variante 4103 × 1 y abre el cajón', idv === '4103' && last.id === '4103' && st.cart.length === 1 && st.cart[0].quantity === 1 && /3 pulseras/.test(drawer) && errs.length === 0, { idv, last, errs });
    await page.close();
  }
  await reset();

  // 5 · Alcance: solo la plantilla de inicio y el ajuste de la compra
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    ok('AA11 alcance: solo templates/index.json y sections/featured-product.liquid (sin CSS, ficha, packs, opiniones, FAQ, imágenes, locales ni ajustes)',
      changed.length === 2 && changed.every(f => /^(templates\/index\.json|sections\/featured-product\.liquid)$/.test(f)), changed);
    const at = (f) => JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString().replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
    const before = at('templates/index.json'); const now = JSON.parse(execSync(`git -C ${THEME} show ${ROUND_HEAD}:templates/index.json`).toString().replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '')); // alcance fijado a AA
    const strip = (t) => { const c = JSON.parse(JSON.stringify(t)); delete c.sections.portada; c.order = c.order.filter(x => x !== 'portada'); delete c.sections.compra.settings.garelon_primary; return c; };
    ok('AA12 index.json: fuera de la portada y del nuevo ajuste no cambia nada (orden, packs, campaña, opiniones, FAQ, imágenes, textos)', JSON.stringify(strip(before)) === JSON.stringify(strip(now)));
    const sec = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- sections/featured-product.liquid`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AA13 featured-product: solo el ajuste «Primera sección de la página», la etiqueta del título (h2 → h1 con el ajuste) y la foto prioritaria',
      sec.every(l => /garelon_primary|title_tag|"type": "checkbox"|"label": "Primera sección|"default": false|"info": "Actívalo|^\+\s*[{}],?$|^\+\s*\{%- liquid|^\+\s*-%\}|^\+\s*(assign|if|endif)\b|^-\s*<\/?h2|garelon-gallery/.test(l)) && sec.filter(l => /^-/.test(l)).length === 3, sec);
  }
};
