# Conocimiento de marketing vigente · GARELON

> **Última actualización:** 2026-10-07 (`reports/2026-10-07.md`, línea base, y consulta del Lab sobre copy, hashtags y etiquetas de IA). Contiene **solo lo que sigue siendo relevante hoy**. Cuando algo cambia, se reescribe la entrada y lo anterior pasa a «Historial de cambios» con su motivo. Nunca dos entradas contradictorias sin explicación: si las fuentes no coinciden, va a «Contradicciones abiertas».
>
> Formato: `[ID] estado · afirmación · evidencia · desde · comprobado · fuente`. Estado: `✔` confirmado en fuente oficial · `~` solo fuentes secundarias · `✘` contradictorio. Evidencia: OFICIAL · ESTUDIO · MEDIO · AGREGADOR · COMUNIDAD.

## 1. Lo que condiciona todo en GARELON

- Las reglas de producto fiel (R1), claims (R3), sin antes/después (R4), sin dark patterns (R9) y opiniones reales (R14) están **por encima** de cualquier táctica de este documento. Una táctica que las choque no se aplica.
- Mercado: España (UE). Toda novedad se filtra por «¿aplica en la UE/España?». Si no consta: NO DISPONIBLE.
- Sin campañas activas conocidas; píxeles y API de conversiones NO DISPONIBLES (pendiente de verificar antes de lanzar).

## 2. Meta

- **[K-META-01] ~** Advantage+ es el punto de partida de las campañas nuevas de Ventas, Clientes potenciales y Apps, y las mejoras de Advantage+ Creative vienen **activadas por defecto** (música, color, animar imágenes, recolocar texto, expandir imagen). Las mejoras «de prueba» generan contenido nuevo (fondos, textos) sin vista previa. Desde marzo de 2026 la desactivación se recordaría en campañas futuras. · MEDIO/AGREGADOR · desde ~2026-09 · comprobado 2026-10-07 · marketingbrew.com 2026-04-07, leapbuzz.com
  - **Implicación:** checklist obligatorio antes de lanzar: desactivar todo lo que pueda alterar el producto y revisar la vista previa en cada ubicación.
- **[K-META-02] ~** Muse Image (generación de imágenes de Meta) se anunció el 2026-07-07 para integrarse en Advantage+ «en las próximas semanas». A 2026-09-21 no había confirmación oficial de disponibilidad. · MEDIO · comprobado 2026-10-07 · winbuzzer.com 2026-07-08, segwise.ai
- **[K-META-03] ~** Andromeda (sistema de recuperación de anuncios, desplegado globalmente en octubre de 2025) premia la **diversidad real de creatividades** frente a microvariantes del mismo anuncio. Las cifras de ROAS que circulan no están verificadas. · AGREGADOR · comprobado 2026-10-07 · confect.io
- **[K-META-04] ~** En la UE, desde enero de 2026 los usuarios pueden elegir «anuncios menos personalizados» (LPA), con mucha menos información sobre ellos: segmentación más débil para esa parte de la audiencia y más peso de la creatividad. · MEDIO · comprobado 2026-10-07 · sigma.world
- **[K-META-05]** Política (ya en el Lab): no afirmar ni insinuar atributos personales del usuario (religión, salud…). «Un símbolo de fe» sí; «tu fe», no. · reference `marketing-launch.md` del proyecto · comprobado 2026-10-07

## 3. TikTok

- **[K-TT-01] ~** Advertising Week 2026 (2026-10-05): Smart+ Creative Selection, Search Ads con Smart+, Buy Direct y Shopping Assistant (comercio agéntico; socios incluido Shopify), Agentic Leads, cambios en GMV Max y red de apps abierta a EE. UU. Disponibilidad en España: NO DISPONIBLE. · MEDIO · comprobado 2026-10-07 · socialmediatoday.com
  - **Implicación:** en los tests de una variable, aislar o desactivar Creative Selection.
- **[K-TT-02] ~** Symphony genera vídeo con Dreamina Seedance 2.5 (hasta 30 s, gratis para anunciantes desde agosto de 2026). **No se usa para el producto (R1).** · OFICIAL/MEDIO · comprobado 2026-10-07 · ads.tiktok.com (blog), mediapost.com 2026-04-15
- **[K-TT-03] ~** Desde el **2026-07-21** las políticas de anuncios de TikTok exigen etiquetar el contenido generado o muy editado con IA: imagen, voz o personas y escenas realistas. Se hace con el interruptor AIGC al subir el anuncio. TikTok también lo detecta por metadatos C2PA, y saltárselo escala hasta la suspensión de la cuenta. · MEDIO/AGREGADOR · comprobado 2026-10-07 · commonthreadco.com, stellarsearch.co.uk
  - **Implicación:** los vídeos base de Higgsfield llevan etiqueta de IA en TikTok (y aviso en Meta y la UE, K-REG-01). El Lab lo controla con `lab ingest --origen` y `lab check` del pack.
