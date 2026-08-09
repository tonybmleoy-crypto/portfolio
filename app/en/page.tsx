import { getDictionary } from "@/lib/content";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HomeTabs } from "@/components/HomeTabs";
import { Footer } from "@/components/Footer";

export default function HomePageEn() {
  const dict = getDictionary("en");

  return (
    <>
      <Header locale="en" dict={dict} />
      <main className="flex-1">
        <Hero content={dict.home} />
        <HomeTabs locale="en" content={dict.home} />
      </main>
      <Footer locale="en" dict={dict} />
    </>
  );
}
