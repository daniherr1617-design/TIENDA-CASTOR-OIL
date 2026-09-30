# GARELON · Cambios: confianza en la compra, packs visibles en la home, variantes reales y proveedor CJ Dropshipping

> **Septiembre 2026 · rama `claude/great-lamport-8mb0rc`.** El producto no cambia: sigue siendo el mismo sérum de contorno de ojos (marca física Baafven).
> - **Simplificación (C18, la más reciente):** opiniones **justo después de la compra** y **ningún icono de pago ni «Pago seguro»** en la tienda. Donde las partes anteriores hablen de iconos de pago, «Pago seguro» o del bloque `garelon_payment_trust`, manda C18.
> - **Parte C:** confianza y conversión: «Envío gratis» + «Pago seguro» con los métodos de pago **habilitados en Shopify** bajo los botones de compra, y una sección de **opiniones solo reales**.
> - **Parte A (ronda anterior):** por qué no veías los packs en Shopify, y la corrección para que la home muestre «OFERTA LIMITADA · Elige tu pack» con las 3 ofertas antes del botón de compra.
> - **Parte B (ronda anterior):** migración a CJ Dropshipping y packs como variantes reales. Sigue vigente; se ha corregido lo que esta ronda cambia.
> - Todo lo probado es **local**, con el JavaScript real de Dawn y datos simulados. **Tema preparado; requiere prueba real en Shopify/CJ.**

---

# PARTE C · Ronda de confianza: envío gratis, pago seguro y opiniones reales

## C1. Archivos

| Archivo | Cambio |
|---|---|
| `snippets/garelon-payment-trust.liquid` | **Nuevo.** «Envío gratis» + «Pago seguro» + iconos de los métodos de pago habilitados en Shopify |
| `sections/garelon-reviews.liquid` | **Nueva.** Sección «GARELON Opiniones»: bloques de app de reseñas + valoración media real; oculta sin datos reales |
| `sections/featured-product.liquid`, `sections/main-product.liquid` | Bloque nuevo `garelon_payment_trust` (render + schema). Nada más |
| `templates/index.json` | Bloque `payment_trust` tras `buy_buttons`; sección `reviews` entre `how_to` y `faq` |
| `templates/product.json` | Igual: `payment_trust` tras `buy_buttons`; `reviews` entre `how_to` y `faq` |
| `assets/garelon.css` | Estilos `.g-buytrust`, `.g-pay`, `.g-reviews`, `.g-editor-note` |
| `snippets/garelon-payment-trust.liquid` (C17) | Modo de iconos «Automático» (por defecto) / «Manual verificado»; diagnóstico «Métodos que Shopify devuelve» solo en el editor |
| `sections/featured-product.liquid`, `sections/main-product.liquid` (C17) | Bloque «GARELON Envío y pago»: ajuste «Origen de los iconos» y 10 casillas de métodos verificados |
| `sections/garelon-reviews.liquid` (C17) | Sin resumen duplicado con un bloque de app (ajuste `summary_with_app`); aviso del editor con el estado de cada fuente |
| `assets/garelon.css` (C17) | `.g-editor-note__list` (solo el aviso del editor) |
| `sections/featured-product.liquid`, `sections/main-product.liquid` (C16) | Nombre del bloque `garelon_payment_trust` en el editor: «GARELON Envío gratis y pago seguro» → «GARELON Envío y pago» (límite de Shopify: 25 caracteres). Corrige el 404 de la home al instalar el tema |
| `locales/es.json` | Solo textos. Bajo el precio: «Los gastos de envío se calculan en la pantalla de pago» → «Consulta nuestra política de envío.». En el carrito (cart drawer y `/cart`): las 8 variantes de «Descuentos y envío calculados en la pantalla de pago» → «Envío gratis según…» (ver C15). Ambas contradecían «Envío gratis» |
| `snippets/garelon-free-shipping.liquid` (C18) | Sustituye a `garelon-payment-trust.liquid` (renombrado): solo «Envío gratis» + aclaración opcional |
| `sections/featured-product.liquid`, `sections/main-product.liquid` (C18) | Bloque `garelon_payment_trust` → `garelon_free_shipping` («GARELON Envío gratis»): solo 3 ajustes de envío; fuera pago seguro, iconos, modo y casillas |
| `templates/index.json`, `templates/product.json` (C18) | `reviews` justo después de la compra; bloque `free_shipping`; ficha sin «Pago seguro» en `service` |
| `sections/footer-group.json` (C18) | `payment_enable: false` |
| `assets/garelon.css` (C18) | Fuera `.g-pay*` |
| `docs/garelon/GARELON_MASTER_TEMPLATE.md` (v1.3), `docs/garelon/GARELON_PRODUCT_MIGRATION_CHECKLIST.md`, este documento | Reglas R21-R23, R5 ampliada, secciones 10.15 y 10.16, checklist |
| `docs/garelon/capturas/confianza/` | 6 capturas |

Sin cambios en: packs, precios, `quantity=1`, formulario de Dawn, lógica y Liquid del cart drawer y de `/cart` (solo cambian sus textos en `locales/es.json`), checkout, botón de pago dinámico, cabecera, navegación, pie, logo, paleta, tipografías, imágenes, claims, ingredientes, políticas ni mapping de CJ. Ningún archivo JS nuevo ni librería.

## C2. Opiniones: cómo están hechas

- **Sección propia** `garelon-reviews` (en vez de la sección «Apps» de Dawn): tiene el encabezado GARELON («Opiniones · Lo que opinan nuestros clientes»), admite **bloques de app** (`@app`) y **se oculta sola** si no hay nada real. La sección «Apps» de Dawn no tiene título ni diseño GARELON y se pinta vacía.
- **Fuentes, por prioridad:**
  1. Bloque de app de la app de reseñas: la app pinta sus opiniones (autor, fotos y «Compra verificada» solo si la app lo da).
  2. Valoración estándar de Shopify que rellena la app: `reviews.rating` → estrellas + «4,X/5»; `reviews.rating_count` → «N opiniones». Se muestra en una cápsula bajo el título. Solo si **los dos** existen y el recuento es > 0.
- **Posición:** home y ficha, después de «Cómo usarlo» y antes de la FAQ.
- **Diseño:** fondo crema (esquema 1), título centrado, cápsula de valoración con borde arena, contenedor de 1100 px para el widget. Sin carrusel ni JS: el widget de la app decide su formato (en móvil, una columna limpia).

## C3. Si no existe ninguna reseña real

- **Cliente:** la sección no pinta nada. No hay nombres, estrellas, «4,9/5», recuentos, fechas ni textos de ejemplo en el tema.
- **Editor de temas:** un recuadro discontinuo, solo para el propietario: «Añade aquí el bloque de tu app de reseñas para mostrar opiniones reales.» (captura 06).
- **Hoy** no hay app de reseñas: la sección está en la plantilla pero **oculta** para los clientes.

## C4. Cómo conectar una app de reseñas

1. Instalar una app de reseñas desde la Shopify App Store y activar su «app embed» si lo pide.
2. Personalizar → Página de inicio → sección **GARELON Opiniones** → «Añadir bloque» → **Apps** → el bloque de la app (en la home, el de carrusel o «todas las reseñas»).
3. En la misma sección, ajuste **«Producto de la valoración media»** → elegir el sérum (en la home es necesario; en la ficha se usa el producto de la página).
4. Plantilla de producto → sección **GARELON Opiniones** → «Añadir bloque» → Apps → el widget de reseñas del producto. **No** añadirlo también dentro de la ficha (`main-product`): se vería dos veces.
5. En la app, colores GARELON: texto `#1b1714`, estrellas `#9a7433`, borde `rgba(184,138,59,.32)`, fondo blanco; sin carruseles automáticos.
6. La valoración media aparece sola cuando la app rellena `reviews.rating` y `reviews.rating_count`. El bloque «Valoración» de la ficha de Dawn usa los mismos datos.

## C5. Métodos de pago: de dónde salen

```liquid
{%- for type in shop.enabled_payment_types -%}
  <li class="g-pay__item">{{ type | payment_type_svg_tag: class: 'icon icon--full-color g-pay__icon' }}</li>
{%- endfor -%}
```

- La misma lógica que el pie de Dawn (`sections/footer.liquid`): Shopify devuelve los métodos **habilitados** en Configuración → Pagos y su SVG oficial.
- Si el dueño activa o desactiva un método, la fila cambia sola. Con 0 métodos no se pinta la fila; en el editor sale un aviso.
- Cápsulas blancas con borde arena muy suave, 38 × 24 px sin deformar, con salto de línea en móvil. El marco gris del propio SVG se oculta para no duplicar el borde.
- Accesibilidad: lista con `aria-label` «Métodos de pago aceptados»; cada SVG de Shopify lleva `role="img"` y su `<title>` («Visa», «Mastercard»…).

## C6. Métodos que aparecen en TEST

- En el render local simulé 6 métodos: `visa`, `master`, `paypal`, `apple_pay`, `google_pay`, `bizum` (los de la referencia).
- **Los iconos de las capturas son simulados** (una cápsula con el nombre en texto), porque `payment_type_svg_tag` solo existe en Shopify. En la tienda real saldrán los SVG oficiales de Shopify y solo de los métodos activos.
- También probé con 2 métodos (`visa`, `master`) → solo 2 iconos, y con 0 → sin fila.

## C7. Sin logos escritos a mano

- Ningún archivo del tema contiene un logo ni un nombre de método de pago: búsqueda de `visa|mastercard|paypal|apple pay|google pay|bizum|amex` en los archivos nuevos y modificados → **0 resultados**.
- No se ha subido ninguna imagen de pago a `assets/`.

## C8. «Envío gratis»

- Bloque `garelon_payment_trust`, justo debajo de «Añadir al carrito» y del botón de pago dinámico, en la home y en la ficha: «✓ ENVÍO GRATIS · 🔒 PAGO SEGURO» y debajo los métodos. Después, stock y plazos de envío (sin cambios: «Preparación estimada: 1–3 días», «Entrega estimada en España: aproximadamente 8–16 días», «Los plazos pueden variar según destino y transporte»).
- Ajustes editables: activar/desactivar cada parte, textos, y una **aclaración opcional** (`free_shipping_note`) por si el envío gratis no aplica a todas las zonas.
- Coherencia: la línea bajo el precio decía «Los gastos de envío se calculan en la pantalla de pago». Ahora dice «Impuestos incluidos. Consulta nuestra política de envío.» (`locales/es.json`). La propuesta de política de envío de la parte B también se ha actualizado.
- Sin «Pago 100 % seguro», sin «Garantía de 30 días» ni ninguna otra garantía.

## C9. Configuración manual obligatoria en Shopify

1. **Configuración → Envío y entrega:** en cada zona donde anuncies envío gratis, tarifa **0 €** («Gratis»). No he podido ver tus zonas: decide tú si incluyen Península, Baleares, Canarias, Ceuta, Melilla u otros países. Si no son todas, escribe la aclaración en el bloque «GARELON Envío gratis y pago seguro».
2. Comprueba en un checkout de prueba que el envío sale a 0 € para cada pack.
3. **Configuración → Pagos:** activa los métodos que quieras ofrecer (Bizum solo si tu proveedor de pagos lo ofrece). Los iconos se adaptan solos.
4. **Opiniones:** instala una app de reseñas y sigue C4. Hasta entonces la sección está oculta.
5. Revisa la política de envío (propuesta en la parte B) para que diga lo mismo que la tienda.

## C10. Theme Check

