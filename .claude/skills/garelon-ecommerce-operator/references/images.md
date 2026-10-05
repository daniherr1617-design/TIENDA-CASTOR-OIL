# Imágenes de producto

> Canónico: Prompt Maestro §9 (reglas) y Master Template §4 (sistema técnico).

## Regla máxima

El producto que se ve en la web es el producto que recibe el cliente.

**Prohibido** (también si lo pide alguien):
- cambiar forma, piezas, colores o materiales;
- añadir «GARELON» al producto o al envase;
- inventar accesorios o packaging;
- alterar resultados (antes/después);
- regenerar el producto con IA.

**Permitido mejorar** (fuera de Claude Code: ChatGPT u otra herramienta): fondo, composición, calidad, resolución, presentación y entorno, sin tocar el producto.

## Qué hace Claude Code con imágenes

**Sí:** redimensionar, recortar sin ampliar, convertir a WebP, comprimir, ordenar, integrar y escribir textos alternativos fieles.

**No:** editar píxeles del producto, aplicar filtros que cambien color o material, ni regenerar.

Si el propietario pide «mejora esta imagen» a Claude Code:
1. Explica qué puede hacer él (resolución, compresión, recorte, formato, orden).
2. Indica que la mejora visual (fondo, entorno) se hace fuera, con el producto intacto.
3. Después compara la imagen mejorada con la original: piezas, colores, proporciones y texto incrustado.

## Análisis obligatorio de TODAS las imágenes

Para cada imagen, una fila:

| Campo | Pregunta |
|---|---|
| Qué muestra | Producto entero, puesto o en uso, detalle, infografía, contexto o emoción |
| Fidelidad | ¿Coincide con el producto real? (forma, piezas, colores, materiales, cierre, proporciones) |
| Texto incrustado | ¿Lleva texto? ¿En qué idioma? ¿Contiene claims no verificados (14K, waterproof, hipoalergénico…)? Un claim que solo está en una imagen no está verificado |
| Verificación del propietario | Si el propietario la verificó, **no se vuelve a descartar** |
| Papel | Producto claro / escala-uso / detalle / información / contexto |
| Decisión | Usar (clave y secciones) o no usar, con motivo |

## Orden razonado (nunca por nombre de archivo ni por orden de subida)

1. Producto claro y entero primero (forma, piezas, cierre).
2. Escala y uso (puesto, en la mano).
3. Detalle (primer plano de lo que lo hace especial).
4. Información (infografía con medidas y características).
5. Contexto o emoción (lifestyle).

Ajusta según lo que la página enseñó justo antes: en la home, la portada ya muestra una imagen, así que la galería de compra no la repite al principio. El orden vigente está en `current-store-state.md`.

## Pipeline técnico (Master §4)

1. Fuente en la raíz del repo (fuera del ZIP).
2. WebP cuadrados a varios anchos (480/720/1080; las infografías también a su ancho nativo para ampliar). Ejemplo con Pillow: `Image.open(src).convert('RGB').resize((w, w), Image.LANCZOS).save(dst, 'WEBP', quality=82, method=6)`, sin ampliar por encima del tamaño original. **Infografías con texto y líneas finas: WebP lossless** (`lossless=True, quality=100, method=6`), porque el WebP con pérdida submuestrea el color y aclara las líneas. La de hoy (`infografia` ← `NUEVA IMAGEN 1.png`, inmutable, D34) se genera y se comprueba solo con `tools/garelon_infografia.py --build` / `--check`.
3. `assets/producto-<clave>-<ancho>.webp`.
4. `when '<clave>'` con sus anchos en `snippets/garelon-image.liquid`.
5. `when` en `snippets/garelon-gallery.liquid` + `garelon.gallery.alt_<clave>` en **todos** los locales.
6. Opciones `image_key` de las secciones que la ofrezcan.
7. `python3 tools/garelon_check.py`, que comprueba los anchos y que las claves de las galerías existen.

## Logo

Solo se recorta el margen transparente y se reduce. Sin cambios de diseño, color ni proporción. Nunca sobre el producto.
