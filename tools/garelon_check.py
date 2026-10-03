#!/usr/bin/env python3
"""GARELON · validación de instalabilidad del tema (sin dependencias).

Comprueba lo que hace que Shopify rechace una sección o una plantilla al subir el
tema (y, si es `templates/index.json`, que la home dé 404):

  * archivos imprescindibles (layout/theme.liquid, templates/index.json, 404.json,
    config/settings_schema.json, config/settings_data.json…);
  * JSON válido y SIN claves duplicadas (Shopify las rechaza; json.loads no);
  * schemas de secciones: JSON, ids únicos, tipos conocidos, valores por defecto
    permitidos, rangos (≤ 101 pasos), nombres de sección/bloque/preset ≤ 25 bytes,
    claves t: que existen en locales/en.default.schema.json;
  * plantillas JSON y grupos: tipo de sección existente y permitido en esa
    plantilla/grupo, ajustes existentes y con valor válido, bloques existentes,
    order/block_order coherentes, límites de bloques; sin referencias a apps,
    imágenes de Files ni recursos que puedan no existir en la tienda;
  * settings_data.json contra settings_schema.json (incluidos los esquemas de color);
  * referencias Liquid: render/include → snippets, section(s) → sections,
    'archivo' | asset_url → assets;
  * honestidad: ningún default de schema con claims de ventas («Más popular»…) y, con el
    ajuste global «Envío gratis» desactivado, ningún texto de plantilla que prometa envío gratis.

Uso:  python3 tools/garelon_check.py [RAÍZ_DEL_TEMA] [--strict-root]
      --strict-root: además, la raíz solo puede contener las 7 carpetas del tema
      (se usa sobre el ZIP descomprimido).
Sale con código 1 si hay cualquier error.
"""
import json
import os
import re
import sys

THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates']
REQUIRED = [
    'layout/theme.liquid',
    'templates/index.json',
    'templates/404.json',
    'templates/product.json',
    'templates/cart.json',
    'templates/page.json',
    'templates/page.contact.json',
    'config/settings_schema.json',
    'config/settings_data.json',
    'locales/en.default.json',
    'locales/en.default.schema.json',
    'locales/es.json',
    'sections/header-group.json',
    'sections/footer-group.json',
    'sections/main-404.liquid',
]
SETTING_TYPES = {
    'text', 'textarea', 'richtext', 'inline_richtext', 'html', 'liquid', 'url', 'checkbox',
    'number', 'range', 'select', 'radio', 'color', 'color_background', 'color_scheme',
    'color_scheme_group', 'font_picker', 'image_picker', 'video', 'video_url', 'product',
    'product_list', 'collection', 'collection_list', 'page', 'blog', 'article', 'link_list',
    'text_alignment', 'metaobject', 'metaobject_list', 'header', 'paragraph',
}
NO_DEFAULT_TYPES = {'image_picker', 'video', 'product', 'product_list', 'collection',
                    'collection_list', 'page', 'blog', 'article', 'metaobject', 'metaobject_list'}
URL_DEFAULTS_OK = {'/collections', '/collections/all', 'shopify://collections/all'}
URL_RE = re.compile(r'^(https?://\S+|/\S*|#\S*|mailto:\S+|tel:\S+|shopify://\S+)$')
COLOR_RE = re.compile(r'^(#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}|rgba?\([^)]*\)|transparent)$')
ID_RE = re.compile(r'^[A-Za-z0-9_-]+$')
MENUS_OK = {'', 'main-menu', 'footer', 'customer-account-main-menu'}
NAME_MAX_BYTES = 25
MAX_SECTIONS_PER_TEMPLATE = 25
MAX_BLOCKS_PER_SECTION = 50

errors = []
warnings = []


def err(where, msg):
    errors.append(f'{where}: {msg}')


class DuplicateKey(ValueError):
    pass


