import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";
import { TypingText } from "../ui/TypingText";

export function CombosSection({ combos, language, labels, onAddCombo }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const comboCards = selector(".combo");
      gsap.set(comboCards, { opacity: 0, y: 32, scale: 0.96 });
      gsap.to(comboCards, { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.65 });
    },
    { scope: sectionRef, dependencies: [language] },
  );

  return (
    <section id="combos" className="section soft" ref={sectionRef}>
      <div className="container">
        <TypingText className="section-title" text={labels.title} highlight />
        <div className="grid combos">
          {combos.map((combo) => (
            <motion.article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`} {...cardMotion}>
              {combo.highlight ? <span className="badge">{labels.mostOrdered}</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail[language]}</p>
              <strong>{combo.price}</strong>
              <motion.button
                type="button"
                onClick={() => onAddCombo(combo)}
                whileHover={{ ...buttonMotion.whileHover, backgroundColor: "#ffcc21" }}
                whileTap={buttonMotion.whileTap}
              >
                {labels.action}
              </motion.button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
