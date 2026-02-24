import { motion } from "../../lib/motion";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";
import { TypingText } from "../ui/TypingText";

export function SucosSection({ sucos, language, title, labels, onAddJuice }) {
  return (
    <section id="catalogo" className="section">
      <div className="container">
        <TypingText className="section-title" text={title} highlight />
        <div className="grid cards">
          {sucos.map((suco) => (
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
                <motion.button type="button" className="card-action" onClick={() => onAddJuice?.(suco)} {...buttonMotion}>
                  {labels.addToBasket}
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
