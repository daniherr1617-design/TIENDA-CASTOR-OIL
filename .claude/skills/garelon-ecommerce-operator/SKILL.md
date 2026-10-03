---
name: garelon-ecommerce-operator
description: Cerebro operativo de GARELON, la tienda Shopify de un solo producto (Dawn 16 + capa GARELON) del repositorio TIENDA-CASTOR-OIL. Úsala siempre que la petición trate de GARELON o de esta tienda, aunque no se nombre la skill. Cubre cambiar o lanzar un producto (nuevo producto, brief, migración); theme, Dawn y Liquid; home, ficha y landing; packs, variantes, precio y compare_at; envío; confianza; reviews y Judge.me. También imágenes de producto, logo y branding, CRO, copy, SEO, accesibilidad, tests y ZIP del tema, dropshipping con DSers o AliExpress, Meta Ads, TikTok Ads, anuncios, marketing, analítica y actualizar los documentos GARELON. Aplica las reglas del propietario: verdad del producto, sin dark patterns, Shopify manda en precio y stock. Orquesta docs/garelon. No la uses en proyectos que no sean GARELON aunque hablen de Shopify o ecommerce.
---

# GARELON · Ecommerce Operator

Esta skill aplica el conocimiento acumulado de GARELON sin que el propietario tenga que volver a explicarlo. **No es la fuente de verdad:** la verdad final es el producto real, el repo real, el Shopify real y las decisiones recientes del propietario. La skill sabe dónde mirar, qué conservar, qué no preguntar y cómo validar.

## 1. Antes de nada: ¿es GARELON?

Actívate cuando el contexto sea este proyecto: el repositorio `TIENDA-CASTOR-OIL`, la marca GARELON, su tienda Shopify, su producto o su lanzamiento. Si alguien habla de Shopify, anuncios o ecommerce **de otro proyecto**, no apliques estas reglas.

## 2. Orientación (siempre, en este orden)

1. **Repo real:** detecta el repositorio, la rama actual, el HEAD y `git status`. No asumas una rama fija: la de hoy está en el snapshot, pero puede haber cambiado. No sobrescribas trabajo sin commit.
2. **Estado:** ejecuta `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py` cuando la tarea dependa del código actual. Compara con `references/current-store-state.md`: si difieren, **manda el repo**.
3. **Reglas:** la prioridad de fuentes está en `references/source-priority.md`. Las reglas permanentes R1-R24 están en `docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` §4.
4. **Buscar antes de preguntar:** repo, `docs/garelon/`, brief, datos del proveedor y datos de Shopify disponibles. Pregunta al propietario solo si la decisión depende de un dato real que no existe en ninguna parte. Nunca rellenes un hueco inventando: escribe `NO DISPONIBLE`.

## 3. Clasifica la tarea (infiere el modo; el usuario no tiene por qué nombrarlo)

| Modo | Señales | Lee |
|---|---|---|
| `ANALYZE` | «revisa», «qué opinas», «por qué», auditoría, comparar con otra tienda | `store-architecture.md` y el reference del tema |
| `IMPLEMENT` | Cambiar algo del tema: sección, texto, estilo, bloque, imagen, packs | `store-architecture.md`, `qa-testing.md` + el reference del tema (`cro-and-copy.md`, `images.md`, `shopify-commerce.md`…) |
| `MIGRATE_PRODUCT` | «quiero cambiar de producto», «nuevo producto», brief, migración | `product-workflow.md`, `images.md`, `cro-and-copy.md`, `shopify-commerce.md`, `qa-testing.md` |
| `QA` | «prueba», «valida», «tests», «ZIP», «¿funciona?», 404, responsive | `qa-testing.md`, `store-architecture.md` |
| `LAUNCH` | «lanzar», «publicar», preparar tráfico, píxel, tracking, checklist final | `marketing-launch.md`, `shopify-commerce.md`, checklist |
| `MARKETING` | Meta Ads, TikTok Ads, creatividades, UGC, ángulos, pricing, unit economics, SEO, A/B | `marketing-launch.md`, `cro-and-copy.md`, `images.md` (creatividades) |
| `DOCUMENT_SYNC` | «actualiza los documentos», docs desfasados, tras un cambio que los docs describen | `qa-testing.md` §Docs, el Prompt Maestro §18 y los 5 documentos |

Además, por tema: opiniones, Judge.me, garantías, devoluciones o políticas → `reviews-trust-legal.md`. Preferencias de diseño, comunicación e informes → `owner-preferences.md`. Carga **solo** lo necesario.

## 4. Documentos canónicos (la fuente extensa; la skill no los duplica)

