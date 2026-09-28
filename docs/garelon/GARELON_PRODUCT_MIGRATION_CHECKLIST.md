# GARELON · Checklist de migración de producto

> Se ejecuta **después de cada cambio de producto**, primero en el repositorio (Claude Code) y después en la Vista previa del tema en Shopify (el dueño).
> - Cada punto dice **cómo comprobarlo**.
> - Marca 🅲 = lo comprueba Claude Code en el repositorio o en un render local; 🆂 = solo se puede comprobar en Shopify real (Vista previa, Admin, AutoDS).
> - Las referencias «§» apuntan a secciones de `GARELON_MASTER_TEMPLATE.md`.
> - Producto nuevo: ______________________ · Producto anterior: ______________________ · Rama: __________ · Fecha: ______

---

## 0. Antes de empezar

- [ ] 🅲 La base es Dawn 16.0.0 con la capa GARELON → `config/settings_schema.json`: `theme_version` 16.0.0 y `theme_name` «GARELON (Dawn)».
- [ ] 🅲 Existen las 9 secciones `sections/garelon-*.liquid` y los 12 snippets `snippets/garelon-*.liquid` (§6).
- [ ] 🅲 Línea base de Theme Check: 0 errores y 9 avisos de Dawn (§ anexo B.4).
- [ ] 🅲 El validador de plantillas da `OK` antes de tocar nada (§ anexo B.2).
- [ ] 🅲/🆂 Se sabe si el tema publicado tiene cambios del editor que no están en el repositorio. Si los tiene, se han incorporado.
- [ ] 🅲 Se trabaja en la rama indicada.
- [ ] 🆂 Hay copia de seguridad del tema publicado: Temas → … → Duplicar.

## 1. Producto anterior eliminado

- [ ] 🅲 El `grep` de restos (§ anexo B.1, con los términos del producto anterior) devuelve **0 resultados**.
- [ ] 🅲 `ls assets | grep -E '^(garelon-img|producto-)'` muestra solo assets del producto nuevo.
- [ ] 🅲 `referencias/` no contiene originales del producto anterior; los de marca siguen.
- [ ] 🅲 No quedan bloques ni secciones ocultos (`"disabled": true`) con texto del producto anterior en `templates/*.json`.
- [ ] 🅲 Sin restos en los schemas: valores por defecto, presets e `info` de las secciones GARELON y de `featured-product` (§16.3).
- [ ] 🅲 Textos alternativos nuevos:
  - `hero_alt` en `garelon-hero`;
  - alt de `garelon-final-cta`;
  - `asset_alt` en `garelon-fallback-image`.
- [ ] 🅲 `brand_description` (pie) ya no habla del producto anterior.
- [ ] 🅲 FAQ nueva en los tres sitios: `templates/index.json`, `templates/product.json` y `templates/page.faq.json`.
- [ ] 🅲 `templates/404.json`: botón y textos nuevos.
- [ ] 🅲 Comentarios de código actualizados: `garelon-gallery`, `garelon-fallback-image`, `garelon-image`, `garelon-srcset`, `garelon.css`.
- [ ] 🆂 El producto anterior no aparece en ninguna página (home, ficha, carrito, búsqueda, 404, pie) ni en móvil ni en escritorio.
- [ ] 🆂 El producto anterior está retirado del canal Tienda online (o archivado) y su URL redirige a `/`.

## 2. Imágenes

- [ ] 🅲 Se han revisado **todas** las imágenes entregadas, con la tabla de §18.2 en el informe.
- [ ] 🅲 Cada imagen usada muestra el producto **real**: misma marca, etiqueta, colores, piezas y accesorios. No lleva «GARELON» sobre el producto.
- [ ] 🅲 Descartadas las que tienen erratas, marca o etiqueta distinta, claims prohibidos, antes/después sin respaldo, duplicados o poca resolución.
- [ ] 🅲 Hay una **imagen principal** limpia (foto real con poco texto) en la portada, la 1.ª de la galería y la 404.
- [ ] 🅲 Selección de 5-8 imágenes, cada una responde a una pregunta distinta.
- [ ] 🅲 El orden de la galería sigue la historia comercial: producto → beneficio → problema → funcionamiento → composición → uso → detalles/medidas. Nunca por nombre ni por fecha.
- [ ] 🅲 Ninguna imagen se repite en dos secciones del cuerpo de la home (sí puede repetirse en su sección + la galería).
- [ ] 🅲 Assets WebP en 480, 720 y 1080 px, sin recortes, filtros ni ampliaciones. Peso de 1080 px ≤ ~200 KB.
- [ ] 🅲 A la vez, sin claves huérfanas:
  - las claves de `garelon-fallback-image`;
  - `keys` de `garelon-gallery`;
  - las opciones `fallback_image` de las secciones;
  - los valores `fallback_image` de las plantillas.
