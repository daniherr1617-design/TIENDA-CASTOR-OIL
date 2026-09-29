# GARELON · MASTER STORE TEMPLATE

> **Versión 1.1 · septiembre 2026.** Extraído del repositorio `TIENDA-CASTOR-OIL` (rama `claude/great-lamport-8mb0rc`), la tienda GARELON del sérum de contorno de ojos. Versión 1.0 sacada del commit `755240b`; la 1.1 recoge el cambio de proveedor (**AutoDS → CJ Dropshipping**) y los **packs como variantes reales** (detalle en `GARELON-CAMBIOS-CJ-PACKS.md`, en la raíz). Todos los archivos, ajustes y valores que aparecen aquí salen del código real.
>
> **Cómo se usa:**
> - **ChatGPT:** lee primero la sección 29, rellena la sección 1 con el brief (`GARELON_PRODUCT_BRIEF_TEMPLATE.md`) y genera el prompt final para Claude Code.
> - **Claude Code:** este documento es tu especificación. Ejecuta la sección 25 y comprueba el resultado con `GARELON_PRODUCT_MIGRATION_CHECKLIST.md`.
> - **Orden de prioridad ante cualquier conflicto:** reglas permanentes (sección 3) > este documento > prompt adaptado > preferencias propias.

---

## PROMPT

Quiero adaptar la tienda Shopify GARELON a un nuevo producto.

GARELON es una marca y tienda online de **un solo producto** que vende en España a tráfico móvil que llega desde anuncios (TikTok, Meta, Instagram). La tienda actual (tema Dawn 16.0.0 con una capa propia GARELON) es el **estándar de calidad y de diseño**. No quiero una tienda nueva, un rediseño ni otra marca. Quiero conservar la marca, la infraestructura, el diseño y la calidad, y cambiar el producto y su contenido.

Recibes:
1. **Este documento**, que describe exactamente cómo está construida la tienda y qué reglas nunca se rompen.
2. **Los datos del nuevo producto** (bloque NEW PRODUCT DATA, sección 1).
3. **Las imágenes nuevas** en la carpeta `referencias/` del repositorio o adjuntas.
4. **El repositorio** existente de GARELON.

Tu trabajo:
1. Inspecciona el repositorio y comprueba que coincide con lo descrito aquí (sección 25, fase 0). Si algo difiere, manda el repositorio: adapta los pasos y anótalo.
2. Analiza todas las imágenes nuevas y elige solo las necesarias (sección 18).
3. Adapta el contenido de la home, la ficha de producto, la FAQ y la 404 al nuevo producto (secciones 9, 10, 14 y 17).
4. Sustituye los assets del producto anterior por los nuevos, conservando los de la marca (sección 18).
5. Toca el código solo donde el contenido del producto está escrito en él (sección 16.3). Todo lo demás se conserva.
6. Elimina cualquier resto del producto anterior (sección 25, fase 7).
7. Prueba la tienda (sección 26), sube los cambios a la rama indicada y entrega el informe (sección 27).

No reconstruyas la cabecera, el pie, el carrito, el contacto, las políticas, el responsive ni la arquitectura. Cambia solo lo necesario.

---

## 1. NEW PRODUCT DATA

Rellena cada variable con datos **verificados**: brief, ficha del proveedor, envase o imágenes. Si un dato no existe o no se puede verificar, escribe `NO DISPONIBLE` y **no lo inventes**. No todas las variables aplican a todos los productos.

```text
==============================
NEW PRODUCT DATA
==============================

--- Identificación ---
{{PRODUCT_NAME}}                  = Nombre comercial en español que usará GARELON en la tienda.
{{PRODUCT_SHORT_NAME}}            = Nombre corto con artículo para botones y textos (p. ej. «el sérum»).
                                    Se usa en el CTA: «Comprar {{PRODUCT_SHORT_NAME}}».
{{PRODUCT_TITLE_SHOPIFY}}         = Título del producto en Shopify: limpio, en español, sin claims.
{{PRODUCT_ORIGINAL_TITLE}}        = Título original del proveedor (hoy CJ Dropshipping). Solo referencia: NO se publica.
{{PRODUCT_HANDLE}}                = Identificador (handle) del producto en Shopify, si ya existe.
{{PRODUCT_PHYSICAL_BRAND}}        = Marca impresa en el producto o el envase, o «sin marca visible».
                                    GARELON no la sustituye ni la tapa.
{{PRODUCT_CATEGORY}}              = cosmética | electrónica/gadget | hogar | mascotas | moda |
                                    bienestar | accesorio | organización | otra.
{{PRODUCT_CONTENT}}               = Qué recibe exactamente el cliente: unidades, accesorios, volumen o peso.

--- Historia comercial ---
{{PRODUCT_DESCRIPTION}}           = Qué es y para qué sirve, en 1-2 frases verificables.
{{PRODUCT_MAIN_PROBLEM}}          = Problema o necesidad que resuelve, formulado sin exagerar.
{{PRODUCT_MAIN_BENEFIT}}          = Beneficio principal, formulado de forma prudente (sección 17).
{{PRODUCT_SECONDARY_BENEFITS}}    = 3-6 beneficios secundarios prudentes.
{{PRODUCT_DIFFERENTIATOR}}        = La característica que lo distingue (en el sérum era el aplicador roller).
{{PRODUCT_FEATURES}}              = Características objetivas (hechos, no promesas). 3-4 van a la barra de características.

--- Composición y especificaciones (según categoría) ---
{{PRODUCT_INGREDIENTS}}           = Cosmética: lista INCI completa y exacta del proveedor o del envase.
{{PRODUCT_MATERIALS}}             = Materiales verificados.
{{PRODUCT_SPECIFICATIONS}}        = Especificaciones técnicas: batería, potencia, conectividad, compatibilidad, etc.
{{PRODUCT_DIMENSIONS}}            = Medidas del producto y del envase, peso y capacidad, con su unidad.
{{PRODUCT_VARIANTS}}              = Variantes reales de Shopify (conectadas al proveedor): opciones y valores.
                                    Solo como referencia: el tema las lee de Shopify.
{{PRODUCT_PACKS}}                 = Packs de unidades como VARIANTES REALES o «sin packs». Ejemplo actual:
                                    opción «Pack» = «1 unidad» · «2 unidades» · «3 unidades» (sección 10.11).
                                    Los precios se ponen en Shopify, nunca en el tema.
{{PRODUCT_HOW_TO_USE}}            = Pasos de uso reales (2-5).
{{PRODUCT_CARE}}                  = Limpieza, cuidados o mantenimiento, si aplica.
{{PRODUCT_WARNINGS}}              = Advertencias de seguridad o de uso, del envase o del proveedor.
{{PRODUCT_CERTIFICATIONS}}        = Solo las que tengan prueba documental. Si no, NO DISPONIBLE.

--- Imágenes ---
{{PRODUCT_IMAGES}}                = Lista de todas las imágenes entregadas (nombre de archivo y lo que muestra).
{{PRODUCT_HERO_IMAGE}}            = Imagen propuesta como principal: foto limpia de lo que recibe el cliente.
{{PRODUCT_LIFESTYLE_IMAGES}}      = Imágenes de uso o ambiente (si las hay).
{{PRODUCT_COMPARISON_IMAGES}}     = Antes/después o comparativas del proveedor. Se evalúan y, por defecto, se descartan.
{{PRODUCT_IMAGE_NOTES}}           = Qué se mejoró en cada imagen antes de entregarla (fondo, maquetación,
                                    textos) y qué NO se tocó (el producto).

--- Venta ---
{{PRODUCT_FAQ}}                   = 6-10 preguntas con respuesta verificable.
{{PRODUCT_CTA_LABEL}}             = Texto del botón de compra. Por defecto «Comprar {{PRODUCT_SHORT_NAME}}».
{{PRODUCT_PRICE_REFERENCE}}       = Precio y precio comparado en Shopify. SOLO referencia: el tema nunca lo escribe.
{{PRODUCT_TARGET_MARKET}}         = Mercado (actualmente España) y público.
{{SHIPPING_INFORMATION}}          = Zonas y condiciones de envío REALES configuradas en Shopify.
                                    Nunca se inventan plazos.
{{SHIPPING_ESTIMATE_TEXT}}        = Plazos para el bloque «GARELON Plazos de envío», redactados como estimación
                                    prudente a partir de los datos del proveedor (hoy: «Preparación estimada:
                                    1–3 días» · «Entrega estimada en España: aproximadamente 8–16 días»).
{{PRODUCT_SUPPLIER}}              = Proveedor/fulfillment actual y método de envío (hoy CJ Dropshipping ·
                                    CJPacket Euro Cosmetic Line). Dato interno: nunca se muestra al cliente.
{{ANNOUNCEMENT_TEXT}}             = Texto de la barra superior (actualmente «Envío disponible a toda España»).
{{PRODUCT_POLICY_IMPACT}}         = Respuestas a las preguntas de la sección 19: devoluciones, higiene,
                                    seguridad, garantía, edad, restricciones.

--- Claims ---
{{PRODUCT_ALLOWED_CLAIMS}}        = Afirmaciones permitidas, ya redactadas de forma prudente.
{{PRODUCT_FORBIDDEN_CLAIMS}}      = Afirmaciones del proveedor que NO se pueden usar.

--- Producto anterior (limpieza) ---
{{PREVIOUS_PRODUCT_NAME}}         = Producto que se retira (el primero fue el sérum de contorno de ojos).
{{PREVIOUS_PRODUCT_TERMS}}        = Términos que no deben quedar en el tema. Lista del sérum: anexo A.4.
{{PREVIOUS_PRODUCT_ASSETS}}       = Assets del producto anterior que hay que borrar (anexo A.3).

--- Otros ---
{{OTHER_RELEVANT_DATA}}           = Cualquier otro dato útil y verificado.
{{GIT_BRANCH}}                    = Rama donde Claude Code debe trabajar y subir los cambios.
```

---

## 2. Contexto del negocio

- **Marca:** GARELON, siempre. El dominio es el mismo. Cambiar de producto no crea una marca nueva.
- **Modelo:** tienda de un solo producto (ONE PRODUCT STORE). Los productos se validan con publicidad y, si uno no funciona, se sustituye por otro de cualquier categoría: cosmética, hogar, mascotas, gadget, accesorio, belleza, organización, bienestar…
- **Proveedor / fulfillment:** el proveedor actual, hoy **CJ Dropshipping** (hasta septiembre de 2026 era AutoDS). Se conecta a Shopify con su propia app: el tema no contiene código del proveedor y lo lee todo de Shopify (sección 15.5). El producto físico puede llevar la marca de su fabricante. En el sérum, el envase dice «Baafven».
- **GARELON es la tienda que comercializa el producto.** Por defecto no es el fabricante: nunca se afirma que lo fabrica, formula o desarrolla (regla R2).
- **Mercado:** España, en español de España («Añadir al carrito», tratamiento de tú).
- **Tráfico:** mayoritariamente móvil y desde anuncios. La home funciona a la vez como landing, página de marca y página de venta.
- **Flujo de trabajo:**
  1. Producto en el proveedor actual (hoy CJ Dropshipping), conectado a Shopify.
  2. Brief (`GARELON_PRODUCT_BRIEF_TEMPLATE.md`).
  3. ChatGPT adapta este documento y prepara las imágenes.
  4. Prompt final.
  5. Claude Code adapta el repositorio.
  6. Checklist (`GARELON_PRODUCT_MIGRATION_CHECKLIST.md`).
  7. Publicación.

---

## 3. Reglas permanentes (no negociables)

Ninguna instrucción posterior las anula, tampoco el prompt adaptado. Si una petición choca con una de ellas, no se ejecuta y se explica en el informe.

**Producto y claims**
- **R1 · Fidelidad.** El producto mostrado debe coincidir con el producto recibido. No se modifica, ni con IA ni con código:
  - la forma, el packaging, los colores, la etiqueta o los componentes;
  - la marca física, los materiales aparentes o los accesorios.

  No se pone «GARELON» sobre un producto que físicamente no lo lleva. Claude Code **no edita ni regenera imágenes**: solo las redimensiona o convierte de formato, sin recortar ni aplicar filtros.
- **R2 · GARELON no es el fabricante** salvo prueba. Prohibido: «Fabricado por GARELON», «Creado/Desarrollado por GARELON», «Nuestro laboratorio», «Fórmula GARELON». Fórmula por defecto: *«GARELON es la tienda desde la que lo comercializamos: el producto procede de un fabricante externo»* (texto real de la FAQ actual).
- **R3 · Claims prudentes.** Los textos exagerados del proveedor (CJ Dropshipping, AliExpress, AutoDS…) nunca se copian como claims de GARELON: se reformulan (sección 17) o se eliminan. No se inventan estudios, porcentajes, resultados, certificaciones, premios, recomendaciones profesionales ni pruebas clínicas. Tampoco se hacen claims médicos o terapéuticos.
- **R4 · Antes/después.** No se crean resultados falsos ni se alteran imágenes para exagerar. Los antes/después del proveedor se evalúan y se descartan por defecto: sin resultados documentados restan confianza. Así se hizo con IMAGEN 6 y 8 del sérum.
- **R5 · Reseñas.** Nunca se inventan: ni ⭐⭐⭐⭐⭐, ni «4,9/5», ni «más de X clientes», ni testimonios. Las estrellas solo aparecen si las aporta una app real de reseñas mediante un app block. El bloque `rating` de Dawn solo se muestra si existe el metafield `reviews.rating`.
- **R6 · Urgencia.** Sin «quedan 3», «20 personas viendo», cuentas atrás ni «oferta acaba en…» si no son datos reales. El stock se muestra solo como «En stock» o «Agotado», nunca con cifras (`garelon-stock`; bloque `inventory` con `inventory_threshold: 0` y `show_inventory_quantity: false`).
- **R7 · Descuentos y packs.** `compare_at_price` solo se muestra si existe en Shopify y es un precio anterior real: nunca se usa para fingir una rebaja (nada de «~~39,98 €~~ 35,00 €»). Los packs son **variantes reales con su propio precio** (p. ej. «2 unidades» a 35,00 €): es un precio real de variante, no un descuento ficticio. El ahorro que se muestra se calcula de forma transparente frente al precio real de la variante de 1 unidad × unidades del pack («Ahorra 4,98 €», «Ahorro calculado frente a comprar las unidades por separado»). Sin «Compra X y obtén Y», «segunda unidad» ni descuentos automáticos que se acumulen con el precio de los packs. Insignias solo objetivas («Mejor precio/unidad»), nunca «Más vendido» sin datos.

**Shopify, proveedor y compra**
- **R8 · Shopify y proveedor.** Nunca se hardcodea precio, precio comparado, inventario, disponibilidad, SKU, variantes ni IDs de variante: todo se lee del objeto `product` de Shopify. El proveedor/fulfillment actual (hoy CJ Dropshipping) se conecta a Shopify con su app; el tema no depende de él y no se toca su fulfillment, sincronización ni configuración. **Un pack es siempre UNA variante con cantidad 1**: nunca «1 unidad» × N ni «N unidades» × N (el proveedor enviaría otra cantidad).
- **R9 · Formulario de producto.** Se reutiliza el de Dawn (`snippets/buy-buttons.liquid` + `assets/product-form.js`), sin crear otro. Debe seguir funcionando con variantes (packs incluidos), cantidad, carrito AJAX, cart drawer y apps.
- **R10 · Carrito.** Se mantienen imagen, producto, variante, cantidad, eliminar, precio, subtotal y botón de pago. No se añaden productos automáticamente, seguros, casillas premarcadas ni upsells no pedidos.
- **R11 · Checkout.** No se modifica con hacks de CSS, JavaScript ni DOM. Lo que controla Shopify, como el orden de PayPal, Shop Pay, Apple Pay, Google Pay y tarjeta, se respeta. Solo se usan vías oficiales (ajustes de Pagos, apps de personalización de pagos).

**Marca, navegación y páginas**
- **R12 · Datos de empresa.** Nunca se inventan NIF/CIF, razón social, domicilio, teléfono ni email. Se usan los que existen en el Admin (políticas, información de contacto) o se dejan para que el dueño los complete.
- **R13 · Catálogo.** Mientras haya un solo producto no se muestra ningún Catálogo en la navegación pública. Las colecciones internas pueden existir. El catálogo solo se reintroduce cuando el dueño lo pida explícitamente (sección 28).
- **R14 · Contacto.** Hay una única página de contacto permanente, que no se recrea al cambiar de producto. Todo enlace de soporte apunta a ella mediante `snippets/garelon-url.liquid`.
- **R15 · Políticas.** Son independientes del producto. Se revisan solo si el nuevo producto las afecta (sección 19) y nunca se reescriben automáticamente.
- **R16 · Identidad.** Se conservan la marca, el logotipo, el isotipo, los colores, la tipografía, los botones, la cabecera, el pie, la barra superior, el responsive y la experiencia general (secciones 7 y 8). Se adapta la historia del producto, no el sistema de marca.

**Arquitectura y calidad**
- **R17 · Arquitectura OS 2.0.** Plantillas JSON, secciones, bloques, snippets y grupos de secciones. Nada de convertir la home en un archivo Liquid gigante con contenido fijo. El contenido va en ajustes editables desde el editor de temas.
- **R18 · Cabecera móvil.** El logo nunca queda tapado. Prioridad: 1) marca, 2) menú, 3) carrito, 4) búsqueda, 5) cuenta. La búsqueda y la cuenta viven dentro del menú en móvil (sección 11).
- **R19 · Un H1 por página, sin structured data duplicado** (sección 20).
- **R20 · No inventar pruebas.** No se afirma que algo funciona si no se ha podido comprobar (checkout real, proveedor/CJ, Admin, apps). Se dice qué se probó y qué no.

---

## 4. Prioridades

1. Reproducibilidad.
2. Mantener la identidad GARELON.
3. No romper Shopify.
4. No romper el proveedor/fulfillment (hoy CJ Dropshipping) ni el mapping de variantes.
5. Fidelidad del producto.
6. UX móvil.
7. Conversión.
8. Rendimiento.
9. Modularidad.
10. Facilidad para cambiar de producto.

La decoración va siempre la última.

---

## 5. Qué se mantiene, qué cambia y qué se decide

### 5.A · Elementos permanentes (se mantienen siempre)

