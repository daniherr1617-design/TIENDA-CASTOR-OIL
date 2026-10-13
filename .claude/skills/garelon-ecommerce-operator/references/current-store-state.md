# Estado actual de la tienda · SNAPSHOT

<!-- snapshot-header:start -->
> **SNAPSHOT, no verdad eterna.** Generado el 2026-10-13 desde `daniherr1617-design/tienda-castor-oil`, rama `claude/garelon-espana-cro`, **commit `98dfa30`** (último commit que cambió el tema).
<!-- snapshot-header:end -->
>
> Antes de una tarea importante, revalida lo relevante: `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py`. Si el repo y este archivo difieren, **manda el repo** y este archivo se regenera (DOCUMENT_SYNC). `tools/garelon_docs_check.py` avisa si el tema ha cambiado después de este commit.

<!-- snapshot-commit: 98dfa30 -->

## 1. Datos leídos del repositorio (generados por el script)

<!-- snapshot:start -->
- **Generado:** 2026-10-13 10:33 UTC
- **Repositorio:** `daniherr1617-design/tienda-castor-oil` · **rama:** `claude/garelon-espana-cro` · **HEAD:** `98dfa30` (2026-10-13) «Confianza: valoración «4,9/5 · N opiniones» junto al título y nota de origen sin tecnicismos»
- **Último commit que cambió el tema:** `98dfa30` (2026-10-13)
- **Carpetas del tema sin cambios pendientes:** sí
- **Tema:** GARELON (Dawn) 16.0.0 · base Dawn en el commit `b2adb07`
- **Conteos (carpetas del tema):** assets 214, config 2, layout 2, locales 51, sections 55, snippets 54, templates 13
- **Frente a Dawn:** 46 archivos añadidos, 20 modificados (sin contar locales), 31 locales modificados, 0 borrados
  - Modificados: `config/settings_data.json`, `config/settings_schema.json`, `layout/theme.liquid`, `sections/contact-form.liquid`, `sections/featured-product.liquid`, `sections/footer-group.json`, `sections/footer.liquid`, `sections/header-group.json`, `sections/header.liquid`, `sections/main-404.liquid`, `sections/main-cart-footer.liquid`, `sections/main-cart-items.liquid`, `sections/main-product.liquid`, `sections/rich-text.liquid`, `snippets/cart-drawer.liquid`, `snippets/header-drawer.liquid`, `templates/index.json`, `templates/page.contact.json`, `templates/page.json`, `templates/product.json`