- **[K-TT-06] ~** La búsqueda de TikTok usa lo que se dice, el texto en pantalla, la descripción y los hashtags. Pesan más las palabras clave en la descripción (primeros ~100 caracteres) y en el vídeo que acumular hashtags. Se recomiendan 3-5 hashtags; 20 o más cuentan como spam. · AGREGADOR · comprobado 2026-10-07 · capcut.com, metadatareactor.com
- **[K-TT-04] ✔** TikTok Shop está en España desde diciembre de 2024 y se amplió a Austria, Bélgica, Países Bajos y Polonia el 2026-06-15. No es canal para GARELON mientras el envío venga de AliExpress (hipótesis sin verificar sobre los requisitos logísticos). · OFICIAL · comprobado 2026-10-07 · newsroom.tiktok.com
- **[K-TT-05] ✔** EE. UU.: algoritmo reentrenado por la joint venture con datos de EE. UU. desde el 2026-01-22. Sin efecto conocido en la UE. · MEDIO · comprobado 2026-10-07 · 9to5mac.com 2026-01-23

## 4. Reels orgánicos (Instagram y Facebook)

- **[K-REELS-01] ~** Señales de ranking citadas: tiempo de visualización, **envíos por alcance (DM)** y «me gusta» por alcance. Se añade la tasa de salto (skip rate). Máximo de 5 hashtags. Las cuentas que sobre todo republican contenido ajeno salen de las recomendaciones (desde 2026-04-30). · AGREGADOR · comprobado 2026-10-07 · metricool.com, usefastlane.ai
  - **Implicación:** arranque sin relleno (salto) y contenido que apetezca enviar (regalo genérico, D31). Contenido siempre original.
- **[K-REELS-02] ~** El límite de 5 hashtags (desde diciembre de 2025) suma descripción y primer comentario. Instagram clasifica cada vez más por lo que ve, oye y lee en el vídeo y la descripción. · MEDIO · comprobado 2026-10-07 · socialmediatoday.com
- **[K-YT-01] ~** YouTube Shorts: con más de 60 hashtags se ignoran todos; se muestran 3 junto al título; el título admite 100 caracteres. · AGREGADOR · comprobado 2026-10-07 · hashtagtools.io

## 5. Creatividad y testing

- **[K-CRE-01] ~** Motion Creative Benchmarks 2026 (más de 550.000 anuncios de Meta): tasa de acierto de hooks «solo oferta» 9,29 %, curiosidad 7,77 %, storytelling 6,23 %. Estilos: fundador 8,57 %, cartel 7,86 %, UGC con texto superpuesto 6,73 %, señalar característica y beneficio 5,61 %. Son **hipótesis de test**, no reglas, y la muestra es sobre todo de EE. UU. · ESTUDIO · comprobado 2026-10-07 · motionapp.com
- **[K-CRE-02]** Práctica habitual, no verificada: hook en 0-2 s, un solo beneficio y CTA, en 15 s o menos. Validar con nuestra curva de retención. · AGREGADOR · comprobado 2026-10-07
- **[K-CRE-03]** Testing en dos fases (síntesis propia de K-META-03 y del Lab): **exploración** con 4-6 conceptos realmente distintos y **iteración** del ganador cambiando una sola variable. · hipótesis de trabajo · desde 2026-10-07
- **[K-CRE-04]** UGC solo real y con permiso. El guionizado no se presenta como espontáneo (regla GARELON). Consenso práctico: el «UGC falso» se detecta. · regla + COMUNIDAD · comprobado 2026-10-07

## 6. Medición

- **[K-MED-01] ~** Meta retiró las ventanas de atribución de 7 y 28 días por visualización el 2026-01-12 y redefinió el clic en marzo de 2026. Hay atribución incremental opcional (desde abril de 2025). Al comparar periodos, anotar siempre la ventana usada. · AGREGADOR · comprobado 2026-10-07 · zentric.digital
- **[K-MED-02] ~** La API de conversiones junto al píxel se considera imprescindible. Las cifras de cobertura citadas no están verificadas. En GARELON, el estado es NO DISPONIBLE: verificarlo antes de lanzar. · AGREGADOR · comprobado 2026-10-07
- **[K-MED-03] ~** TikTok Ads Manager tiene una opción de seguimiento «Engaged Session» (septiembre de 2026). Pendiente de confirmar en documentación oficial. · AGREGADOR · comprobado 2026-10-07 · leadzai.com
- **[K-MED-04] ~** Benchmarks orientativos (muestras pequeñas, sobre todo de EE. UU.): CPM de Meta e-commerce unos 13,5 $; TikTok In-Feed retail unos 5,40 $. **Para España: NO DISPONIBLE.** Nuestras referencias serán nuestras propias campañas. · AGREGADOR · comprobado 2026-10-07

