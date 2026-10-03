# GARELON · Pulido final (v1.2)

> **HISTÓRICO · no describe el estado actual.** Se conserva como registro y lección aprendida. El sistema vigente está en `docs/garelon/` (Prompt Maestro, Master Template, brief, prompt de migración, checklist, registro de decisiones) y el estado real en `.claude/skills/garelon-ecommerce-operator/references/current-store-state.md`. Ante cualquier contradicción manda el repositorio actual.

Rama `claude/rosary-clean-rebuild`. Cambios quirúrgicos sobre la versión con «Elige tu oferta»; no cambia la arquitectura, ni la home (`templates/index.json`, mismas 9 secciones), ni el selector, los precios, el carrito o el checkout.

> **Estado de las pruebas:** probado localmente y en el ZIP descomprimido, con datos simulados. **No probado en Shopify.**

## 1. Logo

| | |
|---|---|
| Archivo fuente | `LOGO DEFINITIVO.png` (subido a `main` en el commit `0f191c6`; copiado a esta rama sin cambios). 1774 × 887, RGBA, fondo transparente |
| Preparación | Solo se recorta el margen transparente sobrante (queda 1262 × 782; fuera solo había píxeles con alfa ≤ 2, invisibles) y se reduce a 160, 320 y 480 px de ancho, WebP sin pérdida con alfa. Sin cambios de diseño, color ni proporción |
| Assets | `assets/garelon-logo-negro-160.webp`, `-320.webp`, `-480.webp` |
| Uso | `snippets/garelon-logo.liquid`: cabecera (`header`) y pie (`stacked`) cuando no hay logo subido en Configuración del tema |
| Retirado | `garelon-logo-240/480.webp` y `garelon-wordmark-240/480.webp` (letras doradas). Los originales `Logo y marca.png` y `referencias/` quedan en el repositorio como histórico; no entran en el ZIP |
| Sin cambios | Isotipo dorado suelto: favicon, icono de Apple, `garelon-isotipo-*.webp` |

Tamaño en cabecera: 100 px de ancho en tableta y escritorio, 86 px en móvil y 80 px por debajo de 360 px. Solo se fija el ancho y la altura sale de la proporción.

| Altura de la cabecera | Antes | Ahora |
|---|---|---|
| Móvil | 57 px | 70 px |
| Escritorio | 69 px | 91 px |

En el pie, 120 px de ancho.

> Si en Shopify hay un logo subido en Personalizar › Configuración del tema › Logotipo, o una imagen de marca en el pie, Shopify muestra esa imagen y no la del tema. Quítala o súbela de nuevo con el logo definitivo.

## 2. Garantías (bloque «GARELON Confianza»)

| # | Texto | Icono |
|---|---|---|
| 1 | Envío gratis + seguimiento | camión (`envio`) |
| 2 | Pago seguro | candado (`candado`, nuevo) |
| 3 | 14 días para cambiar de opinión | flecha de devolución (`devolucion`) |
| 4 | Envíos internacionales | globo (`globo`) |

Se aplica en la home y en la ficha, como valores por defecto del bloque. Los cuatro textos siguen siendo editables.

## 3. «Para regalar»

`garelon-details` con `layout: chips`. Ahora es una cuadrícula de tarjetas informativas, no seleccionables, todas del mismo tamaño:
- **Móvil:** 2 × 3.
- **Tableta y escritorio:** 3 × 2, con un máximo de 760 px y centrada.

Una fila mide lo que la tarjeta más alta, así un texto en 2 líneas no descuadra ninguna. Por debajo de 360 px bajan un poco el hueco, el relleno y la letra (14 px). El `layout: list` («Detalles de la pulsera») no cambia.

## 4. Opiniones

- **Título:** «Opiniones sobre esta pulsera».
- **Nota de origen (editable):** «Incluye opiniones de compradores del mismo modelo, importadas mediante Judge.me.»
  - Solo se muestra si hay opiniones visibles (resumen o widget).
  - Sin opiniones, o con la sección en espera, no ocupa espacio.
  - Si no importas opiniones de AliExpress, cambia o borra la nota.

## 5. Archivos

- **Nuevos:**
  - `assets/garelon-logo-negro-{160,320,480}.webp`
  - `LOGO DEFINITIVO.png` (fuente, fuera del ZIP)
  - `GARELON-PULIDO-FINAL.md`
- **Borrados:** `assets/garelon-logo-{240,480}.webp`, `assets/garelon-wordmark-{240,480}.webp`.
- **Modificados:**
  - `snippets/garelon-logo.liquid`
  - `snippets/garelon-icon.liquid` (candado)
  - `assets/garelon.css` (logo, cuadrícula de regalo)
  - `sections/featured-product.liquid`, `sections/main-product.liquid` (defaults de las garantías e icono de candado)
  - `sections/garelon-reviews.liquid` (nota solo con opiniones visibles)
  - `templates/index.json`, `templates/product.json`
  - docs
