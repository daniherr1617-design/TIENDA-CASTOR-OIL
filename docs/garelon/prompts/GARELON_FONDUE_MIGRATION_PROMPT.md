# PROMPT FINAL · MIGRACIÓN GARELON A TAZA FONDUE

Quiero migrar la tienda Shopify GARELON del producto anterior (sérum de contorno de ojos) al nuevo producto:

**Taza Fondue de Chocolate con Tenedor**

Repositorio: `daniherr1617-design/TIENDA-CASTOR-OIL`  
Rama de trabajo: `claude/fondue-mug`  
Baseline del sérum ya fusionado en `main`: `f08f9bb1c3852154382dc0fc5483a779ed7eb707`

IMPORTANTE:
- Trabaja SIEMPRE sobre `claude/fondue-mug`.
- Haz pull/fetch antes de empezar; el usuario puede haber añadido imágenes nuevas a la rama.
- NO modifiques `main` directamente.
- NO hagas merge.
- Si no existe PR para esta rama, puedes crearla al final como draft, pero NO fusionarla.
- El repositorio real manda sobre documentación antigua.
- Lee COMPLETAMENTE antes de tocar código:
  - `docs/garelon/GARELON_MASTER_TEMPLATE.md`
  - `docs/garelon/GARELON_PRODUCT_MIGRATION_CHECKLIST.md`
  - `docs/garelon/products/GARELON_PRODUCT_BRIEF_FONDUE_MUG_v1.md`
  - los documentos de migración existentes que sigan vigentes.
- Respeta las reglas permanentes del Master.
- No reconstruyas la tienda desde cero. Esta es una migración de producto sobre el baseline GARELON ya validado.

============================================================
1. CONTEXTO
============================================================

GARELON sigue siendo la marca/tienda.

El proyecto del sérum queda cerrado como baseline técnico. Debes sustituir TODO el contenido específico del sérum por el producto nuevo sin romper:

- Dawn 16.0.0;
- header;
- navegación one-product;
- footer;
- contacto;
- carrito/cart drawer;
- checkout oficial Shopify;
- accesibilidad;
- responsive;
- Theme Editor;
- SEO técnico;
- comportamiento de stock/precio/variantes;
- opiniones reales vía app/metafields;
- política de no inventar datos.

La nueva tienda se orienta principalmente a tráfico móvil frío procedente de TikTok Ads, Meta e Instagram. La experiencia debe ser muy visual, rápida de entender y pensada para tomar una decisión de compra desde el teléfono.

Usa como referencia de CRO/estructura, NO como fuente para copiar:
`https://www.getchococup.com/products/chococup`

Ideas que sí puedes tomar a nivel conceptual:
- producto muy visible desde arriba;
- galería visual clara;
- oferta/packs accesibles pronto;
- navegación simple;
- experiencia móvil;
- uso del producto explicado visualmente;
- foco en compartir/regalo/experiencia.

NO copies:
- marca Choco Cup;
- logo;
- textos;
- imágenes;
- frases exactas;
- claims;
- diseño literal;
- colores o identidad de marca.

No uses urgencia falsa como “oferta limitada”, “producto viral”, “últimas unidades” o equivalentes sin datos reales.

============================================================
2. VERDAD DEL PRODUCTO
============================================================

Nombre definitivo de venta:
**Taza Fondue de Chocolate con Tenedor**

Nombre corto:
**Taza Fondue**

Producto físico:
- taza de cerámica individual para fondue;
- capacidad REAL: **130 ml**;
- tres colores: **Rojo, Blanco y Marrón**;
- cada unidad incluye **1 taza + 1 tenedor tipo fondue**;
- el tenedor sirve para pinchar fruta, por ejemplo fresas, y sumergirla en chocolate/queso;
- la taza tiene un compartimento inferior destinado a colocar una vela;
- **LA VELA NO ESTÁ INCLUIDA**;
- texto físico visible del producto: `Chocolat...`;
- NO añadir GARELON digitalmente al producto;
- NO cambiar forma, asa, abertura inferior, soporte del tenedor, color o diseño físico;
- según la ficha de CJ, es apta para microondas;
- material: cerámica;
- peso logístico mostrado por CJ: 500 g por unidad;
- tamaño de paquete del proveedor: 100 × 100 × 110 mm.