| Elemento | Dónde vive |
|---|---|
| Nombre **GARELON** y dominio | Admin (nombre de la tienda, dominio) |
| Logotipo, isotipo, wordmark, favicon | `assets/garelon-logo-240.webp`, `garelon-logo-480.webp`, `garelon-isotipo-96.webp`, `garelon-wordmark-480.webp`, `garelon-favicon-32.png`, `garelon-apple-touch-180.png`; originales en `referencias/logo-garelon-completo.png` y `referencias/isotipo-garelon.png` |
| Colores (5 esquemas) y tokens | `config/settings_data.json` (`color_schemes`), `assets/garelon.css` (`:root`) |
| Tipografía (Playfair Display + Inter) y escala | `config/settings_data.json` (`type_header_font`, `type_body_font`, `heading_scale`, `body_scale`), `assets/garelon.css` |
| Botones, radios, bordes, sombras | `config/settings_data.json` (`buttons_*`, `*_radius`…), `assets/garelon.css` |
| Cabecera `[isotipo] GARELON` enlazada a la home y su versión móvil | `sections/header.liquid`, `snippets/garelon-logo-fallback.liquid`, `snippets/header-drawer.liquid`, `assets/garelon.css` |
| Navegación mínima (Inicio · anclas de la home · Contacto) | `snippets/garelon-nav.liquid`, ajustes `nav_*` de la cabecera |
| Barra superior configurable | `sections/announcement-bar.liquid`, `sections/header-group.json`, `snippets/garelon-flag-es.liquid` |
| Pie: marca, bloque Ayuda, enlaces legales en orden fijo | `sections/footer.liquid`, `sections/footer-group.json` |
| Página de contacto única | Admin (página) + `templates/page.contact.json` + `snippets/garelon-url.liquid` |
| Políticas legales | Admin → Configuración → Políticas; página de cookies |
| Formulario de producto, carrito, cart drawer, checkout de Shopify | Archivos de Dawn (sección 23) |
| Sistema de imágenes responsive | `snippets/garelon-image.liquid`, `garelon-srcset.liquid`, `garelon-fallback-image.liquid` |
| Estructura de la home como landing (orden y ritmo) | `templates/index.json` (sección 9) |
| Textos de interfaz en español de España | `locales/es.json` |
| Reglas R1-R20 | Este documento |

### 5.B · Elementos variables (cambian con cada producto)

| Elemento | Dónde vive |
|---|---|
| Producto Shopify: título, descripción, multimedia, variantes (packs), precio, SEO del producto | Admin (lo conecta el proveedor actual, hoy CJ Dropshipping) |
| Textos de la home: portada, características, beneficios, diferencial, composición, uso, compra, FAQ, cierre | `templates/index.json` |
| Textos de la ficha de producto: antetítulo, subtítulo, destacados, pestañas, beneficios, uso, FAQ | `templates/product.json` |
| FAQ de la página de preguntas frecuentes | `templates/page.faq.json` |
| Texto y botón de la 404 | `templates/404.json` |
| Imágenes del producto (assets temporales) | `assets/garelon-img*-*.webp` (convención futura: sección 18.6) |
| Claves, textos alternativos y galería de imágenes del tema | `snippets/garelon-fallback-image.liquid`, `snippets/garelon-gallery.liquid` |
| Textos del producto escritos en el código (alt, valores por defecto, presets) | Lista exacta en la sección 16.3 |
| Descripción de marca del pie («Cuidado diario para tu mirada.») | `config/settings_data.json` → `brand_description` |
| Metadatos SEO de la home, imagen para redes y redirección del producto anterior | Admin → Tienda online → Preferencias; Admin → Navegación → Redirecciones URL |
| Iconos específicos del producto | `snippets/garelon-icon.liquid` (se añaden, sin borrar los genéricos) |

### 5.C · Elementos que se deciden según el producto

- Qué imágenes se usan, en qué orden y en qué sección (sección 18).
- Qué secciones de la home se activan (sección 9.2):
  - si existe la sección de característica diferencial;
  - si la sección de composición es de ingredientes, materiales o especificaciones;
  - cuántos pasos de uso hay (2-5);
  - si la llamada final lleva imagen.
- Las etiquetas y anclas de la navegación (p. ej. «Ingredientes» → «Materiales» o «Especificaciones»).
- Los iconos de la portada, las características y los beneficios.
- Si la zona de compra usa la galería del tema (`garelon_gallery`) o la multimedia de Shopify. Si hay variantes con imagen propia, conviene la multimedia de Shopify.
- Si el producto se vende en packs: variantes reales «1 unidad / 2 unidades / 3 unidades» y bloque **GARELON Packs (variantes)** en la home y en la ficha (sección 10.11). Sin packs, el mismo bloque muestra el selector de variantes estándar, o se quita.
- Los textos del bloque **GARELON Plazos de envío** según los plazos reales del proveedor (sección 10.12).
- Qué preguntas lleva la FAQ y qué advertencias de uso aparecen.
- Si alguna política necesita revisión (sección 19).

### 5.D · Nunca se modifica

- Los JavaScript de Dawn: `global.js`, `pubsub.js`, `constants.js`, `product-info.js`, `product-form.js`, `cart.js`, `cart-drawer.js`, `cart-notification.js`, `media-gallery.js`, `details-modal.js`, `details-disclosure.js`, etc.
- `snippets/buy-buttons.liquid`, `snippets/cart-drawer.liquid` (salvo el enlace «Seguir comprando» → `routes.root_url`, ya hecho), `sections/main-cart-items.liquid`, `sections/main-cart-footer.liquid`.
- El checkout, los métodos de pago y el fulfillment del proveedor (hoy CJ Dropshipping).
- La lógica de enlaces de `snippets/garelon-url.liquid` y el orden legal del pie.
- Las reglas CSS de la cabecera móvil en `assets/garelon.css` (bloque «Cabecera móvil (< 750 px)»).
- Los esquemas de color, las fuentes y los ajustes de botones, salvo que el dueño lo pida.
- Los assets de marca `garelon-logo-*`, `garelon-isotipo-96`, `garelon-wordmark-480`, `garelon-favicon-32` y `garelon-apple-touch-180`.
- `layout/theme.liquid`, salvo que haga falta algo imprescindible y justificado.

### 5.E · Comprobaciones después de cada cambio de producto

Están en `GARELON_PRODUCT_MIGRATION_CHECKLIST.md`, y el resumen en la sección 26.

---

## 6. CURRENT THEME MAP

### 6.1 Base

| Dato | Valor real |
|---|---|
| Tema base | **Dawn 16.0.0** (Shopify). Importado sin cambios en el commit `f7ba80a`; la capa GARELON va encima. |
| Nombre del tema | `GARELON (Dawn)` (`config/settings_schema.json` → `theme_info.theme_name`) |
| Arquitectura | Online Store 2.0: plantillas JSON, secciones con schema, bloques, snippets y grupos de secciones (cabecera y pie) |
| Capa GARELON | Todo archivo con prefijo `garelon-` más cambios mínimos, comentados con `GARELON:`, en archivos de Dawn (6.6) |
| Dependencias externas | Ninguna: sin librerías, CDNs ni Google Fonts. Las fuentes salen de la biblioteca de Shopify. |
| Cómo se instala | ZIP del tema: Admin → Tienda online → Temas → Añadir tema → Subir archivo zip → Vista previa → Publicar. También se puede con la integración de GitHub. |
| Referencia visual de assets | `referencias/` (originales en PNG; no forma parte del tema publicado) |

### 6.2 Layout

| Archivo | Función |
|---|---|
| `layout/theme.liquid` | Estructura HTML de todas las páginas: fuentes y variables CSS de Dawn. Cambios GARELON: `theme-color` del esquema 1; `noindex, follow` en colecciones, lista de colecciones y búsqueda; favicon y apple-touch de respaldo; carga de `garelon.css` justo después de `base.css`. |
| `layout/password.liquid` | Página de contraseña de Dawn (sin cambios) |

### 6.3 Secciones GARELON (`sections/garelon-*.liquid`)

| Archivo | Nombre en el editor | Función |
|---|---|---|
| `sections/garelon-hero.liquid` | GARELON Portada | Primera pantalla: imagen principal (carga inmediata), antetítulo, H1, texto, precio real, botón a `/#comprar`, botón secundario y hasta 3 micro-beneficios |
| `sections/garelon-trust-bar.liquid` | GARELON Confianza | Hasta 4 elementos con icono: características en la home, servicio (pago, atención, envío, devoluciones) en la ficha |
| `sections/garelon-benefits.liquid` | GARELON Beneficios | Encabezado + texto que plantea el problema + hasta 6 tarjetas de beneficio con icono |
| `sections/garelon-image-text.liquid` | GARELON Imagen y texto | Imagen + texto a dos columnas. Hoy muestra la característica diferencial (el roller). Reutilizable para lifestyle, «qué incluye», medidas… |
| `sections/garelon-ingredients.liquid` | GARELON Ingredientes | Imagen + lista de hasta 12 elementos (nombre, INCI o línea técnica, descripción) + nota del proveedor. Reutilizable para materiales o especificaciones. |
| `sections/garelon-how-to-use.liquid` | GARELON Cómo usarlo | Imagen + lista de hasta 5 pasos numerados + nota de precaución |
| `sections/garelon-faq.liquid` | GARELON FAQ | Acordeón accesible (`details`/`summary`) de hasta 20 preguntas; resuelve los enlaces de contacto y de políticas |
| `sections/garelon-final-cta.liquid` | GARELON Llamada final | Cierre centrado: isotipo, H2, texto, precio real y botón a `/#comprar`; imagen opcional |
| `sections/garelon-sticky-atc.liquid` | GARELON Compra fija | Barra fija de compra en móvil, solo en la plantilla de producto. Pulsa el botón real del formulario de Dawn. |

### 6.4 Snippets GARELON (`snippets/garelon-*.liquid`)

| Archivo | Función |
|---|---|
| `snippets/garelon-image.liquid` | Imagen responsive. Con imagen del editor: `image_url` + `image_tag` (anchos 360-1800). Sin ella: asset del tema con `srcset` 480/720/1080. `eager` = carga inmediata + `fetchpriority="high"`; el resto `loading="lazy"` + `decoding="async"`. El marcador gris solo aparece en el editor. |
| `snippets/garelon-fallback-image.liquid` | **Catálogo de imágenes del producto dentro del tema:** convierte una clave (`img01-producto`…) en el nombre del asset y su texto alternativo. **Depende del producto.** |
| `snippets/garelon-srcset.liquid` | Solo el valor `srcset`, para el `<source>` de `<picture>` (portada con imagen distinta en móvil) |
| `snippets/garelon-gallery.liquid` | Galería de la zona de compra de la home. Usa el carrusel de Dawn (`slider-component`), con flechas y contador. **La lista de claves depende del producto.** |
| `snippets/garelon-stock.liquid` | «En stock» o «Agotado», solo si Shopify controla el inventario, sin cifras. El id `Inventory-<sección>` lo actualiza `product-info.js` de Dawn. |
| `snippets/garelon-price-inline.liquid` | Precio compacto real: «Desde» si varía entre variantes, tachado solo si `compare_at_price > price`, «Agotado» |
| `snippets/garelon-nav.liquid` | Navegación de la tienda de un producto: Inicio, anclas opcionales de la home y Contacto. Versiones `inline` (escritorio) y `drawer` (móvil). Pone `aria-current` en la página actual. |
| `snippets/garelon-url.liquid` | Resuelve las URL reales de Contacto, Devoluciones, Envíos y Cookies (`type`, `url` o `html`) |
| `snippets/garelon-logo-fallback.liquid` | Logo desde los assets si no hay uno subido: `wordmark` (cabecera), `stacked` (pie), `isotype` (isotipo a la izquierda del nombre) |
| `snippets/garelon-icon.liquid` | Iconos SVG lineales en línea (`currentColor`, trazo 1.3) |
| `snippets/garelon-flag-es.liquid` | Bandera de España en SVG 3:2 para la barra superior (decorativa, `aria-hidden`) |
| `snippets/garelon-packs.liquid` | **Selector de packs sobre variantes reales**: pinta el `<variant-selects>` de Dawn con una tarjeta por variante (unidades, precio, precio por unidad, ahorro e insignia calculados con `variant.price`). Si el producto no tiene packs reconocibles, pinta el selector estándar de Dawn. Sin JS propio. |
| `snippets/garelon-shipping.liquid` | Plazos de envío junto a la compra (bloque `garelon_shipping`): texto editable y prudente + enlace a la política de envío real. |

### 6.5 Assets GARELON (`assets/`)

| Archivo | Tipo | Función |
|---|---|---|
| `garelon.css` (29 KB) | Permanente | Toda la capa visual GARELON: tokens, botones, cabecera móvil, secciones, galería, packs, plazos de envío, compra fija, políticas, movimiento reducido |
| `garelon.js` (4,5 KB) | Permanente | `<garelon-sticky-atc>` (muestra la variante/pack elegido y su precio). Solo se carga en la ficha de producto. Los packs no usan JS propio. |
| `garelon-nav.js` (0,8 KB) | Permanente | Cierra el menú móvil al pulsar un ancla de la misma página. Se carga con `defer` desde la cabecera. |
| `garelon-logo-240.webp`, `garelon-logo-480.webp` | Marca · permanente | Logo apilado (isotipo + GARELON), 480×425. Pie de página. |
| `garelon-wordmark-480.webp` | Marca · permanente | Nombre GARELON, 480×72. Cabecera. |
| `garelon-isotipo-96.webp` | Marca · permanente | Isotipo, 96×104. Cabecera y llamada final. |
| `garelon-favicon-32.png`, `garelon-apple-touch-180.png` | Marca · permanente | Favicon e icono de iOS de respaldo |
| `garelon-img01-producto-{480,720,1080}.webp` | Producto · temporal | IMAGEN 1: producto real limpio |
| `garelon-img10-presentacion-{…}.webp` | Producto · temporal | IMAGEN 10: presentación y beneficios |
| `garelon-img07-roller-{…}.webp` | Producto · temporal | IMAGEN 7: característica diferencial |
| `garelon-img05-ingredientes-{…}.webp` | Producto · temporal | IMAGEN 5: ingredientes |
| `garelon-img04-modo-de-uso-{…}.webp` | Producto · temporal | IMAGEN 4: modo de uso (clave `img04-uso`) |
| `garelon-img09-tamano-{…}.webp` | Producto · temporal | IMAGEN 9: medidas |

Todos los `garelon-img*` son cuadrados (1080×1080, 720×720 y 480×480) y pesan entre 37 y 180 KB. El resto de `assets/` es de Dawn (JS, CSS de componentes, iconos `icon-*.svg`).

### 6.6 Archivos de Dawn modificados (cambios mínimos, marcados `GARELON:`)

| Archivo | Cambio |
|---|---|
| `sections/header.liquid` | Isotipo + logo en un solo enlace a la home (`show_isotype`). El logo ya no es el H1 de la home. Navegación GARELON (`nav_source`, `nav_show_how`, `nav_show_ingredients`, `nav_show_faq`) y `hide_catalog_links`. `has_nav` activa `header--has-menu` y el cajón sin menú del Admin. Carga `garelon-nav.js`. |
| `snippets/header-drawer.liquid` | Menú móvil: `garelon-nav` (drawer) o menú de Shopify sin catálogo ni colecciones. Añade `ul.garelon-drawer-utility` con Búsqueda y Cuenta (Iniciar sesión). |
| `snippets/header-dropdown-menu.liquid`, `snippets/header-mega-menu.liquid` | Omiten los enlaces al catálogo y a colecciones en todos los niveles cuando `hide_catalog_links` está activo. Resuelven las URL con `garelon-url`. |
| `sections/announcement-bar.liquid` | Ajuste de bloque `show_flag_es`: añade la bandera SVG al final del texto |
| `sections/footer.liquid` | Bloque `garelon_help` (Ayuda). Logo apilado de respaldo. Enlaces legales en orden fijo y solo si tienen contenido. Menús del pie resueltos con `garelon-url`. |
| `sections/featured-product.liquid` | Sin producto elegido usa `collections.all.products.first`. Ajustes `garelon_gallery`, `garelon_anchor` y `garelon_mobile_info_first` (en móvil, formulario antes que la galería). Bloques `garelon_stock`, `garelon_packs` y `garelon_shipping`. El bloque `variant_picker` no se pinta si hay bloque de packs (un solo `<variant-selects>`). Clase `g-anchor` en la sección. Sin modal de multimedia cuando se usa la galería GARELON. |
| `sections/main-product.liquid` | Bloques `garelon_packs` (packs = variantes reales) y `garelon_shipping`. El bloque `variant_picker` no se pinta si hay bloque de packs. Las pestañas (`collapsible_tab`) resuelven enlaces con `garelon-url`. |
| `sections/main-404.liquid`, `sections/main-cart-items.liquid` (2 enlaces), `snippets/cart-drawer.liquid` | «Seguir comprando» → `routes.root_url` en vez del catálogo |
| `config/settings_schema.json` | Nombre del tema y grupo **GARELON · Enlaces** (`garelon_contact_page`, `garelon_refund_page`, `garelon_shipping_page`, `garelon_cookies_page`) |
| `config/settings_data.json` | Colores, fuentes, botones, radios, carrito en cajón, descripción de marca |
| `locales/es.json` | Español de España: «Añadir al carrito», «Artículo añadido…», «En stock», «Pocas unidades», «Finalizar compra» |
| `templates/page.contact.json` | Margen superior del formulario (16 px) |

### 6.7 Plantillas (`templates/`)

| Archivo | Página | Contenido |
|---|---|---|
| `templates/index.json` | **Home / landing** | 9 secciones (sección 9.1) |
| `templates/product.json` | Ficha de producto | `main-product` + confianza (servicio) + beneficios + cómo usarlo + FAQ + compra fija |
| `templates/page.contact.json` | Contacto | `main-page` + `contact-form` de Dawn |
| `templates/page.faq.json` | Página de preguntas frecuentes (handle `preguntas-frecuentes`, plantilla `faq`) | `main-page` + `garelon-faq` con las mismas 8 preguntas que la home |
| `templates/404.json` | 404 | `main-404` + `garelon-final-cta` (IMAGEN 1, «Ver el sérum») |
| `templates/page.json`, `cart.json`, `collection.json`, `list-collections.json`, `search.json`, `blog.json`, `article.json`, `password.json`, `gift_card.liquid` | Dawn | Sin contenido GARELON. Colecciones, lista de colecciones y búsqueda llevan `noindex`. |

### 6.8 Grupos de secciones

| Archivo | Contenido |
|---|---|
| `sections/header-group.json` | `announcement-bar` (esquema 3, 1 bloque: «Envío disponible a toda España» + `show_flag_es: true`) y `header` (esquema 1, `logo_position: middle-left`, `mobile_logo_position: center`, `menu_type_desktop: dropdown`, `sticky_header_type: on-scroll-up`, `show_line_separator: true`, márgenes 12/12, `nav_source: garelon`, `nav_show_how: false`, `nav_show_ingredients: true`, `nav_show_faq: true`, `hide_catalog_links: true`, `show_isotype: true`) |
| `sections/footer-group.json` | `footer` (esquema 2, bloques `brand` y `ayuda`, `newsletter_enable: false`, `payment_enable: true`, `show_policy: true`, márgenes 48/32) |

### 6.9 Otras carpetas y archivos

- **`locales/`:** Dawn con los ajustes de `es.json` (6.6). Las cadenas de `*.schema.json` son de Dawn: si aparece «contorno» en ellas, no es un resto del sérum.
- **`referencias/`:** originales del producto (`IMAGEN 1.png` … `IMAGEN 10.png`, 1254×1254) y de la marca (`logo-garelon-completo.png`, `isotipo-garelon.png`).
- **Raíz:** documentación de las rondas del sérum (`GARELON-GUIA.md`, `GARELON-CAMBIOS-RONDA-2.md`, `GARELON-CAMBIOS-RONDA-3.md`, `GARELON-COPIAR-PEGAR.md`, `GARELON-POLITICA-DEVOLUCIONES.md`) y del cambio de proveedor y packs (`GARELON-CAMBIOS-CJ-PACKS.md`). Son históricos y no forman parte del tema.
- **`docs/garelon/`:** esta plantilla maestra, el brief y la checklist.

