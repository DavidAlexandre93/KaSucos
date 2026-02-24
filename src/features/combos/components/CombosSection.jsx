export function CombosSection({ combos, t }) {
  return (
    <section id="combos" className="section soft">
      <div className="container">
        <h2 className="section-title">{t.combosTitle}</h2>
        <div className="grid combos">
          {combos.map((combo) => (
            <article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`}>
              {combo.highlight ? <span className="badge">{t.comboBadge}</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail}</p>
              <strong>{combo.price}</strong>
              <button type="button">{t.comboButton}</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
