# GARELON · Checklist de migración de producto

> Se ejecuta **después de cada cambio de producto**, primero en el repositorio (Claude Code) y después en la Vista previa del tema en Shopify (el dueño).
> - Cada punto dice **cómo comprobarlo**.
> - Marca 🅲 = lo comprueba Claude Code en el repositorio o en un render local; 🆂 = solo se puede comprobar en Shopify real (Vista previa, Admin, app del proveedor —hoy CJ Dropshipping—).
> - Las referencias «§» apuntan a secciones de `GARELON_MASTER_TEMPLATE.md`.
> - Última ejecución: Pulsera Rosario Virgen María (1.9, rama `claude/rosary-bracelet`): producto sin packs y sin envío gratis verificado; ver los puntos marcados «(1.9)».
> - Producto nuevo: ______________________ · Producto anterior: ______________________ · Rama: __________ · Fecha: ______

---

## 0. Antes de empezar

- [ ] 🅲 La base es Dawn 16.0.0 con la capa GARELON → `config/settings_schema.json`: `theme_version` 16.0.0 y `theme_name` «GARELON (Dawn)».
- [ ] 🅲 Existen las 12 secciones `sections/garelon-*.liquid` y los 17 snippets `snippets/garelon-*.liquid` (§6; desde la 1.6 incluyen `garelon-choice` y `garelon-packs-diagnostic`; desde la 1.8, `garelon-features`, `garelon-colors` y `garelon-cart-thumb`).
- [ ] 🅲 Paleta, tipografía y botones: se deciden **para el producto nuevo** (§7). No se heredan del anterior por defecto ni se convierten en regla.
- [ ] 🅲 Línea base de Theme Check: 0 errores y 9 avisos de Dawn (§ anexo B.4).
- [ ] 🅲 El validador de plantillas da `OK` antes de tocar nada (§ anexo B.2).
- [ ] 🅲/🆂 Se sabe si el tema publicado tiene cambios del editor que no están en el repositorio. Si los tiene, se han incorporado.
- [ ] 🅲 Se trabaja en la rama indicada.
- [ ] 🆂 Hay copia de seguridad del tema publicado: Temas → … → Duplicar.

## 1. Producto anterior eliminado

- [ ] 🅲 El `grep` de restos (§ anexo B.1, con los términos del producto anterior) devuelve **0 resultados**.
- [ ] 🅲 `ls assets | grep -E '^(garelon-img|producto-)'` muestra solo assets del producto nuevo.
- [ ] 🅲 `referencias/` no contiene originales del producto anterior; los de marca siguen.
- [ ] 🅲 No quedan bloques ni secciones ocultos (`"disabled": true`) con texto del producto anterior en `templates/*.json`.
- [ ] 🅲 Sin restos en los schemas: valores por defecto, presets e `info` de las secciones GARELON y de `featured-product` (§16.3).
- [ ] 🅲 Textos alternativos nuevos:
  - `hero_alt` en `garelon-hero`;
  - alt de `garelon-final-cta`;
  - `asset_alt` en `garelon-fallback-image`.
- [ ] 🅲 `brand_description` (pie) ya no habla del producto anterior.
- [ ] 🅲 FAQ nueva en los tres sitios: `templates/index.json`, `templates/product.json` y `templates/page.faq.json`.
- [ ] 🅲 `templates/404.json`: botón y textos nuevos.
- [ ] 🅲 Comentarios de código actualizados: `garelon-gallery`, `garelon-fallback-image`, `garelon-image`, `garelon-srcset`, `garelon.css`.
- [ ] 🆂 El producto anterior no aparece en ninguna página (home, ficha, carrito, búsqueda, 404, pie) ni en móvil ni en escritorio.
- [ ] 🆂 El producto anterior está retirado del canal Tienda online (o archivado) y su URL redirige a `/`.

## 2. Imágenes