def _no_dups(pairs):
    seen = {}
    for k, v in pairs:
        if k in seen:
            raise DuplicateKey(f'clave duplicada «{k}»')
        seen[k] = v
    return seen


def load_json_text(text, where):
    text = re.sub(r'^﻿?\s*/\*.*?\*/', '', text, count=1, flags=re.S)  # comentario que añade Shopify
    try:
        return json.loads(text, object_pairs_hook=_no_dups)
    except DuplicateKey as e:
        err(where, f'JSON con {e}')
    except ValueError as e:
        err(where, f'JSON inválido: {e}')
    return None


def load_json(root, rel):
    path = os.path.join(root, rel)
    try:
        text = open(path, encoding='utf-8').read()
    except (OSError, UnicodeDecodeError) as e:
        err(rel, f'no se puede leer: {e}')
        return None
    return load_json_text(text, rel)


def read(root, rel):
    return open(os.path.join(root, rel), encoding='utf-8').read()


def lookup(d, dotted):
    cur = d
    for part in dotted.split('.'):
        if not isinstance(cur, dict) or part not in cur:
            return None
        cur = cur[part]
    return cur


class Theme:
    def __init__(self, root):
        self.root = root
        self.schema_locale = load_json(root, 'locales/en.default.schema.json') or {}
        self.sections = {}  # type -> schema dict (o {} si no tiene)
        self.scheme_ids = set()
        self.scheme_fields = None


def check_t_key(theme, where, value):
    if isinstance(value, str) and value.startswith('t:'):
        if not isinstance(lookup(theme.schema_locale, value[2:]), str):
            err(where, f'traducción inexistente {value} en locales/en.default.schema.json')


def resolved_text(theme, value):
    if isinstance(value, str) and value.startswith('t:'):
        v = lookup(theme.schema_locale, value[2:])
        return v if isinstance(v, str) else value
    return value


def check_name(theme, where, kind, name):
    if not isinstance(name, str) or not name.strip():
        err(where, f'{kind} sin nombre')
        return
    check_t_key(theme, where, name)
    if not name.startswith('t:') and len(name.encode('utf-8')) > NAME_MAX_BYTES:
        err(where, f'nombre de {kind} «{name}» = {len(name.encode("utf-8"))} bytes (máximo {NAME_MAX_BYTES})')


