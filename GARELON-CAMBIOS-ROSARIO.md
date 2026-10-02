# GARELON · Migración a la Pulsera Rosario Virgen María (v1 + v1.1)

> **v1.1 (02/10/2026): confianza + fe + opiniones + packs.** Frase de fe antes de los packs, packs 1/2/3 pulseras como variantes reales (cantidad 1), bloque «Compra con tranquilidad» (14 días de desistimiento), resumen de valoración real junto al precio y FAQ de devoluciones. Detalle en la **sección 9**; las secciones 1-8 están actualizadas donde la v1.1 cambia algo.

Rama `claude/rosary-bracelet`, creada desde `b45d132` (última versión de la Taza Fondue, la que está subida a Shopify). La Taza Fondue queda congelada en `baseline/garelon-fondue` (`b45d132`). `main`, `claude/fondue-mug` y la PR #2 no se han tocado.

Todo lo de este documento está **probado en un render local que imita Shopify** (Liquid real del tema + JS real de Dawn, datos simulados). **No** está probado en Shopify real, ni el checkout, ni AliExpress.

---

## 1. Decisiones

| Tema | Decisión | Motivo |
|---|---|---|
| Tema | **Se mantiene Dawn 16 + capa GARELON** | Dawn ya da formulario de producto, variantes, carrito/cart drawer, checkout, accesibilidad y rendimiento. El diseño de joyería se consigue con la capa GARELON. No se evaluó otro tema gratuito en profundidad: migrar no aportaba nada que Dawn no pueda hacer y sí riesgo (formulario, apps, reseñas). Ningún tema de pago |
| Competidor (Veysors) | **No se ha podido estudiar**: el proxy de red del entorno bloquea `veysors.com` (y `aliexpress.com`) | No se ha inventado cómo es. Se ha seguido la dirección visual del prompt |
| Nombre | Pulsera Rosario Virgen María (corto: Pulsera Rosario) | Es natural y claro en España; no se inventan colecciones ni materiales |
| Paleta | Blanco `#FFFFFF` y marfil `#FAF7F2` dominantes; champán `#F3ECDF` (barra superior) y crema `#F7F1E6` (cierre); dorado de acción `#86672F` (blanco encima 5,3:1); dorado de texto `#7A5A24` (≥ 5,4:1 en todos los fondos); carbón `#2A2622` | Joyería luminosa; el dorado solo como acento y siempre AA. Es una decisión **de este producto**, no una regla GARELON |
| Tipografía | **Lora + Inter, sin cambios** | Funcionan en móvil, son de la biblioteca de Shopify (sin fuentes externas) y Lora acompaña bien a las letras clásicas del logo |
| Logo | Símbolo dorado aprobado (`Logo.png`) + letras GARELON del logo completo (`Logo y marca.png`) | Cabecera: símbolo + «GARELON» dorado en horizontal (el logo apilado no se lee a 56 px de alto). Pie: logo completo apilado. Cierre: símbolo. Favicon: **derivación técnica plana** del mismo símbolo (dorado sólido `#8C6A2C`): el acabado metálico se perdía a 32 px. Ningún logo sobre la pulsera |
| Packs | v1: desactivados. **v1.1: activos** (`garelon_packs` en home y ficha): opción «Pack» = 1 pulsera / 2 pulseras / 3 pulseras, cada uno UNA variante real con cantidad 1 | Pedido del dueño (v1.1). Precios, IDs y SKU salen de Shopify |
| Variantes | v1.1: el bloque de packs sustituye al selector de variantes y al de cantidad. Mientras Shopify tenga una sola variante, la tienda vende esa variante con el formulario estándar y el aviso sale solo en el editor | No romper el storefront antes de configurar los packs |
| Envío gratis | Bloque presente pero **desactivado** (`show_free_shipping: false`, también por defecto en el schema). En el editor sale un aviso | Tarifa 0 € no verificada |
| Barra superior | «Una joya para llevar contigo o regalar», sin bandera | Era «Envío gratis a España» (no verificado). Cabe en una línea a 320 px |
| Notas del carrito | Vuelven los textos de Dawn: «Impuestos incluidos. Descuentos y envío calculados en la pantalla de pago.» | Decían «Envío gratis según las zonas…» |

## 2. Imágenes

Las **6 imágenes originales del proveedor no están en el repositorio** (ni adjuntas), así que no se ha podido hacer la comparación con la fuente de verdad física. Las 4 imágenes de producto de `main` son las mejoradas/generadas. Se han comparado entre sí:

