const LANGUAGE_OPTIONS = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

export function Header({ language, onLanguageChange, labels }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a href="#inicio" className="brand">
          <img src="/img/logotipo.jpeg" alt="KaSucos" />
          <span>KaSucos</span>
        </a>

        <div className="topbar-right">
          <nav>
            <a href="#catalogo">{labels.juices}</a>
            <a href="#monte-seu-suco">{labels.buildYourJuice}</a>
            <a href="#combos">{labels.combos}</a>
            <a href="#beneficios">{labels.benefits}</a>
            <a href="#contato">{labels.contact}</a>
          </nav>

          <div className="language-switcher" aria-label="Language selector">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                title={option.label}
                aria-label={option.label}
                className={language === option.code ? "active" : ""}
                onClick={() => onLanguageChange(option.code)}
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
