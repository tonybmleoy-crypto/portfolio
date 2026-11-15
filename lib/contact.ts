/**
 * Every "Let's talk?" button opens the same contact dialog. The dialog is
 * mounted once per page; buttons reach it through this window event, so they
 * need no shared React context.
 */
export const CONTACT_OPEN_EVENT = "contact:open";

export function openContact() {
  window.dispatchEvent(new Event(CONTACT_OPEN_EVENT));
}
