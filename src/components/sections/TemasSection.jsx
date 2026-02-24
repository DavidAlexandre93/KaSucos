export function TemasSection({
  temas,
  temaSelecionado,
  onTemaChange,
  title,
  description,
  themeNames,
}) {
  return (
    <section className="section theme-section">
      <div className="container">
        <h2 className="section-title">{title}</h2>
        <p className="theme-text">{description}</p>
        <div className="theme-options">
          {Object.entries(temas).map(([key]) => (
            <button
              key={key}
              type="button"
              className={`theme-option ${temaSelecionado === key ? "active" : ""}`}
              onClick={() => onTemaChange(key)}
            >
              <span>{themeNames[key]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
