// SOLO TEST · Fase Q: la infografía es «NUEVA IMAGEN 1.png» tal cual, solo redimensionada y codificada en WebP.
// La fuente es inmutable (SHA-256 fijo). Los WebP de la clave `infografia` son lossless y salen solo de ella
// (tools/garelon_infografia.py): el de 1254 px es idéntico píxel a píxel y los menores son su reducción exacta.
// En el navegador se muestra entera (sin recorte ni deformación) y, a los 8 anchos, lo que se ve coincide con la
// fuente en todas las zonas de la composición (título, medalla, cruz, pulsera, círculo central, medida, círculos
// ampliados, etiquetas y, desde la ronda R, las cuatro esquinas). Un control negativo (la fuente recortada un 2 %)
// demuestra que la comparación lo detectaría. Ronda R (D35): familia producto-infografia-v2-*, la lupa ya no va encima
// y el marco no redondea (recortaba) las esquinas, así que la captura se compara entera, sin ocultar nada.
const T = require('./tests.js');
const { ok, reset, openPage, THEME } = T;
const ASSET = T.assetBase('infografia');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const IS_REPO = path.resolve(THEME) === REPO_ROOT;
const SRC = path.join(REPO_ROOT, 'NUEVA IMAGEN 1.png');
const SRC_SHA256 = '3795161cabb89ae32b7a4d9ac9acb8b770dc76f62c5795817743a9a6ddb3db0e';
const TOOL = path.join(REPO_ROOT, 'tools', 'garelon_infografia.py');
const P = '/products/pulsera-rosario-virgen-maria';
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const snippet = fs.readFileSync(`${THEME}/snippets/garelon-image.liquid`, 'utf8');
const WIDTHS = ((snippet.match(/when 'infografia'\s*assign widths = '([\d,]+)'/) || [])[1] || '').split(',').filter(Boolean).map(Number);
const SPOTS = [
  ['home · Detalles', '/', '#detalles img'],
  ['home · galería de compra', '/', '#comprar .g-gallery img[src*="infografia"]'],
  ['ficha · galería', P, '.g-gallery img[src*="infografia"]'],
];
// Umbrales (diferencia media en 0-255, con la captura alineada al píxel): el reescalado del navegador frente a LANCZOS
// da ~2-3; un recorte, un cambio de escala o un elemento movido da mucho más (lo demuestra el control negativo).
const MAX_MEAN = 7;
const MAX_REGION = 14;
const COMPARE = `
import sys, json
sys.dont_write_bytecode = True
sys.path.insert(0, sys.argv[1])
import garelon_infografia as g
from PIL import Image, ImageChops, ImageStat
src = Image.open(sys.argv[2]).convert('RGB')
def m(a, b): return sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3
def score(shot, base):
    # El navegador encaja la imagen al píxel entero: se busca el desplazamiento de la captura (±1 px, a cuartos de píxel).
    # Solo traslada: un recorte, un cambio de escala o un elemento movido no se pueden compensar así.
    W, H = shot.size
    inner = tuple(round(v) for v in (0.04 * W, 0.04 * H, 0.96 * W, 0.96 * H))  # para alinear; las esquinas se miden en REGIONS
    best = None
    for i in range(-4, 5):
        for j in range(-4, 5):
            ref = base.transform(shot.size, Image.AFFINE, (1, 0, -i / 4, 0, 1, -j / 4), resample=Image.BICUBIC, fillcolor=(255, 255, 255))
            d = m(shot.crop(inner), ref.crop(inner))
            if best is None or d < best[0]:
                best = (d, i / 4, j / 4, ref)
    d, ox, oy, ref = best
    regions = {n: m(shot.crop(b), ref.crop(b)) for n, (x0, y0, x1, y1) in g.REGIONS.items()
               for b in [(round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H))]}
    return {'mean': round(d, 2), 'worst': round(max(regions.values()), 2), 'worst_name': max(regions, key=regions.get), 'offset': [ox, oy]}
out = {}
k = round(src.width * 0.02)
cropped = src.crop((k, k, src.width - k, src.height - k))
for f, w, h in zip(sys.argv[3::3], sys.argv[4::3], sys.argv[5::3]):
    shot = Image.open(f).convert('RGB')
    size = (round(float(w)), round(float(h)))  # tamaño mostrado de la imagen (la captura puede tener 1 px más por el subpíxel)
    out[f] = {'size': shot.size, 'ok': score(shot, src.resize(size, Image.LANCZOS)), 'control': score(shot, cropped.resize(size, Image.LANCZOS))}
print(json.dumps(out))`;

