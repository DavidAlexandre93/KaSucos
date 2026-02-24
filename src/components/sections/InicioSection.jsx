import { useRef } from "react";
import gsap from "../../lib/gsap";
import { ScrollTrigger } from "../../lib/ScrollTrigger";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";
import { TypingText } from "../ui/TypingText";

gsap.registerPlugin(ScrollTrigger);

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

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(chip, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.46 })
        .fromTo(title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.56 }, "<+0.12")
        .fromTo(description, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.52 }, "<+0.1")
        .fromTo(actions, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.46 }, "<+0.08")
        .fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.62 }, "<");

      if (sectionRef.current && card) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: ({ progress }) => {
            const offset = Math.round(-18 + progress * 36);
            gsap.set(card, { "--hero-parallax": `${offset}px` });
          },
        });
      }
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
          <TypingText as="h1" className="hero-title" text={hero.title} speed={36} delay={80} highlight />
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