# ---------------------------------------------------------------- valores
def check_value(theme, where, st, v, context):
    """Valida un valor guardado (plantilla, grupo o settings_data) o un default."""
    t = st.get('type')
    sid = st.get('id')
    w = f"{where} › {sid} ({t})"
    if v is None:
        return
    if isinstance(v, str) and v.startswith('t:') and context == 'default':
        check_t_key(theme, w, v)
        return
    if t == 'range':
        if not isinstance(v, (int, float)) or isinstance(v, bool):
            return err(w, f'valor no numérico {v!r}')
        lo, hi, step = st.get('min'), st.get('max'), st.get('step', 1)
        if lo is None or hi is None:
            return
        if v < lo or v > hi:
            err(w, f'{v} fuera del rango {lo}–{hi}')
        elif abs((v - lo) / step - round((v - lo) / step)) > 1e-9:
            err(w, f'{v} no cae en un paso de {step} desde {lo}')
    elif t in ('select', 'radio'):
        if v not in [o.get('value') for o in st.get('options', [])]:
            err(w, f'{v!r} no es una opción válida')
    elif t == 'checkbox':
        if not isinstance(v, bool):
            err(w, f'{v!r} no es booleano')
    elif t == 'number':
        if not isinstance(v, (int, float)) or isinstance(v, bool):
            err(w, f'{v!r} no es numérico')
    elif t == 'url':
        if not isinstance(v, str) or (v and not URL_RE.match(v)):
            err(w, f'URL no válida {v!r}')
        if context == 'default' and v not in URL_DEFAULTS_OK:
            err(w, f'default de url no permitido {v!r} (solo /collections o /collections/all)')
    elif t == 'color_scheme':
        if not isinstance(v, str) or (theme.scheme_ids and v not in theme.scheme_ids):
            err(w, f'esquema de color inexistente {v!r}')
    elif t == 'color':
        if not isinstance(v, str) or (v and not COLOR_RE.match(v)):
            err(w, f'color no válido {v!r}')
    elif t == 'richtext':
        if not isinstance(v, str):
            err(w, 'richtext no es texto')
        elif v and not re.match(r'^\s*<(p|ul|ol|h[1-6])[\s>]', v):
            err(w, 'richtext debe empezar por <p>, <ul>, <ol> o <h1-6>')
    elif t == 'inline_richtext':
        if not isinstance(v, str):
            err(w, 'inline_richtext no es texto')
        elif re.search(r'<(p|div|ul|ol|li|h[1-6]|br)[\s/>]', v):
            err(w, 'inline_richtext con etiquetas de bloque')
    elif t in ('text', 'textarea', 'html', 'liquid'):
        if not isinstance(v, str):
            err(w, f'{v!r} no es texto')
        elif context == 'default' and t in ('text', 'textarea') and v == '':
            err(w, 'default vacío (Shopify no lo admite: quita la clave default)')
    elif t == 'link_list':
        if not isinstance(v, str) or v not in MENUS_OK:
            err(w, f'menú {v!r}: solo se permiten menús que Shopify crea siempre ({sorted(MENUS_OK)})')
    elif t == 'collection':
        if context != 'default' and v not in ('', 'all'):
            err(w, f'colección {v!r}: puede no existir en la tienda; deja el ajuste vacío')
    elif t in NO_DEFAULT_TYPES:
        if context == 'default':
            err(w, f'los ajustes {t} no admiten default')
        elif v not in ('', [], None):
            err(w, f'referencia a un recurso de la tienda {v!r}: puede no existir; deja el ajuste vacío')
    elif t == 'font_picker':
        if not isinstance(v, str) or not re.match(r'^[a-z0-9_]+_[ni][1-9]$', v):
            err(w, f'fuente no válida {v!r}')
    elif t == 'video_url':
        if not isinstance(v, str) or (v and not re.match(r'^https://(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/', v)):
            err(w, f'video_url no válido {v!r}')
    elif t in ('text_alignment',):
        if v not in ('left', 'center', 'right'):
            err(w, f'alineación no válida {v!r}')
    elif t in ('color_background', 'color_scheme_group'):
        pass
    else:
        err(w, f'tipo de ajuste no contemplado {t!r}')


# Claims que exigen datos de ventas reales: no pueden venir por defecto en un schema.
SALES_CLAIM_RE = re.compile(r'm[aá]s\s+popular|m[aá]s\s+vendid|best\s*-?\s*sell|top\s+ventas|n\.?\s*º\s*1\s+en\s+ventas', re.I)


def lint_setting_defs(theme, where, defs):
    ids = set()
    for st in defs:
        t = st.get('type')
        if t not in SETTING_TYPES:
            err(where, f'tipo de ajuste desconocido {t!r}')
            continue
        for key in ('label', 'info', 'content', 'placeholder'):
            if key in st:
                check_t_key(theme, f'{where} › {st.get("id", t)}.{key}', st[key])
        if t in ('header', 'paragraph'):
            if not st.get('content'):
                err(where, f'{t} sin content')
            continue
        sid = st.get('id')
        if not sid or not ID_RE.match(sid):
            err(where, f'ajuste sin id válido: {st}')
            continue
        if sid in ids:
            err(where, f'id de ajuste duplicado «{sid}»')
        ids.add(sid)
        if 'label' not in st and t != 'color_scheme_group':
            err(where, f'ajuste «{sid}» sin label')
        if t in ('select', 'radio'):
            opts = st.get('options') or []
            if not opts:
                err(where, f'select «{sid}» sin opciones')
            vals = [o.get('value') for o in opts]
            if len(vals) != len(set(vals)):
                err(where, f'select «{sid}» con valores repetidos')
            for o in opts:
                check_t_key(theme, f'{where} › {sid}.options', o.get('label'))
        if t == 'range':
            for k in ('min', 'max', 'default'):
                if k not in st:
                    err(where, f'range «{sid}» sin {k}')
            if all(k in st for k in ('min', 'max')):
                steps = (st['max'] - st['min']) / st.get('step', 1)
                if steps > 101:
                    err(where, f'range «{sid}» con {steps:.0f} pasos (máximo 101)')
        if 'default' in st:
            if t in NO_DEFAULT_TYPES:
                err(where, f'«{sid}» ({t}) no admite default')
            else:
                check_value(theme, where, st, st['default'], 'default')
            if isinstance(st['default'], str) and SALES_CLAIM_RE.search(st['default']):
                err(where, f'«{sid}»: el default «{st["default"]}» es un claim de ventas («Más popular», «Más vendido»…); '
                           'solo con datos reales, nunca por defecto (usa p. ej. «Recomendado»)')
    return ids


