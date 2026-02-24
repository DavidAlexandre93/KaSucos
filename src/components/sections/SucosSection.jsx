export function SucosSection({ sucos }) {
  return (
    <section id="catalogo" className="section">
      <div className="container">
        <h2 className="section-title">Sucos disponíveis para venda</h2>
        <div className="grid cards">
          {sucos.map((suco) => (
            <article key={suco.name} className="card">
              <img src={suco.image} alt={suco.name} loading="lazy" />
              <div className="card-body">
                <span className="tag">{suco.tag}</span>
                <h3>{suco.name}</h3>
                <p>{suco.description}</p>
                <small className="availability">{suco.availability}</small>
                <div className="card-footer">
                  <strong>{suco.price}</strong>
                  <span>{suco.volume}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
