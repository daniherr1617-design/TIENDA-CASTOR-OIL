# GARELON · BASELINE CERRADO · SÉRUM

> Fecha de cierre: 30/09/2026
>
> Este documento fija el proyecto del sérum como **baseline técnico y documental** de GARELON antes de migrar a un nuevo producto.

## 1. GitHub

- Repositorio: `daniherr1617-design/TIENDA-CASTOR-OIL`
- PR de construcción del baseline: **#1**
- Estado: **fusionada**
- Rama base definitiva: `main`
- Commit de merge/baseline en `main`: `f08f9bb1c3852154382dc0fc5483a779ed7eb707`
- Commit final del tema antes del merge: `6252414a509ef0a63f47b49785c936bd9b0ef514`
- Rama congelada de referencia: `baseline/garelon-serum`
- Nueva rama de trabajo para el siguiente producto: `claude/fondue-mug`

## 2. Qué representa este baseline

- Dawn 16.0.0 + capa GARELON.
- Marca, cabecera, pie, navegación, contacto, carrito y checkout reutilizables.
- Home mobile-first para tráfico de anuncios.
- Packs reales del sérum como variantes con quantity=1.
- CJ Dropshipping como proveedor vigente al cierre.
- Envío gratis visible, sin pagos visuales.
- Opiniones reales preparadas vía app blocks/metafields y situadas tras la compra.
- Corrección del 404 por límite de 25 caracteres en nombres de schema.

## 3. Documentos canónicos

- `docs/garelon/GARELON_MASTER_TEMPLATE.md` — v1.5.
- `docs/garelon/GARELON_PRODUCT_BRIEF_TEMPLATE.md`.
- `docs/garelon/GARELON_PRODUCT_MIGRATION_CHECKLIST.md`.
- `GARELON-CAMBIOS-CJ-PACKS.md`.

Ante discrepancias manda el repositorio real.

## 4. Reglas que pasan al siguiente producto

- GARELON sigue siendo la marca.
- No se inventan claims, reseñas, certificados, stock, urgencia, garantías ni métodos de pago.
- El producto físico debe verse fiel al real y no se le añade GARELON si no está impreso.
- Precio, inventario, SKU y variantes viven en Shopify.
- Checkout oficial de Shopify.
- El proveedor/fulfillment puede cambiar por producto.
- Los packs se deciden según variantes y mapping reales; no se copian mecánicamente del sérum.
- UX mobile-first para TikTok/Meta/Instagram.

## 5. Cierre

El sérum queda cerrado como **proyecto de prueba y baseline reusable de GARELON**. No modificar retroactivamente `baseline/garelon-serum`.
