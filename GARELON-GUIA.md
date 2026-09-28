# GARELON · Guía del theme

Theme basado en **Dawn 16.0.0** (theme oficial de Shopify, Online Store 2.0), con una capa de marca GARELON encima.
No hay ningún dato comercial fijo en el código: precio, precio comparado, variantes, stock, imágenes de la galería y SKU salen siempre del producto de Shopify que sincroniza AutoDS.

---

## 1. Cómo previsualizarlo (sin publicarlo)

**Opción A – Conectar GitHub (recomendada)**
1. Shopify Admin → *Tienda online → Temas → Añadir tema → Conectar desde GitHub*.
2. Elige el repositorio `TIENDA-CASTOR-OIL` y la rama `claude/great-lamport-8mb0rc`.
3. El tema aparece en la *Biblioteca de temas* **sin publicar**. Pulsa *Personalizar* o *Vista previa*.
4. Publícalo solo cuando lo hayas revisado.

**Opción B – Shopify CLI**
```bash
shopify theme dev --store TU-TIENDA.myshopify.com        # previsualización local con datos reales
shopify theme push --unpublished --store TU-TIENDA.myshopify.com
```
La carpeta `referencias/` y los `.md` están en `.shopifyignore` y no se suben.

---

## 2. Tareas en Shopify Admin (el theme no puede hacerlas)

| # | Dónde | Qué hacer |
|---|-------|-----------|
| 1 | Configuración → Idiomas | Idioma principal **Español**. El theme usa `locales/es.json` (ajustado a España: «Añadir al carrito», «En stock»…). |
| 2 | Productos → el sérum | **Cambia el título.** El de AutoDS («…Anti-wrinkle Remove Dark Circles…») promete *eliminar* ojeras. Propuesta: `Sérum contorno de ojos con aceite de ricino · Roller 10 ml`. |
| 3 | Productos → el sérum | **Revisa la descripción.** Las descripciones importadas suelen traer ingredientes o promesas que no son ciertos (ácido hialurónico, «resultados en X días»…). Deja solo lo que coincida con la información real. |
| 4 | AutoDS | Comprueba que la sincronización **no sobrescriba título ni descripción** (solo precio/stock). |
| 5 | Productos → el sérum → Multimedia | Opcional: sube IMAGEN 1, 10, 7, 5, 4 y 9 en ese orden (apartado 3.1) para que la ficha de producto, el carrito y el checkout usen la misma campaña. Antes, comprueba que AutoDS no sobrescriba las imágenes. |
| 6 | Tienda online → Páginas | **Contacto:** usa la página que ya existe (no crees otra) y asígnale la plantilla `contact` para que muestre el formulario. El theme la encuentra sola si su identificador es `contact`, `contacto`, `contactanos`, `contacta-con-nosotros` o `contact-us`. Si tiene otro, elígela en *Personalizar → Configuración del tema → GARELON · Enlaces*. **Preguntas frecuentes:** identificador `preguntas-frecuentes`, plantilla `faq` (el contenido puede quedar vacío). |
| 7 | Configuración → Políticas | En **Política de reembolso** pega el texto de `GARELON-POLITICA-DEVOLUCIONES.md`. Completa también: Privacidad, Términos del servicio, Envío, Información de contacto y Aviso legal. El theme **no inventa** texto legal ni datos de empresa (dirección, NIF, email, teléfono). Aparecen solas en el pie de página. |
| 8 | Tienda online → Navegación | **Nada que hacer.** La cabecera usa la navegación GARELON (Inicio · Ingredientes · Preguntas frecuentes · Contacto) y nunca enlaza al catálogo. Se cambia en *Personalizar → Cabecera*. Si eliges «El menú de Shopify», los enlaces al catálogo y a colecciones se ocultan igualmente. |
| 9 | Tienda online → Navegación | El bloque **Ayuda** del pie ya no depende de un menú: trae su texto y el enlace a contacto. Si enlazas páginas o políticas en tus menús, elígelas desde el selector (no escribas la URL a mano) y comprueba que existan y estén publicadas. |
| 10 | Configuración → Envío y entrega | Crea la zona **España**. La barra superior dice «Envío disponible a toda España» (con bandera); no promete envío gratis ni plazos. |
| 11 | Configuración → Privacidad del cliente · Tienda online → Páginas | Activa el **banner de cookies de Shopify** si lo necesitas (el theme no añade uno propio). Crea la página **Política de cookies** con identificador `politica-de-cookies` (o elígela en *Configuración del tema → GARELON · Enlaces*): el pie la enlaza en cuanto existe. |
| 12 | Apps | Para reseñas, instala una app (p. ej. Judge.me o Product Reviews) y añade su bloque en *Personalizar → Producto → Añadir bloque → Apps*. Sin app no se muestra ninguna estrella. |
| 13 | Personalizar → Configuración del tema → Redes sociales | Añade solo las redes que tengas. Vacías = no se muestran. |


