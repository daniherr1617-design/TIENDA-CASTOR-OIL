# GARELON · BRIEF DE PRODUCTO (plantilla genérica)

> **Versión:** 3.0 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `955bcc3`
>
> Snapshot generado desde `955bcc3`. Ante discrepancias futuras manda el repositorio actual. Las reglas que filtran este brief están en `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` §4.

**Para qué sirve:** reunir los **datos reales** de un producto antes de tocar la tienda. Es la entrada de `GARELON_MIGRATION_PROMPT_TEMPLATE.md`.

**Cómo rellenarlo:**
- Cada campo con datos reales. Lo que no sepas: **`NO DISPONIBLE`**. Nunca se inventa.
- En cada dato, indica la **fuente**: `PRODUCTO FÍSICO` (lo has visto o recibido), `PROPIETARIO` (lo confirmas tú), `PROVEEDOR` (ficha o descripción escrita), `IMAGEN DEL PROVEEDOR` (solo aparece dentro de una imagen: no verificado) o `NO DISPONIBLE`.
- Pega los textos del proveedor tal cual, aunque exageren: se filtran después.
- No incluyas credenciales, tokens ni datos personales de clientes.

```text
====================================================================
GARELON · BRIEF DE PRODUCTO
Fecha:
Rellenado por:
Versión del brief:
====================================================================

1. PRODUCTO
   Nombre en español (cómo lo llamarías tú):
   Nombre corto para botones («Elegir mi …»):
   Categoría (joyería, hogar, cosmética, gadget, mascotas, moda, bienestar, otra):
   Frase de marca o emocional propuesta (sin promesas):
   Público objetivo:
   Qué problema resuelve o qué significado tiene:

2. PROVEEDOR
   Nombre del proveedor / tienda:
   URL del producto en el proveedor:
   ¿Es el mismo artículo exacto (mismo vendedor, mismo modelo) que se va a comprar? [sí/no]
   Valoración y nº de ventas en el proveedor (solo como referencia interna, NO se publica):

3. INTEGRACIÓN ({{SUPPLIER_INTEGRATION}})
   [ ] DSers   [ ] otra: ________   [ ] ninguna (manual)
   ¿El producto ya está importado en Shopify? [sí/no] · Handle en Shopify:
   ¿Variantes mapeadas con el proveedor? [sí/no/NO DISPONIBLE]

4. COSTE PRODUCTO (por unidad, con moneda e impuestos si aplica):

5. COSTE ENVÍO DEL PROVEEDOR (por unidad / por pedido; método de envío interno):

6. FULFILLMENT
   [ ] manual   [ ] automático vía integración   [ ] otro:
   Cómo se compra cada pack al proveedor (Pack de N → N unidades del mismo SKU):
   ¿Pedido de prueba hecho? [sí/no]

7. CONTENIDO EXACTO (qué recibe el cliente por unidad; piezas, accesorios):

8. PACKAGING (bolsa, caja, estuche, tarjeta; si no se sabe: NO DISPONIBLE):

9. MARCA FÍSICA (marca impresa en el producto o en el envase, o «sin marca»):
   Recordatorio: nunca se añade «GARELON» al producto ni al envase.

10. MATERIALES / INGREDIENTES / ESPECIFICACIONES (con fuente):

11. MEDIDAS (producto y envase, peso, capacidad; con unidades y conversión si viene en pulgadas):

12. VARIANTES (opciones y valores reales; ¿tienen imagen propia?):

13. PACKS
    ¿Se vende en packs? [sí/no]
    Nombre de la opción en Shopify (hoy «Pack»):
    Valores (p. ej. «1 <unidad>», «2 <unidades>», «3 <unidades>»):
    Precio previsto de cada pack (se configura en Shopify, NO en el tema):
    ¿compare_at_price real para alguno? [sí/no] · Si sí, precio anterior real y fecha:
    Distintivo editorial (p. ej. «Recomendado») y en qué pack:

14. CLAIMS (lo que se puede decir, con fuente):

15. CLAIMS PROHIBIDOS (lo que no es cierto o no está verificado; incluye lo que solo
    aparece dentro de imágenes del proveedor):

16. ADVERTENCIAS Y CUIDADOS (uso, edad, piezas pequeñas, alergias, limpieza, batería…):

17. POLÍTICAS: ¿el producto afecta a…? (sí/no + detalle)
    Devoluciones / desistimiento (higiene, personalizado, precintado):
    Envíos (baterías, líquidos, tamaño):
    Garantía legal / comercial:
    Edad o restricciones:

18. SHIPPING (lo que ve el cliente)
    ¿Envío gratis en Shopify? [sí/no] · Zonas:
    ¿Envíos internacionales? [sí/no] · Países:
    ¿Seguimiento? [sí/no]
    Plazos del proveedor (preparación y entrega):
    Plazos prudentes para la política de envíos:

19. IMÁGENES (todas, una por línea)
    Nº · archivo · qué muestra · origen (proveedor / mejorada / propia) ·
    ¿coincide con el producto real? · ¿texto incrustado? (¿claims?) ·
    papel propuesto (producto entero / escala-uso / detalle / información / contexto) ·
    ¿verificada por el propietario? [sí/no]
    1.
    2.

20. VIDEOS (archivo o URL · qué muestra · ¿coincide con el producto? · ¿derechos de uso?):

21. COMPETIDORES / REFERENCIAS (URL · qué aprender: estructura, interacción, jerarquía, CRO.
    Nunca se copia el diseño ni sus condiciones legales):

22. PRECIO (venta previsto por pack, IVA incluido):

23. UNIT ECONOMICS (por pack)
    Coste producto × unidades + envío proveedor + comisión de pago + otros =
    Margen bruto por pack:
    CPA máximo tolerable (break-even):
    Datos que faltan: NO DISPONIBLE

24. CREATIVE ANGLES (ángulos de anuncio honestos: regalo, significado, uso diario, problema/solución…;
    sin antes/después falsos ni testimonios inventados):

25. DATOS NO CONFIRMADOS (todo lo que hay que verificar antes de publicarlo):

26. DATOS DE MIGRACIÓN
    Producto anterior que se retira (handle):
    ¿Se archiva o se despublica? · ¿Redirección del handle anterior → / ? [sí/no]
    ¿Cambios hechos en el editor de temas de Shopify desde la última entrega? [sí/no]
      Si sí: exporta el tema publicado (Temas › … › Descargar archivo del tema) y adjúntalo.
    Rama de trabajo propuesta para Claude Code:
```

## Comprobaciones antes de entregarlo

- [ ] Hay al menos una foto limpia del **producto real**, que sirva como imagen principal.
- [ ] Todas las imágenes muestran **el mismo producto** que llega: forma, piezas, colores y materiales.
- [ ] Los claims tienen fuente, y los que solo aparecen dentro de imágenes están marcados como no verificados.
- [ ] Las medidas llevan unidades y la conversión es correcta.
- [ ] Los precios están decididos para Shopify, no para el tema.
- [ ] Todo lo desconocido dice `NO DISPONIBLE`.

## Qué pasa después

1. ChatGPT verifica los datos, analiza **todas** las imágenes, filtra claims y redacta el copy (Prompt Maestro §8-§10).
2. Rellena `GARELON_MIGRATION_PROMPT_TEMPLATE.md` y entrega el prompt final para Claude Code.
3. Claude Code implementa siguiendo `GARELON_MASTER_TEMPLATE.md` y valida con `GARELON_PRODUCT_MIGRATION_CHECKLIST.md`.
