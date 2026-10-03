// SOLO TEST · Fase I: imágenes aprobadas por el propietario (imagen 4 → «completa», Imagen 1 → «infografia»).
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const { execSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'aaf47b0';
// Alcance de I25/I27 fijado al rango aaf47b0..955bcc3 (fijado en la ronda L; las rondas siguientes tienen su propia prueba de alcance).
const ROUND_HEAD = '955bcc3';
const es = JSON.parse(fs.readFileSync(`${THEME}/locales/es.json`, 'utf8')).garelon.gallery;
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const WEBP = { completa: [480, 720, 1080], infografia: [480, 720, 1080, 1254] };
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const CLAIMS = /14\s*K|gold plated|hipoalerg|waterproof|resistente al agua|no se oxida|no pierde (el )?color|protecci[oó]n espiritual|milagr/i;

module.exports = async function (browser) {
  await reset();
  // 1 · Assets
  const bad = [];
  for (const [k, ws] of Object.entries(WEBP)) for (const w of ws) {
    const f = `${THEME}/assets/producto-${k}-${w}.webp`;
    if (!fs.existsSync(f)) { bad.push(`falta ${f}`); continue; }
    const b = fs.readFileSync(f);
    if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') bad.push(`${k}-${w} no es WebP`);
    if (b.length > 260 * 1024) bad.push(`${k}-${w} pesa ${b.length}`);
  }
  ok('I1 assets WebP de «completa» (480/720/1080) e «infografia» (480/720/1080/1254) existen, son WebP y pesan < 260 KB', bad.length === 0, bad);
  const dims = execSync(`python3 -c "
from PIL import Image;import glob
print(';'.join(f.split('/')[-1]+'='+'x'.join(map(str,Image.open(f).size)) for f in sorted(glob.glob('${THEME}/assets/producto-[ci]*.webp'))))"`).toString().trim();
  ok('I2 assets cuadrados al ancho de su nombre (sin recortes ni deformación)', dims.split(';').every(p => { const [n, d] = p.split('='); const w = n.match(/-(\d+)\.webp/)[1]; return d === `${w}x${w}`; }), dims);
  const REPO = fs.existsSync(`${THEME}/.git`); // I3, I25-I28: solo en el repositorio (el ZIP no lleva PNG, .md ni git)
  if (REPO) ok('I3 originales conservados como fuente («Imagen 1.png» e «imagen 4.png»)', fs.existsSync(`${THEME}/Imagen 1.png`) && fs.existsSync(`${THEME}/imagen 4.png`));
  const snip = fs.readFileSync(`${THEME}/snippets/garelon-image.liquid`, 'utf8');
  ok('I4 claves en el sistema GARELON existente (garelon-image), sin sistema paralelo', /when 'completa'\s*assign widths = '480,720,1080'/.test(snip) && /when 'infografia'\s*assign widths = '480,720,1080,1254'/.test(snip) && fs.readdirSync(`${THEME}/snippets`).filter(f => /^garelon-.*(gallery|galeria)/.test(f)).length === 1);

  // 2 · Alt
  ok('I5 alt reales en es y en los 31 idiomas, sin claims prohibidos', /^Vista completa de la Pulsera Rosario Virgen María Dorada/.test(es.alt_completa) && /^Infografía «Detalles de la pulsera»/.test(es.alt_infografia) && !CLAIMS.test(es.alt_completa + es.alt_infografia) &&
    fs.readdirSync(`${THEME}/locales`).filter(f => !/schema/.test(f)).every(f => { const g = JSON.parse(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')).garelon.gallery; return g.alt_completa && g.alt_infografia && g.zoom && g.zoom_label; }));

  // 3 · Home
  let r = await get('/');
  ok('I6 home → 200', r.status === 200 && r.tpl === 'index');
  const hg = gallery((r.html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0]);
  ok('I7 galería de compra (home): completa → detalle → infografía → principal → oración', JSON.stringify(slides(hg)) === JSON.stringify(['completa', 'detalle', 'infografia', 'principal', 'oracion']), slides(hg));
  ok('I8 galería home: alt de imagen 4 e Imagen 1 presentes', hg.includes(`alt="${esc(es.alt_completa)}"`) && hg.includes(`alt="${esc(es.alt_infografia)}"`) && !/alt=""/.test(hg));
  const det = (r.html.match(/<section\s+id="detalles"[\s\S]*?<\/section>/) || [''])[0];
  ok('I9 «Detalles de la pulsera» usa la infografía (Imagen 1) con su alt; los 5 hechos siguen', /producto-infografia-1254\.webp/.test(det) && !/producto-detalle-/.test(det) && /alt="Infografía «Detalles de la pulsera»/.test(det) && count(det, /class="g-fact"/g) === 5);
  ok('I10 infografía ampliable: enlace a la versión de 1254 px en pestaña nueva, con texto accesible', count(r.html, /<a\s+class="g-zoom"\s+href="\/assets\/producto-infografia-1254\.webp"\s+target="_blank"\s+rel="noopener"/g) === 2 && count(r.html, /class="visually-hidden">Ver ampliada/g) === 2);
  ok('I11 Imagen 1 solo en galería + Detalles (sin más duplicados en la home)', count(r.html, /<img[^>]*src="[^"]*producto-infografia/g) === 2 && count(r.html, /<img[^>]*src="[^"]*producto-completa/g) === 1);
  const urls = [...new Set([...r.html.matchAll(/\/assets\/producto-(?:completa|infografia)-\d+\.webp/g)].map(m => m[0]))];
  const st = await Promise.all(urls.map(u => fetch(B + u).then(x => x.status + ' ' + x.headers.get('content-type'))));
  ok('I12 todas las URL de las imágenes nuevas (srcset y enlace) responden 200 image/webp', urls.length === 7 && st.every(s => /^200 image\/webp/.test(s)), st);

  // 4 · Ficha
  r = await get(P); const m = (r.html.match(/<main[\s\S]*?<\/main>/) || [''])[0];
  ok('I13 ficha → 200', r.status === 200 && r.tpl === 'product');
  const pg = gallery(m);
  ok('I14 galería de la ficha: completa → principal → detalle → infografía → oración; solo la 1.ª prioritaria', JSON.stringify(slides(pg)) === JSON.stringify(['completa', 'principal', 'detalle', 'infografia', 'oracion']) && count(pg, /loading="eager"/g) === 1 && count(r.html, /fetchpriority="high"/g) === 1, slides(pg));
  ok('I15 ficha: alt de imagen 4 e Imagen 1', pg.includes(`alt="${esc(es.alt_completa)}"`) && pg.includes(`alt="${esc(es.alt_infografia)}"`));

  // 5 · Responsive, swipe y legibilidad
  for (const u of ['/', P]) for (const w of VPS) {
    const { page, errs } = await openPage(browser, u, { width: w, height: w < 750 ? 844 : 900 });
    const sel = u === '/' ? '#comprar .g-gallery' : 'main .g-gallery';
    const res = await page.evaluate(async (sel) => {
      const g = document.querySelector(sel); const track = g.querySelector('.g-gallery__track');
      const imgs = [...g.querySelectorAll('img')];
      for (const i of imgs) { i.loading = 'eager'; } await new Promise(r => setTimeout(r, 600));
      const shapes = imgs.map(i => { const b = i.getBoundingClientRect(); return Math.abs(b.width - b.height) <= 1.5 && i.naturalWidth > 0 && i.naturalWidth === i.naturalHeight; });
      const inf = g.querySelector('img[src*="infografia"]').getBoundingClientRect();
      const cw = document.documentElement.clientWidth;
      return { sw: document.documentElement.scrollWidth, cw, shapes, inf: Math.round(inf.width), snap: getComputedStyle(track).scrollSnapType, scrolls: track.scrollWidth > track.clientWidth + 5 };
    }, sel);
    const mobile = w < 750;
    ok(`I16 ${u === '/' ? 'home' : 'ficha'} ${w}px: sin scroll horizontal; 5 imágenes cargadas, cuadradas y sin deformar`, res.sw <= res.cw && res.shapes.length === 5 && res.shapes.every(Boolean), res);
    if (mobile) ok(`I17 ${u === '/' ? 'home' : 'ficha'} ${w}px: carrusel deslizable (scroll-snap x) y la infografía ocupa ≥ 88 % del ancho`, /x mandatory/.test(res.snap) && res.scrolls && res.inf >= 0.88 * res.cw, res);
    if (u === '/') {
      const d = await page.evaluate(() => { const i = document.querySelector('#detalles img'); const b = i.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), cw: document.documentElement.clientWidth }; });
      ok(`I18 home ${w}px: infografía de Detalles grande y cuadrada (móvil ≥ 88 % del ancho; tableta y escritorio ≥ 400 px)`, Math.abs(d.w - d.h) <= 1 && (mobile ? d.w >= 0.88 * d.cw : d.w >= 400), d);
    }
    ok(`I19 ${u === '/' ? 'home' : 'ficha'} ${w}px: sin errores JS ni peticiones fallidas`, errs.length === 0, errs);
    await page.close();
  }
  {
    // Deslizar en móvil hasta imagen 4 y hasta Imagen 1 (gesto táctil real con CDP).
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage(); await page.goto(B + '/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelector('#comprar .g-gallery').scrollIntoView());
    await page.waitForTimeout(300);
    const box = await page.evaluate(() => { const b = document.querySelector('#comprar .g-gallery__track').getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
    const cdp = await ctx.newCDPSession(page); const y = box.y + box.h / 2;
    const swipe = async () => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.w * 0.85, y }] });
      for (let i = 1; i <= 10; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x + box.w * (0.85 - 0.05 * i), y }] }); await page.waitForTimeout(25); }
      // gesto normal: se suelta sin pausa (una pausa larga + arrastre < 50 % vuelve a la misma foto, como en cualquier carrusel con snap)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(700);
    };
    const visible = () => page.evaluate(() => { const t = document.querySelector('#comprar .g-gallery__track'); const tb = t.getBoundingClientRect();
      return [...t.querySelectorAll('.g-gallery__slide')].map(s => { const b = s.getBoundingClientRect(); return Math.max(0, Math.min(b.right, tb.right) - Math.max(b.left, tb.left)) / b.width; })
        .map((v, i) => [i, v]).sort((a, b) => b[1] - a[1])[0][0]; });
    const seen = [await visible()];
    for (let i = 0; i < 4; i++) { await swipe(); seen.push(await visible()); }
    ok('I20 móvil 390 px: el gesto de deslizar recorre la galería (imagen 4 → … → Imagen 1 → oración)', JSON.stringify(seen) === JSON.stringify([0, 1, 2, 3, 4]), seen);
    await ctx.close();
  }

  // 6 · Compra y variantes siguen funcionando con la galería nueva
  await setState('mode=pack3save&reset=1');
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('label:has-text("3 pulseras")'); await page.waitForTimeout(900);
    const idv = await page.evaluate(() => document.querySelector('#comprar form[id^="product-form-template"] input[name="id"]').value);
    await page.click('#comprar [id^="ProductSubmitButton-"]'); await page.waitForTimeout(1200);
    const s = await (await fetch(B + '/__state')).json();
    const drawer = await page.evaluate(() => { const d = document.querySelector('cart-drawer'); return d && d.classList.contains('active') ? d.innerText : ''; });
    ok('I21 home: variante «3 pulseras» (4103) → carrito con 1 unidad y cajón abierto', idv === '4103' && s.cart.length === 1 && s.cart[0].quantity === 1 && /3 pulseras/.test(drawer), { idv, cart: s.cart.length });
    ok('I22 sin errores JS durante la compra', errs.length === 0, errs);
    await page.close();
  }
  r = await get('/cart'); ok('I23 /cart → 200', r.status === 200 && r.tpl === 'cart');
  await reset();
  r = await get('/ruta-inexistente-garelon'); ok('I24 ruta inexistente → 404', r.status === 404 && r.tpl === '404');

  if (!REPO) return;
  // 7 · index.json: solo cambian las claves de imagen; el resto (hero sin precio incluido) intacto
  const before = JSON.parse(execSync(`git -C ${THEME} show ${BASE}:templates/index.json`).toString());
  const now = JSON.parse(execSync(`git -C ${THEME} show ${ROUND_HEAD}:templates/index.json`).toString());
  const diffs = [];
  const walk = (a, b, p) => { if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) diffs.push(p); return; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k); };
  walk(before, now, '');
  ok('I25 index.json intacto salvo galería de compra, imagen de Detalles y sello de tranquilidad', JSON.stringify(diffs.sort()) === JSON.stringify(['.sections.compra.settings.garelon_gallery_keys', '.sections.detalles.settings.image_alt', '.sections.detalles.settings.image_key', '.sections.tranquilidad.settings.garelon_badge']), diffs);
  ok('I26 hero sin precio (show_price false) y mismo orden de secciones', now.sections.portada.settings.show_price === false && JSON.stringify(now.order) === JSON.stringify(before.order));
  const pj = (x) => { const j = JSON.parse(x); delete j.sections.main.settings.garelon_gallery_keys; delete j.sections.tranquilidad.settings.garelon_badge; return JSON.stringify(j); };
  ok('I27 product.json: solo cambia el orden de la galería (y el sello de tranquilidad)', pj(execSync(`git -C ${THEME} show ${BASE}:templates/product.json`).toString()) === pj(execSync(`git -C ${THEME} show ${ROUND_HEAD}:templates/product.json`).toString()));

  // 8 · Documentación: aprobadas por el propietario, sin «descartadas» vigentes
  const doc = fs.readFileSync(`${THEME}/GARELON-RECONSTRUCCION-LIMPIA.md`, 'utf8');
  ok('I28 documentación: verificación del propietario registrada y sin «Descartada» para estas imágenes', /Verificación del propietario:\*\* `Imagen 1\.png` e `imagen 4\.png` corresponden al producto real y están aprobadas para uso en la tienda/.test(doc) && !/`(imagen 4|Imagen 1)\.png`[^\n]*\*\*Descartada/.test(doc));
};
