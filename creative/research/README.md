# Investigación semanal de marketing (GARELON)

Cada semana, una sesión automática de Claude investiga en la web lo **nuevo** sobre TikTok, Meta, Reels, creatividad, CRO, e-commerce, IA, medición y regulación. Escribe un informe corto (calidad antes que cantidad), actualiza la memoria de conocimiento vigente y lo guarda en git, en su **rama propia**.

**Es exclusivamente investigación, análisis y actualización de conocimiento.** Nunca:
- crea ni modifica campañas, presupuestos o pujas;
- publica anuncios;
- modifica Shopify ni los productos;
- gasta dinero ni hace merge;
- ejecuta cambios comerciales reales.

Aunque en el futuro haya MCP de Meta o TikTok conectados, sigue siendo solo lectura.

## Cuándo y cómo se ejecuta

| | |
|---|---|
| Programación | **Lunes a las 07:51 (hora de Madrid)**, `CRON_TZ=Europe/Madrid 51 7 * * 1`. El minuto 51 evita la cola de las horas en punto |
| Mecanismo | Routine de Claude Code «GARELON · Investigación semanal de marketing» (`trig_01JRh7Epo2St3s74j27tCVs6`). Cada lunes entra en una **sesión fija**: la del Lab, «GARELON video creativities y marketing» (`session_01MMRMXUiX2ga2mN8skSovmG`). Esa sesión tiene el repositorio como fuente con permiso de push y es donde el propietario autorizó la tarea. Trabaja en `/home/user/garelon-research` (un `git worktree` de la rama de investigación), así que la rama del Lab no cambia |
| Rama | **`claude/garelon-marketing-research`**, dedicada a la investigación. Solo se hace commit y push ahí, y solo en `creative/research/`. Nunca toca `main` (tema Shopify), las ramas de producción ni la del Lab (`claude/festive-clarke-jub9rm`), que solo **lee** con `git show`. Antes de cada push, `research.py preflight` comprueba la rama, que no haya archivos fuera de `creative/research/`, que no haya merges y que no haga falta force-push. Si algo debe pasar a otra rama, el informe lo propone (sección 7) y se espera tu aprobación |
| Por qué esta sesión | Historial de 2026-10-07: (1) una sesión nueva por ejecución investigó bien, pero el push dio `403 … not in this session's authorized repository set`, porque las sesiones nuevas no reciben el repositorio; «Run now» también abre una sesión nueva. (2) Una sesión fija creada aparte tenía push, pero no ejecutaba la tarea: la había creado otra sesión, no el propietario, y no tomaba esos encargos como autorización. La sesión del Lab cumple las dos condiciones: tiene push y la autorización es del propietario. La Routine antigua (`trig_011rUUuYFd1JvzyaE5WoMwG8`) está desactivada |
| Permisos | Nunca se usa `add_repo` ni se conceden permisos desde la Routine. Si el push falla por permisos, se registra el error y se avisa |
| Instrucciones | `ROUTINE_PROMPT.md` (versionado en la rama de investigación). La Routine guarda además las reglas de seguridad en su propio prompt, para que un cambio en el repo no pueda relajarlas |
| Conectores | **Ninguno**: la Routine no guarda conectores y el prompt prohíbe usar cualquier conector (Meta, TikTok, Canva, Claude Docs, Shopify) aunque la sesión los tenga |
| Resultado | Commit en `claude/garelon-marketing-research`, solo dentro de `creative/research/` |
| Aviso | Las Routines con sesión fija no envían push ni email automáticos. El prompt pide a la sesión que envíe una notificación push con el resumen si tiene la herramienta. El resultado se ve en esa sesión y en el commit |
| Coste | consume uso de tu plan de Claude, igual que una sesión normal. Sin APIs de pago ni claves |

Ejecutarla a mano: pídelo en el chat del Lab («lanza la investigación semanal»). **No uses «Run now»**: abre una sesión nueva sin el repositorio y el push da 403.

