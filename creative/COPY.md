# Copy, descripciones y hashtags

Guía para el pack de cada creatividad (`packs/<ID>.md`, generado con `lab pack` y validado con `lab check`).

**Principio:** no hay reglas inventadas ni recomendaciones presentadas como certezas. Mejor «no está verificado todavía» que una afirmación falsa. Y el objetivo sigue siendo hacer mejores anuncios: el pack se rellena rápido porque `lab pack` y `lab rules` generan la parte de cumplimiento.

## Reglas de plataforma: no son permanentes

Límites de caracteres, número de hashtags, formatos, zonas seguras, restricciones de copy y etiquetas de IA **cambian**. Cada regla de `config/platforms.json` y `config/safe-zones.json` lleva su nivel de verificación y la fecha de la última comprobación:

| Nivel | Cuándo | Efecto en `lab check` |
|---|---|---|
| **VERIFICADA EN FUENTE OFICIAL** | Se ha leído la documentación oficial actual (WebFetch con contenido real, o captura del propietario) | Puede bloquear (error) |
| **FUENTE OFICIAL NO ACCESIBLE DIRECTAMENTE** | Hay página oficial localizada, pero no se ha podido leer | Aviso |
| **FUENTE SECUNDARIA** | Solo medios, blogs o agregadores | Aviso |
| **PENDIENTE DE VERIFICACIÓN** | Sin fuente comprobada (p. ej. conocimiento previo de Claude) | Aviso |

Equivale a las etiquetas de la investigación semanal (`research/topics.md`): VERIFICADA EN FUENTE OFICIAL = VERIFICADO EN FUENTE ORIGINAL de una fuente oficial.

Antes de usar una regla como criterio importante:
1. Intentar leer la documentación oficial actual.
2. Si no se puede, decir el nivel de evidencia junto a la recomendación.
3. Dejar que la investigación semanal la revalide; con más de 60 días desde la fecha, `lab check` pide revalidarla.

Hoy (2026-10-07) **ninguna regla está verificada en fuente oficial**: la red de este entorno bloquea ads.tiktok.com, facebook.com, support.google.com y eur-lex.europa.eu. Así que ninguna bloquea el pack; todas avisan con su nivel. Cambiar un nivel o un límite en `platforms.json` es un cambio del Lab: la investigación semanal lo **propone** y el propietario lo aprueba.

## Principios

1. **El copy acompaña al vídeo; no lo repite ni lo contradice.** La promesa del hook se cumple en el vídeo, en el copy y en la landing (mismo precio, envío y producto).
2. **Solo lo confirmado del producto** (`config/claims.json`). El pack lista los claims utilizados y `lab check` avisa si alguno no está confirmado. Ante una pregunta sobre algo no confirmado, se responde «lo comprobamos y te decimos», nunca de memoria.
3. **Palabra clave primero.** La frase que buscaría el cliente («pulsera rosario») va al principio de la descripción y, si encaja, en el texto del vídeo. Parece que TikTok e Instagram clasifican por lo que se dice, se lee y se escribe, no solo por los hashtags (FUENTE SECUNDARIA, K-TT-06).
4. **Una idea por pieza.** Las variantes de descripción cambian una sola cosa: ángulo, primera frase o CTA.
5. **Sin urgencia, recuentos, estrellas, «viral», «más vendido» ni ocasiones concretas** salvo petición (R9, R14, D31). `lab check` lo bloquea.
6. **Tono respetuoso con el símbolo religioso.** No se banaliza («accesorio tendencia»), no se afirma la fe del usuario («tu fe», política de Meta) y las críticas se responden con respeto.

## Cada contexto tiene su copy

El mismo texto no se reutiliza automáticamente. `lab check` avisa si la descripción o el texto principal se repiten entre plataformas (salvo Spark Ads, que usa el post orgánico de TikTok).

| Contexto | Quién lo lee y cómo | Hook | Descripción / texto | CTA | Tono y longitud | Hashtags | Comentario fijado |
|---|---|---|---|---|---|---|---|
| **Copy de tienda** (Shopify) | Quien ya ha hecho clic y decide | — | Ficha completa y exacta: medidas, materiales, envío, devoluciones | Añadir al carrito | Informativo; sin límite práctico | No | — |
| **TikTok orgánico** | Usuario que no busca comprar; también llega por búsqueda | Texto en pantalla 0-2 s y primera línea | Palabra clave al principio, conversacional; invita a comentar | Suave: pregunta o «el enlace en el perfil» | Natural, cercano; corto | Sí, específicos | Sí: resuelve la duda más previsible |
| **TikTok Ads** | Usuario frío; el anuncio debe parecer contenido | El del vídeo manda | Una frase con el beneficio concreto | Botón (Comprar ahora, Más información) | Directo; muy corto | No suelen aportar en In-Feed | En Spark Ads, el del post |
| **Instagram Reels** (orgánico) | Seguidores y descubrimiento; más estético | Texto en pantalla + primera línea | Lo importante al principio; puede describir más | Guardar, comentar o «enlace en el perfil» | Cuidado, visual | Sí, pocos y concretos | Opcional: pregunta o dato útil |
| **Meta Ads** | Usuario frío en feed, Reels y Stories | Primera línea del texto principal | Texto principal + título + descripción, cada uno con su función | Botón | Claro; el título resume la oferta | No aportan | No aplica |
| **YouTube Shorts** | Descubrimiento y búsqueda | Título | Título con palabra clave; descripción breve | Suscribirse o enlace | Descriptivo | Pocos; algunos se muestran junto al título | Opcional |

