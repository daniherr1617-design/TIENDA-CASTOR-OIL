/*
  GARELON · Mejoras ligeras sobre el formulario de producto de Dawn.
  - <garelon-sticky-atc>: barra fija de compra en móvil. No crea su propio
    formulario: pulsa el botón real del formulario de Dawn, así el carrito
    (drawer/AJAX), las apps y los eventos de Shopify siguen funcionando igual.
    Muestra la variante elegida (p. ej. «Rojo · 2 unidades») y su precio real.
  - Color × Pack (snippets/garelon-packs.liquid) no necesita JS propio: son
    variantes reales dentro del <variant-selects> de Dawn.
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
          // Color y pack elegidos (garelon-packs: «Rojo · 2 unidades») o, si no hay packs, el nombre
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
