# PROMPT · MIGRACIÓN GARELON A PULSERA ROSARIO VIRGEN MARÍA (versión adaptada y ejecutada)

> Copia adaptada del prompt del dueño (02/10/2026), con el **estado real ejecutado** en `claude/rosary-bracelet`. Las notas «→ Ejecutado» dicen qué se hizo y dónde la realidad obligó a desviarse. Detalle completo: `GARELON-CAMBIOS-ROSARIO.md` (raíz) y `docs/garelon/products/GARELON_PRODUCT_BRIEF_ROSARY_BRACELET_v1.md`.

## 0. Repositorio, baseline y seguridad

- Repositorio `daniherr1617-design/TIENDA-CASTOR-OIL`. Punto de partida: `claude/fondue-mug` @ `b45d1322a0df2c32d8a4daffc869f9b31e0fdc10` (Taza Fondue subida a Shopify).
- Crear `baseline/garelon-fondue` en `b45d132` si no existe. Crear `claude/rosary-bracelet` desde `b45d132` y trabajar solo ahí.
- No tocar `main` ni `claude/fondue-mug`, no hacer merge, no tocar la PR #2. Al final, Draft PR nueva.

→ Ejecutado: fetch hecho; `b45d132` confirmado; `baseline/garelon-fondue` creada y subida; `claude/rosary-bracelet` creada desde `b45d132`. `main` había recibido las imágenes nuevas de la pulsera (`bb40ffc`): se copiaron a la rama sin fusionar `main`.

## 1. Documentación

Leer Master, checklist, brief y prompt de la Taza Fondue. Prioridad: verdad del producto > repositorio real > Master > este prompt > documentación histórica.

→ Ejecutado: leídos completos. Master actualizado a 1.9.

## 2-3. Contexto y proveedor

- GARELON sigue siendo la marca; one-product store; España; tráfico móvil de anuncios; Shopify con carrito y checkout oficiales.
- Producto anterior: Taza Fondue. Producto nuevo: Pulsera Rosario Virgen María (joyería / accesorio religioso).
- Proveedor: **AliExpress** (`https://a.aliexpress.com/_EH046Rc`). Integración/fulfillment: **NO DISPONIBLE / PENDIENTE**. Nada de código del proveedor en el tema.

→ Ejecutado: tema independiente del proveedor. La URL de AliExpress no es accesible desde el entorno (proxy).

## 4. Competidor

Estudiar `https://www.veysors.com/products/pulsera-rosario-virgen-maria` si es accesible; no copiar nada; si no es accesible, no inventarlo.

→ Ejecutado: **no accesible** (proxy de red: `EGRESS_BLOCKED`). No se ha estudiado ni descrito. Se ha seguido la dirección visual de este prompt.

## 5-9. Verdad del producto

- Permitido: acero inoxidable · acabado dorado pulido · medalla de la Virgen María · cruz · cuentas de rosario tricolor · diseño de inspiración católica · idea de regalo para ocasiones católicas · pieza para uso diario (según el proveedor).
- Longitud 7.87" y «3 O-rings for length adjustment» según una imagen del proveedor; conversión correcta y documentada.
- **14K: NO VERIFICADO / NO PUBLICAR.** Lista de claims prohibidos (hipoalergénica, waterproof, no se oxida, garantía, hecha a mano, bendecida, protección, etc.).
- El cliente recibe 1 pulsera; packaging NO confirmado.

→ Ejecutado: «7,87 pulgadas (unos 20 cm)» (7,87 × 2,54 = 19,99 cm) solo en Detalles, pestaña de la ficha y FAQ. «Tres aros… según el proveedor». 14K y claims prohibidos: 0 resultados en el tema (búsqueda automatizada en la batería de pruebas).

## 10-11. Precio, variantes, packs y envío

Nada inventado. Precio de Shopify. Sin selector con una sola variante; variantes reales si existen. `garelon-packs` desactivado. Cantidad 1. «Envío gratis» técnicamente presente pero desactivado. Sin plazos.

→ Ejecutado: bloque estándar «Selector de variantes» de Dawn (invisible con una variante); `garelon_packs` fuera de las plantillas; bloque «Envío gratis» con `show_free_shipping: false` (también por defecto) y aviso solo en el editor; barra superior y notas del carrito sin «envío gratis».

## 12. Logo

Símbolo dorado abstracto aprobado (isotipo) y logo completo (símbolo + GARELON). Identificar por contenido. Logo completo en cabecera/pie si se lee; isotipo para favicon, móvil y cierre. Nunca sobre la pulsera.

→ Ejecutado: `Logo.png` = símbolo, `Logo y marca.png` = completo (verificado mirándolos). Cabecera: símbolo + letras «GARELON» del logo completo, en horizontal. Pie: logo completo. Cierre: símbolo. Favicon: derivación plana del mismo símbolo (el metálico se perdía a 32 px), probada a 32/48/96 px.

