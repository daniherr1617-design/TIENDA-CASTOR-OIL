# GARELON · batería de render local

> **SOLO TEST.** Simula Shopify **localmente** para validar el tema GARELON (Dawn 16 + capa GARELON) antes de subirlo. No es Shopify y no sustituye a una vista previa real.

## 1. Requisitos

- **Node.js ≥ 20** (probado con 22) y npm.
- **Chromium** para Playwright (se usa `playwright-core`, sin descargas automáticas).
- **Python 3** para `tools/garelon_check.py` (sin dependencias).
- **Ruby ≥ 3** con la gema `liquid` 5.14.0, solo para el parseo Liquid estricto.
- **git con historial**: algunas pruebas comparan plantillas con commits anteriores (`git show <commit>:…`). Un clon con `--depth 1` no basta; el clon por defecto, o `--depth 50`, sí.

## 2. Instalación

Desde la raíz del repositorio:

```bash
cd tests/render-harness
npm ci
```

`npm ci` instala las versiones exactas de `package-lock.json`: `liquidjs`, `playwright-core`, `@shopify/theme-check-node`, `@fontsource/inter` y `@fontsource/lora` (las fuentes del tema, servidas en local).

## 3. Chromium

- **Claude Code en la web:** Chromium ya está en `/opt/pw-browsers`. No hay que instalar nada; la batería lo encuentra sola.
- **Otro equipo:** `npm run install-chromium` (equivale a `npx playwright-core install chromium`).
- **Chromium propio:** `CHROMIUM_PATH=/ruta/a/chrome npm test`.

Para el Liquid estricto: `gem install liquid -v 5.14.0` (o, sin permisos de sistema, `GEM_HOME=~/.gem gem install liquid -v 5.14.0` y ejecutar con `GEM_PATH=~/.gem`).

## 4. Comandos

| Comando (en `tests/render-harness`) | Qué hace |
|---|---|
| `npm test` | Batería de render contra el tema de la raíz del repo, todas las fases |
| `node run.js --theme <carpeta>` | Contra otro tema, p. ej. el ZIP descomprimido |
| `node run.js --phase F` | Solo las fases A…F |
| `npm run server` | Solo el servidor, en `http://localhost:8810`, para mirar el tema en un navegador |
| `npm run theme-check` | Theme Check oficial, con cada aviso marcado `BASELINE DAWN` o `GARELON` |
| `npm run liquid-strict` | Parseo con la gema `liquid` de Shopify en modo estricto (`BAD 0` = bien) |
| `npm run validate` | Todo en orden: `garelon_check` → `test_garelon_check` → Theme Check → Liquid estricto → render |
| `node validate.js --theme <carpeta> --zip` | Lo mismo sobre un ZIP descomprimido (exige solo las 7 carpetas en la raíz) |

## 5. Qué simula

`src/server.js` renderiza el **Liquid real del tema** con `liquidjs` y sirve el **JavaScript real de Dawn** al navegador. Los datos son **simulados**:

- **Producto:** «Pulsera Rosario Virgen María» con escenarios de variantes cambiables por `/__state`: sin variantes, 2 o 3 packs, con y sin ahorro, con `compare_at`, otra opción, dos opciones, agotados.
- **Precios:** inventados para la prueba, en céntimos. Nunca son los reales de la tienda.
- **Ajustes forzables:** el ajuste global «Envío gratis» (`/__state?freeship=0|1`; vacío = el valor del tema) y los impuestos del carrito (`taxes=included|excluded|duties|both`).
- **Tienda:** carrito (`/cart/add`, `/cart/change`, Section Rendering API), páginas, políticas, menús de una tienda nueva y bloque de app de opiniones (fixture).
- **Routing como Shopify:** `/`, `/products/<handle>`, `/pages/<handle>`, `/policies/<x>`, `/cart`; el resto da la plantilla 404 con HTTP 404.

`suite/tests.js` (fase A) y `suite/tests-B.js` … `tests-K.js` abren las páginas con Chromium y comprueban:

- routing y 404;
- cabecera, navegación, logo y pie;
- portada y CTA;
- packs como variantes reales, precio, ahorro y `compare_at`, con distintivo «Recomendado»;
- envío gratis coherente en los packs, la ficha, el cajón del carrito y `/cart`, también con el ajuste desactivado y con otras combinaciones de impuestos y aranceles;
- añadir al carrito con la cantidad 1;
- ficha, compra fija, FAQ, opiniones y claims prohibidos;
- imágenes y orden de galería;
- schemas, locales (31 idiomas) y alcance de los cambios de cada ronda;
- accesibilidad básica: un H1, anclas, `alt`, contraste y foco;
- sin errores JS;
- responsive a 320, 360, 375, 390, 430, 768, 1024 y 1440 px (sin scroll horizontal, rejillas y textos en su sitio).