Proveedor actual:
**CJ Dropshipping**

SKU/color según brief:
- Rojo: `CJYD222583201AZ`
- Marrón: `CJYD222583202BY`
- Blanco: `CJYD222583203CX`

Inventario visto en CJ:
- Rojo: 11.769 total (CJ 15 + fábrica 11.754)
- Marrón: 10.483 total (CJ 27 + fábrica 10.456)
- Blanco: 10.254 total (CJ 21 + fábrica 10.233)

“Lists: 57” NO es stock.

============================================================
3. COSTES Y PRECIOS
============================================================

Costes observados en CJ:
- 1 unidad: total aprox. 10,09 €
- 2 unidades: total 16,78 €
- 3 unidades: total 23,44 €

Precios de venta decididos:
- 1 unidad: **24,99 €**
- 2 unidades: **39,99 €**
- 3 unidades: **54,99 €**

Estos precios deben vivir en Shopify.

NO hardcodear:
- precios;
- compare-at;
- SKU;
- stock;
- IDs de variante.

El tema debe leer siempre los datos comerciales reales de Shopify.

Ahorro de packs:
- calcúlalo dinámicamente frente al precio real de una unidad del MISMO COLOR;
- 2 unidades: comparación contra 2 × precio de 1 unidad;
- 3 unidades: comparación contra 3 × precio de 1 unidad;
- no inventar precios tachados;
- no usar compare_at_price falso.

Badge permitido:
- pack 3: “Mejor precio/unidad” si matemáticamente es cierto.
- pack 2 puede usar una etiqueta editorial no empírica como “Para compartir”.
- NO usar “Más vendido”, “Favorito” ni similares sin datos.

============================================================
4. ARQUITECTURA COLOR × PACK
============================================================

El producto tendrá dos dimensiones comerciales:

1. Color:
   - Rojo
   - Blanco
   - Marrón

2. Pack:
   - 1 unidad
   - 2 unidades
   - 3 unidades

REGLA:
Cada pack es monocolor.

Permitido:
- 2 rojas
- 2 blancas
- 2 marrones
- 3 rojas
- 3 blancas
- 3 marrones

NO permitido:
- mezclar colores en el mismo pack.

Arquitectura objetivo en Shopify:
**Color × Pack**, previsiblemente 9 combinaciones.

Pero NO inventes variantes ni IDs.

Primero inspecciona el producto real en Shopify/configuración disponible en el tema.

Si el producto todavía no está importado/configurado:
- deja el theme preparado;
- muestra diagnóstico solo en Theme Editor;
- no rompas storefront;
- documenta exactamente qué debe crear/configurar manualmente el usuario.

El selector debe:
- permitir elegir Color y Pack;
- resolver la variante Shopify correspondiente;
- respetar `?variant=` cuando exista;
- deshabilitar combinaciones no disponibles;
- añadir al carrito la variante seleccionada con `quantity=1`;
- mantener la lógica Dawn/product-form.js;
- no crear quantity multipliers ocultos.

MUY IMPORTANTE:
El mapping CJ de los packs todavía debe validarse.

NO afirmes que CJ ya sabe cumplir las 9 combinaciones.

En el informe final incluye un bloque MANUAL TODO para:
- mapping de cada Color × Pack;
- cómo debe cumplirse 1/2/3 unidades del mismo color;
- pedido de prueba.

Si la forma más segura de fulfillment requiere bundles/variants adicionales en Shopify/CJ, NO lo inventes: descríbelo como paso manual.

============================================================
5. ENVÍO
============================================================

