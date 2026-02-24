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
            🧺 {labels.basket} ({basketCount})
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
