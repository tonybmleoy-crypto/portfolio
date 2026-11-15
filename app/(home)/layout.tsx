import type { ReactNode } from "react";
import { getDictionary, getSocialLinks } from "@/lib/content";
import { HomeShell } from "@/components/home/HomeShell";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <HomeShell locale="ru" dict={getDictionary("ru")} socialLinks={getSocialLinks()}>
      {children}
    </HomeShell>
  );
}
