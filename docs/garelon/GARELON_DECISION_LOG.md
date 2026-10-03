# GARELON · REGISTRO DE DECISIONES

> **Versión:** 3.0 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `955bcc3`
>
> Este registro es **histórico**: explica por qué las cosas son como son. Las reglas vigentes están en `GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` y el estado actual en `current-store-state.md`. Las entradas solo se añaden, no se reescriben. Si una decisión se revoca, se añade una entrada nueva que la sustituye.

**Formato:** fecha · decisión · motivo · fuente (commit o confirmación del propietario) · estado.

| # | Fecha | Decisión | Motivo / lección | Fuente | Estado |
|---|---|---|---|---|---|
| D1 | 2026-09-27 | La tienda se construye sobre **Dawn 16.0.0** con una capa propia GARELON | Tema oficial gratuito, mantenido, con formulario, carrito y checkout nativos | `f7ba80a` | Vigente |
| D2 | 2026-09-28 | **Sin catálogo** en la navegación pública; navegación mínima hacia el producto | ONE PRODUCT STORE: todo lleva a la compra | `98e4d14` | Vigente |
| D3 | 2026-09-29 | **Packs = variantes reales** de una opción («Pack»), añadidas con cantidad 1 | Un pack «1 unidad × N» rompe el fulfillment y el precio del pack | `ac99ed5` | Vigente |
| D4 | 2026-09-29 | Proveedor histórico: **AutoDS → CJ Dropshipping** (sérum y taza) | Cambio de proveedor de los productos anteriores | `ac99ed5` | Sustituida por D16 |
| D5 | 2026-09-30 | Nombres de schema (sección, bloque, preset) **≤ 25 caracteres** | Un nombre de bloque largo hizo que Shopify rechazara `featured-product` y la home diera 404 | `530cff7` | Vigente (R17) |
| D6 | 2026-09-30 | Sin iconos de pago dibujados a mano; checkout oficial | Los métodos visibles deben ser los reales de Shopify | `6252414` | Vigente («Pago seguro» solo como texto) |
| D7 | 2026-09-30 | Producto «sérum de contorno de ojos» congelado en `baseline/garelon-serum` (`f08f9bb`) | Primer producto de prueba | `f08f9bb` | Histórico |
| D8 | 2026-09-30 | Producto «Taza Fondue» (rama `claude/fondue-mug`, congelada en `baseline/garelon-fondue`) | Segundo producto de prueba | `c6d0e12`, `b45d132` | Histórico |
| D9 | 2026-10-01 | Sin «En stock» ni cifras de stock en la zona de compra | La disponibilidad ya se ve en el botón; evitar urgencia | `b45d132` | Vigente |
| D10 | 2026-10-02 | Producto actual: **Pulsera Rosario Virgen María** | Decisión del propietario | `fa741e8` (rama `claude/rosary-bracelet`) | Vigente |
| D11 | 2026-10-02 | Derechos legales con su nombre: «14 días para cambiar de opinión» = desistimiento; garantía legal aplicable | Evitar claims comerciales engañosos («garantía de 14 días») | `05ddf50` | Vigente (R10) |
| D12 | 2026-10-02 | **Reconstrucción limpia** desde Dawn 16.0.0 oficial (rama `claude/rosary-clean-rebuild`), de menos a más, con validador de instalabilidad | La home seguía en 404 en Shopify con el tema 1.x; diagnosticar sobre una base mínima y validada | `b2adb07`…`899ce92` | Vigente |
| D13 | 2026-10-02 | **CRO honesto:** tarjetas «Elige tu oferta» sobre el selector de Dawn, zona de confianza, opiniones solo reales con Judge.me, nota de origen de las opiniones importadas | Mejorar la conversión sin dark patterns | `451b48d` | Vigente |
| D14 | 2026-10-02 | **Logo actual:** isotipo dorado + wordmark negro (`LOGO DEFINITIVO.png`). Las letras doradas dejan de ser el logo completo; el isotipo dorado sigue para favicon e iconos | Decisión del propietario | `4674afb` | Vigente |
| D15 | 2026-10-02 | Garantías: «Envío gratis + seguimiento» · «Pago seguro» · «14 días para cambiar de opinión» · «Envíos internacionales». «Para regalar» en cuadrícula simétrica (2 × 3 móvil, 3 × 2 desde tableta). Distintivo «Recomendado», no «Más popular» | Confirmación del propietario; «Más popular» exige datos de ventas | `4674afb`, `451b48d` | Vigente |
| D16 | 2026-10-03 | Integración actual: **DSers + AliExpress**, no AutoDS. Fulfillment inicial manual. En documentos genéricos: `{{SUPPLIER_INTEGRATION}}` | Confirmación del propietario | Prompt del propietario 2026-10-03 | Vigente |
| D17 | 2026-10-02 | **Portada sin «A partir de X €»**; un solo CTA «Elegir mi pulsera» → `/#comprar` | El precio se descubre en los packs; menos ruido en la portada | `aaf47b0` | Vigente |
| D18 | 2026-10-02 | `Imagen 1.png` e `imagen 4.png` **verificadas por el propietario** e incorporadas. La revisión anterior que las descartaba (supuesta diferencia en la cruz) queda anulada | La confirmación del propietario prevalece sobre una revisión del modelo | `57ba415` | Vigente |
| D19 | 2026-10-03 | Imágenes válidas: `Imagen 1.png`, `imagen 2.png`, `imagen 3.png`, `imagen 4.png`; no se vuelven a descartar | Confirmación del propietario | Prompt del propietario 2026-10-03 | Vigente |
| D20 | 2026-10-03 | **Envío gratis:** bajo los packs, «Impuestos incluidos. Envío gratis.» (ajuste `free_shipping` del bloque de packs, activo por defecto) | El envío actual es gratuito; el texto de Shopify («se calculan en la pantalla de pago») confundía | `955bcc3` | Vigente |
| D21 | 2026-10-03 | Sello de escudo con check en «Compra con tranquilidad» (decorativo) | Confianza visual elegante sin simular una certificación | `955bcc3` | Vigente |
| D22 | 2026-10-03 | Orden de galerías razonado: ficha = producto entero → puesta → detalle → infografía → contexto; home = adelanta detalle e infografía porque la portada ya enseña la foto en la muñeca | Contar la historia comercial sin repetir | `955bcc3` | Vigente (orden exacto en el snapshot) |
| D23 | 2026-10-03 | La tienda **ya funciona en Shopify**; el 404 histórico de la home está resuelto y no es un problema actual | Confirmación del propietario | Prompt del propietario 2026-10-03 | Vigente |
| D24 | 2026-10-03 | Sistema documental 3.0 + skill `garelon-ecommerce-operator`. Las reglas R1-R31 de los Master 1.x/2.0 se consolidan en R1-R24 del Prompt Maestro (mismas ideas, sin referencias a archivos que ya no existen) | Evitar que el código y la documentación diverjan; trabajar sin reexplicar el proyecto | Este commit | Vigente |

## Pendiente de decidir (propietario)

- Nota del cajón del carrito y de `/cart`: sigue el texto de Dawn («Descuentos y envío calculados en la pantalla de pago»). ¿Cambiar a «Envío gratis»?
- Pasar `garelon_media` a `shopify` cuando la multimedia del producto en Shopify esté revisada.
- Default del schema `badge_text` = «Más popular» (invisible mientras `badge_pack` sea `none`): cambiarlo a «Recomendado» en una ronda de tema.
- Versionar en el repositorio la batería de render y responsive (hoy vive fuera del repo).
