import Image from "next/image";

/**
 * Rentag case cover: a still composition of the real deal screens. The safe
 * deal page on a MacBook, the stage card on review floating to its left and
 * the "propose changes" modal to its right, over the brand's dark violet.
 *
 * Scene units: 1em = 1/60 of the card width (a 60em × 40em, 3:2 stage).
 * Floating screenshots keep their aspect ratio; the laptop screen is 16:10.4
 * and shows the top of the deal page.
 */

const SHADOW = "0 0.3em 0.6em rgba(8,4,24,0.35), 0 1.6em 3.6em rgba(8,4,24,0.55)";

export function RentagCover() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 select-none overflow-hidden [container-type:inline-size]"
      style={{
        background:
          "radial-gradient(45% 55% at 78% 8%, rgba(122,44,246,0.55) 0%, rgba(122,44,246,0) 100%), radial-gradient(40% 50% at 8% 92%, rgba(94,60,255,0.4) 0%, rgba(94,60,255,0) 100%), linear-gradient(180deg, #17122e 0%, #0e0b1d 100%)",
      }}
    >
      <div className="absolute inset-0" style={{ fontSize: "calc(100cqw / 60)" }}>
        <MacBook className="left-[8em] top-[5.6em] w-[44em]" />

        {/* Stage 4 on review: approve and pay, or send back. */}
        <Shot src="stage-review.png" w={418} h={644} className="left-[2.4em] top-[16em] w-[12em] rounded-[0.9em]" sizes="(max-width: 1024px) 22vw, 140px" />

        {/* Living terms: the revised total awaiting the other side's approval. */}
        <Shot src="revision-terms.png" w={520} h={1245} className="left-[46em] top-[4em] w-[12em] rounded-[0.9em]" sizes="(max-width: 1024px) 22vw, 140px" />
      </div>
    </div>
  );
}

/** A MacBook drawn in CSS: black bezel with a notch, aluminium base with the opening lip. */
function MacBook({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`}>
      {/* Lid */}
      <div className="relative rounded-t-[1.5em] bg-[#0b0b0e] px-[0.85em] pb-[1em] pt-[0.85em] shadow-[inset_0_0_0_0.12em_#3c3c44,0_2em_4em_rgba(8,4,24,0.5)]">
        <div className="relative overflow-hidden rounded-[0.5em] bg-white" style={{ aspectRatio: "16 / 10.4" }}>
          <Image src="/images/rentag-cover/deal.png" alt="" fill sizes="(max-width: 1024px) 70vw, 480px" quality={90} className="object-cover object-top" />
          <span className="absolute left-1/2 top-0 h-[0.9em] w-[5.2em] -translate-x-1/2 rounded-b-[0.45em] bg-[#0b0b0e]" />
        </div>
      </div>
      {/* Base */}
      <div className="relative -mx-[3em] h-[1.3em] rounded-b-[1.2em] rounded-t-[0.2em] bg-[linear-gradient(180deg,#e4e5ea_0%,#c3c5cc_45%,#8e9098_100%)] shadow-[0_1.2em_2.4em_rgba(8,4,24,0.6)]">
        <span className="absolute left-1/2 top-0 h-[0.45em] w-[7em] -translate-x-1/2 rounded-b-[0.5em] bg-[linear-gradient(180deg,#9b9da5,#c8cad0)]" />
      </div>
    </div>
  );
}

function Shot({ src, w, h, className, sizes }: { src: string; w: number; h: number; className: string; sizes: string }) {
  return (
    <div className={`absolute overflow-hidden bg-white ${className}`} style={{ aspectRatio: `${w} / ${h}`, boxShadow: SHADOW }}>
      <Image src={`/images/rentag-cover/${src}`} alt="" fill sizes={sizes} quality={90} className="object-cover" />
    </div>
  );
}