- Antes de esta ronda: 0 errores y 9 avisos (los de Dawn 16.0.0).
- Después: **0 errores y los mismos 9 avisos** (solo cambian 2 números de línea en `main-product.liquid` por los 2 renglones nuevos del bloque).
- JSON de plantillas y locales válido; validador de plantillas y schemas OK; todos los assets referenciados existen.

## C11. Responsive

Probado en local a 320, 360, 375, 390, 430, 768, 1024 y 1440 px, en home y ficha, con 6 métodos y opiniones de TEST: **sin scroll horizontal ni ningún elemento fuera de la pantalla**.

| Ancho | Bloque envío/pago (home) | Filas de iconos |
|---|---|---|
| 320 | 126 px | 2 |
| 360 – 430 | 62 px | 1 |
| 768 – 1024 (columna de compra estrecha) | 126 px | 2 |
| 1440 | 62 px | 1 |

## C12. Capturas (`docs/garelon/capturas/confianza/`)

| Archivo | Qué muestra |
|---|---|
| `01-home-390-packs-cta-envio-gratis-pagos.jpg` | Home móvil: oferta, packs, CTA, envío gratis, pago seguro, métodos, plazos |
| `02-home-390-opiniones-DATOS-DE-PRUEBA.jpg` | Home móvil: opiniones con **datos de prueba** (solo render) |
| `03-producto-390-cta-pagos-envio-gratis.jpg` | Ficha móvil: CTA + pagos + envío gratis |
| `04-home-1440-pagos.jpg` | Home escritorio: zona de compra con pagos |
| `05-home-1440-opiniones-DATOS-DE-PRUEBA.jpg` | Home escritorio: opiniones con **datos de prueba** |
| `06-editor-390-opiniones-sin-app-aviso.jpg` | Editor: aviso cuando no hay app ni valoración |

> Las opiniones de las capturas 02 y 05 («Texto de reseña de prueba», «Cliente de prueba», 4,6/5 · 12) y los iconos de pago son **datos simulados del render local**, marcados como tales. Viven solo en el entorno de pruebas (fuera del repositorio); el tema no contiene ninguno.

### Pruebas funcionales (local, JavaScript real de Dawn): 47/47 nuevas + 56/56 de packs

- Home y ficha: «ENVÍO GRATIS» y «PAGO SEGURO» presentes; orden botones → envío/pagos → plazos; iconos = métodos habilitados (6, mismo orden); lista accesible; botón de pago dinámico intacto; plazos visibles; logos 38 × 24 sin deformar; sin «30 días» ni «100 %».
- 2 métodos → 2 iconos; 0 métodos → sin fila y sin aviso para el cliente; 0 métodos en el editor → aviso.
- Línea de impuestos sin «gastos de envío se calculan».
- Carrito (cart drawer y `/cart`): nota «Impuestos incluidos. Envío gratis según las zonas indicadas en nuestra política de envío. Descuentos calculados en la pantalla de pago.», con y sin política de envío (ver C15).
- Opiniones sin datos → ocultas (home y ficha); en el editor → aviso; con bloque de app → dentro de la sección y antes de la FAQ; ficha con valoración → «4,6/5 · 12 opiniones» con `aria-label` «4,6 de 5 estrellas»; home sin producto elegido → sin media (no se adivina el producto).
- Responsive de 320 a 1440 px sin desbordes; sin errores JS ni HTTP.
- **Regresión de packs: 56/56** (1/2/3 unidades, precios, ahorro, `quantity=1`, `quantity_selector` bloqueado, carrito «Pack: N unidades» × 1, cart drawer, compra fija, agotado, `?variant=`).

## C13. Pruebas que no he podido hacer

- Tienda real: iconos reales de `payment_type_svg_tag`, métodos realmente activos, tarifa de envío 0 € en el checkout, zonas.
- Ninguna app de reseñas real: aspecto del widget, `reviews.rating` real, app embeds.
- Editor de temas real (el aviso se probó simulando `request.design_mode`).
- Checkout, pagos, CJ, fulfillment y tracking (sin cambios en esta ronda, siguen pendientes de la prueba real).

## C14. Cambios que ChatGPT debe trasladar a los documentos externos

1. **Reseñas (R5 ampliada):** solo reales, mediante bloque de app en `garelon-reviews` y/o `reviews.rating` + `reviews.rating_count`. Nunca nombres, fotos, estrellas, recuentos, fechas ni «Compra verificada» inventados. Sin datos reales, la sección se oculta al cliente.
2. **Pagos (R21, actualizada en C18):** los métodos de pago visibles son **opcionales**; si se muestran, solo métodos reales habilitados en Shopify (`shop.enabled_payment_types` + `payment_type_svg_tag`), nunca inventados. **Producto actual: no se muestran** (ni bajo la compra ni en el pie). El checkout es el oficial de Shopify.
3. **Envío (R22):** GARELON ofrece envío gratis según las zonas configuradas en Shopify. El tema lo comunica; la tarifa real (0 €) se configura en Shopify Admin → Envío y entrega. No afirmar zonas sin verlas. Costes internos de CJ nunca se publican. Los plazos estimados se mantienen.
4. **Garantías (R23):** ninguna garantía ni periodo sin política real que lo respalde (no «Garantía de 30 días»).
5. **Estructura de la home (C18):** Portada → Compra/packs (con «Envío gratis») → **Opiniones reales** → características → beneficios → diferencial → composición → uso → FAQ → cierre.
6. **Ficha (C18):** `free_shipping` tras los botones; `reviews` justo después de la compra (antes de `service`); el widget de la app de reseñas solo una vez por página.
7. **Checklist del dueño:** tarifa 0 € en las zonas anunciadas, métodos de pago activos en el checkout, app de reseñas (opcional) y producto elegido en «GARELON Opiniones» de la home.
8. **Texto bajo el precio:** «Consulta nuestra política de envío.» en vez de «Los gastos de envío se calculan en la pantalla de pago».
9. **Texto del carrito (cart drawer y `/cart`):** «Impuestos incluidos. Envío gratis según las zonas indicadas en nuestra política de envío. Descuentos calculados en la pantalla de pago.» en vez de «Impuestos incluidos. Descuentos y envío calculados en la pantalla de pago.». Ningún texto público dice que el envío tenga un coste calculado en el checkout, ni nombra territorios concretos.

## C15. Corrección: textos del carrito coherentes con «Envío gratis»

El cart drawer (`snippets/cart-drawer.liquid`) y la página `/cart` (`sections/main-cart-footer.liquid`) de Dawn eligen una de 8 frases según tres datos de Shopify: si los impuestos están incluidos, si los aranceles están incluidos y si existe política de envío. Todas decían «… envío calculados en la pantalla de pago». Solo se han cambiado sus textos en `locales/es.json`; el Liquid y la lógica del carrito no se tocan.

| Caso | Con política de envío (enlace a «política de envío») | Sin política de envío |
|---|---|---|
| Aranceles e impuestos incluidos | Aranceles e impuestos incluidos. Envío gratis según las zonas indicadas en nuestra política de envío. Descuentos calculados en la pantalla de pago. | Aranceles e impuestos incluidos. Envío gratis según la zona de entrega; lo verás confirmado al pagar. Descuentos calculados en la pantalla de pago. |
| Solo impuestos incluidos (caso habitual en España) | Impuestos incluidos. Envío gratis según las zonas indicadas en nuestra política de envío. Descuentos calculados en la pantalla de pago. | Impuestos incluidos. Envío gratis según la zona de entrega; lo verás confirmado al pagar. Descuentos calculados en la pantalla de pago. |
| Solo aranceles incluidos | Aranceles incluidos. Envío gratis según las zonas indicadas en nuestra política de envío. Impuestos y descuentos calculados en la pantalla de pago. | Aranceles incluidos. Envío gratis según la zona de entrega; lo verás confirmado al pagar. Impuestos y descuentos calculados en la pantalla de pago. |
| Ninguno incluido | Envío gratis según las zonas indicadas en nuestra política de envío. Impuestos y descuentos calculados en la pantalla de pago. | Envío gratis según la zona de entrega; lo verás confirmado al pagar. Impuestos y descuentos calculados en la pantalla de pago. |

- Compatible con R22: no se nombran territorios; la zona del cliente se determina en el checkout, y las zonas con envío gratis son las que tengan tarifa 0 € en Shopify Admin → Configuración → Envío y entrega.
- La política de envío debe indicar esas zonas (propuesta de la parte B, «Gastos de envío»). Si no existe política, el texto no remite a ella.
- Los otros idiomas de Dawn (`en.default.json`, etc.) no se han tocado: la tienda está en español.

## C16. Corrección: 404 en la home al instalar el tema (nombre de bloque demasiado largo)

**Síntoma:** tras instalar el tema, por GitHub o por ZIP, la vista previa y el editor mostraban «404 · Página no encontrada» en lugar de la home.

**Causa (verificada en el código):**

1. El bloque `garelon_payment_trust` (C12) se llamaba «GARELON Envío gratis y pago seguro» en `sections/featured-product.liquid` y `sections/main-product.liquid`. Son 34 caracteres.
2. Shopify limita a 25 caracteres el `name` de secciones y bloques en el `{% schema %}`. Si se supera, el archivo da error al subirlo, al sincronizarlo o al guardarlo, y no se instala.
3. Theme Check solo comprueba el nombre de la sección, no el de sus bloques. Por eso daba 0 errores.
4. Sin `featured-product`, `templates/index.json` apunta a una sección inexistente y también se rechaza. Lo mismo pasa con `templates/product.json` sin `main-product`.
5. Sin plantilla `index`, Shopify responde a `/` con la plantilla 404. `templates/404.json` solo usa `main-404` y `garelon-final-cta`, así que se instalaba bien. Por eso se veía la página 404 completa de GARELON.

**Corrección:** el nombre pasa a «GARELON Envío y pago» (20 caracteres) en las dos secciones.

- Es solo la etiqueta del bloque en el editor.
- No cambian el `type`, los ajustes, el render ni las plantillas.
- Los bloques ya colocados se conservan.

**Prevención:** regla R24 de la plantilla maestra. Todos los `name` de schema (secciones, bloques y presets) deben tener como máximo 25 caracteres.

**Después de actualizar:**

- **Por ZIP:** sube el ZIP nuevo como tema nuevo.
- **Por GitHub:** si la home sigue en 404 tras la sincronización, desconecta el tema y vuelve a conectar la rama. La conexión inicial sube todos los archivos; una sincronización normal quizá solo suba los archivos del commit, y `index.json` no ha cambiado.

## C18. Simplificación: opiniones justo después de la compra y sin pagos visuales

La tienda está en fase de aprendizaje y validación, y el sérum aún no es el producto definitivo para anuncios. Por eso se simplifica el tema en dos puntos. El resto no cambia: packs, variantes, precios, carrito, sticky, CJ, imágenes, cabecera, FAQ y checkout.

**Opiniones más arriba** (solo la posición; la lógica de opiniones reales es la misma):

| | Antes | Ahora |
|---|---|---|
| Home | hero → product_cta → trust → benefits → roller → ingredients → how_to → **reviews** → faq → final_cta | hero → product_cta → **reviews** → trust → benefits → roller → ingredients → how_to → faq → final_cta |
| Ficha | main → service → benefits → how_to → **reviews** → faq → sticky | main → **reviews** → service → benefits → how_to → faq → sticky |

Motivo: tráfico móvil frío de anuncios. Tras producto, precio, packs y «Añadir al carrito», la prueba social llega enseguida. Sin app de reseñas, la sección no pinta nada (0 px, sin hueco) y la compra enlaza con lo siguiente como antes.

**Sin pagos visuales en la tienda:**

