# Opiniones, confianza y legal

> Canónico: Prompt Maestro §4 (R10-R14), §11 y §12; Master Template §3.6, §3.9 y §3.10.

## Opiniones (Judge.me)

- Solo opiniones **reales**. El tema no contiene ninguna y nunca inventa notas, estrellas ni recuentos.
- `sections/garelon-reviews.liquid` muestra el bloque de app de Judge.me y/o el resumen de los metafields `reviews.rating` / `reviews.rating_count`. Sin datos, invisible para el cliente.
- **Widget versionado (D30, única excepción a R17):** el Review Widget oficial de Judge.me (`shopify://apps/judge-me-reviews/blocks/review_widget/61ccd3b1-a9f2-4160-9fe9-4fec8413e5d8`) viene en el tema dentro de «GARELON Opiniones» de `templates/index.json` y `templates/product.json`, con `review_data` = `real_data` (nunca la muestra de Judge.me). El App Embed Judge.me Core (`judgeme_core`) va en `config/settings_data.json`. `garelon_check` rechaza cualquier otro bloque o embed.
- **Producto del widget:** en la ficha lo pone la página. En la home no se preselecciona (clave del ajuste y handle sin verificar desde el repo): tras subir el tema, el propietario elige el producto en el bloque («Select product»). Para versionarlo, copiar el JSON real del bloque desde Shopify (Editar código › `templates/index.json`); nunca inventar handle, ID ni clave.
- Con el widget, el resumen GARELON se oculta (`summary_with_app` = falso) para no duplicar la valoración. Sin la app, el resumen de los metafields hace de respaldo.
- El aspecto del widget (Carousel, colores, galería, nombres abreviados…) se configura en Judge.me; el tema no lo duplica en CSS.
- Si Judge.me se sustituye o se desinstala: retirar el bloque de las dos plantillas y el App Embed. Al migrar de producto: revisar el producto del widget de la home.
- Título aprobado: «Opiniones sobre esta <producto>». Nota cuando hay importadas: «Incluye opiniones de compradores del mismo modelo, importadas mediante Judge.me.»

### Importar opiniones de AliExpress (lo hace el propietario)

1. Judge.me Product Reviews + su importador de AliExpress.
2. URL de la ficha del **mismo artículo y del mismo vendedor** del que se compra.
3. No filtrar solo 5 estrellas: importar también las críticas, o aplicar el mismo umbral a todas.
4. Revisar una a una: ocultar las de otro modelo o color y las que mencionen claims que GARELON no hace (14K, hipoalergénico…). **No editar el texto de ninguna.**
5. Mantener la marca de importada de Judge.me y la nota de origen. Indicar en las políticas cómo se verifican las opiniones (obligación de información en la UE).
6. Activar la sincronización de la valoración con Shopify y la petición de opinión tras la entrega.

## Confianza

- Garantías actuales: «Envío gratis + seguimiento» · «Pago seguro» · «14 días para cambiar de opinión». «Envíos internacionales» se retiró (D32): solo vuelve si el propietario verifica destinos en Shopify (Markets y Envío y entrega). Si cambian en Shopify o en las políticas, mandan ellas. Si el envío deja de ser gratis: desactiva el ajuste «Envío gratis» **y** cambia la garantía «Envío gratis + seguimiento» (`garelon_check` da error si una plantilla sigue prometiéndolo).
- «Pago seguro» = checkout oficial de Shopify. Sin logos de pago dibujados a mano.
- Un símbolo (escudo con check, candado) es decorativo (`aria-hidden`), nunca una certificación ni un sello de terceros.

## Legal

- «14 días para cambiar de opinión» = **derecho de desistimiento** (14 días naturales desde la recepción). Nunca «garantía de 14 días», «sin riesgos» ni «devolución garantizada».
- Faltas de conformidad: **garantía legal aplicable**. Su duración concreta solo se publica tras comprobar las políticas reales.
- Las condiciones (estado del producto, costes, excepciones) viven en las políticas de Shopify. No se copian de competidores.
- Si una categoría futura está exceptuada del desistimiento (personalizados, precintados por higiene una vez abiertos…), no se usa «Compra con tranquilidad» con ese texto.
- Las políticas (devoluciones, envíos, privacidad, términos, aviso legal) y la página de cookies viven en Shopify con los datos del titular; **no se copian al repo**. El pie enlaza las que existen (`garelon-legal-links`; aviso legal: política nativa o página `aviso-legal`).
- Sin píxeles a mano: TikTok, Meta o GA4 solo por Shopify (Eventos de cliente o canal oficial) y con el banner de Customer Privacy configurado.
- Datos de empresa: nunca se inventan. Modificar políticas legales requiere confirmación explícita del propietario.