Las columnas son criterios de práctica (FUENTE SECUNDARIA o HIPÓTESIS), no reglas de plataforma; los límites con número están abajo.

## Límites por plataforma

Lo que aplica el checker está en `config/platforms.json`; esta tabla lo resume. El pack copia los que usa en «Reglas de plataforma usadas» (`lab rules packs/<ID>.md` los regenera).

| Plataforma | Campos del pack | Límite o práctica | Nivel · fecha |
|---|---|---|---|
| **TikTok orgánico** | Hook · Descripción · Hashtags · CTA · Comentario fijado | Descripción de hasta 4.000 caracteres en la app (2.200 por API), ~100 visibles. 3-5 hashtags concretos es práctica, no un límite | FUENTE SECUNDARIA · 2026-10-07 |
| **TikTok Ads** | Hook · Texto del anuncio · CTA (botón) | Texto In-Feed de 1-100 caracteres. En Spark Ads se usa la descripción del post orgánico | FUENTE SECUNDARIA · 2026-10-07 |
| **Instagram Reels** | Hook · Descripción · Hashtags · CTA · Comentario fijado | Descripción de hasta 2.200 caracteres, ~125 visibles. Máximo 5 hashtags desde diciembre de 2025 (descripción y primer comentario juntos) | FUENTE SECUNDARIA (varios medios coinciden) · 2026-10-07 |
| **Meta Ads** | Hook · Texto principal · Título · Descripción · CTA (botón) | ~125 caracteres visibles del texto principal en el feed, menos en Reels. Título ≤27 recomendado (40 máx.). Descripción ≤27 (30 máx.) | FUENTE SECUNDARIA · 2026-10-07 |
| **YouTube Shorts** | Título · Descripción · Hashtags · Comentario fijado | Título de hasta 100 caracteres. Descripción de hasta 5.000. Con más de 60 hashtags YouTube ignoraría todos | FUENTE SECUNDARIA · 2026-10-07 |
| Zonas seguras | `config/safe-zones.json` | Meta: cifras atribuidas a su guía de Reels. TikTok: guías de terceros que no coinciden | FUENTE SECUNDARIA · 2026-10-07 |

## Hashtags: específicos y razonados para cada vídeo

No hay listas fijas. Para cada vídeo se eligen a partir de lo que muestra y de a quién va dirigido:

| Tipo | Para qué | Ejemplo (pulsera rosario) |
|---|---|---|
| Producto | Lo que buscaría quien ya quiere esto | #pulserarosario |
| Nicho | Comunidad que valora el producto | #rosario · #virgenmaria |
| Intención | Compra, estilo o uso | #joyeria |
| Audiencia | Quién es | #catolicos |
| Temática | De qué trata el vídeo | #joyeriareligiosa |
| País | Solo si aporta (contenido local, idioma) | normalmente no hace falta: idioma y ubicación ya orientan a España |
| Tendencia | **Solo** si el vídeo participa de verdad en ella (formato, sonido o tema) y hay dato reciente | según la semana |
| Contexto del vídeo | Lo concreto de esta pieza | p. ej. #detallesjoyeria si el vídeo es un primer plano |

- **#viral, #fyp, #parati** y similares (`hashtags_genericos`) no se usan por popularidad. `lab check` avisa si aparecen sin una línea propia que explique qué aportan a ese vídeo. #viral además se bloquea (R9).
- Cada hashtag lleva su línea en «Hashtags: por qué» (`- #tag: tipo · por qué`). Con `--final`, `lab check` avisa de los que no la tienen.
- El número de hashtags es una regla de plataforma más (ver arriba): se cita con su nivel de evidencia.
- **Nunca se promete** que un hashtag dé alcance ni viralidad.

### Datos de volumen y tendencia: no disponibles

Desde este entorno **no hay acceso** a TikTok Creative Center (Trends y Keyword Insights) ni a las páginas de hashtags: la red las bloquea y además son dinámicas. Por eso la sección «Hashtags: por qué» de cada pack dice «Volumen y tendencia: NO DISPONIBLE» salvo que haya datos. Los hashtags se razonan con el vídeo, el producto, la audiencia y el conocimiento vigente (`research/marketing-current-knowledge.md` de la rama `claude/garelon-marketing-research`). Cuando el volumen importe, la vía gratuita es:

