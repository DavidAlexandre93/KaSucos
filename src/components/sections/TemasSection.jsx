export function TemasSection({ temas, temaSelecionado, onTemaChange }) {
  return (
    <section className="section theme-section">
      <div className="container">
        <h2 className="section-title">Escolha as cores da sua experiência</h2>
        <p className="theme-text">Todas as opções usam a paleta da logo KaSucos.</p>
        <div className="theme-options">
          {Object.entries(temas).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              className={`theme-option ${temaSelecionado === key ? "active" : ""}`}
              onClick={() => onTemaChange(key)}
            >
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