- [ ] 🅲 Si alguna imagen no es cuadrada, su altura real está en `garelon-fallback-image` (no el `1080` fijo).
- [ ] 🅲 Los textos incrustados dudosos de imágenes usadas están anotados en el informe.
- [ ] 🆂 Opcional: imágenes subidas a la multimedia del producto en el mismo orden; AutoDS no las sobrescribe.

## 3. Contenido de la home (`templates/index.json`)

- [ ] 🅲 **Portada** (`garelon-hero`):
  - H1 con el beneficio principal, de 5-8 palabras (`use_h1: true`);
  - 1 frase de qué es;
  - precio activado;
  - CTA «Comprar {{PRODUCT_SHORT_NAME}}» → `/#comprar` (enlace vacío);
  - secundario → ancla que exista;
  - máximo 3 micro-beneficios con iconos adecuados.
- [ ] 🅲 **Características** (`garelon-trust-bar`): 4 hechos verificables, sin sellos ni garantías inventados.
- [ ] 🅲 **Beneficios** (`garelon-benefits`): entradilla con el problema y 3-6 beneficios prudentes.
- [ ] 🅲 **Diferencial** (`garelon-image-text`): existe solo si hay algo que lo distinga y una imagen; sin botón; `show_massage_lines: false`.
- [ ] 🅲 **Composición** (`garelon-ingredients`):
  - ingredientes, materiales o especificaciones exactos, idénticos a la fuente;
  - nota de origen adaptada;
  - `anchor` correcto.
- [ ] 🅲 **Cómo se usa** (`garelon-how-to-use`): 2-5 pasos reales y nota de precaución con advertencias reales.
- [ ] 🅲 **Compra** (`featured-product`):
  - `garelon_anchor: comprar`;
  - `garelon_gallery` según §18.7;
  - antetítulo y subtítulo nuevos;
  - bloques de Dawn intactos;
  - `garelon_stock` presente.
- [ ] 🅲 **FAQ** (`garelon-faq`): 6-10 preguntas. Se mantienen «¿Qué es…?» (con la aclaración de fabricante externo), la de envío (→ política) y la de dudas (→ contacto + devoluciones).
- [ ] 🅲 **Cierre** (`garelon-final-cta`): isotipo, frase breve, precio y CTA → `/#comprar`.
- [ ] 🅲 Alternancia de esquemas crema/arena mantenida, como mucho 2 seguidas iguales (§8).
- [ ] 🅲 Máximo 3 CTAs de compra en la home.
- [ ] 🅲 Secciones sin contenido real eliminadas, no vacías.

## 4. Ficha de producto (`templates/product.json`)

- [ ] 🅲 El antetítulo (`eyebrow`) y el subtítulo (`subtitle`) son nuevos.
- [ ] 🅲 Los destacados (`highlights`, `icon-with-text`) son nuevos, con iconos de Dawn adecuados.
- [ ] 🅲 Las pestañas `tab_ingredientes` y `tab_uso` están adaptadas: título, icono y contenido. `tab_envios` sin cambios.
- [ ] 🅲 El bloque `inventory` sigue con `inventory_threshold: 0` y `show_inventory_quantity: false`.
- [ ] 🅲 El bloque `packs` sigue desactivado, salvo que el dueño lo pida.
- [ ] 🅲 La barra de servicio (`service`: Pago seguro · Atención · Envío · Devoluciones) no ha cambiado.
- [ ] 🅲 `benefits`, `how_to` y `faq` están actualizados; `sticky` presente.
- [ ] 🆂 El título y la descripción del producto en el Admin están limpios: en español, sin claims prohibidos y sin ingredientes o datos falsos importados.

