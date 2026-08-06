import { CaseStudy } from "@/lib/types";

export const sevenpr: CaseStudy = {
  slug: "7pr",
  title: "Building key flows and maintaining the design system at 7 PRUDOV DEV",
  subtitle:
    "7 Prudov Investments is an investment company that let users register, browse real-estate assets, invest in them, and track their portfolio through a dashboard.",
  coverImage: "/images/7pr/hero.png",
  sections: [
    {
      type: "text",
      heading: "The core task",
      body: [
        "Build key user flows from scratch, ensure consistency, improve readability and navigation — all while respecting the spec and existing business-logic constraints.",
      ],
    },
    {
      type: "text",
      heading: "My role in the project",
      body: [
        "I worked as the product designer. My responsibilities included:",
        "building and evolving the design system;",
        "designing key flows from scratch: registration, dashboards, and part of the property screens;",
        "pairing with another designer to keep the interfaces consistent;",
        "following the spec and business logic while designing.",
        "I also worked closely with engineering, aligned on decisions, and made sure the interfaces stayed scalable as the platform grew.",
      ],
    },
    {
      type: "text",
      heading: "Framing the task",
      body: [
        "Context: a web platform for real-estate investing with a given business logic and set of user scenarios.",
        "Problem: the lack of consistency and a visual system led to high cognitive load for users, lower readability of key scenarios, slower development, and a harder-to-maintain product.",
        "Constraints: every screen built from scratch; user-path logic set by the spec; business scenarios couldn't change; working in a pair with another designer; the interface had to be scalable.",
        "Design task: design interfaces so user scenarios stay clear without changing the underlying logic, key actions and data can be read quickly, and the team can scale the product.",
        "Success criteria: consistent visual and behavioral logic across screens; clear navigation and hierarchy; less visual noise; interfaces ready to scale.",
      ],
    },
    {
      type: "text",
      heading: "Discovery",
      body: [
        "Before drawing any screens, I ran research first to better understand the product's context and users.",
      ],
    },
    {
      type: "highlight",
      label: "Key insight",
      body: "Users see real-estate investing as a serious, high-stakes decision. The interface needed to convey reliability and transparency — not through words, but through the structure and behavior of the elements themselves.",
    },
    {
      type: "numbered",
      items: [
        {
          number: "1",
          title: "Spec and business-logic audit",
          body: "Read the spec like a map of constraints. Logged contradictions and places where the logic wasn't defined, because that's usually where design problems show up.",
        },
        {
          number: "2",
          title: "Internal data analysis",
          body: "There wasn't much data, but it pointed to three problem areas: registration, the dashboard, and the property catalog — the three key user scenarios.",
        },
        {
          number: "3",
          title: "User interviews",
          body: "A handful of in-depth interviews — not to land on ready-made solutions, but to gauge the audience's financial literacy and risk tolerance.",
        },
        {
          number: "4",
          title: "Sync with engineering",
          body: "To lock in technical constraints early. That saved several iterations later on.",
        },
      ],
    },
    {
      type: "text",
      heading: "Design system and UI kit",
      body: [
        "I started by building the design system:",
        "Assembled a UI kit of 40+ components: buttons, input fields, property cards, tables, navigation elements.",
        "Used variant components in Figma so layouts would be easy to update.",
        "Added color tokens for different component states: success, error, warning.",
        "Wrote baseline guidelines for using the components, covering spacing, typography, colors, and states.",
      ],
    },
    {
      type: "image",
      src: "/images/7pr/ui-kit.png",
      alt: "7 Prudov dev design system UI kit",
    },
    {
      type: "highlight",
      label: "What I ran into",
      body: "The first versions of the components didn't line up: buttons of different sizes, fields with inconsistent behavior. It took several iterations before the system became unified. That took longer than I'd planned — but that stage is exactly why everything after it moved much faster.",
    },
    {
      type: "text",
      heading: "Key screens",
      body: [
        "Dashboard. I built the hierarchy so key KPIs could be read effortlessly. Details are available but don't compete with the main numbers. Cards segment the information — what matters is visible without scrolling.",
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/7pr/dashboard.png", alt: "7 Prudov dev dashboard" },
        { src: "/images/7pr/dashboard-02.png", alt: "7 Prudov dev dashboard, alternate state" },
      ],
    },
    {
      type: "text",
      body: [
        "Property catalog. The main scenario here is comparison and decision-making. I structured the cards so key parameters (yield, entry threshold, term) can be read at a glance. Filters don't reset the context or send users back to the start.",
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/7pr/catalog.png", alt: "7 Prudov dev property catalog" },
        { src: "/images/7pr/catalog-02.png", alt: "7 Prudov dev property catalog, card detail" },
      ],
    },
    {
      type: "text",
      heading: "Results",
      body: [
        "−18% unique interface elements — fewer duplicates and inconsistent patterns. Sped up design reviews and lowered the ongoing cost of maintaining the product.",
        "Fewer discrepancies at QA — unifying the components shrank the gap between design and implementation.",
        "The design system became a working tool — a living library the team builds from when adding new modules.",
        "Speed of building new screens rose by roughly 30%. Developer questions to designers dropped noticeably — from 5–7 questions per screen down to 1–2.",
      ],
    },
    {
      type: "stats",
      items: [
        { value: "−18%", label: "Unique interface elements" },
        { value: "QA ↓", label: "Fewer discrepancies at QA" },
        { value: "+30%", label: "Faster to build new screens" },
        { value: "1–2", label: "Questions per screen, down from 5–7" },
      ],
    },
    {
      type: "image",
      src: "/images/7pr/results.png",
      alt: "7 Prudov dev design system results",
    },
    {
      type: "text",
      heading: "Reflection",
      body: [
        "When data is scarce, that's not a license to invent insights. It's a signal to lean on proven principles, iterate fast, and document decisions in a way that lets you revisit them once new data shows up.",
        "A design system is trust inside a team. Without a shared language, every decision gets made from scratch. A conversation with engineering up front is an investment that pays off on every iteration after.",
      ],
    },
  ],
};
