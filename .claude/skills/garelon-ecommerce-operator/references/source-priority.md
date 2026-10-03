# Prioridad de fuentes

> Resumen operativo. La versión canónica está en `docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` §3.

## Orden (manda la más alta)

1. Verdad física del producto que recibe el cliente.
2. Confirmaciones explícitas y recientes del propietario.
3. Estado real del repositorio (rama y HEAD en uso).
4. Estado real de Shopify, cuando pueda comprobarse.
5. Documentación GARELON actualizada (`docs/garelon/`).
6. Brief del producto.
7. Información del proveedor.
8. Historial y documentos antiguos (`GARELON-CAMBIOS-*.md`, `docs/garelon/products/`, `docs/garelon/prompts/`, `GARELON_ARQUITECTURA_V2.md`…).
9. Suposiciones del modelo (nunca bastan para publicar).

## Desempates

- **Documento vs código:** manda el código. Corrige el documento (DOCUMENT_SYNC), no el tema.
- **Código vs producto real:** manda el producto real. Corrige el código.
- **Documento antiguo vs confirmación reciente del propietario:** manda el propietario. Ejemplo: las imágenes que el propietario verificó no se vuelven a descartar por una revisión anterior.
- **Sin forma de comprobarlo:** `NO DISPONIBLE`, o «pendiente de verificación en Shopify». Nunca se rellena inventando.

## Cómo comprobar en lugar de suponer

| Pregunta | Cómo |
|---|---|
| ¿Qué rama y HEAD uso? | `git branch --show-current`, `git rev-parse --short HEAD`, `git status --short` |
| ¿Qué hay hoy en la home o en la ficha? ¿Qué orden de galería? ¿Qué packs? | `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py` |
| ¿Por qué se decidió X? | `docs/garelon/GARELON_DECISION_LOG.md` |
| ¿Qué dice el código exactamente? | Lee el archivo (`sections/`, `snippets/`, `templates/*.json`) |
| ¿Precio, stock, variantes reales, apps, políticas? | Solo Shopify Admin. Desde el repo: `NO DISPONIBLE` |

## Antes de preguntar al propietario

Busca en: repo → `docs/garelon/` → brief → datos del proveedor → datos de Shopify disponibles. Pregunta solo si la decisión depende de un dato real que no está en ninguna parte (p. ej. el precio de un pack nuevo o si el envío seguirá siendo gratis). Una sola pregunta concreta es mejor que una lista.

## Lo que esta skill no puede hacer

No lee conversaciones externas (por ejemplo, de ChatGPT) que no estén en el repositorio o en el prompt. No inventa recuerdos: si algo solo existió fuera, no se da por hecho.