- [ ] 🅲 Se han revisado **todas** las imágenes entregadas, con la tabla de §18.2 en el informe.
- [ ] 🅲 (1.9) Están las imágenes **originales del proveedor**. Si faltan, las mejoradas/generadas se comparan entre sí (medalla, cruz, cuentas, cierre, piezas…), se descartan las que se contradigan con la descripción escrita y el informe lo marca como pendiente crítico (R25).
- [ ] 🅲 Cada imagen usada muestra el producto **real**: misma marca, etiqueta, colores, piezas y accesorios. No lleva «GARELON» sobre el producto.
- [ ] 🅲 Descartadas las que tienen erratas, marca o etiqueta distinta, claims prohibidos, antes/después sin respaldo, duplicados o poca resolución.
- [ ] 🅲 Hay una **imagen principal** limpia (foto real con poco texto) en la portada, la 1.ª de la galería y la 404.
- [ ] 🅲 Selección de 5-8 imágenes, cada una responde a una pregunta distinta.
- [ ] 🅲 El orden de la galería sigue la historia comercial: producto → beneficio → problema → funcionamiento → composición → uso → detalles/medidas. Nunca por nombre ni por fecha.
- [ ] 🅲 Ninguna imagen se repite en dos secciones del cuerpo de la home (sí puede repetirse en su sección + la galería).
- [ ] 🅲 Assets WebP en 480, 720 y 1080 px, sin filtros ni ampliaciones (los recortes solo para acercar el producto o quitar elementos falsos). Peso de 1080 px ≤ ~200 KB.
- [ ] 🅲 Si el producto tiene colores: muestras `garelon-fondue-swatch-<color>.webp` (160 px) para el selector, la compra fija y el carrito, y las claves de color de `garelon-choice`, `garelon-gallery` (`data-g-color`), `garelon-cart-thumb` y la compra fija adaptadas.
- [ ] 🅲 Infografías generadas: no se publican si tienen claims sin prueba, texto físico distinto o piezas de más. Se reconstruyen en HTML (`garelon-how-to-use` con iconos, `garelon-features`) y, como mucho, se aprovecha una franja de foto corregida.
- [ ] 🅲 A la vez, sin claves huérfanas:
  - las claves de `garelon-fallback-image`;
  - `keys` de `garelon-gallery`;
  - las opciones `fallback_image` de las secciones;
  - los valores `fallback_image` de las plantillas.
- [ ] 🅲 Si alguna imagen no es cuadrada, su altura real está en `garelon-fallback-image` (no el `1080` fijo).
- [ ] 🅲 Los textos incrustados dudosos de imágenes usadas están anotados en el informe.
- [ ] 🅲 (1.9) Ninguna imagen usada muestra packaging, accesorios o regalos no confirmados como incluidos (p. ej. una caja con lazo).
- [ ] 🆂 Opcional: imágenes subidas a la multimedia del producto en el mismo orden; el proveedor (hoy CJ Dropshipping) no las sobrescribe.

## 3. Contenido de la home (`templates/index.json`)

- [ ] 🅲 **Portada** (`garelon-hero`):
  - H1 con el beneficio principal, de 5-8 palabras (`use_h1: true`);
  - 1 frase de qué es;
  - precio activado;
  - CTA «Comprar {{PRODUCT_SHORT_NAME}}» → `/#comprar` (enlace vacío);
  - secundario → ancla que exista;
  - máximo 3 micro-beneficios con iconos adecuados.
- [ ] 🅲 **Características** (`garelon-trust-bar`): 4 hechos verificables, sin sellos ni garantías inventados.
- [ ] 🅲 **Beneficios** (`garelon-benefits`): entradilla con el problema y 3-6 beneficios prudentes.
- [ ] 🅲 **Diferencial** (`garelon-image-text`): existe solo si hay algo que lo distinga y una imagen; sin botón; `show_massage_lines: false`.
- [ ] 🅲 **Composición** (`garelon-ingredients`):
  - ingredientes, materiales o especificaciones exactos, idénticos a la fuente;
  - nota de origen adaptada;
  - `anchor` correcto.
