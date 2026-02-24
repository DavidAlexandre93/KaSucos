import { useEffect } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const random = (min, max) => Math.random() * (max - min) + min;
const pick = (pool) => pool[Math.floor(Math.random() * pool.length)];

function spawnSplash(x, y, amount = 10) {
  const pool = ["🍊", "🍍", "🍓", "🥝", "🍋", "🥭"];

  for (let index = 0; index < amount; index += 1) {
    const splash = document.createElement("span");
    splash.className = "juice-splash";
    splash.textContent = pool[Math.floor(Math.random() * pool.length)];

    const angle = (Math.PI * 2 * index) / amount + random(-0.3, 0.3);
    const distance = random(35, 130);
    splash.style.setProperty("--start-x", `${x}px`);
    splash.style.setProperty("--start-y", `${y}px`);
    splash.style.setProperty("--end-x", `${x + Math.cos(angle) * distance}px`);
    splash.style.setProperty("--end-y", `${y + Math.sin(angle) * distance}px`);
    splash.style.setProperty("--spin", `${random(-180, 180)}deg`);
    splash.style.fontSize = `${random(0.9, 1.45)}rem`;

    document.body.appendChild(splash);
    window.setTimeout(() => splash.remove(), 950);
  }
}

function spawnScrollFruit() {
  const fruit = document.createElement("span");
  fruit.className = "scroll-fruit";
  fruit.textContent = pick(["🍉", "🍍", "🍓", "🍊", "🍇"]);
  fruit.style.left = `${random(8, 92)}vw`;
  fruit.style.animationDuration = `${random(5.2, 8)}s`;
  fruit.style.fontSize = `${random(1, 1.8)}rem`;
  document.body.appendChild(fruit);
  window.setTimeout(() => fruit.remove(), 8600);
}

function spawnLeaf(x, y, size = random(0.8, 1.3)) {
  const leaf = document.createElement("span");
  leaf.className = "leaf-trail";
  leaf.textContent = pick(["🍃", "🌿", "🍀"]);
  leaf.style.left = `${x}px`;
  leaf.style.top = `${y}px`;
  leaf.style.fontSize = `${size}rem`;
  leaf.style.setProperty("--leaf-x", `${random(-40, 40)}px`);
  leaf.style.setProperty("--leaf-spin", `${random(-40, 40)}deg`);
  leaf.style.animationDuration = `${random(1.6, 2.6)}s`;
  document.body.appendChild(leaf);
  window.setTimeout(() => leaf.remove(), 2700);
}

function spawnJuiceDrop(x) {
  const drop = document.createElement("span");
  drop.className = "juice-drop";
  drop.textContent = pick(["🧃", "💧", "🥤"]);
  drop.style.left = `${x}px`;
  drop.style.fontSize = `${random(1, 1.6)}rem`;
  drop.style.animationDuration = `${random(2.8, 4.1)}s`;
  document.body.appendChild(drop);
  window.setTimeout(() => drop.remove(), 4200);
}

function spawnToast(message) {
  const toast = document.createElement("div");
  toast.className = "harvest-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  window.setTimeout(() => toast.classList.add("is-visible"), 10);
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 400);
  }, 1800);
}

