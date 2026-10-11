---
name: garelon-video-qa
description: Control de calidad local de vídeos GARELON antes y después de Higgsfield (Seedance, Genjutsu, ByteDance/Higgsfield/Topaz Upscale). Comprueba resolución 1080×1920, FPS, duración, bitrate, codec, frames corruptos, congelados o parpadeos, compara original y resultado (SSIM como señal) y verifica la fidelidad de la pulsera (medalla, cruz, cuentas, cierre, proporciones, color) contra las referencias aprobadas, con lámina lado a lado para revisión humana. Informe PASS/WARNING/FAIL con timestamps y recomendación (aprobar, repetir upscale, regenerar, re-exportar). Úsala siempre que haya que revisar, validar, aprobar o comparar un vídeo de GARELON, antes de enviarlo a Higgsfield o tras recibir un resultado, aunque no se pida "QA" explícitamente. No genera vídeos, no llama a Higgsfield y no gasta créditos.
allowed-tools: Bash(ffprobe *) Bash(ffmpeg -hide_banner *)
---

# garelon-video-qa

Revisa vídeos de GARELON con herramientas locales (ffmpeg + OpenCV + numpy + Pillow) y produce un informe breve. Sirve para decidir con datos y con una lámina visual si un resultado de Higgsfield se aprueba, se repite o se descarta, antes de gastar más créditos.

## Límites de esta skill

- **No genera vídeos, no llama a Higgsfield ni a otra API y no gasta créditos.** Si el informe recomienda repetir un upscale o regenerar, eso se propone a Daniel con modelo, configuración y coste, y se espera su aprobación explícita. No se lanza nunca desde aquí.
- **Solo lectura sobre los vídeos y las referencias.** Los scripts escriben únicamente en una carpeta nueva de informe: `creative/_qa/<nombre_video>/<fecha-run>/`. No se sobrescriben runs anteriores. Para escribir en cualquier otro sitio, o para mover o borrar archivos, hay que pedir permiso.
- Los scripts no usan la red.

**Por qué:** los créditos cuestan dinero, y un QA que modificara archivos o lanzara trabajos dejaría de ser una revisión fiable.

## Preparación (una vez por entorno)

En el repo, `creative/setup.sh` ya instala OpenCV y Pillow en `creative/.venv` (versiones fijadas en `creative/requirements-qa.txt`). Ejecuta la skill con ese Python:
```bash
creative/.venv/bin/python .claude/skills/garelon-video-qa/scripts/qa.py check-env   # dice qué falta; no instala nada
```
Fuera del repo, si falta OpenCV, propón a Daniel (y ejecuta solo con su permiso):
`python3 -m venv .venv-qa && .venv-qa/bin/pip install opencv-python-headless==4.14.0.94 pillow==12.3.0 numpy`.
LPIPS queda para la v2; no lo instales.

**Relación con `lab fidelity`:** `lab fidelity` genera una hoja rápida con referencias y fotogramas. Esta skill añade métricas por pieza, comparación original/resultado, anomalías técnicas y veredicto. Antes y después de cada trabajo en Higgsfield se usa esta skill.

## Referencias de producto

Las referencias maestras aprobadas están en `creative/_references/product/`, junto con `refs.json`, que declara un recorte (`bbox` en píxeles) por pieza: pulsera, medalla, cruz, cuentas y cierre. Ver `assets/refs.example.json`.

- Usa solo las imágenes aprobadas que aparecen en `references/product_spec.md`. Nunca las marcadas como "No usar".
- Si no hay `refs.json` o falta una pieza, el informe dice "fidelidad no verificada" (WARNING). No inventes referencias.

## Elegir el stage

| Situación | `--stage` | Necesita |
|---|---|---|
| Antes de enviar un vídeo a Seedance, Genjutsu o Upscale | `pre` | `--result fuente.mp4` |
| Resultado de ByteDance, Higgsfield o Topaz Upscale | `post-upscale` | `--original` + `--result` |
| Resultado de Seedance `video_edit` o Genjutsu (`hf_mult_replace_object`) | `post-edit` | `--original` + `--result` |
| Vídeo generado nuevo (image/text→video) | `post-generate` | `--result` |

Añade siempre `--refs creative/_references/product/refs.json` cuando aparezca la pulsera. Usa `--final` cuando sea la entrega para publicar: entonces una resolución distinta de 1080×1920 es FAIL. `--id` y `--platform` enlazan el informe con el registro de creatividades.

