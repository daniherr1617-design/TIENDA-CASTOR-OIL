# Shopify, packs, precio, proveedor y apps

> Canónico: Prompt Maestro §7 (quién controla cada dato), §10-§11, y Master Template §3.4-§3.8, §3.17.

## Qué es de quién

| Dato | Dónde se cambia | Tema |
|---|---|---|
| Precio, `compare_at_price`, variantes, SKU, inventario, disponibilidad | Shopify Admin › Productos | Solo lee |
| Tarifas de envío | Admin › Envío y entrega | Solo comunica: ajuste «Envío gratis» del tema (Configuración del tema › Carrito) activo solo si la tarifa real es gratuita |
| Políticas | Admin › Políticas | Enlaza solo las que existen |
| Pagos y checkout | Admin › Pagos / Checkout | No se toca |
| Contacto | Admin › Páginas (handle `contacto`) | Enlaza |
| Producto ↔ proveedor y pedidos | `{{SUPPLIER_INTEGRATION}}` (actual: DSers + AliExpress; fulfillment manual) | Sin código del proveedor |
| Opiniones | Judge.me | Muestra el bloque de app o la valoración |
| Píxeles y eventos | Admin › Eventos de cliente / canales | No inyecta nada a mano |

## Packs

- **Un** producto Shopify con una opción de packs (hoy `Pack`): valores «1 <unidad>», «2 <unidades>», «3 <unidades>». Son **variantes reales**, no productos distintos.
- Cada pack se añade con **cantidad 1**. «Pack de 3» × 1 = 3 unidades físicas.
- Fulfillment manual: un pedido «Pack de N» = comprar N unidades del mismo artículo al proveedor. Antes de lanzar, un pedido de prueba de cada pack.
- El selector visual («Elige tu oferta») son los radios del selector de Dawn: conserva variante, formulario, URL, carrito, teclado y accesibilidad. No crees un formulario paralelo.

## Precio, compare_at y ahorro

- Nunca un precio escrito en Liquid, JSON ni CSS. Si te piden «pon 19,99», explica que se cambia en la variante en Shopify Admin y, si ayuda, cómo hacerlo.
- `compare_at_price` tachado solo si es mayor que el precio y es un precio anterior real.
- **Ahorro de pack ≠ precio anterior.** El ahorro = precio(pack de 1) × N − precio(pack de N), y solo se muestra si es > 0, con la nota de cálculo.
- El precio por unidad solo aparece en packs con ahorro real.

## Carrito y checkout

- Cajón y `/cart` de Dawn. Sin upsells, casillas premarcadas ni productos añadidos automáticamente.
- Checkout oficial de Shopify y pagos dinámicos. Sin hacks de CSS, JS ni DOM.
- La nota del carrito es la de Dawn: cambiarla es una decisión del propietario (pendiente en el Decision Log).

## DSers / proveedor

- No asumas automatizaciones que no estén verificadas.
- Nunca rompas variantes, opciones ni mapping: renombrar una opción o un valor en Shopify puede desvincular el mapping del proveedor. Avisa al propietario antes.
- En documentos genéricos usa `{{SUPPLIER_INTEGRATION}}` (actual = DSers).

## Lo que no se puede verificar desde el repo

Precios reales, variantes reales, inventario, apps instaladas, políticas publicadas, tarifas de envío, mapping de DSers y estado del checkout. Repórtalo como `NO DISPONIBLE` o «verificar en Shopify» (🆂 en el checklist).
