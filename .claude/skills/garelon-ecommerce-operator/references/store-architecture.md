# Arquitectura de la tienda (mapa rápido)

> Canónico y completo: `docs/garelon/GARELON_MASTER_TEMPLATE.md`. Valores de hoy: `current-store-state.md` o el script de snapshot.

## Idea general

Dawn 16.0.0 oficial + una capa GARELON mínima:
- archivos con prefijo `garelon-` (secciones, snippets, CSS/JS, logo) y `producto-` (imágenes);
- cambios mínimos en archivos de Dawn, comentados con `GARELON:`.

Todo el JavaScript de Dawn está sin tocar.

## Dónde está cada cosa

| Pieza | Archivo |
|---|---|
| Home | `templates/index.json` |
| Ficha | `templates/product.json` |
| Portada | `sections/garelon-hero.liquid` |
| Compra de la home | `sections/featured-product.liquid` (Dawn + bloques GARELON) |
| Compra de la ficha | `sections/main-product.liquid` (Dawn + bloques GARELON) |
| Tarjetas «Elige tu oferta» (packs) | Bloque `garelon_offer` → `snippets/garelon-offer.liquid` |
| Frase + garantías | Bloque `garelon_trust` → `snippets/garelon-trust.liquid` |
| Galería del tema | `snippets/garelon-gallery.liquid`, ajustes `garelon_media` / `garelon_gallery_keys` |
| Imagen por clave | `snippets/garelon-image.liquid` + `assets/producto-<clave>-<ancho>.webp` |
| «Compra con tranquilidad» + sello | `sections/rich-text.liquid` (ajuste `garelon_badge`) |
| Opiniones (Judge.me) | `sections/garelon-reviews.liquid` |
| Imagen y texto | `sections/garelon-image-text.liquid` |
| Detalles / «Para regalar» | `sections/garelon-details.liquid` (`layout: list` / `chips`) |
| FAQ | `sections/garelon-faq.liquid` |
| Compra fija (ficha, móvil) | `sections/garelon-sticky-cta.liquid` + `assets/garelon.js` |
| Cabecera y navegación | `sections/header.liquid`, `snippets/header-drawer.liquid`, `snippets/garelon-nav-items.liquid`, `sections/header-group.json` |
| Pie y enlaces legales | `sections/footer.liquid`, `snippets/garelon-legal-links.liquid`, `sections/footer-group.json` |
| Logo | `snippets/garelon-logo.liquid`, `assets/garelon-logo-negro-*.webp` |
| Iconos | `snippets/garelon-icon.liquid` |
| Estilos y tokens | `assets/garelon.css` (`:root`) |
| Colores y fuentes | `config/settings_data.json` |
| Textos de interfaz | `locales/*.json` › `garelon.*` |
| Carrito | Dawn sin cambios, salvo «Seguir comprando» → home |

## Reglas de arquitectura que más se olvidan

- `templates/index.json` solo con secciones del tema y valores válidos: sin bloques de app, imágenes de Files ni productos (R17). Judge.me se añade desde el editor.
- Nombres de schema ≤ 25 bytes. Un nombre largo hace que Shopify rechace la sección y la home dé 404.
- Con las tarjetas de oferta, el precio de Dawn queda solo para lectores de pantalla (el visible está en cada tarjeta). La nota de impuestos y envío va bajo las tarjetas.
- Un ajuste nuevo que anuncie algo comercial debe ser cierto con su default o ir desactivado.
- Al tocar un archivo de Dawn: cambio mínimo y comentario `GARELON:`.
- Theme Check limita la complejidad Liquid por archivo (`LiquidComplexity`). `main-product.liquid` está cerca del límite: reutiliza los bloques `liquid` existentes antes de añadir condiciones.

## Puntos acoplados al producto

Ver el Master Template §7: textos, claves de imagen, assets, `garelon-image`/`garelon-gallery` y sus locales, opciones `image_key`, ajustes de packs, frase y garantías, iconos de producto, opiniones, barra superior, navegación y descripción de marca. Lo de Shopify Admin lo hace el propietario.
