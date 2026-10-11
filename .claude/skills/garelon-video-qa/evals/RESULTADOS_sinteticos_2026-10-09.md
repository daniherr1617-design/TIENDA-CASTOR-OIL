# Resultados con vídeos sintéticos (2026-10-09)

| Caso | Veredicto | Recomendación | ¿Correcto? |
|---|---|---|---|
| 1 upscale bueno | WARNING provisional (bitrate bajo del sintético) | RE-EXPORTAR (técnico) | Sí. SSIM 0.999; las 4 piezas visibles 6/6 |
| 2 upscale blando | WARNING | REPETIR UPSCALE | Sí. Nitidez y SSIM por pieza bajos frente al original |
| 3 generación alterada | WARNING (sospechas de color en cuentas, cruz y cierre) → **FAIL** tras la revisión visual | REGENERAR / DESCARTAR PLANO | Sí. **Las métricas no vieron el cambio de forma de la medalla (ovalada → rectangular); lo detectó la lámina.** |
| 4 generación correcta | WARNING (solo bitrate) | RE-EXPORTAR (técnico) | Sí. Ninguna sospecha de producto |
| 5 archivo corrupto | FAIL | VOLVER A DESCARGAR | Sí. 43 errores de decodificación (sin timestamp exacto) |
| 6 imagen congelada | WARNING | — | Sí. Congelado 02.47–03.47 |
| 7 pre 720×1280 | WARNING provisional | LISTO para enviar | Sí. Resolución informativa (BAJA) |

Notas:
- `deltaE_warn` se bajó de 12 a 7 tras estos casos (correcto: ≤ 5,2; alterado: 8,4–16,5). **Calibración sintética: hay que recalibrar con vídeos reales.**
- Bitrate: los sintéticos son muy simples y comprimen mucho. En vídeo real el aviso de bitrate será menos frecuente.
- Tiempo: unos 75 s por vídeo de 6 s a 1080×1920.
