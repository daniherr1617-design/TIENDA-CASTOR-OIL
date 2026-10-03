#!/usr/bin/env python3
"""GARELON · snapshot del estado real del repositorio (solo lectura, sin dependencias).

Lee git, las plantillas JSON, los schemas y los assets y escribe en Markdown (o JSON)
los datos que cambian con el tiempo: rama, HEAD, orden de la home y de la ficha,
galerías, packs, confianza, opiniones, cabecera, pie, imágenes del tema, conteos
y herramientas de validación. Sirve para regenerar
`references/current-store-state.md` y para revalidar datos antes de una tarea.

No escribe nada salvo con --out. No necesita red ni Shopify: lo que depende del
Admin de Shopify (precios, variantes, apps, políticas) NO sale de aquí.

Uso:
  python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py [--repo RUTA] [--json] [--out ARCHIVO]
  python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py --update-state
      Regenera en references/current-store-state.md la cabecera, el marcador del commit y el
      bloque de datos (entre <!-- snapshot:start --> y <!-- snapshot:end -->). Las notas
      humanas de las demás secciones se revisan a mano.
"""
import argparse
import datetime
import json
import os
import re
import subprocess
import sys

THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']


def git(repo, *args):
    try:
        return subprocess.run(['git', '-C', repo, *args], capture_output=True, text=True, check=True).stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return ''


def load_json(path):
    if not os.path.exists(path):
        return None
    text = open(path, encoding='utf-8').read()
    text = re.sub(r'/\*.*?\*/', '', text, count=1, flags=re.S)  # cabecera /* … */ de Shopify
    return json.loads(text)


def schema(repo, section_type):
    path = os.path.join(repo, 'sections', section_type + '.liquid')
    if not os.path.exists(path):
        return {}
    m = re.search(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}', open(path, encoding='utf-8').read(), re.S)
    return json.loads(m.group(1)) if m else {}


def effective(settings, defs, key):
    """Valor guardado en la plantilla o, si no está, el default del schema (como hace Shopify)."""
    if key in settings:
        return settings[key]
    for d in defs:
        if d.get('id') == key:
            return d.get('default')
    return None


def block_defs(sc, block_type):
    for b in sc.get('blocks', []):
        if b.get('type') == block_type:
            return b.get('settings', [])
    return []


def sections_of(repo, rel):
    data = load_json(os.path.join(repo, rel)) or {}
    out = []
    for sid in data.get('order', []):
        sec = data['sections'][sid]
        blocks = [(bid, sec['blocks'][bid]) for bid in sec.get('block_order', [])]
        out.append({'id': sid, 'type': sec['type'], 'disabled': bool(sec.get('disabled')),
                    'settings': sec.get('settings', {}), 'blocks': blocks})
    return out


def find(secs, type_=None, sid=None):
    for s in secs:
        if (type_ and s['type'] == type_) or (sid and s['id'] == sid):
            return s
    return None


def block(sec, block_type):
    for bid, b in (sec or {}).get('blocks', []):
        if b['type'] == block_type:
            return bid, b
    return None, None


def image_keys(repo):
    path = os.path.join(repo, 'snippets', 'garelon-image.liquid')
    if not os.path.exists(path):
        return {}
    src = open(path, encoding='utf-8').read()
    return {k: w.split(',') for k, w in re.findall(r"when '([\w-]+)'\s*assign widths = '([\d,]+)'", src)}


