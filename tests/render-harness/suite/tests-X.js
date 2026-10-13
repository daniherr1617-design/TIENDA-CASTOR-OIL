// SOLO TEST · Fase X: ajustes finales de producto, opiniones y CRO (propietario, 2026-10-13, D41). Descripción de la
// medalla; FAQ ampliada sin datos no confirmados (envío y plazo solo con las casillas del tema); nota de opiniones plegada
// tras «Información sobre las opiniones» y antetítulo neutro; ahorro solo sobre las pulseras que se pagan (las de regalo
// no suman); recorte `detalle` (pulsera en la muñeca, medalla en primer plano) retirado. Precios y valoraciones SIMULADOS.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '2d86d69'; // HEAD antes de la ronda X
const ROUND_HEAD = '48279dc'; // Ronda Y: commit del tema de la ronda X (alcance fijado a X, como en T, U, V y W)
const REPO = fs.existsSync(THEME + '/.git');
const MEDAL = 'Medalla ovalada con la imagen de la Virgen María, rodeada de detalles brillantes.';
const QS = ['¿De qué material está hecha?', '¿Cómo es la medalla de la Virgen María?', '¿Cómo son el crucifijo y las cuentas?', '¿Qué longitud tiene y cómo se ajusta?',
  '¿Puedo llevarla a diario?', '¿Qué recibo con cada oferta?', '¿Es una buena opción para regalar?', '¿Cuánto cuesta el envío y cuándo recibiré mi pedido?',
  '¿Puedo devolver mi pedido?', '¿Qué hago si tengo un problema con mi pedido?'];
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const saves = (html) => cards(html).map(c => (c.match(/Ahorras ([\d.,]+ €)/) || [, ''])[1]);
const note = (html) => text((html.match(/<p class="g-offer__note">[\s\S]*?<\/p>/) || [''])[0]).trim();
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)(?:-v\d+)?-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
const faq = (html) => [...((html.match(/class="g-faq__list"[\s\S]*?<\/section>/) || [''])[0]).matchAll(/<details class="g-faq__item"[\s\S]*?<\/details>/g)].map(m => m[0]);
const reviews = (html) => (html.match(/<section[^>]*class="g-reviews[\s\S]*?<\/section>/) || [''])[0];
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };

module.exports = async function (browser) {
  // 1 · Ahorro solo sobre las pulseras pagadas; precio por pulsera sobre todas las que se reciben
  await reset(); await setState('mode=live');
  const WANT = ['1 pulsera Ideal para ti 19,99 €',
    '2 pulseras y 1 de regalo Recibes 3 pulseras Perfecto para regalar 10,00 € por pulsera Ahorras 9,99 € 29,99 €',
    'Mejor precio por pulsera 3 pulseras y 2 de regalo Recibes 5 pulseras Para ti y para compartir 7,00 € por pulsera Ahorras 24,98 € 34,99 €'];
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const s = buy((await get(u)).html, u);
    ok(`X1 ${n}: «Ahorras 9,99 €» (2 × 19,99 − 29,99) y «Ahorras 24,98 €» (3 × 19,99 − 34,99); 10,00 € y 7,00 € por pulsera; «Recibes 3/5»; distintivo en la 3.ª`, JSON.stringify(cards(s)) === JSON.stringify(WANT), cards(s));
    ok(`X2 ${n}: la nota explica la base con el precio real de 1 pulsera y que el regalo no suma`, note(s) === 'Ahorro calculado solo sobre las unidades que pagas, frente a comprarlas sueltas a 19,99 € cada una. Las de regalo no se suman al ahorro.', note(s));
    ok(`X3 ${n}: sin tachados, porcentajes ni el ahorro antiguo (29,98 € / 64,96 €)`, !/g-offer__was|\d+ ?%|29,98|64,96/.test(text(s)));
  }
  for (const [mode, want, gift] of [['final', ['', '9,99 €', '24,98 €'], true], ['regalo', ['', '9,99 €', '19,98 €'], true], ['real', ['', '9,99 €', '24,98 €'], false]]) {
    await setState(`mode=${mode}`); const s = buy((await get(P)).html, P);
    ok(`X4 mode=${mode}: ahorro ${want.slice(1).join(' / ')} (pagadas: el primer número; sin regalo, todas) y nota ${gift ? 'de regalo' : 'de siempre'}`, JSON.stringify(saves(s)) === JSON.stringify(want) && (gift ? /Las de regalo no se suman/ : /^Ahorro calculado frente a comprar cada pulsera por separado\.$/).test(note(s)), [saves(s), note(s)]);
  }
  await setState('mode=pack3'); {
    const s = buy((await get(P)).html, P);
    ok('X5 sin ahorro real (mismo precio por unidad): ni «Ahorras», ni precio por pulsera, ni nota', !/Ahorras|por pulsera|g-offer__note/.test(s));
  }

  // 2 · Opiniones: enlace discreto que despliega la nota; antetítulo neutro
  await reset(); await setState('mode=live&reviews=both');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = reviews((await get(u)).html);
    const d = (r.match(/<details class="g-reviews__info">[\s\S]*?<\/details>/) || [''])[0];
    ok(`X6 ${n}: «Información sobre las opiniones» plegado (sin «open») tras el widget, con la nota dentro y ningún párrafo suelto`, /<summary class="g-reviews__info-link">Información sobre las opiniones<\/summary>/.test(d) && !/<details class="g-reviews__info" open/.test(r)
      && /class="g-reviews__app"[\s\S]*g-reviews__info/.test(r) && count(r, /g-reviews__note/g) === 1 && d.includes('g-reviews__note'), d.slice(0, 120));
    ok(`X7 ${n}: la nota dice procedencia, cómo se incorporaron y que no son compras verificadas en GARELON`, /otra tienda online/.test(text(d)) && /Las hemos incorporado a nuestra tienda/.test(text(d)) && /no son compras verificadas en nuestra tienda/.test(text(d)) && !/judge\.?me|ali ?express|proveedor/i.test(text(d)));
    ok(`X8 ${n}: antetítulo neutro «Valoraciones» (no «Opiniones reales»); título «Opiniones sobre esta pulsera»`, /<p class="g-eyebrow">Valoraciones<\/p>/.test(r) && !/Opiniones reales/.test(r) && /Opiniones sobre esta pulsera/.test(r));
  }
  await setState('reviews=none'); {
    const r = await get(P);
    ok('X9 sin opiniones: ni sección, ni enlace, ni nota', !/g-reviews__info|Información sobre las opiniones/.test(r.html));
  }
  await setState('reviews=both');
  for (const w of [320, 390, 768, 1440]) {
    const { page, errs } = await openPage(browser, P, { width: w, height: 900 });
    const before = await page.evaluate(() => { const s = document.querySelector('.g-reviews__info-link'); s.scrollIntoView(); const b = s.getBoundingClientRect(); return { h: Math.round(b.height), vis: getComputedStyle(document.querySelector('.g-reviews__info .g-reviews__note')).display !== 'none' && document.querySelector('.g-reviews__info').open }; });
    await page.focus('.g-reviews__info-link'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
    const after = await page.evaluate(() => { const n = document.querySelector('.g-reviews__info .g-reviews__note'); const b = n.getBoundingClientRect(); return { open: document.querySelector('.g-reviews__info').open, h: Math.round(b.height), hs: document.documentElement.scrollWidth > innerWidth }; });
    ok(`X10 ${w}px: el enlace (≥ 44 px) se abre con el teclado y muestra la nota sin desbordes`, before.h >= 44 && !before.vis && after.open && after.h > 20 && !after.hs && errs.length === 0, [before, after]);
    await page.close();
  }

  // 3 · Medalla y preguntas frecuentes
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const html = (await get(u)).html; const det = (html.match(/<section[^>]*id="detalles"[\s\S]*?<\/section>/) || [''])[0]; const f = faq(html);
    ok(`X11 ${n}: tarjeta «Medalla de la Virgen María» con su descripción, como las demás`, new RegExp(`Medalla de la Virgen María[\\s\\S]{0,200}${MEDAL}`).test(text(det)) && count(det, /class="g-fact__text"/g) === 5, text(det).slice(0, 300));
    const qs = f.map(x => text((x.match(/<h3[\s\S]*?<\/h3>/) || [''])[0]).trim());
    ok(`X12 ${n}: 10 preguntas en orden (producto, oferta, regalo, envío, devoluciones, ayuda)`, JSON.stringify(qs) === JSON.stringify(QS), qs);
    const t = text(f.join(' '));
    ok(`X13 ${n}: datos confirmados (acero inoxidable, acabado dorado pulido, medalla ovalada, crucifijo integrado que no cuelga, cuentas de tres tonos, 20 cm, 3 aros, desistimiento 14 días, garantía legal aplicable; textos de D42)`,
      /acero inoxidable con un acabado dorado pulido/.test(t) && /medalla ovalada con la imagen de la Virgen María, rodeada de detalles brillantes/i.test(t) && /no cuelga/.test(t) && /de tres tonos, dorado, plateado y rosado/.test(t)
      && /aproximadamente 20 cm \(7,87 pulgadas\)/.test(t) && /3 aros/.test(t) && /14 días naturales desde la recepción del pedido/.test(t) && /garantía legal aplicable/.test(t));
    ok(`X14 ${n}: sin propiedades no verificadas ni cuidados inventados`, !/hipoal|alerg|14 ?k|quilat|chapad|impermeab|waterproof|resistente al agua|no se oxida|no pierde (el )?color|oro |circon|zirc|diamant|cristal|piedras? preciosa|garant[ií]a de \d|\d+ años|cuidad|limpi/i.test(t), (t.match(/.{30}(hipoal|alerg|14 ?k|quilat|chapad|impermeab|resistente al agua|oxida|oro |circon|diamant|cristal|preciosa|años|cuidad|limpi).{30}/i) || [''])[0]);
  }
  for (const [q, want] of [['ship=', 'El envío es gratuito.'], ['ship=cov', 'El envío es gratuito a toda la península.'], ['ship=cov,eta', 'El envío es gratuito a toda la península. Entrega estimada en 5–10 días naturales.'], ['ship=eta', 'El envío es gratuito. Entrega estimada en 5–10 días naturales.'], ['ship=cov,eta&freeship=0', 'Entrega estimada en 5–10 días naturales.']]) {
    await setState(q); const f = faq((await get(P)).html)[7] || '';
    const facts = text((f.match(/<p class="g-faq__facts">[\s\S]*?<\/p>/) || [''])[0]).trim();
    ok(`X15 envío en la FAQ con ${q}: «${want}» y después el seguimiento y la política`, facts === want && /número de seguimiento/.test(text(f)) && /href="\/policies\/shipping-policy"/.test(f), facts);
  }
  await setState('ship=&freeship=0'); {
    const f = faq((await get(P)).html)[7] || '';
    ok('X15 sin envío gratis ni plazo confirmados: sin frase de envío, solo seguimiento y política', !/g-faq__facts|gratuito|días/.test(f));
  }
  await reset();
  ok('X16 plantillas: el plazo y la cobertura («toda España» / «toda la península») no se escriben en la FAQ (salen de las casillas del tema)', ['templates/index.json', 'templates/product.json'].every(f => { const s = JSON.stringify(JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8')).sections.preguntas); return !/\d+\s*[–-]\s*\d+ días|toda España|toda la península/.test(s) && /"ship_facts":true/.test(s); }));

  // 4 · Imagen retirada: el recorte `detalle` ya no está en galerías, secciones ni assets
  await setState('mode=live');
  {
    const home = (await get('/')).html; const pdp = (await get(P)).html;
    ok('X17 galería de la home: completa → infografía → principal → oración (sin `detalle`)', JSON.stringify(slides(gallery(buy(home, '/')))) === JSON.stringify(['completa', 'infografia', 'principal', 'oracion']), slides(gallery(buy(home, '/'))));
    ok('X18 galería de la ficha: completa → principal → infografía → oración (sin `detalle`)', JSON.stringify(slides(gallery(pdp))) === JSON.stringify(['completa', 'principal', 'infografia', 'oracion']), slides(gallery(pdp)));
    const det = (pdp.match(/<section[^>]*id="detalles"[\s\S]*?<\/section>/) || [''])[0];
    ok('X19 ficha · «Detalles de la pulsera» usa la infografía aprobada (como la home)', /producto-infografia-v3-1254\.webp/.test(det) && /alt="Infografía «Detalles de la pulsera»/.test(det));
    ok('X20 ninguna página sirve producto-detalle ni su alt', !/producto-detalle|Detalle de la pulsera rosario: medalla/.test(home + pdp));
  }
  ok('X21 assets: producto-detalle-*.webp retirados; las demás fotos siguen', !fs.readdirSync(`${THEME}/assets`).some(f => /^producto-detalle-/.test(f)) && ['producto-principal-1080.webp', 'producto-completa-1080.webp', 'producto-oracion-1080.webp', 'producto-infografia-v3-1254.webp'].every(f => fs.existsSync(`${THEME}/assets/${f}`)));
  ok('X22 el selector de imagen de las secciones ya no ofrece `detalle`', ['sections/garelon-details.liquid', 'sections/garelon-hero.liquid', 'sections/garelon-image-text.liquid', 'snippets/garelon-image.liquid', 'snippets/garelon-gallery.liquid'].every(f => !/"value": "detalle"|when 'detalle'/.test(fs.readFileSync(`${THEME}/${f}`, 'utf8'))));

  // 5 · Sin regresiones: navegador, carrito y móvil
  await reset(); await setState('mode=live&reviews=both');
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.click('main label:has-text("3 pulseras y 2 de regalo")'); await page.waitForTimeout(800);
    await page.click('main .product-form__submit'); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok('X23 navegador: 3.ª oferta → cajón «Recibes 5 pulseras (3 pulseras y 2 de regalo)», 34,99 €, cantidad 1', /Recibes 5 pulseras \(3 pulseras y 2 de regalo\)/.test(d) && /34,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, d.slice(0, 160));
    await page.close();
  }
  for (const w of [320, 360, 390, 430, 768, 1024, 1440]) {
    const { page, errs } = await openPage(browser, P, { width: w, height: 900 });
    const m = await page.evaluate(() => {
      const cs = [...document.querySelectorAll('main .g-offer__card')];
      return { hs: document.documentElement.scrollWidth > innerWidth, over: cs.some(c => c.scrollWidth > c.clientWidth + 1), save: cs.map(c => (c.querySelector('.g-offer__save') || {}).textContent || ''), slides: document.querySelectorAll('main .g-gallery__slide').length, count: (document.querySelector('main .g-gallery__count') || {}).textContent || '' };
    });
    ok(`X24 ${w}px: sin scroll horizontal ni desbordes; ahorros 9,99 / 24,98 €; galería de 4 fotos`, !m.hs && !m.over && JSON.stringify(m.save) === '["","Ahorras 9,99 €","Ahorras 24,98 €"]' && m.slides === 4 && (w >= 750 || m.count === '1 / 4') && errs.length === 0, m);
    await page.close();
  }
  await reset();

  // 6 · Alcance de la ronda
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    const allowed = /^(assets\/garelon\.css|assets\/producto-detalle-(480|600)\.webp|locales\/[\w.-]+\.json|sections\/(main-product|featured-product|garelon-faq|garelon-reviews|garelon-details|garelon-hero|garelon-image-text)\.liquid|snippets\/(garelon-offer|garelon-pack-prices|garelon-image|garelon-gallery)\.liquid|templates\/(index|product)\.json)$/;
    ok('X25 alcance: ofertas (ahorro), FAQ, opiniones, medalla e imagen; sin config, carrito, layout ni otras fotos', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    const sec = execSync(`git -C ${THEME} diff ${BASE} ${ROUND_HEAD} -- sections/main-product.liquid sections/featured-product.liquid`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    ok('X26 main-product / featured-product: solo cambia la galería por defecto (sin `detalle`)', sec.length === 8 && sec.every(l => /principal,(detalle|completa),oracion|Claves separadas por comas/.test(l)), sec);
    const loc = execSync(`git -C ${THEME} diff ${BASE} ${ROUND_HEAD} -- locales`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    const okLine = (l) => /^\+\s+("saving_note_gift": |"faq": \{|"ship_free_spain": |"ship_free": |\},?$)|^-\s+"alt_detalle": |^[-+]\s+"alt_completa": |^[-+]\s+"alt_infografia": |^[-+]\s+"(display_reviews|editor_waiting|rating_link|alt_oracion|zoom)"/.test(l);
    ok('X27 locales: nota de ahorro con regalo, frases de envío de la FAQ y fuera el alt del recorte', loc.every(okLine), loc.filter(l => !okLine(l)).slice(0, 4));
  }
};
