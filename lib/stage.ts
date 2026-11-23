/**
 * Backdrop shared by case covers and concept tiles: a glow rising from the
 * bottom edge over a dark base tinted the same hue. One composition for every
 * tile, so only the brand colour changes from card to card.
 */
export function glowStage(glow: string, mid: string, base: string, deep: string) {
  return `radial-gradient(110% 80% at 50% 105%, ${glow} 0%, ${mid} 38%, ${base} 72%, ${deep} 100%)`;
}

/** Brand backdrops by case slug. */
export const CASE_STAGES: Record<string, string> = {
  linky: glowStage("#ff8a2a", "#8f4515", "#2f1d12", "#221812"),
  rentag: glowStage("#7a2cf6", "#3f1a86", "#1b1233", "#140e26"),
  fintrack: glowStage("#2f78c4", "#1a4a74", "#15202c", "#121820"),
  "7pr": glowStage("#2fae9a", "#17695d", "#142723", "#111c1a"),
  vodokachka: glowStage("#f2683f", "#93391f", "#321b15", "#251512"),
};
