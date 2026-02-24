import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
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
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const options = selector(".theme-option");
      gsap.set(options, { opacity: 0, y: 16 });
      gsap.to(options, { opacity: 1, y: 0, stagger: 0.06, duration: 0.45 });
    },
    { scope: sectionRef, dependencies: [temaSelecionado] },
  );

  return (
    <section id="temas" className="section theme-section" ref={sectionRef}>
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
              whileHover={{ ...buttonMotion.whileHover, boxShadow: "0 12px 24px rgba(95, 39, 178, 0.2)" }}
              whileTap={buttonMotion.whileTap}
            >
              <span>{themeNames[key]}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
