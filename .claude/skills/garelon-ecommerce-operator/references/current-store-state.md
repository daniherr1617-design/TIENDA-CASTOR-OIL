# Estado actual de la tienda · SNAPSHOT

<!-- snapshot-header:start -->
> **SNAPSHOT, no verdad eterna.** Generado el 2026-10-03 desde `daniherr1617-design/TIENDA-CASTOR-OIL`, rama `claude/rosary-clean-rebuild`, **commit `955bcc3`** (último commit que cambió el tema).
<!-- snapshot-header:end -->
>
> Antes de una tarea importante, revalida lo relevante: `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py`. Si el repo y este archivo difieren, **manda el repo** y este archivo se regenera (DOCUMENT_SYNC). `tools/garelon_docs_check.py` avisa si el tema ha cambiado después de este commit.

<!-- snapshot-commit: 955bcc3 -->

## 1. Datos leídos del repositorio (generados por el script)

<!-- snapshot:start -->
- **Generado:** 2026-10-03 09:18 UTC
- **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **rama:** `claude/rosary-clean-rebuild` · **HEAD:** `955bcc3` (2026-10-03) «Ajustes finales: envío gratis, seguridad visual y orden de galería»
- **Último commit que cambió el tema:** `955bcc3` (2026-10-03)
- **Carpetas del tema sin cambios pendientes:** sí
- **Tema:** GARELON (Dawn) 16.0.0 · base Dawn en el commit `b2adb07`
- **Conteos (carpetas del tema):** assets 214, config 2, layout 2, locales 51, sections 54, snippets 48, templates 13
- **Frente a Dawn:** 39 archivos añadidos, 16 modificados (sin contar locales), 31 locales modificados, 0 borrados
  - Modificados: `config/settings_data.json`, `config/settings_schema.json`, `layout/theme.liquid`, `sections/featured-product.liquid`, `sections/footer-group.json`, `sections/footer.liquid`, `sections/header-group.json`, `sections/header.liquid`, `sections/main-404.liquid`, `sections/main-cart-items.liquid`, `sections/main-product.liquid`, `sections/rich-text.liquid`, `snippets/cart-drawer.liquid`, `snippets/header-drawer.liquid`, `templates/index.json`, `templates/product.json`
