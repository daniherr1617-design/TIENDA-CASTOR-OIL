# GARELON · Migración a la Taza Fondue de Chocolate con Tenedor (v1 · ronda visual v1.1 · ronda PRO v2 · copy v2.1)

> Rama `claude/fondue-mug`. Primera migración de producto sobre el baseline del sérum (`baseline/garelon-serum`, commit `f08f9bb`). Misma arquitectura: Dawn 16.0.0 + capa GARELON, carrito y checkout de Shopify, opiniones solo reales, sin pagos visuales.
>
> Todo lo marcado como probado se ha probado en un **render local** (Liquid + el JavaScript real de Dawn, con un producto simulado de 3 colores × 3 packs). Nada de lo que depende de Shopify Admin, de CJ o del checkout real se ha podido comprobar: está en «Pasos manuales».

## 1. Qué ve el cliente (estado actual, ronda PRO + limpieza de copy)

**Home**

| # | Sección | Fondo | Contenido |
|---|---|---|---|
| 1 | Barra superior | Chocolate | «Envío gratis a España» + bandera |
| 2 | Cabecera | Blanco | [isotipo] GARELON · Inicio · Cómo funciona · Qué incluye · Preguntas · Contacto |
| 3 | Portada | Blanco | Taza roja sobre disco suave · «Un pequeño plan que sabe a mucho» · **H1** «Tu fondue de chocolate, en una taza» · frase · «A partir de 24,99 €» · Rojo · Blanco · Marrón · «Elegir color y pack» · «Cómo funciona →» · Tenedor incluido · Envío gratis |
| 4 | Compra (`#comprar`) | Blanco cálido | Galería (roja → tres colores → blanca → marrón; salta al color elegido) · título · precio · «Tu fondue de chocolate o queso en una taza, con tenedor de fondue incluido.» · **Color** con foto · **Elige tu pack** (tarjetas) · **Añadir al carrito** · Comprar ahora · **Envío gratis** (nada más) · stock |
| 5 | Opiniones | Blanco | Solo reales. Sin app: 0 px |
| 6 | Cómo funciona (`#como-funciona`) | Blanco | 6 pasos con icono + nota de seguridad («Usa la taza sobre una superficie estable y no dejes la vela encendida sin vigilancia.») |
| 7 | Características y usos (`#caracteristicas`) | Blanco cálido | Tres tazas con acompañamientos · Cerámica · Tenedor de fondue · 3 colores · Chocolate, Queso, Fresas, Fruta, Pan, Gofres · microondas según el proveedor |
| 8 | Momentos | Blanco | Sobremesa · Noche en casa · Una cita · Un regalo sencillo |
| 9 | Compartir | Blanco cálido | «Una taza para cada uno» (tres colores) |
| 10 | Colores + qué incluye (`#que-incluye`) | Blanco | Rojo / Blanco / Marrón con «Elegir» · Cada unidad incluye: 1 Taza Fondue de cerámica · 1 tenedor tipo fondue |
| 11 | Confianza | Blanco cálido | Envío gratis («Consulta la política de envío», con enlace) · ¿Dudas? · Devoluciones |
| 12 | FAQ | Blanco | 9 preguntas (única aparición de «La vela no está incluida» y de «130 ml») |
| 13 | Cierre | Rosado muy suave | «Tu próxima sobremesa puede empezar aquí» · precio · «Elegir mi Taza Fondue» |
| 14 | Pie | Blanco cálido | Isotipo + GARELON · Ayuda · políticas · sin iconos de pago |
| — | Compra fija (móvil) | Blanco | Aparece al pasar la compra: foto del color · «Rojo · 1 unidad» · precio · «Añadir» |

**Ficha:** galería del tema (roja primero) + compra (Color × Pack) → opiniones → cómo funciona → características y usos → momentos → compartir → confianza → FAQ → compra fija.

**404:** «Aquí no hay chocolate que fundir» · «Vuelve a la tienda y encuentra tu Taza Fondue.» · «Volver a la tienda».

## 2. Color × Pack