- **Secciones GARELON:** `garelon-announcement.liquid`, `garelon-details.liquid`, `garelon-faq.liquid`, `garelon-hero.liquid`, `garelon-image-text.liquid`, `garelon-reviews.liquid`, `garelon-sticky-cta.liquid`
- **Snippets GARELON:** `garelon-cart-option.liquid`, `garelon-contact-rte.liquid`, `garelon-contact-url.liquid`, `garelon-gallery.liquid`, `garelon-icon.liquid`, `garelon-image.liquid`, `garelon-legal-links.liquid`, `garelon-logo.liquid`, `garelon-nav-items.liquid`, `garelon-offer.liquid`, `garelon-pack-prices.liquid`, `garelon-pack-units.liquid`, `garelon-rating.liquid`, `garelon-shipping-note.liquid`, `garelon-trust.liquid`
- **Home (`templates/index.json`):** `portada` (garelon-hero) → `compra` (featured-product) → `opiniones` (garelon-reviews) → `tranquilidad` (rich-text) → `significado` (garelon-image-text) → `detalles` (garelon-details) → `regalo` (garelon-details) → `preguntas` (garelon-faq) → `cierre` (rich-text)
- **Ficha (`templates/product.json`):** `main` (main-product) → `opiniones` (garelon-reviews) → `tranquilidad` (rich-text) → `detalles` (garelon-details) → `preguntas` (garelon-faq) → `compra_fija` (garelon-sticky-cta)
- **Bloques de compra (home):** title, rating, price, garelon_offer, buy_buttons, garelon_trust
- **Bloques de compra (ficha):** text, title, rating, price, text, garelon_offer, buy_buttons, garelon_trust, description, collapsible_tab
- **Galería home:** `completa,detalle,infografia,principal,oracion` (origen: theme) · **ficha:** `completa,principal,detalle,infografia,oracion` (origen: theme)
- **Portada:** imagen `principal`, H1 «Pulsera Rosario Virgen María», precio visible: False, CTA «Elegir mi pulsera» → `/#comprar (vacío = compra de la home)`, 2.º botón: ninguno
- **Packs («Elige tu oferta»):** opción `Pack`, unidad «pulsera», textos «Ideal para ti» / «Perfecto para regalar» / «Para ti y para compartir», distintivo pack 3 «Mejor precio por pulsera» (default del schema: «Recomendado»), promo: True, precio por unidad: True
- **Envío gratis (ajuste global `garelon_free_shipping`, Configuración del tema › Carrito):** True (settings_data) · nota común `snippets/garelon-shipping-note.liquid` usada por `sections/featured-product.liquid`, `sections/main-cart-footer.liquid`, `sections/main-product.liquid`, `snippets/cart-drawer.liquid`, `snippets/garelon-offer.liquid`
- **Confianza:** frase «Un símbolo de tu fe, contigo cada día.» · chips: «Envío gratis + seguimiento» (envio) · «Pago seguro» (candado) · «14 días para cambiar de opinión» (devolucion)
- **Sello GARELON (rich-text):** `index:tranquilidad`=escudo, `product:tranquilidad`=escudo
- **Opiniones:** «Opiniones sobre esta pulsera», ocultar sin opiniones: True, Review Widget de Judge.me versionado (D30): home [('review_widget', 'real_data')] · ficha [('review_widget', 'real_data')] [(bloque, review_data)], App Embeds en settings_data: [('judgeme_core', True)] [(bloque, activo)], nota: Incluye opiniones de compradores de este mismo modelo en otra tienda online; no corresponden a pedidos de GARELON.
- **Compra fija (ficha):** sí
- **Navegación:** Inicio (`/`) · Detalles (`/#detalles`) · Preguntas frecuentes (`/#preguntas-frecuentes`) · Contacto (`/pages/contacto`) · búsqueda en cabecera: False
- **Barra superior:** GARELON Barra de envío (envío y plazo solo con confirmación; texto alternativo: «Especial octubre · Mes del Rosario»)
- **Pie:** bloques brand_information, text; iconos de pago: False; newsletter: False; selector de país: False
- **Imágenes del tema por clave:** `principal` (480/720/1080), `oracion` (480/720/1080), `completa` (480/720/1080), `infografia` (480/720/1080/1254 · INCOMPLETA), `detalle` (480/600)
- **Imágenes fuente en la raíz (fuera del ZIP):** `LOGO DEFINITIVO.png`, `Logo y marca.png`, `Logo.png`, `NUEVA IMAGEN 1.png`, `NUEVA IMAGEN 3.png`, `imagen 2.png`, `imagen 4.png`
- **Ajustes globales:** fuentes lora_n4 + inter_n4, carrito `drawer`, ancho 1200, radio de botón 40, búsqueda predictiva False
- **Esquemas de color:** scheme-1 fondo #FFFFFF / texto #2A2622 / botón #86672F, scheme-2 fondo #FAF7F2 / texto #2A2622 / botón #86672F, scheme-3 fondo #F3ECDF / texto #2A2622 / botón #2A2622, scheme-4 fondo #FFFFFF / texto #2A2622 / botón #86672F, scheme-5 fondo #F7F1E6 / texto #2A2622 / botón #86672F
- **Locales con textos `garelon.*`:** 31
- **Herramientas en `tools/`:** `build_zip.py`, `garelon_check.py`, `garelon_docs_check.py`, `garelon_infografia.py`, `test_garelon_check.py`, `test_garelon_docs_check.py`, `test_garelon_infografia.py`
- **Batería de render versionada:** `tests/render-harness` · fases A-W · dependencias fijadas: `@fontsource/inter` 5.3.0, `@fontsource/lora` 5.3.0, `@shopify/theme-check-node` 3.30.1, `liquidjs` 10.29.0, `playwright-core` 1.63.0 · con `package-lock.json`
<!-- snapshot:end -->

## 2. Lectura humana del estado

