export function SucosSection({ sucos, language, title, labels, onAddJuice }) {
  return (
    <section id="catalogo" className="section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <div className="grid cards">
          {sucos.map((suco) => (
            <article key={suco.name} className="card">
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
                <button type="button" className="card-action" onClick={() => onAddJuice(suco)}>
                  {labels.addToBasket}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
