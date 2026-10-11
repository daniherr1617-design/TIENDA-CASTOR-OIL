# Checklist visual de la lámina

Abre `lamina_lado_a_lado.jpg` y recórrelo pieza por pieza. Compara siempre con la columna **REFERENCIA aprobada**, no con tu idea del producto.

Para cada pieza, decide un estado:
- `ok`: coincide en forma, color, posición y proporción, salvo diferencias de luz o ángulo.
- `dudoso`: no se puede afirmar ni descartar; p. ej. motion blur, ángulo extremo o reflejo fuerte.
- `no_visible`: tapada por la mano, fuera de cuadro o demasiado pequeña.
- `discrepancia`: diferencia **clara**, que se describiría a Daniel sin dudar.

## Qué mirar

1. **Medalla:** silueta (ovalada frente a otra forma), figura de la Virgen, borde y tamaño respecto a las cuentas.
2. **Cruz:** integrada en la línea de la pulsera, **no colgando**; forma de los brazos y tamaño relativo.
3. **Cuentas:** los tres colores y su orden; ninguna cuenta de un color nuevo; tamaño homogéneo.
4. **Cierre:** tres aros visibles cuando el cierre está en plano; ningún mosquetón ni broche distinto.
5. **Acabado:** dorado. Un cambio de temperatura de color por la luz es aceptable; un metal plateado no lo es.
6. **Proporciones:** pulsera frente a muñeca, y medalla y cruz frente a cuentas.
7. **Artefactos de IA en manos y joyería:** cuentas que se funden, eslabones que desaparecen entre frames, dedos que atraviesan la pulsera, texto o figura de la medalla deformados.

## Cómo pesar las métricas

- Una SOSPECHA del script (SSIM o ΔE fuera de umbral) solo indica dónde mirar. Si la lámina muestra que es la luz, un reflejo o una cuenta contigua dentro del recorte, márcalo `ok` y explícalo en la nota.
- En `post-upscale`, compara sobre todo ORIGINAL frente a RESULTADO en la misma posición: cuentas fundidas, medalla emborronada o halos alrededor del metal.
- Indica los timestamps exactos de cualquier `discrepancia` o `dudoso`.
