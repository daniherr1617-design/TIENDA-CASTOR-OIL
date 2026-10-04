// SOLO TEST · Fase O: storefront sincronizado con las políticas legales del propietario (D32).
// «14 días» = derecho de desistimiento (nunca garantía), sin fechas de entrega fijas, sin «Envíos internacionales»
// (España es el mercado inicial; otros destinos no están verificados en Shopify), sin píxeles a mano y rutas
// legales controladas. El contenido legal vive en Shopify: el tema solo enlaza.
const T = require('./tests.js');
const { ok, get, setState, reset, text, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'a83f700'; // HEAD antes de la ronda O
const REPO = fs.existsSync(THEME + '/.git');
const MONTHS = 'enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre';
const BANNED = new RegExp(`garant[ií]a de \\d+ d[ií]as|devoluci[oó]n(es)? garantizada|sin riesgos?\\b|env[ií]os internacionales|a todo el mundo|\\b\\d{1,2} (al|y|-|–) \\d{1,2} de (${MONTHS})\\b`, 'i');
const PIXEL = /\bfbq\s*\(|\bttq\.(load|page|track)\b|\bgtag\s*\(|googletagmanager\.com|connect\.facebook\.net|analytics\.tiktok\.com|google-analytics\.com/;
const LEGAL_ROUTES = ['/policies/shipping-policy', '/policies/refund-policy', '/policies/privacy-policy', '/policies/terms-of-service', '/policies/legal-notice',
  '/policies/contact-information', '/pages/contacto', '/pages/politica-de-cookies', '/pages/aviso-legal'];
const visible = (html) => text(html.replace(/<template[\s\S]*?<\/template>/g, '').replace(/<script[\s\S]*?<\/script>/g, ''));
const json = (f) => JSON.parse(fs.readFileSync(`${THEME}/${f}`, 'utf8'));
const walk = (a, b, p, d) => { if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) d.push(p); return d; }
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k, d); return d; };

