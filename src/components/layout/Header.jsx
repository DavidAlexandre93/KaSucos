const LANGUAGE_OPTIONS = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

const COMPACT_NAV_LABELS = {
  pt: {
    home: "Início",
    themes: "Temas",
    juices: "Sucos",
    buildYourJuice: "Monte",
    combos: "Combos",
    benefits: "Benef.",
    tipsInfo: "Dicas",
    testimonials: "Avaliações",
    findUs: "Onde",
    contact: "Contato",
  },
  en: {
    home: "Home",
    themes: "Themes",
    juices: "Juices",
    buildYourJuice: "Build",
    combos: "Combos",
    benefits: "Benefits",
    tipsInfo: "Tips",
    testimonials: "Reviews",
    findUs: "Find us",
    contact: "Contact",
  },
  es: {
    home: "Inicio",
    themes: "Temas",
    juices: "Jugos",
    buildYourJuice: "Arma",
    combos: "Combos",
    benefits: "Benef.",
    tipsInfo: "Consejos",
    testimonials: "Reseñas",
    findUs: "Dónde",
    contact: "Contacto",
  },
  fr: {
    home: "Accueil",
    themes: "Thèmes",
    juices: "Jus",
    buildYourJuice: "Composer",
    combos: "Combos",
    benefits: "Avantages",
    tipsInfo: "Conseils",
    testimonials: "Avis",
    findUs: "Adresse",
    contact: "Contact",
  },
};

export function Header({ language, onLanguageChange, labels, basketCount, onBasketClick }) {
  const navLabels = {
    home: labels.home ?? "Início",
    themes: labels.themes ?? "Temas",
    juices: labels.juices ?? "Sucos",
    buildYourJuice: labels.buildYourJuice ?? "Monte seu Suco",
    combos: labels.combos ?? "Combos",
    benefits: labels.benefits ?? "Benefícios",
    tipsInfo: labels.tipsInfo ?? "Dicas e Informações",
    testimonials: labels.testimonials ?? "Depoimentos",
    findUs: labels.findUs ?? "Onde nos encontrar",
    contact: labels.contact ?? "Contato",
  };

  const compactLabels = COMPACT_NAV_LABELS[language] ?? COMPACT_NAV_LABELS.pt;

  const menuItems = [
    { href: "#inicio", key: "home" },
    { href: "#temas", key: "themes" },
    { href: "#catalogo", key: "juices" },
    { href: "#monte-seu-suco", key: "buildYourJuice" },
    { href: "#combos", key: "combos" },
    { href: "#beneficios", key: "benefits" },
    { href: "#dicas", key: "tipsInfo" },
    { href: "#depoimentos", key: "testimonials" },
    { href: "#onde-nos-encontrar", key: "findUs" },
    { href: "#contato", key: "contact" },
  ];

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <a href="#inicio" className="brand">
          <img src="/img/logotipo.jpeg" alt="KaSucos" />
          <span>KaSucos</span>
        </a>

        <div className="topbar-right">
          <nav aria-label={labels.title ?? "Main navigation"}>
            {menuItems.map((item) => (
              <a key={item.key} href={item.href} title={navLabels[item.key]}>
                {compactLabels[item.key]}
              </a>
            ))}
          </nav>

          <button type="button" className="basket-button" onClick={onBasketClick}>
            🧺 {labels.basket ?? "Cesta"} ({basketCount})
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
                <span aria-hidden="true">{option.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
