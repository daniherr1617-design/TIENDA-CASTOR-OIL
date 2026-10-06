// SOLO TEST · Fase P: nueva infografía «Detalles de la pulsera» y página de Contacto.
// 1) «NUEVA IMAGEN 1.png» (flechas corregidas por el propietario) sustituye a «Imagen 1.png» como fuente de la clave
//    `infografia`: misma clave, mismos anchos, solo WebP servido, sin ampliar y fiel a la fuente.
// 2) Contacto: el formulario es el nativo de Dawn ({% form 'contact' %}). Causa del fallo: los enlaces de la cabecera,
//    el menú móvil, el bloque «Ayuda» y las FAQ apuntaban fijos a /pages/contacto (404 si la página de Shopify es
//    «contact», la que crea una tienda nueva), y una página «contacto» con la plantilla predeterminada no mostraba el
//    formulario. Ahora todos resuelven la página real y page.json pinta el formulario solo en la página de contacto.
// Ningún test local demuestra que Shopify envíe el correo: eso solo se comprueba en Shopify real.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage, B, THEME } = T;
const fs = require('fs');
const crypto = require('crypto');
const { execSync, execFileSync } = require('child_process');
const P = '/products/pulsera-rosario-virgen-maria';
const BASE = '34c8ae7'; // HEAD antes de la ronda P
// Último commit de la ronda P (tema 27c3904 + docs): el alcance P29-P31 y P5 se fijan a 34c8ae7..9bba79b, porque la
// ronda R (D35) renombra la infografía a producto-infografia-v2-* y saca la lupa de encima de la imagen.
const ROUND_HEAD = '9bba79b';
const ASSET = T.assetBase('infografia'); // familia actual de la infografía (v2 en la ronda R, v3 desde la ronda S)
const REPO = fs.existsSync(THEME + '/.git');
const NEW_SRC = 'NUEVA IMAGEN 1.png';
// Versión aprobada vigente (la de la ronda P era 3795161c…; el propietario la sustituyó en la ronda S, D36).
const NEW_SRC_SHA256 = T.approvedSourceSha();
const OLD_SRC = 'Imagen 1.png';
const VPS = [320, 360, 375, 390, 430, 768, 1024, 1440];
const es = JSON.parse(fs.readFileSync(`${THEME}/locales/es.json`, 'utf8')).garelon.gallery;
const snippet = fs.readFileSync(`${THEME}/snippets/garelon-image.liquid`, 'utf8');
const WIDTHS = ((snippet.match(/when 'infografia'\s*assign widths = '([\d,]+)'/) || [])[1] || '').split(',').filter(Boolean).map(Number);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const contactHrefs = (html) => [...html.matchAll(/href="(\/(?:pages\/contact[a-z-]*|policies\/contact-information))"/g)].map(m => m[1]);
const PAGES = ['/', P, '/cart', '/ruta-inexistente-garelon'];

