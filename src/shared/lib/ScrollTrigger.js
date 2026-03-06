const listeners = [];

function buildProgress(start, end) {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const current = window.scrollY;

  const parsePoint = (point) => {
    if (point === "top top") return 0;
    if (point === "bottom bottom") return maxScroll;
    if (point?.includes("top")) return 0;
    if (point?.includes("bottom")) return maxScroll;
    return 0;
  };

  const startPx = parsePoint(start);
  const endPx = parsePoint(end);
  const span = Math.max(1, endPx - startPx);
  return Math.max(0, Math.min(1, (current - startPx) / span));
}

export const ScrollTrigger = {
  create: ({ start = "top top", end = "bottom bottom", onUpdate }) => {
    const render = () => {
      onUpdate?.({ progress: buildProgress(start, end) });
    };

    render();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);

    const dispose = () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
    };

    listeners.push(dispose);
    return { kill: dispose };
  },
};