- El producto de Shopify debe tener dos opciones: **Color** (Rojo, Blanco, Marrón) y **Pack** (1 unidad, 2 unidades, 3 unidades) = 9 variantes. Cada pack es una variante propia de un solo color («Rojo / 2 unidades»), así que **no se pueden mezclar colores**.
- El tema no escribe ningún precio, SKU, stock ni id: todo sale de Shopify. Con 24,99 / 39,99 / 54,99 € las tarjetas muestran:

| Pack | Precio | Por unidad | Ahorro frente a 1 unidad del mismo color | Etiqueta |
|---|---|---|---|---|
| 1 unidad | 24,99 € | 24,99 € | — («Sin descuento») | Individual |
| 2 unidades | 39,99 € | 20,00 € | 9,99 € (-20 %) · por separado 49,98 € | Para compartir |
| 3 unidades | 54,99 € | 18,33 € | 19,98 € (-27 %) · por separado 74,97 € | «Mejor precio/unidad» (calculado) |

- Al cambiar de color se recalculan los packs con los precios de ese color. Combinación que no existe: «No disponible». Sin stock: «Agotado» (sin cifras).
- «Añadir al carrito» envía **la variante elegida con `quantity=1`**. El carrito muestra «Color: Rojo · Pack: 2 unidades» × 1. La compra fija muestra «Rojo · 2 unidades».
- Sin «Oferta limitada», «Más vendido» ni precios tachados.
- En el editor de temas (nunca en la tienda) aparece un aviso si el producto no está configurado, si faltan combinaciones («8 variantes de 9») o si la sección no tiene producto elegido.

## 3. Archivos

- **Nuevos:** `snippets/garelon-choice.liquid` (botones de color), `snippets/garelon-packs-diagnostic.liquid` (aviso del editor), `assets/garelon-fondue-{principal,colores,blanco,marron}-{480,720,1080}.webp`, `assets/garelon-fondue-logo-{96,192}.webp`, `assets/garelon-fondue-favicon-32.png`, `assets/garelon-fondue-apple-touch-180.png`, las referencias del usuario `LOGO.png` e `imagen1.png` … `imagen8.png` (traídas de `main` sin cambiar nombre ni contenido) y este documento.
- **Modificados:** `snippets/garelon-packs.liquid`, `garelon-fallback-image`, `garelon-gallery`, `garelon-icon`, `garelon-logo-fallback`, `garelon-nav`, `garelon-image`, `garelon-srcset`; `sections/featured-product` y `main-product` (ajustes del bloque de packs), `garelon-hero`, `garelon-final-cta`, `garelon-image-text`, `garelon-ingredients` (ahora «GARELON Detalles»), `garelon-how-to-use`, `garelon-benefits`, `garelon-trust-bar`, `garelon-faq`, `garelon-reviews`, `header` (etiquetas de navegación); `sections/header-group.json`; `templates/index.json`, `product.json`, `page.faq.json`, `404.json`; `config/settings_data.json` (descripción de marca); `layout/theme.liquid` (favicon); `assets/garelon.css`, `assets/garelon.js`; documentación en `docs/garelon/`.
- **Borrados:** los 18 assets de imágenes del sérum (`garelon-img*`), el isotipo del ojo y su logo apilado, favicon e icono de iOS (`garelon-isotipo-96`, `garelon-logo-240/480`, `garelon-favicon-32`, `garelon-apple-touch-180`) y `referencias/IMAGEN 1–10.png`. Todo sigue en `baseline/garelon-serum`.
- **Sin tocar:** JS de Dawn, `buy-buttons`, carrito, cart drawer, checkout, `payment_button`, contacto, políticas, pie (salvo el isotipo), `payment_enable: false`.

## 4. Pasos manuales en Shopify y CJ (pendientes, no comprobados)