- [ ] 🅲 **Cómo se usa** (`garelon-how-to-use`): 2-5 pasos reales y nota de precaución con advertencias reales.
- [ ] 🅲 **Compra** (`featured-product`):
  - `garelon_anchor: comprar`;
  - `garelon_gallery` según §18.7;
  - antetítulo y subtítulo nuevos;
  - bloques de Dawn intactos;
  - sin `garelon_stock` (desde la plantilla 1.8.2 bajo los botones solo va «Envío gratis»; si el producto lo necesita, el stock va sin cifras);
  - `garelon_packs` y `garelon_shipping` presentes si el producto tiene packs (sin `variant_picker` ni `quantity_selector`); **sin packs confirmados (1.9)**: sin `garelon_packs` y con el bloque estándar `variant_picker` de Dawn (no se ve con una sola variante);
  - `garelon_free_shipping` justo después de `buy_buttons` (solo «Envío gratis», §10.15), **activado solo con una tarifa de 0 € verificada**; si no, presente pero con `show_free_shipping: false` (1.9, R27);
  - la sección va justo después de la portada, con `garelon_mobile_info_first: true`.
- [ ] 🅲 **Opiniones** (`garelon-reviews`, §10.16) **justo después de la compra**: home `product_cta` → `reviews` → `trust`; ficha `main` → `reviews` → `service`. Sin contenido de ejemplo; título «Opiniones · Lo que opinan nuestros clientes» (o equivalente). En la home, el ajuste «Producto de la valoración media» apunta al producto nuevo. Sin datos reales no deja hueco.
- [ ] 🅲 **FAQ** (`garelon-faq`): 6-10 preguntas. Se mantienen «¿Qué es…?» (con la aclaración de fabricante externo), la de envío (→ política) y la de dudas (→ contacto + devoluciones).
- [ ] 🅲 **Cierre** (`garelon-final-cta`): isotipo, frase breve, precio y CTA → `/#comprar`.
- [ ] 🅲 Alternancia de esquemas (fondo principal / alterno) mantenida, como mucho 2 seguidas iguales (§8).
- [ ] 🅲 Máximo 3 CTAs de compra en la home.
- [ ] 🅲 Secciones sin contenido real eliminadas, no vacías.

## 4. Ficha de producto (`templates/product.json`)

- [ ] 🅲 El antetítulo (`eyebrow`) y el subtítulo (`subtitle`) son nuevos.
- [ ] 🅲 Los destacados (`highlights`, `icon-with-text`) son nuevos, con iconos de Dawn adecuados.
- [ ] 🅲 Las pestañas `tab_ingredientes` y `tab_uso` están adaptadas: título, icono y contenido. `tab_envios` sin cambios.
- [ ] 🅲 Sin bloque `inventory` en la compra (plantilla 1.8.2). Si se añade, con `inventory_threshold: 0` y `show_inventory_quantity: false`.
- [ ] 🅲 Packs (§10.11): si el producto se vende en packs, el bloque `packs` está activo, sin `variant_picker` ni `quantity_selector` en la plantilla; si no, se quita (o muestra el selector estándar).
- [ ] 🅲 Home: (Color →) «Elige tu pack» y las 3 tarjetas con su ahorro visibles **antes** de «Añadir al carrito», justo tras la portada, **sin** «Oferta limitada» (1.6). El ahorro nunca aparece solo en el carrito.
- [ ] 🅲 Si el producto tiene colores (Color × Pack): los 3 colores como botones, el ahorro se recalcula frente a 1 unidad **del mismo color**, combinación inexistente = «No disponible», agotada = «Agotado», la compra fija dice «Color · N unidades» y el carrito «Color: X · Pack: N unidades» × 1.
- [ ] 🅲 Regresión de cantidad: con `quantity_selector` añadido a la vez que los packs, el selector no se pinta y el formulario envía un solo `quantity=1`.
- [ ] 🅲 La sección de compra de la home tiene el **producto elegido** explícitamente (no «el primero del catálogo»).
- [ ] 🅲 Plazos de envío: o bien en el bloque opcional `shipping` (estimación prudente, mismos plazos que la pestaña «Envíos y devoluciones», la FAQ y la política), o bien —como la Taza Fondue (1.8.1)— solo en la política de envío, enlazada desde la FAQ, la pestaña y la barra de confianza, sin días en la home ni en la ficha.
- [ ] 🅲 Datos secundarios (capacidad, lo que no incluye, detalles técnicos) una sola vez, en su pregunta de la FAQ, si el dueño lo decide así (maestra §17.5). Búsqueda global en `sections`, `snippets`, `templates`, `config`, `assets` y `locales` de cada término retirado (incluidos los textos alternativos) con resultado clasificado en el informe.
- [ ] 🅲 La barra de servicio (`service`: Atención · Envío · Devoluciones) no ha cambiado (sin «Pago seguro» desde la 1.5).
- [ ] 🅲 `benefits`, `how_to`, `features` y `faq` están actualizados; `sticky` presente (ficha y home).
- [ ] 🅲 Galería de la ficha (`garelon_gallery` de `main-product`): «Imágenes del tema» mientras la multimedia de Shopify no esté revisada; «Multimedia de Shopify» cuando cada color tenga su foto.
- [ ] 🆂 El título y la descripción del producto en el Admin están limpios: en español, sin claims prohibidos y sin ingredientes o datos falsos importados.

