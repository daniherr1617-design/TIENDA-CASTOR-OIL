// SOLO TEST · Fase Y: delta final de UX y copy (propietario, 2026-10-13, D42). Envío: «🇪🇸 Envío gratis a toda la
// península» con el mismo sistema de casillas (nada se muestra sin confirmarlo) y ningún «toda España» visible; galería
// de escritorio sin huecos con las 4 imágenes aprobadas (foto completa arriba, dos fotos al lado, infografía al final),
// móvil igual; FAQ con un tono más natural, sin frases defensivas ni lógica de proveedor y sin datos no confirmados.
const T = require('./tests.js');
const { ok, get, setState, reset, text, openPage, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'bad7659'; // HEAD antes de la ronda Y
const REPO = fs.existsSync(THEME + '/.git');
const BAR = '🇪🇸 Envío gratis a toda la península';
const CAMPAIGN = 'Especial octubre · Mes del Rosario';
const ALL_SPAIN = /toda España|all of Spain/i;
const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8').replace(/^\s*\/\*[\s\S]*?\*\/\s*/, ''));
const bar = (html) => (html.match(/<div\s+class="utility-bar g-bar[\s\S]*?<\/div>\s*<\/div>/) || [''])[0];
const faq = (html) => [...((html.match(/class="g-faq__list"[\s\S]*?<\/section>/) || [''])[0]).matchAll(/<details class="g-faq__item"[\s\S]*?<\/details>/g)].map(m => m[0]);
const faqOf = (f) => { const s = json(f).sections.preguntas; return s.block_order.map(b => s.blocks[b].settings); };
// Textos de D42 (ejemplos del informe): se fijan para que no vuelvan las frases defensivas.
const A_MATERIAL = '<p>Es de acero inoxidable con un acabado dorado pulido que le da un brillo cálido y elegante. Las cuentas combinan tres tonos, dorado, plateado y rosado, que le aportan un toque delicado.</p>';
const A_REGALO = '<p>Sí, es un regalo con mucho significado para alguien a quien quieres. Y si eliges una oferta con varias pulseras, puedes quedarte una y regalar las demás.</p><p>Si quieres que le llegue directamente a esa persona, solo tienes que poner su dirección al hacer el pedido.</p>';
const A_DIARIO = '<p>Sí. Puedes llevarla cada día, sola o combinada con otras pulseras, y también lucirla en esos momentos que son especiales para ti.</p>';
const DEFENSIVE = /solo describimos|hemos podido comprobar|sensibilidad|alergi|antes de comprar|según (la información|el fabricante)|proveedor|aliexpress|dsers|dropshipping|importad|fabric|taller|artesan|hecha a mano|china|asia/i;
const UNVERIFIED = /hipoal|14 ?k|quilat|chapad|oro (de|macizo|laminado)|impermeab|waterproof|resistente al agua|no se oxida|no pierde (el )?(color|brillo)|no destiñe|antialérg|circon|zirc|diamant|piedras? preciosa|garant[ií]a de \d|\d+ años|de por vida|cuidad|limpi/i;

module.exports = async function (browser) {
  // 1 · Envío: «toda la península», solo con las casillas confirmadas
  await reset();
  const S = Object.fromEntries(json('config/settings_schema.json').flatMap(g => g.settings || []).filter(s => s.id).map(s => [s.id, s]));
  ok('Y1 Configuración del tema: texto por defecto «🇪🇸 Envío gratis a toda la península», casilla «… en toda la península» desmarcada por defecto',
    S.garelon_ship_bar_text?.default === BAR && /toda la península/.test(S.garelon_ship_coverage_confirmed?.label) && S.garelon_ship_coverage_confirmed?.default === false && S.garelon_ship_eta_confirmed?.default === false,
    [S.garelon_ship_bar_text?.default, S.garelon_ship_coverage_confirmed?.label]);
  ok('Y2 ningún valor por defecto del tema dice «toda España»', Object.values(S).every(s => typeof s.default !== 'string' || !ALL_SPAIN.test(s.default)));
  for (const u of ['/', P]) {
    const r = await get(u);
    ok(`Y3 ${u} sin confirmar: la barra muestra la campaña; ni «toda la península» ni «toda España» en la página`, text(bar(r.html)).trim() === CAMPAIGN && !/toda la península|toda España/.test(text(r.html)), text(bar(r.html)));
  }
  await setState('ship=cov,eta');
  for (const u of ['/', P, '/cart']) {
    const r = await get(u);
    ok(`Y4 ${u} con la península confirmada: la barra dice «${BAR}» y ningún texto visible dice «toda España»`, r.html.includes(`<p class="g-bar__line">${BAR}</p>`) && !ALL_SPAIN.test(text(r.html)), text(bar(r.html)));
  }
  {
    const f = faq((await get(P)).html)[7] || '';
    ok('Y5 FAQ de envío con la casilla marcada: «El envío es gratuito a toda la península.» y el plazo confirmado', text((f.match(/<p class="g-faq__facts">[\s\S]*?<\/p>/) || [''])[0]).trim() === 'El envío es gratuito a toda la península. Entrega estimada en 5–10 días naturales.', text(f).slice(0, 160));
  }
  await setState('ship=&freeship=1');
  {
    const r = await get(P); const f = faq(r.html)[7] || '';
    ok('Y6 envío gratis sin confirmar la península: «El envío es gratuito.» sin nombrar destinos', /El envío es gratuito\./.test(text(f)) && !/península|España/.test(text(f)) && !/toda la península/.test(text(bar(r.html))));
  }
  await reset();
  const locs = fs.readdirSync(`${THEME}/locales`).filter(f => f.endsWith('.json') && !f.includes('.schema.'));
  ok('Y7 locales: la FAQ dice «a toda la península» (es) / «mainland Spain» y ninguno dice «toda España» ni «all of Spain»',
    json('locales/es.json').garelon.faq.ship_free_spain === 'El envío es gratuito a toda la península.' && locs.every(f => !ALL_SPAIN.test(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')))
    && locs.filter(f => f !== 'es.json').every(f => json(`locales/${f}`).garelon.faq.ship_free_spain === 'Shipping is free to all of mainland Spain.'));
  {
    const strip = (s) => s.replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '');
    const files = ['sections', 'snippets', 'layout'].flatMap(d => fs.readdirSync(`${THEME}/${d}`).filter(f => /\.(liquid|json)$/.test(f)).map(f => `${d}/${f}`)).concat(fs.readdirSync(`${THEME}/templates`).filter(f => f.endsWith('.json')).map(f => `templates/${f}`));
    const bad = files.filter(f => ALL_SPAIN.test(strip(fs.readFileSync(`${THEME}/${f}`, 'utf8'))));
    ok('Y8 plantillas, grupos, secciones y snippets: ningún «toda España» fuera de comentarios', bad.length === 0, bad);
  }

  // 2 · Galería de escritorio sin huecos; móvil igual que antes
  await setState('mode=live&reviews=both');
  const ROOT = { home: ['/', '#comprar'], ficha: [P, 'main'] };
  for (const w of [768, 1024, 1440]) {
    for (const [n, [u, root]] of Object.entries(ROOT)) {
      const { page, errs } = await openPage(browser, u, { width: w, height: 900 });
      const m = await page.evaluate((root) => {
        const tr = document.querySelector(`${root} .g-gallery__track`); const tb = tr.getBoundingClientRect();
        const sl = [...tr.querySelectorAll('.g-gallery__slide')].map(li => {
          const im = li.querySelector('img').getBoundingClientRect(); const b = li.getBoundingClientRect();
          return { key: (li.querySelector('img').currentSrc.match(/producto-(\w+?)(?:-v\d+)?-\d+\.webp/) || [])[1], x: Math.round(b.left - tb.left), y: Math.round(b.top - tb.top), w: Math.round(b.width), iw: Math.round(im.width), ih: Math.round(im.height), ib: Math.round(im.bottom - tb.top) };
        });
        const hint = document.querySelector(`${root} .g-zoom__hint`); const hb = hint ? hint.getBoundingClientRect() : null;
        return { tw: Math.round(tb.width), th: Math.round(tb.height), gap: parseFloat(getComputedStyle(tr).columnGap), sl, hintTop: hb ? Math.round(hb.top - tb.top) : -1, hintBottom: hb ? Math.round(hb.bottom - tb.top) : -1 };
      }, root);
      const rows = Object.values(m.sl.reduce((a, s) => ((a[s.y] = a[s.y] || []).push(s), a), {})).sort((a, b) => a[0].y - b[0].y).map(r => r.sort((a, b) => a.x - b.x));
      const half = (m.tw - m.gap) / 2;
      const full = (s) => Math.abs(s.w - m.tw) <= 1;
      ok(`Y9 ${n} ${w}px: cada fila se llena (una imagen a todo el ancho o dos mitades): ningún hueco`,
        rows.every(r => (r.length === 1 && full(r[0])) || (r.length === 2 && r.every(s => Math.abs(s.w - half) <= 1) && r[0].x === 0 && Math.abs(r[1].x + r[1].w - m.tw) <= 1)), rows.map(r => r.map(s => `${s.key}:${s.w}`)));
      ok(`Y10 ${n} ${w}px: foto completa arriba, principal y oración al lado, infografía al final a todo el ancho`,
        JSON.stringify(rows.map(r => r.map(s => s.key))) === JSON.stringify([['completa'], ['principal', 'oracion'], ['infografia']]), rows.map(r => r.map(s => s.key)));
      ok(`Y11 ${n} ${w}px: todas las imágenes cuadradas y las de la misma fila terminan a la misma altura`,
        m.sl.every(s => Math.abs(s.iw - s.ih) <= 1) && rows.every(r => r.every(s => Math.abs(s.ib - r[0].ib) <= 1)), m.sl);
      const last = rows[rows.length - 1][0];
      ok(`Y12 ${n} ${w}px: «Ampliar» queda bajo la infografía, al pie de la galería (no descuadra ninguna fila)`, m.hintTop >= last.ib - 1 && m.hintBottom <= m.th + 1 && m.sl.every(s => s.ib <= m.hintTop + 1), [m.hintTop, m.hintBottom, m.th, last.ib]);
      ok(`Y13 ${n} ${w}px: sin scroll horizontal ni errores`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth) && errs.length === 0, errs);
      await page.close();
    }
  }
  for (const w of [320, 390, 430]) {
    for (const [n, [u, root]] of Object.entries(ROOT)) {
      const { page, errs } = await openPage(browser, u, { width: w, height: 844 });
      const m = await page.evaluate((root) => {
        const tr = document.querySelector(`${root} .g-gallery__track`); const cs = getComputedStyle(tr);
        const sl = [...tr.querySelectorAll('.g-gallery__slide')];
        return { display: cs.display, snap: cs.scrollSnapType, tw: Math.round(tr.clientWidth), ws: sl.map(li => Math.round(li.getBoundingClientRect().width)), orders: sl.map(li => getComputedStyle(li).order), count: (tr.querySelector('.g-gallery__count') || {}).textContent || '', hs: document.documentElement.scrollWidth > innerWidth };
      }, root);
      ok(`Y14 ${n} ${w}px: en móvil sigue el carrusel deslizable a todo el ancho, en el mismo orden y con «1 / 4»`,
        m.display === 'flex' && /x/.test(m.snap) && m.ws.length === 4 && m.ws.every(x => Math.abs(x - m.tw) <= 1) && m.orders.every(o => o === '0') && m.count === '1 / 4' && !m.hs && errs.length === 0, m);
      await page.close();
    }
  }
  {
    const snip = fs.readFileSync(`${THEME}/snippets/garelon-gallery.liquid`, 'utf8');
    ok('Y15 galería: si sobran fotos impares, la última también va a todo el ancho (claves configurables sin huecos)', /assign odd_halves = halves \| modulo: 2/.test(snip) && /odd_halves == 1 and n == last_half/.test(snip));
    ok('Y16 galería: solo las 4 imágenes aprobadas (sin `detalle` ni imágenes nuevas)', ['templates/index.json', 'templates/product.json'].every(f => { const k = Object.values(json(f).sections).map(s => s.settings && s.settings.garelon_gallery_keys).find(Boolean); return k.split(',').sort().join() === 'completa,infografia,oracion,principal'; }));
  }
  await reset();

  // 3 · FAQ con un tono natural, sin frases defensivas ni datos no confirmados
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const qa = faqOf(f); const all = qa.map(x => text(x.answer)).join(' ');
    ok(`Y17 ${f}: sin frases defensivas ni lógica de proveedor («Solo describimos…», «sensibilidad a algún metal», proveedor, AliExpress, DSers, fabricación)`, !DEFENSIVE.test(all), (all.match(new RegExp('.{0,30}(' + DEFENSIVE.source + ').{0,30}', 'i')) || [''])[0]);
    ok(`Y18 ${f}: sin propiedades no verificadas (14K, hipoalergénico, resistente al agua, cuidados…)`, !UNVERIFIED.test(all), (all.match(new RegExp('.{0,30}(' + UNVERIFIED.source + ').{0,30}', 'i')) || [''])[0]);
    ok(`Y19 ${f}: respuestas de material, uso diario y regalo con los textos de D42`, qa[0].answer === A_MATERIAL && qa[4].answer === A_DIARIO && qa[6].answer === A_REGALO, [qa[0].answer, qa[4].answer]);
    ok(`Y20 ${f}: respuestas breves (≤ 2 párrafos y ≤ 520 caracteres) y con los datos legales exactos`, qa.every(x => (x.answer.match(/<p>/g) || []).length <= 2 && text(x.answer).length <= 520)
      && /14 días naturales desde la recepción del pedido para ejercer tu derecho de desistimiento/.test(all) && /garantía legal aplicable/.test(all), qa.map(x => text(x.answer).length));
  }
  ok('Y21 la FAQ es la misma en la portada y en la ficha', JSON.stringify(json('templates/index.json').sections.preguntas) === JSON.stringify(json('templates/product.json').sections.preguntas));
  for (const u of ['/', P]) {
    const f = faq((await get(u)).html);
    ok(`Y22 ${u}: se pintan las 10 respuestas nuevas, sin «Solo describimos» ni «sensibilidad»`, f.length === 10 && text(f[0]).includes('Es de acero inoxidable con un acabado dorado pulido') && !/Solo describimos|sensibilidad/.test(text(f.join(' '))));
  }

  // 4 · Alcance: solo copy de envío, galería y FAQ (sin precios, packs, Judge.me, políticas ni checkout)
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean)
      .concat(execSync(`git -C ${THEME} ls-files --others --exclude-standard -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean));
    const allowed = /^(assets\/garelon\.css|config\/settings_schema\.json|locales\/[\w.-]+\.json|sections\/(garelon-announcement|garelon-faq)\.liquid|snippets\/garelon-gallery\.liquid|templates\/(index|product)\.json)$/;
    ok('Y23 alcance: envío, galería y FAQ; sin precios, packs, opiniones, carrito, layout ni imágenes', changed.length > 0 && changed.every(f => allowed.test(f)), changed.filter(f => !allowed.test(f)));
    const at = (f) => JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString());
    const noFaq = (t) => { const c = JSON.parse(JSON.stringify(t)); Object.values(c.sections.preguntas.blocks).forEach(b => delete b.settings.answer); return c; };
    ok('Y24 plantillas: solo cambian las respuestas de la FAQ (ofertas, opiniones, galería y demás secciones intactas)', ['templates/index.json', 'templates/product.json'].every(f => JSON.stringify(noFaq(at(f))) === JSON.stringify(noFaq(json(f)))));
    const loc = execSync(`git -C ${THEME} diff ${BASE} -- locales`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    ok('Y25 locales: solo cambia la frase de envío de la FAQ', loc.length > 0 && loc.every(l => /^[+-]\s+"ship_free_spain": /.test(l)), loc.filter(l => !/ship_free_spain/.test(l)).slice(0, 3));
    const sch = execSync(`git -C ${THEME} diff ${BASE} -- config/settings_schema.json`).toString().split('\n').filter(l => /^[+-]\s/.test(l));
    ok('Y26 settings_schema: solo cambian los textos de la cobertura de envío (sin ajustes nuevos ni borrados)', sch.length > 0 && sch.every(l => /"(label|info|default)": /.test(l) && !/"id": /.test(l)), sch.slice(0, 4));
    ok('Y27 config/settings_data.json sin cambios (casillas de envío y demás ajustes del propietario intactos)', execSync(`git -C ${THEME} diff --name-only ${BASE} -- config/settings_data.json`).toString().trim() === '');
  }
};