1. **Importar o conectar el producto de CJ** en Shopify (título «Taza Fondue de Chocolate con Tenedor»). Revisar que la sincronización de CJ no sobrescriba título, descripción, imágenes, nombres de opciones ni precios.
2. **Configurar Color × Pack:** opción 1 «Color» con Rojo, Blanco, Marrón; opción 2 «Pack» con «1 unidad», «2 unidades», «3 unidades» (en ese orden). Si CJ trae «Negro», renombrarlo a **Marrón**; si trae «Cuchara», no usarlo (es tenedor).
3. **Validar las 9 combinaciones:** que existan todas y que el editor de temas no muestre el aviso rojo de packs.
4. **Precios** en cada variante: 1 unidad 24,99 €, 2 unidades 39,99 €, 3 unidades 54,99 € (en los tres colores). **Precio comparado vacío.** Sin descuentos automáticos que se sumen.
5. **Mapping CJ monocolor:** cada variante emparejada para que CJ envíe N tazas **del mismo color** (Rojo/2 → 2 × `CJYD222583201AZ`; Blanco/3 → 3 × `CJYD222583203CX`; Marrón/2 → 2 × `CJYD222583202BY`…). Si CJ no permite packs como variante, resolverlo con la vía que ofrezca CJ (bundle, variante propia…); el tema no cambia. No publicar sin esto validado.
6. **Envío gratis real:** Configuración → Envío y entrega → tarifa de **0 €** en las zonas de España donde se ofrece. Si no son todas (Canarias, Ceuta, Melilla…), ajustar la barra superior y la aclaración del bloque «GARELON Envío gratis».
7. **Producto en la home:** en el editor, elegir la Taza Fondue en «Portada», «Producto destacado» (compra), «Llamada final» y «GARELON Opiniones». Retirar el sérum del canal Tienda online (o archivarlo) y redirigir su URL a `/`.
8. **App de reseñas** (opcional): instalarla y añadir su bloque en «GARELON Opiniones». Sin app la sección no se ve.
9. **Pedidos de prueba:** al menos 1 unidad, un pack de 2 y un pack de 3, en colores distintos. Comprobar en CJ: variante, cantidad 1 en Shopify, N tazas del mismo color en CJ, dirección y método de envío.
10. **Tracking:** confirmar que el número de seguimiento llega al pedido de Shopify y al cliente.
11. **Revisión en móvil real** de la vista previa (home, ficha, carrito, checkout, 404).
12. **Publicar** solo después: subir el ZIP como tema nuevo **sin publicar**, revisar la vista previa, duplicar el tema publicado como copia de seguridad y publicar.

Además: título y meta descripción de la home en Tienda online → Preferencias («Taza Fondue de Chocolate con Tenedor | GARELON» · «Disfruta de una fondue individual de chocolate o queso con taza de cerámica y tenedor incluido. Disponible en rojo, blanco y marrón.»), SEO del producto, imagen para redes, limpiar la descripción de CJ en el producto (sin 200 ml, «cuchara» ni claims) y revisar las políticas por la vela/llama y las roturas en transporte (el tema no reescribe textos legales). Opcional: subir imagen1–4 a la multimedia del producto y asignar a cada color su foto (así la ficha, el carrito y la compra fija muestran el color elegido).

## 5. Pruebas (render local)

- Taza Fondue: **84/84** (estáticas, Color × Pack, carrito, compra fija, agotados, combinación inexistente, avisos del editor, opiniones, pagos, 404, responsive 320–1440, primera pantalla y carga de imágenes).
- Regresiones del baseline: packs 56/56, carrito 62/62, routing 14/14, confianza 47/47, ronda 6 57/57 (adaptadas solo en lo que cambió a propósito: sin «Oferta limitada», plazo 8–18 días, orden de secciones y etiquetas de pack).
- Theme Check: 0 errores y los 9 avisos de Dawn de siempre. JSON y schemas válidos; nombres del editor ≤ 25 caracteres.

## 6. Ronda visual (v1.1) · histórico

> Sustituida por la ronda PRO (sección 7): las infografías ya no se muestran como imagen, el zoom se retiró y la paleta se ajustó.

Solo estilo y maquetación: los precios, packs, Color × Pack, `quantity=1`, carrito, checkout, opiniones y FAQ no cambian.