## 7. E-commerce, Shopify y logística

- **[K-ECO-01] ~** Shopify: checkout directo con Shop Pay activado por defecto para comerciantes elegibles de EE. UU. (2026-09-21). Agentes de navegador con WebMCP pueden completar el checkout en tiendas elegibles (2026-09-28; Meta Muse e Instinct). OpenAI abandonó Instant Checkout. Elegibilidad en España: NO DISPONIBLE. · MEDIO · comprobado 2026-10-07 · techcrunch.com 2026-09-28
  - **Implicación:** los datos del producto en Shopify Admin (título, descripción, multimedia) son el escaparate para agentes, feeds y catálogo: deben ser fieles.
- **[K-ECO-02] ~** UE: arancel de 3 € por partida en envíos de menos de 150 € desde el 2026-07-01 (provisional hasta el 2028-07-01), para todos los marketplaces de fuera de la UE. Verificar el efecto real en nuestros pedidos de AliExpress. · MEDIO · comprobado 2026-10-07 · avalara.com, trans.info

## 8. Regulación UE y España

- **[K-REG-01] ~** Ley de IA, art. 50 (aplicable desde el 2026-08-02): el contenido generado o manipulado con IA que parezca auténtico debe avisarse de forma visible o audible. Las etiquetas automáticas de las plataformas no bastarían por sí solas. **No es asesoramiento jurídico.** · AGREGADOR · comprobado 2026-10-07 · walls.io, solidlabs.com
  - **Implicación:** registrar el origen (real, editado o IA) de cada material y decidir el aviso por anuncio.
- **[K-REG-02] ~** Digital Fairness Act: propuesta prevista para el cuarto trimestre de 2026, contra la urgencia y escasez falsas, la manipulación y las trampas de suscripción. GARELON ya lo cumple (R9). · MEDIO · comprobado 2026-10-07 · eff.org

## 9. IA y herramientas para el Creative Engine

- **[K-IA-01]** Sin cambios recomendados en Remotion + FFmpeg + faster-whisper. Las suites generativas (Symphony/Seedance, Muse) no son compatibles con R1 cuando tocan el producto. · comprobado 2026-10-07
- **[K-IA-03] ~** Higgsfield (herramienta de vídeo base del propietario): el uso comercial de lo generado está permitido y es del usuario. A cambio, Higgsfield obtiene licencia para usar lo subido y lo generado para entrenar sus modelos. · OFICIAL (centro de ayuda) · comprobado 2026-10-07 · higgsfield.ai
- **[K-IA-02] ~** MCP oficiales de anuncios: Meta (beta desde abril de 2026, `mcp.facebook.com/ads`) y TikTok (anunciado en mayo de 2026). Uso previsto: solo lectura de métricas y con aprobación. · MEDIO · comprobado 2026-10-07

## 10. Contradicciones abiertas

- **[C-01] Duración de los Reels recomendables.** Una fuente dice que desde septiembre de 2026 los Reels de más de 3 minutos no se recomiendan a nuevas audiencias (usefastlane.ai). Otra dice que los Reels de hasta 20 minutos ya pueden recomendarse (búsqueda del 2026-10-07). Ninguna es oficial. Impacto para GARELON: nulo (nuestros vídeos duran entre 9 y 30 s). Resolver con una fuente de Instagram o Mosseri.

## 11. Pendiente de verificar en fuente oficial

K-META-01 · K-META-02 · K-TT-01 · K-TT-03 · K-MED-03 · K-ECO-01 (aplicación en España) · K-ECO-02 (reglamento) · K-REG-01 (texto oficial y guía de la Comisión). Desde este entorno las fuentes oficiales no se pueden leer directamente (403 de la red).

## 12. Historial de cambios

| Fecha | Cambio | Motivo |
|---|---|---|
| 2026-10-07 | Creación (línea base) | Primera ejecución del sistema |
| 2026-10-07 | K-TT-03 reescrito con la política de TikTok del 2026-07-21; nuevos K-TT-06, K-REELS-02, K-YT-01 y K-IA-03 | Consulta del Lab al ampliar su enfoque a copy, hashtags y vídeos base de Higgsfield |
| 2026-10-07 | Corregido antes de publicar: «Muse Image en Advantage+ desde septiembre» → anunciado el 2026-07-07 y sin disponibilidad confirmada | La verificación contradijo a los agregadores |
