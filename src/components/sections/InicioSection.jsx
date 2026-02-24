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
      const spillStreams = selector(".hero-pour-stream");
      const jar = selector(".hero-pouring-jar")[0];
      const jarLiquid = selector(".hero-jar-liquid")[0];
      const jarWave = selector(".hero-jar-liquid-wave")[0];
      const jarGloss = selector(".hero-jar-gloss");
      const jarBubbles = selector(".hero-jar-bubble");
      const splashDrops = selector(".hero-droplet");
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

      if (jarLiquid) {
        gsap.to(jarLiquid, {
          "--liquid-wave": "14px",
          opacity: 0.88,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (jarWave) {
        gsap.to(jarWave, {
          yPercent: -6,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      jarGloss.forEach((gloss, index) => {
        gsap.to(gloss, {
          "--gloss-shift": `${16 + index * 8}px`,
          opacity: 0.72,
          duration: 1.6 + index * 0.24,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      jarBubbles.forEach((bubble, index) => {
        gsap.to(bubble, {
          yPercent: -40 - index * 30,
          opacity: 0.2,
          duration: 1.2 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.3,
        });
      });

      splashDrops.forEach((drop, index) => {
        gsap.to(drop, {
          yPercent: 180,
          xPercent: index % 2 === 0 ? -28 : 28,
          opacity: 0,
          duration: 0.95 + index * 0.07,
          repeat: -1,
          repeatDelay: index * 0.08,
          ease: "power1.in",
          delay: index * 0.15,
        });
      });

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
              <div className="hero-pouring-jar">
                <svg className="hero-jar-svg" viewBox="0 0 190 220" role="presentation" aria-hidden="true">
                  <defs>
                    <linearGradient id="jarGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.78)" />
                      <stop offset="55%" stopColor="rgba(225,208,255,0.35)" />
                      <stop offset="100%" stopColor="rgba(173,139,232,0.22)" />
                    </linearGradient>
                    <linearGradient id="jarStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                      <stop offset="100%" stopColor="rgba(214,188,255,0.55)" />
                    </linearGradient>
                    <linearGradient id="juiceFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffe486" />
                      <stop offset="45%" stopColor="#ffb73a" />
                      <stop offset="100%" stopColor="#f06728" />
                    </linearGradient>
                    <clipPath id="jarLiquidMask">
                      <path d="M56 74h92v118c0 12-8 18-20 18H79c-14 0-23-8-23-21V74Z" />
                    </clipPath>
                  </defs>

                  <rect className="hero-jar-cap" x="112" y="13" width="52" height="24" rx="10" />
                  <rect className="hero-jar-neck" x="114" y="34" width="44" height="30" rx="12" />

                  <path
                    className="hero-jar-handle"
                    d="M46 110c0-21 14-36 34-36h8v16h-8c-11 0-18 8-18 20v35c0 12 7 20 18 20h8v16h-8c-20 0-34-15-34-36z"
                  />

                  <path
                    className="hero-jar-body"
                    d="M60 64h90v126c0 17-12 26-28 26H82c-17 0-28-11-28-28V64c0-7 4-12 6-12z"
                  />

                  <g clipPath="url(#jarLiquidMask)">
                    <path className="hero-jar-liquid" d="M54 116c26-16 54 9 92-8v110H54Z" />
                    <path className="hero-jar-liquid-wave" d="M54 115c28 13 43-11 64-8 12 2 20 8 28 12v20H54Z" />
                    <circle className="hero-jar-bubble" cx="94" cy="136" r="4" />
                    <circle className="hero-jar-bubble hero-jar-bubble--two" cx="112" cy="150" r="3" />
                  </g>

                  <path className="hero-jar-gloss" d="M80 82c4-2 10-2 12 2v96c-2 6-9 7-12 2z" />
                  <path className="hero-jar-gloss hero-jar-gloss--soft" d="M101 88c3-1 7-1 9 2v68c-2 4-6 5-9 1z" />
                </svg>
              </div>

              <div className="hero-pour-stream hero-pour-stream--main" />
              <div className="hero-pour-stream hero-pour-stream--mist" />

              <div className="hero-pool" />

              <div className="hero-splash" aria-hidden="true">
                {Array.from({ length: 7 }).map((_, index) => (
                  <span key={`drop-${index}`} className="hero-droplet" />
                ))}
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
