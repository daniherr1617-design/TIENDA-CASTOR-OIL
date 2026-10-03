# GARELON · CHECKLIST DE MIGRACIÓN Y VERIFICACIÓN

> **Versión:** 3.0 · **Fecha:** 2026-10-03 · **Repositorio:** `daniherr1617-design/TIENDA-CASTOR-OIL` · **Rama fuente:** `claude/rosary-clean-rebuild` · **Commit fuente:** `955bcc3`
>
> Snapshot generado desde `955bcc3`. Ante discrepancias futuras manda el repositorio actual. Si una comprobación ya no corresponde a la arquitectura real, se corrige este checklist (DOCUMENT_SYNC), no el tema.

**Marcadores:**
- 🅲 **Claude Code / local:** se comprueba en el repositorio y en el ZIP descomprimido (render local con datos simulados).
- 🆂 **Shopify real:** solo vale comprobado en la vista previa o en la tienda (lo hace el propietario, o Claude si tiene acceso real).
- 🅿 **Propietario:** decisión o verificación física que solo puede hacer el propietario.

Cada punto se marca con el lugar donde se probó: `PROBADO LOCALMENTE`, `ZIP DESCOMPRIMIDO`, `SHOPIFY PREVIEW` o `PUBLICADO`. Un 🆂 no se marca nunca con una prueba local.

---

## 1. Verdad del producto
- [ ] 🅿 El producto recibido coincide con el brief: piezas, colores, materiales, medidas y contenido.
- [ ] 🅲 Todos los datos publicados tienen fuente; lo no verificado no aparece (tampoco en alt, SEO ni FAQ).
- [ ] 🅲 Búsqueda de claims prohibidos del brief en las 7 carpetas del tema: 0 resultados.
- [ ] 🅲 Sin «fabricado/diseñado por GARELON» ni promesas médicas, mágicas o espirituales.

## 2. Imágenes
- [ ] 🅲 Se revisaron **todas** las imágenes del brief, con una decisión y un motivo para cada una.
- [ ] 🅲 Los assets `producto-*` son solo redimensionados, recortados sin ampliar o convertidos; no hay producto alterado.
- [ ] 🅲 Cada clave tiene todos sus anchos (`tools/garelon_check.py`) y un texto alternativo en español fiel a la imagen.
- [ ] 🅲 Orden de galería razonado en la home y en la ficha, sin repetir lo que la portada acaba de enseñar.
- [ ] 🅲 Solo la imagen LCP es `eager`.
- [ ] 🅿 Las imágenes mejoradas no cambian el producto (verificación del propietario).
- [ ] 🆂 La multimedia del producto en Shopify no trae imágenes con claims no verificados (antes de pasar `garelon_media` a `shopify`).

## 3. Marca
- [ ] 🅲 Logo actual (isotipo dorado + wordmark negro) en cabecera y pie; isotipo en favicon e icono de iOS.
- [ ] 🅲 «GARELON» escrito exactamente así; sin restos del producto anterior (`{{PREVIOUS_PRODUCT_TERMS}}` = 0 en el storefront).
- [ ] 🆂 No hay un logo antiguo subido en Personalizar › Configuración del tema que tape el de los assets.

## 4. Móvil y responsive
- [ ] 🅲 Sin scroll horizontal a 320, 360, 375, 390, 430, 768, 1024 y 1440 px.
- [ ] 🅲 Cabecera móvil: menú · logo · carrito sin solapes.
- [ ] 🅲 Portada: H1 y CTA en la primera pantalla del móvil; sin precio en la portada.
- [ ] 🅲 Tarjetas de packs y de «Para regalar» simétricas; texto bajo los packs en una línea a 320 px.
- [ ] 🅲 Objetivos táctiles ≥ 44 px; compra fija en la ficha móvil.
- [ ] 🆂 Revisión visual en un móvil real.

## 5. Variantes y packs
- [ ] 🆂 Opción de packs creada en Shopify con los valores del brief, en orden y con precio real.
- [ ] 🅲 Cambiar de tarjeta cambia la variante (`id`), el precio, la URL (ficha) y el botón.
- [ ] 🅲 Se añade con **cantidad 1**; el carrito muestra el pack correcto × 1.
- [ ] 🅲 Pack agotado: tarjeta «Agotado» y botón desactivado.
- [ ] 🅲 Sin la opción de packs, el selector normal de Dawn funciona y el cliente no ve avisos.
- [ ] 🅲 Teclado (Tab + flechas) y lector de pantalla en el grupo «Elige tu oferta».

## 6. Precio, compare_at y ahorro
- [ ] 🅲 Ningún precio, stock, SKU ni ID escrito en el tema.
- [ ] 🅲 Precio tachado solo con `compare_at_price > price`.
- [ ] 🅲 Ahorro de pack solo si es > 0, con la nota de cálculo; sin ahorro real no hay textos de ahorro.
- [ ] 🅿 Cualquier `compare_at_price` es un precio anterior real (referencia: el más bajo de los 30 días anteriores).
- [ ] 🅲 Distintivo editorial («Recomendado»); nunca «Más popular» sin datos.

## 7. Envío
- [ ] 🆂 Tarifa de envío real configurada (gratis, si se anuncia gratis) para las zonas anunciadas.
- [ ] 🅲 Bajo los packs: «Impuestos incluidos. Envío gratis.» solo si el envío es gratis; si no, `free_shipping` desactivado.
- [ ] 🅲 Garantías («Envío gratis + seguimiento», «Envíos internacionales»…) coherentes con Shopify.
- [ ] 🅿 Decidir si la nota del cajón y de `/cart` (texto de Dawn) debe decir también «Envío gratis».