---

## 7. Sistema de diseño GARELON (valores reales del código)

### 7.1 Esquemas de color (`config/settings_data.json` → `color_schemes`)

| Esquema | Fondo | Texto | Botón | Texto del botón | Botón secundario | Uso actual |
|---|---|---|---|---|---|---|
| `scheme-1` | `#F8F4EC` crema | `#1B1714` tinta | `#1B1714` | `#FFFFFF` | `#1B1714` | Fondo principal: cabecera, portada, características, ingredientes, compra, cierre, carrito, ficha |
| `scheme-2` | `#EFE6D7` arena | `#1B1714` | `#1B1714` | `#FFFFFF` | `#1B1714` | Secciones alternas: beneficios, diferencial, cómo usarlo, FAQ, pie, 404 |
| `scheme-3` | `#1B1714` tinta | `#F8F4EC` | `#D2B06A` dorado claro | `#1B1714` | `#F8F4EC` | Solo la barra superior |
| `scheme-4` | `#FFFFFF` | `#1B1714` | `#1B1714` | `#FFFFFF` | `#1B1714` | Tarjetas de Dawn y la barra de compra fija |
| `scheme-5` | `#B88A3B` dorado | `#1B1714` | `#1B1714` | `#FFFFFF` | `#1B1714` | Definido, sin uso. No se usa como fondo de sección. |

Sombra en todos: `#1B1714`, sin degradados. Además: `card_color_scheme: scheme-4`, `cart_color_scheme: scheme-1`, `sale_badge_color_scheme: scheme-3` y `sold_out_badge_color_scheme: scheme-2`. `<meta name="theme-color">` usa el fondo del esquema 1.

### 7.2 Tokens CSS GARELON (`assets/garelon.css` → `:root`)

```css
--g-gold: #b88a3b;         /* dorado de marca: líneas, puntos, filetes */
--g-gold-light: #d2b06a;   /* dorado claro: acentos sobre fondo oscuro */
--g-gold-text: #7a5a24;    /* dorado accesible para texto pequeño sobre crema (contraste AA) */
--g-icon: #9a7433;         /* trazo de iconos */
--g-ink: #1b1714;          /* tinta */
--g-accent-text: var(--g-gold-text);
--g-line: rgba(184, 138, 59, 0.32);   /* líneas finas doradas */
--g-radius: 6px;
```

Dentro de `.color-scheme-3`: `--g-accent-text: var(--g-gold-light)`, `--g-icon: var(--g-gold-light)`, `--g-line: rgba(210, 176, 106, 0.4)`.

Por sección: `--g-pt` y `--g-pb` (márgenes superior e inferior, desde los ajustes `padding_top`/`padding_bottom`).

### 7.3 Variables de Dawn usadas por la capa GARELON

Las genera `layout/theme.liquid` a partir de los ajustes. **No se escriben a mano.**

- **Por esquema de color:** `--color-background`, `--color-foreground`, `--color-button`, `--color-button-text`, `--color-secondary-button-text`, `--color-link`, `--color-shadow`.
- **Tipografía y ancho:** `--font-heading-family`, `--font-body-family`, `--page-width` (120 rem = 1200 px).
- `html { font-size: 62.5% }`: **1 rem = 10 px**.

### 7.4 Tipografía

| Elemento | Valor |
|---|---|
| Títulos | **Playfair Display 400** (`type_header_font: playfair_display_n4`), `heading_scale: 100` |
| Texto | **Inter 400** (`type_body_font: inter_n4`), `body_scale: 100` |
| Cuerpo (Dawn) | 15 px en móvil, 16 px desde 750 px; `letter-spacing: 0.06rem` |
| Antetítulo `.g-eyebrow` | 11,5 px, peso 500, `letter-spacing: 0.24em`, MAYÚSCULAS, color `--g-accent-text`. Centrado lleva filetes dorados de 24 px a los lados. |
| H1 portada `.g-hero__heading` | `clamp(3rem, 2.4rem + 2.6vw, 5.2rem)`: 30-52 px, `line-height: 1.1` |
| H2 de sección `.g-h2` | `clamp(2.5rem, 6.4vw, 3.8rem)`: 25-38 px, `line-height: 1.15` |
| H3 `.g-h3` | 18,5 px, `line-height: 1.3` |
| Entradilla `.g-lead` / texto `.g-rte` | 15,5 px en móvil, 17 px desde 750 px, `line-height: 1.65`, color al 80 % |
| Texto de portada `.g-hero__text` | 15,5 px en móvil, 18 px desde 750 px, máximo 52ch |
| Texto de tarjeta / paso | 14,5 px, color al 78 % |
| Nota `.g-note` | 12,5 px, color al 68 % |
| Número de paso `.g-steps__number` | Fuente de títulos, 15 px, `letter-spacing: 0.14em`, dorado |
| Pregunta de la FAQ | Fuente de texto, 16 px, peso 500 |
| Precio `.g-price` | 19 px, peso 500; tachado 15 px al 60 % |
| Título de la ficha de producto | `clamp(2.4rem, 5.6vw, 3.4rem)` |

### 7.5 Botones

- **Forma:** Dawn con `buttons_radius: 4`, `buttons_border_thickness: 1`, `buttons_border_opacity: 100`, `buttons_shadow_opacity: 0`.
- **GARELON (`garelon.css`):**
  - texto 13 px, peso 500, `letter-spacing: 0.12em`, MAYÚSCULAS;
  - `min-height: 5rem` (50 px);
  - transición de color de 0,2 s.
- **Hover:** el principal pasa a `rgba(var(--color-button), 0.88)`; el secundario, a un fondo `rgba(var(--color-foreground), 0.04)`.
- **Estilos:** primario tinta sobre crema, con texto blanco; secundario con contorno tinta.
- **Portada en móvil:** los botones ocupan el 100 % del ancho; desde 750 px, ancho automático.
- **Barra de compra fija:** 46 px de alto y 110 px de ancho mínimo.

### 7.6 Radios, bordes y sombras

| Elemento | Valor |
|---|---|
| Botones, campos, píldoras de variante, insignias | 4 px |
| Tarjetas, contenedores de texto, multimedia, ventanas emergentes | 6 px (`--g-radius`, `card_corner_radius`, `media_radius`, `text_boxes_radius`, `popup_corner_radius`) |
| Tarjeta GARELON `.g-card` | Borde de 1 px `rgba(tinta, 0.08)`, fondo `rgba(tinta, 0.025)`, radio 6 px, **sin sombra** |
| Tarjeta de pack `.g-pack` | Borde de 1 px `rgba(tinta, 0.2)`, fondo blanco al 45 %, radio 6 px, mínimo 64 px de alto. **Seleccionada:** borde tinta de 2 px, fondo blanco al 92 % y radio lleno. Ahorro en `--g-gold-text`. Insignia: fondo tinta con texto dorado claro (`--g-gold-light`), 10 px en mayúsculas, sobre el borde superior. Agotada: borde discontinuo y texto al 50 %. |
| Caja de plazos `.g-ship` | Borde de 1 px `--g-line`, fondo `rgba(tinta, 0.02)`, radio 6 px, icono de camión en `--g-icon` |
| Líneas | 1 px `--g-line` (dorado al 32 %) en la barra de características, la FAQ y los pasos |
| Sombras | Ninguna, salvo la barra de compra fija (`0 -0.6rem 2rem rgba(27,23,20,.06)`) y las ventanas emergentes de Dawn (opacidad del 5 %) |
| Imagen en arco / círculo (opcional) | Arco `999px 999px 6px 6px`; círculo con doble anillo dorado |

### 7.7 Espaciado y anchos

| Elemento | Valor |
|---|---|
| Ancho máximo de página | 1200 px (`page_width: 1200`). Margen lateral de 15 px en móvil y 50 px desde 750 px. |
| Margen de sección | Ajuste `padding_top`/`padding_bottom`, por defecto 56 px. En móvil se multiplica por 0,65 (56 → ~36 px). `spacing_sections: 0`. |
| Rejilla de Dawn | `spacing_grid_horizontal: 8`, `spacing_grid_vertical: 8` |
| Separación bajo el encabezado de sección | 2,8 rem en móvil, 4 rem desde 750 px |
| Separación entre columnas (imagen/texto) | 2,8 rem en móvil, 6 rem desde 750 px |
| Ancho máximo de la imagen en secciones divididas | 52 rem (520 px) |
| Ancho máximo del texto | Divididas 54 rem; FAQ 82 rem; cierre 56 rem; entradilla centrada 60ch |
| Anclas | `scroll-margin-top: 7.2rem`, para que la cabecera fija no tape el título |

### 7.8 Puntos de corte

- **< 750 px:** móvil, una columna. Aquí aplican la cabecera móvil GARELON y los márgenes al 65 %.
- **750-989 px:** tableta. Portada, imagen y texto, pasos y cierre pasan a 2 columnas; la cabecera sigue con icono de menú.
- **≥ 990 px:** escritorio. Menú en línea; las características en una fila; beneficios e ingredientes en rejilla automática.
- **Especial:** `(max-width: 749px) and (max-height: 700px)` limita la imagen de la portada a 26vh.
- **Anchos que se prueban:** 320, 360, 375, 390, 430, 768, 1024 y 1440 px.

### 7.9 Iconos

- **Estilo:** SVG lineal 24×24, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.3"`, extremos y uniones redondeados. Color `--g-icon` (#9A7433), tamaño 2 rem (2,2 rem en beneficios, dentro de un círculo de 4,4 rem con borde `--g-line`).
- **Disponibles** (`snippets/garelon-icon.liquid`): `eye`, `eye-under`, `drop`, `lines`, `roller`, `leaf`, `steps`, `sparkle`, `lock`, `chat`, `truck`, `return`, `bottle`, `check`, `none`.
- **Genéricos** (sirven para cualquier producto): `lock`, `chat`, `truck`, `return`, `check`, `sparkle`, `leaf`, `drop`, `steps`.
- **Propios del sérum:** `eye`, `eye-under`, `lines`, `roller`, `bottle`.
- **Iconos nuevos:** se añaden como nuevo `when` en el snippet y como opción en el schema de las secciones que lo usen (portada, confianza, beneficios), con el mismo estilo de trazo. No se usan emojis, packs de iconos externos ni iconos rellenos. Los iconos de Dawn (`icon-*.svg`) solo se usan dentro de los bloques de Dawn (destacados `icon-with-text`, pestañas).

### 7.10 Tratamiento de imágenes

- **Sin filtros, sin recortes y sin superposiciones de color.** La imagen se muestra entera: `object-fit: contain` en la portada y en la compra. Tiene radio de 6 px en escritorio y va de borde a borde, sin radio, en la galería móvil.
- **Portada:** en móvil, altura máxima de 34vh (26vh en pantallas bajas); en escritorio, 72vh.
- **Secciones divididas:** fondo `rgba(tinta, 0.04)` tras la imagen. «Arco» y «Círculo» recortan: úsalos solo con fotos sin texto.
- **Formato:** todas las imágenes del producto son cuadradas (1:1), en WebP 480/720/1080.

### 7.11 Movimiento

- Sin animaciones al hacer scroll (`animations_reveal_on_scroll: false`). Hover por defecto de Dawn.
- **Transiciones cortas:** botones 0,2 s, compra fija 0,25 s, flecha de la Ayuda y aparición de las respuestas de la FAQ.
- **`prefers-reduced-motion: reduce`:** desactiva todas las transiciones de la capa GARELON.

---

## 8. Decisiones visuales a preservar

Inferidas del código y de las medidas del render. Son el «estilo GARELON»: una migración **no** debe convertir la tienda en otra distinta.

| Decisión | Cómo es hoy | Regla para futuros productos |
|---|---|---|
| **Estilo** | Premium sereno y editorial: crema/arena, tinta y dorado como acento; serif en títulos, sans en texto; mucho aire | Se mantiene para cualquier categoría, también gadgets o mascotas |
| **Densidad** | 1 idea por sección. Encabezado (antetítulo + H2 + ≤ 1 entradilla) + una lista, tarjetas o imagen. 9 secciones en la home. | 8-11 secciones. No añadir secciones sin contenido o imagen fuerte. |
| **Portada** | Móvil: imagen ≤ 34vh → marca → H1 (6 palabras) → 1 frase → precio → CTA a ancho completo → secundario → 3 micro-beneficios. Precio y CTA en la primera pantalla a 360-430 px. Escritorio: 2 columnas 1:1, imagen a la derecha. | Igual. El H1 cuenta el beneficio, no el nombre técnico. |
| **Texto/imagen** | Divididas 1:1. Imagen ≤ 520 px. En móvil, la imagen va antes que el texto. | Igual |
| **CTAs** | 3 puntos de compra en la home: portada → `#comprar`, formulario real con packs en `#comprar` (justo después de la portada), llamada final → `#comprar`. Más 1 secundario informativo («Cómo se usa»). La sección del diferencial no lleva botón. | Máximo 3 CTAs de compra. Nada de botones en cada sección. |
| **Dorado** | Solo acento: antetítulos (dorado oscuro accesible), filetes de 24 px, líneas al 32 %, trazo de iconos, puntos de ingredientes, números de paso, botón de la barra oscura | Nunca fondos dorados de sección ni texto dorado largo |
| **Alternancia de fondos** | Crema / arena para separar secciones sin líneas; tinta solo en la barra superior. Orden actual: 1-2-1-2-2-1-2-2-1 (portada, compra, características … cierre). | Mantener la alternancia. Dos seguidas con el mismo esquema, como mucho. |
| **Espacio en blanco** | 56 px por sección en escritorio (~36 px en móvil). 1200 px de ancho. Encabezados centrados con 60ch. | Igual |
| **Tarjetas** | Borde casi invisible, fondo muy sutil, radio 6 px, sin sombra, icono en círculo con línea dorada | Igual |
| **Longitud del copy** | Frases cortas y prudentes (sección 17.3). Ni párrafos largos ni listas enormes. | Igual |
| **Composición móvil** | Una columna. Características en 2×2. Beneficios en lista con el icono a la izquierda. Ingredientes en 2 columnas. Pasos apilados. FAQ a ancho completo. Galería deslizable de borde a borde. | Igual |
| **Cabecera** | 56 px de alto en móvil. Menú · [isotipo GARELON] · carrito. Barra superior de una línea (38 px). | Igual (R18) |
| **Tono visual de las imágenes** | Fotos reales del producto e infografías limpias del proveedor. Coherencia conseguida **eligiendo** imágenes, no con filtros. | Igual |

**No es una copia rígida.** Cambian con cada producto la historia, el orden fino de secciones intermedias, los iconos, el número de beneficios, pasos y preguntas, las etiquetas de la navegación, qué imágenes se usan y si hay sección de diferencial o de lifestyle. Lo permanente es el sistema de marca y la estructura de venta: portada → confianza → explicación → compra → dudas → cierre.

---

## 9. La home como landing

### 9.1 Estructura actual (`templates/index.json`, orden real)

Antes de la home están los grupos: **barra superior** (esquema 3) y **cabecera** (esquema 1). Después, el **pie** (esquema 2).

| # | Id en `index.json` | Tipo de sección | Esquema | Ancla | Contenido actual (sérum) | Imagen | Márgenes |
|---|---|---|---|---|---|---|---|
| 1 | `hero` | `garelon-hero` | 1 | `inicio` | Antetítulo «GARELON»; **H1** «Una mirada con aspecto más descansado»; 1 frase qué es; precio («A partir de 19,99 €» si varía entre packs); «Comprar el sérum» → `/#comprar`; «Cómo se usa» → `/#como-usarlo`; puntos: Aplicador roller · 10 ml · Rutina sencilla | IMAGEN 1 (producto limpio), carga inmediata | 24 / 32 |
| 2 | `product_cta` | `featured-product` (Dawn) | **2** | `comprar` | **Compra justo después de la portada**: antetítulo «El sérum», título del producto (H2), precio, **packs** (`garelon_packs`: «Elige tu pack»), botones de compra con pago dinámico, stock y **plazos de envío** (`garelon_shipping`). En móvil, formulario antes que la galería (`garelon_mobile_info_first`). Sin selector de cantidad ni subtítulo. | Galería del tema: IMAGEN 1 → 10 → 7 → 5 → 4 → 9 | 40 / 56 |
| 3 | `trust` | `garelon-trust-bar` | 1 | — | 4 características: Aplicación precisa · Roller metálico · Rutina en 3 pasos · Fórmula con aceite de ricino (H2 oculto «Características») | — | 32 / 32 |
| 4 | `benefits` | `garelon-benefits` | 2 | `beneficios` | Antetítulo «Beneficios»; H2; entradilla con el **problema**; 4 tarjetas: Ojeras · Bolsas · Líneas finas · Hidratación | — | 56 / 56 |
| 5 | `roller` | `garelon-image-text` | 2 | `roller` | **Característica diferencial**: el roller (2 párrafos, sin botón) | IMAGEN 7, `rounded`, a la derecha | 56 / 56 |
| 6 | `ingredients` | `garelon-ingredients` | 1 | `ingredientes` | 5 ingredientes (nombre + INCI + frase neutra) + nota «según el proveedor» | IMAGEN 5 | 56 / 56 |
| 7 | `how_to` | `garelon-how-to-use` | 2 | `como-usarlo` | «3 pasos. Menos de un minuto.»: Limpia · Aplica · Masajea + nota de precaución | IMAGEN 4 | 56 / 56 |
| 8 | `faq` | `garelon-faq` | 2 | `preguntas-frecuentes` | 9 preguntas: qué es (con la aclaración de fabricante externo) · cómo se usa · frecuencia · cantidad y medidas · **qué incluye cada pack** · dónde aplicarlo · ingredientes · envío (plazos estimados + enlace a la política) · dudas con el pedido (enlaces a contacto y devoluciones) | — | 56 / 56 |
| 9 | `final_cta` | `garelon-final-cta` | 1 | — | Isotipo; H2 «Tu rutina empieza con un pequeño gesto»; «Cuidado diario para tu mirada.»; precio; «Comprar el sérum» → `/#comprar` | Ninguna (`none`, centrado) | 56 / 64 |

**Por qué la compra va arriba (actualización de packs, septiembre 2026):** la home recibe tráfico móvil de anuncios y el dueño quiere que los packs se vean casi desde el primer momento. Se **movió** el formulario real (no se duplicó): medido en local a 390 × 844, la portada termina a ~730 px con precio y CTA visibles, y las tarjetas de packs empiezan a ~1090 px (un deslizamiento); el CTA de la portada lleva directo a ellas. El resto de la historia (características → beneficios → diferencial → composición → uso → FAQ → cierre) sigue igual.

En la ronda 3 se eliminaron las secciones «showcase» y «editorial» porque solo tenían imágenes antiguas. Pueden volver con `garelon-image-text` si el nuevo producto tiene imágenes buenas para ello.

