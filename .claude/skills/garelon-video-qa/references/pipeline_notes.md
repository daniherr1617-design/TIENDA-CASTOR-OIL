# Encaje con el flujo Higgsfield

Flujo: archivo existente → **QA `pre`** → propuesta → coste → aprobación de Daniel → Higgsfield → **QA `post-*`** → siguiente variante.

| Herramienta Higgsfield | Stage QA | Qué esperar |
|---|---|---|
| ByteDance Video Upscale (`bytedance_video_upscale`, preset `aigc`/`common`, 1080p/2K/4K) | `post-upscale` | Mismo encuadre y tiempo: SSIM alto. Lo importante es el detalle de las piezas frente al original en la misma posición. |
| Higgsfield Video Upscale (`video_upscale`) / Topaz (`topaz_video`) | `post-upscale` | Igual que ByteDance. |
| Seedance 2.5 `mode: video_edit` | `post-edit` | El tiempo se conserva y el contenido cambia a propósito. SSIM global bajo esperable; el producto se compara con las referencias. |
| Genjutsu (`hf_mult_replace_object`) | `post-edit` | El objeto se sustituye. Hay que comprobar que la pulsera resultante sea la de la referencia y no una parecida. |
| Generación nueva (Seedance, Kling, etc.) | `post-generate` | Sin similitud de píxel. Cuentan la estructura, las proporciones, el color y el producto. |

## Datos útiles de `pre`

- Resolución de partida: si es 9:16 menor que 1080×1920, se puede escalar. Valorar upscale dedicado frente a un reescalado local sin créditos.
- Escenas y duración: `flux_3_video_edit` procesa como máximo 15 s (confirmado en el catálogo). Para los demás modelos, consultar `models_explore` antes de afirmar límites.
- Visibilidad de la pulsera por frame: ayuda a elegir el tramo que se envía a editar.

## Tras el informe

- **REPETIR UPSCALE:** proponer preset o modelo distinto, con coste (`get_cost`) y aprobación.
- **REGENERAR / DESCARTAR PLANO:** indicar timestamps; proponer prompt con restricciones de producto y coste.
- **RE-EXPORTAR (técnico):** se resuelve en local con ffmpeg y sin créditos. Aun así, pedir permiso antes de escribir el archivo nuevo.
