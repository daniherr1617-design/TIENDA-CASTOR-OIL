# GARELON · Código para copiar y pegar en Shopify

> **Documento histórico · baseline GARELON Sérum** (rama `baseline/garelon-serum`, commit `f08f9bb`). Describe la tienda del sérum de contorno de ojos, no la Taza Fondue actual. La migración a la taza está en `GARELON-CAMBIOS-FONDUE.md`.

> ⚠️ **Esta guía es de la ronda 3 y no incluye la actualización CJ + packs (septiembre 2026).** Para instalar la versión actual usa el ZIP del tema o la integración de GitHub. Si trabajas en el editor de código, sustituye **completos** los archivos que lista `GARELON-CAMBIOS-CJ-PACKS.md` (apartado «Archivos modificados/creados») copiándolos del repositorio.

> **Recomendación:** la forma más rápida y segura es subir el archivo **`garelon-theme.zip`** en
> *Tienda online → Temas → Añadir tema → Subir archivo zip*. Así se instalan de una vez todos los archivos
> (incluidas las imágenes) sin riesgo de errores al pegar.
>
> Si prefieres pegarlo a mano, sigue esta guía **en este orden** (si pegas una plantilla antes que sus
> secciones, Shopify no te dejará guardarla).

## Paso 0 · Preparación (no trabajes sobre el tema publicado)

1. *Tienda online → Temas*. Si no tienes **Dawn**, añádelo gratis desde la Theme Store.
2. En Dawn: **⋯ → Duplicar**. Trabaja sobre la copia.
3. En la copia: **⋯ → Editar código**.

Este código está hecho sobre **Dawn 16.0.0**. Si tu Dawn es 15.x también debería funcionar; en el paso 5
solo se hacen cambios pequeños de "buscar y sustituir" en archivos de Dawn, no se reemplazan enteros.

---

## Paso 1 · Imágenes (24 archivos)

Descomprime **`garelon-imagenes.zip`**. En el editor de código: carpeta **Assets → Añadir un nuevo asset →
Cargar un archivo**, y sube uno a uno (mantén exactamente estos nombres). Son los 2 archivos de marca
(logotipo e isotipo, en varios tamaños) y 6 de las 10 imágenes del producto (IMAGEN 1, 4, 5, 7, 9 y 10),
solo redimensionadas a WebP:

- `garelon-apple-touch-180.png`
- `garelon-favicon-32.png`
- `garelon-img01-producto-1080.webp`
- `garelon-img01-producto-480.webp`
- `garelon-img01-producto-720.webp`
- `garelon-img04-modo-de-uso-1080.webp`
- `garelon-img04-modo-de-uso-480.webp`
- `garelon-img04-modo-de-uso-720.webp`
- `garelon-img05-ingredientes-1080.webp`
- `garelon-img05-ingredientes-480.webp`
- `garelon-img05-ingredientes-720.webp`
- `garelon-img07-roller-1080.webp`
- `garelon-img07-roller-480.webp`
- `garelon-img07-roller-720.webp`
- `garelon-img09-tamano-1080.webp`
- `garelon-img09-tamano-480.webp`
- `garelon-img09-tamano-720.webp`
- `garelon-img10-presentacion-1080.webp`
- `garelon-img10-presentacion-480.webp`
- `garelon-img10-presentacion-720.webp`
- `garelon-isotipo-96.webp`
- `garelon-logo-240.webp`
- `garelon-logo-480.webp`
- `garelon-wordmark-480.webp`

---

## Paso 2 · Assets de código (3 archivos)

**Assets → Añadir un nuevo asset → Crear un asset en blanco**, elige la extensión y escribe el nombre
`garelon`. Borra lo que aparezca y pega el contenido completo.

### `assets/garelon.css`

```css
/* ==========================================================================
   GARELON · Capa de marca sobre Dawn
   Mobile first. Sin dependencias externas. Colores de marca como tokens;
   los colores de fondo/texto/botón vienen de los esquemas de Dawn
   (Configuración del tema › Colores), así todo sigue siendo editable.
   ========================================================================== */

:root {
  --g-gold: #b88a3b;
  --g-gold-light: #d2b06a;
  --g-gold-text: #7a5a24; /* dorado accesible para texto pequeño sobre crema */
  --g-icon: #9a7433;
  --g-ink: #1b1714;
  --g-accent-text: var(--g-gold-text);
  --g-line: rgba(184, 138, 59, 0.32);
  --g-radius: 6px;
}

.color-scheme-3 {
  --g-accent-text: var(--g-gold-light);
  --g-icon: var(--g-gold-light);
  --g-line: rgba(210, 176, 106, 0.4);
}

/* ---------- Botones ---------- */
.button,
.shopify-challenge__button,
.customer button {
  font-size: 1.3rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  min-height: 5rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.button--primary:not([disabled]):hover {
  background-color: rgba(var(--color-button), 0.88);
}

.button--secondary:not([disabled]):hover {
  background-color: rgba(var(--color-foreground), 0.04);
}

/* ---------- Cabecera ---------- */
.garelon-logo--wordmark .header__heading-logo {
  display: block;
  height: auto;
}

@media screen and (max-width: 749px) {
  .garelon-logo--wordmark .header__heading-logo {
    width: 12.4rem;
  }
}

/* Isotipo a la izquierda del nombre: mismo enlace, misma altura de cabecera. */
.garelon-brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
}

.garelon-brand-link .header__heading-logo-wrapper {
  flex: 0 0 auto;
  width: auto;
}

.garelon-header-isotype {
  display: block;
  flex: 0 0 auto;
  width: auto;
  height: 2.8rem;
}

@media screen and (max-width: 749px) {
  .garelon-brand-link {
    gap: 0.6rem;
  }

  .garelon-header-isotype {
    height: 2.3rem;
  }
}

/* Cabecera móvil (< 750 px): menú · [isotipo GARELON] · carrito.
   Con la cuenta de cliente activada Dawn pone 4 iconos (menú, lupa, cuenta y carrito)
   y en 320–430 px se montaban sobre el logo. La búsqueda y la cuenta pasan al menú
   (.garelon-drawer-utility) y el logo queda centrado entre dos columnas iguales. */
@media screen and (max-width: 749px) {
  .section-header .header-wrapper .header.header--has-menu:not(.header--mobile-left) {
    grid-template-areas: 'left-icons heading icons';
    grid-template-columns: 1fr auto 1fr;
  }

  .section-header .header-wrapper .header.header--has-menu > .header__search,
  .section-header .header-wrapper .header.header--has-menu .header__icons > .header__search,
  .section-header .header-wrapper .header.header--has-menu .header__icons > .header__icon--account {
    display: none;
  }
}

/* Búsqueda y cuenta dentro del menú móvil (solo cuando salen de la barra). */
.garelon-drawer-utility {
  display: none;
  margin: 0;
  padding: 1.2rem 0;
}

.garelon-drawer-utility__link {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.1rem 3rem;
  font-size: 1.5rem;
  color: rgb(var(--color-foreground));
  text-decoration: none;
}

.garelon-drawer-utility__link .svg-wrapper {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
}

.garelon-drawer-utility__link .icon {
  width: 2rem;
  height: 2rem;
}

@media screen and (max-width: 749px) {
  .garelon-drawer-utility {
    display: block;
  }
}

/* Barra superior: bandera de España al final del texto, sin cambiar la altura. */
.garelon-flag {
  display: inline-block;
  width: 1.5em;
  height: 1em;
  margin-left: 0.15em;
  vertical-align: -0.12em;
  border-radius: 0.15rem;
  box-shadow: 0 0 0 0.05rem rgba(0, 0, 0, 0.12);
}

.footer .garelon-logo--stacked img {
  display: block;
  width: 100%;
  height: auto;
}

/* ---------- Pie de página: bloque Ayuda ---------- */
.garelon-help__text > :first-child {
  margin-top: 0;
}

.garelon-help__text > :last-child {
  margin-bottom: 0;
}

.garelon-help__text {
  max-width: 34rem;
}

.garelon-help__link {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.2rem;
  padding: 0.6rem 0;
  color: rgb(var(--color-foreground));
  font-size: 1.4rem;
  font-weight: 500;
  text-decoration: none;
}

.garelon-help__label {
  text-decoration: underline;
  text-underline-offset: 0.4rem;
  text-decoration-thickness: 0.1rem;
  transition: text-decoration-thickness var(--duration-short) ease;
}

.garelon-help__link:hover .garelon-help__label {
  text-decoration-thickness: 0.2rem;
}

.garelon-help__arrow {
  display: inline-block;
  transition: transform var(--duration-short) ease;
}

.garelon-help__link:hover .garelon-help__arrow,
.garelon-help__link:focus-visible .garelon-help__arrow {
  transform: translateX(0.3rem);
}

.garelon-help__menu {
  margin-top: 1.2rem;
}

/* ---------- Estructura de sección ---------- */
.g-section {
  padding-top: calc(var(--g-pt, 48px) * 0.65);
  padding-bottom: calc(var(--g-pb, 48px) * 0.65);
}

.g-section[id] {
  scroll-margin-top: 7.2rem;
}

@media screen and (min-width: 750px) {
  .g-section {
    padding-top: var(--g-pt, 48px);
    padding-bottom: var(--g-pb, 48px);
  }
}

/* Destino de los botones «Comprar» (/#comprar): deja sitio a la cabecera fija. */
.g-anchor[id] {
  scroll-margin-top: 7.2rem;
}

/* ---------- Tipografía ---------- */
.g-eyebrow {
  margin: 0 0 1.2rem;
  font-size: 1.15rem;
  font-weight: 500;
  letter-spacing: 0.24em;
  line-height: 1.4;
  text-transform: uppercase;
  color: var(--g-accent-text);
}

.g-h2 {
  margin: 0 0 1.4rem;
  font-size: clamp(2.5rem, 6.4vw, 3.8rem);
  line-height: 1.15;
  letter-spacing: 0;
}

.g-h3 {
  margin: 0 0 0.6rem;
  font-size: 1.85rem;
  line-height: 1.3;
  letter-spacing: 0;
}

.g-lead,
.g-rte {
  font-size: 1.55rem;
  line-height: 1.65;
  color: rgba(var(--color-foreground), 0.8);
}

.g-lead p,
.g-rte p {
  margin: 0 0 1.2rem;
}

.g-lead > :last-child,
.g-rte > :last-child {
  margin-bottom: 0;
}

.g-rte a {
  color: rgb(var(--color-foreground));
  text-underline-offset: 0.3rem;
}

@media screen and (min-width: 750px) {
  .g-lead,
  .g-rte {
    font-size: 1.7rem;
  }
}

.g-heading-group {
  margin-bottom: 2.8rem;
}

.g-heading-group > :last-child {
  margin-bottom: 0;
}

.g-heading-group--center {
  max-width: 68rem;
  margin-inline: auto;
  text-align: center;
}

.g-heading-group--center .g-lead {
  margin-inline: auto;
  max-width: 60ch;
}

.g-heading-group--center .g-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}

.g-heading-group--center .g-eyebrow::before,
.g-heading-group--center .g-eyebrow::after {
  content: '';
  width: 2.4rem;
  height: 1px;
  background: var(--g-gold);
}

@media screen and (min-width: 750px) {
  .g-heading-group {
    margin-bottom: 4rem;
  }
}

.g-note {
  margin: 2.4rem 0 0;
  font-size: 1.25rem;
  line-height: 1.5;
  color: rgba(var(--color-foreground), 0.68);
}

.g-note--center {
  text-align: center;
}

.g-icon {
  width: 2rem;
  height: 2rem;
  flex: none;
  color: var(--g-icon);
}

.g-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2.4rem;
}

.g-buttons--center {
  justify-content: center;
}

.g-card {
  border: 1px solid rgba(var(--color-foreground), 0.08);
  border-radius: var(--g-radius);
  background: rgba(var(--color-foreground), 0.025);
}

.garelon-placeholder {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  background: rgba(var(--color-foreground), 0.05);
  fill: rgba(var(--color-foreground), 0.25);
}

/* ---------- Precio compacto ---------- */
.g-price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem 1rem;
  margin: 1.8rem 0 0;
  font-size: 1.9rem;
  font-weight: 500;
  line-height: 1.3;
}

.g-price__compare {
  font-size: 1.5rem;
  font-weight: 400;
  color: rgba(var(--color-foreground), 0.6);
}

.g-price__status {
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ---------- Hero ---------- */
.g-hero__grid {
  display: grid;
  gap: 1.6rem;
  align-items: center;
}

.g-hero__grid--text-first .g-hero__content {
  order: -1;
}

.g-hero__media img {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 34vh;
  margin: 0 auto;
  border-radius: var(--g-radius);
  object-fit: contain;
}

.g-hero__heading {
  margin: 0 0 1.2rem;
  font-size: clamp(3rem, 2.4rem + 2.6vw, 5.2rem);
  line-height: 1.1;
  letter-spacing: 0;
}

.g-hero__text {
  max-width: 52ch;
  font-size: 1.55rem;
  line-height: 1.55;
  color: rgba(var(--color-foreground), 0.8);
}

.g-hero__text p {
  margin: 0;
}

.g-hero .g-buttons {
  margin-top: 1.6rem;
}

.g-hero .g-buttons .button {
  flex: 1 1 100%;
}

.g-hero__points {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 1.8rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
  font-size: 1.3rem;
  color: rgba(var(--color-foreground), 0.8);
}

.g-hero__point {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

/* Móviles bajos (p. ej. 375 × 667): imagen algo menor para que precio y botón
   entren en la primera pantalla. */
@media screen and (max-width: 749px) and (max-height: 700px) {
  .g-hero__media img {
    max-height: 26vh;
  }
}

@media screen and (min-width: 750px) {
  .g-hero__grid {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }

  .g-hero__grid .g-hero__content {
    order: 1;
  }

  .g-hero__grid .g-hero__media {
    order: 2;
  }

  .g-hero__grid--image-left .g-hero__media {
    order: 0;
  }

  .g-hero__media img {
    width: 100%;
    max-height: 72vh;
  }

  .g-hero__text {
    font-size: 1.8rem;
  }

  .g-hero .g-buttons .button {
    flex: 0 1 auto;
  }
}

/* ---------- Barra de confianza ---------- */
.g-trust__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.4rem 1.2rem;
  margin: 0;
  padding: 1.6rem 0;
  list-style: none;
}

.g-trust__list--bordered {
  border-top: 1px solid var(--g-line);
  border-bottom: 1px solid var(--g-line);
}

.g-trust__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.35rem;
  line-height: 1.35;
}

.g-trust__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.g-trust__title {
  font-weight: 500;
  color: rgb(var(--color-foreground));
  text-decoration: none;
}

a.g-trust__title {
  text-decoration: underline;
  text-decoration-color: var(--g-line);
  text-underline-offset: 0.3rem;
}

.g-trust__desc {
  font-size: 1.25rem;
  color: rgba(var(--color-foreground), 0.72);
}

@media screen and (min-width: 990px) {
  .g-trust__list {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    padding: 2rem 0;
  }

  .g-trust__item {
    justify-content: center;
  }
}

/* ---------- Beneficios ---------- */
.g-benefits__grid {
  display: grid;
  gap: 1.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.g-benefits__item {
  display: flex;
  align-items: flex-start;
  gap: 1.4rem;
  padding: 1.6rem;
}

.g-benefits__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 4.4rem;
  height: 4.4rem;
  border: 1px solid var(--g-line);
  border-radius: 50%;
}

.g-benefits__icon .g-icon {
  width: 2.2rem;
  height: 2.2rem;
}

.g-benefits__text {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.55;
  color: rgba(var(--color-foreground), 0.78);
}

@media screen and (min-width: 750px) {
  .g-benefits__grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.6rem;
  }
}

@media screen and (min-width: 990px) {
  .g-benefits__grid {
    grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  }

  .g-benefits__item {
    flex-direction: column;
    align-items: center;
    padding: 2.8rem 2rem;
    text-align: center;
  }
}

/* ---------- Imagen con texto ---------- */
.g-split__grid {
  display: grid;
  gap: 2.8rem;
  align-items: center;
}

.g-split__media {
  width: 100%;
  max-width: 52rem;
  justify-self: center;
}

.g-split__content {
  max-width: 54rem;
}

@media screen and (min-width: 750px) {
  .g-split__grid {
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
  }

  .g-split__grid--image-right .g-split__media {
    order: 2;
  }

  .g-split__grid--no-media {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }
}

.g-media {
  position: relative;
}

.g-media__frame {
  overflow: hidden;
  border-radius: var(--g-radius);
  background: rgba(var(--color-foreground), 0.04);
}

.g-media__img {
  display: block;
  width: 100%;
  height: auto;
}

.g-media--arch .g-media__frame {
  border-radius: 999px 999px var(--g-radius) var(--g-radius);
}

.g-media--arch .g-media__img {
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center 30%;
}

@media screen and (min-width: 750px) {
  .g-media--arch .g-media__img {
    aspect-ratio: 4 / 5;
  }
}

.g-media--circle .g-media__frame {
  max-width: 34rem;
  margin-inline: auto;
  aspect-ratio: 1;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--g-line), 0 0 0 0.8rem rgb(var(--color-background)), 0 0 0 calc(0.8rem + 1px) var(--g-line);
}

.g-media--circle .g-media__img {
  height: 100%;
  object-fit: cover;
}

.g-massage-lines {
  position: absolute;
  right: 0;
  bottom: -1.6rem;
  width: 9.6rem;
  height: auto;
  fill: none;
  stroke: var(--g-gold);
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ---------- Ingredientes ---------- */
.g-ingredients__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.g-ingredients__item {
  padding: 1.8rem 1.4rem;
  text-align: center;
  background: rgba(var(--color-background), 0.6);
}

.g-ingredients__item:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.g-ingredients__item::before {
  content: '';
  display: block;
  width: 0.6rem;
  height: 0.6rem;
  margin: 0 auto 1.2rem;
  border-radius: 50%;
  background: var(--g-gold);
}

.g-ingredients__name {
  margin: 0 0 0.4rem;
  font-size: 1.75rem;
  line-height: 1.25;
  letter-spacing: 0;
}

.g-ingredients__inci {
  margin: 0 0 0.8rem;
  font-size: 1.1rem;
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
  color: var(--g-accent-text);
}

.g-ingredients__text {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.5;
  color: rgba(var(--color-foreground), 0.76);
}

@media screen and (min-width: 990px) {
  .g-ingredients__grid {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    gap: 1.6rem;
  }

  .g-ingredients__item:last-child:nth-child(odd) {
    grid-column: auto;
  }

  .g-ingredients__item {
    padding: 2.8rem 2rem;
  }
}

/* Ingredientes con imagen (IMAGEN 5): imagen completa y, al lado, la lista en HTML. */
.g-ingredients__layout--media {
  display: grid;
  gap: 2.8rem;
  align-items: center;
}

.g-ingredients__visual {
  width: 100%;
  max-width: 52rem;
  justify-self: center;
}

@media screen and (min-width: 990px) {
  .g-ingredients__layout--media {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }

  .g-ingredients__layout--media .g-ingredients__grid {
    grid-template-columns: 1fr 1fr;
  }

  .g-ingredients__layout--media .g-ingredients__item {
    padding: 2rem 1.6rem;
  }

  .g-ingredients__layout--media .g-ingredients__item:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}

/* ---------- Cómo usarlo ---------- */
.g-steps__list {
  display: grid;
  gap: 1.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.g-steps__item {
  display: grid;
  grid-template-columns: 11.2rem 1fr;
  gap: 1.6rem;
  align-items: center;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid var(--g-line);
}

.g-steps__item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.g-steps__item:not(:has(.g-steps__media)) {
  grid-template-columns: 1fr;
}

.g-steps__media {
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: var(--g-radius);
  background: rgba(var(--color-foreground), 0.04);
}

.g-steps__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.g-steps__number {
  margin: 0 0 0.2rem;
  font-family: var(--font-heading-family);
  font-size: 1.5rem;
  letter-spacing: 0.14em;
  color: var(--g-accent-text);
}

.g-steps__text {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.5;
  color: rgba(var(--color-foreground), 0.78);
}

@media screen and (min-width: 750px) {
  .g-steps__list {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 3.2rem;
  }

  .g-steps__item {
    grid-template-columns: 1fr;
    align-items: start;
    padding-bottom: 0;
    border-bottom: 0;
    text-align: center;
  }

  .g-steps__media {
    aspect-ratio: 4 / 3;
    border-radius: 999px 999px var(--g-radius) var(--g-radius);
  }
}

/* Cómo usarlo con imagen (IMAGEN 4): la imagen ya muestra los pasos, así que al lado
   van en una lista compacta de texto, legible en móvil y accesible. */
.g-steps__layout--media {
  display: grid;
  gap: 2.8rem;
  align-items: center;
}

.g-steps__visual {
  width: 100%;
  max-width: 52rem;
  justify-self: center;
}

.g-steps__layout--media .g-note {
  margin-top: 2rem;
}

.g-steps__list--stacked .g-steps__body {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1.2rem;
  align-items: baseline;
}

.g-steps__list--stacked .g-steps__number {
  margin: 0;
}

.g-steps__list--stacked .g-h3 {
  margin-bottom: 0.4rem;
}

.g-steps__list--stacked .g-steps__text {
  grid-column: 2;
}

@media screen and (min-width: 750px) {
  .g-steps__layout--media {
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
  }

  .g-steps__list--stacked {
    grid-auto-flow: row;
    grid-auto-columns: auto;
    gap: 1.6rem;
  }

  .g-steps__list--stacked .g-steps__item {
    text-align: left;
    padding-bottom: 1.6rem;
    border-bottom: 1px solid var(--g-line);
  }

  .g-steps__list--stacked .g-steps__item:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}

/* ---------- Preguntas frecuentes ---------- */
.g-faq__wrap {
  max-width: 82rem;
}

.g-faq__list {
  border-top: 1px solid var(--g-line);
}

.g-faq__item {
  border-bottom: 1px solid var(--g-line);
}

.g-faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  min-height: 4.8rem;
  padding: 1.6rem 0;
  list-style: none;
  cursor: pointer;
}

.g-faq__question::-webkit-details-marker {
  display: none;
}

.g-faq__question-text {
  margin: 0;
  font-family: var(--font-body-family);
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0;
}

.g-faq__toggle {
  position: relative;
  flex: none;
  width: 1.4rem;
  height: 1.4rem;
  color: var(--g-icon);
}

.g-faq__toggle::before,
.g-faq__toggle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.25s ease;
}

.g-faq__toggle::after {
  transform: rotate(90deg);
}

.g-faq__item[open] .g-faq__toggle::after {
  transform: rotate(0deg);
}

.g-faq__answer {
  padding: 0 3rem 2rem 0;
  font-size: 1.5rem;
}

.g-faq__contact {
  margin-top: 2.4rem;
  text-align: center;
}

@media (prefers-reduced-motion: no-preference) {
  .g-faq__item[open] .g-faq__answer {
    animation: g-fade-in 0.3s ease;
  }
}

@keyframes g-fade-in {
  from {
    opacity: 0;
    transform: translateY(-0.4rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* ---------- Llamada final ---------- */
.g-final__grid {
  display: grid;
  gap: 2.8rem;
  align-items: center;
}

.g-final__content {
  max-width: 56rem;
  margin-inline: auto;
  text-align: center;
}

.g-final__isotype {
  display: block;
  width: 3.6rem;
  height: auto;
  margin: 0 auto 1.6rem;
}

.g-final .g-price {
  justify-content: center;
}

@media screen and (min-width: 750px) {
  .g-final__grid {
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
  }

  .g-final__grid--no-media {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ---------- Galería de la zona de compra (home) ---------- */
.g-gallery__track {
  display: flex;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-radius: var(--g-radius);
  scrollbar-width: none;
}

.g-gallery__track::-webkit-scrollbar {
  display: none;
}

.g-gallery__slide {
  flex: 0 0 100%;
  width: 100%;
}

.g-gallery__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: var(--g-radius);
}

.g-gallery__buttons {
  margin-top: 0.4rem;
}

/* En móvil Dawn lleva la galería de producto de borde a borde: sin esquinas redondeadas. */
@media screen and (max-width: 749px) {
  .g-gallery__track,
  .g-gallery__img {
    border-radius: 0;
  }
}

/* ---------- Packs de unidades (ficha de producto) ---------- */
.g-packs__fieldset {
  margin: 0;
  padding: 0;
  border: 0;
}

.g-packs__options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
  gap: 0.8rem;
  margin-top: 0.6rem;
}

.g-packs__option {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4.6rem;
  padding: 0 1rem;
  border: 1px solid rgba(var(--color-foreground), 0.35);
  border-radius: 4px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

input:checked + .g-packs__option {
  border-color: rgb(var(--color-foreground));
  box-shadow: inset 0 0 0 1px rgb(var(--color-foreground));
  background: rgba(var(--color-foreground), 0.04);
}

input:focus-visible + .g-packs__option {
  outline: 0.2rem solid rgba(var(--color-foreground), 0.5);
  outline-offset: 0.2rem;
}

.g-packs__note {
  margin: 0.8rem 0 0;
  font-size: 1.25rem;
  color: rgba(var(--color-foreground), 0.7);
}

/* ---------- Compra fija (móvil) ---------- */
.g-sticky {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
  padding: 0.8rem 0 calc(0.8rem + env(safe-area-inset-bottom));
  border-top: 1px solid rgba(var(--color-foreground), 0.1);
  background: rgb(var(--color-background));
  box-shadow: 0 -0.6rem 2rem rgba(27, 23, 20, 0.06);
  transform: translateY(110%);
  visibility: hidden;
  transition: transform 0.25s ease, visibility 0s linear 0.25s;
}

.g-sticky.is-visible {
  transform: none;
  visibility: visible;
  transition: transform 0.25s ease;
}

.g-sticky__inner {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.g-sticky__thumb {
  flex: none;
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 4px;
  object-fit: cover;
}

.g-sticky__info {
  flex: 1;
  min-width: 0;
}

.g-sticky__title {
  margin: 0;
  overflow: hidden;
  font-size: 1.3rem;
  line-height: 1.3;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.g-sticky__price .price {
  margin: 0;
  font-size: 1.4rem;
}

.g-sticky__price .price .price-item {
  font-size: 1.4rem;
}

.g-sticky__price .badge,
.g-sticky__price .unit-price {
  display: none;
}

.g-sticky__button.button {
  flex: none;
  min-width: 11rem;
  min-height: 4.6rem;
  padding: 0 1.8rem;
}

@media screen and (max-width: 749px) {
  body.g-sticky-open {
    padding-bottom: calc(6.8rem + env(safe-area-inset-bottom));
  }
}

@media screen and (min-width: 750px) {
  .g-sticky:not(.g-sticky--desktop) {
    display: none;
  }
}

/* ---------- Ficha de producto (Dawn) ---------- */
.product__info-container .product__title h1 {
  font-size: clamp(2.4rem, 5.6vw, 3.4rem);
  line-height: 1.2;
  letter-spacing: 0;
}

.product__info-container .product__text.caption-with-letter-spacing {
  color: var(--g-accent-text);
  letter-spacing: 0.22em;
}

.product__info-container .product__text.subtitle {
  font-size: 1.55rem;
  line-height: 1.55;
  color: rgba(var(--color-foreground), 0.8);
}

/* ---------- Políticas y páginas ---------- */
.shopify-policy__container {
  max-width: 76rem;
  margin-left: auto;
  margin-right: auto;
  padding: 4rem 1.5rem 6rem;
}

@media screen and (min-width: 750px) {
  .shopify-policy__container {
    padding-left: 5rem;
    padding-right: 5rem;
    max-width: 86rem;
  }
}

.shopify-policy__title h1 {
  font-size: clamp(2.8rem, 6vw, 4rem);
}

.main-page-title {
  font-size: clamp(2.8rem, 6vw, 4rem);
}

/* ---------- Movimiento reducido ---------- */
@media (prefers-reduced-motion: reduce) {
  .button,
  .g-sticky,
  .g-sticky.is-visible,
  .g-packs__option,
  .g-faq__toggle::before,
  .g-faq__toggle::after,
  .garelon-help__arrow {
    transition: none;
  }

  .garelon-help__link:hover .garelon-help__arrow,
  .garelon-help__link:focus-visible .garelon-help__arrow {
    transform: none;
  }
}
```

