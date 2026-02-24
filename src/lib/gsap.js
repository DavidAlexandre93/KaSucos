const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const parseValue = (value) => {
  if (typeof value === "number") return { value, unit: "" };
  const match = /^(-?\d+(?:\.\d+)?)([a-z%]*)$/i.exec(String(value).trim());
  if (!match) return { value: Number(value) || 0, unit: "" };
  return { value: Number(match[1]), unit: match[2] || "" };
};

function applyStyle(target, key, value) {
  if (!target) return;
  if (key.startsWith("--")) {
    target.style.setProperty(key, String(value));
    return;
  }

  if (key === "xPercent" || key === "yPercent" || key === "rotate" || key === "scale") {
    const current = target.__miniGsapTransform || { xPercent: 0, yPercent: 0, rotate: 0, scale: 1 };
    current[key] = Number(value);
    target.__miniGsapTransform = current;
    target.style.transform = `translate3d(${current.xPercent}%, ${current.yPercent}%, 0) rotate(${current.rotate}deg) scale(${current.scale})`;
    return;
  }

  if (key === "force3D" || key === "scrollTrigger" || key === "ease" || key === "duration" || key === "stagger") return;

  target.style[key] = typeof value === "number" && key !== "opacity" ? `${value}px` : String(value);
}

function toTargetArray(targets) {
  if (!targets) return [];
  if (Array.isArray(targets)) return targets.filter(Boolean);
  if (typeof targets.length === "number" && typeof targets !== "string") return Array.from(targets).filter(Boolean);
  return [targets].filter(Boolean);
}

function animate(targets, fromVars, toVars = {}) {
  const items = toTargetArray(targets);
  const durationMs = (toVars.duration ?? 0.3) * 1000;
  const staggerMs = (toVars.stagger ?? 0) * 1000;

  items.forEach((target, index) => {
    const startDelay = staggerMs * index;
    const startAt = performance.now() + startDelay;
    const numericKeys = Object.keys(toVars).filter((key) => !["duration", "ease", "stagger", "scrollTrigger"].includes(key));

    const fromMap = {};
    const toMap = {};
    numericKeys.forEach((key) => {
      if (fromVars && Object.prototype.hasOwnProperty.call(fromVars, key)) {
        applyStyle(target, key, fromVars[key]);
      }

      const currentValue = fromVars?.[key] ?? (target.style.getPropertyValue(key) || target.style[key] || 0);
      fromMap[key] = parseValue(currentValue);
      toMap[key] = parseValue(toVars[key]);
    });

    const tick = (now) => {
      if (now < startAt) {
        requestAnimationFrame(tick);
        return;
      }
      const progress = durationMs <= 0 ? 1 : clamp((now - startAt) / durationMs, 0, 1);

      numericKeys.forEach((key) => {
        const from = fromMap[key];
        const to = toMap[key];
        const next = from.value + (to.value - from.value) * progress;
        applyStyle(target, key, `${next}${to.unit || from.unit}`);
      });

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

class Timeline {
  fromTo(targets, fromVars, toVars) {
    animate(targets, fromVars, toVars);
    return this;
  }

  to(targets, vars) {
    animate(targets, null, vars);
    return this;
  }
}

const gsap = {
  registerPlugin: () => undefined,
  context: (fn) => {
    fn();
    return { revert: () => undefined };
  },
  set: (targets, vars) => {
    const items = toTargetArray(targets);
    items.forEach((target) => {
      Object.entries(vars).forEach(([key, value]) => applyStyle(target, key, value));
    });
  },
  to: (targets, vars) => animate(targets, null, vars),
  fromTo: (targets, fromVars, toVars) => animate(targets, fromVars, toVars),
  timeline: () => new Timeline(),
  matchMedia: () => {
    const disposers = [];
    return {
      add: (query, callback) => {
        const media = window.matchMedia(query);
        const run = () => media.matches && callback();
        run();
        media.addEventListener("change", run);
        disposers.push(() => media.removeEventListener("change", run));
      },
      revert: () => disposers.splice(0).forEach((dispose) => dispose()),
    };
  },
};

export default gsap;
