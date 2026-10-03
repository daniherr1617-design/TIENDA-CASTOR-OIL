# Opiniones, confianza y legal

> Canónico: Prompt Maestro §4 (R10-R14), §11 y §12; Master Template §3.6, §3.9 y §3.10.

## Opiniones (Judge.me)

- Solo opiniones **reales**. El tema no contiene ninguna y nunca inventa notas, estrellas ni recuentos.
- `sections/garelon-reviews.liquid` muestra el bloque de app de Judge.me (se añade desde el editor, **nunca** en `index.json`) y/o el resumen de los metafields `reviews.rating` / `reviews.rating_count`. Sin datos, invisible para el cliente.
- Título aprobado: «Opiniones sobre esta <producto>». Nota cuando hay importadas: «Incluye opiniones de compradores del mismo modelo, importadas mediante Judge.me.»

### Importar opiniones de AliExpress (lo hace el propietario)

1. Judge.me Product Reviews + su importador de AliExpress.
2. URL de la ficha del **mismo artículo y del mismo vendedor** del que se compra.
3. No filtrar solo 5 estrellas: importar también las críticas, o aplicar el mismo umbral a todas.
4. Revisar una a una: ocultar las de otro modelo o color y las que mencionen claims que GARELON no hace (14K, hipoalergénico…). **No editar el texto de ninguna.**
5. Mantener la marca de importada de Judge.me y la nota de origen. Indicar en las políticas cómo se verifican las opiniones (obligación de información en la UE).
6. Activar la sincronización de la valoración con Shopify y la petición de opinión tras la entrega.

## Confianza

- Garantías actuales confirmadas: «Envío gratis + seguimiento» · «Pago seguro» · «14 días para cambiar de opinión» · «Envíos internacionales». Si cambian en Shopify o en las políticas, mandan ellas.
- «Pago seguro» = checkout oficial de Shopify. Sin logos de pago dibujados a mano.
- Un símbolo (escudo con check, candado) es decorativo (`aria-hidden`), nunca una certificación ni un sello de terceros.

## Legal

- «14 días para cambiar de opinión» = **derecho de desistimiento** (14 días naturales desde la recepción). Nunca «garantía de 14 días», «sin riesgos» ni «devolución garantizada».
- Faltas de conformidad: **garantía legal aplicable**. Su duración concreta solo se publica tras comprobar las políticas reales.
- Las condiciones (estado del producto, costes, excepciones) viven en las políticas de Shopify. No se copian de competidores.
- Si una categoría futura está exceptuada del desistimiento (personalizados, precintados por higiene una vez abiertos…), no se usa «Compra con tranquilidad» con ese texto.
- Datos de empresa: nunca se inventan. Modificar políticas legales requiere confirmación explícita del propietario.