### `assets/garelon.js`

```js
/*
  GARELON · Mejoras ligeras sobre el formulario de producto de Dawn.
  - <garelon-sticky-atc>: barra fija de compra en móvil. No crea su propio
    formulario: pulsa el botón real del formulario de Dawn, así el carrito
    (drawer/AJAX), las apps y los eventos de Shopify siguen funcionando igual.
  - <garelon-packs>: selector 1/2/3 unidades que solo cambia la cantidad.
    No aplica descuentos.
*/

if (!customElements.get('garelon-sticky-atc')) {
  customElements.define(
    'garelon-sticky-atc',
    class GarelonStickyAtc extends HTMLElement {
      connectedCallback() {
        this.sectionId = this.dataset.mainSection;
        this.button = this.querySelector('[data-sticky-button]');
        this.buttonLabel = this.querySelector('[data-sticky-label]');
        this.priceTarget = this.querySelector('[data-sticky-price]');
        this.thumb = this.querySelector('[data-sticky-thumb]');
        this.defaultLabel = this.buttonLabel ? this.buttonLabel.textContent.trim() : '';

        if (!this.sectionId) {
          const mainInfo = document.querySelector('product-info[id^="MainProduct-"]');
          this.sectionId = mainInfo ? mainInfo.dataset.section : null;
        }
        if (!this.sectionId || !this.getMainButton()) return;

        this.button.addEventListener('click', this.onClick.bind(this));
        this.sync();
        this.observe();

        if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
            if (!event || !event.data || event.data.sectionId !== this.sectionId) return;
            // Dawn actualiza el precio y el botón justo antes de publicar el evento.
            this.sync(event.data.variant);
          });
        }
      }

      disconnectedCallback() {
        if (this.unsubscribe) this.unsubscribe();
        if (this.observer) this.observer.disconnect();
        document.body.classList.remove('g-sticky-open');
      }

      getMainButton() {
        return document.getElementById(`ProductSubmitButton-${this.sectionId}`);
      }

      observe() {
        const target = this.getMainButton().closest('.product-form__buttons') || this.getMainButton();
        this.observer = new IntersectionObserver(([entry]) => {
          // Visible solo cuando el botón principal ha quedado por encima de la pantalla.
          const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
          this.toggle(passed);
        });
        this.observer.observe(target);
      }

      toggle(show) {
        this.classList.toggle('is-visible', show);
        this.toggleAttribute('inert', !show);
        document.body.classList.toggle('g-sticky-open', show);
      }

      sync(variant) {
        const mainPrice = document.getElementById(`price-${this.sectionId}`);
        if (mainPrice && this.priceTarget) this.priceTarget.innerHTML = mainPrice.innerHTML;

        const mainButton = this.getMainButton();
        if (mainButton && this.button) {
          const disabled = mainButton.hasAttribute('disabled') || mainButton.getAttribute('aria-disabled') === 'true';
          this.button.disabled = disabled;
          if (this.buttonLabel) {
            const mainLabel = mainButton.querySelector('span');
            this.buttonLabel.textContent = disabled && mainLabel ? mainLabel.textContent.trim() : this.defaultLabel;
          }
        }

        const src = variant && variant.featured_media && variant.featured_media.preview_image
          ? variant.featured_media.preview_image.src
          : null;
        if (src && this.thumb) {
          this.thumb.src = `${src}${src.includes('?') ? '&' : '?'}width=120`;
          this.thumb.removeAttribute('srcset');
        }
      }

      onClick() {
        const mainButton = this.getMainButton();
        if (!mainButton || mainButton.hasAttribute('disabled')) return;
        mainButton.click();
      }
    }
  );
}

if (!customElements.get('garelon-packs')) {
  customElements.define(
    'garelon-packs',
    class GarelonPacks extends HTMLElement {
      connectedCallback() {
        this.radios = Array.from(this.querySelectorAll('input[type="radio"]'));
        this.radios.forEach((radio) => radio.addEventListener('change', this.onChange.bind(this)));

        const input = this.getQuantityInput();
        if (input) input.addEventListener('change', this.syncFromInput.bind(this));
      }

      getQuantityInput() {
        return (
          document.getElementById(`Quantity-${this.dataset.section}`) ||
          this.querySelector('input[data-pack-quantity]')
        );
      }

      onChange(event) {
        const input = this.getQuantityInput();
        if (!input) return;
        input.value = event.target.value;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }

      syncFromInput() {
        const value = this.getQuantityInput().value;
        this.radios.forEach((radio) => {
          radio.checked = radio.value === String(value);
        });
      }
    }
  );
}
```

### `assets/garelon-nav.js`

```js
/*
  GARELON · Cierra el menú móvil de Dawn al pulsar un enlace a una sección de la
  página actual (p. ej. /#como-usarlo en la home). Esos enlaces no recargan la
  página, así que sin esto el menú se quedaría abierto tapando la sección.
*/
document.addEventListener('click', (event) => {
  const link = event.target.closest('header-drawer a[href*="#"]');
  if (!link) return;

  const url = new URL(link.href, window.location.href);
  if (!url.hash || url.pathname !== window.location.pathname) return;

  const drawer = link.closest('header-drawer');
  const summary = drawer && drawer.querySelector('summary');
  if (!summary || typeof drawer.closeMenuDrawer !== 'function') return;

  drawer.closeMenuDrawer(event, summary);
  summary.setAttribute('aria-expanded', 'false');
});
```

---

## Paso 3 · Snippets (12 archivos)

**Snippets → Añadir un nuevo snippet**, escribe el nombre (sin `.liquid`), borra el contenido por defecto y pega.

### `snippets/garelon-icon.liquid`

```liquid
{%- comment -%}
  GARELON · Iconos lineales discretos (SVG en línea, heredan currentColor).

  Accepts:
  - icon: {String} eye | eye-under | drop | lines | roller | leaf | steps | sparkle | lock | chat | truck | return | bottle | check | none

  Usage:
  {% render 'garelon-icon', icon: 'drop' %}
{%- endcomment -%}
{%- if icon != blank and icon != 'none' -%}
  <svg
    class="g-icon g-icon--{{ icon }}"
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.3"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    {%- case icon -%}
      {%- when 'eye' -%}
        <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6"/>
      {%- when 'eye-under' -%}
        <path d="M3 10.5S6.2 5.5 12 5.5s9 5 9 5-3.2 5-9 5-9-5-9-5Z"/><circle cx="12" cy="10.5" r="2.3"/><path d="M6 18.5c3.8 1.6 8.2 1.6 12 0"/>
      {%- when 'drop' -%}
        <path d="M12 3.5s-6 6.6-6 10.9A6 6 0 0 0 18 14.4C18 10.1 12 3.5 12 3.5Z"/><path d="M9.3 14.8a2.8 2.8 0 0 0 2.4 2.5"/>
      {%- when 'lines' -%}
        <path d="M3 8c2.2-1.6 4.3-1.6 6.5 0s4.3 1.6 6.5 0 3.3-1.2 5 0"/><path d="M3 12.5c2.2-1.6 4.3-1.6 6.5 0s4.3 1.6 6.5 0 3.3-1.2 5 0"/><path d="M3 17c2.2-1.6 4.3-1.6 6.5 0s4.3 1.6 6.5 0 3.3-1.2 5 0"/>
      {%- when 'roller' -%}
        <circle cx="12" cy="6" r="3"/><path d="M9 8.5h6v3H9z"/><path d="M9.5 11.5h5l.5 9h-6z"/>
      {%- when 'leaf' -%}
        <path d="M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19Z"/><path d="M5 19 13 11"/>
      {%- when 'steps' -%}
        <circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>
      {%- when 'sparkle' -%}
        <path d="M12 3.5c.6 4.4 2.1 5.9 6.5 6.5-4.4.6-5.9 2.1-6.5 6.5-.6-4.4-2.1-5.9-6.5-6.5 4.4-.6 5.9-2.1 6.5-6.5Z"/><path d="M18.5 16v4M16.5 18h4"/>
      {%- when 'lock' -%}
        <rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/>
      {%- when 'chat' -%}
        <path d="M4 5.5h16v10.5H9.5L5.5 19.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>
      {%- when 'truck' -%}
        <path d="M2.5 6.5h11v9.5h-11z"/><path d="M13.5 9.5h4.2l3.3 3.4v3.1h-7.5"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/>
      {%- when 'return' -%}
        <path d="M8.5 5 4.5 9l4 4"/><path d="M4.5 9h10a5 5 0 0 1 0 10H9"/>
      {%- when 'bottle' -%}
        <path d="M10 2.5h4v3h-4z"/><path d="M9 5.5h6v2.5l1 1.5v11.5H8V9.5l1-1.5z"/><path d="M8 13h8"/>
      {%- when 'check' -%}
        <circle cx="12" cy="12" r="8.5"/><path d="m8.3 12.2 2.4 2.4 5-5"/>
    {%- endcase -%}
  </svg>
{%- endif -%}
```

### `snippets/garelon-image.liquid`

```liquid
{%- comment -%}
  GARELON · Imagen responsive.
  Usa la imagen elegida en el editor de temas; si no hay ninguna, usa la
  imagen del producto incluida en los assets del tema; si tampoco hay, no
  muestra nada (el marcador de posición solo aparece dentro del editor).

  Accepts:
  - image: {Object} imagen del image_picker (opcional)
  - fallback: {String} nombre base del asset, p. ej. 'garelon-img01-producto' (opcional)
  - fallback_widths: {String} anchos disponibles del asset, p. ej. '480,720,1080'
  - fallback_height: {Number} alto de la versión más ancha del asset
  - alt: {String} texto alternativo por defecto
  - sizes: {String} atributo sizes
  - class: {String} clase CSS de la imagen
  - eager: {Boolean} true para la imagen principal (LCP) de la página

  Usage:
  {% render 'garelon-image', image: section.settings.image, fallback: 'garelon-img01-producto', fallback_widths: '480,720,1080', fallback_height: 1080, alt: 'Sérum', sizes: '100vw' %}
{%- endcomment -%}
{%- liquid
  assign loading = 'lazy'
  assign priority = 'auto'
  if eager
    assign loading = 'eager'
    assign priority = 'high'
  endif
  assign sizes = sizes | default: '100vw'
-%}
{%- if image != blank -%}
  {%- assign image_alt = image.alt | default: alt | escape -%}
  {{
    image
    | image_url: width: 1800
    | image_tag:
      widths: '360, 540, 720, 900, 1080, 1400, 1800',
      sizes: sizes,
      loading: loading,
      fetchpriority: priority,
      alt: image_alt,
      class: class
  }}
{%- elsif fallback != blank -%}
  {%- liquid
    assign widths = fallback_widths | split: ','
    assign max_width = widths | last
    capture srcset
      for w in widths
        assign file = fallback | append: '-' | append: w | append: '.webp'
        echo file | asset_url | append: ' ' | append: w | append: 'w'
        unless forloop.last
          echo ', '
        endunless
      endfor
    endcapture
    assign largest = fallback | append: '-' | append: max_width | append: '.webp'
  -%}
  <img
    src="{{ largest | asset_url }}"
    srcset="{{ srcset }}"
    sizes="{{ sizes }}"
    width="{{ max_width }}"
    height="{{ fallback_height }}"
    alt="{{ alt | escape }}"
    loading="{{ loading }}"
    fetchpriority="{{ priority }}"
    {% unless eager %}
      decoding="async"
    {% endunless %}
    {% if class != blank %}
      class="{{ class }}"
    {% endif %}
  >
{%- elsif request.design_mode -%}
  {{ 'image' | placeholder_svg_tag: 'garelon-placeholder' }}
{%- endif -%}
```

### `snippets/garelon-srcset.liquid`

```liquid
{%- comment -%}
  GARELON · Devuelve solo el valor de un atributo srcset (para <source> en <picture>).

  Accepts:
  - image: {Object} imagen del image_picker (opcional)
  - fallback: {String} nombre base del asset (p. ej. 'garelon-img01-producto')
  - fallback_widths: {String} anchos del asset, p. ej. '480,720,1080'
{%- endcomment -%}
{%- liquid
  if image != blank
    assign widths = '540,720,900,1080,1400,1800' | split: ','
    for w in widths
      assign w_num = w | plus: 0
      if w_num <= image.width or forloop.first
        if forloop.index > 1
          echo ', '
        endif
        echo image | image_url: width: w_num | append: ' ' | append: w | append: 'w'
      endif
    endfor
  elsif fallback != blank
    assign widths = fallback_widths | split: ','
    for w in widths
      assign file = fallback | append: '-' | append: w | append: '.webp'
      echo file | asset_url | append: ' ' | append: w | append: 'w'
      unless forloop.last
        echo ', '
      endunless
    endfor
  endif
-%}
```

### `snippets/garelon-fallback-image.liquid`

```liquid
{%- comment -%}
  GARELON · Muestra la imagen elegida en el editor o, si está vacía, una de las
  imágenes del producto incluidas en los assets del tema.

  Los assets garelon-imgNN-*.webp son IMAGEN 1, 4, 5, 7, 9 y 10 (carpeta referencias/)
  redimensionadas a 480, 720 y 1080 px: sin recortes, sin filtros y sin cambios de texto.

  Accepts:
  - image: {Object} imagen del image_picker
  - fallback: {String} img01-producto | img10-presentacion | img07-roller | img05-ingredientes
              | img04-uso | img09-tamano | none
  - alt: {String} texto alternativo si la imagen elegida no tiene uno
  - sizes: {String}
  - class: {String}
  - eager: {Boolean} true solo para la imagen principal (LCP)
{%- endcomment -%}
{%- liquid
  assign asset_name = blank
  assign asset_alt = blank
  case fallback
    when 'img01-producto'
      assign asset_name = 'garelon-img01-producto'
      assign asset_alt = 'Sérum para el contorno de ojos: frasco roller de vidrio ámbar de 10 ml con bola metálica, tapón negro y su caja'
    when 'img10-presentacion'
      assign asset_name = 'garelon-img10-presentacion'
      assign asset_alt = 'Sérum contorno de ojos con roller metálico de 10 ml: ayuda a reducir la apariencia de ojeras y de bolsas, suaviza la apariencia de líneas finas, hidrata y aporta confort'
    when 'img07-roller'
      assign asset_name = 'garelon-img07-roller'
      assign asset_alt = 'Técnica de masaje con roller para el contorno de ojos: primeros planos de bolsas y ojeras, el frasco con su caja y tres ventajas: aplicador metálico, uso cómodo y cuidado diario'
    when 'img05-ingredientes'
      assign asset_name = 'garelon-img05-ingredientes'
      assign asset_alt = 'Ingredientes principales: aceite de ricino, Acetyl Tripeptide-1, colágeno, extracto de Boswellia Serrata y agua'
    when 'img04-uso'
      assign asset_name = 'garelon-img04-modo-de-uso'
      assign asset_alt = 'Cómo usarlo en 3 pasos: limpia y seca el contorno de ojos, aplica el sérum con el roller y masajea con la bola metálica'
    when 'img09-tamano'
      assign asset_name = 'garelon-img09-tamano'
      assign asset_alt = 'Tamaño del producto: caja de 8,7 cm de alto, 2,2 cm de ancho y 2,2 cm de fondo; frasco de 8,4 cm de alto y 1,9 cm de ancho'
  endcase

  assign final_alt = alt
  if image == blank and asset_alt != blank
    assign final_alt = asset_alt
  endif

  render 'garelon-image', image: image, fallback: asset_name, fallback_widths: '480,720,1080', fallback_height: 1080, alt: final_alt, sizes: sizes, class: class, eager: eager
-%}
```

### `snippets/garelon-logo-fallback.liquid`

```liquid
{%- comment -%}
  GARELON · Logo de respaldo desde los assets del tema.
  Se usa solo cuando no hay un logo subido en Configuración del tema.

  Accepts:
  - variant: 'wordmark' (por defecto, cabecera) | 'stacked' (isotipo + nombre, pie de página)
             | 'isotype' (solo el isotipo, a la izquierda del nombre en la cabecera)

  Usage:
  {% render 'garelon-logo-fallback', variant: 'stacked' %}
{%- endcomment -%}
{%- if variant == 'stacked' -%}
  {%- assign logo_width = settings.brand_image_width | default: 120 -%}
  {%- assign logo_height = logo_width | times: 425 | divided_by: 480 -%}
  <div
    class="footer-block__image-wrapper garelon-logo garelon-logo--stacked"
    style="max-width: min(100%, {{ logo_width }}px);"
  >
    <img
      src="{{ 'garelon-logo-480.webp' | asset_url }}"
      srcset="{{ 'garelon-logo-240.webp' | asset_url }} 240w, {{ 'garelon-logo-480.webp' | asset_url }} 480w"
      sizes="{{ logo_width }}px"
      width="{{ logo_width }}"
      height="{{ logo_height }}"
      alt="{{ shop.name | escape }}"
      loading="lazy"
    >
  </div>
{%- elsif variant == 'isotype' -%}
  {%- comment -%}
    Decorativo: el enlace ya se anuncia con el nombre de la tienda (alt del logo),
    así que alt vacío evita que los lectores de pantalla lean "GARELON" dos veces.
  {%- endcomment -%}
  <img
    class="garelon-header-isotype"
    src="{{ 'garelon-isotipo-96.webp' | asset_url }}"
    width="96"
    height="104"
    alt=""
  >
{%- else -%}
  {%- assign logo_width = settings.logo_width | default: 150 -%}
  {%- assign logo_height = logo_width | times: 72 | divided_by: 480 -%}
  <div class="header__heading-logo-wrapper garelon-logo garelon-logo--wordmark">
    <img
      class="header__heading-logo"
      src="{{ 'garelon-wordmark-480.webp' | asset_url }}"
      width="{{ logo_width }}"
      height="{{ logo_height }}"
      alt="{{ shop.name | escape }}"
    >
  </div>
{%- endif -%}
```

### `snippets/garelon-price-inline.liquid`

