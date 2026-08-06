import { getDictionary } from "@/lib/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HomeTabs } from "@/components/HomeTabs";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const dict = getDictionary("ru");

  return (
    <>
      <Header locale="ru" dict={dict} />
      <main className="flex-1">
        <Hero content={dict.home} />
        <HomeTabs locale="ru" content={dict.home} />
      </main>
      <Footer dict={dict} />
    </>
  );
}
