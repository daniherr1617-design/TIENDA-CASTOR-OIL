# Copy, descripciones y hashtags

Guía para el pack de cada creatividad (`packs/<ID>.md`, generado con `lab pack` y validado con `lab check`). Límites comprobados el **2026-10-07**, casi todos con fuentes secundarias (`~`): la investigación semanal los revisa y `config/platforms.json` es lo que aplica el checker.

## Principios

1. **El copy acompaña al vídeo; no lo repite ni lo contradice.** La promesa del hook se cumple en el vídeo, en el copy y en la landing (mismo precio, envío y producto).
2. **Solo lo confirmado del producto** (`config/claims.json`). Ante una pregunta sobre algo no confirmado, se responde «lo comprobamos y te decimos», nunca de memoria.
3. **Palabra clave primero.** TikTok e Instagram clasifican el vídeo por lo que se dice, se lee en pantalla y se escribe en la descripción, no solo por los hashtags. La frase que buscaría el cliente («pulsera rosario») va en los primeros caracteres de la descripción y, si encaja, en el texto del vídeo. [~ MEDIO/AGREGADOR]
4. **Una idea por pieza.** Las variantes de descripción cambian una sola cosa: ángulo, primera frase o CTA.
5. **Sin urgencia, recuentos, estrellas, «viral», «más vendido» ni ocasiones concretas** salvo petición (R9, R14, D31). `lab check` lo bloquea.
6. **Tono respetuoso con el símbolo religioso.** Hay quien critica llevar rosarios como accesorio de moda: no se banaliza («accesorio tendencia»), no se afirma la fe del usuario («tu fe», política de Meta) y las críticas se responden con respeto.

## Por plataforma

| Plataforma | Campos del pack | Límites y práctica | Estado |
|---|---|---|---|
| **TikTok orgánico** | Descripción + Hashtags | Hasta 4.000 caracteres en la app (2.200 por API), hashtags incluidos; se ven ~100 antes de «más». **3-5 hashtags** concretos; acumular 20 o más se considera spam | ~ |
| **TikTok Ads** | Texto del anuncio | **1-100 caracteres** (In-Feed). En **Spark Ads** se usa la descripción del post orgánico: entonces manda la sección de TikTok orgánico | ~ |
| **Instagram Reels** | Descripción + Hashtags | Descripción de hasta 2.200 caracteres; se ven ~125. **Máximo 5 hashtags** desde diciembre de 2025, sumando descripción y primer comentario | ~ (varias fuentes coinciden) |
| **Meta Ads** | Texto principal · Título · Descripción | Texto principal: se ven ~125 en el feed y en Reels bastante menos (40-72 recomendados). Título ≤27 recomendado (40 máx.). Descripción ≤27 (30 máx.). Los hashtags no aportan | ~ |
| **YouTube Shorts** | Título · Descripción · Hashtags | Título de hasta 100 caracteres (se ven ~50-60 en móvil). Descripción de hasta 5.000. Con más de 60 hashtags YouTube **ignora todos**; 3-5 recomendados y 3 se muestran junto al título | ~ |

## Hashtags: método para cada vídeo

No hay listas fijas. Para cada vídeo se proponen 3-5 combinando:

| Tipo | Para qué | Ejemplo (pulsera rosario) |
|---|---|---|
| Producto | Lo que buscaría quien ya quiere esto | #pulserarosario |
| Nicho | Comunidad que valora el producto | #rosario · #virgenmaria |
| Intención | Compra, estilo o uso | #joyeria · #joyeriareligiosa |
| Tendencia | **Solo** si el vídeo participa de verdad en ella (formato, sonido o tema) | según la semana |
| Amplio | Distribución, con moderación | #catolicos |

