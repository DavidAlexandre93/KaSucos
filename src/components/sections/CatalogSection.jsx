export function CatalogSection({ juices }) {
  return (
    <section id="catalogo" className="section">
      <div className="container">
        <h2 className="section-title">Sucos disponíveis para venda</h2>
        <div className="grid cards">
          {juices.map((juice) => (
            <article key={juice.name} className="card">
              <img src={juice.image} alt={juice.name} loading="lazy" />
              <div className="card-body">
                <span className="tag">{juice.tag}</span>
                <h3>{juice.name}</h3>
                <p>{juice.description}</p>
                <small className="availability">{juice.availability}</small>
                <div className="card-footer">
                  <strong>{juice.price}</strong>
                  <span>{juice.volume}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
