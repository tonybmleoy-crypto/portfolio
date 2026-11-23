import { Concept } from "@/lib/types";

/**
 * UI concepts for the playground bento grid, in display order. Screens go
 * under /public/images/concepts as bare screens (no device frame, no status
 * bar that hugs the edges): the grid draws the iPhone mockup itself. Spans of
 * each row must add up to 12. While this list is empty the playground shows
 * an empty state and its tab has no counter.
 */
export const concepts: Concept[] = [
  // Row 1: 7 + 5
  {
    slug: "ember-case",
    title: "Ember Case",
    kind: "phone",
    // Ember glow rising from the bottom, after the "Open Case" button.
    stage: "radial-gradient(110% 80% at 50% 105%, #b5531a 0%, #6b2f12 38%, #2e1a12 72%, #241813 100%)",
    screens: ["/images/concepts/ember-reward.png", "/images/concepts/ember-rolling.png"],
    span: 7,
  },
  { slug: "net-worth", title: "Net worth", kind: "phone", screens: ["/images/concepts/net-worth.png"], span: 5 },
  // Row 2: 4 + 4 + 4
  { slug: "game-modes", title: "Game modes", kind: "phone", screens: ["/images/concepts/game-modes.png"], span: 4 },
  { slug: "property-budget", title: "Property budget", kind: "phone", screens: ["/images/concepts/budget.png"], span: 4 },
  { slug: "event-invite", title: "Event invite", kind: "phone", screens: ["/images/concepts/housewarming.png"], span: 4 },
  // Row 3: 4 + 8
  { slug: "creator-chat", title: "Creator chat", kind: "phone", screens: ["/images/concepts/chat.png"], span: 4 },
  { slug: "weather-widget", title: "Weather widget", kind: "scene", screens: ["/images/concepts/weather.png"], span: 8 },
];