# ---------------------------------------------------------------- secciones
SCHEMA_RE = re.compile(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}', re.S)


def load_sections(theme):
    sdir = os.path.join(theme.root, 'sections')
    for fn in sorted(os.listdir(sdir)):
        if not fn.endswith('.liquid'):
            continue
        rel = f'sections/{fn}'
        src = read(theme.root, rel)
        found = SCHEMA_RE.findall(src)
        if len(found) > 1:
            err(rel, 'más de un {% schema %}')
        schema = {}
        if found:
            schema = load_json_text(found[0], rel + ' {% schema %}')
            if schema is None:
                schema = {}
        theme.sections[fn[:-7]] = schema
        lint_section_schema(theme, rel, schema)


def lint_section_schema(theme, rel, sc):
    if not sc:
        return
    check_name(theme, rel, 'sección', sc.get('name'))
    lint_setting_defs(theme, rel, sc.get('settings', []))
    types = set()
    for b in sc.get('blocks', []):
        bt = b.get('type')
        if bt in types:
            err(rel, f'tipo de bloque duplicado «{bt}»')
        types.add(bt)
        if bt in ('@app', '@theme'):
            continue
        check_name(theme, f'{rel} › bloque {bt}', 'bloque', b.get('name'))
        lint_setting_defs(theme, f'{rel} › bloque {bt}', b.get('settings', []))
    for i, p in enumerate(sc.get('presets', [])):
        check_name(theme, f'{rel} › preset {i}', 'preset', p.get('name'))
        pblocks = p.get('blocks', [])
        items = pblocks.items() if isinstance(pblocks, dict) else enumerate(pblocks)
        for _, pb in items:
            if pb.get('type') not in types:
                err(rel, f'preset con bloque inexistente «{pb.get("type")}»')
    if 'max_blocks' in sc and (not isinstance(sc['max_blocks'], int) or sc['max_blocks'] > MAX_BLOCKS_PER_SECTION):
        err(rel, f'max_blocks no válido {sc["max_blocks"]!r}')


def section_allowed(sc, kind, name):
    """kind = 'templates' | 'groups'."""
    en = (sc.get('enabled_on') or {}).get(kind)
    dis = (sc.get('disabled_on') or {}).get(kind)
    if en is not None and '*' not in en and name not in en:
        return False
    if dis is not None and ('*' in dis or name in dis):
        return False
    return True


