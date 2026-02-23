export function CombosSection({ combos }) {
  return (
    <section id="combos" className="section soft">
      <div className="container">
        <h2 className="section-title">Combos para economizar</h2>
        <div className="grid combos">
          {combos.map((combo) => (
            <article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`}>
              {combo.highlight ? <span className="badge">Mais pedido</span> : null}
              <h3>{combo.title}</h3>
              <p>{combo.detail}</p>
              <strong>{combo.price}</strong>
              <button type="button">Quero este</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
