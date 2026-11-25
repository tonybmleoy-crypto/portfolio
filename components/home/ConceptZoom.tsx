"use client";

import { useRef, type ReactNode } from "react";

/**
 * Opens a concept full screen on click, the same way case images do
 * (ZoomImage): a native dialog over a blurred scrim, closed by the cross, a
 * click on the scrim or Esc. The grid renders both the tile and the enlarged
 * view on the server; this only adds the open/close behaviour.
 */
export function ConceptZoom({
  title,
  labels,
  tile,
  children,
}: {
  title: string;
  labels: { zoom: string; closeZoom: string };
  tile: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  const open = () => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.focus();
  };

  return (
    <>
      <button type="button" onClick={open} aria-label={`${labels.zoom}: ${title}`} className="block w-full cursor-zoom-in rounded-[20px] text-left lg:rounded-[24px]">
        {tile}
      </button>

      <dialog
        ref={ref}
        tabIndex={-1}
        aria-label={title}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="zoom-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 outline-none"
      >
        <div
          className="flex h-full w-full overflow-auto overscroll-contain p-4 sm:p-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) ref.current?.close();
          }}
        >
          {/* m-auto centres the content yet lets it scroll when wider than the screen. */}
          <div className="m-auto flex h-full max-h-[900px] items-center gap-4 sm:gap-8">{children}</div>
        </div>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={labels.closeZoom}
          className="fixed right-4 top-4 flex size-11 items-center justify-center rounded-full bg-surface text-foreground shadow-card transition-transform active:scale-95"
        >
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </dialog>
    </>
  );
}
