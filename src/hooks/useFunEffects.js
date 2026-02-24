import { useEffect } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const random = (min, max) => Math.random() * (max - min) + min;

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
  fruit.textContent = ["🍉", "🍍", "🍓", "🍊", "🍇"][Math.floor(Math.random() * 5)];
  fruit.style.left = `${random(8, 92)}vw`;
  fruit.style.animationDuration = `${random(5.2, 8)}s`;
  fruit.style.fontSize = `${random(1, 1.8)}rem`;
  document.body.appendChild(fruit);
  window.setTimeout(() => fruit.remove(), 8600);
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
    }

    let ticking = false;
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
      window.clearInterval(interval);
      pulseItems.forEach((node) => node.removeEventListener("click", pulseHandler));
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", popHandler);
        card.removeEventListener("focusin", popHandler);
        card.style.transform = "";
      });
      document.documentElement.style.removeProperty("--scroll-glow");
      document.documentElement.style.removeProperty("--scroll-party");
      document.body.classList.remove("site-party-mode");
      document.querySelectorAll(".juice-splash, .scroll-fruit").forEach((node) => node.remove());
    };
  }, []);
}
