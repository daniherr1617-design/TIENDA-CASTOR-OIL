# GARELON · Reconstrucción limpia del tema (Pulsera Rosario Virgen María)

Rama `claude/rosary-clean-rebuild`, creada desde `main`. No se ha tocado `main`, `claude/rosary-bracelet`, `claude/fondue-mug` ni `baseline/garelon-fondue`. Arquitectura y reglas: `docs/garelon/GARELON_ARQUITECTURA_V2.md` y Master 2.0 (R31).

> **Estado de las pruebas:**
> - **Probado localmente:** render que imita Shopify (Liquid real del tema con liquidjs y JS real de Dawn, con datos simulados).
> - **Probado en el ZIP descomprimido:** las mismas validaciones sobre una copia nueva del ZIP.
> - **No probado en Shopify** (ni vista previa ni publicado): este entorno no tiene acceso a la tienda.

## 1. Cómo se construyó (de menos a más)

| Commit | Fase | Validación al cerrar la fase |
|---|---|---|
| `b2adb07` | 0 · Dawn 16.0.0 oficial, byte a byte (Shopify/dawn v16.0.0) | Theme Check 0 errores / 9 avisos de Dawn |
| `56685f0` | A · home mínima (una sección `rich-text`) + `tools/` de instalabilidad | `GET /` → 200, ruta inexistente → 404 (12/12) |
| `bb18053` | B · marca, colores, cabecera, pie | 37/37 |
| `b25a05d` | C · portada | 53/53 |
| `9d67364` | D · compra con el formulario de Dawn y packs como variantes | 84/84 |
| `ed7ada9` | E1 · resto de la home, sección a sección | 111/111 |
| `2f43d17` | E2 · ficha, compra fija, 404, contacto, carrito | 139/139 |
| `42421aa`, `899ce92` | Validación final: límite de secciones, nombre del tema, traducciones en todos los idiomas | 147/147 · ZIP descomprimido OK |

## 2. Home

Barra superior («Una joya para llevar contigo o regalar») → cabecera (Inicio · Detalles · Preguntas frecuentes · Contacto) → **portada** → **compra** (título, valoración real, precio, «Un símbolo de tu fe, contigo cada día.», packs, precio de cada pack, Añadir al carrito + pago dinámico) → **Compra con tranquilidad** → **opiniones reales** → **Una joya que va más allá del detalle** → **Detalles de la pulsera** → **Un detalle para momentos que importan** → **Preguntas frecuentes** → **cierre** («Elegir mi pulsera») → pie.

## 3. Imágenes

| Archivo | Decisión | Uso / motivo |
|---|---|---|
| `imagen 3.png` (pulsera en la muñeca: medalla, cruz, cuentas tricolor) | **Usada** | `producto-principal`: portada (LCP), galería de la ficha (1.ª) y de la home (3.ª) |
| `imagen 3.png` (recorte de 600 px) | **Usada** | `producto-detalle`: «Detalles de la pulsera» de la ficha y galerías. Acerca medalla, cruz y cuentas sin alterar nada |
| `imagen 2.png` (manos en oración con la pulsera, sin texto) | **Usada** | `producto-oracion`: «Una joya que va más allá del detalle» y galerías. Coherente con `imagen 3` |
| `imagen 4.png` (pulsera completa sobre marfil) | **Usada · aprobada por el propietario** | `producto-completa`: galería de la home (1.ª) y de la ficha (2.ª). Vista clara de la pulsera completa |
| `Imagen 1.png` (infografía «Detalles de la pulsera») | **Usada · aprobada por el propietario** | `producto-infografia`: imagen de «Detalles de la pulsera» en la home y 4.ª de ambas galerías. Se puede abrir ampliada (1254 px) para leer el texto |
| `Logo.png` | **Usada** | Isotipo (cabecera), favicon e icono de iOS |
| `Logo y marca.png` | **Usada** | Logo completo (pie) y letras GARELON (cabecera) |
| `referencias/IMAGEN 1-10.png` y logos antiguos | No aplican | Son del sérum (producto anterior) |
| 6 originales del proveedor (fondo rosa, 2.º ángulo, «PRODUCT DETAILS» con 14K, mujer rezando, mujer con la pulsera, «To My Godmother») | **No están en el repositorio** | No se han podido revisar. La de 14K y la de «To My Godmother» quedan descartadas por regla. Las demás, pendientes |

**Verificación del propietario:** `Imagen 1.png` e `imagen 4.png` corresponden al producto real y están aprobadas para uso en la tienda. Sustituye a la revisión anterior, que las había descartado por una supuesta diferencia en la cruz: esa conclusión era incorrecta y **no debe volver a usarse para excluirlas**.

Se usan **5 imágenes (4 archivos + 1 recorte)**, todas sin retocar: solo redimensionadas a WebP. Orden de las galerías: ficha `principal,completa,detalle,infografia,oracion`; home `completa,detalle,principal,infografia,oracion` (la portada ya enseña `principal`). La galería usa por defecto estas imágenes del tema, porque la multimedia que importa DSers puede traer la de 14K. Cuando la multimedia del producto esté revisada, el ajuste «Imágenes» de la compra y de la ficha puede pasar a «Multimedia de Shopify».

## 4. Packs