- **Base:** Dawn 16.0.0 + capa GARELON (reconstrucción limpia). La tienda **ya funciona en Shopify**, según confirmó el propietario el 2026-10-03. El 404 histórico de la home está resuelto y no es un problema actual.
- **Producto:** Pulsera Rosario Virgen María Dorada («Un símbolo de tu fe, contigo cada día.»). Datos confirmados y prohibidos: Prompt Maestro §13.
- **Packs:** opción `Pack` (en Shopify «PACK») = `1 pulsera` · `2 pulseras` · `3 pulseras`, variantes reales con cantidad 1. **Nombres finales D39 (2026-10-12), pendientes de aplicar en Shopify por el propietario:** `1 pulsera` 19,99 € · `Compra 2 y llévate 1 de regalo` 29,99 € (3 pulseras) · `Compra 3 y llévate 2 de regalo` 34,99 € (5 pulseras), con DSers pidiendo 1, 3 y 5 unidades. El tema ya lo soporta (`garelon-pack-units`): «Recibes 3/5 pulseras», 10,00 € y 7,00 € por pulsera y ahorro calculados, textos y distintivo por posición; carrito «Recibes 5 pulseras (Compra 3 y llévate 2 de regalo)». Tarjetas «Elige tu oferta» (D37): **pack de 3 como foco editorial** con el distintivo «Mejor precio por pulsera» (el tema lo oculta si ese pack no tiene el precio por unidad más bajo con los precios de Shopify); textos «Ideal para ti» / «Perfecto para regalar» / «Para ti y para compartir». **No se preselecciona** el pack de 3: la variante inicial es la de Shopify (pack de 1). El default del schema sigue siendo «Recomendado» (desde `974eadd`). Precios, precio por unidad y ahorro salen siempre de Shopify; el propietario confirmó el 2026-10-08 19,99 / 29,99 / 34,99 € sin `compare_at` (dato de Shopify, no escrito en el tema).
- **Orden de compra (D37):** título → valoración → (resumen en la ficha) → etiqueta de campaña (encima desde D38) → «Elige tu oferta» → Añadir al carrito → frase y garantías. Galería móvil con todas las imágenes a todo el ancho. Medido en local (390×844, `mode=real`): «Elige tu oferta» en la ficha de 868 a 708 px y el botón de 1308 a 1220 px; en la home, de 1419 a 1259 px.
- **Carrito (D37):** «Tu pack incluye 2/3 pulseras» o «Incluye 1 pulsera», leído del valor de la variante; sin upsells ni casillas.
- **Portada:** sin precio; CTA «Elegir mi pulsera» → `/#comprar`.
- **Barra de envío (D38):** «GARELON Barra de envío». «🇪🇸 Envío gratis a toda España» y «Entrega estimada en 5–10 días naturales» solo con las casillas de confirmación de Configuración del tema › Carrito › «GARELON · Envío a España» (desmarcadas en el repo). Mientras tanto muestra «Especial octubre · Mes del Rosario». El plazo confirmado también sale bajo los packs y en el carrito. La política publicada (10-10-2026) dice 6–10 días para España y no nombra Canarias, Baleares, Ceuta ni Melilla.
- **Envío:** gratis (confirmado por el propietario). Un único ajuste global, Configuración del tema › Carrito › «Envío gratis» (`garelon_free_shipping`, activo), y una nota común (`snippets/garelon-shipping-note.liquid`): bajo los packs, en la ficha, en el cajón del carrito y en `/cart` dice «Impuestos incluidos. Envío gratis.». Si se desactiva, vuelve la nota original de Dawn y hay que cambiar también la garantía «Envío gratis + seguimiento» (`garelon_check` da error si no). La tarifa real se configura en Shopify Admin › Envío y entrega.
- **Confianza:** 3 garantías («Envíos internacionales» retirada por D32 hasta verificar destinos en Shopify), debajo del botón desde D37. «Compra con tranquilidad» con sello de escudo con check, decorativo, en la home y en la ficha, **después de las opiniones** (D37), con H2 y 36 px de margen; mismo texto legal.
- **Mercados:** desde D38 (2026-10-12) **España es el único mercado** de la tienda: sin selector de país en el pie ni en la cabecera (`garelon_check` lo impide). En Shopify seguían configurados (2026-10-08) España + 11 países de Latinoamérica, y la política de envíos (10-10-2026) los sigue listando: desactivarlos es tarea del propietario en Markets, Envío y entrega y la política. Que cada país vea el producto disponible, en su moneda y con envío es **verificación de Shopify/propietario** (Markets, catálogo, inventario, Envío y entrega): el 2026-10-08, el `.js` público con `?country=MX|CL|CO` devolvía las variantes no disponibles y en EUR (auditoría CRO).
- **Imágenes:** fuentes aprobadas por el propietario `NUEVA IMAGEN 1.png`, `imagen 2.png`, `NUEVA IMAGEN 3.png` e `imagen 4.png`, más el recorte de detalle de `NUEVA IMAGEN 3.png`. Las galerías usan las imágenes del tema (`garelon_media: theme`) hasta revisar la multimedia de Shopify.
  - `principal` ← `NUEVA IMAGEN 3.png` (pulsera en la muñeca; desde `3a78374`)
  - `detalle` ← recorte `(330, 330, 930, 930)` de `NUEVA IMAGEN 3.png` (desde `3a78374`)
  - La antigua `imagen 3.png` (cruz colgante, **no fiel al producto**) se retiró del repositorio; solo queda en el historial de git. No volver a usarla.
