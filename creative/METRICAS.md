# Análisis de métricas por anuncio

Objetivo: localizar **en qué etapa se rompe el funnel** antes de decidir qué creatividad o test hacer.

```
impresión → hook (para el scroll) → retención → clic → landing → carrito → checkout → compra
```

## Datos

Exportar de Meta Ads Manager y TikTok Ads Manager por **anuncio**, con el nombre igual al ID del Lab (`ROSARIO_AD01_HOOK-CURIOSIDAD_V1`), y rellenar `metrics/plantilla.csv` (una fila por anuncio y periodo). Los datos de Shopify (pedidos e ingresos reales) sirven para contrastar lo que atribuyen las plataformas.

## Definiciones

Fuente de cada definición: **[P]** métrica oficial de la plataforma · **[H]** cálculo habitual entre media buyers (no es un estándar oficial; se usa así en este Lab para comparar variantes entre sí).

| Métrica | Cálculo | Nota |
|---|---|---|
| CPM | gasto / impresiones × 1000 | [P] Coste de la audiencia y la subasta, no de la calidad del creativo por sí solo |
| Hook rate | reproducciones de 3 s (Meta) o de 2 s (TikTok) / impresiones | [H] Mide si el inicio para el scroll. Meta y TikTok no son comparables entre sí |
| Hold rate | ThruPlays (Meta) o reproducciones de 6 s (TikTok) / reproducciones de 3 o 2 s | [H] ¿Se queda quien se paró? |
| Retención 25/50/75/100 % | reproducciones hasta X % / reproducciones de 3 o 2 s | [P] para las cifras base, [H] para la normalización. Dónde cae la curva indica qué segundo revisar |
| Tiempo medio de visualización | [P] | Compararlo con la duración del anuncio |
| CTR de enlace | clics en el enlace / impresiones | [P] En Meta usar «CTR (porcentaje de clics en el enlace)», no «CTR (todos)» |
| CPC de enlace | gasto / clics en el enlace | [P] |
| Tasa de visita a la landing | visitas a la página de destino / clics en el enlace | [P]/[H] Si es baja: carga lenta, clics accidentales o tracking roto |
| Tasa de añadir al carrito | AddToCart / visitas a la landing | [H] |
| Tasa de checkout | InitiateCheckout / AddToCart | [H] |
| Tasa de compra | Purchase / InitiateCheckout | [H] |
| CVR | Purchase / visitas a la landing (o / clics) | [H] Indicar siempre el denominador |
| CPA | gasto / compras | [P] |
| ROAS | ingresos atribuidos / gasto | [P] Depende de la ventana de atribución |
| CPA de break-even | margen bruto por pedido | Requiere precio de Shopify, coste del proveedor, envío y comisiones: **NO DISPONIBLE** hasta tener el brief con datos reales |

## Diagnóstico por etapa (hipótesis, no veredictos)

| Patrón | Etapa que probablemente falla | Siguiente test sugerido |
|---|---|---|
| Hook rate bajo frente a otras variantes | Primeros 1-2 s: no para el scroll | Mismo cuerpo con otro hook: visual (primer plano o movimiento), textual (pregunta, beneficio) o de orden (empezar por el mejor plano) |
| Buen hook, hold o 25 % bajos | El cuerpo no cumple lo que prometió el hook, o el ritmo es lento | Recortar el arranque, quitar silencios y redundancias, enseñar el producto antes, alinear hook y cuerpo |
| Buena retención, CTR bajo | Falta motivo para hacer clic: CTA débil o tardío, oferta poco clara, producto que no se entiende | Variar el CTA (texto o momento), mostrar el beneficio o el uso antes del CTA, probar otro ángulo |
| Buen CTR, visitas a la landing bajas | Técnico: velocidad, redirección o píxel | Revisar la carga en móvil y los eventos; no es un problema del creativo |
| Buenas visitas, carrito bajo | Desajuste anuncio ↔ página, precio, confianza u oferta | Comprobar que el anuncio promete lo mismo que la página (precio, envío, garantías). Test de landing u oferta, no de creativo |
| Carrito bien, checkout o compra bajos | Coste de envío inesperado, fricción en el pago, confianza | Revisar el checkout y el coste final. Fuera del alcance del creativo |
| CPM alto con métricas sanas | Audiencia, competencia o época | Revisar segmentación y calendario antes de cambiar el creativo |
| Todo bajo con muy poco volumen | Sin datos suficientes | Esperar volumen, no concluir |

## Prudencia

- **Volumen mínimo antes de juzgar** (práctica habitual, a validar con nuestros datos): para el hook, del orden de miles de impresiones por variante. Para decidir sobre compras, al menos 1-2 veces el CPA objetivo gastado por anuncio. Por debajo, se describe la tendencia sin declarar ganador.
- Comparar variantes **dentro del mismo conjunto de anuncios, periodo y audiencia**. Entre plataformas solo se comparan tendencias.
- Verificar el tracking (píxel o API de conversiones y eventos de Shopify) antes de culpar al creativo. En la documentación actual del proyecto figura como **NO DISPONIBLE**.
- Atribución: anotar la ventana de cada export (p. ej. 7 días clic / 1 día visualización) y no mezclar ventanas.
- Cada conclusión se formula como hipótesis + siguiente test, con la variable que cambia.
