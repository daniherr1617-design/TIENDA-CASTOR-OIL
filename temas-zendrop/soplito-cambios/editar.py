import json, re, sys, copy
src, out = sys.argv[1], sys.argv[2]
HEX = "#D2782E"; TINT = "#FBF1EA"; OLD = "#bd9de5"; OLDTINT = "#f7f2fc"
def load(p):
    s = open(f"{src}/{p}").read()
    return json.loads(re.sub(r'^/\*.*?\*/', '', s, flags=re.S))
def recolor(o):
    s = json.dumps(o, ensure_ascii=False)
    s = re.sub(OLD, HEX, s, flags=re.I); s = re.sub(OLDTINT, TINT, s, flags=re.I)
    return json.loads(s)
def save(p, o):
    open(f"{out}/{p}", "w").write(json.dumps(o, ensure_ascii=False, indent=2))

# Ficha de producto (plantilla propia: product.soplito.json)
t = recolor(load("templates/product.json"))
S = t["sections"]; m = S["main"]["blocks"]
m["urgency_Cy48Ac"]["settings"]["urgency"] = "PRECIO DE LANZAMIENTO · ENVÍO GRATIS"
m["rating_stars_yRDU98"]["disabled"] = True; m["rating_stars_yRDU98"]["settings"]["label"] = ""  # sin valoraciones hasta tener reseñas reales
m["text_kN8c9a"]["settings"]["text"] = "🥣 La sopa lista sin soplar"
m["text_XHah9B"]["settings"]["text"] = "🐱 Un amiguito que le entretiene"
m["text_UGRVHL"]["settings"]["text"] = "🚚 Envío gratis a España"
m["collapsible_tab_cbWxXb"]["settings"].update(heading="Precio de lanzamiento", content="<p>Es el precio de salida de Soplito en España.</p>")
m["collapsible_tab_t3tiPC"]["settings"].update(heading="30 días de garantía", content="<p>Pruébalo y, si no te convence, te devolvemos el dinero.</p>")
m["collapsible_tab_wWxiwe"]["settings"].update(heading="Información de envío", content="<p>Preparamos tu pedido en 1 a 3 días hábiles y lo recibes en <strong>7 a 12 días hábiles</strong> en la península.</p>")
pas = {
 "pas1": ("¿Cuántas cucharadas soplas en cada comida?", "La sopa sale ardiendo, tu peque tiene hambre ya y tú soplas cucharada a cucharada. Él se impacienta, tú comes frío y la comida se convierte en una carrera."),
 "pas2": ("Soplar no es la solución", "Esperas, remueves, pruebas con el dedo, vuelves a soplar. Cada minuto de espera es una protesta más en la mesa, y al final o se quema o se aburre y no come."),
 "pas3": ("Soplito sopla por ti", "Se engancha al borde del bol con sus bracitos y lanza una brisa suave sobre la comida. Mientras se templa, tu peque mira a su nuevo amigo en vez de llorar. Se carga por USB y funciona con un solo botón."),
}
for k, (h, p) in pas.items():
    S[f"{k}_texto"]["blocks"][f"{k}_h"]["settings"]["heading"] = h
    S[f"{k}_texto"]["blocks"][f"{k}_t"]["settings"]["text"] = f"<p>{p}</p>"
    S[f"{k}_imagen"]["settings"].pop("image", None)  # hueco para tu infografía
tk = S["ticker"]["blocks"]
tk["ticker_1"]["settings"]["title"] = "Envío gratis a España"
tk["ticker_2"]["settings"]["title"] = "Precio de lanzamiento"
tk["ticker_3"]["settings"]["title"] = "30 días de garantía"
c = S["comparativa"]
c["settings"].update(us_label="Soplito", checkmark_color=HEX)
for i, b in enumerate(["Comida templada sin soplar", "Manos libres en la mesa", "Comer se vuelve divertido"], 1):
    c["blocks"][f"fila_{i}"]["settings"]["benefit"] = b
for col in S["testimonios"]["blocks"].values():  # huecos vacíos para reseñas reales
    col["settings"].update(title="", text="", author="")
    col["settings"].pop("image", None)
save("templates/product.soplito.json", t)

# Portada
i = load("templates/index.json")
i["sections"]["hero_lb"]["settings"]["image"] = "shopify://shop_images/soplito-1-principal.png"
i["sections"]["pasarela_lb"]["blocks"]["button_home"]["settings"]["button_link"] = "shopify://products/soplito-enfria-comida"
save("templates/index.json", i)

# Barra de anuncios
h = recolor(load("sections/header-group.json"))
h["sections"]["announcement-bar"]["blocks"]["announcement-bar-0"]["settings"]["text"] = "Precio de lanzamiento · Envío gratis a España"
save("sections/header-group.json", h)

# Colores, marca y carrito
d = recolor(load("config/settings_data.json")); cur = d["current"]
cur["brand_headline"] = "Soplito"
cur["enable_cart_countdown"] = False  # sin cuenta atrás falsa
cs = cur["sections"]
cs["cart-drawer"]["blocks"]["countdown_kNDGYw"]["disabled"] = True
cs["announcement-bar"]["blocks"]["announcement_GD9kNP"]["settings"]["text"] = "Precio de lanzamiento · Envío gratis a España"
save("config/settings_data.json", d)
