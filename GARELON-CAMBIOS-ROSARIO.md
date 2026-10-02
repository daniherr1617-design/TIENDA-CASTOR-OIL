# GARELON · Migración a la Pulsera Rosario Virgen María (v1)

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
| Packs | **Desactivados** (`garelon_packs` fuera de las plantillas; el componente sigue en el código) | Packs no confirmados |
| Variantes | Bloque estándar «Selector de variantes» de Dawn en home y ficha | Con una sola variante no se ve nada; si Shopify tiene variantes reales, aparecen solas |
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
4. **Compra** (`#comprar`): «Pulsera Rosario» · título · precio · «Una joya delicada para llevar a diario o regalar en un momento especial.» · (variantes si existen) · «Añadir al carrito» + pago dinámico. Nada debajo (sin envío gratis ni stock). Galería: detalle → principal → oración
5. Opiniones (solo reales; sin app, 0 px)
6. **Una joya que va más allá del detalle** (`#significado`, imagen de oración)
7. **Detalles de la pulsera** (`#detalles`): Acero inoxidable (acabado dorado pulido) · Medalla de la Virgen María · Cruz y cuentas tricolor · Diseño ajustable + nota de origen y longitud
8. **Un detalle para momentos que importan** (`#regalo`): Bautizo · Primera comunión · Confirmación · Navidad · Pascua · Otras ocasiones religiosas
9. Confianza: ¿Dudas? · Envíos · Devoluciones (sin «Envío gratis» ni «Pago seguro»)
10. FAQ (9 preguntas) · 11. Cierre: «Una joya con significado» + precio + «Elegir mi pulsera» · 12. Compra fija (móvil)

Se retiraron: cómo funciona, momentos, compartir y colores (eran de la taza). El «lifestyle» va fusionado con «significado» (solo hay dos fotos fieles y no se repiten en el cuerpo de la home).

## 4. Ficha

Galería del tema (principal → detalle → oración) · antetítulo «Joyería con significado» · H1 título de Shopify · valoración (solo si hay app) · precio · «Acero inoxidable con acabado dorado, medalla de la Virgen María, cruz y cuentas tricolor.» · variantes (si existen) · botones · descripción de Shopify · pestañas **Detalles** (material, elementos, longitud, nota de origen) · **Qué incluye** («Una Pulsera Rosario Virgen María.») · **Envíos y devoluciones** (políticas) · después: opiniones → detalles → servicio → FAQ → compra fija.

## 5. FAQ (home, ficha y página de preguntas frecuentes, idéntica)

1. ¿De qué material está hecha? — Según la información facilitada por el proveedor, está fabricada en acero inoxidable con acabado dorado pulido.
2. ¿Qué elementos tiene? — La pulsera incorpora una medalla de la Virgen María, una cruz y cuentas de rosario tricolor.
3. ¿Es ajustable? — La imagen del proveedor muestra tres aros destinados al ajuste de la longitud.
4. ¿Qué longitud tiene? — La imagen del proveedor indica una longitud de 7,87 pulgadas, que equivalen a unos 20 cm. (7,87 × 2,54 = 19,99 cm)
5. ¿Qué incluye mi pedido? — Una Pulsera Rosario Virgen María.
6. ¿Para qué ocasiones puede ser un buen regalo? — Puede ser un detalle con significado para bautizos, primeras comuniones, confirmaciones, Navidad, Pascua u otras ocasiones religiosas.
7. ¿Puedo llevarla a diario? — El proveedor la presenta como una pieza diseñada para lucir a diario.
8. ¿Cuándo recibiré mi pedido? — Consulta los plazos y condiciones de entrega actualizados en nuestra política de envío (enlace).
9. ¿Qué hago si tengo un problema con mi pedido? — Contacto + política de devoluciones (enlaces).

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

- Batería de la pulsera: **101/101** (contenido, limpieza, claims, compra de una variante, variantes reales, agotado, «No disponible», carrito, compra fija, FAQ con teclado, navegación, 404, SEO, contraste, responsive a 320–1440 px, primera pantalla a 320×640, 360×800, 375×667, 390×844 y 430×932, y regresión del componente de packs).
- Theme Check: **0 errores**, los 9 avisos de siempre de Dawn 16. Validador de plantillas y assets: OK. JSON válidos.
- Capturas: `docs/garelon/capturas/rosary-v1/` (precio **simulado** 19,99 €).

**No probado:** Shopify real (vista previa, editor, apps), checkout, pagos, envío, AliExpress, fulfillment ni pedidos.

## 8. MANUAL TODO

**Shopify Admin**
1. Importar o conectar el producto de AliExpress y confirmar el método (AutoDS, DSers, app, manual u otro): **no se ha asumido ninguno**.
2. Crear o revisar el producto: título «Pulsera Rosario Virgen María»; descripción limpia (brief §7, sin 14K ni claims de AliExpress).
3. Precio. Precio comparado solo si existe de verdad.
4. Variantes reales (si las hay), SKU y stock.
5. Multimedia: subir las fotos elegidas y comprobar que el importador no añade la infografía con «14K» ni otras con texto o packaging.
6. Elegir el producto en el editor (Portada, Compra, Llamada final, Opiniones y Compra fija de la home) o retirar la Taza Fondue del canal Tienda online: si no, las secciones pueden mostrar la taza.
7. Envío real (zonas, tarifas, plazos). Si hay tarifa 0 €, activar «Envío gratis» en el bloque de la compra (home y ficha) y, si quieres, en la barra superior.
8. Revisar la política de envío y la de devoluciones (joyería: higiene, plazos, dirección): no se han reescrito.
9. SEO del producto (título y meta del brief §7), handle, y SEO + imagen para redes de la home (Preferencias).
10. Redirección de la URL de la Taza Fondue → `/`.
11. Reseñas: solo una app real con su bloque.
12. Duplicar el tema publicado antes de subir este.

**AliExpress / fulfillment**
13. Validar el proveedor y el producto exacto (cruz colgante o intercalada, número de cuentas, aros).
14. Confirmar 14K solo con una fuente fiable del mismo producto (y aun así, documentarlo antes de publicarlo).
15. Validar SKU, variantes, stock, plazos y método de envío.
16. Subir al repositorio las 6 imágenes originales del proveedor.

**Pedido de prueba**
17. Pedido de prueba completo (carrito → checkout → pago de prueba → pedido en AliExpress/app) con dirección española; comprobar variante, cantidad 1, plazos y seguimiento antes de lanzar anuncios.
