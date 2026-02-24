import { useEffect } from "react";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const random = (min, max) => Math.random() * (max - min) + min;

function spawnSplash(x, y) {
  const pool = ["🍊", "🍍", "🍓", "🥝", "🍋"];
  const amount = 9;

  for (let index = 0; index < amount; index += 1) {
    const splash = document.createElement("span");
    splash.className = "juice-splash";
    splash.textContent = pool[Math.floor(Math.random() * pool.length)];

    const angle = (Math.PI * 2 * index) / amount + random(-0.3, 0.3);
    const distance = random(35, 110);
    splash.style.setProperty("--start-x", `${x}px`);
    splash.style.setProperty("--start-y", `${y}px`);
    splash.style.setProperty("--end-x", `${x + Math.cos(angle) * distance}px`);
    splash.style.setProperty("--end-y", `${y + Math.sin(angle) * distance}px`);
    splash.style.setProperty("--spin", `${random(-140, 140)}deg`);
    splash.style.fontSize = `${random(0.9, 1.3)}rem`;

    document.body.appendChild(splash);
    window.setTimeout(() => splash.remove(), 920);
  }
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

    const pulseItems = document.querySelectorAll(".btn-primary, .btn-ghost, .theme-option, .brand");
    const pulseHandler = (event) => {
      const target = event.currentTarget;
      target.classList.remove("effect-click-pulse");
      requestAnimationFrame(() => target.classList.add("effect-click-pulse"));

      spawnSplash(event.clientX, event.clientY);
    };

    pulseItems.forEach((node) => node.addEventListener("click", pulseHandler));

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(() => {
        const ratio = Math.min(window.scrollY / 900, 1);
        document.documentElement.style.setProperty("--scroll-glow", `${ratio}`);

        cards.forEach((card, index) => {
          const speed = (index % 4) * 0.8 + 0.6;
          card.style.transform = `translate3d(0, ${Math.sin(window.scrollY * 0.004 + index) * speed}px, 0)`;
        });

        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const interval = window.setInterval(() => {
      const chip = document.querySelector(".chip");
      if (!chip) return;

      chip.classList.remove("effect-shake");
      requestAnimationFrame(() => chip.classList.add("effect-shake"));
    }, 4600);

    onScroll();

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(interval);
      pulseItems.forEach((node) => node.removeEventListener("click", pulseHandler));
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", popHandler);
        card.removeEventListener("focusin", popHandler);
      });
      cards.forEach((card) => {
        card.style.transform = "";
      });
      document.documentElement.style.removeProperty("--scroll-glow");
    };
  }, []);
}
