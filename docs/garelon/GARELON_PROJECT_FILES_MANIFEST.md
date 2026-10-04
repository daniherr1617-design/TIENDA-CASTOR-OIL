# GARELON · MANIFEST DE DOCUMENTOS DEL PROYECTO

> **Versión:** 3.1 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `974eadd`
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
| `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` | 3.4 | 2026-10-04 | `e27ae75` | 387 | `279517e400e34af5bfd082ef30bdfa9f23f7ab533e7a773de535329d5b5ace73` |
| `GARELON_MASTER_TEMPLATE.md` | 3.3 | 2026-10-04 | `e27ae75` | 341 | `3c07dd066776e0fb0d0732d5162913a07e7ff27c982bc0804028a6e82aba1cae` |
| `GARELON_PRODUCT_BRIEF_TEMPLATE.md` | 3.1 | 2026-10-03 | `974eadd` | 139 | `7e8baf9b60b5b09c1cadf7a710ebd016bcf788bf7a525d738431c5d11defccca` |
| `GARELON_MIGRATION_PROMPT_TEMPLATE.md` | 3.3 | 2026-10-04 | `e27ae75` | 161 | `fd006bc091fdd94ca723cf3f38306870d1daf6bf956c27eb311f96c438cc0fb5` |
| `GARELON_PRODUCT_MIGRATION_CHECKLIST.md` | 3.3 | 2026-10-04 | `e27ae75` | 141 | `705a1d04bf4b21bd8e2f0e924880f2486af85a23f2e2b4c0d1ca05f6514703e7` |
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
| `tests/render-harness/README.md` | Batería de render versionada: instalación, ejecución, qué simula y qué no prueba |

## 4. Histórico (no describe el estado actual)

`docs/garelon/GARELON_ARQUITECTURA_V2.md`, `docs/garelon/products/`, `docs/garelon/prompts/` y los `GARELON-*.md` de la raíz del repositorio. Se conservan como lecciones aprendidas. Ante cualquier contradicción mandan los 5 documentos canónicos y, por encima, el repo.
