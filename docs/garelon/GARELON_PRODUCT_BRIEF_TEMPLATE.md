# GARELON · Brief de producto nuevo

> Formulario para rellenar **antes** de adaptar la tienda. Se entrega a ChatGPT junto con las imágenes y `GARELON_MASTER_TEMPLATE.md`.
> - Copia la plantilla de abajo y rellena cada campo con datos **reales**.
> - Si no sabes algo, escribe `NO DISPONIBLE`: nunca se inventa.
> - Pega los textos del proveedor tal cual, aunque exageren: ChatGPT los filtrará (sección 17 de la plantilla maestra).

```text
====================================================
GARELON · BRIEF DE PRODUCTO
Fecha:
====================================================

1. PRODUCTO
   Nombre en español (cómo lo llamarías tú):
   Nombre corto para el botón («Comprar …»):
   ¿Qué recibe exactamente el cliente? (unidades, accesorios, caja):
   Marca impresa en el producto o en la caja (o «sin marca»):

2. TÍTULO AUTODS (copiar tal cual):

3. DESCRIPCIÓN ORIGINAL (copiar tal cual, de AutoDS o del proveedor):

4. CATEGORÍA
   [ ] cosmética  [ ] electrónica/gadget  [ ] hogar  [ ] mascotas
   [ ] moda       [ ] bienestar           [ ] accesorio  [ ] organización
   [ ] otra:

5. PRECIO / COSTE (solo referencia; el tema lo lee de Shopify)
   Coste proveedor:
   Precio de venta previsto:
   Precio comparado (solo si es real):

6. VARIANTES (nombre de la opción y valores; ¿tienen imagen propia?):

7. CARACTERÍSTICAS (hechos objetivos):

8. INGREDIENTES / MATERIALES / ESPECIFICACIONES
   (lista exacta del envase o del proveedor; cosmética: INCI completo)
   Fuente del dato (envase / ficha del proveedor / foto de la etiqueta):

9. DIMENSIONES Y CAPACIDAD (producto y caja, peso, ml/g, con unidades):

10. MODO DE USO (pasos reales, del envase o del proveedor):

11. ADVERTENCIAS Y CUIDADOS (uso externo, edad, alergias, limpieza, batería…):

12. BENEFICIOS DEL PROVEEDOR (copiar tal cual, aunque exageren):

13. CLAIMS QUE DEBEN EVITARSE (los que ya sabes que no quieres o que no son ciertos):
    Certificaciones o pruebas que SÍ tienes documentadas (adjuntar):

14. INFORMACIÓN DE ENVÍO
    Mercado (actualmente España):
    Zonas y condiciones configuradas en Shopify:
    Plazo real del proveedor (si lo sabes):
    ¿Cambia el texto de la barra superior? (hoy «Envío disponible a toda España»):

15. POLÍTICAS: ¿el producto afecta a…? (sí/no + detalle)
    Devoluciones (higiene, producto abierto…):
    Envíos (baterías, líquidos, tamaño):
    Seguridad o higiene:
    Garantía:
    Edad o restricciones:

16. IMÁGENES DISPONIBLES (originales del proveedor)
    Nº · nombre de archivo · qué muestra · ¿texto incrustado? · ¿antes/después?
    1.
    2.
    …

17. IMÁGENES MEJORADAS (si ChatGPT u otra herramienta las ha retocado)
    Nº · qué se cambió (fondo, maquetación, textos) · confirmo que el producto NO se alteró [sí/no]
    1.
    …

18. OTROS DATOS
    Público objetivo:
    Qué lo diferencia de productos parecidos:
    Preguntas que te hacen o que esperas de los clientes:
    Enlaces a la ficha del proveedor / AutoDS:

19. DATOS TÉCNICOS PARA LA MIGRACIÓN
    Producto anterior que se retira:
    Handle del producto nuevo en Shopify (si ya está importado):
    ¿El producto anterior sigue publicado? [sí/no] · ¿Se archivará? [sí/no]
    ¿Has cambiado algo en el editor de temas desde la última entrega? [sí/no]
      Si sí: adjunta el ZIP del tema publicado (Temas → … → Descargar archivo del tema).
    Rama de git donde debe trabajar Claude Code:
    ¿Activar el selector de packs 1/2/3 unidades? [no por defecto]
```

## Checklist antes de enviarlo a ChatGPT

- [ ] Tengo al menos **una foto limpia** del producto real, sin apenas texto (será la imagen principal).
- [ ] Las imágenes muestran **el mismo producto** que llegará: envase, marca, color, piezas y accesorios.
- [ ] Los ingredientes, materiales o especificaciones salen del envase o de la ficha del proveedor, no de suposiciones.
- [ ] Las medidas llevan unidades.
- [ ] He marcado qué imágenes tienen antes/después o textos dudosos.
- [ ] Sé si el producto anterior se retira de la tienda.

## Qué hace ChatGPT con este brief

1. Rellena el bloque **NEW PRODUCT DATA** de la plantilla maestra.
2. Filtra claims, elige secciones y redacta el copy.
3. Propone el uso de las imágenes.
4. Genera el **prompt final para Claude Code** (sección 29 de la plantilla maestra).

## Ejemplo resuelto (producto actual, resumido)

- **Producto:** sérum para el contorno de ojos con aceite de ricino y roller («Comprar el sérum»); frasco de vidrio ámbar de 10 ml con bola metálica, tapón y caja; marca impresa «Baafven».
- **Categoría:** cosmética.
- **Ingredientes:** Ricinus Communis (Castor) Seed Oil, Acetyl Tripeptide-1, Collagen, Boswellia Serrata Extract, Aqua.
- **Medidas:** caja 8,7 × 2,2 × 2,2 cm; frasco ≈ 8,4 × 1,9 cm.
- **Uso:** limpia y seca → aplica con el roller → masajea con la bola.
- **Advertencias:** solo uso externo; evitar el contacto con los ojos.
- **Claims a evitar:** «elimina ojeras/arrugas», «anti-aging».
- **Imágenes:** 10 entregadas; 6 usadas y 4 descartadas (errata, etiqueta distinta, dos antes/después).