## 5. Claims, fidelidad y honestidad

- [ ] 🅲 Ningún texto (ni alt, ni FAQ, ni imagen usada) promete resultados, cura, trata o elimina.
- [ ] 🅲 Sin estudios, porcentajes, certificados, premios ni recomendaciones profesionales sin prueba entregada.
- [ ] 🅲 GARELON no aparece como fabricante, laboratorio ni creador de la fórmula.
- [ ] 🅲 Sin reseñas, estrellas, «4,9/5» ni «más de X clientes» inventados.
- [ ] 🅲 Sin urgencia falsa: cuentas atrás, «quedan X», «personas viendo».
- [ ] 🅲 Sin descuentos ficticios; «envío gratis» solo si está configurado en Shopify.
- [ ] 🅲 Los datos técnicos (medidas, capacidad, materiales o ingredientes) coinciden en todos los sitios: home, ficha, FAQ, alt e imágenes.

## 6. Shopify y AutoDS

- [ ] 🅲 Ningún precio, precio comparado, SKU, variante, ID de variante, stock ni disponibilidad está escrito en el código ni en los JSON.
- [ ] 🅲 Las secciones con ajuste `product` apuntan al producto nuevo (handle conocido) o el informe avisa de que hay que elegirlo o retirar el anterior (§25 F5).
- [ ] 🆂 El precio se ve igual en portada, compra, cierre, ficha, carrito y checkout (es el de Shopify).
- [ ] 🆂 Precio comparado tachado solo si existe en Shopify.
- [ ] 🆂 Las variantes aparecen con sus nombres reales. Al cambiar de variante se actualizan precio, stock, botón y multimedia (en la ficha).
- [ ] 🆂 El stock dice «En stock» o «Agotado» según el inventario real, sin cifras.
- [ ] 🆂 AutoDS: producto importado y vinculado; la sincronización de precio y stock funciona; no sobrescribe título, descripción ni imágenes editados; el fulfillment no se ha tocado.

## 7. Compra, carrito y checkout

- [ ] 🆂 «Añadir al carrito» en la home (`#comprar`) abre el cart drawer con el producto correcto.
- [ ] 🆂 «Añadir al carrito» en la ficha funciona. La **compra fija** aparece en móvil al pasar el botón y añade correctamente.
- [ ] 🆂 Carrito: imagen, título, variante, cantidad (+/−), eliminar, precio, subtotal y «Finalizar compra».
- [ ] 🆂 El carrito no añade nada automáticamente (sin seguros, regalos ni upsells).
- [ ] 🆂 «Finalizar compra» lleva al checkout de Shopify. Los botones de pago dinámico (Shop Pay, PayPal, Apple Pay, Google Pay…) aparecen según la configuración de Pagos.
- [ ] 🅲 Sin CSS, JS ni manipulación del DOM del checkout.
- [ ] 🆂 Estado agotado: el botón se desactiva y la compra fija lo refleja.
- [ ] 🆂 Carrito vacío → «Seguir comprando» lleva a la home.

## 8. Cabecera y navegación

- [ ] 🅲 `[isotipo] GARELON` en un solo enlace a la home. El logo no es H1.
- [ ] 🅲 Navegación: Inicio · (anclas activas) · Contacto. Sin Catálogo ni colecciones (`nav_source: garelon`, `hide_catalog_links: true`).
- [ ] 🅲 Etiquetas y anclas de la navegación adaptadas a la categoría (p. ej. Ingredientes → Materiales); cada ancla existe en la home.
- [ ] 🅲 Móvil (320-430 px):
  - menú · logo centrado · carrito;
  - búsqueda y cuenta **dentro** del menú;
  - cabecera de ~56 px;
  - logo sin tapar y ≥ 14 px de separación con los iconos.