- **Secciones GARELON:** `garelon-details.liquid`, `garelon-faq.liquid`, `garelon-hero.liquid`, `garelon-image-text.liquid`, `garelon-reviews.liquid`, `garelon-sticky-cta.liquid`
- **Snippets GARELON:** `garelon-gallery.liquid`, `garelon-icon.liquid`, `garelon-image.liquid`, `garelon-legal-links.liquid`, `garelon-logo.liquid`, `garelon-nav-items.liquid`, `garelon-offer.liquid`, `garelon-pack-prices.liquid`, `garelon-trust.liquid`
- **Home (`templates/index.json`):** `portada` (garelon-hero) → `compra` (featured-product) → `tranquilidad` (rich-text) → `opiniones` (garelon-reviews) → `significado` (garelon-image-text) → `detalles` (garelon-details) → `regalo` (garelon-details) → `preguntas` (garelon-faq) → `cierre` (rich-text)
- **Ficha (`templates/product.json`):** `main` (main-product) → `tranquilidad` (rich-text) → `opiniones` (garelon-reviews) → `detalles` (garelon-details) → `preguntas` (garelon-faq) → `compra_fija` (garelon-sticky-cta)
- **Bloques de compra (home):** title, rating, price, garelon_trust, garelon_offer, buy_buttons
- **Bloques de compra (ficha):** text, title, rating, price, text, garelon_trust, garelon_offer, buy_buttons, description, collapsible_tab
- **Galería home:** `completa,detalle,infografia,principal,oracion` (origen: theme) · **ficha:** `completa,principal,detalle,infografia,oracion` (origen: theme)
- **Portada:** imagen `principal`, H1 «Pulsera Rosario Virgen María», precio visible: False, CTA «Elegir mi pulsera» → `/#comprar (vacío = compra de la home)`, 2.º botón: ninguno
- **Packs («Elige tu oferta»):** opción `Pack`, unidad «pulsera», textos «Ideal para ti» / «Perfecto para regalar» / «Ahorra más por unidad», distintivo pack 2 «Recomendado», promo: False, precio por unidad: True, envío gratis bajo los packs: True (default del schema)
- **Confianza:** frase «Un símbolo de tu fe, contigo cada día.» · chips: «Envío gratis + seguimiento» (envio) · «Pago seguro» (candado) · «14 días para cambiar de opinión» (devolucion) · «Envíos internacionales» (globo)
- **Sello GARELON (rich-text):** `index:tranquilidad`=escudo, `product:tranquilidad`=escudo
- **Opiniones:** «Opiniones sobre esta pulsera», ocultar sin opiniones: True, bloques de app en la plantilla: 0 (Judge.me se añade desde el editor), nota: Incluye opiniones de compradores del mismo modelo, importadas mediante Judge.me.
- **Compra fija (ficha):** sí
- **Navegación:** Inicio (`/`) · Detalles (`/#detalles`) · Preguntas frecuentes (`/#preguntas-frecuentes`) · Contacto (`/pages/contacto`) · búsqueda en cabecera: False
- **Barra superior:** «Una joya para llevar contigo o regalar»
- **Pie:** bloques brand_information, text; iconos de pago: False; newsletter: False
- **Imágenes del tema por clave:** `principal` (480/720/1080), `oracion` (480/720/1080), `completa` (480/720/1080), `infografia` (480/720/1080/1254), `detalle` (480/600)
- **Imágenes fuente en la raíz (fuera del ZIP):** `Imagen 1.png`, `LOGO DEFINITIVO.png`, `Logo y marca.png`, `Logo.png`, `imagen 2.png`, `imagen 3.png`, `imagen 4.png`
- **Ajustes globales:** fuentes lora_n4 + inter_n4, carrito `drawer`, ancho 1200, radio de botón 40, búsqueda predictiva False
- **Esquemas de color:** scheme-1 fondo #FFFFFF / texto #2A2622 / botón #86672F, scheme-2 fondo #FAF7F2 / texto #2A2622 / botón #86672F, scheme-3 fondo #F3ECDF / texto #2A2622 / botón #2A2622, scheme-4 fondo #FFFFFF / texto #2A2622 / botón #86672F, scheme-5 fondo #F7F1E6 / texto #2A2622 / botón #86672F
- **Locales con textos `garelon.*`:** 31
- **Herramientas en `tools/`:** `build_zip.py`, `garelon_check.py`, `garelon_docs_check.py`, `test_garelon_check.py`, `test_garelon_docs_check.py`
<!-- snapshot:end -->

## 2. Lectura humana del estado

- **Base:** Dawn 16.0.0 + capa GARELON (reconstrucción limpia). La tienda **ya funciona en Shopify**, según confirmó el propietario el 2026-10-03. El 404 histórico de la home está resuelto y no es un problema actual.
- **Producto:** Pulsera Rosario Virgen María Dorada («Un símbolo de tu fe, contigo cada día.»). Datos confirmados y prohibidos: Prompt Maestro §13.
- **Packs:** opción `Pack` = `1 pulsera` · `2 pulseras` · `3 pulseras`, variantes reales con cantidad 1. Tarjetas «Elige tu oferta» con distintivo «Recomendado» en el pack 2. Los precios están en Shopify (`NO DISPONIBLE` desde el repo).
- **Portada:** sin precio; CTA «Elegir mi pulsera» → `/#comprar`.
- **Envío:** gratis (confirmado por el propietario). Bajo los packs: «Impuestos incluidos. Envío gratis.» El cajón del carrito y `/cart` siguen con la nota de Dawn («Descuentos y envío calculados en la pantalla de pago»): pendiente de decisión.
- **Confianza:** 4 garantías confirmadas. «Compra con tranquilidad» con sello de escudo con check, decorativo, en la home y en la ficha.
- **Imágenes:** fuentes aprobadas por el propietario `Imagen 1.png`, `imagen 2.png`, `imagen 3.png` e `imagen 4.png`, más el recorte de detalle de `imagen 3.png`. Las galerías usan las imágenes del tema (`garelon_media: theme`) hasta revisar la multimedia de Shopify.
  - `principal` ← `imagen 3.png` (pulsera en la muñeca)
  - `detalle` ← recorte de `imagen 3.png`
  - `oracion` ← `imagen 2.png`
  - `completa` ← `imagen 4.png` (pulsera entera sobre marfil)
  - `infografia` ← `Imagen 1.png` (infografía «Detalles de la pulsera»)
