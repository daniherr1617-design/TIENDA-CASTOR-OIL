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