- Opción **«Pack»** en Shopify: «1 pulsera», «2 pulseras», «3 pulseras». Cada pack es una variante real con su propio precio, y se añade al carrito con **cantidad 1**: no hay selector de cantidad.
- Se eligen con el selector de variantes de Dawn: botones en una fila desde 320 px.
- Debajo, «Precio de cada pack» lista el precio real de cada variante. El precio por pulsera y el ahorro solo aparecen si los precios reales lo justifican.
- **Sin la opción «Pack» en Shopify**, la tienda vende la variante actual y no rompe nada. En el editor sale un aviso; el cliente no lo ve.
- **Fulfillment** (manual al principio): un pedido «2 pulseras» × 1 = comprar **2 unidades** en AliExpress; «3 pulseras» = 3 unidades. El tema no se comunica con DSers.

## 5. Opiniones (Judge.me)

- **«GARELON Opiniones»** muestra el bloque de app de Judge.me, que se añade desde el editor, y/o la valoración de Shopify (`reviews.rating` / `reviews.rating_count`).
- **Sin datos reales**, ni sección, ni estrellas, ni «0 opiniones»; solo un aviso en el editor.
- **Valoración junto al precio:** la pinta el bloque «Valoración» de Dawn, solo con los metafields.

## 6. Pruebas

| Prueba | Repositorio | ZIP descomprimido |
|---|---|---|
| `tools/garelon_check.py` (instalabilidad; `--strict-root` en el ZIP) | OK | OK |
| `tools/test_garelon_check.py` (20 roturas típicas detectadas + tema intacto) | 21/21 | — |
| Theme Check 3.30.1 (configuración por defecto) | 0 errores · 9 avisos de Dawn | 0 errores · 9 avisos de Dawn |
| Theme Check `theme-check:all` | Idéntico a Dawn 16.0.0 limpio | Idéntico |
| Liquid (Ruby 5.14) estricto | 0 errores | 0 errores |
| Render + routing + regresión + responsive (Playwright, JS real de Dawn) | 147/147 | 147/147 |
| ZIP = repositorio byte a byte | — | Sí |

**Qué cubren las 147 pruebas:**
- **Routing:** `GET /` → 200 con la plantilla index, con y sin producto, contacto o políticas. `/ruta-inexistente-garelon` y `/esto-no-deberia-existir-garelon-test` → 404 limpia.
- **Cabecera:** sin Catálogo; de 320 a 430 px menú · logo · carrito sin solapes; menú en una fila a 1024 y 1440 px.
- **Pie:** legales en orden y solo los que existen.
- **Portada:** precio y CTA en la primera pantalla de 320×640 a 430×932.
- **Compra:**
  - el pack cambia precio y variante;
  - el carrito recibe la variante con cantidad 1 y muestra «Pack: 2 pulseras» × 1;
  - pack agotado; con precios iguales por unidad no hay ahorro.
- **Opiniones:** con y sin datos reales.
- **Claims y SEO:** sin claims prohibidos; frase de fe una vez; un H1 y un Product JSON-LD por página.
- **Accesibilidad:** FAQ con teclado; el menú móvil se cierra al pulsar un ancla; «Saltar al contenido» funciona.
- **Ficha:** compra fija en móvil.
- **Páginas:** contacto y carrito.
- **Robustez:** el editor sin errores JS; los enlaces internos responden 200; sin scroll horizontal a 320, 360, 375, 390, 430, 768, 1024 y 1440 px.

## 7. Shopify: qué falta (no probado aquí)

Este entorno no puede abrir `8ndnek-0x.myshopify.com` (la política de red lo bloquea) y no hay Shopify CLI con sesión. Ni la subida ni la vista previa ni la tienda publicada se han podido probar.

Tampoco se han probado:
- el checkout ni los pagos;
- DSers;
- el widget real de Judge.me;
- los metafields reales.

El módulo `standard-events.js` de Shopify se sustituyó en las pruebas por uno equivalente, porque el proxy bloquea `cdn.shopify.com`.

## 8. Pasos en Shopify (en orden)

1. **Copia de seguridad:** Tienda online › Temas › tema publicado › ⋯ › Duplicar.
2. **Subir sin publicar:** Tienda online › Temas › Agregar tema › Subir archivo zip › `GARELON-PULSERA-ROSARIO-CLEAN-v1.zip`.
   - Si Shopify muestra errores, cópialos literalmente.
   - En ⋯ › Editar código comprueba que existe `templates/index.json`.
3. **Producto** (Productos › la pulsera):
   - título «Pulsera Rosario Virgen María» y descripción base aprobada, sin 14K ni claims;
   - opción **Pack** con «1 pulsera», «2 pulseras», «3 pulseras», en ese orden, con el precio real de cada una;
   - precio comparado solo si es real.
4. **Multimedia del producto:** quita la imagen con «14K» y la de «To My Godmother», y deja solo fotos fieles.
5. **Contacto:** Tienda online › Páginas › página «Contacto» con handle `contacto` y plantilla `contact`.
6. **Políticas:** Configuración › Políticas.
   - Rellena devoluciones (14 días de desistimiento), envíos, privacidad, términos y aviso legal con los datos reales de la empresa.
   - Opcional: página `politica-de-cookies`.
7. **Judge.me:**
   - Personalizar › Página de inicio › «GARELON Opiniones» › Añadir bloque › Apps › widget de Judge.me.
   - Lo mismo en la plantilla de producto.
   - Activa en Judge.me la sincronización de la valoración con Shopify.
8. **Envíos:** Configuración › Envío y entrega › tarifas reales para España.
9. **Vista previa** en móvil y escritorio. Haz un pedido de prueba de cada pack para comprobar 1, 2 y 3 unidades en el fulfillment manual.
10. **Publicar** solo si la vista previa está bien.
