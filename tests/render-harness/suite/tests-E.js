// SOLO TEST · Fase E: home completa (contenido, anclas, claims, FAQ, accesibilidad, responsive).
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B } = T;
const fs = require('fs');
const FAQ = JSON.parse(fs.readFileSync(__dirname + '/../fixtures/faq.json', 'utf8')).faq;
const main = (html) => (html.match(/<main[\s\S]*?<\/main>/) || [''])[0];
const visible = (html) => text(html.replace(/<template[\s\S]*?<\/template>/g, '').replace(/<script[\s\S]*?<\/script>/g, ''));
const FORBIDDEN = /\b14 ?k\b|\boro\b|chapad|ba[ñn]ad[oa] en oro|hipoalerg|waterproof|resistente al agua|no se oxida|no pierde (el )?color|calidad eterna|fabricad[oa] por garelon|dise[ñn]ad[oa] por garelon|bendici|bendecid|protecci[oó]n (espiritual|divina)|\bsuerte\b|milagr|\benerg[ií]a\b|garant[ií]a de 14|sin riesgos|3 a[ñn]os de garant|4,9\/5|m[aá]s de [\d.]+ clientes|m[aá]s vendid|oferta limitada|[uú]ltimas unidades|quedan \d/i;

module.exports = async function (browser) {
  await reset();
  let r = await get('/');
  const order = [...r.html.matchAll(/id="shopify-section-template--1__(\w+)"/g)].map(m => m[1]);
  ok('E1 orden de la home', JSON.stringify(order) === JSON.stringify(['portada', 'compra', 'tranquilidad', 'opiniones', 'significado', 'detalles', 'regalo', 'preguntas', 'cierre']), order);
  const ids = ['inicio', 'comprar', 'significado', 'detalles', 'regalo', 'preguntas-frecuentes'];
  ok('E2 anclas de la home existen (incluidas las del menú y los CTA)', ids.every(i => new RegExp(`id="${i}"`).test(r.html)), ids.filter(i => !new RegExp(`id="${i}"`).test(r.html)));
  const hrefs = [...r.html.matchAll(/href="\/#([\w-]+)"/g)].map(m => m[1]);
  ok('E3 todo enlace /#ancla apunta a una sección existente', hrefs.every(h => ids.includes(h)), [...new Set(hrefs)]);
  const m = main(r.html); const vt = visible(r.html);
  ok('E4 «Compra con tranquilidad»: texto exacto + /policies/refund-policy', /14 días para cambiar de opinión/.test(m) && /Compra con tranquilidad/.test(m) && /En compras online dispones de 14 días naturales desde la recepción del pedido para ejercer tu derecho de desistimiento\. Además, tus derechos frente a faltas de conformidad están cubiertos por la garantía legal aplicable\./.test(m) && /href="\/policies\/refund-policy"[^>]*>Consulta la política de devoluciones/.test(m));
  ok('E5 «Una joya que va más allá del detalle» con su texto', /Una joya que va más allá del detalle/.test(m) && /Su diseño reúne la medalla de la Virgen María, la cruz y las cuentas de rosario tricolor/.test(m));
  const facts = [...m.matchAll(/<h3 class="g-fact__title">([^<]+)<\/h3>/g)].map(x => x[1]);
  ok('E6 «Detalles de la pulsera»: los 5 hechos, sin coletillas del proveedor ni nota comercial', JSON.stringify(facts) === JSON.stringify(['Acero inoxidable', 'Medalla de la Virgen María', 'Cruz y cuentas tricolor', 'Longitud', 'Ajuste']) && /Aprox\. 20 cm \(7,87 pulgadas\)\./.test(m) && /Ajustable · 3 aros para regular la longitud\./.test(m) && !/según|proveedor|Cada unidad incluye/i.test(text((m.match(/id="detalles"[\s\S]*?<\/section>/) || [''])[0])), facts);
  const chips = [...m.matchAll(/<li class="g-chip"[^>]*>[\s\S]*?<span>([^<]+)<\/span>/g)].map(x => x[1]);
  ok('E7 «Regalo»: 6 ocasiones', JSON.stringify(chips) === JSON.stringify(['Bautizo', 'Primera comunión', 'Confirmación', 'Navidad', 'Pascua', 'Otras ocasiones religiosas']), chips);
  const qs = [...m.matchAll(/<h3 class="g-faq__q">([^<]+)<\/h3>/g)].map(x => x[1]);
  ok('E8 FAQ: las 9 preguntas en details/summary con H3', qs.length === 9 && JSON.stringify(qs) === JSON.stringify(FAQ.map(f => f[0])) && count(m, /<details class="g-faq__item"/g) === 9, qs);
  ok('E9 FAQ remite a envíos, devoluciones y contacto', /href="\/policies\/shipping-policy"/.test(m) && count(m, /href="\/policies\/refund-policy"/g) >= 3 && /href="\/pages\/contacto"/.test(m));
  ok('E10 cierre: «Elegir mi pulsera» → /#comprar; como mucho 3 CTA de compra en la home', /Una joya con significado/.test(m) && count(m, /href="\/#comprar"/g) <= 3 && count(m, /href="\/#comprar"/g) >= 2, count(m, /href="\/#comprar"/g));
  ok('E11 sin claims prohibidos, urgencia ni reseñas inventadas en el texto visible', !FORBIDDEN.test(vt), (vt.match(FORBIDDEN) || [])[0]);
  ok('E12 la frase de fe aparece una sola vez', count(r.html, /Un símbolo de tu fe, contigo cada día/g) === 1);
  const heads = [...m.matchAll(/<h([1-3])[\s>]/g)].map(x => +x[1]);
  ok('E13 jerarquía de títulos: 1 H1 (portada) y H2 por sección', heads.filter(h => h === 1).length === 1 && heads[0] === 1 && heads.filter(h => h === 2).length >= 7, heads.join(''));
  const imgs = [...m.matchAll(/<img\b[^>]*>/g)].map(x => x[0]);
  ok('E14 imágenes del contenido: todas con alt, width y height; solo la portada eager', imgs.length >= 6 && imgs.every(i => /alt="[^"]+"/.test(i) && /width="\d+"/.test(i) && /height="\d+"/.test(i)) && imgs.filter(i => /loading="eager"/.test(i)).length === 1 && imgs.filter(i => !/loading="eager"/.test(i)).every(i => /loading="lazy"/.test(i)), imgs.filter(i => !/alt="[^"]+"/.test(i)).slice(0, 2));
  // Ronda M (D30, decisión del propietario): el Review Widget oficial de Judge.me es la única referencia de app
  // permitida en index.json; se descuenta y cualquier otra «shopify://» sigue fallando.
  const idx = fs.readFileSync(T.THEME + '/templates/index.json', 'utf8').split('shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8').join('');
  ok('E15 index.json sin precios, SKU, ids de variante, referencias a apps (salvo el Review Widget de Judge.me, D30) ni imágenes de Files', !/€|\d+[.,]\d{2}\s*(€|EUR)|"sku"|variant_id|shopify:\/\//.test(idx));
  ok('E16 sin enlaces vacíos ni a /collections en la home', !/href=""|href="#"(?![\w-])|href="\/collections/.test(r.html.replace(/<template[\s\S]*?<\/template>/g, '')));

  // Navegador: FAQ con teclado, menú móvil con anclas, responsive.
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.focus('#preguntas-frecuentes summary'); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
    const open = await page.evaluate(() => document.querySelector('#preguntas-frecuentes details').open);
    const h = await page.evaluate(() => Math.round(document.querySelector('#preguntas-frecuentes summary').getBoundingClientRect().height));
    ok('E17 FAQ: se abre con el teclado y cada pregunta mide ≥ 44 px', open && h >= 44, { open, h });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('.header__icon--menu'); await page.waitForTimeout(500);
    await page.click('#menu-drawer a[href="/#detalles"]'); await page.waitForTimeout(900);
    const st = await page.evaluate(() => ({ open: document.querySelector('#Details-menu-drawer-container').hasAttribute('open'), top: Math.round(document.getElementById('detalles').getBoundingClientRect().top), lock: document.body.className }));
    ok('E18 menú móvil: «Detalles» cierra el menú y lleva a #detalles', !st.open && st.top >= -5 && st.top < 160 && !/overflow-hidden/.test(st.lock), st);
    ok('E19 sin errores JS en la home', errs.length === 0, errs);
    await page.close();
  }
  for (const [w, hgt] of [[320, 640], [360, 740], [375, 667], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: hgt });
    const res = await page.evaluate(() => {
      const over = [...document.querySelectorAll('main *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.right > document.documentElement.clientWidth + 1) && !e.closest('.g-gallery__track'); }).map(e => e.className).slice(0, 3);
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, over };
    });
    ok(`E20 ${w}px: home completa sin scroll horizontal ni elementos fuera de pantalla`, res.sw <= res.cw && res.over.length === 0 && errs.length === 0, res);
    await page.close();
  }
};