```liquid
{%- comment -%}
  GARELON · Precio compacto con datos reales de Shopify (sin valores fijos).

  Accepts:
  - product: {Object}
{%- endcomment -%}
{%- if product != blank -%}
  {%- assign variant = product.selected_or_first_available_variant -%}
  <p class="g-price">
    {%- if product.price_varies -%}
      <span class="g-price__current">{{ 'products.product.price.from_price_html' | t: price: product.price_min | money }}</span>
    {%- else -%}
      {%- if variant.compare_at_price > variant.price -%}
        <span class="visually-hidden">{{ 'products.product.price.sale_price' | t }}</span>
        <span class="g-price__current">{{ variant.price | money }}</span>
        <span class="visually-hidden">{{ 'products.product.price.regular_price' | t }}</span>
        <s class="g-price__compare">{{ variant.compare_at_price | money }}</s>
      {%- else -%}
        <span class="g-price__current">{{ variant.price | money }}</span>
      {%- endif -%}
    {%- endif -%}
    {%- unless product.available -%}
      <span class="g-price__status">{{ 'products.product.sold_out' | t }}</span>
    {%- endunless -%}
  </p>
{%- endif -%}
```

### `snippets/garelon-packs.liquid`

```liquid
{%- comment -%}
  GARELON · Selector de cantidad por unidades (1 / 2 / 3).
  Solo cambia la cantidad que se añade al carrito: NO aplica descuentos.
  Si en Shopify existen descuentos automáticos reales, se verán en el carrito/checkout.

  Accepts:
  - block: {Object}
  - section_id: {String}
  - product_form_id: {String}
  - has_quantity_input: {Boolean} true si el bloque "Selector de cantidad" de Dawn está activo
{%- endcomment -%}
{%- assign max_units = block.settings.max_units | plus: 0 -%}
<garelon-packs class="g-packs" data-section="{{ section_id }}" {{ block.shopify_attributes }}>
  <script src="{{ 'garelon.js' | asset_url }}" defer="defer"></script>
  <fieldset class="g-packs__fieldset">
    <legend class="form__label">{{ block.settings.heading | escape }}</legend>
    <div class="g-packs__options">
      {%- for n in (1..max_units) -%}
        <input
          class="visually-hidden"
          type="radio"
          id="Pack-{{ section_id }}-{{ n }}"
          name="garelon-pack-{{ section_id }}"
          value="{{ n }}"
          {% if forloop.first %}
            checked
          {% endif %}
        >
        <label class="g-packs__option" for="Pack-{{ section_id }}-{{ n }}">
          {{ n }}
          {% if n == 1 %}unidad{% else %}unidades{% endif %}
        </label>
      {%- endfor -%}
    </div>
  </fieldset>
  {%- unless has_quantity_input -%}
    <input type="hidden" name="quantity" value="1" form="{{ product_form_id }}" data-pack-quantity>
  {%- endunless -%}
  {%- if block.settings.note != blank -%}
    <p class="g-packs__note">{{ block.settings.note | escape }}</p>
  {%- endif -%}
</garelon-packs>
```

---

### `snippets/garelon-url.liquid`

```liquid
{%- comment -%}
  GARELON · Enlaces internos que dependen del contenido del Admin.

  La página de contacto y las políticas se crean en el Admin de Shopify, no en el
  theme, así que su URL puede variar (/pages/contact, /pages/contacto…) o no existir
  todavía (una política vacía devuelve 404). Este snippet resuelve la URL real:

  - Contacto: la página elegida en Configuración del tema → GARELON · Enlaces;
    si no hay ninguna, la primera página publicada con un identificador habitual
    (contacto, contact, contactanos, contacta-con-nosotros, contact-us).
  - Devoluciones / Envíos: la política nativa de Shopify si tiene contenido;
    si no, la página elegida en el tema o una página con identificador habitual.
  Si no encuentra nada, deja la ruta nativa de Shopify, que empezará a funcionar
  en cuanto exista ese contenido en el Admin.

  Accepts (uno de los tres):
  - type: 'contact' | 'refund' | 'shipping' → imprime esa URL.
    type: 'cookies' → la página de política de cookies, o nada si no existe
    (Shopify no tiene una ruta nativa para cookies).
  - url: una URL (p. ej. de un ajuste de tipo url) → la imprime resuelta si es una
    de las rutas anteriores; cualquier otra URL se imprime sin cambios.
  - html: texto enriquecido → lo imprime con esos enlaces resueltos.

  Usage:
  <a href="{%- render 'garelon-url', type: 'contact' -%}">Contacto</a>
  {% render 'garelon-url', html: block.settings.answer %}
{%- endcomment -%}
{%- liquid
  assign contact_url = ''
  if settings.garelon_contact_page != blank
    assign contact_url = settings.garelon_contact_page.url
  else
    assign handles = 'contacto,contact,contactanos,contacta-con-nosotros,contact-us' | split: ','
    for handle in handles
      if pages[handle] != blank
        assign contact_url = pages[handle].url
        break
      endif
    endfor
  endif
  if contact_url == blank
    assign contact_url = '/pages/contact'
  endif

  assign refund_url = ''
  if shop.refund_policy != blank
    assign refund_url = shop.refund_policy.url
  elsif settings.garelon_refund_page != blank
    assign refund_url = settings.garelon_refund_page.url
  else
    assign handles = 'politica-de-devoluciones-y-reembolsos,politica-de-devoluciones,devoluciones' | split: ','
    for handle in handles
      if pages[handle] != blank
        assign refund_url = pages[handle].url
        break
      endif
    endfor
  endif
  if refund_url == blank
    assign refund_url = '/policies/refund-policy'
  endif

  assign shipping_url = ''
  if shop.shipping_policy != blank
    assign shipping_url = shop.shipping_policy.url
  elsif settings.garelon_shipping_page != blank
    assign shipping_url = settings.garelon_shipping_page.url
  else
    assign handles = 'politica-de-envio,politica-de-envios,envios' | split: ','
    for handle in handles
      if pages[handle] != blank
        assign shipping_url = pages[handle].url
        break
      endif
    endfor
  endif
  if shipping_url == blank
    assign shipping_url = '/policies/shipping-policy'
  endif

  assign cookies_url = ''
  if type == 'cookies'
    if settings.garelon_cookies_page != blank
      assign cookies_url = settings.garelon_cookies_page.url
    else
      assign handles = 'politica-de-cookies,cookies,politica-cookies' | split: ','
      for handle in handles
        if pages[handle] != blank
          assign cookies_url = pages[handle].url
          break
        endif
      endfor
    endif
  endif

  case type
    when 'contact'
      echo contact_url
    when 'refund'
      echo refund_url
    when 'shipping'
      echo shipping_url
    when 'cookies'
      echo cookies_url
    else
      if html != blank
        assign contact_href = 'href="' | append: contact_url | append: '"'
        assign refund_href = 'href="' | append: refund_url | append: '"'
        assign shipping_href = 'href="' | append: shipping_url | append: '"'
        assign resolved = html | replace: 'href="/pages/contacto"', contact_href
        assign resolved = resolved | replace: 'href="/pages/contact"', contact_href
        assign resolved = resolved | replace: 'href="/policies/refund-policy"', refund_href
        assign resolved = resolved | replace: 'href="/policies/shipping-policy"', shipping_href
        echo resolved
      else
        case url
          when '/pages/contacto', '/pages/contact'
            echo contact_url
          when '/policies/refund-policy'
            echo refund_url
          when '/policies/shipping-policy'
            echo shipping_url
          else
            echo url
        endcase
      endif
  endcase
-%}
```

### `snippets/garelon-nav.liquid`

```liquid
{%- comment -%}
  GARELON · Navegación principal de la tienda de un solo producto.

  Enlaces: Inicio, las secciones de la home que se activen en la cabecera
  (Cómo usarlo, Ingredientes, Preguntas frecuentes) y Contacto. No enlaza al catálogo
  ni a colecciones. Las URLs son dinámicas: routes.root_url y la página de contacto
  real resuelta por el snippet garelon-url.

  Accepts:
  - variant: {String} 'inline' (menú de escritorio) | 'drawer' (elementos <li> del menú móvil)

  Usage:
  {% render 'garelon-nav', variant: 'inline' %}
{%- endcomment -%}
{%- liquid
  capture contact_url
    render 'garelon-url', type: 'contact'
  endcapture
  assign contact_url = contact_url | strip
  assign home_url = routes.root_url

  assign labels = 'Inicio'
  assign urls = home_url
  assign ids = 'inicio'
  if section.settings.nav_show_how
    assign labels = labels | append: '|Cómo usarlo'
    assign urls = urls | append: '|' | append: home_url | append: '#como-usarlo'
    assign ids = ids | append: '|como-usarlo'
  endif
  if section.settings.nav_show_ingredients
    assign labels = labels | append: '|Ingredientes'
    assign urls = urls | append: '|' | append: home_url | append: '#ingredientes'
    assign ids = ids | append: '|ingredientes'
  endif
  if section.settings.nav_show_faq
    assign labels = labels | append: '|Preguntas frecuentes'
    assign urls = urls | append: '|' | append: home_url | append: '#preguntas-frecuentes'
    assign ids = ids | append: '|preguntas-frecuentes'
  endif
  assign labels = labels | append: '|Contacto'
  assign urls = urls | append: '|' | append: contact_url
  assign ids = ids | append: '|contacto'

  assign labels = labels | split: '|'
  assign urls = urls | split: '|'
  assign ids = ids | split: '|'
-%}

{%- if variant == 'drawer' -%}
  {%- for label in labels -%}
    {%- liquid
      assign url = urls[forloop.index0]
      assign current = false
      if forloop.first and request.page_type == 'index'
        assign current = true
      elsif forloop.last and request.path == contact_url
        assign current = true
      endif
    -%}
    <li>
      <a
        id="HeaderDrawer-{{ ids[forloop.index0] }}"
        href="{{ url }}"
        class="menu-drawer__menu-item list-menu__item link link--text focus-inset{% if current %} menu-drawer__menu-item--active{% endif %}"
        {% if current %}
          aria-current="page"
        {% endif %}
      >
        {{ label }}
      </a>
    </li>
  {%- endfor -%}
{%- else -%}
  <nav class="header__inline-menu">
    <ul class="list-menu list-menu--inline" role="list">
      {%- for label in labels -%}
        {%- liquid
          assign url = urls[forloop.index0]
          assign current = false
          if forloop.first and request.page_type == 'index'
            assign current = true
          elsif forloop.last and request.path == contact_url
            assign current = true
          endif
        -%}
        <li>
          <a
            id="HeaderMenu-{{ ids[forloop.index0] }}"
            href="{{ url }}"
            class="header__menu-item list-menu__item link link--text focus-inset"
            {% if current %}
              aria-current="page"
            {% endif %}
          >
            <span {% if current %}class="header__active-menu-item"{% endif %}>{{ label }}</span>
          </a>
        </li>
      {%- endfor -%}
    </ul>
  </nav>
{%- endif -%}
```

### `snippets/garelon-flag-es.liquid`

```liquid
{%- comment -%}
  GARELON · Bandera de España (franjas roja, amarilla y roja en proporción 1:2:1).
  SVG en lugar del emoji 🇪🇸 porque Windows no muestra emojis de banderas (saldría «ES»).
  Decorativa: el texto del anuncio ya dice «España».

  Usage:
  {% render 'garelon-flag-es' %}
{%- endcomment -%}
<svg class="garelon-flag" viewBox="0 0 3 2" width="21" height="14" aria-hidden="true" focusable="false">
  <rect width="3" height="2" fill="#AA151B"/>
  <rect y="0.5" width="3" height="1" fill="#F1BF00"/>
</svg>
```

### `snippets/garelon-gallery.liquid`

```liquid
{%- comment -%}
  GARELON · Galería de la zona de compra de la home.

  Muestra las imágenes del producto incluidas en el tema, en el orden de la historia:
  producto (IMAGEN 1) → presentación y beneficios (IMAGEN 10) → técnica con roller (IMAGEN 7)
  → ingredientes (IMAGEN 5) → cómo usarlo (IMAGEN 4) → tamaño (IMAGEN 9).

  Usa el carrusel de Dawn (<slider-component>, definido en global.js): se desliza con el
  dedo en móvil y tiene flechas y contador en todos los tamaños. Todas las imágenes se
  cargan en diferido porque la sección está lejos de la primera pantalla.

  Accepts:
  - section_id: {String} id de la sección, para que los ids del carrusel sean únicos

  Usage:
  {% render 'garelon-gallery', section_id: section.id %}
{%- endcomment -%}
{{ 'component-slider.css' | asset_url | stylesheet_tag }}

{%- liquid
  assign keys = 'img01-producto,img10-presentacion,img07-roller,img05-ingredientes,img04-uso,img09-tamano' | split: ','
  assign slider_id = 'Slider-GGallery-' | append: section_id
-%}

<slider-component class="g-gallery">
  <ul id="{{ slider_id }}" class="g-gallery__track slider slider--everywhere" role="list">
    {%- for key in keys -%}
      <li id="Slide-GGallery-{{ section_id }}-{{ forloop.index }}" class="g-gallery__slide slider__slide">
        {%- render 'garelon-fallback-image',
          fallback: key,
          sizes: '(min-width: 1200px) 560px, (min-width: 750px) 50vw, calc(100vw - 3rem)',
          class: 'g-gallery__img'
        -%}
      </li>
    {%- endfor -%}
  </ul>
  <div class="slider-buttons g-gallery__buttons">
    <button
      type="button"
      class="slider-button slider-button--prev"
      name="previous"
      aria-label="{{ 'general.slider.previous_slide' | t }}"
      aria-controls="{{ slider_id }}"
    >
      <span class="svg-wrapper">{{- 'icon-caret.svg' | inline_asset_content -}}</span>
    </button>
    <div class="slider-counter caption">
      <span class="slider-counter--current">1</span>
      <span aria-hidden="true"> / </span>
      <span class="visually-hidden">{{ 'general.slider.of' | t }}</span>
      <span class="slider-counter--total">{{ keys.size }}</span>
    </div>
    <button
      type="button"
      class="slider-button slider-button--next"
      name="next"
      aria-label="{{ 'general.slider.next_slide' | t }}"
      aria-controls="{{ slider_id }}"
    >
      <span class="svg-wrapper">{{- 'icon-caret.svg' | inline_asset_content -}}</span>
    </button>
  </div>
</slider-component>
```

### `snippets/garelon-stock.liquid`

```liquid
{%- comment -%}
  GARELON · Estado de stock para la zona de compra de la home (sección Producto destacado).

  Misma lógica que el bloque «Inventario» de la ficha de producto de Dawn, sin avisos de
  «pocas unidades» ni número de unidades: solo «En stock» o «Agotado», y solo cuando Shopify
  controla el inventario de la variante (los datos que sincroniza AutoDS). Si no lo controla,
  no se afirma nada. El id Inventory-<sección> permite que product-info.js de Dawn lo
  actualice al cambiar de variante.

  Accepts:
  - variant: {Object} variante seleccionada o primera disponible
  - section_id: {String}
  - block: {Object} bloque, para el editor de temas

  Usage:
  {% render 'garelon-stock', variant: product.selected_or_first_available_variant, section_id: section.id, block: block %}
{%- endcomment -%}
{%- liquid
  assign tracked = false
  if variant.inventory_management == 'shopify'
    assign tracked = true
  endif
-%}
<p
  id="Inventory-{{ section_id }}"
  class="product__inventory{% unless tracked %} visibility-hidden{% endunless %}"
  role="status"
  {{ block.shopify_attributes }}
>
  {%- if tracked -%}
    {%- if variant.inventory_quantity > 0 or variant.inventory_policy == 'continue' -%}
      <span class="svg-wrapper" style="color: rgb(62, 214, 96)">
        {{- 'icon-inventory-status.svg' | inline_asset_content -}}
      </span>
      {{- 'products.product.inventory_in_stock' | t -}}
    {%- else -%}
      <span class="svg-wrapper" style="color: rgb(200, 200, 200)">
        {{- 'icon-inventory-status.svg' | inline_asset_content -}}
      </span>
      {{- 'products.product.inventory_out_of_stock' | t -}}
    {%- endif -%}
  {%- endif -%}
</p>
```

## Paso 4 · Secciones (9 archivos)

**Sections → Añadir una nueva sección**, escribe el nombre (sin `.liquid`), borra el contenido por defecto y pega.

### `sections/garelon-hero.liquid`

```liquid
{%- liquid
  assign product = section.settings.product | default: collections.all.products.first
  assign buy_url = routes.root_url | append: '#comprar'
  assign primary_url = section.settings.button_link | default: buy_url
  assign heading_tag = 'h2'
  if section.settings.use_h1
    assign heading_tag = 'h1'
  endif
  assign desktop_image = section.settings.image
  assign mobile_image = section.settings.image_mobile
  assign single_image = desktop_image | default: mobile_image
  assign hero_sizes = '(min-width: 1200px) 560px, (min-width: 750px) 48vw, calc(100vw - 3rem)'
  assign hero_alt = 'Sérum para el contorno de ojos: frasco roller de vidrio ámbar de 10 ml con bola metálica, tapón negro y su caja'
-%}

<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-hero color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width g-hero__grid{% if section.settings.image_position == 'left' %} g-hero__grid--image-left{% endif %}{% unless section.settings.mobile_image_first %} g-hero__grid--text-first{% endunless %}">
    <div class="g-hero__media">
      {%- if desktop_image != blank and mobile_image != blank -%}
        <picture>
          <source
            media="(min-width: 750px)"
            srcset="{% render 'garelon-srcset', image: desktop_image %}"
            sizes="{{ hero_sizes }}"
            width="{{ desktop_image.width }}"
            height="{{ desktop_image.height }}"
          >
          {%- render 'garelon-image',
            image: mobile_image,
            alt: hero_alt,
            sizes: hero_sizes,
            class: 'g-hero__image',
            eager: true
          -%}
        </picture>
      {%- else -%}
        {%- render 'garelon-fallback-image',
          image: single_image,
          fallback: 'img01-producto',
          alt: hero_alt,
          sizes: hero_sizes,
          class: 'g-hero__image',
          eager: true
        -%}
      {%- endif -%}
    </div>

    <div class="g-hero__content">
      {%- if section.settings.eyebrow != blank -%}
        <p class="g-eyebrow">{{ section.settings.eyebrow | escape }}</p>
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <{{ heading_tag }} class="g-hero__heading">{{ section.settings.heading | escape }}</{{ heading_tag }}>
      {%- endif -%}
      {%- if section.settings.text != blank -%}
        <div class="g-hero__text">{{ section.settings.text }}</div>
      {%- endif -%}

      {%- if section.settings.show_price -%}
        {%- render 'garelon-price-inline', product: product -%}
      {%- endif -%}

      <div class="g-buttons">
        {%- if section.settings.button_label != blank -%}
          <a href="{{ primary_url }}" class="button button--primary">{{ section.settings.button_label | escape }}</a>
        {%- endif -%}
        {%- if section.settings.button2_label != blank and section.settings.button2_link != blank -%}
          <a href="{{ section.settings.button2_link }}" class="button button--secondary">
            {{- section.settings.button2_label | escape -}}
          </a>
        {%- endif -%}
      </div>

      {%- if section.blocks.size > 0 -%}
        <ul class="g-hero__points" role="list">
          {%- for block in section.blocks -%}
            <li class="g-hero__point" {{ block.shopify_attributes }}>
              {%- render 'garelon-icon', icon: block.settings.icon -%}
              <span>{{ block.settings.text | escape }}</span>
            </li>
          {%- endfor -%}
        </ul>
      {%- endif -%}
    </div>
  </div>
</div>

{% schema %}
{
  "name": "GARELON Portada",
  "tag": "section",
  "class": "section",
  "max_blocks": 3,
  "settings": [
    {
      "type": "product",
      "id": "product",
      "label": "Producto",
      "info": "Se usa para el enlace del botón y el precio. Si lo dejas vacío se usa el primer producto de la tienda."
    },
    {
      "type": "header",
      "content": "Imágenes"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Imagen",
      "info": "Vacía = IMAGEN 1 (foto limpia del frasco, la caja y el tapón), incluida en el tema. Si eliges otra, que muestre el producto real y con poco texto."
    },
    {
      "type": "image_picker",
      "id": "image_mobile",
      "label": "Imagen solo para móvil (opcional)",
      "info": "Solo si quieres una imagen distinta en móvil. Las imágenes bajas (horizontales o cuadradas) dejan el botón visible sin hacer scroll."
    },
    {
      "type": "select",
      "id": "image_position",
      "label": "Posición de la imagen en escritorio",
      "options": [
        { "value": "right", "label": "Derecha" },
        { "value": "left", "label": "Izquierda" }
      ],
      "default": "right"
    },
    {
      "type": "checkbox",
      "id": "mobile_image_first",
      "label": "En móvil, mostrar la imagen antes del texto",
      "default": true
    },
    {
      "type": "header",
      "content": "Texto"
    },
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Antetítulo",
      "default": "GARELON"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "Una mirada con aspecto más descansado"
    },
    {
      "type": "checkbox",
      "id": "use_h1",
      "label": "Usar el título como H1 de la página",
      "info": "Debe existir un solo H1 por página.",
      "default": true
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Texto",
      "default": "<p>Sérum para el contorno de ojos con aceite de ricino y aplicador roller, diseñado para aportar hidratación y complementar tu rutina diaria de cuidado.</p>"
    },
    {
      "type": "checkbox",
      "id": "show_price",
      "label": "Mostrar el precio del producto",
      "info": "El precio se lee siempre de Shopify.",
      "default": true
    },
    {
      "type": "header",
      "content": "Botones"
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Texto del botón principal",
      "default": "Comprar el sérum"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Enlace del botón principal",
      "info": "Vacío = zona de compra de la home (/#comprar)."
    },
    {
      "type": "text",
      "id": "button2_label",
      "label": "Texto del botón secundario",
      "default": "Cómo se usa"
    },
    {
      "type": "url",
      "id": "button2_link",
      "label": "Enlace del botón secundario"
    },
    {
      "type": "header",
      "content": "Diseño"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla",
      "info": "Opcional. Permite enlazar a esta sección, p. ej. /#inicio"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 24
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 40
    }
  ],
  "blocks": [
    {
      "type": "point",
      "name": "Micro-beneficio",
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Icono",
          "options": [
            { "value": "none", "label": "Ninguno" },
            { "value": "roller", "label": "Roller" },
            { "value": "bottle", "label": "Frasco" },
            { "value": "steps", "label": "Reloj / rutina" },
            { "value": "drop", "label": "Gota" },
            { "value": "eye", "label": "Ojo" },
            { "value": "leaf", "label": "Hoja" },
            { "value": "check", "label": "Check" }
          ],
          "default": "roller"
        },
        {
          "type": "text",
          "id": "text",
          "label": "Texto",
          "default": "Aplicador roller"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "GARELON Portada",
      "blocks": [
        { "type": "point", "settings": { "icon": "roller", "text": "Aplicador roller" } },
        { "type": "point", "settings": { "icon": "bottle", "text": "10 ml" } },
        { "type": "point", "settings": { "icon": "steps", "text": "Rutina sencilla" } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/garelon-trust-bar.liquid`

