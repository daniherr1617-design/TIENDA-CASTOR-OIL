# Preferencias del propietario

> Canónico: `docs/garelon/GARELON_PROYECTO_PROMPT_MAESTRO_COMPLETO.md` §5-§6 y §10.

## Diseño

- Limpio, premium, muy visual, sin recargar; se entiende a la primera.
- **Mobile-first** y jerarquía clara.
- Interfaces dinámicas (tarjetas clicables, carruseles) solo si mejoran la UX.
- Tarjetas ordenadas y **simétricas**: mismo tamaño, centradas, sin desalineaciones por longitud de texto.
- Confianza elegante: escudo, candado o check finos, en dorado sobre marfil.
- Sin redundancias: un dato aparece una vez, donde decide (el precio dentro de cada tarjeta de pack).
- Paleta: blanco, marfil, crema, dorado, champagne, carbón. Nada de aspecto AliExpress o dropshipping barato.
- Referencias de otras tiendas: aprende estructura, interacción, jerarquía y CRO. **No copies** diseños literalmente.

## Marca

- `GARELON`, exactamente así.
- Logo actual: isotipo dorado + wordmark negro. El isotipo suelto sirve para el favicon y usos pequeños. No se rediseña por iniciativa propia.

## Forma de trabajar que espera de Claude

- Que **analice, compare, decida y pruebe**: no que ejecute mecánicamente. Propón el mejor orden de imágenes, elige el recurso visual que mejor funcione y encuentra problemas.
- Que decida el **cómo** dentro de las reglas y respete siempre el **qué está prohibido**.
- Cuando acota el alcance («NO TOCAR», «solo esto»), lo respeta al pie de la letra. Lo que veas fuera del alcance se anota y se ofrece para otra ronda.
- No reabrir decisiones ya tomadas (imágenes verificadas, logo, hero sin precio, packs como variantes).
- No preguntar lo que ya está en el repo o en los documentos.

## Informes

- En español de España, claros, con los puntos numerados que pida.
- Distinguir siempre: `PROBADO LOCALMENTE` / `ZIP DESCOMPRIMIDO` / `SHOPIFY PREVIEW` / `PUBLICADO`.
- Incluir: archivos cambiados, resultados de pruebas con números reales, commit, rama, SHA-256 del ZIP si lo hay, qué debe hacer el propietario en Shopify y qué quedó pendiente fuera del alcance.
- Capturas en móvil (390 px) y en escritorio (1440 px) cuando cambie algo visual.

## Git

- Trabajar en la rama indicada; identificar la rama, el HEAD y el estado antes de empezar.
- Commits pequeños y claros (en español), por fases en cambios grandes. Push sí; **merge no**, salvo orden expresa.
- Sin identificadores de modelo en commits ni documentos.
