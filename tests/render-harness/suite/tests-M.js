// SOLO TEST · Fase M: Review Widget oficial de Judge.me VERSIONADO en «GARELON Opiniones» (home y ficha) y
// App Embed Judge.me Core en settings_data. Decisión D30 del propietario: única excepción a R17.
// El widget del render es un fixture: demuestra la estructura y la lógica del tema, no que Judge.me real funcione.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, THEME } = T;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '8d7e8fd'; // HEAD antes de la ronda M
const REPO = fs.existsSync(THEME + '/.git');
const UUID = '61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8';
const WIDGET = `shopify://apps/judge-me-reviews/blocks/review_widget/${UUID}`;
const CORE = `shopify://apps/judge-me-reviews/blocks/judgeme_core/${UUID}`;
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const NOTE = 'Incluye opiniones de compradores del mismo modelo, importadas mediante Judge.me.';

const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8'));
const atBase = (f) => execSync(`git -C ${THEME} show ${BASE}:${f}`).toString();
const ROUND_HEAD = 'a1b03ef'; // último commit del tema en la ronda M: M23-M26 se fijan a 8d7e8fd..a1b03ef (la ronda N toca plantillas)
const atRound = (f) => execSync(`git -C ${THEME} show ${ROUND_HEAD}:${f}`).toString();
const reviews = (html) => (html.match(/<section[^>]*class="g-reviews[\s\S]*?<\/section>/) || [''])[0];
const appBlocks = (tpl) => Object.entries(tpl.sections).flatMap(([sid, s]) => Object.entries(s.blocks || {})
  .filter(([, b]) => /^shopify:\/\/|^@app$/.test(b.type)).map(([bid, b]) => ({ sid, stype: s.type, bid, b, inOrder: (s.block_order || []).includes(bid) })));
const walk = (a, b, p, d) => { if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) d.push(p); return d; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k, d); return d; };