```liquid
<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-trust color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width">
    {%- if section.settings.heading != blank -%}
      <h2 class="visually-hidden">{{ section.settings.heading | escape }}</h2>
    {%- endif -%}
    <ul class="g-trust__list{% if section.settings.show_borders %} g-trust__list--bordered{% endif %}" role="list">
      {%- for block in section.blocks -%}
        <li class="g-trust__item" {{ block.shopify_attributes }}>
          {%- render 'garelon-icon', icon: block.settings.icon -%}
          <span class="g-trust__text">
            {%- if block.settings.link != blank -%}
              <a href="{%- render 'garelon-url', url: block.settings.link -%}" class="g-trust__title link">{{ block.settings.title | escape }}</a>
            {%- else -%}
              <span class="g-trust__title">{{ block.settings.title | escape }}</span>
            {%- endif -%}
            {%- if block.settings.text != blank -%}
              <span class="g-trust__desc">{{ block.settings.text | escape }}</span>
            {%- endif -%}
          </span>
        </li>
      {%- endfor -%}
    </ul>
  </div>
</div>

{% schema %}
{
  "name": "GARELON Confianza",
  "tag": "section",
  "class": "section",
  "max_blocks": 4,
  "settings": [
    {
      "type": "paragraph",
      "content": "Usa solo afirmaciones verdaderas. No añadas certificados, premios ni garantías que no puedas demostrar."
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título (solo para lectores de pantalla)",
      "default": "Características"
    },
    {
      "type": "checkbox",
      "id": "show_borders",
      "label": "Mostrar líneas separadoras",
      "default": true
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 0
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 0
    }
  ],
  "blocks": [
    {
      "type": "item",
      "name": "Elemento",
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Icono",
          "options": [
            { "value": "none", "label": "Ninguno" },
            { "value": "eye", "label": "Ojo" },
            { "value": "roller", "label": "Roller" },
            { "value": "steps", "label": "Reloj / rutina" },
            { "value": "leaf", "label": "Hoja" },
            { "value": "drop", "label": "Gota" },
            { "value": "lock", "label": "Candado (pago seguro)" },
            { "value": "chat", "label": "Mensaje (atención al cliente)" },
            { "value": "truck", "label": "Camión (envío)" },
            { "value": "return", "label": "Flecha (devoluciones)" },
            { "value": "check", "label": "Check" }
          ],
          "default": "check"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Título",
          "default": "Rutina en 3 pasos"
        },
        {
          "type": "text",
          "id": "text",
          "label": "Texto secundario (opcional)"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Enlace (opcional)"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "GARELON Confianza",
      "blocks": [
        { "type": "item", "settings": { "icon": "eye", "title": "Aplicación precisa" } },
        { "type": "item", "settings": { "icon": "roller", "title": "Roller metálico" } },
        { "type": "item", "settings": { "icon": "steps", "title": "Rutina en 3 pasos" } },
        { "type": "item", "settings": { "icon": "leaf", "title": "Fórmula con aceite de ricino" } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/garelon-benefits.liquid`

```liquid
<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-benefits color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width">
    <div class="g-heading-group g-heading-group--{{ section.settings.alignment }}">
      {%- if section.settings.eyebrow != blank -%}
        <p class="g-eyebrow">{{ section.settings.eyebrow | escape }}</p>
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <h2 class="g-h2">{{ section.settings.heading | escape }}</h2>
      {%- endif -%}
      {%- if section.settings.text != blank -%}
        <div class="g-lead">{{ section.settings.text }}</div>
      {%- endif -%}
    </div>

    {%- if section.blocks.size > 0 -%}
      <ul class="g-benefits__grid" role="list">
        {%- for block in section.blocks -%}
          <li class="g-card g-benefits__item" {{ block.shopify_attributes }}>
            <span class="g-benefits__icon">{%- render 'garelon-icon', icon: block.settings.icon -%}</span>
            <div>
              <h3 class="g-h3">{{ block.settings.title | escape }}</h3>
              {%- if block.settings.text != blank -%}
                <p class="g-benefits__text">{{ block.settings.text | escape }}</p>
              {%- endif -%}
            </div>
          </li>
        {%- endfor -%}
      </ul>
    {%- endif -%}

    {%- if section.settings.note != blank -%}
      <p class="g-note">{{ section.settings.note | escape }}</p>
    {%- endif -%}
  </div>
</div>

{% schema %}
{
  "name": "GARELON Beneficios",
  "tag": "section",
  "class": "section",
  "max_blocks": 6,
  "settings": [
    {
      "type": "paragraph",
      "content": "Usa formulaciones prudentes (\"ayuda a...\", \"apariencia de...\"). Evita promesas médicas o resultados garantizados."
    },
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Antetítulo"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "Cuida una de las zonas más delicadas de tu rostro"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Texto"
    },
    {
      "type": "text",
      "id": "note",
      "label": "Nota al pie (opcional)"
    },
    {
      "type": "select",
      "id": "alignment",
      "label": "Alineación del encabezado",
      "options": [
        { "value": "center", "label": "Centrado" },
        { "value": "left", "label": "Izquierda" }
      ],
      "default": "center"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 56
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 56
    }
  ],
  "blocks": [
    {
      "type": "benefit",
      "name": "Beneficio",
      "settings": [
        {
          "type": "select",
          "id": "icon",
          "label": "Icono",
          "options": [
            { "value": "none", "label": "Ninguno" },
            { "value": "eye", "label": "Ojo" },
            { "value": "eye-under", "label": "Ojo con contorno" },
            { "value": "lines", "label": "Líneas" },
            { "value": "drop", "label": "Gota" },
            { "value": "roller", "label": "Roller" },
            { "value": "sparkle", "label": "Destello" },
            { "value": "leaf", "label": "Hoja" }
          ],
          "default": "drop"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Título",
          "default": "Hidratación"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Texto",
          "default": "Aporta cuidado e hidratación a la zona del contorno."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "GARELON Beneficios",
      "settings": {
        "text": "<p>El contorno de ojos es una piel fina que puede mostrar signos de cansancio, sequedad, bolsas y líneas finas. Dedicarle un momento cada día es un gesto sencillo dentro de tu rutina.</p>"
      },
      "blocks": [
        { "type": "benefit", "settings": { "icon": "eye-under", "title": "Ojeras", "text": "Contribuye a mejorar la apariencia de la zona oscura del contorno." } },
        { "type": "benefit", "settings": { "icon": "eye", "title": "Bolsas", "text": "El masaje con roller complementa una rutina orientada a una mirada más descansada." } },
        { "type": "benefit", "settings": { "icon": "lines", "title": "Líneas finas", "text": "La hidratación ayuda a mantener una apariencia más suave." } },
        { "type": "benefit", "settings": { "icon": "drop", "title": "Hidratación", "text": "Aporta cuidado e hidratación a la zona del contorno." } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/garelon-image-text.liquid`

```liquid
{%- liquid
  assign product = section.settings.product | default: collections.all.products.first
  assign button_url = section.settings.button_link | default: product.url | default: routes.root_url
  assign has_media = true
  if section.settings.image == blank and section.settings.fallback_image == 'none'
    assign has_media = false
  endif
-%}

<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-split color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width g-split__grid{% if section.settings.image_position == 'right' %} g-split__grid--image-right{% endif %}{% unless has_media %} g-split__grid--no-media{% endunless %}">
    {%- if has_media -%}
      <div class="g-split__media g-media g-media--{{ section.settings.image_shape }}">
        <div class="g-media__frame">
          {%- render 'garelon-fallback-image',
            image: section.settings.image,
            fallback: section.settings.fallback_image,
            alt: section.settings.heading,
            sizes: '(min-width: 990px) 540px, (min-width: 750px) 45vw, calc(100vw - 3rem)',
            class: 'g-media__img'
          -%}
        </div>
        {%- if section.settings.show_massage_lines -%}
          <svg class="g-massage-lines" viewBox="0 0 120 70" aria-hidden="true" focusable="false">
            <path d="M8 22 C 35 4, 85 4, 112 22" />
            <path d="M104 14 L112 22 L101 25" />
            <path d="M112 48 C 85 66, 35 66, 8 48" />
            <path d="M16 56 L8 48 L19 45" />
          </svg>
        {%- endif -%}
      </div>
    {%- endif -%}

    <div class="g-split__content">
      {%- if section.settings.eyebrow != blank -%}
        <p class="g-eyebrow">{{ section.settings.eyebrow | escape }}</p>
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <h2 class="g-h2">{{ section.settings.heading | escape }}</h2>
      {%- endif -%}
      {%- if section.settings.text != blank -%}
        <div class="g-rte">{{ section.settings.text }}</div>
      {%- endif -%}
      {%- if section.settings.button_label != blank -%}
        <div class="g-buttons">
          <a
            href="{{ button_url }}"
            class="button {% if section.settings.button_secondary %}button--secondary{% else %}button--primary{% endif %}"
          >
            {{- section.settings.button_label | escape -}}
          </a>
        </div>
      {%- endif -%}
    </div>
  </div>
</div>

{% schema %}
{
  "name": "GARELON Imagen y texto",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Imagen",
      "info": "Si el producto aparece en la foto, usa siempre imágenes del producto REAL."
    },
    {
      "type": "select",
      "id": "fallback_image",
      "label": "Imagen del tema si no eliges ninguna",
      "options": [
        { "value": "img01-producto", "label": "IMAGEN 1 · Producto (frasco, caja y tapón)" },
        { "value": "img10-presentacion", "label": "IMAGEN 10 · Presentación y beneficios" },
        { "value": "img07-roller", "label": "IMAGEN 7 · Técnica de masaje con roller" },
        { "value": "img05-ingredientes", "label": "IMAGEN 5 · Ingredientes" },
        { "value": "img04-uso", "label": "IMAGEN 4 · Cómo usarlo" },
        { "value": "img09-tamano", "label": "IMAGEN 9 · Tamaño del producto" },
        { "value": "none", "label": "Ninguna (solo texto)" }
      ],
      "default": "img01-producto"
    },
    {
      "type": "select",
      "id": "image_shape",
      "label": "Forma de la imagen",
      "info": "Arco y círculo recortan la imagen: úsalos solo con fotografías sin texto.",
      "options": [
        { "value": "rounded", "label": "Rectángulo suave (imagen completa)" },
        { "value": "arch", "label": "Arco" },
        { "value": "circle", "label": "Círculo" }
      ],
      "default": "rounded"
    },
    {
      "type": "select",
      "id": "image_position",
      "label": "Posición de la imagen en escritorio",
      "options": [
        { "value": "left", "label": "Izquierda" },
        { "value": "right", "label": "Derecha" }
      ],
      "default": "left"
    },
    {
      "type": "checkbox",
      "id": "show_massage_lines",
      "label": "Mostrar líneas de dirección del masaje",
      "default": false
    },
    {
      "type": "header",
      "content": "Texto"
    },
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Antetítulo"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "Cuidado diario. Aplicación sencilla."
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Texto",
      "default": "<p>Su formato roller permite distribuir el sérum directamente sobre el contorno de ojos mientras realizas un masaje suave.</p>"
    },
    {
      "type": "header",
      "content": "Botón"
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Texto del botón",
      "default": "Ver producto"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Enlace del botón",
      "info": "Vacío = página del producto seleccionado."
    },
    {
      "type": "product",
      "id": "product",
      "label": "Producto",
      "info": "Opcional. Vacío = primer producto de la tienda."
    },
    {
      "type": "checkbox",
      "id": "button_secondary",
      "label": "Botón con estilo secundario",
      "default": false
    },
    {
      "type": "header",
      "content": "Diseño"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 56
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 56
    }
  ],
  "presets": [
    {
      "name": "GARELON Imagen y texto"
    }
  ]
}
{% endschema %}
```

### `sections/garelon-ingredients.liquid`

```liquid
{%- liquid
  assign has_media = true
  if section.settings.image == blank and section.settings.fallback_image == 'none'
    assign has_media = false
  endif
-%}

<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-ingredients color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width">
    <div class="g-heading-group g-heading-group--center">
      {%- if section.settings.eyebrow != blank -%}
        <p class="g-eyebrow">{{ section.settings.eyebrow | escape }}</p>
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <h2 class="g-h2">{{ section.settings.heading | escape }}</h2>
      {%- endif -%}
      {%- if section.settings.text != blank -%}
        <div class="g-lead">{{ section.settings.text }}</div>
      {%- endif -%}
    </div>

    <div class="g-ingredients__layout{% if has_media %} g-ingredients__layout--media{% endif %}">
      {%- if has_media -%}
        <div class="g-ingredients__visual g-media g-media--rounded">
          <div class="g-media__frame">
            {%- render 'garelon-fallback-image',
              image: section.settings.image,
              fallback: section.settings.fallback_image,
              alt: section.settings.heading,
              sizes: '(min-width: 990px) 540px, (min-width: 750px) 45vw, calc(100vw - 3rem)',
              class: 'g-media__img'
            -%}
          </div>
        </div>
      {%- endif -%}

      <div class="g-ingredients__content">
        {%- if section.blocks.size > 0 -%}
          <ul class="g-ingredients__grid" role="list">
            {%- for block in section.blocks -%}
              <li class="g-card g-ingredients__item" {{ block.shopify_attributes }}>
                <h3 class="g-ingredients__name">{{ block.settings.name | escape }}</h3>
                {%- if block.settings.inci != blank -%}
                  <p class="g-ingredients__inci">{{ block.settings.inci | escape }}</p>
                {%- endif -%}
                {%- if block.settings.text != blank -%}
                  <p class="g-ingredients__text">{{ block.settings.text | escape }}</p>
                {%- endif -%}
              </li>
            {%- endfor -%}
          </ul>
        {%- endif -%}

        {%- if section.settings.show_note and section.settings.note != blank -%}
          <p class="g-note g-note--center">{{ section.settings.note | escape }}</p>
        {%- endif -%}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "GARELON Ingredientes",
  "tag": "section",
  "class": "section",
  "max_blocks": 12,
  "settings": [
    {
      "type": "paragraph",
      "content": "Incluye solo ingredientes confirmados por el proveedor o por el envase. No añadas ingredientes por suposición."
    },
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Antetítulo",
      "default": "Ingredientes"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "Una fórmula sencilla para tu rutina"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Texto"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Imagen de la sección",
      "info": "Vacía = la imagen del tema elegida abajo. La lista de ingredientes se mantiene siempre como texto."
    },
    {
      "type": "select",
      "id": "fallback_image",
      "label": "Imagen del tema si no eliges ninguna",
      "options": [
        { "value": "img05-ingredientes", "label": "IMAGEN 5 · Ingredientes principales" },
        { "value": "none", "label": "Ninguna (solo la lista)" }
      ],
      "default": "img05-ingredientes"
    },
    {
      "type": "checkbox",
      "id": "show_note",
      "label": "Mostrar nota",
      "default": true
    },
    {
      "type": "text",
      "id": "note",
      "label": "Nota",
      "default": "Ingredientes según la información facilitada por el proveedor. Consulta siempre el envase del producto."
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-2"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla",
      "default": "ingredientes"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 56
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 56
    }
  ],
  "blocks": [
    {
      "type": "ingredient",
      "name": "Ingrediente",
      "settings": [
        {
          "type": "text",
          "id": "name",
          "label": "Nombre",
          "default": "Ingrediente"
        },
        {
          "type": "text",
          "id": "inci",
          "label": "Denominación INCI (opcional)"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Descripción breve (opcional)",
          "info": "Descripción neutra. Evita atribuir efectos que no puedas justificar."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "GARELON Ingredientes",
      "blocks": [
        { "type": "ingredient", "settings": { "name": "Aceite de ricino", "inci": "Ricinus Communis (Castor) Seed Oil", "text": "Aceite vegetal obtenido de las semillas de ricino." } },
        { "type": "ingredient", "settings": { "name": "Acetyl Tripeptide-1", "inci": "Acetyl Tripeptide-1", "text": "Péptido de uso cosmético." } },
        { "type": "ingredient", "settings": { "name": "Colágeno", "inci": "Collagen", "text": "Proteína de uso habitual en el cuidado de la piel." } },
        { "type": "ingredient", "settings": { "name": "Extracto de Boswellia Serrata", "inci": "Boswellia Serrata Extract", "text": "Extracto vegetal procedente de la resina del árbol Boswellia serrata." } },
        { "type": "ingredient", "settings": { "name": "Agua", "inci": "Aqua", "text": "" } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/garelon-how-to-use.liquid`

```liquid
{%- liquid
  assign has_media = true
  if section.settings.image == blank and section.settings.fallback_image == 'none'
    assign has_media = false
  endif
-%}

<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-steps color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width">
    <div class="g-heading-group g-heading-group--center">
      {%- if section.settings.eyebrow != blank -%}
        <p class="g-eyebrow">{{ section.settings.eyebrow | escape }}</p>
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <h2 class="g-h2">{{ section.settings.heading | escape }}</h2>
      {%- endif -%}
    </div>

    <div class="g-steps__layout{% if has_media %} g-steps__layout--media{% endif %}">
      {%- if has_media -%}
        <div class="g-steps__visual g-media g-media--rounded">
          <div class="g-media__frame">
            {%- render 'garelon-fallback-image',
              image: section.settings.image,
              fallback: section.settings.fallback_image,
              alt: section.settings.heading,
              sizes: '(min-width: 990px) 540px, (min-width: 750px) 45vw, calc(100vw - 3rem)',
              class: 'g-media__img'
            -%}
          </div>
        </div>
      {%- endif -%}

      <div class="g-steps__content">
        {%- if section.blocks.size > 0 -%}
          <ol class="g-steps__list{% if has_media %} g-steps__list--stacked{% endif %}">
            {%- for block in section.blocks -%}
              <li class="g-steps__item" {{ block.shopify_attributes }}>
                {%- if section.settings.show_images and block.settings.image != blank -%}
                  <div class="g-steps__media">
                    {%- render 'garelon-image',
                      image: block.settings.image,
                      alt: block.settings.title,
                      sizes: '(min-width: 750px) 30vw, 112px',
                      class: 'g-steps__img'
                    -%}
                  </div>
                {%- endif -%}
                <div class="g-steps__body">
                  <p class="g-steps__number" aria-hidden="true">
                    {{- block.settings.label | default: forloop.index | escape -}}
                  </p>
                  <h3 class="g-h3">
                    <span class="visually-hidden">Paso {{ forloop.index }}:</span>
                    {{ block.settings.title | escape }}
                  </h3>
                  {%- if block.settings.text != blank -%}
                    <p class="g-steps__text">{{ block.settings.text | escape }}</p>
                  {%- endif -%}
                </div>
              </li>
            {%- endfor -%}
          </ol>
        {%- endif -%}

        {%- if section.settings.note != blank -%}
          <p class="g-note{% unless has_media %} g-note--center{% endunless %}">{{ section.settings.note | escape }}</p>
        {%- endif -%}
      </div>
    </div>
  </div>
</div>

{% schema %}
{
  "name": "GARELON Cómo usarlo",
  "tag": "section",
  "class": "section",
  "max_blocks": 5,
  "settings": [
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Antetítulo",
      "default": "Cómo usarlo"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "3 pasos. Menos de un minuto."
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Imagen de la sección",
      "info": "Vacía = la imagen del tema elegida abajo."
    },
    {
      "type": "select",
      "id": "fallback_image",
      "label": "Imagen del tema si no eliges ninguna",
      "options": [
        { "value": "img04-uso", "label": "IMAGEN 4 · Cómo usarlo (3 pasos)" },
        { "value": "img07-roller", "label": "IMAGEN 7 · Técnica de masaje con roller" },
        { "value": "none", "label": "Ninguna (solo los pasos)" }
      ],
      "default": "img04-uso"
    },
    {
      "type": "checkbox",
      "id": "show_images",
      "label": "Mostrar la imagen de cada paso",
      "info": "Solo en los pasos a los que les hayas elegido una imagen.",
      "default": false
    },
    {
      "type": "text",
      "id": "note",
      "label": "Nota de precaución (opcional)",
      "default": "Solo para uso externo. Evita el contacto directo con los ojos. Si notas cualquier molestia, interrumpe su uso."
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla",
      "default": "como-usarlo"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 56
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 56
    }
  ],
  "blocks": [
    {
      "type": "step",
      "name": "Paso",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Imagen del paso (opcional)",
          "info": "Fotografía real del gesto. Se muestra si activas «Mostrar la imagen de cada paso»."
        },
        {
          "type": "text",
          "id": "label",
          "label": "Número visible",
          "default": "01"
        },
        {
          "type": "text",
          "id": "title",
          "label": "Título",
          "default": "Limpia"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Texto",
          "default": "Limpia y seca bien el rostro y el contorno de ojos."
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "GARELON Cómo usarlo",
      "blocks": [
        { "type": "step", "settings": { "label": "01", "title": "Limpia", "text": "Limpia y seca bien el rostro y el contorno de ojos." } },
        { "type": "step", "settings": { "label": "02", "title": "Aplica", "text": "Presiona y desliza suavemente el roller para que salga el sérum y distribúyelo por el contorno." } },
        { "type": "step", "settings": { "label": "03", "title": "Masajea", "text": "Masajea con suavidad con la bola metálica para favorecer la distribución del sérum." } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/garelon-faq.liquid`

```liquid
<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-faq color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width g-faq__wrap">
    {%- if section.settings.heading != blank or section.settings.eyebrow != blank -%}
      <div class="g-heading-group g-heading-group--center">
        {%- if section.settings.eyebrow != blank -%}
          <p class="g-eyebrow">{{ section.settings.eyebrow | escape }}</p>
        {%- endif -%}
        {%- if section.settings.heading != blank -%}
          <h2 class="g-h2">{{ section.settings.heading | escape }}</h2>
        {%- endif -%}
      </div>
    {%- endif -%}

    <div class="g-faq__list">
      {%- for block in section.blocks -%}
        <details
          class="g-faq__item"
          id="Faq-{{ section.id }}-{{ forloop.index }}"
          {% if section.settings.open_first and forloop.first %}
            open
          {% endif %}
          {{ block.shopify_attributes }}
        >
          <summary class="g-faq__question">
            <h3 class="g-faq__question-text">{{ block.settings.question | escape }}</h3>
            <span class="g-faq__toggle" aria-hidden="true"></span>
          </summary>
          <div class="g-faq__answer g-rte">
            {%- render 'garelon-url', html: block.settings.answer -%}
          </div>
        </details>
      {%- endfor -%}
    </div>

    {%- if section.settings.contact_text != blank -%}
      <div class="g-faq__contact g-rte">{%- render 'garelon-url', html: section.settings.contact_text -%}</div>
    {%- endif -%}
  </div>
</div>

{% schema %}
{
  "name": "GARELON FAQ",
  "tag": "section",
  "class": "section",
  "max_blocks": 20,
  "settings": [
    {
      "type": "paragraph",
      "content": "No incluyas plazos de envío ni condiciones de devolución que no coincidan con tus políticas reales de Shopify."
    },
    {
      "type": "text",
      "id": "eyebrow",
      "label": "Antetítulo"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "Preguntas frecuentes"
    },
    {
      "type": "checkbox",
      "id": "open_first",
      "label": "Abrir la primera pregunta",
      "default": false
    },
    {
      "type": "richtext",
      "id": "contact_text",
      "label": "Texto final (opcional)"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-1"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla",
      "default": "preguntas-frecuentes"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 56
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 56
    }
  ],
  "blocks": [
    {
      "type": "question",
      "name": "Pregunta",
      "settings": [
        {
          "type": "text",
          "id": "question",
          "label": "Pregunta",
          "default": "Pregunta"
        },
        {
          "type": "richtext",
          "id": "answer",
          "label": "Respuesta",
          "default": "<p>Respuesta.</p>"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "GARELON FAQ",
      "blocks": [
        { "type": "question", "settings": { "question": "¿Cómo se utiliza?", "answer": "<p>Limpia y seca el rostro, desliza suavemente el roller por el contorno de ojos y masajea con la bola metálica hasta distribuir el sérum.</p>" } },
        { "type": "question", "settings": { "question": "¿Cuándo recibiré mi pedido?", "answer": "<p>Consulta los plazos y costes actualizados en nuestra <a href=\"/policies/shipping-policy\" title=\"Política de envío\">política de envío</a>. También se muestran durante el proceso de compra.</p>" } }
      ]
    }
  ]
}
{% endschema %}
```