Datos observados:
- preparación CJ: 1–3 días para el 90 % de pedidos;
- 1 ud. CJPacket Ordinario I: aprox. 8–18 días;
- 3 uds. YunExpress Ordinario: aprox. 8–15 días;
- 2 uds. CJPacket disponible; no hay un plazo exacto registrado en el brief.

Copy público prudente:
- preparación estimada: 1–3 días;
- entrega estimada España: aprox. 8–18 días;
- puede variar según destino/transporte.

La tienda mantiene **Envío gratis** como mensaje comercial porque el coste de envío se absorbe en el precio.

No muestres:
- CJ;
- YunExpress;
- CJPacket;
- costes internos;
- aranceles internos.

Mantén la regla existente:
el texto “Envío gratis” solo debe publicarse con tarifa real 0 € configurada en Shopify para las zonas anunciadas.

============================================================
6. NUEVA IDENTIDAD VISUAL DEL PRODUCTO
============================================================

GARELON sigue siendo la marca.

Pero el isotipo/product logo anterior del sérum debe desaparecer de la experiencia pública.

Se ha creado un nuevo emblema visual con:
- taza roja de fondue;
- chocolate;
- tenedor;
- lenguaje visual circular.

Usa el nuevo emblema suministrado en `referencias/fondue-mug/` como nuevo isotipo/fav/icono de esta versión de GARELON si visualmente funciona.

Header recomendado:
**[nuevo isotipo fondue] GARELON**

No pongas GARELON sobre la taza física.

No copies el logo de Choco Cup.

Mantén el sistema visual GARELON:
- limpio;
- premium;
- cálido;
- crema/blanco;
- marrón/chocolate;
- dorado discreto;
- negro/charcoal para texto.

El rojo del producto puede aportar contraste visual en fotografías, pero NO conviertas toda la interfaz en una tienda roja.

No hagas un rediseño total del theme.

============================================================
7. IMÁGENES
============================================================

El usuario añadirá/ha añadido todas las imágenes candidatas en:

`referencias/fondue-mug/`

Analízalas TODAS antes de decidir.

La selección final es responsabilidad tuya dentro de las reglas GARELON.

Roles esperados:
- logo/isotipo fondue;
- foto de las tres variantes;
- foto individual roja;
- foto individual blanca;
- foto individual marrón;
- lifestyle con fresas;
- lifestyle con chocolate;
- demostración de fresa usando el tenedor;
- infografía de características/usos;
- infografía “Cómo funciona”.

No es obligatorio publicar todas.

Prioridad:
1. fidelidad al producto;
2. claridad móvil;
3. capacidad de explicar el producto;
4. estética;
5. variedad sin repetición.

REGLA CRÍTICA:
Las imágenes generadas NO son fuente de verdad si contradicen CJ/brief.

Rechaza para storefront o usa solo como referencia cualquier imagen que:
- cambie el texto físico `Chocolat...`;
- añada corazones/dibujos que no están en la taza real;
- llame “Negro” a la variante marrón;
- altere el asa, hueco de vela, forma o tenedor;
- diga una capacidad distinta de 130 ml;
- sugiera que la vela viene incluida;
- añada GARELON al objeto físico;
- incluya claims no verificados.

En particular, si la infografía “Características y usos” muestra corazones físicos, “Negro” o “cerámica resistente” sin evidencia, NO la publiques tal cual. Puedes omitirla.

La infografía “Cómo funciona” puede usarse como apoyo si el producto mostrado es suficientemente fiel y no contiene datos contradictorios.

Optimiza imágenes para web:
- responsive;
- width/height;
- lazy loading donde corresponda;
- tamaños razonables;
- no sacrificar nitidez principal;
- alt text descriptivo y no spam.

============================================================
8. ESTRUCTURA DE HOME
============================================================

Quiero conservar la calidad/arquitectura de la tienda del sérum, pero adaptar el storytelling al producto y aproximarlo conceptualmente al flujo CRO del competidor.

Orden recomendado:

