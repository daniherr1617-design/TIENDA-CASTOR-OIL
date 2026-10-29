import json, re, sys, os
src, prev, out = sys.argv[1], sys.argv[2], sys.argv[3]
def rd(p): return open(f"{src}/{p}", encoding="utf-8").read()
def load(p, base=None):
    return json.loads(re.sub(r'/\*.*?\*/', '', open(f"{base or src}/{p}", encoding="utf-8").read(), flags=re.S))
def save(p, s):
    os.makedirs(os.path.dirname(f"{out}/{p}"), exist_ok=True)
    open(f"{out}/{p}", "w", encoding="utf-8").write(s if isinstance(s, str) else json.dumps(s, ensure_ascii=False, indent=2))
def sub1(s, old, new, count=1):
    assert s.count(old) == count, (old, s.count(old)); return s.replace(old, new)
BRAND = "{{ settings.brand_headline | default: shop.name }}"

# Ficha: fotos de Soplito en los bloques PAS (sin imagen demo) y plantilla por defecto también de Soplito
t = load("templates/product.soplito.json", prev)
for k, img in [("pas1", "soplito-1-principal.png"), ("pas2", "soplito-3-gato-perrito.png"), ("pas3", "soplito-2-ramen.png")]:
    t["sections"][f"{k}_imagen"]["settings"].update(image=f"shopify://shop_images/{img}", image_height="adapt")
save("templates/product.soplito.json", t); save("templates/product.json", t)

# Menús propios
d = load("config/settings_data.json", prev)
d["current"]["sections"]["header"]["settings"].update(menu="soplito-principal", menu_type_desktop="dropdown")
save("config/settings_data.json", d)
f = load("sections/footer-group.json")
f["sections"]["footer"]["blocks"]["link_list_YJdWjM"]["settings"].update(heading="Información", menu="soplito-pie")
save("sections/footer-group.json", f)

# Nombre de marca en lugar del nombre de la tienda (GARELON)
h = rd("sections/header.liquid")
h = sub1(h, '<span class="h2">{{ shop.name }}</span>', f'<span class="h2">{BRAND}</span>', 2)
h = sub1(h, "settings.logo.alt | default: shop.name", "settings.logo.alt | default: settings.brand_headline | default: shop.name", 2)
save("sections/header.liquid", h)
ft = rd("sections/footer.liquid")
ft = sub1(ft, "{{ shop.name | link_to: routes.root_url -}}", "{{ settings.brand_headline | default: shop.name | link_to: routes.root_url -}}")
save("sections/footer.liquid", ft)
th = rd("layout/theme.liquid")
th = sub1(th, """    <title>
      {{ page_title }}""", """    {%- assign brand_name = settings.brand_headline | default: shop.name -%}
    <title>
      {%- if template.name == 'index' %}{{ brand_name }}{% else %}{{ page_title }}{% endif -%}""")
th = sub1(th, "{%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}",
          "{%- unless template.name == 'index' %} &ndash; {{ brand_name }}{% endunless -%}")
th = sub1(th, """    {% if page_description %}
      <meta name="description" content="{{ page_description | escape }}">""",
          """    {% if template.name == 'index' %}
      <meta name="description" content="Soplito se engancha al bol y enfría la comida de tu peque sin soplar.">
    {% elsif page_description %}
      <meta name="description" content="{{ page_description | escape }}">""")
save("layout/theme.liquid", th)
m = rd("snippets/meta-tags.liquid")
m = sub1(m, "assign og_title = page_title | default: shop.name", "assign og_title = page_title | default: settings.brand_headline | default: shop.name")
m = sub1(m, '<meta property="og:site_name" content="{{ shop.name }}">', f'<meta property="og:site_name" content="{BRAND}">')
save("snippets/meta-tags.liquid", m)
ph = rd("sections/main-password-header.liquid")
ph = sub1(ph, '<h1 class="h2">{{ shop.name }}</h1>', f'<h1 class="h2">{BRAND}</h1>')
save("sections/main-password-header.liquid", ph)
pl = rd("layout/password.liquid")
pl = sub1(pl, "<title>{{ shop.name }}</title>", f"<title>{BRAND}</title>")
save("layout/password.liquid", pl)

# Textos predeterminados de Shopify que sobran (estructura §6)
es = load("locales/es.json")
es["general"]["password_page"]["powered_by_shopify_html"] = ""
es["products"]["product"]["include_taxes"] = ""
es["products"]["product"]["shipping_policy_html"] = ""
es["sections"]["cart"]["taxes_included_but_shipping_at_checkout"] = ""
es["sections"]["cart"]["taxes_included_and_shipping_policy_html"] = ""
save("locales/es.json", es)

# Restos en inglés de la demo
pw = load("templates/password.json")
pw["sections"]["main"]["blocks"]["heading"]["settings"]["heading"] = "Soplito llega muy pronto"
pw["sections"]["main"]["blocks"]["paragraph"]["settings"]["text"] = "<p>Déjanos tu email y te avisamos cuando abramos.</p>"
save("templates/password.json", pw)
lc = load("templates/list-collections.json"); lc["sections"]["main"]["settings"]["title"] = "Colecciones"
save("templates/list-collections.json", lc)
ar = load("templates/article.json"); ar["sections"]["main"]["blocks"]["share"]["settings"]["share_label"] = "Compartir"
save("templates/article.json", ar)