### 9.2 Estructura genérica GARELON (plantilla para cualquier producto)

| Posición | Bloque de la historia | Sección que se usa | ¿Obligatoria? | Regla |
|---|---|---|---|---|
| G0 | Barra superior | `announcement-bar` (grupo de cabecera) | Sí (permanente) | Texto simple y verdadero, sin urgencia (sección 12) |
| G1 | Cabecera | `header` (grupo) | Sí (permanente) | Sección 11 |
| G2 | **Portada**: qué es + beneficio + precio + CTA | `garelon-hero` | Sí | Imagen principal = foto limpia de lo que recibe el cliente. H1 = beneficio principal prudente. Máximo 3 micro-beneficios. |
| G8 | **Compra** (`#comprar`), justo después de la portada | `featured-product` con `garelon_gallery`, `garelon_anchor: comprar`, `garelon_mobile_info_first` y los bloques de packs y plazos | Sí | Formulario real de Shopify. Destino de todos los CTAs. Packs visibles pronto en móvil. |
| G3 | **Características**: hechos verificables | `garelon-trust-bar` | Sí | 4 hechos objetivos, sin claims ni sellos inventados |
| G4 | **Problema y beneficios** | `garelon-benefits` | Sí | La entradilla plantea el problema o la necesidad; 3-6 tarjetas de beneficio prudente |
| G5 | **Característica diferencial** | `garelon-image-text` | Recomendada | Solo si el producto tiene algo que lo distinga y hay una imagen que lo muestre |
| G5b | Lifestyle, «qué incluye» o medidas (opcional) | `garelon-image-text` (otra instancia) | Opcional | Solo con imagen fuerte y nueva; sin repetir la de otra sección |
| G6 | **Composición**: ingredientes, materiales o especificaciones | `garelon-ingredients` | Sí, si hay datos verificados | Datos exactos del proveedor o del envase + nota de origen |
| G7 | **Cómo se usa** | `garelon-how-to-use` | Sí, si el uso no es obvio | 2-5 pasos con verbo + nota de precaución si aplica |
| G9 | **FAQ** | `garelon-faq` | Sí | 6-10 preguntas; envíos y devoluciones remiten a las políticas reales |
| G10 | **Cierre** | `garelon-final-cta` | Sí | Isotipo + frase de marca + precio + CTA a `#comprar` |
| G11 | Pie | `footer` (grupo) | Sí (permanente) | Sección 13 |

**Reglas de la estructura**
- La compra (G8) va **justo después de la portada** (desde la actualización de packs; antes iba tras la explicación). Se mueve la sección, no se duplica el formulario. En móvil, `garelon_mobile_info_first` enseña título, precio, packs y botón antes que la galería, porque la portada ya muestra el producto. Si un producto futuro necesita explicarse antes de comprar, puede volver a su posición anterior (antes de la FAQ) sin tocar código.
- Una sección sin contenido real se elimina de `index.json` (no se deja vacía ni oculta con contenido viejo).
- Las anclas de las secciones enlazadas desde la navegación o los botones deben existir: `como-usarlo`, `ingredientes` (o la que la sustituya), `preguntas-frecuentes` y `comprar`.
- Si se renombra un ancla, se actualiza también `snippets/garelon-nav.liquid`, el `button2_link` de la portada y cualquier enlace en textos.

### 9.3 Adaptación por categoría

La estructura se mantiene; cambia el contenido de cada posición.

| Categoría | G3 Características (ejemplos) | G5 Diferencial | G6 Composición (`garelon-ingredients`) | G7 Uso | FAQ típica | Navegación (ancla G6) |
|---|---|---|---|---|---|---|
| **Cosmética** | Formato, contenido (ml), aplicador, ingrediente clave | Aplicador o textura | **Ingredientes**: nombre + INCI + frase neutra + nota del proveedor | Rutina: limpiar, aplicar, masajear | Frecuencia, zona, piel sensible, ingredientes, caducidad (PAO) | «Ingredientes» `#ingredientes` |
| **Electrónica / gadget** | Batería, conectividad, carga, compatibilidad | Función principal | **Especificaciones**: nombre = «Batería», línea técnica = «2000 mAh», texto = qué significa | Cómo funciona: cargar, emparejar, usar | Compatibilidad, autonomía, carga, qué incluye, garantía | «Especificaciones» `#especificaciones` |
| **Hogar** | Material, medidas, uso, limpieza | Utilidad clave. Antes/después solo si es legítimo, real y no exagerado. | **Materiales y medidas** | Montaje, uso, limpieza | Medidas, materiales, montaje, cuidados | «Materiales» `#materiales` |
| **Mascotas** | Tamaño, material, uso, limpieza | Seguridad o comodidad del animal | **Materiales y tallas** | Uso y limpieza | Talla o peso del animal, compatibilidad, limpieza, seguridad | «Materiales» o «Tallas» |
| **Moda / accesorio** | Material, tallas, fit, cuidados | Detalle de diseño | **Material y tallas** (tabla de tallas como texto en la FAQ o en una pestaña de la ficha) | Cuidados (lavado) | Tallas, material, cuidados, cambios | «Tallas» `#tallas` |
| **Bienestar / organización** | Material, medidas, uso, capacidad | Uso principal | **Materiales y especificaciones** | Uso | Medidas, capacidad, uso, limpieza | Según el caso |

**Cambiar la etiqueta y el ancla de la composición**
1. `anchor` de la sección `ingredients` en `templates/index.json`.
2. Etiqueta y ancla en `snippets/garelon-nav.liquid` (hoy `'Ingredientes'` y `#ingredientes`).
3. Etiqueta del ajuste `nav_show_ingredients` en el schema de `sections/header.liquid`.
4. Opcional: etiquetas del editor de `sections/garelon-ingredients.liquid` («Ingrediente», «Denominación INCI»).

Es un cambio de código mínimo y permitido. Mejora opcional: convertir la etiqueta y el ancla en ajustes de texto de la cabecera para no tocar código en el futuro.

**Imágenes según la categoría**
- Cosmética: textura, aplicación, envase.
- Gadget: producto encendido o en uso, puertos o botones, contenido de la caja.
- Hogar: en contexto, medidas.
- Mascotas: con el animal, sin exagerar.
- Moda: prenda puesta, detalle del tejido, guía de tallas.

---

## 10. Inventario de componentes reutilizables

Para cada componente: **archivo · función · entradas y ajustes · qué puede cambiar · qué se conserva.**

### 10.1 Portada · `sections/garelon-hero.liquid`
- **Función:** comprensión en 3-5 s y primer CTA.
- **Ajustes:** `product` (vacío = primer producto de la tienda), `image`, `image_mobile`, `image_position` (right/left), `mobile_image_first`, `eyebrow`, `heading`, `use_h1`, `text`, `show_price`, `button_label`, `button_link` (vacío = `/#comprar`), `button2_label`, `button2_link`, `color_scheme`, `anchor`, `padding_top`, `padding_bottom`.
- **Bloques:** `point` (`icon`, `text`), máximo 3.
- **Renderiza:** `garelon-fallback-image` (clave fija `img01-producto`, `eager: true`), `garelon-srcset` (solo si hay imagen de escritorio y de móvil), `garelon-price-inline`, `garelon-icon`.
- **Fijo en código:** `hero_alt` (texto alternativo del sérum), `hero_sizes`.
- **Cambia:** textos, imagen, micro-beneficios e iconos, texto alternativo (`hero_alt` en el código) y la clave de la imagen de respaldo si cambia la convención de nombres.
- **Se conserva:**
  - la estructura y la carga inmediata de la imagen (LCP), que es la única imagen `eager` de la página;
  - la lógica del H1 y el CTA a `/#comprar`;
  - el precio dinámico, el límite de 3 puntos y los topes de altura de 34vh y 26vh.

### 10.2 Características / servicio · `sections/garelon-trust-bar.liquid`
- **Función:** franja de hechos verificables (home) o de servicio (ficha).
- **Ajustes:** `heading` (H2 solo para lectores de pantalla), `show_borders`, `color_scheme`, `anchor`, márgenes.
- **Bloques:** `item` (`icon`, `title`, `text`, `link`), máximo 4. Los enlaces pasan por `garelon-url`.
- **Cambia:** los 4 elementos de la home. Los de la ficha (Pago seguro / Atención al cliente / Información de envío / Devoluciones) son **permanentes**.
- **Se conserva:** 2×2 en móvil y 1 fila desde 990 px; nada de sellos, certificados ni garantías sin prueba.

### 10.3 Beneficios · `sections/garelon-benefits.liquid`
- **Función:** plantear el problema (entradilla) y los beneficios prudentes.
- **Ajustes:** `eyebrow`, `heading`, `text`, `note`, `alignment`, `color_scheme`, `anchor` (`beneficios`), márgenes.
- **Bloques:** `benefit` (`icon`, `title`, `text`), máximo 6.
- **Cambia:** todo el texto y los iconos (lista de iconos en el schema).
- **Se conserva:** tarjetas `g-card` con icono en círculo; 1 columna en móvil, 2 desde 750 px y rejilla automática centrada desde 990 px.

### 10.4 Imagen y texto · `sections/garelon-image-text.liquid`
- **Función:** característica diferencial, lifestyle, «qué incluye», medidas, etc.
- **Ajustes:** `image`, `fallback_image` (select de claves del tema + `none`), `image_shape` (rounded/arch/circle), `image_position`, `show_massage_lines` (decoración propia del roller: dejar en `false`), `eyebrow`, `heading`, `text`, `button_label`, `button_link` (vacío = URL del producto), `product`, `button_secondary`, `color_scheme`, `anchor`, márgenes.
- **Texto alternativo:** el `alt` de la imagen del editor o, con asset del tema, el definido en `garelon-fallback-image`. Si no, el título.
- **Cambia:** textos, imagen, opciones del select (van ligadas a los assets del producto).
- **Se conserva:** 2 columnas 1:1 desde 750 px, imagen ≤ 520 px, `--no-media` si no hay imagen. Por defecto sin botón (máximo 3 CTAs en la home).

### 10.5 Composición · `sections/garelon-ingredients.liquid`
- **Función:** ingredientes, materiales o especificaciones.
- **Ajustes:** `eyebrow`, `heading`, `text`, `image`, `fallback_image` (hoy `img05-ingredientes` o `none`), `show_note`, `note` («Ingredientes según la información facilitada por el proveedor…»), `color_scheme`, `anchor` (`ingredientes`), márgenes.
- **Bloques:** `ingredient` (`name`, `inci`, `text`), máximo 12.
- **Cambia:** todo el contenido. El campo `inci` sirve como «línea técnica» (p. ej. «Silicona alimentaria», «2000 mAh»). La nota se adapta: «Especificaciones según el fabricante».
- **Se conserva:** la lista siempre en HTML, aunque la imagen la repita (accesibilidad y SEO); la nota de origen de los datos; imagen y lista a 2 columnas desde 990 px.

### 10.6 Cómo usarlo · `sections/garelon-how-to-use.liquid`
- **Función:** pasos de uso.
- **Ajustes:** `eyebrow`, `heading`, `image`, `fallback_image` (hoy `img04-uso`, `img07-roller` o `none`), `show_images` (imagen por paso, `false`), `note` (precaución), `color_scheme`, `anchor` (`como-usarlo`), márgenes.
- **Bloques:** `step` (`image`, `label` «01», `title`, `text`), máximo 5. Cada H3 lleva «Paso N:» oculto para lectores de pantalla.
- **Cambia:** los pasos, la nota y la imagen.
- **Se conserva:**
  - lista `<ol>` apilada junto a la imagen;
  - sin imagen, en columnas desde 750 px;
  - números en dorado con la fuente de títulos.

### 10.7 Compra en la home · `sections/featured-product.liquid` (Dawn + GARELON)
- **Función:** vender en la home con el formulario real de Shopify.
- **Ajustes GARELON:** `product` (vacío = `collections.all.products.first`), `garelon_gallery` (galería del tema), `garelon_anchor` (`comprar`), `garelon_mobile_info_first` (en móvil, formulario antes que la galería).
- **Ajustes de Dawn usados:** `media_size: medium`, `media_position: left`, `media_fit: contain`, `constrain_to_viewport: true`, `image_zoom: lightbox`, `hide_variants: true`, `color_scheme: scheme-2`, márgenes 40/56.
- **Bloques en uso:** `text` (antetítulo, uppercase), `title` (`heading_size: h2`), `price`, `garelon_packs` (packs = variantes reales), `buy_buttons` (`show_dynamic_checkout: true`), `garelon_stock`, `garelon_shipping`. Sin `variant_picker` (lo sustituye el bloque de packs), sin `quantity_selector` (cantidad 1) y sin subtítulo (la portada, justo encima, ya lo dice).
- **Cambia:** texto del antetítulo, galería (claves), producto elegido y textos de los bloques de packs y plazos.
- **Se conserva:** todo el formulario de Dawn, el ancla `comprar`, el Product JSON-LD que Dawn emite aquí y el stock honesto.

### 10.8 FAQ · `sections/garelon-faq.liquid`
- **Función:** resolver dudas antes y después de la compra.
- **Ajustes:** `eyebrow`, `heading`, `open_first`, `contact_text`, `color_scheme`, `anchor` (`preguntas-frecuentes`), márgenes.
- **Bloques:** `question` (`question`, `answer` richtext), máximo 20.
- **Enlaces que se resuelven solos:** `href="/pages/contacto"`, `"/pages/contact"`, `"/policies/refund-policy"` y `"/policies/shipping-policy"` apuntan a las URL reales vía `garelon-url`.
- **Cambia:** las preguntas propias del producto.
- **Se conservan** (ajustando el nombre del producto):
  - «¿Qué es…?», con la aclaración de fabricante externo;
  - «¿Cuándo recibiré mi pedido?», que remite a la política de envío;
  - «¿Qué ocurre si tengo una duda con mi pedido?», que remite a contacto y devoluciones.

### 10.9 Cierre · `sections/garelon-final-cta.liquid`
- **Función:** último empujón, sereno.
- **Ajustes:** `image`, `fallback_image` (hoy `none`, `img01-producto`, `img10-presentacion`), `show_isotype`, `heading`, `text`, `show_price`, `button_label`, `button_link` (vacío = `/#comprar`), `product`, `color_scheme`, `anchor`, márgenes.
- **Fijo en código:** texto alternativo del sérum para la imagen.
- **Cambia:** el título, el texto, la etiqueta del botón y el alt del código.
- **Se conserva:** isotipo GARELON, composición centrada sin imagen, precio real.

### 10.10 Compra fija · `sections/garelon-sticky-atc.liquid` + `assets/garelon.js`
- **Función:** barra inferior en móvil con miniatura, título, precio y botón. Aparece cuando el botón principal sale de la pantalla por arriba.
- **Solo en la ficha:** `enabled_on.templates: ["product"]`.
- **Ajustes:** `button_label` («Añadir»), `show_on_desktop` (`false`), `color_scheme` (`scheme-4`).
- **Funcionamiento:** no tiene formulario propio. Pulsa `#ProductSubmitButton-<sección>`, copia el precio de `#price-<sección>` y escucha `PUB_SUB_EVENTS.variantChange`. Muestra la variante elegida: la etiqueta del pack marcado (`#variant-selects-<sección> input:checked` → `data-pack-label`) o, sin packs, `variant.title`.
- **Cambia:** nada, salvo la etiqueta si hiciera falta.
- **Se conserva:** entera.

### 10.11 Packs · bloque `garelon_packs` (en `main-product` y `featured-product`) + `snippets/garelon-packs.liquid`
- **Qué es:** un selector visual de **variantes reales**. Cada tarjeta es una variante de Shopify («1 unidad», «2 unidades», «3 unidades») y al elegirla se selecciona **esa variante con cantidad 1**. Así el carrito y el proveedor reciben una línea «2 unidades» × 1, nunca «1 unidad» × 2 ni «2 unidades» × 2. (Hasta septiembre de 2026 el bloque solo cambiaba la cantidad: ese sistema ya no existe.)
- **Cómo funciona:** pinta el `<variant-selects>` de Dawn con radios compatibles (`form`, `data-option-value-id`, `data-product-url`, `data-option-name`, JSON `[data-selected-variant]`). Dawn hace el resto sin JS propio: `product-info.js` pide la sección a Shopify (`option_values`), actualiza precio, stock, botón, `input[name="id"]` y la URL (`?variant=` en la ficha) y vuelve a pintar las tarjetas con los datos reales.
- **Cálculos (Liquid, con `variant.price`, nada escrito a mano):**
  - unidades del pack = número con el que empieza el valor («2 unidades» → 2) o la lista del ajuste `pack_units` (p. ej. `1,2,3`);
  - referencia = precio de la variante de 1 unidad × unidades; ahorro = referencia − precio del pack (solo si > 0); % = ahorro ÷ referencia, redondeado;
  - precio por unidad = precio del pack ÷ unidades, redondeado al céntimo;
  - insignia = el pack con el precio por unidad más bajo, si es uno solo, tiene más de 1 unidad y está disponible.
  - Con los precios actuales (19,99 / 35,00 / 48,00 €): 19,99 €/unidad · 17,50 €/unidad y «Ahorra 4,98 €» (-12 %) · 16,00 €/unidad, «Ahorra 11,97 €» (-20 %) e insignia «Mejor precio/unidad».
- **Selección:** la de Shopify: `?variant=` si viene en la URL; si no, la primera variante disponible (por eso «1 unidad» debe ser la primera variante). Nunca se preselecciona un pack mayor.
- **Agotados:** radio `disabled`, borde discontinuo y «Agotado»; sin cifras de stock. Si llega por `?variant=` una variante agotada, el botón de Dawn dice «Agotado» y no deja comprar.
- **Respaldo:** si el producto tiene más de una opción, un valor sin número, números repetidos o el nombre de opción no coincide con `option_name`, se pinta el selector estándar de Dawn (`picker_type`, `swatch_shape` del propio bloque). Un producto sin variantes no muestra selector.
- **Nombre mostrado:** «N unidad/unidades» (ajustes `unit_singular`/`unit_plural`), aunque el valor de Shopify sea otro (p. ej. «3 piezas» de CJ). Aun así **el valor de Shopify debe renombrarse a «3 unidades»**, porque el carrito, el checkout y los emails muestran el valor real.
- **Ajustes:** `heading` («Elige tu pack»), `option_name` (vacío = la única opción), `pack_units`, `unit_singular`, `unit_plural`, `show_unit_price`, `show_savings`, `show_percent` (desactivado), `badge_text` («Mejor precio/unidad»; vacío = sin insignia), `savings_note` («Ahorro calculado frente a comprar las unidades por separado.»), `picker_type` y `swatch_shape` (respaldo).
- **Cantidad:** con packs no hay bloque `quantity_selector`; el bloque añade `quantity=1` oculto. El cliente puede cambiar la cantidad en el carrito (R10).
- **Un solo `<variant-selects>` por sección:** si existe el bloque de packs, el bloque `variant_picker` de Dawn no se pinta aunque esté en la plantilla.
- **Estado actual:** activo en la home (`product_cta`) y en la ficha (`main`).
- **Opción recomendada en Shopify:** nombre «Pack» (el carrito muestra «Pack: 2 unidades» junto a la cantidad 1). «Cantidad» también funciona, pero en el carrito se lee «Cantidad: 2 unidades» al lado del selector de cantidad.

