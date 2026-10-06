# GARELON · MASTER TEMPLATE (arquitectura real del tema)

> **Versión:** 3.8 · **Fecha:** 2026-10-06 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `e08077b`
>
> Snapshot generado desde `e27ae75`. Ante discrepancias futuras manda el repositorio actual: revisa el código antes de actuar sobre lo que dice este documento.

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
4. **`templates/index.json` siempre instalable** (R17): solo secciones del tema y valores válidos. Sin producto en la tienda, la home sigue respondiendo 200. Único bloque de app permitido: el Review Widget oficial de Judge.me en «GARELON Opiniones» (D30).
5. **De menos a más.** Se construye y se valida por fases. No se sigue sobre un fallo.
6. **Contenido editable.** Los textos de la tienda viven en plantillas JSON y ajustes. Los textos de interfaz, en `locales/` (`garelon.*`).

---

## 2. Capas del tema

### 2.1 Archivos GARELON (nuevos)

| Archivo | Función |
|---|---|
| `sections/garelon-hero.liquid` | Portada: antetítulo, H1, texto, CTA principal (vacío = `/#comprar`), 2.º botón opcional, precio opcional (`show_price`), imagen LCP |
| `sections/garelon-reviews.liquid` | Opiniones reales: bloque de app (`@app`; el Review Widget de Judge.me viene versionado en home y ficha) y/o resumen con `reviews.rating` / `reviews.rating_count`. Sin datos, invisible para el cliente; aviso solo en el editor |
| `sections/garelon-image-text.liquid` | Imagen + texto (significado, historia, lifestyle) |
| `sections/garelon-details.liquid` | Lista de hechos verificables con icono e imagen (`layout: list`) o cuadrícula de tarjetas informativas (`layout: chips`) |
| `sections/garelon-faq.liquid` | Preguntas frecuentes con `details`/`summary` |
| `sections/garelon-sticky-cta.liquid` | Compra fija en móvil, solo en la plantilla de producto; pulsa el botón real de Dawn |
| `snippets/garelon-offer.liquid` | Tarjetas «Elige tu oferta» sobre los radios del `<variant-selects>` de Dawn y, debajo, la nota de impuestos y envío |
| `snippets/garelon-shipping-note.liquid` | Nota de impuestos y envío **común** a packs, ficha, cajón del carrito y `/cart` (§3.17). Única que pinta «Envío gratis.» |
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
| `snippets/cart-drawer.liquid`, `sections/main-cart-footer.liquid` | Con «Envío gratis» activo, la nota del carrito es la común (`garelon-shipping-note`); si no, la de Dawn sin cambios |
| `config/settings_schema.json` | `theme_name` y ajuste global «Envío gratis» (`garelon_free_shipping`, grupo Carrito) |
| `config/settings_data.json` | Esquemas de color, fuentes, botones, carrito en cajón, descripción de marca, `garelon_free_shipping: true` |
| `sections/header-group.json`, `sections/footer-group.json` | Barra superior, cabecera y pie GARELON |
| `templates/index.json`, `templates/product.json` | Home y ficha |
| `locales/*.json` | Namespace `garelon.*` en todos los idiomas (español en `es.json`, inglés en el resto) y «Añadir al carrito» en español de España |

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
Frase destacada (una vez por página, junto a la compra) + hasta 4 garantías con icono, en 2 columnas; con un número impar, la última ocupa la fila entera. Cada garantía solo aparece si su texto no está vacío (hoy 3: la 4.ª, «Envíos internacionales», está vacía por D32 y sin default en el schema). Los textos deben ser ciertos en Shopify (envío gratis, internacional…). Con el ajuste «Envío gratis» desactivado, `tools/garelon_check.py` da error si una garantía sigue diciendo «Envío gratis».

### 3.7 Elige tu oferta · bloque `garelon_offer` (`snippets/garelon-offer.liquid`)
Tarjetas clicables que **son** los radios del `<variant-selects>` de Dawn: Dawn cambia la variante, el `id` del formulario, el precio, la URL (ficha), la disponibilidad y el botón. Teclado: Tab + flechas. El grupo se anuncia con el título del bloque.

