import { motion } from "../../lib/motion";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";

export function CombosSection({ combos, language, labels, onAddCombo }) {
  return (
    <section id="combos" className="section soft">
      <div className="container">
        <h2 className="section-title">{labels.title}</h2>
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