### Pago con tarjeta y pagos exprés en el checkout
El checkout lo controla Shopify: el theme no tiene acceso a su contenido. Shopify muestra arriba el bloque **Pago exprés** (Shop Pay, PayPal…) y debajo el pago con tarjeta, y no ofrece ningún ajuste para cambiar ese orden. No se ha tocado nada con CSS ni JavaScript. Opciones oficiales:
- **Cualquier plan:** una app de *personalización de pagos* de la Shopify App Store (*Configuración → Pagos → Personalizaciones de métodos de pago*) permite reordenar, renombrar u ocultar métodos en la lista de pago. No mueve el bloque exprés.
- **Shopify Plus:** con una app propia (Shopify Functions, *Payment Customization API*) se pueden ocultar métodos solo del bloque exprés.
- **Quitar un método exprés** (*Configuración → Pagos → Shopify Payments → Gestionar → Wallets*, o los ajustes de PayPal) es posible, pero **no se ha hecho**: requiere tu autorización.

---

## 3. Imágenes: dónde va cada una

Las 7 imágenes de producto anteriores y sus recortes se han eliminado del tema. Se conservan los 2 archivos de marca (`referencias/logo-garelon-completo.png` = GARELON.png y `referencias/isotipo-garelon.png` = LOGOTIPO.png). De las 10 imágenes nuevas (`referencias/IMAGEN 1.png` … `IMAGEN 10.png`) se usan 6. Están en `assets/` solo redimensionadas a WebP (480, 720 y 1080 px): sin recortes, sin filtros y sin cambios de texto.

### 3.1 Imágenes usadas

| Imagen | Asset del tema | Dónde | Por qué |
|---|---|---|---|
| IMAGEN 1 | `garelon-img01-producto-*.webp` | Portada (imagen principal, carga prioritaria) · 1.ª de la galería de compra · página 404 | Foto limpia de frasco, caja y tapón, sin texto de marketing: se ve exactamente lo que se compra. |
| IMAGEN 10 | `garelon-img10-presentacion-*.webp` | 2.ª de la galería de compra | Resume qué es (sérum con roller metálico, 10 ml) y los beneficios con formulación prudente. |
| IMAGEN 7 | `garelon-img07-roller-*.webp` | Sección «El ritual comienza con el roller» · 3.ª de la galería | Única que explica el roller y la zona (bolsas, ojeras) sin antes/después. |
| IMAGEN 5 | `garelon-img05-ingredientes-*.webp` | Sección Ingredientes (junto a la lista en texto) · 4.ª de la galería | Los 5 ingredientes declarados, ni uno más. |
| IMAGEN 4 | `garelon-img04-modo-de-uso-*.webp` | Sección Cómo usarlo (home y ficha de producto, junto a los pasos en texto) · 5.ª de la galería | Los 3 pasos de uso en una sola imagen. |
| IMAGEN 9 | `garelon-img09-tamano-*.webp` | 6.ª de la galería | Medidas reales de caja y frasco; información secundaria, justo antes de comprar. |