- Bajo los botones de compra solo queda **«✓ ENVÍO GRATIS»** (con la aclaración opcional). El bloque pasa a llamarse `garelon_free_shipping` («GARELON Envío gratis»), con el snippet `garelon-free-shipping.liquid`.
- Retirado de GARELON:
  - «Pago seguro» y los iconos de métodos;
  - el diagnóstico «Métodos que Shopify devuelve» y el modo «Automático / Manual verificado»;
  - los ajustes `show_payment`, `payment_label`, `show_icons`, `payment_list_label`, `icons_mode` y las 10 casillas `pay_*`;
  - `shop.enabled_payment_types` y `payment_type_svg_tag` en el bloque;
  - el CSS `.g-pay*`.
- Ficha: la barra «Compra con confianza» pierde «Pago seguro · Checkout de Shopify» y queda en Atención al cliente · Información de envío · Devoluciones.
- Pie: `payment_enable: false`. La función de Dawn sigue en `sections/footer.liquid`, solo desactivada.
- **No se ha tocado:** checkout, `payment_button` (botones de pago dinámico de Shopify), Shopify Payments, PayPal ni ningún proveedor. El cliente paga con los métodos que Shopify permita en el checkout.
- **Futuro:** R21 queda como regla opcional. Se pueden volver a mostrar métodos de pago cuando el dueño lo decida, pero solo métodos reales habilitados en Shopify, nunca inventados (plantilla maestra 10.15).

**Envío gratis:** sin cambios. Siguen los plazos estimados, la política de envío y los textos del carrito; no vuelve «envío calculado en el checkout». La tarifa de 0 € sigue siendo un ajuste manual en Shopify.

**Pruebas (local):**
- ronda 6: 57/57 (orden, sin hueco, aviso del editor, ningún icono ni «Pago seguro» aunque Shopify devuelva 11 métodos, pie sin logos, 320/390/1440 px, lógica de opiniones);
- packs 56/56;
- confianza 47/47, adaptada a «sin iconos de pago»;
- carrito 62/62;
- navegación 14/14, con el nuevo orden.

## C17. Tras publicar en Shopify: solo PayPal en los pagos y no se ven opiniones

Con el tema ya publicado, el dueño vio dos cosas: bajo «Pago seguro» solo aparecía el icono de PayPal, y no había ninguna sección de opiniones. Se diagnosticaron por separado.

**Pagos: por qué solo sale PayPal**

- El bloque usa `shop.enabled_payment_types` + `payment_type_svg_tag`, exactamente igual que el pie de Dawn (`sections/footer.liquid`). Los dos pintan la misma lista, en el mismo orden.
- Si solo sale PayPal, es que Shopify solo devuelve `paypal` en esa lista. No es un fallo de CSS ni del bloque GARELON: el pie mostraría también solo PayPal.
- Que el checkout acepte tarjeta no garantiza que Shopify exponga las marcas en esa lista. Depende de cómo esté configurado el proveedor de tarjetas; los foros de Shopify recogen el mismo caso con varios temas. No he podido ver el Admin: la causa exacta se comprueba ahí.
- **Diagnóstico nuevo (solo en el editor de temas):** debajo de los iconos aparece «Métodos que Shopify devuelve: …» con la lista real (`shop.enabled_payment_types | join`). El cliente no lo ve.

**Pagos: modo «Manual verificado» (opcional)**

- Nuevo ajuste del bloque «GARELON Envío y pago»: **Origen de los iconos** = «Automático (Shopify)» (por defecto) o «Manual verificado».
- **Automático:** solo lo que devuelve Shopify. Es lo que había; no cambia nada si no se toca.
- **Manual verificado:** lo que devuelve Shopify **más** los métodos que el dueño marque, después de comprobarlos en Configuración → Pagos. Casillas: Visa, Mastercard, American Express, Maestro, UnionPay, PayPal, Shop Pay, Apple Pay, Google Pay y Bizum. Son claves de `payment_type_svg_tag` comprobadas en la librería de iconos de Shopify (`activemerchant/payment_icons`): `visa`, `master`, `american_express`, `maestro`, `unionpay`, `paypal`, `shopify_pay`, `apple_pay`, `google_pay`, `bizum`.
- Orden fijo (tarjetas y luego carteras), sin duplicados. Si Shopify devuelve algún método fuera de esa lista (p. ej. `klarna`), se conserva al final.
- Texto de ayuda en el editor: «Selecciona únicamente métodos que estén realmente habilitados en Shopify (Configuración › Pagos). Mostrar un método no disponible puede inducir a error al cliente.»
- El pie de Dawn sigue siempre en automático.
- Ningún logo escrito a mano ni subido: siguen siendo los SVG oficiales de Shopify.

**Opiniones: por qué no se ven**

- La sección `garelon-reviews` está en la home y en la ficha, y admite bloques `@app` con `{% render block %}`. Funciona como se diseñó: sin bloque de app ni valoración real, no se muestra al cliente.
- **Verificado en el código:** ni `templates/index.json` ni `templates/product.json` tienen un bloque de app en «GARELON Opiniones», y en la home el ajuste «Producto de la valoración media» está vacío.
- **No verificable desde aquí:** si hay una app de reseñas instalada y si el producto tiene `reviews.rating` / `reviews.rating_count`. Con un bloque de app añadido la sección se vería; sin él, lo más probable es que no haya app.
- No es un fallo de código.

**Opiniones: cambios**

- **Sin resumen duplicado:** con un bloque de app, la valoración media propia se oculta por defecto (casi todas las apps pintan su resumen). Ajuste nuevo «Mostrarla también con un bloque de app» (desactivado).
- **Aviso del editor por causas:** «Instala o añade el bloque de una app de reseñas para mostrar opiniones reales.» y el estado de cada fuente: bloque de app (ninguno), producto de la valoración media (sin elegir / nombre) y valoración de Shopify (no se puede leer sin producto / no la tiene / existe pero está desactivada).
- Sigue oculta para el cliente sin datos reales: nada de «0 opiniones».

**Archivos:** `snippets/garelon-payment-trust.liquid`, `sections/featured-product.liquid` y `sections/main-product.liquid` (schema del bloque), `sections/garelon-reviews.liquid`, `assets/garelon.css` (lista del aviso del editor). Las plantillas JSON no cambian: los ajustes nuevos toman su valor por defecto (automático; resumen oculto con app).

**Pruebas (local, SVG reales de la librería de Shopify):** 62/62. Automático con `[paypal]`, `[visa, master, paypal]`, 10 métodos y 0 métodos; el pie muestra la misma lista; casillas ignoradas en automático; diagnóstico del editor; manual verificado sin duplicados y en orden; 10 logos a 320, 390 y 1440 px sin deformar ni salirse; opiniones sin app, con app simulada, con valoración simulada, home sin y con producto, ficha, una sola sección por página.

---

# PARTE A · Ronda de corrección: la oferta se ve antes de comprar

## A1. Diagnóstico: por qué no veías las tarjetas

### Por qué el dueño no ve los packs en Shopify

**Verificado desde mi entorno** (repositorio y GitHub):

| # | Pregunta | Respuesta verificada |
|---|---|---|
| A | ¿El código de packs está en la rama de Claude? | **Sí.** `claude/great-lamport-8mb0rc`: `ac99ed5` (packs como variantes) y, desde esta ronda, el commit de la corrección. |
| B | ¿Está en `main`? | **No.** `main` **no contiene ningún tema**: solo imágenes (`GARELON.png`, `LOGOTIPO.png`, `IMAGEN 1…10.png`), sin `sections/`, `snippets/`, `templates/`, `layout/` ni `config/`. |
| C | Último commit de cada rama | `main`: `42de773` «Add files via upload». Rama de Claude antes de esta ronda: `ac99ed5`, 9 commits por delante de `main` y 0 por detrás (10 con el commit de esta ronda). |
| D | ¿Hay PR? | **No.** El repositorio no tiene ninguna pull request, ni abierta ni cerrada. |
| — | ¿Shopify ha escrito en alguna rama? | **No hay commits de Shopify** en ninguna rama. Cuando un tema conectado se edita en el editor, Shopify guarda esos cambios como commits en su rama; no hay ninguno. No prueba que no haya conexión (conectar no crea commits), pero sí que nadie ha guardado cambios en un tema conectado a estas ramas. |
| — | ¿Qué producto usa la compra de la home? | La sección «Producto destacado» (`product_cta`) de `templates/index.json` **no tiene producto elegido** (`"product"` vacío). Dawn usa entonces el **primero del catálogo** (`collections.all.products.first`). |

**Lo que no puedo verificar** (no tengo acceso a tu Admin de Shopify ni a CJ). Son hipótesis, ordenadas de más a menos probable:

| # | Posible causa | Cómo lo compruebas tú |
|---|---|---|
| E | **El producto aún no tiene las 3 variantes reales.** Con una sola variante, el tema no puede pintar tarjetas: solo queda el precio y «Añadir al carrito». La captura `10-editor-aviso-producto-sin-variantes.jpg` reproduce exactamente ese caso. | Admin → Productos → el sérum: ¿aparece la opción «Pack» con 3 variantes? |
| F | **Sigue activo el descuento automático antiguo** (de la etapa AutoDS: «Compra X y obtén Y», segunda unidad o por cantidad). Explica que «al aumentar la cantidad en el carrito aparezca un descuento»: eso no lo hace el tema, lo hace un descuento del Admin. | Admin → Descuentos: busca descuentos automáticos activos que afecten al sérum. |
| G | **Shopify muestra otro tema.** La integración de GitHub crea un tema **nuevo y sin publicar** en la biblioteca, y un tema conectado a `main` no tendría nada que mostrar, porque `main` no tiene tema. Si miras la tienda publicada, ves el tema publicado, que puede ser una versión anterior (ZIP de la ronda 3 o antes). | Tienda online → Temas: mira qué tema está **publicado** y, en los temas de la biblioteca, cuál dice «Conectado a GitHub» y con qué **rama**. |
| H | **La home muestra otro producto.** Si al conectar CJ se importó un producto nuevo (o hay uno de prueba), la home, sin producto elegido, puede estar enseñando otro que no tiene variantes. | Personalizar → Página de inicio → sección de compra → ajuste «Producto». |

**Conclusión:** el código de las tarjetas existe y funciona en la rama de Claude, pero **no está en `main`** y **no puede verse** hasta que se cumplan las 4 condiciones:
1. el tema que miras sale de la rama `claude/great-lamport-8mb0rc`, o de `main` después de fusionarla;
2. el producto tiene la opción «Pack» con «1 unidad», «2 unidades» y «3 unidades»;
3. la sección de compra de la home usa ese producto;
4. no queda ningún descuento automático antiguo que actúe en el carrito.

### Lógica `pack_mode`: cuándo salen las tarjetas

El bloque «GARELON Packs (variantes)» entra en modo packs solo si se cumplen **todas** estas condiciones. Si falla alguna, usa el selector estándar de Dawn y, **en el editor de temas**, muestra un aviso rojo «Configuración de Shopify pendiente o incorrecta para packs» con el motivo exacto. El cliente nunca ve el aviso.

| Condición | Con la configuración objetivo | Si falla, el aviso dice… |
|---|---|---|
| El producto tiene más de una variante | ✅ 3 variantes | «El producto solo tiene una variante…» (**caso más probable hoy**) |
| Hay una sola opción con varios valores (otras opciones con 1 solo valor se aceptan) | ✅ solo «Pack» | «El producto tiene más de una opción con varios valores…» |
| Si has rellenado «Nombre de la opción», existe una opción con ese nombre | ✅ vacío (automático) | «El producto no tiene ninguna opción llamada…» |
| Cada valor contiene su número de unidades | ✅ «1 unidad», «2 unidades», «3 unidades» | «El valor «X» no contiene el número de unidades…» |
| Sin números repetidos | ✅ 1, 2, 3 | «El valor «X» repite un número de unidades…» |
| Existe el pack de 1 unidad (referencia del ahorro) | ✅ | «Falta el pack de «1 unidad»…» |
| Cada valor tiene su variante | ✅ | «No hay variante para el valor…» |

