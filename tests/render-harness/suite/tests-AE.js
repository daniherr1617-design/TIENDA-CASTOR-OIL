// SOLO TEST · Fase AE: solo dos ofertas (propietario, 2026-10-16, D48).
// «1 pulsera» y «2 pulseras + 1 GRATIS» (la variante «2 pulseras y 1 de regalo», 3 pulseras) con «Recomendado»,
// precio por pulsera, ahorro frente a comprar por separado TODAS las pulseras que se reciben y su porcentaje.
// La 3.ª variante («3 pulseras y 2 de regalo», 34,99 €) sigue en Shopify, pero el selector no la pinta.
// Precios SIMULADOS (mode=live = nombres y precios publicados en Shopify el 2026-10-16); el tema no los escribe.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '7bb0856'; // HEAD antes de la ronda AE
const ROUND_HEAD = '5a1a3e6'; // Ronda AF: commit del tema de la ronda AE (alcance fijado a AE, como en T…AD)
const REPO = fs.existsSync(THEME + '/.git');
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const note = (html) => text((html.match(/<p class="g-offer__note">[\s\S]*?<\/p>/) || [''])[0]).trim();
const log = async () => (await (await fetch(B + '/__state')).json()).log;
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Recomendado 2 pulseras + 1 GRATIS Recibes 3 pulseras Perfecto para regalar 10,00 € por pulsera Ahorras 29,98 € (50 %) 29,99 €'];
const NOTE = 'Ahorro calculado frente a comprar por separado, a 19,99 € cada una, todas las unidades que recibes, también la de regalo.';