## 5. Claims, fidelidad y honestidad

- [ ] 🅲 Ningún texto (ni alt, ni FAQ, ni imagen usada) promete resultados, cura, trata o elimina.
- [ ] 🅲 Sin estudios, porcentajes, certificados, premios ni recomendaciones profesionales sin prueba entregada.
- [ ] 🅲 GARELON no aparece como fabricante, laboratorio ni creador de la fórmula.
- [ ] 🅲 Sin reseñas, estrellas, «4,9/5», «más de X clientes», nombres, fotos, fechas ni «Compra verificada» inventados. Búsqueda en el tema: `grep -rniE "cliente de prueba|datos de prueba|compra verificada|4,[0-9]/5" sections snippets templates` → vacío.
- [ ] 🅲 Opiniones solo desde una app real (bloque `@app` en `garelon-reviews`) o desde `reviews.rating` / `reviews.rating_count`. Sin app ni valoración: la sección **no se ve** en la tienda (nunca «0 opiniones») y en el editor sale «Instala o añade el bloque de una app de reseñas para mostrar opiniones reales.» con el estado de cada fuente. Con bloque de app, la media propia queda oculta (`summary_with_app` desactivado) para no duplicar el resumen de la app.
- [ ] 🅲 Métodos de pago visibles (R21): **opcionales**. Producto actual: **no se muestran** (ni bajo la compra ni en el pie, `payment_enable: false`). Si un producto futuro los quiere, solo métodos reales de `shop.enabled_payment_types` con `payment_type_svg_tag`, por decisión expresa del dueño; ningún logo de pago en `assets/` ni escrito en el código; nunca «100 % seguro».
- [ ] 🅲 Sin garantías ni periodos («Garantía de 30 días», «satisfecho o te devolvemos el dinero») que no estén en una política real.
- [ ] 🅲 Sin urgencia falsa: cuentas atrás, «quedan X», «personas viendo».
- [ ] 🅲 (1.9) Claims que solo aparecen dentro de una imagen del proveedor (p. ej. «14K») no se publican en ningún sitio: texto, alt, SEO ni imágenes usadas (R26).
- [ ] 🅲 Sin descuentos ficticios. Con envío gratis verificado: «Envío gratis» visible bajo los botones de compra (home y ficha) y sin textos que lo contradigan; sin verificar (1.9): ni bajo la compra, ni en la barra superior, ni en las notas del carrito (p. ej. «los gastos de envío se calculan…» junto al precio, o «descuentos y envío calculados en la pantalla de pago» en el cart drawer y en `/cart`).
- [ ] 🅲 Packs: ahorro calculado frente al precio real de 1 unidad × unidades; sin precios tachados inventados; insignia solo objetiva («Mejor precio/unidad»), nunca «Más vendido».
- [ ] 🅲 Plazos de envío como estimación: sin «entrega garantizada», «24/48 h» ni costes internos del proveedor.
- [ ] 🅲 Los datos técnicos (medidas, capacidad, materiales o ingredientes) coinciden en todos los sitios: home, ficha, FAQ, alt e imágenes.

