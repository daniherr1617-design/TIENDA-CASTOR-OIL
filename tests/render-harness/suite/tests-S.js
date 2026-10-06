// SOLO TEST · Fase S: el propietario sustituyó «NUEVA IMAGEN 1.png» por una versión sin las líneas indicadoras (D36).
// La versión nueva (subida a main en a173b6a con el nombre «IMAGENN 1.png», copiada byte a byte) es la única fuente;
// la anterior (3795161c…) queda retirada. La infografía pasa a la familia producto-infografia-v3-<ancho>.webp, generada
// solo desde ella (reducción proporcional + WebP lossless). Las pruebas comparan con la fuente vigente: no esperan ni
// dibujan las líneas antiguas. Las únicas líneas que aparecen aquí son las de un control negativo sobre una copia en
// memoria, para demostrar que algo añadido se detectaría.
const T = require('./tests.js');
const { ok, get, reset, openPage, B, THEME } = T;
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const IS_REPO = path.resolve(THEME) === REPO_ROOT;
const TOOL = path.join(REPO_ROOT, 'tools', 'garelon_infografia.py');
const SRC = path.join(REPO_ROOT, 'NUEVA IMAGEN 1.png');
const OWNER_UPLOAD = ['a173b6a', 'IMAGENN 1.png']; // subida del propietario a main (2026-10-06)
const PREVIOUS_SHA256 = '3795161cabb89ae32b7a4d9ac9acb8b770dc76f62c5795817743a9a6ddb3db0e'; // versión anterior, retirada
const P = '/products/pulsera-rosario-virgen-maria';
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const ASSET = T.assetBase('infografia');
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const tool = JSON.parse(execFileSync('python3', ['-c',
  'import sys, json; sys.dont_write_bytecode = True; sys.path.insert(0, sys.argv[1]); import garelon_infografia as g; '
  + 'print(json.dumps({"asset": g.ASSET, "source": g.SOURCE_SHA256, "retired_sources": sorted(g.RETIRED_SOURCE_SHA256), "max_struct": g.MAX_STRUCT}))',
  path.dirname(TOOL)]).toString());
const SPOTS = [
  ['home · galería de compra', '/', '#comprar .g-gallery img[src*="infografia"]'],
  ['home · Detalles', '/', '#detalles img'],
  ['ficha · galería', P, '.g-gallery img[src*="infografia"]'],
];
// Referencias en memoria, generadas solo desde la fuente vigente: la fuente reducida (LANCZOS) a cada ancho de la
// familia y, como control negativo, la misma con unas líneas finas y un punto de más. Se guardan como PNG en una carpeta
// temporal; nada se escribe en el tema ni en el repositorio.
const REFS = `
import sys, json
from PIL import Image, ImageDraw
src = Image.open(sys.argv[1]).convert('RGB'); W = src.width
ctl = src.copy(); d = ImageDraw.Draw(ctl)
d.line((0.20 * W, 0.20 * W, 0.42 * W, 0.42 * W), fill=(196, 150, 60), width=4)
d.line((0.78 * W, 0.24 * W, 0.62 * W, 0.36 * W), fill=(196, 150, 60), width=4)
d.ellipse((0.42 * W - 9, 0.42 * W - 9, 0.42 * W + 9, 0.42 * W + 9), fill=(255, 255, 255))
out = {}
for w in json.loads(sys.argv[3]):
    for name, im in (('ref', src), ('ctl', ctl)):
        f = f'{sys.argv[2]}/{name}-{w}.png'
        (im if w == W else im.resize((w, round(im.height * w / W)), Image.LANCZOS)).save(f)
        out[f'{name}-{w}'] = f
print(json.dumps(out))`;
// Píxeles distintos (> 8/255 en algún canal) entre dos capturas del mismo elemento.
const DIFF = `
import sys, json
from PIL import Image, ImageChops
res = {}
for a, b in zip(sys.argv[1::2], sys.argv[2::2]):
    A = Image.open(a).convert('RGB'); Bm = Image.open(b).convert('RGB')
    if A.size != Bm.size:
        res[a + '|' + b] = {'size': [A.size, Bm.size], 'px': -1, 'peak': 255}; continue
    d = ImageChops.difference(A, Bm)
    m = d.convert('L').point(lambda v: 255 if v > 8 else 0)
    res[a + '|' + b] = {'px': m.histogram()[255], 'peak': max(e[1] for e in d.getextrema())}
print(json.dumps(res))`;
// Sustituye la imagen mostrada por una referencia en el MISMO <img> (misma caja, mismo reescalado del navegador) y captura.
async function swapShot(page, sel, dataUrl, file) {
  const rect = await page.evaluate(async ([sel, url]) => {
    const i = document.querySelector(sel); i.removeAttribute('srcset'); i.src = url;
    await i.decode().catch(() => {}); await new Promise(r => setTimeout(r, 150));
    const b = i.getBoundingClientRect();
    // El cambio se ha hecho de verdad: el navegador muestra ese PNG (y no sigue con el WebP servido).
    return { loaded: i.complete && i.currentSrc === url && i.naturalWidth > 0, rect: [b.x, b.y, b.width, b.height].map(v => Math.round(v * 100) / 100) };
  }, [sel, dataUrl]);
  await page.locator(sel).screenshot({ path: file });
  return rect.loaded ? rect.rect : null;
}

