// SOLO TEST · Fase AF: tres ofertas definitivas sin regalos (propietario, 2026-10-17, D49).
// «1 pulsera», «2 pulseras» con «Recomendado» (destacado) y «3 pulseras» con «Mayor ahorro» (tono suave); precio por
// pulsera y ahorro frente a comprar esas mismas pulseras por separado, con su porcentaje. Sin «GRATIS», «de regalo» ni «2 + 1».
// Precios SIMULADOS (mode=d49 = los que el propietario pide: 19,99 / 29,99 / 34,99 €); el tema no los escribe.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '2edaeff'; // HEAD antes de la ronda AF
const REPO = fs.existsSync(THEME + '/.git');
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cardsRaw = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => m[0]);
const cards = (html) => cardsRaw(html).map(c => text(c).trim());
const note = (html) => text((html.match(/<p class="g-offer__note">[\s\S]*?<\/p>/) || [''])[0]).trim();
const log = async () => (await (await fetch(B + '/__state')).json()).log;
const addToCart = async (id) => { const fd = new FormData(); fd.append('id', String(id)); fd.append('quantity', '1'); await fetch(B + '/cart/add.js', { method: 'POST', body: fd }); };
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Recomendado 2 pulseras Perfecto para regalar 15,00 € por pulsera Ahorras 9,99 € (25 %) 29,99 €',
  'Mayor ahorro 3 pulseras Para ti y para compartir 11,66 € por pulsera Ahorras 24,98 € (42 %) 34,99 €'];
const NOTE = 'Ahorro frente a comprar por separado las mismas unidades, a 19,99 € cada pulsera. No es una rebaja sobre un precio anterior.';
// «Envío gratis» es el envío (D26), no un regalo: se busca «GRATIS» en mayúsculas y «N gratis».
const GIFT = /GRATIS|\d gratis|de regalo|\b[23] ?\+ ?[12]\b|[Mm]ás popular|Recibes \d/;

