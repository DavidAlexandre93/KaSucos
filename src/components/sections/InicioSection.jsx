export function InicioSection({ hero }) {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div>
          <p className="chip">{hero.chip}</p>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
          <div className="hero-actions">
            <a href="#catalogo" className="btn-primary">
              {hero.buyNow}
            </a>
            <a href="#combos" className="btn-ghost">
              {hero.viewCombos}
            </a>
          </div>
        </div>
        <div className="hero-card">
          <img src="/img/logotipo.jpeg" alt="Logo KaSucos" />
          <h2>KaSucos</h2>
          <p>{hero.slogan}</p>
        </div>
      </div>
    </section>
  );
}
