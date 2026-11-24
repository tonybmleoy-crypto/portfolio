import { glowStage } from "@/lib/stage";
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
    stage: glowStage("#b5531a", "#6b2f12", "#2e1a12", "#241813"),
    screens: ["/images/concepts/ember-reward.png", "/images/concepts/ember-rolling.png"],
    // The roll is live: the reel spins down and lands on Ember.
    live: [null, "/concepts/ember-rolling.html"],
    span: 7,
  },
  {
    slug: "go-card",
    title: "GO! Card",
    kind: "phone",
    // Lime glow of the card itself; the hero of the screen is black.
    stage: glowStage("#7fa600", "#3d5000", "#1a200c", "#121509"),
    screens: [],
    // Live prototype: the transit card turns on its own and can be dragged.
    live: ["/concepts/go-card.html"],
    span: 5,
  },
  // Row 2: 6 + 6
  {
    slug: "game-modes",
    title: "Game modes",
    kind: "phone",
    screens: ["/images/concepts/game-modes.png"],
    // Live drops arrive, the rocket hovers, the PVP cases clash.
    live: ["/concepts/game-modes.html"],
    span: 6,
  },
  { slug: "property-budget", title: "Property budget", kind: "phone", screens: ["/images/concepts/budget.png"], span: 6 },
  // Row 3: 4 + 8
  {
    slug: "net-worth",
    title: "Net worth",
    kind: "phone",
    screens: ["/images/concepts/net-worth.png"],
    // Bars rise, the projection counts up, the tooltip scrubs the years.
    live: ["/concepts/net-worth.html"],
    span: 4,
  },
  { slug: "weather-widget", title: "Weather widget", kind: "scene", screens: ["/images/concepts/weather.png"], span: 8 },
  // Row 4: 6 + 6
  { slug: "event-invite", title: "Event invite", kind: "phone", screens: ["/images/concepts/housewarming.png"], span: 6 },
  { slug: "creator-chat", title: "Creator chat", kind: "phone", screens: ["/images/concepts/chat.png"], span: 6 },
];