1. Announcement bar
2. Header
3. Hero / primera impresión
4. Zona principal de compra: producto + galería + Color + Pack + CTA
5. Opiniones reales
6. Barra de confianza/características rápidas
7. Beneficios/experiencia
8. Cómo funciona
9. Sección lifestyle / compartir
10. Colores / qué incluye
11. FAQ
12. CTA final
13. Footer

Puedes ajustar el orden si, tras inspeccionar repo e imágenes, hay una opción claramente mejor, pero:
- compra muy arriba;
- reviews inmediatamente tras compra cuando existan;
- explicación del funcionamiento antes de un scroll excesivo;
- experiencia mobile-first.

Elimina/reconvierte las secciones del sérum:
- roller;
- ingredients;
- composición cosmética;
- aplicación en contorno;
- cualquier sección ocular/cosmética.

No debe quedar ningún resto de:
- sérum;
- ojos;
- roller facial;
- aceite de ricino;
- ingredientes cosméticos;
- 10 ml;
- Baafven;
- skincare.

============================================================
9. COPY PROPUESTO
============================================================

Puedes pulirlo manteniendo el sentido y sin inventar.

ANNOUNCEMENT:
“Envío gratis disponible en España”

HERO eyebrow:
“Un pequeño plan que sabe a mucho”

HERO H1:
“Tu fondue de chocolate, directamente en una taza”

HERO texto:
“Una taza de cerámica con espacio para vela y tenedor de fondue incluido. Prepara chocolate o queso y disfruta con fresas, fruta, pan o gofres.”

CTA:
“Elegir color y pack”

PRODUCT TITLE:
“Taza Fondue de Chocolate con Tenedor”

MICROCOPY compra:
“Disponible en rojo, blanco y marrón.”

PACKS:
- 1 unidad — “Individual”
- 2 unidades — “Para compartir”
- 3 unidades — “Mejor precio/unidad” si el cálculo lo confirma.

ENVÍO:
“Envío gratis”
“Preparación estimada: 1–3 días”
“Entrega estimada en España: aprox. 8–18 días”

TRUST / QUICK FEATURES:
- Cerámica
- Tenedor de fondue incluido
- 3 colores
- Apta para microondas (solo porque consta en la ficha CJ)

BENEFICIOS / EXPERIENCIA:
Heading:
“Convierte cualquier sobremesa en un pequeño momento especial”

Cards/copy sugerido:
- “Chocolate o queso”
  “Úsala para preparar una fondue individual de chocolate o queso.”
- “Hecha para compartir”
  “Fresas, fruta, pan o gofres: elige tus acompañamientos y disfruta.”
- “Todo en una taza”
  “Diseño compacto con espacio para vela y tenedor tipo fondue incluido.”

CÓMO FUNCIONA:
Heading:
“Tan sencillo como preparar, calentar y disfrutar”

Pasos:
1. “Coloca una vela”
2. “Añade chocolate o queso”
3. “Enciende la vela y deja que se caliente/funda”
4. “Remueve con el tenedor”
5. “Disfruta con tus acompañamientos favoritos”

Añade cerca:
“Vela no incluida.”

No prometas tiempos de fundido.

LIFESTYLE:
Heading:
“Un plan sencillo para compartir”

Texto:
“Una sobremesa diferente para una noche en casa, una cita o un pequeño regalo. Elige tu color, prepara tus acompañamientos y crea tu propia fondue.”

COLORES / QUÉ INCLUYE:
Heading:
“Elige tu color”

Rojo · Blanco · Marrón

Qué incluye cada unidad:
- 1 taza de cerámica de 130 ml
- 1 tenedor tipo fondue

Nota:
“Vela no incluida.”

No llames “negro” al marrón.

CTA FINAL:
Heading:
“Tu próxima sobremesa puede empezar aquí”
Texto:
“Elige tu color y el pack que mejor encaje contigo.”
Botón:
“Elegir mi Taza Fondue”

============================================================
10. OPINIONES
============================================================

Conservar exactamente la filosofía de la última ronda del sérum:

