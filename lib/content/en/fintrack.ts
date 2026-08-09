import { CaseStudy } from "@/lib/types";

export const fintrack: CaseStudy = {
  slug: "fintrack",
  title: "Redesigning the key screens of the FinTrack app",
  subtitle:
    "I was asked to run research, test the interfaces, and propose improvements. It ended up as a full redesign of the key screens.",
  coverImage: "/images/fintrack/hero-promo.gif",
  coverWidth: 1005,
  coverHeight: 2037,
  coverPlain: true,
  sections: [
    {
      type: "lead",
      body: "A startup was building a fintech app for personal budgeting. By the time I joined, the first screens already existed — made quickly, without research, straight from an idea. The team felt something was off but couldn't pinpoint what.",
    },
    {
      type: "list",
      heading: "My role in the project",
      intro: "I worked as the product designer, responsible for:",
      items: [
        "Auditing the existing screens: identifying problems (information overload, unclear user scenarios).",
        "Competitive analysis: studying successful solutions in other fintech apps.",
        "UX design: designing the optimal user path.",
        "UI design: creating the visual style and key screens for pitches and testing.",
        "Usability testing: running scenario-based tests with target-audience representatives.",
      ],
    },
    {
      type: "list",
      heading: "Framing the task",
      items: [
        "Create a clear, modern interface that could be shown to investors.",
        "Establish a basic UX flow (how a user moves through the app and completes key tasks).",
        "Improve clarity and appeal compared to competitors.",
        "Validate hypotheses through UX testing and improve before launch.",
        "Prepare the product for the first usability tests with potential users.",
        "Give the team a foundation for further development and fundraising.",
      ],
    },
    {
      type: "text",
      heading: "Problems I ran into at the start",
      body: [
        "The product had no analytics → I had to rely only on UX tests and interviews.",
        "Time constraints → progress had to be shown to investors quickly.",
      ],
    },
    {
      type: "text",
      heading: "Research and getting started",
      body: [
        "I started by auditing the existing prototype. I walked through every key scenario as a user and logged the problems before talking to anyone — so I wouldn't project my own assumptions onto the interviews.",
      ],
    },
    {
      type: "image",
      src: "/images/fintrack/before-after.png",
      alt: "FinTrack — before and after redesign screens",
      width: 5600,
      height: 2392,
      shadow: true,
      flush: true,
    },
    {
      type: "numbered",
      heading: "Three systemic problems I saw right away",
      style: "cards",
      items: [
        {
          number: "01",
          title: "No primary CTA",
          body: "Landing on the home screen, it's unclear what to do. The add-expense button is hidden in the bottom navigation, with no emphasis.",
        },
        {
          number: "02",
          title: "Overloaded dashboard",
          body: "8+ metrics on one screen with no prioritization — balance, expenses, income, goals, history. The eye doesn't know where to look.",
        },
        {
          number: "03",
          title: "Numbers without context",
          body: "The numbers are there, but it's unclear whether they're good or bad. Is a ₽47,000 balance normal, or time to cut back?",
        },
      ],
    },
    {
      type: "text",
      heading: "User interviews",
      body: [
        "I ran 8 in-depth interviews through Pathway. Participants were people aged 24–36 who had either already tried budgeting or wanted to start. Interviews lasted 40–50 minutes; I deliberately didn't show the interface for the first 20 minutes — first I listened to their experience and habits.",
      ],
    },
    {
      type: "text",
      heading: "Key insights from the interviews",
      body: [
        "People don't want to \"keep a budget.\" They want to stop worrying about money.",
        "The entry barrier kills the habit. More than half the participants said they'd abandoned finance apps specifically because of friction at the start: a complicated onboarding, mandatory categories, unclear actions. The first experience was so heavy that they never reached the product's actual value.",
        "Context matters more than precision. Participants didn't want to know the exact amount down to the last ruble — they wanted to understand the trend. \"Spending more than usual\" or \"within budget\" mattered more than \"₽47,382.\"",
      ],
    },
    {
      type: "quote",
      text: "I don't want spreadsheets. I just want to open my phone and know: am I okay, or should I slow down?",
      author: "Maria, 29, marketer",
    },
    {
      type: "quote",
      text: "I tried ZenMoney — quit after two weeks. Too much to configure. Easier to just not track anything.",
      author: "Dmitry, 32, developer",
    },
    {
      type: "quote",
      text: "If I have to set something up on first launch, I'll close the app and never come back. I don't have time to figure it out.",
      author: "Anna, 27, designer",
    },
    {
      type: "text",
      body: [
        "I built user flows and immediately defined metrics for prototype testing: time to first expense (TTFE), number of steps, visibility of action buttons, and a subjective rating of ease and appeal.",
        "In parallel, I benchmarked competitors (ZenMoney, Monetal, CoinKeeper) and pulled out the patterns that worked: an explicit primary CTA, \"quick add,\" limiting the dashboard to 2–3 key metrics, and goal progress shown as simple indicators.",
      ],
    },
    {
      type: "image",
      src: "/images/fintrack/user-flow.png",
      alt: "FinTrack user flow",
      caption: "User flow: the path from the first screen to saving an expense",
    },
    {
      type: "text",
      heading: "Screen design",
      body: [],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/fintrack/analytics-bar.jpg", alt: "FinTrack statistics screen with a daily chart", width: 644, height: 734 },
        { src: "/images/fintrack/analytics-gauge.jpg", alt: "FinTrack statistics screen with a budget gauge", width: 644, height: 734 },
      ],
    },
    {
      type: "text",
      body: [
        "The \"Statistics\" screen is built around getting an insight fast: the header and the \"Expenses\" filter set the context, and the key amount sits front and center, cutting the time it takes to read the data and lowering cognitive load.",
        "\"Top categories\" cards with icons and amounts support quick scanning and visual comparison, reinforcing a sense of usefulness and affecting retention.",
        "The home screen is built around a single key idea — current financial state. A large total balance in the center creates instant insight and reduces orientation time, positively affecting engagement within the first seconds of interaction.",
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/fintrack/home-balance-1.png", alt: "FinTrack home screen with total balance", width: 644, height: 734 },
        { src: "/images/fintrack/home-balance-2.jpg", alt: "FinTrack home screen, recent transactions", width: 644, height: 734 },
      ],
    },
    {
      type: "text",
      body: [
        "The recent-transactions list closes the control loop: users can quickly check their transactions and confirm the data is correct, lowering anxiety and improving NPS.",
        "The quick-actions block supports the most frequent scenarios, shortening the path to the target action and reducing time on task, especially for regular users.",
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/fintrack/goals-single.jpg", alt: "FinTrack goal screen, single goal", width: 644, height: 734 },
        { src: "/images/fintrack/goals-double.jpg", alt: "FinTrack goals screen, multiple goals", width: 644, height: 734 },
      ],
    },
    {
      type: "highlight",
      label: "Insight",
      body: "From the interviews: people lost motivation to save because they couldn't see progress — the number on the account grew, but there was no sense of movement toward a goal.",
    },
    {
      type: "text",
      body: [
        "A progress bar creates a visual sense of momentum that motivates people to keep going — the Zeigarnik effect. The amounts next to it add concreteness.",
        "In testing, participants who saw the progress bar called their goal \"actually achievable\" twice as often as those who only saw a number.",
      ],
    },
    {
      type: "text",
      heading: "Lock screen",
      body: [
        "The lock screen is the one point where the phone is already in your hand but you haven't left for another app yet. The flow is deliberately stripped down to a minimum: a description field, a category list, and autosave with a loader.",
        "Undo in the toast solves the fear of an accidental entry — users can undo within 3–4 seconds.",
        "In testing, this flow cut \"forgotten\" expenses from 4–5 a week down to 1–2.",
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/fintrack/lock-description.jpg", alt: "FinTrack lock screen, description field", width: 644, height: 734 },
        { src: "/images/fintrack/lock-category.jpg", alt: "FinTrack lock screen, category list", width: 644, height: 734 },
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/fintrack/lock-loading.jpg", alt: "FinTrack lock screen, autosave with loader", width: 644, height: 734 },
        { src: "/images/fintrack/lock-undo.jpg", alt: "FinTrack lock screen, undo toast", width: 644, height: 734 },
      ],
    },
    {
      type: "text",
      heading: "Final shots",
      body: [],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/fintrack/home-balance-1.png", alt: "Final shot: FinTrack home screen", width: 644, height: 734 },
        { src: "/images/fintrack/analytics-bar.jpg", alt: "Final shot: FinTrack statistics", width: 644, height: 734 },
        { src: "/images/fintrack/goals-single.jpg", alt: "Final shot: FinTrack goal", width: 644, height: 734 },
        { src: "/images/fintrack/lock-undo.jpg", alt: "Final shot: FinTrack lock screen", width: 644, height: 734 },
      ],
    },
    {
      type: "text",
      heading: "Testing",
      body: [
        "After the redesign, I ran another round of testing on the same scenarios as the first stage. The results showed a marked improvement in user experience: 85% of users completed the \"add expense\" scenario without difficulty, 90% of respondents said the interface felt visually cleaner and easier to read, and logs and surveys showed 75% of users returning to the analytics screen more often.",
        "The average time to complete key scenarios dropped by 40%, pointing directly to lower cognitive load and a clearer interface structure.",
        "There was also a rise in interest in analytics — usage of that screen grew by 75%, confirming the redesign wasn't just simplifying basic actions, but encouraging deeper engagement with the product.",
      ],
    },
    {
      type: "stats",
      items: [
        { value: "−40%", label: "Time to complete scenarios" },
        { value: "85%", label: "Completion rate for \"add expense\"" },
        { value: "90%", label: "Rated the interface as clear" },
        { value: "+75%", label: "Growth in analytics engagement" },
      ],
    },
    {
      type: "text",
      heading: "What I'd do next",
      body: [
        "The concept is ready to pitch and for first-round testing.",
        "If the project continued, the next priority would be onboarding — the one critical flow we never tested. Activation rate (first expense within 24h) is the main untested hypothesis.",
      ],
    },
    {
      type: "numbered",
      items: [
        {
          number: "1",
          title: "Analytics and baseline metrics",
          body: "Wire up Amplitude, track activation rate, D1/D7/D30 retention, and feature adoption.",
        },
        {
          number: "2",
          title: "Onboarding sprint",
          body: "A/B test copy tone and step order. Goal: first expense within ≤24h of install.",
        },
        {
          number: "3",
          title: "Smart categorization sprint",
          body: "Auto-detect categories from the description — reduces friction on regular expense entry.",
        },
        {
          number: "4",
          title: "Personalization sprint",
          body: "Widgets and a configurable dashboard for users with more than 1 month of history.",
        },
      ],
    },
  ],
};
