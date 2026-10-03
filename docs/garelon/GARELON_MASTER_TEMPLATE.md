# GARELON · MASTER TEMPLATE (arquitectura real del tema)

> **Versión:** 3.0 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `955bcc3`
>
> Snapshot generado desde `955bcc3`. Ante discrepancias futuras manda el repositorio actual: revisa el código antes de actuar sobre lo que dice este documento.

Este documento describe **cómo está construido el tema hoy** y **qué hay que tocar al cambiar de producto**. Sustituye a la arquitectura 1.x (secciones `garelon-trust-bar`, `garelon-benefits`, `garelon-packs`, `garelon-url`… de ramas anteriores), que ya no existe en el tema.

- **Reglas y prioridades:** `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` (manda sobre este documento).
- **Conteos, orden actual de secciones y galerías, valores de hoy:** `.claude/skills/garelon-ecommerce-operator/references/current-store-state.md` (snapshot con commit). Aquí los componentes se describen **por función**, sin números que caducan.
- **Comprobar el estado real en cualquier momento:** `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py`.

## Índice

1. [Principios](#1-principios)
2. [Capas del tema](#2-capas-del-tema)
3. [Componentes](#3-componentes)
4. [Sistema de imágenes del tema](#4-sistema-de-imágenes-del-tema)
5. [Sistema de diseño](#5-sistema-de-diseño)
6. [Textos: dónde vive cada uno](#6-textos-dónde-vive-cada-uno)
7. [Puntos acoplados al producto (qué cambia en una migración)](#7-puntos-acoplados-al-producto-qué-cambia-en-una-migración)
8. [Routing e instalabilidad](#8-routing-e-instalabilidad)
9. [Validación y ZIP](#9-validación-y-zip)
10. [No tocar](#10-no-tocar)
11. [Cómo extender el tema](#11-cómo-extender-el-tema)

---

## 1. Principios

1. **Dawn 16.0.0 oficial como base.** El commit «Fase 0: Dawn 16.0.0 oficial sin cambios» es una copia byte a byte de Shopify/dawn v16.0.0. El `theme_name` es «GARELON (Dawn)».
2. **Capa GARELON mínima.** Lo nuevo lleva prefijo `garelon-` (secciones, snippets, assets de marca) o `producto-` (imágenes del producto). Cada cambio dentro de un archivo de Dawn va comentado con `GARELON:`.
3. **Usar lo que Dawn ya resuelve.** Formulario de producto, selector de variantes, carrito AJAX, cajón del carrito, pago dinámico, valoración por metafields, `rich-text`, 404 y structured data son de Dawn.
4. **`templates/index.json` siempre instalable** (R17): solo secciones del tema y valores válidos. Sin producto en la tienda, la home sigue respondiendo 200.
5. **De menos a más.** Se construye y se valida por fases. No se sigue sobre un fallo.
6. **Contenido editable.** Los textos de la tienda viven en plantillas JSON y ajustes. Los textos de interfaz, en `locales/` (`garelon.*`).

---

## 2. Capas del tema

### 2.1 Archivos GARELON (nuevos)

| Archivo | Función |
|---|---|
| `sections/garelon-hero.liquid` | Portada: antetítulo, H1, texto, CTA principal (vacío = `/#comprar`), 2.º botón opcional, precio opcional (`show_price`), imagen LCP |
| `sections/garelon-reviews.liquid` | Opiniones reales: bloque de app (`@app`, Judge.me) y/o resumen con `reviews.rating` / `reviews.rating_count`. Sin datos, invisible para el cliente; aviso solo en el editor |
| `sections/garelon-image-text.liquid` | Imagen + texto (significado, historia, lifestyle) |
| `sections/garelon-details.liquid` | Lista de hechos verificables con icono e imagen (`layout: list`) o cuadrícula de tarjetas informativas (`layout: chips`) |
| `sections/garelon-faq.liquid` | Preguntas frecuentes con `details`/`summary` |
| `sections/garelon-sticky-cta.liquid` | Compra fija en móvil, solo en la plantilla de producto; pulsa el botón real de Dawn |
| `snippets/garelon-offer.liquid` | Tarjetas «Elige tu oferta» sobre los radios del `<variant-selects>` de Dawn y nota de impuestos/envío |
| `snippets/garelon-trust.liquid` | Frase destacada + hasta 4 garantías con icono |
| `snippets/garelon-pack-prices.liquid` | Lista de precios por pack (bloque `garelon_packs`, disponible pero sin usar en las plantillas) |
| `snippets/garelon-gallery.liquid` | Galería sin JS de las imágenes del tema: scroll-snap en móvil, rejilla desde 750 px |
| `snippets/garelon-image.liquid` | Imagen del editor o del tema por clave, con `srcset`, `sizes`, `width`/`height` y `loading` |
| `snippets/garelon-logo.liquid` | Logo aprobado desde assets si no se ha subido uno (cabecera y pie) |
| `snippets/garelon-nav-items.liquid` | Enlaces de la navegación propia (escritorio y menú móvil) |
| `snippets/garelon-legal-links.liquid` | Pie: Contacto y políticas en orden fijo, solo las que existen |
| `snippets/garelon-icon.liquid` | Iconos lineales decorativos (`aria-hidden`) |
| `assets/garelon.css` | Toda la capa visual (tokens en `:root`) |
| `assets/garelon.js` | Cierra el menú móvil al pulsar un ancla y gestiona la compra fija |
| `assets/garelon-logo-negro-*.webp` | Logo actual: isotipo dorado + wordmark negro |
| `assets/garelon-isotipo-*.webp`, `garelon-favicon-32.png`, `garelon-apple-touch-180.png` | Isotipo dorado: favicon, iOS, usos pequeños |
| `assets/producto-<clave>-<ancho>.webp` | Imágenes del producto (§4) |

### 2.2 Archivos de Dawn modificados (cambios mínimos, marcados `GARELON:`)

| Archivo | Cambio |
|---|---|
| `layout/theme.liquid` | Favicon e icono de iOS desde assets si no hay uno subido; carga `garelon.css` y `garelon.js` |
| `sections/header.liquid` + `snippets/header-drawer.liquid` | Navegación propia de 4 enlaces editables (`nav_link_*`), en lugar del menú del Admin, que trae «Catálogo»; búsqueda opcional (`garelon_show_search`); el logo no es H1; logo de respaldo; en móvil la cuenta va dentro del menú |
| `sections/footer.liquid` | Logo completo de respaldo; enlaces legales en orden fijo (`garelon-legal-links`) |
| `sections/featured-product.liquid` (compra de la home) | Sin producto elegido, el primero de la tienda; sin productos, nada para el cliente; ancla (`garelon_anchor`); origen de imágenes (`garelon_media`: `theme`/`shopify`) y orden (`garelon_gallery_keys`); bloques `garelon_quote`, `garelon_trust`, `garelon_offer`, `garelon_packs`; con tarjetas, el precio de Dawn queda solo para lectores de pantalla y la nota de impuestos/envío va bajo las tarjetas |
| `sections/main-product.liquid` (ficha) | Lo mismo salvo el producto de respaldo y el ancla |
| `sections/rich-text.liquid` | Ajuste opcional «Sello GARELON» (`garelon_badge`: `none`/`escudo`/`candado`, `none` por defecto) |
| `sections/main-404.liquid`, `sections/main-cart-items.liquid`, `snippets/cart-drawer.liquid` | «Seguir comprando» lleva a la home en lugar del catálogo |
| `config/settings_schema.json` | `theme_name` |
| `config/settings_data.json` | Esquemas de color, fuentes, botones, carrito en cajón, descripción de marca |
| `sections/header-group.json`, `sections/footer-group.json` | Barra superior, cabecera y pie GARELON |
| `templates/index.json`, `templates/product.json` | Home y ficha |
| `locales/*.json` | Namespace `garelon.*` en todos los idiomas y «Añadir al carrito» en español de España |

Todo el JavaScript de Dawn (`global.js`, `product-info.js`, `product-form.js`, `cart*.js`, `media-gallery.js`…) está **sin modificar**.

---

## 3. Componentes

El orden actual de secciones está en `current-store-state.md`. Esta es la función de cada pieza.

### 3.1 Barra superior · `announcement-bar` (Dawn)
Un mensaje de marca, sin urgencia. Se edita en `sections/header-group.json`.

### 3.2 Cabecera y menú móvil · `header` (Dawn + GARELON)
- Hasta 4 enlaces editables (texto + URL): hoy Inicio · anclas de la home · Contacto. Sin «Catálogo» (R21).
- Móvil: menú · logo centrado · carrito, sin solapes desde 320 px. Búsqueda desactivada por defecto.
- `garelon.js` cierra el menú móvil al pulsar un ancla de la misma página.

### 3.3 Portada · `garelon-hero`
- H1 de la home, imagen LCP (`eager`, `fetchpriority=high`), un CTA principal hacia `/#comprar`.
- `show_price` existe en el schema (por defecto `true`), pero **la home lo tiene desactivado por decisión del propietario**: el precio se descubre en los packs.

### 3.4 Bloque de compra · `featured-product` (home) / `main-product` (ficha)
Formulario oficial de Dawn. Bloques típicos: título, valoración, precio, confianza, oferta, botones de compra (con pago dinámico). En la ficha también: antetítulo, resumen, descripción y pestaña «Envíos y devoluciones».
- `garelon_media`: `theme` (imágenes fieles del tema, valor de las plantillas) o `shopify` (multimedia del producto, default del schema). Se pasa a `shopify` solo cuando la multimedia del producto esté revisada.
- `garelon_gallery_keys`: orden de la galería del tema (claves de §4).
- `garelon_anchor` (solo home): ancla `comprar`, destino de todos los CTA.

### 3.5 Galería · `snippets/garelon-gallery.liquid`
Sin JS. En móvil, scroll-snap: la infografía ocupa todo el ancho para que se lea; el resto deja asomar la siguiente. Desde 750 px, rejilla. Solo la primera imagen de la ficha es `eager`. La infografía enlaza a su versión grande para ampliarla. Los textos alternativos salen de `garelon.gallery.alt_<clave>`.

### 3.6 Confianza · bloque `garelon_trust` (`snippets/garelon-trust.liquid`)
Frase destacada (una vez por página, junto a la compra) + hasta 4 garantías con icono (2 × 2 en móvil). Cada garantía solo aparece si su texto no está vacío. Los textos deben ser ciertos en Shopify (envío gratis, internacional…).

### 3.7 Elige tu oferta · bloque `garelon_offer` (`snippets/garelon-offer.liquid`)
Tarjetas clicables que **son** los radios del `<variant-selects>` de Dawn: Dawn cambia la variante, el `id` del formulario, el precio, la URL (ficha), la disponibilidad y el botón. Teclado: Tab + flechas. El grupo se anuncia con el título del bloque.

| Ajuste | Uso |
|---|---|
| `option_name` | Nombre de la opción de packs en Shopify (hoy `Pack`). El número inicial del valor («2 pulseras») son las unidades |
| `unit_singular` | Palabra de la unidad para «X € por <unidad>» y la nota de ahorro (schema: «unidad») |
| `sub_1..3` | Texto corto de cada tarjeta. Un texto que hable de ahorro («ahorr…») se oculta solo si ese pack no ahorra de verdad |
| `badge_pack` / `badge_text` | Distintivo editorial en un pack. **Atención:** el texto por defecto del schema es «Más popular» (con `badge_pack: none`, invisible). Al activar un distintivo, escribe un texto editorial («Recomendado») salvo que haya datos de ventas (R9) |
| `show_unit_price` | Precio por unidad, solo en packs con ahorro real |
| `show_promo` / `promo_text` | Texto de promoción, apagado por defecto, sin contador |
| `free_shipping` | «Impuestos incluidos. Envío gratis.» bajo los packs (default `true`). Desactivado, vuelve el texto de Shopify sobre el envío calculado en el checkout |

Reglas de cálculo:
- **Precio tachado:** solo si la variante tiene `compare_at_price > price` en Shopify.
- **Ahorro:** con `compare_at_price` real, comparación − precio. Sin él, `precio(pack de 1) × N − precio(pack de N)`, solo si es > 0, con la nota «Ahorro calculado frente a comprar cada <unidad> por separado.».
- **Degradación:** sin una única opción de packs (otra opción, dos opciones), selector normal de Dawn y precio de Dawn visible, con aviso solo en el editor. Con una sola variante, ni selector ni tarjetas.

### 3.8 Bloques disponibles sin usar
`garelon_quote` (frase suelta) y `garelon_packs` (lista de precios por pack, `snippets/garelon-pack-prices.liquid`). Siguen en el schema por compatibilidad. No se usan junto con `garelon_offer`.

### 3.9 Compra con tranquilidad · `rich-text` (Dawn) + `garelon_badge`
Tarjeta con subtítulo «14 días para cambiar de opinión», título, texto legal (derecho de desistimiento + garantía legal aplicable) y enlace a `/policies/refund-policy`. El sello (escudo con check o candado) es decorativo (`aria-hidden`), va centrado encima del subtítulo y mide 64 px en móvil y 72 px desde 750 px.

### 3.10 Opiniones · `garelon-reviews`
- El widget de Judge.me se añade desde el editor (Añadir bloque › Apps). **No va en `index.json`** (R17).
- Con `hide_without_reviews`, si la valoración sincronizada es 0, el cliente no ve un widget vacío.
- Nota de origen editable, que solo se muestra con opiniones visibles.

### 3.11 Imagen y texto · `garelon-image-text`
Bloque de significado o lifestyle con imagen del tema o del editor.

### 3.12 Detalles y «Para regalar» · `garelon-details`
- `layout: list`: hechos verificables con icono e imagen (en la home, la infografía; en la ficha, el detalle). Con la infografía, una sola columna hasta 990 px.
- `layout: chips`: tarjetas informativas iguales, no seleccionables. Móvil 2 × 3, desde 750 px 3 × 2 (máx. 760 px, centradas). Una fila mide lo que su tarjeta más alta.

### 3.13 FAQ · `garelon-faq`
Preguntas con `details`/`summary` (teclado nativo). Las respuestas sobre envío y devoluciones remiten a las políticas, no duplican condiciones.

### 3.14 Cierre · `rich-text` (Dawn)
Título, texto y botón hacia `/#comprar`.

### 3.15 Ficha de producto
`main-product` + tranquilidad + opiniones + detalles + FAQ + compra fija (`garelon-sticky-cta`, solo móvil, visible cuando el botón real queda por encima de la pantalla, con el estado y el precio del botón real).

### 3.16 Pie · `footer` (Dawn + GARELON)
Logo completo, descripción de marca, bloque «Ayuda» con enlace a contacto, enlaces legales en orden fijo y solo si existen (Contacto · Envíos · Devoluciones y reembolsos · Privacidad · Cookies · Términos · Aviso legal). Sin iconos de pago ni newsletter.

### 3.17 Carrito
Cajón (`cart_type: drawer`) y `/cart` de Dawn, sin cambios salvo «Seguir comprando» → home. La nota del carrito es la de Dawn (hoy «Impuestos incluidos. Descuentos y envío calculados en la pantalla de pago»). Sin upsells, casillas premarcadas ni productos añadidos automáticamente.

### 3.18 Otras plantillas
`404.json` (Dawn, «Seguir comprando» → home), `page.contact.json` (página `contacto` del Admin), `cart.json`, `search.json`, `password.json`, `collection.json`, `list-collections.json`, `blog.json`, `article.json`, `page.json`, `gift_card.liquid`, todas de Dawn.

---

## 4. Sistema de imágenes del tema

- **Origen:** imágenes fuente en la raíz del repositorio (fuera del ZIP). Se generan WebP cuadrados a varios anchos, sin alterar el producto: solo redimensionar o recortar sin ampliar.
- **Nombre:** `assets/producto-<clave>-<ancho>.webp`. Las claves y sus anchos están en el `case` de `snippets/garelon-image.liquid`, y `tools/garelon_check.py` comprueba que existe cada ancho.
- **Uso:** `{% render 'garelon-image', image: section.settings.image, key: '<clave>', alt: …, sizes: …, eager: … %}`. Si el editor tiene una imagen elegida, manda esa.
- **Galerías:** `garelon_gallery_keys` en la compra de la home y en la ficha. El orden se decide por la historia comercial (Prompt Maestro §9) y queda en el snapshot.
- **Infografías con texto:** enlace a la versión grande y ancho completo en móvil.
- **LCP:** solo la imagen de la portada (home) y la primera de la galería (ficha) son `eager`.
- **Multimedia de Shopify:** puede traer imágenes del proveedor con claims no verificados. Por eso las plantillas usan `garelon_media: theme` hasta revisarla.

**Añadir o cambiar una clave:**
1. Assets a todos los anchos.
2. `when` en `snippets/garelon-image.liquid`.
3. `when` y texto alternativo en `snippets/garelon-gallery.liquid` + `garelon.gallery.alt_<clave>` en todos los locales.
4. Opción en los selects `image_key` de las secciones que la ofrezcan.
5. `tools/garelon_check.py`.

---

## 5. Sistema de diseño

- **Tokens** en `:root` de `assets/garelon.css`: tinta carbón, acento dorado de acción (AA con texto blanco), dorado oscuro para texto pequeño, fondo champán suave, líneas finas, radios.
- **Esquemas de color** en `config/settings_data.json`: blanco, marfil, champán y oscuro, con botón dorado o carbón. Valores actuales en el snapshot.
- **Tipografía:** par serif + sans de la biblioteca de Shopify (hoy Lora + Inter).
- **Puntos de corte:** 750 px (tableta) y 990 px (escritorio), como Dawn, con ajustes finos por debajo de 360 px.
- **Objetivos táctiles** ≥ 44 px, foco visible y `prefers-reduced-motion` respetado.
- **Estilo:** tarjetas simétricas, bordes finos dorados, sombras suaves, sin ornamento innecesario.

---

## 6. Textos: dónde vive cada uno

| Texto | Dónde |
|---|---|
| Portada, compra, confianza, packs, tranquilidad, opiniones, significado, detalles, regalo, FAQ, cierre | `templates/index.json` |
| Ficha: antetítulo, resumen, pestaña, secciones | `templates/product.json` |
| Barra superior, navegación | `sections/header-group.json` |
| Pie (bloque Ayuda) | `sections/footer-group.json` |
| Descripción de marca | `config/settings_data.json` (`brand_description`) |
| Textos de interfaz GARELON (legales, galería, packs, oferta, opiniones) | `locales/*.json` › `garelon.*` |
| Valores por defecto de bloques y secciones | `{% schema %}` de cada sección |
| Título, descripción y SEO del producto | Shopify Admin |

---

## 7. Puntos acoplados al producto (qué cambia en una migración)

Lista de comprobación técnica. El prompt de migración la recorre fase a fase.

| # | Punto | Archivo(s) |
|---|---|---|
| 1 | Textos de la home y de la ficha (portada, detalles, regalo, FAQ, cierre, resumen, pestaña) | `templates/index.json`, `templates/product.json` |
| 2 | Claves de imagen, `image_key`, `image_alt` y `garelon_gallery_keys` | Plantillas JSON |
| 3 | Assets `producto-*` (añadir los nuevos y borrar los del producto anterior) | `assets/` |
| 4 | Claves y anchos de imagen | `snippets/garelon-image.liquid` |
| 5 | Claves y textos alternativos de la galería, etiqueta de la galería | `snippets/garelon-gallery.liquid`, `locales/*.json` › `garelon.gallery.*` |
| 6 | Opciones `image_key` (y sus etiquetas, hoy «Pulsera en la muñeca»…) | `sections/garelon-hero.liquid`, `garelon-image-text.liquid`, `garelon-details.liquid` |
| 7 | Bloque de packs: `option_name`, `unit_singular`, `sub_1..3`, distintivo | Plantillas JSON (y defaults del schema si cambia la convención) |
| 8 | Aviso del editor con los valores de pack de ejemplo | `locales/*.json` › `garelon.packs.editor_missing` |
| 9 | Frase y garantías de confianza (default del schema incluido) | Plantillas JSON, `sections/featured-product.liquid`, `sections/main-product.liquid` |
| 10 | Iconos específicos del producto (hoy material, medalla, cruz, cuentas, longitud, ajuste); los genéricos se quedan (envío, devolución, escudo, candado, ubicación, globo, tarjeta, regalo, corazón) | `snippets/garelon-icon.liquid`, opciones `icon` de `garelon-details` |
| 11 | Título y nota de opiniones | Plantillas JSON |
| 12 | Barra superior, navegación (anclas), descripción de marca | `sections/header-group.json`, `config/settings_data.json` |
| 13 | Textos de ayuda del editor que citan el producto («Elegir mi pulsera») | `{% schema %}` de `featured-product` |
| 14 | Paleta y fuentes: **solo si el propietario lo pide** | `config/settings_data.json`, `assets/garelon.css` |
| 15 | Producto, variantes, packs, precios, multimedia, SEO, redirección del handle anterior → `/` | **Shopify Admin** (propietario) |
| 16 | Mapping con el proveedor y pedidos de prueba | `{{SUPPLIER_INTEGRATION}}` (propietario) |

Comando para encontrar restos del producto anterior (adapta los términos):

```bash
grep -rn -i -E "pulsera|rosario|virgen" assets config layout locales sections snippets templates --include=*.liquid --include=*.json
```

---

## 8. Routing e instalabilidad

- **Un 404 en `/` es un problema de instalación:** Shopify no encontró un `templates/index.json` utilizable, normalmente porque rechazó una sección que usa. Un 404 en otra URL es de contenido (producto no publicado, página o política inexistente) y se arregla en el Admin, nunca editando `templates/404.json`.
- **Causas típicas de rechazo** (las detecta `tools/garelon_check.py`): `name` de sección, bloque o preset de más de 25 bytes; valores que no cumplen el schema; claves JSON duplicadas; bloques de app, imágenes de Files o recursos de la tienda dentro de `index.json`; referencias a snippets o assets inexistentes.
- **Nunca diagnostiques con `request.path` dentro de la 404:** en Shopify vale siempre `/404`.
- Si alguien informa de un 404, pide la **URL exacta** y si ve la 404 de GARELON o una página de Shopify.

---

## 9. Validación y ZIP

**En el repositorio (versionado):**

| Comando | Qué hace |
|---|---|
| `python3 tools/garelon_check.py [tema] [--strict-root]` | Validador de instalabilidad: archivos obligatorios, JSON sin claves duplicadas, schemas, nombres ≤ 25 bytes, defaults, valores contra schemas, `order`/`block_order`, secciones permitidas, referencias a apps, Files o recursos, snippets, assets, claves de imagen y locales |
| `python3 tools/test_garelon_check.py` | Autoprueba del validador: roturas típicas que deben fallar + el tema intacto, que debe pasar |
| `python3 tools/build_zip.py SALIDA.zip` | Valida, empaqueta las 7 carpetas con fechas fijas (mismo árbol = mismo SHA-256), descomprime en una carpeta nueva, valida con `--strict-root` y compara byte a byte. Si algo falla, no deja ZIP |
| `python3 tools/garelon_docs_check.py` | Coherencia del sistema documental, no del tema: cabeceras, rutas citadas, enlaces, términos obsoletos, skill, snapshot al día y manifest. `--update-manifest` y `--zip` para el paquete de ChatGPT |
| `python3 tools/test_garelon_docs_check.py` | Autoprueba del comprobador documental |

**Fuera del repositorio (hay que instalarlo en la sesión):**
- **Theme Check:** `@shopify/theme-check-node` (Node). La línea base de Dawn 16.0.0 tiene avisos propios: se compara con la línea base, no con cero.
- **Liquid estricto:** gema `liquid` de Ruby, con `error_mode: :strict` sobre `layout`, `sections`, `snippets` y `templates`, registrando `schema`, `style`, `form`, etc.
- **Render, routing, responsive y regresión:** servidor local con `liquidjs`, que pinta el Liquid real del tema con datos simulados (producto con packs, sin producto, agotado, con y sin opiniones, con y sin políticas), y Playwright con Chromium y el JS real de Dawn. **No está versionado en el repositorio.** Mientras no se versione, cada sesión lo reconstruye o recupera una copia entregada aparte. Ver `references/qa-testing.md` de la skill.

**Responsive obligatorio:** 320, 360, 375, 390, 430, 768, 1024 y 1440 px, sin scroll horizontal.

**ZIP del tema:** solo `assets/ config/ layout/ locales/ sections/ snippets/ templates/`. Sale siempre de `tools/build_zip.py`. Después se **descomprime en una carpeta nueva y se vuelve a validar** (validador `--strict-root`, Theme Check, Liquid estricto, render). Los ZIP no se suben a GitHub.

**Lo que este entorno no prueba:** Shopify real (subida, vista previa, tienda publicada), checkout, pagos, DSers, el widget real de Judge.me ni los metafields reales.

---

## 10. No tocar

- JavaScript de Dawn, `snippets/buy-buttons.liquid`, el formulario de producto y la lógica del carrito y del cajón (salvo los enlaces «Seguir comprando», ya hechos).
- El checkout, los métodos de pago, el fulfillment y la configuración del proveedor.
- El logo y la identidad (R20), las reglas CSS de la cabecera móvil y el orden legal del pie.
- `templates/index.json` con bloques de app o recursos de la tienda (R17).
- `layout/theme.liquid`, salvo una necesidad imprescindible y justificada.

---

## 11. Cómo extender el tema

1. Antes de crear, busca si Dawn o una sección GARELON ya lo resuelve con un ajuste.
2. Lo nuevo va con prefijo `garelon-`, `name` ≤ 25 bytes, schema con defaults válidos y textos de interfaz en `locales/` (todos los idiomas, `garelon.*`).
3. Un cambio dentro de un archivo de Dawn va comentado con `GARELON:` y es mínimo.
4. Los ajustes nuevos llevan un default seguro. Lo que anuncie una oferta o un dato comercial debe ser cierto con la configuración por defecto, o ir desactivado hasta que el propietario lo confirme.
5. Antes de entregar: validador, autoprueba, Theme Check (contra la línea base), Liquid estricto, render y responsive, y ZIP validado descomprimido.
6. Actualiza `current-store-state.md` y, si cambia la arquitectura, este documento (DOCUMENT_SYNC).