module.exports = async function (browser) {
  // 1 · Dos tarjetas con los datos de las variantes reales; nada de la 3.ª oferta
  await reset(); await setState('mode=live');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const s = offer(buy((await get(u)).html, u));
    ok(`AE1 ${n}: solo «1 pulsera» 19,99 € y «Recomendado · 2 pulseras + 1 GRATIS · Recibes 3 · 10,00 € por pulsera · Ahorras 29,98 € (50 %)» 29,99 €`, JSON.stringify(cards(s)) === JSON.stringify(WANT), cards(s));
    const vals = [...s.matchAll(/<input[^>]*class="g-offer__input[^"]*"[^>]*>/g)].map(x => (x[0].match(/value="([^"]+)"/) || [])[1]);
    ok(`AE2 ${n}: dos radios con el valor exacto de su variante (1 pulsera / 2 pulseras y 1 de regalo), ninguno de la 3.ª`, JSON.stringify(vals) === JSON.stringify(['1 pulsera', '2 pulseras y 1 de regalo']), vals);
    ok(`AE3 ${n}: sin textos, distintivos ni precios de la 3.ª oferta (34,99 · 3 pulseras y 2 de regalo · Recibes 5 · 7,00 € · Mejor precio · Para ti y para compartir)`,
      !/34,99|3 pulseras y 2 de regalo|Recibes 5|7,00 €|Mejor precio|Para ti y para compartir|24,98/.test(text(s)));
    ok(`AE4 ${n}: la nota explica la base real (19,99 € por pulsera, todas las que se reciben)`, note(s) === NOTE, note(s));
  }

  // 2 · El ahorro y el porcentaje salen de los precios; sin ahorro real no hay ni ahorro ni porcentaje
  for (const [mode, want] of [
    ['pack3save', ['1 pulsera Ideal para ti 19,99 €', 'Recomendado 2 pulseras Perfecto para regalar 17,50 € por pulsera Ahorras 4,99 € (12 %) 34,99 €']],
    ['nosave', ['1 pulsera Ideal para ti 19,99 €', 'Recomendado 2 pulseras Perfecto para regalar 39,98 €']],
  ]) {
    await setState(`mode=${mode}`); const s = offer(buy((await get(P)).html, P));
    ok(`AE5 ${mode}: ahorro y porcentaje calculados con los precios simulados (o ninguno si no hay ahorro); el nombre «2 pulseras + 1 GRATIS» no se usa si la variante no da 3 pulseras`, JSON.stringify(cards(s)) === JSON.stringify(want), cards(s));
  }

  // 3 · Navegador: dos tarjetas visibles, sin hueco tras la 2.ª, cada una compra o añade su variante
  for (const [u, w, h] of [['/', 320, 568], ['/', 390, 844], [P, 390, 844], ['/', 1440, 900], [P, 1440, 900], [P, 1024, 768]]) {
    await reset(); await setState('mode=live');
    const { page, errs } = await openPage(browser, u, { width: w, height: h });
    const m = await page.evaluate(() => {
      const vs = document.querySelector('variant-selects.g-offer'); const list = vs.querySelector('.g-offer__list');
      const vis = [...list.querySelectorAll('.g-offer__card')].filter(c => c.offsetParent !== null);
      const last = list.lastElementChild.getBoundingClientRect(); const lr = list.getBoundingClientRect();
      return { n: vis.length, gap: Math.round(lr.bottom - last.bottom), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    ok(`AE6 ${u === '/' ? 'home' : 'ficha'} ${w}px: dos tarjetas visibles, sin espacio vacío tras la 2.ª ni scroll horizontal`, m.n === 2 && m.gap === 0 && m.sw <= m.cw && errs.length === 0, { ...m, errs });
    await page.close();
  }
  // Desde la ronda AF (D49) la tarjeta «2 pulseras + 1 GRATIS» ya no existe: AE7 y AE8 (sustituidas por AF8 y AF9) no se ejecutan.
  if (!T.at('AF')) for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    for (const [label, id, price] of [['1 pulsera', 4101, '19,99'], ['2 pulseras + 1 GRATIS', 4102, '29,99']]) {
      await reset(); await setState('mode=live');
      const { page, errs } = await openPage(browser, u, { width: 390, height: 844 });
      await page.click(`.g-offer__card:has-text("${label}")`); await page.waitForTimeout(900);
      const btn = await page.evaluate(() => document.querySelector('[data-garelon-buy-now]').textContent.replace(/\s+/g, ' ').trim());
      await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
      const lines = await page.$$eval('#lines li', (li) => li.map((l) => [Number(l.dataset.variant), Number(l.dataset.qty)])).catch(() => []);
      const last = (await log()).pop() || {};
      ok(`AE7 ${name} 390px «${label}»: «Comprar ahora · ${price} €» → pago con ${id} × 1`,
        btn.includes(`${price} €`) && JSON.stringify(last.update) === JSON.stringify({ [id]: 1 }) && /\/checkout$/.test(page.url()) && JSON.stringify(lines) === JSON.stringify([[id, 1]]) && errs.length === 0, { btn, last, url: page.url(), lines, errs });
      await page.close();
    }
  }
  if (!T.at('AF')) for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    await reset(); await setState('mode=live');
    const { page, errs } = await openPage(browser, u, { width: 1440, height: 900 });
    await page.click('.g-offer__card:has-text("1 pulsera")'); await page.waitForTimeout(700);
    await page.click('.g-offer__card:has-text("2 pulseras + 1 GRATIS")'); await page.waitForTimeout(900);
    const root = u === '/' ? '#comprar' : 'main';
    await page.click(`${root} .product-form__submit`); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok(`AE8 ${name} 1440px: cambiar de oferta y «Añadir al carrito» → cajón con «Recibes 3 pulseras (2 pulseras y 1 de regalo)», 29,99 €, 4102 × 1`,
      /Recibes 3 pulseras \(2 pulseras y 1 de regalo\)/.test(d) && /29,99/.test(d) && JSON.stringify(s.cart) === '[{"id":4102,"quantity":1}]' && errs.length === 0, [d.slice(0, 160), s.cart, errs]);
    await page.close();
  }
  {
    await reset(); await setState('mode=live'); await addToCart(4101); await addToCart(4102);
    const r = await get('/cart'); const t = text((r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]);
    ok('AE9 /cart: «Incluye 1 pulsera» y «Recibes 3 pulseras (2 pulseras y 1 de regalo)», total 49,98 €', /Incluye 1 pulsera/.test(t) && /Recibes 3 pulseras \(2 pulseras y 1 de regalo\)/.test(t) && /49,98/.test(text(r.html)), t.slice(0, 200));
  }

  // 3b · La lógica D48 también con 3 variantes visibles (ajustes de la v1.25, offer=v125), en lugar de las pruebas D41 sustituidas
  const saves = (s) => [...s.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(x => text((x[0].match(/<span class="g-offer__save">[\s\S]*?<\/span>/) || [''])[0]).trim());
  for (const [mode, want, gift] of [
    ['live', ['', 'Ahorras 29,98 € (50 %)', 'Ahorras 64,96 € (65 %)'], true],
    ['final', ['', 'Ahorras 29,98 € (50 %)', 'Ahorras 64,96 € (65 %)'], true],
    ['regalo', ['', 'Ahorras 29,98 € (50 %)', 'Ahorras 59,96 € (60 %)'], true],
    ['real', ['', 'Ahorras 9,99 € (25 %)', 'Ahorras 24,98 € (42 %)'], false],
    ['pack3save', ['', 'Ahorras 4,99 € (12 %)', 'Ahorras 11,98 € (20 %)'], false],
  ]) {
    await reset(); await setState(`offer=v125&mode=${mode}`); const s = offer(buy((await get(P)).html, P));
    ok(`AE15 offer=v125 mode=${mode}: ahorro frente a todas las pulseras que se reciben, con porcentaje (${want.slice(1).join(' / ')}), y su nota`,
      JSON.stringify(saves(s)) === JSON.stringify(want) && note(s) === (gift ? NOTE : 'Ahorro calculado frente a comprar cada pulsera por separado.'), [saves(s), note(s)]);
  }
  for (const w of [320, 390, 1440]) {
    await reset(); await setState('offer=v125&mode=live');
    const { page, errs } = await openPage(browser, P, { width: w, height: 844 });
    const m = await page.evaluate(() => ({ hs: document.documentElement.scrollWidth > document.documentElement.clientWidth, over: [...document.querySelectorAll('.g-offer__card, .g-offer__card *')].some(e => e.scrollWidth > e.clientWidth + 1) }));
    ok(`AE16 offer=v125 ${w}px: con 3 tarjetas y porcentajes, sin scroll horizontal ni desbordes`, !m.hs && !m.over && errs.length === 0, { ...m, errs });
    await page.close();
  }
  await reset(); await setState('mode=live');
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const j = JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8')); const o = j.sections[f.includes('index') ? 'compra' : 'main'].blocks.oferta.settings;
    ok(`AE17 ${f}: 2 ofertas, «2 pulseras + 1 GRATIS», «Recomendado» en la 2.ª (sin datos de ventas que respalden «Más popular») y la campaña y los subtítulos de antes`,
      o.packs_visible === '2' && o.title_2 === '2 pulseras + 1 GRATIS' && !o.title_1 && o.badge_pack === '2' && o.badge_text === 'Recomendado' && o.show_promo === true && o.promo_text === 'Especial octubre · Mes del Rosario' && o.sub_1 === 'Ideal para ti' && o.sub_2 === 'Perfecto para regalar', o);
  }

  // 4 · Nada comercial escrito en el tema y alcance limitado al selector de ofertas
  const src = ['snippets/garelon-offer.liquid', 'templates/index.json', 'templates/product.json'].map(f => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')).join('\n');
  ok('AE10 sin precios, ahorros ni porcentajes escritos en el tema (19,99 / 29,99 / 29,98 / 10,00 / 50 %)', !/19[,.]99|29[,.]99|29[,.]98|10[,.]00|50 ?%/.test(src));
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
    const bad = changed.filter(f => !/^(locales\/[\w-]+(\.default)?\.json|sections\/(featured-product|main-product)\.liquid|snippets\/garelon-offer\.liquid|templates\/(index|product)\.json)$/.test(f));
    ok('AE11 alcance: solo el selector de ofertas, su esquema en las dos secciones, sus textos y las dos plantillas (sin CSS, JS, carrito, cabecera, pie, opiniones, envío ni FAQ)', bad.length === 0, bad);
    const diff = (p) => execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- ${p}`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    const tpl = diff('templates');
    ok('AE12 plantillas: solo «Tarjetas visibles», el nombre de la 2.ª tarjeta y el distintivo «Recomendado» en la 2.ª', tpl.every(l => /^[+-]\s*"(packs_visible|title_2|badge_pack|badge_text)"/.test(l)), tpl);
    const loc = diff('locales');
    ok('AE13 locales: solo el ahorro con porcentaje y la nota del ahorro', loc.every(l => /"save_percent"|"saving_note_gift"/.test(l)), loc.slice(0, 4));
    const sec = diff('sections');
    ok('AE14 secciones: solo se añaden ajustes al esquema de «GARELON Elige tu oferta» (nada se quita)', sec.every(l => l.startsWith('+')) && /"packs_visible"/.test(sec.join('\n')), sec.filter(l => !l.startsWith('+')));
  }
};
