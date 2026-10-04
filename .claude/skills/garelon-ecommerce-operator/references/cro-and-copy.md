# CRO honesto y copy

> Canónico: Prompt Maestro §4 (R9), §10 y §11.

## Principio

Optimizar la conversión **sí**; dark patterns **no**. Se mejora lo que el cliente ve y entiende, nunca lo que cree por engaño.

## Peticiones típicas y respuesta GARELON

| Petición | No | Sí (alternativa honesta) |
|---|---|---|
| «Pon un countdown» / «la oferta acaba en…» | Contador o fecha falsa | Oferta clara en las tarjetas, ahorro real del pack, distintivo editorial «Recomendado», texto de promoción opcional sin contador **solo si existe una promoción real con fecha real** |
| «Quedan 3 unidades» / «12 personas viendo» | Stock o tráfico inventados | Confianza: envío, pago seguro, 14 días, opiniones reales; mejor jerarquía visual |
| «Pon 4,9 estrellas» / «+1.000 clientes» | Notas o recuentos inventados | Judge.me con opiniones reales (incluidas las importadas del mismo modelo, con nota de origen) |
| «Tacha un precio más alto» | `compare_at_price` ficticio | `compare_at_price` solo si es un precio anterior real (UE: el más bajo de los 30 días anteriores); si no, ahorro de pack calculado |
| «Pon “Más popular” en el pack 2» | Badge con dato falso | «Recomendado» (editorial) hasta tener datos reales de ventas |
| «Cambia el precio a 19,99 en Liquid» | Precio escrito en el tema | El precio se cambia en Shopify Admin › Productos › variante. El tema lo lee solo |

## Palancas permitidas

Jerarquía visual · un CTA claro · packs con ahorro real · `compare_at_price` real · opiniones reales · beneficios claros · confianza · mejores imágenes · oferta clara · menos fricción en móvil · FAQ que resuelve objeciones · recomendación editorial prudente.

## Estructura de la página (lo aprobado hoy)

- **Portada:** producto y beneficio, un CTA («Elegir mi …» → `/#comprar`), **sin «A partir de X €»**.
- **Compra:** título, valoración real (si existe), frase emocional (una vez), 4 garantías, «Elige tu oferta» (precio dentro de cada tarjeta), «Impuestos incluidos. Envío gratis.» (si el envío es gratis; el mismo texto en el cajón y en `/cart`), Añadir al carrito y pago dinámico.
- Después: «Compra con tranquilidad» → opiniones → significado → detalles → regalo → FAQ → cierre. El orden real está en el snapshot.

## Copy

- Español de España, «tú», frases cortas, sin mayúsculas gritonas ni cadenas de exclamaciones.
- Beneficio y significado antes que especificación. Los datos secundarios (plazos, capacidad, lo que no incluye) van en la FAQ o en las políticas.
- Datos del proveedor atribuidos cuando haga falta («según el proveedor») o reformulados. Nada no verificado.
- Copy emocional o de fe: simbólico, sin prometer protección, milagros, suerte ni efectos; sin miedo ni culpa.
- Sin superlativos sin prueba («el mejor», «el regalo perfecto»).
- **Regalo (D31):** Una sección de gifting puede comunicar de forma genérica que el producto es apropiado como regalo o detalle para momentos especiales. Las ocasiones concretas (bautizos, comuniones, Navidad, cumpleaños, bodas…) solo se enumeran si el propietario las pide expresamente para ese producto (D31). Ni tarjetas ni listas de ocasiones, tampoco escondidas en la FAQ.
- Sin «fabricado/diseñado por GARELON».
- Un dato, un sitio: no repetir el precio, las garantías ni la frase.

## Antes de entregar un cambio de CRO

- Que funcione sin JavaScript extra y con el selector y el formulario de Dawn.
- Que todo texto comercial sea cierto con la configuración de Shopify actual o con los defaults.
- Capturas en móvil y escritorio, y prueba de que ningún claim prohibido aparece.