| Ajuste | Uso |
|---|---|
| `option_name` | Nombre de la opción de packs en Shopify (hoy `Pack`). El número inicial del valor («2 pulseras») son las unidades |
| `unit_singular` | Palabra de la unidad para «X € por <unidad>» y la nota de ahorro (schema: «unidad») |
| `sub_1..3` | Texto corto de cada tarjeta. Un texto que hable de ahorro («ahorr…») se oculta solo si ese pack no ahorra de verdad |
| `badge_pack` / `badge_text` | Distintivo editorial en un pack (`badge_pack` por defecto `none`). El texto por defecto del schema es «Recomendado». «Más popular», «Más vendido» o similares solo con datos de ventas reales (R9); `tools/garelon_check.py` impide que un default de schema los traiga |
| `show_unit_price` | Precio por unidad, solo en packs con ahorro real |
| `show_promo` / `promo_text` | Texto de promoción, apagado por defecto, sin contador |

Bajo las tarjetas va la nota de impuestos y envío común (`garelon-shipping-note`, §3.17). El bloque **no tiene** ajuste de envío propio: lo decide el ajuste global «Envío gratis».

Reglas de cálculo:
- **Precio tachado:** solo si la variante tiene `compare_at_price > price` en Shopify.
- **Ahorro:** con `compare_at_price` real, comparación − precio. Sin él, `precio(pack de 1) × N − precio(pack de N)`, solo si es > 0, con la nota «Ahorro calculado frente a comprar cada <unidad> por separado.».
- **Degradación:** sin una única opción de packs (otra opción, dos opciones), selector normal de Dawn y precio de Dawn visible, con aviso solo en el editor. Con una sola variante, ni selector ni tarjetas.

### 3.8 Bloques disponibles sin usar
`garelon_quote` (frase suelta) y `garelon_packs` (lista de precios por pack, `snippets/garelon-pack-prices.liquid`). Siguen en el schema por compatibilidad. No se usan junto con `garelon_offer`.

### 3.9 Compra con tranquilidad · `rich-text` (Dawn) + `garelon_badge`
Tarjeta con subtítulo «14 días para cambiar de opinión», título, texto legal (derecho de desistimiento + garantía legal aplicable) y enlace a `/policies/refund-policy`. El sello (escudo con check o candado) es decorativo (`aria-hidden`), va centrado encima del subtítulo y mide 64 px en móvil y 72 px desde 750 px.

### 3.10 Opiniones · `garelon-reviews`
- **Review Widget de Judge.me versionado** (D30, única excepción a R17): bloque `shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8` en `blocks`/`block_order` de la sección `opiniones` de `templates/index.json` y `templates/product.json`.
  - Ajustes copiados de plantillas reales generadas por el editor de Shopify: `review_data` = `real_data` (nunca la muestra de Judge.me), `show_shop_reviews` = falso, `empty_state` = `empty_widget`, `max_width` = 1200.
  - En Liquid, un bloque de app llega con `block.type == '@app'` y se pinta con `{% render block %}` en `.g-reviews__app`, entre el encabezado y la nota.
  - App Embed Judge.me Core (`judgeme_core`, mismo UUID) en `config/settings_data.json` (`blocks` del preset actual).
  - **Producto del widget en la home:** sin preseleccionar. La clave del ajuste y el handle real no están verificados desde el repo; se elige en el bloque («Select product») o se versiona cuando se conozca el JSON real. En la ficha lo pone la página.
  - `summary_with_app` = falso: con el widget, el resumen GARELON no se pinta y Judge.me pone estrellas, recuento y reseñas. Sin la app (bloque no pintado), el resumen de los metafields hace de respaldo.
  - Si Judge.me se sustituye o se desinstala: quitar el bloque de las dos plantillas y el App Embed (el tema sigue instalable sin ellos).
- Con `hide_without_reviews`, si la valoración sincronizada es 0, el cliente no ve un widget vacío.
- Nota de origen editable, que solo se muestra con opiniones visibles.

### 3.11 Imagen y texto · `garelon-image-text`
Bloque de significado o lifestyle con imagen del tema o del editor.

### 3.12 Detalles y «Para regalar» · `garelon-details`
- `layout: list`: hechos verificables con icono e imagen (en la home, la infografía; en la ficha, el detalle). Con la infografía, una sola columna hasta 990 px.
- `layout: chips`: tarjetas informativas iguales, no seleccionables. Móvil 2 columnas, desde 750 px 3 (máx. 760 px, centradas). Una fila mide lo que su tarjeta más alta. Disponible para futuros productos; hoy no se usa.
- **Sin bloques, imagen ni nota:** la sección es solo su encabezado (antetítulo, título, entradilla). No se pinta la lista ni la rejilla, y el encabezado pierde su margen inferior: sin huecos.
- **«Para regalar»** (`regalo` en la home): solo encabezado y entradilla, sin tarjetas de ocasiones. Una sección de gifting puede comunicar de forma **genérica** que el producto es apropiado como regalo o detalle para momentos especiales. Las **ocasiones concretas** (bautizos, comuniones, Navidad, cumpleaños, bodas…) **solo se enumeran si el propietario las pide expresamente para ese producto** (D31).

