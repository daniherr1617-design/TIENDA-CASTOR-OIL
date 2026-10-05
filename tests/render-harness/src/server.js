// SOLO TEST · Render local que imita Shopify para el tema GARELON reconstruido.
// Liquid real del tema (liquidjs), JS real de Dawn en el navegador, datos SIMULADOS.
// Routing como Shopify: / → index (o 404 si el tema no tiene index), /products/<handle> solo si existe,
// /pages/<handle> solo si existe, /policies/<x> solo con contenido, el resto → plantilla 404 con HTTP 404.
// En la plantilla 404, request.path vale '/404' (como en Shopify, Shopify/liquid#1714).
const { Liquid, Drop } = require('liquidjs');
const http = require('http'); const fs = require('fs'); const path = require('path');
const FIXTURES = path.join(__dirname, '..', 'fixtures'); const FONTS_DIR = path.join(__dirname, '..', 'node_modules', '@fontsource');
const T = path.resolve(process.env.THEME || path.join(__dirname, '..', '..', '..')); const PORT = Number(process.env.PORT || 8810);
const read = (p) => fs.readFileSync(`${T}/${p}`, 'utf8');
const readJson = (p) => JSON.parse(read(p).replace(/^\s*\/\*[\s\S]*?\*\//, ''));
const HANDLE = 'pulsera-rosario-virgen-maria';

const state = { mode: 'single', soldout: [], design: false, catalog: 'ok', contact: 'ok', refund: 'ok', shipping: 'ok', cookies: 'none',
  // Legal: legal = policy (política nativa «Aviso legal») | page (página «aviso-legal») | none; contactinfo = política nativa
  // «Información de contacto»; cookies = none | ok («politica-de-cookies») | legacy (handle antiguo «cookies»).
  legal: 'policy', contactinfo: false,
  noindex: false, reviews: 'none', accounts: true, cart: [], log: [], media: false,
  // Ronda K: freeship '' = valor del tema (settings_data), '1'/'0' fuerza el ajuste global «Envío gratis»;
  // taxes = included | excluded | duties (solo aranceles) | both (aranceles e impuestos incluidos).
  freeship: '', taxes: 'included',
  // Ronda N: chips = inyecta 6 etiquetas de prueba neutras en «Para regalar» (que en la tienda ya no tiene bloques, D31)
  // para seguir probando el diseño «Etiquetas» de GARELON Detalles en futuros productos.
  chips: false };
const taxFlags = () => ({ taxes_included: state.taxes === 'included' || state.taxes === 'both', duties_included: state.taxes === 'duties' || state.taxes === 'both' });
function scenario() {
  const m = state.mode; // precios SIMULADOS (SOLO TEST)
  if (m === 'pack3') return { options: ['Pack'], rows: [[['1 pulsera'], 1999], [['2 pulseras'], 3998], [['3 pulseras'], 5997]] };
  if (m === 'pack3save') return { options: ['Pack'], rows: [[['1 pulsera'], 1999], [['2 pulseras'], 3499], [['3 pulseras'], 4799]] };
  if (m === 'compare') return { options: ['Pack'], rows: [[['1 pulsera'], 1999, 2499], [['2 pulseras'], 3499, 3998], [['3 pulseras'], 4799, null]] };
  if (m === 'nosave') return { options: ['Pack'], rows: [[['1 pulsera'], 1999], [['2 pulseras'], 3998], [['3 pulseras'], 5997]] };
  if (m === 'pack2') return { options: ['Pack'], rows: [[['1 pulsera'], 1999], [['2 pulseras'], 3499]] };
  if (m === 'other') return { options: ['Color'], rows: [[['Dorado'], 1999], [['Plateado'], 1999]] };
  if (m === 'twoopt') return { options: ['Color', 'Pack'], rows: [[['Dorado', '1 pulsera'], 1999], [['Dorado', '2 pulseras'], 3499], [['Plateado', '1 pulsera'], 1999]] };
  return { options: [], rows: [[[], 1999]] };
}
class OptionValue extends Drop { constructor(o) { super(); Object.assign(this, o); } valueOf() { return this.name; } toString() { return this.name; } }
class CartDrop extends Drop { constructor(o) { super(); Object.assign(this, o); } valueOf() { return this.items; } }
class MediaImage extends Drop { constructor(o) { super(); Object.assign(this, o); } toString() { return this.src; } }
const valueIds = {};
const vid = (o, v) => { const k = o + '|' + v; if (!(k in valueIds)) valueIds[k] = 9001 + Object.keys(valueIds).length; return valueIds[k]; };
function mediaList() {
  if (!state.media) return [];
  return ['producto-principal-1080.webp', 'producto-oracion-1080.webp'].map((f, i) => {
    const img = new MediaImage({ src: `/assets/${f}`, width: 1080, height: 1080, aspect_ratio: 1, alt: 'Foto de producto (simulada)', id: 700 + i, presentation: { focal_point: '50% 50%' } });
    return { id: 700 + i, media_type: 'image', position: i + 1, alt: img.alt, preview_image: img, aspect_ratio: 1, src: img.src, width: 1080, height: 1080, presentation: img.presentation };
  });
}
function buildProduct(selectedId, optionValueIds) {
  const { options, rows } = scenario(); const single = options.length === 0;
  options.forEach((o, k) => rows.forEach(([opts]) => vid(o, opts[k])));
  const variants = rows.map(([opts, price, compare], i) => {
    const id = 4101 + i; const available = !state.soldout.includes(id); const title = single ? 'Default Title' : opts.join(' / ');
    const v = { id, title, name: `Pulsera Rosario Virgen María - ${title}`, public_title: single ? null : title, options: single ? ['Default Title'] : opts, price, compare_at_price: compare || null,
      available, inventory_management: 'shopify', inventory_quantity: available ? 25 : 0, inventory_policy: 'deny', featured_media: null, featured_image: null,
      url: `/products/${HANDLE}?variant=${id}`, sku: `TEST-${i + 1}`, requires_selling_plan: false, selling_plan_allocations: [], requires_shipping: true,
      quantity_rule: { min: 1, max: null, increment: 1 }, quantity_price_breaks: [], 'matched?': true, weight: 20, store_availabilities: [], unit_price_measurement: null };
    v.options.forEach((o, k) => (v['option' + (k + 1)] = o)); return v;
  });
  let selectedVariant = variants.find(v => v.id === selectedId) || null; let wanted = null;
  if (!selectedVariant && optionValueIds && optionValueIds.length) {
    wanted = options.map(o => { const e = Object.entries(valueIds).find(([k, id]) => k.startsWith(o + '|') && optionValueIds.includes(id)); return e ? e[0].split('|')[1] : null; });
    selectedVariant = variants.find(v => v.options.every((o, k) => o === wanted[k])) || null;
    if (selectedVariant) wanted = null;
  }
  const current = selectedVariant || variants.find(v => v.available) || variants[0];
  const selValues = wanted || current.options;
  const owv = single ? [{ name: 'Title', position: 1, selected_value: 'Default Title', values: [new OptionValue({ id: vid('Title', 'Default Title'), name: 'Default Title', selected: true, available: variants[0].available, exists: true, variant: variants[0], product_url: '', swatch: null })] }]
    : options.map((name, k) => {
      const vals = [...new Set(rows.map(([o]) => o[k]))];
      return { name, position: k + 1, selected_value: selValues[k], values: vals.map(val => {
        const combo = selValues.map((sv, j) => (j === k ? val : sv));
        const variant = variants.find(v => v.options.every((o, j) => o === combo[j])) || null;
        return new OptionValue({ id: vid(name, val), name: val, selected: selValues[k] === val, available: variant ? variant.available : false, exists: !!variant, variant, product_url: '', swatch: null });
      }) };
    });
  const prices = variants.map(v => v.price); const media = mediaList();
  const meta = (state.reviews === 'summary' || state.reviews === 'both') ? { reviews: { rating: { value: { rating: 4.6, scale_min: 1, scale_max: 5, toString() { return '4.6'; } } }, rating_count: { value: 12, toString() { return '12'; } } } } : {};
  return { id: 1, title: 'Pulsera Rosario Virgen María', handle: HANDLE, url: `/products/${HANDLE}`, vendor: 'GARELON', type: '',
    available: variants.some(v => v.available), price: Math.min(...prices), price_min: Math.min(...prices), price_max: Math.max(...prices), price_varies: new Set(prices).size > 1,
    compare_at_price: Math.max(0, ...variants.map(v => v.compare_at_price || 0)) || null, compare_at_price_min: Math.min(...variants.map(v => v.compare_at_price || 0)), compare_at_price_max: Math.max(0, ...variants.map(v => v.compare_at_price || 0)), compare_at_price_varies: new Set(variants.map(v => v.compare_at_price || 0)).size > 1,
    has_only_default_variant: single, variants, selected_variant: selectedVariant, selected_or_first_available_variant: wanted ? null : current,
    first_available_variant: variants.find(v => v.available) || variants[0], options: single ? ['Title'] : options, options_with_values: owv, options_by_name: Object.fromEntries(owv.map(o => [o.name.toLowerCase(), o])),
    media, images: media.map(m => m.preview_image), featured_media: media[0] || null, featured_image: media[0] ? media[0].preview_image : null,
    description: '<p>Descripción de prueba (SOLO TEST).</p>', metafields: meta, tags: [], requires_selling_plan: false, selling_plan_groups: [],
    'quantity_price_breaks_configured?': false, 'gift_card?': false, collections: [], created_at: '2026-10-01' };
}
function cartDrop() {
  const product = buildProduct(null);
  const items = state.cart.map((l, i) => { const v = product.variants.find(x => x.id === l.id);
    return { id: v.id, key: `${v.id}:k`, index: i, product, variant: v, variant_id: v.id, product_id: 1, title: `${product.title} - ${v.title}`, quantity: l.quantity,
      price: v.price, final_price: v.price, original_price: v.price, final_line_price: v.price * l.quantity, original_line_price: v.price * l.quantity,
      url: v.url, image: null, options_with_values: product.has_only_default_variant ? [] : product.options.map((name, k) => ({ name, value: v.options[k] })), properties: {},
      line_level_discount_allocations: [], selling_plan_allocation: null, unit_price_measurement: null, sku: v.sku, vendor: 'GARELON', product_has_only_default_variant: product.has_only_default_variant }; });
  const total = items.reduce((a, it) => a + it.final_line_price, 0);
  return new CartDrop({ items, item_count: items.reduce((a, it) => a + it.quantity, 0), total_price: total, items_subtotal_price: total, original_total_price: total,
    cart_level_discount_applications: [], ...taxFlags(), currency: { iso_code: 'EUR' }, note: '', attributes: {}, requires_shipping: true, empty: items.length === 0 });
}

const hexToColor = (hex) => { const n = parseInt(String(hex).slice(1), 16); const r = n >> 16, g = (n >> 8) & 255, b = n & 255; return { red: r, green: g, blue: b, rgb: `${r} ${g} ${b}`, alpha: 1, toString() { return hex; } }; };
const FONTS = { lora: ['Lora', 'lora', 'serif'], inter: ['Inter', 'inter', 'sans-serif'], assistant: ['Inter', 'inter', 'sans-serif'] };
function fontObj(handle) { const m = String(handle || '').match(/^(.*)_([ni])(\d)$/); const f = FONTS[m && m[1]] || FONTS.inter; return { family: f[0], slug: f[1], fallback_families: f[2], style: m && m[2] === 'i' ? 'italic' : 'normal', weight: m ? Number(m[3]) * 100 : 400, handle }; }
function loadSettings() {
  const es = JSON.parse(read('locales/es.json')); const esSchema = JSON.parse(read('locales/es.schema.json'));
  const schema = readJson('config/settings_schema.json'); const settings = {};
  schema.forEach(g => (g.settings || []).forEach(s => { if (s.id && 'default' in s) settings[s.id] = s.default; }));
  const dj = readJson('config/settings_data.json'); const data = typeof dj.current === 'string' ? dj.presets[dj.current] : dj.current; Object.assign(settings, data);
  const schemes = Object.entries(data.color_schemes).map(([id, v]) => { const st = {}; for (const [k, val] of Object.entries(v.settings)) st[k] = k === 'background_gradient' ? val : hexToColor(val); return { id, settings: st }; });
  schemes.forEach(s => (schemes[s.id] = s)); settings.color_schemes = schemes;
  settings.type_body_font = fontObj(data.type_body_font); settings.type_header_font = fontObj(data.type_header_font);
  for (const k of ['logo', 'brand_image', 'favicon']) settings[k] = null;
  return { es, esSchema, settings };
}
let L = loadSettings();
const tr = (dict, key, a) => { let v = String(key).replace(/^t:/, '').split('.').reduce((o, k) => o && o[k], dict); if (v && typeof v === 'object') { const cnt = (a.find(x => Array.isArray(x) && x[0] === 'count') || [])[1]; v = cnt === 1 ? (v.one || v.other) : (v.other || v.one); } v = v || key; const o = {}; if (a.length && Array.isArray(a[0])) a.forEach(([k, val]) => (o[k] = val)); else for (let i = 0; i < a.length; i += 2) o[a[i]] = a[i + 1]; return String(v).replace(/{{\s*(\w+)\s*}}/g, (_, k) => o[k] ?? ''); };
const money = (c) => (Number(c) / 100).toFixed(2).replace('.', ',') + ' €';
const kw = (a, k) => (a.find(x => Array.isArray(x) && x[0] === k) || [])[1];
const fsys = { exists: async (f) => fs.existsSync(f), existsSync: (f) => fs.existsSync(f),
  readFile: async (f) => patch(f, fs.readFileSync(f, 'utf8')), readFileSync: (f) => patch(f, fs.readFileSync(f, 'utf8')),
  resolve: (root, file, ext) => path.resolve(root, path.extname(file) ? file : file + ext), contains: (root, file) => file.startsWith(path.resolve(root)), dirname: (f) => path.dirname(f), sep: path.sep };
// SOLO TEST: {% render block %} de un bloque @app se sustituye por un fixture marcado como prueba
// (recibe el bloque para dejar a la vista qué bloque de app versionado lo originó y con qué ajustes).
function patch(f, s) { return s.replace(/{%-?\s*render block\s*-?%}/g, "{% render 'test-app-block', block: block %}"); }
const engine = new Liquid({ fs: fsys, root: [`${T}/sections`, `${T}/snippets`, `${T}/layout`, FIXTURES], partials: [`${T}/snippets`, FIXTURES], extname: '.liquid', jsTruthy: false, strictFilters: true, strictVariables: false });
const rawBlock = (name) => ({ parse(t, rem) { this.tpls = []; const s = this.liquid.parser.parseStream(rem); s.on(`tag:end${name}`, () => s.stop()).on('template', (tpl) => this.tpls.push(tpl)).on('end', () => { throw new Error(`tag ${name} sin cerrar`); }); s.start(); } });
for (const t of ['schema', 'javascript', 'doc', 'stylesheet']) engine.registerTag(t, { ...rawBlock(t), render() { return ''; } });
engine.registerTag('style', { ...rawBlock('style'), * render(ctx, em) { em.write('<style data-shopify>'); yield this.liquid.renderer.renderTemplates(this.tpls, ctx, em); em.write('</style>'); } });
engine.registerTag('form', { parse(tk, rem) { this.args = tk.args; this.tpls = []; const s = this.liquid.parser.parseStream(rem); s.on('tag:endform', () => s.stop()).on('template', (tpl) => this.tpls.push(tpl)).on('end', () => {}); s.start(); },
  * render(ctx, em) { const type = (this.args.match(/^'([^']+)'/) || [])[1]; const idVar = (this.args.match(/id:\s*([\w.]+)/) || [])[1]; const idLit = (this.args.match(/id:\s*'([^']+)'/) || [])[1];
    const idv = idLit || (idVar ? ctx.getSync(idVar.split('.')) : ''); const cls = (this.args.match(/class:\s*'([^']+)'/) || [])[1] || '';
    const action = type === 'product' ? '/cart/add' : type === 'contact' ? '/contact' : type === 'cart' ? '/cart' : '/' + type;
    ctx.push({ form: type === 'contact' ? { ...FORM, id: idv } : { errors: null, posted_successfully: false, id: idv } });
    em.write(`<form method="post" action="${action}" id="${idv || ''}" accept-charset="UTF-8" class="${cls}" enctype="multipart/form-data" novalidate="novalidate"><input type="hidden" name="form_type" value="${type}"><input type="hidden" name="utf8" value="✓">`);
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, em); em.write('</form>'); ctx.pop(); } });
engine.registerTag('sections', { parse(tk) { this.group = tk.args.replace(/['"]/g, '').trim(); }, * render(ctx, em) { em.write(yield renderGroup(this.group)); } });
engine.registerTag('section', { parse(tk) { this.name = tk.args.replace(/['"]/g, '').trim(); }, * render(ctx, em) { em.write(yield renderSection(this.name, this.name, {}, {}, [])); } });
engine.registerTag('paginate', { parse(tk, rem) { this.tpls = []; const s = this.liquid.parser.parseStream(rem); s.on('tag:endpaginate', () => s.stop()).on('template', (tpl) => this.tpls.push(tpl)).on('end', () => {}); s.start(); },
  * render(ctx, em) { ctx.push({ paginate: { pages: 1, current_page: 1, items: 1, parts: [] } }); yield this.liquid.renderer.renderTemplates(this.tpls, ctx, em); ctx.pop(); } });
const imgUrl = (i) => (i && (i.src || String(i))) || '';
const filters = {
  asset_url: (x) => `/assets/${x}`, asset_img_url: (x) => `/assets/${x}`, image_url: (i) => imgUrl(i), img_url: (i) => imgUrl(i), file_url: (x) => `/files/${x}`,
  image_tag: (u, ...a) => { const at = a.filter(Array.isArray).filter(([k]) => !['widths', 'preload'].includes(k)).map(([k, v]) => `${k}="${v}"`).join(' '); return `<img src="${u}" ${at}>`; },
  t: (key, ...a) => tr(L.es, key, a), money, money_with_currency: (c) => money(c) + ' EUR', money_without_currency: (c) => (Number(c) / 100).toFixed(2).replace('.', ','), money_amount: (c) => (Number(c) / 100).toFixed(2).replace('.', ','),
  placeholder_svg_tag: (n, cls) => `<svg class="${cls || ''}" data-placeholder="${n}" viewBox="0 0 4 3"></svg>`,
  inline_asset_content: (x) => { try { return fs.readFileSync(`${T}/assets/${x}`, 'utf8'); } catch (e) { return ''; } },
  link_to: (txt, url) => `<a href="${url}">${txt}</a>`, login_button: () => '', stylesheet_tag: (u) => `<link rel="stylesheet" href="${u}" media="all">`, script_tag: (u) => `<script src="${u}"></script>`,
  handleize: (s) => String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), handle: (s) => filters.handleize(s),
  color_brightness: () => 200, color_lighten: (c) => c, color_darken: (c) => c, color_mix: (c) => c, color_modify: (c) => c, color_to_rgb: (c) => c,
  font_face: (x) => x && x.slug ? `@font-face{font-family:"${x.family}";font-weight:${x.weight};font-style:${x.style};font-display:swap;src:url(/__fonts/${x.slug}/files/${x.slug}-latin-${x.weight}-${x.style}.woff2) format("woff2")}` : '',
  font_modify: (x, k, v) => x && x.slug ? Object.assign({}, x, k === 'weight' ? { weight: v === 'bold' ? 700 : v === 'bolder' ? 700 : Number(v) || x.weight } : { style: v }) : x,
  font_url: (x) => x && x.slug ? `/__fonts/${x.slug}/files/${x.slug}-latin-${x.weight}-${x.style}.woff2` : '',
  standard_event_data: () => '{}', structured_data: (p) => JSON.stringify({ '@context': 'http://schema.org', '@type': p && p.title ? 'Product' : 'Thing', name: p && p.title }), json: (x) => JSON.stringify(x ?? null),
  payment_button: () => '<div class="shopify-payment-button"><button type="button" class="shopify-payment-button__button shopify-payment-button__button--unbranded">Comprar ahora</button></div>',
  payment_terms: () => '', escape_once: (x) => x, url_escape: (x) => encodeURIComponent(x), url_encode: (x) => encodeURIComponent(x), within: (u) => u, image_padding_bottom: () => '100%',
  item_count_for_variant: (cart, id) => { const l = state.cart.find(x => x.id === Number(id)); return l ? l.quantity : 0; },
  payment_type_svg_tag: () => '', payment_type_img_url: () => '', default_errors: () => '', customer_login_link: (t) => `<a href="/account/login">${t}</a>`,
  pluralize: (n, a, b) => (Number(n) === 1 ? a : b), weight_with_unit: (w) => `${w} g`, time_tag: (d) => `<time>${d}</time>`, date: (d) => String(d), highlight: (x) => x, highlight_active_tag: (x) => x,
  external_video_url: () => '', video_tag: () => '', media_tag: () => '', model_viewer_tag: () => '', link_to_tag: (x) => x, metafield_tag: (x) => String(x), metafield_text: (x) => String(x),
  sort_by: (x) => x, url_for_type: () => '/collections/all', url_for_vendor: () => '/collections/vendors', link_to_add_tag: (x) => x, link_to_remove_tag: (x) => x, link_to_type: (x) => x, link_to_vendor: (x) => x,
  shopify_asset_url: (x) => `/shopify/${x}`, global_asset_url: (x) => `/global/${x}`, placeholder_svg: () => '', md5: () => 'x', sha256: () => 'x', base64_encode: (x) => x,
  preload_tag: () => '', format_address: () => '', avatar: () => '', currency_selector: () => '', translate: (k, ...a) => tr(L.es, k, a), camelize: (x) => x, hmac_sha256: () => 'x', unit_price_with_measurement: () => '',
};
Object.entries(filters).forEach(([k, v]) => engine.registerFilter(k, v));

// SOLO TEST · Estado del formulario de contacto de la petición en curso, como lo deja Shopify: tras un envío válido
// redirige a la página con ?contact_posted=true (form.posted_successfully?); con el email vacío o inválido vuelve a
// pintar la página con form.errors. No se envía ningún correo: eso solo puede comprobarse en Shopify real.
let FORM = { errors: null, posted_successfully: false };
const policyList = () => [['refund-policy', 'Política de reembolso', state.refund], ['privacy-policy', 'Política de privacidad', 'ok'], ['terms-of-service', 'Términos del servicio', 'ok'], ['shipping-policy', 'Política de envío', state.shipping], ['legal-notice', 'Aviso legal', state.legal === 'policy' ? 'ok' : 'none'],
  ['contact-information', 'Información de contacto', state.contactinfo ? 'ok' : 'none']]
  .filter(([, , s]) => s === 'ok').map(([h, title]) => ({ url: `/policies/${h}`, title, body: '<p>Texto de prueba.</p>', handle: h }));
// Contacto: ok = página «contacto» con la plantilla «contact» | legacy = página «contact» (la que Shopify crea en una
// tienda nueva) con la plantilla «contact» | plain = página «contacto» con la plantilla predeterminada | none = sin página.
function pagesObj() { const p = {}; if (state.contact === 'ok') p.contacto = { url: '/pages/contacto', title: 'Contacto', handle: 'contacto', content: '', template_suffix: 'contact' };
  if (state.contact === 'legacy') p.contact = { url: '/pages/contact', title: 'Contacto', handle: 'contact', content: '', template_suffix: 'contact' };
  if (state.contact === 'plain') p.contacto = { url: '/pages/contacto', title: 'Contacto', handle: 'contacto', content: '', template_suffix: null };
  if (state.cookies === 'ok') p['politica-de-cookies'] = { url: '/pages/politica-de-cookies', title: 'Política de cookies', handle: 'politica-de-cookies', content: '<p>x</p>' };
  if (state.cookies === 'legacy') p.cookies = { url: '/pages/cookies', title: 'Cookies', handle: 'cookies', content: '<p>x</p>' };
  if (state.legal === 'page') p['aviso-legal'] = { url: '/pages/aviso-legal', title: 'Aviso legal', handle: 'aviso-legal', content: '<p>x</p>' }; return p; }
// Menús que Shopify crea en una tienda nueva (simulados): el principal trae el Catálogo.
const linklists = { 'main-menu': { handle: 'main-menu', title: 'Menú principal', links: [{ title: 'Inicio', url: '/', type: 'frontpage_link', links: [], levels: 0, active: false, current: false, child_active: false, child_current: false },
  { title: 'Catálogo', url: '/collections/all', type: 'catalog_link', links: [], levels: 0, active: false, current: false, child_active: false, child_current: false },
  { title: 'Contacto', url: '/pages/contact', type: 'page_link', links: [], levels: 0, active: false, current: false, child_active: false, child_current: false }], levels: 1 },
  footer: { handle: 'footer', title: 'Menú de pie de página', links: [{ title: 'Buscar', url: '/search', type: 'search_link', links: [], levels: 0 }], levels: 1 },
  'customer-account-main-menu': { handle: 'customer-account-main-menu', links: [], levels: 0 } };
function globals(req, product) {
  const noCat = state.catalog === 'none'; const policies = policyList(); const pol = (h) => policies.find(p => p.handle === h) || null;
  const settings = state.freeship === '' ? L.settings : { ...L.settings, garelon_free_shipping: state.freeship === '1' };
  return { settings, pages: pagesObj(), linklists, product: req.pageType === 'product' ? product : null,
    collections: { all: { products: noCat ? [] : [product], products_count: noCat ? 0 : 1, url: '/collections/all', title: 'Productos' } }, all_products: noCat ? {} : { [HANDLE]: product }, cart: cartDrop(),
    routes: { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', cart_update_url: '/cart/update', search_url: '/search', account_url: '/account', account_login_url: '/account/login', account_register_url: '/account/register', all_products_collection_url: '/collections/all', collections_url: '/collections', predictive_search_url: '/search/suggest', product_recommendations_url: '/recommendations/products' },
    shop: { name: 'GARELON', policies, refund_policy: pol('refund-policy'), shipping_policy: pol('shipping-policy'), privacy_policy: pol('privacy-policy'), terms_of_service: pol('terms-of-service'),
      enabled_payment_types: [], customer_accounts_enabled: state.accounts, customer_accounts_optional: true, url: 'http://localhost:' + PORT, secure_url: 'http://localhost:' + PORT, locale: 'es', currency: 'EUR', money_format: '{{amount_with_comma_separator}} €', brand: null, types: [], vendors: [], email: '' },
    localization: { available_countries: [], available_languages: [], language: { iso_code: 'es' }, country: { iso_code: 'ES' } }, customer: null,
    request: { page_type: req.pageType, design_mode: state.design, path: req.pageType === '404' ? '/404' : req.pathname, host: 'localhost', origin: 'http://localhost:' + PORT, locale: { iso_code: 'es', primary: true }, visual_preview_mode: false },
    template: { name: req.pageType, suffix: req.suffix || null, directory: null }, canonical_url: 'http://localhost' + req.pathname, page_title: req.title || 'GARELON', page_description: '',
    content_for_header: `<script>window.Shopify={routes:{root:'/'},designMode:${state.design},currency:{active:'EUR',rate:'1.0'},locale:'es',PaymentButton:{init(){}}};</script>`, powered_by_link: '', current_tags: null, scheme_classes: '' };
}
function schemaOf(type) { const src = read(`sections/${type}.liquid`); const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/); return m ? JSON.parse(m[1]) : {}; }
function resolveSettings(defs, vals, loc) {
  const s = {}; (defs || []).forEach(x => { if (x.id && 'default' in x) s[x.id] = x.default; }); Object.assign(s, vals || {});
  for (const d of defs || []) { if (!d.id) continue; const v = s[d.id];
    if (typeof v === 'string' && v.startsWith('t:')) s[d.id] = tr(loc, v, []);
    if (['product', 'collection', 'page', 'image_picker', 'video', 'blog', 'article'].includes(d.type) && (v === '' || v === undefined)) s[d.id] = null;
    if (d.type === 'link_list') s[d.id] = v ? (linklists[v] || null) : null;
    if (d.type === 'color_scheme' && v === undefined) s[d.id] = 'scheme-1'; }
  return s;
}
function sectionData(id, type, vals, blocksIn, order) {
  const sc = schemaOf(type); const s = resolveSettings(sc.settings, vals, L.esSchema);
  const bdefs = Object.fromEntries((sc.blocks || []).map(b => [b.type, b]));
  const blocks = (order || []).filter(bid => blocksIn[bid] && !blocksIn[bid].disabled).map(bid => { const b = blocksIn[bid];
    // Como Shopify: un bloque de app versionado (shopify://apps/…) llega a Liquid con block.type == '@app'.
    const isApp = b.type === '@app' || b.type.startsWith('shopify://apps/');
    const bs = isApp ? { ...(b.settings || {}) } : resolveSettings((bdefs[b.type] || {}).settings, b.settings, L.esSchema);
    const type = isApp ? '@app' : b.type;
    return { id: bid, type, app_type: isApp ? b.type : '', settings: bs, shopify_attributes: `data-shopify-editor-block='{"id":"${bid}","type":"${type}"}'` }; });
  return { id, settings: s, blocks, cls: sc.class || '', blocks_by_id: blocks };
}
let CURRENT = null;
async function renderSection(id, type, vals, blocks, order, extraCls) {
  const section = sectionData(id, type, vals, blocks, order); const scope = { ...CURRENT, section }; engine.options.globals = scope;
  const html = await engine.renderFile(type, scope);
  return `<div id="shopify-section-${id}" class="shopify-section ${extraCls || ''} ${section.cls}">${html}</div>`;
}
async function renderGroup(group) { const g = readJson(`sections/${group}.json`); let out = '';
  for (const sid of g.order) { const s = g.sections[sid]; if (s.disabled) continue; out += await renderSection(`sections--1__${sid}`, s.type, s.settings, s.blocks || {}, s.block_order || [], `shopify-section-group-${group}`); } return out; }
function templateFile(pageType, suffix) { return `templates/${pageType}${suffix ? '.' + suffix : ''}.json`; }
async function renderTemplate(file, only) {
  const tpl = readJson(file); let out = '';
  for (const sid of tpl.order) { if (only && sid !== only) continue; const s = tpl.sections[sid]; if (s.disabled) continue;
    const blocks = JSON.parse(JSON.stringify(s.blocks || {})); let order = [...(s.block_order || [])];
    // SOLO TEST: reviews=app|both simula que la app de reseñas está instalada; none|summary, que no lo está
    // (Shopify no pinta los bloques de una app ausente). Los bloques de app versionados en la plantilla
    // (Judge.me, ronda M) se pintan solo con la app «instalada»; si la sección no trae ninguno, se simula
    // que el dueño lo añadió desde el editor, como antes de la ronda M.
    const appOn = state.reviews === 'app' || state.reviews === 'both';
    const versioned = order.filter(bid => (blocks[bid] || {}).type && blocks[bid].type.startsWith('shopify://apps/'));
    if (!appOn) order = order.filter(bid => !versioned.includes(bid));
    if (s.type === 'garelon-reviews' && appOn && versioned.length === 0) { blocks.test_app = { type: '@app', settings: {} }; order.push('test_app'); }
    if (state.chips && sid === 'regalo' && s.type === 'garelon-details' && order.length === 0) TEST_CHIPS.forEach((t, i) => { blocks[`test_chip_${i + 1}`] = { type: 'item', settings: { icon: 'none', title: t } }; order.push(`test_chip_${i + 1}`); });
    out += await renderSection(`template--1__${sid}`, s.type, s.settings, blocks, order); }
  return out;
}
// SOLO TEST: etiquetas neutras (no son ocasiones de regalo); la última es larga para probar dos líneas.
const TEST_CHIPS = ['Etiqueta 1', 'Etiqueta 2', 'Etiqueta 3', 'Etiqueta 4', 'Etiqueta 5', 'Etiqueta de prueba más larga'];
const types = { '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };
function route(p) {
  const prodHandle = (p.match(/^\/products\/([^/?#]+)/) || [])[1]; const pageHandle = (p.match(/^\/pages\/([^/?#]+)/) || [])[1]; const polHandle = (p.match(/^\/policies\/([^/?#]+)/) || [])[1];
  if (p === '/') return state.noindex || !fs.existsSync(`${T}/templates/index.json`) ? { pageType: '404' } : { pageType: 'index' };
  if (prodHandle) return prodHandle === HANDLE && state.catalog !== 'none' ? { pageType: 'product' } : { pageType: '404' };
  if (pageHandle) { const pg = pagesObj()[pageHandle]; return pg ? { pageType: 'page', suffix: pg.template_suffix, page: pg } : { pageType: '404' }; }
  if (polHandle) { const pol = policyList().find(x => x.handle === polHandle); return pol ? { pageType: 'policy', policy: pol } : { pageType: '404' }; }
  if (p === '/cart') return { pageType: 'cart' };
  if (p === '/search') return { pageType: 'search' };
  if (p === '/collections/all') return { pageType: 'collection' };
  return { pageType: '404' };
}
http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost'); let p = u.pathname;
    { const ok = u.searchParams.get('contact_posted') === 'true'; FORM = { errors: null, posted_successfully: ok, 'posted_successfully?': ok }; }
    if (p.startsWith('/__fonts/')) { const fp = path.join(FONTS_DIR, p.slice(9)); return fs.readFile(fp, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': 'font/woff2' }); res.end(d); }); }
    if (p.startsWith('/assets/')) { const fp = path.join(T, decodeURIComponent(p)); return fs.readFile(fp, (e, d) => { if (e) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': types[path.extname(fp)] || 'application/octet-stream' }); res.end(d); }); }
    if (p === '/__state') { const q = u.searchParams;
      for (const k of ['mode', 'catalog', 'contact', 'refund', 'shipping', 'cookies', 'legal', 'reviews', 'freeship', 'taxes']) if (q.has(k)) state[k] = q.get(k);
      for (const k of ['design', 'noindex', 'accounts', 'media', 'chips', 'contactinfo']) if (q.has(k)) state[k] = q.get(k) === '1';
      if (q.has('soldout')) state.soldout = q.get('soldout').split(',').filter(Boolean).map(Number);
      if (q.has('reset')) { state.cart = []; state.log = []; if (!q.has('freeship')) state.freeship = ''; if (!q.has('taxes')) state.taxes = 'included'; if (!q.has('chips')) state.chips = false; }
      if (q.has('reload')) L = loadSettings();
      res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(state)); }
    if (p === '/cart.js' || p === '/cart.json') { res.setHeader('Content-Type', 'application/json'); const c = cartDrop(); return res.end(JSON.stringify({ item_count: c.item_count, items: c.items.map(i => ({ id: i.id, quantity: i.quantity, variant_id: i.id })), total_price: c.total_price })); }
    if ((p === '/cart/add' || p === '/cart/add.js') && req.method === 'POST') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const fd = await new Response(Buffer.concat(chunks), { headers: { 'content-type': req.headers['content-type'] } }).formData();
      const entry = {}; for (const [k, v] of fd.entries()) entry[k] = (k in entry) ? [].concat(entry[k], v) : v; state.log.push(entry);
      const id = Number(fd.get('id')); const qty = Number(fd.get('quantity') || 1); const prod = buildProduct(null); const v = prod.variants.find(x => x.id === id);
      res.setHeader('Content-Type', 'application/json');
      if (!v || !v.available) { res.writeHead(422); return res.end(JSON.stringify({ status: 422, message: 'Cart Error', description: 'Agotado' })); }
      const line = state.cart.find(l => l.id === id); if (line) line.quantity += qty; else state.cart.push({ id, quantity: qty });
      CURRENT = globals({ pageType: 'product', pathname: '/cart' }, prod); const sections = {};
      for (const sid of String(fd.get('sections') || '').split(',').filter(Boolean)) sections[sid] = await renderSection(sid, sid, {}, {}, []);
      return res.end(JSON.stringify({ id, variant_id: id, quantity: qty, title: `${prod.title} - ${v.title}`, variant_title: v.title, key: `${id}:k`, sections }));
    }
    if ((p === '/cart/change' || p === '/cart/change.js') && req.method === 'POST') {
      const chunks = []; for await (const c of req) chunks.push(c); const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');
      const idx = Number(body.line) - 1; if (state.cart[idx]) { if (Number(body.quantity) === 0) state.cart.splice(idx, 1); else state.cart[idx].quantity = Number(body.quantity); }
      CURRENT = globals({ pageType: 'cart', pathname: '/cart' }, buildProduct(null)); const sections = {};
      for (const sid of String(body.sections || '').split(',').filter(Boolean)) sections[sid] = await renderSection(sid, sid, {}, {}, []);
      const c = cartDrop(); res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ item_count: c.item_count, items: c.items.map(i => ({ id: i.id, quantity: i.quantity })), total_price: c.total_price, sections }));
    }
    if (p === '/contact' && req.method === 'POST') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const fd = await new Response(Buffer.concat(chunks), { headers: { 'content-type': req.headers['content-type'] } }).formData();
      const entry = {}; for (const [k, v] of fd.entries()) entry[k] = v; state.log.push(entry);
      // Tras un error la URL queda en /contact (como en Shopify): el siguiente envío vuelve a la última página de contacto.
      let back = new URL(req.headers.referer || 'http://localhost/', 'http://localhost').pathname;
      if (back === '/contact') back = state.contactBack || '/'; else state.contactBack = back;
      if (fd.get('form_type') === 'contact' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get('contact[email]') || ''))) {
        res.writeHead(302, { Location: back + '?contact_posted=true#ContactForm' }); return res.end(); }
      FORM = { errors: Object.assign(['email'], { messages: { email: 'no es válido.' }, translated_fields: { email: 'Correo electrónico' } }), posted_successfully: false, 'posted_successfully?': false, email: fd.get('contact[email]') };
      p = back;
    }
    const r = route(p); let selected = u.searchParams.has('variant') ? Number(u.searchParams.get('variant')) : null;
    const ovIds = u.searchParams.has('option_values') ? u.searchParams.get('option_values').split(',').filter(Boolean).map(Number) : null;
    const product = buildProduct(selected, ovIds);
    CURRENT = globals({ pageType: r.pageType, pathname: p, suffix: r.suffix }, product);
    if (r.page) CURRENT.page = r.page; if (r.policy) CURRENT.policy = r.policy;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (u.searchParams.has('section_id')) { // Section Rendering API
      const sid = u.searchParams.get('section_id'); const short = sid.replace(/^template--1__/, '');
      // Como Shopify: el id de sección identifica su plantilla (la compra de la home se pide desde la URL del producto).
      for (const pt of ['product', 'index']) { const file = templateFile(pt); const tpl = readJson(file); if (tpl.sections[short]) { CURRENT.product = pt === 'product' ? product : null; return res.end(await renderTemplate(file, short)); } }
      if (fs.existsSync(`${T}/sections/${sid}.liquid`)) return res.end(await renderSection(sid, sid, {}, {}, []));
      res.writeHead(404); return res.end('');
    }
    let content;
    if (r.pageType === 'policy') content = `<div class="shopify-policy__container"><h1>${r.policy.title}</h1>${r.policy.body}</div>`;
    else { const file = templateFile(r.pageType, r.suffix); content = fs.existsSync(`${T}/${file}`) ? await renderTemplate(file) : await renderTemplate(templateFile(r.pageType)); }
    res.statusCode = r.pageType === '404' ? 404 : 200; res.setHeader('X-Test-Template', r.pageType + (r.suffix ? '.' + r.suffix : ''));
    const scope = { ...CURRENT, content_for_layout: content }; engine.options.globals = scope;
    res.end(await engine.renderFile('theme', scope));
  } catch (e) { console.error(e); res.writeHead(500); res.end('<pre>' + String(e.stack) + '</pre>'); }
}).listen(PORT, () => console.log('listening', PORT, T));