- [ ] 🅲 El menú móvil se cierra al pulsar un ancla y hace scroll a la sección (`garelon-nav.js`).
- [ ] 🅲 Escritorio (≥ 990 px): el menú en línea cabe en **una fila** a 1024 y 1440 px.
- [ ] 🅲 Tableta (750-989 px): búsqueda y cuenta en la barra, sin solapes.
- [ ] 🅲 Cabecera fija «al subir» funcionando; las anclas no quedan tapadas (`scroll-margin-top`).

## 9. Barra superior

- [ ] 🅲 Texto simple y verdadero, sin urgencia. Hoy «Envío disponible a toda España» + bandera (`show_flag_es`).
- [ ] 🅲 Una sola línea (~38 px) de 320 a 1440 px.
- [ ] 🆂 El texto coincide con las zonas de envío configuradas en Shopify.

## 10. Pie, contacto y políticas

- [ ] 🅲 Pie en esquema 2: logo GARELON, descripción de marca actualizada y redes (solo las que tengan URL).
- [ ] 🅲 Bloque **Ayuda**: «¿Necesitas ayuda? Estamos aquí para resolver cualquier duda sobre tu pedido, nuestros productos o el proceso de compra.» + «Contacta con nuestro equipo →» → contacto.
- [ ] 🅲 Enlaces legales en orden: Contacto · Envíos · Devoluciones y reembolsos · Privacidad · Cookies (si existe la página) · Términos y condiciones · Aviso legal.
- [ ] 🆂 La página de **contacto** es la misma de siempre (no se ha creado otra), usa la plantilla `contact` y el formulario envía.
- [ ] 🆂 Cada política enlazada existe y tiene contenido. Si falta la de cookies, no se enlaza.
- [ ] 🅲/🆂 Preguntas de §19 respondidas (devoluciones, envíos, higiene, seguridad, garantía, edad). Las políticas afectadas están revisadas por el dueño; las demás, intactas.
- [ ] 🅲 Ningún NIF/CIF, domicilio, teléfono, email ni razón social inventado en el tema.

## 11. Enlaces

- [ ] 🅲 Todas las anclas usadas (`/#comprar`, `/#como-usarlo`, `/#ingredientes` o su sustituta, `/#preguntas-frecuentes`) existen en la home.
- [ ] 🅲 FAQ, pestañas de la ficha y barra de servicio usan `/pages/contacto`, `/policies/shipping-policy` y `/policies/refund-policy` (se resuelven solos con `garelon-url`).
- [ ] 🅲 Sin enlaces vacíos ni `href="#"`, salvo los selectores de país e idioma de Dawn (desactivados).
- [ ] 🅲 Sin enlaces al catálogo (`/collections…`) en la navegación pública. «Seguir comprando» → home.
- [ ] 🆂 404 (`/pagina-que-no-existe`): título, texto y botón nuevos → `/#comprar`.

## 12. SEO

- [ ] 🅲 Un solo **H1** por página: home = portada; ficha = título del producto; páginas = título de la página.
- [ ] 🅲 JSON-LD sin duplicar:
  - home: `Organization` + `WebSite` + **1** `Product`;
  - ficha: `Organization` + **1** `Product`;
  - ningún `Product` manual añadido.
- [ ] 🅲 `noindex, follow` sigue en colección, lista de colecciones y búsqueda.
- [ ] 🅲 Alt descriptivos en español en todas las imágenes de contenido; decorativas con `alt=""`.
- [ ] 🆂 Admin → Preferencias: título y meta descripción de la home e imagen para redes del producto nuevo.
- [ ] 🆂 SEO del producto (título, descripción y handle) revisado en el Admin.
- [ ] 🆂 Redirección de la URL del producto anterior → `/`.

## 13. Accesibilidad

