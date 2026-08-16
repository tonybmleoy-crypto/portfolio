import { CaseStudy } from "@/lib/types";

export const rentag: CaseStudy = {
  slug: "rentag",
  title: "Rentag — A safe deal for the construction market",
  subtitle:
    "How staged escrow and living deal terms protect both sides of a B2B marketplace",
  coverImage: "/images/rentag/cover.png",
  coverWidth: 1400,
  coverHeight: 1129,
  sections: [
    {
      type: "text",
      heading: "About the project",
      body: [
        "Rentag is a B2B marketplace for the construction market. Clients and contractors found each other on the platform, then moved to messengers to negotiate. The reason: there was no tool that guaranteed either side would follow through on their obligations.",
        {
          text: "The PM brought me a support-ticket export and one observation: users would start a conversation on Rentag, then vanish. No completed projects, no repeat visits. The retention curve dropped off on day 7.",
          muted: true,
        },
      ],
    },
    {
      type: "text",
      heading: "The problem",
      body: [
        "The platform worked like a \"classifieds board\" — users found each other inside the product, then left to negotiate in messengers. The main reason: no tool for handling users' money.",
      ],
    },
    {
      type: "text",
      heading: "The core task",
      body: [
        "The task was to design a secure deal flow that accounted for the realities of the construction market.",
        "The main challenge was doing this for a market where contracts run into tens of millions of rubles, and a client physically can't freeze the entire sum at once.",
      ],
    },
    {
      type: "text",
      heading: "Discovery",
      body: [
        "The first step was understanding at which point in the flow users make financial decisions. I read around 200 message threads from the last 90 days — not a formal audit, just an attempt to see where conversations stalled. Two patterns held up consistently:",
        "— In roughly a third of threads, the payment question blocked the conversation within the first two or three messages.",
        "— Threads that went quiet almost always broke off on an unanswered question about money.",
      ],
    },
    {
      type: "text",
      heading: "Competitor anti-patterns",
      body: [
        "Studying user reviews of YouDo and FL.ru surfaced a key insight for designing arbitration:",
      ],
    },
    {
      type: "quote",
      text: "The platform's arbitration always sides with the client, even when they're clearly wrong — the most common complaint contractors had about competitors. That became a requirement: the neutrality of arbitration had to be visible in the interface.",
    },
    {
      type: "image",
      src: "/images/rentag/discovery.png",
      alt: "Analysis of Rentag user conversations and competitor anti-patterns",
    },
    {
      type: "table",
      columns: ["Role", "Main fear", "Solution"],
      rows: [
        [
          "Contractor",
          "Not getting paid after finishing the work",
          "Visible escrow of the amount before work starts",
        ],
        [
          "Client",
          "Losing the prepayment",
          "Control over payout + protection from accidental release",
        ],
        [
          "Both",
          "Not understanding what's happening with the deal",
          "A transparent status model at every stage",
        ],
      ],
    },
    {
      type: "insight",
      label: "Key insight",
      body: "30% of conversations on the platform raise the payment question within the first 2–3 messages. Users think about money before they think about order details.",
    },
    {
      type: "tips",
      heading: "Three hypotheses:",
      items: [
        "Contractors are afraid of not getting paid after finishing the work",
        "Clients are afraid of losing their prepayment with no way to get it back",
        "Both sides distrust the platform's neutrality in disputes",
      ],
    },
    {
      type: "text",
      heading: "Key design decisions",
      body: [],
    },
    {
      type: "text",
      heading: "A staged deal instead of a single freeze",
      body: [
        "After breaking down the four main staged-payment models — from Upwork to construction ERPs — I realized rigid milestones wouldn't work: on a construction site, stages are fuzzy, scope shifts mid-project, and timelines move because of weather and deliveries.",
      ],
    },
    {
      type: "image",
      src: "/images/rentag/flow-form.png",
      alt: "Rentag deal creation form",
      caption: "Deal creation form: choose a role → set terms → toggle stages → add stages with an amount and date",
    },
    {
      type: "image",
      src: "/images/rentag/info-tabs.png",
      alt: "Rentag info panel with tabs",
      caption: "Info panel: \"Stages / Status / History\" tabs with different card states",
    },
    {
      type: "highlight",
      body: "Underneath sits a full state model — without it the interface would look simple but break on the first edge case.",
    },
    {
      type: "table",
      heading: "Stage status",
      columns: ["Stage status", "Who acts", "What happens"],
      rows: [
        ["Awaiting payment", "Client deposits funds", "Work hasn't started"],
        ["Active", "Contractor is working", "Payout unavailable"],
        ["Under review", "Client: approve / send to revision", "—"],
        ["In revision", "Contractor re-uploads", "Auto-payout timer resets"],
        ["Paid", "—", "Every action is irreversible"],
      ],
    },
    {
      type: "image",
      src: "/images/rentag/tooltips.png",
      alt: "Rentag color-coded status tooltips",
      caption: "Color-coded tooltips: pending acceptance, pending review, completion, rejection",
    },
    {
      type: "text",
      heading: "Living terms",
      body: [
        "Scope on a construction site changes after the deal starts — that's the norm, not the exception. Rigid deal terms would break the moment scope shifted. The solution: a revision mechanism that lets both sides renegotiate terms without losing protection.",
        "I proposed a dynamic-deal model: the deal is created with initial terms, but those terms can be renegotiated mid-flight through a Pending Revision mechanism. Either side can propose changes, and both must explicitly accept them. This keeps escrow protection intact while staying fully flexible.",
        "Paid stages can't be changed — that's irreversible. Stages with already-frozen funds are locked against edits.",
      ],
    },
    {
      type: "image",
      src: "/images/rentag/living-terms.png",
      alt: "Rentag \"Propose changes\" flow",
      caption: "\"Propose changes\" flow: stage list → edit a specific stage → \"before / after\" comparison",
    },
    {
      type: "image",
      src: "/images/rentag/deal-screen.png",
      alt: "Rentag deal screen with proposed terms",
      caption: "Deal screen with proposed terms",
    },
    {
      type: "text",
      heading: "Revision vs. arbitration",
      body: [
        "Two different scenarios needed to be split apart. Revision is a technical error in the document; arbitration is a dispute about work quality or a breach of terms.",
      ],
    },
    {
      type: "quote",
      text: "Customer development interviews with clients showed they already drew this distinction intuitively. The closed list of revision reasons is built directly on that distinction — how users themselves separate the two situations.",
    },
    {
      type: "text",
      body: [
        "A closed list is a defense against abuse. Without it, a client could use \"revision\" to stall a payout for reasons unrelated to the document itself.",
      ],
    },
    {
      type: "image",
      src: "/images/rentag/revision.png",
      alt: "Sending a document for revision on Rentag",
      caption: "Sending a document for revision: a closed list of reasons plus a mandatory comment",
    },
    {
      type: "text",
      heading: "The outcome",
      body: [
        "This is the platform's first version of a secure deal — before it, there was no transaction-protection tool at all. A dynamic deal: any number of stages, living terms via Pending Revision, and a clear split between technical revisions and substantive disputes.",
      ],
    },
    {
      type: "image",
      src: "/images/rentag/results.png",
      alt: "Rentag launch results",
    },
    {
      type: "text",
      heading: "Shipped to engineering. Metrics from the first 90 days:",
      body: [],
    },
    {
      type: "stats",
      items: [
        { value: ">40%", label: "Of all secure deals were multi-stage" },
        { value: ">55%", label: "Of deals reached the archive" },
        { value: ">70%", label: "Of revisions get accepted" },
        { value: "<10%", label: "Of deals end up in dispute" },
      ],
    },
  ],
};
