# GARELON · PLANTILLA DEL PROMPT DE MIGRACIÓN (brief + imágenes + repo → prompt para Claude Code)

> **Versión:** 3.2 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `a1b03ef`
>
> Snapshot generado desde `a1b03ef`. Ante discrepancias futuras manda el repositorio actual: la fase F0 obliga a Claude Code a revalidarlo.

**Quién lo usa:** ChatGPT (o el propietario) rellena los `{{…}}` con el brief (`GARELON_PRODUCT_BRIEF_TEMPLATE.md`) y el análisis de imágenes, y entrega a Claude Code el bloque «PROMPT FINAL». No depende de ningún producto concreto.

**Reglas al rellenarlo:**
- Lo que falte: `NO DISPONIBLE`. No inventes datos para completar la plantilla.
- No escribas precios en el prompt como algo que el tema deba mostrar: los precios viven en Shopify.
- No fijes en el prompt rama, commit, conteos ni el orden actual de secciones: Claude Code los descubre en F0.
- Si el brief contradice el producto real o una confirmación reciente del propietario, mandan el producto y el propietario (Prompt Maestro §3).

## Variables

| Variable | Origen |
|---|---|
| `{{PRODUCT_NAME}}`, `{{PRODUCT_SHORT}}`, `{{CATEGORY}}`, `{{UNIT_SINGULAR}}`, `{{UNIT_PLURAL}}` | Brief §1, §13 |
| `{{BRAND_PHRASE}}` | Brief §1 (frase emocional sin promesas) |
| `{{SUPPLIER}}`, `{{SUPPLIER_INTEGRATION}}`, `{{FULFILLMENT}}` | Brief §2, §3, §6 |
| `{{CONFIRMED_FACTS}}` | Brief §7-§11, solo con fuente válida |
| `{{ALLOWED_CLAIMS}}`, `{{FORBIDDEN_CLAIMS}}` | Brief §14-§15 + filtro del Prompt Maestro §4 |
| `{{PACK_OPTION}}`, `{{PACK_VALUES}}`, `{{PACK_BADGE}}` | Brief §13 |
| `{{TRUST_CHIPS}}`, `{{FREE_SHIPPING}}` | Brief §18, solo si son ciertos en Shopify. `{{FREE_SHIPPING}}` = sí/no (ajuste global «Envío gratis» del tema) |
| `{{IMAGE_TABLE}}` | Análisis de imágenes (brief §19): archivo, decisión, clave, papel, orden |
| `{{GALLERY_ORDER_HOME}}`, `{{GALLERY_ORDER_PRODUCT}}` | Orden razonado (Prompt Maestro §9) |
| `{{COPY}}` | Textos por sección (§3 del prompt final) |
| `{{PREVIOUS_PRODUCT_TERMS}}` | Términos del producto anterior para la limpieza |
| `{{WORK_BRANCH}}` | Rama nueva propuesta por el propietario |
| `{{NOT_AVAILABLE}}` | Lista de datos `NO DISPONIBLE` |

---

## PROMPT FINAL (copiar, rellenar y entregar a Claude Code)

