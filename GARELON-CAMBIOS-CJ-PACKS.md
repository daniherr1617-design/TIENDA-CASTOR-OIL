# GARELON · Cambios: proveedor CJ Dropshipping y packs como variantes reales

> **Septiembre 2026 · rama `claude/great-lamport-8mb0rc`.** No es un cambio de producto: el producto sigue siendo el mismo sérum de contorno de ojos (marca física Baafven).
> - El tema queda **preparado** para vender 3 packs como variantes reales de Shopify, con CJ Dropshipping como proveedor.
> - Las variantes, los precios y el mapping con CJ **los tienes que crear tú** en Shopify y en CJ (apartados 17-19). El tema no inventa variantes, IDs ni precios.
> - Todo lo probado aquí es **local**, con el JavaScript real de Dawn y datos simulados. Falta la prueba en tu tienda (apartado 13).

---

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
- **Añadir al carrito:** es el botón real de Dawn (`product-form.js`), que envía el `id` de la variante elegida y `quantity=1` (campo oculto del bloque; ya no hay selector de cantidad).
- **Selección inicial:** la de Shopify.
  - Si la URL trae `?variant=<id>`, se marca esa tarjeta.
  - Si no, la primera variante disponible. Por eso **«1 unidad» debe ser la primera variante** en Shopify (apartado 17).
  - No se preselecciona nunca un pack mayor.
- **Teclado y lector de pantalla:**
  - Tab entra en el grupo y las flechas cambian de pack; el foco se mantiene tras el refresco y es visible.
  - El precio por unidad se lee «17,50 € por unidad».
  - El ahorro se lee «Ahorra 4,98 € frente a comprar 2 unidades por separado (39,98 €)».
- **Respaldo seguro:** si el producto no encaja, el bloque muestra el selector de variantes estándar de Dawn. Pasa si hay más de una opción, algún valor no empieza por un número, hay números repetidos o el nombre de opción no coincide con el ajuste. Un producto sin variantes no muestra selector.
- **Un solo selector por sección:** si en la plantilla hay bloque de packs, el bloque «Selector de variantes» de Dawn no se pinta aunque alguien lo añada. Así no hay dos `<variant-selects>` con el mismo id.
- **Editable en Personalizar** (bloque «GARELON Packs (variantes)»):
  - título («Elige tu pack»);
  - nombre de la opción (vacío = la única opción) y «Unidades de cada pack» (p. ej. `1,2,3`, solo si los valores no empiezan por el número);
  - «unidad» / «unidades»;
  - mostrar precio por unidad, mostrar ahorro y mostrar porcentaje (desactivado);
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
- **Porcentaje** = ahorro ÷ referencia, redondeado. Desactivado por defecto; se activa en Personalizar.
- **Precio por unidad** = precio del pack ÷ unidades, redondeado al céntimo.
- **Insignia «Mejor precio/unidad»:** va al pack con el precio por unidad más bajo, solo si es uno solo, tiene más de 1 unidad y está disponible. Si mañana cambias precios, la insignia se mueve sola o desaparece.

Con los precios objetivo:

| Pack | Precio (Shopify) | Por separado | Ahorro mostrado | % (opcional) | Por unidad |
|---|---|---|---|---|---|
| 1 unidad | 19,99 € | — | — | — | 19,99 €/unidad |
| 2 unidades | 35,00 € | 39,98 € | Ahorra 4,98 € | -12 % | 17,50 €/unidad |
| 3 unidades | 48,00 € | 59,97 € | Ahorra 11,97 € + insignia | -20 % | 16,00 €/unidad |

**No se usa `compare_at_price`:** nada aparece tachado. Bajo las tarjetas se lee «Ahorro calculado frente a comprar las unidades por separado.».

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

**Resultado: 29/29 correctas**, sin errores de JavaScript en consola.

| # | Prueba | Resultado |
|---|---|---|
| A0 | Sin `?variant=`, seleccionada «1 unidad» | ✅ |
| A1-A3 | Tarjeta 1/2/3 → variante real (id 4101/4102/4103), precio 19,99/35,00/48,00 €, URL `?variant=` | ✅ |
| A4 | `?variant=4103` abre con la tarjeta «3 unidades» marcada | ✅ |
| A5 | Pack agotado: radio desactivado, «Agotado», sin insignia ni ahorro, no se puede elegir | ✅ |
| A6 | `?variant=` de un pack agotado: botón «Agotado» desactivado (principal y compra fija) | ✅ |
| A7 | «1 unidad» agotada → Shopify elige la primera disponible | ✅ |
| B1-B3 | 19,99 €/unidad · 17,50 €/unidad + «Ahorra 4,98 €» · 16,00 €/unidad + «Ahorra 11,97 €» + insignia solo en el pack de 3 | ✅ |
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
  - impuestos y gastos de envío.
