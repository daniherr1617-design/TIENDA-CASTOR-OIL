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
