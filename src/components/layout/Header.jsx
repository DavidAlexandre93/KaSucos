const LANGUAGE_OPTIONS = [
  { code: "en", countryCode: "us", label: "English" },
  { code: "pt", countryCode: "br", label: "Português" },
  { code: "es", countryCode: "es", label: "Español" },
  { code: "fr", countryCode: "fr", label: "Français" },
];

export function Header({ language, onLanguageChange, labels, basketCount, onBasketClick }) {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a href="#inicio" className="brand">
          <img src="/img/logotipo.jpeg" alt="KaSucos" />
          <span>KaSucos</span>
        </a>

        <div className="topbar-right">
          <nav aria-label={labels.title ?? "Main navigation"}>
            <a href="#catalogo">{labels.juices}</a>
            <a href="#monte-seu-suco">{labels.buildYourJuice}</a>
            <a href="#combos">{labels.combos}</a>
            <a href="#beneficios">{labels.benefits}</a>
            <a href="#dicas">{labels.tipsInfo}</a>
            <a href="#onde-nos-encontrar">{labels.findUs}</a>
            <a href="#contato">{labels.contact}</a>
          </nav>

          <button type="button" className="basket-button" onClick={onBasketClick}>
            <span className="basket-button-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" role="img" focusable="false">
                <path d="M23 17a2 2 0 0 1-1.79-2.9l6-12a2 2 0 1 1 3.58 1.8l-6 12A2 2 0 0 1 23 17zm18 0a2 2 0 0 1-1.79-1.1l-6-12a2 2 0 1 1 3.58-1.8l6 12A2 2 0 0 1 41 17z" fill="#0b2379" />
                <rect x="4" y="16" width="56" height="16" rx="4" fill="#f52a2f" />
                <path d="M11 32h42l-4.7 25.9A4 4 0 0 1 44.36 61H19.64a4 4 0 0 1-3.94-3.1z" fill="#ff8a2c" />
                <rect x="16" y="21" width="32" height="2.6" rx="1.3" fill="#0b2379" />
                <path d="M24.3 52.4a1.6 1.6 0 0 1-1.58-1.35l-1.9-13.3a1.6 1.6 0 1 1 3.17-.46l1.9 13.3a1.6 1.6 0 0 1-1.59 1.81zm7.7 0a1.6 1.6 0 0 1-1.6-1.6V37.4a1.6 1.6 0 1 1 3.2 0v13.4a1.6 1.6 0 0 1-1.6 1.6zm7.7 0a1.6 1.6 0 0 1-1.59-1.81l1.9-13.3a1.6 1.6 0 1 1 3.17.46l-1.9 13.3a1.6 1.6 0 0 1-1.58 1.35z" fill="#0b2379" />
              </svg>
            </span>
            {labels.basket} ({basketCount})
          </button>

          <div className="language-switcher" aria-label="Language selector">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                title={option.label}
                aria-label={option.label}
                className={language === option.code ? "active" : ""}
                aria-pressed={language === option.code}
                onClick={() => onLanguageChange(option.code)}
              >
                <img
                  className="language-flag"
                  src={`https://flagcdn.com/w40/${option.countryCode}.png`}
                  srcSet={`https://flagcdn.com/w40/${option.countryCode}.png 1x, https://flagcdn.com/w80/${option.countryCode}.png 2x`}
                  width="20"
                  height="20"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
