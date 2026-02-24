const supportedLocales = ["pt-BR", "en-US", "es-ES", "fr-FR"];

const localeByCountry = {
  BR: "pt-BR",
  US: "en-US",
  ES: "es-ES",
  FR: "fr-FR",
};

const translations = {
  "pt-BR": {
    navJuices: "Sucos",
    navCombos: "Combos",
    navBenefits: "Benefícios",
    navContact: "Contato",
    languageSelectorLabel: "Selecionar idioma",
    heroChip: "Entrega no mesmo dia*",
    heroTitle: "Os sucos mais frescos para sua rotina saudável.",
    heroDescription:
      "Inspirado no estilo Life Sucos, com catálogo claro dos sabores disponíveis para venda, combos e pedido rápido no WhatsApp.",
    heroBuyNow: "Comprar agora",
    heroSeeCombos: "Ver combos",
    heroCardText: "O sabor da fruta, e o carinho de casa.",
    themeTitle: "Escolha as cores da sua experiência",
    themeDescription: "Todas as opções usam a paleta da logo KaSucos.",
    catalogTitle: "Sucos disponíveis para venda",
    combosTitle: "Combos para economizar",
    comboBadge: "Mais pedido",
    comboButton: "Quero este",
    benefitsTitle: "Por que escolher a KaSucos?",
    benefitsItems: [
      "Sem adição de açúcar e sem conservantes.",
      "Produção diária com frutas frescas.",
      "Entrega refrigerada para manter qualidade.",
      "Atendimento humanizado pelo WhatsApp.",
    ],
    testimonialsTitle: "Quem já provou aprova",
    testimonials: [
      { text: "“Sabor incrível e entrega rápida. O Verde Vital virou meu favorito!”", author: "— Juliana R." },
      { text: "“Os combos valem muito a pena, qualidade impecável.”", author: "— Marcos A." },
      { text: "“Atendimento excelente e sucos realmente naturais.”", author: "— Camila P." },
    ],
    contactTitle: "Faça seu pedido agora",
    contactDescription: "Peça pelo WhatsApp e receba seus sucos geladinhos na sua casa.",
    contactButton: "Falar no WhatsApp",
    footerRights: "Todos os direitos reservados.",
    footerDeliveryNote: "*Consulte áreas de entrega.",
    catalog: {
      "Verde Vital": {
        tag: "Detox",
        description: "Couve, maçã verde, limão e gengibre prensados a frio.",
        availability: "Disponível hoje",
      },
      "Laranja Imune": {
        tag: "Imunidade",
        description: "Laranja, acerola e cúrcuma para reforçar sua rotina.",
        availability: "Disponível hoje",
      },
      "Abacaxi Fresh": {
        tag: "Refrescante",
        description: "Abacaxi com hortelã, refrescante e sem açúcar.",
        availability: "Últimas unidades",
      },
      "Vermelho Power": {
        tag: "Energia",
        description: "Beterraba, maçã e frutas vermelhas para mais energia.",
        availability: "Disponível hoje",
      },
    },
    combos: {
      "Combo Semana Leve": { detail: "7 sucos de 300 ml" },
      "Combo Performance": { detail: "10 sucos + 2 shots funcionais" },
      "Combo Família": { detail: "14 sucos variados" },
    },
  },
  "en-US": {
    navJuices: "Juices",
    navCombos: "Combos",
    navBenefits: "Benefits",
    navContact: "Contact",
    languageSelectorLabel: "Select language",
    heroChip: "Same-day delivery*",
    heroTitle: "The freshest juices for your healthy routine.",
    heroDescription:
      "Inspired by the Life Sucos style, with a clear catalog of available flavors, bundle deals, and quick WhatsApp ordering.",
    heroBuyNow: "Buy now",
    heroSeeCombos: "View combos",
    heroCardText: "Fruit flavor with homemade care.",
    themeTitle: "Choose your experience colors",
    themeDescription: "All options use KaSucos brand palette.",
    catalogTitle: "Juices available for sale",
    combosTitle: "Combos to save more",
    comboBadge: "Best seller",
    comboButton: "I want this",
    benefitsTitle: "Why choose KaSucos?",
    benefitsItems: [
      "No added sugar and no preservatives.",
      "Daily production with fresh fruit.",
      "Refrigerated delivery to preserve quality.",
      "Humanized service through WhatsApp.",
    ],
    testimonialsTitle: "Loved by our customers",
    testimonials: [
      { text: "“Amazing taste and fast delivery. Verde Vital became my favorite!”", author: "— Juliana R." },
      { text: "“The combos are totally worth it, flawless quality.”", author: "— Marcos A." },
      { text: "“Excellent support and truly natural juices.”", author: "— Camila P." },
    ],
    contactTitle: "Place your order now",
    contactDescription: "Order on WhatsApp and receive chilled juices at your doorstep.",
    contactButton: "Chat on WhatsApp",
    footerRights: "All rights reserved.",
    footerDeliveryNote: "*Check delivery areas.",
    catalog: {
      "Verde Vital": { name: "Green Vital", tag: "Detox", description: "Kale, green apple, lemon, and cold-pressed ginger.", availability: "Available today" },
      "Laranja Imune": { name: "Immune Orange", tag: "Immunity", description: "Orange, acerola, and turmeric to boost your routine.", availability: "Available today" },
      "Abacaxi Fresh": { name: "Fresh Pineapple", tag: "Refreshing", description: "Pineapple with mint, refreshing and sugar-free.", availability: "Last units" },
      "Vermelho Power": { name: "Power Red", tag: "Energy", description: "Beet, apple, and red berries for extra energy.", availability: "Available today" },
    },
    combos: {
      "Combo Semana Leve": { title: "Light Week Combo", detail: "7 juices of 300 ml" },
      "Combo Performance": { title: "Performance Combo", detail: "10 juices + 2 wellness shots" },
      "Combo Família": { title: "Family Combo", detail: "14 assorted juices" },
    },
  },
  "es-ES": {
    navJuices: "Zumos",
    navCombos: "Combos",
    navBenefits: "Beneficios",
    navContact: "Contacto",
    languageSelectorLabel: "Seleccionar idioma",
    heroChip: "Entrega el mismo día*",
    heroTitle: "Los zumos más frescos para tu rutina saludable.",
    heroDescription: "Inspirado en el estilo Life Sucos, con catálogo claro de sabores disponibles, combos y pedido rápido por WhatsApp.",
    heroBuyNow: "Comprar ahora",
    heroSeeCombos: "Ver combos",
    heroCardText: "El sabor de la fruta con cariño de casa.",
    themeTitle: "Elige los colores de tu experiencia",
    themeDescription: "Todas las opciones usan la paleta del logo KaSucos.",
    catalogTitle: "Zumos disponibles para la venta",
    combosTitle: "Combos para ahorrar",
    comboBadge: "Más pedido",
    comboButton: "Quiero este",
    benefitsTitle: "¿Por qué elegir KaSucos?",
    benefitsItems: [
      "Sin azúcar añadida ni conservantes.",
      "Producción diaria con fruta fresca.",
      "Entrega refrigerada para mantener la calidad.",
      "Atención humanizada por WhatsApp.",
    ],
    testimonialsTitle: "Quien lo prueba, lo aprueba",
    testimonials: [
      { text: "“Sabor increíble y entrega rápida. ¡Verde Vital ya es mi favorito!”", author: "— Juliana R." },
      { text: "“Los combos valen mucho la pena, calidad impecable.”", author: "— Marcos A." },
      { text: "“Atención excelente y zumos realmente naturales.”", author: "— Camila P." },
    ],
    contactTitle: "Haz tu pedido ahora",
    contactDescription: "Pide por WhatsApp y recibe tus zumos bien fríos en casa.",
    contactButton: "Hablar por WhatsApp",
    footerRights: "Todos los derechos reservados.",
    footerDeliveryNote: "*Consulta zonas de entrega.",
    catalog: {
      "Verde Vital": { name: "Verde Vital", tag: "Detox", description: "Col rizada, manzana verde, limón y jengibre prensados en frío.", availability: "Disponible hoy" },
      "Laranja Imune": { name: "Naranja Inmune", tag: "Inmunidad", description: "Naranja, acerola y cúrcuma para reforzar tu rutina.", availability: "Disponible hoy" },
      "Abacaxi Fresh": { name: "Piña Fresh", tag: "Refrescante", description: "Piña con menta, refrescante y sin azúcar.", availability: "Últimas unidades" },
      "Vermelho Power": { name: "Rojo Power", tag: "Energía", description: "Remolacha, manzana y frutos rojos para más energía.", availability: "Disponible hoy" },
    },
    combos: {
      "Combo Semana Leve": { title: "Combo Semana Ligera", detail: "7 zumos de 300 ml" },
      "Combo Performance": { title: "Combo Rendimiento", detail: "10 zumos + 2 shots funcionales" },
      "Combo Família": { title: "Combo Familiar", detail: "14 zumos variados" },
    },
  },
  "fr-FR": {
    navJuices: "Jus",
    navCombos: "Combos",
    navBenefits: "Avantages",
    navContact: "Contact",
    languageSelectorLabel: "Choisir la langue",
    heroChip: "Livraison le jour même*",
    heroTitle: "Les jus les plus frais pour votre routine saine.",
    heroDescription: "Inspiré du style Life Sucos, avec un catalogue clair des saveurs disponibles, des combos et une commande rapide via WhatsApp.",
    heroBuyNow: "Acheter",
    heroSeeCombos: "Voir les combos",
    heroCardText: "La saveur du fruit avec la douceur de la maison.",
    themeTitle: "Choisissez les couleurs de votre expérience",
    themeDescription: "Toutes les options utilisent la palette du logo KaSucos.",
    catalogTitle: "Jus disponibles à la vente",
    combosTitle: "Combos pour économiser",
    comboBadge: "Le plus demandé",
    comboButton: "Je le veux",
    benefitsTitle: "Pourquoi choisir KaSucos ?",
    benefitsItems: [
      "Sans sucre ajouté et sans conservateurs.",
      "Production quotidienne avec des fruits frais.",
      "Livraison réfrigérée pour garder la qualité.",
      "Service humain via WhatsApp.",
    ],
    testimonialsTitle: "Ceux qui goûtent approuvent",
    testimonials: [
      { text: "“Goût incroyable et livraison rapide. Verde Vital est devenu mon favori !”", author: "— Juliana R." },
      { text: "“Les combos valent vraiment le coup, qualité impeccable.”", author: "— Marcos A." },
      { text: "“Excellent service et jus vraiment naturels.”", author: "— Camila P." },
    ],
    contactTitle: "Passez votre commande maintenant",
    contactDescription: "Commandez via WhatsApp et recevez vos jus bien frais chez vous.",
    contactButton: "Parler sur WhatsApp",
    footerRights: "Tous droits réservés.",
    footerDeliveryNote: "*Consultez les zones de livraison.",
    catalog: {
      "Verde Vital": { name: "Vert Vital", tag: "Détox", description: "Chou kale, pomme verte, citron et gingembre pressés à froid.", availability: "Disponible aujourd'hui" },
      "Laranja Imune": { name: "Orange Immunité", tag: "Immunité", description: "Orange, acerola et curcuma pour renforcer votre routine.", availability: "Disponible aujourd'hui" },
      "Abacaxi Fresh": { name: "Ananas Fresh", tag: "Rafraîchissant", description: "Ananas à la menthe, rafraîchissant et sans sucre.", availability: "Dernières unités" },
      "Vermelho Power": { name: "Rouge Power", tag: "Énergie", description: "Betterave, pomme et fruits rouges pour plus d'énergie.", availability: "Disponible aujourd'hui" },
    },
    combos: {
      "Combo Semana Leve": { title: "Combo Semaine Légère", detail: "7 jus de 300 ml" },
      "Combo Performance": { title: "Combo Performance", detail: "10 jus + 2 shots fonctionnels" },
      "Combo Família": { title: "Combo Famille", detail: "14 jus variés" },
    },
  },
};