### 10.12 Plazos de envío · bloque `garelon_shipping` (en `main-product` y `featured-product`) + `snippets/garelon-shipping.liquid`
- **Función:** plazos junto a la compra, en tono de estimación. Icono de camión, dos líneas y una nota con enlace a la política de envío real (`garelon-url`).
- **Ajustes:** `preparation` («Preparación estimada: 1–3 días.»), `delivery` («Entrega estimada en España: aproximadamente 8–16 días.»), `note` («Los plazos pueden variar según destino y transporte.»), `link_label` («Política de envío»; vacío = sin enlace).
- **Reglas:** nunca «entrega garantizada», «recíbelo en X días», «24/48 h» ni «envío express» sin soporte; nunca costes internos del proveedor, aduanas ni márgenes; no se nombra al proveedor.
- **Estado actual:** activo en la home (tras el stock) y en la ficha (tras el inventario).

### 10.13 Ayuda del pie · bloque `garelon_help` de `sections/footer.liquid`
- **Ajustes:**
  - `heading`: «Ayuda».
  - `text`: «¿Necesitas ayuda? Estamos aquí para resolver cualquier duda sobre tu pedido, nuestros productos o el proceso de compra.»
  - `link_label`: «Contacta con nuestro equipo», con flecha `→`.
  - `link`: vacío = página de contacto.
  - `menu`: opcional.
- **Permanente.**

### 10.14 Otros snippets permanentes
- **Imagen y enlaces:** `garelon-image`, `garelon-srcset`, `garelon-url`.
- **Precio y stock:** `garelon-price-inline`, `garelon-stock`.
- **Navegación y marca:** `garelon-nav` (solo cambian etiquetas o anclas según la sección 9.3), `garelon-logo-fallback`, `garelon-flag-es`.
- **`garelon-icon`:** se amplía, no se reescribe.

Su API está documentada en el comentario de cabecera de cada archivo.

---

## 11. Cabecera, menú móvil, búsqueda y cuenta

### 11.1 Construcción actual
- **Sección:** `sections/header.liquid`, esquema 1, `logo_position: middle-left` (escritorio: logo a la izquierda, menú en línea), `mobile_logo_position: center`, `menu_type_desktop: dropdown`, `sticky_header_type: on-scroll-up` (la cabecera aparece al subir), línea separadora, márgenes 12/12.
- **Marca:**
  - Un solo enlace `a.header__heading-link.garelon-brand-link` → `routes.root_url` con `[isotipo] + [logo]`.
  - **Isotipo:** `garelon-logo-fallback` variante `isotype` (`garelon-isotipo-96.webp`), 2,8 rem de alto en escritorio y 2,3 rem en móvil. `alt=""` porque el enlace ya se anuncia con el alt del logo (`shop.name`).
  - **Logo:** si hay uno subido en Configuración del tema → Logo, se usa ese (`logo_width: 150`). Si no, `garelon-wordmark-480.webp` (12,4 rem de ancho en móvil).
  - Separación de 0,9 rem (0,6 rem en móvil).
- **H1:** el logo no es H1; lo pone la portada (`use_h1`).
- **Navegación:** `nav_source: garelon` → `garelon-nav`:
  - Enlaces: **Inicio** (`/`) · **Ingredientes** (`/#ingredientes`) · **Preguntas frecuentes** (`/#preguntas-frecuentes`) · **Contacto** (URL real de la página de contacto).
  - «Cómo usarlo» (`nav_show_how`) está desactivado: con 5 enlaces el menú no cabe en una línea entre 990 y 1199 px, y la portada ya tiene el botón «Cómo se usa».
- **Menú de Shopify (`nav_source: shopify`):** posible. Con `hide_catalog_links: true` se omiten los enlaces de tipo `catalog_link`, `collections_link` y `collection_link`, y las URL con `/collections`, en todos los niveles de escritorio y móvil.

### 11.2 Cabecera móvil (< 750 px): la solución al solape
- **Problema original:** con las cuentas de cliente activadas, Dawn coloca 4 iconos (menú, búsqueda, cuenta y carrito) con las áreas `'left-icons search heading icons'`. Entre 320 y 430 px se montaban sobre el logo.
- **Solución** (`assets/garelon.css`, bloque «Cabecera móvil»). Los selectores llevan el prefijo `.section-header .header-wrapper` para superar la especificidad de Dawn (0,5,0):

  ```css
  @media screen and (max-width: 749px) {
    .section-header .header-wrapper .header.header--has-menu:not(.header--mobile-left) {
      grid-template-areas: 'left-icons heading icons';
      grid-template-columns: 1fr auto 1fr;
    }
    .section-header .header-wrapper .header.header--has-menu > .header__search,
    .section-header .header-wrapper .header.header--has-menu .header__icons > .header__search,
    .section-header .header-wrapper .header.header--has-menu .header__icons > .header__icon--account {
      display: none;
    }
  }
  ```

- **Búsqueda y cuenta dentro del menú:** `snippets/header-drawer.liquid` añade `ul.garelon-drawer-utility`, visible solo por debajo de 750 px:
  - **Búsqueda** → `routes.search_url`, con el texto `general.search.search`;
  - **Cuenta** → `routes.account_url`, solo si `shop.customer_accounts_enabled`, con el texto «Iniciar sesión» o «Cuenta».
- **Cierre del menú:** `assets/garelon-nav.js` lo cierra al pulsar un ancla de la misma página: `drawer.closeMenuDrawer(event, summary)` y `aria-expanded="false"`.
- **Resultado medido:**
  - de 320 a 430 px: cabecera de 56 px, sin solapes ni scroll horizontal, al menos 14 px entre el logo y los iconos;
  - de 750 a 989 px: la búsqueda y la cuenta vuelven a la barra (comportamiento de Dawn);
  - desde 990 px: menú en línea de 4 enlaces en una fila.
- **Regla permanente (R18):** en móvil, menú · [isotipo GARELON] · carrito. Si un producto futuro añade algo a la cabecera, lo primero que se sacrifica es la cuenta; después, la búsqueda. Nunca la marca.

---

## 12. Barra superior (announcement bar)

- **Sección:** `sections/announcement-bar.liquid` (Dawn), dentro de `sections/header-group.json`, con el esquema 3 (tinta con texto crema).
- **Un solo bloque** `announcement`:
  - `text`: «Envío disponible a toda España»;
  - `link`: vacío;
  - `show_flag_es`: `true` (ajuste añadido por GARELON).
- **Bandera:** `snippets/garelon-flag-es.liquid`, SVG de 3:2 (`#AA151B` / `#F1BF00`), `.garelon-flag` de 1,5 em × 1 em, `aria-hidden`. Se usa en vez del emoji 🇪🇸 porque Windows no muestra emojis de bandera (saldría «ES»).
- **Medida:** una línea, 38 px de alto de 320 a 1440 px. `auto_rotate: false`.
- **Configurable sin código:** Personalizar → Barra de anuncios → texto, enlace y casilla de bandera. Si cambia el mercado, se cambia el texto y se desactiva `show_flag_es`. Otra bandera = otro snippet con el mismo patrón.
- **Reglas:** texto simple y verdadero. Sin urgencia, sin «envío gratis» si no está configurado en Shopify, sin plazos inventados.

---

## 13. Pie, Ayuda, contacto, políticas e información de empresa

### 13.1 Pie (`sections/footer.liquid` + `sections/footer-group.json`)
- **Esquema 2** (arena), márgenes 48/32, sin boletín (`newsletter_enable: false`), iconos de pago de Shopify (`payment_enable: true`).
- **Bloque `brand` (`brand_information`):**
  - logo apilado: `settings.brand_image` o, si falta, `garelon-logo-fallback` `stacked` (`garelon-logo-480.webp`, 120 px);
  - descripción: `settings.brand_description` = «Cuidado diario para tu mirada.» (**propia del producto: cambiarla**);
  - redes sociales: solo las que tengan URL.
- **Bloque `ayuda` (`garelon_help`):** sección 10.13.
- **Enlaces legales** (`show_policy: true`), en orden fijo y solo si tienen contenido:
  1. **Contacto** (siempre, URL real)
  2. **Política de envíos** (`shipping-policy`)
  3. **Política de devoluciones y reembolsos** (`refund-policy`)
  4. Privacidad (`privacy-policy`, título de Shopify)
  5. **Política de cookies** (página, solo si existe)
  6. **Términos y condiciones** (`terms-of-service`)
  7. Aviso legal (`legal-notice`, título de Shopify)
  8. El resto de políticas con contenido (p. ej. información de contacto)

### 13.2 Contacto (permanente, R14)
- Es una **página del Admin** (Tienda online → Páginas) con la plantilla `page.contact` (`main-page` + `contact-form` de Dawn). El formulario envía al email de la tienda.
- Una sola página, que no se recrea.
- **Cómo la encuentra `garelon-url`:**
  1. Configuración del tema → **GARELON · Enlaces** → `garelon_contact_page`.
  2. Si no se ha elegido, la primera página que exista con handle `contacto`, `contact`, `contactanos`, `contacta-con-nosotros` o `contact-us`.
  3. Si no hay ninguna, `/pages/contact`.
- **Todo enlace de soporte pasa por ahí:**
  - navegación (Contacto), bloque Ayuda y enlace «Contacto» del pie;
  - FAQ, barra de servicio de la ficha y pestañas de la ficha.

### 13.3 Políticas (R15)
- **En el Admin** (Configuración → Políticas): Reembolso, Privacidad, Términos del servicio, Envío, Información de contacto y Aviso legal.
  - El texto de devoluciones del sérum está en `GARELON-POLITICA-DEVOLUCIONES.md`.
  - Una política vacía no aparece en el pie.
- **Cookies:** es una **página** (Shopify no tiene política nativa de cookies). Se busca en `garelon_cookies_page` o por los handles `politica-de-cookies`, `cookies` y `politica-cookies`. El banner de cookies es el de Shopify (Privacidad del cliente); el tema no añade uno propio.
- **Envíos:** la política vive en el Admin. Con CJ Dropshipping debe decir los plazos como estimación (preparación 1–3 días; transporte aproximadamente 8–16 días; pueden variar por destino, transporte, festivos o incidencias), sin nombrar al proveedor ni prometer «sin aduanas». Propuesta en `GARELON-CAMBIOS-CJ-PACKS.md`.
- **Devoluciones y envíos:** `garelon-url` usa la política nativa si tiene contenido. Si no, la página elegida en `garelon_refund_page` o `garelon_shipping_page`, o las de handle habitual.

### 13.4 Información de empresa (R12)
- NIF/CIF, razón social, domicilio, teléfono y email **nunca** están en el código.
- Viven en el Admin: políticas, Información de contacto, Aviso legal y datos de la tienda. El tema solo los enlaza.
- Si faltan, el informe lo dice y el dueño los completa.

---

## 14. Ficha de producto (`templates/product.json`)

**Sección `main` (`main-product`)**
- **Ajustes:**
  - `media_size: large`, `gallery_layout: thumbnail`, `mobile_thumbnails: show`, `media_position: left`, `media_fit: contain`;
  - `constrain_to_viewport: true`, `image_zoom: lightbox`, `hide_variants: true`, `enable_sticky_info: true`;
  - esquema 1, márgenes 16/36.
- **Galería:** la **multimedia del producto de Shopify** (la que importa o conecta el proveedor), no los assets del tema.
- **Bloques, en orden:**
  1. `eyebrow` (`text`, uppercase): «Sérum contorno de ojos · 10 ml» → **cambia**
  2. `title`: **H1** con `product.title` del Admin
  3. `rating`: solo con app de reseñas (metafield `reviews.rating`)
  4. `price`: dinámico
  5. `subtitle` (`text`, subtitle) → **cambia**
  6. `packs` (`garelon_packs`): **activo**, «Elige tu pack» (sección 10.11). Sustituye a `variant_picker` y `quantity_selector`, que ya no están en la plantilla.
  7. `buy_buttons`: con pago dinámico (Shop Pay, PayPal, Apple Pay…, lo decide Shopify)
  8. `inventory`: `inventory_threshold: 0`, `show_inventory_quantity: false`, así que nunca muestra «Pocas unidades» ni cifras
  9. `shipping` (`garelon_shipping`): plazos estimados (sección 10.12)
  10. `highlights` (`icon-with-text` de Dawn: ojo / frasco / cronómetro, «Aplicación precisa · 10 ml · Rutina en 3 pasos») → **cambia**
  11. `description`: `product.description` del Admin, que **hay que limpiar en el Admin**
  12. `tab_ingredientes`, `tab_uso` (`collapsible_tab`) → **cambian** (título, icono de Dawn, contenido)
  13. `tab_envios` («Envíos y devoluciones»: plazos estimados + enlaces a las políticas): **permanente**
  14. `share`
- **Después:**
  - `service` (`garelon-trust-bar`: Pago seguro · Atención al cliente → contacto · Información de envío → política · Devoluciones → política): **permanente**;
  - `benefits`, `how_to` y `faq`: **cambian**, normalmente con el mismo contenido que en la home;
  - `sticky` (`garelon-sticky-atc`).
- Esta plantilla sirve para **todos** los productos. Si en el futuro hubiera varios, haría falta una plantilla alternativa por producto (sección 28).

---

## 15. Compra: formulario, variantes, stock, carrito y checkout

### 15.1 Formulario de producto (R9)
- **Base:** el formulario de Dawn:
  - `snippets/buy-buttons.liquid` crea `<product-form>` con `form 'product'`, `input name="id"` (variante) y el botón `#ProductSubmitButton-<sección>`;
  - `assets/product-form.js` hace la petición AJAX a `/cart/add` y abre el cart drawer (`cart_type: drawer`), o muestra la notificación;
  - `assets/product-info.js` gestiona el cambio de variante: vuelve a pedir la sección y actualiza precio, botón, stock (`#Inventory-<sección>`), URL y multimedia;
  - los eventos pasan por `pubsub.js` (`PUB_SUB_EVENTS.cartUpdate`, `variantChange`).
- **Selector de variantes:** el bloque `garelon_packs` pinta el `<variant-selects>` de Dawn: tarjetas de packs o, de respaldo, el selector estándar (`snippets/product-variant-picker.liquid` + `product-variant-options.liquid`). El bloque `variant_picker` de Dawn solo se pinta si no hay bloque de packs. Si el producto solo tiene la variante por defecto, no aparece selector.
- **Cantidad:** con packs, sin bloque `quantity_selector`: el formulario envía `quantity=1` (campo oculto del bloque de packs). Si se vuelve a añadir el bloque de cantidad, Dawn lo reinicia a 1 en cada cambio de variante.
- **Pago dinámico:** `show_dynamic_checkout: true` → `{{ form | payment_button }}`. Shopify decide qué botones aparecen. El tema no los toca.
  - Con el pago dinámico activo, Dawn muestra «Añadir al carrito» con estilo secundario (contorno) y el botón de pago de Shopify debajo. Es el comportamiento nativo y se deja así.
- **Stock en la home:** `snippets/garelon-stock.liquid` (sección 6.4). En la ficha, el bloque `inventory` de Dawn con los ajustes sin urgencia.
- **Precio:** `snippets/price.liquid` de Dawn (formulario) y `snippets/garelon-price-inline.liquid` (portada y cierre: «A partir de 19,99 €» cuando el precio varía entre variantes, como con los packs). El precio comparado solo aparece si `compare_at_price > price`.
- **Producto por defecto:** portada, imagen y texto, cierre y compra en la home usan `section.settings.product | default: collections.all.products.first`. **En una migración, elige el producto nuevo en estas secciones o retira el anterior del canal Tienda online** (sección 25, F5). Si no, se puede mostrar el producto viejo.

### 15.2 Carrito (R10)
- **Ajustes:**
  - `cart_type: drawer` y `cart_color_scheme: scheme-1`;
  - `show_cart_note: false`, `show_vendor: false`;
  - `cart_drawer_collection: ""`: el carrito vacío no sugiere una colección.
- **Cart drawer:** `sections/cart-drawer.liquid`, `snippets/cart-drawer.liquid` y `assets/cart-drawer.js`. Muestra imagen, título, variante, cantidad editable, eliminar, precio, subtotal e impuestos/envío (texto de Shopify) y el botón «Finalizar compra». Con el carrito vacío, «Seguir comprando» → `routes.root_url`.
- **Página de carrito:** `templates/cart.json` (`main-cart-items` + `main-cart-footer` con los bloques `subtotal` y `buttons`) y `assets/cart.js`.
- **Lo que no hay:** productos añadidos automáticamente, seguros, casillas premarcadas, upsells ni «también te puede gustar».

### 15.3 Checkout (R11)
- Es el de Shopify. El tema no tiene acceso a su contenido.
- Shopify muestra arriba el bloque de pago exprés y debajo la tarjeta; el orden no se cambia con hacks.
- **Vías oficiales:** Configuración → Pagos; apps de personalización de pagos (Shopify Functions en Plus).

### 15.4 Compra fija, packs y plazos
Ver las secciones 10.10, 10.11 y 10.12.

### 15.5 Proveedor y fulfillment (Shopify + CJ Dropshipping)
- **Sistema vigente:** Shopify es la fuente de verdad (producto, variantes, precios, disponibilidad, inventario, IDs, carrito). **CJ Dropshipping** se conecta desde su app y hace el fulfillment. El tema no tiene ninguna línea de código de CJ.
- **Mapping de packs:** cada variante de Shopify está emparejada con su variante de CJ: «1 unidad» → CJ «1 unidad»; «2 unidades» → CJ «2 unidades»; «3 unidades» → CJ «3 piezas». Cantidad siempre 1 por pack.
- **Método de envío interno:** CJPacket Euro Cosmetic Line (elegido por ser cosmético). Pesos de CJ: 62 g / 112 g / 168 g. Costes internos de CJ (envío, aranceles, despacho): **nunca** en la tienda.
- **Plazos al cliente:** conservadores, a partir de los datos de CJ: «Preparación estimada: 1–3 días» y «Entrega estimada en España: aproximadamente 8–16 días». El «5–11 días para el 54 %» de CJ no se convierte en promesa.
- **AutoDS:** proveedor histórico. Se desconecta **para este producto** solo cuando CJ esté probado con pedidos reales, para que no vuelva a sobrescribir stock, precio, imágenes, variantes o fulfillment. No se desinstala nada crítico antes.
- **Futuro:** donde antes ponía «Producto → AutoDS», la regla es «Producto → proveedor/fulfillment actual (hoy CJ Dropshipping)». Cambiar de proveedor no cambia el tema.

---

## 16. Datos dinámicos y contenido fijo