module.exports = async function phaseO() {
  await reset();
  // 1 · Textos visibles y código servido.
  for (const u of ['/', P, '/cart', '/pages/contacto', '/ruta-inexistente-garelon']) {
    const r = await get(u); const v = visible(r.html);
    ok(`O1 ${u}: sin «garantía de 14 días», «devolución garantizada», «sin riesgos», «Envíos internacionales» ni ventanas de entrega fijas`, !BANNED.test(v), (v.match(BANNED) || [])[0]);
    ok(`O2 ${u}: sin píxeles publicitarios ni analítica inyectados por el tema`, !PIXEL.test(r.html), (r.html.match(PIXEL) || [])[0]);
    const days = [...v.matchAll(/\b14 d[ií]as(?=(.{0,90}))/gi)].map(m => m[0] + m[1]);
    ok(`O3 ${u}: cada «14 días» es «para cambiar de opinión» o el derecho de desistimiento (14 días naturales desde la recepción)`,
      days.every(x => /^14 días (para cambiar de opinión|naturales desde la recepción del pedido para ejercer tu derecho de desistimiento)/.test(x)), days);
  }
  // 2 · FAQ y pestaña de la ficha: respuestas cortas que remiten a la política correcta.
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const tpl = json(f); const faq = Object.values(tpl.sections).filter(s => s.type === 'garelon-faq').flatMap(s => s.block_order.map(b => s.blocks[b].settings));
    const q = (re) => faq.find(x => re.test(x.question)) || {};
    const ship = q(/cu[aá]ndo recibir/i), ret = q(/puedo devolver/i);
    ok(`O4 ${f}: FAQ de entrega → /policies/shipping-policy, sin plazos ni países escritos`, /href="\/policies\/shipping-policy"/.test(ship.answer || '') && !/\d+\s*(d[ií]as|semanas)|internacional/i.test(ship.answer || ''), ship);
    ok(`O5 ${f}: FAQ de devoluciones = desistimiento de 14 días naturales desde la recepción → /policies/refund-policy, corta (≤ 300 caracteres)`,
      /14 días naturales desde la recepción/.test(ret.answer || '') && /desistimiento/.test(ret.answer || '') && /href="\/policies\/refund-policy"/.test(ret.answer || '') && text(ret.answer || '').length <= 300, ret);
    const routes = [...JSON.stringify(tpl).matchAll(/(\/(?:policies|pages)\/[a-z0-9-]+)/g)].map(m => m[1]);
    ok(`O6 ${f}: solo rutas legales controladas`, routes.length > 0 && routes.every(x => LEGAL_ROUTES.includes(x)), [...new Set(routes)]);
  }
  const tab = Object.values(json('templates/product.json').sections.main.blocks).find(b => b.type === 'collapsible_tab' && /Envíos y devoluciones/.test(b.settings.heading));
  ok('O7 ficha «Envíos y devoluciones»: remite a envíos y a devoluciones, con el desistimiento y sin copiar la política', !!tab && /href="\/policies\/shipping-policy"/.test(tab.settings.content) &&
    /href="\/policies\/refund-policy"/.test(tab.settings.content) && /desistimiento/.test(tab.settings.content) && text(tab.settings.content).length <= 400 && !/embalaje|disminución de valor|coste/i.test(tab.settings.content));
  // 3 · Pie: enlaces legales únicos y vivos (escenario por defecto del render: todas las políticas con contenido).
  const r = await get('/'); const ul = (r.html.match(/<ul class="policies[\s\S]*?<\/ul>/) || [''])[0];
  const hrefs = [...ul.matchAll(/<a href="([^"]+)">/g)].map(m => m[1]);
  const st = []; for (const h of hrefs) st.push((await get(h)).status);
  ok('O8 pie: enlaces legales sin duplicados, todos en rutas controladas y todos responden 200', hrefs.length >= 6 && new Set(hrefs).size === hrefs.length && hrefs.every(h => LEGAL_ROUTES.includes(h)) && st.every(s => s === 200), { hrefs, st });
  await setState('refund=none&shipping=none'); const r2 = await get('/');
  const ul2 = (r2.html.match(/<ul class="policies[\s\S]*?<\/ul>/) || [''])[0];
  ok('O9 pie: una política vacía en Shopify no se enlaza (sin 404 desde el pie)', !/refund-policy|shipping-policy/.test(ul2));
  await reset();

  // 4 · Alcance frente a a83f700 (solo en el repo; se fija al cerrar la ronda, como M y N).
  if (!REPO) return;
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
  ok('O10 archivos del tema tocados: garelon.css, defaults de la 4.ª garantía (home/ficha), garelon-legal-links e index/product', JSON.stringify(changed) === JSON.stringify(
    ['assets/garelon.css', 'sections/featured-product.liquid', 'sections/main-product.liquid', 'snippets/garelon-legal-links.liquid', 'templates/index.json', 'templates/product.json']), changed);
  for (const f of ['templates/index.json', 'templates/product.json']) {
    const d = walk(JSON.parse(execSync(`git -C ${THEME} show ${BASE}:${f}`).toString()), json(f), '', []);
    ok(`O11 ${f}: solo se vacía la garantía «Envíos internacionales» (packs, precios, imágenes, Judge.me, FAQ… idénticos)`, d.length === 1 && /\.blocks\.confianza\.settings\.chip_4_text$/.test(d[0]), d);
  }
  const cssDiff = execSync(`git -C ${THEME} diff -U0 ${BASE} -- assets/garelon.css`).toString().split('\n').filter(l => /^[-+][^-+]/.test(l));
  ok('O12 garelon.css: solo se añade la regla de la garantía impar a lo ancho', cssDiff.length > 0 && cssDiff.every(l => l.startsWith('+')) && cssDiff.some(l => /g-trust__chip:last-child:nth-child\(odd\)/.test(l)), cssDiff);
};