## 6. Shopify y proveedor (hoy CJ Dropshipping)

- [ ] 🅲 Ningún precio, precio comparado, SKU, variante, ID de variante, stock ni disponibilidad está escrito en el código ni en los JSON.
- [ ] 🅲 Las secciones con ajuste `product` apuntan al producto nuevo (handle conocido) o el informe avisa de que hay que elegirlo o retirar el anterior (§25 F5).
- [ ] 🆂 El precio se ve igual en portada, compra, cierre, ficha, carrito y checkout (es el de Shopify).
- [ ] 🆂 Precio comparado tachado solo si existe en Shopify.
- [ ] 🆂 Las variantes aparecen con sus nombres reales. Al cambiar de variante se actualizan precio, stock, botón y multimedia (en la ficha).
- [ ] 🆂 Con una variante agotada en Shopify, el botón (y la compra fija) dice «Agotado» y queda desactivado, y su tarjeta de pack/color aparece «Agotado»; nunca hay cifras de stock.
- [ ] 🆂 Proveedor: producto importado o conectado; cada variante emparejada con la suya (packs: «1 unidad» → CJ «1 unidad», «2 unidades» → CJ «2 unidades», «3 unidades» → CJ «3 piezas»); SKU correcto; no sobrescribe título, descripción, imágenes, nombres de variante ni precios editados.
- [ ] 🆂 Color × Pack en Shopify (si hay colores): opciones «Color» y «Pack», **todas** las combinaciones creadas (Taza Fondue: 3 × 3 = 9) y el editor sin el aviso «Faltan combinaciones». Cada combinación emparejada en el proveedor con **N unidades del mismo color**.
- [ ] 🆂 Packs en Shopify: opción «Pack» con «1 unidad» como primera variante; precio real en cada variante; **precio comparado vacío**; sin descuentos automáticos («Compra X y obtén Y», segunda unidad, packs) que se acumulen.
- [ ] 🆂 Descuentos antiguos **desactivados**: con el pack de 2 en el carrito, total igual al precio de la variante sin línea de descuento (Taza Fondue: 39,99 €; con el de 3, 54,99 €; sérum: 35,00 € / 48,00 €). Si al subir la cantidad aparece un descuento, sigue activo uno antiguo.
- [ ] 🆂 Editor de temas **sin** el aviso rojo «Configuración de Shopify pendiente o incorrecta para packs» en la home ni en la ficha.
- [ ] 🆂 **Envío gratis real (obligatorio):** Shopify Admin → Configuración → **Envío y entrega** → en cada zona donde GARELON ofrece envío gratis, la tarifa es **0 €** (o «Gratis»). Qué zonas están incluidas (Península, Baleares, Canarias, Ceuta, Melilla, otros países…) lo decide el dueño y depende de las zonas configuradas; si no son todas, escribir la aclaración en el bloque (`free_shipping_note`). Comprobar en un checkout de prueba que el envío sale a 0 €.
- [ ] 🆂 **Métodos de pago:** se configuran en Configuración → Pagos y el cliente los ve en el checkout oficial de Shopify. El tema no los muestra (R21); no hay nada que ajustar en el editor para ello.
- [ ] 🆂 **Opiniones:** si hay app de reseñas (Shopify App Store, compatible con bloques de app), su bloque está añadido **una sola vez** por página (Personalizar → «GARELON Opiniones» → Añadir bloque → Apps; en la home, elegir también el producto en «Producto de la valoración media») (dentro de «GARELON Opiniones», no también en la ficha) y muestra opiniones reales; configurada con colores GARELON. Si no hay app, la sección no se ve en la Vista previa.
- [ ] 🆂 Shopify + GitHub: el tema que se revisa y se publica sale de la rama con los cambios (Temas → «Conectado a GitHub» → rama). `main` solo sirve si contiene el tema (PR fusionada).
- [ ] 🆂 El proveedor anterior (AutoDS) está desconectado **para este producto** una vez probado el nuevo, y ya no sobrescribe stock, precio, imágenes ni variantes.