Cada fase (A, B, C…) es una ronda de trabajo; `PHASE=X` ejecuta esa fase y todas las anteriores.

## 6. Qué NO prueba

Nada de esto demuestra que funcione en la tienda real:

- el **checkout** de Shopify, los **pagos**, los impuestos ni las **tarifas de envío reales** (se configuran en Shopify Admin);
- **DSers**, AliExpress ni el fulfillment;
- **Judge.me** real: solo un fixture que imita un bloque de app;
- **Shopify Admin**, el editor de temas, los metafields reales, los mercados ni las traducciones de Shopify;
- el render exacto de Shopify: `liquidjs` no es el motor de Shopify y los filtros están simulados.

Por eso, en los informes se distingue `PROBADO LOCALMENTE` / `ZIP DESCOMPRIMIDO` / `SHOPIFY PREVIEW` / `PUBLICADO`.

## 7. Cómo interpretar los resultados

- Cada línea es `PASS` o `FAIL`, nombre de la prueba y datos medidos (JSON recortado). Al final, `TOTAL n/m`; el código de salida es `0` solo si no hay ningún `FAIL`.
- Sobre el **ZIP descomprimido** salen menos pruebas: las que necesitan git, los PNG fuente o los `.md` del repo se saltan solas (no hay `.git`).
- Una línea `EXCEPCIÓN` es un fallo de la propia batería, por ejemplo un servidor caído o un commit inexistente en un clon superficial.
- **Theme Check:** `BASELINE DAWN` = el mismo aviso existe en Dawn 16.0.0 oficial (commit base); `GARELON` = aviso nuevo de la capa GARELON. El objetivo es 0 errores y 0 avisos `GARELON`.
- **Un FAIL nunca se arregla quitando la prueba.** Se corrige el tema o, si cambió una decisión del propietario, se actualiza la prueba explicando el motivo en el commit.

## 8. Mantenimiento

- **Pruebas de una ronda nueva:** se añaden en `suite/tests-<letra>.js` y la letra se añade a `PHASES` en `suite/tests.js`.
- **Alcance de cada ronda:** las pruebas que comparan con git («archivos tocados», «plantillas intactas salvo…») se fijan al rango de commits de esa ronda (p. ej. J21: `57ba415..955bcc3`; K23-K26 comparan con `c265802`). Así no fallan cuando una ronda posterior cambia otros archivos, y la ronda nueva tiene su propia prueba de alcance.
- **Cambio de producto:** muchas pruebas son específicas de la Pulsera Rosario (textos, claves de imagen, handle). Hay que adaptarlas en la migración (`docs/garelon/GARELON_MIGRATION_PROMPT_TEMPLATE.md`).
- **Lo que no se versiona:** `node_modules/`, capturas, logs, trazas, ZIPs y resultados (`.gitignore`). Las capturas de comprobación visual se guardan fuera del repo.

## 9. Estructura

```
tests/render-harness/
├── README.md
├── package.json · package-lock.json · .gitignore
├── run.js              lanzador: servidor en un puerto libre + batería
├── validate.js         validación completa (5 pasos)
├── src/server.js       Shopify simulado (liquidjs)
├── suite/tests.js      fase A + utilidades; tests-B.js … tests-K.js
├── fixtures/           stub de standard-events de Shopify, bloque de app de prueba, textos esperados de la FAQ
└── checks/             theme-check.js (Theme Check con clasificación Dawn/GARELON), liquid-strict.rb
```

## 10. Origen

Son las fuentes reales con las que se validaron las rondas hasta `955bcc3` (386/386 en el repo, 378/378 en el ZIP descomprimido), traídas desde la carpeta temporal de la sesión. La fase K (distintivo y envío del carrito) se añadió después, ya en el repositorio. Cambios al versionarlas:

- rutas absolutas → relativas;
- fuentes tipográficas desde `@fontsource` de `node_modules`;
- Chromium detectado sin ruta fija;
- `faq.json` movido a `fixtures/`;
- J21 fijado al rango de su ronda;
- J18 actualizada en la ronda K, cuando «Envío gratis» pasó del bloque de packs a un ajuste global (comprueba lo mismo en su sitio nuevo);
- lanzadores de shell sustituidos por `run.js` / `validate.js`.

La lógica de las pruebas es la misma.
