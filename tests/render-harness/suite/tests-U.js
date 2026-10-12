// SOLO TEST · Fase U: reestructuración CRO para España (2026-10-12, D38). Packs con regalo como variantes reales
// («1 pulsera», «2 + 1 de regalo (3 pulseras)», «3 + 2 de regalo (5 pulseras)», cantidad 1 en el carrito), barra de envío
// configurable que no muestra «toda España» ni el plazo hasta que el propietario los confirma, tienda solo para España
// (sin selector de país), etiqueta de campaña «Especial octubre · Mes del Rosario» encima de los packs y contador en la
// galería móvil. Precios SIMULADOS (mode=regalo: 19,99 / 29,99 / 39,99 €): el tema no los conoce ni los escribe.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'd21bfc5'; // HEAD antes de la ronda U
const ROUND_HEAD = '765e970'; // Ronda V: commit del tema de la ronda U (alcance fijado a U, como en T)
const REPO = fs.existsSync(THEME + '/.git');
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const CAMPAIGN = 'Especial octubre · Mes del Rosario';
const BAR_ALL = '🇪🇸 Envío gratis a toda España';
const ETA = 'Entrega estimada en 5–10 días naturales';
const LIMITED = '🇪🇸 Envío gratis a la península y Baleares'; // texto SIMULADO del propietario (ship=lim)
const LATAM = /México|Mexico|Chile|Colombia|Perú|Argentina|Latinoam|LATAM|MXN|CLP|COP\b/;
const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const src = (f) => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '').replace(/{%-?\s*schema\s*-?%}[\s\S]*?{%-?\s*endschema\s*-?%}/g, '');
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const buy = (html, u) => (u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/) || [''])[0];
const bar = (html) => (html.match(/<div\s+class="utility-bar g-bar[\s\S]*?<\/div>\s*<\/div>/) || [''])[0];
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  '2 + 1 de regalo Recibes 3 pulseras Perfecto para regalar 10,00 € por pulsera Ahorras 29,98 € 29,99 €',
  'Mejor precio por pulsera 3 + 2 de regalo Recibes 5 pulseras Para ti y para compartir 8,00 € por pulsera Ahorras 59,96 € 39,99 €'];

module.exports = async function (browser) {
  // 1 · Configuración: ajustes de envío con confirmación (desactivada por defecto), barra GARELON, campaña, España
  const schema = json('config/settings_schema.json'); const S = {}; schema.forEach(g => (g.settings || []).forEach(s => { if (s.id) S[s.id] = s; }));
  ok('U1 ajustes «GARELON · Envío a España»: confirmaciones de destinos y plazo desmarcadas por defecto; textos editables',
    S.garelon_ship_coverage_confirmed?.default === false && S.garelon_ship_eta_confirmed?.default === false && S.garelon_ship_bar_text?.default === BAR_ALL &&
    S.garelon_ship_eta_text?.default === ETA && S.garelon_ship_bar_text_limited && !('default' in S.garelon_ship_bar_text_limited), Object.keys(S).filter(k => /garelon_ship/.test(k)));
  const data = json('config/settings_data.json'); const cur = typeof data.current === 'string' ? data.presets[data.current] : data.current;
  ok('U2 settings_data no marca ninguna confirmación (las marca el propietario en el editor)', !Object.keys(cur).some(k => /^garelon_ship_/.test(k)));
  const hg = json('sections/header-group.json');
  ok('U3 cabecera: «GARELON Barra de envío» en lugar del anuncio de Dawn, con «Especial octubre · Mes del Rosario» como texto alternativo',
    hg.order.join() === 'barra-envio,header' && hg.sections['barra-envio'].type === 'garelon-announcement' && hg.sections['barra-envio'].settings.fallback_text === CAMPAIGN && !hg.sections['announcement-bar'], hg.order);
  const tp = json('templates/product.json'); const ti = json('templates/index.json');
  const offers = [ti.sections.compra.blocks.oferta.settings, tp.sections.main.blocks.oferta.settings];
  ok('U4 home y ficha: etiqueta de campaña «Especial octubre · Mes del Rosario»; distintivo en la 3.ª tarjeta; textos de las tarjetas',
    offers.every(o => o.show_promo === true && o.promo_text === CAMPAIGN && o.badge_pack === '3' && o.badge_text === 'Mejor precio por pulsera' && o.sub_1 === 'Ideal para ti' && o.sub_2 === 'Perfecto para regalar' && o.sub_3 === 'Para ti y para compartir'));
  const faq = [tp, ti].map(t => Object.values(t.sections).flatMap(s => Object.values(s.blocks || {})).find(b => b.settings && b.settings.question === '¿Qué incluye mi pedido?'));
  ok('U5 FAQ «¿Qué incluye mi pedido?» sin «1, 2 o 3 unidades» (cada opción dice cuántas pulseras recibes)', faq.every(b => b && !/1, 2 o 3/.test(b.settings.answer) && /cuántas recibes en total/.test(b.settings.answer)));
  const fg = json('sections/footer-group.json').sections.footer.settings; const hs = hg.sections.header.settings;
  ok('U6 España, único mercado: sin selector de país ni de idioma en la cabecera ni en el pie', fg.enable_country_selector === false && fg.enable_language_selector === false && hs.enable_country_selector === false && hs.enable_language_selector === false);

  // 2 · Barra de envío: nada de «toda España» ni plazo sin la confirmación del propietario
  await reset(); await setState('mode=regalo');
  for (const u of ['/', P, '/cart']) {
    const r = await get(u); const b = bar(r.html);
    ok(`U7 ${u} sin confirmar: la barra muestra solo la campaña, sin enlace; ni «toda España» ni el plazo en toda la página`,
      text(b).trim() === CAMPAIGN && !/g-bar__link/.test(b) && !/toda España|5–10 días/.test(text(r.html)), text(b));
  }
  await setState('ship=cov,eta');
  for (const u of ['/', P]) {
    const r = await get(u); const b = bar(r.html);
    ok(`U8 ${u} con destinos y plazo confirmados: «${BAR_ALL}» y debajo, destacado, «${ETA}», enlazando a la política de envíos`,
      /<a href="\/policies\/shipping-policy" class="g-bar__link/.test(b) && b.includes(`<p class="g-bar__line">${BAR_ALL}</p>`) && b.includes(`<p class="g-bar__eta">${ETA}</p>`) && !text(b).includes(CAMPAIGN), text(b));
    const s = buy(r.html, u); const tax = (s.match(/<p class="g-offer__tax">[\s\S]*?<\/p>/) || [''])[0];
    ok(`U9 ${u}: bajo los packs, «Impuestos incluidos. Envío gratis.» y el plazo en línea aparte`, /Impuestos incluidos\. Envío gratis\./.test(text(tax)) && tax.includes(`<span class="g-eta">${ETA}</span>`), text(tax));
  }
  await addToCart(4102);
  {
    const r = await get('/cart'); const d = (r.html.match(/<cart-drawer[\s\S]*?<\/cart-drawer>/) || [''])[0]; const f = (r.html.match(/id="main-cart-footer"[\s\S]*$/) || [''])[0];
    ok('U10 /cart y cajón: el plazo confirmado aparece junto a «Envío gratis.»', [d, f].every(h => /Envío gratis\./.test(text(h)) && h.includes(`<span class="g-eta">${ETA}</span>`)));
  }
  await setState('ship=lim');
  { const r = await get(P); const b = bar(r.html); ok('U11 solo algunos destinos confirmados: el texto del propietario, sin «toda España» ni plazo', text(b).trim() === LIMITED && !/toda España|5–10/.test(text(r.html)), text(b)); }
  await setState('ship=eta');
  { const r = await get(P); const b = bar(r.html); ok('U12 solo el plazo confirmado: la barra muestra solo el plazo (sin texto de envío ni campaña)', text(b).trim() === ETA && !/toda España/.test(text(r.html)), text(b)); }
  await setState('ship=cov,eta&freeship=0');
  {
    const r = await get(P); const b = bar(r.html);
    ok('U13 «Envío gratis» desactivado: aunque haya confirmación, la barra no promete envío gratis (solo el plazo)', text(b).trim() === ETA && !/Envío gratis/.test(text(b)), text(b));
  }
  await setState('ship=cov&freeship=1');
  { const r = await get(P); ok('U14 destinos confirmados sin plazo: una sola línea y ningún plazo en la página', text(bar(r.html)).trim() === BAR_ALL && !/5–10 días/.test(text(r.html))); }
  await setState('design=1&ship=');
  { const r = await get(P); ok('U15 editor sin confirmar: la barra sigue mostrando la campaña (sin aviso que tape la página)', text(bar(r.html)).trim() === CAMPAIGN && !/g-bar__editor/.test(r.html)); }
  await setState('design=0');

  // 3 · Packs con regalo: título, unidades reales, precio por pulsera y ahorro calculados desde Shopify
  await reset(); await setState('mode=regalo');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const r = await get(u); const s = buy(r.html, u); const c = cards(s);
    ok(`U16 ${n}: tarjetas «2 + 1 de regalo · Recibes 3 pulseras» y «3 + 2 de regalo · Recibes 5 pulseras» con el precio por pulsera de las unidades reales`, JSON.stringify(c) === JSON.stringify(WANT), c);
    const vals = [...s.matchAll(/<input\s+type="radio"[^>]*value="([^"]*)"[^>]*>/g)].map(m => m[1]);
    ok(`U17 ${n}: cada radio lleva el valor exacto de la variante (Dawn la resuelve sin cambios)`, JSON.stringify(vals) === JSON.stringify(['1 pulsera', '2 + 1 de regalo (3 pulseras)', '3 + 2 de regalo (5 pulseras)']), vals);
    const radios = [...s.matchAll(/<input\s+type="radio"[^>]*>/g)].map(m => /\schecked/.test(m[0]));
    ok(`U18 ${n}: sin preselección del pack grande, un solo distintivo, sin precio tachado ni urgencia`, JSON.stringify(radios) === '[true,false,false]' && count(s, /class="g-offer__badge"/g) === 1 && !/g-offer__was/.test(s) && !/quedan|últimas|cuenta atrás|solo hoy/i.test(text(s)), radios);
    const iPromo = s.indexOf('class="g-offer__promo"');
    ok(`U19 ${n}: la etiqueta de campaña va encima de «Elige tu oferta», en una línea`, iPromo > 0 && iPromo < s.indexOf('g-offer__legend') && s.includes(`<p class="g-offer__promo">${CAMPAIGN}</p>`));
    ok(`U20 ${n}: nota de ahorro y CTA nativo «Añadir al carrito»`, /Ahorro calculado frente a comprar cada pulsera por separado\./.test(text(s)) && /<span>\s*Añadir al carrito\s*<\/span>/.test(s));
  }
  await setState('mode=regalocaro');
  {
    const r = await get(P); const c = cards(buy(r.html, P));
    ok('U21 si la 3.ª opción no tiene el precio por pulsera más bajo, «Mejor precio por pulsera» desaparece (no se afirma)', !c.some(x => /Mejor precio/.test(x)) && /Recibes 5 pulseras.*11,00 € por pulsera/.test(c[2]), c);
  }
  await setState('mode=real');
  { const r = await get(P); const c = cards(buy(r.html, P)); ok('U22 con los nombres antiguos («2 pulseras», «3 pulseras») todo sigue igual que en la ronda T', c[1] === '2 pulseras Perfecto para regalar 15,00 € por pulsera Ahorras 9,99 € 29,99 €' && !c.some(x => /Recibes/.test(x)), c); }
  await setState('mode=regalo&soldout=4103');
  {
    const r = await get(P); const s = buy(r.html, P); const lab = [...s.matchAll(/<label[^>]*class="g-offer__card[^"]*"[\s\S]*?<\/label>/g)].map(m => m[0]);
    ok('U23 opción agotada: tarjeta marcada «Agotado», radio deshabilitado visualmente y sin preselección', /g-offer__card--soldout/.test(lab[2]) && /Agotado/.test(text(lab[2])) && (() => { const ins = [...s.matchAll(/<input\s+type="radio"[^>]*>/g)].map(m => m[0]); return /class="g-offer__input disabled"/.test(ins[2]) && !/\schecked/.test(ins[2]) && /class="g-offer__input"/.test(ins[0]); })() && !/g-offer__card--soldout/.test(lab[0]));
  }
  const theme = ['snippets/garelon-offer.liquid', 'snippets/garelon-cart-option.liquid', 'snippets/garelon-pack-prices.liquid', 'snippets/garelon-pack-units.liquid', 'sections/garelon-announcement.liquid', 'snippets/garelon-shipping-note.liquid'].map(src).join('\n')
    + JSON.stringify([tp, ti, hg]);
  ok('U24 el tema no escribe precios, cantidades ni «regalo» (salen de la variante de Shopify; desde V, en garelon-pack-units)', !/19,99|29,99|39,99|\b[35] pulseras\b|de regalo/.test(theme) && /split: '\(' \| last/.test(theme));

  // 4 · Carrito y cajón: cantidad real recibida, cantidad 1 por pack
  await reset(); await setState('mode=regalo');
  for (const id of [4101, 4102, 4103]) await addToCart(id);
  {
    const r = await get('/cart'); const m = (r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]; const d = (r.html.match(/<cart-drawer[\s\S]*?<\/cart-drawer>/) || [''])[0];
    for (const [n, h] of [['/cart', m], ['cajón', d]]) {
      const lines = [...h.matchAll(/<div class="product-option g-cart-pack">[\s\S]*?<dd>([\s\S]*?)<\/dd>/g)].map(x => text(x[1]).trim());
      ok(`U25 ${n}: «Incluye 1 pulsera» / «Recibes 3 pulseras (2 + 1 de regalo)» / «Recibes 5 pulseras (3 + 2 de regalo)»`, JSON.stringify(lines) === JSON.stringify(['Incluye 1 pulsera', 'Recibes 3 pulseras (2 + 1 de regalo)', 'Recibes 5 pulseras (3 + 2 de regalo)']), lines);
    }
    const st = await (await fetch(B + '/__state')).json();
    ok('U26 cada pack entra en el carrito como una línea de cantidad 1 (la variante, no 3 ni 5 unidades)', JSON.stringify(st.cart) === '[{"id":4101,"quantity":1},{"id":4102,"quantity":1},{"id":4103,"quantity":1}]', st.cart);
  }
  await reset(); await setState('mode=regalo');
  {
    const { page, errs } = await openPage(browser, P, { width: 390, height: 844 });
    await page.focus('main .g-offer__input'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(700); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(900);
    const k = await page.evaluate(() => ({ id: document.querySelector('main form[id^="product-form-"] input[name="id"]').value, url: location.search }));
    ok('U27 teclado: flechas → 3.ª opción, id 4103 y ?variant=4103', k.id === '4103' && /variant=4103/.test(k.url), k);
    await page.click('main .product-form__submit'); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok('U28 navegador: 3.ª opción → cajón con «Recibes 5 pulseras (3 + 2 de regalo)», 39,99 €, cantidad 1, sin errores', /Recibes 5 pulseras \(3 \+ 2 de regalo\)/.test(d) && /39,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, d.slice(0, 220));
    await page.close();
  }

  // 5 · Solo España: aunque Shopify ofreciera varios mercados, la tienda no los anuncia
  await reset(); await setState('mode=regalo&countries=multi');
  for (const u of ['/', P, '/cart']) {
    const r = await get(u);
    ok(`U29 ${u} con varios mercados en Shopify: sin selector de país y sin países o monedas de Latinoamérica en la página`, !/form_type" value="localization"|FooterCountryForm|HeaderCountryForm/.test(r.html) && !LATAM.test(text(r.html)));
  }
  await reset();

  // 6 · Móvil y escritorio: barra en dos líneas, contador de galería, sin scroll horizontal
  await setState('mode=regalo&ship=cov,eta');
  for (const [n, u, root] of [['ficha', P, 'main'], ['home', '/', '#comprar']]) {
    for (const w of VPS) {
      const { page, errs } = await openPage(browser, u, { width: w, height: 844 });
      const m = await page.evaluate((root) => {
        const R = document.querySelector(root); const g = document.querySelector('.g-bar'); const a = g && g.querySelector('.g-bar__link'); const e = g && g.querySelector('.g-bar__eta');
        const cnt = [...R.querySelectorAll('.g-gallery__slide')].map(s => { const c = s.querySelector('.g-gallery__count'); return (s.querySelector('img[src*="infografia"]') ? 'i:' : '') + (c ? (getComputedStyle(c).display === 'none' ? 'oculto' : c.textContent.trim()) : '-'); });
        return { hscroll: document.documentElement.scrollWidth > innerWidth, bar: g && Math.round(g.getBoundingClientRect().height), link: a && Math.round(a.getBoundingClientRect().height),
          eta: e && { r: Math.round(e.getBoundingClientRect().right), l: Math.round(e.getBoundingClientRect().left), h: Math.round(e.getBoundingClientRect().height) }, cnt,
          legend: Math.round(R.querySelector('.g-offer__legend').getBoundingClientRect().top + scrollY), promo: Math.round(R.querySelector('.g-offer__promo').getBoundingClientRect().height) };
      }, root);
      ok(`U30 ${n} ${w}px: sin scroll horizontal ni errores; barra en dos líneas (≤ 80 px), enlace ≥ 44 px y plazo dentro de la pantalla`, !m.hscroll && errs.length === 0 && m.bar <= 80 && m.link >= 44 && m.eta && m.eta.l >= 0 && m.eta.r <= w && m.eta.h <= 26, m);
      ok(`U31 ${n} ${w}px: etiqueta de campaña en una sola línea`, m.promo <= 34, m.promo);
      if (w < 750) ok(`U32 ${n} ${w}px: contador «n / 5» en cada foto y ninguno en la infografía`, m.cnt.length === 5 && m.cnt.every((x, i) => x === (x.startsWith('i:') ? 'i:-' : `${i + 1} / 5`)) && m.cnt.includes('i:-'), m.cnt);
      else ok(`U32 ${n} ${w}px: contador oculto en la rejilla de escritorio`, m.cnt.every(x => /^(i:)?(oculto|-)$/.test(x)), m.cnt);
      if (n === 'ficha' && w < 750) ok(`U33 ficha ${w}px: «Elige tu oferta» sigue en la primera pantalla (< 844 px) con la barra en dos líneas`, m.legend < 844, m.legend);
      await page.close();
    }
  }
  await reset();

  // 7 · Alcance: Judge.me, imágenes, layout y settings_data intactos; locales solo con las claves nuevas
  if (REPO) {
    const at = (f) => JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString());
    ok('U34 Judge.me: la sección «GARELON Opiniones» es idéntica en home y ficha', ['templates/index.json', 'templates/product.json'].every((f, i) => JSON.stringify(at(f).sections.opiniones) === JSON.stringify([ti, tp][i].sections.opiniones)));
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    const allowed = /^(assets\/garelon\.css|config\/settings_schema\.json|locales\/[\w.-]+\.json|sections\/(featured-product|main-product|garelon-announcement)\.liquid|sections\/(header|footer)-group\.json|snippets\/(garelon-offer|garelon-cart-option|garelon-pack-prices|garelon-shipping-note|garelon-gallery|garelon-trust)\.liquid|templates\/(index|product)\.json)$/;
    ok('U35 alcance: packs, barra de envío, nota de envío, galería, cabecera/pie, plantillas, CSS, locales y el esquema de ajustes', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    ok('U36 sin cambios en imágenes, WebP, layout ni settings_data (App Embeds y valores del propietario)', !changed.some(f => /\.(webp|png|jpe?g|svg)$|^layout\/|settings_data/.test(f)));
    const loc = execSync(`git -C ${THEME} diff ${BASE} ${ROUND_HEAD} -- locales`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    ok('U37 locales: solo se añaden garelon.offer.receives, garelon.cart.pack_receives y garelon.shipping', loc.every(l => /^\+\s+("receives"|"pack_receives"|"shipping": \{|"editor_bar_hidden"|\},?$)|^[-+]\s+"(pack_includes_one|free_shipping|editor_missing)"/.test(l)), loc.filter(l => !/^\+\s+("receives"|"pack_receives"|"shipping": \{|"editor_bar_hidden"|\},?$)|^[-+]\s+"(pack_includes_one|free_shipping|editor_missing)"/.test(l)).slice(0, 4));
    const imgSrc = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- "NUEVA IMAGEN 1.png" "NUEVA IMAGEN 3.png" "imagen 2.png" "imagen 4.png"`).toString().trim();
    ok('U38 imágenes fuente intactas (incluida «NUEVA IMAGEN 1.png»)', imgSrc === '', imgSrc);
  }
};
