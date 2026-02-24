export function CombosSection({ combos, language, labels, onAddCombo }) {
  return (
    <section id="combos" className="section soft">
      <div className="container">
        <h2 className="section-title">{labels.title}</h2>
        <div className="grid combos">
          {combos.map((combo) => (
            <article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`}>
              {combo.highlight ? <span className="badge">{labels.mostOrdered}</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail[language]}</p>
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
