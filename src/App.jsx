import { useEffect, useMemo, useState } from "react";
import "./App.css";

const featuredJuices = [
  {
    name: "Suco Verde Detox",
    description: "Couve, limão, maçã e gengibre. Refrescante e rico em fibras.",
    price: "R$ 14,90",
    badge: "Mais pedido",
  },
  {
    name: "Laranja com Acerola",
    description: "Vitamina C em dobro para reforçar sua rotina com sabor.",
    price: "R$ 12,90",
    badge: "Imunidade",
  },
  {
    name: "Abacaxi com Hortelã",
    description: "Combinação clássica tropical, leve e super aromática.",
    price: "R$ 13,90",
    badge: "Natural",
  },
  {
    name: "Vermelho Energético",
    description: "Beterraba, morango e maçã para energia antes do treino.",
    price: "R$ 15,90",
    badge: "Pré-treino",
  },
];

const categories = ["Detox", "Tradicionais", "Funcionais", "Kids", "Shots"];

const benefits = [
  {
    title: "Entrega rápida",
    text: "Receba em até 45 minutos nas principais regiões da cidade.",
  },
  {
    title: "Ingredientes frescos",
    text: "Produção diária com frutas selecionadas e sem conservantes.",
  },
  {
    title: "Combos promocionais",
    text: "Monte kits semanais e economize em pedidos recorrentes.",
  },
];

const securityBadges = [
  {
    title: "SSL/TLS Ativo",
    description: "Todo o checkout usa HTTPS com criptografia ponta a ponta.",
    icon: "🔒",
  },
  {
    title: "Pagamento protegido",
    description: "Transações monitoradas com validação antifraude em tempo real.",
    icon: "🛡️",
  },
  {
    title: "LGPD e dados seguros",
    description: "Coletamos apenas dados essenciais e com transparência de uso.",
    icon: "✅",
  },
];

