# GARELON · BRIEF DE PRODUCTO · PULSERA ROSARIO VIRGEN MARÍA

> **Versión 1.0 · 02/10/2026.** Brief técnico interno de la migración Taza Fondue → Pulsera Rosario (rama `claude/rosary-bracelet`, desde `b45d132`; la versión anterior queda en `baseline/garelon-fondue`).
>
> Regla: lo que no está verificado se marca **NO DISPONIBLE** y no se publica. Este documento conserva términos del proveedor («14K Gold Plated», «O-rings») solo como referencia: **no se publican**.

## 1. Producto

| Campo | Valor |
|---|---|
| PRODUCTO | Pulsera Rosario Virgen María |
| PRODUCT SHORT | Pulsera Rosario (CTA: «Elegir mi pulsera», «Ver la pulsera») |
| CATEGORÍA | Joyería / accesorio religioso |
| PROVEEDOR | AliExpress |
| URL DEL PROVEEDOR | https://a.aliexpress.com/_EH046Rc (no accesible desde el entorno de Claude Code: el proxy de red la bloquea) |
| INTEGRACIÓN / FULFILLMENT | NO DISPONIBLE / PENDIENTE. No se asume AutoDS, DSers, CJ ni otro método |
| COMPETIDOR DE REFERENCIA | https://www.veysors.com/products/pulsera-rosario-virgen-maria (no accesible desde el entorno: el proxy de red la bloquea; no se ha estudiado) |
| MARCA FÍSICA | Sin marca visible en las imágenes. La pulsera **no** lleva GARELON |

## 2. Datos verificados (descripción escrita del proveedor, facilitada por el dueño)

| Campo | Valor | Fuente |
|---|---|---|
| MATERIAL | Acero inoxidable | Descripción escrita del proveedor |
| ACABADO | Dorado pulido | Descripción escrita del proveedor |
| ELEMENTOS | Medalla de la Virgen María · Cruz (de Jesús) · Cuentas de rosario tricolor | Descripción escrita + imágenes |
| COLORES DE LAS CUENTAS | Dorado, plateado y rosado/cobrizo | Imágenes |
| USO | «Diseñada para lucir con estilo a diario» → se publica como «el proveedor la presenta como una pieza diseñada para lucir a diario» | Descripción escrita |
| OCASIONES | Bautizos, confirmaciones, primeras comuniones, Navidad, Pascua y otras ocasiones católicas (como **idea** de regalo) | Descripción escrita |
| LONGITUD | 7.87" según una imagen del proveedor = **7,87 × 2,54 = 19,99 cm** → se publica «7,87 pulgadas (unos 20 cm)» | Imagen original «PRODUCT DETAILS» (descrita por el dueño) |
| AJUSTE | «3 O-rings for length adjustment» según la imagen del proveedor → se publica «tres aros para ajustar la longitud, según el proveedor» | Imagen original (descrita por el dueño) |
| QUÉ RECIBE EL CLIENTE | 1 pulsera | Confirmado por el dueño |

## 3. NO DISPONIBLE (no se publica ni se inventa)

| Campo | Estado |
|---|---|
| PRECIO | NO DISPONIBLE (el tema lo lee de Shopify) |
| PRECIO COMPARADO | NO DISPONIBLE |
| COSTE | NO DISPONIBLE |
| VARIANTES | NO DISPONIBLE (el tema usa las reales de Shopify; con una sola no muestra selector) |
| PACKS | NO CONFIRMADOS → bloque `garelon_packs` fuera de las plantillas |
| SKU / STOCK / IDs | NO DISPONIBLE |
| SHIPPING (coste, plazos, zonas) | NO DISPONIBLE → «Envío gratis» desactivado; FAQ remite a la política de envío |
| PACKAGING (caja, estuche, bolsita, tarjeta) | NO DISPONIBLE → no se muestra ni se promete |
| CUIDADOS | NO DISPONIBLE → sin pregunta de cuidados en la FAQ |
| WATERPROOF / RESISTENCIA | NO DISPONIBLE → no se publica |
| HIPOALERGÉNICA | NO DISPONIBLE → no se publica |
| GARANTÍA | NO DISPONIBLE → no se publica |
| **14K** | **NO VERIFICADO / NO PUBLICAR.** Una imagen del proveedor dice «14K Gold Plated Cross Charm», pero la descripción escrita solo confirma acero inoxidable con acabado dorado pulido. No ha aparecido ninguna otra fuente del mismo producto |

## 4. Claims

**Permitidos (redacción usada):** acero inoxidable con acabado dorado (pulido) · medalla de la Virgen María · cruz · cuentas (de rosario) tricolor · diseño ajustable mediante tres aros, según el proveedor · 7,87 pulgadas (unos 20 cm) según el proveedor · pieza para llevar a diario según el proveedor · idea de regalo con significado para bautizos, primeras comuniones, confirmaciones, Navidad, Pascua u otras ocasiones religiosas · joyería con significado · símbolo / tradición / fe (lenguaje simbólico).

**Prohibidos:** 14K, oro, baño/chapado de oro, oro o plata auténticos · hipoalergénica · no se oxida / no se pone negra / no pierde el color / anti-tarnish · waterproof / resistente al agua, sudor o perfume · garantía · calidad certificada · fabricada, diseñada o hecha a mano por GARELON · fabricada en España · edición limitada, más vendida, viral, miles de clientes · bendecida, milagrosa, protección divina o espiritual, atrae la suerte, propiedades sobrenaturales · «el regalo perfecto» · «incluye caja de regalo».