### `sections/garelon-final-cta.liquid`

```liquid
{%- liquid
  assign product = section.settings.product | default: collections.all.products.first
  assign buy_url = routes.root_url | append: '#comprar'
  assign button_url = section.settings.button_link | default: buy_url
  assign has_media = true
  if section.settings.image == blank and section.settings.fallback_image == 'none'
    assign has_media = false
  endif
-%}

<div
  {% if section.settings.anchor != blank %}
    id="{{ section.settings.anchor | handleize }}"
  {% endif %}
  class="g-section g-final color-{{ section.settings.color_scheme }} gradient"
  style="--g-pt: {{ section.settings.padding_top }}px; --g-pb: {{ section.settings.padding_bottom }}px;"
>
  <div class="page-width g-final__grid{% unless has_media %} g-final__grid--no-media{% endunless %}">
    <div class="g-final__content">
      {%- if section.settings.show_isotype -%}
        <img
          class="g-final__isotype"
          src="{{ 'garelon-isotipo-96.webp' | asset_url }}"
          width="36"
          height="39"
          alt=""
          loading="lazy"
        >
      {%- endif -%}
      {%- if section.settings.heading != blank -%}
        <h2 class="g-h2">{{ section.settings.heading | escape }}</h2>
      {%- endif -%}
      {%- if section.settings.text != blank -%}
        <div class="g-rte">{{ section.settings.text }}</div>
      {%- endif -%}
      {%- if section.settings.show_price -%}
        {%- render 'garelon-price-inline', product: product -%}
      {%- endif -%}
      {%- if section.settings.button_label != blank -%}
        <div class="g-buttons g-buttons--center">
          <a href="{{ button_url }}" class="button button--primary">{{ section.settings.button_label | escape }}</a>
        </div>
      {%- endif -%}
    </div>
    {%- if has_media -%}
      <div class="g-final__media g-media g-media--rounded">
        <div class="g-media__frame">
          {%- render 'garelon-fallback-image',
            image: section.settings.image,
            fallback: section.settings.fallback_image,
            alt: 'Sérum para el contorno de ojos con aplicador roller y su caja',
            sizes: '(min-width: 990px) 560px, (min-width: 750px) 48vw, calc(100vw - 3rem)',
            class: 'g-media__img'
          -%}
        </div>
      </div>
    {%- endif -%}
  </div>
</div>

{% schema %}
{
  "name": "GARELON Llamada final",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "image_picker",
      "id": "image",
      "label": "Imagen",
      "info": "Imagen del producto REAL."
    },
    {
      "type": "select",
      "id": "fallback_image",
      "label": "Imagen del tema si no eliges ninguna",
      "options": [
        { "value": "none", "label": "Ninguna (solo texto, centrado)" },
        { "value": "img01-producto", "label": "IMAGEN 1 · Producto (frasco, caja y tapón)" },
        { "value": "img10-presentacion", "label": "IMAGEN 10 · Presentación y beneficios" }
      ],
      "default": "none"
    },
    {
      "type": "checkbox",
      "id": "show_isotype",
      "label": "Mostrar isotipo GARELON",
      "default": true
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Título",
      "default": "Tu rutina empieza con un pequeño gesto"
    },
    {
      "type": "richtext",
      "id": "text",
      "label": "Texto"
    },
    {
      "type": "checkbox",
      "id": "show_price",
      "label": "Mostrar el precio del producto",
      "default": false
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Texto del botón",
      "default": "Comprar el sérum"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Enlace del botón",
      "info": "Vacío = zona de compra de la home (/#comprar)."
    },
    {
      "type": "product",
      "id": "product",
      "label": "Producto",
      "info": "Opcional. Vacío = primer producto de la tienda."
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-2"
    },
    {
      "type": "text",
      "id": "anchor",
      "label": "ID de ancla"
    },
    {
      "type": "range",
      "id": "padding_top",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen superior",
      "default": 56
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "min": 0,
      "max": 100,
      "step": 4,
      "unit": "px",
      "label": "Margen inferior",
      "default": 56
    }
  ],
  "presets": [
    {
      "name": "GARELON Llamada final"
    }
  ]
}
{% endschema %}
```

### `sections/garelon-sticky-atc.liquid`

```liquid
{%- if product != blank -%}
  <script src="{{ 'garelon.js' | asset_url }}" defer="defer"></script>
  {%- liquid
    assign variant = product.selected_or_first_available_variant
    assign thumb = variant.featured_media | default: product.featured_media
  -%}
  <garelon-sticky-atc
    class="g-sticky color-{{ section.settings.color_scheme }}{% if section.settings.show_on_desktop %} g-sticky--desktop{% endif %}"
    inert
  >
    <div class="g-sticky__inner page-width">
      {%- if thumb != blank -%}
        <img
          class="g-sticky__thumb"
          src="{{ thumb.preview_image | image_url: width: 120 }}"
          width="48"
          height="48"
          alt=""
          loading="lazy"
          data-sticky-thumb
        >
      {%- endif -%}
      <div class="g-sticky__info">
        <p class="g-sticky__title" id="StickyTitle-{{ section.id }}">{{ product.title | escape }}</p>
        <div class="g-sticky__price" data-sticky-price aria-hidden="true">
          {%- render 'price', product: product, use_variant: true -%}
        </div>
      </div>
      <button
        type="button"
        class="button button--primary g-sticky__button"
        data-sticky-button
        aria-describedby="StickyTitle-{{ section.id }}"
        {% unless variant.available %}
          disabled
        {% endunless %}
      >
        <span data-sticky-label>{{ section.settings.button_label | default: 'Añadir' | escape }}</span>
      </button>
    </div>
  </garelon-sticky-atc>
{%- endif -%}

{% schema %}
{
  "name": "GARELON Compra fija",
  "tag": "section",
  "class": "section g-sticky-section",
  "enabled_on": {
    "templates": ["product"]
  },
  "settings": [
    {
      "type": "paragraph",
      "content": "Barra discreta con miniatura, precio y botón. Aparece al pasar el botón principal y usa el mismo formulario del producto (precio, variante y stock reales). Para desactivarla, oculta esta sección."
    },
    {
      "type": "text",
      "id": "button_label",
      "label": "Texto del botón",
      "default": "Añadir"
    },
    {
      "type": "checkbox",
      "id": "show_on_desktop",
      "label": "Mostrar también en escritorio",
      "default": false
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Esquema de color",
      "default": "scheme-4"
    }
  ],
  "presets": [
    {
      "name": "GARELON Compra fija"
    }
  ]
}
{% endschema %}
```

---

## Paso 5 · Cambios pequeños en archivos de Dawn

Abre cada archivo, usa **Ctrl+F / Cmd+F** para localizar el texto de "Busca" y sustitúyelo por el de "Sustituye por".

### 5.1 `layout/theme.liquid`

**Busca:**
```liquid
    <meta name="theme-color" content="">
```
**Sustituye por:**
```liquid
    <meta name="theme-color" content="{{ settings.color_schemes['scheme-1'].settings.background }}">
```

**Busca:**
```liquid
    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
    {%- endif -%}
```
**Sustituye por:**
```liquid
    {%- if settings.favicon != blank -%}
      <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
      <link rel="apple-touch-icon" href="{{ settings.favicon | image_url: width: 180, height: 180 }}">
    {%- else -%}
      {%- comment -%} GARELON: isotipo de marca por defecto hasta que se suba un favicon en Configuración del tema {%- endcomment -%}
      <link rel="icon" type="image/png" href="{{ 'garelon-favicon-32.png' | asset_url }}">
      <link rel="apple-touch-icon" href="{{ 'garelon-apple-touch-180.png' | asset_url }}">
    {%- endif -%}
```

**Busca** (una sola vez en el archivo):
```liquid
    {{ 'base.css' | asset_url | stylesheet_tag }}
```
**Sustituye por:**
```liquid
    {{ 'base.css' | asset_url | stylesheet_tag }}
    {{ 'garelon.css' | asset_url | stylesheet_tag }}
```

### 5.2 `sections/header.liquid`

Hazlo **las dos veces** que aparece cada texto.

**Busca** (2 veces):
```liquid
      {%- if request.page_type == 'index' -%}
        <h1 class="header__heading">
      {%- endif -%}
```
**Bórralo** (así el logo deja de ser un segundo H1 en la home).

**Busca** (2 veces):
```liquid
      {%- if request.page_type == 'index' -%}
        </h1>
      {%- endif -%}
```
**Bórralo.**

**Busca** (2 veces):
```liquid
          <span class="h2">{{ shop.name }}</span>
```
**Sustituye por:**
```liquid
          {%- render 'garelon-logo-fallback' -%}
```

### 5.3 `sections/footer.liquid`

**Busca:**
```liquid
                        </div>
                      {%- endif -%}
                      {%- if settings.brand_headline != blank -%}
```
**Sustituye por:**
```liquid
                        </div>
                      {%- else -%}
                        {%- render 'garelon-logo-fallback', variant: 'stacked' -%}
                      {%- endif -%}
                      {%- if settings.brand_headline != blank -%}
```

### 5.4 `sections/featured-product.liquid`

**Busca** (al principio del archivo):
```liquid
  assign product = section.settings.product
```
**Sustituye por:**
```liquid
  # GARELON: si no se elige producto, se usa el primero de la tienda (tienda de producto único).
  assign product = section.settings.product | default: collections.all.products.first
```

**Busca:**
```liquid
  {% unless section.settings.product.has_only_default_variant %}
```
**Sustituye por:**
```liquid
  {% unless product.has_only_default_variant %}
```

**Busca:**
```liquid
{% if product.media.size > 0 or section.settings.product == blank %}
```
**Sustituye por:**
```liquid
{% if product.media.size > 0 or product == blank %}
```

### 5.5 `sections/main-product.liquid` (bloque opcional de packs)

**Busca** (una sola vez, en la zona de bloques):
```liquid
                {%- when 'quantity_selector' -%}
```
**Sustituye por:**
```liquid
                {%- when 'garelon_packs' -%}
                  {%- assign quantity_blocks = section.blocks | where: 'type', 'quantity_selector' -%}
                  {%- assign has_quantity_input = false -%}
                  {%- if quantity_blocks.size > 0 -%}
                    {%- assign has_quantity_input = true -%}
                  {%- endif -%}
                  {%- render 'garelon-packs',
                    block: block,
                    section_id: section.id,
                    product_form_id: product_form_id,
                    has_quantity_input: has_quantity_input
                  -%}
                {%- when 'quantity_selector' -%}
```

**Busca** (una sola vez, dentro de `{% schema %}`, al final del archivo):
```json
    {
      "type": "quantity_selector",
```
**Sustituye por:**
```json
    {
      "type": "garelon_packs",
      "name": "GARELON Packs",
      "limit": 1,
      "settings": [
        {
          "type": "paragraph",
          "content": "Permite elegir 1, 2 o 3 unidades. Solo cambia la cantidad: no aplica ni anuncia descuentos. Para desactivarlo, oculta o elimina este bloque."
        },
        {
          "type": "text",
          "id": "heading",
          "label": "Título",
          "default": "Unidades"
        },
        {
          "type": "select",
          "id": "max_units",
          "label": "Opciones",
          "options": [
            { "value": "2", "label": "1 y 2 unidades" },
            { "value": "3", "label": "1, 2 y 3 unidades" }
          ],
          "default": "3"
        },
        {
          "type": "text",
          "id": "note",
          "label": "Nota (opcional)",
          "info": "Menciona descuentos solo si existen de verdad en Shopify."
        }
      ]
    },
    {
      "type": "quantity_selector",
```

---

#### Isotipo en la cabecera, enlaces reales de contacto/políticas y bloque Ayuda

Haz estos cambios **después** de los anteriores (5.1–5.5).

### 5.6 `sections/header.liquid`

**Enlace del logo (isotipo + GARELON)**

**Busca** (aparece 2 veces: cámbialo en las dos):
```liquid
      <a href="{{ routes.root_url }}" class="header__heading-link link link--text focus-inset">
        {%- if settings.logo != blank -%}
```
**Sustituye por:**
```liquid
      <a
        href="{{ routes.root_url }}"
        class="header__heading-link link link--text focus-inset{% if section.settings.show_isotype %} garelon-brand-link{% endif %}"
      >
        {%- if section.settings.show_isotype -%}
          {%- render 'garelon-logo-fallback', variant: 'isotype' -%}
        {%- endif -%}
        {%- if settings.logo != blank -%}
```

**Ajuste para activar o desactivar el isotipo**

**Busca**:
```liquid
      "label": "t:sections.header.settings.logo_position.label",
      "info": "t:sections.header.settings.logo_help.content"
    },
```
**Sustituye por:**
```liquid
      "label": "t:sections.header.settings.logo_position.label",
      "info": "t:sections.header.settings.logo_help.content"
    },
    {
      "type": "checkbox",
      "id": "show_isotype",
      "label": "Mostrar el isotipo GARELON junto al logo",
      "info": "Desactívalo si el logo que subas en Configuración del tema ya incluye el isotipo.",
      "default": true
    },
```

### 5.7 `sections/footer.liquid`

**Enlaces del menú del pie (resuelve rutas de contacto y políticas)**

**Busca**:
```liquid
                            <a
                              href="{{ link.url }}"
```
**Sustituye por:**
```liquid
                            <a
                              href="{%- render 'garelon-url', url: link.url -%}"
```

**Nuevo bloque «GARELON Ayuda» (cómo se muestra)**

**Busca**:
```liquid
                  {%- when 'brand_information' -%}
```
**Sustituye por:**
```liquid
                  {%- when 'garelon_help' -%}
                    {%- comment -%} GARELON: bloque de ayuda con enlace a la página de contacto real. {%- endcomment -%}
                    <div class="footer-block__details-content garelon-help">
                      {%- if block.settings.text != blank -%}
                        <div class="rte garelon-help__text">{{ block.settings.text }}</div>
                      {%- endif -%}
                      {%- if block.settings.link_label != blank -%}
                        <a
                          href="{%- if block.settings.link != blank -%}{%- render 'garelon-url', url: block.settings.link -%}{%- else -%}{%- render 'garelon-url', type: 'contact' -%}{%- endif -%}"
                          class="link garelon-help__link"
                        >
                          <span class="garelon-help__label">{{- block.settings.link_label | escape -}}</span>
                          <span class="garelon-help__arrow" aria-hidden="true">→</span>
                        </a>
                      {%- endif -%}
                      {%- if block.settings.menu != blank -%}
                        <ul class="list-unstyled garelon-help__menu">
                          {%- for link in block.settings.menu.links -%}
                            <li>
                              <a
                                href="{%- render 'garelon-url', url: link.url -%}"
                                class="link link--text list-menu__item list-menu__item--link{% if link.active %} list-menu__item--active{% endif %}"
                              >
                                {{ link.title | escape }}
                              </a>
                            </li>
                          {%- endfor -%}
                        </ul>
                      {%- endif -%}
                    </div>
                  {%- when 'brand_information' -%}
```

**Nombre de la política de reembolsos en el pie**

**Busca**:
```liquid
                  <small class="copyright__content"
                    ><a href="{{ policy.url }}">{{ policy.title | escape }}</a></small
                  >
```
**Sustituye por:**
```liquid
                  {%- comment -%} GARELON: nombre completo de la política de reembolsos en el pie. {%- endcomment -%}
                  {%- liquid
                    assign policy_title = policy.title
                    if policy.url contains 'refund-policy'
                      assign policy_title = 'Política de devoluciones y reembolsos'
                    endif
                  -%}
                  <small class="copyright__content"
                    ><a href="{{ policy.url }}">{{ policy_title | escape }}</a></small
                  >
```

**Nuevo bloque «GARELON Ayuda» (ajustes del editor)**

**Busca**:
```liquid
    {
      "type": "brand_information",
      "name": "t:sections.footer.blocks.brand_information.name",
```
**Sustituye por:**
```liquid
    {
      "type": "garelon_help",
      "name": "GARELON Ayuda",
      "limit": 1,
      "settings": [
        {
          "type": "inline_richtext",
          "id": "heading",
          "label": "Título",
          "default": "Ayuda"
        },
        {
          "type": "richtext",
          "id": "text",
          "label": "Texto",
          "default": "<p>¿Tienes alguna duda sobre tu pedido o nuestros productos? Nuestro equipo está aquí para ayudarte.</p>"
        },
        {
          "type": "text",
          "id": "link_label",
          "label": "Texto del enlace",
          "default": "Contacta con nuestro equipo"
        },
        {
          "type": "url",
          "id": "link",
          "label": "Enlace",
          "info": "Vacío = la página de contacto (Configuración del tema → GARELON · Enlaces)."
        },
        {
          "type": "link_list",
          "id": "menu",
          "label": "Menú opcional debajo del enlace",
          "info": "Vacío = sin menú. Revisa que todos sus enlaces lleven a páginas publicadas."
        }
      ]
    },
    {
      "type": "brand_information",
      "name": "t:sections.footer.blocks.brand_information.name",
```

### 5.8 `sections/main-product.liquid`

**Pestañas desplegables: enlaces de contacto y políticas**

**Busca**:
```liquid
                        {{ block.settings.content }}
                        {{ block.settings.page.content }}
```
**Sustituye por:**
```liquid
                        {%- comment -%} GARELON: enlaces de contacto y políticas resueltos a su URL real. {%- endcomment -%}
                        {% render 'garelon-url', html: block.settings.content %}
                        {{ block.settings.page.content }}
```

### 5.9 `snippets/header-dropdown-menu.liquid`

**Enlace `link` del menú**

**Busca**:
```liquid
href="{{ link.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: link.url -%}"
```

**Enlace `childlink` del menú**

**Busca**:
```liquid
href="{{ childlink.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: childlink.url -%}"
```

**Enlace `grandchildlink` del menú**

**Busca**:
```liquid
href="{{ grandchildlink.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: grandchildlink.url -%}"
```

### 5.10 `snippets/header-drawer.liquid`

**Enlace `link` del menú**

**Busca**:
```liquid
href="{{ link.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: link.url -%}"
```

**Enlace `childlink` del menú**

**Busca**:
```liquid
href="{{ childlink.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: childlink.url -%}"
```

**Enlace `grandchildlink` del menú**

**Busca**:
```liquid
href="{{ grandchildlink.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: grandchildlink.url -%}"
```

### 5.11 `snippets/header-mega-menu.liquid`

**Enlace `link` del menú**

**Busca**:
```liquid
href="{{ link.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: link.url -%}"
```

**Enlace `childlink` del menú**

**Busca**:
```liquid
href="{{ childlink.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: childlink.url -%}"
```

**Enlace `grandchildlink` del menú**

**Busca**:
```liquid
href="{{ grandchildlink.url }}"
```
**Sustituye por:**
```liquid
href="{%- render 'garelon-url', url: grandchildlink.url -%}"
```

### 5.12 `config/settings_schema.json`

**Nuevo grupo «GARELON · Enlaces» al final**

**Busca**:
```json
        "label": "t:settings_schema.customer_accounts.settings.customer_account_menu.label"
      }
    ]
  }
]
```
**Sustituye por:**
```json
        "label": "t:settings_schema.customer_accounts.settings.customer_account_menu.label"
      }
    ]
  },
  {
    "name": "GARELON · Enlaces",
    "settings": [
      {
        "type": "paragraph",
        "content": "Las páginas y políticas se crean en el Admin de Shopify. Si no eliges nada, el tema busca la página de contacto por su identificador habitual (contacto, contact…) y usa las políticas de Configuración → Políticas."
      },
      {
        "type": "page",
        "id": "garelon_contact_page",
        "label": "Página de contacto",
        "info": "Destino de todos los enlaces de contacto del tema (pie de página, preguntas frecuentes, barra de servicio)."
      },
      {
        "type": "page",
        "id": "garelon_refund_page",
        "label": "Página de devoluciones (opcional)",
        "info": "Solo se usa si la política de reembolsos de Configuración → Políticas está vacía."
      },
      {
        "type": "page",
        "id": "garelon_shipping_page",
        "label": "Página de envíos (opcional)",
        "info": "Solo se usa si la política de envío de Configuración → Políticas está vacía."
      }
    ]
  }
]
```

---

#### Imágenes nuevas, navegación sin catálogo, cabecera móvil, barra superior y pie

Haz estos cambios **después** de los anteriores (5.1–5.12). Cada bloque «Busca» aparece una sola vez en su archivo.

### 5.13 `layout/theme.liquid` · no indexar catálogo, colecciones ni búsqueda

**Busca:**

```liquid
    <meta name="theme-color" content="{{ settings.color_schemes['scheme-1'].settings.background }}">
    <link rel="canonical" href="{{ canonical_url }}">

    {%- if settings.favicon != blank -%}
```

**Sustitúyelo por:**

```liquid
    <meta name="theme-color" content="{{ settings.color_schemes['scheme-1'].settings.background }}">
    <link rel="canonical" href="{{ canonical_url }}">
    {%- comment -%}
      GARELON: tienda de un solo producto. El catálogo, las colecciones y los resultados de
      búsqueda no se enlazan desde la navegación y no se indexan (siguen funcionando).
    {%- endcomment -%}
    {%- if request.page_type == 'collection' or request.page_type == 'list-collections' or request.page_type == 'search' -%}
      <meta name="robots" content="noindex, follow">
    {%- endif -%}

    {%- if settings.favicon != blank -%}
```

### 5.14 `sections/header.liquid` · navegación GARELON, ajustes del menú y script que cierra el menú móvil

**Busca (1 de 4):**

```liquid

<script src="{{ 'cart-notification.js' | asset_url }}" defer="defer"></script>

{%- liquid
```

**Sustitúyelo por:**

```liquid

<script src="{{ 'cart-notification.js' | asset_url }}" defer="defer"></script>
<script src="{{ 'garelon-nav.js' | asset_url }}" defer="defer"></script>

{%- liquid
```

**Busca (2 de 4):**

