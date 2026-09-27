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