- **Logo:** isotipo dorado + wordmark negro (`LOGO DEFINITIVO.png` → `assets/garelon-logo-negro-*.webp`). Isotipo dorado en el favicon y en el icono de iOS.
- **Opiniones:** Judge.me. El widget se añade desde el editor (no está en las plantillas). Título «Opiniones sobre esta pulsera» y nota de opiniones importadas del mismo modelo.

## 3. Integraciones y apps conocidas

| Integración | Estado conocido | Verificado desde aquí |
|---|---|---|
| Shopify (tienda `8ndnek-0x.myshopify.com`, según la documentación histórica) | Tema en funcionamiento (propietario) | No: la red de este entorno bloquea la tienda |
| DSers + AliExpress | Integración actual; fulfillment inicial manual (propietario) | No |
| Judge.me | App de opiniones; importación desde AliExpress del mismo modelo | No (ni el widget real ni los metafields) |
| Píxeles y analítica (Meta, TikTok, GA4) | `NO DISPONIBLE` | No |
| Sincronización GitHub ↔ Shopify | `NO DISPONIBLE` (si el tema está conectado a la rama, se sincroniza solo; si no, se sube el ZIP) | No |

## 4. Pruebas: última línea base conocida

Medida en el commit `955bcc3`, en este entorno:
- `tools/garelon_check.py`: OK.
- `tools/test_garelon_check.py`: 21/21.
- Theme Check (`@shopify/theme-check-node` 3.30.1): 0 errores y 9 avisos, que son los de serie de Dawn 16.0.0.
- Liquid (Ruby) estricto: 0 errores.
- Render, routing, regresión y responsive (harness local, **no versionado**): 386/386 en el repo y 378/378 en el ZIP descomprimido. La diferencia son las pruebas que solo existen dentro del repo, como los diffs de git.

Repetido el 2026-10-03 tras crear la skill y la documentación 3.0, con el tema sin cambios: los mismos resultados (386/386, Theme Check 0 errores y 9 avisos, Liquid 0, validador OK y 21/21). Documentación: `tools/garelon_docs_check.py` OK y `tools/test_garelon_docs_check.py` 18/18.

**Limitaciones:** todo es `PROBADO LOCALMENTE` / `ZIP DESCOMPRIMIDO`. No se han probado aquí la vista previa ni la tienda publicada, el checkout, los pagos, DSers, el widget real de Judge.me ni los metafields reales.

## 5. Observaciones abiertas (no son cambios hechos)

- El default del schema `badge_text` del bloque de packs es «Más popular». Es invisible mientras `badge_pack` sea `none`; las plantillas usan «Recomendado». Conviene cambiar el default en una ronda de tema.
- La batería de render y responsive vive fuera del repositorio.
- Hay documentación histórica en la raíz (`GARELON-CAMBIOS-*.md`, `GARELON-COPIAR-PEGAR.md`, `GARELON-GUIA.md`…) y en `docs/garelon/products/`, `docs/garelon/prompts/` y `docs/garelon/GARELON_ARQUITECTURA_V2.md`. No es el estado actual.