```bash
creative/.venv/bin/python .claude/skills/garelon-video-qa/scripts/qa.py run --stage post-upscale \
  --original creative/X/original.mp4 --result creative/X/upscale.mp4 \
  --refs creative/_references/product/refs.json --id GAR-TT-012 --platform tiktok
```
En un vídeo de 6 s tarda alrededor de 1 minuto; escala con la duración.

## Cómo interpretar las métricas

- **SSIM y PSNR son señales.** Nunca deciden por sí solas si la pulsera es fiel. En `post-edit` un SSIM bajo es esperable en la zona editada.
- **En generaciones nuevas no se espera similitud píxel a píxel.** Lo que importa es la estructura, las proporciones, el color y el producto. Por eso las métricas por pieza comparan el recorte normalizado con la referencia, y la decisión final sale de la lámina.
- Los scripts **nunca dan FAIL de producto por sí solos.** Como mucho dan WARNING "SOSPECHA, revisar lámina". El FAIL de producto solo llega con una discrepancia visual clara confirmada en la revisión.
- Una pieza crítica (medalla, cruz, cierre o cuentas) que no se ve o no se localiza da **WARNING**, nunca PASS.
- Sin revisión visual, el veredicto es siempre **provisional** y nunca PASS.
- Piezas con `"auto": false` en `refs.json` (hoy: pulsera, cuentas, cruz y cierre) no se localizan automáticamente, porque la visión clásica no las encuentra de forma fiable en fotos reales. Se juzgan solo en la revisión visual, buscándolas en `contact_sheet.jpg` y `frames/`. Hoy solo la medalla tiene métricas automáticas.
- Limitación conocida: los cambios de **forma** (p. ej. medalla ovalada → rectangular) pueden pasar las métricas automáticas. La lámina es la que los detecta.

## Revisión visual (siempre)

1. Abre `lamina_lado_a_lado.jpg` con la herramienta Read y míralo de verdad. Cada fila es una pieza: referencia | (original) | resultado mejor | resultado peor; al final hay frames completos. Si una pieza tiene sospechas, mira también `contact_sheet.jpg` y los frames de `frames/`.
2. Sigue `references/visual_checklist.md` pieza por pieza.
3. Escribe `visual_review.json` en la carpeta del run con este formato:
```json
{"revisor": "claude", "piezas": {
  "medalla": {"estado": "ok|discrepancia|dudoso|no_visible", "nota": "…", "timestamps": [1.0, 3.0]},
  "cruz": {…}, "cuentas": {…}, "cierre": {…}, "pulsera": {…}}}
```
   Marca `discrepancia` solo cuando el cambio sea claro: otra forma, otro color de cuentas, cruz colgante en vez de integrada, aros que faltan o proporciones evidentes. Si hay duda, usa `dudoso`. Si no se ve bien, usa `no_visible`.
4. Ejecuta `qa.py finalize --run <carpeta_run> --visual <carpeta_run>/visual_review.json`, que recalcula el veredicto.
5. Indica a Daniel que la lámina está disponible para su propia revisión; la revisión humana no se sustituye.

## Informe para Daniel

Usa la cabecera de `report.md` y responde breve:
- veredicto (PASS / WARNING / FAIL) y recomendación;
- problemas principales con gravedad, timestamp y frames;
- enlace al `report.md` y a la lámina;
- si la recomendación implica gastar créditos (repetir upscale o regenerar), propón modelo, configuración y coste, y pide aprobación. No lances nada.

Gravedades: CRITICA → FAIL; ALTA/MEDIA → WARNING; BAJA → nota.

## Archivos de la skill

- `scripts/qa.py`: punto de entrada (`run`, `finalize`, `check-env`)
- `scripts/probe.py`, `anomalies.py`, `compare.py`, `product.py`, `frames.py`, `report.py`
- `assets/thresholds.json`: umbrales **provisionales**, a calibrar con vídeos reales
- `references/product_spec.md`: verdad del producto y referencias aprobadas y prohibidas
- `references/visual_checklist.md`: qué mirar en la lámina
- `references/pipeline_notes.md`: cómo encaja con Seedance, Genjutsu y Upscale
- `evals/`: fixtures sintéticos y casos de prueba