Avisos que no bloquean las tarjetas: «Ordena los valores…», si el primero no es «1 unidad», y «Esta sección no tiene producto elegido…», si la compra de la home no tiene producto asignado.

**Con la configuración objetivo** («Pack» → «1 unidad», «2 unidades», «3 unidades», precios 19,99 / 35,00 / 48,00 €) **entra en `pack_mode`** y pinta las 3 tarjetas. Probado en local con esos datos y también con los nombres de CJ (`1PC`/`2PCS`/`3PCS`, «3 piezas») y con una opción extra de un solo valor (p. ej. «Color: Único»).

## A2. Implementación: qué ha cambiado

| Archivo | Cambio |
|---|---|
| `snippets/garelon-packs.liquid` | Etiqueta **«Oferta limitada»**, título más grande, **introducción**, tarjetas con jerarquía unidades + precio → precio/unidad → **«AHORRA 4,98 € · -12 %»** → **«Comprando por separado: 39,98 €»**; «Sin descuento» en el pack de 1. **Aviso de configuración** solo en el editor. Lectura de unidades más robusta («Pack 2», «2PCS», «x2»). Admite opciones extra de un solo valor. Campo `quantity=1` **siempre** presente. |
| `sections/featured-product.liquid`, `sections/main-product.liquid` | Con bloque de packs, el bloque **«Selector de cantidad» no se pinta aunque esté en la plantilla**. Ajustes nuevos del bloque de packs. Aviso de producto sin asignar (home). |
| `assets/garelon.css` | Nuevo diseño de las tarjetas, etiqueta de oferta, aviso del editor y ajustes para tablet. |
| `assets/garelon.js` | **Fallo corregido** en la compra fija de la ficha: si el usuario saltaba de golpe más allá del botón, no aparecía. |
| `templates/index.json`, `templates/product.json` | Ajustes del bloque: oferta, introducción, porcentaje activado, precio por separado, «Sin descuento». |
| `docs/garelon/…`, este documento | Documentación (apartado A17). |
| `docs/garelon/capturas/packs-v2/*.jpg` | 10 capturas nuevas. |

**Ajustes nuevos en Personalizar** (bloque «GARELON Packs (variantes)»):
- **Etiqueta de oferta:** «Oferta limitada». Vacío = sin etiqueta. Solo aparece si algún pack tiene ahorro.
- **Título:** «Elige tu pack».
- **Introducción:** «Cuantas más unidades incluye tu pack, menos pagas por cada una.».
- **Mostrar porcentaje:** ahora activado por defecto.
- **Mostrar precio comprando por separado** y su texto: «Comprando por separado:».
- **Texto del pack de 1 unidad:** «Sin descuento».
- Los de la ronda anterior se mantienen: insignia, precio por unidad, ahorro, unidades y opción.

**Sin tocar:**
- el core de Dawn (`global.js`, `product-info.js`, `product-form.js`, carrito);
- checkout y pagos;
- cabecera, pie, navegación, logo, fuentes y paleta;
- imágenes, claims, ingredientes, textos legales y contacto.

Tampoco hay cuenta atrás, fechas, stock ni «últimas unidades».

## A3. Home: las 3 ofertas antes del botón

Orden en móvil: **portada → «OFERTA LIMITADA» → «Elige tu pack» → 3 tarjetas → «Añadir al carrito» → plazos de envío**. Sin secciones largas entre la portada y la compra; el botón de la portada («Comprar el sérum») lleva a `#comprar`.

```
EL SÉRUM · Sérum contorno de ojos… · 19,99 €
( • OFERTA LIMITADA )
Elige tu pack
Cuantas más unidades incluye tu pack, menos pagas por cada una.
┌──────────────────────────────────────────┐
│ (●) 1 UNIDAD                    19,99 €  │
│     19,99 €/unidad · Sin descuento       │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ ( ) 2 UNIDADES                  35,00 €  │
│     17,50 €/unidad                       │
│     [AHORRA 4,98 € · -12 %]              │
│     Comprando por separado: 39,98 €      │
└──────────────────────────────────────────┘
┌──────────────────── MEJOR PRECIO/UNIDAD ─┐
│ ( ) 3 UNIDADES                  48,00 €  │
│     16,00 €/unidad                       │
│     [AHORRA 11,97 € · -20 %]             │
│     Comprando por separado: 59,97 €      │
└──────────────────────────────────────────┘
[ AÑADIR AL CARRITO ]
🚚 Preparación estimada: 1–3 días · Entrega estimada en España: aprox. 8–16 días
```

Verificado en el render local (capturas `02`, `03`, `04`): las 3 tarjetas quedan **por encima** de «Añadir al carrito» en todos los anchos (prueba HA2).

## A4. Pack 1

- Tarjeta «1 UNIDAD · 19,99 € · 19,99 €/unidad · Sin descuento».
- **Seleccionada por defecto** si no hay `?variant=` y está disponible: Shopify elige la primera variante disponible, así que «1 unidad» debe ir primera.
- Si «1 unidad» está agotada, Shopify marca la primera disponible y la tarjeta 1 sale desactivada.
- **Añadir:** envía `id` = variante «1 unidad» y `quantity=1`.

## A5. Pack 2

- Tarjeta «2 UNIDADES · 35,00 € · 17,50 €/unidad · AHORRA 4,98 € · -12 % · Comprando por separado: 39,98 €».
- Ahorro = 2 × 19,99 € − 35,00 € = 4,98 € (4,98 ÷ 39,98 = 12,5 %, se muestra -12 %).
- Al elegirla: precio grande 35,00 €, `id` = variante «2 unidades».
- **Añadir:** `id=<variante 2>`, `quantity=1`. El carrito muestra «Pack: 2 unidades · 35,00 € · cantidad 1» (captura `07`).

## A6. Pack 3

- Tarjeta con insignia **«MEJOR PRECIO/UNIDAD»**: «3 UNIDADES · 48,00 € · 16,00 €/unidad · AHORRA 11,97 € · -20 % · Comprando por separado: 59,97 €».
- Ahorro = 3 × 19,99 € − 48,00 € = 11,97 € (11,97 ÷ 59,97 = 19,96 %, se muestra -20 %).
- La insignia se calcula: va al pack con el precio por unidad más bajo, si es uno solo. Si cambias los precios, se mueve o desaparece sola.
- **Añadir:** `id=<variante 3>`, `quantity=1`. El carrito muestra «Pack: 3 unidades · 48,00 € · cantidad 1» (captura `08`), nunca «3 unidades × 3».

## A7. Cantidad = 1 blindada

- Mientras exista el bloque de packs en la sección, **el bloque «Selector de cantidad» no se pinta**, aunque alguien lo añada en Personalizar (probado: Q1 en la home y en la ficha).
- El bloque de packs añade **un único** `<input type="hidden" name="quantity" value="1">` al formulario de Dawn, tanto en modo packs como con el selector estándar.
- Probado: el `POST /cart/add` lleva **un solo** campo `quantity`, con valor 1, en los packs 1, 2 y 3.
- El cliente puede cambiar la cantidad **después**, en el carrito, si quiere dos packs.

## A8. Descuentos: qué debe desactivar el dueño

**Obligatorio.** Admin → **Descuentos** → desactiva, o limita para que no afecten al sérum:
- descuentos automáticos **«Compra X y obtén Y»** (2x1, 3x2…);
- descuentos de **«segunda unidad»** (-50 %, etc.);
- descuentos automáticos **por cantidad** o **por importe mínimo** que afecten al sérum;
- descuentos antiguos de **«pack»**.

**Por qué:** el ahorro ya está en el precio de cada variante (35,00 € y 48,00 €). Si sigue activo el descuento de la etapa AutoDS, el cliente vería el descuento **solo al subir la cantidad en el carrito**, que es exactamente lo que describiste, y además se sumaría al precio del pack.

**Comprobación:** con el pack de 2 en el carrito, el total debe ser **35,00 €** sin línea de descuento; con el de 3, **48,00 €**.

## A9. Shopify: configuración manual

1. **Tema:** mira qué tema estás viendo (apartado A12). Nada de esto se ve en un tema que no salga de la rama `claude/great-lamport-8mb0rc`.
2. **Producto** (Admin → Productos → el sérum → Variantes):
   - opción **«Pack»** con los valores **«1 unidad»**, **«2 unidades»** y **«3 unidades»**, **en este orden**;
   - **precio** de cada variante: 19,99 €, 35,00 € y 48,00 €;
   - **precio comparado vacío** en las tres;
   - SKU, peso e inventario de cada variante: apartado 17 de la parte B.
3. **Si CJ importa el producto con más opciones** (p. ej. «Color» + «Cantidad»): deja **una sola opción «Pack»**. El tema aguanta opciones extra de **un solo** valor, pero el modelo recomendado es una sola opción.
4. **Home:** Personalizar → Página de inicio → sección de compra («Producto destacado», la de «Elige tu pack») → **Producto** → elige el sérum. Haz lo mismo en la ficha si usas una plantilla distinta.
5. **Mira el editor:** si sale el aviso rojo «Configuración de Shopify pendiente o incorrecta para packs», dice exactamente qué falta.
6. **Descuentos:** apartado A8.
7. **Política de envío:** propuesta al final del documento; sustituye `[URL REAL DE CONTACTO]`.

## A10. CJ: mapping manual

| Shopify (opción «Pack») | CJ | Cantidad por línea |
|---|---|---|
| 1 unidad | 1 unidad | 1 |
| 2 unidades | 2 unidades | 1 |
| 3 unidades | **3 piezas** | 1 |

- **Método de envío:** CJPacket Euro Cosmetic Line para España.
- **Sincronización de CJ:** que no sobrescriba nombres de variantes, precios ni textos.
- **Pedido de prueba por pack:** en CJ, antes de pagarlo, comprueba la variante correcta y la cantidad 1.
- Detalle completo en el apartado 18 de la parte B.

## A11. GitHub

- **Rama:** `claude/great-lamport-8mb0rc`.
- **Commit:** el de esta ronda, «Packs visibles en la home: oferta limitada, ahorro antes del carrito, cantidad 1 blindada y aviso de configuración». El hash está en el informe del chat y en `git log`.
- **Push:** sí.
- **`main` contiene los cambios:** **no.** `main` sigue siendo `42de773` y no tiene tema. No he fusionado nada.

## A12. Shopify ↔ GitHub: qué he podido verificar y qué no

- **Verificado:**
  - `main` no tiene tema;
  - la rama de Claude sí tiene la estructura de tema en la raíz (`assets config layout locales sections snippets templates`), más documentación que Shopify ignora (`.shopifyignore`);
  - no hay ninguna PR;
  - no hay commits de Shopify en ninguna rama.
- **No verificado** (necesita tu Admin):
  - qué rama está conectada;
  - qué tema está publicado;
  - si el tema conectado es el que miras.
