import { CaseStudy } from "@/lib/types";

export const linky: CaseStudy = {
  slug: "linky",
  title: "Linky: your links, one keystroke away in any text field",
  subtitle:
    "How I designed and shipped a desktop app for Windows and macOS that pastes saved links with a single shortcut",
  coverImage: "/images/linky/cover.jpg",
  coverWidth: 2400,
  coverHeight: 1500,
  coverVideo: { mp4: "/images/linky/hero.mp4", width: 3200, height: 2000 },
  sections: [
    { type: "chapter", title: "About the project" },
    {
      type: "text",
      body: [
        "Linky lives in the tray and opens a quick menu next to your cursor on Ctrl + Alt + V. The menu holds the links and texts you send every day: a portfolio, a calendar for calls, payment details, reply templates. You pick an entry and Linky pastes it into the field where you were typing.",
        "I built the project alone: research, UX, visual design, the design system in Figma, the app code, the landing page and the releases.",
      ],
    },
    {
      type: "facts",
      items: [
        { label: "Role", value: "Product designer and developer" },
        { label: "Platforms", value: "Windows 10+ and macOS 12+" },
        { label: "Languages", value: "Russian and English" },
        { label: "Tools", value: "Figma, React, Electron, TypeScript" },
      ],
    },

    { type: "chapter", title: "S · Situation" },
    {
      type: "text",
      heading: "The problem",
      body: [
        "Several times a day I had to send the same links: my portfolio, Behance, Telegram. I left the conversation, hunted for the link in tabs, notes or old messages, copied it and came back. The paste itself takes seconds, but after the search I had lost the thought I was typing.",
      ],
    },
    {
      type: "tips",
      heading: "Three pains",
      items: [
        "Context switching: while you look for a link, you lose the reply you were writing",
        "Links are scattered: bookmarks, notes, a messenger's saved messages, a tab you closed yesterday",
        "The clipboard holds one thing: you copy a link and lose whatever you copied before",
      ],
    },
    {
      type: "text",
      heading: "Who it's for",
      body: [
        "Anyone who writes a lot lives with the same routine: designers and freelancers with a portfolio, salespeople with a calendar link, recruiters with job posts, support teams with canned replies.",
      ],
    },

    { type: "chapter", title: "T · Task" },
    {
      type: "text",
      body: [
        "Get the right link into the text field with one keystroke, without leaving the current app.",
      ],
    },
    {
      type: "table",
      columns: ["Requirement", "Why it matters"],
      rows: [
        ["Work in any app", "People send links in Telegram, email, the browser and forms"],
        ["Open at the cursor", "The eyes stay where the person is typing"],
        ["Paste by itself", "Pressing Ctrl + V after choosing is an extra step"],
        ["Leave the clipboard alone", "The person may have copied something important before"],
        ["Work without an account or internet", "The links are personal, and sign-up scares people off"],
        ["Windows and macOS, Russian and English", "My audience works on both systems"],
      ],
    },

    { type: "chapter", title: "A · Actions" },
    {
      type: "text",
      heading: "Research: how people solve this today",
      body: [
        "Before drawing anything, I went through five ways people solve the task today, from browser bookmarks to launchers for power users.",
      ],
    },
    {
      type: "table",
      columns: ["Solution", "What works", "What's missing"],
      rows: [
        [
          "Browser bookmarks",
          "Everyone has them",
          "They only work in the browser, and you still have to copy the link",
        ],
        [
          "Notes and a messenger's saved messages",
          "Within reach on phone and computer",
          "You have to switch apps and find the entry in the feed",
        ],
        [
          "Windows clipboard history (Win + V)",
          "Built into the system",
          "Made for recent copies; pinned entries have no names or folders",
        ],
        [
          "TextExpander, Espanso",
          "Paste text from abbreviations",
          "You have to remember the abbreviations, and setup is hard for non-technical people",
        ],
        [
          "Raycast, Alfred",
          "Powerful launchers with snippets",
          "Too heavy for one task and built mainly for macOS",
        ],
      ],
    },
    {
      type: "insight",
      label: "Takeaway",
      body: "Each option covers part of the task. I needed a tool with a single function: it shows up at the moment of pasting and asks you to remember nothing.",
    },
    {
      type: "text",
      heading: "Finding the solution",
      body: [
        "I wrote the scenario as three steps and checked every decision against it: save a link, press the shortcut, pick an entry. I cut everything that didn't make those steps faster.",
      ],
    },
    {
      type: "image",
      src: "/images/linky/steps.png",
      alt: "Three steps of the Linky scenario: save a link, press the shortcut, pick an entry",
      caption: "The scenario: save a link, press Ctrl + Alt + V, pick an entry",
      flush: true,
      shadow: true,
      width: 2400,
      height: 976,
    },
    {
      type: "tips",
      heading: "Key decisions",
      items: [
        "A global Ctrl + Alt + V shortcut: it sits next to the familiar Ctrl + V and other apps rarely use it",
        "The menu appears at the text cursor, and opens above it when there is no room below",
        "After you choose, Linky returns focus to the app, presses paste for you, then restores the previous clipboard content",
        "Digits 1 to 9 on the first entries: I paste my most frequent links without searching",
      ],
    },
    {
      type: "text",
      heading: "Two visual iterations",
      body: [
        "I built the first version in the spirit of Wispr Flow: cream paper, a serif typeface, lavender accents. On a Windows desktop it looked heavy and foreign. In the second I kept the warmth only in the glow behind the glass and moved the interface to neutral grays with black accents. Now the app looks like a system utility, and the light and dark themes come from the same tokens.",
      ],
    },
    {
      type: "image",
      src: "/images/linky/iterations.png",
      alt: "The first iteration with warm colors and serifs next to the final glass version",
      flush: true,
      width: 2400,
      height: 818,
    },
    {
      type: "text",
      heading: "Design system",
      body: [
        "I set up colors, spacing, radii and fonts as Figma variables with light and dark modes. The CSS variables in the code have the same names, so a token moves from Figma into the app without translation. From 11 base components I built 7 composite ones and the quick menu itself.",
      ],
    },
    {
      type: "image",
      src: "/images/linky/designsys.png",
      alt: "The Linky design system: colors, typography and components",
      caption: "Tokens with light and dark modes, the Nunito Sans typeface and a component library",
      flush: true,
      shadow: true,
      width: 2400,
      height: 1475,
    },
    {
      type: "text",
      heading: "Key screens",
      body: [
        "The main screen of the product is the quick menu: search, folders, digits 1 to 9 and a paste hint. Everything else opens in the library window: entries, folders, an editor and settings in plain words.",
      ],
    },
    {
      type: "image",
      src: "/images/linky/demo.gif",
      alt: "Demo: pasting links through the Linky quick menu",
      caption: "Demo: the portfolio link through search, the calendar link with the digit 2",
      flush: true,
      shadow: true,
      width: 960,
      height: 600,
    },
    {
      type: "image",
      src: "/images/linky/library.png",
      alt: "The Linky library window in dark theme",
      caption: "The library in dark theme: folders, paste counts and the entry editor",
      flush: true,
      shadow: true,
      width: 1500,
      height: 977,
    },
    {
      type: "imageGrid",
      images: [
        {
          src: "/images/linky/onboarding.png",
          alt: "Linky onboarding, first step",
          width: 1500,
          height: 977,
          caption: "Onboarding: the first step",
        },
        {
          src: "/images/linky/settings.png",
          alt: "Linky settings",
          width: 1500,
          height: 977,
          caption: "Settings in plain words",
        },
      ],
    },
    {
      type: "text",
      heading: "Fixes after the first demos",
      body: ["I showed work-in-progress versions and fixed whatever raised questions right away."],
    },
    {
      type: "table",
      columns: ["What people noticed", "What I did"],
      rows: [
        [
          "The word “palette” in settings was unclear",
          "Renamed it to “quick menu” and rewrote the labels to describe the result",
        ],
        [
          "Dropdowns opened the native Windows menu",
          "Built my own dropdown in the app's style with keyboard control",
        ],
        [
          "In dark theme the white banner hurt the eyes",
          "Turned the banner into a calm dark card and raised label contrast",
        ],
        ["Inter looked bad in the Russian version", "Moved the app and the site to Nunito Sans"],
        [
          "macOS wouldn't let people open the app",
          "Described the workaround in the FAQ and added a permission request for pasting",
        ],
      ],
    },
    {
      type: "text",
      heading: "Landing page and demo",
      body: [
        "I built the landing page from the app's own components. I didn't screen-record the demo video: I described the scene in code as a function of time, and a script renders it frame by frame into MP4, WebM and GIF. When the interface changes, I rebuild the video with one command.",
      ],
    },
    {
      type: "image",
      src: "/images/linky/landing.png",
      alt: "The Linky landing page: first screen",
      caption: "The landing page: first screen with the quick menu and download buttons for Windows and macOS",
      flush: true,
      shadow: true,
      width: 2400,
      height: 1680,
    },

    { type: "chapter", title: "R · Result" },
    {
      type: "text",
      body: [
        "I now paste my portfolio, Behance and Telegram into any chat with one keystroke. The code sits in an open repository, GitHub Actions builds the installers for Windows and macOS, and since version 0.2.0 Linky offers to update itself.",
      ],
    },
    {
      type: "stats",
      items: [
        { value: "2", label: "platforms: Windows and macOS" },
        { value: "2", label: "GitHub releases: 0.1.0 and 0.2.0" },
        { value: "40", label: "components and icons in the design system" },
        { value: "13 s", label: "demo video rendered from code" },
      ],
    },
    {
      type: "tips",
      heading: "What's next",
      items: [
        "Sign the app for Windows and macOS to remove install warnings",
        "Collect feedback from the first users and see which entries get pasted most",
        "Add sync between devices as a paid feature",
      ],
    },
  ],
};