## 5. Imágenes entregadas (en la raíz del repositorio, desde `main`)

Las **6 imágenes originales del proveedor** (ORIGINAL 1–6 del prompt) **no están en el repositorio** ni adjuntas: no se han podido usar como fuente de verdad física. Solo hay 4 imágenes de producto (todas 1254 × 1254, mismo estilo marfil con flores; por su aspecto son las **mejoradas/generadas**) y 2 de logo.

| Archivo | Qué muestra | Origen probable | Fidelidad | Decisión | Rol |
|---|---|---|---|---|---|
| `imagen 3.png` | Primer plano de la muñeca con la pulsera: medalla ovalada con borde de piedras, **cruz colgante**, cuentas tricolor | Mejorada de ORIGINAL 5 | Coincide con el resto en medalla y cuentas; cruz colgante, coherente con «Cross **Charm**» del proveedor y con `imagen 2.png` | **Usada** | Principal: portada, galería (ficha n.º 1, home n.º 2), 404, miniatura de respaldo del carrito y de la compra fija |
| `imagen 3.png` (recorte 600 px) | Medalla, cruz y cuentas de cerca | La misma foto | Igual que la anterior (solo recorte, sin ampliar) | **Usada** | Detalle: sección «Detalles de la pulsera», galería (home n.º 1, ficha n.º 2) |
| `imagen 2.png` | Mujer con las manos juntas en oración y la pulsera en la muñeca, sin texto incrustado | Mejorada de ORIGINAL 4 (sin el texto en inglés) | Pulsera pequeña pero coherente (cruz colgante, medalla con piedras, cuentas tricolor) | **Usada** | Lifestyle/significado: «Una joya que va más allá del detalle», galería n.º 3 |
| `imagen 4.png` | Pulsera completa sobre fondo marfil | Generada | **Discrepancia física:** la cruz va **intercalada** en la cadena (unida a una cuenta por arriba y otra por abajo) y no colgante como en `imagen 2/3`; no se ven los tres aros de ajuste | **Descartada (pendiente de confirmar)** | — Si el original del proveedor confirma la cruz intercalada, puede pasar a principal |
| `Imagen 1.png` | Infografía «Detalles de la pulsera» en español: «Aprox. 20 cm / 7,87 in», medalla, cruz, cuentas, cierre, largo ajustable, «Regalo religioso especial» | Generada (a partir de ORIGINAL 3) | Misma cruz intercalada que `imagen 4`; incluye una **caja de regalo con lazo** (packaging no confirmado); texto incrustado | **Descartada** | Sus datos se recrean en HTML (sección «Detalles» y FAQ) |
| `Logo.png` | Símbolo dorado abstracto (flor/joya estilizada), fondo transparente | Logo aprobado | — | **Usado** | Isotipo: cabecera, cierre, favicon (derivación plana) e icono de iOS |
| `Logo y marca.png` | Símbolo + «GARELON» dorado, fondo transparente | Logo aprobado | — | **Usado** | Logo completo: pie. Las letras «GARELON» se usan junto al símbolo en la cabecera |

**Pendiente crítico:** subir al repositorio (o adjuntar) las 6 imágenes originales del proveedor para confirmar si la cruz es colgante o intercalada y el número de cuentas.

## 6. Políticas (sección 19 del Master)

| Pregunta | Respuesta |
|---|---|
| ¿Afecta a las devoluciones? | Posible: joyería que toca la piel (algunas tiendas aplican condiciones de higiene). **No se ha cambiado nada**: revisarlo el dueño (MANUAL TODO) |
| ¿Afecta a los envíos? | Pieza pequeña y ligera; plazos y coste NO DISPONIBLE. Revisar la política de envío con el método real (MANUAL TODO) |
| ¿Higiene o seguridad? | Piezas pequeñas (cuentas, cruz): no hay advertencias oficiales del proveedor. NO DISPONIBLE |
| ¿Garantía? | NO DISPONIBLE. Sin garantías comerciales en el tema |
| ¿Edad o público? | NO DISPONIBLE |
| ¿Requisitos normativos? | NO DISPONIBLE (el tema no certifica nada) |

## 7. Descripción sugerida para Shopify (no copiar el texto de AliExpress)

> Pulsera rosario de acero inoxidable con acabado dorado, medalla de la Virgen María, cruz y cuentas tricolor. Una pieza delicada inspirada en la tradición católica, pensada para llevar a diario o regalar en momentos especiales.
>
> Detalles:
> - Acero inoxidable
> - Acabado dorado
> - Medalla de la Virgen María
> - Cruz
> - Cuentas tricolor
> - Ajuste mediante aros según la información del proveedor

SEO sugerido: título «Pulsera Rosario Virgen María | GARELON» · meta «Pulsera rosario de acero inoxidable con acabado dorado, medalla de la Virgen María, cruz y cuentas tricolor. Un detalle con significado para regalar o llevar contigo.»

## 8. Estado de la migración

Hecho en el tema (probado en render local, **no** en Shopify): ver `GARELON-CAMBIOS-ROSARIO.md` en la raíz.
