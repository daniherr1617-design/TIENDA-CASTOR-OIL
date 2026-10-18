// SOLO TEST · Fase AH: «Para ti y para regalar» y «Mayor ahorro» con el mismo color (propietario, 2026-10-18, D51).
// Se retira el tono suave del 2.º distintivo (g-offer__badge--soft); ambos usan el estilo destacado de siempre.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'e598934'; // commit del tema antes de la ronda AH
const ROUND_HEAD = 'acfbcb4'; // Ronda AI: commit del tema de la ronda AH (alcance fijado a AH)
const REPO = fs.existsSync(THEME + '/.git');
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];

module.exports = async function (browser) {
  await reset(); await setState('mode=d49');
  for (const [n, u] of [['home', '/'], ['ficha', P]]) {
    const s = offer(buy((await get(u)).html, u));
    const badges = [...s.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => (m[0].match(/<span class="(g-offer__badge[^"]*)">([^<]*)</) || []).slice(1).join('|'));
    ok(`AH1 ${n}: pack de 1 sin distintivo; «Para ti y para regalar» y «Mayor ahorro» con la misma clase, sin tono suave`, JSON.stringify(badges) === JSON.stringify(['', 'g-offer__badge|Para ti y para regalar', 'g-offer__badge|Mayor ahorro']), badges);
  }
  for (const [u, w] of [['/', 320], ['/', 390], [P, 390], [P, 1440]]) {
    await reset(); await setState('mode=d49');
    const { page, errs } = await openPage(browser, u, { width: w, height: 844 });
    const st = await page.$$eval('variant-selects.g-offer .g-offer__badge', (bs) => bs.map(b => { const c = getComputedStyle(b); return [c.backgroundColor, c.color, c.borderTopWidth, c.borderTopColor, c.fontSize, c.fontWeight].join(' '); }));
    ok(`AH2 ${u === '/' ? 'home' : 'ficha'} ${w}px: los dos distintivos tienen el mismo fondo, color de texto, borde y tipografía`, st.length === 2 && st[0] === st[1] && errs.length === 0, { st, errs });
    await page.close();
  }
  await reset();
  const css = fs.readFileSync(`${THEME}/assets/garelon.css`, 'utf8'); const snip = fs.readFileSync(`${THEME}/snippets/garelon-offer.liquid`, 'utf8');
  ok('AH3 sin restos del tono suave (CSS y snippet)', !/badge--soft/.test(css) && !/badge--soft|badge_class/.test(snip));
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
    const sec = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- sections`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AH4 alcance: solo el CSS del distintivo, el snippet de ofertas y la ayuda del 2.º distintivo en el esquema', JSON.stringify(changed) === JSON.stringify(['assets/garelon.css', 'sections/featured-product.liquid', 'sections/main-product.liquid', 'snippets/garelon-offer.liquid']) && sec.every(l => /"info": "(Tono suave|Mismo estilo)/.test(l)), [changed, sec]);
  }
};
