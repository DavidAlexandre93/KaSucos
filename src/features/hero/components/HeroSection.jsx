export function HeroSection({ t }) {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div>
          <p className="chip">{t.heroChip}</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroDescription}</p>
          <div className="hero-actions">
            <a href="#catalogo" className="btn-primary">
              {t.heroBuyNow}
            </a>
            <a href="#combos" className="btn-ghost">
              {t.heroSeeCombos}
            </a>
          </div>
        </div>
        <div className="hero-card">
          <img src="/img/logotipo.jpeg" alt="Logo KaSucos" />
          <h2>KaSucos</h2>
          <p>{t.heroCardText}</p>
        </div>
      </div>
    </section>
  );
}