def check_section_instance(theme, where, sid, sec, kind, owner):
    if not ID_RE.match(sid):
        err(where, f'id de sección no válido «{sid}»')
    st = sec.get('type')
    if not isinstance(st, str) or st not in theme.sections:
        err(where, f'sección «{sid}»: el tipo {st!r} no existe en sections/')
        return
    sc = theme.sections[st]
    if not sc:
        # Sección sin schema (p. ej. main-404 de Dawn): válida, pero sin ajustes ni bloques.
        if sec.get('settings') or sec.get('blocks'):
            err(where, f'sección «{sid}» ({st}) no tiene schema y la plantilla le da ajustes o bloques')
        return
    if not section_allowed(sc, kind, owner):
        err(where, f'sección «{sid}» ({st}) no está permitida en {kind[:-1]} «{owner}» (enabled_on/disabled_on)')
    w = f'{where} › {sid}'
    unknown = set(sec) - {'type', 'settings', 'blocks', 'block_order', 'disabled', 'custom_css', 'name'}
    if unknown:
        err(w, f'claves desconocidas {sorted(unknown)}')
    defs = {d['id']: d for d in sc.get('settings', []) if d.get('id')}
    for k, v in (sec.get('settings') or {}).items():
        if k not in defs:
            err(w, f'ajuste «{k}» no existe en el schema de {st}')
        else:
            check_value(theme, w, defs[k], v, 'value')
    blocks = sec.get('blocks') or {}
    order = sec.get('block_order', [])
    if blocks or order:
        if len(order) != len(set(order)):
            err(w, 'block_order con ids repetidos')
        if set(order) != set(blocks):
            err(w, f'block_order y blocks no coinciden: {sorted(set(order) ^ set(blocks))}')
    max_blocks = sc.get('max_blocks', MAX_BLOCKS_PER_SECTION)
    if len(blocks) > max_blocks:
        err(w, f'{len(blocks)} bloques > max_blocks {max_blocks}')
    bdefs = {b['type']: b for b in sc.get('blocks', [])}
    counts = {}
    for bid, b in blocks.items():
        bw = f'{w} › {bid}'
        if not ID_RE.match(bid):
            err(bw, 'id de bloque no válido')
        bt = b.get('type', '')
        if bt.startswith('shopify://') or bt == '@app':
            err(bw, 'referencia a un bloque de app: la app puede no estar instalada; añádelo desde el editor')
            continue
        if bt not in bdefs:
            err(bw, f'tipo de bloque {bt!r} no existe en el schema de {st}')
            continue
        counts[bt] = counts.get(bt, 0) + 1
        limit = bdefs[bt].get('limit')
        if limit and counts[bt] > limit:
            err(bw, f'más bloques {bt} que el límite {limit}')
        bset = {d['id']: d for d in bdefs[bt].get('settings', []) if d.get('id')}
        for k, v in (b.get('settings') or {}).items():
            if k not in bset:
                err(bw, f'ajuste «{k}» no existe en el bloque {bt}')
            else:
                check_value(theme, bw, bset[k], v, 'value')
        if 'blocks' in b:
            err(bw, 'bloques anidados no soportados por este tema')


def check_template(theme, rel):
    data = load_json(theme.root, rel)
    if data is None:
        return
    name = os.path.basename(rel)[:-5].split('.')[0]  # page.contact → page
    sections = data.get('sections')
    order = data.get('order')
    if not isinstance(sections, dict) or not isinstance(order, list):
        err(rel, 'faltan "sections" u "order"')
        return
    if len(order) != len(set(order)):
        err(rel, 'order con ids repetidos')
    if set(order) != set(sections):
        err(rel, f'order y sections no coinciden: {sorted(set(order) ^ set(sections))}')
    if len(sections) > MAX_SECTIONS_PER_TEMPLATE:
        err(rel, f'{len(sections)} secciones (máximo {MAX_SECTIONS_PER_TEMPLATE})')
    if 'layout' in data and data['layout'] is not False and not os.path.exists(
            os.path.join(theme.root, 'layout', f'{data["layout"]}.liquid')):
        err(rel, f'layout inexistente {data["layout"]!r}')
    per_type = {}
    for sid, sec in sections.items():
        check_section_instance(theme, rel, sid, sec, 'templates', name)
        per_type[sec.get('type')] = per_type.get(sec.get('type'), 0) + 1
    for st, n in per_type.items():
        limit = (theme.sections.get(st) or {}).get('limit')
        if limit and n > limit:
            err(rel, f'{n} secciones {st}: su schema limita a {limit} por plantilla')
    return data


