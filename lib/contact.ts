/**
 * Every "Let's talk?" button opens the same contact dialog. The dialog is
 * mounted once per page; buttons reach it through this window event, so they
 * need no shared React context.
 */
export const CONTACT_OPEN_EVENT = "contact:open";

export function openContact(source: "profile" | "case_nav" = "profile") {
  window.dispatchEvent(new CustomEvent(CONTACT_OPEN_EVENT, { detail: { source } }));
}