module.exports = async function (browser) {
  // 1 · Tres tarjetas con los datos de las variantes reales, sin regalos
  await reset(); await setState('mode=d49');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const html = (await get(u)).html; const s = offer(buy(html, u));
    ok(`AF1 ${n}: «1 pulsera» 19,99 € · «Recomendado 2 pulseras» 15,00 €/u, ahorra 9,99 € (25 %) · «Mayor ahorro 3 pulseras» 11,66 €/u, ahorra 24,98 € (42 %)`, JSON.stringify(cards(s)) === JSON.stringify(WANT), cards(s));
    const vals = [...s.matchAll(/<input[^>]*class="g-offer__input[^"]*"[^>]*>/g)].map(x => (x[0].match(/value="([^"]+)"/) || [])[1]);
    ok(`AF2 ${n}: tres radios con el valor exacto de su variante de Shopify`, JSON.stringify(vals) === JSON.stringify(['1 pulsera', '2 pulseras', '3 pulseras']), vals);
    ok(`AF3 ${n}: ningún «GRATIS», «de regalo», «2 + 1», «3 + 1», «3 + 2», «Más popular» ni «Recibes N» en la página`, !GIFT.test(text(html)), (text(html).match(new RegExp('.{0,40}(' + GIFT.source + ').{0,40}')) || [])[0]);
    ok(`AF4 ${n}: la nota aclara la base del ahorro (las mismas pulseras sueltas, no un precio anterior)`, note(s) === NOTE, note(s));
    const badges = cardsRaw(s).map(c => (c.match(/<span class="(g-offer__badge[^"]*)">([^<]*)</) || []).slice(1).join('|'));
    ok(`AF5 ${n}: pack de 1 sin distintivo; «Recomendado» destacado en el de 2; «Mayor ahorro» suave en el de 3`, JSON.stringify(badges) === JSON.stringify(['', 'g-offer__badge|Recomendado', 'g-offer__badge g-offer__badge--soft|Mayor ahorro']), badges);
  }

  // 2 · Cálculos dinámicos: con otros precios cambian; sin ahorro real no hay ahorro, nota ni «Mayor ahorro»; con compare_at, el tachado real
  for (const [mode, want, wantNote] of [
    ['pack3save', ['1 pulsera Ideal para ti 19,99 €', 'Recomendado 2 pulseras Perfecto para regalar 17,50 € por pulsera Ahorras 4,99 € (12 %) 34,99 €', 'Mayor ahorro 3 pulseras Para ti y para compartir 16,00 € por pulsera Ahorras 11,98 € (20 %) 47,99 €'], true],
    ['nosave', ['1 pulsera Ideal para ti 19,99 €', 'Recomendado 2 pulseras Perfecto para regalar 39,98 €', '3 pulseras Para ti y para compartir 59,97 €'], false],
  ]) {
    await reset(); await setState(`mode=${mode}`); const s = offer(buy((await get(P)).html, P));
    ok(`AF6 ${mode}: precio por pulsera, ahorro y porcentaje salen de los precios de Shopify (o ninguno, ni «Mayor ahorro», si no hay ahorro)`, JSON.stringify(cards(s)) === JSON.stringify(want) && (note(s) !== '') === wantNote, [cards(s), note(s)]);
  }

  {
    await reset(); await setState('mode=compare'); const s = offer(buy((await get(P)).html, P)); const c = cards(s);
    ok('AF19 compare: con precio comparado real, su tachado y su ahorro; sin él, frente a las mismas pulseras sueltas (11,98 €, 20 %) con la nota nueva',
      /Ahorras 5,00 € \(20 %\) 19,99 € Precio habitual 24,99 €/.test(c[0]) && /^Recomendado 2 pulseras .*Ahorras 4,99 € \(12 %\) 34,99 € Precio habitual 39,98 €/.test(c[1]) && /^Mayor ahorro 3 pulseras .*16,00 € por pulsera Ahorras 11,98 € \(20 %\) 47,99 €$/.test(c[2]) && note(s) === NOTE, [c, note(s)]);
  }

  // 3 · Navegador: 3 tarjetas visibles en móvil y escritorio, sin desbordes; distintivos en mayúsculas
  for (const [u, w, h] of [['/', 320, 568], ['/', 390, 844], [P, 390, 844], [P, 1024, 768], ['/', 1440, 900], [P, 1440, 900]]) {
    await reset(); await setState('mode=d49');
    const { page, errs } = await openPage(browser, u, { width: w, height: h });
    const m = await page.evaluate(() => {
      const list = document.querySelector('variant-selects.g-offer .g-offer__list');
      const vis = [...list.querySelectorAll('.g-offer__card')].filter(c => c.offsetParent !== null);
      const over = [...list.querySelectorAll('.g-offer__card, .g-offer__card *')].some(e => e.scrollWidth > e.clientWidth + 1);
      const badges = [...list.querySelectorAll('.g-offer__badge')].map(b => { const r = b.getBoundingClientRect(); const c = b.closest('.g-offer__card').getBoundingClientRect(); return [b.innerText.trim(), r.right <= c.right + 0.5 && r.left >= c.left - 0.5]; });
      return { n: vis.length, over, badges, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    ok(`AF7 ${u === '/' ? 'home' : 'ficha'} ${w}px: 3 tarjetas visibles, «RECOMENDADO» y «MAYOR AHORRO» dentro de su tarjeta, sin desbordes ni scroll horizontal`,
      m.n === 3 && !m.over && m.sw <= m.cw && JSON.stringify(m.badges) === JSON.stringify([['RECOMENDADO', true], ['MAYOR AHORRO', true]]) && errs.length === 0, { ...m, errs });
    await page.close();
  }
  // «Comprar ahora» en móvil: cada oferta lleva al pago su variante × 1 (1, 2 o 3 pulseras, sin unidades añadidas)
  for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    for (const [label, id, price] of [['1 pulsera', 4101, '19,99'], ['2 pulseras', 4102, '29,99'], ['3 pulseras', 4103, '34,99']]) {
      await reset(); await setState('mode=d49');
      const { page, errs } = await openPage(browser, u, { width: 390, height: 844 });
      await page.click(`.g-offer__card:has(.g-offer__name:text-is("${label}"))`); await page.waitForTimeout(900);
      const btn = await page.evaluate(() => document.querySelector('[data-garelon-buy-now]').textContent.replace(/\s+/g, ' ').trim());
      await page.click('[data-garelon-buy-now]'); await page.waitForURL(/\/checkout$/, { timeout: 5000 }).catch(() => {});
      const lines = await page.$$eval('#lines li', (li) => li.map((l) => [Number(l.dataset.variant), Number(l.dataset.qty)])).catch(() => []);
      const last = (await log()).pop() || {};
      ok(`AF8 ${name} 390px «${label}»: «Comprar ahora · ${price} €» → pago con ${id} × 1`,
        btn.includes(`${price} €`) && JSON.stringify(last.update) === JSON.stringify({ [id]: 1 }) && /\/checkout$/.test(page.url()) && JSON.stringify(lines) === JSON.stringify([[id, 1]]) && errs.length === 0, { btn, last, url: page.url(), lines, errs });
      await page.close();
    }
  }
  // Escritorio: cambiar de oferta y «Añadir al carrito» → cajón con «Tu pack incluye 3 pulseras», 34,99 €, 4103 × 1
  for (const [name, u] of [['home', '/'], ['ficha', P]]) {
    await reset(); await setState('mode=d49');
    const { page, errs } = await openPage(browser, u, { width: 1440, height: 900 });
    await page.click('.g-offer__card:has(.g-offer__name:text-is("2 pulseras"))'); await page.waitForTimeout(700);
    await page.click('.g-offer__card:has(.g-offer__name:text-is("3 pulseras"))'); await page.waitForTimeout(900);
    const root = u === '/' ? '#comprar' : 'main';
    await page.click(`${root} .product-form__submit`); await page.waitForTimeout(1500);
    const d = await page.evaluate(() => { const c = document.querySelector('cart-drawer'); return c && c.classList.contains('active') ? c.innerText.replace(/\s+/g, ' ') : ''; });
    const s = await (await fetch(B + '/__state')).json();
    ok(`AF9 ${name} 1440px: «Añadir al carrito» con «3 pulseras» → cajón «Tu pack incluye 3 pulseras», 34,99 €, 4103 × 1`,
      /Tu pack incluye 3 pulseras/.test(d) && /34,99/.test(d) && !GIFT.test(d) && JSON.stringify(s.cart) === '[{"id":4103,"quantity":1}]' && errs.length === 0, [d.slice(0, 160), s.cart, errs]);
    await page.close();
  }
  {
    await reset(); await setState('mode=d49'); await addToCart(4101); await addToCart(4102); await addToCart(4103);
    const r = await get('/cart'); const t = text((r.html.match(/<cart-items[\s\S]*?<\/cart-items>/) || [''])[0]);
    ok('AF10 /cart: «Incluye 1 pulsera», «Tu pack incluye 2 pulseras» y «Tu pack incluye 3 pulseras», total 84,97 €, sin regalos', /Incluye 1 pulsera/.test(t) && /Tu pack incluye 2 pulseras/.test(t) && /Tu pack incluye 3 pulseras/.test(t) && /84,97/.test(text(r.html)) && !GIFT.test(t), t.slice(0, 240));
  }
  await reset();

  // 4 · Plantillas, textos y nada comercial escrito en el tema
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const j = JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8')); const sec = j.sections[f.includes('index') ? 'compra' : 'main']; const o = sec.blocks.oferta.settings;
    ok(`AF11 ${f}: 3 ofertas, sin nombres propios de tarjeta, «Recomendado» en la 2.ª y «Mayor ahorro» en la 3.ª; campaña y subtítulos de antes`,
      o.packs_visible === 'all' && !o.title_1 && !o.title_2 && !o.title_3 && o.badge_pack === '2' && o.badge_text === 'Recomendado' && o.badge2_pack === '3' && o.badge2_text === 'Mayor ahorro' && o.show_promo === true && o.promo_text === 'Especial octubre · Mes del Rosario' && o.sub_1 === 'Ideal para ti' && o.sub_2 === 'Perfecto para regalar' && o.sub_3 === 'Para ti y para compartir', o);
  }
  const src = ['snippets/garelon-offer.liquid', 'templates/index.json', 'templates/product.json', 'assets/garelon.css'].map(f => fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')).join('\n');
  ok('AF12 sin precios, ahorros ni porcentajes escritos en el tema (19,99 / 29,99 / 34,99 / 9,99 / 24,98 / 15,00 / 11,66 / 25 % / 42 %)', !/19[,.]99|29[,.]99|34[,.]99|\b9[,.]99|24[,.]98|15[,.]00|11[,.]66|\b(25|42) ?%/.test(src));
  const loc = JSON.parse(fs.readFileSync(`${THEME}/locales/es.json`, 'utf8')).garelon.offer;
  ok('AF13 textos de la oferta: sin nota de regalo; la nota compara con las mismas unidades sueltas', !('saving_note_gift' in loc) && /mismas unidades/.test(loc.saving_note) && /precio anterior/.test(loc.saving_note), loc.saving_note);
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .concat(execSync(`git -C ${THEME} ls-files --others --exclude-standard -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)).sort();
    const bad = changed.filter(f => !/^(assets\/garelon\.css|locales\/[\w-]+(\.default)?\.json|sections\/(featured-product|main-product)\.liquid|snippets\/garelon-offer\.liquid|templates\/(index|product)\.json)$/.test(f));
    ok('AF14 alcance: solo el selector de ofertas, su esquema, su CSS, sus textos y las dos plantillas (sin galería, imágenes, cabecera, pie, opiniones, envío, carrito, pago ni JS)', bad.length === 0, bad);
    const diff = (p) => execSync(`git -C ${THEME} diff -U0 ${BASE} -- ${p}`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    const tpl = diff('templates');
    ok('AF15 plantillas: solo «Tarjetas visibles», el nombre de la 2.ª tarjeta, el 2.º distintivo y la respuesta de la FAQ de ofertas', tpl.every(l => /^[+-]\s*"(packs_visible|title_2|badge2_pack|badge2_text)"/.test(l) || /^[+-]\s*"answer": "<p>Recibes todas las pulseras de la oferta que elijas, (también las de regalo, )?y todas son el mismo modelo/.test(l)), tpl);
    const css = diff('assets');
    ok('AF16 CSS: solo se añade el tono suave del 2.º distintivo', css.every(l => l.startsWith('+')) && /g-offer__badge--soft/.test(css.join('\n')), css);
    const lc = diff('locales');
    ok('AF17 locales: solo la nota del ahorro', lc.every(l => /"saving_note(_gift)?"/.test(l)), lc.slice(0, 4));
    const sec = diff('sections');
    ok('AF18 secciones: solo el esquema de «GARELON Elige tu oferta» (ayuda de las tarjetas y del distintivo, y el 2.º distintivo)', sec.every(l => l.startsWith('+') || /"content": "Las tarjetas siguen|"info": "Distintivo editorial/.test(l)), sec.filter(l => !l.startsWith('+')));
  }
};