## 8. Confianza y legal
- [ ] 🅲 «14 días para cambiar de opinión» se presenta como derecho de desistimiento, nunca como «garantía de 14 días».
- [ ] 🅲 El sello de «Compra con tranquilidad» es decorativo (`aria-hidden`) y no simula una certificación.
- [ ] 🆂 Políticas publicadas (devoluciones, envío, privacidad, términos, aviso legal) con datos reales de la empresa; el pie solo enlaza las que existen.
- [ ] 🅿 El producto admite desistimiento (no es una excepción legal) y las políticas lo reflejan.

## 9. Opiniones y Judge.me
- [ ] 🅲 El tema no contiene ninguna opinión; sin datos, la sección no se ve (nunca «0 opiniones»).
- [ ] 🆂 Widget de Judge.me añadido en «GARELON Opiniones» (home y ficha) desde el editor.
- [ ] 🆂 Sincronización de la valoración con Shopify activa (metafields `reviews.rating` / `reviews.rating_count`).
- [ ] 🅿 Importadas solo del mismo modelo, revisadas, sin editar, sin filtrar solo 5 estrellas; nota de origen coherente.

## 10. Proveedor (`{{SUPPLIER_INTEGRATION}}`, actual: DSers + AliExpress)
- [ ] 🅿 Producto vinculado al artículo exacto del proveedor.
- [ ] 🅿 Fulfillment definido: Pack de N × 1 = N unidades al proveedor.
- [ ] 🆂 Pedido de prueba de cada pack y comprobación de lo que llega al proveedor.
- [ ] 🅲 El tema no contiene código del proveedor ni altera variantes o mapping.

## 11. Carrito y checkout
- [ ] 🅲 Cajón y `/cart` de Dawn: imagen, variante, cantidad, eliminar, subtotal y botón de pago; «Seguir comprando» → home.
- [ ] 🅲 Sin upsells, casillas premarcadas ni productos añadidos automáticamente.
- [ ] 🆂 El checkout oficial abre con el pack y el precio correctos; pagos dinámicos visibles según Shopify.

## 12. Tracking y analítica
- [ ] 🆂 Píxeles (Meta, TikTok) y GA4, si aplica, instalados por vías oficiales (canales y eventos de cliente).
- [ ] 🆂 Eventos `ViewContent`, `AddToCart`, inicio de checkout y `Purchase` verificados con un pedido de prueba.
- [ ] 🅲 El tema no inyecta píxeles a mano.

## 13. SEO
- [ ] 🅲 Un H1 por página; un único JSON-LD de producto (Dawn).
- [ ] 🆂 Título y meta descripción del producto y de la home en Shopify; imagen para redes.
- [ ] 🆂 Redirección `/products/<handle-anterior>` → `/` si se retira el producto anterior.

## 14. Accesibilidad
- [ ] 🅲 Textos alternativos descriptivos; iconos decorativos con `aria-hidden`.
- [ ] 🅲 FAQ con `details`/`summary`; «Saltar al contenido» funciona; el menú móvil se cierra al pulsar un ancla.
- [ ] 🅲 Contraste AA en botones y textos dorados; foco visible.

## 15. Rendimiento
- [ ] 🅲 Imágenes WebP con `srcset`, `sizes`, `width` y `height`; lazy salvo la LCP.
- [ ] 🅲 Sin librerías nuevas; CSS y JS GARELON acotados.

## 16. Routing e instalabilidad
- [ ] 🅲 `GET /` → 200 (plantilla index), con y sin producto publicado.
- [ ] 🅲 Ficha → 200; ruta inexistente → 404 limpia; `/cart` → 200; contacto → 200.
- [ ] 🅲 `templates/index.json` sin bloques de app, imágenes de Files ni recursos de la tienda; nombres de schema ≤ 25 bytes.
- [ ] 🆂 Tras subir el tema: la home y Personalizar › Página de inicio abren sin 404.

## 17. Pruebas
- [ ] 🅲 `python3 tools/garelon_check.py` OK y `python3 tools/test_garelon_check.py` OK.
- [ ] 🅲 Theme Check sin errores nuevos frente a la línea base de Dawn.
- [ ] 🅲 Liquid (Ruby) estricto: 0 errores.
- [ ] 🅲 Render, routing, regresión y responsive en verde (indicar el total real de la batería usada).
- [ ] 🅲 `python3 tools/garelon_docs_check.py` OK si cambió la documentación.

## 18. ZIP
- [ ] 🅲 ZIP generado con `tools/build_zip.py`: solo las 7 carpetas del tema.
- [ ] 🅲 Descomprimido en una carpeta nueva y validado otra vez (`--strict-root`, Theme Check, Liquid, render).
- [ ] 🅲 SHA-256 anotado en el informe; el ZIP no se sube a GitHub.

## 19. Shopify preview y publicación
- [ ] 🅿 Copia de seguridad del tema publicado (Duplicar).
- [ ] 🆂 Tema subido **sin publicar** (o rama sincronizada) y revisado en la vista previa, en móvil y escritorio.
- [ ] 🆂 Pedido de prueba de cada pack completado.
- [ ] 🅿 Publicación aprobada explícitamente por el propietario.

## 20. Documentación
- [ ] 🅲 `current-store-state.md` regenerado desde el repo (commit y fecha).
- [ ] 🅲 Decisiones nuevas anotadas en `GARELON_DECISION_LOG.md`.
- [ ] 🅲 Manifest actualizado y `GARELON-PROJECT-DOCS-LATEST.zip` regenerado si cambió alguno de los 5 documentos.
- [ ] 🅿 Documentos actualizados subidos al proyecto de ChatGPT.
