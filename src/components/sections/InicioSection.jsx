export function InicioSection() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div>
          <p className="chip">Entrega no mesmo dia*</p>
          <h1>Os sucos mais frescos para sua rotina saudável.</h1>
          <p>
            Inspirado no estilo Life Sucos, com catálogo claro dos sabores disponíveis para venda,
            combos e pedido rápido no WhatsApp.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="btn-primary">
              Comprar agora
            </a>
            <a href="#combos" className="btn-ghost">
              Ver combos
            </a>
          </div>
        </div>
        <div className="hero-card">
          <img src="/img/logotipo.jpeg" alt="Logo KaSucos" />
          <h2>KaSucos</h2>
          <p>O sabor da fruta, e o carinho de casa.</p>
        </div>
      </div>
    </section>
  );
}