### 3.13 FAQ · `garelon-faq`
Preguntas con `details`/`summary` (teclado nativo). Las respuestas sobre envío y devoluciones remiten a las políticas, no duplican condiciones.

### 3.14 Cierre · `rich-text` (Dawn)
Título, texto y botón hacia `/#comprar`.

### 3.15 Ficha de producto
`main-product` + tranquilidad + opiniones + detalles + FAQ + compra fija (`garelon-sticky-cta`, solo móvil, visible cuando el botón real queda por encima de la pantalla, con el estado y el precio del botón real).

### 3.16 Pie · `footer` (Dawn + GARELON)
Logo completo, descripción de marca, bloque «Ayuda» con enlace a contacto, enlaces legales en orden fijo y solo si existen (Contacto · Envíos · Devoluciones y reembolsos · Privacidad · Cookies · Términos · Aviso legal). Contacto = página `contacto` (o `contact`); sin ella, la política nativa «Información de contacto», nunca las dos. Esa misma resolución (`snippets/garelon-contact-url.liquid`) la usan la cabecera, el menú móvil y, mediante `snippets/garelon-contact-rte.liquid`, los enlaces `/pages/contacto` del bloque «Ayuda» y de las FAQ: sin página de contacto, el enlace no se pinta o queda como texto (nunca un 404). Cookies = página `politica-de-cookies` (o `cookies`). Aviso legal = política nativa `/policies/legal-notice` con contenido o, si no, página `aviso-legal`. Ningún texto legal en Liquid. Sin iconos de pago ni newsletter.

### 3.17 Carrito y nota de envío
Cajón (`cart_type: drawer`) y `/cart` de Dawn: formulario, líneas, cantidades, subtotal y botón de pago sin cambios. Dos cambios GARELON: «Seguir comprando» → home, y la nota de impuestos y envío.

**Envío gratis: una sola fuente de verdad.**

| Pieza | Dónde |
|---|---|
| Decisión | Ajuste global «Envío gratis» (`garelon_free_shipping`), en Configuración del tema › Carrito. Activo por defecto y en `settings_data.json`, porque el propietario confirmó que el envío es gratis. Se activa solo si la tarifa real en Shopify Admin › Envío y entrega es gratuita: el tema no cambia tarifas |
| Texto | `snippets/garelon-shipping-note.liquid`, único archivo que pinta «Envío gratis.» (`garelon.offer.free_shipping`) |
| Dónde se ve | Bajo los packs (`garelon-offer`), bajo el precio cuando no hay packs (`featured-product`, `main-product`), en el cajón (`cart-drawer`) y en `/cart` (`main-cart-footer`) |

| Situación | Packs y ficha | Cajón y `/cart` |
|---|---|---|
| Envío gratis + impuestos incluidos (hoy) | «Impuestos incluidos. Envío gratis.» | «Impuestos incluidos. Envío gratis.» |
| Envío gratis + aranceles e impuestos incluidos | «Aranceles e impuestos incluidos. Envío gratis.» | Igual |
| Envío gratis + solo aranceles incluidos | «Aranceles incluidos. Envío gratis.» | «Aranceles incluidos. Impuestos calculados en la pantalla de pago. Envío gratis.» |
| Envío gratis + impuestos no incluidos | «Envío gratis.» (como Dawn, el producto no habla de impuestos) | «Impuestos calculados en la pantalla de pago. Envío gratis.» (`garelon.cart.taxes_at_checkout`) |
| Envío gratis **desactivado** | Texto de Dawn: «Impuestos incluidos. Los gastos de envío se calculan en la pantalla de pago.» (con enlace a la política de envío si existe) | Nota original de Dawn: «Impuestos incluidos. Descuentos y envío calculados en la pantalla de pago.» |

Así no se pierde información fiscal ni se inventan afirmaciones nuevas. Si se desactiva el envío gratis, cambia también la garantía «Envío gratis + seguimiento» (§3.6). Sin upsells, casillas premarcadas ni productos añadidos automáticamente.

### 3.18 Otras plantillas
`404.json` (Dawn, «Seguir comprando» → home), `page.contact.json` (página `contacto` del Admin; formulario nativo de Dawn `contact-form`, `{% form 'contact' %}`), `page.json` (además incluye `contact-form` con `garelon_contact_only`: el formulario aparece solo en la página `contacto`/`contact` aunque en el Admin tenga la plantilla predeterminada), `cart.json`, `search.json`, `password.json`, `collection.json`, `list-collections.json`, `blog.json`, `article.json`, `page.json`, `gift_card.liquid`, todas de Dawn.

