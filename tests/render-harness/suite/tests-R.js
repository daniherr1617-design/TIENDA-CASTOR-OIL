// SOLO TEST · Fase R: la infografía llega a la tienda por un único camino, la familia versionada (D35).
// Auditoría de la ronda R: los WebP ya salían de «NUEVA IMAGEN 1.png», pero 1) la familia antigua
// producto-infografia-<ancho>.webp tenía el mismo nombre para la imagen antigua («Imagen 1.png», flechas
// incorrectas), la versión con pérdida y la buena, así que un tema subido antes no se distinguía por la URL;
// 2) una imagen elegida en el editor (Files) sustituía a la del tema en «Detalles»; 3) el marco redondeado
// recortaba las cuatro esquinas de la imagen y la lupa tapaba la esquina superior derecha.
// Ahora: producto-infografia-v2-<ancho>.webp en los tres sitios (galería de la home, «Detalles» y galería de la
// ficha) y en el enlace para ampliar, la imagen del editor no la sustituye y se ve entera, sin nada encima.
const T = require('./tests.js');
const { ok, get, setState, reset, count, openPage, B, THEME } = T;
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const IS_REPO = path.resolve(THEME) === REPO_ROOT;
const TOOL = path.join(REPO_ROOT, 'tools', 'garelon_infografia.py');
const P = '/products/pulsera-rosario-virgen-maria';
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const ASSET = T.assetBase('infografia');
const snippet = fs.readFileSync(`${THEME}/snippets/garelon-image.liquid`, 'utf8');
const WIDTHS = ((snippet.match(/when 'infografia'\s*assign widths = '([\d,]+)'/) || [])[1] || '').split(',').filter(Boolean).map(Number);
const OLD = /producto-infografia-(?!v2\b)/; // familia retirada (cualquier nombre producto-infografia-* que no sea v2)
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const RETIRED = JSON.parse(execFileSync('python3', ['-c',
  'import sys, json; sys.dont_write_bytecode = True; sys.path.insert(0, sys.argv[1]); import garelon_infografia as g; print(json.dumps(sorted(g.RETIRED_SHA256)))',
  path.dirname(TOOL)]).toString());