- **Paleta:** fondo blanco (`#FFFFFF`) y casi blanco (`#F7F5F3`) en lugar de crema y arena; acento en el **rojo de la taza** (`#C8161D`, 5,9:1 con texto blanco) en lugar del dorado; tinta chocolate `#22150F` para el texto. Barra superior roja; llamada final en rosado muy suave (`#FDF1EF`). Esquemas en `config/settings_data.json`, tokens en `assets/garelon.css`.
- **Taza roja protagonista:** portada con la roja; la galería de compra empieza por la roja de cerca (recorte de imagen2, para no repetir la foto completa de la portada); «Compartir» usa la foto de los tres colores con la roja delante; botones, color elegido, pack elegido e insignia en rojo. Blanca y marrón siguen en la galería y en el selector.
- **Variante por defecto:** el tema elige la que marca Shopify (la primera disponible). Para que sea la roja, en Shopify pon **Rojo como primer valor** de la opción Color (paso 2 de la lista de pasos manuales).
- **Infografías:** «Cómo funciona» (imagen8, sin cambios) en `#como-funciona`, justo después de la compra; «Características y usos» (imagen7 **corregida**: «Marrón» en lugar del nombre erróneo y sin los corazones dibujados sobre las tazas) en `#que-incluye`. Se amplían al tocarlas (en móvil, a 720 px, desplazables). Cada una lleva un pie con lo que incluye realmente cada unidad (la vela no).
- **Botones de compra:** «Añadir al carrito» en rojo (acción principal); «Comprar ahora» con borde oscuro, a todo el ancho. Solo CSS.
- **Archivos:** `config/settings_data.json`, `assets/garelon.css`, `assets/garelon.js` (zoom), `snippets/garelon-fallback-image.liquid` (imágenes nuevas + zoom), `snippets/garelon-gallery.liquid`, `snippets/garelon-icon.liquid` (icono de lupa), `sections/garelon-how-to-use.liquid` (pasos compactos, zoom, pie de imagen), `sections/garelon-ingredients.liquid` (zoom, pie de imagen), `sections/garelon-image-text.liquid` (opciones de imagen), `templates/index.json`, `templates/product.json`, 9 WebP nuevos (`garelon-fondue-{roja,como-funciona,caracteristicas}-{480,720,1080}.webp`).
- **Pruebas:** Taza Fondue 91/91 (7 nuevas de la ronda visual: infografías, zoom, pasos, paleta, botones), packs 56/56, carrito 62/62, routing 14/14, confianza 47/47, ronda 6 57/57; responsive 320–1440 sin scroll horizontal; Theme Check 0 errores y los 9 avisos de Dawn.

## 7. Ronda PRO (v2)

**Decisión de tema: se mantiene Dawn 16 (gratuito, oficial de Shopify).** Comparados Dawn, Horizon, Savor, Taste y Crave: Horizon/Savor (familia Horizon, 2025) son modernos y flexibles, pero usan otra arquitectura (bloques de tema, otro formulario de producto y otros eventos): migrar obligaba a rehacer Color × Pack, el carrito, la compra fija, las opiniones y las 300+ pruebas, sin ganar nada que el cliente vea que no se pueda hacer en Dawn. Taste y Crave son hermanos de Dawn (misma base, otros ajustes): no aportan técnica nueva. El problema era visual y de estructura, y se resuelve en la capa GARELON. Coste del tema: 0 €.