export function useFunEffects() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const sections = Array.from(document.querySelectorAll("main section"));
    const cards = Array.from(document.querySelectorAll(".card, .combo, blockquote"));

    sections.forEach((section, index) => {
      section.classList.add("effect-reveal");
      section.style.setProperty("--reveal-delay", `${index * 60}ms`);
    });

    const popHandler = (event) => {
      const card = event.currentTarget;
      if (!card) return;
      card.classList.remove("effect-pop");
      requestAnimationFrame(() => card.classList.add("effect-pop"));
    };

    cards.forEach((card) => {
      card.addEventListener("mouseenter", popHandler);
      card.addEventListener("focusin", popHandler);
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.24 },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const pulseItems = document.querySelectorAll(".btn-primary, .btn-ghost, .theme-option, .brand, .card-action, .combo button");
    const pulseHandler = (event) => {
      const target = event.currentTarget;
      target.classList.remove("effect-click-pulse");
      requestAnimationFrame(() => target.classList.add("effect-click-pulse"));
      spawnSplash(event.clientX, event.clientY);
      if (Math.random() > 0.6) {
        spawnToast(pick(["🍹 Colheita especial!", "🥭 Suco turbinado!", "🍓 Mistura tropical desbloqueada!"]));
      }
    };

    pulseItems.forEach((node) => node.addEventListener("click", pulseHandler));

    const seenBefore = window.localStorage.getItem("kasucos-party-seen");
    if (!seenBefore) {
      document.body.classList.add("site-party-mode");
      window.setTimeout(() => {
        for (let index = 0; index < 7; index += 1) {
          window.setTimeout(() => {
            spawnSplash(random(window.innerWidth * 0.12, window.innerWidth * 0.88), random(90, window.innerHeight * 0.52), 12);
          }, index * 120);
        }
      }, 350);
      window.localStorage.setItem("kasucos-party-seen", "1");
      window.setTimeout(() => document.body.classList.remove("site-party-mode"), 2600);
      spawnToast("🌱 Bem-vindo ao pomar KaSucos!");
    }

    const decor = document.createElement("div");
    decor.className = "effect-decor";
    decor.innerHTML = `
      <img class="effect-decor__fence" src="/img/ai/fence-ai.svg" alt="" />
      <img class="effect-decor__spill" src="/img/ai/juice-cup-spill.svg" alt="" />
      <img class="effect-decor__juice" src="/img/ai/juice-ai.svg" alt="" />
      <img class="effect-decor__cloud" src="/img/ai/clouds-ai.svg" alt="" />
    `;
    document.body.appendChild(decor);

    let leafTrailCooldown = 0;
    const onPointerMove = (event) => {
      if (leafTrailCooldown) return;
      leafTrailCooldown = window.setTimeout(() => {
        leafTrailCooldown = 0;
      }, 90);
      spawnLeaf(event.clientX, event.clientY, random(0.75, 1.2));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let ticking = false;
    let lastMilestone = -1;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const ratio = Math.min(window.scrollY / 900, 1);
        document.documentElement.style.setProperty("--scroll-glow", `${ratio}`);
        document.documentElement.style.setProperty("--scroll-party", `${Math.min(window.scrollY / 2400, 1)}`);

        cards.forEach((card, index) => {
          const speed = (index % 4) * 0.8 + 0.6;
          card.style.transform = `translate3d(0, ${Math.sin(window.scrollY * 0.004 + index) * speed}px, 0)`;
        });

        if (Math.random() > 0.82) spawnScrollFruit();

        const milestone = Math.floor(window.scrollY / 420);
        if (milestone > lastMilestone) {
          for (let index = 0; index < 3; index += 1) {
            spawnJuiceDrop(random(window.innerWidth * 0.1, window.innerWidth * 0.9));
          }
          lastMilestone = milestone;
        }

        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const interval = window.setInterval(() => {
      document.querySelector(".chip")?.classList.toggle("effect-shake");
    }, 4200);

    onScroll();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.clearInterval(interval);
      window.clearTimeout(leafTrailCooldown);
      pulseItems.forEach((node) => node.removeEventListener("click", pulseHandler));
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", popHandler);
        card.removeEventListener("focusin", popHandler);
        card.style.transform = "";
      });
      document.documentElement.style.removeProperty("--scroll-glow");
      document.documentElement.style.removeProperty("--scroll-party");
      document.body.classList.remove("site-party-mode");
      document.querySelectorAll(".juice-splash, .scroll-fruit, .leaf-trail, .juice-drop, .harvest-toast, .effect-decor").forEach((node) => node.remove());
    };
  }, []);
}