### 3.2 Imágenes descartadas

| Imagen | Motivo |
|---|---|
| IMAGEN 2 («Mirada más descansada») | Dice casi lo mismo que IMAGEN 10 y el titular tiene una errata visible: «descan**ș**ada» (una «ș» rumana en lugar de «s»). |
| IMAGEN 3 («Ideal para el contorno de ojos») | La etiqueta del frasco pone «Baufven» en vez de «Baafven», así que no representa fielmente el envase. Además promete más de lo permitido («Ayuda a reducir bolsas» sin «apariencia», «Mejora el aspecto de firmeza»), repite los beneficios de IMAGEN 10 y es la más cargada de texto. |
| IMAGEN 6 («Nutre y suaviza») | Incluye un **antes/después** sin respaldo de resultados reales con este producto. |
| IMAGEN 8 («Aplicación con roller metálico») | Incluye un **antes/después** sin respaldo. Su papel (explicar el roller) ya lo cubre IMAGEN 7. |

### 3.3 Textos dentro de las imágenes que conviene revisar
No se han editado las imágenes. Si algún día las regeneras, estas frases son las menos prudentes:
- IMAGEN 4: «Rápido, sencillo y **eficaz**» (promesa de resultado) y el paso 3 «para favorecer la **absorción**». El texto de la web dice «distribución».
- IMAGEN 5: Colágeno «**mejora la elasticidad**» y Acetyl Tripeptide-1 «aspecto más firme, liso y **rejuvenecido**».

### 3.4 Ficha de producto, carrito y checkout
Usan la **multimedia del producto de Shopify** (la de AutoDS), no las imágenes del tema. Ver tarea 5 del apartado 2.

### 3.5 Logo y favicon
| Uso | Archivo |
|---|---|
| Cabecera: isotipo + «GARELON» | `garelon-isotipo-96.webp` + `garelon-wordmark-480.webp` (del logotipo completo) |
| Pie y llamada final | `garelon-logo-240/480.webp`, `garelon-isotipo-96.webp` |
| Favicon | `garelon-favicon-32.png`, `garelon-apple-touch-180.png` (del isotipo) |

---

## 4. Qué se ha construido

### Home (`templates/index.json`), por orden
1. **Portada** (IMAGEN 1): qué es, beneficio principal, precio real y «Comprar el sérum» → baja a la zona de compra (`/#comprar`).
2. **Características**: aplicación precisa, roller metálico, rutina en 3 pasos, aceite de ricino.
3. **Beneficios** (texto): ojeras, bolsas, líneas finas, hidratación.
4. **Roller** (IMAGEN 7).
5. **Ingredientes** (IMAGEN 5 + lista en texto con INCI) · `#ingredientes`.
6. **Cómo usarlo** (IMAGEN 4 + 3 pasos en texto y nota de precaución) · `#como-usarlo`.
7. **Compra** · `#comprar`: sección *Producto destacado* de Dawn con la **galería GARELON** (IMAGEN 1, 10, 7, 5, 4 y 9), precio, variantes, cantidad, Añadir al carrito, pago exprés y «En stock»/«Agotado» (solo si Shopify controla el inventario; nunca muestra unidades).
8. **Preguntas frecuentes** (incluye las medidas del producto en texto) · `#preguntas-frecuentes`.
9. **Llamada final** sin imagen: precio y «Comprar el sérum».

Se han quitado de la home «Cuidado diario. Aplicación sencilla.» y «Un pequeño gesto para tu rutina diaria». Sus imágenes eran de la tanda antigua y no había una nueva sin texto que aportara algo distinto. Las secciones siguen disponibles en el editor.

