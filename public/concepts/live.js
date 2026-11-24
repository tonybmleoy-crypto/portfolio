/* Shared runtime for the live concept screens inside the playground's iPhone
   mockups. Each page is drawn at its design width and scaled to the frame;
   motion runs only while the tile is on screen (a same-origin iframe's
   IntersectionObserver watches the top-level viewport) and never under
   prefers-reduced-motion. */
window.Live = (() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fit = (el, width) => {
    const apply = () => (el.style.transform = `scale(${innerWidth / width})`);
    apply();
    addEventListener("resize", apply);
  };

  /** Calls onShow / onHide as the tile enters and leaves the viewport. */
  const watch = (onShow, onHide) => {
    if (reduce) return;
    new IntersectionObserver(
      ([e]) => (e.isIntersecting ? onShow() : onHide && onHide()),
      { threshold: 0.35 },
    ).observe(document.body);
  };

  /** serega-emotional selector: linear 1 → 0 over 180ms, then one damped
      1Hz / decay-10 overshoot. t in seconds; settles by ~0.68s. */
  const W = 2 * Math.PI;
  const spring = (t) =>
    t <= 0 ? 1 : t < 0.18 ? 1 - t / 0.18 : (-1 / 0.18) * Math.sin((t - 0.18) * W) / (Math.exp(10 * (t - 0.18)) * W);

  /** serega-gentle reveal: per character, 15px rise + fade, 500ms, 15ms
      stagger, cubic-bezier(.2,.8,.2,1). Words stay unbroken. */
  const gentle = (el, delay = 0) => {
    if (reduce || !el.animate) return;
    const text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const seg = window.Intl && Intl.Segmenter ? [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].map((s) => s.segment) : Array.from(text);
    let word = null;
    const chars = [];
    for (const g of seg) {
      if (!word) { word = document.createElement("span"); word.style.cssText = "display:inline-block;white-space:nowrap"; word.setAttribute("aria-hidden", "true"); el.append(word); }
      const c = document.createElement("span");
      c.textContent = g;
      c.style.cssText = "display:inline-block;white-space:pre";
      word.append(c);
      chars.push(c);
      if (/\s/.test(g)) word = null;
    }
    const run = () =>
      chars.map((c, i) =>
        c.animate(
          [{ opacity: 0, transform: "translateY(15px)" }, { opacity: 1, transform: "none" }],
          { duration: 500, delay: delay + 15 * i, easing: "cubic-bezier(0.2,0.8,0.2,1)", fill: "backwards" },
        ),
      );
    return run;
  };

  return { reduce, fit, watch, spring, gentle };
})();
