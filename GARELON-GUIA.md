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
| 5 | Productos → el sérum → Multimedia | Sube las fotos del producto en el orden del apartado 3. |
| 6 | Tienda online → Páginas | Crea **Contacto** (identificador `contacto`, plantilla `contact`) y **Preguntas frecuentes** (identificador `preguntas-frecuentes`, plantilla `faq`; el contenido de la página puede quedar vacío). |
| 7 | Configuración → Políticas | Completa: Devoluciones, Privacidad, Términos del servicio, Envío, Información de contacto y Aviso legal. El theme **no inventa** texto legal ni datos de empresa (dirección, NIF, email, teléfono). Aparecen solas en el pie de página. |
| 8 | Tienda online → Navegación → `main-menu` | Inicio `/` · Producto (el producto) · Cómo usarlo `/#como-usarlo` · Ingredientes `/#ingredientes` · Preguntas frecuentes (página). |
| 9 | Tienda online → Navegación → `footer` | Contacto · Envíos (política de envío) · Devoluciones (política de reembolso) · Preguntas frecuentes. |
| 10 | Configuración → Envío y entrega | Crea la zona **España**. La barra superior dice «Envío disponible en España»; no promete envío gratis. |
| 11 | Configuración → Privacidad del cliente | Activa el **banner de cookies de Shopify** si lo necesitas. El theme no añade un banner propio. |
| 12 | Apps | Para reseñas, instala una app (p. ej. Judge.me o Product Reviews) y añade su bloque en *Personalizar → Producto → Añadir bloque → Apps*. Sin app no se muestra ninguna estrella. |
| 13 | Personalizar → Configuración del tema → Redes sociales | Añade solo las redes que tengas. Vacías = no se muestran. |

---

## 3. Imágenes: dónde va cada una

### 3.1 Galería del producto (Admin → Productos)
La ficha de producto usa **solo** la multimedia del producto de Shopify. Orden recomendado con tus imágenes (están en `referencias/`):

1. `imagen-1.png` – producto + beneficios generales
2. `imagen-7.png` – cómo usarlo (3 pasos)
3. `imagen-6.png` – «Mirada más descansada»
4. `imagen-4.png` – técnica de masaje con roller
5. `imagen-2.png` – zona del contorno
6. `imagen-3.png` y `imagen-5.png` – **antes/después (ver aviso)**

> **Revisa el texto que llevan incrustado estas creatividades:**
> - `imagen-7.png` dice «Rápido, sencillo y **eficaz**». *Eficaz* es una promesa de resultado que no podemos demostrar: mejor cambiarlo por «Rápido y sencillo».
> - `imagen-3.png` y `imagen-5.png` son **antes/después**. Si no son fotos reales de clientes con este producto, pueden inducir a error. `imagen-5.png` no lleva ningún aviso; `imagen-3.png` sí («Imágenes de apoyo visual»). Te recomiendo no usar `imagen-5.png`, o añadirle ese mismo aviso y ponerla al final de la galería.
> - El resto del texto de las creatividades usa formulaciones prudentes («ayuda a…», «apariencia de…»).

### 3.2 Secciones del theme (Personalizar)
Cada sección tiene un selector de imagen. Mientras esté vacío, se muestra un **recorte sin retocar** de tus fotografías reales, incluido en `assets/` (no se ha modificado el producto, solo se ha recortado y optimizado a WebP):

| Sección | Imagen por defecto (recorte de…) | Qué subir para mejorar |
|---|---|---|
| Portada – escritorio | `imagen-6.png` (frasco + caja, vertical) | Foto real vertical, ≥ 1200 px |
| Portada – móvil | `imagen-7.png` (frasco + caja, horizontal) | Foto real horizontal ~5:4, ≥ 1000 px |
| Imagen y texto «Cuidado diario…» | `imagen-1.png` (frasco, caja y tapón) | Foto real del packaging completo |
| Imagen y texto «El ritual comienza con el roller» | `imagen-7.png`, paso 2 (detalle del roller) | **Primer plano real del roller ≥ 1000 px** (el recorte actual solo mide 320 px) |
| Cómo usarlo – pasos 1, 2 y 3 | `imagen-7.png`, pasos 1-3 | Fotos reales de cada gesto ≥ 800 px |
| Imagen y texto «Un pequeño gesto…» (editorial) | `imagen-4.png` (rostro de la modelo) | Foto de rutina/skincare |
| Llamada final | `imagen-7.png` (frasco + caja) | Foto real del producto |
| Logo | `referencias/logo-garelon-completo.png` | Opcional: *Configuración del tema → Logotipo* (la cabecera usa el nombre «GARELON» del logo y el pie, el logo completo) |
| Favicon | `referencias/isotipo-garelon.png` | Opcional: *Configuración del tema → Logotipo → Favicon* |

