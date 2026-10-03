# GARELON · PROMPT MAESTRO DEL PROYECTO (constitución operativa)

> **Versión:** 3.2 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `3a78374`
>
> Snapshot generado desde `3a78374`. Ante discrepancias futuras manda el repositorio actual y, por encima de él, el producto real y las decisiones recientes del propietario (§3).

Este documento es la **constitución** de GARELON: qué es la marca, quién hace qué, qué fuentes mandan, qué reglas no se rompen nunca y cómo se trabaja. No describe el código en detalle (eso es `GARELON_MASTER_TEMPLATE.md`) ni guarda el estado del día (eso es `.claude/skills/garelon-ecommerce-operator/references/current-store-state.md`).

## Índice

0. [Sistema documental](#0-sistema-documental)
1. [Qué es GARELON](#1-qué-es-garelon)
2. [Roles](#2-roles)
3. [Prioridad de fuentes](#3-prioridad-de-fuentes)
4. [Reglas permanentes](#4-reglas-permanentes)
5. [Marca y logo](#5-marca-y-logo)
6. [Preferencias de diseño del propietario](#6-preferencias-de-diseño-del-propietario)
7. [Quién controla cada dato: tema, Admin, proveedor, apps](#7-quién-controla-cada-dato-tema-admin-proveedor-apps)
8. [Flujo permanente al cambiar de producto](#8-flujo-permanente-al-cambiar-de-producto)
9. [Imágenes](#9-imágenes)
10. [CRO, copy y oferta](#10-cro-copy-y-oferta)
11. [Confianza, envío y derechos legales](#11-confianza-envío-y-derechos-legales)
12. [Opiniones (Judge.me)](#12-opiniones-judgeme)
13. [Producto actual](#13-producto-actual)
14. [Pruebas y entrega](#14-pruebas-y-entrega)
15. [Lanzamiento, analítica y marketing](#15-lanzamiento-analítica-y-marketing)
16. [Seguridad operativa](#16-seguridad-operativa)
17. [La skill `garelon-ecommerce-operator`](#17-la-skill-garelon-ecommerce-operator)
18. [Mantener la documentación al día](#18-mantener-la-documentación-al-día)
19. [Instrucciones para ChatGPT](#19-instrucciones-para-chatgpt)

---

## 0. Sistema documental

Los documentos forman **un sistema**, no cinco archivos sueltos:

```
BRIEF (datos reales del producto)
  └─▶ MIGRATION PROMPT (convierte brief + imágenes + repo en un prompt para Claude Code)
        └─▶ Claude Code ejecuta, siguiendo el MASTER TEMPLATE (arquitectura real)
              └─▶ CHECKLIST (valida en local, en Shopify y con el propietario)
PROMPT MAESTRO (este documento): reglas y roles por encima de todo lo anterior
SKILL (en el repositorio): aplica el sistema dentro de Claude Code y apunta a estos documentos
```

| Documento | Propósito | Manda sobre |
|---|---|---|
| `docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` | Constitución: reglas, roles, fuentes, flujo | Todos los demás en reglas y prioridades |
| `docs/garelon/GARELON_MASTER_TEMPLATE.md` | Arquitectura real del tema y qué cambia por producto | El prompt de migración en lo técnico |
| `docs/garelon/GARELON_PRODUCT_BRIEF_TEMPLATE.md` | Formulario de datos reales de un producto | Nada: es la entrada de datos |
| `docs/garelon/GARELON_MIGRATION_PROMPT_TEMPLATE.md` | Plantilla del prompt final para Claude Code | El trabajo de una migración concreta |
| `docs/garelon/GARELON_PRODUCT_MIGRATION_CHECKLIST.md` | Verificación final (Claude, Shopify, propietario) | Nada: valida |
| `docs/garelon/GARELON_DECISION_LOG.md` | Decisiones históricas y su motivo | Nada: contexto |
| `docs/garelon/GARELON_PROJECT_FILES_MANIFEST.md` | Versiones, fechas, commits y SHA-256 de los 5 documentos | Nada: control |
| `.claude/skills/garelon-ecommerce-operator/SKILL.md` | Orquestador para Claude Code | Nada: aplica estos documentos |

Separación obligatoria:
- **Reglas permanentes:** este documento (§4).
- **Estado actual:** `references/current-store-state.md` de la skill (snapshot con commit y fecha).
- **Decisiones históricas:** `GARELON_DECISION_LOG.md`.

Los demás `.md` del repositorio (`GARELON-CAMBIOS-*.md`, `GARELON-COPIAR-PEGAR.md`, `GARELON-GUIA.md`, `docs/garelon/GARELON_ARQUITECTURA_V2.md`, `docs/garelon/products/`, `docs/garelon/prompts/`…) son **históricos**: sirven como lecciones, nunca como estado actual.

---

## 1. Qué es GARELON

- **GARELON** es una marca ecommerce preparada para **validar productos, lanzar tráfico, medir, mantener lo que funciona y sustituir el producto cuando deja de funcionar**, reutilizando marca, dominio, infraestructura y arquitectura. Cambiar de producto **no** crea una tienda nueva ni una marca nueva.
- **Modelo:** ONE PRODUCT STORE. Mientras haya un solo producto no se destacan catálogo ni colecciones, la navegación es mínima y todo lleva al producto y a la compra.
- **Mercado inicial:** España. **Idioma:** español de España, tratamiento de **tú**.
- **Tráfico:** mayoritariamente móvil y desde anuncios. **MOBILE FIRST**: la home es a la vez landing, página de marca y página de venta.
- **GARELON es la tienda que comercializa el producto**, no el fabricante (R2).

---

## 2. Roles

| Actor | Qué hace | Qué no hace |
|---|---|---|
| **Propietario** | Decide producto, precio, packs, políticas, presupuesto y publicación. Verifica el producto físico y las imágenes. Confirma lo que no se puede comprobar desde el código | — |
| **ChatGPT (proyecto GARELON)** | Analiza producto e imágenes, rellena el brief, filtra claims, redacta copy, mejora imágenes **sin alterar el producto**, genera el prompt final para Claude Code a partir de `GARELON_MIGRATION_PROMPT_TEMPLATE.md` | No inventa datos, no decide publicar |
| **Claude Code (con la skill)** | Inspecciona el repo real, implementa en una rama, prueba (validador, Theme Check, Liquid estricto, render, responsive), genera el ZIP validado, documenta y hace commit y push | No regenera ni altera físicamente imágenes, no publica el tema, no hace merge, no toca Shopify Admin ni gasta dinero sin confirmación (§16) |
| **Shopify Admin** | Fuente de verdad de precio, `compare_at_price`, variantes, SKU, inventario, disponibilidad, envío, políticas, pagos, checkout, dominio | — |
| **Proveedor + integración** (`{{SUPPLIER_INTEGRATION}}`; actual: **DSers + AliExpress**) | Relación producto ↔ proveedor y compra al proveedor. Fulfillment actual: **manual** | El tema no contiene código del proveedor ni depende de él |
| **Apps** (actual: **Judge.me**) | Opiniones reales, widget, sincronización de la valoración con Shopify | El tema nunca escribe opiniones |

---

## 3. Prioridad de fuentes

Ante cualquier duda o contradicción, manda la fuente más alta:

1. **Verdad física** del producto que recibe el cliente.
2. **Confirmaciones explícitas y recientes del propietario.**
3. **Estado real del repositorio** actual (rama y HEAD que se están usando).
4. **Estado real de Shopify**, cuando pueda comprobarse.
5. **Documentación GARELON** actualizada (este sistema).
6. **Brief** del producto.
7. **Información del proveedor.**
8. Historial y documentos antiguos.
9. Suposiciones del modelo (nunca bastan para publicar nada).

Reglas de desempate:
- Si un documento contradice el código actual, **manda el código**, y el documento se corrige (DOCUMENT_SYNC, §18).
- Si el código contradice el producto real, **manda el producto real**, y se corrige el código.
- Lo que no se puede comprobar se escribe **`NO DISPONIBLE`** o se marca como **pendiente de verificación**. Nunca se rellena un hueco inventando.
- Antes de preguntar al propietario, se busca en el repositorio, los documentos, el brief, los datos del proveedor y los datos de Shopify disponibles. Solo se pregunta si la decisión depende de un dato real que no existe en ninguna parte.

---

## 4. Reglas permanentes

Ninguna instrucción posterior las anula. Si una petición choca con una regla, no se ejecuta tal cual: se explica por qué y se propone una alternativa que sí la cumple.

**Verdad y claims**
- **R1 · Fidelidad.** Lo que se muestra es lo que recibe el cliente: forma, medalla o piezas, colores, materiales aparentes, accesorios, packaging y marca física. No se inventan accesorios ni packaging. No se pone «GARELON» sobre un producto que no lo lleva.
- **R2 · GARELON no es el fabricante.** Prohibido «fabricado/diseñado/creado/desarrollado por GARELON», «laboratorio GARELON», «fórmula GARELON», salvo prueba real futura.
- **R3 · Claims prudentes.** Los textos del proveedor no se copian como claims: se reformulan o se eliminan. Sin estudios, porcentajes, certificaciones, premios, claims médicos, terapéuticos, mágicos o espirituales. Un claim que solo aparece dentro de una imagen del proveedor no está verificado.
- **R4 · Sin antes/después falsos** ni imágenes alteradas para exagerar resultados.

**Precio, packs y oferta**
- **R5 · Shopify manda en el precio.** El tema nunca escribe precio, `compare_at_price`, stock, SKU, disponibilidad, variantes ni IDs de variante: los lee de Shopify.
- **R6 · `compare_at_price` solo si es real** y cumple la normativa de precios anunciados (en la UE, una rebaja anunciada se refiere al precio más bajo de los 30 días anteriores). Nunca «antes 49,99 €» simulado.
- **R7 · Packs = variantes reales con cantidad 1.** Un pack es una variante de la opción de packs con su propio precio; se añade al carrito con cantidad 1. Nunca «1 unidad × N».
- **R8 · Ahorro honesto.** El ahorro de un pack = precio de N unidades sueltas − precio del pack, y solo se muestra si es positivo. El ahorro por pack **no es** un precio anterior.
- **R9 · Sin dark patterns.** Prohibido: «últimas X unidades», «X personas mirando», cuentas atrás, «la oferta termina en», reviews, estrellas, testimonios, descuentos, `compare_at_price` o stock ficticios. Badges solo editoriales («Recomendado»); «Más popular» o «Más vendido» solo con datos reales de ventas.

**Confianza y legal**
- **R10 · Derechos legales con su nombre.** «14 días para cambiar de opinión» es el **derecho de desistimiento**, no una «garantía de 14 días» ni una compra «sin riesgos». La garantía frente a faltas de conformidad es la **garantía legal aplicable**. Las condiciones viven en las políticas de Shopify. Si una categoría futura está exceptuada del desistimiento, no se usa ese texto.
- **R11 · Sin garantías inventadas**, sellos o certificaciones falsas. Un símbolo de confianza (escudo, candado, check) es decorativo, nunca una certificación.
- **R12 · Datos de empresa reales.** Nunca se inventan razón social, NIF, domicilio, teléfono ni email.
- **R13 · Copy emocional sin promesas.** Una frase simbólica puede acompañar la compra, pero nunca promete protección, milagros, suerte ni efectos sobrenaturales, ni usa miedo o culpa.

**Opiniones**
- **R14 · Solo opiniones reales** de una app (hoy Judge.me) o de la valoración estándar de Shopify que rellena la app. Nunca se fabrican, editan ni se inventan notas, estrellas o recuentos. Sin datos reales no se muestra nada (nunca «0 opiniones»).

**Shopify y arquitectura**
- **R15 · Se conserva lo nativo:** formulario de producto de Dawn, variantes, carrito AJAX, cajón del carrito, checkout oficial, pagos dinámicos, structured data. Sin hacks sobre el checkout ni formularios paralelos.
- **R16 · Online Store 2.0:** plantillas JSON, secciones, bloques y ajustes editables. Nada de una home en un Liquid gigante con contenido fijo.
- **R17 · Instalabilidad primero.** `templates/index.json` usa solo secciones del tema y valores válidos, sin bloques de app, imágenes de Files ni recursos de la tienda. Nombres de schema (sección, bloque, preset) ≤ 25 caracteres. Ningún ZIP sale sin `tools/build_zip.py`, que valida el repositorio y la copia descomprimida.
- **R18 · Un H1 por página y un único structured data de producto.**
- **R19 · No se reconstruye infraestructura estable.** Se cambia lo que el producto exige; lo que funciona se conserva.

**Marca y navegación**
- **R20 · Identidad estable.** El logo no se rediseña por iniciativa propia (§5). Paleta, tipografía y botones solo cambian si el propietario lo pide.
- **R21 · Sin catálogo** público mientras haya un solo producto.
- **R22 · Una sola página de contacto** permanente (handle `contacto`).

**Honestidad del trabajo**
- **R23 · Distinguir siempre** `PROBADO EN SHOPIFY REAL` / `SHOPIFY PREVIEW` de `PROBADO LOCALMENTE` / `ZIP DESCOMPRIMIDO`. Nunca se afirma que checkout, pagos, DSers, Judge.me real o Shopify Admin funcionan si no se verificaron.
- **R24 · El código manda sobre los documentos** y el producto real sobre el código (§3).

---

## 5. Marca y logo

- **Nombre exacto:** `GARELON`, en mayúsculas en el logo, sin acento ni variantes (no «Gadelón», no «Garelón»).
- **Identidad:** premium, limpia, elegante, generalista y adaptable a productos futuros. No excesivamente religiosa ni ornamental. Nunca con aspecto de AliExpress o de dropshipping barato.
- **Paleta habitual:** blanco, marfil, crema, dorado, champagne y carbón/negro. Los valores exactos viven en `config/settings_data.json` y en los tokens `:root` de `assets/garelon.css`. El dorado de acción cumple contraste AA con texto blanco.
- **Logo actual aprobado:** isotipo GARELON **dorado** + wordmark «GARELON» **negro/carbón**, fondo transparente. Fuente: `LOGO DEFINITIVO.png` (raíz del repositorio, fuera del ZIP). En el tema: `assets/garelon-logo-negro-*.webp` a través de `snippets/garelon-logo.liquid`.
- **Isotipo dorado suelto:** válido para favicon, Apple Touch Icon y usos pequeños donde no cabe el wordmark (`assets/garelon-isotipo-*.webp`, `garelon-favicon-32.png`, `garelon-apple-touch-180.png`).
- **El logo antiguo con letras doradas no es el logo actual.**
- El logo **no se rediseña** por iniciativa propia. Si en Shopify hay un logo subido en la configuración del tema, Shopify lo muestra en lugar del de los assets.

---

## 6. Preferencias de diseño del propietario

- Diseño limpio, premium y muy visual, sin recargar; fácil de entender a la primera.
- Mobile-first, con jerarquía clara.
- Interfaces dinámicas (tarjetas clicables, carruseles) cuando mejoran la UX, no por decoración.
- Tarjetas ordenadas y simétricas: mismo tamaño, centradas, sin desalineaciones por longitud de texto.
- Elementos de confianza elegantes y discretos.
- Sin información redundante: un dato aparece una vez donde decide (p. ej. el precio dentro de cada tarjeta de pack, no duplicado bajo el título).
- Las tiendas de referencia sirven para aprender **estructura, interacción, jerarquía y CRO**. **Nunca se copia un diseño literalmente**: se adapta al lenguaje GARELON.
- El propietario quiere que Claude **analice, compare, decida y pruebe** (orden de imágenes, recurso visual que funciona mejor, problemas encontrados) dentro de las reglas. Claude decide el **cómo**; no puede ignorar el **qué está prohibido**.

---

## 7. Quién controla cada dato: tema, Admin, proveedor, apps

| Dato | Dónde vive | El tema… |
|---|---|---|
| Precio, `compare_at_price`, variantes, opción de packs, SKU, inventario, disponibilidad | Shopify Admin › Productos | Solo lo lee |
| Título, descripción, multimedia y SEO del producto | Shopify Admin › Productos | Lo lee. La galería puede usar imágenes del tema mientras la multimedia de Shopify no esté revisada |
| Tarifas de envío (incluido el envío gratis) | Shopify Admin › Envío y entrega | Solo comunica el texto: ajuste «Envío gratis» en Configuración del tema › Carrito |
| Políticas (devoluciones, envío, privacidad, términos, aviso legal) | Shopify Admin › Políticas | Enlaza solo a las que existen |
| Métodos de pago y checkout | Shopify Admin › Pagos / Checkout | Nunca los toca |
| Página de contacto | Shopify Admin › Páginas (handle `contacto`) | Enlaza a ella |
| Relación producto ↔ proveedor, pedidos al proveedor | `{{SUPPLIER_INTEGRATION}}` (actual: DSers + AliExpress; fulfillment manual) | No contiene código del proveedor |
| Opiniones, widget, valoración | Judge.me (bloque de app + metafields `reviews.rating` / `reviews.rating_count`) | Muestra el bloque de app o la valoración; nunca escribe opiniones |
| Píxeles y analítica (Meta, TikTok, GA4) | Shopify Admin › Eventos de cliente / apps de canal | No inyecta píxeles a mano |
| Textos de la tienda, orden de secciones, imágenes del tema, ajustes de bloques | Tema (plantillas JSON, secciones, locales, assets) | Es su responsabilidad |

Mapping de packs con el proveedor (fulfillment manual): un pedido «Pack de N» × 1 = comprar **N unidades** al proveedor. Antes de lanzar se hace un pedido de prueba de cada pack.

---

## 8. Flujo permanente al cambiar de producto

Cuando el propietario dice «quiero cambiar de producto» (o algo equivalente), se sigue **siempre** este flujo, sin saltarse pasos ni pedir de nuevo información que ya existe:

| # | Paso | Quién | Documento |
|---|---|---|---|
| 1 | **Producto**: elección y datos del proveedor | Propietario | — |
| 2 | **Brief** con datos reales; lo desconocido = `NO DISPONIBLE` | Propietario + ChatGPT | `GARELON_PRODUCT_BRIEF_TEMPLATE.md` |
| 3 | **Verificación de datos**: separar confirmado / del proveedor / no verificado | ChatGPT | Brief |
| 4 | **Análisis de TODAS las imágenes**, una a una (§9) | ChatGPT (y Claude Code al implementar) | Brief §Imágenes |
| 5 | **Selección de imágenes** y papel de cada una | ChatGPT + propietario | Brief |
| 6 | **Mejora de imágenes** si procede, sin alterar el producto | ChatGPT u otra herramienta (nunca Claude Code) | — |
| 7 | **Copy** con claims filtrados | ChatGPT | Brief + §10 |
| 8 | **Adaptación del Master**: qué componentes se usan y qué cambia | ChatGPT | `GARELON_MASTER_TEMPLATE.md` |
| 9 | **Migration prompt** relleno | ChatGPT | `GARELON_MIGRATION_PROMPT_TEMPLATE.md` |
| 10 | **Prompt final para Claude Code** | ChatGPT → propietario | Salida del paso 9 |
| 11 | **Implementación** en una rama nueva, por fases | Claude Code | Master + prompt |
| 12 | **Testing** local y del ZIP descomprimido | Claude Code | Master §Validación |
| 13 | **Checklist** 🅲/🆂/🅿 | Claude Code, propietario | `GARELON_PRODUCT_MIGRATION_CHECKLIST.md` |
| 14 | **Shopify preview** con el producto y los packs reales | Propietario | Checklist 🆂 |
| 15 | **Lanzamiento** (tracking verificado, presupuesto aprobado) | Propietario | §15 |

Se conserva siempre: marca, logo, dominio, cabecera, pie, sistema de packs, confianza, opiniones, carrito, checkout, políticas y la arquitectura del tema. Cambia: producto, textos, imágenes, iconos y, si el producto lo pide, qué secciones se usan.

---

## 9. Imágenes

**Regla máxima:** el producto que aparece en la web debe representar el producto que recibe el cliente.

- **Prohibido:** cambiar forma, piezas (medalla, cruz, cuentas…), colores o materiales; añadir «GARELON» al producto o al envase; inventar accesorios o packaging; alterar resultados; cambiar físicamente el producto con IA.
- **Se puede mejorar:** fondo, composición, calidad, resolución, presentación y entorno, **sin tocar el producto físico**.
- **Claude Code no regenera ni edita físicamente imágenes.** Puede redimensionar, recortar sin ampliar, optimizar, convertir a WebP, comprimir, ordenar e integrar.
- **Análisis obligatorio de todas las imágenes** antes de elegir: qué muestra, si coincide con el producto, si tiene texto incrustado (y si ese texto contiene claims no verificados) y qué papel cumple (producto entero, escala o puesta, detalle, información, contexto o emoción).
- **Orden razonado**, nunca por nombre de archivo ni por orden de subida: producto claro primero → escala/uso → detalle → información → contexto. Se tiene en cuenta lo que la página ya mostró justo antes (p. ej. la portada) para no repetir.
- **Las confirmaciones del propietario prevalecen:** si el propietario verifica que una imagen corresponde al producto real, no se vuelve a descartar basándose en revisiones anteriores.

El orden actual de las galerías está en `current-store-state.md` (se lee del repo, no se copia aquí).

---

## 10. CRO, copy y oferta

Optimizar la conversión **sí**; dark patterns **no** (R9).

**Se puede usar:** jerarquía visual, mejor copy, packs, ahorro real, `compare_at_price` real, social proof real, beneficios claros, confianza, mejores imágenes, oferta clara y recomendación editorial prudente.

**Copy:**
- Español de España, «tú», frases cortas, sin mayúsculas gritonas ni exclamaciones en serie.
- Beneficio y significado antes que especificación; los datos secundarios (capacidad, plazos…) van en la FAQ o en las políticas, no en las zonas de venta.
- Sin superlativos sin prueba («el mejor», «el regalo perfecto»).

**Portada (hero):** explica producto y beneficio y lleva a la compra con **un solo CTA** (hoy «Elegir mi pulsera» → `/#comprar`). **No muestra «A partir de X €»**: el usuario descubre los precios en los packs.

**Selector de packs («Elige tu oferta»):** tarjetas visuales e interactivas montadas sobre el selector de variantes real de Dawn (formulario oficial, cambio de variante, URL, carrito, teclado, lector de pantalla). El precio visible está **dentro de cada tarjeta**, no duplicado bajo el título. Badge editorial «Recomendado» (también el texto por defecto del schema); «Más popular» o «Más vendido» solo con datos de ventas reales, y nunca como default de un schema.

**Precio:** siempre de Shopify (R5-R6). En Liquid nunca se escribe un precio comercial, aunque lo pida alguien: el precio se cambia en Shopify Admin.

---

## 11. Confianza, envío y derechos legales

**Valores confirmados por el propietario (estado actual):**
- `Envío gratis + seguimiento`
- `Pago seguro`
- `14 días para cambiar de opinión`
- `Envíos internacionales`

Si cambian en Shopify o en las políticas, mandan Shopify y las políticas, y el tema se actualiza.

**Envío:** hoy el envío es **gratis** (confirmado por el propietario). Un solo ajuste lo decide: Configuración del tema › Carrito › «Envío gratis» (activo). Con él, los packs, la ficha, el cajón del carrito y `/cart` dicen lo mismo: «Impuestos incluidos. Envío gratis.». Ya no aparece «envío calculado en la pantalla de pago». La información de impuestos y aranceles se conserva y no se añaden afirmaciones fiscales nuevas. Si el envío deja de ser gratuito: se desactiva ese ajuste (vuelven las notas de Shopify/Dawn) **y** se cambia la garantía «Envío gratis + seguimiento». El validador da error si una plantilla sigue prometiendo envío gratis con el ajuste desactivado. La tarifa real siempre se configura en Shopify Admin.

**14 días:** derecho de desistimiento, nunca «garantía de 14 días» (R10). La sección «Compra con tranquilidad» puede llevar un símbolo elegante (escudo con check, candado) como recurso visual, nunca como certificación.

**Pago seguro:** el checkout es el oficial de Shopify. No se pintan logos de pago a mano; si algún día se muestran iconos, solo los que Shopify devuelve como habilitados.

---

## 12. Opiniones (Judge.me)

- Sistema: **Judge.me**. Solo opiniones reales (R14).
- Se pueden **importar opiniones de AliExpress** si corresponden al **mismo modelo**, se revisan una a una, no describen otro producto, no introducen claims falsos (14K, hipoalergénico, etc.) y no se editan. Se importan también las críticas, sin filtrar solo las de 5 estrellas.
- Título aprobado actual: **«Opiniones sobre esta pulsera»** (en un producto nuevo: «Opiniones sobre este/esta <producto>»).
- Nota transparente cuando hay importadas: «Incluye opiniones de compradores del mismo modelo, importadas mediante Judge.me.»
- Nunca se inventan «4,9/5», estrellas, número de compradores ni de opiniones. Sin opiniones visibles, la sección no se muestra al cliente.

---

## 13. Producto actual

> Resumen estable. El detalle con commit y fecha está en `current-store-state.md`.

- **Producto:** Pulsera Rosario Virgen María Dorada. Frase: «Un símbolo de tu fe, contigo cada día.»
- **Confirmado:** rosario católico; medalla de la Virgen María; cruz integrada en la pulsera (la cadena se une a ella por los dos extremos de su eje largo; no cuelga ninguna cruz, cadena ni cuenta); cuentas de rosario tricolor; acero inoxidable; acabado dorado pulido; longitud aprox. 20 cm / 7,87 pulgadas; ajuste mediante 3 aros.
- **No asumir ni publicar:** 14K, chapado 14K, hipoalergénico, waterproof, «no se oxida», «no pierde color», milagros, suerte, protección espiritual garantizada, fabricación por GARELON.
- **Packs:** un solo producto Shopify con la opción `Pack` = `1 pulsera` · `2 pulseras` · `3 pulseras` (variantes reales, cantidad 1). Pack de 3 = 3 pulseras físicas = 3 unidades compradas al proveedor.
- **Proveedor:** DSers + AliExpress (no AutoDS). Fulfillment inicial manual.
- **Imágenes aprobadas por el propietario:** `Imagen 1.png`, `imagen 2.png`, `NUEVA IMAGEN 3.png`, `imagen 4.png`. No se vuelven a descartar. La antigua `imagen 3.png` (cruz colgante) no es fiel al producto y no se usa.
- **Tienda:** ya funciona en Shopify sobre Dawn 16.0.0 + capa GARELON. El 404 histórico de la home quedó resuelto con la reconstrucción limpia y no es un problema actual.

---

## 14. Pruebas y entrega

Detalle técnico en `GARELON_MASTER_TEMPLATE.md` §9 y en la skill (`references/qa-testing.md`). Resumen:

- Se descubren los comandos y la línea base **actuales** antes de afirmar números. Nunca se copian conteos antiguos como verdad.
- **Mínimo:** JSON y schemas, validador propio (`tools/garelon_check.py`) y su autoprueba, Theme Check (sin avisos nuevos frente a Dawn), Liquid estricto, render, routing (home 200, 404 limpia), variantes y packs, carrito y cajón (incluida la nota de envío), imágenes, enlaces, accesibilidad básica y responsive a 320, 360, 375, 390, 430, 768, 1024 y 1440 px.
- **Todo está versionado:** `tests/render-harness/` (`npm ci` y `node tests/render-harness/validate.js`; ver `tests/render-harness/README.md`). La batería **simula** Shopify en local: no demuestra el checkout, los pagos, DSers, Judge.me ni Shopify Admin reales. Cada ronda de trabajo añade su fase de pruebas; un fallo nunca se arregla quitando la prueba.
- **ZIP del tema:** solo `assets/ config/ layout/ locales/ sections/ snippets/ templates/`, generado con `tools/build_zip.py`, **descomprimido en una carpeta nueva y validado otra vez**.
- **Informe:** qué se probó y dónde (R23), qué no se pudo probar y qué debe comprobar el propietario en Shopify.

---

## 15. Lanzamiento, analítica y marketing

La skill ayuda también en la etapa siguiente: investigación de producto, CRO, pricing, unit economics, creatividades, Meta Ads, TikTok Ads, UGC, SEO, analítica, investigación de clientes y tests A/B.

- **Antes de lanzar tráfico** se comprueba, sin dar nada por instalado: píxel de Meta / TikTok, GA4 si aplica, y los eventos `ViewContent`, `AddToCart`, `InitiateCheckout` / checkout y `Purchase`, idealmente con un pedido de prueba.
- **Unit economics** con datos reales del brief: coste de producto + envío del proveedor + comisiones de pago + CPA objetivo frente al precio de cada pack. Lo desconocido es `NO DISPONIBLE`.
- **Creatividades:** las mismas reglas de fidelidad (R1) y claims (R3) que la tienda. Nada de «antes/después» falsos ni testimonios inventados.
- **Nunca sin aprobación explícita:** gastar dinero, lanzar campañas, cambiar presupuestos (§16).

---

## 16. Seguridad operativa

Requieren **confirmación explícita** del propietario en el momento:

- publicar un tema;
- hacer merge;
- borrar un producto real o cualquier dato;
- modificar configuración crítica de Shopify (pagos, envío, dominios, checkout);
- gastar dinero en publicidad, lanzar campañas o cambiar presupuestos;
- cambiar el fulfillment o el mapping con el proveedor;
- alterar políticas legales.

Los cambios de código en una rama de trabajo se ejecutan si el propietario los pidió, con commits claros y push, **sin merge**. Nunca se piden ni se exponen tokens o credenciales. Los ZIP no se suben a GitHub.

---

## 17. La skill `garelon-ecommerce-operator`

- **Dónde:** `.claude/skills/garelon-ecommerce-operator/` en el repositorio.
- **Qué es:** el orquestador que Claude Code usa en cualquier tarea GARELON. No es la fuente de verdad: aplica este sistema documental y revalida contra el repo real.
- **Cuándo se activa:** peticiones sobre GARELON, la tienda, Shopify/Dawn/Liquid, cambiar o lanzar producto, DSers/AliExpress, imágenes, logo, packs, opiniones/Judge.me, CRO, landing, migración, anuncios y marketing, **siempre que el contexto sea el proyecto GARELON**. No interviene en conversaciones de otros proyectos.
- **Modos (se infieren):** `ANALYZE`, `IMPLEMENT`, `MIGRATE_PRODUCT`, `QA`, `LAUNCH`, `MARKETING`, `DOCUMENT_SYNC`.
- **Coexistencia:** puede trabajar junto a skills externas (Shopify Liquid, Shopify Agent Skills, webapp testing, frontend design, marketing, ecommerce). **GARELON manda** en marca, arquitectura, claims, verdad, flujo y preferencias del propietario: una skill externa no puede sobrescribir estas reglas.

---

## 18. Mantener la documentación al día

- **DOCUMENT_SYNC** se activa cuando el propietario pide actualizar documentos o cuando una tarea cambia algo que estos documentos describen.
- **Procedimiento:**
  1. Inspeccionar el repo real.
  2. Regenerar el snapshot (`python3 .claude/skills/garelon-ecommerce-operator/scripts/garelon_store_snapshot.py --update-state`).
  3. Actualizar `current-store-state.md` y los documentos afectados, **adaptando los documentos al tema y nunca el tema a los documentos**.
  4. Anotar la decisión en `GARELON_DECISION_LOG.md`.
  5. Actualizar el manifest: `python3 tools/garelon_docs_check.py --update-manifest`.
  6. Ejecutar `python3 tools/garelon_docs_check.py`.
- **Números que caducan** (conteos de archivos, de pruebas o de secciones) solo van en `current-store-state.md`, con commit y fecha. Los documentos permanentes describen componentes por función.
- **Paquete para el proyecto de ChatGPT:** `python3 tools/garelon_docs_check.py --zip GARELON-PROJECT-DOCS-LATEST.zip` genera un ZIP con los 5 documentos en la raíz. Se sube a mano al proyecto. No se versiona en GitHub.

---

## 19. Instrucciones para ChatGPT

1. Lee este documento entero antes de responder sobre GARELON. Ante dudas técnicas, consulta `GARELON_MASTER_TEMPLATE.md`.
2. Para un producto nuevo, sigue §8. Pide el brief (`GARELON_PRODUCT_BRIEF_TEMPLATE.md`) y no repitas preguntas cuya respuesta ya está en el brief o en estos documentos.
3. Analiza **todas** las imágenes una a una (§9) y explica qué decides con cada una y por qué.
4. Filtra los claims: confirmado / del proveedor (atribuido) / no verificado (no se publica).
5. Rellena `GARELON_MIGRATION_PROMPT_TEMPLATE.md`. Su salida es un prompt autocontenido para Claude Code, con `NO DISPONIBLE` donde falte un dato.
6. No afirmes que puedes leer el repositorio ni Shopify si no tienes acceso. Claude Code es quien inspecciona el repo real y manda sobre lo que digan estos documentos si el código ha cambiado.
7. Cuando el propietario confirme algo nuevo (un dato, una preferencia, una imagen), indícale que hay que llevarlo al sistema documental mediante una tarea DOCUMENT_SYNC en Claude Code.