- [ ] 🅲 «Saltar al contenido» funciona. Todo se puede usar con el teclado (menú, FAQ, galería, variantes, cantidad, carrito) con foco visible.
- [ ] 🅲 FAQ con `details`/`summary`; pasos con «Paso N:» oculto; galería con botones etiquetados; stock con `role="status"`.
- [ ] 🅲 Iconos, bandera e isotipos decorativos con `aria-hidden` o `alt=""`.
- [ ] 🅲 Contraste: texto pequeño dorado con `--g-gold-text` (#7A5A24), nunca `#B88A3B` sobre crema.
- [ ] 🅲 Objetivos táctiles ≥ 44 px (botones de 50 px).
- [ ] 🅲 Con `prefers-reduced-motion` no hay transiciones GARELON.

## 14. Rendimiento

- [ ] 🅲 Solo la imagen de la portada tiene `loading="eager"` + `fetchpriority="high"`; todas las demás `loading="lazy"`.
- [ ] 🅲 Todas las imágenes llevan `srcset`, `sizes`, `width` y `height`.
- [ ] 🅲 Solo se cargan las imágenes seleccionadas (sin assets huérfanos).
- [ ] 🅲 Ninguna librería JS ni script de terceros nuevo en el tema. Píxeles de anuncios solo por Admin o app.
- [ ] 🆂 PageSpeed/Lighthouse móvil de la home: el LCP es la imagen de la portada; sin CLS visible en cabecera ni portada.

## 15. Responsive (probar cada ancho)

| Ancho | Sin scroll horizontal | Cabecera OK | Barra en 1 línea | Precio + CTA en 1.ª pantalla | Secciones legibles |
|---|---|---|---|---|---|
| 320 px | [ ] | [ ] | [ ] | (tolerado: CTA ~28 px por debajo) | [ ] |
| 360 px | [ ] | [ ] | [ ] | [ ] | [ ] |
| 375 px (667 alto) | [ ] | [ ] | [ ] | [ ] | [ ] |
| 390 px | [ ] | [ ] | [ ] | [ ] | [ ] |
| 430 px | [ ] | [ ] | [ ] | [ ] | [ ] |
| 768 px | [ ] | [ ] | [ ] | — | [ ] |
| 1024 px | [ ] | [ ] (menú en 1 fila) | [ ] | — | [ ] |
| 1440 px | [ ] | [ ] | [ ] | — | [ ] |

- [ ] 🅲 En móvil, la galería de `#comprar` se desliza y el contador funciona (1 / N).
- [ ] 🅲 Los textos incrustados de las imágenes usadas se leen a 360 px, o su información también está en HTML.

## 16. Validación técnica

- [ ] 🅲 Todos los `templates/*.json`, `sections/*-group.json` y `config/*.json` son JSON válidos.
- [ ] 🅲 Validador de plantillas, schemas y assets (§ anexo B.2): `OK`.
- [ ] 🅲 Theme Check: **0 errores**, solo los 9 avisos de Dawn de la línea base.
- [ ] 🅲 Sin errores de JavaScript en consola (home, ficha, carrito, página de contacto).
- [ ] 🅲 El diff solo toca lo necesario: contenido, assets del producto y los puntos de §16.3. Sin cambios en los JS de Dawn, el checkout, la cabecera móvil ni los ajustes de diseño.

## 17. Publicación (dueño, en Shopify)

- [ ] 🆂 ZIP subido como tema nuevo (o sincronizado por GitHub), **sin publicar** todavía.
- [ ] 🆂 En el editor: producto nuevo elegido donde haga falta; revisar Portada, Compra y Llamada final.
- [ ] 🆂 Vista previa revisada en un móvil real y en escritorio con esta checklist.
- [ ] 🆂 Compra de prueba (o pedido de prueba con el gateway de pruebas) hasta el checkout.
- [ ] 🆂 Publicar. Conservar el tema anterior duplicado como copia de seguridad.
- [ ] 🆂 Anuncios, catálogo y píxeles apuntan al producto o la URL nueva.

## 18. Informe de Claude Code (§27)

- [ ] Archivos modificados, creados y borrados.
- [ ] Tabla de imágenes (usadas / descartadas + motivo) y orden de la galería.
- [ ] Orden final de la home.
- [ ] Claims transformados y textos dudosos en imágenes.
- [ ] Cambios de código fuera del contenido, justificados.
- [ ] Evidencia de limpieza (grep vacío).
- [ ] Pruebas hechas con resultados y **lo que no se pudo probar**.
- [ ] Respuestas de políticas (§19).
- [ ] Tareas del Admin para el dueño.
- [ ] Riesgos pendientes.