## 7. Compra, carrito y checkout

- [ ] 🆂 «Añadir al carrito» en la home (`#comprar`) abre el cart drawer con el producto correcto.
- [ ] 🆂 «Añadir al carrito» en la ficha funciona. La **compra fija** aparece en móvil al pasar el botón y añade correctamente.
- [ ] 🆂 Carrito: imagen, título, variante, cantidad (+/−), eliminar, precio, subtotal y «Finalizar compra».
- [ ] 🆂 El carrito no añade nada automáticamente (sin seguros, regalos ni upsells).
- [ ] 🆂 «Finalizar compra» lleva al checkout de Shopify. Los botones de pago dinámico (Shop Pay, PayPal, Apple Pay, Google Pay…) aparecen según la configuración de Pagos.
- [ ] 🅲 Bajo los botones de compra: solo «Envío gratis»; ningún «Pago seguro», icono de pago ni diagnóstico de métodos (probar con Shopify devolviendo varios métodos). El botón de pago dinámico sigue igual; los plazos solo debajo si el producto usa el bloque opcional de plazos.
- [ ] 🅲 Sin CSS, JS ni manipulación del DOM del checkout.
- [ ] 🆂 Estado agotado: el botón se desactiva y la compra fija lo refleja. La tarjeta del pack agotado dice «Agotado» y no se puede elegir.
- [ ] 🆂 Cada pack llega al carrito como **una línea «Pack: N unidades» × 1** (nunca «N unidades» × N) y la compra fija muestra el pack elegido.
- [ ] 🆂 Pedido de prueba de cada pack (o, como mínimo, mapping revisado): el proveedor recibe la variante correcta, cantidad 1, la dirección y el método de envío (el que se configure en CJ; con el sérum era CJPacket Euro Cosmetic Line). Tracking confirmado antes de lanzar campañas.
- [ ] 🆂 Carrito vacío → «Seguir comprando» lleva a la home.

## 8. Cabecera y navegación

- [ ] 🅲 `[isotipo] GARELON` en un solo enlace a la home. El logo no es H1.
- [ ] 🅲 Navegación: Inicio · (anclas activas) · Contacto. Sin Catálogo ni colecciones (`nav_source: garelon`, `hide_catalog_links: true`).
- [ ] 🅲 Etiquetas y anclas de la navegación adaptadas a la categoría (p. ej. Ingredientes → Materiales); cada ancla existe en la home. (1.9) Se editan en la cabecera: `nav_link_1..4_label` / `_anchor`.
- [ ] 🅲 Móvil (320-430 px):
  - menú · logo centrado · carrito;
  - búsqueda y cuenta **dentro** del menú;
  - cabecera de ~56 px;
  - logo sin tapar y ≥ 14 px de separación con los iconos.
- [ ] 🅲 El menú móvil se cierra al pulsar un ancla y hace scroll a la sección (`garelon-nav.js`).
- [ ] 🅲 Escritorio (≥ 990 px): el menú en línea cabe en **una fila** a 1024 y 1440 px.
- [ ] 🅲 Tableta (750-989 px): búsqueda y cuenta en la barra, sin solapes.
- [ ] 🅲 Cabecera fija «al subir» funcionando; las anclas no quedan tapadas (`scroll-margin-top`).

## 9. Barra superior

- [ ] 🅲 Texto simple y verdadero, sin urgencia. Pulsera Rosario (1.9): «Una joya para llevar contigo o regalar», sin bandera. «Envío gratis…» + bandera solo con la tarifa real de 0 € configurada.
- [ ] 🅲 Una sola línea (~38 px) de 320 a 1440 px.
- [ ] 🆂 El texto coincide con las zonas de envío configuradas en Shopify.

## 10. Pie, contacto y políticas

