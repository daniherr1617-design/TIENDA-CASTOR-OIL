# Checklist visual de la lámina

Abre `lamina_lado_a_lado.jpg` y recórrelo pieza por pieza. Compara siempre con la columna **REFERENCIA aprobada**, no con tu idea del producto.

Para cada pieza, decide un estado:
- `ok`: coincide en forma, color, posición y proporción, salvo diferencias de luz o ángulo.
- `dudoso`: no se puede afirmar ni descartar; p. ej. motion blur, ángulo extremo o reflejo fuerte.
- `no_visible`: tapada por la mano, fuera de cuadro o demasiado pequeña.
- `discrepancia`: diferencia **clara**, que se describiría a Daniel sin dudar.

## Qué mirar

1. **Medalla:** silueta ovalada, figura de la Virgen, orla de piedras claras alrededor y tamaño respecto a las cuentas.
2. **Cruz:** crucifijo con figura, integrado en la línea de la pulsera, **sin colgar**; forma de los brazos y tamaño relativo.
3. **Cuentas, por lados** (`cuentas_izquierda` y `cuentas_derecha`): facetadas, en tres tonos (dorado, oro rosa/cobre, plateado) alternos; ninguna cuenta de un color nuevo (p. ej. negra, roja o azul); tamaño homogéneo. Los dos lados no son simétricos: el izquierdo es una fila continua de la medalla al cierre; el derecho tiene pocas cuentas, cadena hasta el aro de la cruz y una cuenta plateada entre la cruz y el cierre. Revisa sobre todo la unión de cuentas y cadena con la cruz.
4. **Cierre:** mosquetón dorado como en las referencias; ningún broche, imán o cierre de otro tipo o color.
5. **Acabado:** dorado. Un cambio de temperatura de color por la luz es aceptable; un metal plateado no lo es.
6. **Proporciones:** pulsera frente a muñeca, y medalla y cruz frente a cuentas.
7. **Artefactos de IA en manos y joyería:** cuentas que se funden, eslabones que desaparecen entre frames, dedos que atraviesan la pulsera, texto o figura de la medalla deformados.

## Cómo pesar las métricas

- Una SOSPECHA del script (SSIM o ΔE fuera de umbral) solo indica dónde mirar. Si la lámina muestra que es la luz, un reflejo o una cuenta contigua dentro del recorte, márcalo `ok` y explícalo en la nota.
- En `post-upscale`, compara sobre todo ORIGINAL frente a RESULTADO en la misma posición: cuentas fundidas, medalla emborronada o halos alrededor del metal.
- Indica los timestamps exactos de cualquier `discrepancia` o `dudoso`.

## Piezas «solo revisión visual»

En `refs.json`, las piezas con `"auto": false` (pulsera, cuentas de cada lado, cruz y cierre) no se localizan automáticamente: en fotos reales, la cadena, las cuentas brillantes y las piezas pequeñas no se dejan localizar con visión clásica. La lámina solo muestra su referencia, y hay que buscarlas en `contact_sheet.jpg` y en `frames/` (a resolución completa). Si no se ven en ningún frame → `no_visible` (WARNING).
