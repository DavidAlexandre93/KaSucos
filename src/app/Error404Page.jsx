const FRUITS = ["🍍", "🍓", "🥝", "🍊", "🍇", "🍉"];

export function Error404Page() {
  return (
    <main className="error-404" role="main" aria-labelledby="error-404-title">
      <div className="error-404__glow error-404__glow--left" aria-hidden="true" />
      <div className="error-404__glow error-404__glow--right" aria-hidden="true" />
      <div className="error-404__glow error-404__glow--top" aria-hidden="true" />

      <section className="error-404__content">
        <p className="error-404__eyebrow">KaSucos</p>

        <div className="error-404__chips" aria-hidden="true">
          {FRUITS.map((fruit) => (
            <span key={fruit}>{fruit}</span>
          ))}
        </div>

        <p className="error-404__code">404</p>
        <h1 id="error-404-title">Oops! Essa rota se perdeu no pomar.</h1>
        <p className="error-404__message">Tente novamente mais tarde.</p>
        <p className="error-404__hint">Aproveite para conhecer nossos sabores tropicais e monte seu suco perfeito com frutas frescas.</p>

        <div className="error-404__actions">
          <a className="error-404__action" href="/">
            Voltar para o início
          </a>
          <a className="error-404__action error-404__action--ghost" href="/#catalogo">
            Ver catálogo
          </a>
        </div>
      </section>
    </main>
  );
}