- SOLO opiniones reales;
- app blocks;
- `reviews.rating`;
- `reviews.rating_count`;
- nunca testimonios ficticios;
- nunca estrellas ficticias;
- nunca nombres inventados;
- nunca “Compra verificada” inventada;
- si no hay app/datos, la sección NO se muestra a clientes;
- en Theme Editor sí puede aparecer diagnóstico;
- reviews justo después de la primera zona de compra;
- evitar duplicar resumen si la app ya lo pinta.

============================================================
11. FAQ
============================================================

Crear FAQ específica y eliminar la del sérum.

Preguntas mínimas:

1. ¿Qué incluye cada taza?
Respuesta:
Una taza de cerámica de 130 ml y un tenedor tipo fondue. La vela no está incluida.

2. ¿Cómo se utiliza?
Respuesta prudente:
Coloca una vela en el compartimento inferior, añade chocolate o queso y deja que el calor ayude a fundirlo o mantenerlo caliente. Remueve y utiliza el tenedor para tus acompañamientos. Evita prometer tiempos exactos.

3. ¿Puedo usarla con queso?
Sí. El proveedor la presenta para chocolate/queso y la tienda puede comunicar ambos usos sin beneficios adicionales inventados.

4. ¿Es apta para microondas?
Según la información facilitada por CJ, sí. No añadas instrucciones técnicas que no estén verificadas.

5. ¿Qué capacidad tiene?
130 ml.

6. ¿Qué colores hay?
Rojo, blanco y marrón.

7. ¿Qué incluyen los packs?
1, 2 o 3 tazas del MISMO color. Cada taza incluye su tenedor. No se mezclan colores dentro del pack.

8. ¿La vela está incluida?
No.

9. ¿Cuándo recibiré el pedido?
Preparación estimada 1–3 días y entrega en España aprox. 8–18 días. Plazos orientativos.

10. ¿Qué hago si llega dañada?
Remitir a contacto y política de devoluciones/reembolsos. No inventar una garantía distinta.

============================================================
12. SEGURIDAD / CLAIMS
============================================================

No inventes:
- certificaciones;
- resistencia térmica cuantificada;
- seguridad infantil;
- tiempos exactos de fundido;
- temperatura;
- ventas;
- “más vendido”;
- urgencia;
- stock falso;
- reviews;
- garantía de 30 días si no existe;
- vela incluida;
- capacidad 200 ml.

Capacidad correcta: **130 ml**.

Como hay una vela/llama:
- no trivialices el uso;
- puedes incluir una nota prudente de uso responsable;
- no escribas afirmaciones técnicas no verificadas.

============================================================
13. PRODUCT PAGE
============================================================

Mantén la ficha alineada con la home.

Orden recomendado:
1. main product / galería / compra
2. reviews
3. service/trust
4. benefits
5. how_to
6. lifestyle/características si aporta valor
7. FAQ
8. sticky ATC móvil

La selección Color × Pack debe funcionar igual que en home.

Sticky ATC:
- móvil;
- respeta variante Color × Pack actual;
- no añade una variante diferente;
- quantity=1.

============================================================
14. CARRITO
============================================================

Mantén carrito Dawn/GARELON ya validado.

Cada línea debe mostrar naturalmente:
- Color
- Pack

Ejemplo:
Color: Rojo
Pack: 2 unidades
Cantidad de línea: 1

NO convertir el pack en quantity=2 en el carrito si la estrategia real de Shopify usa una variante/bundle de pack.

No tocar checkout.

Mantener textos coherentes con envío gratis.

============================================================
15. PAGOS
============================================================

Mantener decisión final del baseline:

NO mostrar:
- Visa;
- Mastercard;
- PayPal;
- Apple Pay;
- Google Pay;
- Bizum;
- “Pago seguro”;
- iconos de pago públicos.

Footer:
`payment_enable: false`

No tocar los métodos reales del checkout.

============================================================
16. LOGO / ASSETS DE MARCA
============================================================

Retirar del storefront el isotipo específico del sérum/ojos.

Usar nuevo emblema de fondue si está en referencias y es técnicamente adecuado.