module.exports = async function phaseS(browser) {
  await reset();
  // 1 · La fuente es la versión nueva del propietario, no la anterior
  const buf = fs.existsSync(SRC) ? fs.readFileSync(SRC) : Buffer.alloc(0);
  const digest = sha(buf);
  const dims = buf.length ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : [];
  ok(`S1 «NUEVA IMAGEN 1.png» es la versión aprobada vigente (SHA-256 ${String(tool.source).slice(0, 8)}…, 1254x1254), distinta de la anterior 3795161c…`,
    digest === tool.source && digest !== PREVIOUS_SHA256 && dims.join() === '1254,1254', { digest, dims });
  ok('S2 la versión anterior (3795161c…) está registrada como fuente retirada en tools/garelon_infografia.py',
    tool.retired_sources.includes(PREVIOUS_SHA256) && !tool.retired_sources.includes(tool.source), tool.retired_sources);
  if (IS_REPO) {
    const up = spawnSync('git', ['-C', REPO_ROOT, 'cat-file', 'blob', `${OWNER_UPLOAD[0]}:${OWNER_UPLOAD[1]}`], { maxBuffer: 64 * 1024 * 1024 });
    ok(`S3 la fuente es byte a byte la subida del propietario a GitHub (main ${OWNER_UPLOAD[0]}, «${OWNER_UPLOAD[1]}»)`,
      up.status === 0 && sha(up.stdout) === digest, up.status === 0 ? sha(up.stdout).slice(0, 16) : String(up.stderr).trim());
  }

  // 2 · Familia v3: solo ella en el tema, generada desde la fuente vigente
  const inf = fs.readdirSync(`${THEME}/assets`).filter(f => f.includes('infografia')).sort();
  ok('S4 assets/: solo producto-infografia-v3-{480,720,1080,1254}.webp; nada de la familia antigua ni de la v2',
    ASSET === 'producto-infografia-v3' && ASSET === tool.asset && JSON.stringify(inf) === JSON.stringify([480, 720, 1080, 1254].map(w => `${ASSET}-${w}.webp`).sort()), inf);
  const leftovers = [];
  for (const d of ['config', 'layout', 'locales', 'sections', 'snippets', 'templates']) {
    for (const f of fs.readdirSync(`${THEME}/${d}`)) if (/producto-infografia-(?:v2\b|\d)/.test(fs.readFileSync(`${THEME}/${d}/${f}`, 'utf8'))) leftovers.push(`${d}/${f}`);
  }
  for (const u of ['/', P, '/cart', '/pages/contacto', '/ruta-inexistente-garelon']) {
    if (/producto-infografia-(?:v2\b|\d)/.test((await get(u)).html)) leftovers.push(u);
  }
  ok('S5 ninguna referencia activa a producto-infografia-<ancho> ni a producto-infografia-v2-<ancho> (archivos del tema y páginas servidas)', leftovers.length === 0, leftovers);
  const chk = spawnSync('python3', [TOOL, '--check', '--theme', THEME, '--source', SRC], { encoding: 'utf8' });
  ok('S6 tools/garelon_infografia.py --check: los 4 WebP v3 son lossless, sin recorte ni ampliación, píxel a píxel la fuente vigente y sin diferencias concentradas',
    chk.status === 0 && /0\.000, máxima 0\/255/.test(chk.stdout), chk.stdout.trim().split('\n').slice(-6));

  // 3 · Navegador: lo que se ve en los 3 sitios y en la imagen ampliada es la fuente vigente, sin nada añadido.
  // Para cada captura, el mismo <img> se vuelve a pintar con la fuente reducida (en memoria) y se compara: el WebP servido
  // y la fuente deben dar exactamente los mismos píxeles en pantalla. Control: la fuente con líneas de más debe diferir.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'garelon-s-'));
  const refs = JSON.parse(execFileSync('python3', ['-c', REFS, SRC, tmp, JSON.stringify([480, 720, 1080, 1254])]).toString());
  const data = {}; for (const [k, f] of Object.entries(refs)) data[k] = 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
  const rows = []; const geo = [];
  const capture = async (page, sel, w, name, extra) => {
    const d = await page.evaluate(async (sel) => {
      const i = document.querySelector(sel); i.loading = 'eager'; i.scrollIntoView({ block: 'center', inline: 'center' });
      i.setAttribute('data-garelon-s', ''); // marca: tras cambiar el src, el selector original (src*="infografia") ya no lo encuentra
      await i.decode().catch(() => {}); await new Promise(r => setTimeout(r, 300));
      const b = i.getBoundingClientRect(); const a = i.closest('a.g-zoom');
      return { cur: i.currentSrc.replace(location.origin, ''), nw: i.naturalWidth, nh: i.naturalHeight, rect: [b.x, b.y, b.width, b.height].map(v => Math.round(v * 100) / 100), href: a ? a.getAttribute('href') : null };
    }, sel);
    const base = path.join(tmp, `${w}-${rows.length}`);
    const mark = '[data-garelon-s]';
    await page.locator(mark).screenshot({ path: `${base}-servida.png` });
    // Ancho del archivo que ha elegido el navegador (con srcset, naturalWidth viene corregido por la densidad).
    const fw = Number((d.cur.match(/-(\d+)\.webp$/) || [])[1]);
    const okRef = data[`ref-${fw}`] !== undefined;
    const r1 = okRef ? await swapShot(page, mark, data[`ref-${fw}`], `${base}-fuente.png`) : null;
    const r2 = okRef ? await swapShot(page, mark, data[`ctl-${fw}`], `${base}-control.png`) : null;
    rows.push({ w, name, base, fw, ok: okRef, same: okRef && JSON.stringify(r1) === JSON.stringify(d.rect) && JSON.stringify(r2) === JSON.stringify(d.rect) });
    geo.push({ w, name, ...d, ...extra });
    return d;
  };
  for (const w of VPS) {
    const vp = { width: w, height: w < 750 ? 844 : 900 };
    let zoom = null;
    for (const [name, u, sel] of SPOTS) {
      const { page, errs } = await openPage(browser, u, vp);
      const d = await capture(page, sel, w, name, { errs });
      zoom = zoom || d.href;
      await page.close();
    }
    // Imagen ampliada: la URL del enlace «Ampliar», abierta como la abre el navegador (visor de imagen, encajada en la ventana)
    const page = await browser.newPage({ viewport: vp });
    const res = await page.goto(B + zoom);
    await capture(page, 'img', w, 'imagen ampliada', { errs: [], href: zoom, status: res.status(), type: res.headers()['content-type'] });
    await page.close();
  }
  const badGeo = geo.filter(g => !(g.cur && g.cur.startsWith(`/assets/${ASSET}-`) && g.href === `/assets/${ASSET}-1254.webp` && g.errs.length === 0 &&
    (g.name !== 'imagen ampliada' || (g.status === 200 && /image\/webp/.test(g.type) && g.nw === 1254 && g.nh === 1254))));
  ok(`S7 a 320/360/375/390/430/768/1024/1440 px: galería de la home, «Detalles», galería de la ficha e imagen ampliada cargan ${ASSET} (la ampliada, 1254x1254 image/webp)`,
    geo.length === VPS.length * (SPOTS.length + 1) && badGeo.length === 0, badGeo.slice(0, 3));
  const diff = JSON.parse(execFileSync('python3', ['-c', DIFF, ...rows.filter(r => r.ok).flatMap(r => [`${r.base}-servida.png`, `${r.base}-fuente.png`, `${r.base}-servida.png`, `${r.base}-control.png`])],
    { maxBuffer: 16 * 1024 * 1024 }).toString());
  const out = rows.map(r => ({ w: r.w, name: r.name, archivo: r.fw, same_box: r.same, fuente: diff[`${r.base}-servida.png|${r.base}-fuente.png`], control: diff[`${r.base}-servida.png|${r.base}-control.png`] }));
  const bad = out.filter(r => !(r.same_box && r.fuente && r.fuente.px === 0));
  ok(`S8 en las ${out.length} capturas (4 sitios × 8 anchos) lo que se ve es exactamente la fuente vigente: repintado con «NUEVA IMAGEN 1.png» reducida, el mismo elemento da los mismos píxeles en pantalla (0 píxeles distintos; sin nada añadido, quitado ni movido)`,
    out.length === VPS.length * (SPOTS.length + 1) && bad.length === 0, bad.length ? bad.slice(0, 3) : { peor_pico: Math.max(...out.map(r => r.fuente.peak)) });
  const weak = out.filter(r => !(r.control && r.control.px >= 20));
  ok('S9 control negativo: repintado con la fuente más unas líneas finas, la comparación falla en todas las capturas (algo añadido se detecta)',
    weak.length === 0, weak.length ? weak.slice(0, 3) : { menos_pixeles_control: Math.min(...out.map(r => r.control.px)) });
  if (process.env.GARELON_S_DEBUG) console.error(JSON.stringify(out, null, 1));
  fs.rmSync(tmp, { recursive: true, force: true });
};