def collect(repo):
    snap = {}
    snap['generated_utc'] = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    remote = git(repo, 'remote', 'get-url', 'origin')
    m = re.search(r'[:/]([^/:]+/[^/]+?)(?:\.git)?$', remote)
    snap['repo'] = m.group(1) if m else 'NO DISPONIBLE'
    snap['branch'] = git(repo, 'branch', '--show-current') or 'NO DISPONIBLE (HEAD separado)'
    snap['head'] = git(repo, 'rev-parse', 'HEAD')
    snap['head_short'] = git(repo, 'rev-parse', '--short', 'HEAD')
    snap['head_date'] = git(repo, 'log', '-1', '--format=%cs')
    snap['head_subject'] = git(repo, 'log', '-1', '--format=%s')
    # Último commit que cambió el tema: es el estado de la tienda que describe el snapshot.
    snap['theme_commit'] = git(repo, 'log', '-1', '--format=%h', '--', *THEME_DIRS)
    snap['theme_commit_date'] = git(repo, 'log', '-1', '--format=%cs', '--', *THEME_DIRS)
    # Solo las carpetas del tema: los cambios en docs/skill no alteran el estado de la tienda.
    snap['theme_clean'] = git(repo, 'status', '--porcelain', '--', *THEME_DIRS) == ''
    snap['dawn_base'] = git(repo, 'log', '--format=%h', '--grep=Dawn 16.0.0 oficial', '-n', '1') or 'NO DISPONIBLE'

    info = (load_json(os.path.join(repo, 'config', 'settings_schema.json')) or [{}])[0]
    snap['theme'] = {'name': info.get('theme_name'), 'version': info.get('theme_version')}
    sd = load_json(os.path.join(repo, 'config', 'settings_data.json')) or {}
    cur = sd.get('current')
    cur = sd.get('presets', {}).get(cur, {}) if isinstance(cur, str) else (cur or {})
    snap['settings'] = {k: cur.get(k) for k in ('type_header_font', 'type_body_font', 'cart_type', 'page_width',
                                                 'buttons_radius', 'predictive_search_enabled')}
    # Envío gratis: ajuste global (Configuración del tema › Carrito) y quién usa la nota común.
    gdefs = {x['id']: x for g in (load_json(os.path.join(repo, 'config/settings_schema.json')) or []) for x in g.get('settings', []) if x.get('id')}
    if 'garelon_free_shipping' in gdefs:
        snap['free_shipping'] = {'value': cur.get('garelon_free_shipping', gdefs['garelon_free_shipping'].get('default')),
                                 'source': 'settings_data' if 'garelon_free_shipping' in cur else 'default del schema',
                                 'used_by': sorted(f'{d}/{f}' for d in ('sections', 'snippets') for f in os.listdir(os.path.join(repo, d))
                                                   if f.endswith('.liquid') and "render 'garelon-shipping-note'" in open(os.path.join(repo, d, f), encoding='utf-8').read())}
    snap['color_schemes'] = {k: {x: v['settings'].get(x) for x in ('background', 'text', 'button')}
                             for k, v in cur.get('color_schemes', {}).items()}

    snap['counts'] = {d: len([f for f in os.listdir(os.path.join(repo, d)) if not f.startswith('.')])
                      for d in THEME_DIRS if os.path.isdir(os.path.join(repo, d))}
    snap['garelon_files'] = {
        'sections': sorted(f for f in os.listdir(os.path.join(repo, 'sections')) if f.startswith('garelon-')),
        'snippets': sorted(f for f in os.listdir(os.path.join(repo, 'snippets')) if f.startswith('garelon-')),
        'assets': sorted(f for f in os.listdir(os.path.join(repo, 'assets')) if f.startswith(('garelon', 'producto-'))),
    }
    if snap['dawn_base'] != 'NO DISPONIBLE':
        diff = git(repo, 'diff', '--name-status', snap['dawn_base'], 'HEAD', '--', *THEME_DIRS).splitlines()
        snap['vs_dawn'] = {
            'added': sorted(l.split('\t')[1] for l in diff if l.startswith('A')),
            'modified': sorted(l.split('\t')[1] for l in diff if l.startswith('M') and not l.split('\t')[1].startswith('locales/')),
            'locales_modified': len([l for l in diff if l.startswith('M') and l.split('\t')[1].startswith('locales/')]),
            'deleted': sorted(l.split('\t')[1] for l in diff if l.startswith('D')),
        }

    home = sections_of(repo, 'templates/index.json')
    prod = sections_of(repo, 'templates/product.json')
    snap['home_order'] = [(s['id'], s['type']) + (('desactivada',) if s['disabled'] else ()) for s in home]
    snap['product_order'] = [(s['id'], s['type']) + (('desactivada',) if s['disabled'] else ()) for s in prod]

    fp_sc, mp_sc = schema(repo, 'featured-product'), schema(repo, 'main-product')
    buy_home, buy_prod = find(home, 'featured-product'), find(prod, 'main-product')
    snap['gallery'] = {
        'home': {'media': (buy_home or {}).get('settings', {}).get('garelon_media'),
                 'keys': (buy_home or {}).get('settings', {}).get('garelon_gallery_keys')},
        'product': {'media': (buy_prod or {}).get('settings', {}).get('garelon_media'),
                    'keys': (buy_prod or {}).get('settings', {}).get('garelon_gallery_keys')},
    }
    snap['buy_blocks'] = {
        'home': [b['type'] for _, b in (buy_home or {}).get('blocks', [])],
        'product': [b['type'] for _, b in (buy_prod or {}).get('blocks', [])],
    }
    _, offer = block(buy_home, 'garelon_offer')
    if offer:
        defs = block_defs(fp_sc, 'garelon_offer')
        s = offer.get('settings', {})
        snap['offer'] = {k: effective(s, defs, k) for k in
                         ('heading', 'option_name', 'unit_singular', 'sub_1', 'sub_2', 'sub_3',
                          'show_unit_price', 'badge_pack', 'badge_text', 'show_promo', 'promo_text')}
        snap['offer']['badge_text_default'] = next((d.get('default') for d in defs if d.get('id') == 'badge_text'), None)
    _, trust = block(buy_home, 'garelon_trust')
    if trust:
        s = trust.get('settings', {})
        defs = block_defs(fp_sc, 'garelon_trust')
        snap['trust'] = {'phrase': effective(s, defs, 'phrase'),
                         'chips': [(effective(s, defs, f'chip_{i}_icon'), effective(s, defs, f'chip_{i}_text')) for i in range(1, 5)]}
    hero = find(home, 'garelon-hero')
    if hero:
        hs = hero['settings']
        snap['hero'] = {k: hs.get(k) for k in ('image_key', 'eyebrow', 'heading', 'show_price', 'button_label', 'button_link', 'button2_label')}
    snap['seal'] = [(f'{tpl}:{s["id"]}', s['settings'].get('garelon_badge')) for tpl, secs in (('index', home), ('product', prod))
                    for s in secs if s['type'] == 'rich-text' and s['settings'].get('garelon_badge') not in (None, 'none')]
    rev = find(home, 'garelon-reviews')
    if rev:
        snap['reviews'] = {k: rev['settings'].get(k) for k in ('heading', 'show_summary', 'summary_with_app', 'hide_without_reviews', 'note')}
        snap['reviews']['app_blocks_in_template'] = len([b for _, b in rev['blocks'] if b['type'] == '@app'])
        # D30: bloques de app versionados en «GARELON Opiniones» (home y ficha) y App Embeds de settings_data.
        prev = find(prod, 'garelon-reviews')
        snap['reviews']['versioned_apps'] = {tpl: [(b['type'].split('/blocks/')[-1].split('/')[0], b.get('settings', {}).get('review_data'))
                                                   for _, b in (sec or {}).get('blocks', []) if b['type'].startswith('shopify://apps/')]
                                             for tpl, sec in (('index', rev), ('product', prev))}
        snap['reviews']['app_embeds'] = [(b.get('type', '').split('/blocks/')[-1].split('/')[0], not b.get('disabled', False))
                                         for b in (cur.get('blocks') or {}).values()]
    sticky = find(prod, 'garelon-sticky-cta')
    snap['sticky_cta'] = bool(sticky and not sticky['disabled'])

    hg = sections_of(repo, 'sections/header-group.json')
    hdr = find(hg, 'header')
    if hdr:
        hs = hdr['settings']
        snap['nav'] = [(hs.get(f'nav_link_{i}_label'), hs.get(f'nav_link_{i}_url')) for i in range(1, 5) if hs.get(f'nav_link_{i}_label')]
        snap['header_search'] = hs.get('garelon_show_search')
    ann = find(hg, 'announcement-bar')
    snap['announcement'] = [b['settings'].get('text') for _, b in (ann or {}).get('blocks', [])]
    fg = sections_of(repo, 'sections/footer-group.json')
    ft = find(fg, 'footer')
    if ft:
        snap['footer'] = {k: ft['settings'].get(k) for k in ('payment_enable', 'newsletter_enable', 'show_policy')}
        snap['footer']['blocks'] = [b['type'] for _, b in ft['blocks']]

    keys = image_keys(repo)
    snap['image_keys'] = {k: {'widths': w, 'complete': all(os.path.exists(os.path.join(repo, 'assets', f'producto-{k}-{x}.webp')) for x in w)}
                          for k, w in keys.items()}
    snap['source_images_in_root'] = sorted(f for f in os.listdir(repo) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')))
    snap['templates'] = sorted(os.listdir(os.path.join(repo, 'templates')))
    hp = os.path.join(repo, 'tests', 'render-harness')
    if os.path.isfile(os.path.join(hp, 'package.json')):
        pkg = load_json(os.path.join(hp, 'package.json')) or {}
        tjs = open(os.path.join(hp, 'suite', 'tests.js'), encoding='utf-8').read() if os.path.isfile(os.path.join(hp, 'suite', 'tests.js')) else ''
        m = re.search(r"const PHASES = '([A-Z]+)'", tjs)
        snap['render_harness'] = {'path': 'tests/render-harness', 'phases': m.group(1) if m else 'NO DISPONIBLE',
                                  'deps': pkg.get('dependencies', {}), 'lock': os.path.isfile(os.path.join(hp, 'package-lock.json'))}
    snap['tools'] = sorted(f for f in os.listdir(os.path.join(repo, 'tools'))) if os.path.isdir(os.path.join(repo, 'tools')) else []
    snap['locales_with_garelon'] = len([f for f in os.listdir(os.path.join(repo, 'locales'))
                                        if not f.endswith('.schema.json') and 'garelon' in (load_json(os.path.join(repo, 'locales', f)) or {})])
    return snap


def fmt_list(items):
    return ' → '.join(f'`{i[0]}` ({i[1]}{", " + i[2] if len(i) > 2 else ""})' for i in items)


def to_markdown(s):
    L = []
    a = L.append
    a(f"- **Generado:** {s['generated_utc']}")
    a(f"- **Repositorio:** `{s['repo']}` · **rama:** `{s['branch']}` · **HEAD:** `{s['head_short']}` ({s['head_date']}) «{s['head_subject']}»")
    a(f"- **Último commit que cambió el tema:** `{s['theme_commit']}` ({s['theme_commit_date']})")
    a(f"- **Carpetas del tema sin cambios pendientes:** {'sí' if s['theme_clean'] else 'NO (hay cambios sin commit en el tema: el snapshot no coincide con HEAD)'}")
    a(f"- **Tema:** {s['theme']['name']} {s['theme']['version']} · base Dawn en el commit `{s['dawn_base']}`")
    a(f"- **Conteos (carpetas del tema):** " + ', '.join(f'{k} {v}' for k, v in s['counts'].items()))
    if 'vs_dawn' in s:
        v = s['vs_dawn']
        a(f"- **Frente a Dawn:** {len(v['added'])} archivos añadidos, {len(v['modified'])} modificados (sin contar locales), {v['locales_modified']} locales modificados, {len(v['deleted'])} borrados")
        a('  - Modificados: ' + ', '.join(f'`{f}`' for f in v['modified']))
    g = s['garelon_files']
    a('- **Secciones GARELON:** ' + ', '.join(f'`{f}`' for f in g['sections']))
    a('- **Snippets GARELON:** ' + ', '.join(f'`{f}`' for f in g['snippets']))
    a(f"- **Home (`templates/index.json`):** {fmt_list(s['home_order'])}")
    a(f"- **Ficha (`templates/product.json`):** {fmt_list(s['product_order'])}")
    a(f"- **Bloques de compra (home):** {', '.join(s['buy_blocks']['home'])}")
    a(f"- **Bloques de compra (ficha):** {', '.join(s['buy_blocks']['product'])}")
    gl = s['gallery']
    a(f"- **Galería home:** `{gl['home']['keys']}` (origen: {gl['home']['media']}) · **ficha:** `{gl['product']['keys']}` (origen: {gl['product']['media']})")
    if 'hero' in s:
        h = s['hero']
        a(f"- **Portada:** imagen `{h['image_key']}`, H1 «{h['heading']}», precio visible: {h['show_price']}, CTA «{h['button_label']}» → `{h['button_link'] or '/#comprar (vacío = compra de la home)'}`, 2.º botón: {h['button2_label'] or 'ninguno'}")
    if 'offer' in s:
        o = s['offer']
        a(f"- **Packs («{o['heading']}»):** opción `{o['option_name']}`, unidad «{o['unit_singular']}», textos «{o['sub_1']}» / «{o['sub_2']}» / «{o['sub_3']}», distintivo pack {o['badge_pack']} «{o['badge_text']}» (default del schema: «{o['badge_text_default']}»), promo: {o['show_promo']}, precio por unidad: {o['show_unit_price']}")
    if 'free_shipping' in s:
        f = s['free_shipping']
        a(f"- **Envío gratis (ajuste global `garelon_free_shipping`, Configuración del tema › Carrito):** {f['value']} ({f['source']}) · nota común `snippets/garelon-shipping-note.liquid` usada por " + ', '.join(f'`{x}`' for x in f['used_by']))
    if 'trust' in s:
        a(f"- **Confianza:** frase «{s['trust']['phrase']}» · chips: " + ' · '.join(f'«{t}» ({i})' for i, t in s['trust']['chips'] if t))
    a('- **Sello GARELON (rich-text):** ' + (', '.join(f'`{i}`={b}' for i, b in s['seal']) or 'ninguno'))
    if 'reviews' in s:
        r = s['reviews']
        a(f"- **Opiniones:** «{r['heading']}», ocultar sin opiniones: {r['hide_without_reviews']}, Review Widget de Judge.me versionado (D30): home {r.get('versioned_apps', {}).get('index') or 'no'} · ficha {r.get('versioned_apps', {}).get('product') or 'no'} [(bloque, review_data)], App Embeds en settings_data: {r.get('app_embeds') or 'ninguno'} [(bloque, activo)], nota: {re.sub('<[^>]+>', '', r['note'] or '') or 'ninguna'}")
    a(f"- **Compra fija (ficha):** {'sí' if s['sticky_cta'] else 'no'}")
    a('- **Navegación:** ' + ' · '.join(f'{l} (`{u}`)' for l, u in s.get('nav', [])) + f" · búsqueda en cabecera: {s.get('header_search')}")
    a('- **Barra superior:** ' + ' · '.join(f'«{t}»' for t in s['announcement']))
    if 'footer' in s:
        a(f"- **Pie:** bloques {', '.join(s['footer']['blocks'])}; iconos de pago: {s['footer']['payment_enable']}; newsletter: {s['footer']['newsletter_enable']}")
    a('- **Imágenes del tema por clave:** ' + ', '.join(f"`{k}` ({'/'.join(v['widths'])}{'' if v['complete'] else ' · INCOMPLETA'})" for k, v in s['image_keys'].items()))
    a('- **Imágenes fuente en la raíz (fuera del ZIP):** ' + ', '.join(f'`{f}`' for f in s['source_images_in_root']))
    st = s['settings']
    a(f"- **Ajustes globales:** fuentes {st['type_header_font']} + {st['type_body_font']}, carrito `{st['cart_type']}`, ancho {st['page_width']}, radio de botón {st['buttons_radius']}, búsqueda predictiva {st['predictive_search_enabled']}")
    a('- **Esquemas de color:** ' + ', '.join(f"{k} fondo {v['background']} / texto {v['text']} / botón {v['button']}" for k, v in s['color_schemes'].items()))
    a(f"- **Locales con textos `garelon.*`:** {s['locales_with_garelon']}")
    a('- **Herramientas en `tools/`:** ' + ', '.join(f'`{t}`' for t in s['tools'] if t.endswith('.py')))
    if 'render_harness' in s:
        h = s['render_harness']
        a(f"- **Batería de render versionada:** `{h['path']}` · fases {'-'.join([h['phases'][0], h['phases'][-1]]) if h['phases'] != 'NO DISPONIBLE' else h['phases']} · dependencias fijadas: "
          + ', '.join(f'`{k}` {v}' for k, v in h['deps'].items()) + (' · con `package-lock.json`' if h['lock'] else ' · SIN lockfile'))
    else:
        a('- **Batería de render versionada:** NO DISPONIBLE en el repo')
    return '\n'.join(L)


def update_state(snap, path):
    text = open(path, encoding='utf-8').read()
    header = (f"> **SNAPSHOT, no verdad eterna.** Generado el {snap['generated_utc'][:10]} desde `{snap['repo']}`, "
              f"rama `{snap['branch']}`, **commit `{snap['theme_commit']}`** (último commit que cambió el tema).")
    blocks = {
        r'<!-- snapshot-header:start -->.*?<!-- snapshot-header:end -->':
            '<!-- snapshot-header:start -->\n' + header + '\n<!-- snapshot-header:end -->',
        r'<!-- snapshot-commit: \w+ -->': f"<!-- snapshot-commit: {snap['theme_commit']} -->",
        r'<!-- snapshot:start -->.*?<!-- snapshot:end -->':
            '<!-- snapshot:start -->\n' + to_markdown(snap) + '\n<!-- snapshot:end -->',
    }
    for pattern, repl in blocks.items():
        text, n = re.subn(pattern, lambda _m, r=repl: r, text, flags=re.S)
        if n != 1:
            sys.exit(f'{path}: no encuentro el marcador {pattern!r}')
    open(path, 'w', encoding='utf-8').write(text)
    print(f'{path}: actualizado (commit del tema {snap["theme_commit"]})')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    here = os.path.dirname(os.path.abspath(__file__))
    default_repo = git(here, 'rev-parse', '--show-toplevel') or os.getcwd()
    ap.add_argument('--repo', default=default_repo)
    ap.add_argument('--json', action='store_true')
    ap.add_argument('--out')
    ap.add_argument('--update-state', action='store_true',
                    help='regenera los bloques automáticos de references/current-store-state.md')
    args = ap.parse_args()
    snap = collect(args.repo)
    if args.update_state:
        update_state(snap, os.path.join(os.path.dirname(here), 'references', 'current-store-state.md'))
        return
    text = json.dumps(snap, ensure_ascii=False, indent=2) if args.json else to_markdown(snap)
    if args.out:
        open(args.out, 'w', encoding='utf-8').write(text + '\n')
    else:
        sys.stdout.write(text + '\n')


if __name__ == '__main__':
    main()
