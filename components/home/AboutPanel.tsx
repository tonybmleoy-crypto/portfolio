import type { Track } from "@/lib/content";
import type { HomeContent } from "@/lib/types";
import { FadeIn } from "../FadeIn";
import { MusicPlayer } from "../MusicPlayer";

export function AboutPanel({
  content,
  musicTrack,
  musicLinks,
}: {
  content: HomeContent;
  musicTrack: Track | null;
  musicLinks: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      <FadeIn>
        <div className="rounded-[28px] bg-surface p-6 shadow-card lg:rounded-[36px] lg:p-8">
          <h2 className="text-[32px] font-medium leading-8 tracking-[-0.031em]">{content.about.heading}</h2>
          <div className="mt-5 max-w-[560px] space-y-4 leading-6 tracking-[-0.016em]">
            {content.about.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* The player draws its own hairline frame. */}
      {musicTrack && (
        <FadeIn delay={0.05}>
          <MusicPlayer track={musicTrack} links={musicLinks} />
        </FadeIn>
      )}
    </div>
  );
}
