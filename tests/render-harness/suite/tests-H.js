// SOLO TEST · Fase H (pulido final): logo nuevo (isotipo dorado + GARELON negro), garantías definitivas,
// cuadrícula «Para regalar», título y nota de opiniones, y regresión de rutas. Render local, NO es Shopify.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const P = '/products/pulsera-rosario-virgen-maria';
const LOGOS = [160, 320, 480].map(w => `garelon-logo-negro-${w}.webp`);
const OLD = /garelon-wordmark-|garelon-logo-(240|480)\.webp/;
const visible = (html) => text(html.replace(/<template[\s\S]*?<\/template>/g, ''));
const schema = (f) => JSON.parse(fs.readFileSync(`${THEME}/sections/${f}`, 'utf8').split('{% schema %}')[1].split('{% endschema %}')[0]);

module.exports = async function (browser) {
  await reset();
  // 1 · Logo
  ok('H1 assets del logo nuevo en assets/ (160, 320, 480) y sin los del logotipo dorado antiguo',
    LOGOS.every(f => fs.existsSync(`${THEME}/assets/${f}`) && fs.readFileSync(`${THEME}/assets/${f}`).slice(8, 12).toString() === 'WEBP') &&
    !fs.readdirSync(`${THEME}/assets`).some(f => OLD.test(f)));
  let r = await get('/');
  const header = (r.html.match(/<sticky-header[\s\S]*?<\/sticky-header>/) || [''])[0];
  const footer = (r.html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  const hImg = (header.match(/<img[^>]*class="g-logo g-logo--header"[^>]*>/) || [''])[0];
  ok('H2 cabecera: logo nuevo (srcset 160/320/480, 320×198, alt GARELON, carga inmediata)', LOGOS.every(f => hImg.includes(f)) && /width="320"/.test(hImg) && /height="198"/.test(hImg) && /alt="GARELON"/.test(hImg) && !/loading="lazy"/.test(hImg), hImg);
  const fImg = (footer.match(/<img[^>]*class="g-logo g-logo--stacked"[^>]*>/) || [''])[0];
  ok('H3 pie: logo nuevo (mismo archivo) con su descripción de marca', LOGOS.every(f => fImg.includes(f)) && /alt="GARELON"/.test(fImg) && /Joyería con significado/.test(footer), fImg);
  const pages = {};
  for (const u of ['/', P, '/cart', '/pages/contacto', '/ruta-inexistente-garelon']) pages[u] = (await get(u)).html;
  ok('H4 el logotipo dorado antiguo no se renderiza en ninguna página (home, ficha, carrito, contacto, 404)', Object.values(pages).every(h => !OLD.test(h)), Object.keys(pages).filter(u => OLD.test(pages[u])));
  ok('H5 isotipo dorado independiente: favicon, icono de Apple y assets del isotipo intactos',
    /rel="icon" type="image\/png" href="\/assets\/garelon-favicon-32\.png/.test(pages['/']) && /apple-touch-icon" href="\/assets\/garelon-apple-touch-180\.png/.test(pages['/']) &&
    ['garelon-favicon-32.png', 'garelon-apple-touch-180.png', 'garelon-isotipo-96.webp', 'garelon-isotipo-192.webp'].every(f => fs.existsSync(`${THEME}/assets/${f}`)));
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    const px = await page.evaluate(async () => {
      const img = new Image(); img.src = '/assets/garelon-logo-negro-480.webp'; await img.decode();
      const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data; let gold = 0, dark = 0, clear = 0, other = 0;
      for (let i = 0; i < d.length; i += 4) { const [R, G, Bl, A] = [d[i], d[i + 1], d[i + 2], d[i + 3]]; if (A < 10) clear++; else if (A > 200 && Math.max(R, G, Bl) < 90) dark++; else if (A > 200 && R > 150 && R > Bl + 40) gold++; else other++; }
      const corner = [0, (c.width - 1) * 4, (c.height - 1) * c.width * 4].map(i => d[i + 3]);
      return { w: c.width, h: c.height, gold, dark, clear, corner, total: d.length / 4 };
    });
    ok('H6 logo nuevo con transparencia real (esquinas alfa 0), isotipo dorado y letras negras/carbón, proporción 1,61:1',
      px.corner.every(a => a === 0) && px.clear / px.total > 0.4 && px.gold > 2000 && px.dark > 2000 && Math.abs(px.w / px.h - 1262 / 782) < 0.01, px);
    ok('H7 sin errores JS', errs.length === 0, errs);
    await page.close();
  }
  for (const w of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
    const { page } = await openPage(browser, '/', { width: w, height: 900 });
    const st = await page.evaluate(() => {
      const l = document.querySelector('.header .g-logo--header'); const r = l.getBoundingClientRect();
      const hd = document.querySelector('.section-header').getBoundingClientRect().height;
      const others = [...document.querySelectorAll('.header__icon--menu, .header__icon--cart, .header__inline-menu a')].filter(e => e.offsetParent).map(e => e.getBoundingClientRect());
      const overlap = others.some(o => !(o.right <= r.left || o.left >= r.right || o.bottom <= r.top || o.top >= r.bottom));
      return { w: Math.round(r.width), h: Math.round(r.height), ratio: r.width / r.height, nat: l.naturalWidth / l.naturalHeight, loaded: l.complete && l.naturalWidth > 0,
        header: Math.round(hd), overlap, sw: document.documentElement.scrollWidth, vw: innerWidth, center: Math.round(r.left + r.width / 2) };
    });
    const mobile = w < 750;
    ok(`H8 cabecera ${w}px: logo cargado, sin deformar, legible (≥ 78 px de ancho), sin solapes, cabecera compacta, sin scroll horizontal`,
      st.loaded && Math.abs(st.ratio - st.nat) < 0.03 && st.w >= 78 && !st.overlap && st.header <= (mobile ? 76 : 96) && st.sw === st.vw && (!mobile || Math.abs(st.center - st.vw / 2) <= 8), st);
    await page.close();
  }

  // 2 · Confianza
  const want = ['Envío gratis + seguimiento', 'Pago seguro', '14 días para cambiar de opinión', 'Envíos internacionales'];
  const OLDCHIPS = /Compra protegida|Envíos a España|Envío con seguimiento/;
  for (const u of ['/', P]) {
    r = await get(u);
    const chips = [...r.html.matchAll(/<li class="g-trust__chip">([\s\S]*?)<span>([^<]+)<\/span>/g)];
    ok(`H9 ${u}: las 4 garantías definitivas, en orden, con sus iconos (envío, candado, devolución, globo)`,
      JSON.stringify(chips.map(c => c[2])) === JSON.stringify(want) && /M3 7h11v9H3z/.test(chips[0][1]) && /M8\.5 10\.5V7\.5/.test(chips[1][1]) && /M9 7L5 11l4 4/.test(chips[2][1]) && /circle cx="12" cy="12" r="8\.5"/.test(chips[3][1]) &&
      count(r.html, /<li class="g-trust__chip"><svg\s+class="g-icon"[^>]*stroke-width="1\.3"/g) === 4, chips.map(c => c[2]));
    ok(`H10 ${u}: sin los textos antiguos («Compra protegida», «Envíos a España», «Envío con seguimiento»)`, !OLDCHIPS.test(visible(r.html)));
  }
  const defs = ['featured-product.liquid', 'main-product.liquid'].map(f => Object.fromEntries(schema(f).blocks.find(b => b.type === 'garelon_trust').settings.filter(s => s.id).map(s => [s.id, s.default])));
  ok('H11 defaults del bloque «GARELON Confianza» (home y ficha) = textos definitivos, editables en el editor',
    defs.every(d => d.chip_1_text === want[0] && d.chip_2_text === want[1] && d.chip_3_text === want[2] && d.chip_4_text === want[3] && d.chip_2_icon === 'candado' && d.chip_4_icon === 'globo'), defs);
  const tpl = fs.readFileSync(`${THEME}/templates/index.json`, 'utf8') + fs.readFileSync(`${THEME}/templates/product.json`, 'utf8');
  ok('H12 plantillas sin los textos de garantía antiguos', !OLDCHIPS.test(tpl));

  // 3 · Para regalar · diseño «Etiquetas». Desde la ronda N (D31) la tienda no tiene etiquetas: se prueban 6 etiquetas
  // neutras inyectadas por el servidor (chips=1) para que el diseño siga cubierto para futuros productos.
  await setState('chips=1');
  for (const w of [320, 360, 375, 390, 430, 768, 1024, 1440, 2560]) {
    const { page } = await openPage(browser, '/', { width: w, height: 900 });
    const g = await page.evaluate(() => {
      const els = [...document.querySelectorAll('#regalo .g-chip')]; const rs = els.map(e => e.getBoundingClientRect());
      const ul = document.querySelector('#regalo .g-chips').getBoundingClientRect(); const cs = getComputedStyle(els[0]);
      const spans = els.map(e => { const s = e.querySelector('span').getBoundingClientRect(), c = e.getBoundingClientRect(); return s.left >= c.left - 0.5 && s.right <= c.right + 0.5 && s.top >= c.top - 0.5 && s.bottom <= c.bottom + 0.5; });
      const order = els.map(e => e.textContent.trim());
      return { n: els.length, cols: new Set(rs.map(q => Math.round(q.left))).size, rows: new Set(rs.map(q => Math.round(q.top))).size,
        ws: [...new Set(rs.map(q => Math.round(q.width)))], hs: [...new Set(rs.map(q => Math.round(q.height)))],
        inside: spans.every(Boolean), clip: els.some(e => e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1),
        ulw: Math.round(ul.width), centered: Math.abs((ul.left + ul.right) / 2 - innerWidth / 2) < 2,
        align: [cs.textAlign, cs.justifyContent, cs.alignItems], cursor: cs.cursor, fs: parseFloat(cs.fontSize),
        interactive: document.querySelectorAll('#regalo .g-chips button, #regalo .g-chips input, #regalo .g-chips a, #regalo .g-chips [tabindex], #regalo .g-chips [role="button"]').length,
        sw: document.documentElement.scrollWidth, vw: innerWidth, order,
        first: order.slice(0, innerWidth < 750 ? 2 : 3) };
    });
    const mobile = w < 750;
    ok(`H13 «Para regalar» ${w}px: ${mobile ? '2 columnas × 3 filas' : '3 columnas × 2 filas'}, tarjetas iguales, texto centrado y dentro, sin scroll horizontal`,
      g.n === 6 && g.cols === (mobile ? 2 : 3) && g.rows === (mobile ? 3 : 2) && g.ws.length === 1 && g.hs.length === 1 && g.inside && !g.clip && g.centered &&
      g.align.join() === 'center,center,center' && g.sw === g.vw && g.fs >= 14 && g.ulw <= 760 &&
      JSON.stringify(g.first) === JSON.stringify(mobile ? ['Etiqueta 1', 'Etiqueta 2'] : ['Etiqueta 1', 'Etiqueta 2', 'Etiqueta 3']), g);
    if (w === 390) ok('H14 «Para regalar»: etiquetas informativas, no seleccionables (sin botones, enlaces, foco ni cursor de mano)', g.interactive === 0 && g.cursor !== 'pointer', g);
    await page.close();
  }
  await setState('chips=0');

  r = await get('/');
  const det = (r.html.match(/id="detalles"[\s\S]*?<\/section>/) || [''])[0];
  ok('H15 «Detalles de la pulsera» sigue en lista (layout list sin cambios)', /class="g-facts"/.test(det) && count(det, /class="g-fact"/g) === 5 && !/g-chips/.test(det));

  // 4 · Opiniones
  await setState('reviews=both'); r = await get('/');
  const rev = (r.html.match(/<section[^>]*class="g-reviews[\s\S]*?<\/section>/) || [''])[0];
  ok('H16 título de opiniones: «Opiniones sobre esta pulsera» (y no el antiguo)', /<h2 class="h1 g-head__title">Opiniones sobre esta pulsera<\/h2>/.test(rev) && !/Lo que opinan quienes ya la llevan/.test(r.html));
  ok('H17 con opiniones: nota de origen visible tras el widget', /class="g-reviews__app"[\s\S]*<div class="g-reviews__note rte"><p>Incluye opiniones de compradores del mismo modelo, importadas mediante Judge\.me\.<\/p><\/div>/.test(rev));
  {
    const { page } = await openPage(browser, '/', { width: 390, height: 844 });
    const n = await page.evaluate(() => { const e = document.querySelector('.g-reviews__note'); const s = getComputedStyle(e); return { fs: parseFloat(s.fontSize), op: s.color }; });
    ok('H18 nota discreta (letra pequeña pero legible, 12–14 px)', n.fs >= 12 && n.fs <= 14, n);
    await page.close();
  }
  r = await get(P); ok('H19 ficha: mismo título y nota', /Opiniones sobre esta pulsera/.test(r.html) && /g-reviews__note/.test(r.html));
  await setState('reviews=summary'); r = await get('/');
  ok('H20 solo valoración de Shopify: también lleva la nota', /g-reviews__score/.test(r.html) && /g-reviews__note/.test(r.html));
  await setState('reviews=app'); r = await get('/');
  ok('H21 app sin opiniones sincronizadas: ni sección ni nota', !/g-reviews|Incluye opiniones de compradores/.test(r.html));
  await setState('design=1'); r = await get('/');
  ok('H22 editor con la sección en espera: aviso, pero la nota no ocupa espacio', /valoración sincronizada con Shopify es 0/.test(r.html) && !/g-reviews__note/.test(r.html));
  await setState('design=0&reviews=none'); r = await get('/');
  ok('H23 sin opiniones: ni sección, ni estrellas, ni nota', !/g-reviews|Incluye opiniones de compradores|class="rating"/.test(r.html));

  // 5 · Regresión de rutas y plantilla
  await reset();
  r = await get('/'); ok('H24 GET / → 200 home', r.status === 200 && r.tpl === 'index');
  r = await get('/ruta-inexistente-garelon'); ok('H25 GET /ruta-inexistente-garelon → 404', r.status === 404 && r.tpl === '404');
  r = await get(P); ok('H26 ficha → 200', r.status === 200 && r.tpl === 'product');
  r = await get('/cart'); ok('H27 carrito → 200', r.status === 200 && r.tpl === 'cart');
  r = await get('/pages/contacto'); ok('H28 contacto → 200 con formulario', r.status === 200 && /form[^>]*contact/i.test(r.html));
  let idx = null; try { idx = JSON.parse(fs.readFileSync(`${THEME}/templates/index.json`, 'utf8')); } catch (e) {}
  ok('H29 templates/index.json existe, es JSON válido y conserva las 9 secciones en orden', idx && JSON.stringify(idx.order) === JSON.stringify(['portada', 'compra', 'tranquilidad', 'opiniones', 'significado', 'detalles', 'regalo', 'preguntas', 'cierre']), idx && idx.order);
};