- **Qué hacer para que Shopify use esta versión**, elige una opción:
  1. **Conectar la rama directamente:** Tienda online → Temas → Añadir tema → Conectar desde GitHub → repositorio `tienda-castor-oil` → rama **`claude/great-lamport-8mb0rc`**. Se crea un tema **sin publicar**: revísalo con «Vista previa» y «Personalizar», y publícalo cuando las pruebas vayan bien.
  2. **Pasar los cambios a `main`:** crea una pull request de `claude/great-lamport-8mb0rc` a `main` y fusiónala (puedo prepararla si me lo pides). Después conecta `main` o, si ya estaba conectada, espera la sincronización.
  3. **Sin GitHub:** sube el ZIP del tema (Temas → Añadir tema → Subir archivo zip).
- **Aviso:** si el tema conectado a una rama está **publicado**, cada push a esa rama cambia la tienda en vivo. Y cada cambio que guardes en el editor de ese tema se guarda como commit en la rama.

## A13. Theme Check

- **0 errores.** 9 avisos, los mismos 9 de la línea base (`ac99ed5`, Dawn 16.0.0).
- Durante la ronda apareció un aviso nuevo (`UnusedAssign` en `garelon-packs.liquid`); ya está corregido.
- Validador de plantillas, schemas y assets: OK. Todos los JSON son válidos y `garelon.js` no tiene errores de sintaxis.
- Sin precios escritos en la lógica. 19,99 / 35,00 / 48,00 € solo aparecen como ejemplo en los textos de ayuda del editor.
- Sin IDs de variante fijos, sin «Más vendido», sin fechas ni cuentas atrás.
- Un solo `<variant-selects>` por sección.

## A14. Responsive

Render local, home, posiciones en píxeles desde arriba de la página:

| Ancho × alto | Scroll horizontal | Fin del botón de la portada | «Oferta limitada» | Fin del pack 3 | Fin de «Añadir al carrito» | Alto de las tarjetas |
|---|---|---|---|---|---|---|
| 320 × 640 | No | 668 | 1024 | 1583 | 1658 | 100 · 147 · 152 |
| 360 × 740 | No | 720 | 1076 | 1600 | 1675 | 100 · 130 · 135 |
| 375 × 667 | No | 643 | 998 | 1523 | 1598 | 100 · 130 · 135 |
| 390 × 844 | No | 733 | 1089 | 1613 | 1688 | 100 · 130 · 135 |
| 430 × 932 | No | 766 | 1089 | 1614 | 1689 | 100 · 130 · 135 |
| 768 × 1024 | No | 552 | 971 | 1520 | 1595 | 97 · 144 · 144 |
| 1024 × 768 | No | 558 | 886 | 1435 | 1510 | 97 · 144 · 144 |
| 1440 × 900 | No | 548 | 914 | 1453 | 1528 | 103 · 133 · 139 |

- «Unidades» y «precio» van en la **misma línea** en todos los anchos. En tablet (750–1199 px) la tarjeta se compacta para que quepan.
- Sin tarjetas desbordadas.
- A 390 px, «Oferta limitada» empieza 356 px por debajo del botón de la portada: título y precio van en medio.

## A15. Capturas

En `docs/garelon/capturas/packs-v2/`, render local con datos simulados. El botón «Comprar ahora» y las fuentes son simulados; en tu tienda los pinta Shopify.

| Archivo | Qué muestra |
|---|---|
| `01-home-390-portada.jpg` | Portada a 390 px con acceso a la compra |
| `02-home-390-tres-packs.jpg` | Oferta limitada + las 3 tarjetas + botón + plazos |
| `03-home-320-tres-packs.jpg` | Lo mismo a 320 px |
| `04-home-1440-producto-packs.jpg` | Escritorio: galería + packs + CTA |
| `05-home-390-pack2-seleccionado.jpg` | Pack 2 elegido: 35,00 € y ahorro |
| `06-home-390-pack3-seleccionado.jpg` | Pack 3 elegido: 48,00 €, ahorro e insignia |
| `07-carrito-390-pack2.jpg` | Carrito: «Pack: 2 unidades», 35,00 €, cantidad 1 |
| `08-carrito-390-pack3.jpg` | Carrito: «Pack: 3 unidades», 48,00 €, cantidad 1 |
| `09-home-390-pack-agotado.jpg` | Pack 3 agotado: desactivado, «Agotado», sin ahorro |
| `10-editor-aviso-producto-sin-variantes.jpg` | Lo que verías **hoy** en el editor si el producto tiene una sola variante |

### Pruebas funcionales (local, JavaScript real de Dawn)

**56/56 correctas**, sin errores de JavaScript. Además de las de la parte B (actualizadas):

| # | Prueba | Resultado |
|---|---|---|
| HA1-HA5 | Home: «OFERTA LIMITADA» + «Elige tu pack» + introducción; 3 tarjetas **antes** del botón; sin selector de cantidad y un solo `quantity`; plazos sin CJ, AutoDS ni costes; textos exactos de las 3 tarjetas | ✅ |
| HB | Home: pack 2 → id 4102, 35,00 €; pack 3 → id 4103, 48,00 €; ahorro visible | ✅ |
| HC | Home → carrito: pack 2 → `id=4102`, `quantity=1` (un solo campo), cantidad 1, 35,00 €; pack 3 → `id=4103`, `quantity=1`, 48,00 € | ✅ |
| HD, RW | 320-1440 px: sin scroll horizontal ni desbordes; unidades y precio en la misma línea | ✅ |
| HE | Home: pack agotado desactivado con «Agotado» y sin ahorro | ✅ |
| Q1 | **Regresión:** packs + «Selector de cantidad» en la plantilla a la vez (home y ficha) → el selector no se pinta y se envía `quantity=1`. El bloque se inyecta solo en el servidor de prueba; ninguna plantilla del repositorio lo lleva. | ✅ |
| E1-E2 | Compra fija: «2 unidades · 35,00 €» y «3 unidades · 48,00 €» | ✅ |
| M | Producto de CJ con opción extra «Color: Único» y con valores `1PC/2PCS/3PCS` → tarjetas 1/2/3 unidades; pack 3 → `id=4103`, `quantity=1` | ✅ |
| DG | Producto con una sola variante: aviso en el editor; el cliente no lo ve | ✅ |
| A0-A7, K1-K2, SEO, R1-R4 | Selección, `?variant=`, agotados, teclado y foco visible, 1 H1 + 1 Product JSON-LD, respaldos | ✅ |

## A16. Pruebas reales no realizadas

**Theme preparado; requiere prueba real en Shopify/CJ.** No he podido hacer:
- ver tu tienda, tu tema publicado ni la rama conectada;
- comprobar si el producto tiene hoy 1 o 3 variantes;
- comprobar si hay descuentos automáticos activos;
- la Section Rendering API real de Shopify al cambiar de pack en la home;
- el carrito y el checkout reales (pagos dinámicos, impuestos, envío);
- el editor de temas real (los ajustes nuevos y el aviso rojo);
- el mapping de CJ, la importación del pedido con variante y cantidad 1, CJPacket Euro Cosmetic Line y el tracking;
- los catálogos de anuncios y los píxeles con 3 variantes.

## A17. Cambios que ChatGPT debe trasladar a los documentos externos

Para `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` y `GARELON_MIGRATION_PROMPT_TEMPLATE.md`, tomando este commit como fuente de verdad:

1. **Proveedor actual:** CJ Dropshipping. Método de envío interno: CJPacket Euro Cosmetic Line (España). Nunca se muestra al cliente.
2. **AutoDS = histórico.** Ya no es el sistema vigente. Pausar y después desconectar el producto de AutoDS; no desinstalar hasta confirmar que CJ funciona.
3. **Packs = variantes reales de Shopify:** una opción «Pack» con «1 unidad», «2 unidades» y «3 unidades», en ese orden. Cada pack es una variante con su precio. En CJ: 1↔1, 2↔2, 3 unidades↔«3 piezas».
4. **Selector visible antes del carrito:** en la home, justo tras la portada: «OFERTA LIMITADA» + «Elige tu pack» + 3 tarjetas + «Añadir al carrito» + plazos. El ahorro se ve **antes** de añadir al carrito.
5. **Oferta limitada real:** la etiqueta «Oferta limitada» es editable y sin cuenta atrás, fecha, stock ni «últimas unidades». Si algún día se pone fecha de fin, tiene que ser real.
6. **Precio por variante:** 19,99 / 35,00 / 48,00 € viven en Shopify, nunca en el tema. Precio comparado vacío.
7. **Ahorro transparente:** referencia = precio de 1 unidad × unidades. Se muestra «Ahorra X € · -N %» y «Comprando por separado: Y €», sin tachados. Insignia «Mejor precio/unidad» calculada. Prohibido «Más vendido» y similares sin datos.
8. **Cantidad = 1:** cada pack se compra con cantidad 1; el carrito muestra «Pack: N unidades» × 1.
9. **Selector de cantidad bloqueado:** con el bloque de packs, el «Selector de cantidad» no se pinta aunque esté configurado.
10. **Descuentos:** ningún descuento automático «Compra X y obtén Y», de segunda unidad, por cantidad ni de pack para el sérum. El ahorro ya está en el precio de la variante.
11. **Diagnóstico:** si el producto no cumple las condiciones, el editor muestra «Configuración de Shopify pendiente o incorrecta para packs» con el motivo. La compra de la home debe tener el producto elegido explícitamente.
12. **Shopify + GitHub:** el tema vive en GitHub. La rama conectada a Shopify genera un tema en la biblioteca, y los cambios del editor vuelven como commits. `main` hoy no tiene tema. Flujo: rama de trabajo → vista previa → PR a `main` → publicar.
13. **Flujo futuro para un producto nuevo:**
    1. brief;
    2. producto y variantes en Shopify (opción «Pack» si hay packs);
    3. mapping con el proveedor;
    4. descuentos revisados;
    5. tema en una rama nueva;
    6. vista previa y editor sin avisos;
    7. pedidos de prueba;
    8. PR a `main`;
    9. publicar.

---

# PARTE B · Ronda anterior: CJ Dropshipping y packs como variantes reales

> Sigue vigente. Donde esta ronda cambia algo, se indica con **(Actualizado)**.

## 1. Resumen del cambio

- **Packs = variantes reales.** El antiguo bloque «GARELON Packs» cambiaba la cantidad (pack 2 → cantidad 2) y estaba desactivado. Ahora cada tarjeta es una **variante de Shopify** y se compra con **cantidad 1**:

  | Tarjeta | Variante que se selecciona | Cantidad |
  |---|---|---|
  | 1 unidad | «1 unidad» | 1 |
  | 2 unidades | «2 unidades» | 1 |
  | 3 unidades | «3 unidades» (en CJ, «3 piezas») | 1 |

  Nunca se envía «2 unidades» × 2 ni «3 unidades» × 3.
- **Selector premium «Elige tu pack»** en la home y en la ficha de producto:
  - precio real de cada variante, precio por unidad y ahorro real frente a comprar las unidades sueltas;
  - insignia objetiva «Mejor precio/unidad» en el pack de 3.
  - Por defecto se muestra **1 unidad**.
- **Compra más arriba en la home:** la zona de compra real (`#comprar`) se ha **movido** justo después de la portada, sin duplicar el formulario. En móvil, el formulario con los packs va antes que la galería.
- **Plazos de envío** junto a la compra, prudentes: «Preparación estimada: 1–3 días» · «Entrega estimada en España: aproximadamente 8–16 días» · «Los plazos pueden variar según destino y transporte». Los mismos plazos están en la FAQ y en la pestaña «Envíos y devoluciones».
- **Compra fija de la ficha:** ahora muestra el pack elegido («2 unidades · 35,00 €»).
- **Documentación:** el sistema vigente pasa de «Shopify + AutoDS» a «Shopify + proveedor actual (hoy CJ Dropshipping)».
- **Corrección de un fallo existente:** con precios distintos entre variantes, la portada y la llamada final habrían mostrado un precio roto (`NaN €` en la prueba local). Ahora muestran «A partir de 19,99 €».

