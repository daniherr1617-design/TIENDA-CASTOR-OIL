# Creative & Ads Lab · instrucciones para Claude

Rama especializada de GARELON: creatividades de vídeo, TikTok Ads, Meta Ads, métricas, creative testing y automatización. **No** migra productos, no toca el tema, el checkout ni el fulfillment, no publica temas y **nunca** lanza campañas, gasta dinero ni cambia presupuestos sin aprobación explícita del propietario en ese momento.

## Al empezar una sesión

1. `creative/setup.sh` (el contenedor es efímero). Si el propietario va a enviar voz, `--model large-v3-turbo`.
2. Reglas de producto y marca: `.claude/skills/garelon-ecommerce-operator/` y `docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` (§4 R1-R24, §13 producto). Si no están en la rama actual, leerlos desde la rama que los tenga (`git show <rama>:<ruta>`). Prioridad: producto real > confirmación reciente del propietario > repo > docs.
3. `config/claims.json` resume lo confirmado y lo prohibido del producto actual. Si cambia el producto, se actualiza primero.

## Cómo trabajar un vídeo

1. `lab ingest` → `lab analyze` → mirar **todas** las hojas de fotogramas (`media/01_intermedio/<N>/sheets`) → `lab transcribe` si hay voz → `lab cuts`.
2. Diagnóstico breve: dónde empieza la acción, qué sobra, cuándo se entiende el producto, hook visual y textual, ritmo, silencios, redundancias, riesgo de caída de retención. Si el material es flojo, decirlo y explicar por qué.
3. Proponer variantes que cambien **una variable** cada una, con nombre `<PRODUCTO>_AD<nn>_<VARIABLE>-<VALOR>_V<n>`.
4. Escribir `props/<ID>.json` → `lab render` (incluye `lab check`). Un error de claims bloquea; los avisos se resuelven o se explican.
5. **Revisar visualmente** el QA y una hoja completa del render final antes de entregar. Que los controles técnicos pasen no basta.
6. Informar: qué se cambió, por qué, qué variable prueba cada variante y qué falta verificar (precio y envío en Shopify, permisos de UGC, música con licencia).

## Límites técnicos

- Claude Code no edita los píxeles del producto: solo recorta, escala, reencuadra, hace zoom y compone alrededor. Nada de IA generativa sobre el producto.
- Zoom sobre imágenes de 1254 px: en 9:16 ya se amplían ×1,5. Con más de ×1,3 adicional se pierde nitidez.
- Los originales en `media/00_originales` no se modifican ni se borran. Los vídeos no se versionan en git.
- Aquí no hay navegador visible: se renderiza y se revisan fotogramas en lugar de abrir Remotion Studio (esto prevalece sobre la skill `remotion-best-practices`).

## Métricas e investigación

- Métricas: `METRICAS.md` (definiciones, diagnóstico por etapa del funnel y prudencia estadística). Nunca concluir «el anuncio es malo» sin localizar la etapa que falla.
- Investigación: separar siempre 1) confirmado, 2) recomendación oficial de la plataforma, 3) estudios o casos, 4) práctica de marketers, 5) hipótesis a probar. Fuentes recientes y oficiales primero; citar enlaces.
- Competidores: aprender patrones (hook, estructura, ritmo, ángulo) y crear versiones propias. No copiar creatividades.