## 13-15. Dirección visual, paleta, tipografía

Joyería sencilla, luminosa, premium y creíble. Blanco/marfil/champán, dorado como acento, carbón para el texto; AA obligatorio. Lora + Inter si funcionan.

→ Ejecutado: ver paleta en `GARELON-CAMBIOS-ROSARIO.md` §1. CTA en dorado accesible `#86672F` con texto blanco (5,3:1). Lora + Inter sin cambios.

## 16. Tema

Preferir Dawn; solo temas gratuitos oficiales si mejoran claramente.

→ Ejecutado: **Dawn 16 se mantiene**.

## 17-20. Imágenes

Las imágenes originales del proveedor son la verdad física; las generadas solo candidatas. Comparar medalla, cruz, cuentas, cadena, cierre, aros, proporciones. Descartar cualquier generada que cambie el producto. 4-6 imágenes buenas mejor que una galería saturada. No editar el producto.

→ Ejecutado: **las 6 originales no están en el repositorio**. Con las 4 disponibles (mejoradas/generadas) se detectó una discrepancia: cruz **colgante** (`imagen 2`, `imagen 3`) frente a cruz **intercalada** (`imagen 4`, `Imagen 1`). Usadas: `imagen 3` (principal) + su recorte (detalle) + `imagen 2` (oración). Descartadas: `imagen 4` (pendiente de confirmar) e `Imagen 1` (además, caja de regalo). Solo redimensionado/recorte sin ampliar y WebP.

## 21-32. Propuesta, copy, home, FAQ

Joyería + significado + regalo, sin sermón ni promesas. Home sencilla: barra → cabecera → portada → compra → opiniones reales → significado → detalles → regalo → lifestyle → confianza → FAQ → cierre → pie (se pueden fusionar secciones).

→ Ejecutado: lifestyle fusionado con «significado». Copy y FAQ finales en `GARELON-CAMBIOS-ROSARIO.md` §3-§5. Sin pregunta de cuidados (dato no disponible).

## 33-40. Ficha, navegación, cabecera, pie, confianza, compra fija, carrito

Ficha coherente sin restos de la taza. Navegación: Inicio · La pulsera · Detalles · Regalo · Preguntas frecuentes · Contacto. Pie: «Joyería con significado para acompañar momentos especiales.» Confianza solo real. Compra fija con el formulario real. Carrito de Dawn intacto. Fallback de imagen fiel.

→ Ejecutado: navegación editable desde la cabecera (4 enlaces + Inicio y Contacto); en escritorio «Preguntas» (cabe en una fila a 1024 px). Compra fija y carrito usan la imagen principal del tema solo si el producto no tiene multimedia.

## 41-42. Limpieza

Sin restos de la taza en el storefront; borrar assets `garelon-fondue-*`; la documentación histórica se conserva.

→ Ejecutado: 25 assets `garelon-fondue-*` y el wordmark negro borrados; búsqueda de términos de la taza en el storefront = 0. Quedan solo textos genéricos del componente de packs (inactivo) y la documentación histórica identificada como tal.

## 43-49. SEO, 404, accesibilidad, mobile-first, rendimiento, densidad

→ Ejecutado: un H1 por página; un Product JSON-LD (Dawn); 404 nueva; alt en español; FAQ con details/summary; objetivos ≥ 44 px; contraste AA; sin scroll horizontal de 320 a 1440 px; producto, H1, precio y CTA en la primera pantalla de 320 × 640 a 430 × 932; WebP 480/720/1080; solo la portada con carga prioritaria; sin librerías nuevas.

## 50-53. Master, brief, este prompt, checklist

→ Ejecutado: Master 1.9; brief `GARELON_PRODUCT_BRIEF_ROSARY_BRACELET_v1.md`; este archivo; checklist con los casos «sin packs» y «envío gratis no verificado».

## 54-57. Pruebas y capturas

→ Ejecutado: batería local 101/101, Theme Check 0 errores (9 avisos de Dawn), validador OK, capturas en `docs/garelon/capturas/rosary-v1/`. **No probado**: Shopify real, checkout, AliExpress, fulfillment, pedido.

## 58-60. Shopify, descripción, políticas

→ Pendiente del dueño: ver «MANUAL TODO» en `GARELON-CAMBIOS-ROSARIO.md` §8 y la descripción sugerida en el brief §7. Políticas sin reescribir.

## 68-69. PR y ZIP

→ Ejecutado: push a `claude/rosary-bracelet`, Draft PR nueva (sin merge) y `GARELON-SHOPIFY-THEME-PULSERA-ROSARIO-v1.zip` (solo `assets config layout locales sections snippets templates`), validado descomprimido.
