import { useRef } from "react";
import gsap from "../../lib/gsap";
import { useGSAP } from "../../lib/useGSAP";
import { TypingText } from "../ui/TypingText";

const bottleWord = {
  pt: "garrafas",
  en: "bottles",
  es: "botellas",
  fr: "bouteilles",
};

function ComboMath({ combo, language }) {
  const base = combo.visualMath?.base ?? 0;
  const bonus = combo.visualMath?.bonus ?? 0;
  const total = base + bonus;
  const word = bottleWord[language] ?? bottleWord.pt;

  return (
    <div className="combo-math" aria-label={`${base} + ${bonus} = ${total} ${word}`}>
      <div className="combo-bottles" aria-hidden="true">
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={`${combo.title}-bottle-${index}`}
            className={`combo-bottle ${index >= base ? "bonus" : ""}`}
          />
        ))}
      </div>
      <p className="combo-equation">
        {base}
        {bonus > 0 ? ` + ${bonus} = ${total}` : ""} {word}
      </p>
    </div>
  );
}

export function CombosSection({ combos, language, labels, onAddCombo }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const comboCards = selector(".combo");
      const equations = selector(".combo-equation");
      gsap.set(comboCards, { opacity: 0, y: 32, scale: 0.96 });
      gsap.set(equations, { opacity: 0, y: 10 });
      gsap.to(comboCards, { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.65 });
      gsap.to(equations, { opacity: 1, y: 0, duration: 0.45, delay: 0.35, stagger: 0.08 });
    },
    { scope: sectionRef, dependencies: [language] },
  );

  return (
    <section id="combos" className="section soft" ref={sectionRef}>
      <div className="container">
        <TypingText className="section-title" text={labels.title} highlight />
        <div className="grid combos">
          {combos.map((combo) => (
            <article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`}>
              {combo.highlight ? <span className="badge">{labels.mostOrdered}</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail[language]}</p>
              <ComboMath combo={combo} language={language} />
              <strong>{combo.price}</strong>
              <button type="button" onClick={() => onAddCombo(combo)}>
                {labels.action}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
