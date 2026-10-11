# Verdad del producto para QA visual

Fuente: `GARELON_CURRENT_PRODUCT_TRUTH_FOR_ADS_v1_0.md` (2026-10-07). Si ese archivo cambia, este también.

## Pulsera Rosario Virgen María Dorada: lo que no puede cambiar

| Pieza | Debe ser | Discrepancia clara (→ FAIL tras revisión visual) |
|---|---|---|
| Medalla | Medalla ovalada de la Virgen María, dorada, con orla de piedras claras alrededor | Otra figura, otra forma, otro tamaño relativo, sin medalla |
| Cruz | Crucifijo dorado con figura, **integrado en la pulsera, sin colgar** | Cruz colgante, cruz ausente, otra forma de cruz |
| Cuentas | Facetadas y tricolor: dorado, oro rosa y plateado, alternas, unidas por cadena dorada | Otros colores, un solo color, orden distinto, tamaño muy distinto |
| Cierre | **Mosquetón** dorado (visible en las referencias) y ajuste mediante 3 aros según la ficha | Otro tipo de cierre (broche, imán, nudo), cierre plateado |
| Acabado | Dorado pulido, acero inoxidable | Plateado, mate o cobrizo evidente (no confundir con un cambio de luz) |
| Proporciones | Aprox. 20 cm; medalla, cruz y cuentas en la escala de la referencia | Medalla o cruz desproporcionadas respecto a cuentas y muñeca |

## Referencias

Recibidas de Daniel el 2026-10-11: `ref_01_fondo_blanco` (fondo blanco, la usada para los recortes de `refs.json`) y `ref_02_fondo_rosa`. Las piezas visuales de la tabla describen lo que se ve en ellas; no son claims publicitarios (la orla de piedras, p. ej., no se menciona en copy sin verificar el material).


Se guardan en `creative/_references/product/`:
- `NUEVA IMAGEN 3.png`: muñeca, la principal.
- Recorte de detalle aprobado de `NUEVA IMAGEN 3.png`.
- `imagen 4.png`: pulsera completa sobre fondo marfil.
- `imagen 2.png` (oración) y `NUEVA IMAGEN 1.png` (infografía sin líneas): aprobadas, pero no son referencia principal de QA.

**No usar nunca como referencia:**
- `imagen 3.png` antigua: cruz colgante (incorrecta).
- `Imagen 1.png` antigua: flechas incorrectas.

## Packaging

No confirmado. Si aparece una caja de regalo en un vídeo, se avisa, pero no se trata como fallo de producto.