1. Creative Center → Trends → Hashtags, **región España**, sector y ordenado por 7 días. Pegar aquí una captura o la lista.
2. Las sugerencias del buscador de TikTok e Instagram al escribir la palabra clave.

Los scrapers de pago (Apify y similares) quedan fuera mientras no los apruebes.

## Comentario fijado y respuestas

- **Comentario fijado** (por plataforma, si aplica): resuelve la duda más previsible (medida, material, ajuste) o invita a una pregunta concreta. Sin precio, salvo que sea el de Shopify ese día. No tiene por qué ser igual en TikTok, Instagram y YouTube.
- **Respuestas:** preparadas para las preguntas previsibles y solo con datos confirmados. Si piden algo no confirmado (material de la medalla, resistencia al agua, plazos), se responde que se comprueba. Nunca se inventan opiniones, ventas ni stock.
- Las críticas (religiosas o de precio) se responden con respeto y una sola vez; no se discute.

## Personas generadas con IA (Higgsfield u otras)

Si el vídeo muestra a una persona usando o enseñando el producto, no se asume que es un testimonio: se mira **cómo se presenta**. El pack lo recoge en «Personas generadas con IA»:

| Valor | Cuándo | ¿Se puede usar? |
|---|---|---|
| NO HAY | No sale nadie, o solo material real con permiso | Sí |
| RECURSO VISUAL | Manos, muñeca o una modelo llevando el producto, sin hablar de su experiencia | Sí |
| PRESENTADOR | Habla a cámara y explica el producto (qué es, medidas, materiales) sin decir que lo ha usado | Sí |
| RIESGO DE TESTIMONIO | Habla o se presenta como una clienta real contando una experiencia personal que nunca ocurrió («desde que la llevo…», «me encanta, no me la quito») | **No** tal cual (R14, testimonio falso). Se avisa al propietario; se reformula como presentador o voz de marca, o se quita ese plano |

`lab check` busca frases en primera persona que suenan a experiencia en el hook, el body y el copy cuando hay material de IA, y avisa. Con «RIESGO DE TESTIMONIO» el pack no pasa `--final`.

## Etiqueta de IA

Si un vídeo usa material de IA (`lab ingest --origen ia`), el Lab **avisa** de que puede necesitar etiqueta, pero no presenta como definitiva una obligación que no se ha podido comprobar en la fuente oficial. Recomendación por defecto: etiquetar (cuesta poco) y comprobar la opción en la interfaz al subir.

| Dónde | Qué se sabe | Nivel · fecha |
|---|---|---|
| TikTok Ads | Desde el 2026-07-21, los anuncios con imagen, voz o personas realistas generadas o muy editadas con IA llevarían la etiqueta de contenido IA (interruptor AIGC al subir); TikTok la detectaría también por metadatos C2PA | FUENTE SECUNDARIA (varias fuentes coinciden; ads.tiktok.com bloqueado) · 2026-10-07 |
| TikTok orgánico | Opción «contenido generado por IA» al publicar | FUENTE SECUNDARIA · 2026-10-07 |
| Meta (Instagram y anuncios) | Meta marca «Información de IA» por su cuenta (C2PA) y pide declarar personas y escenas realistas sintéticas | FUENTE SECUNDARIA · 2026-10-07 |
| YouTube Shorts | YouTube pediría declarar el contenido realista alterado o sintético al subir | PENDIENTE DE VERIFICACIÓN · 2026-10-07 |
| UE | Ley de IA, art. 50, desde el 2026-08-02: avisar del contenido realista generado o manipulado con IA. No es asesoramiento jurídico | FUENTE SECUNDARIA (eur-lex bloqueado; K-REG-01) · 2026-10-07 |

`lab pack` pone «Etiqueta IA: SÍ (recomendada…)» y lo explica en «Avisos de cumplimiento». Si el propietario decide NO, `lab check` avisa (no bloquea) y pide el motivo en «Notas internas». Si el origen no está registrado, el pack no pasa `--final` hasta registrarlo.

## Pack final: qué documenta

| Campo | Dónde |
|---|---|
| ID | Título del pack (= props, MP4 y nombre del anuncio) |
| Vídeo · Origen del material · Plataformas | Tabla |
| Hook · Body · CTA | Secciones del vídeo; cada plataforma adapta su **Hook:** y **CTA:** |
| Descripción · Hashtags · Comentario fijado | Sección de cada plataforma |
| Ángulo · Variable · Hipótesis · Métrica principal | Tabla |
| Personas generadas con IA · Etiqueta IA | Tabla |
| Claims utilizados | Sección (deben estar en `claims.json` → confirmados) |
| Avisos de cumplimiento | Sección (lista de comprobación antes de publicar) |
| Nivel de verificación de las reglas usadas | «Reglas de plataforma usadas», generada desde `platforms.json` |

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
- Intento de lectura de fuentes oficiales (2026-10-07): ads.tiktok.com, www.facebook.com, support.google.com y eur-lex.europa.eu → bloqueados por la red del entorno. Por eso nada está VERIFICADO EN FUENTE OFICIAL.