- **Geometría verificada por el propietario:** la cruz forma parte de la pulsera y la cadena se une a ella por los dos extremos de su eje largo. No cuelga ninguna cruz, cadena ni cuenta. No se vuelve a cuestionar salvo petición expresa.
  - `oracion` ← `imagen 2.png`
  - `completa` ← `imagen 4.png` (pulsera entera sobre marfil)
  - `infografia` ← `NUEVA IMAGEN 1.png` (infografía «Detalles de la pulsera»). **Versión vigente (D36, desde `e08077b`):** la que el propietario subió el 2026-10-06, **sin las líneas indicadoras** (quitadas a propósito; no se reconstruyen); snapshot aprobado actual SHA-256 `0e0ad4ea…00eb`, 1254×1254, byte a byte la de `main` `a173b6a` (allí se llama `IMAGENN 1.png`). La versión anterior (`3795161c…`, con líneas) está retirada. **Fuente inmutable (D34):** WebP lossless, el de 1254 idéntico píxel a píxel y ninguno ampliado. **Familia versionada (D35, D36):** `producto-infografia-v3-480/720/1080/1254.webp` (257 KB / 538 KB / 1,13 MB / 1,41 MB); las familias `producto-infografia-<ancho>.webp` y `producto-infografia-v2-<ancho>.webp` están retiradas. Se ve en la galería de la home, en «Detalles» de la home, en la galería de la ficha y en «Ampliar». Una imagen elegida en el editor no la sustituye. Se generan, comprueban e identifican solo con `tools/garelon_infografia.py`
  - La antigua `Imagen 1.png` (flechas incorrectas) se retiró del repositorio. No volver a usarla ni restaurarla.
- **Logo:** isotipo dorado + wordmark negro (`LOGO DEFINITIVO.png` → `assets/garelon-logo-negro-*.webp`). Isotipo dorado en el favicon y en el icono de iOS.
- **Para regalar (D31, desde `e27ae75`):** solo encabezado: «Para regalar» · «Un detalle para momentos que importan» · «Una joya con significado para regalar en un momento especial.». Sin tarjetas de ocasiones (las seis antiguas se retiraron). FAQ: «¿Es una buena opción para regalar?» / «Sí. Puede ser un detalle con significado para regalar en un momento especial.» (home y ficha). 0 ocasiones concretas en el storefront.
- **Opiniones:** Judge.me. Título «Opiniones sobre esta pulsera» y nota de opiniones importadas del mismo modelo.
  - **Review Widget versionado (D30, desde `a1b03ef`):** bloque oficial `review_widget` de Judge.me en «GARELON Opiniones» de `index.json` y `product.json` (`review_data` = `real_data`) y App Embed `judgeme_core` en `settings_data.json`. Única excepción a R17.
  - **Producto del widget de la home: sin preseleccionar.** La clave del ajuste y el handle real del producto no están en el repo ni se han podido verificar; tras subir el tema se elige en el bloque («Select product»). En la ficha lo pone la página.
  - Según el propietario (2026-10-03): Judge.me instalado y configurado, opiniones de AliExpress publicadas y valoración sincronizada (la home muestra el resumen, ≈4,9). El Review Widget está en la ficha.
  - Antes de la v1.8, en la home solo se veía el resumen (metafields): el widget no estaba añadido allí. Las tarjetas y las fotos solo las pinta el bloque de app.

## 3. Integraciones y apps conocidas

| Integración | Estado conocido | Verificado desde aquí |
|---|---|---|
| Shopify (tienda `8ndnek-0x.myshopify.com`) | Tema en funcionamiento (propietario). Markets: España + 11 países de Latinoamérica (propietario, 2026-10-08) | Solo lectura pública con WebFetch (`/products/<handle>.js?country=XX`); ni Admin ni vista previa |
| DSers + AliExpress | Integración actual; fulfillment inicial manual (propietario) | No |
| Judge.me | Instalada y configurada (propietario): opiniones importadas de AliExpress del mismo modelo publicadas; widget en Carousel con colores GARELON y su título desactivado; valoración sincronizada con Shopify | No (ni el widget real ni los metafields) |
| Píxeles y analítica (Meta, TikTok, GA4) | `NO DISPONIBLE` | No |
| Sincronización GitHub ↔ Shopify | `NO DISPONIBLE` (si el tema está conectado a la rama, se sincroniza solo; si no, se sube el ZIP) | No |

