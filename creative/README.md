# GARELON Creative & Ads Lab

Sistema mínimo para convertir material real del producto en anuncios verticales (TikTok, Reels, Meta, Shorts) razonados, reconstruibles y medibles. **No forma parte del tema Shopify** (`.shopifyignore` excluye esta carpeta y `tools/build_zip.py` solo empaqueta las carpetas del tema).

## Instalación (cada sesión cloud nueva)

```bash
creative/setup.sh                       # Remotion + faster-whisper + carpetas de trabajo (~1 min)
creative/setup.sh --model large-v3-turbo  # además descarga el modelo de Whisper (≈1,6 GB, una vez por sesión)
```

El contenedor cloud es efímero: todo lo que hay en `creative/media` y `creative/.cache` desaparece al cerrar la sesión. **Los originales viven fuera** (tu ordenador o tu nube) y se vuelven a subir cuando haga falta.

### Red necesaria para Whisper

El modelo se descarga de Hugging Face (con el cliente Xet). En la configuración de red del entorno, *Allowed domains*:

```
huggingface.co
*.huggingface.co
hf.co
*.hf.co
```

Sin ellos, todo lo demás funciona; solo `lab transcribe` falla con un 403.

## Flujo

```
original ─ lab ingest ─▶ 00_originales (solo lectura + SHA-256) y 01_intermedio/<NOMBRE>/work.mp4 (30 fps)
          lab analyze ─▶ silencios, cambios de plano, sonoridad, hojas de fotogramas cada 0,5 s
       lab transcribe ─▶ transcript.json (palabras con tiempo) + .srt   [faster-whisper local]
             lab cuts ─▶ cuts.json: tramos sin silencios + palabras reubicadas en la línea final
   props/<ID>.json     ◀ decisión creativa: segmentos, hook, subtítulos, overlays, zooms, CTA, sonido
            lab check ─▶ claims prohibidos (config/claims.json) + coherencia
           lab render ─▶ Remotion → 02_renders → sonoridad −14 LUFS + faststart → 03_finales + QA + manifest.csv
```

| Comando | Qué hace |
|---|---|
| `creative/lab ingest <archivo> --name ROSARIO_ORIGINAL_01` | Copia el original sin tocarlo, lo protege y prepara la copia de trabajo. Nunca sobrescribe un original con otro contenido |
| `creative/lab analyze ROSARIO_ORIGINAL_01` | Primer sonido, silencios, cambios de plano, sonoridad y hojas de fotogramas con tiempo real |
| `creative/lab transcribe ROSARIO_ORIGINAL_01 [--model small]` | Transcripción local en español con tiempos por palabra |
| `creative/lab cuts ROSARIO_ORIGINAL_01 [--max-gap 0.3]` | Propone cortes sin silencios (con transcripción o, si no hay, con `silencedetect`) |
| `creative/lab check props/<ID>.json` | Bloquea claims prohibidos; avisa de precio, envío y ocasiones |
| `creative/lab render props/<ID>.json` | Check → render → normalización → QA → manifest |
| `creative/lab qa <archivo.mp4>` | Especificaciones, sonoridad y fotogramas con la zona segura dibujada |

Para previsualizar en local (con navegador): `cd creative/remotion && npm run studio`.

## Estructura

```
creative/
  setup.sh · lab · requirements.txt (Python fijado)
  config/brand.json        colores y fuentes del tema (marfil, dorado, carbón · Inter + Lora)
  config/safe-zones.json   márgenes por plataforma (meta · tiktok · universal)
  config/claims.json       claims confirmados y patrones prohibidos del producto actual
  props/<ID>.json          receta completa de cada anuncio (versionada: permite reconstruirlo)
  remotion/                plantilla única AdVertical (1080×1920, 30 fps)
  scripts/lab.py           herramienta de línea de comandos
  manifest.csv             registro de cada render final: id, SHA-256, duración, props, commit, fuentes
  METRICAS.md · metrics/   análisis de campañas por anuncio
  media/                   (fuera de git) 00_originales · 01_intermedio · 02_renders · 03_finales
```

## Nombres

`<PRODUCTO>_AD<nn>_<VARIABLE>-<VALOR>_V<n>`. Ejemplos: `ROSARIO_AD01_HOOK-CURIOSIDAD_V1`, `ROSARIO_AD01_HOOK-DETALLE_V1`, `ROSARIO_AD01_CTA-ELIGE_V2`, `ROSARIO_AD02_UGC_V1`.

- El **mismo ID** es el nombre del archivo de props, del MP4 final y **del anuncio en Meta o TikTok**: así las métricas se cruzan sin ambigüedad.
- Dentro de un `AD<nn>` cada variante cambia **una sola variable** respecto al control `V1`; la variable va en el nombre.
- Originales: `<PRODUCTO>_ORIGINAL_<nn>`, imágenes `<PRODUCTO>_IMG_<DESCRIPCIÓN>`.

## Plantilla AdVertical (props)

Tiempos en segundos sobre la línea final (salvo `from`/`to` de un clip, que son del vídeo fuente).

| Campo | Uso |
|---|---|
| `segments[]` | `{type:"video", src, from, to}` o `{type:"image", src, duration}` + `fit` (cover/contain), `zoom:[inicio,fin]`, `focusX/Y`, `enter` (cut · fade · punch · slide-up · flash), `band` (franja vertical) |
| `hook` | Tarjeta de texto de marca en los primeros segundos; `highlight` colorea palabras |
| `captions` | Subtítulos dinámicos palabra a palabra (de `lab cuts`); `.` o `,` al final de una palabra fuerza el corte de bloque y no se pinta |
| `overlays[]` | Textos extra con inicio y fin |
| `punches[]` | Zoom de énfasis sobre todo el plano |
| `cta` | Botón dorado + subtítulo, siempre dentro de la zona segura |
| `music` / `sfx[]` | Pista con fundido final / efectos puntuales |
| `platform` | `universal` (por defecto, intersección conservadora de Meta y TikTok), `meta` o `tiktok` |
| `debugLabel` | Etiqueta visible para que una prueba no se confunda con un final |

Las transiciones son **de entrada** (no solapan planos): la duración del anuncio es siempre la suma de los segmentos y los subtítulos no se desincronizan.

## Reglas que aplica el sistema (GARELON)

Producto fiel (R1) · sin «GARELON» sobre el producto · sin claims no confirmados (R3) · sin antes/después (R4) · sin urgencia, escasez, estrellas ni recuentos inventados (R9, R14) · sin garantías inventadas (R10-R11) · GARELON no fabrica (R2) · regalo genérico sin ocasiones concretas salvo petición (D31) · nada de «tu fe» dirigido al usuario (política de Meta sobre atributos personales) · la infografía no se usa en anuncios mientras su icono de regalo pueda leerse como packaging incluido.

`lab check` automatiza lo que se puede detectar por texto. **No sustituye la revisión humana**: fidelidad visual, contexto y promesas implícitas se revisan en los fotogramas de QA.

## Costes y licencias

- Remotion: gratis para particulares y empresas de hasta 3 empleados (también uso comercial). A partir de 4, licencia de empresa.
- FFmpeg, faster-whisper y modelos Whisper: gratuitos y locales. Sin APIs de pago.
- La música y los efectos de las pruebas (`TEST_*`) son sintéticos y solo sirven para probar. Para anuncios reales, usar la biblioteca comercial de cada plataforma o música con licencia.