def check_group(theme, rel):
    data = load_json(theme.root, rel)
    if data is None:
        return
    gtype = data.get('type')
    if not gtype:
        err(rel, 'grupo sin "type"')
    sections = data.get('sections') or {}
    order = data.get('order') or []
    if set(order) != set(sections) or len(order) != len(set(order)):
        err(rel, 'order y sections no coinciden')
    for sid, sec in sections.items():
        check_section_instance(theme, rel, sid, sec, 'groups', gtype)


# ---------------------------------------------------------------- config
def check_config(theme):
    schema = load_json(theme.root, 'config/settings_schema.json')
    data = load_json(theme.root, 'config/settings_data.json')
    if schema is None or data is None:
        return
    defs = {}
    for group in schema:
        if group.get('name') == 'theme_info':
            continue
        lint_setting_defs(theme, f'settings_schema › {group.get("name")}', group.get('settings', []))
        for st in group.get('settings', []):
            if st.get('id'):
                defs[st['id']] = st
            if st.get('type') == 'color_scheme_group':
                theme.scheme_fields = {d['id']: d for d in st.get('definition', []) if d.get('id')}
    cur = data.get('current')
    if isinstance(cur, str):
        cur = (data.get('presets') or {}).get(cur)
    if not isinstance(cur, dict):
        err('settings_data.json', '"current" no apunta a un preset válido')
        return
    schemes = cur.get('color_schemes') or {}
    theme.scheme_ids = set(schemes)
    if not schemes:
        err('settings_data.json', 'sin color_schemes')
    for scid, scv in schemes.items():
        vals = (scv or {}).get('settings') or {}
        if theme.scheme_fields is not None:
            missing = set(theme.scheme_fields) - set(vals)
            extra = set(vals) - set(theme.scheme_fields)
            if missing or extra:
                err('settings_data.json', f'esquema {scid}: campos que no cuadran con settings_schema {sorted(missing | extra)}')
            for k, v in vals.items():
                d = theme.scheme_fields.get(k)
                if d:
                    check_value(theme, f'settings_data › {scid}', d, v, 'value')
    for k, v in cur.items():
        if k in ('color_schemes', 'sections', 'content_for_index', 'blocks'):
            continue
        if k not in defs:
            err('settings_data.json', f'ajuste global desconocido «{k}»')
        else:
            check_value(theme, 'settings_data', defs[k], v, 'value')
    # defaults de color_scheme del propio schema (se validan cuando ya se conocen los esquemas)
    for st in defs.values():
        if st.get('type') == 'color_scheme' and 'default' in st:
            check_value(theme, 'settings_schema', st, st['default'], 'value')


# ---------------------------------------------------------------- envío gratis
FREE_SHIPPING_RE = re.compile(r'env[ií]o\s+gratis|free\s+shipping', re.I)


def check_free_shipping(theme):
    """Con el ajuste global «Envío gratis» (garelon_free_shipping) desactivado, ningún texto de la
    tienda en plantillas o grupos puede seguir prometiendo envío gratis (p. ej. la garantía
    «Envío gratis + seguimiento»): packs, carrito y garantías no deben contradecirse."""
    schema = load_json(theme.root, 'config/settings_schema.json') or []
    data = load_json(theme.root, 'config/settings_data.json') or {}
    st = next((x for g in schema for x in g.get('settings', []) if x.get('id') == 'garelon_free_shipping'), None)
    if st is None:
        return
    cur = data.get('current')
    if isinstance(cur, str):
        cur = (data.get('presets') or {}).get(cur)
    value = (cur or {}).get('garelon_free_shipping', st.get('default', False))
    if value:
        return
    for d in ('templates', 'sections'):
        for fn in sorted(os.listdir(os.path.join(theme.root, d))):
            if not fn.endswith('.json'):
                continue
            rel = f'{d}/{fn}'
            for m in FREE_SHIPPING_RE.finditer(read(theme.root, rel)):
                err(rel, f'promete «{m.group(0)}» con el ajuste global «Envío gratis» desactivado: '
                         'cambia ese texto o vuelve a activar el ajuste')
                break


