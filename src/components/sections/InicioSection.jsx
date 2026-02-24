import { useRef } from "react";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";

const prefersReducedMotion =
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function InicioSection({ hero }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      if (prefersReducedMotion) return undefined;

      const chip = selector(".hero-chip")[0];
      const title = selector(".hero-title")[0];
      const description = selector(".hero-description")[0];
      const actions = selector(".hero-actions")[0];
      const card = selector(".hero-card")[0];

      const entranceAnimations = [
        chip?.animate([{ opacity: 0, transform: "translateY(16px) scale(0.96)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], {
          duration: 460,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "forwards",
        }),
        title?.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }], {
          duration: 560,
          delay: 120,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "forwards",
        }),
        description?.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "translateY(0)" }], {
          duration: 520,
          delay: 220,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "forwards",
        }),
        actions?.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], {
          duration: 460,
          delay: 300,
          easing: "cubic-bezier(.22,.61,.36,1)",
          fill: "forwards",
        }),
        card?.animate([{ opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0)" }], {
          duration: 620,
          delay: 180,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "forwards",
        }),
      ].filter(Boolean);

      const onScroll = () => {
        if (!sectionRef.current || !card) return;
        const bounds = sectionRef.current.getBoundingClientRect();
        const distanceFromCenter = (bounds.top + bounds.height * 0.5 - window.innerHeight * 0.5) / window.innerHeight;
        const offset = Math.max(-18, Math.min(18, -distanceFromCenter * 22));
        card.style.setProperty("--hero-parallax", `${offset}px`);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        entranceAnimations.forEach((animation) => animation.cancel());
        window.removeEventListener("scroll", onScroll);
      };
    },
    { scope: sectionRef, dependencies: [hero.title] },
  );

  return (
    <section id="inicio" className="hero" ref={sectionRef}>
      <div className="container hero-grid">
        <div>
          <motion.p className="chip hero-chip" whileHover={{ scale: 1.04, rotate: -2 }} transition={{ duration: 0.2 }}>
            {hero.chip}
          </motion.p>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-actions">
            <motion.a href="#catalogo" className="btn-primary" {...buttonMotion}>
              {hero.buyNow}
            </motion.a>
            <motion.a href="#combos" className="btn-ghost" {...buttonMotion}>
              {hero.viewCombos}
            </motion.a>
          </div>
        </div>
        <motion.div className="hero-card" {...cardMotion}>
          <img src="/img/logotipo.jpeg" alt="Logo KaSucos" />
          <h2>KaSucos</h2>
          <p>{hero.slogan}</p>
        </motion.div>
      </div>
    </section>
  );
}
