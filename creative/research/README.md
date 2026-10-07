# Investigación semanal de marketing (GARELON)

Cada semana, una sesión automática de Claude investiga en la web lo **nuevo** sobre TikTok, Meta, Reels, creatividad, CRO, e-commerce, IA, medición y regulación. Escribe un informe, actualiza la memoria de conocimiento vigente y lo guarda en git. **Solo investiga**: no toca campañas, dinero, Shopify, el producto ni hace merge.

## Cuándo y cómo se ejecuta

| | |
|---|---|
| Programación | **Lunes a las 07:51 (hora de Madrid)**, `CRON_TZ=Europe/Madrid 51 7 * * 1`. El minuto 51 evita la cola de las horas en punto |
| Mecanismo | Routine de Claude Code «GARELON · Investigación semanal de marketing» (`trig_01Dar9GcTtTUuLNkETox5Dkd`). Cada lunes envía el encargo a una **sesión fija**, «GARELON · Investigación semanal (sesión fija de la Routine)» (`session_01E3g3iX9fMpmFKBHga4zecR`), que tiene el repositorio con permiso de push. Allí descarga la rama `claude/festive-clarke-jub9rm` y trabaja con los archivos recién descargados |
| Por qué una sesión fija | La primera versión (2026-10-07) abría una sesión nueva en cada ejecución. En la prueba investigó bien, pero el push falló: `403 … not in this session's authorized repository set`, porque una sesión nueva no recibe el repositorio como fuente. La sesión fija se creó con el repositorio como fuente, y `git push --dry-run` funciona sin 403 |
| Instrucciones | `ROUTINE_PROMPT.md` (versionado). La Routine guarda además las reglas de seguridad en su propio prompt, para que un cambio en el repo no pueda relajarlas |
| Conectores | **Ninguno**: la Routine no guarda conectores y la sesión fija no tiene herramientas de Meta, TikTok, Canva, Claude Docs ni Shopify. Además, el prompt prohíbe usarlos |
| Resultado | commit en `claude/festive-clarke-jub9rm`, solo dentro de `creative/research/` |
| Aviso | Las Routines con sesión fija no envían push ni email automáticos. El prompt pide a la sesión que envíe una notificación push con el resumen si tiene la herramienta. El resultado se ve en esa sesión y en el commit |
| Coste | consume uso de tu plan de Claude, igual que una sesión normal. Sin APIs de pago ni claves |

Ejecutarla a mano: pídelo en el chat («lanza la investigación semanal») o usa «Run now» en la lista de Routines de claude.ai.

Si la sesión fija se archivara o borrara, hay que crear otra con el repositorio como fuente y volver a crear la Routine apuntando a ella. La Routine no permite cambiar de sesión.

## Archivos

| Archivo | Qué es |
|---|---|
| `reports/AAAA-MM-DD.md` | Informe de cada ejecución (9 secciones fijas) |
| `marketing-current-knowledge.md` | Solo el conocimiento **vigente**, con estado, evidencia y fecha de comprobación; contradicciones abiertas e historial de lo obsoleto |
| `runs.csv` | Registro de cada ejecución: fecha, tipo, ventana, informe, consultas, fuentes, novedades (🔴/🟠), si se actualizó la memoria, errores y estado |
| `seen-urls.txt` | Fuentes ya citadas (para no repetir noticias) |
| `topics.md` | Temas, jerarquía de fuentes, etiquetas y banco de consultas |
| `research.py` | `window` (desde cuándo buscar) · `check` (valida el informe) · `register` (registra la ejecución) |

## Limitación conocida: lectura de fuentes

La red de este entorno (nivel *Limited*) **bloquea la lectura directa** de las webs de TikTok, Meta, Instagram, Reddit y los medios (403). La búsqueda web funciona (`WebSearch` corre en el servidor y devuelve resúmenes con URL), pero las páginas oficiales no se pueden abrir completas. Por eso muchas novedades quedan como `~ solo fuentes secundarias`.

**Mejora gratuita recomendada:** en la configuración de red del entorno, *Allowed domains*, añadir:

```
ads.tiktok.com
newsroom.tiktok.com
business-api.tiktok.com
www.tiktok.com
www.facebook.com
developers.facebook.com
about.fb.com
transparency.meta.com
creators.instagram.com
about.instagram.com
help.shopify.com
www.shopify.com
eur-lex.europa.eu
digital-strategy.ec.europa.eu
taxation-customs.ec.europa.eu
www.socialmediatoday.com
ppc.land
techcrunch.com
www.reddit.com
```

Con eso la Routine podrá confirmar en la fuente oficial (✔) en lugar de quedarse en resúmenes (~).

## Por qué no GitHub Actions

| | Routine de Claude Code (elegida) | GitHub Actions |
|---|---|---|
| Investigación web de calidad | Sí: la misma búsqueda web que en esta sesión | Solo con un agente LLM dentro del workflow (p. ej. la action de Claude Code) |
| Credenciales | Ninguna | Un secreto: clave de API de Anthropic (pago por uso, búsquedas web aparte) o token de suscripción |
| Rama | Escribe en esta rama | Los cron de Actions solo se ejecutan desde la rama por defecto (`main`, la del tema Shopify): exigiría hacer merge |
| Lectura de webs | Bloqueada por la red del entorno (ampliable, ver arriba) | Abierta: los runners de GitHub tienen internet sin restricciones |
| Mantenimiento | Nada que instalar | Workflow, secretos y permisos |

Si algún día la lectura completa de fuentes compensa el coste y el merge a `main`, GitHub Actions con la action de Claude Code es la alternativa. Hoy no compensa.
