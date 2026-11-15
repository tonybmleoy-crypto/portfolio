"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, CopySuccess, Send2, Sms } from "iconsax-react";
import type { SocialLinks } from "@/lib/content";
import type { HomeContent } from "@/lib/types";
import { CONTACT_OPEN_EVENT } from "@/lib/contact";

function LinkedInIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10.5V16M8 7.75v.01M11.5 16v-5.5M11.5 13a2.5 2.5 0 0 1 5 0v3" />
    </svg>
  );
}

function BehanceIcon() {
  return (
    <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6.5h4.5a2.75 2.75 0 0 1 0 5.5H3V6.5Zm0 5.5h5a3 3 0 0 1 0 6H3v-6Z" />
      <path d="M15 7.5h5M14 14.5h7a3.5 3.5 0 1 0-1.1 2.6" />
    </svg>
  );
}

function lastPathSegment(url: string): string {
  try {
    return new URL(url).pathname.split("/").filter(Boolean).pop() ?? url;
  } catch {
    return url;
  }
}

function Row({ href, icon, label, value, trailing }: { href: string; icon: ReactNode; label: string; value: string; trailing?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-[20px] pr-3 transition-colors hover:bg-[color:var(--fill-quiet)]">
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noreferrer"
        className="flex min-w-0 flex-1 items-center gap-4 rounded-[20px] py-3 pl-4"
      >
        <span className="shrink-0 text-muted">{icon}</span>
        <span className="min-w-0">
          <span className="block text-sm text-muted">{label}</span>
          <span className="mt-1 block truncate text-xl font-medium tracking-[-0.016em]">{value}</span>
        </span>
      </a>
      {trailing}
    </div>
  );
}

/**
 * One dialog per page, opened by any openContact() call and by the C key.
 * The key is matched by its physical position (KeyC), so it also works on a
 * Russian layout, and never fires with a modifier held (Cmd+C must copy).
 */
export function ContactDialog({ socialLinks, labels }: { socialLinks: SocialLinks; labels: HomeContent["contactDialog"] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const open = () => {
      const dialog = ref.current;
      if (dialog && !dialog.open) dialog.showModal();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "KeyC" || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat) return;
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;
      e.preventDefault();
      open();
    };
    window.addEventListener(CONTACT_OPEN_EVENT, open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(CONTACT_OPEN_EVENT, open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(socialLinks.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="contact-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className="contact-dialog m-auto w-[min(440px,calc(100vw-32px))] rounded-[32px] bg-surface p-4 text-foreground shadow-card max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none max-sm:pb-8"
    >
      <div className="flex items-center justify-between py-2 pl-4 pr-1">
        <h2 id="contact-title" className="text-2xl font-medium tracking-[-0.021em]">
          {labels.title}
        </h2>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={labels.close}
          className="flex size-11 items-center justify-center rounded-full bg-[color:var(--fill-quiet)] transition-[background-color,transform] duration-150 hover:bg-[color:var(--fill-quiet-hover)] active:scale-95"
        >
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex flex-col">
        <Row
          href={socialLinks.telegram}
          icon={<Send2 color="currentColor" size={24} variant="Linear" />}
          label="Telegram"
          value={socialLinks.telegramHandle}
        />
        <Row
          href={`mailto:${socialLinks.email}`}
          icon={<Sms color="currentColor" size={24} variant="Linear" />}
          label="Email"
          value={socialLinks.email}
          trailing={
            <button
              type="button"
              onClick={copyEmail}
              aria-label={copied ? labels.copied : labels.copy}
              title={copied ? labels.copied : labels.copy}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--fill-quiet)] transition-[background-color,transform] duration-150 hover:bg-[color:var(--fill-quiet-hover)] active:scale-95"
            >
              {copied ? (
                <CopySuccess color="currentColor" size={18} variant="Linear" />
              ) : (
                <Copy color="currentColor" size={18} variant="Linear" />
              )}
            </button>
          }
        />
        <Row href={socialLinks.linkedin} icon={<LinkedInIcon />} label="LinkedIn" value="Anton Lopatin" />
        <Row href={socialLinks.behance} icon={<BehanceIcon />} label="Behance" value={lastPathSegment(socialLinks.behance)} />
      </div>
    </dialog>
  );
}
