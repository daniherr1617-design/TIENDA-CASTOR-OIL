# GARELON · Cambios de la ronda 2 (para una tienda ya instalada)

Usa esta guía si **ya tienes el theme GARELON instalado** y quieres aplicar solo esta ronda de correcciones
sin perder lo que hayas ajustado en el editor. No cambia colores, tipografías, imágenes ni secciones.

> Antes de empezar: *Tienda online → Temas → (tu tema GARELON) → ⋯ → Duplicar*, y trabaja sobre la copia.
> Cuando lo compruebes en *Vista previa*, publícala.

Qué incluye:

1. Isotipo a la izquierda de GARELON en la cabecera (todas las páginas, escritorio y móvil).
2. Enlaces de contacto, devoluciones y envíos que llevan a la página o política **real** de tu tienda.
3. Nuevo bloque **Ayuda** en el pie con enlace a la página de contacto.
4. En el pie, la política de reembolsos se muestra como «Política de devoluciones y reembolsos».

---

## Paso 1 · Archivos completos (sustituir todo el contenido)

Abre cada archivo en *Editar código*, selecciona todo (**Ctrl+A / Cmd+A**), borra y pega el contenido completo.
`snippets/garelon-url.liquid` es **nuevo**: créalo en *Snippets → Añadir un nuevo snippet → `garelon-url`*.

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

  /* Logo centrado en móvil: el nombre conserva su posición y el isotipo ocupa
     el hueco libre de la izquierda, sin acercarse a los iconos de la derecha. */
  .header--mobile-center .garelon-brand-link {
    margin-left: -2.7rem;
  }
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

### `snippets/garelon-url.liquid` (nuevo)

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

  case type
    when 'contact'
      echo contact_url
    when 'refund'
      echo refund_url
    when 'shipping'
      echo shipping_url
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

---

## Paso 2 · Cambios pequeños en archivos de Dawn

Abre cada archivo, localiza con **Ctrl+F / Cmd+F** el texto de «Busca» y cámbialo por el de «Sustituye por».
Si el buscador no encuentra el bloque entero, busca solo su primera línea.

### 2.1 `sections/header.liquid`

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

### 2.2 `sections/footer.liquid`

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

### 2.3 `sections/main-product.liquid`

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

### 2.4 `snippets/header-dropdown-menu.liquid`

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

### 2.5 `snippets/header-drawer.liquid`

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

### 2.6 `snippets/header-mega-menu.liquid`

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

### 2.7 `config/settings_schema.json`

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

## Paso 3 · Bloque «Ayuda» del pie (desde el editor visual)

Así no se pierde nada de lo que hayas configurado en el pie:

1. *Personalizar* → selecciona el **Pie de página**.
2. Elimina el bloque de menú **Ayuda** actual (el que estaba vacío).
3. **Añadir bloque → GARELON Ayuda**. Ya trae el título, el texto y el enlace «Contacta con nuestro equipo →».
4. Arrástralo a la derecha del bloque de marca y **Guardar**.

El enlace va a la página de contacto automáticamente. Si quieres fijar tú la página:
*Personalizar → Configuración del tema → **GARELON · Enlaces** → Página de contacto*.

---

## Paso 4 · Comprobar

- Cabecera: isotipo + GARELON en inicio, producto, carrito, contacto, políticas y 404, en escritorio y en móvil.
- Pie: bloque Ayuda → la página de contacto real.
- Ficha de producto: en la barra de servicio, «Atención al cliente», «Información de envío» y «Devoluciones».
- Preguntas frecuentes: los enlaces «página de contacto», «política de envío» y «política de devoluciones».
- Menú móvil: todos los enlaces.