const normalizeLocale = (locale) => (supportedLocales.includes(locale) ? locale : "pt-BR");

export async function detectInitialLocale() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) return "pt-BR";
    const data = await response.json();
    const byCountry = localeByCountry[data?.country_code];
    if (byCountry) return byCountry;
  } catch {
    // fallback below
  }

  const browserLocale = navigator.language;
  if (browserLocale.startsWith("en")) return "en-US";
  if (browserLocale.startsWith("es")) return "es-ES";
  if (browserLocale.startsWith("fr")) return "fr-FR";
  return "pt-BR";
}

export function getTranslations(locale) {
  return translations[normalizeLocale(locale)];
}

export function getLocalizedCatalog(locale, juices) {
  const language = getTranslations(locale);
  return juices.map((juice) => {
    const translated = language.catalog[juice.name] ?? {};
    return {
      ...juice,
      ...translated,
      description: translated.description ?? juice.description,
      availability: translated.availability ?? juice.availability,
      tag: translated.tag ?? juice.tag,
    };
  });
}

export function getLocalizedCombos(locale, combos) {
  const language = getTranslations(locale);
  return combos.map((combo) => {
    const translated = language.combos[combo.title] ?? {};
    return {
      ...combo,
      ...translated,
      detail: translated.detail ?? combo.detail,
    };
  });
}
