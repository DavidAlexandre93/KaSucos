import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";
import { TypingText } from "../ui/TypingText";

export function SucosSection({ sucos, language, title, labels, onAddJuice }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const cards = selector(".card");
      const images = selector(".card img");

      cards.forEach((card, index) => {
        gsap.set(card, { opacity: 0, y: 24, rotate: index % 2 === 0 ? -1.6 : 1.6 });
      });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        rotate: 0,
        duration: 0.62,
        stagger: 0.08,
      });

      images.forEach((image, index) => {
        gsap.to(image, {
          yPercent: index % 2 === 0 ? -2.5 : -1.5,
          scale: 1.03,
          duration: 1.5 + index * 0.15,
        });
      });
    },
    { scope: sectionRef, dependencies: [language] },
  );

  return (
    <section id="catalogo" className="section" ref={sectionRef}>
      <div className="container">
        <TypingText className="section-title" text={title} highlight />
        <div className="grid cards">
          {sucos.map((suco, index) => (
            <motion.article key={suco.name} className="card" {...cardMotion}>
              <img src={suco.image} alt={suco.name} loading="lazy" />
              <div className="card-body">
                <span className="tag">{suco.tag[language]}</span>
                <h3>{suco.name}</h3>
                <p>{suco.description[language]}</p>
                <small className="availability">{labels[suco.availabilityKey]}</small>
                <div className="card-footer">
                  <strong>{suco.price}</strong>
                  <span>{suco.volume}</span>
                </div>
                <motion.button
                  type="button"
                  className="card-action"
                  onClick={() => onAddJuice?.(suco)}
                  whileHover={{ ...buttonMotion.whileHover, boxShadow: "0 14px 24px rgba(255, 142, 30, 0.35)" }}
                  whileTap={buttonMotion.whileTap}
                >
                  {labels.addToBasket}
                </motion.button>
              </div>
              <span className="card-juice-glow" style={{ "--delay": `${index * 120}ms` }} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
