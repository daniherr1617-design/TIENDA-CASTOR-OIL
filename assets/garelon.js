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

/* Compra fija de la ficha (sections/garelon-sticky-cta.liquid): pulsa el botón real de Dawn,
   copia su estado (texto, desactivado) y el precio de la variante elegida. */
(() => {
  const sticky = document.querySelector('[data-garelon-sticky]');
  if (!sticky) return;
  const root = document.querySelector('product-info[id^="MainProduct-"]');
  const target = () => root && root.querySelector('[id^="ProductSubmitButton-"]');
  const button = sticky.querySelector('[data-sticky-button]');
  const price = sticky.querySelector('[data-sticky-price]');
  if (!root || !target() || !button) return;

  const sync = () => {
    const t = target();
    if (!t) return;
    button.disabled = t.disabled || t.getAttribute('aria-disabled') === 'true';
    const label = t.querySelector('span');
    button.textContent = (label ? label.textContent : t.textContent).trim();
    const current = root.querySelector('[id^="price-"] .price--on-sale .price-item--sale, [id^="price-"] .price__regular .price-item--regular');
    if (current && price) price.textContent = current.textContent.trim();
  };
  button.addEventListener('click', () => {
    const t = target();
    if (t && !t.disabled) t.click();
  });
  new MutationObserver(sync).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
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
  window.addEventListener('resize', onScroll, { passive: true });
  sync();
  update();
})();
