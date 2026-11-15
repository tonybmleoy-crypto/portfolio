import type { ReactNode } from "react";
import { getDictionary, getSocialLinks } from "@/lib/content";
import { HomeShell } from "@/components/home/HomeShell";

export default function HomeLayoutEn({ children }: { children: ReactNode }) {
  return (
    <HomeShell locale="en" dict={getDictionary("en")} socialLinks={getSocialLinks()}>
      {children}
    </HomeShell>
  );
}
