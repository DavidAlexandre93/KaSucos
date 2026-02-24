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
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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
      const showcase = selector(".hero-showcase")[0];
      const spillStreams = selector(".hero-stream-fill");
      const jars = selector(".hero-showcase-jar");

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(chip, { opacity: 0, y: 16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.46 })
        .fromTo(title, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.56 }, "<+0.12")
        .fromTo(description, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.52 }, "<+0.1")
        .fromTo(actions, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.46 }, "<+0.08")
        .fromTo(card, { opacity: 0, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.62 }, "<");

      if (sectionRef.current && card) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: ({ progress }) => {
            const offset = -18 + progress * 36;
            gsap.set(card, { "--hero-parallax": `${offset}px` });

            spillStreams.forEach((stream, index) => {
              const gain = clamp(progress * 1.25 + index * 0.1, 0, 1);
              gsap.to(stream, {
                "--fill-scale": 0.25 + gain * 0.95,
                opacity: 0.35 + gain * 0.65,
                duration: 0.2,
              });
            });

            jars.forEach((jar, index) => {
              gsap.to(jar, {
                rotate: -11 - progress * 11 - index * 3,
                yPercent: -1 - progress * 7,
                duration: 0.25,
              });
            });
          },
        });
      }

      const onPointerMove = (event) => {
        if (!showcase) return;

        const { innerWidth, innerHeight } = window;
        const xFactor = (event.clientX / innerWidth - 0.5) * 20;
        const yFactor = (event.clientY / innerHeight - 0.5) * 16;

        gsap.to(showcase, {
          "--showcase-rot-y": `${xFactor}deg`,
          "--showcase-rot-x": `${-yFactor}deg`,
          "--showcase-shift-x": `${xFactor * 0.3}px`,
          "--showcase-shift-y": `${yFactor * 0.3}px`,
          duration: 0.35,
        });
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });

      if (showcase) {
        gsap.set(showcase, { opacity: 0, y: 26, scale: 0.96 });
        gsap.to(showcase, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" });
      }

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
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

          <motion.div className="hero-showcase" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
            <img className="hero-showcase-logo" src="/img/logotipo.jpeg" alt="Logo KaSucos na cesta de sucos" />

            <div className="hero-showcase-basket" aria-hidden="true">
              <img className="hero-showcase-bottle hero-showcase-bottle--left" src="/img/ai/clouds-ai.svg" alt="" loading="lazy" />
              <img className="hero-showcase-bottle hero-showcase-bottle--middle" src="/img/ai/juice-ai.svg" alt="" loading="lazy" />
              <img className="hero-showcase-bottle hero-showcase-bottle--right" src="/img/ai/fence-ai.svg" alt="" loading="lazy" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
