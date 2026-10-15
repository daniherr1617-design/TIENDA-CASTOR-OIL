// SOLO TEST · Fase AB: sustitución exclusiva de dos imágenes (propietario, 2026-10-14, D45).
// Imagen 1 (infografía «Detalles de la pulsera») → «NUEVA IMAGEN 1.png» nueva (main d697947), familia producto-infografia-v4.
// Imagen 4 (pulsera completa, clave «completa») → «NUEVA IMAGEN 4.png» (main d697947), mismos producto-completa-<ancho>.webp.
// Mismos sitios, mismo orden, mismos tamaños, mismos textos: nada más cambia en el tema.
const T = require('./tests.js');
const { ok, get, reset, openPage, THEME } = T;
const fs = require('fs');
const { execSync, execFileSync, spawnSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '8be0746'; // HEAD antes de la ronda AB
const ROUND_HEAD = '8aaf012'; // Ronda AC: commit del tema de la ronda AB (alcance fijado a AB, como en T…AA)
const OWNER_UPLOAD = 'd697947'; // subida del propietario a main (2026-10-14): «NUEVA IMAGEN 1.png» y «NUEVA IMAGEN 4.png»
const REPO = fs.existsSync(THEME + '/.git');
const INF = T.assetBase('infografia');
const gallery = (html) => (html.match(/<div class="g-gallery"[\s\S]*?<\/ul>/) || [''])[0];
const buy = (html) => (html.match(/<section\s+id="comprar"[\s\S]*?<\/product-info>/) || [''])[0];
const slides = (g) => [...g.matchAll(/producto-(\w+)(?:-v\d+)?-\d+\.webp/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i);
// Diferencia media (0-255) de cada WebP de «completa» con una fuente reducida (LANCZOS) a su ancho.
const COMPARE = `
import sys, json
from PIL import Image, ImageChops, ImageStat
out = {}
for name, src in (('nueva', sys.argv[2]), ('antigua', sys.argv[3])):
    s = Image.open(src).convert('RGB')
    for w in (480, 720, 1080):
        a = Image.open(f'{sys.argv[1]}/assets/producto-completa-{w}.webp')
        r = s.resize((w, w), Image.LANCZOS)
        out[f'{name}-{w}'] = {'size': list(a.size), 'mean': sum(ImageStat.Stat(ImageChops.difference(a.convert('RGB'), r)).mean) / 3}
print(json.dumps(out))`;

module.exports = async function (browser) {
  await reset();
  // 1 · Fuentes: byte a byte las del propietario; la antigua «imagen 4.png» retirada; el resto de fuentes intacto
  if (REPO) {
    const blob = (rev, f) => spawnSync('git', ['-C', THEME, 'cat-file', 'blob', `${rev}:${f}`], { maxBuffer: 64 * 1024 * 1024 }).stdout;
    const same = (f) => fs.existsSync(`${THEME}/${f}`) && fs.readFileSync(`${THEME}/${f}`).equals(blob(OWNER_UPLOAD, f));
    ok('AB1 «NUEVA IMAGEN 1.png» y «NUEVA IMAGEN 4.png» son byte a byte las subidas por el propietario a main (d697947)', same('NUEVA IMAGEN 1.png') && same('NUEVA IMAGEN 4.png'));
    ok('AB2 la imagen 4 antigua («imagen 4.png») ya no está; «NUEVA IMAGEN 3.png» e «imagen 2.png» sin cambios',
      !fs.existsSync(`${THEME}/imagen 4.png`) && ['NUEVA IMAGEN 3.png', 'imagen 2.png'].every(f => fs.readFileSync(`${THEME}/${f}`).equals(blob(BASE, f))));
  }

  // 2 · Assets: «completa» sale de la imagen 4 nueva (no de la antigua); la infografía, de la imagen 1 nueva (familia v4)
  if (REPO) {
    const old4 = `${require('os').tmpdir()}/garelon-ab-imagen4.png`;
    fs.writeFileSync(old4, execFileSync('git', ['-C', THEME, 'show', `${BASE}:imagen 4.png`], { maxBuffer: 64 * 1024 * 1024 }));
    const c = JSON.parse(execFileSync('python3', ['-c', COMPARE, THEME, `${THEME}/NUEVA IMAGEN 4.png`, old4]).toString());
    fs.unlinkSync(old4);
    ok('AB3 producto-completa-{480,720,1080}.webp: cuadradas a su ancho y reducción de «NUEVA IMAGEN 4.png» (media ≤ 3/255), no de la antigua (> 10/255)',
      [480, 720, 1080].every(w => c[`nueva-${w}`].size.join() === `${w},${w}` && c[`nueva-${w}`].mean <= 3 && c[`antigua-${w}`].mean > 10), c);
  }
  ok('AB4 infografía: familia producto-infografia-v4 (480/720/1080/1254) y nada de la v3', INF === 'producto-infografia-v4' &&
    JSON.stringify(fs.readdirSync(`${THEME}/assets`).filter(f => /infografia/.test(f)).sort()) === JSON.stringify([480, 720, 1080, 1254].map(w => `${INF}-${w}.webp`).sort()));
  if (REPO) {
    const chk = spawnSync('python3', [`${THEME}/tools/garelon_infografia.py`, '--check'], { encoding: 'utf8' });
    ok('AB5 tools/garelon_infografia.py --check: la v4 es píxel a píxel la imagen 1 nueva (lossless, sin recorte ni ampliación)', chk.status === 0 && /0\.000, máxima 0\/255/.test(chk.stdout), chk.stdout.trim().split('\n').slice(-3));
  }

  // 3 · Mismos sitios y mismo orden que antes
  const home = (await get('/')).html; const pdp = (await get(P)).html;
  const det = (h) => (h.match(/<section[^>]*id="detalles"[\s\S]*?<\/section>/) || [''])[0];
  ok('AB6 home: galería de compra completa → infografía → principal → oración; la imagen 4 nueva es la 1.ª (eager) y la 1 nueva está en la galería y en «Detalles»',
    JSON.stringify(slides(gallery(buy(home)))) === JSON.stringify(['completa', 'infografia', 'principal', 'oracion']) && /<img[^>]*producto-completa-[^>]*loading="eager"|loading="eager"[^>]*producto-completa-/.test(gallery(buy(home))) && det(home).includes(`${INF}-1254.webp`), slides(gallery(buy(home))));
  ok('AB7 ficha: galería completa → principal → infografía → oración; la imagen 4 nueva es la 1.ª (eager) y «Detalles» usa la imagen 1 nueva',
    JSON.stringify(slides(gallery(pdp))) === JSON.stringify(['completa', 'principal', 'infografia', 'oracion']) && /<img[^>]*producto-completa-[^>]*loading="eager"|loading="eager"[^>]*producto-completa-/.test(gallery(pdp)) && det(pdp).includes(`${INF}-1254.webp`), slides(gallery(pdp)));
  ok('AB8 ninguna página sirve la familia v3 de la infografía', !/producto-infografia-v3-/.test(home + pdp + (await get('/cart')).html));

  // 4 · Navegador: móvil y escritorio, todas las imágenes cargan, sin peticiones fallidas
  for (const [u, vp] of [['/', { width: 390, height: 844 }], ['/', { width: 1440, height: 900 }], [P, { width: 390, height: 844 }], [P, { width: 1440, height: 900 }]]) {
    const { page, errs } = await openPage(browser, u, vp);
    const res = await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll('img[src*="producto-completa"], img[src*="producto-infografia"]')];
      for (const i of imgs) { i.loading = 'eager'; i.scrollIntoView({ block: 'center' }); await i.decode().catch(() => {}); }
      return { n: imgs.length, broken: imgs.filter(i => !(i.complete && i.naturalWidth > 0)).map(i => i.currentSrc), sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    ok(`AB9 ${u === '/' ? 'home' : 'ficha'} ${vp.width}px: imágenes 1 y 4 cargadas (ninguna rota), sin scroll horizontal ni peticiones fallidas`,
      res.n >= 3 && res.broken.length === 0 && res.sw <= res.cw && errs.length === 0, { ...res, errs });
    await page.close();
  }

  // 5 · Alcance: solo los WebP de las dos imágenes y el nombre de la familia de la infografía
  if (REPO) {
    const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- assets config layout locales sections snippets templates`).toString().trim().split('\n').filter(Boolean);
    ok('AB10 alcance: solo producto-completa-*.webp, producto-infografia-v3/v4-*.webp y snippets/garelon-image.liquid (sin CSS, plantillas, secciones, textos ni ajustes)',
      changed.length === 12 && changed.every(f => /^(assets\/producto-completa-(480|720|1080)\.webp|assets\/producto-infografia-v[34]-(480|720|1080|1254)\.webp|snippets\/garelon-image\.liquid)$/.test(f)), changed);
    const sn = execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- snippets/garelon-image.liquid`).toString().split('\n').filter(l => /^[+-][^+-]/.test(l));
    ok('AB11 garelon-image.liquid: solo cambia v3 → v4 en el nombre de la familia (2 líneas)',
      sn.length === 4 && sn.filter(l => l[0] === '-').every(l => l.includes('producto-infografia-v3')) && sn.filter(l => l[0] === '-').map(l => l.slice(1).replace(/v3/g, 'v4')).join() === sn.filter(l => l[0] === '+').map(l => l.slice(1)).join(), sn);
    const src = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- '*.png'`).toString().trim().split('\n').filter(Boolean).sort();
    ok('AB12 fuentes: solo «NUEVA IMAGEN 1.png» (sustituida), «NUEVA IMAGEN 4.png» (nueva) e «imagen 4.png» (retirada)',
      JSON.stringify(src) === JSON.stringify(['NUEVA IMAGEN 1.png', 'NUEVA IMAGEN 4.png', 'imagen 4.png']), src);
  }
};