## 2. Archivos modificados

| Archivo | Cambio |
|---|---|
| `snippets/garelon-packs.liquid` | Reescrito: selector de packs sobre variantes reales (apartado 5) |
| `sections/main-product.liquid` | El bloque `garelon_packs` recibe el producto; nuevo bloque `garelon_shipping`; el bloque `variant_picker` no se pinta si hay bloque de packs; schema nuevo del bloque de packs (quitados `max_units` y `note`) |
| `sections/featured-product.liquid` | Bloques `garelon_packs` y `garelon_shipping`; el mismo control de `variant_picker`; ajuste `garelon_mobile_info_first` (móvil: compra antes que la galería); texto de ayuda de `garelon_gallery` |
| `sections/garelon-sticky-atc.liquid` | Línea con la variante/pack elegido junto al precio |
| `assets/garelon.js` | Quitado el antiguo `<garelon-packs>` (cambiaba la cantidad); la compra fija muestra el pack elegido |
| `assets/garelon.css` | Estilos de las tarjetas de packs, caja de plazos, línea de variante de la compra fija, orden móvil de la compra; movimiento reducido |
| `snippets/garelon-price-inline.liquid` | «A partir de 19,99 €» bien formateado cuando el precio varía (antes aplicaba `money` al texto traducido) |
| `snippets/garelon-stock.liquid` | Comentario: «los datos que sincroniza el proveedor» en vez de AutoDS |
| `templates/index.json` | Orden nuevo (compra justo después de la portada); packs y plazos en la compra; sin selector de cantidad ni subtítulo; compra en esquema 2 (arena), márgenes 40/56; características con márgenes 32/32; FAQ: plazos y nueva pregunta de packs |
| `templates/product.json` | Packs activos (sin `variant_picker` ni `quantity_selector`); bloque de plazos tras el inventario; pestaña «Envíos y devoluciones» con plazos; FAQ igual que la home |
| `templates/page.faq.json` | FAQ: plazos y pregunta de packs |
| `docs/garelon/GARELON_MASTER_TEMPLATE.md` | Versión 1.1: CJ como proveedor vigente y packs como variantes reales (apartado 11) |
| `docs/garelon/GARELON_PRODUCT_MIGRATION_CHECKLIST.md` | Comprobaciones de packs, proveedor, descuentos y plazos |
| `docs/garelon/GARELON_PRODUCT_BRIEF_TEMPLATE.md` | Proveedor genérico (CJ), packs y plazos en el formulario |
| `GARELON-GUIA.md` | Nota de actualización; proveedor actual CJ |
| `GARELON-COPIAR-PEGAR.md` | Aviso: es de la ronda 3; para esta versión, ZIP, GitHub o archivos completos |

## 3. Archivos creados

- `snippets/garelon-shipping.liquid`: bloque «GARELON Plazos de envío».
- `GARELON-CAMBIOS-CJ-PACKS.md`: este documento.
- `docs/garelon/capturas/cj-packs/*.jpg`: 7 capturas del render local (apartado 16).

## 4. Archivos eliminados

- **Ninguno.**
- Se ha retirado **código** dentro de archivos existentes:
  - el elemento `<garelon-packs>` de `assets/garelon.js`, que cambiaba la cantidad;
  - los ajustes `max_units` y `note` del bloque de packs;
  - los bloques `variant_picker` y `quantity_selector` de `templates/index.json` (compra) y `templates/product.json`;
  - el bloque `subtitle` de la compra de la home.

## 5. Cómo funciona ahora el selector

- **Qué es:** el bloque **«GARELON Packs (variantes)»** pinta el mismo `<variant-selects>` que usa Dawn para sus variantes, con una tarjeta por variante. Cada tarjeta es un radio real (`fieldset` + `legend` «Elige tu pack» + `label`).
- **Al pulsar una tarjeta**, Dawn hace todo sin JavaScript nuevo (`global.js` y `product-info.js`, sin tocar):
  1. selecciona la variante real;
  2. pide la sección actualizada a Shopify;
  3. cambia el precio, el stock y el botón;
  4. cambia el `id` de variante del formulario;
  5. en la ficha, cambia la URL (`?variant=…`);
  6. vuelve a pintar las tarjetas con los datos reales;
  7. avisa a la compra fija (`PUB_SUB_EVENTS.variantChange`).
- **Añadir al carrito:** es el botón real de Dawn (`product-form.js`), que envía el `id` de la variante elegida y `quantity=1` (campo oculto del bloque). **(Actualizado)** Con bloque de packs, el «Selector de cantidad» no se pinta aunque esté en la plantilla.
- **Selección inicial:** la de Shopify.
  - Si la URL trae `?variant=<id>`, se marca esa tarjeta.
  - Si no, la primera variante disponible. Por eso **«1 unidad» debe ser la primera variante** en Shopify (apartado 17).
  - No se preselecciona nunca un pack mayor.
- **Teclado y lector de pantalla:**
  - Tab entra en el grupo y las flechas cambian de pack; el foco se mantiene tras el refresco y es visible.
  - El precio por unidad se lee «17,50 € por unidad».
  - El ahorro se lee «Ahorra 4,98 € frente a comprar 2 unidades por separado (39,98 €)».
- **Respaldo seguro:** si el producto no encaja, el bloque muestra el selector de variantes estándar de Dawn. **(Actualizado)** Además, en el editor aparece el aviso «Configuración de Shopify pendiente o incorrecta para packs» con el motivo; las condiciones están en la parte A, apartado A1.
- **Un solo selector por sección:** si en la plantilla hay bloque de packs, el bloque «Selector de variantes» de Dawn no se pinta aunque alguien lo añada. Así no hay dos `<variant-selects>` con el mismo id.
- **Editable en Personalizar** (bloque «GARELON Packs (variantes)»):
  - título («Elige tu pack»);
  - nombre de la opción (vacío = la única opción) y «Unidades de cada pack» (p. ej. `1,2,3`, solo si los valores no empiezan por el número);
  - «unidad» / «unidades»;
  - mostrar precio por unidad, mostrar ahorro y mostrar porcentaje (**(Actualizado)** activado por defecto);
  - **(Actualizado)** etiqueta «Oferta limitada», introducción, «Comprando por separado» y «Sin descuento» (parte A, apartado A2);
  - texto de la insignia (vacío = sin insignia) y nota del ahorro;
  - tipo de selector de respaldo.
- **Diseño:**
  - tarjetas crema/blanco con borde suave, radio 6 px y al menos 64 px de alto;
  - la elegida lleva borde tinta de 2 px, fondo blanco y radio lleno;
  - ahorro en dorado accesible (`#7A5A24`);
  - insignia pequeña tinta con dorado claro sobre el borde de la tarjeta;
  - todo con los tokens GARELON existentes.

## 6. Cómo calcula los ahorros

Todo en Liquid, con los precios de Shopify:

- **Unidades del pack:** el número con el que empieza el valor de la opción («2 unidades» → 2).
- **Referencia** = precio de la variante «1 unidad» × unidades del pack.
- **Ahorro** = referencia − precio del pack. Solo se muestra si es mayor que 0 y el pack está disponible.
- **Porcentaje** = ahorro ÷ referencia, redondeado. **(Actualizado)** Activado por defecto; se puede desactivar en Personalizar.
- **Precio por unidad** = precio del pack ÷ unidades, redondeado al céntimo.
- **Insignia «Mejor precio/unidad»:** va al pack con el precio por unidad más bajo, solo si es uno solo, tiene más de 1 unidad y está disponible. Si mañana cambias precios, la insignia se mueve sola o desaparece.

Con los precios objetivo:

| Pack | Precio (Shopify) | Por separado | Ahorro mostrado | % (opcional) | Por unidad |
|---|---|---|---|---|---|
| 1 unidad | 19,99 € | — | — | — | 19,99 €/unidad |
| 2 unidades | 35,00 € | 39,98 € | Ahorra 4,98 € | -12 % | 17,50 €/unidad |
| 3 unidades | 48,00 € | 59,97 € | Ahorra 11,97 € + insignia | -20 % | 16,00 €/unidad |

**No se usa `compare_at_price`:** nada aparece tachado. **(Actualizado)** Cada tarjeta con ahorro dice «Comprando por separado: 39,98 €» / «59,97 €»; la nota bajo las tarjetas queda vacía en las plantillas.

## 7. Cómo obtiene el precio real

- **Tarjetas:** `variant.price` de cada variante, con el formato de moneda de la tienda (`money`).
- **Precio grande del formulario:** el bloque de precio de Dawn, que se actualiza al cambiar de pack.
- **Portada y llamada final:** `garelon-price-inline`, que muestra «A partir de 19,99 €» porque el precio varía entre variantes.
- **Compra fija:** copia el precio del formulario.
- **Carrito y checkout:** de Shopify.
- Ningún precio está escrito en el tema. Los 19,99 / 35,00 / 48,00 € solo existen en tu Admin.

## 8. Cómo maneja las variantes

- **Estructura esperada:**
  - una sola opción; recomendado el nombre **«Pack»**;
  - valores **«1 unidad»**, **«2 unidades»** y **«3 unidades»**, en ese orden.
- **¿Por qué «Pack» y no «Cantidad»?** El carrito muestra «Pack: 2 unidades» junto a la cantidad 1. Con «Cantidad» se leería «Cantidad: 2 unidades» al lado del selector de cantidad, que confunde. El tema funciona con cualquiera de los dos nombres.
- **«3 piezas» de CJ:**
  - la tarjeta muestra «3 unidades» aunque el valor en Shopify siga siendo «3 piezas»;
  - **aun así renómbralo a «3 unidades» en Shopify**, porque el carrito, el checkout y los emails muestran el valor real de Shopify.
  - Renombrar en Shopify no cambia el mapping con CJ: comprueba después que sigue emparejado (apartado 18).
- **Nada hardcodeado:** IDs, SKU, disponibilidad y precios salen del objeto `product` de Shopify.

## 9. Cómo maneja el stock

- **Pack agotado:**
  - la tarjeta se ve con borde discontinuo y el texto «Agotado»;
  - su radio está desactivado, no se puede elegir y pierde la insignia y el ahorro.
- **Nunca** se muestran cifras («Solo quedan 3»).
- **Si alguien llega con `?variant=` de un pack agotado:** el botón de Dawn dice «Agotado», no deja comprar y la compra fija se desactiva.
- **Si «1 unidad» está agotada:** Shopify selecciona la primera disponible (2 unidades), que es su comportamiento estándar.
- **Stock visible:** sigue el mismo: solo «En stock» o «Agotado» en la home, y el inventario de Dawn sin cifras en la ficha.

## 10. Cómo maneja los textos de envío

- **Nuevo bloque «GARELON Plazos de envío»** (editable en Personalizar), en la home tras el stock y en la ficha tras el inventario:
  - «Preparación estimada: 1–3 días.»
  - «Entrega estimada en España: aproximadamente 8–16 días.»
  - «Los plazos pueden variar según destino y transporte.»
  - Enlace «Política de envío», que lleva a tu política real.
- **Mismos plazos** en la FAQ («¿Cuándo recibiré mi pedido?») de la home, la ficha y la página de preguntas frecuentes, y en la pestaña «Envíos y devoluciones» de la ficha.
- **Nunca aparecen:**
  - CJ Dropshipping, CJPacket, pesos, costes de envío internos, aranceles, despacho ni márgenes;
  - «entrega garantizada», «24/48 h» ni «envío express»;
  - el «5–11 días para el 54 %» de CJ convertido en promesa.