const trustPolicies = [
  {
    title: "Política de privacidade",
    summary: "Saiba quais dados coletamos e como protegemos suas informações pessoais.",
    details:
      "Utilizamos seus dados apenas para processamento de pedidos, entrega e suporte. Não comercializamos informações pessoais e você pode solicitar atualização ou exclusão dos dados a qualquer momento.",
  },
  {
    title: "Política de devolução",
    summary: "Processo simples para troca ou reembolso em caso de divergência no pedido.",
    details:
      "Se houver qualquer problema de qualidade, avaria ou item incorreto, você pode solicitar devolução em até 7 dias corridos. Após análise, oferecemos reenvio do produto ou estorno integral do valor pago.",
const aboutQuickLinks = [
  { id: "horarios", label: "Horários de funcionamento", target: "#sobre-horarios" },
  { id: "localizacao", label: "Como chegar", target: "#sobre-localizacao" },
  { id: "contato", label: "Canais de contato", target: "#sobre-contato" },
];

const businessHours = [
  { day: "Segunda a sexta", time: "08h às 20h" },
  { day: "Sábado", time: "09h às 18h" },
  { day: "Domingo", time: "09h às 14h" },
  { day: "Feriados", time: "10h às 14h" },
const brandStory = {
  origin:
    "A Casa dos Sucos nasceu em uma pequena feira de bairro, quando nossa fundadora começou a preparar receitas naturais para ajudar a família a manter uma alimentação mais equilibrada no dia a dia.",
  purpose:
    "Hoje, nosso propósito é tornar escolhas saudáveis acessíveis, com sucos de verdade, feitos com ingredientes frescos, rastreáveis e selecionados com responsabilidade.",
  commitments: [
    {
      title: "Compromisso com a saúde",
      text: "Nossas combinações são livres de conservantes e sem açúcar adicionado, priorizando valor nutricional e segurança alimentar em cada lote.",
    },
    {
      title: "Compromisso com a sustentabilidade",
      text: "Utilizamos embalagens recicláveis, reaproveitamos subprodutos orgânicos e otimizamos rotas de entrega para reduzir emissões.",
    },
    {
      title: "Compromisso com fornecedores locais",
      text: "Trabalhamos com produtores da região, fortalecendo a economia local e garantindo frutas mais frescas, colhidas no tempo certo.",
    },
  ],
};
const sustainabilityInitiatives = [
  {
    title: "Embalagens recicláveis",
    description:
      "Nossas garrafas e tampas são 100% recicláveis, com instruções de descarte no rótulo para facilitar a coleta seletiva.",
    metric: "92% dos pedidos já usam embalagem reciclável",
  },
  {
    title: "Ingredientes orgânicos selecionados",
    description:
      "Priorizamos frutas, vegetais e superalimentos de produtores orgânicos parceiros, reduzindo uso de agrotóxicos.",
    metric: "Mais de 70% do cardápio com base orgânica",
  },
  {
    title: "Política de redução de plástico",
    description:
      "Retiramos canudos plásticos, adotamos lacres de menor gramatura e incentivamos retornáveis para assinantes.",
    metric: "Meta de reduzir 35% do plástico virgem até 2026",
  },
];

const refrigeratedDeliveryOptions = [
  {
    title: "Entrega refrigerada expressa",
    transportTime: "30 a 45 min",
    care: "Bolsa térmica lacrada + gelo reciclável para manter entre 2°C e 6°C.",
    note: "Ideal para consumo imediato.",
  },
  {
    title: "Entrega refrigerada programada",
    transportTime: "Até 2h no mesmo turno",
    care: "Caixa térmica com monitoramento de temperatura e proteção contra luz solar.",
    note: "Perfeita para pedidos em grupo e assinaturas.",
  },
  {
    title: "Entrega regional com cadeia fria",
    transportTime: "2h a 4h",
    care: "Veículo climatizado e embalagem com barreira térmica reforçada.",
    note: "Recomendado para kits semanais maiores.",
  },
];

const subscriptionOptions = [
  { id: "detox", name: "Detox Verde", description: "Leve e funcional", price: 14.9 },
  { id: "energia", name: "Vermelho Energético", description: "Pré-treino natural", price: 15.9 },
  { id: "imunidade", name: "Laranja + Acerola", description: "Vitamina C em dobro", price: 12.9 },
  { id: "digestivo", name: "Abacaxi + Hortelã", description: "Refrescância digestiva", price: 13.9 },
  { id: "kids", name: "Maçã + Morango Kids", description: "Sem açúcar adicionado", price: 11.9 },
];

const paymentMethods = [
  {
    id: "credit",
    title: "Cartão de crédito",
    description: "Aceitamos Visa, Mastercard, Elo, American Express e Hipercard.",
    detail: "Parcelamento em até 12x com aprovação imediata.",
    tags: ["Visa", "Mastercard", "Elo", "Amex", "Hipercard"],
  },
  {
    id: "boleto",
    title: "Boleto bancário",
    description: "Opção sem cartão para quem prefere pagar à vista.",
    detail: "Compensação em até 1 dia útil e confirmação automática do pedido.",
    tags: ["Sem cartão", "À vista"],
  },
  {
    id: "pix",
    title: "Pix",
    description: "Pagamento instantâneo com QR Code e chave Copia e Cola.",
    detail: "Desconto extra de 5% em compras avulsas.",
    tags: ["Instantâneo", "24/7", "QR Code"],
  },
  {
    id: "wallets",
    title: "Carteiras digitais",
    description: "Finalize com Apple Pay ou Google Pay em poucos toques.",
    detail: "Checkout com biometria, sem digitar dados do cartão.",
    tags: ["Apple Pay", "Google Pay"],
  },
  {
    id: "bnpl",
    title: "Buy now, pay later",
    description: "Compre agora e pague em parcelas quinzenais sem burocracia.",
    detail: "Ideal para incluir mais clientes com limite reduzido no cartão.",
    tags: ["Aprovação rápida", "Parcelas quinzenais"],
  },
];

const flavorIngredients = {
  frutas: [
    {
      id: "banana",
      name: "Banana",
      calories: 89,
      benefits: ["Fonte de potássio", "Energia rápida"],
    },
    {
      id: "morango",
      name: "Morango",
      calories: 32,
      benefits: ["Rico em vitamina C", "Ação antioxidante"],
    },
    {
      id: "abacaxi",
      name: "Abacaxi",
      calories: 50,
      benefits: ["Auxilia na digestão", "Hidratação natural"],
    },
  ],
  vegetais: [
    {
      id: "couve",
      name: "Couve",
      calories: 35,
      benefits: ["Alto teor de fibras", "Rico em ferro"],
    },
    {
      id: "cenoura",
      name: "Cenoura",
      calories: 41,
      benefits: ["Fonte de vitamina A", "Contribui para a saúde da pele"],
    },
    {
      id: "beterraba",
      name: "Beterraba",
      calories: 43,
      benefits: ["Apoia a circulação", "Pré-treino natural"],
    },
  ],
  superalimentos: [
    {
      id: "chia",
      name: "Chia",
      calories: 49,
      benefits: ["Ômega-3 vegetal", "Promove saciedade"],
    },
    {
      id: "gengibre",
      name: "Gengibre",
      calories: 16,
      benefits: ["Ação anti-inflamatória", "Estimula a digestão"],
    },
    {
      id: "spirulina",
      name: "Spirulina",
      calories: 20,
      benefits: ["Proteína vegetal", "Apoia a imunidade"],
    },
  ],
};

const ingredientGroups = [
  { id: "frutas", label: "Frutas" },
  { id: "vegetais", label: "Vegetais" },
  { id: "superalimentos", label: "Superalimentos" },
];

const nutritionistSpecialties = [
  {
    id: "detox",
    label: "Plano detox",
    message:
      "Para um detox equilibrado, alterne sucos verdes com bases cítricas e mantenha ingestão de água ao longo do dia.",
  },
  {
    id: "emagrecimento",
    label: "Controle de calorias",
    message:
      "Priorize combinações com vegetais de baixo índice glicêmico e acrescente fibras para aumentar saciedade.",
  },
  {
    id: "energia",
    label: "Energia e performance",
    message:
      "Antes do treino, use frutas com carboidratos naturais e um ingrediente anti-inflamatório, como gengibre.",
  },
  {
    id: "imunidade",
    label: "Reforço da imunidade",
    message:
      "Combine frutas ricas em vitamina C com superalimentos em doses moderadas para potencializar micronutrientes.",
  },
];

const nutritionCalculatorGoals = [
  { id: "emagrecer", label: "Emagrecimento", targetCalories: 220, focus: "detox" },
  { id: "manter", label: "Manutenção", targetCalories: 280, focus: "equilibrado" },
  { id: "ganhar", label: "Ganho de energia muscular", targetCalories: 340, focus: "performance" },
];

const marketingPlatforms = [
  {
    id: "email",
    name: "E-mail",
    provider: "Mailchimp",
    description: "Fluxos para carrinho abandonado, pós-compra e campanhas sazonais.",
  },
  {
    id: "sms",
    name: "SMS",
    provider: "Twilio",
    description: "Lembretes curtos com cupom e links diretos para finalizar o pedido.",
  },
  {
    id: "push",
    name: "Push",
    provider: "OneSignal",
    description: "Notificações em tempo real com ofertas segmentadas por comportamento.",
  },
];

const audienceSegments = [
  {
    id: "frequentes",
    label: "Clientes frequentes",
    profile: "Mais de 2 compras por mês",
    incentive: "Cupom VIP de 15%",
  },
  {
    id: "primeiraCompra",
    label: "Primeira compra",
    profile: "Primeiro pedido nos últimos 30 dias",
    incentive: "Frete grátis na recompra",
  },
  {
    id: "detox",
    label: "Interesse em detox",
    profile: "Produtos verdes e funcionais no carrinho",
    incentive: "Combo detox com 10% off",
  },
];

const automationJourneys = [
  {
    id: "abandonedCart",
    title: "Carrinho abandonado",
    objective: "Recuperar pedidos não finalizados",
    delay: "30 min após abandono",
    channels: ["email", "sms", "push"],
    message:
      "Você deixou produtos frescos no carrinho. Finalize agora e ganhe 10% com o cupom VOLTE10.",
  },
  {
    id: "postPurchase",
    title: "Pós-compra",
    objective: "Aumentar retenção e recompra",
    delay: "2 dias após a entrega",
    channels: ["email", "push"],
    message:
      "Como foi sua experiência? Avalie o pedido e receba recomendações personalizadas para a próxima semana.",
  },
  {
    id: "segmentedOffers",
    title: "Ofertas segmentadas",
    objective: "Promover combos alinhados ao perfil",
    delay: "1x por semana",
    channels: ["email", "sms", "push"],
    message:
      "Selecionamos ofertas para seu perfil. Aproveite combos com validade curta e prioridade de entrega.",
  },
];

const juiceRecommendations = [
  {
    id: "detox-matinal",
    name: "Detox Matinal",
    calories: 180,
    period: "manha",
    goals: ["emagrecer", "manter"],
    tags: ["detox", "equilibrado"],
    description: "Couve, pepino, maçã verde e limão para começar o dia com leveza.",
  },
  {
    id: "citricos-imunidade",
    name: "Cítrico de Imunidade",
    calories: 210,
    period: "manha",
    goals: ["manter"],
    tags: ["equilibrado"],
    description: "Laranja, acerola e gengibre com alta vitamina C e refrescância.",
  },
  {
    id: "pos-treino",
    name: "Pós-treino Recuperação",
    calories: 320,
    period: "posTreino",
    goals: ["ganhar", "manter"],
    tags: ["performance"],
    description: "Beterraba, morango, banana e água de coco para reposição rápida.",
  },
  {
    id: "pre-treino",
    name: "Pré-treino Natural",
    calories: 300,
    period: "preTreino",
    goals: ["ganhar", "manter"],
    tags: ["performance"],
    description: "Abacaxi, cenoura e gengibre para energia progressiva antes da atividade.",
  },
  {
    id: "noturno-funcional",
    name: "Noturno Funcional",
    calories: 230,
    period: "noite",
    goals: ["emagrecer", "manter"],
    tags: ["detox", "equilibrado"],
    description: "Maracujá, couve e hortelã para hidratação e leve digestão no fim do dia.",
  },
];

const inventoryProducts = [
  { id: "detox", name: "Suco Verde Detox", onlineStock: 18, physicalStock: 20 },
  { id: "energia", name: "Vermelho Energético", onlineStock: 10, physicalStock: 9 },
  { id: "imunidade", name: "Laranja com Acerola", onlineStock: 14, physicalStock: 14 },
  { id: "digestivo", name: "Abacaxi com Hortelã", onlineStock: 7, physicalStock: 5 },
];

const supportFaqs = [
  {
    id: "prazo-entrega",
    question: "Qual é o prazo de entrega dos pedidos?",
    answer:
      "Pedidos expressos chegam em 30 a 45 minutos. Você também pode escolher entrega programada para o mesmo turno.",
  },
  {
    id: "conservacao",
    question: "Como conservar os sucos após receber?",
    answer:
      "Mantenha refrigerado entre 2°C e 6°C e consuma em até 24h para melhor sabor, frescor e valor nutricional.",
  },
  {
    id: "assinatura",
    question: "Posso pausar ou alterar minha assinatura?",
    answer:
      "Sim. Você pode pausar, retomar ou editar os sabores da assinatura a qualquer momento no painel do cliente.",
  },
  {
    id: "pagamento",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos Pix, cartão de crédito, débito e carteiras digitais. Para empresas, também emitimos cobrança faturada.",
  },
];

const orderTrackingMock = {
  CSC1024: {
    status: "Em rota de entrega",
    eta: "18 min",
    detail: "Motoboy saiu do centro de distribuição às 14:22.",
  },
  CSC2048: {
    status: "Separando pedido",
    eta: "35 min",
    detail: "Estamos finalizando o empacotamento refrigerado do seu combo.",
  },
  CSC4096: {
    status: "Pedido entregue",
    eta: "Concluído",
    detail: "Entrega realizada com sucesso às 12:07.",
const customerReviews = [
  {
    id: 1,
    name: "Camila T.",
    location: "Vila Mariana",
    rating: 5,
    comment:
      "Assino há 3 meses e a qualidade é sempre impecável. O suco chega gelado e com sabor de fruta de verdade.",
  },
  {
    id: 2,
    name: "Rafael M.",
    location: "Pinheiros",
    rating: 5,
    comment:
      "Comprei para o pós-treino e virei cliente fixo. Entrega rápida e atendimento super prestativo.",
  },
  {
    id: 3,
    name: "Juliana S.",
    location: "Moema",
    rating: 4,
    comment:
      "Gostei muito do combinador de sabores. Consegui montar opções leves para a semana inteira.",
  },
  {
    id: 4,
    name: "Eduardo L.",
    location: "Brooklin",
    rating: 5,
    comment:
      "Excelente custo-benefício nos combos. Minha equipe do escritório pede toda sexta-feira.",
  },
];

const socialProofNotifications = [
  "Ana, da Bela Vista, avaliou 5★ o Combo Vitalidade há 2 min.",
  "+18 pedidos finalizados no último horário de almoço.",
  "Pedro acabou de renovar a assinatura Detox Verde por mais 30 dias.",
  "94% dos clientes recomendam a Casa dos Sucos para amigos e família.",
];
const socialLinks = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@casadossucos",
    href: "https://www.instagram.com/",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "/casadossucos",
    href: "https://www.facebook.com/",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    handle: "(11) 99999-1212",
    href: "https://wa.me/5511999991212",
  },
];

const customerPhotoTips = [
  "Marque @casadossucos e use a hashtag #MeuSucoCasaDosSucos.",
  "Publique seu momento com o suco e conte qual sabor pediu.",
  "As melhores fotos da semana aparecem em nossos stories com cupom surpresa.",
];
const campaignPreferenceOptions = [
  { id: "detox", label: "Sucos detox" },
  { id: "energetico", label: "Sucos energéticos" },
  { id: "semLactose", label: "Sem lactose" },
];

const purchaseFrequencyOptions = [
  { id: "alta", label: "Alta (2+ pedidos por semana)", minPurchases: 8 },
  { id: "media", label: "Média (1 pedido por semana)", minPurchases: 4 },
  { id: "baixa", label: "Baixa (até 3 pedidos por mês)", minPurchases: 1 },
];

const crmCustomers = [
  {
    id: "cliente-01",
    name: "Mariana Oliveira",
    preference: "detox",
    frequency: "alta",
    monthlyPurchases: 10,
    channel: "WhatsApp",
  },
  {
    id: "cliente-02",
    name: "Lucas Mendes",
    preference: "energetico",
    frequency: "media",
    monthlyPurchases: 5,
    channel: "E-mail",
  },
  {
    id: "cliente-03",
    name: "Carla Nogueira",
    preference: "semLactose",
    frequency: "media",
    monthlyPurchases: 4,
    channel: "WhatsApp",
  },
  {
    id: "cliente-04",
    name: "Felipe Santos",
    preference: "detox",
    frequency: "baixa",
    monthlyPurchases: 2,
    channel: "Push app",
  },
  {
    id: "cliente-05",
    name: "Aline Rocha",
    preference: "energetico",
    frequency: "alta",
    monthlyPurchases: 9,
    channel: "WhatsApp",
  },
];

const campaignLibrary = {
  detox: {
    alta: {
      title: "VIP Detox da Semana",
      message:
        "Ofereça upgrade para kit 10x detox com 15% OFF e entrega refrigerada prioritária para manter recorrência.",
    },
    media: {
      title: "Rotina Detox 2x1",
      message:
        "Envie cupom de recompra com validade de 5 dias para converter pedidos quinzenais em semanais.",
    },
    baixa: {
      title: "Volte ao Detox",
      message:
        "Dispare campanha de reativação com frete grátis + sugestão de plano de 3 dias para retomar o hábito.",
    },
  },
  energetico: {
    alta: {
      title: "Pré-treino Premium",
      message:
        "Campanha com combos energéticos + shot de gengibre como brinde para clientes de alta frequência.",
    },
    media: {
      title: "Energia no Meio da Semana",
      message:
        "Incentive o 2º pedido da semana com desconto progressivo em sucos vermelhos e cítricos energéticos.",
    },
    baixa: {
      title: "Retorno Energia Natural",
      message:
        "Oferta de primeira recomposição do mês com 20% OFF em kits pré e pós-treino.",
    },
  },
  semLactose: {
    alta: {
      title: "Clube Zero Lactose",
      message:
        "Envie campanhas exclusivas com lançamentos sem lactose e pontos extras no programa de fidelidade.",
    },
    media: {
      title: "Semana Leve Sem Lactose",
      message:
        "Sugira assinatura quinzenal com preço fechado e comunicação focada em digestibilidade.",
    },
    baixa: {
      title: "Reativação Sem Lactose",
      message:
        "Dispare cupom de retomada com recomendação de sabores suaves e CTA para montar combo personalizado.",
    },
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function App() {
  const [selectedJuices, setSelectedJuices] = useState(["detox", "imunidade", "digestivo"]);
  const [isSubscriptionPaused, setIsSubscriptionPaused] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState({
    frutas: ["abacaxi"],
    vegetais: ["couve"],
    superalimentos: ["gengibre"],
  });
  const [selectedNutritionGoal, setSelectedNutritionGoal] = useState("detox");
  const [dailyCalorieBurn, setDailyCalorieBurn] = useState(2100);
  const [calculatorGoal, setCalculatorGoal] = useState("manter");
  const [consumptionPeriod, setConsumptionPeriod] = useState("manha");
  const [inventoryItems, setInventoryItems] = useState(inventoryProducts);

  const updateInventory = (productId, field, amount) => {
    setInventoryItems((current) =>
      current.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const nextValue = Math.max(0, item[field] + amount);
        return {
          ...item,
          [field]: nextValue,
        };
      })
    );
  };

  const syncProductStock = (productId) => {
    setInventoryItems((current) =>
      current.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const synchronizedStock = Math.min(item.onlineStock, item.physicalStock);
        return {
          ...item,
          onlineStock: synchronizedStock,
        };
      })
    );
  };

  const syncAllStock = () => {
    setInventoryItems((current) =>
      current.map((item) => ({
        ...item,
        onlineStock: Math.min(item.onlineStock, item.physicalStock),
      }))
    );
  };

  const inventorySummary = useMemo(() => {
    const totalOnline = inventoryItems.reduce((total, item) => total + item.onlineStock, 0);
    const totalPhysical = inventoryItems.reduce((total, item) => total + item.physicalStock, 0);
    const divergenceCount = inventoryItems.filter((item) => item.onlineStock !== item.physicalStock).length;

    return {
      totalOnline,
      totalPhysical,
      divergenceCount,
    };
  }, [inventoryItems]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit");
  const [activeFaq, setActiveFaq] = useState(supportFaqs[0].id);
  const [trackingCode, setTrackingCode] = useState("CSC1024");
  const [socialProofIndex, setSocialProofIndex] = useState(0);
  const [enabledChannels, setEnabledChannels] = useState(["email", "push"]);
  const [selectedSegment, setSelectedSegment] = useState("frequentes");
  const [campaignPreference, setCampaignPreference] = useState("detox");
  const [campaignFrequency, setCampaignFrequency] = useState("alta");

  const selectedItems = useMemo(
    () => subscriptionOptions.filter((option) => selectedJuices.includes(option.id)),
    [selectedJuices]
  );

  const estimatedMonthlyTotal = useMemo(
    () => selectedItems.reduce((total, item) => total + item.price * 4, 0),
    [selectedItems]
  );

  const selectedFlavorItems = useMemo(
    () =>
      ingredientGroups.flatMap((group) =>
        flavorIngredients[group.id].filter((ingredient) =>
          selectedIngredients[group.id].includes(ingredient.id)
        )
      ),
    [selectedIngredients]
  );

  const estimatedCalories = useMemo(
    () => selectedFlavorItems.reduce((total, ingredient) => total + ingredient.calories, 0),
    [selectedFlavorItems]
  );

  const liveBenefits = useMemo(
    () => Array.from(new Set(selectedFlavorItems.flatMap((ingredient) => ingredient.benefits))),
    [selectedFlavorItems]
  );

  const toggleJuiceSelection = (juiceId) => {
    setSelectedJuices((current) => {
      if (current.includes(juiceId)) {
        return current.filter((id) => id !== juiceId);
      }
      return [...current, juiceId];
    });
  };

  const toggleIngredient = (groupId, ingredientId) => {
    setSelectedIngredients((current) => {
      const currentGroup = current[groupId];
      const updatedGroup = currentGroup.includes(ingredientId)
        ? currentGroup.filter((id) => id !== ingredientId)
        : [...currentGroup, ingredientId];

      return {
        ...current,
        [groupId]: updatedGroup,
      };
    });
  };

  const selectedSpecialty = nutritionistSpecialties.find(
    (specialty) => specialty.id === selectedNutritionGoal
  );

  const selectedCalculatorGoal = nutritionCalculatorGoals.find((goal) => goal.id === calculatorGoal);

  const calorieRange = useMemo(() => {
    const baseCalories = selectedCalculatorGoal?.targetCalories ?? 280;
    const adjustment = Math.round((dailyCalorieBurn - 2000) / 25);
    const center = Math.max(150, baseCalories + adjustment);

    return {
      min: Math.max(120, center - 70),
      max: center + 70,
    };
  }, [dailyCalorieBurn, selectedCalculatorGoal]);

  const compatibleRecommendations = useMemo(
    () =>
      juiceRecommendations.filter((juice) => {
        const matchesGoal = juice.goals.includes(calculatorGoal);
        const matchesPeriod = juice.period === consumptionPeriod;
        const matchesFocus = selectedCalculatorGoal
          ? juice.tags.includes(selectedCalculatorGoal.focus)
          : true;
        const matchesCalories =
          juice.calories >= calorieRange.min && juice.calories <= calorieRange.max;

        return matchesGoal && matchesPeriod && matchesFocus && matchesCalories;
      }),
    [calculatorGoal, consumptionPeriod, selectedCalculatorGoal, calorieRange]
  );

  const highlightedPaymentMethod = useMemo(
    () => paymentMethods.find((method) => method.id === selectedPaymentMethod),
    [selectedPaymentMethod]
  );

  const trackingResult = orderTrackingMock[trackingCode.trim().toUpperCase()];
  const averageRating = useMemo(
    () =>
      customerReviews.reduce((total, review) => total + review.rating, 0) /
      customerReviews.length,
    []
  );

  const fiveStarPercentage = useMemo(() => {
    const fiveStarReviews = customerReviews.filter((review) => review.rating === 5).length;
    return Math.round((fiveStarReviews / customerReviews.length) * 100);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSocialProofIndex((current) => (current + 1) % socialProofNotifications.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, []);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => (
      <span key={`${rating}-${index}`} aria-hidden="true" className={index < rating ? "filled" : "empty"}>
        ★
      </span>
    ));
  const activeSegment = audienceSegments.find((segment) => segment.id === selectedSegment);

  const visibleJourneys = useMemo(
    () =>
      automationJourneys.filter((journey) =>
        journey.channels.some((channel) => enabledChannels.includes(channel))
      ),
    [enabledChannels]
  );

  const toggleChannel = (channelId) => {
    setEnabledChannels((current) => {
      if (current.includes(channelId)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((id) => id !== channelId);
      }
      return [...current, channelId];
    });
  };
  const segmentedCustomers = useMemo(
    () =>
      crmCustomers.filter(
        (customer) =>
          customer.preference === campaignPreference && customer.frequency === campaignFrequency
      ),
    [campaignPreference, campaignFrequency]
  );

  const selectedCampaign = campaignLibrary[campaignPreference][campaignFrequency];

  return (
    <div className="juice-page">
      <header className="topbar">
        <p>
          Frete grátis acima de R$ 79 · Cupom de boas-vindas: <strong>SUCONOVO10</strong>
        </p>
      </header>

      <nav className="navbar">
        <h1>Casa dos Sucos</h1>
        <ul>
          <li>
            <a href="#sobre">Sobre</a>
            <a href="#historia-proposito">História e propósito</a>
          </li>
          <li>
            <a href="#catalogo">Catálogo</a>
          </li>
          <li>
            <a href="#beneficios">Benefícios</a>
          </li>
          <li>
            <a href="#sustentabilidade">Sustentabilidade</a>
          </li>
          <li>
            <a href="#entrega-refrigerada">Entrega refrigerada</a>
          </li>
          <li>
            <a href="#estoque">Estoque e logística</a>
          </li>
          <li>
            <a href="#combinador">Combinador</a>
          </li>
          <li>
            <a href="#assinatura">Assinatura</a>
          </li>
          <li>
            <a href="#pagamentos">Pagamentos</a>
          </li>
          <li>
            <a href="#consultoria">Consultoria</a>
          </li>
          <li>
            <a href="#seguranca">Segurança</a>
            <a href="#automacao-marketing">Automação de marketing</a>
          </li>
          <li>
            <a href="#calculadora">Calculadora nutricional</a>
          </li>
          <li>
            <a href="#reviews">Reviews</a>
            <a href="#redes-sociais">Redes sociais</a>
            <a href="#campanhas">Campanhas</a>
          </li>
          <li>
            <a href="#contato">Contato</a>
          </li>
          <li>
            <a href="#suporte">Suporte</a>
          </li>
        </ul>
        <button className="cta">Pedir agora</button>
      </nav>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Loja online de sucos naturais</p>
            <h2>Sucos frescos para o seu dia, sem açúcar e sem conservantes.</h2>
            <p>
              Inspirado em grandes lojas de sucos, nosso cardápio foi pensado para quem busca
              praticidade, saúde e sabor em cada gole.
            </p>
            <div className="hero-actions">
              <button className="cta">Ver cardápio</button>
              <button className="ghost">Montar combo</button>
            </div>

            <div className="home-map-links" aria-label="Mapa rápido da homepage">
              <p>Atalhos úteis:</p>
              <ul>
                {aboutQuickLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.target}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hero-highlight">
            <span>Destaque da semana</span>
            <h3>Combo Vitalidade</h3>
            <p>
              7 sucos funcionais + 3 shots detox por <strong>R$ 99,90</strong>.
            </p>
          </div>
        </section>

        <section id="sobre" className="section about-page">
          <div className="section-title">
            <h3>Sobre a Casa dos Sucos</h3>
            <p>
              Conforme recomendado pelo Toast POS, reunimos em um só lugar os dados essenciais de
              horário, localização e contato para facilitar sua decisão de compra e transmitir mais
              confiança.
            </p>
          </div>

          <div className="about-grid">
            <article id="sobre-horarios" className="about-card">
              <h4>Horários de funcionamento</h4>
              <ul>
                {businessHours.map((item) => (
                  <li key={item.day}>
                    <span>{item.day}</span>
                    <strong>{item.time}</strong>
                  </li>
                ))}
              </ul>
            </article>

            <article id="sobre-localizacao" className="about-card">
              <h4>Localização</h4>
              <p>Rua das Frutas, 245 · Vila Mariana · São Paulo, SP</p>
              <p>Próximo à estação Ana Rosa e com retirada rápida no balcão.</p>
              <a
                href="https://maps.google.com/?q=Rua+das+Frutas+245+Sao+Paulo"
                target="_blank"
                rel="noreferrer"
              >
                Ver no mapa
              </a>
            </article>

            <article id="sobre-contato" className="about-card">
              <h4>Contato</h4>
              <p>
                WhatsApp: <a href="https://wa.me/5511999991212">(11) 99999-1212</a>
              </p>
              <p>
                E-mail: <a href="mailto:atendimento@casadossucos.com.br">atendimento@casadossucos.com.br</a>
              </p>
              <p>
                Instagram: <a href="https://instagram.com/casadossucos">@casadossucos</a>
              </p>
            </article>
        <section id="historia-proposito" className="section brand-story">
          <div className="section-title">
            <h3>História da marca e propósito</h3>
          </div>

          <div className="brand-story-layout">
            <article className="brand-story-text">
              <p>{brandStory.origin}</p>
              <p>{brandStory.purpose}</p>
            </article>

            <div className="brand-commitments">
              {brandStory.commitments.map((commitment) => (
                <article key={commitment.title}>
                  <h4>{commitment.title}</h4>
                  <p>{commitment.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="catalogo" className="section">
          <div className="section-title">
            <h3>Conheça nossas categorias</h3>
            <p>Escolha por objetivo e monte seu carrinho em poucos cliques.</p>
          </div>
          <div className="chips">
            {categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>

          <div className="product-grid">
            {featuredJuices.map((juice) => (
              <article key={juice.name} className="product-card">
                <small>{juice.badge}</small>
                <h4>{juice.name}</h4>
                <p>{juice.description}</p>
                <div className="price-row">
                  <strong>{juice.price}</strong>
                  <button>Adicionar</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="beneficios" className="section alt">
          <div className="section-title">
            <h3>Por que comprar com a Casa dos Sucos?</h3>
          </div>
          <div className="benefits-grid">
            {benefits.map((item) => (
              <article key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="sustentabilidade" className="section sustainability">
          <div className="section-title">
            <h3>Sustentabilidade e embalagens</h3>
            <p>
              Transparência sobre reciclagem, ingredientes orgânicos e redução de plástico para
              consumidores conscientes.
            </p>
          </div>

          <div className="sustainability-grid">
            {sustainabilityInitiatives.map((initiative) => (
              <article key={initiative.title} className="sustainability-card">
                <h4>{initiative.title}</h4>
                <p>{initiative.description}</p>
                <small>{initiative.metric}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="entrega-refrigerada" className="section cold-delivery">
          <div className="section-title">
            <h3>Opções de entrega refrigerada</h3>
            <p>
              Escolha a modalidade ideal e acompanhe o tempo de transporte para manter seu suco
              com frescor e segurança até a entrega.
            </p>
          </div>

          <div className="delivery-grid">
            {refrigeratedDeliveryOptions.map((option) => (
              <article key={option.title} className="delivery-card">
                <h4>{option.title}</h4>
                <p>
                  <strong>Tempo de transporte:</strong> {option.transportTime}
                </p>
                <p>
                  <strong>Cuidados de conservação:</strong> {option.care}
                </p>
                <small>{option.note}</small>
              </article>
            ))}
          </div>

          <aside className="perishability-alert" role="alert" aria-live="polite">
            <strong>Alerta de perecibilidade:</strong> nossos sucos são 100% naturais e devem ser
            mantidos refrigerados entre 2°C e 6°C. Após o recebimento, consuma em até 24h para
            preservar sabor, nutrientes e segurança alimentar.
          </aside>
        </section>

        <section id="estoque" className="section inventory-sync">
          <div className="section-title">
            <h3>Gestão de estoque e logística</h3>
            <p>
              Sincronize o estoque da loja online com o estoque físico para bloquear vendas de itens
              indisponíveis e reduzir rupturas na operação.
            </p>
          </div>

          <div className="inventory-summary" aria-live="polite">
            <p>
              <strong>Estoque online total:</strong> {inventorySummary.totalOnline} unidades
            </p>
            <p>
              <strong>Estoque físico total:</strong> {inventorySummary.totalPhysical} unidades
            </p>
            <p>
              <strong>Divergências detectadas:</strong> {inventorySummary.divergenceCount}
            </p>
            <button onClick={syncAllStock}>Sincronizar tudo agora</button>
          </div>

          <div className="inventory-grid">
            {inventoryItems.map((item) => {
              const hasDivergence = item.onlineStock !== item.physicalStock;
              const saleBlocked = item.physicalStock <= 0 || item.onlineStock > item.physicalStock;

              return (
                <article key={item.id} className={`inventory-card ${saleBlocked ? "blocked" : ""}`}>
                  <h4>{item.name}</h4>
                  <p>
                    <strong>Online:</strong> {item.onlineStock} · <strong>Físico:</strong> {item.physicalStock}
                  </p>

                  <div className="inventory-actions">
                    <button onClick={() => updateInventory(item.id, "onlineStock", -1)}>
                      Pedido online -1
                    </button>
                    <button onClick={() => updateInventory(item.id, "physicalStock", -1)}>
                      Baixa física -1
                    </button>
                    <button onClick={() => updateInventory(item.id, "physicalStock", 1)}>
                      Reposição +1
                    </button>
                  </div>

                  <div className="inventory-status">
                    <span className={hasDivergence ? "warning" : "ok"}>
                      {hasDivergence ? "Divergência detectada" : "Estoque sincronizado"}
                    </span>
                    <span className={saleBlocked ? "blocked" : "ok"}>
                      {saleBlocked ? "Venda online bloqueada" : "Venda online liberada"}
                    </span>
                  </div>

                  <button className="sync-btn" onClick={() => syncProductStock(item.id)}>
                    Sincronizar item
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section id="combinador" className="section flavor-combiner">
          <div className="section-title">
            <h3>Combinador de sabores</h3>
            <p>
              Selecione frutas, vegetais e superalimentos para criar sua bebida personalizada.
              As calorias e os benefícios são atualizados em tempo real.
            </p>
          </div>

          <div className="combiner-layout">
            <div className="combiner-groups">
              {ingredientGroups.map((group) => (
                <article key={group.id} className="combiner-group">
                  <h4>{group.label}</h4>
                  <div className="combiner-options">
                    {flavorIngredients[group.id].map((ingredient) => {
                      const isSelected = selectedIngredients[group.id].includes(ingredient.id);
                      return (
                        <label
                          key={ingredient.id}
                          className={`ingredient-option ${isSelected ? "selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleIngredient(group.id, ingredient.id)}
                          />
                          <div>
                            <strong>{ingredient.name}</strong>
                            <span>{ingredient.calories} kcal por porção</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>

            <aside className="combiner-summary" aria-live="polite">
              <h4>Resumo da bebida</h4>
              <p>
                <strong>Ingredientes selecionados:</strong> {selectedFlavorItems.length}
              </p>
              <p>
                <strong>Calorias estimadas:</strong> {estimatedCalories} kcal
              </p>

              <h5>Benefícios em destaque</h5>
              {liveBenefits.length ? (
                <ul>
                  {liveBenefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p>Selecione ingredientes para visualizar os benefícios.</p>
              )}
            </aside>
          </div>
        </section>

        <section id="assinatura" className="subscription">
          <h3>Assinatura ajustável</h3>
          <p>
            Monte sua caixa mensal com os sabores que preferir e altere a composição quando quiser,
            sem burocracia.
          </p>

          <div className="subscription-controls">
            <div className="box-customizer">
              <h4>Escolha os itens da sua caixa</h4>
              <p>Você pode adicionar ou remover sabores a qualquer momento.</p>
              <div className="subscription-items-grid">
                {subscriptionOptions.map((option) => {
                  const isSelected = selectedJuices.includes(option.id);
                  return (
                    <label key={option.id} className={`subscription-item ${isSelected ? "selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleJuiceSelection(option.id)}
                      />
                      <div>
                        <strong>{option.name}</strong>
                        <span>{option.description}</span>
                        <small>{formatCurrency(option.price)} por garrafa</small>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <aside className="subscription-status" aria-live="polite">
              <h4>Status da assinatura</h4>
              <p>
                <strong>Sabores selecionados:</strong> {selectedItems.length}
              </p>
              <p>
                <strong>Estimativa mensal:</strong> {formatCurrency(estimatedMonthlyTotal)}
              </p>
              <p>
                <strong>Entrega:</strong> segunda a sábado, no turno escolhido.
              </p>

              <button
                className={`pause-btn ${isSubscriptionPaused ? "paused" : "active"}`}
                onClick={() => setIsSubscriptionPaused((current) => !current)}
              >
                {isSubscriptionPaused ? "Retomar assinatura" : "Pausar assinatura"}
              </button>

              <p className="pause-feedback">
                {isSubscriptionPaused
                  ? "Assinatura pausada. Nenhuma entrega será cobrada até você retomar."
                  : "Assinatura ativa. Você pode pausar quando quiser, com efeito imediato."}
              </p>
            </aside>
          </div>
        </section>

        <section id="automacao-marketing" className="section marketing-automation">
          <div className="section-title">
            <h3>Automação de marketing</h3>
            <p>
              Integrações com plataformas de e-mail, SMS e push para recuperar carrinhos
              abandonados, engajar no pós-compra e ativar ofertas segmentadas.
            </p>
          </div>

          <div className="automation-layout">
            <article className="automation-panel">
              <h4>Plataformas conectadas</h4>
              <div className="channel-grid">
                {marketingPlatforms.map((platform) => {
                  const isEnabled = enabledChannels.includes(platform.id);
                  return (
                    <label
                      key={platform.id}
                      className={`channel-card ${isEnabled ? "enabled" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleChannel(platform.id)}
                      />
                      <div>
                        <strong>{platform.name}</strong>
                        <small>Provider: {platform.provider}</small>
                        <p>{platform.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="segment-selector">
                <h4>Segmentação de público</h4>
                <div className="segment-buttons">
                  {audienceSegments.map((segment) => (
                    <button
                      key={segment.id}
                      className={selectedSegment === segment.id ? "active" : ""}
                      onClick={() => setSelectedSegment(segment.id)}
                    >
                      {segment.label}
                    </button>
                  ))}
                </div>
                <p>
                  <strong>Perfil:</strong> {activeSegment?.profile}
                </p>
                <p>
                  <strong>Incentivo padrão:</strong> {activeSegment?.incentive}
                </p>
              </div>
            </article>

            <aside className="automation-flow" aria-live="polite">
              <h4>Fluxos ativos ({visibleJourneys.length})</h4>
              {visibleJourneys.length ? (
                <ul>
                  {visibleJourneys.map((journey) => (
                    <li key={journey.id}>
                      <strong>{journey.title}</strong>
                      <span>{journey.objective}</span>
                      <span>
                        <b>Disparo:</b> {journey.delay}
                      </span>
                      <span>
                        <b>Canais:</b>{" "}
                        {journey.channels
                          .filter((channel) => enabledChannels.includes(channel))
                          .join(", ")}
                      </span>
                      <p>{journey.message}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Ative ao menos um canal para configurar automações.</p>
              )}
            </aside>
          </div>
        </section>

        <section id="calculadora" className="section nutrition-calculator">
          <div className="section-title">
            <h3>Calculadora nutricional</h3>
            <p>
              Informe seu gasto calórico e objetivo para receber sugestões de sucos compatíveis
              com sua rotina.
            </p>
          </div>

          <div className="calculator-layout">
            <article className="calculator-form">
              <label>
                Gasto calórico diário estimado (kcal)
                <input
                  type="number"
                  min="1200"
                  max="5000"
                  step="50"
                  value={dailyCalorieBurn}
                  onChange={(event) => setDailyCalorieBurn(Number(event.target.value) || 0)}
                />
              </label>

              <label>
                Objetivo
                <select value={calculatorGoal} onChange={(event) => setCalculatorGoal(event.target.value)}>
                  {nutritionCalculatorGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Momento de consumo
                <select
                  value={consumptionPeriod}
                  onChange={(event) => setConsumptionPeriod(event.target.value)}
                >
                  <option value="manha">Manhã</option>
                  <option value="preTreino">Pré-treino</option>
                  <option value="posTreino">Pós-treino</option>
                  <option value="noite">Noite</option>
                </select>
              </label>

              <p className="calculator-hint">
                Faixa ideal estimada para você: <strong>{calorieRange.min} a {calorieRange.max} kcal</strong>{" "}
                por suco.
              </p>
            </article>

            <aside className="calculator-results" aria-live="polite">
              <h4>Sugestões compatíveis</h4>
              {compatibleRecommendations.length ? (
                <ul>
                  {compatibleRecommendations.map((juice) => (
                    <li key={juice.id}>
                      <strong>{juice.name}</strong>
                      <span>{juice.calories} kcal · {juice.description}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  Não encontramos sucos com esse perfil no momento. Ajuste o gasto calórico ou o
                  objetivo para ampliar as combinações.
                </p>
              )}
            </aside>
          </div>
        </section>

        <section id="pagamentos" className="section payments">
          <div className="section-title">
            <h3>Múltiplos métodos de pagamento</h3>
            <p>
              Mais opções para incluir diferentes perfis de clientes: cartão de crédito com
              diversas bandeiras, boleto, Pix, carteiras digitais e buy now pay later.
            </p>
          </div>

          <div className="payments-layout">
            <article className="payment-methods-list">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={selectedPaymentMethod === method.id ? "selected" : ""}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                >
                  <strong>{method.title}</strong>
                  <span>{method.description}</span>
                </button>
              ))}
            </article>

            <aside className="payment-method-highlight" aria-live="polite">
              <h4>{highlightedPaymentMethod?.title}</h4>
              <p>{highlightedPaymentMethod?.detail}</p>
              <ul>
                {highlightedPaymentMethod?.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section id="consultoria" className="section nutrition-chat">
          <div className="section-title">
            <h3>Consultoria com nutricionista</h3>
            <p>
              Converse com nossa equipe para ajustar combinações de sabores e montar planos detox
              personalizados para sua rotina.
            </p>
          </div>

          <div className="nutrition-layout">
            <article className="nutrition-goals">
              <h4>Qual sua prioridade hoje?</h4>
              <div className="goal-options">
                {nutritionistSpecialties.map((specialty) => (
                  <button
                    key={specialty.id}
                    className={selectedNutritionGoal === specialty.id ? "active" : ""}
                    onClick={() => setSelectedNutritionGoal(specialty.id)}
                  >
                    {specialty.label}
                  </button>
                ))}
              </div>
              <p className="goal-description">
                A nutricionista analisa o objetivo escolhido e recomenda combinações com frutas,
                vegetais e superalimentos compatíveis com seu perfil.
              </p>
            </article>

            <aside className="nutrition-chat-card" aria-live="polite">
              <h4>Chat nutricional</h4>
              <div className="chat-message user">
                Quero uma sugestão para <strong>{selectedSpecialty?.label.toLowerCase()}</strong>.
              </div>
              <div className="chat-message specialist">
                <strong>Nutricionista:</strong> {selectedSpecialty?.message}
              </div>
              <a
                className="chat-cta"
                href="https://wa.me/5511999991212?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20a%20nutricionista%20sobre%20combina%C3%A7%C3%B5es%20de%20sabores%20e%20plano%20detox."
                target="_blank"
                rel="noreferrer"
              >
                Iniciar atendimento no WhatsApp
              </a>
            </aside>
          </div>
        </section>

        <section id="seguranca" className="section trust-section">
          <div className="section-title">
            <h3>Segurança e transparência para comprar com confiança</h3>
            <p>
              Nosso site utiliza SSL, exibe selos de proteção e publica políticas claras de
              privacidade e devolução para que você tenha previsibilidade em toda a jornada.
            </p>
          </div>

          <div className="trust-badges" aria-label="Selos de segurança">
            {securityBadges.map((badge) => (
              <article key={badge.title} className="trust-badge">
                <span className="badge-icon" aria-hidden="true">
                  {badge.icon}
                </span>
                <div>
                  <h4>{badge.title}</h4>
                  <p>{badge.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="policy-grid">
            {trustPolicies.map((policy) => (
              <details key={policy.title} className="policy-card">
                <summary>
                  <strong>{policy.title}</strong>
                  <span>{policy.summary}</span>
                </summary>
                <p>{policy.details}</p>
              </details>
            ))}
          </div>
        <section id="suporte" className="section support-center">
          <div className="section-title">
            <h3>Chat ao vivo e suporte multicanal</h3>
            <p>
              Resolva dúvidas em tempo real e receba orientação durante a compra com canais
              integrados: FAQ, chat, e-mail, telefone e rastreio de pedidos.
            </p>
          </div>

          <div className="support-layout">
            <article className="support-card live-chat-card">
              <h4>Atendimento ao vivo</h4>
              <p>
                Nosso time está online todos os dias, das 8h às 22h, para ajudar com catálogo,
                combos, assinatura e fechamento de pedidos.
              </p>
              <a
                className="chat-cta"
                href="https://wa.me/5511999991212?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20para%20comprar%20na%20Casa%20dos%20Sucos."
                target="_blank"
                rel="noreferrer"
              >
                Iniciar chat ao vivo
              </a>
            </article>

            <article className="support-card faq-card">
              <h4>FAQ rápido</h4>
              <div className="faq-list">
                {supportFaqs.map((faq) => {
                  const isActive = activeFaq === faq.id;
                  return (
                    <button
                      key={faq.id}
                      className={`faq-item ${isActive ? "active" : ""}`}
                      onClick={() => setActiveFaq(faq.id)}
                    >
                      <strong>{faq.question}</strong>
                      {isActive && <span>{faq.answer}</span>}
                    </button>
                  );
                })}
              </div>
            </article>

            <article className="support-card contact-channels">
              <h4>Outros canais</h4>
              <ul>
                <li>
                  <strong>E-mail:</strong> atendimento@casadossucos.com.br
                </li>
                <li>
                  <strong>Telefone:</strong> (11) 4000-1234
                </li>
                <li>
                  <strong>WhatsApp:</strong> (11) 99999-1212
                </li>
              </ul>
            </article>

            <article className="support-card tracking-card" aria-live="polite">
              <h4>Rastreio de pedido</h4>
              <label>
                Código do pedido
                <input
                  type="text"
                  value={trackingCode}
                  onChange={(event) => setTrackingCode(event.target.value)}
                  placeholder="Ex: CSC1024"
                />
              </label>

              {trackingResult ? (
                <div className="tracking-result">
                  <p>
                    <strong>Status:</strong> {trackingResult.status}
                  </p>
                  <p>
                    <strong>Previsão:</strong> {trackingResult.eta}
                  </p>
                  <p>{trackingResult.detail}</p>
                </div>
              ) : (
                <p className="tracking-warning">
                  Código não encontrado. Verifique o número do pedido ou fale com nosso suporte.
                </p>
              )}
            </article>
        <section id="reviews" className="section reviews-social-proof">
          <div className="section-title">
            <h3>Reviews e prova social</h3>
            <p>
              Sistemas de avaliação por estrelas e comentários fortalecem confiança e são decisivos
              para mais de 90% dos consumidores no momento de compra.
            </p>
          </div>

          <div className="reviews-overview">
            <article>
              <h4>Média geral</h4>
              <p className="rating-number">{averageRating.toFixed(1)} / 5</p>
              <div className="stars" aria-label={`Avaliação média de ${averageRating.toFixed(1)} de 5`}>
                {renderStars(Math.round(averageRating))}
              </div>
            </article>
            <article>
              <h4>Clientes satisfeitos</h4>
              <p className="rating-number">{fiveStarPercentage}%</p>
              <p className="rating-support">das avaliações recentes foram 5 estrelas.</p>
            </article>
            <article>
              <h4>Total de avaliações</h4>
              <p className="rating-number">{customerReviews.length * 47}+</p>
              <p className="rating-support">comentários verificados neste trimestre.</p>
            </article>
          </div>

          <div className="reviews-grid">
            {customerReviews.map((review) => (
              <article key={review.id} className="review-card">
                <div className="stars" aria-label={`${review.rating} de 5 estrelas`}>
                  {renderStars(review.rating)}
                </div>
                <p>{review.comment}</p>
                <small>
                  {review.name} · {review.location}
                </small>
              </article>
            ))}
        <section id="redes-sociais" className="section social-hub">
          <div className="section-title">
            <h3>Integração com redes sociais</h3>
            <p>
              Acompanhe nossos perfis, veja atualizações em tempo real e compartilhe suas fotos com
              a comunidade Casa dos Sucos.
            </p>
          </div>

          <div className="social-links" aria-label="Links para perfis sociais">
            {socialLinks.map((profile) => (
              <a key={profile.id} href={profile.href} target="_blank" rel="noreferrer">
                <strong>{profile.name}</strong>
                <span>{profile.handle}</span>
              </a>
            ))}
          </div>

          <div className="social-plugins">
            <article>
              <h4>Feed do Instagram</h4>
              <p>Confira os bastidores e lançamentos direto do nosso perfil.</p>
              <iframe
                src="https://www.instagram.com/casadossucos/embed"
                title="Plugin Instagram Casa dos Sucos"
                loading="lazy"
                allowTransparency="true"
              />
            </article>

            <article>
              <h4>Comunidade no Facebook</h4>
              <p>Acompanhe novidades, promoções e conteúdo exclusivo da página.</p>
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fcasadossucos&tabs=timeline&width=500&height=340&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true"
                title="Plugin Facebook Casa dos Sucos"
                loading="lazy"
                allow="encrypted-media"
              />
            </article>
          </div>

          <aside className="photo-sharing">
            <h4>Compartilhe sua foto e ganhe destaque</h4>
            <ul>
              {customerPhotoTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <a
              className="cta"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Quero compartilhar minha foto
            </a>
          </aside>
        <section id="campanhas" className="section crm-campaigns">
          <div className="section-title">
            <h3>Personalização de campanhas</h3>
            <p>
              Segmente clientes por preferências de produto e frequency of purchase para enviar
              campanhas específicas automaticamente.
            </p>
          </div>

          <div className="crm-layout">
            <article className="crm-filters">
              <label>
                Preferência principal
                <select
                  value={campaignPreference}
                  onChange={(event) => setCampaignPreference(event.target.value)}
                >
                  {campaignPreferenceOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Frequency of purchase
                <select
                  value={campaignFrequency}
                  onChange={(event) => setCampaignFrequency(event.target.value)}
                >
                  {purchaseFrequencyOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="crm-hint">
                Segmento atual: <strong>{segmentedCustomers.length} clientes elegíveis</strong>.
              </p>
            </article>

            <aside className="crm-results" aria-live="polite">
              <h4>{selectedCampaign.title}</h4>
              <p>{selectedCampaign.message}</p>

              <h5>Clientes no segmento</h5>
              {segmentedCustomers.length ? (
                <ul>
                  {segmentedCustomers.map((customer) => (
                    <li key={customer.id}>
                      <strong>{customer.name}</strong>
                      <span>
                        {customer.monthlyPurchases} pedidos/mês · Canal: {customer.channel}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum cliente nessa combinação no momento.</p>
              )}

              <button type="button">Enviar campanha para o segmento</button>
            </aside>
          </div>
        </section>
      </main>

      <aside className="social-proof-toast" aria-live="polite">
        <strong>Agora mesmo</strong>
        <p>{socialProofNotifications[socialProofIndex]}</p>
      </aside>

      <footer id="contato" className="footer">
        <div>
          <h4>Casa dos Sucos</h4>
          <p>Rua das Frutas, 245 · São Paulo, SP</p>
        </div>
        <div>
          <p>WhatsApp: (11) 99999-1212</p>
          <p>Email: atendimento@casadossucos.com.br</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