```liquid
      assign language_selector = true
    endif
  -%}
  <header class="header header--{{ section.settings.logo_position }} header--mobile-{{ section.settings.mobile_logo_position }} page-width{% if section.settings.menu_type_desktop == 'drawer' %} drawer-menu{% endif %}{% if section.settings.menu != blank %} header--has-menu{% endif %}{% if has_app_block %} header--has-app{% endif %}{% if social_links %} header--has-social{% endif %}{% if shop.customer_accounts_enabled %} header--has-account{% endif %}{% if country_selector or language_selector %} header--has-localizations{% endif %}">
    {%- liquid
      assign render_search_left = false
      if section.settings.logo_position == 'top-center' or section.settings.menu == blank or shop.customer_accounts_enabled
        assign render_search_left = true
      endif

      if section.settings.menu != blank
        render 'header-drawer', show_country_selector: country_selector, show_language_selector: language_selector, show_social_links: social_links
      endif
```

**Sustitúyelo por:**

```liquid
      assign language_selector = true
    endif

    # GARELON: la navegación GARELON (Inicio, secciones de la home y Contacto) no depende de un menú del Admin.
    assign has_nav = false
    if section.settings.menu != blank or section.settings.nav_source == 'garelon'
      assign has_nav = true
    endif
  -%}
  <header class="header header--{{ section.settings.logo_position }} header--mobile-{{ section.settings.mobile_logo_position }} page-width{% if section.settings.menu_type_desktop == 'drawer' %} drawer-menu{% endif %}{% if has_nav %} header--has-menu{% endif %}{% if has_app_block %} header--has-app{% endif %}{% if social_links %} header--has-social{% endif %}{% if shop.customer_accounts_enabled %} header--has-account{% endif %}{% if country_selector or language_selector %} header--has-localizations{% endif %}">
    {%- liquid
      assign render_search_left = false
      if section.settings.logo_position == 'top-center' or has_nav == false or shop.customer_accounts_enabled
        assign render_search_left = true
      endif

      if has_nav
        render 'header-drawer', show_country_selector: country_selector, show_language_selector: language_selector, show_social_links: social_links
      endif
```

**Busca (3 de 4):**

```liquid

    {%- liquid
      if section.settings.menu != blank
        if section.settings.menu_type_desktop == 'dropdown'
          render 'header-dropdown-menu'
        elsif section.settings.menu_type_desktop != 'drawer'
          render 'header-mega-menu'
        endif
```

**Sustitúyelo por:**

```liquid

    {%- liquid
      if has_nav and section.settings.menu_type_desktop != 'drawer'
        if section.settings.nav_source == 'garelon'
          render 'garelon-nav', variant: 'inline'
        elsif section.settings.menu_type_desktop == 'dropdown'
          render 'header-dropdown-menu'
        else
          render 'header-mega-menu'
        endif
```

**Busca (4 de 4):**

```liquid
    {
      "type": "select",
      "id": "menu_type_desktop",
      "options": [
```

**Sustitúyelo por:**

```liquid
    {
      "type": "select",
      "id": "nav_source",
      "label": "Navegación (GARELON)",
      "options": [
        { "value": "garelon", "label": "GARELON: Inicio, secciones de la home y Contacto" },
        { "value": "shopify", "label": "El menú de Shopify elegido arriba" }
      ],
      "default": "garelon",
      "info": "GARELON no necesita configurar menús en el Admin y nunca enlaza al catálogo. Contacto usa tu página de contacto real."
    },
    {
      "type": "checkbox",
      "id": "nav_show_how",
      "label": "Navegación GARELON: «Cómo usarlo» (/#como-usarlo)",
      "info": "Desactivado por defecto: la portada ya tiene el botón «Cómo se usa» y con 5 enlaces el menú de escritorio no cabe en una línea entre 990 y 1199 px.",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "nav_show_ingredients",
      "label": "Navegación GARELON: «Ingredientes» (/#ingredientes)",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "nav_show_faq",
      "label": "Navegación GARELON: «Preguntas frecuentes» (/#preguntas-frecuentes)",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "hide_catalog_links",
      "label": "Menú de Shopify: ocultar enlaces al catálogo y a colecciones",
      "info": "Solo afecta a la cabecera y al menú móvil. Las colecciones siguen existiendo en Shopify.",
      "default": true
    },
    {
      "type": "select",
      "id": "menu_type_desktop",
      "options": [
```

### 5.15 `sections/announcement-bar.liquid` · bandera de España al final del anuncio

**Busca (1 de 3):**

```liquid
          {%- endif -%}
          <p class="announcement-bar__message h5">
            <span>{{ section.blocks.first.settings.text | escape }}</span>
            {%- if section.blocks.first.settings.link != blank -%}
              {{- 'icon-arrow.svg' | inline_asset_content -}}
```

**Sustitúyelo por:**

```liquid
          {%- endif -%}
          <p class="announcement-bar__message h5">
            <span>
              {{- section.blocks.first.settings.text | escape -}}
              {%- if section.blocks.first.settings.show_flag_es %} {% render 'garelon-flag-es' %}{% endif -%}
            </span>
            {%- if section.blocks.first.settings.link != blank -%}
              {{- 'icon-arrow.svg' | inline_asset_content -}}
```

**Busca (2 de 3):**

```liquid
                    {%- endif -%}
                    <p class="announcement-bar__message h5">
                      <span>{{ block.settings.text | escape }}</span>
                      {%- if block.settings.link != blank -%}
                        {{- 'icon-arrow.svg' | inline_asset_content -}}
```

**Sustitúyelo por:**

```liquid
                    {%- endif -%}
                    <p class="announcement-bar__message h5">
                      <span>
                        {{- block.settings.text | escape -}}
                        {%- if block.settings.show_flag_es %} {% render 'garelon-flag-es' %}{% endif -%}
                      </span>
                      {%- if block.settings.link != blank -%}
                        {{- 'icon-arrow.svg' | inline_asset_content -}}
```

**Busca (3 de 3):**

```liquid
          "id": "link",
          "label": "t:sections.announcement-bar.blocks.announcement.settings.link.label"
        }
      ]
```

**Sustitúyelo por:**

```liquid
          "id": "link",
          "label": "t:sections.announcement-bar.blocks.announcement.settings.link.label"
        },
        {
          "type": "checkbox",
          "id": "show_flag_es",
          "label": "Mostrar la bandera de España al final del texto",
          "default": false
        }
      ]
```

### 5.16 `sections/featured-product.liquid` · galería GARELON, ancla #comprar y bloque de stock

**Busca (1 de 6):**

```liquid
    <product-component view-event-payload="{{ product | standard_event_data: 'view' | escape }}">
  {%- endunless -%}
  <section class="color-{{ section.settings.color_scheme }} {% if section.settings.secondary_background %}background-secondary{% else %}gradient{% endif %}">
    <div class="page-width section-{{ section.id }}-padding{% if section.settings.secondary_background %} isolate{% endif %}">
      <div class="featured-product product product--{{ section.settings.media_size }} grid grid--1-col gradient color-{{ section.settings.color_scheme }} product--{{ section.settings.media_position }}{% if section.settings.secondary_background == false %} isolate{% endif %} {% if product.media.size > 0 or product == blank %}grid--2-col-tablet{% else %}product--no-media{% endif %}">
        <div class="grid__item product__media-wrapper">
          {%- unless placeholder -%}
            {% render 'product-media-gallery', product: product, variant_images: variant_images, limit: 1 %}
          {%- else -%}
```

**Sustitúyelo por:**

```liquid
    <product-component view-event-payload="{{ product | standard_event_data: 'view' | escape }}">
  {%- endunless -%}
  <section
    {% if section.settings.garelon_anchor != blank %}
      id="{{ section.settings.garelon_anchor | handleize }}"
    {% endif %}
    class="g-anchor color-{{ section.settings.color_scheme }} {% if section.settings.secondary_background %}background-secondary{% else %}gradient{% endif %}"
  >
    <div class="page-width section-{{ section.id }}-padding{% if section.settings.secondary_background %} isolate{% endif %}">
      <div class="featured-product product product--{{ section.settings.media_size }} grid grid--1-col gradient color-{{ section.settings.color_scheme }} product--{{ section.settings.media_position }}{% if section.settings.secondary_background == false %} isolate{% endif %} {% if product.media.size > 0 or product == blank or section.settings.garelon_gallery %}grid--2-col-tablet{% else %}product--no-media{% endif %}">
        <div class="grid__item product__media-wrapper">
          {%- if section.settings.garelon_gallery -%}
            {%- render 'garelon-gallery', section_id: section.id -%}
          {%- elsif placeholder != true -%}
            {% render 'product-media-gallery', product: product, variant_images: variant_images, limit: 1 %}
          {%- else -%}
```

**Busca (2 de 6):**

```liquid
              </div>
            </div>
          {%- endunless -%}
        </div>
        <div class="product__info-wrapper grid__item{% if settings.animations_reveal_on_scroll %} scroll-trigger animate--slide-in{% endif %}">
```

**Sustitúyelo por:**

```liquid
              </div>
            </div>
          {%- endif -%}
        </div>
        <div class="product__info-wrapper grid__item{% if settings.animations_reveal_on_scroll %} scroll-trigger animate--slide-in{% endif %}">
```

**Busca (3 de 6):**

```liquid
                    {{- block.settings.text -}}
                  </p>
                {%- when 'title' -%}
                  <h2 class="product__title {{ block.settings.heading_size }}" {{ block.shopify_attributes }}>
```

**Sustitúyelo por:**

```liquid
                    {{- block.settings.text -}}
                  </p>
                {%- when 'garelon_stock' -%}
                  {%- render 'garelon-stock',
                    variant: product.selected_or_first_available_variant,
                    section_id: section.id,
                    block: block
                  -%}
                {%- when 'title' -%}
                  <h2 class="product__title {{ block.settings.heading_size }}" {{ block.shopify_attributes }}>
```

**Busca (4 de 6):**

```liquid
        </div>
      </div>
      {% render 'product-media-modal', product: product, variant_images: variant_images %}
    </div>
  </section>
```

**Sustitúyelo por:**

```liquid
        </div>
      </div>
      {%- unless section.settings.garelon_gallery -%}
        {% render 'product-media-modal', product: product, variant_images: variant_images %}
      {%- endunless -%}
    </div>
  </section>
```

**Busca (5 de 6):**

```liquid
          "label": "t:sections.featured-product.blocks.share.settings.text.label",
          "default": "t:sections.featured-product.blocks.share.settings.text.default"
        }
      ]
```

**Sustitúyelo por:**

```liquid
          "label": "t:sections.featured-product.blocks.share.settings.text.label",
          "default": "t:sections.featured-product.blocks.share.settings.text.default"
        }
      ]
    },
    {
      "type": "garelon_stock",
      "name": "GARELON Stock",
      "limit": 1,
      "settings": [
        {
          "type": "paragraph",
          "content": "Muestra «En stock» o «Agotado» solo si Shopify controla el inventario de la variante. Nunca muestra el número de unidades."
        }
      ]
```

**Busca (6 de 6):**

```liquid
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
```

**Sustitúyelo por:**

```liquid
    },
    {
      "type": "checkbox",
      "id": "garelon_gallery",
      "label": "Galería GARELON (imágenes del tema)",
      "info": "Muestra IMAGEN 1, 10, 7, 5, 4 y 9 en carrusel. Desactívalo para mostrar la multimedia del producto de Shopify (también si tu producto tiene variantes con imagen propia).",
      "default": false
    },
    {
      "type": "text",
      "id": "garelon_anchor",
      "label": "ID de ancla (GARELON)",
      "info": "Permite enlazar a esta sección. Con «comprar», los botones de la portada llevan aquí (/#comprar)."
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
```

### 5.17 `sections/footer.liquid` · enlaces legales en orden fijo y texto de Ayuda

**Busca (1 de 2):**

```liquid
        <small class="copyright__content">{{ powered_by_link }}</small>
        {%- if section.settings.show_policy -%}
          <ul class="policies list-unstyled">
            {%- for policy in shop.policies -%}
              {%- if policy != blank -%}
                <li>
                  {%- comment -%} GARELON: nombre completo de la política de reembolsos en el pie. {%- endcomment -%}
                  {%- liquid
                    assign policy_title = policy.title
                    if policy.url contains 'refund-policy'
                      assign policy_title = 'Política de devoluciones y reembolsos'
                    endif
                  -%}
                  <small class="copyright__content"
                    ><a href="{{ policy.url }}">{{ policy_title | escape }}</a></small
                  >
                </li>
              {%- endif -%}
```

**Sustitúyelo por:**

```liquid
        <small class="copyright__content">{{ powered_by_link }}</small>
        {%- if section.settings.show_policy -%}
          {%- comment -%}
            GARELON: enlaces legales en un orden fijo y con nombres completos. Solo aparecen
            las políticas que tienen contenido en el Admin (ningún enlace vacío). Contacto y
            cookies son páginas; el resto, políticas de Shopify.
          {%- endcomment -%}
          {%- liquid
            capture contact_url
              render 'garelon-url', type: 'contact'
            endcapture
            capture cookies_url
              render 'garelon-url', type: 'cookies'
            endcapture
            assign contact_url = contact_url | strip
            assign cookies_url = cookies_url | strip
            assign policy_order = 'shipping-policy,refund-policy,privacy-policy,cookies,terms-of-service,legal-notice' | split: ','
          -%}
          <ul class="policies list-unstyled">
            <li>
              <small class="copyright__content"><a href="{{ contact_url }}">Contacto</a></small>
            </li>
            {%- for key in policy_order -%}
              {%- if key == 'cookies' -%}
                {%- if cookies_url != blank -%}
                  <li>
                    <small class="copyright__content"><a href="{{ cookies_url }}">Política de cookies</a></small>
                  </li>
                {%- endif -%}
              {%- else -%}
                {%- for policy in shop.policies -%}
                  {%- if policy != blank and policy.url contains key -%}
                    {%- liquid
                      case key
                        when 'shipping-policy'
                          assign policy_title = 'Política de envíos'
                        when 'refund-policy'
                          assign policy_title = 'Política de devoluciones y reembolsos'
                        when 'terms-of-service'
                          assign policy_title = 'Términos y condiciones'
                        else
                          assign policy_title = policy.title
                      endcase
                    -%}
                    <li>
                      <small class="copyright__content"><a href="{{ policy.url }}">{{ policy_title | escape }}</a></small>
                    </li>
                  {%- endif -%}
                {%- endfor -%}
              {%- endif -%}
            {%- endfor -%}
            {%- for policy in shop.policies -%}
              {%- liquid
                assign listed = false
                for key in policy_order
                  if policy.url contains key
                    assign listed = true
                  endif
                endfor
              -%}
              {%- if policy != blank and listed == false -%}
                <li>
                  <small class="copyright__content"><a href="{{ policy.url }}">{{ policy.title | escape }}</a></small>
                </li>
              {%- endif -%}
```

**Busca (2 de 2):**

```liquid
          "id": "text",
          "label": "Texto",
          "default": "<p>¿Tienes alguna duda sobre tu pedido o nuestros productos? Nuestro equipo está aquí para ayudarte.</p>"
        },
        {
```

**Sustitúyelo por:**

```liquid
          "id": "text",
          "label": "Texto",
          "default": "<p>¿Necesitas ayuda? Estamos aquí para resolver cualquier duda sobre tu pedido, nuestros productos o el proceso de compra.</p>"
        },
        {
```

### 5.18 `sections/main-404.liquid` · «Seguir comprando» lleva al inicio

**Busca:**

```liquid
    {{ 'templates.404.title' | t }}
  </h1>
  <a href="{{ routes.all_products_collection_url }}" class="button">
    {{ 'general.continue_shopping' | t }}
  </a>
```

**Sustitúyelo por:**

```liquid
    {{ 'templates.404.title' | t }}
  </h1>
  <a href="{{ routes.root_url }}" class="button">
    {{ 'general.continue_shopping' | t }}
  </a>
```

### 5.19 `sections/main-cart-items.liquid` · «Seguir comprando» lleva al inicio (2 enlaces)

**Busca (1 de 2):**

```liquid
    <div class="title-wrapper-with-link">
      <h1 class="title title--primary">{{ 'sections.cart.title' | t }}</h1>
      <a href="{{ routes.all_products_collection_url }}" class="underlined-link">
        {{- 'general.continue_shopping' | t -}}
      </a>
```

**Sustitúyelo por:**

```liquid
    <div class="title-wrapper-with-link">
      <h1 class="title title--primary">{{ 'sections.cart.title' | t }}</h1>
      <a href="{{ routes.root_url }}" class="underlined-link">
        {{- 'general.continue_shopping' | t -}}
      </a>
```

**Busca (2 de 2):**

```liquid
    <div class="cart__warnings">
      <h1 class="cart__empty-text">{{ 'sections.cart.empty' | t }}</h1>
      <a href="{{ routes.all_products_collection_url }}" class="button">
        {{ 'general.continue_shopping' | t }}
      </a>
```

**Sustitúyelo por:**

```liquid
    <div class="cart__warnings">
      <h1 class="cart__empty-text">{{ 'sections.cart.empty' | t }}</h1>
      <a href="{{ routes.root_url }}" class="button">
        {{ 'general.continue_shopping' | t }}
      </a>
```

### 5.20 `snippets/header-drawer.liquid` · navegación GARELON, sin catálogo, y búsqueda/cuenta dentro del menú móvil

**Busca (1 de 4):**

```liquid
          <nav class="menu-drawer__navigation">
            <ul class="menu-drawer__menu has-submenu list-menu" role="list">
              {%- for link in section.settings.menu.links -%}
                <li>
                  {%- if link.links != blank -%}
```

**Sustitúyelo por:**

```liquid
          <nav class="menu-drawer__navigation">
            <ul class="menu-drawer__menu has-submenu list-menu" role="list">
              {%- if section.settings.nav_source == 'garelon' -%}
                {%- render 'garelon-nav', variant: 'drawer' -%}
              {%- else -%}
              {%- for link in section.settings.menu.links -%}
                {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                {%- if section.settings.hide_catalog_links -%}
                  {%- if link.type == 'catalog_link' or link.type == 'collections_link' or link.type == 'collection_link' or link.url contains '/collections' -%}
                    {%- continue -%}
                  {%- endif -%}
                {%- endif -%}
                <li>
                  {%- if link.links != blank -%}
```

**Busca (2 de 4):**

```liquid
                          <ul class="menu-drawer__menu list-menu" role="list" tabindex="-1">
                            {%- for childlink in link.links -%}
                              <li>
                                {%- if childlink.links == blank -%}
```

**Sustitúyelo por:**

```liquid
                          <ul class="menu-drawer__menu list-menu" role="list" tabindex="-1">
                            {%- for childlink in link.links -%}
                              {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                              {%- if section.settings.hide_catalog_links -%}
                                {%- if childlink.type == 'catalog_link' or childlink.type == 'collections_link' or childlink.type == 'collection_link' or childlink.url contains '/collections' -%}
                                  {%- continue -%}
                                {%- endif -%}
                              {%- endif -%}
                              <li>
                                {%- if childlink.links == blank -%}
```

**Busca (3 de 4):**

```liquid
                                      >
                                        {%- for grandchildlink in childlink.links -%}
                                          <li>
                                            <a
```

**Sustitúyelo por:**

```liquid
                                      >
                                        {%- for grandchildlink in childlink.links -%}
                                          {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                                          {%- if section.settings.hide_catalog_links -%}
                                            {%- if grandchildlink.type == 'catalog_link' or grandchildlink.type == 'collections_link' or grandchildlink.type == 'collection_link' or grandchildlink.url contains '/collections' -%}
                                              {%- continue -%}
                                            {%- endif -%}
                                          {%- endif -%}
                                          <li>
                                            <a
```

**Busca (4 de 4):**

```liquid
                </li>
              {%- endfor -%}
            </ul>
          </nav>
          <div class="menu-drawer__utility-links">
            {%- if show_country_selector or show_language_selector -%}
              <div class="menu-drawer__localization header-localization">
```

**Sustitúyelo por:**

```liquid
                </li>
              {%- endfor -%}
              {%- endif -%}
            </ul>
          </nav>
          <div class="menu-drawer__utility-links">
            {%- comment -%}
              GARELON: en móvil la búsqueda y la cuenta salen de la barra de la cabecera
              para que no se monten sobre el logo; aquí siguen disponibles.
            {%- endcomment -%}
            <ul class="garelon-drawer-utility list-unstyled" role="list">
              <li>
                <a href="{{ routes.search_url }}" class="garelon-drawer-utility__link link link--text focus-inset">
                  <span class="svg-wrapper" aria-hidden="true">{{- 'icon-search.svg' | inline_asset_content -}}</span>
                  {{- 'general.search.search' | t -}}
                </a>
              </li>
              {%- if shop.customer_accounts_enabled -%}
                <li>
                  <a href="{{ routes.account_url }}" class="garelon-drawer-utility__link link link--text focus-inset">
                    <span class="svg-wrapper" aria-hidden="true">{{- 'icon-account.svg' | inline_asset_content -}}</span>
                    {%- if customer -%}
                      {{- 'customer.account.title' | t -}}
                    {%- else -%}
                      {{- 'customer.log_in' | t -}}
                    {%- endif -%}
                  </a>
                </li>
              {%- endif -%}
            </ul>
            {%- if show_country_selector or show_language_selector -%}
              <div class="menu-drawer__localization header-localization">
```

### 5.21 `snippets/header-dropdown-menu.liquid` · sin enlaces al catálogo ni a colecciones

**Busca (1 de 3):**

```liquid
  <ul class="list-menu list-menu--inline" role="list">
    {%- for link in section.settings.menu.links -%}
      <li>
        {%- if link.links != blank -%}
```

**Sustitúyelo por:**

```liquid
  <ul class="list-menu list-menu--inline" role="list">
    {%- for link in section.settings.menu.links -%}
      {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
      {%- if section.settings.hide_catalog_links -%}
        {%- if link.type == 'catalog_link' or link.type == 'collections_link' or link.type == 'collection_link' or link.url contains '/collections' -%}
          {%- continue -%}
        {%- endif -%}
      {%- endif -%}
      <li>
        {%- if link.links != blank -%}
```

**Busca (2 de 3):**

```liquid
              >
                {%- for childlink in link.links -%}
                  <li>
                    {%- if childlink.links == blank -%}
```

**Sustitúyelo por:**

```liquid
              >
                {%- for childlink in link.links -%}
                  {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                  {%- if section.settings.hide_catalog_links -%}
                    {%- if childlink.type == 'catalog_link' or childlink.type == 'collections_link' or childlink.type == 'collection_link' or childlink.url contains '/collections' -%}
                      {%- continue -%}
                    {%- endif -%}
                  {%- endif -%}
                  <li>
                    {%- if childlink.links == blank -%}
```

**Busca (3 de 3):**

```liquid
                        >
                          {%- for grandchildlink in childlink.links -%}
                            <li>
                              <a
```

**Sustitúyelo por:**

```liquid
                        >
                          {%- for grandchildlink in childlink.links -%}
                            {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                            {%- if section.settings.hide_catalog_links -%}
                              {%- if grandchildlink.type == 'catalog_link' or grandchildlink.type == 'collections_link' or grandchildlink.type == 'collection_link' or grandchildlink.url contains '/collections' -%}
                                {%- continue -%}
                              {%- endif -%}
                            {%- endif -%}
                            <li>
                              <a
```

