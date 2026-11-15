"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/**
 * A case image that opens full screen on click. Flow maps and screen sets are
 * far wider than the 680px column, so at column size their labels can't be
 * read. Full screen first fits the image to the screen; clicking the image
 * then shows it at its real size, scrollable both ways.
 */
export function ZoomImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  labels,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  labels: { zoom: string; closeZoom: string };
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [actual, setActual] = useState(false);

  const open = () => {
    setActual(false);
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    dialog.focus();
  };

  return (
    <>
      <button type="button" onClick={open} aria-label={labels.zoom} className="block w-full cursor-zoom-in">
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} quality={90} className={className} />
      </button>

      <dialog
        ref={ref}
        tabIndex={-1}
        aria-label={alt}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="zoom-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 outline-none"
      >
        <div
          className={`flex h-full w-full overflow-auto overscroll-contain ${actual ? "" : "items-center justify-center p-4 sm:p-10"}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) ref.current?.close();
          }}
        >
          {actual ? (
            // Real size: the original file at its own pixel width (the layout
            // width/height props are only aspect hints and may not match it).
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} onClick={() => setActual(false)} className="m-auto max-w-none cursor-zoom-out" />
          ) : (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              quality={90}
              onClick={() => setActual(true)}
              className="h-auto max-h-full w-auto max-w-full cursor-zoom-in rounded-[20px] object-contain"
            />
          )}
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