| Archivo | Tipo | Original/generada | Fidelidad | Decisión | Rol | Motivo |
|---|---|---|---|---|---|---|
| `imagen 3.png` | Muñeca, primer plano | Mejorada (de ORIGINAL 5, por la composición) | Alta entre las disponibles | **Usada** | Principal: portada, galería, 404, miniaturas de respaldo | Pulsera protagonista; medalla, cruz y cuentas bien visibles; cruz colgante (coherente con «Cross Charm» del proveedor y con `imagen 2`) |
| `imagen 3.png` (recorte) | Detalle | La misma | Alta | **Usada** | «Detalles de la pulsera» y galería | Recorte de 600 × 600 px (sin ampliar) en medalla, cruz y cuentas |
| `imagen 2.png` | Lifestyle, oración | Mejorada (de ORIGINAL 4, sin el texto en inglés) | Media-alta (pulsera pequeña) | **Usada** | «Una joya que va más allá del detalle» y galería | Emocional y sereno; la pulsera coincide con `imagen 3` |
| `imagen 4.png` | Pulsera completa, fondo marfil | Generada | **Discrepancia** | **Descartada (pendiente)** | — | La cruz va intercalada en la cadena, no colgante; no se ven los aros de ajuste. Si el original confirma la cruz intercalada, sería la mejor imagen principal |
| `Imagen 1.png` | Infografía en español | Generada | Discrepancia + packaging | **Descartada** | — | Misma cruz intercalada; muestra una **caja de regalo** no confirmada; texto incrustado. Sus datos están en HTML |
| `Logo.png` | Símbolo | Logo aprobado | — | **Usado** | Isotipo, favicon, iOS | — |
| `Logo y marca.png` | Símbolo + GARELON | Logo aprobado | — | **Usado** | Pie (completo) y letras de la cabecera | — |

**Discrepancia física encontrada:** cruz intercalada (`imagen 4`, `Imagen 1`) frente a cruz colgante (`imagen 2`, `imagen 3`). Una de las dos versiones no es el producto real. Se ha elegido la colgante por coherencia con «Cross **Charm**» del proveedor; **confírmalo con las fotos originales antes de publicar**.

Assets (WebP calidad 82, sin filtros; el producto no se ha tocado): `garelon-rosario-principal-{480,720,1080}` (15/28/60 KB), `garelon-rosario-detalle-{480,600}` (21/30 KB), `garelon-rosario-oracion-{480,720,1080}` (26/45/81 KB), `garelon-rosario-isotipo-{96,192}`, `garelon-rosario-logo-{240,480}`, `garelon-rosario-wordmark-{240,480}`, `garelon-rosario-favicon-32.png`, `garelon-rosario-apple-touch-180.png`. A los logos solo se les ha quitado el margen transparente y el polvo de píxeles casi invisibles (alfa < 24).

## 3. Home (orden final)

1. Barra superior · 2. Cabecera (Inicio · La pulsera · Detalles · Regalo · Preguntas · Contacto)
3. **Portada**: «Joyería con significado» · **H1 Pulsera Rosario Virgen María** · «Una pieza delicada de acero inoxidable con acabado dorado, medalla de la Virgen María, cruz y cuentas tricolor.» · precio de Shopify · «Elegir mi pulsera» → `/#comprar` · «Ver los detalles →». En móvil la foto se encuadra en horizontal (CSS, ajuste nuevo `mobile_crop`) para que la pulsera se vea grande con H1, precio y botón en la primera pantalla desde 320 × 640
4. **Compra** (`#comprar`): «Pulsera Rosario» · título · (valoración real, si existe) · precio · «Una joya delicada para llevar a diario o regalar en un momento especial.» · **«Un símbolo de tu fe, contigo cada día.»** · **Elige tu pack** (1 / 2 / 3 pulseras) · «Añadir al carrito» + pago dinámico. Nada debajo (sin envío gratis ni stock). Galería: detalle → principal → oración
5. **Compra con tranquilidad** (`#tranquilidad`, v1.1): 14 días de desistimiento + garantía legal aplicable + enlace a la política de devoluciones
6. Opiniones (solo reales; sin reseñas, 0 px)
7. **Una joya que va más allá del detalle** (`#significado`, imagen de oración; hace también de lifestyle)
8. **Detalles de la pulsera** (`#detalles`): Acero inoxidable (acabado dorado pulido) · Medalla de la Virgen María · Cruz y cuentas tricolor · Diseño ajustable + nota de origen y longitud
9. **Un detalle para momentos que importan** (`#regalo`): Bautizo · Primera comunión · Confirmación · Navidad · Pascua · Otras ocasiones religiosas
10. FAQ (10 preguntas) · 11. Cierre: «Una joya con significado» + precio + «Elegir mi pulsera» · 12. Compra fija (móvil)

v1.1: la barra de confianza (¿Dudas? · Envíos · Devoluciones) sale de la home y de la ficha: «Compra con tranquilidad» cubre las devoluciones, el envío está en la FAQ y en la pestaña de la ficha, y el contacto en la cabecera, la FAQ y el pie. La sección sigue en el tema.