- Se analizan producto, audiencia, tema e intención del vídeo, competencia, país (España) e idioma (español).
- Los genéricos (#fyp, #parati, #viral, #trending…) no se usan por costumbre. `lab check` avisa si aparecen y la sección «Hashtags: por qué» no los justifica. #viral se bloquea (R9).
- Los principales se explican en una línea cada uno, en «Hashtags: por qué».
- **Nunca se promete** que un hashtag dé alcance ni viralidad.

### Datos de volumen y tendencia: limitación actual

Desde este entorno **no se pueden leer** TikTok Creative Center (Trends y Keyword Insights) ni las páginas de hashtags: la red devuelve 403 y además son páginas dinámicas. La investigación se apoya en búsqueda web (resúmenes), en el análisis del vídeo y en el conocimiento vigente (`research/marketing-current-knowledge.md` de la rama `claude/garelon-marketing-research`). Cuando el volumen importe, la vía gratuita es:

1. Creative Center → Trends → Hashtags, **región España**, sector y ordenado por 7 días. Pegar aquí una captura o la lista.
2. Las sugerencias del buscador de TikTok e Instagram al escribir la palabra clave.

Los scrapers de pago (Apify y similares) quedan fuera mientras no los apruebes.

## Comentario fijado y respuestas

- **Comentario fijado:** resuelve la duda más previsible (medida, material, ajuste) o invita a una pregunta concreta. Sin precio, salvo que sea el de Shopify ese día.
- **Respuestas:** preparadas para las preguntas previsibles y solo con datos confirmados. Si piden algo no confirmado (material de la medalla, resistencia al agua, plazos), se responde que se comprueba. Nunca se inventan opiniones, ventas ni stock.
- Las críticas (religiosas o de precio) se responden con respeto y una sola vez; no se discute.

## Etiqueta de IA (material de Higgsfield u otras IA)

| Dónde | Qué hacer | Estado |
|---|---|---|
| TikTok Ads | Desde el **2026-07-21**, todo anuncio con imagen, voz o personas realistas generadas o muy editadas con IA lleva la etiqueta de contenido IA (interruptor AIGC al subir el anuncio). TikTok la detecta también por metadatos C2PA. Saltársela puede acabar en la suspensión de la cuenta | ~ MEDIO (varias fuentes; sin confirmar en la web oficial) |
| TikTok orgánico | Activar «contenido generado por IA» al publicar | ~ |
| Meta | Meta marca «Información de IA» por su cuenta (C2PA) y exige declarar las personas y escenas realistas sintéticas. Revisar la etiqueta en la vista previa | ~ |
| UE | Ley de IA, art. 50, desde el 2026-08-02: avisar del contenido realista generado o manipulado con IA. No es asesoramiento jurídico | ~ (K-REG-01) |

`lab ingest --origen ia` registra el origen. `lab pack` pone «Etiqueta IA: SÍ» y `lab check` bloquea el pack si falta.

## Fuentes (consultadas el 2026-10-07)

- TikTok (descripción y hashtags): [wordcountertool.net](https://www.wordcountertool.net/blog/tiktok-caption-length-guide) · [recurpost.com](https://recurpost.com/tiktok-scheduler/tiktok-character-limits-and-hashtags/)
- TikTok Ads (texto del anuncio): [lettercounter.org](https://lettercounter.org/blog/tiktok-ads-character-limits/) · [tryvizup.com](https://www.tryvizup.com/blog/tiktok-ad-specs-2026-video-sizes-spark-ads-and-safe-zones)
- Instagram (5 hashtags): [socialmediatoday.com](https://www.socialmediatoday.com/news/instagrams-implementing-new-limits-on-hashtag-use/808309/) · [recurpost.com](https://recurpost.com/instagram-scheduler/instagram-hashtag-limits-and-placement-rules/)
- Meta Ads (texto principal, título y descripción): [adsuploader.com](https://adsuploader.com/de/blog/meta-ad-copy-specs) · [metricool.com](https://metricool.com/meta-ad-formats/)
- YouTube Shorts: [hashtagtools.io](https://hashtagtools.io/blog/youtube-tags-limit-how-many-tags-2026) · [vaizle.com](https://insights.vaizle.com/best-hashtags-for-youtube-shorts/)
- Búsqueda en TikTok: [capcut.com](https://www.capcut.com/create/tiktok-caption-keywords-discoverability) · [metadatareactor.com](https://metadatareactor.com/blog/tiktok-seo-guide-2026/)
- Etiquetas de IA: [commonthreadco.com](https://commonthreadco.com/blogs/coachs-corner/tiktok-ai-ad-disclosure-rules-ecommerce-2026) · [stellarsearch.co.uk](https://www.stellarsearch.co.uk/insight/tiktoks-ai-ad-disclosure-rules-are-live-what-brands-running-ai-creative-need-to-do-now) · [cinerads.com](https://www.cinerads.com/blog/ai-ad-disclosure-requirements)
- Creative Center: [snaklab.lovable.app](https://snaklab.lovable.app/en/blog/tiktok-creative-center-guide/)
- Higgsfield (uso comercial): [higgsfield.ai, centro de ayuda](https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially)