---

## 4. Sistema de imágenes del tema

- **Origen:** imágenes fuente en la raíz del repositorio (fuera del ZIP). Se generan WebP cuadrados a varios anchos, sin alterar el producto: solo redimensionar o recortar sin ampliar.
- **Nombre:** `assets/producto-<clave>-<ancho>.webp`. Las claves y sus anchos están en el `case` de `snippets/garelon-image.liquid`, y `tools/garelon_check.py` comprueba que existe cada ancho.
- **Uso:** `{% render 'garelon-image', image: section.settings.image, key: '<clave>', alt: …, sizes: …, eager: … %}`. Si el editor tiene una imagen elegida, manda esa, salvo con la clave `infografia` (siempre la del tema, D35).
- **Galerías:** `garelon_gallery_keys` en la compra de la home y en la ficha. El orden se decide por la historia comercial (Prompt Maestro §9) y queda en el snapshot.
- **Infografías con texto:** enlace a la versión grande («Ampliar», debajo de la imagen, nunca encima), ancho completo en móvil y sin esquinas redondeadas que recorten la imagen (D35). **WebP lossless** (D34): el WebP con pérdida submuestrea el color y aclara líneas finas y textos. El mayor ancho es el de la fuente, nunca más (sin ampliar).
- **Fuente inmutable de `infografia`:** `NUEVA IMAGEN 1.png`, con el SHA-256 de su versión aprobada vigente fijado en `tools/garelon_infografia.py` (`SOURCE_SHA256`; hoy la versión sin líneas indicadoras, D36). Si el propietario la sustituye, la anterior pasa a `RETIRED_SOURCE_SHA256` y la familia sube de versión. `--build` genera los anchos del snippet (reducción proporcional LANCZOS → WebP lossless) y `--check` comprueba fuente, proporción, píxeles por zonas, que no haya PNG y que no vuelva la fuente retirada. `build_zip.py` y `validate.js` lo ejecutan; ninguna otra imagen puede ser su fuente. **Familia versionada (D35, D36):** `assets/producto-infografia-v3-<ancho>.webp` (`assign asset` en `garelon-image`); las familias `producto-infografia-<ancho>.webp` y `producto-infografia-v2-<ancho>.webp` están retiradas y el comprobador bloquea sus nombres, sus referencias y sus versiones antiguas por SHA-256. `--identify IMAGEN` dice si una imagen descargada de la tienda es la fuente (y rechaza una copia con algo añadido, aunque esté recomprimida).
- **Sustituir una fuente** (misma clave): la nueva imagen a la raíz, la antigua fuera del repo, y se regeneran todos los anchos de la clave. Para `infografia`, además: nuevo SHA-256 en `tools/garelon_infografia.py`, una familia con versión nueva (`-v3`, para que ninguna URL antigua se confunda), `--build` y entrada en el Decision Log. Hoy: `infografia` ← `NUEVA IMAGEN 1.png` (D33); `principal`/`detalle` ← `NUEVA IMAGEN 3.png` (D29).
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
| Textos de interfaz GARELON (legales, galería, packs, oferta, envío del carrito, opiniones) | `locales/*.json` › `garelon.*` |
| Envío gratis (sí/no) | Configuración del tema › Carrito › «Envío gratis» (`config/settings_data.json`) |
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
| 17 | Envío gratis: confirmar con la tarifa real del producto nuevo. Si no es gratis, desactivar el ajuste y cambiar la garantía de envío | Configuración del tema › Carrito (`config/settings_data.json`), plantillas JSON |
| 18 | Pruebas específicas del producto (textos, handle, claves de imagen) | `tests/render-harness/suite/` y `src/server.js` (producto simulado) |

Comando para encontrar restos del producto anterior (adapta los términos):

```bash
grep -rn -i -E "pulsera|rosario|virgen" assets config layout locales sections snippets templates --include=*.liquid --include=*.json
```

---

## 8. Routing e instalabilidad

- **Un 404 en `/` es un problema de instalación:** Shopify no encontró un `templates/index.json` utilizable, normalmente porque rechazó una sección que usa. Un 404 en otra URL es de contenido (producto no publicado, página o política inexistente) y se arregla en el Admin, nunca editando `templates/404.json`.
- **Causas típicas de rechazo** (las detecta `tools/garelon_check.py`): `name` de sección, bloque o preset de más de 25 bytes; valores que no cumplen el schema; claves JSON duplicadas; bloques de app (salvo el Review Widget de Judge.me, D30), imágenes de Files o recursos de la tienda dentro de `index.json`; referencias a snippets o assets inexistentes.
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