Se retiraron: cómo funciona, momentos, compartir y colores (eran de la taza). El «lifestyle» va fusionado con «significado» (solo hay dos fotos fieles y no se repiten en el cuerpo de la home).

## 4. Ficha

Galería del tema (principal → detalle → oración) · antetítulo «Joyería con significado» · H1 título de Shopify · valoración real (bloque GARELON, solo con datos) · precio · «Acero inoxidable con acabado dorado, medalla de la Virgen María, cruz y cuentas tricolor.» · **«Un símbolo de tu fe, contigo cada día.»** · **Elige tu pack** · botones · descripción de Shopify · pestañas **Detalles** (material, elementos, longitud, nota de origen) · **Qué incluye** («Las pulseras del pack que elijas: 1, 2 o 3 Pulseras Rosario Virgen María.») · **Envíos y devoluciones** (políticas) · después: **Compra con tranquilidad** → opiniones → detalles → FAQ → compra fija.

## 5. FAQ (home, ficha y página de preguntas frecuentes, idéntica)

1. ¿De qué material está hecha? — Según la información facilitada por el proveedor, está fabricada en acero inoxidable con acabado dorado pulido.
2. ¿Qué elementos tiene? — La pulsera incorpora una medalla de la Virgen María, una cruz y cuentas de rosario tricolor.
3. ¿Es ajustable? — La imagen del proveedor muestra tres aros destinados al ajuste de la longitud.
4. ¿Qué longitud tiene? — La imagen del proveedor indica una longitud de 7,87 pulgadas, que equivalen a unos 20 cm. (7,87 × 2,54 = 19,99 cm)
5. ¿Qué incluye mi pedido? — Las pulseras del pack que elijas: 1, 2 o 3 Pulseras Rosario Virgen María. (v1.1)
6. ¿Para qué ocasiones puede ser un buen regalo? — Puede ser un detalle con significado para bautizos, primeras comuniones, confirmaciones, Navidad, Pascua u otras ocasiones religiosas.
7. ¿Puedo llevarla a diario? — El proveedor la presenta como una pieza diseñada para lucir a diario.
8. ¿Cuándo recibiré mi pedido? — Consulta los plazos y condiciones de entrega actualizados en nuestra política de envío (enlace).
9. **¿Puedo devolver mi pedido?** (v1.1) — En compras online dispones, con carácter general, de 14 días naturales desde la recepción para ejercer tu derecho de desistimiento. Consulta las condiciones y posibles excepciones en nuestra política de devoluciones (enlace a `/policies/refund-policy`).
10. ¿Qué hago si tengo un problema con mi pedido? — Contacto + política de devoluciones (enlaces).

Sin pregunta de cuidados (dato NO DISPONIBLE). 404: «Esta página no está disponible» · «Vuelve a GARELON y descubre nuestra Pulsera Rosario Virgen María.» · «Ver la pulsera» → `/#comprar`.

## 6. Cambios de código (fuera del contenido)

- `snippets/garelon-fallback-image.liquid`: claves `principal`, `detalle`, `oracion`; anchos por clave (`detalle` = 480/600); `src_only` para miniaturas de respaldo.
- `snippets/garelon-gallery.liquid`: claves nuevas; `context: 'home'` empieza por el detalle (la portada ya muestra la principal).
- `snippets/garelon-logo-fallback.liquid`, `layout/theme.liquid`, `sections/garelon-final-cta.liquid`: identidad nueva (símbolo, letras doradas, logo completo, favicon).
- `snippets/garelon-cart-thumb.liquid`, `sections/garelon-sticky-atc.liquid`, `snippets/garelon-choice.liquid`: sin muestras de la taza; respaldo = imagen principal del tema.
- `snippets/garelon-icon.liquid` + listas de iconos de las secciones: fuera los de cocina (taza, tenedor, vela, chocolate…); dentro `medal`, `cross`, `beads`, `chain`, `rings`, `gem`, `material`, `star`, `calendar`.
- `snippets/garelon-nav.liquid` + `sections/header.liquid`: la navegación tiene 4 enlaces **editables** (texto + ancla) en la cabecera, en vez de etiquetas fijas en el código.
- `sections/garelon-features.liquid`: ajuste `media_layout` (imagen ancha o al lado de las tarjetas) y modo «solo etiquetas» centrado.
- `sections/garelon-hero.liquid`: ajuste `mobile_crop`.
- `snippets/garelon-free-shipping.liquid`, `featured-product`, `main-product`: «Envío gratis» desactivado por defecto + aviso en el editor.
- `assets/garelon.css`: tokens dorados (`--g-accent*`), antetítulo con línea fina, layouts nuevos; fuera los puntos de color de la taza.
- `config/settings_data.json`: 5 esquemas de color y descripción de marca. `locales/es.json`: notas del carrito de Dawn.
- Opciones `fallback_image` de todas las secciones GARELON con las claves nuevas; valores por defecto neutros en `garelon-colors`.
- Archivos de la raíz: fuera `LOGO.png` e `imagen1-8.png` (taza; siguen en `baseline/garelon-fondue`); dentro las 6 imágenes de la pulsera de `main`.
- Borrados: 25 `assets/garelon-fondue-*` y `assets/garelon-wordmark-480.webp` (el nombre GARELON negro del sérum/taza; la nueva identidad usa las letras doradas del logo aprobado).

