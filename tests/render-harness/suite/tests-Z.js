// SOLO TEST · Fase Z: garantías de confianza antes de «Elige tu oferta» (propietario, 2026-10-13, D43). Las tres
// garantías («Envío gratis + seguimiento», «Pago seguro», «14 días para cambiar de opinión») vuelven a la zona alta
// de la compra, como antes de D37, en una franja compacta de 3 columnas; la frase sigue debajo del botón; nada se
// duplica y no se añade ningún mensaje de cobertura de envío. Precios y valoraciones SIMULADOS.
const T = require('./tests.js');
const { ok, get, setState, reset, text, openPage, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '4c2f562'; // HEAD antes de la ronda Z
const REPO = fs.existsSync(THEME + '/.git');
const CHIPS = ['Envío gratis + seguimiento', 'Pago seguro', '14 días para cambiar de opinión'];
const PHRASE = 'Un símbolo de tu fe, contigo cada día.';
const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const chips = (html) => [...html.matchAll(/<li class="g-trust__chip">[\s\S]*?<span>([^<]+)<\/span>/g)].map(m => m[1].replace(/&nbsp;/g, ' ').trim());
const ROOT = { home: ['/', '#comprar'], ficha: [P, 'main'] };

module.exports = async function (browser) {
  // 1 · Plantillas: garantías antes de la oferta, frase después del botón, sin duplicar
  for (const [f, sid] of [['templates/product.json', 'main'], ['templates/index.json', 'compra']]) {
    const s = json(f).sections[sid]; const o = s.block_order; const c = s.blocks.confianza.settings; const fr = s.blocks.frase.settings;
    ok(`Z1 ${f}: «confianza» justo antes de «oferta» y la frase («frase») justo después de «comprar»`, o.indexOf('confianza') === o.indexOf('oferta') - 1 && o.indexOf('frase') === o.indexOf('comprar') + 1, o);
    ok(`Z2 ${f}: las 3 garantías con sus iconos en «confianza» (sin frase) y la frase sola en «frase» (sin garantías)`,
      c.phrase === '' && [c.chip_1_text, c.chip_2_text, c.chip_3_text].join('|') === CHIPS.join('|') && [c.chip_1_icon, c.chip_2_icon, c.chip_3_icon].join() === 'envio,candado,devolucion' && !c.chip_4_text
      && fr.phrase === PHRASE && [1, 2, 3, 4].every(i => fr[`chip_${i}_text`] === ''), [c, fr]);
  }

  // 2 · Render: orden y una sola vez
  await reset(); await setState('mode=live&reviews=both');
  for (const [n, [u]] of Object.entries(ROOT)) {
    const r = await get(u); const s = buy(r.html, u);
    ok(`Z3 ${n}: 3 garantías en orden, con icono, una sola vez en la página`, JSON.stringify(chips(r.html)) === JSON.stringify(CHIPS) && (s.match(/<li class="g-trust__chip"><svg\s+class="g-icon"/g) || []).length === 3, chips(r.html));
    const i = (re) => s.search(re);
    ok(`Z4 ${n}: título → garantías → «Elige tu oferta» → Añadir al carrito → frase (nada de confianza debajo del botón salvo la frase)`,
      i(/product__title/) < i(/g-trust--chips/) && i(/g-trust--chips/) < i(/g-offer__legend/) && i(/g-offer__legend/) < i(/product-form__submit/) && i(/product-form__submit/) < i(/g-trust__phrase/) && !/g-trust__chip/.test(s.slice(i(/product-form__submit/))),
      [i(/g-trust--chips/), i(/g-offer__legend/), i(/product-form__submit/), i(/g-trust__phrase/)]);
    ok(`Z5 ${n}: la frase sale una vez y sin garantías a su lado`, (r.html.match(/Un símbolo de tu fe, contigo cada día\./g) || []).length === 1 && /<div class="g-trust"[^>]*>\s*<p class="g-trust__phrase">[^<]+<\/p>\s*<\/div>/.test(s));
  }
  // Envío: las garantías no añaden cobertura ni plazo, confirmados o no
  for (const q of ['ship=', 'ship=cov,eta']) {
    await setState(q);
    for (const [n, [u]] of Object.entries(ROOT)) {
      const s = buy((await get(u)).html, u); const z = (s.match(/<div class="g-trust g-trust--chips[\s\S]*?<\/ul>/) || [''])[0];
      ok(`Z6 ${n} con ${q || 'nada confirmado'}: las garantías no anuncian cobertura ni plazo`, JSON.stringify(chips(z)) === JSON.stringify(CHIPS) && !/península|España|días naturales|\d+\s*[–-]\s*\d+/.test(text(z)));
    }
  }
  await reset(); await setState('mode=live&reviews=both');

  // 3 · Responsive: una fila de 3, dentro de la columna, sin desbordes, antes de la oferta
  for (const w of [320, 360, 390, 430, 768, 1024, 1440]) {
    for (const [n, [u, root]] of Object.entries(ROOT)) {
      const { page, errs } = await openPage(browser, u, { width: w, height: 900 });
      const m = await page.evaluate((root) => {
        const z = document.querySelector(`${root} .g-trust--chips`); const zb = z.getBoundingClientRect();
        const cs = [...z.querySelectorAll('.g-trust__chip')].map(c => { const b = c.getBoundingClientRect(); const ic = c.querySelector('.g-icon').getBoundingClientRect(); return { t: Math.round(b.top), b: Math.round(b.bottom), l: Math.round(b.left), r: Math.round(b.right), ow: c.scrollWidth > c.clientWidth + 1, icon: ic.width >= 20 && getComputedStyle(c.querySelector('.g-icon')).color, bg: getComputedStyle(c).backgroundColor }; });
        const lg = document.querySelector(`${root} .g-offer__legend`).getBoundingClientRect();
        const col = z.parentElement.getBoundingClientRect();
        // ¿Alguna línea de texto empieza por «+»? (el «+» va pegado a «gratis»)
        const sp = z.querySelector('.g-trust__chip span'); const rg = document.createRange(); rg.selectNodeContents(sp);
        const lines = [...rg.getClientRects()].length; const plusAlone = (() => { const tn = sp.firstChild; const k = tn.textContent.indexOf('+'); const r1 = document.createRange(); r1.setStart(tn, k); r1.setEnd(tn, k + 1); const r0 = document.createRange(); r0.setStart(tn, k - 2); r0.setEnd(tn, k - 1); return Math.round(r1.getBoundingClientRect().top) !== Math.round(r0.getBoundingClientRect().top); })();
        return { cs, h: Math.round(zb.height), zl: Math.round(zb.left), zr: Math.round(zb.right), cl: Math.round(col.left), cr: Math.round(col.right), gapToLegend: Math.round(lg.top - zb.bottom), hs: document.documentElement.scrollWidth > innerWidth, lines, plusAlone };
      }, root);
      ok(`Z7 ${n} ${w}px: las 3 garantías en una fila, misma altura, dentro de la columna y sin desbordes`,
        m.cs.length === 3 && m.cs.every(c => c.t === m.cs[0].t && c.b === m.cs[0].b && !c.ow) && m.cs[0].l >= m.zl - 1 && m.cs[2].r <= m.zr + 1 && m.zl >= m.cl - 1 && m.zr <= m.cr + 1 && !m.hs && errs.length === 0, m);
      ok(`Z8 ${n} ${w}px: franja compacta (≤ 100 px) cerca de «Elige tu oferta» (≤ 64 px), con icono dorado y fondo blanco; el «+» no queda solo en una línea`,
        m.h <= 100 && m.gapToLegend >= 0 && m.gapToLegend <= 64 && m.cs.every(c => c.icon && c.bg === 'rgb(255, 255, 255)') && !m.plusAlone, m);
      await page.close();
    }
  }
  await reset();

  // 4 · Alcance: solo la posición y la disposición de la confianza
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .concat(execSync(`git -C ${THEME} ls-files --others --exclude-standard -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean));
    const allowed = /^(assets\/garelon\.css|snippets\/garelon-trust\.liquid|sections\/(main-product|featured-product)\.liquid|templates\/(index|product)\.json)$/;
    ok('Z9 alcance: confianza (CSS, snippet, límite del bloque y plantillas); sin precios, packs, opiniones, FAQ, galería ni envío', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    const at = (f) => JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString());
    const strip = (t, sid) => { const c = JSON.parse(JSON.stringify(t)); const s = c.sections[sid]; delete s.blocks.confianza; delete s.blocks.frase; s.block_order = s.block_order.filter(b => b !== 'confianza' && b !== 'frase'); return c; };
    ok('Z10 plantillas: fuera de la confianza no cambia nada (ofertas, botones, opiniones, FAQ, galería…)', [['templates/product.json', 'main'], ['templates/index.json', 'compra']].every(([f, sid]) => JSON.stringify(strip(at(f), sid)) === JSON.stringify(strip(json(f), sid))));
    const sec = execSync(`git -C ${THEME} diff ${BASE} -- sections/main-product.liquid sections/featured-product.liquid`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    ok('Z11 secciones: solo sube el límite de bloques «GARELON Confianza» de 1 a 2 (garantías y frase)', sec.length === 4 && sec.every(l => /^[-+]\s+"limit": [12],$/.test(l)), sec);
    ok('Z12 config/settings_data.json y locales sin cambios', execSync(`git -C ${THEME} diff --name-only ${BASE} -- config/settings_data.json locales`).toString().trim() === '');
  }
};
