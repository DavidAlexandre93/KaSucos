const localeFlags = [
  { locale: "en-US", flag: "🇺🇸", label: "English (US)" },
  { locale: "pt-BR", flag: "🇧🇷", label: "Português (Brasil)" },
  { locale: "es-ES", flag: "🇪🇸", label: "Español" },
  { locale: "fr-FR", flag: "🇫🇷", label: "Français" },
];

export function Header({ locale, onLocaleChange, t }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a href="#inicio" className="brand">
          <img src="/img/logotipo.jpeg" alt="KaSucos" />
          <span>KaSucos</span>
        </a>
        <div className="topbar-controls">
          <nav>
            <a href="#catalogo">{t.navJuices}</a>
            <a href="#combos">{t.navCombos}</a>
            <a href="#beneficios">{t.navBenefits}</a>
            <a href="#contato">{t.navContact}</a>
          </nav>
          <div className="language-switcher" aria-label={t.languageSelectorLabel}>
            {localeFlags.map((option) => (
              <button
                key={option.locale}
                type="button"
                className={`flag-btn ${locale === option.locale ? "active" : ""}`}
                onClick={() => onLocaleChange(option.locale)}
                aria-label={option.label}
                title={option.label}
              >
                <span aria-hidden="true">{option.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
