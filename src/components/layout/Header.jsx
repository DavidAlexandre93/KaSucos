import { useEffect, useState } from "react";

const LANGUAGE_OPTIONS = [
  { code: "en", countryCode: "us", label: "English" },
  { code: "pt", countryCode: "br", label: "Português" },
  { code: "es", countryCode: "es", label: "Español" },
  { code: "fr", countryCode: "fr", label: "Français" },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 720) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
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
          <button
            type="button"
            className={`menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="primary-navigation"
            className={isMobileMenuOpen ? "open" : ""}
            aria-label={labels.title ?? "Main navigation"}
          >
            {menuItems.map((item) => (
              <a key={item.key} href={item.href} title={navLabels[item.key]} onClick={closeMobileMenu}>
                {compactLabels[item.key]}
              </a>
            ))}
          </nav>

          <button type="button" className="basket-button" onClick={onBasketClick}>
            🧺 {labels.basket ?? "Cesta"} ({basketCount})
            <span className="basket-button-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" role="img" focusable="false">
                <path d="M23 17a2 2 0 0 1-1.79-2.9l6-12a2 2 0 1 1 3.58 1.8l-6 12A2 2 0 0 1 23 17zm18 0a2 2 0 0 1-1.79-1.1l-6-12a2 2 0 1 1 3.58-1.8l6 12A2 2 0 0 1 41 17z" fill="#0b2379" />
                <rect x="4" y="16" width="56" height="16" rx="4" fill="#f52a2f" />
                <path d="M11 32h42l-4.7 25.9A4 4 0 0 1 44.36 61H19.64a4 4 0 0 1-3.94-3.1z" fill="#ff8a2c" />
                <rect x="16" y="21" width="32" height="2.6" rx="1.3" fill="#0b2379" />
                <path d="M24.3 52.4a1.6 1.6 0 0 1-1.58-1.35l-1.9-13.3a1.6 1.6 0 1 1 3.17-.46l1.9 13.3a1.6 1.6 0 0 1-1.59 1.81zm7.7 0a1.6 1.6 0 0 1-1.6-1.6V37.4a1.6 1.6 0 1 1 3.2 0v13.4a1.6 1.6 0 0 1-1.6 1.6zm7.7 0a1.6 1.6 0 0 1-1.59-1.81l1.9-13.3a1.6 1.6 0 1 1 3.17.46l-1.9 13.3a1.6 1.6 0 0 1-1.58 1.35z" fill="#0b2379" />
              </svg>
            </span>
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