# ---------------------------------------------------------------- liquid
REF_PATTERNS = [
    (re.compile(r"{%-?\s*(?:render|include)\s+'([^']+)'"), 'snippets', '.liquid'),
    (re.compile(r'{%-?\s*(?:render|include)\s+"([^"]+)"'), 'snippets', '.liquid'),
    (re.compile(r"{%-?\s*section\s+'([^']+)'"), 'sections', '.liquid'),
    (re.compile(r"{%-?\s*sections\s+'([^']+)'"), 'sections', '.json'),
    (re.compile(r"'([\w.@-]+\.(?:css|js|webp|png|jpg|jpeg|gif|svg|woff2?|json))'\s*\|\s*(?:asset_url|asset_img_url|inline_asset_content)"), 'assets', ''),
    (re.compile(r'"([\w.@-]+\.(?:css|js|webp|png|jpg|jpeg|gif|svg|woff2?|json))"\s*\|\s*(?:asset_url|asset_img_url|inline_asset_content)'), 'assets', ''),
]


def check_liquid_refs(theme):
    for d in ('layout', 'sections', 'snippets', 'templates'):
        base = os.path.join(theme.root, d)
        for fn in sorted(os.listdir(base)):
            if not fn.endswith('.liquid'):
                continue
            rel = f'{d}/{fn}'
            src = read(theme.root, rel)
            for rx, folder, ext in REF_PATTERNS:
                for name in rx.findall(src):
                    if not os.path.exists(os.path.join(theme.root, folder, name + ext)):
                        err(rel, f'referencia a {folder}/{name}{ext}, que no existe')
            if src.count('{% schema %}') + src.count('{%- schema -%}') > 1:
                err(rel, 'más de un schema')


def check_image_keys(theme):
    """Las imágenes del producto que el tema elige por clave (snippets/garelon-image.liquid):
    cada clave tiene todos sus anchos en assets/ y los selects image_key solo ofrecen claves que existen."""
    rel = 'snippets/garelon-image.liquid'
    if not os.path.exists(os.path.join(theme.root, rel)):
        return
    src = read(theme.root, rel)
    keys = {}
    for key, widths in re.findall(r"when '([\w-]+)'\s*assign widths = '([\d,]+)'", src):
        keys[key] = widths.split(',')
        for w in keys[key]:
            if not os.path.exists(os.path.join(theme.root, 'assets', f'producto-{key}-{w}.webp')):
                err(rel, f'falta assets/producto-{key}-{w}.webp')
    if not keys:
        err(rel, 'no se encontraron claves de imagen')
    for st_type, sc in theme.sections.items():
        defs = list(sc.get('settings', [])) if sc else []
        for b in (sc or {}).get('blocks', []):
            defs += b.get('settings', [])
        for d in defs:
            if d.get('id') == 'image_key':
                for o in d.get('options', []):
                    if o['value'] != 'none' and o['value'] not in keys:
                        err(f'sections/{st_type}.liquid', f'image_key ofrece «{o["value"]}», que no tiene imagen')
            if d.get('id', '').endswith('gallery_keys') and 'default' in d:
                for k in d['default'].split(','):
                    if k.strip() not in keys:
                        err(f'sections/{st_type}.liquid', f'{d["id"]}: clave de imagen «{k.strip()}» sin imagen')
    # Valores guardados en plantillas y grupos.
    for dp, _, fns in os.walk(os.path.join(theme.root, 'templates')):
        for fn in fns:
            if not fn.endswith('.json'):
                continue
            relp = os.path.relpath(os.path.join(dp, fn), theme.root)
            data = load_json(theme.root, relp) or {}
            for sid, sec in (data.get('sections') or {}).items():
                for k, v in (sec.get('settings') or {}).items():
                    if k.endswith('gallery_keys') and isinstance(v, str):
                        for key in v.split(','):
                            if key.strip() not in keys:
                                err(f'{relp} › {sid}', f'{k}: clave de imagen «{key.strip()}» sin imagen')