## 4. Pruebas: última línea base conocida

Medida el 2026-10-13 en el commit `98dfa30` en este entorno, con `node tests/render-harness/validate.js` (instalación: `cd tests/render-harness && npm ci`; ver `tests/render-harness/README.md`). Línea base antes de la ronda U (`d21bfc5`, árbol limpio): 763/763; antes de la V (`774f5ca`): 862/862; antes de la W (`b02c016`): 891/891.
- `tools/garelon_check.py`: OK.
- `tools/test_garelon_check.py`: 43/43 (incluye las mutaciones de Judge.me, de claims legales y píxeles, D32, de contacto, D33, de la barra que promete envío gratis con el ajuste apagado, D37, y de «toda España», plazos escritos a mano y selector de país, D38).
- `tools/garelon_infografia.py`: OK (familia `producto-infografia-v3`, 4 WebP lossless idénticos a la fuente vigente reducida); `tools/test_garelon_infografia.py`: 28/28 (D34-D36).
- Theme Check (`@shopify/theme-check-node` 3.30.1): 0 errores y 9 avisos, los 9 `BASELINE DAWN` y 0 `GARELON`.
- Liquid (Ruby, gema `liquid` 5.14.0) estricto: 0 errores.
- Batería de render **versionada** (`tests/render-harness`, fases A-W; la W cubre la valoración «4,6/5 · 12 opiniones» junto al título desde los metafields (redondeo, singular, sin datos, ancla bajo la cabecera, 7 anchos), la nota de origen, la ausencia de menciones al proveedor y los nombres publicados en Shopify («2 pulseras y 1 de regalo», «3 pulseras y 2 de regalo»); la V cubre los nombres finales de las ofertas con 1, 3 y 5 unidades en tarjetas, carrito y navegador; la U cubre los packs con regalo, la barra de envío con y sin confirmación, el carrito «Recibes N», la tienda solo para España, la etiqueta de campaña, el contador de la galería y el responsive a 8 anchos): 935/935 en el repo y 874/874 (las 61 restantes necesitan git o `tools/`) en el ZIP descomprimido.
- En rondas anteriores, la misma validación pasó también desde un clon limpio del repositorio con `npm ci`.

**Limitaciones:** todo es `PROBADO LOCALMENTE` / `ZIP DESCOMPRIMIDO`. No se han probado aquí la vista previa ni la tienda publicada, el checkout, los pagos, DSers, el widget real de Judge.me (ni que el bloque versionado y el App Embed queden activos al subir el tema) ni los metafields reales.

## 5. Observaciones abiertas (no son cambios hechos)

- **Campaña temporal «Especial octubre · Mes del Rosario» (D37, D38, sin descuento, hasta el 31 de octubre de 2026). Retirarla el 1 de noviembre** desde el editor de temas (no hace falta código):
  1. Home › «Compra» › bloque «GARELON Elige tu oferta» › Promoción: desactivar «Mostrar texto de promoción».
  2. Ficha (plantilla de producto) › bloque «GARELON Elige tu oferta» › Promoción: desactivar lo mismo.
  3. Cabecera › «GARELON Barra de envío» › «Texto sin envío ni plazo confirmados»: vaciarlo o cambiarlo (solo se ve mientras no haya envío ni plazo confirmados).
  El distintivo «Mejor precio por pulsera» y los textos de los packs **no son de campaña** y se quedan. En el repo, lo mismo: `show_promo: false` en `templates/index.json` (`compra` › `oferta`) y `templates/product.json` (`main` › `oferta`), y `fallback_text` en `sections/header-group.json` (`barra-envio`); las pruebas B7, T3, T5, T10, T12, U3, U4, U7, U19 y U31 describen la campaña y se adaptan en esa ronda.