const infUrls = (html) => [...new Set([...html.matchAll(/\/assets\/producto-infografia[^"'\s,)]*/g)].map(m => m[0]))];
const SPOTS = [
  ['home · galería de compra', '/', '#comprar .g-gallery img[src*="infografia"]'],
  ['home · Detalles', '/', '#detalles img'],
  ['ficha · galería', P, '.g-gallery img[src*="infografia"]'],
];

module.exports = async function phaseR(browser) {
  await reset();
  // 1 · Una sola familia de assets, la versionada; nada de la antigua
  const files = fs.readdirSync(`${THEME}/assets`);
  const inf = files.filter(f => f.includes('infografia')).sort();
  ok(`R1 assets/: solo la familia ${ASSET}-<ancho>.webp (${WIDTHS.join('/')}), sin ningún producto-infografia-<ancho>.webp antiguo`,
    ASSET === 'producto-infografia-v2' && JSON.stringify(inf) === JSON.stringify(WIDTHS.map(w => `${ASSET}-${w}.webp`).sort()), inf);
  const retiredHere = files.filter(f => RETIRED.includes(sha(fs.readFileSync(`${THEME}/assets/${f}`))));
  ok(`R2 ninguna de las ${RETIRED.length} versiones antiguas (Imagen 1 y con pérdida, por SHA-256) está en assets/ con ningún nombre`, RETIRED.length === 8 && retiredHere.length === 0, retiredHere);
  const refs = [];
  for (const d of ['config', 'layout', 'locales', 'sections', 'snippets', 'templates']) {
    for (const f of fs.readdirSync(`${THEME}/${d}`)) if (OLD.test(fs.readFileSync(`${THEME}/${d}/${f}`, 'utf8'))) refs.push(`${d}/${f}`);
  }
  ok('R3 ninguna referencia a la familia antigua en el tema (snippets, secciones, plantillas, JSON, locales, layout, config)', refs.length === 0, refs);
  ok('R4 garelon-image: la clave infografia usa siempre la familia versionada y la imagen del editor no la sustituye',
    /if key == 'infografia'\s*assign asset = 'producto-infografia-v2'/.test(snippet) && /if image != blank and key != 'infografia'\s*assign use_editor = true/.test(snippet));

  // 2 · Render: todos los caminos (galería home, Detalles, galería ficha, enlace para ampliar) → la misma familia
  const expectSrcset = WIDTHS.map(w => `/assets/${ASSET}-${w}.webp ${w}w`).join(', ');
  for (const [u, n] of [['/', 2], [P, 1]]) {
    const r = await get(u);
    const imgs = [...r.html.matchAll(/<img[^>]*infografia[^>]*>/g)].map(m => m[0]);
    const zooms = [...r.html.matchAll(/<a\s+class="g-zoom"\s+href="([^"]+)"/g)].map(m => m[1]);
    ok(`R5 ${u}: ${n} infografía(s), todas con src, srcset y enlace para ampliar de ${ASSET}`, imgs.length === n && zooms.length === n &&
      imgs.every(i => i.includes(`src="/assets/${ASSET}-1254.webp"`) && i.includes(`srcset="${expectSrcset}"`)) && zooms.every(z => z === `/assets/${ASSET}-1254.webp`), { imgs: imgs.length, zooms });
  }
  for (const u of ['/', P, '/cart', '/pages/contacto', '/ruta-inexistente-garelon']) {
    const h = (await get(u)).html;
    ok(`R6 ${u}: ninguna URL de la familia antigua ni de Files para la infografía`, !OLD.test(h) && infUrls(h).every(x => x.startsWith(`/assets/${ASSET}-`)), infUrls(h).filter(x => !x.startsWith(`/assets/${ASSET}-`)));
  }
  // Lo que sirve el servidor es exactamente el archivo del tema (mismos bytes) y es WebP
  const served = [];
  for (const w of WIDTHS) {
    const res = await fetch(`${B}/assets/${ASSET}-${w}.webp`); const buf = Buffer.from(await res.arrayBuffer());
    served.push({ w, status: res.status, type: res.headers.get('content-type'), same: sha(buf) === sha(fs.readFileSync(`${THEME}/assets/${ASSET}-${w}.webp`)) });
  }
  ok('R7 cada URL de la familia responde 200 image/webp con los mismos bytes que el archivo del tema', served.every(s => s.status === 200 && /image\/webp/.test(s.type) && s.same), served);

  // 3 · Orígenes alternativos simulados: imagen elegida en el editor y multimedia del producto
  await setState('editorimg=1');
  let h = (await get('/')).html;
  const det = (h.match(/<section\s+id="detalles"[\s\S]*?<\/section>/) || [''])[0];
  const sig = (h.match(/id="shopify-section-template--1__significado"[\s\S]*?<\/section>/) || [''])[0];
  ok('R8 imagen del editor en «Detalles» (simulada: Files/Imagen_1.png): se sigue viendo la infografía aprobada, no la del editor',
    det.includes(`src="/assets/${ASSET}-1254.webp"`) && !/\/files\//.test(det), (det.match(/src="[^"]+"/) || [])[0]);
  ok('R9 control: la simulación sí llega a las demás secciones (la imagen del editor sigue mandando en las fotos que no son la infografía)', /\/files\/Imagen_1\.png/.test(sig), (sig.match(/src="[^"]+"/) || [])[0]);
  await setState('editorimg=0&media=1');
  for (const u of ['/', P]) {
    h = (await get(u)).html;
    ok(`R10 ${u} con multimedia del producto en Shopify (simulada): la galería sigue siendo la del tema y su infografía es ${ASSET}`,
      count(h, /class="g-gallery__slide[ "]/g) === 5 && infUrls(h).length > 0 && infUrls(h).every(x => x.startsWith(`/assets/${ASSET}-`)));
  }
  await reset();

  // 4 · Navegador: lo que se carga es la familia nueva y se ve entera (sin esquinas recortadas, sin nada encima)
  const bad = []; let n = 0;
  for (const w of VPS) {
    for (const [name, u, sel] of SPOTS) {
      const { page, errs } = await openPage(browser, u, { width: w, height: w < 750 ? 844 : 900 });
      const req = []; page.on('request', x => { if (/infografia/.test(x.url())) req.push(x.url().replace(B, '')); });
      const d = await page.evaluate(async (sel) => {
        const i = document.querySelector(sel); i.loading = 'eager'; i.scrollIntoView({ block: 'center', inline: 'center' }); await i.decode().catch(() => {}); await new Promise(r => setTimeout(r, 300));
        const b = i.getBoundingClientRect();
        // Recorte: cualquier antecesor que recorte (overflow ≠ visible) con esquinas redondeadas, o la propia imagen redondeada.
        const clip = [];
        for (let e = i; e && e !== document.body; e = e.parentElement) {
          const cs = getComputedStyle(e); const r = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].some(k => parseFloat(cs[k]) > 0);
          if (r && (e === i || cs.overflow !== 'visible')) clip.push(`${e.tagName}.${e.className}`);
        }
        // Encima: ningún elemento visible del enlace (lupa) ni de la página se pinta dentro de la caja de la imagen.
        const over = [...document.querySelectorAll('.g-zoom__hint, .g-zoom__hint *')].map(e => e.getBoundingClientRect())
          .filter(r => r.width && r.right > b.left + 0.5 && r.left < b.right - 0.5 && r.bottom > b.top + 0.5 && r.top < b.bottom - 0.5).length;
        const pts = [[0.02, 0.02], [0.98, 0.02], [0.02, 0.98], [0.98, 0.98], [0.93, 0.06], [0.5, 0.5]]
          .map(([x, y]) => document.elementsFromPoint(b.left + x * b.width, b.top + y * b.height)[0]).filter(e => e !== i).map(e => e ? (e.className || e.tagName) : 'fuera de la pantalla');
        return { cur: i.currentSrc.replace(location.origin, ''), clip, over, pts, w: b.width, h: b.height };
      }, sel);
      n++;
      const good = d.cur.startsWith(`/assets/${ASSET}-`) && d.clip.length === 0 && d.over === 0 && d.pts.length === 0 && Math.abs(d.w - d.h) < 1 &&
        req.every(x => x.startsWith(`/assets/${ASSET}-`)) && errs.length === 0;
      if (!good) bad.push({ w, name, ...d, req, errs });
      await page.close();
    }
  }
  ok(`R11 a 320/360/375/390/430/768/1024/1440 px, en las 3 ubicaciones: carga ${ASSET}, sin esquinas recortadas y sin nada encima de la imagen`, n === VPS.length * SPOTS.length && bad.length === 0, bad.slice(0, 3));

  // 5 · Herramienta: lo que sirve la tienda local es «NUEVA IMAGEN 1.png» (byte a byte y píxel a píxel)
  if (IS_REPO) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'garelon-r-'));
    const got = [];
    for (const w of WIDTHS) { const f = path.join(tmp, `${w}.webp`); fs.writeFileSync(f, Buffer.from(await (await fetch(`${B}/assets/${ASSET}-${w}.webp`)).arrayBuffer())); got.push(f); }
    const id = spawnSync('python3', [TOOL, '--identify', ...got], { encoding: 'utf8' });
    ok('R12 tools/garelon_infografia.py --identify sobre lo descargado del servidor: cada ancho ES «NUEVA IMAGEN 1.png»', id.status === 0 && count(id.stdout, /→ ES «NUEVA IMAGEN 1\.png»/g) === WIDTHS.length, id.stdout.trim().split('\n'));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
};
