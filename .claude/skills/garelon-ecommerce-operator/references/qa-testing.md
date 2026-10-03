# QA, pruebas, ZIP y sincronización de documentos

> Canónico: Master Template §8-§9 y Checklist. Los números de hoy (total de pruebas, avisos de la línea base) están en `current-store-state.md`. **Nunca los copies como verdad permanente: descúbrelos.**

## 1. Antes de tocar nada: línea base

```bash
git branch --show-current && git rev-parse --short HEAD && git status --short
python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py
python3 tools/garelon_check.py            # instalabilidad (sale con 1 si falla)
python3 tools/test_garelon_check.py       # autoprueba del validador
```

Theme Check y Liquid estricto no están en el repo: instálalos en la sesión.
- **Theme Check:** `npm i @shopify/theme-check-node` y un script que llame a `themeCheckRun(raiz)`. Anota errores y avisos **antes** de cambiar nada: Dawn 16.0.0 trae avisos propios, así que la referencia es la línea base, no cero.
- **Liquid estricto (Ruby):** gema `liquid`. Parsea `layout`, `sections`, `snippets` y `templates` (`*.liquid`) con `error_mode: :strict`, registrando como bloques sin efecto `schema`, `javascript`, `style`, `stylesheet`, `form` y `paginate`, y como tags `section`, `sections`, `layout` y `content_for`.

## 2. Qué validar (mínimo)

| Área | Cómo |
|---|---|
| JSON y schemas | `tools/garelon_check.py` (claves duplicadas, valores contra schema, nombres ≤ 25 bytes, `order`/`block_order`, secciones permitidas, apps o recursos en plantillas, claves de imagen, locales) |
| Theme Check | Sin errores; avisos = línea base |
| Liquid estricto | 0 errores |
| Render y routing | `/` → 200 (index), con y sin producto; ficha 200; ruta inexistente → 404 limpia; `/cart` 200; contacto 200 |
| Variantes y packs | Cambiar de tarjeta cambia `id`, precio, URL y botón; cantidad 1; agotado; sin ahorro real no hay textos de ahorro; `compare_at` solo si existe; sin opción de packs, selector de Dawn |
| Carrito y cajón | Añadir, línea con el pack × 1, eliminar, subtotal, «Seguir comprando» → home |
| Imágenes | Anchos completos; solo la LCP `eager`; textos alternativos; orden de galería esperado |
| Enlaces | Internos 200; legales solo si existen |
| Accesibilidad básica | Un H1; FAQ con teclado; «Saltar al contenido»; foco visible; iconos `aria-hidden` |
| SEO | Un JSON-LD de producto; títulos coherentes |
| Claims | Búsqueda de términos prohibidos del brief = 0 |
| Responsive | 320, 360, 375, 390, 430, 768, 1024 y 1440 px sin scroll horizontal; cabecera sin solapes; tarjetas simétricas |
| JS | Sin errores de consola |

## 3. Render local (batería de regresión)

La tienda no se puede abrir desde este entorno (la red bloquea `*.myshopify.com` y `cdn.shopify.com`). Las pruebas de render usan un **servidor local que imita Shopify**:
- `liquidjs` pinta el Liquid **real** del tema con datos **simulados**: producto con packs (con y sin ahorro, con `compare_at`, agotado, otra opción, dos opciones), sin producto, con y sin opiniones, y con y sin políticas o contacto.
- El routing imita a Shopify: `/` → index, producto o página solo si existe, el resto → plantilla 404 con HTTP 404 (en la 404, `request.path` = `/404`).
- Un endpoint de estado (`/__state?mode=…`) cambia el escenario y una cabecera de respuesta indica la plantilla usada.
- **Playwright + Chromium** (en este entorno: `/opt/pw-browsers`, sin descargar navegadores) ejecuta el JS real de Dawn. `standard-events.js` de Shopify se sustituye por un stub.

**Importante:** esta batería **no está versionada en el repositorio**. Si no hay una copia en la sesión, reconstrúyela con este diseño o pide al propietario la copia entregada aparte. Proponer versionarla es una mejora pendiente (Decision Log). Al informar, di cuántas pruebas se ejecutaron y en qué escenarios.

## 4. ZIP del tema

```bash
python3 tools/build_zip.py /ruta/fuera/del/repo/GARELON-<PRODUCTO>-vX.zip
```

- Solo `assets/ config/ layout/ locales/ sections/ snippets/ templates/`, con fechas fijas (el mismo árbol da el mismo SHA-256).
- `build_zip.py` descomprime en una carpeta nueva, valida con `--strict-root` y compara byte a byte. Además, ejecuta sobre esa carpeta **Theme Check, Liquid estricto y el render**. No valides solo el árbol de trabajo.
- Anota el SHA-256 (`sha256sum`). **No subas el ZIP a GitHub.**

## 5. Informe

Marca cada resultado: `PROBADO LOCALMENTE` · `ZIP DESCOMPRIMIDO` · `SHOPIFY PREVIEW` · `PUBLICADO`. Lista lo no probado: checkout, pagos, DSers, el widget real de Judge.me, los metafields reales y Shopify Admin.

## 6. DOCUMENT_SYNC (documentos)

1. Inspecciona el repo y ejecuta el snapshot.
2. Regenera `current-store-state.md`:
   `python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py --update-state`
   El script reescribe la cabecera, el marcador `snapshot-commit` y el bloque de datos (entre `<!-- snapshot:start -->` y `<!-- snapshot:end -->`). Las notas humanas (§2-§5) las revisas tú.
3. Corrige los documentos canónicos afectados: los documentos se adaptan al tema, nunca al revés.
4. Añade decisiones a `docs/garelon/GARELON_DECISION_LOG.md`.
5. `python3 tools/garelon_docs_check.py --update-manifest` y `python3 tools/garelon_docs_check.py`. Si cambias el comprobador, `python3 tools/test_garelon_docs_check.py`.
6. Para el proyecto de ChatGPT: `python3 tools/garelon_docs_check.py --zip <ruta>/GARELON-PROJECT-DOCS-LATEST.zip`. Sale con los 5 documentos en la raíz del ZIP; no se sube a GitHub.
7. Regresión del tema: aunque solo cambien los docs, ejecuta el validador y su autoprueba (y el render si está disponible) para demostrar que el tema no se tocó.