**Qué cambia (todo en la capa GARELON; precios, packs, `quantity=1`, carrito, checkout y opiniones siguen igual):**
- **Paleta (de esta tienda, no regla GARELON):** blanco `#FFFFFF` y blanco cálido `#FAF6F2`; acción en el rojo de la taza `#B3161E` (6,9:1 con blanco); texto carbón `#1E1A17`; barra superior chocolate `#3A2219` para que el rojo quede solo para la acción; cierre `#FCF1EE`.
- **Tipografía:** Lora (títulos) + Inter (texto), de la biblioteca de Shopify. Playfair (herencia del sérum) daba aire cosmético.
- **Botones:** píldora, sin mayúsculas forzadas, 52–56 px.
- **Portada:** taza roja sobre un disco suave, H1 más corto («Tu fondue de chocolate, en una taza»), precio + colores leídos de Shopify, un solo botón y «Cómo funciona →» como enlace. Producto, H1, precio y botón en la primera pantalla de 320 × 640 a 430 × 932.
- **Compra:** botones de color con la foto de cada taza; tarjetas de pack más compactas («2 unidades · Para compartir · 39,99 € · 20,00 €/unidad · Ahorra 9,99 € (-20 %)»), una sola nota «Ahorro calculado frente a comprar las mismas tazas de 1 en 1» (la referencia «por separado» sigue para lectores de pantalla); envío gratis y plazos en dos líneas con icono.
- **Cómo funciona:** en HTML, 6 pasos con iconos propios (vela → chocolate o queso → encender → calor → remover → disfrutar). imagen8 ya no se publica (decía «Chocolat» sin los puntos, llevaba dos tenedores y una burbuja de microondas).
- **Características y usos:** sección nueva `garelon-features` en HTML + la franja central de imagen7 corregida (`garelon-fondue-usos-*`). Sin «Cerámica resistente · Duradera»; microondas solo «según la información del proveedor».
- **Colores + qué incluye:** sección nueva `garelon-colors`; «Elegir» marca ese color en la compra y lleva hasta ella.
- **Compra fija también en la home**, con la foto del color elegido.
- **Ficha:** galería del tema (ajuste «Galería (GARELON)» de la sección del producto), roja primero y salto a la foto del color elegido. Cuando subas tus fotos al producto con una por color, cámbialo a «Multimedia de Shopify».
- **Carrito:** si la línea no tiene foto en Shopify, se ve la del color elegido.
- **SEO:** título `Taza Fondue de Chocolate con Tenedor | GARELON`; un H1 por página; un solo Product JSON-LD; sin valoraciones falsas.
- **Retirado:** infografías como imagen, zoom/lightbox, `garelon-fondue-como-funciona-*` y `garelon-fondue-caracteristicas-*`, la sección «Detalles» de la home (sigue disponible en el tema).

**Competidor (getchococup.com):** la red de este entorno no permite abrir el dominio, así que no se pudo inspeccionar su HTML ni identificar su tema («Theme del competidor no identificado con certeza»). Se trabajó con los principios observados por el dueño (fondo blanco, rojo protagonista, producto grande, cabecera compacta con logo centrado, oferta cerca, pensado para móvil), sin copiar textos, imágenes, marca, colores exactos ni código.

**Archivos:** `assets/garelon.css` (reescrito), `assets/garelon.js`, `config/settings_data.json`, `layout/theme.liquid` (título), `sections/garelon-hero`, `garelon-how-to-use`, `garelon-benefits`, `garelon-trust-bar`, `garelon-sticky-atc`, `garelon-image-text`, `garelon-ingredients` (opciones de imagen), **nuevas** `garelon-features` y `garelon-colors`, `main-product` (galería), `main-cart-items`, `header-group.json`; `snippets/garelon-choice`, `garelon-gallery`, `garelon-fallback-image`, `garelon-icon`, `garelon-nav`, `garelon-packs`, `garelon-free-shipping`, `garelon-shipping`, `cart-drawer`, **nuevo** `garelon-cart-thumb`; `templates/index.json`, `product.json`, `page.faq.json`, `404.json`; assets nuevos `garelon-fondue-usos-{480,720,1080}.webp` y `garelon-fondue-swatch-{rojo,blanco,marron}.webp`; docs y capturas en `docs/garelon/capturas/fondue-pro/`.

**Pruebas (render local):** Taza Fondue 100/100 (nuevas: pasos en HTML, características y usos, colores, paleta, tipografía, botones, galería que salta al color, «Elegir» desde Colores, compra fija en la home, galería de la ficha, primera pantalla a 320 × 640), packs 56/56, carrito 62/62, routing 14/14, confianza 47/47, ronda 6 57/57. Theme Check: 0 errores, los 9 avisos de Dawn.