Si la sesión del Lab se archivara o borrara, la Routine deja de funcionar: hay que volver a crearla desde una sesión que tenga el repositorio como fuente y en la que el propietario autorice la tarea. Una Routine no permite cambiar de sesión.

## Archivos

| Archivo | Qué es |
|---|---|
| `reports/AAAA-MM-DD.md` | Informe de cada ejecución. El de 2026-10-07 es la línea base, en el formato anterior (v1) |
| `PLANTILLA_INFORME.md` | Formato del informe. Las novedades van separadas por jerarquía de evidencia (Oficial · Estudios y datasets · Medios especializados · Comunidad · Hipótesis), cada una con una de las 5 etiquetas de verificación. Después vienen: qué aplicar, qué no está verificado, hasta 5 recomendaciones, hasta 5 tests, cambios en la memoria y propuestas que necesitan tu aprobación |
| `marketing-current-knowledge.md` | Solo el conocimiento útil y **vigente**. Cada entrada lleva tema, fecha, fuente, evidencia, estado (vigente o dudoso) e impacto para GARELON. Lo obsoleto sale al historial explicando el cambio |
| `runs.csv` | Registro de cada ejecución: fecha, tipo, ventana, informe, consultas, fuentes, novedades (🔴/🟠), cuántas están verificadas en fuente original, si se actualizó la memoria, errores y estado |
| `seen-urls.txt` | Fuentes ya citadas (para no repetir noticias) |
| `topics.md` | Temas, jerarquía de evidencia, etiquetas de verificación y banco de consultas |
| `research.py` | Comandos de la investigación: `window` · `path` · `check` · `preflight` · `register` (abajo) |

`research.py`:
- `window`: desde cuándo buscar.
- `path`: ruta del informe de hoy. Si ya hay uno (p. ej. una ejecución manual el mismo día), devuelve `AAAA-MM-DD-2.md`: un informe publicado nunca se sobrescribe.
- `check`: valida el informe y la memoria. Comprueba las etiquetas, que lo «verificado» se haya leído de verdad, el máximo de 8 novedades, 5 recomendaciones y 5 tests, y la rama.
- `preflight`: comprobaciones antes de cada push (rama, solo `creative/research/`, sin merges ni force-push, sin modificar ni borrar informes anteriores).
- `register`: registra la ejecución.

## Limitación conocida: lectura de fuentes

La red de este entorno (nivel *Limited*) **bloquea la lectura directa** de las webs de TikTok, Meta, Instagram, Reddit y los medios (403). La búsqueda web funciona (`WebSearch` corre en el servidor y devuelve resúmenes con URL), pero las páginas oficiales no se pueden abrir completas. Por eso, hoy ninguna novedad puede quedar como `VERIFICADO EN FUENTE ORIGINAL`: como mucho `FUENTE OFICIAL NO ACCESIBLE DIRECTAMENTE`.

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

Con eso la Routine podrá leer la fuente oficial y marcarla como `VERIFICADO EN FUENTE ORIGINAL`.

## Por qué no GitHub Actions

| | Routine de Claude Code (elegida) | GitHub Actions |
|---|---|---|
| Investigación web de calidad | Sí: la misma búsqueda web que en esta sesión | Solo con un agente LLM dentro del workflow (p. ej. la action de Claude Code) |
| Credenciales | Ninguna | Un secreto: clave de API de Anthropic (pago por uso, búsquedas web aparte) o token de suscripción |
| Rama | Escribe en su rama de investigación | Los cron de Actions solo se ejecutan desde la rama por defecto (`main`, la del tema Shopify): exigiría hacer merge |
| Lectura de webs | Bloqueada por la red del entorno (ampliable, ver arriba) | Abierta: los runners de GitHub tienen internet sin restricciones |
| Mantenimiento | Nada que instalar | Workflow, secretos y permisos |

Si algún día la lectura completa de fuentes compensa el coste y el merge a `main`, GitHub Actions con la action de Claude Code es la alternativa. Hoy no compensa.