module.exports = async function (browser) {
  // 1 · Plantillas: exactamente el bloque permitido, en su sitio
  for (const [tpl, file] of [['home', 'templates/index.json'], ['ficha', 'templates/product.json']]) {
    const a = appBlocks(json(file));
    ok(`M1 ${tpl}: exactamente un bloque de app, el Review Widget oficial de Judge.me, dentro de «GARELON Opiniones» (opiniones) y en block_order`,
      a.length === 1 && a[0].b.type === WIDGET && a[0].sid === 'opiniones' && a[0].stype === 'garelon-reviews' && a[0].inOrder && !a[0].b.disabled, a.map(x => [x.sid, x.b.type]));
    const st = (a[0] || { b: {} }).b.settings || {};
    ok(`M2 ${tpl}: ajustes del widget = los vistos en plantillas reales; review_data «real_data» (nunca opiniones de muestra), sin producto inventado`,
      st.review_data === 'real_data' && st.show_shop_reviews === false && Object.keys(st).sort().join() === 'empty_state,max_width,review_data,show_shop_reviews' && !('product' in st), st);
  }
  const others = [...fs.readdirSync(`${THEME}/templates`).filter(f => f.endsWith('.json')).map(f => `templates/${f}`),
    ...fs.readdirSync(`${THEME}/sections`).filter(f => f.endsWith('.json')).map(f => `sections/${f}`)]
    .flatMap(f => appBlocks(json(f)).map(x => `${f}:${x.sid}:${x.b.type}`)).filter(x => !/^templates\/(index|product)\.json:opiniones:/.test(x) || !x.endsWith(WIDGET));
  ok('M3 ningún otro bloque de app en plantillas ni grupos', others.length === 0, others);
  const sd = json('config/settings_data.json'); const cur = typeof sd.current === 'string' ? sd.presets[sd.current] : sd.current;
  const emb = Object.values(cur.blocks || {});
  ok('M4 settings_data: un único App Embed, Judge.me Core, activado y sin ajustes', emb.length === 1 && emb[0].type === CORE && emb[0].disabled === false && JSON.stringify(emb[0].settings) === '{}', emb);
  const rs = json('templates/index.json').sections.opiniones.settings;
  ok('M5 home: summary_with_app = false (Judge.me pone su propio resumen) y título «Opiniones sobre esta pulsera»', rs.summary_with_app === false && rs.heading === 'Opiniones sobre esta pulsera' && rs.show_summary === true, rs);
  const rjson = JSON.stringify(json('templates/index.json').sections.opiniones) + JSON.stringify(json('templates/product.json').sections.opiniones);
  ok('M6 sin valoraciones ni recuentos escritos en las plantillas (4,9 · 29 · 37 · estrellas)', !/\b4[.,]9\b|\b29\b|\b37\b|★|opiniones?\s*\(\d|\d+\s+opiniones/.test(rjson), rjson.length);
  const liq = fs.readFileSync(`${THEME}/sections/garelon-reviews.liquid`, 'utf8');
  ok('M7 garelon-reviews.liquid sin reseñas ni valoraciones escritas (todo sale de la app o de los metafields)', !/\b4[.,]9\b|\b29 opiniones|★|jdgm-rev\b|<blockquote/.test(liq));

  // 2 · garelon_check: acepta Judge.me y rechaza cualquier otro bloque o App Embed (solo en el repo: tools/ no va en el ZIP)
  if (fs.existsSync(`${THEME}/tools/garelon_check.py`)) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'garelon-m-'));
    const run = () => { try { execFileSync('python3', [`${THEME}/tools/garelon_check.py`, tmp], { stdio: 'pipe' }); return 0; } catch (e) { return e.status; } };
    for (const d of ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']) fs.cpSync(`${THEME}/${d}`, `${tmp}/${d}`, { recursive: true });
    const r0 = run();
    const ip = `${tmp}/templates/index.json`; const idx = JSON.parse(fs.readFileSync(ip, 'utf8'));
    const mut = (fn) => { const d = JSON.parse(JSON.stringify(idx)); fn(d); fs.writeFileSync(ip, JSON.stringify(d, null, 2)); const c = run(); fs.writeFileSync(ip, JSON.stringify(idx, null, 2)); return c; };
    const rOther = mut(d => { d.sections.opiniones.blocks.otra = { type: 'shopify://apps/otra-app/blocks/widget/00000000-0000-4000-8000-000000000000', settings: {} }; d.sections.opiniones.block_order.push('otra'); });
    const rSample = mut(d => { Object.values(d.sections.opiniones.blocks)[0].settings.review_data = 'sample_data'; });
    const rWhere = mut(d => { d.sections.compra.blocks.jm = { type: WIDGET, settings: { review_data: 'real_data' } }; d.sections.compra.block_order.push('jm'); });
    fs.rmSync(tmp, { recursive: true, force: true });
    ok('M8 garelon_check acepta el Review Widget de Judge.me y rechaza otro bloque de app, opiniones de muestra o el widget fuera de «GARELON Opiniones»',
      r0 === 0 && rOther === 1 && rSample === 1 && rWhere === 1, { r0, rOther, rSample, rWhere });
  }

  // 3 · Render de la home (fixture del widget; reviews=both: Judge.me «instalado» y valoración sincronizada)
  await reset(); await setState('mode=pack3save&reviews=both');
  let r = await get('/'); let s = reviews(r.html);
  const fx = (s.match(/<div class="test-app-block[^>]*>/) || [''])[0];
  ok('M9 home: el widget pintado es el bloque VERSIONADO de Judge.me (no un bloque añadido en el editor) y con datos reales',
    fx.includes(`data-app-type="${WIDGET}"`) && fx.includes('data-review-data="real_data"') && (s.match(/data-test="app-reviews"/g) || []).length === 1, fx);
  ok('M10 home: el widget está dentro de la sección #opiniones, en su contenedor .g-reviews__app', /id="opiniones"/.test(s) && /<div class="g-reviews__app">\s*<div class="test-app-block/.test(s));
  const iH = s.indexOf('Opiniones sobre esta pulsera'), iW = s.indexOf('g-reviews__app'), iN = s.indexOf(NOTE);
  ok('M11 home: orden encabezado → widget de Judge.me → nota de origen', iH > 0 && iH < iW && iW < iN, { iH, iW, iN });
  ok('M12 home: con el widget no se duplica la valoración (sin resumen GARELON, sin estrellas propias, sin recuento)', !/g-reviews__summary|g-reviews__score|class="g-stars"|g-reviews__count/.test(s));
  ok('M13 home: un solo título GARELON en la sección (el del widget lo apaga Judge.me) y sin «Reseñas de clientes»/«Customer Reviews» del tema', (s.match(/class="h1 g-head__title"/g) || []).length === 1 && !/Reseñas de clientes|Customer Reviews/.test(s.replace(/<div class="test-app-block[\s\S]*$/, '')));
  ok('M14 home: el resto de la página sigue (portada, compra con packs, detalles, FAQ)', r.status === 200 && /g-hero/.test(r.html) && /id="comprar"/.test(r.html) && /g-offer/.test(r.html) && /id="preguntas-frecuentes"/.test(r.html));

  // 4 · Estados: nunca «0 opiniones»; sin app ni valoración, invisible; sin app pero con valoración, resumen de respaldo
  const states = {};
  for (const st of ['none', 'summary', 'app', 'both']) { await setState(`reviews=${st}`); const h = (await get('/')).html; states[st] = { sec: /g-reviews/.test(h), widget: /data-test="app-reviews"/.test(h), summary: /g-reviews__score/.test(h), zero: /\b0 opiniones/.test(h), note: h.includes(NOTE) }; }
  ok('M15 nunca «0 opiniones» en la home (sin opiniones, solo app, solo valoración, ambas)', Object.values(states).every(x => !x.zero), states);
  ok('M16 sin app y sin valoración: la sección no se ve; app sin valoración sincronizada + «Ocultar sin opiniones»: tampoco', !states.none.sec && !states.app.sec, states);
  ok('M17 sin la app (bloque no pintado) pero con valoración: resumen GARELON de respaldo con la nota', states.summary.sec && states.summary.summary && !states.summary.widget && states.summary.note, states.summary);
  ok('M18 con app y valoración: widget y nota, sin resumen', states.both.widget && states.both.note && !states.both.summary, states.both);
  await setState('reviews=app&design=1'); r = await get('/');
  ok('M19 editor con la valoración aún a 0: se ve el widget versionado con el aviso (el cliente no lo ve)', /data-test="app-reviews"/.test(r.html) && /valoración sincronizada con Shopify es 0/.test(r.html));
  await setState('design=0&reviews=both');

  // 5 · Ficha: sigue funcionando, ahora también con el widget versionado (el producto lo pone la página)
  r = await get(P); s = reviews(r.html);
  ok('M20 ficha: 200, widget versionado de Judge.me dentro de «GARELON Opiniones», nota y sin resumen duplicado',
    r.status === 200 && s.includes(`data-app-type="${WIDGET}"`) && s.includes(NOTE) && !/g-reviews__score/.test(s) && /class="rating"/.test(r.html), s.length);
  ok('M21 ficha: compra (packs, botón) intacta', /g-offer/.test(r.html) && /name="add"/.test(r.html));

  // 6 · Responsive y JS
  for (const [u, vps] of [['/', VPS], [P, [390, 1440]]]) for (const w of vps) {
    const { page, errs } = await openPage(browser, u, { width: w, height: 900 });
    const m = await page.evaluate(() => { const sec = document.querySelector('#opiniones'), app = document.querySelector('.g-reviews__app'), note = document.querySelector('.g-reviews__note'), h = document.querySelector('#opiniones .g-head__title');
      if (!sec || !app || !note || !h) return { missing: true }; const rs = sec.getBoundingClientRect(), ra = app.getBoundingClientRect();
      return { hs: document.documentElement.scrollWidth - document.documentElement.clientWidth, inside: ra.left >= rs.left - 1 && ra.right <= rs.right + 1 && ra.width > 0,
        order: h.getBoundingClientRect().bottom <= ra.top + 1 && note.getBoundingClientRect().top >= ra.bottom - 1 }; });
    ok(`M22 ${u === '/' ? 'home' : 'ficha'} ${w}px: sin scroll horizontal, widget dentro de la sección, título encima y nota debajo, sin errores JS`, !m.missing && m.hs <= 0 && m.inside && m.order && errs.length === 0, { ...m, errs });
    await page.close();
  }

  // 7 · Alcance de la ronda M: 8d7e8fd..a1b03ef (fijado al cerrar la ronda, como I/J/K/L; solo en el repo)
  if (!REPO) return;
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
  ok('M23 archivos del tema tocados: solo settings_data (App Embed), garelon-reviews (comentario) e index/product (widget)', JSON.stringify(changed) === JSON.stringify(['config/settings_data.json', 'sections/garelon-reviews.liquid', 'templates/index.json', 'templates/product.json']), changed);
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const d = walk(JSON.parse(atBase(f)), JSON.parse(atRound(f)), '', []);
    ok(`M24 ${f}: solo se añaden blocks/block_order de «opiniones» (resto de la plantilla idéntico: portada, compra, packs, imágenes, FAQ…)`,
      d.length > 0 && d.every(p => /^\.sections\.opiniones\.(blocks|block_order)(\.|$)/.test(p)), d);
  }
  const sdDiff = walk(JSON.parse(atBase('config/settings_data.json')), JSON.parse(atRound('config/settings_data.json')), '', []);
  ok('M25 settings_data: solo se añade el App Embed (envío gratis, colores, carrito… sin cambios)', sdDiff.length > 0 && sdDiff.every(p => /^\.presets\.Dawn\.blocks(\.|$)/.test(p)), sdDiff);
  const strip = (x) => x.replace(/{%-?\s*comment\s*-?%}[\s\S]*?{%-?\s*endcomment\s*-?%}/g, '');
  ok('M26 garelon-reviews.liquid: la lógica (resumen, summary_with_app, ocultar sin opiniones, nota) no cambia; solo el comentario', strip(atBase('sections/garelon-reviews.liquid')) === strip(atRound('sections/garelon-reviews.liquid')));
};