PLURAL_KEYS = {'zero', 'one', 'two', 'few', 'many', 'other'}


def flat_keys(d, prefix=''):
    keys = set()
    for k, v in d.items():
        path = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict) and not (set(v) and set(v) <= PLURAL_KEYS):
            keys |= flat_keys(v, path)
        else:
            keys.add(path)
    return keys


def check_locales(theme):
    """Cada traducción del idioma por defecto existe en los demás idiomas del tema
    (equivale a MatchingTranslations de Theme Check; si falta, Shopify muestra
    «translation missing» a los clientes de ese idioma)."""
    base = load_json(theme.root, 'locales/en.default.json') or {}
    want = flat_keys(base)
    for fn in sorted(os.listdir(os.path.join(theme.root, 'locales'))):
        if not fn.endswith('.json') or fn.endswith('.schema.json') or fn == 'en.default.json':
            continue
        data = load_json(theme.root, f'locales/{fn}') or {}
        missing = sorted(want - flat_keys(data))
        if missing:
            err(f'locales/{fn}', f'faltan {len(missing)} traducciones (p. ej. {missing[0]})')


# ---------------------------------------------------------------- main
def main(argv):
    args = [a for a in argv if not a.startswith('--')]
    strict_root = '--strict-root' in argv
    root = os.path.abspath(args[0] if args else os.path.join(os.path.dirname(__file__), '..'))

    for rel in REQUIRED:
        if not os.path.isfile(os.path.join(root, rel)):
            err(rel, 'FALTA (obligatorio para instalar el tema)')
    for d in THEME_DIRS:
        if not os.path.isdir(os.path.join(root, d)):
            err(d, 'FALTA la carpeta')
    if strict_root:
        extra = sorted(set(os.listdir(root)) - set(THEME_DIRS))
        if extra:
            err('raíz', f'entradas que no son del tema: {extra}')
        for dp, dns, fns in os.walk(root):
            for fn in fns + dns:
                if fn.startswith('.') or fn.lower().endswith('.md'):
                    err(os.path.relpath(os.path.join(dp, fn), root), 'archivo oculto o markdown dentro del tema')
    if errors:
        return report(root)

    theme = Theme(root)
    # Todos los JSON del tema: válidos y sin claves duplicadas.
    for d in ('config', 'locales', 'templates', 'sections'):
        for dp, _, fns in os.walk(os.path.join(root, d)):
            for fn in sorted(fns):
                if fn.endswith('.json'):
                    load_json(root, os.path.relpath(os.path.join(dp, fn), root))
    check_config(theme)
    load_sections(theme)
    for dp, _, fns in os.walk(os.path.join(root, 'templates')):
        for fn in sorted(fns):
            if fn.endswith('.json'):
                check_template(theme, os.path.relpath(os.path.join(dp, fn), root))
    for fn in sorted(os.listdir(os.path.join(root, 'sections'))):
        if fn.endswith('.json'):
            check_group(theme, f'sections/{fn}')
    check_liquid_refs(theme)
    check_image_keys(theme)
    check_locales(theme)
    check_free_shipping(theme)

    index = load_json(root, 'templates/index.json')
    if index is not None and not index.get('order'):
        err('templates/index.json', 'la home no tiene ninguna sección')
    return report(root)


def report(root):
    if errors:
        print(f'ERRORES ({len(errors)}) en {root}:')
        for e in errors:
            print('  ✗', e)
        return 1
    print(f'OK · tema instalable según las comprobaciones de garelon_check ({root})')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
