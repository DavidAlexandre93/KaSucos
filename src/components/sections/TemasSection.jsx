import { motion } from "../../lib/motion";
import { buttonMotion } from "../ui/MotionPrimitives";

export function TemasSection({
  temas,
  temaSelecionado,
  onTemaChange,
  title,
  description,
  themeNames,
}) {
  return (
    <section id="temas" className="section theme-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="theme-text">{description}</p>
        <div className="theme-options">
          {Object.entries(temas).map(([key]) => (
            <motion.button
              key={key}
              type="button"
              className={`theme-option ${temaSelecionado === key ? "active" : ""}`}
              onClick={() => onTemaChange(key)}
              {...buttonMotion}
            >
              <span>{themeNames[key]}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
