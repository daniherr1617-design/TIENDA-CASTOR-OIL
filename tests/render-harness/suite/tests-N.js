// SOLO TEST · Fase N: «Para regalar» sin ocasiones concretas (decisión D31 del propietario) y FAQ de regalo genérica.
// Comprueba además que Judge.me (D30) sigue intacto y que «GARELON Detalles» sigue sirviendo con y sin bloques.
const T = require('./tests.js');
const { ok, get, setState, reset, openPage, text, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'a15a2c3'; // HEAD antes de la ronda N
const ROUND_HEAD = 'e27ae75'; // último commit del tema en la ronda N: N15-N18 se fijan a a15a2c3..e27ae75 (la ronda O toca plantillas)
const REPO = fs.existsSync(THEME + '/.git');
const WIDGET = 'shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8';
const CORE = 'shopify://apps/judge-me-reviews/blocks/judgeme_core/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8';
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const HEADING = 'Un detalle para momentos que importan';
const TEXT = 'Una joya con significado para regalar en un momento especial.';
const FAQ_Q = '¿Es una buena opción para regalar?';
const FAQ_A = '<p>Sí. Puede ser un detalle con significado para regalar en un momento especial.</p>';
// Ocasiones concretas que no deben aparecer (es + las traducciones que usan los locales en inglés).
const OCCASIONS = /bautiz|comuni[oó]n|confirmaci[oó]n|navidad|pascua|ocasiones religiosas|celebraciones religiosas|fechas especiales|christening|baptism|communion|easter\b(?!-egg)|christmas|religious (occasion|celebration)/i;

const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8'));
const atBase = (f) => execSync(`git -C ${THEME} show ${BASE}:${f}`).toString();
const atRound = (f) => execSync(`git -C ${THEME} show ${ROUND_HEAD}:${f}`).toString();
const regalo = (html) => (html.match(/<section[^>]*id="regalo"[\s\S]*?<\/section>/) || [''])[0];
const faqOf = (tpl) => Object.values(tpl.sections).filter(s => s.type === 'garelon-faq').flatMap(s => (s.block_order || []).map(b => s.blocks[b].settings));
const walk = (a, b, p, d) => { if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) d.push(p); return d; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k, d); return d; };

