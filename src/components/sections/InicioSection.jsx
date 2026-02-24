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
      const spillStreams = selector(".hero-stream-aura");
      const jar = selector(".hero-pouring-jar")[0];
      const jarImage = selector(".hero-jar-image")[0];
      const infoCards = selector(".hero-info-card");

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

            spillStreams.forEach((stream, index) => {
              const gain = clamp(progress * 1.25 + index * 0.1, 0, 1);
              gsap.to(stream, {
                "--fill-scale": 0.25 + gain * 0.95,
                opacity: 0.35 + gain * 0.65,
                duration: 0.2,
              });
            });

            if (jar) {
              gsap.to(jar, {
                rotate: -18 - progress * 12,
                yPercent: -1 - progress * 8,
                duration: 0.25,
              });
            }
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

      if (jar) {
        gsap.to(jar, {
          yPercent: -2.8,
          rotate: -22,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (jarImage) {
        gsap.to(jarImage, {
          scale: 1.035,
          filter: "drop-shadow(0 24px 26px rgba(0,0,0,0.38)) saturate(1.08)",
          duration: 1.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      infoCards.forEach((cardItem, index) => {
        gsap.to(cardItem, {
          yPercent: index % 2 === 0 ? -8 : 8,
          duration: 2 + index * 0.35,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

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
            <div className="hero-showcase-glow" aria-hidden="true" />

            <div className="hero-showcase-stage" aria-hidden="true">
              <span className="hero-stream-aura" />
              <div className="hero-pouring-jar">
                <img className="hero-jar-image" src="/img/ai/juice-cup-spill.svg" alt="Jarra KaSucos derramando suco" loading="lazy" />
              </div>
            </div>

            <motion.div className="hero-info-card hero-info-card--left" whileHover={{ scale: 1.04, y: -4 }} transition={{ duration: 0.24 }}>
              <strong>Prensado a frio</strong>
              <span>Preserva nutrientes e mantém o sabor natural.</span>
            </motion.div>

            <motion.div className="hero-info-card hero-info-card--right" whileHover={{ scale: 1.04, y: -4 }} transition={{ duration: 0.24 }}>
              <strong>0% conservantes</strong>
              <span>Produção diária com frutas selecionadas.</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
