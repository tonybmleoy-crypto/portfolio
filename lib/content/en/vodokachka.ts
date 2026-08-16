import { CaseStudy } from "@/lib/types";

export const vodokachka: CaseStudy = {
  slug: "vodokachka",
  title: "VODOKACHKA",
  subtitle: "0 → 1: building a food ordering service for a bar",
  coverImage: "/images/vodokachka/cover.png",
  coverWidth: 1040,
  coverHeight: 2072,
  coverPlain: true,
  coverSide: true,
  sections: [
    {
      type: "lead",
      body: "Waiters couldn't keep up with orders during peak hours: a guest waited 12 minutes just for their order to enter the system, before food prep even started. I designed a self-ordering service for guests' phones that took order-taking off the waiters without touching the kitchen. It's been running in the bar since launch.",
    },
    {
      type: "list",
      heading: "Project details",
      items: [
        "Role: product designer, the only one on the project",
        "Timeline: 4 months, development took 2 weeks by an external team from the banking partner",
        "Technical scope: QR → web app, no install, integrated with iiko, payment on the bank's side",
        "Status: rolled out across the whole floor, still running today",
      ],
    },
    {
      type: "text",
      heading: "Context",
      body: [
        "Vodokachka is a 120-seat bar in Tyumen. On a regular evening it's 70–90 guests and 2–3 waiters; at a party, 200–250 guests share the same 120 seats with 5–6 waiters. At that ratio, \"getting to everyone\" is physically impossible. The bar drives 70% of revenue, so the solution had to be judged by operational metrics, not money.",
      ],
    },
    {
      type: "text",
      heading: "The problem",
      body: [
        "The client came in with a solution already framed: \"we need an online menu.\" That's a description of a solution, not a problem. Measurements showed the time from being seated to receiving a dish grew by 20–25 minutes at peak.",
      ],
    },
    {
      type: "insight",
      label: "The diagnosis",
      body: "The kitchen wasn't the bottleneck: it handled the volume fine. The delay accumulated at order-taking — waiters couldn't \"turn\" that many orders, and orders reached the kitchen in uneven batches instead of a steady stream. I found this out before I drew a single screen. If the kitchen had been the bottleneck, self-ordering would only have made things worse.",
    },
    {
      type: "list",
      heading: "Scope and constraints",
      items: [
        "Alcohol out of scope — the service covers 30% of revenue; guests still order drinks from a waiter",
        "Development on the banking partner's side, 2 weeks — anything that didn't fit got cut from v1",
        "The menu lives in iiko — prices, stop-list and availability update automatically",
        "Web, not an app — a guest visits for one evening; an install would mean losing the audience",
      ],
    },
    {
      type: "list",
      heading: "Three ways to take load off order-taking",
      items: [
        "Hire more waiters — rejected: expensive year-round for load that only hits at peak",
        "Route orders through floor managers — rejected: the bottleneck just changes its name",
        "QR ordering from the guest's phone — chosen: throughput stops depending on headcount",
      ],
    },
    {
      type: "insight",
      label: "Hypothesis",
      body: "If you remove the waiter from order-taking, the time to an order entering the system stops depending on headcount, and ordering becomes cheap enough, effort-wise, that guests order more than once an evening.",
    },
    {
      type: "text",
      heading: "Design",
      body: [
        "A guest scans the QR code on the table, builds an order in the menu, pays on the bank's side. The waiter delivers the dish to the table it came from. I was competing with the waiter, not with other digital menus. The bar was \"no slower than raising a hand,\" with zero mandatory steps like registration.",
      ],
    },
    {
      type: "imageGrid",
      images: [
        { src: "/images/vodokachka/screen-menu.png", alt: "The menu screen", width: 1040, height: 2072 },
        { src: "/images/vodokachka/screen-dish.png", alt: "Dish card with composition and weight", width: 1040, height: 2072 },
        { src: "/images/vodokachka/screen-checkout.png", alt: "Checkout screen", width: 1040, height: 2072 },
        { src: "/images/vodokachka/screen-success.png", alt: "Payment success screen", width: 1040, height: 2072 },
      ],
    },
    {
      type: "numbered",
      heading: "Key decisions",
      style: "cards",
      items: [
        {
          number: "01",
          title: "Large dish photography",
          body: "A guest chooses food in the dark, in a loud room, often with limited attention: text doesn't get read well under those conditions. A photo removes the main barrier — uncertainty about what will show up.",
        },
        {
          number: "02",
          title: "An accent color on the QR sticker",
          body: "The entry point is a sticker on the table, not a screen. I contrasted it against the interior so it reads in low light.",
        },
        {
          number: "03",
          title: "\"Add\" is pinned to the bottom",
          body: "A guest holds the phone in one hand. The pinned button also kept the price visible while scrolling, so there was no need to scroll back and double-check.",
        },
        {
          number: "04",
          title: "Full and shortened menus",
          body: "A shortened menu of appetizers rolled out during parties. It's an operational fix for kitchen flow, not an interface one.",
        },
      ],
    },
    {
      type: "highlight",
      label: "Where this solution's boundary sits",
      body: "There's no order status for the guest: the waiter delivered dishes right away, so the wait never exceeded a couple of minutes. At a 250-guest party that stops holding — a guest who's already paid is left with no signal. It's the first thing v2 needs to close.",
    },
    {
      type: "list",
      heading: "What v1 didn't cover",
      items: [
        "Ordering alcohol — out of scope, only through a waiter",
        "A guest on the dance floor — QR is tied to a table, and part of the crowd at a party never sits down",
        "Splitting the bill — everyone orders and pays individually; a shared cart didn't fit into 2 weeks of development",
        "Order status and a ready-time estimate — traded off against the deadline",
      ],
    },
    {
      type: "text",
      heading: "Design system",
      body: [
        "Development was handled by an external team with no daily contact. I built a UI kit on atomic-design principles: around 50 components, tokens, a type scale on the Navigo typeface.",
      ],
    },
    {
      type: "imageGrid",
      equalHeight: true,
      images: [
        { src: "/images/vodokachka/case-uikit-components.png", alt: "Reusable component tree in the UI kit", width: 408, height: 465 },
        { src: "/images/vodokachka/case-uikit-buttons.png", alt: "Button set and states in the UI kit", width: 408, height: 465 },
        { src: "/images/vodokachka/case-uikit-font.png", alt: "Navigo typeface type scale", width: 584, height: 460 },
        { src: "/images/vodokachka/case-uikit-cart.png", alt: "Dish card and cart components", width: 585, height: 465 },
      ],
    },
    {
      type: "text",
      heading: "Testing",
      body: [
        "I built an interactive prototype to demo to management. It doubled as usability-test material inside the holding company — around 1,000 staff. The dish card had no composition or weight: without a waiter to explain that verbally, guests couldn't commit to an order. I added both to the card.",
      ],
    },
    {
      type: "text",
      heading: "Launch",
      body: [
        "We launched across the whole floor at once. The first weeks' real problem came from weekdays, not parties: older guests couldn't manage self-ordering, and waiters stepped in to take orders in person. For the 20–35 target audience, the scenario worked. A pilot on part of the floor would have surfaced that signal earlier.",
      ],
    },
    {
      type: "text",
      heading: "Results",
      body: [
        "Some metrics are instrumented (iiko), some are manual floor observations.",
      ],
    },
    {
      type: "stats",
      items: [
        { value: "55%", label: "Share of orders via QR during weekday peak hours" },
        { value: "70%", label: "Share of orders via QR at events" },
        { value: "−50%", label: "Time to order entering the system: 12 → 6 min" },
        { value: "+30%", label: "Average check per guest: ₽2,000 → ₽2,600" },
      ],
    },
    {
      type: "table",
      columns: ["Metric", "Source", "Limitation"],
      rows: [
        [
          "Time to order entering the system: 12 → 6 min",
          "Manual floor timing",
          "Order of magnitude is trustworthy, precision isn't",
        ],
        [
          "Average check: ₽2,000 → ₽2,600",
          "iiko reports, month to month",
          "No control group — seasonality and novelty effects aren't ruled out",
        ],
        [
          "Orders per guest per evening: 1–2 → 2–3",
          "iiko reports",
          "Explains the mechanism behind the higher check, not a standalone result",
        ],
      ],
    },
    {
      type: "list",
      heading: "The cost of the solution",
      items: [
        "Waiter tips — the order bypasses the waiter, and with it goes the occasion to tip",
        "The venue's story — a waiter used to tell it while taking the order; self-ordering removed that contact",
        "Older guests — the service became a barrier for them; floor staff compensated manually",
      ],
    },
    {
      type: "list",
      heading: "What I'd design differently",
      items: [
        "Order status for parties — the bigger the floor, the more expensive silence after payment gets",
        "Modifiers and upselling in the card — the higher check came from order frequency, not an interface mechanic that didn't exist",
      ],
    },
  ],
};