- **Editor de temas:** ajustes del bloque de packs y de plazos.
- **CJ:**
  - mapping de variantes;
  - importación del pedido con la variante y cantidad correctas;
  - método de envío CJPacket Euro Cosmetic Line;
  - tracking.
- **Apps y píxeles** (Meta, TikTok) y **catálogos de anuncios** con 3 variantes.
- **Multimedia real** del producto en la ficha: mi montaje no tenía fotos en la ficha, así que en tu tienda los packs quedarán debajo de la galería en móvil, como cualquier selector de Dawn.

## 14. Theme Check

- **0 errores y 9 avisos**, los mismos 9 de Dawn 16.0.0 de la línea base (`OrphanedSnippet`, `VariableName` ×2, `UnusedAssign` ×2, `LiquidComplexity`, `UndefinedObject` ×3).
- Ningún aviso nuevo.

## 15. Validador de plantillas, schemas y assets

- `OK: plantillas, schemas y assets coherentes` (anexo B.2 del Master), antes y después del cambio.
- Todos los `templates/*.json`, `sections/*-group.json` y `config/*.json` son JSON válidos.

## 16. Responsive

Render local con los datos simulados. Las posiciones son píxeles desde arriba de la página:

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

**Cómo comprobarlo:** en la vista previa, añade el pack de 2 y el de 3 al carrito. El total debe ser exactamente 35,00 € y 48,00 € (más el envío en el checkout), sin líneas de descuento.

**Cantidad Shopify / precios por volumen (B2B):** no los uses para los packs. El ahorro ya está en el precio de cada variante.

## 20. Riesgos pendientes

1. **Sin prueba real** en Shopify ni en CJ (apartado 13). El mapping es el punto crítico: si CJ empareja «3 unidades» con «1 unidad», o multiplica cantidades, se enviaría mal. Hay que verificarlo con un pedido.
2. **AutoDS activo a la vez:** podría sobrescribir variantes, precios o stock. Pausa y después desconecta (pasos 2 y 13).
3. **Variante no renombrada** («3 piezas»): la tarjeta dice «3 unidades», pero el carrito, el checkout y los emails dirán «3 piezas». Renómbrala.
4. **Orden de las variantes:** si «1 unidad» no es la primera, la selección por defecto podría ser otro pack.
5. **Descuentos antiguos** que se acumulen con los packs (apartado 19).
6. **Plazos:** son estimaciones de CJ para España. Si los reales difieren, cambia el bloque de plazos, la FAQ, la pestaña de la ficha y la política a la vez. No se promete nada sobre aduanas.
7. **Devoluciones parciales de un pack:** la política actual no dice qué se reembolsa si el cliente devuelve 1 de las 3 unidades. Decide tu criterio (p. ej. la parte proporcional del pack) y, si quieres, añádelo a la política. No la he modificado.
8. **Cambios hechos en el editor** después de la ronda 3: el ZIP sustituye `templates/index.json` y `templates/product.json`. Revísalo en la vista previa antes de publicar.
9. **Catálogos de anuncios y píxeles:** con 3 variantes, Meta y TikTok verán 3 precios. Revisa los anuncios que muestren el precio.
10. **Otros mercados o monedas** (si algún día los activas): el ahorro se calcula con los precios de esa moneda y podría salir con céntimos poco redondos.

---

## Propuesta de texto para la política de envío (pegar en Admin → Configuración → Políticas → Política de envío)

> Revísala y ajusta lo que está entre corchetes. No menciona a ningún proveedor ni promete nada que no esté verificado.

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
<p>Los gastos de envío, si los hay, se muestran en la pantalla de pago antes de confirmar el pedido.</p>

<h2>Incidencias</h2>
<p>Si tu pedido no ha llegado dentro del plazo estimado o el seguimiento muestra una incidencia, escríbenos desde nuestra <a href="/pages/contact" title="Contacto">página de contacto</a> indicando tu número de pedido y lo revisaremos contigo.</p>
```

## Cómo instalar esta versión

- **Recomendado:** el ZIP del tema (`garelon-theme.zip`, solo las carpetas `assets config layout locales sections snippets templates`) o la integración de GitHub con esta rama.
- **Si trabajas en el editor de código**, sustituye **completos** estos archivos, copiándolos del repositorio:
  - crea primero `snippets/garelon-shipping.liquid`;
  - después sustituye `snippets/garelon-packs.liquid`, `snippets/garelon-price-inline.liquid`, `snippets/garelon-stock.liquid`, `sections/main-product.liquid`, `sections/featured-product.liquid`, `sections/garelon-sticky-atc.liquid`, `assets/garelon.js` y `assets/garelon.css`;
  - por último, las plantillas `templates/index.json`, `templates/product.json` y `templates/page.faq.json`, porque usan los bloques nuevos.