### Ficha de producto (`templates/product.json`)
Galería real · antetítulo · título · valoración (**solo** si hay reseñas reales) · precio/precio comparado · beneficio corto · variantes · packs (desactivado) · cantidad · Añadir al carrito + Comprar ahora · stock («En stock» / «Agotado», sin contadores de unidades) · 3 destacados · descripción de Shopify · pestañas Ingredientes / Modo de uso / Envíos y devoluciones · compartir.
Debajo: barra de servicio (pago seguro, atención, envío, devoluciones) · Beneficios · Cómo usarlo (IMAGEN 4 + pasos) · Preguntas frecuentes · **Compra fija en móvil**.
Los datos estructurados (JSON-LD) de producto los genera Dawn con datos reales. No se han duplicado ni se han añadido valoraciones.

### Otras plantillas
`page.faq.json` (Preguntas frecuentes) · `page.contact.json` (Contacto) · `404.json` · las políticas usan el diseño del theme.

### Secciones nuevas
| Archivo | Nombre en el editor |
|---|---|
| `sections/garelon-hero.liquid` | GARELON Portada |
| `sections/garelon-trust-bar.liquid` | GARELON Confianza |
| `sections/garelon-benefits.liquid` | GARELON Beneficios |
| `sections/garelon-image-text.liquid` | GARELON Imagen y texto (en la home: roller) |
| `sections/garelon-ingredients.liquid` | GARELON Ingredientes (imagen de la sección + lista en texto) |
| `sections/garelon-how-to-use.liquid` | GARELON Cómo usarlo (imagen de la sección + pasos en texto) |
| `sections/garelon-faq.liquid` | GARELON FAQ |
| `sections/garelon-final-cta.liquid` | GARELON Llamada final |
| `sections/garelon-sticky-atc.liquid` | GARELON Compra fija (solo en la plantilla de producto) |

Snippets: `garelon-image`, `garelon-fallback-image`, `garelon-srcset`, `garelon-icon`, `garelon-logo-fallback`, `garelon-price-inline`, `garelon-packs`, `garelon-url` (URL real de contacto, devoluciones, envíos y cookies), `garelon-nav` (navegación GARELON), `garelon-gallery` (galería de compra), `garelon-stock` (En stock / Agotado), `garelon-flag-es` (bandera de la barra superior).
Assets: `garelon.css` (capa de marca), `garelon.js` (solo en la ficha de producto), `garelon-nav.js` (cierra el menú móvil al pulsar un ancla), imágenes `garelon-*.webp/png`.

### Archivos de Dawn modificados (cambios mínimos)
- `layout/theme.liquid`: favicon por defecto, `theme-color`, carga de `garelon.css`, `noindex` en catálogo, colecciones y búsqueda (siguen funcionando).
- `sections/header.liquid`: el logo no es `<h1>` en la home; logo GARELON por defecto; isotipo a la izquierda del nombre; **navegación GARELON** (ajuste «Navegación» + casillas de Cómo usarlo, Ingredientes y Preguntas frecuentes) y opción de ocultar el catálogo si se usa el menú de Shopify.
- `snippets/header-drawer.liquid`, `header-dropdown-menu.liquid`, `header-mega-menu.liquid`: navegación GARELON, sin enlaces a catálogo/colecciones, enlaces de contacto y políticas resueltos; en móvil, Búsqueda y Cuenta dentro del menú.
- `sections/announcement-bar.liquid`: casilla «Mostrar la bandera de España al final del texto».
- `sections/featured-product.liquid`: producto por defecto (el primero de la tienda), **galería GARELON**, ancla `comprar`, bloque «GARELON Stock».
- `sections/footer.liquid`: logo GARELON por defecto; bloque «GARELON Ayuda»; enlaces legales en orden fijo (Contacto, Envíos, Devoluciones y reembolsos, Privacidad, Cookies, Términos y condiciones, Aviso legal) y solo si tienen contenido.
- `sections/main-404.liquid`, `sections/main-cart-items.liquid`, `snippets/cart-drawer.liquid`: «Seguir comprando» lleva al inicio, no al catálogo.
- `sections/main-product.liquid`: bloque opcional «GARELON Packs»; enlaces de las pestañas resueltos.
- `config/settings_schema.json`: grupo «GARELON · Enlaces» (contacto, devoluciones, envíos y cookies).
- `config/settings_data.json`, `sections/header-group.json`, `sections/footer-group.json`, `locales/es.json`.

