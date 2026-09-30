# GARELON · Migración a la Taza Fondue de Chocolate con Tenedor (v1 + ronda visual v1.1)

> Rama `claude/fondue-mug`. Primera migración de producto sobre el baseline del sérum (`baseline/garelon-serum`, commit `f08f9bb`). Misma arquitectura: Dawn 16.0.0 + capa GARELON, carrito y checkout de Shopify, opiniones solo reales, sin pagos visuales.
>
> Todo lo marcado como probado se ha probado en un **render local** (Liquid + el JavaScript real de Dawn, con un producto simulado de 3 colores × 3 packs). Nada de lo que depende de Shopify Admin, de CJ o del checkout real se ha podido comprobar: está en «Pasos manuales».

## 1. Qué ve el cliente

**Home**

| # | Sección | Fondo | Contenido |
|---|---|---|---|
| 1 | Barra superior | Rojo | «Envío gratis disponible en España» + bandera |
| 2 | Cabecera | Blanco | [isotipo de la taza] GARELON · Inicio · Qué incluye · Preguntas frecuentes · Contacto |
| 3 | Portada | Blanco | «Un pequeño plan que sabe a mucho» · **H1** «Tu fondue de chocolate, directamente en una taza» · «A partir de 24,99 €» · «Elegir color y pack» (rojo) · «Cómo funciona» · Tenedor incluido · 130 ml · 3 colores · foto de la taza roja |
| 4 | Compra (`#comprar`) | Casi blanco | Galería (roja de cerca → tres colores → blanca → marrón) · título · precio · «Cada unidad: taza de cerámica de 130 ml + tenedor de fondue. Vela no incluida.» · **Color** · **Elige tu pack** · **Añadir al carrito (rojo)** · Comprar ahora · Envío gratis · stock · plazos |
| 5 | Opiniones | Blanco | Solo reales (app de reseñas). Sin app: no se ve (0 px) |
| 6 | Cómo funciona (`#como-funciona`) | Blanco | **Infografía «Cómo funciona»** (ampliable) + 5 pasos cortos + «Vela no incluida» y uso responsable de la llama |
| 7 | Características y colores (`#que-incluye`) | Casi blanco | «Elige tu color» · **infografía «Características y usos»** (ampliable) · taza 130 ml · tenedor · Rojo / Blanco / Marrón · vela no incluida |
| 8 | Beneficios | Blanco | «Convierte cualquier sobremesa en un pequeño momento especial»: Chocolate o queso · Hecha para compartir · Todo en una taza |
| 9 | Compartir | Casi blanco | «Un plan sencillo para compartir» (foto de los tres colores, la roja delante) |
| 10 | FAQ | Blanco | 10 preguntas |
| 11 | Cierre | Rosado muy suave | «Tu próxima sobremesa puede empezar aquí» · «Elegir mi Taza Fondue» (rojo) |
| 12 | Pie | Casi blanco | Isotipo + GARELON · «Pequeños planes que saben a mucho.» · Ayuda · políticas · sin iconos de pago |

La barra «Características» (Cerámica · Tenedor incluido · Hueco para vela · 3 colores) sigue en la plantilla pero **desactivada**: la cubre la infografía. Se reactiva en el editor (Personalizar → ojo de la sección).

**Ficha:** compra (multimedia de Shopify + Color × Pack) → opiniones → Compra con confianza → beneficios → cómo funciona (con la infografía) → compartir → FAQ → compra fija en móvil.

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

Además: título y meta descripción de la home en Tienda online → Preferencias («Taza Fondue de Chocolate con Tenedor | GARELON» · «Disfruta de una fondue individual de chocolate o queso con taza de cerámica y tenedor incluido. 3 colores y packs de 1, 2 o 3 unidades.»), SEO del producto, imagen para redes, limpiar la descripción de CJ en el producto (sin 200 ml, «cuchara» ni claims) y revisar las políticas por la vela/llama y las roturas en transporte (el tema no reescribe textos legales). Opcional: subir imagen1–4 a la multimedia del producto y asignar a cada color su foto (así la ficha, el carrito y la compra fija muestran el color elegido).

## 5. Pruebas (render local)

- Taza Fondue: **84/84** (estáticas, Color × Pack, carrito, compra fija, agotados, combinación inexistente, avisos del editor, opiniones, pagos, 404, responsive 320–1440, primera pantalla y carga de imágenes).
- Regresiones del baseline: packs 56/56, carrito 62/62, routing 14/14, confianza 47/47, ronda 6 57/57 (adaptadas solo en lo que cambió a propósito: sin «Oferta limitada», plazo 8–18 días, orden de secciones y etiquetas de pack).
- Theme Check: 0 errores y los 9 avisos de Dawn de siempre. JSON y schemas válidos; nombres del editor ≤ 25 caracteres.

## 6. Ronda visual (v1.1)

Solo estilo y maquetación: los precios, packs, Color × Pack, `quantity=1`, carrito, checkout, opiniones y FAQ no cambian.

- **Paleta:** fondo blanco (`#FFFFFF`) y casi blanco (`#F7F5F3`) en lugar de crema y arena; acento en el **rojo de la taza** (`#C8161D`, 5,9:1 con texto blanco) en lugar del dorado; tinta chocolate `#22150F` para el texto. Barra superior roja; llamada final en rosado muy suave (`#FDF1EF`). Esquemas en `config/settings_data.json`, tokens en `assets/garelon.css`.
- **Taza roja protagonista:** portada con la roja; la galería de compra empieza por la roja de cerca (recorte de imagen2, para no repetir la foto completa de la portada); «Compartir» usa la foto de los tres colores con la roja delante; botones, color elegido, pack elegido e insignia en rojo. Blanca y marrón siguen en la galería y en el selector.
- **Variante por defecto:** el tema elige la que marca Shopify (la primera disponible). Para que sea la roja, en Shopify pon **Rojo como primer valor** de la opción Color (paso 2 de la lista de pasos manuales).
- **Infografías:** «Cómo funciona» (imagen8, sin cambios) en `#como-funciona`, justo después de la compra; «Características y usos» (imagen7 **corregida**: «Marrón» en lugar del nombre erróneo y sin los corazones dibujados sobre las tazas) en `#que-incluye`. Se amplían al tocarlas (en móvil, a 720 px, desplazables). Cada una lleva un pie con lo que incluye realmente cada unidad (la vela no).
- **Botones de compra:** «Añadir al carrito» en rojo (acción principal); «Comprar ahora» con borde oscuro, a todo el ancho. Solo CSS.
- **Archivos:** `config/settings_data.json`, `assets/garelon.css`, `assets/garelon.js` (zoom), `snippets/garelon-fallback-image.liquid` (imágenes nuevas + zoom), `snippets/garelon-gallery.liquid`, `snippets/garelon-icon.liquid` (icono de lupa), `sections/garelon-how-to-use.liquid` (pasos compactos, zoom, pie de imagen), `sections/garelon-ingredients.liquid` (zoom, pie de imagen), `sections/garelon-image-text.liquid` (opciones de imagen), `templates/index.json`, `templates/product.json`, 9 WebP nuevos (`garelon-fondue-{roja,como-funciona,caracteristicas}-{480,720,1080}.webp`).
- **Pruebas:** Taza Fondue 91/91 (7 nuevas de la ronda visual: infografías, zoom, pasos, paleta, botones), packs 56/56, carrito 62/62, routing 14/14, confianza 47/47, ronda 6 57/57; responsive 320–1440 sin scroll horizontal; Theme Check 0 errores y los 9 avisos de Dawn.
