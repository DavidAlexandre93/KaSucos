import { motion } from "../../lib/motion";
import { buttonMotion } from "../ui/MotionPrimitives";
import { TypingText } from "../ui/TypingText";

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
        <TypingText className="section-title" text={title} highlight />
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
