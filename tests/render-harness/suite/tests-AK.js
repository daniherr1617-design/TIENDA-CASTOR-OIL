// SOLO TEST · Fase AK: dos ajustes finales sobre la v1.31 (propietario, 2026-10-19, D54).
// 1) Fuera la etiqueta «Envío gratis + seguimiento» encima de «Elige tu oferta» (repetía la garantía de al lado):
//    `show_promo: false` en las dos plantillas; la garantía y el título se quedan, sin hueco.
// 2) El aviso bajo la galería pasa a «Estuche y elementos decorativos no incluidos.», mismo sitio y mismo estilo.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, count, text, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '219434d'; // commit del tema antes de la ronda AK
const ROUND_HEAD = '1699485'; // Ronda AL: commit del tema de la ronda AK (alcance fijado a AK)
const REPO = fs.existsSync(THEME + '/.git');
const NOTE = 'Estuche y elementos decorativos no incluidos.';
const SHIP = 'Envío gratis + seguimiento';
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras Ahorras 9,99 € (25 %) 29,99 €',
  'Mayor ahorro 3 pulseras Para ti y para compartir Ahorras 24,98 € (42 %) 34,99 €'];

module.exports = async function (browser) {
  // 1 · Render
  for (const mode of ['live', 'd49']) {
    await reset(); await setState(`mode=${mode}`);
    for (const [n, u] of [['home', '/'], ['ficha', P]]) {
      const html = (await get(u)).html; const b = buy(html, u); const SH = /Envío gratis(?:&nbsp;|\s)\+ seguimiento/g; // la garantía lleva &nbsp;
      ok(`AK1 ${mode} ${n}: sin etiqueta encima de las ofertas; «${SHIP}» una sola vez, en las garantías; «Elige tu oferta» sigue`,
        !/g-offer__promo/.test(b) && count(b, SH) === 1 && /g-trust--chips[\s\S]*Envío gratis(&nbsp;|\s)\+ seguimiento/.test(b) && /class="g-offer__legend[^"]*"[^>]*>\s*Elige tu oferta/i.test(b), count(b, SH));
      ok(`AK2 ${mode} ${n}: aviso bajo la galería con el texto exacto «${NOTE}», una sola vez`,
        count(b, /class="g-gallery__note"/g) === 1 && b.includes(`<p class="g-gallery__note">${NOTE}</p>`) && !/caja de joyería/.test(b));
      ok(`AK3 ${mode} ${n}: las 3 ofertas no cambian (precios, distintivos y ahorros)`, JSON.stringify(cards(offer(b))) === JSON.stringify(WANT), cards(offer(b)));
      ok(`AK4 ${mode} ${n}: la barra superior sigue con «${SHIP}»`, /<p class="g-bar__line">Envío gratis \+ seguimiento<\/p>/.test(html));
    }
  }
  // 2 · Navegador: sin hueco entre garantías y «Elige tu oferta»; aviso con el mismo estilo
  for (const [u, vp] of [['/', { width: 390, height: 844 }], ['/', { width: 1440, height: 900 }], [P, { width: 390, height: 844 }], [P, { width: 1440, height: 900 }], [P, { width: 320, height: 568 }]]) {
    await reset(); await setState('mode=live');
    const { page, errs } = await openPage(browser, u, vp);
    const m = await page.evaluate(() => {
      const root = document.querySelector('#comprar product-info') || document.querySelector('main product-info');
      const chips = root.querySelector('.g-trust--chips').getBoundingClientRect(); const lg = root.querySelector('.g-offer__legend').getBoundingClientRect();
      const note = document.querySelector('.g-gallery__note'); const ns = getComputedStyle(note);
      return { gap: Math.round(lg.top - chips.bottom), fs: parseFloat(ns.fontSize), color: ns.color, h: Math.round(note.getBoundingClientRect().height), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    const where = `${u === '/' ? 'home' : 'ficha'} ${vp.width}px`;
    ok(`AK5 ${where}: «Elige tu oferta» justo después de las garantías (0-40 px, sin hueco), sin scroll horizontal ni errores`, m.gap >= 0 && m.gap <= 40 && m.sw <= m.cw && errs.length === 0, { ...m, errs });
    ok(`AK6 ${where}: aviso con el estilo de la v1.31 (13 px, gris), en una o dos líneas`, m.fs === 13 && /rgba\(42, 38, 34, 0\.7\)/.test(m.color) && m.h <= 44, m);
    await page.close();
  }
  // 3 · Alcance: solo `show_promo` en las plantillas y `box_note` en los locales
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
;
    const lines = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AK7 alcance: solo «show_promo» en index/product y «box_note» en los locales (sin CSS, galería, packs ni secciones)',
      changed.every(f => /^(templates\/(index|product)\.json|locales\/[\w-]+(\.default)?\.json)$/.test(f)) && lines.every(l => /^[+-]\s*"(show_promo|box_note)"/.test(l)), [changed.filter(f => !/^(templates|locales)\//.test(f)), lines.filter(l => !/"(show_promo|box_note)"/.test(l)).slice(0, 4)]);
  }
};