- [ ] 🅲 Pie en esquema 2: logo GARELON, descripción de marca actualizada y redes (solo las que tengan URL).
- [ ] 🅲 Bloque **Ayuda**: «¿Necesitas ayuda? Estamos aquí para resolver cualquier duda sobre tu pedido, nuestros productos o el proceso de compra.» + «Contacta con nuestro equipo →» → contacto.
- [ ] 🅲 Enlaces legales en orden: Contacto · Envíos · Devoluciones y reembolsos · Privacidad · Cookies (si existe la página) · Términos y condiciones · Aviso legal.
- [ ] 🆂 La página de **contacto** es la misma de siempre (no se ha creado otra), usa la plantilla `contact` y el formulario envía.
- [ ] 🆂 Cada política enlazada existe y tiene contenido. Si falta la de cookies, no se enlaza.
- [ ] 🆂 La política de envío del Admin contiene los plazos estimados (es el único sitio donde están si la tienda solo la enlaza), coincide con lo que diga la tienda y no nombra al proveedor. El tema no la reescribe.
- [ ] 🅲/🆂 Preguntas de §19 respondidas (devoluciones, envíos, higiene, seguridad, garantía, edad). Las políticas afectadas están revisadas por el dueño; las demás, intactas.
- [ ] 🅲 Ningún NIF/CIF, domicilio, teléfono, email ni razón social inventado en el tema.

## 11. Enlaces

- [ ] 🅲 Todas las anclas usadas (`/#comprar`, `/#como-usarlo`, `/#ingredientes` o su sustituta, `/#preguntas-frecuentes`) existen en la home.
- [ ] 🅲 FAQ, pestañas de la ficha y barra de servicio usan `/pages/contacto`, `/policies/shipping-policy` y `/policies/refund-policy` (se resuelven solos con `garelon-url`).
- [ ] 🅲 Sin enlaces vacíos ni `href="#"`, salvo los selectores de país e idioma de Dawn (desactivados).
- [ ] 🅲 Sin enlaces al catálogo (`/collections…`) en la navegación pública. «Seguir comprando» → home.
- [ ] 🆂 404 (`/pagina-que-no-existe`): título, texto y botón nuevos → `/#comprar`.

## 12. SEO

- [ ] 🅲 Un solo **H1** por página: home = portada; ficha = título del producto; páginas = título de la página.
- [ ] 🅲 JSON-LD sin duplicar:
  - home: `Organization` + `WebSite` + **1** `Product`;
  - ficha: `Organization` + **1** `Product`;
  - ningún `Product` manual añadido.
- [ ] 🅲 `noindex, follow` sigue en colección, lista de colecciones y búsqueda.
- [ ] 🅲 Alt descriptivos en español en todas las imágenes de contenido; decorativas con `alt=""`.
- [ ] 🆂 Admin → Preferencias: título y meta descripción de la home e imagen para redes del producto nuevo.
- [ ] 🆂 SEO del producto (título, descripción y handle) revisado en el Admin.
- [ ] 🆂 Redirección de la URL del producto anterior → `/`.

## 13. Accesibilidad

- [ ] 🅲 «Saltar al contenido» funciona. Todo se puede usar con el teclado (menú, FAQ, galería, variantes, cantidad, carrito) con foco visible.
- [ ] 🅲 FAQ con `details`/`summary`; pasos con «Paso N:» oculto; galería con botones etiquetados; stock con `role="status"`.
- [ ] 🅲 Iconos, bandera e isotipos decorativos con `aria-hidden` o `alt=""`.
- [ ] 🅲 Valoración de opiniones con `aria-label` («4,6 de 5 estrellas»), nunca solo estrellas. (Si en el futuro se vuelven a mostrar iconos de pago: lista con `aria-label` y cada SVG de Shopify con su título.)
- [ ] 🅲 Contraste AA: color de acción con texto blanco ≥ 4,5:1 y texto pequeño de acento ≥ 4,5:1 sobre los fondos usados (Taza Fondue: `#B3161E`, 6,9:1).
- [ ] 🅲 Objetivos táctiles ≥ 44 px (botones de 50 px).
- [ ] 🅲 Con `prefers-reduced-motion` no hay transiciones GARELON.

