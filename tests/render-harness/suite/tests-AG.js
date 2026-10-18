// SOLO TEST · Fase AG: etiqueta del pack de 2 «Para ti y para regalar» (propietario, 2026-10-18, D50).
// Sustituye a «Recomendado» (el propietario quería «Más popular», pero no hay datos de ventas que lo acrediten, R9).
// Subtítulo de la 2.ª tarjeta «Una para ti y otra para quien quieras» para no repetir la etiqueta. Precios SIMULADOS (mode=d49).
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '0b8df4c'; // commit del tema antes de la ronda AG
const ROUND_HEAD = 'e598934'; // Ronda AH: commit del tema de la ronda AG (alcance fijado a AG)
const REPO = fs.existsSync(THEME + '/.git');
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cardsRaw = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => m[0]);
const cards = (html) => cardsRaw(html).map(c => text(c).trim());
const NOTE = 'Ahorro frente a comprar por separado las mismas unidades, a 19,99 € cada pulsera. No es una rebaja sobre un precio anterior.';
const note = (html) => text((html.match(/<p class="g-offer__note">[\s\S]*?<\/p>/) || [''])[0]).trim();
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras 15,00 € por pulsera Ahorras 9,99 € (25 %) 29,99 €',
  'Mayor ahorro 3 pulseras Para ti y para compartir 11,66 € por pulsera Ahorras 24,98 € (42 %) 34,99 €'];

module.exports = async function (browser) {
  await reset(); await setState('mode=d49');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const html = (await get(u)).html; const s = offer(buy(html, u));
    ok(`AG1 ${n}: «1 pulsera» · «Para ti y para regalar 2 pulseras» con su subtítulo, 15,00 €/u, ahorra 9,99 € (25 %) · «Mayor ahorro 3 pulseras»`, JSON.stringify(cards(s)) === JSON.stringify(WANT) && note(s) === NOTE, [cards(s), note(s)]);
    const badges = cardsRaw(s).map(c => (c.match(/<span class="(g-offer__badge[^"]*)">([^<]*)</) || []).slice(1).join('|'));
    ok(`AG2 ${n}: pack de 1 sin distintivo; «Para ti y para regalar» destacado en el de 2; «Mayor ahorro» suave en el de 3`, JSON.stringify(badges) === JSON.stringify(['', 'g-offer__badge|Para ti y para regalar', 'g-offer__badge g-offer__badge--soft|Mayor ahorro']), badges);
    ok(`AG3 ${n}: ni «Recomendado» ni «Más popular» / «más vendido» en la página`, !/Recomendado|[Mm]ás popular|[Mm]ás vendid/.test(text(html)));
  }
  for (const [mode, want] of [
    ['pack3save', ['1 pulsera Ideal para ti 19,99 €', 'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras 17,50 € por pulsera Ahorras 4,99 € (12 %) 34,99 €', 'Mayor ahorro 3 pulseras Para ti y para compartir 16,00 € por pulsera Ahorras 11,98 € (20 %) 47,99 €']],
    ['nosave', ['1 pulsera Ideal para ti 19,99 €', 'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras 39,98 €', '3 pulseras Para ti y para compartir 59,97 €']],
  ]) {
    await reset(); await setState(`mode=${mode}`); const s = offer(buy((await get(P)).html, P));
    ok(`AG4 ${mode}: la etiqueta editorial del pack de 2 se mantiene con cualquier precio; ahorro y «Mayor ahorro» siguen saliendo de Shopify`, JSON.stringify(cards(s)) === JSON.stringify(want), cards(s));
  }
  for (const [u, w, h] of [['/', 320, 568], ['/', 390, 844], [P, 390, 844], [P, 1024, 768], ['/', 1440, 900], [P, 1440, 900]]) {
    await reset(); await setState('mode=d49');
    const { page, errs } = await openPage(browser, u, { width: w, height: h });
    const m = await page.evaluate(() => {
      const list = document.querySelector('variant-selects.g-offer .g-offer__list');
      const over = [...list.querySelectorAll('.g-offer__card, .g-offer__card *')].some(e => e.scrollWidth > e.clientWidth + 1);
      const badges = [...list.querySelectorAll('.g-offer__badge')].map(b => { const r = b.getBoundingClientRect(); const c = b.closest('.g-offer__card').getBoundingClientRect(); return [b.innerText.trim(), r.right <= c.right + 0.5 && r.left >= c.left - 0.5, Math.round(r.height)]; });
      return { over, badges, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    ok(`AG5 ${u === '/' ? 'home' : 'ficha'} ${w}px: «PARA TI Y PARA REGALAR» en una línea dentro de su tarjeta, sin desbordes ni scroll horizontal`,
      !m.over && m.sw <= m.cw && m.badges.length === 2 && m.badges[0][0] === 'PARA TI Y PARA REGALAR' && m.badges[0][1] && m.badges.every(b => b[2] < 28) && m.badges[1][1] && errs.length === 0, { ...m, errs });
    await page.close();
  }
  await reset();
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const o = JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8')).sections[f.includes('index') ? 'compra' : 'main'].blocks.oferta.settings;
    ok(`AG6 ${f}: «Para ti y para regalar» en la 2.ª, subtítulo «Una para ti y otra para quien quieras»; el resto de la oferta como en D49`,
      o.packs_visible === 'all' && o.badge_pack === '2' && o.badge_text === 'Para ti y para regalar' && o.sub_2 === 'Una para ti y otra para quien quieras' && o.sub_1 === 'Ideal para ti' && o.sub_3 === 'Para ti y para compartir' && o.badge2_pack === '3' && o.badge2_text === 'Mayor ahorro' && o.show_promo === true, o);
  }
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
    const tpl = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- templates`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AG7 alcance: solo cambian en las dos plantillas el texto del distintivo y el subtítulo de la 2.ª tarjeta', JSON.stringify(changed) === JSON.stringify(['templates/index.json', 'templates/product.json']) && tpl.length === 8 && tpl.every(l => /^[+-]\s*"(badge_text|sub_2)"/.test(l)), [changed, tpl]);
  }
};
