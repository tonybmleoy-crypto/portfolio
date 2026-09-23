import { getDictionary, getMusicLinks, getSocialLinks, MUSIC_TRACK } from "@/lib/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HomeTabs } from "@/components/HomeTabs";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const dict = getDictionary("ru");
  const socialLinks = getSocialLinks();

  return (
    <>
      <Header locale="ru" dict={dict} socialLinks={socialLinks} />
      <main className="flex-1">
        <Hero content={dict.home} socialLinks={socialLinks} />
        <HomeTabs
          locale="ru"
          content={dict.home}
          socialLinks={socialLinks}
          musicTrack={MUSIC_TRACK}
          musicLinks={getMusicLinks()}
        />
      </main>
      <Footer locale="ru" dict={dict} socialLinks={socialLinks} />
    </>
  );
}