### 16.1 Lo que viene siempre de Shopify (nunca se escribe)
- **Del producto:** `product.title`, `product.description`, `product.media`, `product.featured_media`, variantes y opciones, `variant.price`, `variant.compare_at_price`, `product.price_varies`, `product.price_min`, `variant.available`, `variant.inventory_management`, `inventory_quantity`, `inventory_policy`, SKU, selling plans y `structured_data`.
- **De la tienda:** `shop.name`, `shop.policies`, `shop.refund_policy`, `shop.shipping_policy`, `shop.customer_accounts_enabled`, `pages[handle]`.
- **Rutas:** `routes.root_url`, `routes.search_url`, `routes.account_url`, `routes.cart_url`.
- **Otros:** el carrito (`cart`), los metafields de reseñas (apps), la moneda y el formato de dinero (`money`), los textos de interfaz (`locales/es.json` con `| t`).

### 16.2 Lo que es contenido editable (Theme Editor)
- **Textos, imágenes, iconos, botones, anclas, esquemas y márgenes** de todas las secciones GARELON: `templates/*.json`.
- **Barra superior, cabecera** (navegación, isotipo) **y pie** (Ayuda, marca): `sections/*-group.json`.
- **Ajustes globales:** colores, tipografía, botones, logo, favicon, redes, descripción de marca y GARELON · Enlaces (`config/settings_data.json`).

### 16.3 Textos del producto escritos en el código (cambiar en cada migración)

Lista completa del commit `755240b`.

| Archivo | Qué hay del producto actual | Qué hacer |
|---|---|---|
| `sections/garelon-hero.liquid` | `assign hero_alt = 'Sérum para el contorno de ojos: frasco roller…'`. Clave fija `fallback: 'img01-producto'`. Valores por defecto del schema: `heading`, `text`, `button_label` «Comprar el sérum», info de `image` («IMAGEN 1…»). Presets «Aplicador roller», «10 ml», «Rutina sencilla»; bloque por defecto `roller`/«Aplicador roller». | Nuevo alt descriptivo; clave de la imagen principal; valores por defecto neutros o del nuevo producto |
| `sections/garelon-final-cta.liquid` | `alt: 'Sérum para el contorno de ojos con aplicador roller y su caja'`; opciones de `fallback_image` (IMAGEN 1 / IMAGEN 10); por defecto `heading` y `button_label` «Comprar el sérum» | Alt, opciones y valores por defecto |
| `sections/garelon-image-text.liquid` | Opciones de `fallback_image` (7 claves `img…`); por defecto `heading`/`text` sobre el roller; `show_massage_lines` (decoración del roller) | Opciones = claves nuevas; valores por defecto neutros; dejar las líneas de masaje en `false` o quitarlas si no aplican |
| `sections/garelon-ingredients.liquid` | Opción `img05-ingredientes`; preset con los 5 ingredientes; `heading` por defecto | Opciones y presets |
| `sections/garelon-how-to-use.liquid` | Opciones `img04-uso`, `img07-roller`; `heading` «3 pasos. Menos de un minuto.»; preset Limpia/Aplica/Masajea; valores por defecto del bloque `step` | Opciones, presets y valores por defecto |
| `sections/garelon-benefits.liquid` | `heading` por defecto; presets Ojeras/Bolsas/Líneas finas/Hidratación; bloque por defecto «Hidratación» | Presets y valores por defecto |
| `sections/garelon-trust-bar.liquid` | Bloque por defecto «Rutina en 3 pasos»; presets del sérum | Presets |
| `sections/garelon-faq.liquid` | Preset «¿Cómo se utiliza?» con el roller | Preset |
| `sections/featured-product.liquid` | `info` de `garelon_gallery`: «Muestra IMAGEN 1, 10, 7, 5, 4 y 9…» | Actualizar el texto |
| `snippets/garelon-fallback-image.liquid` | Las 6 claves, sus nombres de asset y sus textos alternativos (sérum) | Reescribir el `case` con las imágenes nuevas (sección 18.6) |
| `snippets/garelon-gallery.liquid` | `keys = 'img01-producto,img10-presentacion,img07-roller,img05-ingredientes,img04-uso,img09-tamano'` y el comentario | Claves nuevas en el orden de la historia |
| `snippets/garelon-nav.liquid` | Etiquetas «Ingredientes» y «Cómo usarlo» y sus anclas | Solo si la categoría lo pide (sección 9.3) |
| `sections/header.liquid` (schema) | Etiquetas `nav_show_ingredients` y `nav_show_how` | Igual que la anterior |
| `snippets/garelon-icon.liquid` | Iconos propios del sérum (`roller`, `eye-under`, `lines`) | Mantenerlos (no molestan) y añadir los nuevos |
| `snippets/garelon-image.liquid`, `snippets/garelon-srcset.liquid` | Ejemplos de uso en comentarios («Sérum», `garelon-img01-producto`) | Actualizar los comentarios |
| `assets/garelon.css` | Comentarios «IMAGEN 5», «IMAGEN 4»; clase `.g-massage-lines` | Actualizar los comentarios; la clase puede quedarse |
| `config/settings_data.json` | `brand_description`: «Cuidado diario para tu mirada.» | Frase de marca neutra o del nuevo producto |
| `templates/index.json`, `product.json`, `page.faq.json`, `404.json` | Todo el contenido del sérum | Reescribir |

**Recomendación para la primera migración:** que los valores por defecto y presets de los schemas sean **neutros y genéricos** («Comprar ahora», «Título», «Beneficio»…) para no tener que cambiarlos en cada producto. El contenido real vive en los JSON.

---

## 17. Copy y claims

### 17.1 Tono y voz
- Español de España, tratamiento de **tú**, frases cortas, serenas y concretas.
- Sin exclamaciones (el copy actual no tiene ninguna), sin emojis en los textos y sin MAYÚSCULAS escritas a mano: el CSS pone en mayúsculas antetítulos y botones.
- Se habla del producto como «el sérum», «el organizador»… (`{{PRODUCT_SHORT_NAME}}`), no con el título técnico del proveedor.
- GARELON habla como tienda: «lo comercializamos», «nuestra política de envío», «escríbenos».

### 17.2 Claims: regla general (R3)

Cada frase del proveedor pasa por este filtro:

1. **¿Es un hecho verificable?** Medida, material, contenido, ingrediente o función. Se usa tal cual y citando la fuente si procede: «según el fabricante».
2. **¿Es una promesa de resultado?** Se reformula en términos de **apariencia, sensación, ayuda o complemento de una rutina**, sin cuantificar.
3. **¿Es médica o terapéutica, de salud, absoluta o comparativa?** Frases como «cura», «trata», «elimina», «el mejor», «100 % eficaz» o «clínicamente probado» **se eliminan**.
4. **¿Menciona estudios, porcentajes, certificaciones, premios, expertos o número de clientes?** Se elimina salvo prueba documental entregada.

| Texto del proveedor | En GARELON |
|---|---|
| «Elimina las arrugas» | «Ayuda a mejorar la apariencia de las líneas finas» |
| «Remove dark circles» / «Elimina las ojeras» | «Contribuye a mejorar la apariencia de la zona oscura del contorno» (texto real) |
| «Reduce las bolsas en 7 días» | «El masaje con roller complementa una rutina orientada a una mirada más descansada» (texto real) |
| «Anti-aging», «rejuvenece» | «Aporta cuidado e hidratación» / se elimina |
| «Clínicamente probado», «dermatológicamente testado» | Se elimina (salvo certificado entregado) |
| «100 % natural» | Solo si la lista completa lo justifica; si no, se elimina |
| «El mejor del mercado», «nº 1» | Se elimina |
| «Batería de larga duración» | «Batería de {{mAh}} mAh (según el fabricante)» |
| «Impermeable» | «Resistencia al agua {{IPX}} según el fabricante» solo con la especificación; si no, se elimina |
| «Aprobado por veterinarios» | Se elimina (salvo prueba) |
| «Garantía de por vida», «envío gratis», «stock limitado» | Solo si existe de verdad en las políticas o la configuración de Shopify; si no, se elimina |

**Los textos dentro de las imágenes también son claims.** Una imagen con una frase prohibida o una errata **se descarta**; no se edita en código. Si una imagen útil tiene una expresión dudosa pero tolerable, se usa y se anota en el informe para que el dueño decida. En el sérum, IMAGEN 4 dice «eficaz» e IMAGEN 5 dice «mejora la elasticidad» y «rejuvenecido».

### 17.3 Longitudes de referencia (medidas en el copy actual)

| Elemento | Actual | Regla |
|---|---|---|
| H1 de la portada | 6 palabras | 5-8 palabras. Beneficio, no el nombre técnico. |
| Texto de la portada | 24 palabras, 1 frase | 1 frase de 18-30 palabras: qué es + ingrediente o característica clave + para qué |
| Micro-beneficios de la portada | 1-2 palabras × 3 | Máximo 3, 1-3 palabras |
| Características | 2-5 palabras × 4 | 4 hechos de 2-5 palabras |
| H2 de sección | 2-10 palabras | 4-9 palabras |
| Entradilla | 33 palabras | 1-2 frases, ≤ 40 palabras |
| Beneficio | Título de 1-2 palabras + 9-13 palabras | Título de 1-3 palabras + 1 frase ≤ 15 palabras |
| Diferencial | 34 palabras en 2 párrafos | ≤ 45 palabras |
| Paso de uso | Verbo de 1 palabra + 11-16 palabras | Verbo + 1 frase ≤ 20 palabras |
| Respuesta de la FAQ | 20-57 palabras | 1-3 frases, ≤ 60 palabras |
| H2 del cierre + texto | 7 + 5 palabras | Frase de marca breve |
| Botón de compra | «Comprar el sérum» | «Comprar {{PRODUCT_SHORT_NAME}}» |

### 17.4 Frases GARELON reutilizables (permanentes, ajustando el nombre)
- **FAQ «¿Qué es…?»:** «… GARELON es la tienda desde la que lo comercializamos: el producto procede de un fabricante externo, por lo que en el producto y en su caja verás la marca original del fabricante.» Si el producto no lleva marca visible, se adapta esa parte.
- **Nota de origen:** «[Ingredientes / Materiales / Especificaciones] según la información facilitada por el proveedor. Consulta siempre el envase del producto.»
- **FAQ de envío:** «Preparamos tu pedido en un plazo estimado de 1–3 días y la entrega estimada en España es de aproximadamente 8–16 días. Son plazos orientativos: pueden variar según el destino y el transporte. Encontrarás los detalles en nuestra política de envío y durante el proceso de compra.» (ajustar los plazos a los del proveedor vigente).
- **FAQ de packs** (si hay packs): «Cada pack incluye el número de unidades indicado: 1, 2 o 3 [productos] iguales. El precio de cada pack es el que ves al elegirlo. Si un pack tiene un precio por unidad más bajo, verás cuánto ahorras frente a comprar las mismas unidades por separado.»
- **FAQ de dudas:** «Escríbenos desde nuestra página de contacto indicando tu número de pedido y te responderemos lo antes posible. Puedes consultar también nuestra política de devoluciones.»
- **Nota de precaución:** redactada con las advertencias reales del envase (hoy: «Solo para uso externo. Evita el contacto directo con los ojos. Si notas cualquier molestia, interrumpe su uso.»).
- **Pestaña «Envíos y devoluciones»** de la ficha, bloque Ayuda y barra superior: tal cual.

---

## 18. Sistema de imágenes

### 18.1 Principios
- **R1 · Fidelidad:** lo que se ve es lo que llega. Si una imagen muestra otra marca, otra etiqueta, otro color, otro número de piezas u otro accesorio, se descarta.
  - En el sérum, IMAGEN 3 decía «Baufven» en vez de «Baafven».
- **Qué puede mejorar ChatGPT antes de la entrega:** fondo, iluminación general, maquetación y tipografía de las infografías, traducción de los textos al español y formato cuadrado. **Qué nunca:** el producto en sí (forma, envase, etiqueta, colores, componentes, marca, materiales). Tampoco puede añadir «GARELON» sobre el producto.
- **Claude Code no edita ni regenera imágenes:** solo las redimensiona y las convierte a WebP. Compara cada imagen mejorada con las originales del proveedor si están disponibles y señala cualquier diferencia visible del producto.
- **La coherencia visual se consigue eligiendo**, no con filtros ni recortes.
- **No se usan todas las imágenes porque existan:** el objetivo son 5-8, cada una respondiendo a una pregunta distinta del cliente. El sérum usa 6 de 10.

### 18.2 Revisión obligatoria de TODAS las imágenes
Para cada archivo, Claude Code rellena en el informe:

| Campo | Qué se evalúa |
|---|---|
| Qué muestra | Descripción breve |
| Fidelidad | ¿Coinciden envase, marca, etiqueta, colores, componentes y accesorios con el producto real y el resto de imágenes? |
| Calidad | Resolución (≥ 1080 px de ancho para usarla), nitidez, compresión, recortes raros |
| Texto incrustado | Idioma, erratas, claims (sección 17), coherencia con los datos verificados (medidas, ingredientes) |
| Antes/después o comparativa | Por defecto se descarta (R4) |
| Duplicado o redundancia | ¿Dice lo mismo que otra mejor? |
| Legibilidad en móvil | A 360 px, una imagen de 1080 px se ve al ~33 %: el texto de menos de ~30 px en el original será ilegible |
| Valor comercial | Qué pregunta responde: qué es, qué beneficio, cómo funciona, de qué está hecho, cómo se usa, qué tamaño tiene, qué incluye |
| Rol propuesto | principal, presentación, problema, funcionamiento/diferencial, características, composición, uso, detalle/medidas, lifestyle |
| Decisión | Usar (dónde) o descartar (por qué) |

### 18.3 Orden según la historia comercial (nunca por nombre, fecha ni orden de subida)

PRODUCTO → BENEFICIO / PRESENTACIÓN → PROBLEMA → CÓMO FUNCIONA / DIFERENCIAL → CARACTERÍSTICAS → COMPOSICIÓN (ingredientes o materiales) → USO → DETALLES / MEDIDAS / QUÉ INCLUYE → compra.

Si un rol no tiene imagen, se salta. Ejemplo real del sérum (galería de `#comprar`): IMAGEN 1 producto → 10 presentación y beneficios → 7 problema (bolsas y ojeras) + roller → 5 ingredientes → 4 modo de uso → 9 tamaño.

### 18.4 Imagen principal
- Siempre existe una imagen que deja claro **qué recibe el cliente**: fotografía real y limpia del producto (con su envase si viene con él), poco o ningún texto y fondo neutro.
- Va en la portada (G2), en la 1.ª posición de la galería y en la 404.
- **Nunca** es solo una infografía cargada. Si el proveedor no tiene una foto limpia, se pide o se avisa en el informe.
- Es la única imagen `eager` con `fetchpriority="high"` de la home.

### 18.5 Qué imagen va en cada sección

| Sección | Imagen | Nota |
|---|---|---|
| Portada (G2) | Principal | Obligatoria |
| Diferencial (G5) | Funcionamiento o diferencial | Si no hay, la sección puede ir sin imagen (`none`) o eliminarse |
| Composición (G6) | Composición | La lista se mantiene siempre en HTML |
| Cómo se usa (G7) | Uso | Los pasos se mantienen siempre en HTML |
| Compra (G8, galería) | Todas las seleccionadas, en el orden de la historia | 4-8 imágenes |
| Cierre (G10) | Ninguna por defecto | Composición centrada |
| 404 | Principal | — |

Una imagen puede aparecer en su sección **y** en la galería de compra, pero **no** en dos secciones del cuerpo de la home.

### 18.6 Assets: generación, nombres y cableado

**Generación.** Desde `referencias/` a `assets/`, en WebP de 480, 720 y 1080 px de ancho, LANCZOS, calidad 82, sin recortar ni ampliar (script en el anexo B.3). Pesos de referencia del sérum: 37-55 KB (480 px), 66-102 KB (720 px) y 114-180 KB (1080 px).

**Convención actual** (sérum): `garelon-imgNN-<slug>-<ancho>.webp`, donde NN es el número de la imagen original en `referencias/`:
- asset `garelon-img01-producto-1080.webp`, clave `img01-producto`;
- excepción: la clave `img04-uso` apunta a `garelon-img04-modo-de-uso`.

**Convención recomendada desde la próxima migración:** separar marca y producto.
- **Marca (permanente):** `garelon-<nombre>`. Ya existen y no se renombran: `garelon-logo-*`, `garelon-isotipo-96`, `garelon-wordmark-480`, `garelon-favicon-32`, `garelon-apple-touch-180`.
- **Producto (temporal):** `producto-<rol>-<ancho>.webp`, con la clave igual al rol. Roles:
  - `principal`, `presentacion`, `problema`, `funcionamiento`, `caracteristicas`;
  - `composicion`, `uso`, `medidas`, `incluye`, `lifestyle`, `detalle`.
  - Si hay dos del mismo rol: `uso-2`.
- **Ventaja:** las opciones de los selects `fallback_image` pasan a ser **estables entre productos** («Imagen principal», «Uso»…) y cada migración solo cambia archivos y textos alternativos.

**Archivos que hay que actualizar a la vez** (si no, Shopify rechaza la plantilla o se ve una imagen rota):
1. `snippets/garelon-fallback-image.liquid`: una rama `when` por clave, con `asset_name` y `asset_alt` descriptivo. **Si las imágenes nuevas no son cuadradas**, añade también una altura por clave: el snippet pasa hoy `fallback_height: 1080` fijo.
2. `snippets/garelon-gallery.liquid`: `keys` en el orden de la historia.
3. Opciones `fallback_image` en `garelon-image-text`, `garelon-ingredients`, `garelon-how-to-use` y `garelon-final-cta`, más la clave fija de `garelon-hero`. **Solo** claves que existan en `assets/`: el tema no comprueba que el archivo exista.
4. Los valores `fallback_image` de `templates/index.json`, `templates/product.json` y `templates/404.json`. Deben ser opciones válidas del select.
5. El `info` de `garelon_gallery` en `sections/featured-product.liquid`.
6. Borrar los assets del producto anterior **después** de quitar todas sus referencias (anexo B.1 y B.2).

**`referencias/`:** se dejan los originales del producto nuevo y los de marca; los originales del producto anterior se eliminan (quedan en el historial de git).

### 18.7 Galería del tema frente a multimedia de Shopify
- **Home (`featured-product`, `garelon_gallery: true`):** imágenes del tema, con el orden y la selección controlados por GARELON.
  - **Ventaja:** la historia está curada.
  - **Límite:** no cambia al elegir una variante.
  - **Si el producto tiene variantes con imagen propia** (colores, modelos), desactiva `garelon_gallery` para usar la multimedia de Shopify (Dawn), o deja la galería y comprueba que el selector de variantes sigue siendo claro.
- **Ficha, carrito, checkout, miniatura de la compra fija, Open Graph y catálogos de anuncios:** usan la **multimedia del producto de Shopify** (la que importa o conecta el proveedor).
- **Recomendación para el dueño:** subir las imágenes elegidas a la multimedia del producto en el mismo orden, tras comprobar que el proveedor (hoy CJ Dropshipping) no las sobrescribe.
- **Packs:** las variantes de pack no necesitan imagen propia; la galería del tema de la home sirve igual.