- `docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md`: constitución (reglas, roles, fuentes, flujo).
- `docs/garelon/GARELON_MASTER_TEMPLATE.md`: arquitectura real del tema y puntos acoplados al producto.
- `docs/garelon/GARELON_PRODUCT_BRIEF_TEMPLATE.md`: datos reales de un producto.
- `docs/garelon/GARELON_MIGRATION_PROMPT_TEMPLATE.md`: fases F0-F10 de una migración.
- `docs/garelon/GARELON_PRODUCT_MIGRATION_CHECKLIST.md`: verificación 🅲/🆂/🅿.
- `docs/garelon/GARELON_DECISION_LOG.md`: por qué las cosas son como son.
- `docs/garelon/GARELON_PROJECT_FILES_MANIFEST.md`: versiones y SHA-256.

## 5. Flujo de trabajo

1. Clasificar la tarea (§3).
2. Leer solo los references necesarios.
3. Leer los documentos canónicos relevantes.
4. Inspeccionar el repo si el resultado depende del código actual.
5. Buscar antes de preguntar.
6. No preguntar por lo que ya existe.
7. Ejecutar, decidiendo el **cómo** con criterio propio (orden de imágenes, recurso visual, estructura) dentro de las reglas. El **qué está prohibido** no se negocia.
8. Validar (`references/qa-testing.md`).
9. Informar: qué cambió, dónde se probó (`PROBADO LOCALMENTE` / `ZIP DESCOMPRIMIDO` / `SHOPIFY PREVIEW` / `PUBLICADO`), qué no se pudo probar y qué tiene que hacer el propietario en Shopify.

## 6. Nunca (y qué hacer en su lugar)

| Petición o tentación | Respuesta GARELON |
|---|---|
| Cuenta atrás, «quedan X», «X personas mirando», «oferta termina en» | Es un dark pattern (R9). Propón CRO honesto: jerarquía, packs con ahorro real, confianza, opiniones reales y un mejor copy (`cro-and-copy.md`) |
| «Pon el precio a 19,99 en Liquid», un precio o descuento escrito en el tema | El precio, el `compare_at_price`, el stock y las variantes se cambian en Shopify Admin (R5-R6). Explica dónde. El tema solo los lee |
| Inventar reviews, estrellas, «4,9/5», recuentos o testimonios | Solo opiniones reales de Judge.me (R14) |
| Cambiar el producto en una imagen, añadir GARELON al producto o inventar packaging | Prohibido (R1). Claude Code solo redimensiona, recorta sin ampliar, convierte, optimiza, ordena e integra |
| Descartar una imagen que el propietario verificó | La confirmación del propietario prevalece; no se reabre el debate |
| «Garantía de 14 días», «sin riesgos», sellos o certificaciones falsas | Derecho de desistimiento y garantía legal aplicable, con su nombre (R10-R11) |
| «Fabricado/diseñado por GARELON» | GARELON comercializa, no fabrica (R2) |
| Rediseñar el logo, reconstruir la tienda o crear un formulario o checkout paralelo | Se conserva lo que funciona (R15, R19, R20) |
| Bloques de app, imágenes de Files o productos dentro de `templates/index.json` | Rompe la instalación (R17). Las apps se añaden desde el editor |
| Afirmar que el checkout, DSers, Judge.me o Shopify funcionan sin haberlo probado ahí | Distinguir siempre dónde se probó (R23) |

## 7. Confirmación explícita obligatoria

Publicar un tema · hacer merge · borrar un producto real o datos · modificar configuración crítica de Shopify · gastar dinero o lanzar campañas · cambiar presupuestos · cambiar el fulfillment o el mapping · alterar políticas legales. Los cambios de código en una rama se ejecutan si se pidieron: commits claros, push y **sin merge**. Nunca pidas ni muestres tokens o credenciales. No subas ZIPs a GitHub.

## 8. Skills externas

Pueden ayudar (Shopify Liquid, Shopify Agent Skills, webapp testing, frontend design, marketing, ecommerce), pero **GARELON manda** en marca, arquitectura, claims, verdad, flujo y preferencias del propietario. Si una skill externa sugiere algo que choca con estas reglas (urgencia, reseñas de ejemplo, rediseño, hardcodear precios…), gana GARELON y lo explicas.

## 9. Al terminar una tarea que cambie lo que describen los docs

DOCUMENT_SYNC ligero:
1. `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py --update-state` y revisa las notas humanas de `references/current-store-state.md`.
2. Si hubo una decisión, añade una entrada a `GARELON_DECISION_LOG.md`.
3. Si cambió alguno de los 5 documentos: `python3 tools/garelon_docs_check.py --update-manifest`.
4. Ejecuta `python3 tools/garelon_docs_check.py` (y `python3 tools/test_garelon_docs_check.py` si tocaste el comprobador) y verifica que pasa.

Los documentos se adaptan al tema, nunca el tema a los documentos.