### 5.22 `snippets/header-mega-menu.liquid` · sin enlaces al catálogo ni a colecciones

**Busca (1 de 3):**

```liquid
  <ul class="list-menu list-menu--inline" role="list">
    {%- for link in section.settings.menu.links -%}
      <li>
        {%- if link.links != blank -%}
```

**Sustitúyelo por:**

```liquid
  <ul class="list-menu list-menu--inline" role="list">
    {%- for link in section.settings.menu.links -%}
      {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
      {%- if section.settings.hide_catalog_links -%}
        {%- if link.type == 'catalog_link' or link.type == 'collections_link' or link.type == 'collection_link' or link.url contains '/collections' -%}
          {%- continue -%}
        {%- endif -%}
      {%- endif -%}
      <li>
        {%- if link.links != blank -%}
```

**Busca (2 de 3):**

```liquid
                >
                  {%- for childlink in link.links -%}
                    <li>
                      <a
```

**Sustitúyelo por:**

```liquid
                >
                  {%- for childlink in link.links -%}
                    {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                    {%- if section.settings.hide_catalog_links -%}
                      {%- if childlink.type == 'catalog_link' or childlink.type == 'collections_link' or childlink.type == 'collection_link' or childlink.url contains '/collections' -%}
                        {%- continue -%}
                      {%- endif -%}
                    {%- endif -%}
                    <li>
                      <a
```

**Busca (3 de 3):**

```liquid
                        <ul class="list-unstyled" role="list">
                          {%- for grandchildlink in childlink.links -%}
                            <li>
                              <a
```

**Sustitúyelo por:**

```liquid
                        <ul class="list-unstyled" role="list">
                          {%- for grandchildlink in childlink.links -%}
                            {%- comment -%} GARELON: sin enlaces al catálogo ni a colecciones en la navegación pública {%- endcomment -%}
                            {%- if section.settings.hide_catalog_links -%}
                              {%- if grandchildlink.type == 'catalog_link' or grandchildlink.type == 'collections_link' or grandchildlink.type == 'collection_link' or grandchildlink.url contains '/collections' -%}
                                {%- continue -%}
                              {%- endif -%}
                            {%- endif -%}
                            <li>
                              <a
```

### 5.23 `snippets/cart-drawer.liquid` · «Seguir comprando» lleva al inicio

**Busca:**

```liquid
                </span>
              </button>
              <a href="{{ routes.all_products_collection_url }}" class="button">
                {{ 'general.continue_shopping' | t }}
              </a>
```

**Sustitúyelo por:**

```liquid
                </span>
              </button>
              <a href="{{ routes.root_url }}" class="button">
                {{ 'general.continue_shopping' | t }}
              </a>
```

### 5.24 `config/settings_schema.json` · selector de la página de política de cookies

**Busca:**

```json
        "label": "Página de envíos (opcional)",
        "info": "Solo se usa si la política de envío de Configuración → Políticas está vacía."
      }
    ]
```

**Sustitúyelo por:**

```json
        "label": "Página de envíos (opcional)",
        "info": "Solo se usa si la política de envío de Configuración → Políticas está vacía."
      },
      {
        "type": "page",
        "id": "garelon_cookies_page",
        "label": "Página de política de cookies",
        "info": "Shopify no tiene una política de cookies propia: créala como página. Si no eliges ninguna, el tema busca una página con identificador politica-de-cookies, cookies o politica-cookies; si no existe, el pie no muestra el enlace."
      }
    ]
```

---

## Paso 6 · Plantillas (templates)

Para las que ya existen, abre el archivo, **selecciona todo, bórralo y pega**.
Para `page.faq.json`: **Templates → Añadir una nueva plantilla → tipo "page" → JSON → nombre `faq`**, y pega.

### `templates/index.json`

```json
{
  "sections": {
    "hero": {
      "type": "garelon-hero",
      "blocks": {
        "p-roller": {
          "type": "point",
          "settings": {
            "icon": "roller",
            "text": "Aplicador roller"
          }
        },
        "p-10ml": {
          "type": "point",
          "settings": {
            "icon": "bottle",
            "text": "10 ml"
          }
        },
        "p-rutina": {
          "type": "point",
          "settings": {
            "icon": "steps",
            "text": "Rutina sencilla"
          }
        }
      },
      "block_order": [
        "p-roller",
        "p-10ml",
        "p-rutina"
      ],
      "settings": {
        "image_position": "right",
        "mobile_image_first": true,
        "eyebrow": "GARELON",
        "heading": "Una mirada con aspecto más descansado",
        "use_h1": true,
        "text": "<p>Sérum para el contorno de ojos con aceite de ricino y aplicador roller, diseñado para aportar hidratación y complementar tu rutina diaria de cuidado.</p>",
        "show_price": true,
        "button_label": "Comprar el sérum",
        "button2_label": "Cómo se usa",
        "button2_link": "/#como-usarlo",
        "color_scheme": "scheme-1",
        "anchor": "inicio",
        "padding_top": 24,
        "padding_bottom": 32
      }
    },
    "trust": {
      "type": "garelon-trust-bar",
      "blocks": {
        "t-1": {
          "type": "item",
          "settings": {
            "icon": "eye",
            "title": "Aplicación precisa",
            "text": ""
          }
        },
        "t-2": {
          "type": "item",
          "settings": {
            "icon": "roller",
            "title": "Roller metálico",
            "text": ""
          }
        },
        "t-3": {
          "type": "item",
          "settings": {
            "icon": "steps",
            "title": "Rutina en 3 pasos",
            "text": ""
          }
        },
        "t-4": {
          "type": "item",
          "settings": {
            "icon": "leaf",
            "title": "Fórmula con aceite de ricino",
            "text": ""
          }
        }
      },
      "block_order": [
        "t-1",
        "t-2",
        "t-3",
        "t-4"
      ],
      "settings": {
        "heading": "Características",
        "show_borders": true,
        "color_scheme": "scheme-1",
        "anchor": "",
        "padding_top": 0,
        "padding_bottom": 8
      }
    },
    "benefits": {
      "type": "garelon-benefits",
      "blocks": {
        "ojeras": {
          "type": "benefit",
          "settings": {
            "icon": "eye-under",
            "title": "Ojeras",
            "text": "Contribuye a mejorar la apariencia de la zona oscura del contorno."
          }
        },
        "bolsas": {
          "type": "benefit",
          "settings": {
            "icon": "eye",
            "title": "Bolsas",
            "text": "El masaje con roller complementa una rutina orientada a una mirada más descansada."
          }
        },
        "lineas": {
          "type": "benefit",
          "settings": {
            "icon": "lines",
            "title": "Líneas finas",
            "text": "La hidratación ayuda a mantener una apariencia más suave."
          }
        },
        "hidratacion": {
          "type": "benefit",
          "settings": {
            "icon": "drop",
            "title": "Hidratación",
            "text": "Aporta cuidado e hidratación a la zona del contorno."
          }
        }
      },
      "block_order": [
        "ojeras",
        "bolsas",
        "lineas",
        "hidratacion"
      ],
      "settings": {
        "eyebrow": "Beneficios",
        "heading": "Cuida una de las zonas más delicadas de tu rostro",
        "text": "<p>La piel del contorno de ojos es más fina y puede mostrar signos de cansancio, sequedad, bolsas y líneas finas. Dedicarle un momento cada día es un gesto sencillo dentro de tu rutina.</p>",
        "note": "",
        "alignment": "center",
        "color_scheme": "scheme-2",
        "anchor": "beneficios",
        "padding_top": 56,
        "padding_bottom": 56
      }
    },
    "roller": {
      "type": "garelon-image-text",
      "settings": {
        "fallback_image": "img07-roller",
        "image_shape": "rounded",
        "image_position": "right",
        "show_massage_lines": false,
        "eyebrow": "Aplicador roller",
        "heading": "El ritual comienza con el roller",
        "text": "<p>Deslízalo suavemente por el contorno de ojos, la zona donde suelen notarse las bolsas y las ojeras, para distribuir el sérum mientras realizas un masaje ligero.</p><p>Bola metálica para una aplicación precisa y cómoda.</p>",
        "button_label": "",
        "button_secondary": false,
        "color_scheme": "scheme-2",
        "anchor": "roller",
        "padding_top": 56,
        "padding_bottom": 56
      }
    },
    "ingredients": {
      "type": "garelon-ingredients",
      "blocks": {
        "ricino": {
          "type": "ingredient",
          "settings": {
            "name": "Aceite de ricino",
            "inci": "Ricinus Communis (Castor) Seed Oil",
            "text": "Aceite vegetal obtenido de las semillas de ricino."
          }
        },
        "tripeptido": {
          "type": "ingredient",
          "settings": {
            "name": "Acetyl Tripeptide-1",
            "inci": "",
            "text": "Péptido de uso cosmético."
          }
        },
        "colageno": {
          "type": "ingredient",
          "settings": {
            "name": "Colágeno",
            "inci": "Collagen",
            "text": "Proteína de uso habitual en el cuidado de la piel."
          }
        },
        "boswellia": {
          "type": "ingredient",
          "settings": {
            "name": "Extracto de Boswellia Serrata",
            "inci": "Boswellia Serrata Extract",
            "text": "Extracto vegetal procedente de la resina del árbol Boswellia serrata."
          }
        },
        "agua": {
          "type": "ingredient",
          "settings": {
            "name": "Agua",
            "inci": "Aqua",
            "text": ""
          }
        }
      },
      "block_order": [
        "ricino",
        "tripeptido",
        "colageno",
        "boswellia",
        "agua"
      ],
      "settings": {
        "eyebrow": "Ingredientes",
        "heading": "Una fórmula sencilla para tu rutina",
        "text": "",
        "show_note": true,
        "note": "Ingredientes según la información facilitada por el proveedor. Consulta siempre el envase del producto.",
        "color_scheme": "scheme-1",
        "anchor": "ingredientes",
        "padding_top": 56,
        "padding_bottom": 56,
        "fallback_image": "img05-ingredientes"
      }
    },
    "how_to": {
      "type": "garelon-how-to-use",
      "blocks": {
        "paso-1": {
          "type": "step",
          "settings": {
            "label": "01",
            "title": "Limpia",
            "text": "Limpia y seca bien el rostro y el contorno de ojos."
          }
        },
        "paso-2": {
          "type": "step",
          "settings": {
            "label": "02",
            "title": "Aplica",
            "text": "Presiona y desliza suavemente el roller para que salga el sérum y distribúyelo por el contorno."
          }
        },
        "paso-3": {
          "type": "step",
          "settings": {
            "label": "03",
            "title": "Masajea",
            "text": "Masajea con suavidad con la bola metálica para favorecer la distribución del sérum."
          }
        }
      },
      "block_order": [
        "paso-1",
        "paso-2",
        "paso-3"
      ],
      "settings": {
        "eyebrow": "Cómo usarlo",
        "heading": "3 pasos. Menos de un minuto.",
        "show_images": false,
        "note": "Solo para uso externo. Evita el contacto directo con los ojos. Si notas cualquier molestia, interrumpe su uso.",
        "color_scheme": "scheme-2",
        "anchor": "como-usarlo",
        "padding_top": 56,
        "padding_bottom": 56,
        "fallback_image": "img04-uso"
      }
    },
    "product_cta": {
      "type": "featured-product",
      "blocks": {
        "eyebrow": {
          "type": "text",
          "settings": {
            "text": "El sérum",
            "text_style": "uppercase"
          }
        },
        "title": {
          "type": "title",
          "settings": {
            "heading_size": "h2"
          }
        },
        "price": {
          "type": "price",
          "settings": {}
        },
        "subtitle": {
          "type": "text",
          "settings": {
            "text": "Sérum para el contorno de ojos con aceite de ricino y aplicador roller metálico.",
            "text_style": "subtitle"
          }
        },
        "variant_picker": {
          "type": "variant_picker",
          "settings": {
            "picker_type": "button",
            "swatch_shape": "circle"
          }
        },
        "quantity_selector": {
          "type": "quantity_selector",
          "settings": {}
        },
        "buy_buttons": {
          "type": "buy_buttons",
          "settings": {
            "show_dynamic_checkout": true,
            "show_gift_card_recipient": false
          }
        },
        "stock": {
          "type": "garelon_stock",
          "settings": {}
        }
      },
      "block_order": [
        "eyebrow",
        "title",
        "price",
        "subtitle",
        "variant_picker",
        "quantity_selector",
        "buy_buttons",
        "stock"
      ],
      "settings": {
        "color_scheme": "scheme-1",
        "secondary_background": false,
        "media_size": "medium",
        "constrain_to_viewport": true,
        "media_fit": "contain",
        "media_position": "left",
        "image_zoom": "lightbox",
        "hide_variants": true,
        "enable_video_looping": false,
        "padding_top": 56,
        "padding_bottom": 56,
        "garelon_gallery": true,
        "garelon_anchor": "comprar"
      }
    },
    "faq": {
      "type": "garelon-faq",
      "blocks": {
        "q-que-es": {
          "type": "question",
          "settings": {
            "question": "¿Qué es el sérum de contorno de ojos de GARELON?",
            "answer": "<p>Es un sérum para el contorno de ojos con aceite de ricino y aplicador roller metálico, en un frasco de vidrio ámbar de 10 ml. GARELON es la tienda desde la que lo comercializamos: el producto procede de un fabricante externo, por lo que en el frasco y en la caja verás la marca original del fabricante.</p>"
          }
        },
        "q-como": {
          "type": "question",
          "settings": {
            "question": "¿Cómo se utiliza?",
            "answer": "<p>1. Limpia y seca bien el rostro y el contorno de ojos.<br>2. Desliza suavemente el roller por la zona del contorno para que salga el producto.<br>3. Masajea con movimientos suaves usando la bola metálica hasta distribuir el sérum.</p>"
          }
        },
        "q-frecuencia": {
          "type": "question",
          "settings": {
            "question": "¿Con qué frecuencia puedo incorporarlo a mi rutina?",
            "answer": "<p>Está pensado para formar parte de tu rutina diaria de cuidado. Aplícalo siempre sobre la piel limpia y seca y sigue las indicaciones del envase. Si notas cualquier molestia, interrumpe su uso.</p>"
          }
        },
        "q-cantidad": {
          "type": "question",
          "settings": {
            "question": "¿Cuánto producto contiene y qué tamaño tiene?",
            "answer": "<p>Cada frasco contiene 10 ml (0.34 fl oz). La caja mide 8,7 cm de alto, 2,2 cm de ancho y 2,2 cm de fondo, y el frasco, aproximadamente 8,4 cm de alto y 1,9 cm de ancho.</p>"
          }
        },
        "q-donde": {
          "type": "question",
          "settings": {
            "question": "¿Dónde debo aplicarlo?",
            "answer": "<p>En la zona del contorno de ojos, deslizando el roller con suavidad. Evita el contacto directo con los ojos. Solo para uso externo.</p>"
          }
        },
        "q-ingredientes": {
          "type": "question",
          "settings": {
            "question": "¿Qué ingredientes contiene?",
            "answer": "<p>Según la información facilitada por el proveedor: aceite de ricino (Ricinus Communis Seed Oil), Acetyl Tripeptide-1, colágeno (Collagen), extracto de Boswellia Serrata y agua (Aqua). Consulta siempre el envase del producto.</p>"
          }
        },
        "q-envio": {
          "type": "question",
          "settings": {
            "question": "¿Cuándo recibiré mi pedido?",
            "answer": "<p>Los plazos y costes de envío actualizados se indican en nuestra <a href=\"/policies/shipping-policy\" title=\"Política de envío\">política de envío</a> y durante el proceso de compra.</p>"
          }
        },
        "q-dudas": {
          "type": "question",
          "settings": {
            "question": "¿Qué ocurre si tengo una duda con mi pedido?",
            "answer": "<p>Escríbenos desde nuestra <a href=\"/pages/contacto\" title=\"Contacto\">página de contacto</a> indicando tu número de pedido y te responderemos lo antes posible. Puedes consultar también nuestra <a href=\"/policies/refund-policy\" title=\"Política de devoluciones\">política de devoluciones</a>.</p>"
          }
        }
      },
      "block_order": [
        "q-que-es",
        "q-como",
        "q-frecuencia",
        "q-cantidad",
        "q-donde",
        "q-ingredientes",
        "q-envio",
        "q-dudas"
      ],
      "settings": {
        "eyebrow": "",
        "heading": "Preguntas frecuentes",
        "open_first": false,
        "contact_text": "",
        "color_scheme": "scheme-2",
        "anchor": "preguntas-frecuentes",
        "padding_top": 56,
        "padding_bottom": 56
      }
    },
    "final_cta": {
      "type": "garelon-final-cta",
      "settings": {
        "fallback_image": "none",
        "show_isotype": true,
        "heading": "Tu rutina empieza con un pequeño gesto",
        "text": "<p>Cuidado diario para tu mirada.</p>",
        "show_price": true,
        "button_label": "Comprar el sérum",
        "color_scheme": "scheme-1",
        "anchor": "",
        "padding_top": 56,
        "padding_bottom": 64
      }
    }
  },
  "order": [
    "hero",
    "trust",
    "benefits",
    "roller",
    "ingredients",
    "how_to",
    "product_cta",
    "faq",
    "final_cta"
  ]
}
```