- **Barra superior:** sin cambios, «Envío disponible a toda España» + bandera.

## 11. Cambios en la documentación (AutoDS → CJ)

`GARELON_MASTER_TEMPLATE.md` pasa a la versión 1.1. Qué cambia:

- **Proveedor:**
  - donde decía «Producto → AutoDS» ahora dice «Producto → proveedor/fulfillment actual (hoy CJ Dropshipping)»;
  - nueva sección **15.5 «Proveedor y fulfillment»**: sistema vigente, mapping, método interno, plazos al cliente y AutoDS como histórico.
- **Reglas:**
  - **R7 · Descuentos y packs:** el precio de un pack es un precio real de variante, no un descuento ficticio. El ahorro se calcula frente a 1 unidad × unidades, sin tachados falsos y sin «Compra X y obtén Y» acumulable. Insignias solo objetivas.
  - **R8 · Shopify y proveedor:** la misma filosofía (nada hardcodeado) con el proveedor vigente, y «un pack = una variante con cantidad 1».
  - **Prioridad 4:** «No romper el proveedor/fulfillment».
- **Packs y plazos:**
  - **10.11 Packs:** reescrita como selector de variantes reales (ya no «1/2/3 cambiando la cantidad»);
  - **10.12:** nuevo bloque de plazos;
  - **6.4-6.6, 10.7, 10.10, 14 y 15.1:** bloques y archivos nuevos.
- **Home:** 9.1 y 9.2 con el nuevo orden (compra justo tras la portada) y su motivo; 8 con la nueva alternancia de fondos (1-2-1-2-2-1-2-2-1).
- **Datos:**
  - **NEW PRODUCT DATA:** variables nuevas `{{PRODUCT_PACKS}}`, `{{SHIPPING_ESTIMATE_TEXT}}` y `{{PRODUCT_SUPPLIER}}`;
  - **Anexo A:** valores actuales de packs, proveedor y plazos.
- **Otras secciones:**
  - **7.6:** estilo de las tarjetas de packs y de la caja de plazos;
  - **13.3:** política de envío;
  - **17.4:** frases de FAQ de envío y de packs;
  - **21:** accesibilidad de los packs;
  - **23:** proveedor y contrato de `<variant-selects>` (NO TOCAR);
  - **24-26:** CRO, tareas del Admin y pruebas de packs.
- **Checklist y brief:** comprobaciones y campos de packs, proveedor, descuentos y plazos.
- **Guías de la raíz:** `GARELON-GUIA.md` lleva una nota de actualización. `GARELON-COPIAR-PEGAR.md` avisa de que es de la ronda 3.
- **Documentos que no están en el repositorio** (no los he podido actualizar; si los tienes fuera, cambia en ellos «AutoDS» por «proveedor actual: CJ Dropshipping» y el sistema de packs):
  - `docs/garelon/GARELON_MIGRATION_PROMPT_TEMPLATE.md`;
  - `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md`.

## 12. Pruebas realizadas

Montaje local:
- un servidor que imita Shopify renderiza el `layout/theme.liquid` real y las secciones reales del repositorio con liquidjs;
- datos simulados: 3 variantes a 19,99 / 35,00 / 48,00 €;
- también imita la Section Rendering API (`?section_id=…&option_values=…`), `/cart/add` y las secciones del carrito;
- se prueba en Chromium con el **JavaScript real de Dawn**: `global.js`, `product-info.js`, `product-form.js`, `cart-drawer.js` y `cart.js`.

**Resultado: 29/29 correctas**, sin errores de JavaScript en consola. **(Actualizado)** En esta ronda: 56/56 (parte A, apartado A15).

| # | Prueba | Resultado |
|---|---|---|
| A0 | Sin `?variant=`, seleccionada «1 unidad» | ✅ |
| A1-A3 | Tarjeta 1/2/3 → variante real (id 4101/4102/4103), precio 19,99/35,00/48,00 €, URL `?variant=` | ✅ |
| A4 | `?variant=4103` abre con la tarjeta «3 unidades» marcada | ✅ |
| A5 | Pack agotado: radio desactivado, «Agotado», sin insignia ni ahorro, no se puede elegir | ✅ |
| A6 | `?variant=` de un pack agotado: botón «Agotado» desactivado (principal y compra fija) | ✅ |
| A7 | «1 unidad» agotada → Shopify elige la primera disponible | ✅ |
| B1-B3 | 19,99 €/unidad + «Sin descuento» · 17,50 €/unidad + «Ahorra 4,98 € · -12 %» + «Comprando por separado: 39,98 €» · 16,00 €/unidad + «Ahorra 11,97 € · -20 %» + «Comprando por separado: 59,97 €» + insignia solo en el pack de 3 | ✅ |
| B4 | Sin «Más vendido», «Favorito» ni precios tachados | ✅ |
| — | Porcentaje opcional: -12 % y -20 % | ✅ |
| C1 | La compra fija envía `id=4102` y `quantity=1` a `/cart/add` | ✅ |
| C/D | Packs 1, 2 y 3 desde el botón principal → `id` real y `quantity=1`; el cart drawer muestra «Pack: N unidades» × 1 con el subtotal correcto, eliminar y «Finalizar compra» | ✅ |
| E1 | Compra fija: «2 unidades · 35,00 €», botón activo | ✅ |
| H0-H2 | Home: packs en `#comprar`; pack 2 → id 4102, 35,00 €, «En stock», la URL no cambia; añadir → `id=4102`, `quantity=1`, carrito «2 unidades» × 1 | ✅ |
| K1-K2 | Teclado: flecha abajo selecciona «2 unidades» y el foco se queda en su radio; contorno de foco visible | ✅ |
| SEO | Home y ficha: 1 H1 y 1 `Product` JSON-LD | ✅ |
| R1 | Valor «3 piezas» sin renombrar → la tarjeta dice «3 unidades» (se envía el valor real) | ✅ |
| R2 | Valores sin número + «Unidades de cada pack» `1,2,3` → tarjetas correctas | ✅ |
| R3 | Valores sin número → selector estándar de Dawn, que sigue funcionando | ✅ |
| R4 | Producto sin variantes → sin selector, formulario correcto | ✅ |
| — | Nombre de opción distinto del ajuste → selector estándar; sin distinguir mayúsculas → packs | ✅ |
| Enlaces | Sin `href="#"` ni vacíos del tema. Todas las anclas `/#…` de la home existen. El enlace de plazos va a `/policies/shipping-policy` (resuelto con `garelon-url`). | ✅ |
| LCP | Una sola imagen `eager` con `fetchpriority="high"` en la home (la portada) | ✅ |

## 13. Pruebas no realizadas (necesitan tu tienda)

No tengo acceso a tu Shopify ni a CJ, así que **no puedo afirmar que CJ reciba bien los pedidos**. Estado: **tema preparado; requiere prueba real en Shopify y CJ.** Pendiente:

- **Render real y Section Rendering API** en tu tienda, sobre todo en la home: el cambio de pack en la sección «Producto destacado» usa la URL del producto, como hace Dawn.
- **Variantes, precios, SKU e inventario reales:** no existen hasta que los crees.
- **Carrito y checkout reales:**
  - botones de pago dinámico (Shop Pay, PayPal, Apple Pay…);
  - descuentos del Admin;
  - impuestos y tarifa de envío 0 € en las zonas anunciadas.
- **Editor de temas:** ajustes del bloque de packs y de plazos.
- **CJ:**
  - mapping de variantes;
  - importación del pedido con la variante y cantidad correctas;
  - método de envío CJPacket Euro Cosmetic Line;
  - tracking.
- **Apps y píxeles** (Meta, TikTok) y **catálogos de anuncios** con 3 variantes.
- **Multimedia real** del producto en la ficha: mi montaje no tenía fotos en la ficha, así que en tu tienda los packs quedarán debajo de la galería en móvil, como cualquier selector de Dawn.

## 14. Theme Check

- **0 errores y 9 avisos**, los mismos 9 de Dawn 16.0.0 de la línea base (`OrphanedSnippet`, `VariableName` ×2, `UnusedAssign` ×2, `LiquidComplexity`, `UndefinedObject` ×3). **(Actualizado)** Igual tras esta ronda.
- Ningún aviso nuevo.

## 15. Validador de plantillas, schemas y assets

- `OK: plantillas, schemas y assets coherentes` (anexo B.2 del Master), antes y después del cambio.
- Todos los `templates/*.json`, `sections/*-group.json` y `config/*.json` son JSON válidos.

## 16. Responsive

**(Actualizado)** Las tarjetas son más altas en esta ronda: la tabla vigente está en la parte A, apartado A14. Tabla de la ronda anterior, como referencia:

| Ancho × alto | Scroll horizontal | Cabecera / barra | Fin del botón de la portada | Empiezan los packs | Fin de «Añadir al carrito» | Alto de las tarjetas |
|---|---|---|---|---|---|---|
| 320 × 640 | No | 57 / 38 | 668 | 1022 | 1464 | 72 · 92 · 96 |
| 360 × 740 | No | 57 / 38 | 720 | 1074 | 1516 | 72 · 92 · 96 |
| 375 × 667 | No | 57 / 38 | 643 | 997 | 1439 | 72 · 92 · 96 |
| 390 × 844 | No | 57 / 38 | 733 | 1087 | 1529 | 72 · 92 · 96 |
| 430 × 932 | No | 57 / 38 | 766 | 1088 | 1489 | 72 · 72 · 76 |
| 768 × 1024 | No | 57 / 38 | 552 | 968 | 1410 | 72 · 92 · 96 |
| 1024 × 768 | No | 69 / 38 | 558 | 883 | 1325 | 72 · 92 · 96 |
| 1440 × 900 | No | 69 / 38 | 548 | 911 | 1353 | 72 · 92 · 96 |

- **Primera pantalla (móvil):** producto, beneficio (H1), frase, precio «A partir de 19,99 €» y botón «Comprar el sérum». El botón está dentro de la primera pantalla de 360 a 430 px; a 320 × 640 queda 28 px por debajo, igual que antes del cambio.
- **Packs y «Añadir al carrito»:** con un deslizamiento, justo debajo de la portada. El botón de la portada lleva directo a ellos (`/#comprar`).
- **Sin recortes:** ni textos ni insignias cortados en ningún ancho. La insignia queda siempre dentro de su tarjeta, sin tocar la anterior.
- **Cabecera y barra superior:** no se han tocado.
- **Capturas** en `docs/garelon/capturas/cj-packs/`:
  - `home-390-primera-pantalla.jpg`, `home-390-packs.jpg`, `home-320-packs.jpg`, `home-1440-packs.jpg`;
  - `ficha-390-pack-agotado.jpg`, `ficha-390-compra-fija.jpg`, `carrito-390-pack-2.jpg`.
  - En las capturas el botón de pago dinámico y las fuentes son simulados: en tu tienda los pinta Shopify.

## 17. Pasos manuales en Shopify (en este orden)

> **No desinstales ni borres nada crítico hasta completar las pruebas del paso 12.**