## 7. Pruebas (render local)

- v1.1: batería ampliada a **146/146** (sección 9.6).
- v1: batería de la pulsera: **101/101** (contenido, limpieza, claims, compra de una variante, variantes reales, agotado, «No disponible», carrito, compra fija, FAQ con teclado, navegación, 404, SEO, contraste, responsive a 320–1440 px, primera pantalla a 320×640, 360×800, 375×667, 390×844 y 430×932, y regresión del componente de packs).
- Theme Check: **0 errores**, los 9 avisos de siempre de Dawn 16. Validador de plantillas y assets: OK. JSON válidos.
- Capturas: `docs/garelon/capturas/rosary-v1/` (precio **simulado** 19,99 €).

**No probado:** Shopify real (vista previa, editor, apps), checkout, pagos, envío, AliExpress, fulfillment ni pedidos.

## 8. MANUAL TODO

**Shopify Admin**
1. Importar o conectar el producto de AliExpress y confirmar el método (AutoDS, DSers, app, manual u otro): **no se ha asumido ninguno**.
1b. (v1.1) **Crear los packs**: opción «Pack» con los valores «1 pulsera», «2 pulseras», «3 pulseras» (en ese orden), un precio real por variante (los ahorros solo aparecen si los precios los justifican), SKU y stock de cada una. Hasta entonces el editor muestra el aviso en la zona de compra.
2. Crear o revisar el producto: título «Pulsera Rosario Virgen María»; descripción limpia (brief §7, sin 14K ni claims de AliExpress).
3. Precio. Precio comparado solo si existe de verdad.
4. SKU y stock de cada variante (packs incluidos).
5. Multimedia: subir las fotos elegidas y comprobar que el importador no añade la infografía con «14K» ni otras con texto o packaging.
6. Elegir el producto en el editor (Portada, Compra, Llamada final, Opiniones y Compra fija de la home) o retirar la Taza Fondue del canal Tienda online: si no, las secciones pueden mostrar la taza.
7. Envío real (zonas, tarifas, plazos). Si hay tarifa 0 €, activar «Envío gratis» en el bloque de la compra (home y ficha) y, si quieres, en la barra superior.
8. Revisar la política de envío y la de devoluciones (joyería: higiene, plazos, dirección): no se han reescrito. (v1.1) **La política de devoluciones debe reflejar correctamente el derecho de desistimiento aplicable** (14 días naturales desde la recepción, cómo ejercerlo, costes, excepciones) y no contradecir «Compra con tranquilidad» ni la FAQ. **Garantía legal:** comprobar que GARELON vende como comerciante a consumidores en España y que la política es coherente; solo entonces se puede cambiar «garantía legal aplicable» por «3 años de garantía legal».
9. SEO del producto (título y meta del brief §7), handle, y SEO + imagen para redes de la home (Preferencias).
10. Redirección de la URL de la Taza Fondue → `/`.
11. Reseñas: solo una app real con su bloque en «GARELON Opiniones» (home y ficha); si importa opiniones, que sean del mismo producto y reales. El resumen junto al precio aparece solo cuando la app rellena `reviews.rating` y `reviews.rating_count`.
12. Duplicar el tema publicado antes de subir este.

**AliExpress / fulfillment**
13. Validar el proveedor y el producto exacto (cruz colgante o intercalada, número de cuentas, aros).
14. Confirmar 14K solo con una fuente fiable del mismo producto (y aun así, documentarlo antes de publicarlo).
15. Validar SKU, variantes, stock, plazos y método de envío.
15b. (v1.1) **Mapping de los packs.** La ficha de AliExpress es de UNA pulsera; el tema no le dice nada al proveedor. Según la integración elegida (DSers, AutoDS, app de AliExpress, bundle, manual…), comprobar: «1 pulsera» → 1 unidad del proveedor; «2 pulseras» → **2 unidades del mismo SKU**; «3 pulseras» → **3 unidades del mismo SKU**. No se ha configurado ningún mapping.
16. Subir al repositorio las 6 imágenes originales del proveedor.

**Pedido de prueba**
17. Pedido de prueba completo (carrito → checkout → pago de prueba → pedido en AliExpress/app) con dirección española; comprobar variante, cantidad 1, plazos y seguimiento antes de lanzar anuncios. (v1.1) **Un pedido de prueba por pack: 1, 2 y 3 pulseras**, comprobando que el proveedor recibe 1, 2 y 3 unidades.

