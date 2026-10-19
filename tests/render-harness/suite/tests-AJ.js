// SOLO TEST · Fase AJ: cuatro cambios puntuales del propietario (2026-10-19, D53).
// 1) Cuarta foto «IMAGEN CON CAJA.png» (main 667668c) → clave 'estuche', al final de la galería; las tres de siempre igual.
// 2) Sin la línea «N € por pulsera» en los packs de 2 y 3; ahorros, distintivos, precios y compra sin cambios.
// 3) «Especial octubre · Mes del Rosario» → «Envío gratis + seguimiento» en la barra superior y encima de las ofertas.
//    La política de envíos real (leída el 2026-10-19) no tiene fecha de fin: sin cuenta atrás ni «solo hoy».
// 4) Aviso discreto bajo la galería: «La caja de joyería mostrada en las imágenes no está incluida.»
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, count, text, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '9ccddfb'; // commit del tema antes de la ronda AJ
const REPO = fs.existsSync(THEME + '/.git');
const NOTE = 'La caja de joyería mostrada en las imágenes no está incluida.';
const SHIP = 'Envío gratis + seguimiento';
const buy = (html, u) => ((u === '/' ? html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) : html.match(/<product-info[\s\S]*?<\/product-info>/)) || [''])[0];
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>\s*<\/div>(\s*<p class="g-gallery__note">[\s\S]*?<\/p>)?/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
const offer = (html) => (html.match(/<variant-selects[\s\S]*?<\/variant-selects>/) || [''])[0];
const cards = (html) => [...html.matchAll(/<label[^>]*class="g-offer__card[\s\S]*?<\/label>/g)].map(m => text(m[0]).trim());
const WANT = ['1 pulsera Ideal para ti 19,99 €',
  'Para ti y para regalar 2 pulseras Una para ti y otra para quien quieras Ahorras 9,99 € (25 %) 29,99 €',
  'Mayor ahorro 3 pulseras Para ti y para compartir Ahorras 24,98 € (42 %) 34,99 €'];
const TIMER = /solo hoy|termina en|quedan \d|\b\d{1,2}:\d{2}(:\d{2})?\b|countdown|cuenta atr[aá]s/i;

module.exports = async function (browser) {
  // 1 · Render: galería de 4 fotos con la del estuche al final, aviso debajo, ofertas sin precio por pulsera y textos nuevos
  for (const mode of ['live', 'd49']) {
    await reset(); await setState(`mode=${mode}`);
    for (const [n, u] of [['home', '/'], ['ficha', P]]) {
      const html = (await get(u)).html; const b = buy(html, u); const g = gallery(b);
      ok(`AJ1 ${mode} ${n}: galería completa → principal → oración → estuche, 4 diapositivas «1 / 4»…«4 / 4», sin repetir ninguna`,
        JSON.stringify(slides(g)) === JSON.stringify(['completa', 'principal', 'oracion', 'estuche']) && count(g, /class="g-gallery__slide/g) === 4 && /4 \/ 4/.test(g) && !/5 \/ /.test(g), slides(g));
      ok(`AJ2 ${mode} ${n}: aviso de la caja justo después de la galería, una sola vez, con el texto exacto`,
        count(b, /class="g-gallery__note"/g) === 1 && new RegExp(`<p class="g-gallery__note">${NOTE}</p>`).test(g), (b.match(/g-gallery__note[^<]*/) || [])[0]);
      const s = offer(b);
      ok(`AJ3 ${mode} ${n}: 3 ofertas con sus precios, distintivos y ahorros de siempre, sin «€ por pulsera»`,
        JSON.stringify(cards(s)) === JSON.stringify(WANT) && !/por pulsera|g-offer__unit/.test(s), cards(s));
      const t = text(html);
      ok(`AJ4 ${mode} ${n}: «${SHIP}» en la barra superior y encima de las ofertas; nada de «octubre» ni «Mes del Rosario»`,
        new RegExp(`<p class="g-bar__line">${SHIP.replace('+', '\\+')}</p>`).test(html) && new RegExp(`<p class="g-offer__promo">${SHIP.replace('+', '\\+')}</p>`).test(b) && !/octubre|Mes del Rosario/i.test(t), (t.match(/.{0,40}(octubre|Mes del Rosario).{0,40}/i) || [])[0]);
      ok(`AJ5 ${mode} ${n}: sin cuenta atrás ni «solo hoy» (no hay promoción con fecha de fin)`, !TIMER.test(t), (t.match(new RegExp('.{0,40}(' + TIMER.source + ').{0,40}', 'i')) || [])[0]);
    }
  }
  // 2 · Navegador: fotos cargadas, rejilla sin huecos (1.ª y 4.ª a todo el ancho en escritorio), aviso legible y discreto
  for (const [u, vp] of [['/', { width: 390, height: 844 }], ['/', { width: 1440, height: 900 }], [P, { width: 390, height: 844 }], [P, { width: 1440, height: 900 }], [P, { width: 320, height: 568 }]]) {
    await reset(); await setState('mode=live');
    const { page, errs } = await openPage(browser, u, vp);
    const m = await page.evaluate(async () => {
      const g = document.querySelector('.g-gallery'); const imgs = [...g.querySelectorAll('img')];
      for (const i of imgs) { i.loading = 'eager'; await i.decode().catch(() => {}); }
      const r = [...g.querySelectorAll('.g-gallery__slide')].map(s => { const b = s.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.width), Math.round(b.height)]; });
      const tw = Math.round(g.querySelector('.g-gallery__track').getBoundingClientRect().width);
      const note = g.nextElementSibling; const ns = getComputedStyle(note); const nb = note.getBoundingClientRect();
      return { n: imgs.length, broken: imgs.filter(i => !(i.complete && i.naturalWidth > 0)).length, r, tw, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        note: { cls: note.className, fs: parseFloat(ns.fontSize), color: ns.color, bg: ns.backgroundColor, border: ns.borderTopWidth, h: Math.round(nb.height), w: Math.round(nb.width), vis: ns.display !== 'none' && ns.visibility !== 'hidden' && nb.height > 0 } };
    });
    const desk = vp.width >= 750;
    const layout = desk
      ? Math.abs(m.r[0][2] - m.tw) <= 1 && m.r[1][1] === m.r[2][1] && Math.abs(m.r[1][2] - m.r[2][2]) <= 1 && Math.abs(m.r[3][2] - m.tw) <= 1 && m.r[3][1] > m.r[1][1]
      : m.r.every(x => Math.abs(x[2] - m.tw) <= 1 && x[1] === m.r[0][1]);
    ok(`AJ6 ${u === '/' ? 'home' : 'ficha'} ${vp.width}px: 4 fotos cargadas y cuadradas, ${desk ? '1.ª y 4.ª a todo el ancho, 2.ª y 3.ª en una fila' : 'deslizables a todo el ancho'}, sin scroll horizontal ni errores`,
      m.n === 4 && m.broken === 0 && layout && m.r.every(x => Math.abs(x[2] - x[3]) <= 1) && m.sw <= m.cw && errs.length === 0, { ...m, errs });
    ok(`AJ7 ${u === '/' ? 'home' : 'ficha'} ${vp.width}px: aviso visible, 12-14 px, gris, sin fondo ni borde, una o dos líneas`,
      m.note.cls === 'g-gallery__note' && m.note.vis && m.note.fs >= 12 && m.note.fs <= 14 && /rgba\(42, 38, 34, 0\.7\)/.test(m.note.color) && /rgba\(0, 0, 0, 0\)|transparent/.test(m.note.bg) && m.note.border === '0px' && m.note.h <= 44, m.note);
    await page.close();
  }
  // 3 · Fuentes y alcance
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .concat(execSync(`git -C ${THEME} ls-files --others --exclude-standard -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)).sort();
    const bad = changed.filter(f => !/^(locales\/[\w-]+(\.default)?\.json|assets\/producto-estuche-(480|720|1080)\.webp|assets\/garelon\.css|snippets\/garelon-(gallery|image)\.liquid|templates\/(index|product)\.json|sections\/header-group\.json)$/.test(f));
    ok('AJ8 alcance: galería, imagen, estilo del aviso, textos, plantillas y barra (sin secciones, JS, pago ni configuración)', bad.length === 0, bad);
    const tpl = execSync(`git -C ${THEME} diff -U0 ${BASE} -- templates sections/header-group.json`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AJ9 plantillas y barra: solo las claves de la galería, «show_unit_price» y los dos textos de campaña',
      tpl.every(l => /^[+-]\s*"(garelon_gallery_keys|show_unit_price|promo_text|fallback_text)"/.test(l)), tpl.filter(l => !/"(garelon_gallery_keys|show_unit_price|promo_text|fallback_text)"/.test(l)));
    const lc = execSync(`git -C ${THEME} diff -U0 ${BASE} -- locales`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AJ10 locales: solo se añaden «alt_estuche» y «box_note» (y la coma de «alt_oracion»)', lc.every(l => /^\+\s*"(alt_estuche|box_note)"|^[+-]\s*"alt_oracion"/.test(l)), lc.filter(l => !/"(alt_estuche|box_note|alt_oracion)"/.test(l)).slice(0, 4));
    const css = execSync(`git -C ${THEME} diff -U0 ${BASE} -- assets/garelon.css`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AJ11 CSS: solo se añade el estilo del aviso (nada se borra)', css.every(l => l.startsWith('+')) && css.some(l => /g-gallery__note/.test(l)), css);
    const src = fs.readFileSync(`${THEME}/IMAGEN CON CAJA.png`); const want = execSync(`git -C ${THEME} cat-file -p 667668c:"IMAGEN CON CAJA.png" 2>/dev/null || true`, { maxBuffer: 1 << 26 });
    ok('AJ12 «IMAGEN CON CAJA.png» es byte a byte la subida del propietario a main (667668c)', want.length === 0 || Buffer.compare(src, want) === 0, { src: src.length, want: want.length });
  }
};