module.exports = async function phaseP(browser) {
  await reset();
  // 1 · Fuente y assets de la infografía
  if (REPO) {
    const src = `${THEME}/${NEW_SRC}`;
    ok('P1 fuente «NUEVA IMAGEN 1.png» en el repo (la versión aprobada vigente) y la antigua «Imagen 1.png» retirada',
      fs.existsSync(src) && crypto.createHash('sha256').update(fs.readFileSync(src)).digest('hex') === NEW_SRC_SHA256 && !fs.existsSync(`${THEME}/${OLD_SRC}`));
  }
  const info = JSON.parse(execFileSync('python3', ['-c', `
import sys, json, os
from PIL import Image
print(json.dumps({w: [Image.open(f'{sys.argv[1]}/assets/{sys.argv[3]}-{w}.webp').format, *Image.open(f'{sys.argv[1]}/assets/{sys.argv[3]}-{w}.webp').size,
  os.path.getsize(f'{sys.argv[1]}/assets/{sys.argv[3]}-{w}.webp')] for w in json.loads(sys.argv[2])}))`, THEME, JSON.stringify(WIDTHS), ASSET]).toString());
  // Peso: < 260 KB con la calidad 90 de la ronda P; desde la ronda Q (D34) son lossless y el límite es 1,5 MB (fase Q).
  ok('P2 «infografia» con los anchos del snippet (480/720/1080/1254): WebP, cuadrados, al ancho de su nombre y < 1,5 MB',
    WIDTHS.join() === '480,720,1080,1254' && WIDTHS.every(w => { const d = info[w]; return d[0] === 'WEBP' && d[1] === w && d[2] === w && d[3] < 1.5 * 1024 * 1024; }), info);
  ok('P3 sin PNG/JPG de la infografía en assets/ (el tema solo lleva WebP)', fs.readdirSync(`${THEME}/assets`).filter(f => /infografia/.test(f) && !/\.webp$/.test(f)).length === 0);
  if (REPO) {
    // Fidelidad: cada WebP es la fuente nueva reducida con LANCZOS (sin ampliar: el mayor ancho = el ancho de la fuente).
    const fid = JSON.parse(execFileSync('python3', ['-c', `
import sys, json
from PIL import Image, ImageChops, ImageStat
src = Image.open(sys.argv[1]).convert('RGB'); out = {'src': src.size[0]}
for w in json.loads(sys.argv[3]):
    cur = Image.open(f'{sys.argv[2]}/assets/{sys.argv[4]}-{w}.webp').convert('RGB')
    ref = src if w == src.size[0] else src.resize((w, w), Image.LANCZOS)
    out[w] = round(sum(ImageStat.Stat(ImageChops.difference(cur, ref)).mean) / 3, 2)
print(json.dumps(out))`, `${THEME}/${NEW_SRC}`, THEME, JSON.stringify(WIDTHS), ASSET]).toString());
    // Umbral 4/255: el ruido normal de WebP con pérdida (calidad 90) da 2-3; cualquier retoque, recorte o desplazamiento da mucho más.
    ok('P4 cada WebP sale de la fuente nueva sin retoques (diferencia media < 4/255, solo compresión) y sin ampliar (ancho mayor = ancho de la fuente)',
      fid.src === Math.max(...WIDTHS) && WIDTHS.every(w => fid[w] < 4), fid);
    const changedAssets = WIDTHS.filter(w => execSync(`git -C ${THEME} rev-parse ${BASE}:assets/producto-infografia-${w}.webp`).toString().trim() !==
      execSync(`git -C ${THEME} rev-parse ${ROUND_HEAD}:assets/producto-infografia-${w}.webp`).toString().trim());
    ok('P5 los 4 WebP de la infografía se regeneraron (ninguno es el de la imagen antigua)', changedAssets.length === WIDTHS.length, changedAssets);
    // Los guardianes de la infografía (ronda Q/R) nombran «Imagen 1.png» precisamente para impedir que vuelva: no son uso activo.
    const refs = execSync(`git -C ${THEME} grep -l -F "${OLD_SRC}" -- assets config layout locales sections snippets templates tools ':(exclude)tools/garelon_infografia.py' ':(exclude)tools/test_garelon_infografia.py' || true`).toString().trim();
    const guards = ['tools/garelon_infografia.py', 'tools/test_garelon_infografia.py'].every(f => /OLD_SOURCES|retirada/.test(fs.readFileSync(`${THEME}/${f}`, 'utf8')));
    ok('P6 ninguna referencia activa a «Imagen 1.png» en el tema ni en tools/ (solo la nombran los comprobadores que la bloquean)', refs === '' && guards, refs);
  }

  // 2 · Render de la infografía: home (galería + Detalles) y ficha (galería)
  for (const u of ['/', P]) {
    const r = await get(u);
    const imgs = [...r.html.matchAll(/<img[^>]*producto-infografia[^>]*>/g)].map(m => m[0]);
    const srcsets = imgs.map(i => (i.match(/srcset="([^"]+)"/) || [])[1] || '');
    ok(`P7 ${u}: la infografía se sirve solo como WebP con srcset 480/720/1080/1254, sizes, width/height (sin CLS) y su alt`, imgs.length === (u === '/' ? 2 : 1) &&
      imgs.every(i => i.includes(`src="/assets/${ASSET}-1254.webp"`) && /sizes="[^"]+"/.test(i) && /width="1254"/.test(i) && /height="1254"/.test(i) && i.includes(`alt="${esc(es.alt_infografia)}"`)) &&
      srcsets.every(s => s === WIDTHS.map(w => `/assets/${ASSET}-${w}.webp ${w}w`).join(', ')), imgs);
    ok(`P8 ${u}: ningún asset de producto en PNG/JPG`, !/producto-[a-z]+-\d+\.(png|jpe?g)/.test(r.html));
  }
  ok('P9 alt de la infografía fiel a la imagen nueva (medalla, cruz, cuentas tricolor, cierre, largo ajustable, medida y regalo) y sin claims',
    /^Infografía «Detalles de la pulsera»/.test(es.alt_infografia) && ['medalla de la Virgen María', 'cruz de Jesús', 'cuentas de rosario tricolor', 'acabado dorado pulido', 'largo ajustable', '20 cm / 7,87 in', 'regalo religioso especial']
      .every(x => es.alt_infografia.includes(x)) && !/14\s*K|oro macizo|hipoalerg|waterproof|milagr/i.test(es.alt_infografia));
  for (const [w, maxW] of [[390, 1080], [1440, 1254]]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: w < 750 ? 844 : 900 });
    const req = []; page.on('request', x => { if (/infografia/.test(x.url())) req.push(x.url()); });
    const res = await page.evaluate(async () => {
      const i = document.querySelector('#detalles img'); i.scrollIntoView(); await new Promise(r => setTimeout(r, 900));
      const g = document.querySelector('#comprar .g-gallery img[src*="infografia"]'); g.loading = 'eager'; g.scrollIntoView(); await new Promise(r => setTimeout(r, 900));
      const b = i.getBoundingClientRect();
      return { cur: i.currentSrc, nat: i.naturalWidth, w: Math.round(b.width), h: Math.round(b.height), gcur: g.currentSrc, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
    });
    const chosen = Number((res.cur.match(/-(\d+)\.webp$/) || [])[1]);
    ok(`P10 home ${w}px: Detalles carga un WebP adecuado al ancho (${res.cur.split('/').pop()}: ≥ ancho mostrado y ≤ ${maxW} px), cuadrado y sin scroll horizontal`,
      /\.webp$/.test(res.cur) && /\.webp$/.test(res.gcur) && chosen >= Math.min(res.w, 1254) && chosen <= maxW && res.nat > 0 && Math.abs(res.w - res.h) <= 1 && res.sw <= res.cw, res);
    ok(`P11 home ${w}px: ninguna petición PNG de la infografía y ningún archivo pedido dos veces`, req.every(x => /\.webp$/.test(x)) && new Set(req).size === req.length && errs.length === 0, { req, errs });
    await page.close();
  }

  // 3 · Contacto: plantilla y formulario nativo (escenario normal: página «contacto» con la plantilla «contact»)
  let r = await get('/pages/contacto');
  const form = (r.html.match(/<form[^>]*id="ContactForm"[\s\S]*?<\/form>/) || [''])[0];
  ok('P12 /pages/contacto → 200 con la plantilla page.contact, un H1 «Contacto» y un solo formulario nativo (action /contact, form_type contact)',
    r.status === 200 && r.tpl === 'page.contact' && count(r.html, /<h1[\s>]/g) === 1 && /<h1[^>]*>\s*Contacto\s*<\/h1>/.test(r.html) && count(r.html, /id="ContactForm"/g) === 1 &&
    /action="\/contact"/.test(form) && /name="form_type" value="contact"/.test(form));
  const field = (id) => (form.match(new RegExp(`<(?:input|textarea)[^>]*id="${id}"[^>]*>`)) || [''])[0];
  const labelled = (id) => new RegExp(`<label[^>]*for="${id}"`).test(form);
  ok('P13 campos: nombre, email (type=email, autocomplete=email, obligatorio), mensaje y botón Enviar, cada uno con su label',
    /autocomplete="name"/.test(field('ContactForm-name')) && /type="email"/.test(field('ContactForm-email')) && /autocomplete="email"/.test(field('ContactForm-email')) &&
    /name="contact\[email\]"/.test(field('ContactForm-email')) && /aria-required="true"/.test(field('ContactForm-email')) && /<textarea/.test(field('ContactForm-body')) &&
    ['ContactForm-name', 'ContactForm-email', 'ContactForm-phone', 'ContactForm-body'].every(labelled) && /<button type="submit" class="button">\s*Enviar\s*<\/button>/.test(form));
  const ids = [...r.html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  ok('P14 /pages/contacto: ids únicos y sin dirección de email escrita en el tema', new Set(ids).size === ids.length && !/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text(r.html)), ids.filter((x, i) => ids.indexOf(x) !== i));
  ok('P15 sin backend ni servicios externos: el formulario va al endpoint de Shopify', !/formspree|google\.com\/forms|zapier|emailjs|fetch\([^)]*contact/i.test(r.html) && count(r.html, /<form[^>]*action="\/contact"/g) === 1);

  // 4 · Enlaces a Contacto en toda la tienda (cabecera, menú móvil, «Ayuda», FAQ y pie legal)
  for (const u of PAGES) {
    const h = await get(u); const hrefs = contactHrefs(h.html);
    const st = []; for (const x of new Set(hrefs)) st.push((await get(x)).status);
    ok(`P16 ${u}: enlaces a Contacto → /pages/contacto y responden 200`, hrefs.length >= 4 && hrefs.every(x => x === '/pages/contacto') && st.every(s => s === 200), { hrefs, st });
  }
  const home = (await get('/')).html;
  const nav = (home.match(/<nav class="header__inline-menu"[\s\S]*?<\/nav>/) || [''])[0];
  const drawer = (home.match(/<nav class="menu-drawer__navigation"[\s\S]*?<\/nav>/) || [''])[0];
  const navLabels = (h) => [...h.matchAll(/<a[^>]*href="([^"]+)"[^>]*>\s*(?:<span[^>]*>)?([^<]+)/g)].map(m => m[2].trim() + ' → ' + m[1]);
  ok('P17 navegación de escritorio y móvil: Inicio · Detalles · Preguntas frecuentes · Contacto, sin «Catálogo»',
    JSON.stringify(navLabels(nav)) === JSON.stringify(['Inicio → /', 'Detalles → /#detalles', 'Preguntas frecuentes → /#preguntas-frecuentes', 'Contacto → /pages/contacto']) &&
    navLabels(drawer).slice(0, 4).join() === navLabels(nav).join() && !/Cat[aá]logo/.test(nav + drawer), { nav: navLabels(nav), drawer: navLabels(drawer) });
  {
    const { page, errs } = await openPage(browser, '/', { width: 1440, height: 900 });
    await page.click('.header__inline-menu a:has-text("Contacto")'); await page.waitForLoadState('networkidle');
    const d = await page.evaluate(() => ({ path: location.pathname, form: !!document.querySelector('#ContactForm'), cur: document.querySelector('.header__inline-menu a[aria-current="page"]')?.textContent.trim() }));
    ok('P18 escritorio: «Contacto» de la cabecera abre la página con el formulario y queda marcado como actual', d.path === '/pages/contacto' && d.form && d.cur === 'Contacto' && errs.length === 0, { d, errs });
    await page.close();
  }
  {
    const { page, errs } = await openPage(browser, '/', { width: 390, height: 844 });
    await page.click('header-drawer summary'); await page.waitForTimeout(500);
    await page.click('#menu-drawer a:has-text("Contacto")'); await page.waitForLoadState('networkidle');
    const d = await page.evaluate(() => ({ path: location.pathname, form: !!document.querySelector('#ContactForm') }));
    ok('P19 móvil: menú → «Contacto» abre la página con el formulario', d.path === '/pages/contacto' && d.form && errs.length === 0, { d, errs });
    await page.close();
  }

  // 5 · Causa raíz: la página de Shopify se llama «contact» (tienda nueva) → todos los enlaces la siguen, ninguno da 404
  await setState('contact=legacy');
  for (const u of PAGES) {
    const h = await get(u); const hrefs = contactHrefs(h.html);
    ok(`P20 página «contact» de Shopify, ${u}: todos los enlaces a Contacto → /pages/contact (200), ninguno a /pages/contacto`,
      hrefs.length >= 4 && hrefs.every(x => x === '/pages/contact') && (await get('/pages/contact')).status === 200, hrefs);
  }
  r = await get('/pages/contact');
  ok('P21 /pages/contact (plantilla contact) muestra el formulario una vez', r.status === 200 && count(r.html, /id="ContactForm"/g) === 1);
  // Página «contacto» con la plantilla predeterminada en el Admin → page.json la pinta igual; otras páginas sin formulario
  await setState('contact=plain&legal=page');
  r = await get('/pages/contacto');
  ok('P22 página «contacto» con la plantilla predeterminada: el formulario aparece igual (una vez, mismo formulario nativo)', r.status === 200 && r.tpl === 'page' && count(r.html, /id="ContactForm"/g) === 1 && /action="\/contact"/.test(r.html));
  r = await get('/pages/aviso-legal');
  ok('P23 otras páginas con la plantilla predeterminada (aviso-legal) no muestran el formulario de contacto', r.status === 200 && r.tpl === 'page' && !/ContactForm|section-contact-form\.css/.test(r.html));
  // Sin página de contacto: ni enlaces muertos ni 404; con la política «Información de contacto», los enlaces van a ella
  await setState('contact=none&legal=policy&contactinfo=0');
  for (const u of PAGES) {
    const h = await get(u);
    ok(`P24 sin página de contacto, ${u}: ningún enlace a /pages/contact* (la cabecera no pinta «Contacto»; FAQ y «Ayuda» quedan como texto)`,
      contactHrefs(h.html).length === 0 && !/header__menu-item[^>]*>\s*<span[^>]*>Contacto/.test(h.html));
  }
  await setState('contact=none&contactinfo=1');
  const pol = contactHrefs((await get('/')).html);
  ok('P25 sin página pero con la política «Información de contacto»: los enlaces a Contacto van a ella (200)', pol.length >= 4 && pol.every(x => x === '/policies/contact-information') && (await get('/policies/contact-information')).status === 200, pol);
  await reset();

  // 6 · Envío del formulario (simulado como Shopify: error de email y éxito; no se envía ningún correo)
  {
    const { page, errs } = await openPage(browser, '/pages/contacto', { width: 390, height: 844 });
    await page.click('#ContactForm button[type=submit]'); await page.waitForLoadState('networkidle');
    const e = await page.evaluate(() => { const em = document.querySelector('#ContactForm-email'); const d = em.getAttribute('aria-describedby');
      return { alert: !!document.querySelector('#ContactForm [role="alert"]'), inv: em.getAttribute('aria-invalid'), desc: d && !!document.getElementById(d), link: !!document.querySelector('#ContactForm a[href="#ContactForm-email"]') }; });
    ok('P26 email vacío → estado de error accesible (role=alert, aria-invalid, mensaje enlazado al campo)', e.alert && e.inv === 'true' && e.desc && e.link, e);
    await page.fill('#ContactForm-name', 'Cliente de prueba'); await page.fill('#ContactForm-email', 'cliente@example.com'); await page.fill('#ContactForm-body', 'Consulta de prueba');
    await page.click('#ContactForm button[type=submit]'); await page.waitForLoadState('networkidle');
    const s = await page.evaluate(() => ({ url: location.pathname + location.search, msg: (document.querySelector('#ContactForm .form-status') || {}).textContent || '' }));
    const log = (await (await fetch(B + '/__state')).json()).log.filter(x => x.form_type === 'contact').pop() || {};
    ok('P27 envío válido → /pages/contacto?contact_posted=true con el mensaje de éxito; se envían email, nombre y mensaje', s.url === '/pages/contacto?contact_posted=true' && /Gracias por contactarnos/.test(s.msg) &&
      log['contact[email]'] === 'cliente@example.com' && Object.values(log).includes('Cliente de prueba') && Object.values(log).includes('Consulta de prueba') && errs.length === 0, { s, log, errs });
    await page.close();
  }

  // 7 · Responsive, foco visible y objetivos táctiles
  for (const w of VPS) {
    const { page, errs } = await openPage(browser, '/pages/contacto', { width: w, height: w < 750 ? 844 : 900 });
    await page.focus('#ContactForm-email');
    const d = await page.evaluate(() => {
      const cw = document.documentElement.clientWidth; const f = document.activeElement; const cs = getComputedStyle(f);
      const els = ['#ContactForm-name', '#ContactForm-email', '#ContactForm-phone', '#ContactForm-body', '#ContactForm button[type=submit]'].map(s => document.querySelector(s).getBoundingClientRect());
      return { sw: document.documentElement.scrollWidth, cw, outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2, inside: els.every(b => b.left >= 0 && b.right <= cw), minH: Math.min(...els.map(b => Math.round(b.height))), font: parseFloat(cs.fontSize) };
    });
    ok(`P28 contacto ${w}px: sin scroll horizontal, campos y botón dentro de la pantalla, altura ≥ 44 px, foco visible (≥ 2 px) y letra ≥ 16 px (sin zoom en iOS)`,
      d.sw <= d.cw && d.inside && d.minH >= 44 && d.outline && d.font >= 16 && errs.length === 0, { d, errs });
    await page.close();
  }

  // 8 · Alcance de la ronda P: 34c8ae7..9bba79b (solo en el repo)
  if (!REPO) return;
  const DIRS = 'assets config layout locales sections snippets templates';
  const changed = execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- ${DIRS}`).toString().trim().split('\n').filter(Boolean).sort();
  const EXPECT = ['assets/garelon.css', ...WIDTHS.map(w => `assets/producto-infografia-${w}.webp`), 'sections/contact-form.liquid', 'sections/footer.liquid', 'sections/garelon-faq.liquid',
    'snippets/garelon-contact-rte.liquid', 'snippets/garelon-contact-url.liquid', 'snippets/garelon-nav-items.liquid', 'templates/page.contact.json', 'templates/page.json'].sort();
  ok('P29 archivos del tema tocados: infografía WebP, contacto (secciones, snippets, plantillas de página) y garelon.css', JSON.stringify(changed) === JSON.stringify(EXPECT), changed);
  const same = ['templates/index.json', 'templates/product.json', 'sections/header-group.json', 'sections/footer-group.json', 'config/settings_data.json', 'snippets/garelon-image.liquid', 'snippets/garelon-gallery.liquid']
    .filter(f => execSync(`git -C ${THEME} diff --name-only ${BASE} ${ROUND_HEAD} -- ${f}`).toString().trim() !== '');
  ok('P30 producto, packs, precios, Judge.me, galerías, cabecera y pie (JSON) idénticos', same.length === 0, same);
  const removed = (f) => execSync(`git -C ${THEME} diff -U0 ${BASE} ${ROUND_HEAD} -- ${f}`).toString().split('\n').filter(l => /^-[^-]/.test(l));
  ok('P31 garelon.css y el formulario de Dawn solo ganan líneas (nada del formulario nativo se quita)', removed('assets/garelon.css').length === 0 && removed('sections/contact-form.liquid').length === 0,
    [...removed('assets/garelon.css'), ...removed('sections/contact-form.liquid')]);
};
