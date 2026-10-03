// SOLO TEST · Fase B: cabecera, navegación, pie, marca, contraste y responsive de la cabecera.
const T = require('./tests.js');
const { ok, get, setState, reset, count, text, openPage } = T;
const fs = require('fs');

function lum(hex) { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; }
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

module.exports = async function (browser) {
  await reset();
  let r = await get('/');
  const header = (r.html.match(/<sticky-header[\s\S]*?<\/sticky-header>/) || [''])[0];
  const drawer = (header.match(/<header-drawer[\s\S]*?<\/header-drawer>/) || [''])[0];
  const inline = (header.match(/<nav class="header__inline-menu">[\s\S]*?<\/nav>/) || [''])[0];
  ok('B1 logo GARELON (isotipo dorado + letras negras) enlazado a la home, sin H1', /href="\/" class="header__heading-link/.test(header) && /garelon-logo-negro-320\.webp/.test(header) && /alt="GARELON"/.test(header) && !/<h1/.test(header));
  const labels = (html) => [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*>\s*(?:<span[^>]*>)?([^<]+)/g)].map(m => [m[1], m[2].trim()]);
  const want = [['/', 'Inicio'], ['/#detalles', 'Detalles'], ['/#preguntas-frecuentes', 'Preguntas frecuentes'], ['/pages/contacto', 'Contacto']];
  ok('B2 menú de escritorio = Inicio · Detalles · Preguntas frecuentes · Contacto', JSON.stringify(labels(inline)) === JSON.stringify(want), labels(inline));
  const drawerLinks = labels(drawer).filter(([u]) => !u.startsWith('/account'));
  ok('B3 menú móvil = los mismos 4 enlaces', JSON.stringify(drawerLinks) === JSON.stringify(want), drawerLinks);
  ok('B4 sin «Catálogo» ni /collections en la cabecera (el menú del Admin simulado sí lo trae)', !/Cat[aá]logo|\/collections/.test(header));
  ok('B5 cuenta dentro del menú móvil (cuentas activadas)', /class="garelon-drawer-account[^"]*"/.test(drawer) && /Iniciar sesión/.test(drawer));
  await setState('accounts=0'); r = await get('/'); ok('B5b sin cuentas de cliente: ni icono ni enlace de cuenta', !/class="garelon-drawer-account|<shopify-account/.test(r.html)); await reset(); r = await get('/');
  ok('B6 sin búsqueda en la cabecera', !/Search-In-Modal|header__search/.test(header));
  ok('B7 barra superior: «Una joya para llevar contigo o regalar», sin envío gratis ni urgencia', /Una joya para llevar contigo o regalar/.test(r.html) && !/env[ií]o gratis|quedan|últimas|oferta/i.test(text((r.html.match(/announcement-bar[\s\S]*?<\/section>|announcement-bar[\s\S]*?<\/div>\s*<\/div>/) || [''])[0])));
  ok('B8 favicon e icono iOS de la marca', /garelon-favicon-32\.png/.test(r.html) && /apple-touch-icon" href="\/assets\/garelon-apple-touch-180\.png/.test(r.html));
  const footer = (r.html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  ok('B9 pie: logo completo + descripción de marca', /garelon-logo-negro-320\.webp/.test(footer) && /Joyería con significado para acompañar momentos especiales\./.test(footer));
  ok('B10 pie: bloque Ayuda con enlace a /pages/contacto', /Ayuda/.test(footer) && /href="\/pages\/contacto"[^>]*>Contacta con nuestro equipo/.test(footer));
  const legal = () => { const f = (T._last.match(/<ul class="policies[\s\S]*?<\/ul>/) || [''])[0]; return [...f.matchAll(/<a href="([^"]+)">([^<]+)<\/a>/g)].map(m => m[2]); };
  T._last = footer;
  ok('B11 legales en orden: Contacto · Envíos · Devoluciones y reembolsos · Privacidad · Términos y condiciones · Aviso legal', JSON.stringify(legal()) === JSON.stringify(['Contacto', 'Envíos', 'Devoluciones y reembolsos', 'Privacidad', 'Términos y condiciones', 'Aviso legal']), legal());
  await setState('cookies=ok'); r = await get('/'); T._last = (r.html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  ok('B12 con página de cookies: Cookies entre Privacidad y Términos', JSON.stringify(legal()) === JSON.stringify(['Contacto', 'Envíos', 'Devoluciones y reembolsos', 'Privacidad', 'Cookies', 'Términos y condiciones', 'Aviso legal']), legal());
  await setState('cookies=none&refund=none&contact=none'); r = await get('/'); T._last = (r.html.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  ok('B13 sin contacto ni política de devoluciones: no se enlazan (sin enlaces rotos)', !legal().includes('Contacto') && !legal().includes('Devoluciones y reembolsos'), legal());
  await reset(); r = await get('/');
  ok('B14 pie sin iconos de pago, boletín ni «Seguir en Shop»', !/list-payment|newsletter-form|follow-on-shop|login_button/.test(footer));
  // Contraste de los esquemas (WCAG AA 4,5:1).
  const data = JSON.parse(fs.readFileSync(T.THEME + '/config/settings_data.json', 'utf8')).presets.Dawn.color_schemes;
  const bad = [];
  for (const [id, { settings: s }] of Object.entries(data)) {
    for (const [a, b, what] of [[s.text, s.background, 'texto/fondo'], [s.button_label, s.button, 'botón'], [s.secondary_button_label, s.background, 'botón secundario']]) {
      const c = contrast(a, b); if (c < 4.5) bad.push(`${id} ${what} ${c.toFixed(2)}`);
    }
  }
  ok('B15 contraste AA (≥ 4,5:1) en los 5 esquemas: texto, botón y botón secundario', bad.length === 0, bad);
  // Responsive de la cabecera.
  for (const w of [320, 360, 375, 390, 430]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: 800 });
    const m = await page.evaluate(() => {
      const box = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return cs.display === 'none' || b.width === 0 ? null : { l: b.left, r: b.right, t: b.top, b: b.bottom, h: b.height }; };
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, menu: box('.header__icon--menu'), logo: box('.header__heading-link'), cart: box('#cart-icon-bubble'), account: box('.header__icons .header__icon--account'), search: box('.header__search'), header: box('.header') };
    });
    const sep = m.menu && m.logo && m.cart ? Math.min(m.logo.l - m.menu.r, m.cart.l - m.logo.r) : -1;
    ok(`B16 ${w}px: sin scroll horizontal; menú · logo · carrito sin solapes (≥ 8 px); sin cuenta ni búsqueda en la barra; cabecera ≤ 72 px`,
      m.sw <= m.cw && sep >= 8 && !m.account && !m.search && m.header && m.header.h <= 72 && errs.length === 0, { sw: m.sw, cw: m.cw, sep: Math.round(sep), h: m.header && Math.round(m.header.h), errs });
    if (w === 390) {
      await page.click('.header__icon--menu'); await page.waitForTimeout(500);
      const vis = await page.evaluate(() => [...document.querySelectorAll('#menu-drawer .menu-drawer__menu-item')].filter(a => a.getBoundingClientRect().height >= 44).map(a => a.textContent.trim()));
      ok('B17 390px: el menú se abre y sus enlaces miden ≥ 44 px de alto', vis.length === 4, vis);
    }
    await page.close();
  }
  for (const w of [768, 1024, 1440]) {
    const { page, errs } = await openPage(browser, '/', { width: w, height: 900 });
    const m = await page.evaluate(() => {
      const items = [...document.querySelectorAll('.header__inline-menu .list-menu__item')].map(a => { const b = a.getBoundingClientRect(); return { t: Math.round(b.top), v: getComputedStyle(a).visibility, d: a.offsetParent !== null }; });
      const logo = document.querySelector('.header__heading-link').getBoundingClientRect(); const nav = document.querySelector('.header__inline-menu');
      const nb = nav ? nav.getBoundingClientRect() : null;
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, rows: new Set(items.filter(i => i.d).map(i => i.t)).size, visible: items.filter(i => i.d).length, overlap: nb && nb.width ? nb.left < logo.right : false };
    });
    const desk = w >= 990;
    ok(`B18 ${w}px: sin scroll horizontal${desk ? '; menú en línea de 4 enlaces en una fila, sin solapar el logo' : '; menú en el cajón (tableta)'}`,
      m.sw <= m.cw && errs.length === 0 && (desk ? m.visible === 4 && m.rows === 1 && !m.overlap : true), m);
    await page.close();
  }
};