---

## 4. Qué se ha construido

### Home (`templates/index.json`), por orden
Portada · Barra de confianza · Beneficios · Producto (imagen y texto) · Roller (imagen y texto) · Ingredientes · Cómo usarlo · Editorial · **Producto destacado de Dawn** (precio, variantes, cantidad, stock y botones reales) · Preguntas frecuentes · Llamada final.
Todo se puede editar, reordenar u ocultar desde *Personalizar*.

### Ficha de producto (`templates/product.json`)
Galería real · antetítulo · título · valoración (**solo** si hay reseñas reales) · precio/precio comparado · beneficio corto · variantes · packs (desactivado) · cantidad · Añadir al carrito + Comprar ahora · stock («En stock» / «Agotado», sin contadores de unidades) · 3 destacados · descripción de Shopify · pestañas Ingredientes / Modo de uso / Envíos y devoluciones · compartir.
Debajo: barra de servicio (pago seguro, atención, envío, devoluciones) · Beneficios · Cómo usarlo · Preguntas frecuentes · **Compra fija en móvil**.
Los datos estructurados (JSON-LD) de producto los genera Dawn con datos reales. No se han duplicado ni se han añadido valoraciones.

### Otras plantillas
`page.faq.json` (Preguntas frecuentes) · `page.contact.json` (Contacto) · `404.json` · las políticas usan el diseño del theme.

### Secciones nuevas
| Archivo | Nombre en el editor |
|---|---|
| `sections/garelon-hero.liquid` | GARELON Portada |
| `sections/garelon-trust-bar.liquid` | GARELON Confianza |
| `sections/garelon-benefits.liquid` | GARELON Beneficios |
| `sections/garelon-image-text.liquid` | GARELON Imagen y texto (producto, roller, editorial) |
| `sections/garelon-ingredients.liquid` | GARELON Ingredientes |
| `sections/garelon-how-to-use.liquid` | GARELON Cómo usarlo |
| `sections/garelon-faq.liquid` | GARELON FAQ |
| `sections/garelon-final-cta.liquid` | GARELON Llamada final |
| `sections/garelon-sticky-atc.liquid` | GARELON Compra fija (solo en la plantilla de producto) |

Snippets: `garelon-image`, `garelon-fallback-image`, `garelon-srcset`, `garelon-icon`, `garelon-logo-fallback`, `garelon-price-inline`, `garelon-packs`.
Assets: `garelon.css` (capa de marca), `garelon.js` (solo se carga en la ficha de producto), imágenes `garelon-*.webp/png`.

### Archivos de Dawn modificados (cambios mínimos)
- `layout/theme.liquid`: favicon por defecto, `theme-color`, carga de `garelon.css`.
- `sections/header.liquid`: el logo ya no es `<h1>` en la home (el H1 lo aporta la Portada); logo GARELON por defecto.
- `sections/footer.liquid`: logo GARELON por defecto en el bloque de marca.
- `sections/featured-product.liquid`: si no eliges producto, usa el primero de la tienda.
- `sections/main-product.liquid`: nuevo bloque opcional «GARELON Packs».
- `config/settings_data.json`: paleta, tipografías, botones, cart drawer, etc.
- `sections/header-group.json`, `sections/footer-group.json`, `locales/es.json`.

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
- Validación propia: todos los ajustes y bloques de los JSON existen en el schema de su sección y tienen valores válidos.
- Render local de las secciones GARELON con datos simulados en **360, 390, 430, 768, 1024 y 1440 px**: sin scroll horizontal y con el botón principal de la Portada dentro de la primera pantalla en móvil.
- Prueba del JavaScript de la compra fija y de los packs sobre una maqueta con los mismos IDs y eventos de Dawn: aparece tras pasar el botón principal, envía el formulario real, se actualiza con la variante, muestra «Agotado» y se oculta al volver arriba.

**No se ha podido probar** sin acceso a tu tienda: el renderizado real en Shopify, el formulario de producto, el carrito, el checkout, el menú móvil de Dawn ni el comportamiento con tus variantes y stock reales de AutoDS. Revísalo en la *Vista previa* antes de publicar: producto disponible, agotado, con una y con varias variantes, precio comparado, cantidad, cart drawer, menú móvil, FAQ y compra fija.
