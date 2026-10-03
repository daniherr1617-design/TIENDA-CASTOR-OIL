# Flujo de producto (MODE: MIGRATE_PRODUCT)

> Canónico: Prompt Maestro §8 (flujo), `GARELON_PRODUCT_BRIEF_TEMPLATE.md` (datos), `GARELON_MIGRATION_PROMPT_TEMPLATE.md` (fases F0-F10) y `GARELON_PRODUCT_MIGRATION_CHECKLIST.md` (verificación).

## Se activa con

«quiero cambiar de producto», «nuevo producto», «vamos a probar X», «migrar la tienda a…», un brief nuevo o fotos de un producto distinto del actual.

## Cadena obligatoria (no saltar pasos)

PRODUCTO → BRIEF → VERIFICACIÓN DE DATOS → ANÁLISIS DE TODAS LAS IMÁGENES → SELECCIÓN → MEJORA DE IMÁGENES (fuera de Claude Code, sin alterar el producto) → COPY → ADAPTACIÓN DEL MASTER → MIGRATION PROMPT → PROMPT FINAL → IMPLEMENTACIÓN → TESTING → CHECKLIST → SHOPIFY PREVIEW → LANZAMIENTO

## Qué hacer según lo que haya

| Situación | Acción |
|---|---|
| Solo «quiero cambiar de producto» | Pide el brief (`GARELON_PRODUCT_BRIEF_TEMPLATE.md`) y las imágenes. Explica la cadena en 3-4 líneas. No empieces a tocar el tema |
| Brief + imágenes, sin prompt final | Verifica datos, analiza **todas** las imágenes (`images.md`), filtra claims y rellena `GARELON_MIGRATION_PROMPT_TEMPLATE.md`. Entrega el prompt o, si el propietario lo pide, ejecútalo |
| Prompt final de migración | Ejecuta F0-F10. F0 empieza con rama nueva, HEAD, `git status`, snapshot y línea base de pruebas |

## Qué se conserva siempre

Marca, logo, dominio, cabecera, pie, navegación mínima, sistema de packs (`garelon_offer`), confianza (`garelon_trust`), «Compra con tranquilidad» (si el producto admite desistimiento), opiniones (`garelon-reviews`), carrito, checkout, políticas, validador, `tools/` y arquitectura.

## Qué cambia

Producto y textos, imágenes `producto-*` y sus claves, galerías, iconos de producto, ajustes de packs (`option_name`, `unit_singular`, `sub_1..3`), frase de confianza, título y nota de opiniones, asociación de producto del Review Widget de Judge.me en la home (D30), barra superior y anclas. La lista completa es el Master §7.

## Qué NO preguntar

Lo que está en el repo, los docs o el brief: marca, logo, paleta, estructura, reglas de packs, política de opiniones, flujo, rama de trabajo vigente (se detecta) y proveedor actual (DSers + AliExpress, salvo que el brief diga otra cosa).

## Qué SÍ puede requerir al propietario

Datos reales que no existen: precios de los packs (para Shopify), si el envío es gratis, si se envía fuera de España, si el producto admite desistimiento, verificación física de piezas dudosas, y la confirmación de imágenes con dudas de fidelidad.

## Shopify (lo hace el propietario; Claude lo deja en el informe)

Producto y descripción, opción de packs con precio real, `compare_at_price` solo si es real, multimedia revisada, SEO, redirección del handle anterior → `/`, envío, políticas, Judge.me (App Embed activo y producto del Review Widget de la home), mapping con el proveedor y un pedido de prueba por pack.