`tools/garelon_check.py` también vigila la honestidad: ningún default de schema con claims de ventas («Más popular»…) y, con «Envío gratis» desactivado, ninguna plantilla que siga prometiéndolo.

**Batería de render y comprobaciones externas (versionadas en `tests/render-harness/`):**

| Comando | Qué hace |
|---|---|
| `cd tests/render-harness && npm ci` | Instala las dependencias fijadas en `package-lock.json` (`liquidjs`, `playwright-core`, `@shopify/theme-check-node`, fuentes). Chromium: el de `/opt/pw-browsers` en Claude Code web o `npm run install-chromium` |
| `node tests/render-harness/validate.js` | Todo en orden: validador, autoprueba, Theme Check, Liquid estricto y batería de render. Con `--theme <carpeta> --zip`, sobre el ZIP descomprimido |
| `node tests/render-harness/run.js [--theme <carpeta>] [--phase X]` | Solo la batería de render: servidor local con `liquidjs` que pinta el Liquid real con datos **simulados** (packs con y sin ahorro, `compare_at`, agotado, sin producto, con y sin opiniones, políticas, envío gratis activado/desactivado, impuestos) y Playwright con el JS real de Dawn |
| `npm run theme-check` | Theme Check oficial; cada aviso se marca `BASELINE DAWN` (ya está en Dawn 16.0.0) o `GARELON`. Objetivo: 0 errores y 0 avisos `GARELON` |
| `npm run liquid-strict` | Gema `liquid` de Ruby (5.14.0) en modo estricto. `BAD 0` = bien |

Las fases (A, B, C…) son rondas de trabajo; cada ronda nueva añade la suya. Requisitos, qué simula, qué no prueba y cómo leer los resultados: `tests/render-harness/README.md`. Los totales actuales están en el snapshot.

**Responsive obligatorio:** 320, 360, 375, 390, 430, 768, 1024 y 1440 px, sin scroll horizontal.

**ZIP del tema:** solo `assets/ config/ layout/ locales/ sections/ snippets/ templates/`. Sale siempre de `tools/build_zip.py`, con el nombre `GARELON-PULSERA-ROSARIO-CLEAN-v<versión>-<TEMA>.zip` y la versión siguiente a la última entregada. Después se **descomprime en una carpeta nueva y se vuelve a validar** con `node tests/render-harness/validate.js --theme <carpeta> --zip`. Los ZIP no se suben a GitHub.

**Lo que este entorno no prueba:** Shopify real (subida, vista previa, tienda publicada, Admin), checkout, pagos, tarifas de envío reales, DSers, el widget real de Judge.me ni los metafields reales. La batería **simula** Shopify.

---

## 10. No tocar

- JavaScript de Dawn, `snippets/buy-buttons.liquid`, el formulario de producto y la lógica del carrito y del cajón (salvo los enlaces «Seguir comprando» y la nota de envío común, ya hechos).
- Un segundo ajuste o texto de «Envío gratis»: la decisión vive solo en `garelon_free_shipping` y el texto solo en `garelon-shipping-note`.
- El checkout, los métodos de pago, el fulfillment y la configuración del proveedor.
- El logo y la identidad (R20), las reglas CSS de la cabecera móvil y el orden legal del pie.
- `templates/index.json` con bloques de app distintos del Review Widget de Judge.me, o con recursos de la tienda (R17, D30).
- `layout/theme.liquid`, salvo una necesidad imprescindible y justificada.

---

## 11. Cómo extender el tema

1. Antes de crear, busca si Dawn o una sección GARELON ya lo resuelve con un ajuste.
2. Lo nuevo va con prefijo `garelon-`, `name` ≤ 25 bytes, schema con defaults válidos y textos de interfaz en `locales/` (todos los idiomas, `garelon.*`).
3. Un cambio dentro de un archivo de Dawn va comentado con `GARELON:` y es mínimo.
4. Los ajustes nuevos llevan un default seguro. Lo que anuncie una oferta o un dato comercial debe ser cierto con la configuración por defecto, o ir desactivado hasta que el propietario lo confirme.
5. Antes de entregar: `node tests/render-harness/validate.js` (validador, autoprueba, Theme Check sin avisos `GARELON`, Liquid estricto, render y responsive), con una fase nueva de pruebas para la ronda, y el ZIP validado descomprimido.
6. Actualiza `current-store-state.md` y, si cambia la arquitectura, este documento (DOCUMENT_SYNC).
