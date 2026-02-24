import { motion } from "../../lib/motion";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";
import { TypingText } from "../ui/TypingText";

export function CombosSection({ combos, language, labels, onAddCombo }) {
  return (
    <section id="combos" className="section soft">
      <div className="container">
        <TypingText className="section-title" text={labels.title} highlight />
        <div className="grid combos">
          {combos.map((combo) => (
            <motion.article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`} {...cardMotion}>
              {combo.highlight ? <span className="badge">{labels.mostOrdered}</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail[language]}</p>
              <strong>{combo.price}</strong>
              <motion.button type="button" onClick={() => onAddCombo(combo)} {...buttonMotion}>
                {labels.action}
              </motion.button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
