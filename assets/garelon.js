/* GARELON · JS mínimo sobre Dawn (sin dependencias).
   Cierra el menú móvil de Dawn al pulsar un ancla de la misma página (p. ej. /#detalles):
   Dawn no lo hace y el menú se quedaría abierto encima de la sección. */
document.addEventListener('click', (event) => {
  const link = event.target.closest('#menu-drawer a[href*="#"]');
  if (!link) return;
  const url = new URL(link.href, window.location.href);
  if (url.pathname !== window.location.pathname) return;
  const drawer = link.closest('header-drawer');
  const summary = drawer && drawer.querySelector('summary');
  if (drawer && summary && typeof drawer.closeMenuDrawer === 'function') {
    drawer.closeMenuDrawer(event, summary);
    summary.setAttribute('aria-expanded', 'false');
  }
});

/* D46 · Al volver atrás (p. ej. desde el pago), el navegador restaura el pack marcado pero Dawn deja la
   variante, el precio y el formulario de la carga inicial (el pack 1). Si el pack marcado no es el que
   pintó el servidor, se avisa a Dawn como si el cliente lo hubiera pulsado: así el botón compra lo que se ve.
   El navegador restaura los formularios después de los scripts diferidos: se comprueba en «pageshow». */
window.addEventListener('pageshow', () => {
  Promise.all([customElements.whenDefined('variant-selects'), customElements.whenDefined('product-info')]).then(() => {
    document.querySelectorAll('variant-selects').forEach((selects) => {
      const checked = selects.querySelector('input[type="radio"]:checked');
      if (checked && !checked.defaultChecked) checked.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
});

/* D46 · «Comprar ahora» en móvil (snippets/buy-buttons.liquid). Solo APIs nativas de Shopify:
   1) /cart/update.js fija en el carrito la variante elegida con la cantidad del formulario (no suma:
      pulsar dos veces o volver atrás no duplica el pack; el resto del carrito no se toca);
   2) si el carrito solo contiene esa variante, abre el pago de Shopify (/checkout); si tiene más
      productos, abre el carrito para que el cliente lo revise antes de pagar.
   Sin JS, o si algo falla, «Añadir al carrito» de Dawn sigue funcionando igual. */
(() => {
  const buttons = document.querySelectorAll('[data-garelon-buy-now]');
  if (!buttons.length) return;
  buttons.forEach((button) => {
    const productForm = button.closest('product-form');
    const form = productForm && productForm.querySelector('form');
    const submit = productForm && productForm.querySelector('[type="submit"][name="add"]');
    const info = button.closest('product-info');
    const priceOut = button.querySelector('[data-buy-now-price]');
    const labelOut = button.querySelector('.g-buy-now__label');
    if (!form || !submit) return;

    // Mismo estado que «Añadir al carrito» (agotado, sin variante o cargando otra variante) y precio de la variante elegida.
    const sync = () => {
      if (button.getAttribute('aria-busy') === 'true') return;
      if (button.disabled !== submit.disabled) button.disabled = submit.disabled;
      const current = info && info.querySelector('[id^="price-"] .price--on-sale .price-item--sale, [id^="price-"] .price__regular .price-item--regular');
      // Solo se escribe si cambia: el observador mira este mismo bloque y si no entraría en bucle.
      const text = current && current.textContent.trim();
      if (text && priceOut && priceOut.textContent !== text) priceOut.textContent = text;
      // Agotado / No disponible: el texto de «Añadir al carrito» y sin precio (mientras Dawn carga otra
      // variante, «Añadir al carrito» se desactiva sin cambiar su texto y aquí sigue «Comprar ahora»).
      const atcSpan = submit.querySelector('span');
      const atcText = atcSpan ? atcSpan.textContent.trim() : '';
      const soldOut = submit.disabled && atcText && atcText !== button.dataset.addText;
      const wanted = soldOut ? atcText : button.dataset.nowText;
      if (labelOut && wanted && labelOut.textContent !== wanted) labelOut.textContent = wanted;
      if (priceOut && priceOut.hidden !== !!soldOut) priceOut.hidden = !!soldOut;
    };
    new MutationObserver(sync).observe(submit, { attributes: true, attributeFilter: ['disabled'] });
    if (info) new MutationObserver(sync).observe(info, { subtree: true, childList: true, characterData: true });
    sync();

    const showError = (message) => {
      if (typeof productForm.handleErrorMessage === 'function') productForm.handleErrorMessage(message);
    };
    button.addEventListener('click', (event) => {
      // Es un botón submit para que sin JS funcione como «Añadir al carrito»; con JS no se envía el formulario.
      event.preventDefault();
      if (button.disabled || button.getAttribute('aria-busy') === 'true') return;
      const data = new FormData(form);
      const id = data.get('id');
      const quantity = parseInt(data.get('quantity'), 10) || 1;
      if (!id) return;
      showError(false);
      button.setAttribute('aria-busy', 'true');
      fetch(button.dataset.updateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ updates: { [id]: quantity } }),
      })
        .then((response) => response.json().then((cart) => ({ ok: response.ok, cart })))
        .then(({ ok, cart }) => {
          if (!ok || !cart || !Array.isArray(cart.items)) throw new Error((cart && (cart.description || cart.message)) || '');
          const onlyThis = cart.items.length > 0 && cart.items.every((item) => String(item.variant_id) === String(id));
          window.location.href = onlyThis ? button.dataset.checkoutUrl : button.dataset.cartUrl;
        })
        .catch((error) => {
          button.removeAttribute('aria-busy');
          sync();
          showError((error && error.message) || button.dataset.error);
        });
    });
    // Volver atrás desde el pago (bfcache): el botón no se queda «cargando».
    window.addEventListener('pageshow', () => {
      button.removeAttribute('aria-busy');
      sync();
    });
  });
})();

/* Compra fija en móvil (sections/garelon-sticky-cta.liquid; ficha y home): pulsa el botón real de la
   compra de la página («Comprar ahora» si existe; si no, «Añadir al carrito» de Dawn), copia su estado
   (texto, desactivado), el pack elegido y su precio. */
(() => {
  const sticky = document.querySelector('[data-garelon-sticky]');
  if (!sticky) return;
  const root = document.querySelector('product-info[id^="MainProduct-"]') || document.querySelector('.section-featured-product product-info');
  const buyNow = () => root && [...root.querySelectorAll('[data-garelon-buy-now]')].find((b) => b.offsetParent !== null);
  const target = () => root && (buyNow() || root.querySelector('[id^="ProductSubmitButton-"]'));
  const button = sticky.querySelector('[data-sticky-button]');
  const price = sticky.querySelector('[data-sticky-price]');
  const title = sticky.querySelector('[data-sticky-title]');
  const productTitle = root && root.querySelector('.product__title');
  if (!root || !target() || !button) return;

  const sync = () => {
    const t = target();
    if (!t) return;
    button.disabled = t.disabled || t.getAttribute('aria-disabled') === 'true';
    const label = t.querySelector('.g-buy-now__label') || t.querySelector('span');
    const labelText = (label ? label.textContent : t.textContent).trim();
    if (button.textContent !== labelText) button.textContent = labelText;
    const current = root.querySelector('[id^="price-"] .price--on-sale .price-item--sale, [id^="price-"] .price__regular .price-item--regular');
    if (current && price && price.textContent !== current.textContent.trim()) price.textContent = current.textContent.trim();
    // Pack elegido en «Elige tu oferta»; sin tarjetas, el título del producto.
    const checked = root.querySelector('.g-offer__input:checked');
    const pack = checked && root.querySelector(`label[for="${checked.id}"] .g-offer__name`);
    const text = pack ? pack.textContent.trim() : productTitle ? productTitle.textContent.trim() : '';
    if (title && text && title.textContent !== text) title.textContent = text;
  };
  button.addEventListener('click', () => {
    const t = target();
    if (t && !t.disabled) t.click();
  });
  new MutationObserver(sync).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'checked'] });
  root.addEventListener('change', sync);
  // Visible cuando el botón real ha quedado por encima de la pantalla. Se calcula en cada scroll
  // (un salto o un deslizamiento rápido no pasa por «visible», así que no basta con IntersectionObserver).
  let ticking = false;
  const update = () => {
    ticking = false;
    const t = target();
    const show = !!t && t.getBoundingClientRect().bottom < 0;
    if (show === sticky.classList.contains('is-visible')) return;
    sticky.classList.toggle('is-visible', show);
    sticky.toggleAttribute('inert', !show);
    sticky.setAttribute('aria-hidden', String(!show));
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    sync();
    onScroll();
  }, { passive: true });
  sync();
  update();
})();
