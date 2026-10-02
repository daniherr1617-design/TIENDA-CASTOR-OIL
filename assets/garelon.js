/*
  GARELON · Mejoras ligeras sobre el formulario de producto de Dawn (sin librerías).
  - <garelon-sticky-atc>: barra fija de compra en móvil (ficha y home). No crea su propio
    formulario: pulsa el botón real del formulario de Dawn, así el carrito (drawer/AJAX), las
    apps y los eventos de Shopify siguen funcionando igual. Muestra la variante elegida
    (p. ej. «Color · 2 unidades»), su precio real y la foto del color.
  - Color × Pack (snippets/garelon-packs.liquid) no necesita JS propio: son variantes reales
    dentro del <variant-selects> de Dawn.
  - Galería del tema (snippets/garelon-gallery.liquid): al elegir un color, el carrusel se
    desliza hasta la foto de ese color.
  - [data-g-pick-color]: botones «Elegir este color» (sección GARELON Colores): marcan ese color
    en el selector de la compra y llevan hasta ella. Sin selector en la página, siguen su enlace.
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
        this.variantTarget = this.querySelector('[data-sticky-variant]');
        this.thumb = this.querySelector('[data-sticky-thumb]');
        this.defaultLabel = this.buttonLabel ? this.buttonLabel.textContent.trim() : '';

        if (!this.sectionId) {
          // Ficha: <product-info id="MainProduct-…">. Home: el formulario de la sección de compra.
          const mainInfo = document.querySelector('product-info[id^="MainProduct-"]');
          const anyButton = document.querySelector('[id^="ProductSubmitButton-"]');
          this.sectionId = mainInfo
            ? mainInfo.dataset.section
            : anyButton
            ? anyButton.id.replace('ProductSubmitButton-', '')
            : null;
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
        // Visible solo cuando el botón principal ha quedado por encima de la pantalla. La raíz se
        // alarga hacia abajo para que el único cruce sea el borde superior: así también se detecta
        // un salto de scroll desde «botón aún por debajo» a «botón ya por encima».
        this.observer = new IntersectionObserver(
          ([entry]) => {
            const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            this.toggle(passed);
          },
          { rootMargin: '0px 0px 100000px 0px' }
        );
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

        if (this.variantTarget) {
          // Color y pack elegidos (garelon-packs: «Color · 2 unidades») o, si no hay packs, el nombre
          // de la variante. Las opciones fijas ocultas no llevan etiqueta. Al cambiar de variante
          // Dawn deja 500 ms el selector anterior oculto y con el mismo id: se lee solo el visible.
          const selects = Array.from(document.querySelectorAll(`#variant-selects-${this.sectionId}`)).find(
            (element) => element.style.display !== 'none'
          );
          const labels = selects
            ? Array.from(
                selects.querySelectorAll('input:checked'),
                (input) => input.dataset.choiceLabel || input.dataset.packLabel
              ).filter(Boolean)
            : [];
          const label = labels.join(' · ') || (variant && variant.title);
          if (label) this.variantTarget.textContent = label;

          // Sin foto de variante en Shopify: la foto del color elegido (miniatura del selector).
          const colorThumb = selects && selects.querySelector('.g-choice__input:checked + label .g-choice__thumb');
          if (colorThumb && this.thumb && !(variant && variant.featured_media)) {
            this.thumb.src = colorThumb.currentSrc || colorThumb.src;
            this.thumb.removeAttribute('srcset');
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

// Varias secciones pueden cargar este archivo: los manejadores se registran una sola vez.
(() => {
  if (window.garelonColorReady) return;
  window.garelonColorReady = true;

  const garelonKey = (text) =>
    String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  // Desliza la galería del tema (si la hay en la misma sección) hasta la foto del color.
  function showColor(scope, key) {
    const gallery = (scope && scope.querySelector('.g-gallery')) || document.querySelector('.g-gallery');
    if (!gallery) return;
    const slide = gallery.querySelector(`[data-g-color="${key}"]`);
    const track = gallery.querySelector('.g-gallery__track');
    if (!slide || !track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }

  document.addEventListener('change', (event) => {
    const input = event.target;
    if (!input.classList || !input.classList.contains('g-choice__input')) return;
    showColor(input.closest('.shopify-section'), garelonKey(input.dataset.choiceLabel || input.value));
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-g-pick-color]');
    if (!trigger) return;
    const key = garelonKey(trigger.dataset.gPickColor);
    const input = Array.from(document.querySelectorAll('.g-choice__input')).find(
      (element) => garelonKey(element.dataset.choiceLabel || element.value) === key && element.offsetParent !== null
    );
    if (!input) return; // Sin selector en esta página: el enlace lleva a la ficha con ese color.
    event.preventDefault();
    const target = input.closest('.g-anchor, product-info, .shopify-section') || input;
    if (!input.checked) input.click();
    else showColor(input.closest('.shopify-section'), key);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });
})();