module.exports = async function phaseQ(browser) {
  await reset();
  // 1 · Fuente inmutable y WebP generados solo desde ella
  const srcOk = fs.existsSync(SRC) && crypto.createHash('sha256').update(fs.readFileSync(SRC)).digest('hex') === SRC_SHA256;
  ok('Q1 fuente «NUEVA IMAGEN 1.png» presente e intacta (SHA-256 aprobado 3795161c…)', srcOk);
  if (IS_REPO) {
    const dirty = spawnSync('git', ['-C', REPO_ROOT, 'status', '--porcelain', '--', 'NUEVA IMAGEN 1.png'], { encoding: 'utf8' }).stdout.trim();
    ok('Q2 la fuente no tiene cambios sin confirmar en Git (nadie la ha reescrito)', dirty === '', dirty);
  }
  const tool = spawnSync('python3', [TOOL, '--check', '--theme', THEME, '--source', SRC], { encoding: 'utf8' });
  ok(`Q3 tools/garelon_infografia.py: los WebP ${IS_REPO ? 'del repo' : 'de esta copia del tema'} salen solo de la fuente (lossless, misma proporción, sin recorte ni ampliación, píxeles idénticos)`,
    tool.status === 0, (tool.stdout + tool.stderr).trim().split('\n').slice(-6));
  const kinds = WIDTHS.map(w => { const b = fs.readFileSync(`${THEME}/assets/${ASSET}-${w}.webp`); return b.toString('ascii', 12, 16); });
  ok(`Q4 los 4 anchos del snippet (480/720/1080/1254) son WebP lossless (VP8L) de la familia ${ASSET}`, WIDTHS.join() === '480,720,1080,1254' && kinds.every(k => k === 'VP8L'), kinds);
  if (IS_REPO) {
    const self = spawnSync('python3', [path.join(REPO_ROOT, 'tools', 'test_garelon_infografia.py')], { encoding: 'utf8' });
    ok('Q5 autoprueba del comprobador: recorte, desplazamiento, línea movida, filtro, pérdida, PNG, otra fuente, ampliación… se detectan',
      self.status === 0, self.stdout.trim().split('\n').slice(-3));
  }

  // 2 · Navegador: se ve entera (sin recorte ni deformación) y coincide con la fuente a los 8 anchos
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'garelon-q-'));
  const shots = []; const geo = [];
  for (const w of VPS) {
    for (const [name, u, sel] of SPOTS) {
      const { page, errs } = await openPage(browser, u, { width: w, height: w < 750 ? 844 : 900 });
      // Nada se oculta para la captura: lo que se compara es exactamente lo que ve el cliente (lupa incluida, si tapara algo).
      const d = await page.evaluate(async (sel) => {
        const i = document.querySelector(sel); i.loading = 'eager'; i.scrollIntoView({ block: 'center', inline: 'center' });
        await i.decode().catch(() => {}); await new Promise(r => setTimeout(r, 300));
        const b = i.getBoundingClientRect(); const box = (i.closest('li') || i.closest('.g-details__media')).getBoundingClientRect();
        return { cur: i.currentSrc.split('/').pop(), nw: i.naturalWidth, nh: i.naturalHeight, w: b.width, h: b.height, fit: getComputedStyle(i).objectFit,
          inside: b.left >= box.left - 1 && b.right <= box.right + 1 && b.top >= box.top - 1 && b.bottom <= box.bottom + 1 };
      }, sel);
      const file = path.join(tmp, `${w}-${shots.length}.png`);
      await page.locator(sel).screenshot({ path: file });
      shots.push({ w, name, file, dw: d.w, dh: d.h }); geo.push({ w, name, d, errs });
      await page.close();
    }
  }
  const badGeo = geo.filter(({ d, errs }) => !(new RegExp(`^${ASSET}-\\d+\\.webp$`).test(d.cur) && d.nw === d.nh && Math.abs(d.w / d.h - d.nw / d.nh) < 0.01 && d.inside && errs.length === 0));
  ok('Q6 a 320/360/375/390/430/768/1024/1440 px, en Detalles y en las dos galerías: WebP de la infografía, caja con la proporción de la imagen (sin recorte ni deformación) y entera dentro de su marco',
    geo.length === VPS.length * SPOTS.length && badGeo.length === 0, badGeo.slice(0, 3));
  const cmp = JSON.parse(execFileSync('python3', ['-c', COMPARE, path.dirname(TOOL), SRC, ...shots.flatMap(s => [s.file, String(s.dw), String(s.dh)])]).toString());
  const rows = shots.map(s => ({ w: s.w, name: s.name, ...cmp[s.file] }));
  const badVis = rows.filter(r => !(r.ok.mean <= MAX_MEAN && r.ok.worst <= MAX_REGION && Math.abs(r.ok.offset[0]) <= 1 && Math.abs(r.ok.offset[1]) <= 1));
  const weakCtl = rows.filter(r => !(r.control.mean > MAX_MEAN && r.control.worst > MAX_REGION));
  ok(`Q7 lo que se ve coincide con «NUEVA IMAGEN 1.png» en todas las zonas, esquinas incluidas, sin nada encima (media ≤ ${MAX_MEAN}/255, peor zona ≤ ${MAX_REGION}/255) en las ${rows.length} capturas`,
    rows.length === VPS.length * SPOTS.length && badVis.length === 0,
    badVis.length ? badVis.slice(0, 3) : { peor_media: Math.max(...rows.map(r => r.ok.mean)), peor_zona: Math.max(...rows.map(r => r.ok.worst)) });
  ok('Q8 control negativo: la misma comparación contra la fuente recortada un 2 % falla en todas las capturas (la prueba detecta un recorte o desplazamiento)',
    weakCtl.length === 0, weakCtl.length ? weakCtl.slice(0, 3) : { menor_media_control: Math.min(...rows.map(r => r.control.mean)) });
  if (process.env.GARELON_Q_DEBUG) console.error(JSON.stringify(rows, null, 1));
  fs.rmSync(tmp, { recursive: true, force: true });
};
