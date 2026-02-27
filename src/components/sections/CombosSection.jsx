import { useRef } from "react";

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
  const word = bottleWord[language] ?? bottleWord.en ?? bottleWord.pt;

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

  return (
    <section id="combos" className="section soft" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title section-title--combos">{labels.title}</h2>
        <div className="grid combos">
          {combos.map((combo) => (
            <article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`}>
              {combo.highlight ? <span className="badge">{labels.mostOrdered}</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail[language] ?? combo.detail.en ?? combo.detail.pt}</p>
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