GARELON sigue siendo el nombre de marca visible.

Crear/actualizar:
- header logo/isotipo;
- favicon si corresponde;
- footer/brand mark si actualmente depende del isotipo anterior.

No modificar el producto físico con branding.

============================================================
17. SEO
============================================================

Un solo H1 relevante.

Title sugerido:
“Taza Fondue de Chocolate con Tenedor | GARELON”

Meta description sugerida:
“Disfruta de una fondue individual de chocolate o queso con taza de cerámica y tenedor incluido. 3 colores y packs de 1, 2 o 3 unidades.”

No fake aggregateRating.

No duplicar Product JSON-LD.

Actualizar:
- textos del sérum;
- alt text;
- títulos;
- meta;
- 404 si contiene referencias al sérum.

404 sugerida:
Heading: “Aquí no hay chocolate que fundir”
Texto: “Vuelve a la tienda y encuentra tu Taza Fondue.”
CTA: “Volver a la tienda”

============================================================
18. MOBILE FIRST
============================================================

Prioridad absoluta:
320 / 360 / 375 / 390 / 430 px.

Después:
768 / 1024 / 1440.

En móvil:
- producto reconocible inmediatamente;
- precio y opciones entendibles;
- Color y Pack cómodos de tocar;
- CTA visible sin ruido;
- galería swipeable/usable;
- reviews cerca de compra;
- no sliders diminutos;
- no texto incrustado ilegible;
- no scroll horizontal;
- sticky ATC sin tapar contenido.

============================================================
19. ARCHIVOS / ASSETS
============================================================

No dependas de nombres antiguos `IMAGEN 1`, etc. si ahora existen nuevas referencias de fondue.

Crea nombres semánticos para assets finales, por ejemplo:
- `garelon-fondue-hero-...`
- `garelon-fondue-red-...`
- `garelon-fondue-white-...`
- `garelon-fondue-brown-...`
- `garelon-fondue-lifestyle-...`
- `garelon-fondue-how-to-...`
- `garelon-fondue-logo-...`

Genera tamaños responsive siguiendo el patrón GARELON actual.

No borres referencias originales hasta haber decidido cuáles son necesarias.

============================================================
20. LIMPIEZA DEL SÉRUM
============================================================

Busca en TODO el código/theme actual términos y restos:

serum
sérum
eye
eyes
contorno
roller
ricino
castor
Baafven
10 ml
0.34 fl oz
Boswellia
Collagen
Acetyl Tripeptide
skincare
mirada
rutina de ojos
aceite de ricino

Clasifica cada aparición:
- storefront actual → debe desaparecer;
- código genérico no visible → valorar;
- documentación histórica explícita → puede permanecer si está claramente marcada como baseline/histórica;
- tests viejos → actualizar si prueban copy antiguo.

No destruyas el baseline `baseline/garelon-serum`.

============================================================
21. DOCUMENTACIÓN
============================================================

Actualiza en la rama de fondue únicamente lo necesario:

- Product Brief de la taza;
- notas de migración;
- checklist;
- Master SOLO si una regla reusable cambia de verdad.

No reescribas el Master innecesariamente.

El baseline histórico del sérum debe seguir siendo reconocible como baseline.

============================================================
22. PRIMERA VERSIÓN, NO SOBREOPTIMIZAR
============================================================

Esta es la PRIMERA versión de la página para este producto.

Objetivo:
una tienda coherente, profesional, limpia y lista para ser revisada.

No intentes inventar 20 features.

Prefiere:
- claridad;
- móvil;
- producto;
- packs;
- colores;
- imágenes;
- funcionamiento;
- reviews reales;
- confianza;
- velocidad.

Después de verla en Shopify se harán rondas de ajuste.

============================================================
23. VALIDACIÓN
============================================================

Antes de terminar, prueba:

A. ESTRUCTURA
- home carga;
- product carga;
- 404 carga;
- no error 404 por schemas;
- nombres del editor <= 25 caracteres;
- JSON válido;
- schemas válidos.

