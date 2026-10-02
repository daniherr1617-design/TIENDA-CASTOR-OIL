# GARELON · Mejora de CRO honesto (oferta, confianza, detalles, opiniones)

Rama `claude/rosary-clean-rebuild`, sobre el tema limpio (Dawn 16.0.0). No se reconstruye nada. La home (`templates/index.json`) mantiene las mismas 9 secciones en el mismo orden.

> **Estado de las pruebas:**
> - **Probado localmente** y **en el ZIP descomprimido**, con datos simulados.
> - **No probado en Shopify** (ni vista previa ni tienda publicada).

## 1. Qué cambia

| # | Cambio | Dónde |
|---|---|---|
| 1 | **«Elige tu oferta»**: 3 tarjetas clicables, una por variante real del pack | Bloque `GARELON Elige tu oferta` (`garelon_offer`) en la compra de la home y en la ficha |
| 2 | **Un solo precio visible**: el de la tarjeta | El bloque «Precio» de Dawn sigue en la página, pero solo para lectores de pantalla y para el JS de Dawn. La nota de impuestos y envío pasa debajo de las tarjetas |
| 3 | **Zona de confianza** encima de la oferta: banda con la frase y 4 garantías con icono (2 × 2) | Bloque `GARELON Confianza` (`garelon_trust`) |
| 4 | **Detalles** sin coletillas del proveedor ni nota comercial. **FAQ** con «¿Qué longitud tiene y cómo se ajusta?» y «¿Qué incluye mi pedido?» (9 preguntas) | `index.json`, `product.json` |
| 5 | **Opiniones**: tarjeta GARELON para el widget de Judge.me y nota opcional sobre el origen de las opiniones | `garelon-reviews` |

- **Estilo del widget de Judge.me:** estrellas doradas, botón redondeado y sin título duplicado.
- **Resumen sin widget:** nota grande (4,6), estrellas y número de opiniones.
- **«Ocultar sin opiniones»:** con la valoración sincronizada a 0, el cliente no ve un widget vacío.
- **Título de la sección:** ahora «Lo que opinan quienes ya la llevan», que es honesto también con opiniones importadas.

## 2. Cómo funcionan las tarjetas

- **Es el selector de Dawn:** el mismo `<variant-selects>`, con radios y `data-option-value-id`, solo con otro aspecto.
- **Al pulsar una tarjeta:**
  - se marca al instante;
  - Dawn pide la variante, actualiza el formulario (`id`), el precio, la URL (en la ficha) y el botón (Agotado);
  - la compra sigue por el carrito AJAX, el cajón y el pago dinámico.
- **Teclado:** Tab entra en el grupo y las flechas cambian de pack, con contorno visible.
- **Lectores de pantalla:** el grupo se lee como «Elige tu oferta».
- **Cada tarjeta muestra:**
  - nombre del pack (el valor de la variante);
  - texto corto editable;
  - precio real;
  - precio comparado tachado y ahorro, solo si existen (ver apartado 3);
  - distintivo opcional;
  - «Agotado» si no hay stock.

**Degradación:**

| Caso | Qué se ve |
|---|---|
| Sin opción «Pack», con otra opción o con dos opciones | Selector normal de Dawn (desplegable) y precio de Dawn visible. Aviso solo en el editor |
| Una sola variante | Ni selector ni tarjetas; el precio de Dawn visible |
| Sin `compare_at_price` | Nada tachado |
| Sin ahorro real | Ni «Ahorras», ni precio por unidad, ni textos que hablen de ahorro |

## 3. Cuándo aparece cada cosa

| Elemento | Condición |
|---|---|
| Precio tachado | La variante tiene en Shopify un «Precio de comparación» mayor que su precio |
| «Ahorras X» | Con precio de comparación: X = comparación − precio. Sin él: X = (precio del pack de 1 × unidades) − precio del pack, solo si es > 0. En ese caso sale debajo «Ahorro calculado frente a comprar cada pulsera por separado.» |
| Precio por pulsera | Solo en packs de 2 o 3 con ahorro real frente al pack de 1 (se puede desactivar) |
| Texto de pack que hable de ahorro («Ahorra más por unidad») | Solo si ese pack ahorra de verdad; si no, se oculta solo |
| Distintivo | En el pack elegido en «Pack con distintivo» y solo si el texto no está vacío. Por defecto: pack de 2, «Recomendado» |
| Texto de promoción | Solo si se activa «Mostrar texto de promoción». Por defecto, apagado. Sin contador |
| Garantías | Cada una solo si su texto no está vacío. Por defecto: Envío con seguimiento · Compra protegida · 14 días para cambiar de opinión · Envíos a España |

