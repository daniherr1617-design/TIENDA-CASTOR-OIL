// SOLO TEST · Fase L: corrección de fidelidad de la imagen principal. «NUEVA IMAGEN 3.png» (verificada por el
// propietario: cruz integrada en la pulsera, unida por los extremos de su eje largo, nada colgando) sustituye a
// «imagen 3.png» como fuente de `principal` y del recorte `detalle`. Mismo slot, misma clave, mismo orden de galería.
const T = require('./tests.js');
const { ok, get, setState, reset, text, openPage, THEME } = T;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = 'fb4b850'; // HEAD antes de la ronda L
const REPO = fs.existsSync(THEME + '/.git');
const NEW_SRC = 'NUEVA IMAGEN 3.png';
const OLD_SRC = 'imagen 3.png';
const DETALLE_BOX = [330, 330, 930, 930]; // mismo recorte que en la Fase C (b25a05d), sin ampliar
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const OTHER = ['completa', 'infografia', 'oracion'];

const snippet = fs.readFileSync(`${THEME}/snippets/garelon-image.liquid`, 'utf8');
const widthsOf = (k) => ((snippet.match(new RegExp(`when '${k}'\\s*assign widths = '([\\d,]+)'`)) || [])[1] || '').split(',').filter(Boolean);
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
const flat = (o, p = '', out = {}) => { for (const [k, v] of Object.entries(o)) (v && typeof v === 'object') ? flat(v, p + k + '.', out) : (out[p + k] = v); return out; };
const atBase = (f) => execFileSync('git', ['-C', THEME, 'show', `${BASE}:${f}`], { maxBuffer: 64 * 1024 * 1024 });

// Distancia media (0-255) en la zona de la cruz entre cada asset y la misma derivación hecha desde una fuente.
function crossDistance(srcPath) {
  const py = `
import sys, json
from PIL import Image, ImageChops, ImageStat
src = Image.open(sys.argv[1]).convert('RGB'); R = (400, 560, 640, 820)  # zona de la cruz en la fuente de 1254 px
out = {}
for name, box, ws in (('principal', (0, 0, 1254, 1254), json.loads(sys.argv[3])), ('detalle', tuple(json.loads(sys.argv[4])), json.loads(sys.argv[5]))):
    for w in ws:
        w = int(w); cur = Image.open(f'{sys.argv[2]}/assets/producto-{name}-{w}.webp').convert('RGB'); k = w / (box[2] - box[0])
        r = tuple(round((v - box[i % 2]) * k) for i, v in enumerate(R))
        ref = src.crop(box).resize((w, w), Image.LANCZOS).crop(r)
        out[f'{name}-{w}'] = round(sum(ImageStat.Stat(ImageChops.difference(cur.crop(r), ref)).mean) / 3, 2)
print(json.dumps(out))`;
  return JSON.parse(execFileSync('python3', ['-c', py, srcPath, THEME, JSON.stringify(widthsOf('principal')), JSON.stringify(DETALLE_BOX), JSON.stringify(widthsOf('detalle'))]).toString());
}

