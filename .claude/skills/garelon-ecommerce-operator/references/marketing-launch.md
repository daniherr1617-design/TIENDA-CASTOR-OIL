# Lanzamiento y marketing (MODE: LAUNCH / MARKETING)

> Canónico: Prompt Maestro §15-§16 y Checklist §12, §19.

## Regla de oro

**No gastar dinero, no lanzar campañas y no cambiar presupuestos sin aprobación explícita del propietario en ese momento.** Claude prepara, analiza y propone. El propietario aprieta el botón.

## Antes de lanzar tráfico (comprobar, no suponer)

| Punto | Cómo se verifica | Estado por defecto |
|---|---|---|
| Tema subido, vista previa revisada en móvil | 🆂 propietario | NO DISPONIBLE hasta confirmarlo |
| Producto, packs y precios reales | 🆂 Shopify Admin | NO DISPONIBLE |
| Envío y políticas publicadas | 🆂 | NO DISPONIBLE |
| Pedido de prueba de cada pack (y lo que llega a `{{SUPPLIER_INTEGRATION}}`) | 🆂 / 🅿 | NO DISPONIBLE |
| Píxel de Meta / TikTok por canal oficial o eventos de cliente | 🆂 | No asumir que está instalado |
| GA4, si aplica | 🆂 | No asumir |
| Eventos `ViewContent`, `AddToCart`, inicio de checkout y `Purchase` | 🆂 con herramientas del canal y un pedido de prueba | No asumir |
| Opiniones visibles (Judge.me) | 🆂 | Opcional; nunca inventadas |

El tema no inyecta píxeles a mano: se usan las apps o canales oficiales de Shopify.

## Unit economics (con datos del brief)

Por pack: `precio de venta − (coste producto × N + envío del proveedor + comisión de pago + otros) = margen bruto`. CPA máximo de break-even = margen bruto. Lo que no esté en el brief es `NO DISPONIBLE`: no lo estimes como si fuera real; si haces un escenario, márcalo como hipótesis.

## Creatividades y anuncios

- Mismas reglas que la tienda: producto fiel (R1), claims verificados (R3), sin antes/después falsos, sin testimonios inventados, sin urgencia falsa (R9).
- Ángulos honestos según la categoría: regalo, significado, uso diario, estética, problema/solución real.
- UGC: real y con permiso. Si es guionizado, que no se presente como opinión espontánea de un cliente.
- Las promesas del anuncio deben coincidir con la página (mismo precio de Shopify, mismo envío, mismas garantías).
- **Políticas de las plataformas** (compruébalas antes de cada campaña, porque cambian): Meta no permite textos que afirmen o insinúen atributos personales del destinatario, como religión, salud o situación personal. Por ejemplo, «Un símbolo de fe» sí; «¿Eres creyente?» o «tu fe» dirigido al usuario, no. La segmentación por intereses sensibles está restringida. Ante la duda, redacción neutra.
- **Imágenes de tienda en anuncios:** un elemento de una infografía que pueda leerse como «incluido» (p. ej. un icono de caja de regalo) no se usa como promesa en un anuncio si el packaging no está confirmado. La imagen sigue siendo válida en la tienda (decisión del propietario).

## Tests A/B y mejora continua

- Una hipótesis por test, una métrica principal (conversión de la home, añadir al carrito, checkout iniciado) y un tamaño de muestra razonable antes de concluir.
- Los cambios de tema que salgan del test siguen el flujo `IMPLEMENT` + QA.
- «Más popular» y otros badges de datos solo cuando las ventas reales lo respalden.

## SEO

Título y meta del producto y de la home en Shopify Admin; un H1 por página; textos alternativos descriptivos; redirección del handle anterior al cambiar de producto; sin keyword stuffing.