«Más popular» no va por defecto: solo debe usarse si las ventas lo confirman.

## 4. Configurar en Shopify

1. **Variantes de pack:** Productos › la pulsera › Variantes. Opción **Pack** con «1 pulsera», «2 pulseras», «3 pulseras», cada una con su precio real. El número inicial se usa para calcular el ahorro y el precio por unidad.
2. **Precio de comparación:** en cada variante, campo «Precio de comparación». Ponlo solo si es un precio real anterior. En la UE, una rebaja anunciada debe referirse al precio más bajo de los 30 días anteriores. Déjalo vacío si no.
3. **Garantías y frase:** Personalizar › Página de inicio › sección de compra › bloque «GARELON Confianza», y lo mismo en Plantillas › Producto.
   - «Envío gratis + seguimiento»: solo si el envío es gratis de verdad.
   - «Envíos internacionales»: solo si envías fuera de España.
4. **Promoción y distintivo:** bloque «GARELON Elige tu oferta» › Promoción / Distintivo.
5. **Textos de cada pack:** bloque «GARELON Elige tu oferta» › Texto de cada pack.

## 5. Opiniones reales de AliExpress en Judge.me (lo haces tú)

1. Instala **Judge.me Product Reviews** y **Judge.me Ali Reviews Importer**. Este último es una app aparte, gratuita.
2. En AliExpress, abre la ficha **del mismo artículo del mismo proveedor** del que compras (la que usa DSers) y copia su URL completa, terminada en `.html`.
3. En el importador, busca el producto de Shopify, pega la URL y pulsa **Import**.
4. **Filtros honestos:**
   - No elijas «solo 5 estrellas»: importa también las críticas o, como mínimo, todas desde un umbral razonable aplicado igual a todas.
   - Elige idioma o país si quieres.
   - Con fotos, solo si muestran este modelo.
5. **Revisa lo importado** en Judge.me › Reviews:
   - oculta las opiniones de otro modelo o color;
   - oculta las que mencionen «14K», «oro», «hipoalergénica», etc. (no son claims nuestros);
   - no edites el texto de ninguna.
6. **Transparencia:**
   - Judge.me marca las opiniones importadas; no lo ocultes.
   - Escribe en Personalizar › «GARELON Opiniones» › «Nota sobre el origen de las opiniones», por ejemplo: «Incluye opiniones de compradores del mismo modelo en AliExpress, importadas con Judge.me.»
   - En tu política o aviso legal, indica cómo verificas las opiniones. Es una obligación de información en la UE.
7. **Widget:** Personalizar › «GARELON Opiniones» (home y ficha) › Añadir bloque › Apps › **Review Widget** de Judge.me.
8. **Comprueba** que Judge.me sincroniza la valoración con Shopify (metafields `reviews.rating` y `reviews.rating_count`). Con eso:
   - salen las estrellas junto al título;
   - se muestra la sección, porque «Ocultar sin opiniones» está activado.

   Si no aparecen, desactiva «Ocultar sin opiniones».
9. **Opiniones de tus propios clientes:** activa en Judge.me el correo de petición de opinión tras la entrega.

## 6. Archivos

- **Nuevos:** `snippets/garelon-offer.liquid`, `snippets/garelon-trust.liquid`, `GARELON-CRO-OFERTA-CONFIANZA.md`.
- **Modificados:**
  - `sections/featured-product.liquid`, `sections/main-product.liquid`: bloques nuevos y precio de Dawn solo para lectores de pantalla cuando hay tarjetas;
  - `sections/garelon-reviews.liquid`;
  - `snippets/garelon-icon.liquid`: escudo, ubicación, globo, tarjeta;
  - `assets/garelon.css`;
  - `templates/index.json`, `templates/product.json`;
  - los 31 `locales/*.json` (`garelon.offer.*`, `garelon.reviews.editor_waiting`).
- **Sin usar en las plantillas, pero disponibles:** los bloques `garelon_quote` y `garelon_packs`. Siguen en el schema por compatibilidad.
- **No se toca:** `assets/garelon.js`, ni el formulario, el carrito, el cajón o el checkout de Dawn.
