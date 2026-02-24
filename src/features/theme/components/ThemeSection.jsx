export function ThemeSection({ colorThemes, selectedTheme, onThemeChange, t }) {
  return (
    <section className="section theme-section">
      <div className="container">
        <h2 className="section-title">{t.themeTitle}</h2>
        <p className="theme-text">{t.themeDescription}</p>
        <div className="theme-options">
          {Object.entries(colorThemes).map(([key, theme]) => (
            <button
              key={key}
              type="button"
              className={`theme-option ${selectedTheme === key ? "active" : ""}`}
              onClick={() => onThemeChange(key)}
            >
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