module.exports = async function (browser) {
  // 1 · Judge.me (D30) intacto
  const idx = json('templates/index.json'), prod = json('templates/product.json');
  for (const [name, tpl] of [['home', idx], ['ficha', prod]]) {
    const o = tpl.sections.opiniones; const bs = Object.values(o.blocks || {});
    ok(`N1 ${name}: Review Widget de Judge.me sigue versionado en «GARELON Opiniones» con real_data y summary_with_app = false`,
      o.type === 'garelon-reviews' && bs.length === 1 && bs[0].type === WIDGET && bs[0].settings.review_data === 'real_data' && o.settings.summary_with_app === false, bs);
  }
  const sd = json('config/settings_data.json'); const cur = typeof sd.current === 'string' ? sd.presets[sd.current] : sd.current;
  ok('N2 App Embed Judge.me Core intacto (único, activo, sin ajustes)', Object.values(cur.blocks || {}).length === 1 && Object.values(cur.blocks)[0].type === CORE && Object.values(cur.blocks)[0].disabled === false);
  await reset(); await setState('mode=pack3save&reviews=both');
  let r = await get('/'); let rev = (r.html.match(/<section[^>]*class="g-reviews[\s\S]*?<\/section>/) || [''])[0];
  ok('N3 home: widget de Judge.me pintado y sin valoración duplicada', rev.includes(`data-app-type="${WIDGET}"`) && !/g-reviews__score|g-reviews__summary/.test(rev));

  // 2 · «Para regalar»: solo encabezado y entradilla, sin tarjetas ni rejilla
  const rg = idx.sections.regalo;
  ok('N4 index.json: la sección «regalo» sigue (GARELON Detalles) y en su sitio, sin bloques', rg && rg.type === 'garelon-details' && !rg.blocks && !rg.block_order && idx.order.indexOf('regalo') === idx.order.indexOf('detalles') + 1);
  ok('N5 index.json: antetítulo, título y entradilla nuevos', rg.settings.eyebrow === 'Para regalar' && rg.settings.heading === HEADING && rg.settings.text === TEXT, rg.settings);
  const sec = regalo(r.html);
  ok('N6 home: se ve «Para regalar», el título y la entradilla nueva', /<p class="g-eyebrow">Para regalar<\/p>/.test(sec) && sec.includes(`>${HEADING}</h2>`) && sec.includes(`<p class="g-head__text">${TEXT}</p>`), sec.length);
  ok('N7 home: sin las seis tarjetas, sin lista ni rejilla vacías', !/g-chip|g-details__grid|g-details__body|<ul/.test(sec), sec.replace(/\s+/g, ' ').slice(0, 300));

  // 3 · FAQ de regalo genérica (home y ficha)
  for (const [name, tpl] of [['home', idx], ['ficha', prod]]) {
    const f = faqOf(tpl); const g = f.filter(x => /regal/i.test(x.question));
    ok(`N8 ${name}: FAQ «${FAQ_Q}» con respuesta genérica; ninguna pregunta por ocasiones`, g.length === 1 && g[0].question === FAQ_Q && g[0].answer === FAQ_A && !f.some(x => /ocasion/i.test(x.question)), g);
  }
  r = await get(P);
  ok('N9 ficha: la FAQ nueva se pinta', r.status === 200 && r.html.includes(FAQ_Q) && r.html.includes('Puede ser un detalle con significado para regalar en un momento especial.'));

  // 4 · Ninguna ocasión concreta en el storefront: render (home, ficha, carrito, 404) y archivos del tema que pueden mostrarse
  const pages = {};
  for (const u of ['/', P, '/cart', '/ruta-inexistente-garelon']) pages[u] = text((await get(u)).html);
  const hits = Object.entries(pages).filter(([, t]) => OCCASIONS.test(t)).map(([u, t]) => [u, t.match(OCCASIONS)[0]]);
  ok('N10 render: 0 ocasiones concretas (bautizo, comunión, confirmación, Navidad, Pascua, ocasiones religiosas…) en home, ficha, carrito y 404', hits.length === 0, hits);
  const files = [...fs.readdirSync(`${THEME}/templates`).map(f => `templates/${f}`), ...fs.readdirSync(`${THEME}/sections`).filter(f => f.endsWith('.json') || f.startsWith('garelon-')).map(f => `sections/${f}`),
    ...fs.readdirSync(`${THEME}/snippets`).filter(f => f.startsWith('garelon-')).map(f => `snippets/${f}`), 'config/settings_data.json', 'config/settings_schema.json'];
  const fileHits = files.filter(f => OCCASIONS.test(fs.readFileSync(`${THEME}/${f}`, 'utf8')));
  const locHits = fs.readdirSync(`${THEME}/locales`).filter(f => { const g = JSON.parse(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')).garelon; return g && OCCASIONS.test(JSON.stringify(g)); });
  ok('N11 plantillas, grupos, secciones/snippets GARELON, configuración y textos garelon.* de los 31 idiomas: 0 ocasiones concretas', fileHits.length === 0 && locHits.length === 0, { fileHits, locHits });

  // 5 · «GARELON Detalles» sigue siendo reutilizable
  const det = ((await get('/')).html.match(/<section[^>]*id="detalles"[\s\S]*?<\/section>/) || [''])[0];
  ok('N12 «Detalles de la pulsera» (layout list) sigue con su rejilla, imagen y 5 hechos', (det.match(/class="g-fact"/g) || []).length === 5 && /g-details__grid/.test(det) && /g-details__media/.test(det));
  await setState('chips=1'); const withChips = regalo((await get('/')).html);
  ok('N13 con bloques (etiquetas de prueba inyectadas), «Etiquetas» sigue pintando la rejilla y las 6 tarjetas', (withChips.match(/<li class="g-chip"/g) || []).length === 6 && /g-details__grid/.test(withChips) && /<ul class="g-chips"/.test(withChips));
  await setState('chips=0');

  // 6 · Responsive y visual: sin huecos bajo la entradilla, sin scroll horizontal, sin errores JS
  for (const w of VPS) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: 900 });
    const m = await page.evaluate(() => { const s = document.querySelector('#regalo'); if (!s) return { missing: true };
      const head = s.querySelector('.g-head'), pw = s.querySelector('.page-width'), txt = s.querySelector('.g-head__text');
      const cs = getComputedStyle(s); const rs = s.getBoundingClientRect(), rt = txt.getBoundingClientRect();
      return { hs: document.documentElement.scrollWidth - document.documentElement.clientWidth, onlyHead: pw.children.length === 1 && pw.firstElementChild === head,
        mb: getComputedStyle(head).marginBottom, below: Math.round(rs.bottom - rt.bottom), pb: parseFloat(cs.paddingBottom), h: Math.round(rs.height) }; });
    ok(`N14 home ${w}px: «Para regalar» solo con encabezado, sin hueco bajo la entradilla, sin scroll horizontal ni errores JS`,
      !m.missing && m.onlyHead && m.mb === '0px' && m.below <= m.pb + 2 && m.hs <= 0 && errs.length === 0, { ...m, errs });
    if (w === 390 || w === 1440) await page.locator('#regalo').screenshot({ path: `${process.env.GARELON_SHOTS || require('os').tmpdir()}/regalo-${w}.png` }).catch(() => {});
    await page.close();
  }

  // 7 · Alcance de la ronda N: a15a2c3..e27ae75 (fijado al cerrar la ronda, como M; solo en el repo)
  if (!REPO) return;
  const ridx = JSON.parse(atRound('templates/index.json')), rprod = JSON.parse(atRound('templates/product.json'));
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
  ok('N15 archivos del tema tocados: garelon.css (una regla), garelon-details.liquid, index.json y product.json', JSON.stringify(changed) === JSON.stringify(['assets/garelon.css', 'sections/garelon-details.liquid', 'templates/index.json', 'templates/product.json']), changed);
  const faqPath = (tpl) => Object.entries(tpl.sections).filter(([, s]) => s.type === 'garelon-faq').flatMap(([sid, s]) => Object.entries(s.blocks).filter(([, b]) => /regal/i.test(b.settings.question || '')).map(([bid]) => `.sections.${sid}.blocks.${bid}.settings.`));
  const di = walk(JSON.parse(atBase('templates/index.json')), ridx, '', []); const fi = faqPath(ridx)[0];
  ok('N16 index.json: solo cambian «regalo» (bloques y entradilla) y la FAQ de regalo; Judge.me, portada, compra, packs, imágenes… idénticos',
    di.length > 0 && di.every(p => /^\.sections\.regalo\.(blocks|block_order)(\.|$)/.test(p) || p === '.sections.regalo.settings.text' || p === fi + 'question' || p === fi + 'answer'), di);
  const dp = walk(JSON.parse(atBase('templates/product.json')), rprod, '', []); const fp = faqPath(rprod)[0];
  ok('N17 product.json: solo cambia la FAQ de regalo', JSON.stringify(dp.sort()) === JSON.stringify([fp + 'answer', fp + 'question']), dp);
  const cssDiff = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- assets/garelon.css`).toString().split('\n').filter(l => /^[-+][^-+]/.test(l));
  ok('N18 garelon.css: solo se añade la regla del encabezado sin rejilla (no se borra ni cambia nada)', cssDiff.every(l => l.startsWith('+')) && cssDiff.some(l => /\.g-details \.g-head:last-child/.test(l)), cssDiff);
};