### 18.8 Textos alternativos
- En español, describiendo lo que se ve e incluyendo los datos clave del texto incrustado, en 1-2 frases.
- **Sin claims que el copy no permitiría:** el alt también es contenido.
- **Dónde viven:**
  - imágenes del tema: en `garelon-fallback-image`;
  - portada y cierre: en el código (sección 16.3);
  - imágenes del editor: en su alt de Shopify (Contenido → Archivos).
- **Decorativas:** `alt=""` y `aria-hidden` (isotipo de la cabecera y del cierre, bandera, iconos).

---

## 19. Políticas y legal ante un producto nuevo (R15)

Antes de tocar cualquier política, responde:

| Pregunta | Si la respuesta es SÍ |
|---|---|
| ¿El producto afecta a las **devoluciones**? (higiene: cosméticos abiertos, ropa interior, pendientes; productos personalizados; perecederos) | Revisar la política de devoluciones y reembolsos (Admin) y la FAQ |
| ¿Afecta a los **envíos**? (tamaño, peso, baterías de litio, líquidos, zonas no admitidas) | Revisar la política de envío y la configuración de zonas |
| ¿Hay aspectos de **higiene o seguridad**? (contacto con la piel, alérgenos, piezas pequeñas, calor, electricidad) | Añadir advertencias reales en la nota de uso, la FAQ o una pestaña de la ficha |
| ¿Cambia la **garantía**? (electrónica, mecanismos) | Revisar términos y FAQ; ajustarse a la garantía legal vigente, sin inventar garantías comerciales |
| ¿Hay **restricción de edad** o de público? (juguetes, niños, mascotas) | Advertencias y, si aplica, términos |
| ¿Hay **requisitos normativos** del producto? (etiquetado cosmético, marcado CE, instrucciones en español) | Informar al dueño; el tema no certifica nada |

- **Si todas son NO:** las políticas se mantienen sin tocar.
- **Si alguna es SÍ:** Claude Code propone el cambio en el informe, pero **no reescribe textos legales por su cuenta**. Los textos legales los publica el dueño en el Admin.

---

## 20. SEO

- **Un H1 por página (R19):**
  - home: título de la portada (`use_h1: true`); el logo de la cabecera ya no es H1;
  - ficha: título del producto (bloque `title` de `main-product`);
  - el título de la compra en la home es H2 (`heading_size: h2`);
  - páginas: título de `main-page`, con el `heading` de `contact-form` vacío para no duplicar;
  - 404: título de Dawn; el cierre es H2.
- **Jerarquía:** H2 por sección (la barra de características tiene un H2 oculto «Características»); H3 en tarjetas, pasos y preguntas de la FAQ.
- **Structured data, sin duplicar:**
  - todas las páginas: `Organization` (cabecera de Dawn);
  - home: `WebSite` (cabecera) + **un** `Product` (de `featured-product`);
  - ficha: **un** `Product` (de `main-product`).
  - No se añaden más `Product` ni esquemas manuales de reseñas. Si en el futuro se añade `FAQPage`, que sea uno por página y con las mismas preguntas visibles.
- **Metadatos:**
  - home: título y meta descripción en Admin → Tienda online → Preferencias (**cambiar en cada producto**), igual que la imagen para redes;
  - producto: en la ficha del producto del Admin (título SEO, descripción, handle);
  - etiquetas OG/Twitter: `snippets/meta-tags.liquid` de Dawn.
- **Canonical:** Dawn (`canonical_url`).
- **Indexación:** `noindex, follow` en colección, lista de colecciones y búsqueda (`layout/theme.liquid`). Plantillas y colecciones siguen funcionando.
- **Producto anterior:** si su URL deja de existir, crear una redirección `/products/<handle-anterior>` → `/` (Admin → Navegación → Redirecciones URL). Así los anuncios antiguos no dan 404.
- **Texto alternativo:** sección 18.8.

---

## 21. Accesibilidad (se mantiene siempre)

- **Estructura:**
  - HTML semántico: `section`, `nav`, `ul`/`ol`, `details`/`summary`, `fieldset`/`legend`;
  - `lang` de Dawn;
  - enlace «Saltar al contenido» de Dawn.
- **Teclado y foco:** estilos de foco de Dawn (`focus-inset`, `:focus-visible`), foco visible en las tarjetas de packs (contorno de 2 px). Los packs son radios reales en `fieldset` + `legend`, con `label` asociado; las flechas del teclado cambian de pack y el foco se mantiene tras el refresco. Cajón del menú y del carrito accesibles (Dawn: `aria-expanded`, cierre con Escape, gestión del foco).
- **Componentes:**
  - FAQ con `details`/`summary` nativos y la pregunta en H3;
  - galería con botones etiquetados (`general.slider.previous_slide`/`next_slide`) y contador con «de» oculto;
  - stock con `role="status"`;
  - pasos con «Paso N:» oculto;
  - navegación con `aria-current="page"`.
- **Contenido no visual:**
  - decorativos con `aria-hidden` (iconos, bandera, flechas, líneas de masaje);
  - isotipo con `alt=""`.
- **Contraste:**
  - texto tinta sobre crema o arena;
  - el dorado de texto pequeño es `#7A5A24` (AA sobre crema); `#B88A3B` es solo decorativo;
  - en la barra oscura, dorado claro `#D2B06A`.
- **Tamaño de los objetivos:** botones de 50 px de alto; preguntas de la FAQ de 48 px como mínimo; tarjetas de packs de 64 px como mínimo (72-96 px medidas), a todo el ancho del formulario.
- **Packs para lectores de pantalla:** «17,50 € por unidad» (la barra «/unidad» es solo visual) y «Ahorra 4,98 € frente a comprar 2 unidades por separado (39,98 €)». Agotado = radio `disabled` + texto «Agotado».
- **Movimiento:** se respeta `prefers-reduced-motion`.

---

## 22. Rendimiento

**Imágenes**
- Theme assets con `srcset` 480/720/1080 + `sizes` por sección + `width`/`height`.
- Imágenes del editor con `image_url` + `image_tag` (anchos 360-1800).
- **LCP:** la imagen de la portada, `loading="eager"` + `fetchpriority="high"`. Todas las demás `loading="lazy"` + `decoding="async"`, galería incluida.
- Solo se cargan las imágenes seleccionadas, en WebP de calidad 82: 6 imágenes × 3 anchos en el sérum. Presupuesto de 1080 px: ≤ ~200 KB por imagen.

**JavaScript**
- `garelon.js` (4,5 KB) solo en la ficha; `garelon-nav.js` (0,8 KB) con `defer`. Los packs no añaden JS: usan `<variant-selects>` y `product-info.js` de Dawn.
- La galería usa el `slider-component` de Dawn que ya está en `global.js`, sin librerías.
- Sin scripts de terceros en el tema: los píxeles de Meta y TikTok van por Admin → Eventos de clientes o por su app, no en `theme.liquid`.

**CSS y fuentes**
- CSS: un solo archivo propio (`garelon.css`, 24 KB sin minificar), cargado tras `base.css`. `component-slider.css` solo donde hay galería.
- Fuentes de la biblioteca de Shopify, con precarga (Dawn) y `font-display: swap`. Solo 2 familias.

**Reglas nuevas:** sin vídeo en reproducción automática salvo que se pida; ninguna librería JS nueva para algo que ya haga Dawn.

---

## 23. Dependencias (NO TOCAR salvo indicación)

| Dependencia | Qué es | Quién depende de ella | Estado |
|---|---|---|---|
| `assets/global.js` | `SliderComponent`, `QuantityInput`, utilidades de menú y foco | Galería GARELON, cantidad, cajones | **NO TOCAR** |
| `assets/pubsub.js`, `assets/constants.js` | Eventos `PUB_SUB_EVENTS` (`cartUpdate`, `variantChange`) | Carrito, `garelon.js` | **NO TOCAR** |
| `assets/product-info.js` | Cambio de variante: actualiza precio, botón, `#Inventory-<sección>`, multimedia y URL | `garelon-stock`, compra fija | **NO TOCAR** |
| `assets/product-form.js` + `snippets/buy-buttons.liquid` | Añadir al carrito por AJAX y abrir el cart drawer | Toda la compra; compra fija (pulsa `#ProductSubmitButton-<sección>`) | **NO TOCAR** |
| `assets/cart-drawer.js`, `cart.js`, `cart-notification.js` + `snippets/cart-drawer.liquid`, `sections/cart-drawer.liquid`, `main-cart-*` | Carrito | Compra | **NO TOCAR** (salvo «Seguir comprando», ya hecho) |
| `header-drawer` (en `sections/header.liquid`, Dawn) | Menú móvil (`closeMenuDrawer`) | `garelon-nav.js` | **NO TOCAR** |
| `assets/component-slider.css` | Estilos del carrusel | `garelon-gallery` | **NO TOCAR** |
| `content_for_header` (en `layout/theme.liquid`) | Scripts de Shopify, apps, analítica y píxeles | Apps, eventos | **NO TOCAR** |
| **Funciones de Shopify** | Objeto `product`, variantes, inventario, pago dinámico (`payment_button`), cuentas de cliente (`routes.account_url`), API AJAX del carrito, Section Rendering API, políticas, páginas, búsqueda predictiva, checkout | Todo | Uso nativo; **no reimplementar** |
| **Apps** | No hay ninguna en el código. Admite app blocks (`@app`) en la ficha, la cabecera, el pie y la sección `apps`. Reseñas: app + bloque. | — | Instalar solo desde el Admin |
| **Proveedor / fulfillment (hoy CJ Dropshipping; antes AutoDS)** | **Sin dependencia de código.** Su app actúa sobre los datos del producto en el Admin (según su configuración: variantes, SKU, inventario, a veces precio o imágenes) y hace el fulfillment. El tema lo lee todo de forma dinámica. | Producto, variantes (packs), stock, pedidos | **NO TOCAR** desde el tema. Comprobar en la app que no sobrescriba título, descripción, imágenes, nombres de variante ni precios editados en Shopify, y que cada variante esté emparejada con la suya (sección 15.5). |
| **Contrato de `<variant-selects>` (packs)** | `garelon-packs` pinta el `<variant-selects id="variant-selects-<sección>">` que esperan `global.js` (`VariantSelects`) y `product-info.js`: `fieldset` + radios con `form`, `data-option-value-id`, `data-product-url`, `data-option-name` y el JSON `[data-selected-variant]` | Packs, compra fija | **NO TOCAR** `VariantSelects` ni `product-info.js`. Si se actualiza Dawn, verificar este contrato. |
| **GARELON JS propio** | `garelon.js` depende de: `#ProductSubmitButton-<sección>`, `#price-<sección>`, `#variant-selects-<sección> input:checked` (`data-pack-label`), `product-info[id^="MainProduct-"]`, `PUB_SUB_EVENTS.variantChange`. `garelon-nav.js` depende de `header-drawer.closeMenuDrawer`. | Compra fija, menú | Si se actualiza Dawn, verificar estos ids |

**Actualizar Dawn** a una versión mayor no forma parte de una migración de producto. Si algún día se hace, es un proyecto aparte: repetir los cambios de la sección 6.6.

---

## 24. CRO y tráfico móvil de anuncios

**Principios en uso (se mantienen)**
1. **Comprensión en 3-5 s:** en la primera pantalla móvil caben la imagen del producto real, la marca, un H1 con el beneficio, una frase de qué es, el **precio real** y el **CTA**.
   - Medido: visible a 360×740, 375×667, 390×844 y 430×932. A 320×640 el CTA queda 28 px por debajo.
2. **CTA temprano y repetido con moderación:** portada, compra embebida y cierre, todos hacia `#comprar`. Más 1 enlace informativo («Cómo se usa»).
3. **Explicación progresiva:** características → problema y beneficios → diferencial → composición → uso → compra → dudas → cierre.
4. **Comprar sin salir de la home, pronto:** formulario real justo después de la portada, con packs (variantes reales, ahorro transparente, 1 unidad por defecto), stock honesto, plazos estimados, pago dinámico y galería curada.
5. **Precio claro:** siempre visible y dinámico; tachado solo si es real.
6. **Confianza sin inventos:**
   - hechos verificables;
   - barra de servicio en la ficha (pago seguro, atención, envío, devoluciones) enlazada a páginas reales;
   - FAQ que remite a las políticas.
7. **Carrito simple:** cajón sin upsells, notas ni sorpresas.
8. **Menú mínimo:** 4 enlaces. Sin catálogo, búsqueda ni cuenta en la barra móvil.
9. **Compra fija en la ficha (móvil):** para quien llega a `/products/...` desde anuncios de catálogo.
10. **Sin dark patterns:** ni cuentas atrás, ni stock falso, ni reseñas falsas, ni pop-ups, ni casillas premarcadas, ni urgencia inventada.

**Anuncios**
- **Destino recomendado:** la home (`/`) para anuncios de marca o creatividad; la ficha (`/products/<handle>`) para anuncios de catálogo o dinámicos (Meta/TikTok usan la multimedia de Shopify).
- `/#comprar` solo si el anuncio ya lo ha explicado todo.

---

## 25. Proceso de migración paso a paso (Claude Code)

**F0 · Preparación e inspección**
- Lee este documento entero y el prompt adaptado.
- Trabaja en la rama indicada (`{{GIT_BRANCH}}`); créala desde la rama por defecto si no existe.
- Comprueba:
  - `config/settings_schema.json` → `theme_version: 16.0.0` y `theme_name: GARELON (Dawn)`;
  - que existen los archivos de la sección 6 (`ls sections/garelon-* snippets/garelon-*`);
  - la línea base de Theme Check: 0 errores y 9 avisos de Dawn (anexo B.4);
  - el validador de plantillas: OK (anexo B.2).
- **Versión en vivo:** si el dueño ha editado desde el editor de temas después de la última entrega, el repositorio no tiene esos cambios.
  - Si el prompt trae el ZIP del tema publicado, compáralo con el repositorio (sobre todo `templates/*.json`, `sections/*-group.json` y `config/settings_data.json`) e incorpora esos cambios antes de empezar.
  - Si no se sabe, pregúntalo o indícalo como riesgo en el informe.
- Localiza las imágenes nuevas (`referencias/` o adjuntas) y los datos del producto.

**F1 · Inventario del producto anterior**
- Lista sus assets: `ls assets | grep -E '^(garelon-img|producto-)'`. Los de marca (`garelon-logo*`, `garelon-isotipo*`, `garelon-wordmark*`, `garelon-favicon*`, `garelon-apple-touch*`) no entran.
- Lista sus textos: `grep` del anexo B.1 con los términos de `{{PREVIOUS_PRODUCT_TERMS}}`.
- Guarda la salida: al final debe quedar vacía.

**F2 · Análisis de imágenes**
- Tabla de la sección 18.2 para **todas** las imágenes.
- Selección (5-8) y orden de la historia (18.3). Imagen principal (18.4). Asignación por sección (18.5).

**F3 · Plan**
- Qué secciones quedan en la home y en qué orden (9.2) y la adaptación por categoría (9.3).
- Copy por sección (17), cambios de navegación o anclas, cambios de código de la sección 16.3.
- Si el prompt adaptado trae decisiones que contradicen lo que ves en las imágenes o los datos, prevalece la verdad del producto (R1/R3) y lo anotas.

**F4 · Assets**
1. Genera los WebP (anexo B.3).
2. Actualiza `garelon-fallback-image`, `garelon-gallery`, las opciones `fallback_image` y los valores de las plantillas, todo a la vez (18.6).
3. Solo cuando no queden referencias, borra los assets y originales del producto anterior. **Nunca** borres assets de marca.

**F5 · Contenido**
- Reescribe `templates/index.json`, `templates/product.json`, `templates/page.faq.json` y `templates/404.json`, y los textos fijos del código (16.3).
- Actualiza `brand_description` en `config/settings_data.json`.
- **Producto:** las secciones con ajuste `product` (portada, imagen y texto, cierre, compra) usan, si está vacío, el primer producto de la tienda.
  - Si se conoce `{{PRODUCT_HANDLE}}`, escríbelo en ese ajuste de los JSON: Shopify guarda el handle.
  - Si no se conoce, déjalo vacío y avisa al dueño: debe retirar el producto anterior del canal Tienda online o elegir el nuevo en el editor.
- Nada de precios, variantes ni stock escritos a mano.

**F6 · Navegación y anclas**
- Ajusta etiquetas y anclas si la categoría lo pide (9.3).
- Comprueba que cada enlace `/#…` tiene su sección con ese `anchor`.

**F7 · Limpieza obligatoria del producto anterior**

Busca y elimina restos en:
- **Código y contenido:** Liquid, JSON, JS y CSS (también comentarios); schemas (valores por defecto, presets, `info`); textos alternativos.
- **Páginas y bloques:** FAQ (home, ficha y `page.faq`); bloques ocultos o desactivados (`"disabled": true`) con contenido viejo; ficha de producto (antetítulo, subtítulo, destacados, pestañas); 404.
- **Marca, SEO y assets:** descripción de marca; SEO y alt; assets y `referencias/`.
- **Comprobación visual:** repasa móvil y escritorio.

El `grep` del anexo B.1 debe devolver **0 resultados** (salvo falsos positivos de Dawn: `AbortController` contiene «roller» y los locales de Dawn contienen «contorno»). No dejes contenido huérfano.

**F8 · Validación**

Ejecuta las pruebas de la sección 26 y corrige lo que falle. No se da por bueno nada que no se haya comprobado.

**F9 · Entrega**
- Crea `GARELON-CAMBIOS-<PRODUCTO>.md` en la raíz, con lo hecho y las tareas del Admin. Si el dueño instala por ZIP, genera el ZIP del tema (solo las carpetas del tema: `assets config layout locales sections snippets templates`).
- Commit con un mensaje descriptivo y push a la rama. Informe de la sección 27.

**Tareas del Admin que el dueño hace en cada migración** (Claude Code las lista, no las puede hacer):
1. Importar o conectar el producto con el proveedor actual (hoy CJ Dropshipping) y revisar su sincronización (que no sobrescriba título, descripción, imágenes, nombres de variante ni precios editados). Si hay packs: una variante por pack («1 unidad» primero), cada una emparejada con su variante del proveedor, precio en Shopify, sin precio comparado y sin descuentos automáticos que se acumulen.
2. En Shopify:
   - título limpio;
   - descripción sin claims prohibidos;
   - multimedia en el orden de la historia (opcional);
   - SEO del producto.
3. Retirar el producto anterior del canal Tienda online o archivarlo, y crear la redirección de su URL a `/`.
4. En el editor, elegir el producto nuevo en Portada, Imagen y texto, Llamada final y Producto destacado (si el anterior sigue publicado).
5. Admin → Preferencias: título y meta descripción de la home e imagen para redes.
6. Revisar las políticas si la sección 19 lo pide, y las zonas de envío.
7. Actualizar los píxeles o el catálogo de anuncios si dependen del producto.
8. Duplicar el tema publicado como copia de seguridad, subir el nuevo, revisar la **Vista previa** con la checklist y publicar.

---

## 26. Pruebas obligatorias (resumen; detalle en la checklist)

- **Estáticas:**
  - JSON válido;
  - validador de plantillas y schemas (anexo B.2) OK;
  - Theme Check con 0 errores (línea base: 9 avisos, los mismos que Dawn 16.0.0);
  - 0 restos del producto anterior (anexo B.1);
  - todos los assets referenciados existen.