**Pendiente en Shopify (además de la sección 4):** Rojo como primer valor de «Color» y «1 unidad» primero en «Pack» (así la selección inicial es Rojo / 1 unidad); título y meta descripción de la home en Preferencias; subir imagen1–4 a la multimedia del producto con una foto por color si quieres la foto en emails y checkout.

## 8. Limpieza de copy (v2.1)

Ronda solo de texto y jerarquía: no cambian el tema, la paleta, las imágenes, Color × Pack, los precios, `quantity=1`, el carrito, el checkout, las opiniones ni la compra fija.

- **«Vela no incluida»:** fuera de la portada, la compra, el subtítulo de la ficha, «Cómo funciona», el pie de la foto de características, «Cada unidad incluye», las pestañas y los textos alternativos de las imágenes. Queda **solo** en la FAQ «¿Qué incluye cada taza?»: «Cada unidad incluye una Taza Fondue de cerámica y un tenedor tipo fondue. La vela no está incluida.» Se retira la pregunta «¿La vela está incluida?». La precaución de uso se mantiene, separada: «Usa la taza sobre una superficie estable y no dejes la vela encendida sin vigilancia.»
- **«tealight» y «mojar»:** 0 en la tienda. «Coloca una vela en el hueco inferior»; «Solo necesitas una vela, chocolate o queso y tus acompañamientos favoritos.»; «Una peli, una manta y chocolate fundido.»
- **130 ml:** la capacidad real no cambia, pero deja de ser argumento de venta. Fuera del antetítulo de la ficha («Taza Fondue · Cerámica»), la frase y los puntos de la portada, las características (quedan Cerámica · Tenedor de fondue · 3 colores) y «Cada unidad incluye». Solo en la FAQ «¿Qué capacidad tiene?» → «130 ml.».
- **Debajo de «Añadir al carrito»:** solo «Envío gratis». Se quita el bloque «GARELON Plazos de envío» de la compra en la home y en la ficha (sigue disponible en el editor, ahora sin plazos por defecto).
- **Plazos (1–3 / 8–18 días):** fuera de la home y la ficha. La barra de confianza queda en Envío gratis («Consulta la política de envío», enlazada) · ¿Dudas? · Devoluciones. FAQ «¿Cuándo recibiré mi pedido?» → «Puedes consultar los plazos y condiciones de entrega actualizados en nuestra política de envío.» (enlace a `/policies/shipping-policy`). Pestaña «Envíos y devoluciones» → enlaces a las políticas de envío y devoluciones, sin días.
- **Política de envío:** el tema no la reescribe. **Pendiente en Admin:** comprobar que la política de envío de Shopify contiene los plazos (preparación 1–3 días, entrega en España aprox. 8–18 días, como estimación); si no, añadirlos allí. Revisar también que la **descripción del producto** en Shopify (sale en la ficha) no repita «130 ml», «vela no incluida», «tealight», «mojar» ni plazos.
- **CSS:** con 3 características o 3 elementos de confianza, en móvil el último ocupa la fila entera (en horizontal) sin dejar huecos; desde 750 px las características van en una fila.
- **Archivos:** `templates/index.json`, `product.json`, `page.faq.json`; `snippets/garelon-fallback-image.liquid` (textos alternativos); `sections/main-product.liquid` y `featured-product.liquid` (bloque de plazos sin valores por defecto); `assets/garelon.css`; docs.
- **Pruebas (render local):** Taza Fondue 111/111 (nuevas: auditoría del HTML completo de home y ficha, solo «Envío gratis» bajo los botones, FAQ de 9 preguntas igual en home, ficha y página de FAQ, pestaña de envíos sin días, «tealight»/«mojar» = 0 en el código); packs 56/56, carrito 62/62, routing 14/14, confianza 47/47, ronda 6 57/57 (adaptadas solo donde se quitan los plazos). Theme Check: 0 errores, los 9 avisos de Dawn. Capturas en `docs/garelon/capturas/fondue-copy/`.