### `templates/product.json`

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "blocks": {
        "eyebrow": {
          "type": "text",
          "settings": {
            "text": "Sérum contorno de ojos · 10 ml",
            "text_style": "uppercase"
          }
        },
        "title": {
          "type": "title",
          "settings": {}
        },
        "rating": {
          "type": "rating",
          "settings": {}
        },
        "price": {
          "type": "price",
          "settings": {}
        },
        "subtitle": {
          "type": "text",
          "settings": {
            "text": "Con aceite de ricino y aplicador roller metálico para hidratar y cuidar el contorno de ojos.",
            "text_style": "subtitle"
          }
        },
        "variant_picker": {
          "type": "variant_picker",
          "settings": {
            "picker_type": "button",
            "swatch_shape": "circle"
          }
        },
        "packs": {
          "type": "garelon_packs",
          "disabled": true,
          "settings": {
            "heading": "Unidades",
            "max_units": "3",
            "note": ""
          }
        },
        "quantity_selector": {
          "type": "quantity_selector",
          "settings": {}
        },
        "buy_buttons": {
          "type": "buy_buttons",
          "settings": {
            "show_dynamic_checkout": true,
            "show_gift_card_recipient": false
          }
        },
        "inventory": {
          "type": "inventory",
          "settings": {
            "text_style": "body",
            "inventory_threshold": 0,
            "show_inventory_quantity": false
          }
        },
        "highlights": {
          "type": "icon-with-text",
          "settings": {
            "layout": "horizontal",
            "icon_1": "eye",
            "heading_1": "Aplicación precisa",
            "icon_2": "bottle",
            "heading_2": "10 ml",
            "icon_3": "stopwatch",
            "heading_3": "Rutina en 3 pasos"
          }
        },
        "description": {
          "type": "description",
          "settings": {}
        },
        "tab_ingredientes": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "Ingredientes",
            "icon": "leaf",
            "content": "<p>Ricinus Communis (Castor) Seed Oil (aceite de ricino), Acetyl Tripeptide-1, Collagen (colágeno), Boswellia Serrata Extract (extracto de Boswellia Serrata), Aqua (agua).</p><p>Ingredientes según la información facilitada por el proveedor. Consulta siempre el envase del producto.</p>"
          }
        },
        "tab_uso": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "Modo de uso",
            "icon": "clipboard",
            "content": "<p>1. Limpia y seca bien el rostro y el contorno de ojos.<br>2. Desliza suavemente el roller por la zona del contorno.<br>3. Masajea con movimientos suaves usando la bola metálica hasta distribuir el sérum.</p><p>Solo para uso externo. Evita el contacto directo con los ojos.</p>"
          }
        },
        "tab_envios": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "Envíos y devoluciones",
            "icon": "truck",
            "content": "<p>Consulta plazos y costes en nuestra <a href=\"/policies/shipping-policy\" title=\"Política de envío\">política de envío</a> y las condiciones en nuestra <a href=\"/policies/refund-policy\" title=\"Política de devoluciones\">política de devoluciones</a>. El pago se realiza en el checkout seguro de Shopify.</p>"
          }
        },
        "share": {
          "type": "share",
          "settings": {
            "share_label": "Compartir"
          }
        }
      },
      "block_order": [
        "eyebrow",
        "title",
        "rating",
        "price",
        "subtitle",
        "variant_picker",
        "packs",
        "quantity_selector",
        "buy_buttons",
        "inventory",
        "highlights",
        "description",
        "tab_ingredientes",
        "tab_uso",
        "tab_envios",
        "share"
      ],
      "settings": {
        "enable_sticky_info": true,
        "color_scheme": "scheme-1",
        "media_size": "large",
        "constrain_to_viewport": true,
        "media_fit": "contain",
        "gallery_layout": "thumbnail",
        "mobile_thumbnails": "show",
        "media_position": "left",
        "image_zoom": "lightbox",
        "hide_variants": true,
        "enable_video_looping": false,
        "padding_top": 16,
        "padding_bottom": 36
      }
    },
    "service": {
      "type": "garelon-trust-bar",
      "blocks": {
        "s-pago": {
          "type": "item",
          "settings": {
            "icon": "lock",
            "title": "Pago seguro",
            "text": "Checkout de Shopify"
          }
        },
        "s-atencion": {
          "type": "item",
          "settings": {
            "icon": "chat",
            "title": "Atención al cliente",
            "text": "Escríbenos",
            "link": "/pages/contacto"
          }
        },
        "s-envio": {
          "type": "item",
          "settings": {
            "icon": "truck",
            "title": "Información de envío",
            "text": "Plazos y costes",
            "link": "/policies/shipping-policy"
          }
        },
        "s-devoluciones": {
          "type": "item",
          "settings": {
            "icon": "return",
            "title": "Devoluciones",
            "text": "Consulta las condiciones",
            "link": "/policies/refund-policy"
          }
        }
      },
      "block_order": [
        "s-pago",
        "s-atencion",
        "s-envio",
        "s-devoluciones"
      ],
      "settings": {
        "heading": "Compra con confianza",
        "show_borders": true,
        "color_scheme": "scheme-1",
        "anchor": "",
        "padding_top": 8,
        "padding_bottom": 24
      }
    },
    "benefits": {
      "type": "garelon-benefits",
      "blocks": {
        "ojeras": {
          "type": "benefit",
          "settings": {
            "icon": "eye-under",
            "title": "Ojeras",
            "text": "Contribuye a mejorar la apariencia de la zona oscura del contorno."
          }
        },
        "bolsas": {
          "type": "benefit",
          "settings": {
            "icon": "eye",
            "title": "Bolsas",
            "text": "El masaje con roller complementa una rutina orientada a una mirada más descansada."
          }
        },
        "lineas": {
          "type": "benefit",
          "settings": {
            "icon": "lines",
            "title": "Líneas finas",
            "text": "La hidratación ayuda a mantener una apariencia más suave."
          }
        },
        "hidratacion": {
          "type": "benefit",
          "settings": {
            "icon": "drop",
            "title": "Hidratación",
            "text": "Aporta cuidado e hidratación a la zona del contorno."
          }
        }
      },
      "block_order": [
        "ojeras",
        "bolsas",
        "lineas",
        "hidratacion"
      ],
      "settings": {
        "eyebrow": "Beneficios",
        "heading": "Cuida una de las zonas más delicadas de tu rostro",
        "text": "<p>La piel del contorno de ojos es más fina y puede mostrar signos de cansancio, sequedad, bolsas y líneas finas. Dedicarle un momento cada día es un gesto sencillo dentro de tu rutina.</p>",
        "note": "",
        "alignment": "center",
        "color_scheme": "scheme-2",
        "anchor": "beneficios",
        "padding_top": 56,
        "padding_bottom": 56
      }
    },
    "how_to": {
      "type": "garelon-how-to-use",
      "blocks": {
        "paso-1": {
          "type": "step",
          "settings": {
            "label": "01",
            "title": "Limpia",
            "text": "Limpia y seca bien el rostro y el contorno de ojos."
          }
        },
        "paso-2": {
          "type": "step",
          "settings": {
            "label": "02",
            "title": "Aplica",
            "text": "Presiona y desliza suavemente el roller para que salga el sérum y distribúyelo por el contorno."
          }
        },
        "paso-3": {
          "type": "step",
          "settings": {
            "label": "03",
            "title": "Masajea",
            "text": "Masajea con suavidad con la bola metálica para favorecer la distribución del sérum."
          }
        }
      },
      "block_order": [
        "paso-1",
        "paso-2",
        "paso-3"
      ],
      "settings": {
        "eyebrow": "Cómo usarlo",
        "heading": "3 pasos. Menos de un minuto.",
        "show_images": false,
        "note": "Solo para uso externo. Evita el contacto directo con los ojos. Si notas cualquier molestia, interrumpe su uso.",
        "color_scheme": "scheme-1",
        "anchor": "como-usarlo",
        "padding_top": 56,
        "padding_bottom": 56,
        "fallback_image": "img04-uso"
      }
    },
    "faq": {
      "type": "garelon-faq",
      "blocks": {
        "q-que-es": {
          "type": "question",
          "settings": {
            "question": "¿Qué es el sérum de contorno de ojos de GARELON?",
            "answer": "<p>Es un sérum para el contorno de ojos con aceite de ricino y aplicador roller metálico, en un frasco de vidrio ámbar de 10 ml. GARELON es la tienda desde la que lo comercializamos: el producto procede de un fabricante externo, por lo que en el frasco y en la caja verás la marca original del fabricante.</p>"
          }
        },
        "q-como": {
          "type": "question",
          "settings": {
            "question": "¿Cómo se utiliza?",
            "answer": "<p>1. Limpia y seca bien el rostro y el contorno de ojos.<br>2. Desliza suavemente el roller por la zona del contorno para que salga el producto.<br>3. Masajea con movimientos suaves usando la bola metálica hasta distribuir el sérum.</p>"
          }
        },
        "q-frecuencia": {
          "type": "question",
          "settings": {
            "question": "¿Con qué frecuencia puedo incorporarlo a mi rutina?",
            "answer": "<p>Está pensado para formar parte de tu rutina diaria de cuidado. Aplícalo siempre sobre la piel limpia y seca y sigue las indicaciones del envase. Si notas cualquier molestia, interrumpe su uso.</p>"
          }
        },
        "q-cantidad": {
          "type": "question",
          "settings": {
            "question": "¿Cuánto producto contiene?",
            "answer": "<p>Cada frasco contiene 10 ml (0.34 fl oz).</p>"
          }
        },
        "q-donde": {
          "type": "question",
          "settings": {
            "question": "¿Dónde debo aplicarlo?",
            "answer": "<p>En la zona del contorno de ojos, deslizando el roller con suavidad. Evita el contacto directo con los ojos. Solo para uso externo.</p>"
          }
        },
        "q-ingredientes": {
          "type": "question",
          "settings": {
            "question": "¿Qué ingredientes contiene?",
            "answer": "<p>Según la información facilitada por el proveedor: aceite de ricino (Ricinus Communis Seed Oil), Acetyl Tripeptide-1, colágeno (Collagen), extracto de Boswellia Serrata y agua (Aqua). Consulta siempre el envase del producto.</p>"
          }
        },
        "q-envio": {
          "type": "question",
          "settings": {
            "question": "¿Cuándo recibiré mi pedido?",
            "answer": "<p>Los plazos y costes de envío actualizados se indican en nuestra <a href=\"/policies/shipping-policy\" title=\"Política de envío\">política de envío</a> y durante el proceso de compra.</p>"
          }
        },
        "q-dudas": {
          "type": "question",
          "settings": {
            "question": "¿Qué ocurre si tengo una duda con mi pedido?",
            "answer": "<p>Escríbenos desde nuestra <a href=\"/pages/contacto\" title=\"Contacto\">página de contacto</a> indicando tu número de pedido y te responderemos lo antes posible. Puedes consultar también nuestra <a href=\"/policies/refund-policy\" title=\"Política de devoluciones\">política de devoluciones</a>.</p>"
          }
        }
      },
      "block_order": [
        "q-que-es",
        "q-como",
        "q-frecuencia",
        "q-cantidad",
        "q-donde",
        "q-ingredientes",
        "q-envio",
        "q-dudas"
      ],
      "settings": {
        "eyebrow": "",
        "heading": "Preguntas frecuentes",
        "open_first": false,
        "contact_text": "",
        "color_scheme": "scheme-2",
        "anchor": "preguntas-frecuentes",
        "padding_top": 56,
        "padding_bottom": 56
      }
    },
    "sticky": {
      "type": "garelon-sticky-atc",
      "settings": {
        "button_label": "Añadir",
        "show_on_desktop": false,
        "color_scheme": "scheme-4"
      }
    }
  },
  "order": [
    "main",
    "service",
    "benefits",
    "how_to",
    "faq",
    "sticky"
  ]
}
```

### `templates/page.faq.json`

```json
{
  "sections": {
    "main": {
      "type": "main-page",
      "settings": {
        "padding_top": 36,
        "padding_bottom": 0
      }
    },
    "faq": {
      "type": "garelon-faq",
      "blocks": {
        "q-que-es": {
          "type": "question",
          "settings": {
            "question": "¿Qué es el sérum de contorno de ojos de GARELON?",
            "answer": "<p>Es un sérum para el contorno de ojos con aceite de ricino y aplicador roller metálico, en un frasco de vidrio ámbar de 10 ml. GARELON es la tienda desde la que lo comercializamos: el producto procede de un fabricante externo, por lo que en el frasco y en la caja verás la marca original del fabricante.</p>"
          }
        },
        "q-como": {
          "type": "question",
          "settings": {
            "question": "¿Cómo se utiliza?",
            "answer": "<p>1. Limpia y seca bien el rostro y el contorno de ojos.<br>2. Desliza suavemente el roller por la zona del contorno para que salga el producto.<br>3. Masajea con movimientos suaves usando la bola metálica hasta distribuir el sérum.</p>"
          }
        },
        "q-frecuencia": {
          "type": "question",
          "settings": {
            "question": "¿Con qué frecuencia puedo incorporarlo a mi rutina?",
            "answer": "<p>Está pensado para formar parte de tu rutina diaria de cuidado. Aplícalo siempre sobre la piel limpia y seca y sigue las indicaciones del envase. Si notas cualquier molestia, interrumpe su uso.</p>"
          }
        },
        "q-cantidad": {
          "type": "question",
          "settings": {
            "question": "¿Cuánto producto contiene?",
            "answer": "<p>Cada frasco contiene 10 ml (0.34 fl oz).</p>"
          }
        },
        "q-donde": {
          "type": "question",
          "settings": {
            "question": "¿Dónde debo aplicarlo?",
            "answer": "<p>En la zona del contorno de ojos, deslizando el roller con suavidad. Evita el contacto directo con los ojos. Solo para uso externo.</p>"
          }
        },
        "q-ingredientes": {
          "type": "question",
          "settings": {
            "question": "¿Qué ingredientes contiene?",
            "answer": "<p>Según la información facilitada por el proveedor: aceite de ricino (Ricinus Communis Seed Oil), Acetyl Tripeptide-1, colágeno (Collagen), extracto de Boswellia Serrata y agua (Aqua). Consulta siempre el envase del producto.</p>"
          }
        },
        "q-envio": {
          "type": "question",
          "settings": {
            "question": "¿Cuándo recibiré mi pedido?",
            "answer": "<p>Los plazos y costes de envío actualizados se indican en nuestra <a href=\"/policies/shipping-policy\" title=\"Política de envío\">política de envío</a> y durante el proceso de compra.</p>"
          }
        },
        "q-dudas": {
          "type": "question",
          "settings": {
            "question": "¿Qué ocurre si tengo una duda con mi pedido?",
            "answer": "<p>Escríbenos desde nuestra <a href=\"/pages/contacto\" title=\"Contacto\">página de contacto</a> indicando tu número de pedido y te responderemos lo antes posible. Puedes consultar también nuestra <a href=\"/policies/refund-policy\" title=\"Política de devoluciones\">política de devoluciones</a>.</p>"
          }
        }
      },
      "block_order": [
        "q-que-es",
        "q-como",
        "q-frecuencia",
        "q-cantidad",
        "q-donde",
        "q-ingredientes",
        "q-envio",
        "q-dudas"
      ],
      "settings": {
        "eyebrow": "",
        "heading": "",
        "open_first": false,
        "contact_text": "",
        "color_scheme": "scheme-1",
        "anchor": "preguntas-frecuentes",
        "padding_top": 16,
        "padding_bottom": 56
      }
    }
  },
  "order": [
    "main",
    "faq"
  ]
}
```

### `templates/page.contact.json`

```json
{
  "sections": {
    "main": {
      "type": "main-page",
      "settings": {
        "padding_top": 36,
        "padding_bottom": 36
      }
    },
    "form": {
      "type": "contact-form",
      "settings": {
        "heading": "",
        "heading_size": "h1",
        "color_scheme": "scheme-1",
        "padding_top": 16,
        "padding_bottom": 36
      }
    }
  },
  "order": [
    "main",
    "form"
  ]
}
```

### `templates/404.json`

```json
{
  "sections": {
    "main": {
      "type": "main-404"
    },
    "final_cta": {
      "type": "garelon-final-cta",
      "settings": {
        "fallback_image": "img01-producto",
        "show_isotype": true,
        "heading": "Volvamos a tu rutina",
        "text": "<p>La página que buscas no existe o ha cambiado de dirección.</p>",
        "show_price": false,
        "button_label": "Ver el sérum",
        "color_scheme": "scheme-2",
        "anchor": "",
        "padding_top": 48,
        "padding_bottom": 56
      }
    }
  },
  "order": [
    "main",
    "final_cta"
  ]
}
```

---

## Paso 7 · Cabecera y pie (grupos de secciones)

En **Sections**, abre cada archivo, selecciona todo y pega.

### `sections/header-group.json`

```json
{
  "name": "t:sections.header.name",
  "type": "header",
  "sections": {
    "announcement-bar": {
      "type": "announcement-bar",
      "settings": {
        "color_scheme": "scheme-3",
        "show_line_separator": false,
        "show_social": false,
        "auto_rotate": false,
        "change_slides_speed": 5,
        "enable_country_selector": false,
        "enable_language_selector": false
      },
      "blocks": {
        "announcement-bar-0": {
          "type": "announcement",
          "settings": {
            "text": "Envío disponible a toda España",
            "link": "",
            "show_flag_es": true
          }
        }
      },
      "block_order": [
        "announcement-bar-0"
      ]
    },
    "header": {
      "type": "header",
      "settings": {
        "color_scheme": "scheme-1",
        "menu_color_scheme": "scheme-1",
        "logo_position": "middle-left",
        "menu": "main-menu",
        "nav_source": "garelon",
        "nav_show_how": false,
        "nav_show_ingredients": true,
        "nav_show_faq": true,
        "hide_catalog_links": true,
        "menu_type_desktop": "dropdown",
        "sticky_header_type": "on-scroll-up",
        "show_line_separator": true,
        "enable_country_selector": false,
        "enable_language_selector": false,
        "mobile_logo_position": "center",
        "margin_bottom": 0,
        "padding_top": 12,
        "padding_bottom": 12,
        "show_isotype": true
      }
    }
  },
  "order": [
    "announcement-bar",
    "header"
  ]
}
```

### `sections/footer-group.json`

```json
{
  "name": "t:sections.footer.name",
  "type": "footer",
  "sections": {
    "footer": {
      "type": "footer",
      "blocks": {
        "brand": {
          "type": "brand_information",
          "settings": {
            "show_social": true
          }
        },
        "ayuda": {
          "type": "garelon_help",
          "settings": {
            "heading": "Ayuda",
            "text": "<p>¿Necesitas ayuda? Estamos aquí para resolver cualquier duda sobre tu pedido, nuestros productos o el proceso de compra.</p>",
            "link_label": "Contacta con nuestro equipo",
            "link": "",
            "menu": ""
          }
        }
      },
      "block_order": [
        "brand",
        "ayuda"
      ],
      "settings": {
        "color_scheme": "scheme-2",
        "newsletter_enable": false,
        "newsletter_heading": "Recibe novedades de GARELON",
        "enable_follow_on_shop": false,
        "show_social": true,
        "enable_country_selector": false,
        "enable_language_selector": false,
        "payment_enable": true,
        "show_policy": true,
        "margin_top": 0,
        "padding_top": 48,
        "padding_bottom": 32
      }
    }
  },
  "order": [
    "footer"
  ]
}
```

---

## Paso 8 · Colores, tipografía y carrito

**Opción A (sin código):** *Personalizar → Configuración del tema*:

| Ajuste | Valor |
|---|---|
| Esquema 1 | Fondo `#F8F4EC` · Texto `#1B1714` · Botón `#1B1714` · Texto del botón `#FFFFFF` · Botón secundario `#1B1714` |
| Esquema 2 | Fondo `#EFE6D7` · Texto `#1B1714` · Botón `#1B1714` · Texto del botón `#FFFFFF` · Botón secundario `#1B1714` |
| Esquema 3 | Fondo `#1B1714` · Texto `#F8F4EC` · Botón `#D2B06A` · Texto del botón `#1B1714` · Botón secundario `#F8F4EC` |
| Esquema 4 | Fondo `#FFFFFF` · Texto `#1B1714` · Botón `#1B1714` · Texto del botón `#FFFFFF` · Botón secundario `#1B1714` |
| Esquema 5 | Fondo `#B88A3B` · Texto `#1B1714` · Botón `#1B1714` · Texto del botón `#FFFFFF` · Botón secundario `#1B1714` |
| Tipografía | Títulos **Playfair Display** · Texto **Inter** |
| Botones | Radio de esquina **4 px** |
| Entradas / píldoras de variantes | Radio **4 px** |
| Contenedor multimedia / tarjetas | Radio **6 px** |
| Animaciones | "Mostrar secciones al desplazarse" **desactivado** |
| Carrito | Tipo de carrito **Cajón** |
| Información de marca (pie) | Descripción: *Cuidado diario para tu mirada.* |

**Opción B (código):** abre `config/settings_data.json`, selecciona todo y pega esto. Úsalo solo si tu Dawn
es 15 o 16; en otras versiones usa la opción A.

### `config/settings_data.json`

```json
{
  "current": "Dawn",
  "presets": {
    "Dawn": {
      "logo_width": 150,
      "customer_account_menu": "customer-account-main-menu",
      "color_schemes": {
        "scheme-1": {
          "settings": {
            "background": "#F8F4EC",
            "background_gradient": "",
            "text": "#1B1714",
            "button": "#1B1714",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1B1714",
            "shadow": "#1B1714"
          }
        },
        "scheme-2": {
          "settings": {
            "background": "#EFE6D7",
            "background_gradient": "",
            "text": "#1B1714",
            "button": "#1B1714",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1B1714",
            "shadow": "#1B1714"
          }
        },
        "scheme-3": {
          "settings": {
            "background": "#1B1714",
            "background_gradient": "",
            "text": "#F8F4EC",
            "button": "#D2B06A",
            "button_label": "#1B1714",
            "secondary_button_label": "#F8F4EC",
            "shadow": "#1B1714"
          }
        },
        "scheme-4": {
          "settings": {
            "background": "#FFFFFF",
            "background_gradient": "",
            "text": "#1B1714",
            "button": "#1B1714",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1B1714",
            "shadow": "#1B1714"
          }
        },
        "scheme-5": {
          "settings": {
            "background": "#B88A3B",
            "background_gradient": "",
            "text": "#1B1714",
            "button": "#1B1714",
            "button_label": "#FFFFFF",
            "secondary_button_label": "#1B1714",
            "shadow": "#1B1714"
          }
        }
      },
      "type_header_font": "playfair_display_n4",
      "heading_scale": 100,
      "type_body_font": "inter_n4",
      "body_scale": 100,
      "page_width": 1200,
      "spacing_sections": 0,
      "spacing_grid_horizontal": 8,
      "spacing_grid_vertical": 8,
      "animations_reveal_on_scroll": false,
      "animations_hover_elements": "default",
      "buttons_border_thickness": 1,
      "buttons_border_opacity": 100,
      "buttons_radius": 4,
      "buttons_shadow_opacity": 0,
      "buttons_shadow_horizontal_offset": 0,
      "buttons_shadow_vertical_offset": 4,
      "buttons_shadow_blur": 5,
      "variant_pills_border_thickness": 1,
      "variant_pills_border_opacity": 40,
      "variant_pills_radius": 4,
      "variant_pills_shadow_opacity": 0,
      "variant_pills_shadow_horizontal_offset": 0,
      "variant_pills_shadow_vertical_offset": 4,
      "variant_pills_shadow_blur": 5,
      "inputs_border_thickness": 1,
      "inputs_border_opacity": 35,
      "inputs_radius": 4,
      "inputs_shadow_opacity": 0,
      "inputs_shadow_horizontal_offset": 0,
      "inputs_shadow_vertical_offset": 4,
      "inputs_shadow_blur": 5,
      "card_style": "standard",
      "card_image_padding": 0,
      "card_text_alignment": "left",
      "card_color_scheme": "scheme-4",
      "card_border_thickness": 0,
      "card_border_opacity": 10,
      "card_corner_radius": 6,
      "card_shadow_opacity": 0,
      "card_shadow_horizontal_offset": 0,
      "card_shadow_vertical_offset": 4,
      "card_shadow_blur": 5,
      "collection_card_style": "standard",
      "collection_card_image_padding": 0,
      "collection_card_text_alignment": "left",
      "collection_card_color_scheme": "scheme-4",
      "collection_card_border_thickness": 0,
      "collection_card_border_opacity": 10,
      "collection_card_corner_radius": 0,
      "collection_card_shadow_opacity": 0,
      "collection_card_shadow_horizontal_offset": 0,
      "collection_card_shadow_vertical_offset": 4,
      "collection_card_shadow_blur": 5,
      "blog_card_style": "standard",
      "blog_card_image_padding": 0,
      "blog_card_text_alignment": "left",
      "blog_card_color_scheme": "scheme-4",
      "blog_card_border_thickness": 0,
      "blog_card_border_opacity": 10,
      "blog_card_corner_radius": 0,
      "blog_card_shadow_opacity": 0,
      "blog_card_shadow_horizontal_offset": 0,
      "blog_card_shadow_vertical_offset": 4,
      "blog_card_shadow_blur": 5,
      "text_boxes_border_thickness": 0,
      "text_boxes_border_opacity": 10,
      "text_boxes_radius": 6,
      "text_boxes_shadow_opacity": 0,
      "text_boxes_shadow_horizontal_offset": 0,
      "text_boxes_shadow_vertical_offset": 4,
      "text_boxes_shadow_blur": 5,
      "media_border_thickness": 0,
      "media_border_opacity": 5,
      "media_radius": 6,
      "media_shadow_opacity": 0,
      "media_shadow_horizontal_offset": 0,
      "media_shadow_vertical_offset": 4,
      "media_shadow_blur": 5,
      "popup_border_thickness": 1,
      "popup_border_opacity": 10,
      "popup_corner_radius": 6,
      "popup_shadow_opacity": 5,
      "popup_shadow_horizontal_offset": 0,
      "popup_shadow_vertical_offset": 4,
      "popup_shadow_blur": 5,
      "drawer_border_thickness": 1,
      "drawer_border_opacity": 10,
      "drawer_shadow_opacity": 0,
      "drawer_shadow_horizontal_offset": 0,
      "drawer_shadow_vertical_offset": 4,
      "drawer_shadow_blur": 5,
      "badge_position": "bottom left",
      "badge_corner_radius": 4,
      "sale_badge_color_scheme": "scheme-3",
      "sold_out_badge_color_scheme": "scheme-2",
      "brand_headline": "",
      "brand_description": "<p>Cuidado diario para tu mirada.</p>",
      "brand_image_width": 120,
      "social_twitter_link": "",
      "social_facebook_link": "",
      "social_pinterest_link": "",
      "social_instagram_link": "",
      "social_tiktok_link": "",
      "social_tumblr_link": "",
      "social_snapchat_link": "",
      "social_youtube_link": "",
      "social_vimeo_link": "",
      "predictive_search_enabled": true,
      "predictive_search_show_vendor": false,
      "predictive_search_show_price": false,
      "currency_code_enabled": true,
      "cart_type": "drawer",
      "show_vendor": false,
      "show_cart_note": false,
      "cart_drawer_collection": "",
      "cart_color_scheme": "scheme-1",
      "sections": {
        "main-password-header": {
          "type": "main-password-header",
          "settings": {
            "color_scheme": "scheme-1"
          }
        },
        "main-password-footer": {
          "type": "main-password-footer",
          "settings": {
            "color_scheme": "scheme-1"
          }
        }
      }
    }
  }
}
```

---

## Paso 9 · Textos en español de España (`locales/es.json`)

Dawn trae español latinoamericano. Abre `locales/es.json` y usa buscar/sustituir (incluye las comillas):

| Busca | Sustituye por |
|---|---|
| `"Agregar al carrito"` | `"Añadir al carrito"` |
| `"Artículo agregado a tu carrito"` | `"Artículo añadido a tu carrito"` |
| `"En existencias"` (2 veces) | `"En stock"` |
| `"{{ quantity }} en existencias"` | `"{{ quantity }} en stock"` |
| `"Bajas existencias"` | `"Pocas unidades"` |
| `"Bajas existencias: quedan {{ quantity }}"` | `"Pocas unidades: quedan {{ quantity }}"` |
| `Solo puedes agregar` (2 veces) | `Solo puedes añadir` |
| `artículo agregado"` | `artículo añadido"` |
| `artículos agregados"` (2 veces) | `artículos añadidos"` |
| `"Pagar pedido"` | `"Finalizar compra"` |

---

## Paso 10 · Comprobar

1. Pulsa **Vista previa** en la copia del tema y revisa la home y la ficha de producto en móvil y escritorio
   (lista de comprobación de `GARELON-CAMBIOS-RONDA-3.md`).
2. Sigue la lista de tareas del Admin de `GARELON-GUIA.md` (título del producto, página de contacto, políticas,
   página de cookies, zona de envío España). Los menús ya no hace falta configurarlos.
3. Publica cuando todo esté bien.