### Cabecera en móvil
Menú · [isotipo GARELON] · carrito, con el logo centrado entre dos columnas iguales. La búsqueda y la cuenta están dentro del menú (Dawn ponía 4 iconos y en 320–430 px se montaban sobre el logo). De 750 a 989 px y en escritorio se mantienen en la barra.

### Ajustes globales (Configuración del tema)
- **Colores**: esquema 1 crema `#F8F4EC`, esquema 2 beige `#EFE6D7`, esquema 3 oscuro `#1B1714` con dorado claro, esquema 4 blanco, esquema 5 dorado `#B88A3B`. El dorado es solo acento; para texto pequeño se usa un dorado oscurecido (`#7A5A24`) que cumple el contraste WCAG AA.
- **Tipografía**: títulos *Playfair Display*, texto *Inter* (biblioteca de fuentes de Shopify, sin Google Fonts). Se cambian en *Tipografía*.
- **Botones**: radio 4 px, texto en mayúsculas con espaciado.
- **Carrito**: tipo *cajón* (drawer) de Dawn: imagen, variante, cantidad editable, precio, eliminar, subtotal y pago. No añade productos ni casillas marcadas.
- **Cabecera**: fija discreta (aparece al subir), barra superior editable.

### Packs 1/2/3 unidades
Bloque «GARELON Packs» en la ficha de producto, **desactivado** por defecto (ojo tachado en el editor). Solo cambia la cantidad; no crea ni anuncia descuentos. Si algún día configuras descuentos reales (p. ej. un descuento automático por cantidad), se verán en el carrito y en el checkout.

---

## 5. Pruebas realizadas
- **Theme Check** (`@shopify/theme-check-node`): 0 errores. Quedan los mismos 9 avisos que trae Dawn 16.0.0 original.
- Validación propia: todos los ajustes y bloques de los JSON existen en el schema de su sección y tienen valores válidos; todos los assets referenciados existen; ninguna referencia a las imágenes antiguas.
- Render local de la home completa (barra, cabecera real con cuentas de cliente activadas, secciones, producto destacado de Dawn con la galería, FAQ, pie) con datos simulados en **320, 360, 375, 390, 430, 768, 1024 y 1440 px**: sin scroll horizontal, cabecera sin solapes (56 px en móvil), menú de escritorio en una línea, barra superior de una línea. Precio y botón de compra en la primera pantalla en 360 × 740, 375 × 667, 390 × 844 y 430 × 932 (en 320 × 640 el botón queda 28 px por debajo).
- Interacción (Chromium): menú móvil (enlaces, Búsqueda/Cuenta, cierre al pulsar un ancla), botón de portada → `#comprar`, flechas y contador de la galería, orden de tabulación. Sin errores de JavaScript.
- Enlaces de la home renderizada: todas las anclas existen; contacto y políticas llevan a su destino real; sin `href="#"` ni enlaces vacíos (salvo los selectores de país/idioma de Dawn, desactivados).
- La guía de copiar y pegar se ha verificado aplicando sus «busca y sustituye» sobre Dawn original: da el mismo código que el repositorio.

**No se ha podido probar** sin acceso a tu tienda: el renderizado real en Shopify, el formulario de producto con tus variantes y stock reales de AutoDS, el carrito, el checkout y sus métodos de pago, la cuenta de cliente de Shopify, las apps y el editor visual. Revísalo en la *Vista previa* antes de publicar (lista de `GARELON-CAMBIOS-RONDA-3.md`).