## 14. Rendimiento

- [ ] 🅲 Solo la imagen de la portada tiene `loading="eager"` + `fetchpriority="high"`; todas las demás `loading="lazy"`.
- [ ] 🅲 Todas las imágenes llevan `srcset`, `sizes`, `width` y `height`.
- [ ] 🅲 Solo se cargan las imágenes seleccionadas (sin assets huérfanos).
- [ ] 🅲 Ninguna librería JS ni script de terceros nuevo en el tema. Píxeles de anuncios solo por Admin o app.
- [ ] 🆂 PageSpeed/Lighthouse móvil de la home: el LCP es la imagen de la portada; sin CLS visible en cabecera ni portada.

## 15. Responsive (probar cada ancho)

| Ancho | Sin scroll horizontal | Cabecera OK | Barra en 1 línea | Precio + CTA en 1.ª pantalla | Secciones legibles |
|---|---|---|---|---|---|
| 320 px (640 alto) | [ ] | [ ] | [ ] | [ ] | [ ] |
| 360 px | [ ] | [ ] | [ ] | [ ] | [ ] |
| 375 px (667 alto) | [ ] | [ ] | [ ] | [ ] | [ ] |
| 390 px | [ ] | [ ] | [ ] | [ ] | [ ] |
| 430 px | [ ] | [ ] | [ ] | [ ] | [ ] |
| 768 px | [ ] | [ ] | [ ] | — | [ ] |
| 1024 px | [ ] | [ ] (menú en 1 fila) | [ ] | — | [ ] |
| 1440 px | [ ] | [ ] | [ ] | — | [ ] |

- [ ] 🅲 En móvil, la galería de `#comprar` se desliza y el contador funciona (1 / N).
- [ ] 🅲 Los textos incrustados de las imágenes usadas se leen a 360 px, o su información también está en HTML.

## 16. Validación técnica

- [ ] 🅲 Todos los `templates/*.json`, `sections/*-group.json` y `config/*.json` son JSON válidos.
- [ ] 🅲 Validador de plantillas, schemas y assets (§ anexo B.2): `OK`.
- [ ] 🅲 Theme Check: **0 errores**, solo los 9 avisos de Dawn de la línea base.
- [ ] 🅲 Sin errores de JavaScript en consola (home, ficha, carrito, página de contacto).
- [ ] 🅲 El diff solo toca lo necesario: contenido, assets del producto y los puntos de §16.3. Sin cambios en los JS de Dawn, el checkout, la cabecera móvil ni los ajustes de diseño.

## 17. Publicación (dueño, en Shopify)

- [ ] 🆂 ZIP subido como tema nuevo (o sincronizado por GitHub), **sin publicar** todavía.
- [ ] 🆂 En el editor: producto nuevo elegido donde haga falta; revisar Portada, Compra y Llamada final.
- [ ] 🆂 Vista previa revisada en un móvil real y en escritorio con esta checklist.
- [ ] 🆂 Compra de prueba (o pedido de prueba con el gateway de pruebas) hasta el checkout.
- [ ] 🆂 Publicar. Conservar el tema anterior duplicado como copia de seguridad.
- [ ] 🆂 Anuncios, catálogo y píxeles apuntan al producto o la URL nueva.

## 18. Informe de Claude Code (§27)

- [ ] Archivos modificados, creados y borrados.
- [ ] Tabla de imágenes (usadas / descartadas + motivo) y orden de la galería.
- [ ] Orden final de la home.
- [ ] Claims transformados y textos dudosos en imágenes.
- [ ] Cambios de código fuera del contenido, justificados.
- [ ] Evidencia de limpieza (grep vacío).
- [ ] Pruebas hechas con resultados y **lo que no se pudo probar**.
- [ ] Respuestas de políticas (§19).
- [ ] Tareas del Admin para el dueño.
- [ ] Riesgos pendientes.
