# GARELON · Arquitectura v2 (reconstrucción limpia sobre Dawn 16.0.0)

> Rama `claude/rosary-clean-rebuild`. Sustituye a la arquitectura técnica 1.x descrita en `GARELON_MASTER_TEMPLATE.md` (secciones 6, 10, 11, 15 y 23), que sigue en `claude/rosary-bracelet`. Las reglas permanentes R1-R30 del Master siguen vigentes; se añade **R31** (más abajo).

## 1. Principios

1. **Dawn 16.0.0 oficial como base, sin tocar salvo lo imprescindible.** El primer commit de la rama (`b2adb07`) es una copia byte a byte de [Shopify/dawn v16.0.0](https://github.com/Shopify/dawn/tree/v16.0.0).
2. **Capa GARELON mínima.** Archivos nuevos con prefijo `garelon-` o `producto-`. Cada cambio en un archivo de Dawn está comentado con `GARELON:`.
3. **Usar lo que Dawn ya resuelve.** Formulario de producto, selector de variantes, carrito, cajón, pago dinámico, valoración por metafields, rich-text y 404 son de Dawn.
4. **`templates/index.json` siempre instalable.** Solo secciones del tema, sin referencias a apps, imágenes de Files ni recursos de la tienda (productos, colecciones, páginas). Sin producto, la home sigue en 200.
5. **Construir de menos a más.** Fase A: home mínima. Después marca, portada, compra y el resto, validando tras cada fase.

## 2. Archivos

**Creados (31):**

| Archivo | Función |
|---|---|
| `sections/garelon-hero.liquid` | Portada: antetítulo, H1, texto, precio de Shopify («A partir de» si varía), CTA → `/#comprar`, enlace secundario, imagen LCP |
| `sections/garelon-reviews.liquid` | Opiniones reales: bloque de app (`@app`) y/o metafields `reviews.rating` / `rating_count`. Sin datos, 0 px; aviso solo en el editor |
| `sections/garelon-image-text.liquid` | Imagen + texto («Una joya que va más allá del detalle») |
| `sections/garelon-details.liquid` | Hechos verificables con icono (Detalles) o etiquetas (Regalo), imagen y nota opcionales |
| `sections/garelon-faq.liquid` | Preguntas frecuentes con `details`/`summary` y H3 |
| `sections/garelon-sticky-cta.liquid` | Compra fija en móvil de la ficha (pulsa el botón real de Dawn) |
| `snippets/garelon-image.liquid` | Imagen del editor o del tema (`producto-<clave>-<ancho>.webp`) con srcset, sizes, width/height, lazy/eager |
| `snippets/garelon-gallery.liquid` | Galería sin JS de las imágenes fieles del tema (deslizable en móvil, rejilla desde 750 px) |
| `snippets/garelon-pack-prices.liquid` | Precio de cada variante de la opción «Pack»; precio por unidad y ahorro solo si los precios reales lo justifican |
| `snippets/garelon-logo.liquid` | Logo aprobado desde assets si no se ha subido uno (cabecera, pie) |
| `snippets/garelon-nav-items.liquid` | Enlaces de la navegación propia de la cabecera (escritorio y menú móvil) |
| `snippets/garelon-legal-links.liquid` | Pie: Contacto · Envíos · Devoluciones y reembolsos · Privacidad · Cookies · Términos · Aviso legal, solo los que existen |
| `snippets/garelon-icon.liquid` | Iconos lineales decorativos |
| `assets/garelon.css` | Toda la capa visual (≈ 16 KB) |
| `assets/garelon.js` | ≈ 3 KB: cierra el menú móvil al pulsar un ancla de la misma página y gestiona la compra fija |
| `assets/garelon-logo-negro-{160,320,480}.webp` | Logo completo (isotipo dorado + GARELON negro), de `LOGO DEFINITIVO.png` sin el margen transparente sobrante. Cabecera y pie |
| `assets/garelon-isotipo-*.webp`, `garelon-favicon-32.png`, `garelon-apple-touch-180.png` | Isotipo dorado suelto (de `Logo.png`): favicon, icono de Apple, usos pequeños |
| `assets/producto-{principal,detalle,oracion}-*.webp` | Imágenes fieles del producto (de `imagen 3.png` e `imagen 2.png`) |

**Modificados respecto a Dawn (17):**

| Archivo | Cambio |
|---|---|
| `layout/theme.liquid` | Favicon/apple-touch de la marca si no hay uno; `garelon.css` y `garelon.js`; `theme-color` |
| `sections/header.liquid` | Navegación GARELON (4 enlaces editables, sustituye al menú del Admin que trae «Catálogo»); búsqueda opcional (desactivada); el logo no es H1; logo de respaldo |
| `snippets/header-drawer.liquid` | Los mismos enlaces en móvil y «Iniciar sesión» dentro del menú |
| `sections/footer.liquid` | Logo completo de respaldo; enlaces legales en orden fijo |
| `sections/featured-product.liquid` | Producto de respaldo (el primero de la tienda); sin productos, nada para el cliente; ancla; «Imágenes» (tema o Shopify); bloques `garelon_quote` y `garelon_packs` |
| `sections/main-product.liquid` | «Imágenes» (tema o Shopify); bloques `garelon_quote` y `garelon_packs` |
| `sections/main-404.liquid`, `sections/main-cart-items.liquid`, `snippets/cart-drawer.liquid` | «Seguir comprando» → home en vez del catálogo |
| `config/settings_schema.json` | `theme_name`: GARELON (Dawn) |
| `config/settings_data.json` | Colores, fuentes (Lora + Inter), botones, carrito en cajón, descripción de marca; corrige `animations_hover_elements` (Dawn trae un valor inexistente) |
| `locales/es.json`, `locales/en.default.json` | Textos `garelon.*`; «Añadir al carrito» (español de España) |
| `sections/header-group.json`, `sections/footer-group.json` | Barra, cabecera y pie GARELON (Dawn traía ajustes obsoletos en el anuncio) |
| `templates/index.json`, `templates/product.json` | Home y ficha |

## 3. Home (`templates/index.json`)

| # | Id | Sección | Esquema | Ancla |
|---|---|---|---|---|
| 1 | `portada` | `garelon-hero` | 1 | `inicio` |
| 2 | `compra` | `featured-product` (Dawn): título, valoración real, precio, frase de fe, selector de packs, precio de cada pack, Añadir al carrito + pago dinámico | 2 | `comprar` |
| 3 | `tranquilidad` | `rich-text` (Dawn): 14 días de desistimiento + garantía legal aplicable + `/policies/refund-policy` | 2 (tarjeta) | — |
| 4 | `opiniones` | `garelon-reviews` | 1 | `opiniones` |
| 5 | `significado` | `garelon-image-text` | 1 | `significado` |
| 6 | `detalles` | `garelon-details` (lista + imagen) | 2 | `detalles` |
| 7 | `regalo` | `garelon-details` (etiquetas) | 1 | `regalo` |
| 8 | `preguntas` | `garelon-faq` (10 preguntas) | 2 | `preguntas-frecuentes` |
| 9 | `cierre` | `rich-text` (Dawn): «Elegir mi pulsera» → `/#comprar` | 5 | — |

## 4. Producto y packs

- La home y la ficha leen el producto de Shopify. Sin producto elegido en la sección, usan el primero de la tienda (tienda de un producto).
- **Packs = variantes reales** de la opción «Pack»: «1 pulsera», «2 pulseras», «3 pulseras». Se eligen con el selector de variantes de Dawn y se añaden con **cantidad 1**: no hay selector de cantidad.
- `garelon_packs` muestra el precio real de cada pack. El precio por pulsera y el ahorro solo aparecen si `precio(1) × N − precio(N) > 0`.
- Sin la opción «Pack», el cliente compra la variante única con normalidad. Solo el editor muestra un aviso.

## 5. Opiniones (Judge.me)

Judge.me (o cualquier app con bloques de app) se añade desde el editor: Personalizar › «GARELON Opiniones» › Añadir bloque › Apps. Así puede hacerse en la home y en la ficha. La valoración junto al precio usa el bloque «Valoración» de Dawn, que solo se pinta con los metafields `reviews.rating` y `reviews.rating_count`. Judge.me los rellena si su sincronización con Shopify está activada.

Sin datos reales no se ve nada. El tema no contiene ninguna reseña.

## 6. Herramientas (`tools/`, fuera del ZIP)

| Comando | Qué hace |
|---|---|
| `python3 tools/garelon_check.py [tema] [--strict-root]` | Valida todo lo que hace que Shopify rechace una sección o plantilla. Comprueba archivos obligatorios, JSON sin claves duplicadas, schemas, nombres ≤ 25 bytes, defaults, valores contra schemas y `order`/`block_order`. También secciones permitidas y su `limit`, referencias a apps, imágenes de Files o recursos, snippets, assets e imágenes por clave. Sale con 1 si algo falla |
| `python3 tools/test_garelon_check.py` | Autoprueba: 19 roturas típicas deben dar error y el tema intacto debe pasar |
| `python3 tools/build_zip.py SALIDA.zip` | Valida y empaqueta las 7 carpetas del tema con fechas fijas (el mismo árbol da el mismo SHA-256). Después descomprime en una carpeta nueva, vuelve a validar con `--strict-root` y compara byte a byte. Si algo falla, no deja ZIP |

Además, antes de entregar:
- Theme Check (`@shopify/theme-check-node`): 0 errores; los 9 avisos son los de serie de Dawn 16.0.0.
- Liquid (Ruby) estricto.

## 7. Mejora de CRO honesto

Ver `GARELON-CRO-OFERTA-CONFIANZA.md`.
- Bloques `garelon_trust` (frase + garantías) y `garelon_offer` (tarjetas «Elige tu oferta» dentro del `<variant-selects>` de Dawn) en `featured-product` y `main-product`.
- Snippets `garelon-trust` y `garelon-offer`.
- Con tarjetas, el bloque «Precio» de Dawn queda solo para lectores de pantalla y la nota de impuestos va debajo de las tarjetas.
- `garelon-reviews` con «Ocultar sin opiniones» y nota sobre el origen de las opiniones.

## 8. Pulido final (v1.2)

Ver `GARELON-PULIDO-FINAL.md`. Logo nuevo con letras negras en cabecera y pie (el logotipo dorado antiguo ya no está en `assets/`), garantías definitivas, «Para regalar» en cuadrícula de tarjetas iguales, título y nota de opiniones.

## 9. Regla nueva

- **R31 · Instalabilidad primero.** No se entrega ningún ZIP que no salga de `tools/build_zip.py`. `templates/index.json` usa solo secciones del tema y valores válidos, sin apps, imágenes de Files ni recursos de la tienda. Se construye de menos a más, validando cada fase, y no se sigue sobre un fallo.