- **Render y responsive** a 320, 360, 375, 390, 430, 768, 1024 y 1440 px, en un render real de Shopify si es posible (`shopify theme dev` o Vista previa) o en un render local con datos simulados, diciéndolo:
  - sin scroll horizontal;
  - cabecera móvil de 56 px sin solapes;
  - barra superior en 1 línea;
  - menú de escritorio en 1 fila;
  - precio y CTA en la primera pantalla a 360-430 px.
- **Interacción:**
  - menú móvil (enlaces, Búsqueda/Cuenta, cierre al pulsar un ancla);
  - CTAs → `#comprar`;
  - galería (flechas, contador, deslizar);
  - FAQ con teclado;
  - sin errores de JavaScript en consola.
- **Packs (local con el JS real de Dawn y después en Shopify):**
  - cada tarjeta selecciona su variante (id real) y actualiza precio, stock, botón, URL y compra fija;
  - precio por unidad, ahorro e insignia correctos; nada tachado;
  - `?variant=` marca su tarjeta; variante agotada desactivada;
  - «Añadir al carrito» envía el id del pack con `quantity=1`; el carrito muestra «Pack: N unidades» × 1.
- **Compra (solo verificable en Shopify real):**
  - variante → precio y stock;
  - añadir → cart drawer;
  - cantidad y eliminar;
  - «Finalizar compra» → checkout de Shopify;
  - botones de pago dinámico;
  - compra fija en la ficha;
  - estado agotado;
  - pedido de prueba de cada pack y comprobación en el proveedor (variante, cantidad 1, dirección y método de envío).
- **Enlaces:** navegación, pie (Contacto + políticas + cookies), FAQ, pestañas y barra de servicio → destinos reales; sin `href="#"` salvo los selectores de país e idioma de Dawn (desactivados).
- **SEO:** 1 H1 por página, JSON-LD sin duplicar, alts presentes y correctos, `noindex` en colección y búsqueda.

---

## 27. Informe final que debe entregar Claude Code

1. Archivos modificados, creados y borrados.
2. Imágenes analizadas: tabla completa (18.2) con las usadas (sección y posición en la galería) y las descartadas (motivo).
3. Orden final de la home y qué secciones se quitaron o añadieron.
4. Claims transformados o eliminados, y textos dudosos dentro de imágenes usadas.
5. Cambios de código fuera del contenido, con su justificación.
6. Evidencia de limpieza: salida vacía del `grep` del anexo B.1.
7. Pruebas hechas y resultado (con medidas), y **lo que no se pudo probar**.
8. Políticas: respuestas a la sección 19.
9. Tareas del Admin para el dueño (25, F9).
10. Riesgos o dudas pendientes.

---

## 28. Futuro con varios productos (solo cuando el dueño lo pida explícitamente)

Mientras haya un solo producto, **no** se muestran Catálogo, colecciones ni búsqueda destacada. Si el dueño indica que GARELON pasa a vender varios productos:

1. Cabecera: `nav_source: shopify` con un menú del Admin que incluya el Catálogo, o añadir «Catálogo» a `garelon-nav`. Desactivar `hide_catalog_links`.
2. Quitar el `noindex` de colección y lista de colecciones en `layout/theme.liquid` (la búsqueda puede seguir en `noindex`).
3. Elegir un producto concreto en cada sección con ajuste `product`: el valor por defecto `collections.all.products.first` deja de servir.
4. Contenido por producto: crear plantillas alternativas (`product.<handle>.json`) o usar metafields para beneficios, ingredientes, uso y FAQ, en lugar de textos comunes en `product.json`.
5. Sustituir la galería del tema por la multimedia de cada producto (`garelon_gallery: false`).
6. Valorar si la búsqueda vuelve a la barra móvil sin tapar el logo (R18 sigue vigente).
7. Revisar el estilo de las tarjetas de producto y colección de Dawn con los esquemas GARELON.

---

## 29. Instrucciones para ChatGPT (cómo producir el prompt final)

1. Lee el brief y mira **todas** las imágenes. Detecta duplicados, erratas, marca o etiqueta distinta del producto real, claims y antes/después.
2. Rellena la sección 1 (NEW PRODUCT DATA). Lo que no esté verificado → `NO DISPONIBLE`.
3. Si mejoras imágenes, respeta la sección 18.1 y anota en `{{PRODUCT_IMAGE_NOTES}}` qué cambiaste.
4. Clasifica el producto (9.3) y decide las secciones de la home (9.2): cuáles se quedan, cuáles se eliminan y si hace falta un `garelon-image-text` extra.
5. Redacta el copy de cada sección con las reglas y longitudes de la sección 17. Incluye la FAQ completa y la nota de precaución.
6. Propón el uso de las imágenes (rol, sección y orden de la galería). Claude Code lo confirmará o corregirá tras verlas.
7. Responde a las preguntas de políticas (19).
8. Genera el prompt final con esta estructura:

```text
Quiero adaptar la tienda Shopify GARELON a un nuevo producto: {{PRODUCT_NAME}}.
Repositorio: TIENDA-CASTOR-OIL · Rama: {{GIT_BRANCH}}.
Sigue GARELON_MASTER_TEMPLATE.md (docs/garelon/) como especificación; ante conflicto,
mandan sus reglas permanentes (sección 3).

1. NEW PRODUCT DATA (rellenado)
2. Producto anterior a limpiar: {{PREVIOUS_PRODUCT_NAME}} · términos: {{PREVIOUS_PRODUCT_TERMS}}
3. Imágenes entregadas (lista) y propuesta de uso (rol · sección · orden)
4. Estructura de la home decidida (G2…G10) y cambios de navegación/anclas
5. Copy por sección (portada, características, beneficios, diferencial, composición,
   uso, compra, FAQ, cierre, ficha de producto, 404, descripción de marca)
6. Claims permitidos / prohibidos y textos dudosos en imágenes
7. Políticas: respuestas de la sección 19
8. Instrucciones: ejecuta la sección 25 (F0-F9), las pruebas de la 26 y entrega el informe de la 27.
   No modifiques el diseño, la cabecera, el pie, el carrito ni el checkout.
```

9. Adjunta el documento maestro completo al prompt, o asegúrate de que Claude Code lo tiene en `docs/garelon/`. No resumas ni suavices las reglas permanentes.
10. No cambies colores, tipografía, estructura ni reglas: si crees que algo del sistema debería cambiar, propónlo aparte al dueño.

---

## Anexo A · Valores actuales del producto de referencia (sérum de contorno de ojos)

Sirven como ejemplo resuelto y como lista de lo que hay que sustituir en la primera migración.

### A.1 Datos
| Variable | Valor del sérum |
|---|---|
| `PRODUCT_NAME` | Sérum para el contorno de ojos con aceite de ricino y aplicador roller |
| `PRODUCT_SHORT_NAME` | el sérum («Comprar el sérum») |
| `PRODUCT_TITLE_SHOPIFY` (propuesto) | Sérum contorno de ojos con aceite de ricino · Roller 10 ml |
| `PRODUCT_ORIGINAL_TITLE` | Título del proveedor en inglés con «Anti-wrinkle Remove Dark Circles…» (no publicable; así llegó desde AutoDS) |
| `PRODUCT_PACKS` | Opción «Pack»: 1 unidad (19,99 €) · 2 unidades (35,00 €) · 3 unidades (48,00 €). Precios en Shopify, no en el tema. En CJ, «3 unidades» es la variante «3 piezas». |
| `PRODUCT_SUPPLIER` | CJ Dropshipping · CJPacket Euro Cosmetic Line (interno). Antes: AutoDS. |
| `SHIPPING_ESTIMATE_TEXT` | «Preparación estimada: 1–3 días.» · «Entrega estimada en España: aproximadamente 8–16 días.» · «Los plazos pueden variar según destino y transporte.» |
| `PRODUCT_PHYSICAL_BRAND` | Baafven |
| `PRODUCT_CONTENT` | Frasco de vidrio ámbar de 10 ml (0.34 fl oz) con roller de bola metálica y tapón negro, en su caja |
| `PRODUCT_INGREDIENTS` | Ricinus Communis (Castor) Seed Oil, Acetyl Tripeptide-1, Collagen, Boswellia Serrata Extract, Aqua |
| `PRODUCT_DIMENSIONS` | Caja 8,7 × 2,2 × 2,2 cm; frasco ≈ 8,4 cm de alto × 1,9 cm de ancho |
| `PRODUCT_HOW_TO_USE` | 1 Limpia (limpia y seca el rostro y el contorno) · 2 Aplica (presiona y desliza el roller) · 3 Masajea (con la bola metálica) |
| `PRODUCT_WARNINGS` | Solo para uso externo. Evita el contacto directo con los ojos. Si notas cualquier molestia, interrumpe su uso. |
| `PRODUCT_MAIN_BENEFIT` | Una mirada con aspecto más descansado |
| `PRODUCT_SECONDARY_BENEFITS` | Ojeras (apariencia), bolsas (masaje y rutina), líneas finas (apariencia más suave), hidratación |
| `PRODUCT_DIFFERENTIATOR` | Aplicador roller con bola metálica |
| `PRODUCT_FEATURES` | Aplicación precisa · Roller metálico · Rutina en 3 pasos · Fórmula con aceite de ricino |
| `ANNOUNCEMENT_TEXT` | Envío disponible a toda España (+ bandera) |

### A.2 Imágenes (10 entregadas)
| Original | Decisión | Rol / sección | Clave · asset |
|---|---|---|---|
| IMAGEN 1 | Usada | Principal: portada, galería n.º 1, 404 | `img01-producto` · `garelon-img01-producto-*` |
| IMAGEN 10 | Usada | Presentación y beneficios: galería n.º 2 | `img10-presentacion` · `garelon-img10-presentacion-*` |
| IMAGEN 7 | Usada | Problema + diferencial (roller): sección `roller`, galería n.º 3 | `img07-roller` · `garelon-img07-roller-*` |
| IMAGEN 5 | Usada | Composición: sección `ingredients`, galería n.º 4 | `img05-ingredientes` · `garelon-img05-ingredientes-*` |
| IMAGEN 4 | Usada | Uso: sección `how_to` (home y ficha), galería n.º 5 | `img04-uso` · `garelon-img04-modo-de-uso-*` |
| IMAGEN 9 | Usada | Medidas: galería n.º 6 | `img09-tamano` · `garelon-img09-tamano-*` |
| IMAGEN 2 | Descartada | Errata «descanșada»; redundante con IMAGEN 10 | — |
| IMAGEN 3 | Descartada | Etiqueta «Baufven» ≠ «Baafven» (no es el envase real); claims menos prudentes; muy cargada | — |
| IMAGEN 6 | Descartada | Antes/después sin respaldo | — |
| IMAGEN 8 | Descartada | Antes/después; su papel ya lo cubre IMAGEN 7 | — |

### A.3 Assets del producto (temporales) que se borran en la primera migración
`assets/garelon-img01-producto-{480,720,1080}.webp`, `garelon-img04-modo-de-uso-*`, `garelon-img05-ingredientes-*`, `garelon-img07-roller-*`, `garelon-img09-tamano-*`, `garelon-img10-presentacion-*` (18 archivos) y `referencias/IMAGEN 1.png` … `IMAGEN 10.png`.

### A.4 Términos que no deben quedar tras la primera migración
`sérum`, `serum`, `contorno`, `ojos`, `mirada`, `ojeras`, `bolsas`, `líneas finas`, `roller`, `bola metálica`, `masaje`, `masajea`, `ricino`, `castor`, `Ricinus`, `Tripeptide`, `colágeno`, `Collagen`, `Boswellia`, `10 ml`, `0.34`, `8,7`, `8,4`, `Baafven`, `ámbar`, `IMAGEN 1`…`IMAGEN 10`, `img01`, `img04`, `img05`, `img07`, `img09`, `img10`, `Cuidado diario para tu mirada`, `Comprar el sérum`, `Ver el sérum`.

---

## Anexo B · Comandos útiles (ejecutar desde la raíz del repositorio)

### B.1 Buscar restos del producto anterior

Ajusta la lista de términos. El alcance evita los falsos positivos de Dawn.

```bash
grep -rnI -i -E 'sérum|serum|contorno|ojos|mirada|ojeras|bolsas|roller|ricino|castor|colágeno|boswellia|baafven|10 ml|img0[0-9]|img10|IMAGEN [0-9]' \
  sections/garelon-*.liquid snippets/garelon-*.liquid assets/garelon* \
  sections/header.liquid sections/footer.liquid sections/featured-product.liquid sections/main-product.liquid \
  sections/announcement-bar.liquid sections/*-group.json templates config/settings_data.json layout/theme.liquid
ls assets | grep -E '^(garelon-img|producto-)'
ls referencias
```

### B.2 Validar plantillas, schemas y assets

Detecta:
- ajustes inexistentes;
- valores de select no válidos (Shopify rechazaría la plantilla);
- bloques inexistentes;
- entradas de `order` o `block_order` sin sección o bloque;
- assets referenciados que no existen;
- claves de imagen sin sus 3 anchos.

```python
import glob, json, os, re

def load_json(path):
    text = open(path, encoding='utf-8').read()
    text = re.sub(r'^\s*/\*.*?\*/', '', text, flags=re.S)  # comentario que añade Shopify al exportar
    return json.loads(text)

def load_schema(section_type):
    path = f'sections/{section_type}.liquid'
    if not os.path.exists(path):
        return None
    src = open(path, encoding='utf-8').read()
    m = re.search(r'{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}', src, re.S)
    return json.loads(m.group(1)) if m else {}

errors = []

def check_settings(values, definitions, where):
    by_id = {d['id']: d for d in definitions if 'id' in d}
    for key, value in values.items():
        d = by_id.get(key)
        if d is None:
            errors.append(f'{where}: ajuste «{key}» no existe en el schema')
        elif d['type'] == 'select' and value not in [o['value'] for o in d['options']]:
            errors.append(f'{where}: {key} = {value!r} no es una opción del select')

for tpl in sorted(glob.glob('templates/*.json') + glob.glob('sections/*-group.json')):
    data = load_json(tpl)
    for sid, sec in data.get('sections', {}).items():
        schema = load_schema(sec['type'])
        if schema is None:
            errors.append(f'{tpl}: la sección «{sid}» usa el tipo inexistente {sec["type"]}')
            continue
        check_settings(sec.get('settings', {}), schema.get('settings', []), f'{tpl} › {sid}')
        block_defs = {b['type']: b for b in schema.get('blocks', [])}
        for bid, blk in sec.get('blocks', {}).items():
            if blk['type'].startswith('shopify://'):
                continue  # bloque de app
            bdef = block_defs.get(blk['type'])
            if bdef is None:
                errors.append(f'{tpl} › {sid}: bloque «{bid}» de tipo inexistente {blk["type"]}')
                continue
            check_settings(blk.get('settings', {}), bdef.get('settings', []), f'{tpl} › {sid} › {bid}')
        for bid in sec.get('block_order', []):
            if bid not in sec.get('blocks', {}):
                errors.append(f'{tpl} › {sid}: block_order cita «{bid}», que no existe')
    for sid in data.get('order', []):
        if sid not in data.get('sections', {}):
            errors.append(f'{tpl}: order cita «{sid}», que no existe')

# Cada asset que se referencia con 'nombre' | asset_url debe existir
for path in glob.glob('sections/*.liquid') + glob.glob('snippets/*.liquid') + glob.glob('layout/*.liquid'):
    src = open(path, encoding='utf-8').read()
    for name in re.findall(r"'([\w.-]+\.(?:webp|png|jpg|svg|css|js))'\s*\|\s*asset_url", src):
        if not os.path.exists(f'assets/{name}'):
            errors.append(f'{path}: asset inexistente {name}')

# Cada clave de garelon-fallback-image debe tener sus 3 anchos en assets/
fallback = open('snippets/garelon-fallback-image.liquid', encoding='utf-8').read()
for base in re.findall(r"assign asset_name = '([\w-]+)'", fallback):
    for w in ('480', '720', '1080'):
        if not os.path.exists(f'assets/{base}-{w}.webp'):
            errors.append(f'garelon-fallback-image: falta assets/{base}-{w}.webp')

print('\n'.join(errors) if errors else 'OK: plantillas, schemas y assets coherentes')
```

Probado sobre el commit `755240b`: devuelve `OK`. Con un valor de select inventado, un ajuste inexistente o un asset borrado, lo detecta.

### B.3 Convertir imágenes a WebP (sin recortar, filtrar ni ampliar)

```python
from pathlib import Path
from PIL import Image

SRC = Path('referencias')
OUT = Path('assets')
WIDTHS = (480, 720, 1080)
PLAN = {
    # 'nombre original.png': 'nombre-base-del-asset',
    'IMAGEN 1.png': 'producto-principal',
}

for original, base in PLAN.items():
    im = Image.open(SRC / original)
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB')
    for w in WIDTHS:
        if im.width < w:
            print(f'AVISO: {original} mide {im.width}px; no se amplía a {w}px')
            continue
        h = round(im.height * w / im.width)
        out = OUT / f'{base}-{w}.webp'
        im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
        print(out, f'{w}x{h}', out.stat().st_size // 1024, 'KB')
```

Con `IMAGEN 1.png` produce 37, 66 y 114 KB, igual que los assets actuales.

### B.4 Theme Check

Instálalo fuera del tema, en una carpeta temporal:

```bash
mkdir -p /tmp/theme-check && cd /tmp/theme-check && npm init -y >/dev/null && npm install @shopify/theme-check-node
cat > check.js <<'JS'
const { themeCheckRun } = require('@shopify/theme-check-node');
const path = require('path');
(async () => {
  const root = path.resolve(process.argv[2]);
  const { offenses } = await themeCheckRun(root, undefined, () => {});
  const sev = ['error', 'warning', 'info'];
  for (const o of offenses) console.log(`${sev[o.severity]}\t${o.check}\t${o.uri.replace('file://' + root + '/', '')}:${o.start.line + 1}\t${o.message.slice(0, 160)}`);
  const c = {}; offenses.forEach(o => c[sev[o.severity]] = (c[sev[o.severity]] || 0) + 1);
  console.log('TOTAL', JSON.stringify(c));
})();
JS
node /tmp/theme-check/check.js /ruta/al/repositorio
```

Con Shopify CLI instalado vale igual `shopify theme check`.

**Línea base del commit `755240b`:** 0 errores y 9 avisos, todos de Dawn 16.0.0 original: `OrphanedSnippet` quick-order-product-row, `VariableName` ×2, `UnusedAssign` ×2, `LiquidComplexity` facets, `UndefinedObject` ×3. Cualquier aviso nuevo es de la migración y se corrige.

### B.5 Empaquetar el tema para subirlo por ZIP

```bash
zip -r garelon-theme.zip assets config layout locales sections snippets templates -x '*.DS_Store'
```

---

*Fin del GARELON MASTER STORE TEMPLATE. La tienda actual es el estándar de calidad: ante la duda, mira cómo está hecha y hazlo igual.*