B. COLOR × PACK
- 3 colores;
- 3 packs;
- selección combinada;
- variant deep link;
- unavailable;
- precio;
- ahorro;
- precio/unidad;
- quantity=1;
- cart drawer;
- /cart.

C. PRODUCT TRUTH
- 130 ml;
- tenedor;
- vela no incluida;
- Rojo/Blanco/Marrón;
- no restos 200 ml;
- no “Negro” si se refiere al marrón;
- no GARELON sobre la taza.

D. REGRESIONES
- carrito;
- contacto;
- envío;
- reviews;
- sticky ATC;
- responsive;
- navegación;
- footer sin pagos;
- checkout untouched.

E. THEME CHECK
- 0 errores;
- solo warnings baseline legítimos Dawn.

F. IMÁGENES
- sin deformaciones;
- sin scroll horizontal;
- buena lectura móvil;
- alt text;
- sin publicar imágenes físicamente engañosas.

============================================================
24. SHOPIFY / CJ MANUAL TODO
============================================================

No puedes dar por hecho que está resuelto.

Al final crea una lista manual exacta de pasos para el usuario:

1. importar/conectar el nuevo producto CJ a Shopify;
2. configurar las 9 combinaciones Color × Pack o la arquitectura real equivalente;
3. introducir precios 24,99 / 39,99 / 54,99;
4. mapear CJ para que packs sean monocolor;
5. confirmar stock;
6. confirmar tarifa 0 € de envío;
7. asignar producto a las secciones de home;
8. instalar/añadir app de reviews si se quieren mostrar;
9. hacer pedido de prueba de cada pack/color representativo;
10. confirmar tracking;
11. comprobar móvil real;
12. publicar solo después.

============================================================
25. GIT
============================================================

- rama: `claude/fondue-mug`
- pull latest antes de trabajar;
- commits descriptivos;
- push a la misma rama;
- NO merge;
- NO modificar `main`;
- si creas PR, que sea draft y documentada.

============================================================
26. ZIP
============================================================

Al terminar genera un ZIP de theme listo para Shopify, porque el usuario está probando/publicando por ZIP antes de volver a depender de GitHub.

Nombre:
`GARELON-SHOPIFY-THEME-FONDUE-v1.zip`

Raíz del ZIP:
- assets/
- config/
- layout/
- locales/
- sections/
- snippets/
- templates/

No incluir:
- docs/
- referencias/
- .md
- .git
- tests
- capturas
- node_modules

Descomprime el ZIP y vuelve a validar.

============================================================
27. INFORME FINAL
============================================================

Quiero un informe que incluya:

1. commit inicial detectado;
2. commit final;
3. archivos modificados;
4. secciones home anteriores/nuevas;
5. secciones product anteriores/nuevas;
6. imágenes analizadas;
7. imágenes elegidas y rechazadas + motivo;
8. logo aplicado;
9. copy final;
10. arquitectura Color × Pack implementada;
11. comportamiento quantity=1;
12. ahorros/precio unidad;
13. restos del sérum encontrados/eliminados;
14. resultado de búsqueda de términos antiguos;
15. tests;
16. Theme Check;
17. responsive;
18. estado del checkout;
19. TODO manual Shopify/CJ;
20. nombre/ruta del ZIP;
21. estado de rama/PR/main.

============================================================
28. PRINCIPIO FINAL
============================================================

No quiero una copia de Choco Cup.

Quiero que la nueva GARELON use lo aprendido del baseline del sérum y del enfoque de conversión móvil del competidor para vender este producto de forma clara y profesional.

El resultado debe sentirse:

- limpio;
- visual;
- apetecible;
- premium pero accesible;
- mobile-first;
- pensado para anuncios;
- confiable;
- sin claims falsos;
- sin fake reviews;
- sin fake urgency;
- sin engañar sobre el producto.

Si algún dato del prompt contradice el repositorio real o el producto real de CJ, detente en ese punto, conserva la opción más segura y documéntalo en el informe.