- **Pendiente del propietario para D38 y D39** (listas completas en los informes de la ronda, `/mnt/project-files/rondas/cro-espana/`): renombrar «2 pulseras» → «Compra 2 y llévate 1 de regalo» y «3 pulseras» → «Compra 3 y llévate 2 de regalo» (19,99 / 29,99 / 34,99 €), mapear en DSers 3 y 5 unidades, aclarar el regalo en la política de devoluciones, dejar España como único mercado, zona de envío de España con tarifa 0 € y decidir Canarias, Ceuta, Melilla y Baleares, actualizar la política de envíos (plazo y destinos) y, después de subir el tema, marcar las confirmaciones de envío y plazo.
- El ZIP `GARELON-PULSERA-ROSARIO-CLEAN-v1.18-CONFIANZA.zip` (commit `98dfa30`, SHA-256 `64f91b13…d284`, incluye todo lo anterior) está pendiente de que el propietario lo suba a Shopify. El 2026-10-13 la tienda servía la v1.15, que con los nombres ya publicados («2 pulseras y 1 de regalo», «3 pulseras y 2 de regalo») calcula 15,00 € y 11,66 € por pulsera (lee solo el primer número); la rama da 10,00 € y 7,00 €.
- Opiniones (D40, 2026-10-13): en la ficha real el widget muestra 29 opiniones (26 de 5★ y 3 de 4★) con fotos en algunas, en inglés («Customer Reviews», «Write a review»), sin fechas y con fotos sin texto alternativo; en la home solo el resumen (falta elegir el producto en el bloque). La ficha publicada muestra «4.9 / 5.0» y «(29)» del bloque de Dawn, señal de que Judge.me sincroniza los metafields. Pasos en `/mnt/project-files/rondas/cro-confianza/`.
- En `main` la nueva infografía se llama `IMAGENN 1.png` y `NUEVA IMAGEN 1.png` está borrada; en esta rama es `NUEVA IMAGEN 1.png` (mismos bytes). Al integrar la rama en `main`, conservar `NUEVA IMAGEN 1.png` de la rama; `IMAGENN 1.png` es un duplicado exacto que se puede borrar.
- La multimedia del producto en Shopify Admin puede seguir teniendo la foto antigua con la cruz colgante o la infografía antigua: las galerías del tema no la usan (`garelon_media: theme`), pero Shopify sí la usa en el carrito, el checkout, los correos, las vistas previas al compartir (og:image), los datos estructurados, la búsqueda y los feeds o anuncios. Conviene sustituirla allí también. Desde aquí no se puede ver.
- Contacto (D33): el tema sigue a la página real (`contacto`, `contact` o la política «Información de contacto»). En Shopify Admin: página con handle `contacto` y plantilla `contact`, y un envío de prueba recibido en el email de la tienda. El envío real del correo solo se puede comprobar en Shopify real.
- Políticas (D32): el propietario pega sus textos en Shopify (Configuración › Políticas; páginas `politica-de-cookies` y, si no hay política nativa, `aviso-legal`). Antes de anuncios: banner de Customer Privacy para España/EEE y sin píxeles hasta configurarlos con consentimiento. Destinos internacionales: `NO DISPONIBLE`; si se verifican, puede volver la 4.ª garantía.
- Tras subir la v1.14, en `SHOPIFY PREVIEW`:
  - en la home (galería y «Detalles») y en la ficha, «Ampliar» abre una URL con `producto-infografia-v3-1254.webp` y la imagen no tiene líneas indicadoras; si sale `producto-infografia-v2-1254.webp` o `producto-infografia-1254.webp`, se está viendo un tema antiguo;
  - la imagen descargada desde «Ampliar» pasa `python3 tools/garelon_infografia.py --identify` (byte a byte la de 1254);
  - App Embed de Judge.me activo;
  - en la home, producto elegido en el Review Widget (una vez);
  - tarjetas y fotos reales, sin valoración duplicada y nota de origen debajo, en home y ficha.
- Pendiente: versionar el producto del widget de la home cuando el propietario facilite el JSON real del bloque (Editar código › `templates/index.json`).
- La descripción del producto, el SEO y los anuncios viven en Shopify Admin y en los canales, no en el tema: revisar que tampoco enumeren ocasiones de regalo (D31).
- Galerías con imágenes del tema (`garelon_media: theme`); pasar a `shopify` cuando la multimedia del producto en Shopify esté revisada (pendiente en el Decision Log).
- Hay documentación histórica en la raíz (`GARELON-CAMBIOS-*.md`, `GARELON-COPIAR-PEGAR.md`, `GARELON-GUIA.md`…) y en `docs/garelon/products/`, `docs/garelon/prompts/` y `docs/garelon/GARELON_ARQUITECTURA_V2.md`. No es el estado actual.
