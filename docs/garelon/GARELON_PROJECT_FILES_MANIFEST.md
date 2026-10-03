# GARELON · MANIFEST DE DOCUMENTOS DEL PROYECTO

> **Versión:** 3.0 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `955bcc3`
>
> La tabla de versiones y SHA-256 se regenera con `python3 tools/garelon_docs_check.py --update-manifest`. `python3 tools/garelon_docs_check.py` falla si no coincide con los archivos.

## 1. Los 5 documentos canónicos

Son los que se suben al proyecto de ChatGPT (`GARELON-PROJECT-DOCS-LATEST.zip`, generado con `python3 tools/garelon_docs_check.py --zip <ruta>`).

| Documento | Propósito | Manda sobre |
|---|---|---|
| `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` | Constitución: qué es GARELON, roles, prioridad de fuentes, reglas permanentes R1-R24, marca, flujo, CRO, confianza, opiniones, lanzamiento, seguridad, skill y mantenimiento | Todos los demás en reglas y prioridades |
| `GARELON_MASTER_TEMPLATE.md` | Arquitectura real del tema (Dawn 16 + capa GARELON), componentes, imágenes, textos, puntos acoplados al producto, routing, validación y ZIP | El prompt de migración en lo técnico. Si contradice el código, manda el código |
| `GARELON_PRODUCT_BRIEF_TEMPLATE.md` | Formulario de datos reales de un producto (`NO DISPONIBLE` si falta) | Nada: es la entrada del prompt de migración |
| `GARELON_MIGRATION_PROMPT_TEMPLATE.md` | Convierte brief + imágenes + repo en el prompt final para Claude Code (fases F0-F10) | La ejecución de una migración concreta |
| `GARELON_PRODUCT_MIGRATION_CHECKLIST.md` | Verificación final con marcadores 🅲 Claude/local · 🆂 Shopify real · 🅿 Propietario | Nada: valida el resultado |

**Orden de autoridad:** producto real > propietario > repo > Shopify > Prompt Maestro > Master Template > Migration Prompt > Brief > Checklist > histórico.

## 2. Versiones y huellas

<!-- manifest:start -->
| Documento | Versión | Fecha | Commit fuente | Líneas | SHA-256 |
|---|---|---|---|---|---|
| `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` | 3.0 | 2026-10-03 | `955bcc3` | 373 | `3ade22c49b058036e40f7ed469e23a8e8ed10c2fe68480954c0a2aa4f95c69b0` |
| `GARELON_MASTER_TEMPLATE.md` | 3.0 | 2026-10-03 | `955bcc3` | 299 | `57af14d819ec5f3e7f8a509bd64bceda4d985b959fc533137c8b887206700c84` |
| `GARELON_PRODUCT_BRIEF_TEMPLATE.md` | 3.0 | 2026-10-03 | `955bcc3` | 139 | `506f4d7cb29a755f426a8b18f851aa56535bb15e494ac7e07fe2b1305529743b` |
| `GARELON_MIGRATION_PROMPT_TEMPLATE.md` | 3.0 | 2026-10-03 | `955bcc3` | 147 | `426c792c12ca95228056cac0a87190fdb0f7579a0465cdf019ccbdc14f621901` |
| `GARELON_PRODUCT_MIGRATION_CHECKLIST.md` | 3.0 | 2026-10-03 | `955bcc3` | 135 | `b47207a3ec68976c5f3566528900edb4b9c27ee7651791df8b1c1fed2243fa66` |
<!-- manifest:end -->

## 3. Documentos de apoyo (no van en el ZIP del proyecto)

| Archivo | Propósito |
|---|---|
| `docs/garelon/GARELON_DECISION_LOG.md` | Decisiones históricas, con motivo y fuente |
| `docs/garelon/GARELON_PROJECT_FILES_MANIFEST.md` | Este archivo |
| `.claude/skills/garelon-ecommerce-operator/SKILL.md` | Orquestador para Claude Code |
| `.claude/skills/garelon-ecommerce-operator/references/current-store-state.md` | Snapshot del estado real (commit + fecha) |
| `.claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py` | Genera el snapshot desde el repo |
| `tools/garelon_docs_check.py` | Comprobación del sistema documental, manifest y ZIP del proyecto |
| `tools/test_garelon_docs_check.py` | Autoprueba del comprobador documental |

## 4. Histórico (no describe el estado actual)

`docs/garelon/GARELON_ARQUITECTURA_V2.md`, `docs/garelon/products/`, `docs/garelon/prompts/` y los `GARELON-*.md` de la raíz del repositorio. Se conservan como lecciones aprendidas. Ante cualquier contradicción mandan los 5 documentos canónicos y, por encima, el repo.