module.exports = async function (browser) {
  // 1 · Assets `principal` y `detalle`: existen, con los anchos del snippet, cuadrados y WebP
  const dims = JSON.parse(execFileSync('python3', ['-c', `
import sys, json, glob
from PIL import Image
print(json.dumps({f.split('/')[-1]: [Image.open(f).format, *Image.open(f).size] for f in sorted(glob.glob(sys.argv[1] + '/assets/producto-*.webp'))}))`, THEME]).toString());
  for (const k of ['principal', 'detalle']) {
    const ws = widthsOf(k);
    ok(`L1 assets «${k}» con los anchos de garelon-image (${ws.join('/')}), cuadrados y WebP`, ws.length > 0 &&
      ws.every(w => { const d = dims[`producto-${k}-${w}.webp`]; return d && d[0] === 'WEBP' && d[1] === Number(w) && d[2] === Number(w); }) &&
      Object.keys(dims).filter(f => f.startsWith(`producto-${k}-`)).length === ws.length, ws.map(w => dims[`producto-${k}-${w}.webp`]));
  }
  ok('L2 los anchos de las claves no cambian (principal 480/720/1080, detalle 480/600)', widthsOf('principal').join() === '480,720,1080' && widthsOf('detalle').join() === '480,600');

  // 2 · Render: la imagen nueva está en todos los sitios de la antigua; el orden de las galerías no cambia
  await reset(); await setState('mode=pack3save');
  const home = await get('/'); const prod = await get(P);
  const hero = (home.html.match(/<section[^>]*class="[^"]*g-hero[\s\S]*?<\/section>/) || [''])[0];
  const heroImg = (hero.match(/<img[^>]*producto-principal-[^>]*>/) || [''])[0];
  ok('L3 portada: imagen `principal` (eager, srcset 480/720/1080) con alt fiel «cruz integrada en la pulsera»',
    /producto-principal-480\.webp/.test(heroImg) && /producto-principal-720\.webp/.test(heroImg) && /producto-principal-1080\.webp/.test(heroImg) &&
    /loading="eager"/.test(heroImg) && /alt="[^"]*cruz integrada en la pulsera[^"]*"/.test(heroImg) && !/colgante/.test(heroImg), heroImg.slice(0, 200));
  const hg = slides(gallery((home.html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0]));
  const pg = slides(gallery((prod.html.match(/<main[\s\S]*?<\/main>/) || [''])[0]));
  ok('L4 galería de la home sin cambios: completa → detalle → infografía → principal → oración', JSON.stringify(hg) === JSON.stringify(['completa', 'detalle', 'infografia', 'principal', 'oracion']), hg);
  ok('L5 galería de la ficha sin cambios: completa → principal → detalle → infografía → oración', JSON.stringify(pg) === JSON.stringify(['completa', 'principal', 'detalle', 'infografia', 'oracion']), pg);
  const detImg = (prod.html.match(/id="detalles"[\s\S]*?<\/section>/) || [''])[0];
  ok('L6 ficha · «Detalles de la pulsera» sigue usando `detalle` (480/600)', /producto-detalle-480\.webp/.test(detImg) && /producto-detalle-600\.webp/.test(detImg));
  const storefront = text(home.html) + text(prod.html) + home.html + prod.html;
  ok('L7 ningún alt ni texto de la tienda describe una cruz colgante', !/cruz colgante|hanging cross/i.test(storefront));
  ok('L8 alt de `detalle` sin cambios (sigue siendo fiel)', JSON.parse(fs.readFileSync(`${THEME}/locales/es.json`, 'utf8')).garelon.gallery.alt_detalle === 'Detalle de la pulsera rosario: medalla ovalada de la Virgen María con borde de pequeñas piedras, cruz y cuentas tricolor');

  // 3 · Responsive: la imagen nueva carga en la portada, en las galerías y en «Detalles»
  for (const u of ['/', P]) for (const w of VPS) {
    const { page, errs } = await openPage(browser, u, { width: w, height: w < 750 ? 844 : 900 });
    const res = await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll('img')].filter(i => /producto-(principal|detalle)-/.test(i.currentSrc || i.src));
      for (const i of imgs) { i.loading = 'eager'; if (!i.complete) await new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 3000); }); }
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
        imgs: imgs.map(i => ({ key: (i.currentSrc || i.src).match(/producto-(\w+)-/)[1], ok: i.complete && i.naturalWidth > 0, sq: i.naturalWidth === i.naturalHeight })) };
    });
    const keys = [...new Set(res.imgs.map(i => i.key))].sort();
    ok(`L9 ${u === '/' ? 'home' : 'ficha'} ${w}px: «principal» y «detalle» cargan (cuadradas), sin scroll horizontal ni errores JS`,
      JSON.stringify(keys) === '["detalle","principal"]' && res.imgs.every(i => i.ok && i.sq) && res.sw <= res.cw && errs.length === 0, { keys, n: res.imgs.length, bad: res.imgs.filter(i => !i.ok), sw: res.sw, errs });
    await page.close();
  }
  await reset();

  // 4 · Locales: solo cambia el alt de `principal` (es: «cruz integrada en la pulsera»; resto en inglés)
  const locs = fs.readdirSync(`${THEME}/locales`).filter(f => !/schema/.test(f));
  const alt = (f) => JSON.parse(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')).garelon.gallery.alt_principal;
  ok('L10 alt_principal corregido en los 31 idiomas, sin «colgante»/«hanging»', locs.length === 31 && alt('es.json') === 'Pulsera rosario de acabado dorado en la muñeca, con medalla ovalada de la Virgen María, cruz integrada en la pulsera y cuentas en tonos dorado, plateado y rosado' &&
    locs.filter(f => f !== 'es.json').every(f => /cross integrated into the bracelet/.test(alt(f))) && locs.every(f => !/colgante|hanging/i.test(alt(f))));

  if (!REPO) return;
  // 5 · Origen: la nueva fuente alimenta los assets; la antigua ya no
  ok('L11 fuente nueva en el repositorio y la antigua retirada (como en main)', fs.existsSync(`${THEME}/${NEW_SRC}`) && !fs.existsSync(`${THEME}/${OLD_SRC}`));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'garelon-old3-')); const oldPath = path.join(tmp, 'old.png');
  fs.writeFileSync(oldPath, atBase(OLD_SRC));
  const dNew = crossDistance(`${THEME}/${NEW_SRC}`); const dOld = crossDistance(oldPath);
  fs.rmSync(tmp, { recursive: true, force: true });
  ok('L12 «principal» y «detalle» salen de NUEVA IMAGEN 3.png (zona de la cruz: ≈ igual a la nueva, muy distinta de la antigua)',
    Object.keys(dNew).length === 5 && Object.values(dNew).every(v => v < 5) && Object.values(dOld).every(v => v > 12), { dNew, dOld });

  // 6 · Alcance de la ronda L frente a fb4b850
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} -- assets config layout sections snippets templates`).toString().trim().split('\n').filter(Boolean).sort();
  ok('L13 archivos del tema tocados: solo los 5 WebP de principal/detalle y el alt de la portada', JSON.stringify(changed) === JSON.stringify(['assets/producto-detalle-480.webp', 'assets/producto-detalle-600.webp', 'assets/producto-principal-1080.webp', 'assets/producto-principal-480.webp', 'assets/producto-principal-720.webp', 'templates/index.json']), changed);
  const walk = (a, b, p, d) => { if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) { if (JSON.stringify(a) !== JSON.stringify(b)) d.push(p); return d; }
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], p + '.' + k, d); return d; };
  const di = walk(JSON.parse(atBase('templates/index.json')), JSON.parse(fs.readFileSync(`${THEME}/templates/index.json`, 'utf8')), '', []);
  ok('L14 index.json: solo cambia el alt de la imagen de la portada (fidelidad)', JSON.stringify(di) === '[".sections.portada.settings.image_alt"]', di);
  ok('L15 product.json sin cambios', atBase('templates/product.json').equals(fs.readFileSync(`${THEME}/templates/product.json`)));
  const others = fs.readdirSync(`${THEME}/assets`).filter(f => OTHER.some(k => f.startsWith(`producto-${k}-`)));
  ok('L16 resto de imágenes intacto: completa, infografía y oración (assets) y fuentes Imagen 1 / imagen 2 / imagen 4',
    others.length === 10 && others.every(f => atBase(`assets/${f}`).equals(fs.readFileSync(`${THEME}/assets/${f}`))) &&
    ['Imagen 1.png', 'imagen 2.png', 'imagen 4.png'].every(f => atBase(f).equals(fs.readFileSync(`${THEME}/${f}`))), others.length);
  const locDiff = locs.map(f => { const a = flat(JSON.parse(atBase(`locales/${f}`))); const b = flat(JSON.parse(fs.readFileSync(`${THEME}/locales/${f}`, 'utf8')));
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => a[k] !== b[k]); });
  ok('L17 locales: el único cambio es garelon.gallery.alt_principal', locDiff.every(d => JSON.stringify(d) === '["garelon.gallery.alt_principal"]'), locDiff.filter(d => d.length !== 1).slice(0, 2));
};