```text
Usa la skill garelon-ecommerce-operator (MODE: MIGRATE_PRODUCT).

Quiero adaptar la tienda GARELON al producto {{PRODUCT_NAME}}. No quiero una tienda nueva
ni otra marca: se conservan marca, logo, dominio, arquitectura (Dawn + capa GARELON), packs,
confianza, opiniones, carrito y checkout. Cambian producto, textos, imágenes e iconos.

Fuentes y prioridad: producto real > confirmaciones del propietario > repo actual > Shopify >
docs/garelon (Prompt Maestro, Master Template, checklist) > este prompt > proveedor.
Si algo no está verificado: NO DISPONIBLE. No preguntes lo que ya esté en el repo, los docs o este prompt.

DATOS DEL PRODUCTO
- Nombre: {{PRODUCT_NAME}} · corto: {{PRODUCT_SHORT}} · categoría: {{CATEGORY}}
- Unidad: {{UNIT_SINGULAR}} / {{UNIT_PLURAL}}
- Frase: {{BRAND_PHRASE}}
- Hechos confirmados (con fuente): {{CONFIRMED_FACTS}}
- Claims permitidos: {{ALLOWED_CLAIMS}}
- Claims prohibidos: {{FORBIDDEN_CLAIMS}}
- Proveedor: {{SUPPLIER}} · integración: {{SUPPLIER_INTEGRATION}} · fulfillment: {{FULFILLMENT}}
- Packs: opción «{{PACK_OPTION}}» = {{PACK_VALUES}} (variantes reales, cantidad 1; precios en Shopify)
- Distintivo editorial: {{PACK_BADGE}} (nunca «Más popular» sin datos de ventas)
- Confianza: {{TRUST_CHIPS}} · envío gratis: {{FREE_SHIPPING}} (packs, ficha, cajón y /cart dicen lo mismo)
- NO DISPONIBLE: {{NOT_AVAILABLE}}

IMÁGENES (análisis ya hecho; no regeneres ni edites el producto, solo redimensiona,
recorta sin ampliar y convierte a WebP)
{{IMAGE_TABLE}}
Orden de galería · home: {{GALLERY_ORDER_HOME}} · ficha: {{GALLERY_ORDER_PRODUCT}}
(Si al inspeccionar ves un motivo de peso para cambiar el orden, propónlo razonado; no descartes
imágenes que el propietario haya verificado.)

COPY
{{COPY}}

FASES (commit por fase o por grupo coherente; no sigas sobre un fallo)

F0 · Inspección
  - Rama: crea {{WORK_BRANCH}} desde el HEAD que indique el propietario (o el HEAD actual de la
    rama de trabajo vigente). Anota rama, HEAD y git status. No sobrescribas trabajo sin commit.
  - Ejecuta scripts/garelon_store_snapshot.py de la skill y lee current-store-state.md.
  - Línea base de pruebas ANTES de tocar nada: cd tests/render-harness && npm ci; después, desde la
    raíz, node tests/render-harness/validate.js (validador + autoprueba + Theme Check + Liquid
    estricto + batería de render). Anota los totales reales.
  - Si el repo contradice este prompt o los docs, manda el repo: anótalo en el informe.

F1 · Verdad del producto
  - Tabla: dato · valor · fuente · ¿se publica? Lo no verificado no se publica (tampoco en alt ni SEO).

F2 · Imágenes
  - Revisa TODAS las imágenes del brief. Confirma o corrige la decisión de cada una con motivo.
  - Genera assets/producto-<clave>-<ancho>.webp sin alterar el producto. Elige claves descriptivas
    (principal, completa, detalle, infografia, contexto…).

F3 · Copy
  - Textos de portada, compra, confianza, packs, tranquilidad, opiniones, significado, detalles,
    «Para regalar» u ocasiones (si aplica), FAQ, cierre, ficha y textos alternativos.
  - Español de España, «tú», sin claims prohibidos ni urgencia falsa.

F4 · Assets y puntos acoplados al producto (Master Template §7)
  - snippets/garelon-image.liquid (claves y anchos), snippets/garelon-gallery.liquid
    + locales garelon.gallery.* (todos los idiomas), opciones image_key, iconos de producto,
    locales garelon.packs.editor_missing. Borra los assets producto-* del producto anterior.

F5 · Home (templates/index.json)
  - Mantén la estructura salvo que el producto exija otra; index.json siempre instalable (R17).
    Único bloque de app permitido: el Review Widget oficial de Judge.me en «GARELON Opiniones» (D30).
  - Portada sin precio y con un CTA a /#comprar; packs con el bloque garelon_offer.

F6 · Ficha (templates/product.json)
  - Coherente con la home, con galería en {{GALLERY_ORDER_PRODUCT}} y compra fija.

F7 · Packs, confianza, envío y opiniones
  - option_name, unit_singular, sub_1..3 y distintivo («Recomendado» o editorial; nunca «Más popular» sin datos).
  - Envío gratis: ajuste global garelon_free_shipping (Configuración del tema › Carrito) = {{FREE_SHIPPING}}.
    Si es «no», desactívalo y cambia la garantía de envío gratis (garelon_check da error si no).
  - Garantías solo si son ciertas. «Compra con tranquilidad» solo si el producto admite desistimiento.
  - Título y nota de opiniones adaptados; sin opiniones inventadas.
  - Review Widget de Judge.me (D30): se conserva versionado en «GARELON Opiniones» (home y ficha) con
    review_data = real_data. Revisa la asociación de producto del widget de la HOME: si el JSON real del
    bloque con el producto nuevo está disponible, versiónalo; si no, no inventes handle ni ID y deja en el
    informe la tarea de elegir el producto en el bloque. Si Judge.me deja de ser la app, retira el bloque
    y el App Embed.

F8 · Limpieza
  - Busca restos del producto anterior ({{PREVIOUS_PRODUCT_TERMS}}) en las 7 carpetas del tema:
    0 resultados en el storefront. La documentación histórica no se toca.

F9 · Pruebas (repo y ZIP descomprimido)
  - node tests/render-harness/validate.js en el repo y --theme <carpeta> --zip en el ZIP descomprimido:
    validador + autoprueba, Theme Check (0 errores y 0 avisos GARELON), Liquid estricto, render.
  - Adapta las pruebas específicas del producto (tests/render-harness/suite, src/server.js) y añade
    una fase nueva para esta migración. Nunca borres pruebas para conseguir verde.
  - Render: home 200, ficha 200, 404 limpia, /cart, contacto; sin producto la home sigue en 200.
  - Packs: cambiar de pack cambia variante y precio; se añade con cantidad 1; agotado; sin ahorro
    real no hay textos de ahorro; compare_at solo si existe.
  - Carrito y cajón (nota de envío igual que bajo los packs); un H1 por página; un JSON-LD de producto; enlaces internos 200.
  - Responsive 320/360/375/390/430/768/1024/1440 sin scroll horizontal; capturas en móvil y escritorio.
  - Búsqueda de claims prohibidos: 0.

F10 · ZIP, documentación, git e informe
  - tools/build_zip.py → ZIP solo con las 7 carpetas; descomprímelo en una carpeta nueva y valídalo.
  - DOCUMENT_SYNC: current-store-state.md, GARELON_DECISION_LOG.md y los docs que cambien;
    tools/garelon_docs_check.py --update-manifest y tools/garelon_docs_check.py.
  - Commit(s) claros, push a {{WORK_BRANCH}}, SIN merge. No subas el ZIP a GitHub.
  - Informe: rama y HEAD, qué cambió por fase, decisiones de imágenes con motivo, resultados de
    pruebas (PROBADO LOCALMENTE / ZIP DESCOMPRIMIDO; nada de Shopify si no se probó), SHA-256 del ZIP,
    y la lista de tareas del propietario en Shopify Admin (producto, variantes de packs con precio,
    compare_at solo real, multimedia revisada, SEO, redirección del handle anterior, envío, políticas,
    Judge.me: App Embed activo y producto del Review Widget de la home, mapping con {{SUPPLIER_INTEGRATION}}
    y un pedido de prueba por pack).

NO HACER: publicar el tema, hacer merge, tocar Shopify Admin, el checkout o el fulfillment,
hardcodear precios, stock, SKU o IDs, inventar opiniones, urgencia o descuentos, alterar
imágenes del producto, rediseñar el logo, reconstruir la arquitectura.
```

---

## Después de la ejecución

1. El propietario revisa el informe y las capturas.
2. Sube el ZIP a Shopify **sin publicar**, o sincroniza la rama si el tema está conectado a GitHub.
3. Hace las tareas 🆂 y 🅿 de `GARELON_PRODUCT_MIGRATION_CHECKLIST.md`.
4. Publica solo cuando la vista previa y los pedidos de prueba son correctos.
