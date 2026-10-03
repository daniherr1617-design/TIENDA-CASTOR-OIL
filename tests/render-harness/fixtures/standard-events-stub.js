// SOLO TEST: sustituto local de https://cdn.shopify.com/storefront/standard-events.js
// (el proxy del entorno bloquea cdn.shopify.com; en Shopify el módulo real existe).
const mk = (name) => class extends Event { constructor(detail) { super('standard:' + name, { bubbles: true }); this.detail = detail; } };
export function createViewEventElement(Base = HTMLElement) {
  return class extends Base { connectedCallback() {} disconnectedCallback() {} dispatchViewEvent() {} };
}
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); promise.catch(() => {}); return { promise, resolve, reject }; };
export const PageViewEvent = mk('page_view');
export class CartLinesUpdateEvent extends mk('cart_lines_update') { static createPromise() { return deferred(); } static createCartFromAjaxResponse(c) { return c; } }
export const CartErrorEvent = mk('cart_error');
export class CartNoteUpdateEvent extends mk('cart_note_update') { static createPromise() { return deferred(); } static createCartFromAjaxResponse(c) { return c; } }