1. **Copia de seguridad:** Tienda online → Temas → tema publicado → ⋯ → **Duplicar**.
2. **AutoDS en pausa para este producto:** si AutoDS actualiza automáticamente precio, stock o variantes del sérum, **pausa esas actualizaciones solo para este producto** mientras haces los pasos 3-7. Si no, podría sobrescribir las variantes o los precios nuevos. No lo desinstales todavía.
3. **Conectar CJ Dropshipping** con Shopify: instala o autoriza la app de CJ desde tu cuenta de CJ y conecta la tienda.
4. **Variantes del producto.** Recomendado: **usar el producto actual** (conservas la URL, el SEO, los anuncios y los píxeles).
   - Productos → el sérum → **Variantes** → añade la opción **«Pack»** con los valores **«1 unidad»**, **«2 unidades»** y **«3 unidades»**, **en ese orden**. La variante actual pasa a ser «1 unidad».
   - Si prefieres **importar el producto desde CJ**:
     - renombra la opción a «Pack» y los valores a «1 unidad», «2 unidades» y «3 unidades» (el «3 piezas» de CJ → «3 unidades»);
     - retira el producto antiguo del canal Tienda online, o archívalo, y crea una redirección `/products/<handle-antiguo>` → `/products/<handle-nuevo>`;
     - en Personalizar, elige el producto nuevo en Portada, Producto destacado (compra), Imagen y texto y Llamada final. Si no, la home podría mostrar el producto antiguo.
5. **Precios** (en cada variante):
   - 1 unidad → **19,99 €**
   - 2 unidades → **35,00 €**
   - 3 unidades → **48,00 €**
   - **Precio comparado vacío en las tres.** No pongas 39,98 € ni 59,97 € como precio anterior.
6. **Datos de cada variante:**
   - **SKU:** el de su variante de CJ.
   - **Peso:** 62 g, 112 g y 168 g (los de CJ), sobre todo si tus tarifas de envío dependen del peso.
   - **Inventario:**
     - si «Hacer seguimiento de la cantidad» está activo, cada variante debe tener stock o sincronizarlo desde CJ; si no, la tarjeta saldrá «Agotado»;
     - si CJ no sincroniza stock, valora desactivar el seguimiento.
7. **Descuentos:** revisa el apartado 19 y desactiva lo que corresponda.
8. **Tema nuevo:** Tienda online → Temas → Añadir tema → **Subir archivo zip** (`garelon-theme.zip`), o sincroniza la rama con la integración de GitHub.
   - **No lo publiques todavía.**
   - Si cambiaste algo en el editor después de la ronda 3, ese cambio no está en el repositorio: revísalo en la vista previa.
9. **Vista previa** en el móvil y en el ordenador. Comprueba:
   - «Elige tu pack» con 3 tarjetas, 1 unidad marcada, precios, «Ahorra 4,98 €» / «Ahorra 11,97 €» e insignia solo en el pack de 3;
   - al cambiar de pack cambian el precio grande y el botón;
   - en la ficha cambian la URL y la compra fija;
   - el carrito muestra **«Pack: 2 unidades» con cantidad 1** (y lo mismo con 1 y 3);
   - en Personalizar puedes editar «Elige tu pack», la insignia, el ahorro, el precio por unidad y los plazos.
10. **Política de envío:** Configuración → **Políticas** → Política de envío. Pega la propuesta del final de este documento y ajústala a tus zonas reales. No la he modificado yo: vive en tu Admin.
11. **Tarifas de envío:** Configuración → **Envío y entrega**. Revisa qué paga el cliente por España. Es independiente del coste interno de CJ, que nunca se muestra.
12. **Pedidos de prueba:** uno por pack o, como mínimo, el mapping de los tres revisado en CJ (apartado 18). Comprueba en el pedido de Shopify:
    - pack 1 → **1 línea** «1 unidad» × 1;
    - pack 2 → **1 línea** «2 unidades» × 1 (no «2 unidades» × 2);
    - pack 3 → **1 línea** «3 unidades» × 1 (no «3 unidades» × 3).
13. **AutoDS:** cuando CJ funcione (paso 12 y tracking del apartado 18), **desconecta o elimina este producto de AutoDS**. Así no vuelve a sobrescribir stock, precio, imágenes, variantes ni fulfillment. Desinstala AutoDS solo si no lo usas para nada más y no tienes pedidos pendientes con él.
14. **Publica el tema.** Después, revisa los catálogos de anuncios y píxeles: ahora hay 3 variantes con 3 precios. Solo entonces lanza las campañas.

## 18. Pasos manuales en CJ Dropshipping

1. **Producto:** confirma que es el **mismo** que el actual:
   - sérum Baafven de 10 ml con roller, mismo envase, etiqueta y caja;
   - el pack de «3 piezas» son 3 unidades de ese mismo producto.
2. **Conectar y emparejar (mapping)** el producto de Shopify con el de CJ, variante por variante:

   | Shopify | CJ |
   |---|---|
   | 1 unidad | 1 unidad |
   | 2 unidades | 2 unidades |
   | 3 unidades | **3 piezas** |

   **Cantidad 1 por línea.** Si CJ pide una equivalencia de cantidades, cada variante de Shopify corresponde a **1** de su variante de CJ.
3. **Después de renombrar las variantes en Shopify**, vuelve a comprobar en CJ que las tres siguen emparejadas.
4. **Envío:** método **CJPacket Euro Cosmetic Line** para España en los tres packs. Es un cosmético.
5. **Sincronización:** si la app de CJ puede actualizar título, descripción, imágenes, nombres de variantes o precios en Shopify, **desactívalo para este producto**, o comprueba que no pisa lo que has editado.
6. **Pedido de prueba:** revisa en CJ, **antes de pagarlo**, que llega con:
   - la variante correcta (pack 3 → «3 piezas»);
   - cantidad 1;
   - la dirección correcta;
   - CJPacket Euro Cosmetic Line.

   Si no quieres recibirlo, cancélalo en CJ y en Shopify.
7. **Tracking:** confirma que CJ sube el número de seguimiento a Shopify y que Shopify envía el email de envío al cliente.
8. **Datos internos:** pesos (62 / 112 / 168 g), coste de envío que muestra CJ (4,89 / 5,78 / 6,77 €), coste total que muestra CJ (5,72 / 7,44 €; el del pack de 3 no lo indicaste), aranceles y despacho. Solo son para tu margen: **no los pongas en la tienda**.

## 19. Descuentos automáticos que deben desactivarse

En **Admin → Descuentos**, desactiva (o limita para que no afecten al sérum) cualquier descuento que se sume al precio de los packs:

- «Compra X y obtén Y» (p. ej. 2x1, 3x2, «segunda unidad al 50 %»);
- descuentos automáticos por cantidad o por importe mínimo que afecten al sérum;
- descuentos de «packs» o de «segunda unidad» creados antes;
- códigos promocionales antiguos que pudieran combinarse con los packs, si no quieres ese doble descuento.

**Cómo comprobarlo:** en la vista previa, añade el pack de 2 y el de 3 al carrito. El total debe ser exactamente 35,00 € y 48,00 €, sin líneas de descuento. En el checkout, con una dirección de una zona con envío gratis, el envío debe aparecer a 0 €.

**Cantidad Shopify / precios por volumen (B2B):** no los uses para los packs. El ahorro ya está en el precio de cada variante.

## 20. Riesgos pendientes

1. **Sin prueba real** en Shopify ni en CJ (apartado 13). El mapping es el punto crítico: si CJ empareja «3 unidades» con «1 unidad», o multiplica cantidades, se enviaría mal. Hay que verificarlo con un pedido.
2. **AutoDS activo a la vez:** podría sobrescribir variantes, precios o stock. Pausa y después desconecta (pasos 2 y 13).
3. **Variante no renombrada** («3 piezas»): la tarjeta dice «3 unidades», pero el carrito, el checkout y los emails dirán «3 piezas». Renómbrala.
4. **Orden de las variantes:** si «1 unidad» no es la primera, la selección por defecto podría ser otro pack. **(Actualizado)** El editor lo avisa.
11. **(Actualizado) Tema equivocado o producto equivocado:** `main` no tiene tema, y la compra de la home no tiene producto elegido (parte A, apartado A1).
5. **Descuentos antiguos** que se acumulen con los packs (apartado 19).
6. **Plazos:** son estimaciones de CJ para España. Si los reales difieren, cambia el bloque de plazos, la FAQ, la pestaña de la ficha y la política a la vez. No se promete nada sobre aduanas.
7. **Devoluciones parciales de un pack:** la política actual no dice qué se reembolsa si el cliente devuelve 1 de las 3 unidades. Decide tu criterio (p. ej. la parte proporcional del pack) y, si quieres, añádelo a la política. No la he modificado.
8. **Cambios hechos en el editor** después de la ronda 3: el ZIP sustituye `templates/index.json` y `templates/product.json`. Revísalo en la vista previa antes de publicar.
9. **Catálogos de anuncios y píxeles:** con 3 variantes, Meta y TikTok verán 3 precios. Revisa los anuncios que muestren el precio.
10. **Otros mercados o monedas** (si algún día los activas): el ahorro se calcula con los precios de esa moneda y podría salir con céntimos poco redondos.

---

## Propuesta de texto para la política de envío (pegar en Admin → Configuración → Políticas → Política de envío)

> Revísala y ajusta lo que está entre corchetes. **Sustituye `[URL REAL DE CONTACTO]`** por la dirección real de tu página de contacto (Tienda online → Páginas; por ejemplo, `/pages/…`). No la he podido verificar. No menciona a ningún proveedor ni promete nada que no esté verificado.

```html
<h2>Zonas de envío</h2>
<p>Realizamos envíos a toda España [confirma si incluyes Baleares, Canarias, Ceuta y Melilla según tus zonas de envío de Shopify].</p>

<h2>Plazos de preparación y entrega</h2>
<p><strong>Preparación estimada:</strong> 1–3 días desde la confirmación del pedido.</p>
<p><strong>Entrega estimada en España:</strong> aproximadamente 8–16 días desde el envío.</p>
<p>Son plazos orientativos: pueden variar según el destino, el transporte, los días festivos o incidencias logísticas.</p>

<h2>Seguimiento</h2>
<p>[Solo si has comprobado que el seguimiento llega a Shopify:] Cuando tu pedido salga, recibirás un email con el número de seguimiento.</p>

<h2>Gastos de envío</h2>
<p>El envío es gratuito [en las zonas en las que tengas una tarifa de 0 € en Configuración → Envío y entrega; indica aquí cuáles si no son todas]. El importe final del pedido se muestra en la pantalla de pago antes de confirmarlo.</p>

<h2>Incidencias</h2>
<p>Si tu pedido no ha llegado dentro del plazo estimado o el seguimiento muestra una incidencia, escríbenos desde nuestra <a href="[URL REAL DE CONTACTO]" title="Contacto">página de contacto</a> indicando tu número de pedido y lo revisaremos contigo.</p>
```

## Cómo instalar esta versión

- **Recomendado:** la integración de GitHub con la rama `claude/great-lamport-8mb0rc` (parte A, apartado A12) o el ZIP del tema (`garelon-theme.zip`, solo las carpetas `assets config layout locales sections snippets templates`).
- **(Actualizado) Archivos de esta ronda:** `snippets/garelon-packs.liquid`, `sections/featured-product.liquid`, `sections/main-product.liquid`, `assets/garelon.css`, `assets/garelon.js`, `templates/index.json` y `templates/product.json`.
- **Si trabajas en el editor de código**, sustituye **completos** estos archivos, copiándolos del repositorio:
  - crea primero `snippets/garelon-shipping.liquid`;
  - después sustituye `snippets/garelon-packs.liquid`, `snippets/garelon-price-inline.liquid`, `snippets/garelon-stock.liquid`, `sections/main-product.liquid`, `sections/featured-product.liquid`, `sections/garelon-sticky-atc.liquid`, `assets/garelon.js` y `assets/garelon.css`;
  - por último, las plantillas `templates/index.json`, `templates/product.json` y `templates/page.faq.json`, porque usan los bloques nuevos.