---

## 9. Ronda v1.1 · confianza + fe + opiniones + packs

Sobre el HEAD `fa741e8` de `claude/rosary-bracelet` (sin reiniciar la migración, sin tocar `main`, `claude/fondue-mug` ni la PR #2).

### 9.1 Frase de fe

- **Copy:** «Un símbolo de tu fe, contigo cada día.» (la preferida del dueño, sin cambios).
- **Dónde:** zona de compra de la home y ficha, **inmediatamente antes de «Elige tu pack»** (después de título, valoración, precio y descripción breve: el precio se queda arriba porque Dawn lo actualiza al cambiar de pack). Una vez por página; no aparece en ningún otro sitio.
- **Diseño:** bloque nuevo `garelon_quote` (`snippets/garelon-quote.liquid`): franja centrada, fondo champán muy claro `#FBF7EF`, borde dorado fino de 1 px, radio 12 px, Lora cursiva 16,5 px (17,5 px en escritorio, 14,5 px por debajo de 360 px), sin iconos ni sombras. Una línea de 320 a 1440 px (dos como mucho en la columna estrecha de 768 px), ≤ 72 px de alto.
- Sin promesas espirituales (protección, milagros, suerte, bendiciones).

### 9.2 Packs 1 / 2 / 3 pulseras

- **Arquitectura Shopify:** opción «Pack» → «1 pulsera», «2 pulseras», «3 pulseras». Cada valor es **UNA variante real** y se añade con **quantity=1** («2 pulseras» × 1, nunca «1 pulsera» × 2). Probado: el carrito recibe la variante del pack con `quantity=1`, sin selector de cantidad.
- **Componente:** se reutiliza `garelon-packs` (genérico, probado con la taza) sin la lógica de colores: con una sola opción no pinta botones; los comentarios, avisos y textos de ayuda ya no hablan de Color × Pack ni de «unidades».
- **Copy:** título «Elige tu pack»; tarjetas «1 pulsera · Individual», «2 pulseras · Pack de 2», «3 pulseras · Pack de 3», con el precio real de cada variante. Sin «Más vendido», «Favorito», «Oferta limitada», «Solo hoy», «Quedan X» ni «viral».
- **Ahorro y precio por unidad: solo si es verdad.** Con precios iguales por unidad no se muestra nada más que el precio. Si los precios reales lo justifican, aparecen solos: precio/unidad, «Ahorra X €» (= precio de «1 pulsera» × N − precio del pack) y la insignia «Mejor precio/unidad» en el único pack con el precio por unidad más bajo. Ajuste nuevo `unit_price_only_savings` (activo). Sin «Sin descuento», sin porcentaje, sin precio tachado.
- **Nada escrito a mano:** ni precios, ni compare-at, ni descuentos, ni porcentajes, ni SKU, ni IDs. Probado en las plantillas.
- **Shopify todavía sin packs:** la tienda sigue vendiendo la variante única con el formulario estándar; en el **editor** sale «Configuración de Shopify pendiente o incorrecta para packs» con los pasos («1 pulsera», «2 pulseras», «3 pulseras»). El cliente no ve ningún aviso (tampoco el comentario HTML, que ahora sale solo en el editor).
- **Fulfillment:** ver MANUAL TODO 15b y 17. El tema no sabe nada del proveedor.

### 9.3 Compra con tranquilidad (14 días)

- Sección nueva reutilizable `sections/garelon-assurance.liquid` («GARELON Compra tranquila»).
- **Copy:** escudo lineal dorado · «14 días para cambiar de opinión» · **«Compra con tranquilidad»** · «En compras online dispones de 14 días naturales desde la recepción del pedido para ejercer tu derecho de desistimiento. Además, tus derechos frente a faltas de conformidad están cubiertos por la garantía legal aplicable.» · «Consulta la política de devoluciones» → `/policies/refund-policy` (resuelto por `garelon-url`).
- **Terminología:** «desistimiento» / «14 días para cambiar de opinión». Nunca «garantía de 14 días» ni «sin riesgos». Sin «sin usar», «embalaje original», WhatsApp, teléfonos ni emails: las condiciones viven en la política.
- **Garantía legal:** texto genérico «garantía legal aplicable». No se pone «3 años» porque no se ha podido comprobar en Shopify Admin (MANUAL TODO 8).
- **Dónde:** home justo después de la compra; ficha justo después de la zona de producto. Sin versión compacta junto al botón (no ensuciar la compra).
- **Diseño:** tarjeta marfil `#FAF7F2` ancha (88 rem) sobre blanco, borde dorado fino, radio 20 px, icono en círculo blanco, H2 serif, párrafo centrado ≤ 60 rem, enlace discreto ≥ 44 px. Ajuste `show_card`.
- Si la política de devoluciones está vacía, el editor lo avisa.

### 9.4 Opiniones

- `sections/garelon-reviews.liquid` se mantiene (bloque `@app` o `product.metafields.reviews.rating` / `rating_count`). Nuevo: en páginas que no son la ficha, si la sección no tiene producto elegido usa el primero del catálogo (tienda de un producto), como la portada y la compra.
- **Orden:** compra → tranquilidad → **opiniones** → significado (home); producto → tranquilidad → opiniones (ficha).
- **Resumen junto al precio:** bloque nuevo `garelon_rating` (`snippets/garelon-rating-summary.liquid`): «★★★★★ · 4,6/5 · 12 opiniones» (ejemplo con datos **simulados** del harness), enlazado a `#opiniones`, todo leído de los metafields. Sin valoración o con 0 opiniones no pinta nada. Sustituye en la ficha al bloque «Valoración» de Dawn.
- **Sin reseñas reales:** ni sección, ni estrellas, ni «0 opiniones»; en el editor, el aviso «oculta para los clientes». Ningún dato de reseñas creado en el tema.

### 9.5 FAQ

Nueva pregunta «¿Puedo devolver mi pedido?» (ver sección 5) y «Qué incluye» adaptada a los packs. 10 preguntas, iguales en home, ficha y página de preguntas frecuentes.

### 9.6 Pruebas

- Batería **146/146** (`rtest.js`, render local con el JS real de Dawn y **variantes simuladas**):
  - **Packs (K1-K17):** reconoce «Pack»; 1/2/3 pulseras con su precio; sin ahorro inventado; un único `quantity` oculto = 1; frase justo antes de los packs; cambio de variante y precio; carrito con 4102 × 1 y 4103 × 1 («Pack: 2 pulseras» en el cart drawer); `?variant=`; compra fija; agotado; «No disponible»; ahorro y precio/unidad calculados (4,99 € y 11,98 € con precios simulados 19,99 / 34,99 / 47,99); insignia solo en el mejor; aviso solo en el editor; sin restos de Color × Pack.
  - **Opiniones (R1-R5):** sin reseñas invisible; con metafields simulados, resumen «4,6/5 · 12 opiniones» bajo el título y en la sección; con `@app`, la sección se pinta en su sitio; aviso en el editor.
  - **Confianza (T1-T4):** copy y enlace; «14 días» solo en tranquilidad y FAQ; 0 «garantía de 14 días», «sin riesgos», «sin usar», «embalaje original», WhatsApp.
  - **Responsive (W2):** 320, 360, 375, 390, 430, 768, 1024 y 1440 px en home y ficha: sin scroll horizontal, tarjetas ≥ 44 px, frase compacta, resumen ≥ 44 px.
  - Todo lo anterior de la v1 sigue pasando (ajustado al nuevo orden y a la FAQ de 10).
- Theme Check: **0 errores** (los 9 avisos de siempre de Dawn). Validador y JSON: OK.
- Capturas: `docs/garelon/capturas/rosary-v1.1/` (precios **simulados**).

**No probado:** Shopify real (variantes reales, editor, apps de reseñas), checkout, AliExpress, mapping de packs ni pedidos.

## 10. v1.2 · Diagnóstico del 404 al subir el ZIP v1.1

**Síntoma comunicado:** tras subir `GARELON-SHOPIFY-THEME-PULSERA-ROSARIO-v1.1.zip`, «al entrar en la tienda aparece un ERROR 404». Sin URL exacta, captura ni acceso a la tienda.

### 10.1 Qué se auditó y resultado

| Comprobación | Resultado |
|---|---|
| ZIP v1.1 | 7 carpetas en la raíz, sin carpeta contenedora. Contiene `layout/theme.liquid`, `templates/index.json`, `templates/404.json` y `config/settings_*.json`. Descomprimido es **idéntico byte a byte** al árbol de `05ddf50`. Mismo formato que los ZIP de la fondue que sí se instalaron. |
| `templates/index.json` | JSON válido. Las 10 secciones de `order` existen en `sections/`, sin IDs duplicadas. Cada ajuste y bloque existe en su schema y cada valor es válido (rango y paso, opción de select, booleano, URL, esquema de color, richtext). |
| Schemas (todas las secciones) | Nombres de sección, bloque y preset ≤ 25 caracteres (la causa del 404 anterior, `530cff7`). Sin defaults vacíos y sin default de tipo `url`. Traducciones `t:` presentes. Theme Check: **0 errores** con ValidSchema y JSON Schema de Shopify. |
| Liquid | Todos los `.liquid` parsean con el **motor Ruby oficial de Liquid 5.14 en modo estricto**, el mismo lenguaje que usa Shopify. 0 errores en `b45d132`, `fa741e8` y `05ddf50`. |
| `layout/theme.liquid` | Imprime `content_for_layout` y carga `header-group` y `footer-group`. No tiene redirecciones, `meta refresh`, `<base>` ni lógica que capture la home. |
| JS (`assets/`) | Solo hay una redirección: la de Dawn a `/cart` tras añadir al carrito si no hay drawer. `featured-product` no reescribe la URL (`data-update-url="false"`). |
| URLs | No hay handles hardcodeados (`/products/…`, fondue, taza). CTAs de la home → `/#comprar` y `/#detalles`; logo e Inicio → `routes.root_url`. |
| Sin producto publicado | `/` sigue en 200 (index), sin errores y sin enlaces a `/products/…`. |
| Sin contacto ni políticas | `/` sigue en 200. Solo esas rutas dan 404, y es ADMIN TODO. |
| Bisección (render local) | `/` → 200 index en `b45d132`, `fa741e8` y `05ddf50`. |

### 10.2 Conclusión

**No se ha podido reproducir el 404 en `/` desde el tema** y no se ha encontrado ningún archivo que Shopify pueda rechazar. No se inventa una causa.

- **Si el 404 aparece en `/`:** solo pasa si el tema instalado no tiene `templates/index.json`. Por ejemplo, porque Shopify rechazó al subirlo una sección que la home usa, como en `530cff7`. Shopify muestra entonces la lista de errores de la subida.
- **Si aparece en otra URL:** es una ruta que no existe en la tienda. Puede ser un handle antiguo de la fondue, un producto sin publicar en Tienda online, o una página o política sin crear. Se arregla en el Admin (producto, página, política o redirección), no en el tema.

### 10.3 Cambio en el tema (diagnóstico, solo editor) · **retirado en v1.3 (§11): era engañoso**

`sections/main-404.liquid` muestra un aviso **solo en el editor de temas** (`request.design_mode`). Los clientes no lo ven.

- **En la raíz:** «La home no tiene plantilla instalada…» (falta `templates/index.json`).
- **En otra URL:** «Esta URL no existe en la tienda: /ruta…», con las causas posibles y la redirección.

No cambian diseño, copy, packs, opiniones, carrito ni `templates/404.json`. (Capturas retiradas en v1.3.)

### 10.4 Pruebas nuevas · Shopify Routing / Home 404 (30/30)

El render local ahora imita el routing de Shopify:

- `/` → index (200).
- `/products/<handle>` solo si el producto existe y está publicado.
- `/pages/<handle>` y `/policies/<x>` solo si existen; el resto, plantilla 404 con **HTTP 404**.
- Modos de prueba: sin producto, sin contacto, sin políticas y «tema sin index».

| Grupo | Pruebas |
|---|---|
| Home | `/` y `/?preview_theme_id=…` → 200 index. Las anclas `#comprar`, `#detalles`, `#regalo` y `#preguntas-frecuentes` existen. Clic en el menú desde la home (scroll) y desde otra página (vuelve a `/#…`). |
| Enlaces | Logo e Inicio → `/`. CTAs de la portada y del cierre válidos. |
| 404 legítima | `/pagina-inexistente-de-prueba` y `/products/taza-fondue-chocolate` → 404. |
| Redirecciones | Ninguna redirección JS. En el navegador, `/` se queda en `/`. Sin handles hardcodeados. |
| Producto | La ficha solo existe con producto publicado. Sin producto, la home sigue en 200. |
| Contacto y políticas | Sin crear, no rompen la home. |
| Aviso del editor | Sale en los dos casos y no lo ven los clientes. |

La batería anterior sigue en **146/146**: la prueba Z acepta solo el 404 intencionado de `/pagina-que-no-existe`.

**No probado:** Shopify real. No hay acceso a ninguna tienda ni Shopify CLI con sesión. No se publica nada.

## 11. v1.3 · El 404 sigue en Shopify publicado: corrección del diagnóstico y 404 limpia

**Evidencia nueva (Shopify real, tema v1.2 publicado):**
- `https://8ndnek-0x.myshopify.com/` muestra la plantilla 404.
- En Personalizar › Página de inicio también sale la 404.
- El aviso del editor dice «Esta URL no existe en la tienda: /404».

### 11.1 Qué significa «/404» (demostrado)

En Shopify, **dentro de la plantilla 404, `request.path` vale siempre `/404`**, sea cual sea la URL pedida. Es una limitación conocida: [Shopify/liquid#1714](https://github.com/Shopify/liquid/issues/1714).

Por eso el aviso de v1.2 (§10.3) caía siempre en la rama «otra URL» y nunca podía decir «falta la home». Era un error del diagnóstico, no una pista.

- **Reproducción local:** el render local ahora imita esa regla.
- **Resultado:** con el tema v1.2 y `templates/index.json` ausente, `GET /` da HTTP 404 y el editor muestra exactamente «Esta URL no existe en la tienda: /404», el mismo texto que en Shopify. Una URL inexistente cualquiera muestra el mismo texto.

Lo que sí demuestra la evidencia: Shopify eligió la plantilla 404 para la petición de la home, en la tienda y en el editor (que carga `/`).

- **Única causa del tema que produce esto:** que el tema publicado no tenga una plantilla `index` utilizable (R30).
- **No es una redirección JS:** el tema no tiene ninguna. RT11c lo comprueba ejecutando todo el JS: `/` se queda en `/`.
- **Confirmación en la tienda:** si la barra de direcciones muestra `/` (no `/404`), la causa es la plantilla que falta y no una redirección.

### 11.2 El repositorio no es la causa (repetido sobre `0ceb358`, con herramientas nuevas)

| Comprobación | Resultado |
|---|---|
| Theme Check **3.30.1** (última), configuración `theme-check:all` | 0 errores de schema, JSON o Liquid. Solo los avisos de rendimiento de serie de Dawn (`AssetSizeJavaScript`, etc.). |
| Claves JSON duplicadas (templates, groups, config, locales, schemas) | 0. Shopify las rechaza; el JSON de Python no. |
| Claves `t:` de los schemas | Todas existen en `locales/en.default.schema.json`. |
| Nombres de sección, bloque y preset | ≤ 25 **bytes**, no solo caracteres; el máximo es 25. |
| Defaults no permitidos (`url`, recursos) | Ninguno. |
| Validación estricta de valores contra schemas | 0 errores. |
| Liquid (Ruby) estricto | 0 errores. |
| `layout/theme.liquid` | `{{ content_for_layout }}` sin condiciones. |
| `/404`, `return_to`, `continue_url` o `redirect` en el tema | Nada. |
| Fondue (instalada sin 404) vs rosario | `index.json` con la misma forma (mismas etiquetas HTML y URLs `/#…`). Nuevo: `garelon-assurance`, `garelon_quote` y `garelon_rating`, todos válidos. |

**Conclusión:** la diferencia está entre el ZIP (que contiene un `templates/index.json` válido) y el tema publicado en Shopify (que responde a `/` como si no lo tuviera). Es el caso **B · repositorio ≠ tema publicado**.

**No demostrado:** por qué Shopify no tiene esa plantilla.
- **Causa más probable:** la subida la rechazó o la dejó incompleta. Shopify lo indica en el aviso de errores de la subida, y al guardar el archivo en Editar código.
- **Comprobación pendiente:** sin acceso a la tienda, este entorno no puede ver ese mensaje. Las peticiones a `8ndnek-0x.myshopify.com`, `cdn.shopify.com`, `shopify.dev` y `community.shopify.com` las bloquea la política de red.

### 11.3 Cambio en el tema (v1.3)

- `sections/main-404.liquid` vuelve a la 404 limpia de v1.1 (Dawn + copy GARELON). Se retira el aviso del editor de v1.2 porque daba información falsa.
- `templates/404.json` no cambia.
- No hay ningún «si 404 → home».
- Se borran las capturas de `docs/garelon/capturas/rosary-v1.2/`, que mostraban ese aviso.

### 11.4 Pruebas (render local · **no es Shopify**)

| Prueba | Resultado |
|---|---|
| Routing | 31/31. Nuevas: RT16 (sin `index.json` → 404 limpia), RT16b (sin diagnóstico de ruta) y RT16c (`main-404` no usa `request.path`). El render local pone `request.path = /404` en la 404, como Shopify. |
| Regresión | 146/146. |
| Theme Check | 0 errores / 9 avisos de Dawn. |
| Validación estricta y Liquid (Ruby) | 0 errores. |
| JSON | 68 archivos válidos. |
| Responsive | Sin desbordamiento a 320, 390, 768 y 1440 px. |

**No probado:** Shopify preview ni Shopify publicado (sin acceso).

### 11.5 Qué falta en Shopify (orden de probabilidad)

1. Tienda online › Temas › tema publicado › ⋯ › **Editar código** › carpeta `templates`: ¿aparece `index.json`?
   - **Si NO:** subir el ZIP v1.3 como tema nuevo y copiar literalmente el aviso de errores que muestre Shopify antes de publicar.
   - **Si SÍ:** abrirlo, pulsar **Guardar** y copiar el error que muestre Shopify (valida el archivo al guardar).
2. Al entrar en la tienda, ¿la barra de direcciones muestra `/` o `/404`?
   - **`/`:** la causa es la plantilla (punto 1).
   - **`/404`:** algo redirige; revisar Personalizar › Configuración del tema › Inserciones de apps.
3. Control con Dawn: Temas › Agregar tema › Dawn › Vista previa.
   - **Si Dawn muestra la home:** la tienda funciona y el problema es la instalación de GARELON.
   - **Si Dawn también da 404:** el problema es de la tienda; contactar con el soporte de Shopify.

