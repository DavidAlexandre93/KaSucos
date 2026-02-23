import "./App.css";

const juices = [
  {
    id: "verde-detox",
    name: "Suco Verde Detox",
    portion: "300 ml",
    ingredients: ["Couve", "Maçã verde", "Limão", "Gengibre", "Água de coco"],
    nutrition: {
      calories: 92,
      carbs: "20 g",
      proteins: "2 g",
      fats: "0,6 g",
      fibers: "4,5 g",
      sodium: "22 mg",
    },
    allergens: "Pode conter traços de aipo e castanhas (ambiente compartilhado).",
    benefits: [
      "Apoio ao funcionamento intestinal por ser rico em fibras.",
      "Alta densidade de vitamina C e compostos antioxidantes.",
      "Sensação de leveza para iniciar o dia.",
    ],
  },
  {
    id: "laranja-acerola",
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

const returnPolicySteps = [
  {
    title: "1) Solicite em até 7 dias",
    description:
      "Mudou de ideia? Você pode pedir troca ou devolução em até 7 dias corridos após o recebimento, direto pelo WhatsApp.",
  },
  {
    title: "2) Resposta rápida em até 1 dia útil",
    description:
      "Nosso time confirma sua solicitação e envia as instruções de coleta ou postagem sem termos complicados.",
  },
  {
    title: "3) Reembolso ou crédito em até 5 dias úteis",
    description:
      "Após a confirmação da devolução, você escolhe entre reembolso no mesmo meio de pagamento ou crédito para novo pedido.",
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
  },
];

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
];

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

const recurringPlans = [
  {
    id: "quinzenal-flex",
    name: "Plano Quinzenal Flex",
    deliveriesPerMonth: 2,
    bottlesPerDelivery: 6,
    discount: 0.06,
    audience: "Ideal para quem está começando a criar rotina saudável.",
  },
  {
    id: "mensal-classico",
    name: "Plano Mensal Clássico",
    deliveriesPerMonth: 4,
    bottlesPerDelivery: 8,
    discount: 0.1,
    audience: "Perfeito para consumo recorrente com reposição semanal.",
  },
  {
    id: "semanal-pro",
    name: "Plano Semanal Pro",
    deliveriesPerMonth: 8,
    bottlesPerDelivery: 10,
    discount: 0.15,
    audience: "Feito para famílias ou clientes com consumo diário de sucos.",
  },
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
    portion: "300 ml",
    ingredients: ["Laranja", "Acerola", "Cenoura", "Água filtrada"],
    nutrition: {
      calories: 108,
      carbs: "24 g",
      proteins: "1,8 g",
      fats: "0,4 g",
      fibers: "3,1 g",
      sodium: "14 mg",
    },
    allergens: "Não contém alergênicos adicionados. Naturalmente sem lactose e sem glúten.",
    benefits: [
      "Reforço de vitamina C para a imunidade.",
      "Carotenoides da cenoura que contribuem para saúde da pele.",
      "Boa opção para hidratação com sabor cítrico.",
    ],
  },
  {
    id: "vermelho-energetico",
    name: "Vermelho Energético",
    portion: "300 ml",
    ingredients: ["Beterraba", "Morango", "Maçã", "Chia", "Água de coco"],
    nutrition: {
      calories: 124,
      carbs: "25 g",
      proteins: "2,7 g",
      fats: "2,1 g",
      fibers: "5,2 g",
      sodium: "28 mg",
    },
    allergens: "Pode conter traços de castanhas e amendoim (linha de produção compartilhada).",
    benefits: [
      "Fonte natural de nitratos da beterraba para performance.",
      "Combinação antioxidante de morango e maçã.",
      "Maior saciedade pelo teor de fibras e chia.",
    ],
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
  },
};

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
  const [selectedRecurringPlanId, setSelectedRecurringPlanId] = useState("mensal-classico");
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
  const [isGuestCheckout, setIsGuestCheckout] = useState(true);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    zipCode: "",
    paymentMethod: "pix",
    password: "",
  });
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

  const selectedRecurringPlan = useMemo(
    () => recurringPlans.find((plan) => plan.id === selectedRecurringPlanId) ?? recurringPlans[1],
    [selectedRecurringPlanId]
  );

  const estimatedMonthlyTotal = useMemo(
    () => {
      const selectedAveragePrice = selectedItems.length
        ? selectedItems.reduce((total, item) => total + item.price, 0) / selectedItems.length
        : 0;

      const grossTotal =
        selectedAveragePrice *
        selectedRecurringPlan.bottlesPerDelivery *
        selectedRecurringPlan.deliveriesPerMonth;

      return grossTotal * (1 - selectedRecurringPlan.discount);
    },
    [selectedItems, selectedRecurringPlan]
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

  const checkoutRequiredFields = ["fullName", "email", "phone", "zipCode", "paymentMethod"];

  const checkoutCompletedFields = checkoutRequiredFields.filter(
    (field) => checkoutForm[field].trim().length
  ).length;

  const checkoutProgress = Math.round((checkoutCompletedFields / checkoutRequiredFields.length) * 100);

  const checkoutSteps = ["Carrinho", "Dados", "Pagamento", "Confirmação"];

  const currentCheckoutStep =
    checkoutProgress < 25 ? 0 : checkoutProgress < 65 ? 1 : checkoutProgress < 100 ? 2 : 3;

  const updateCheckoutField = (field, value) => {
    setCheckoutForm((current) => ({
      ...current,
      [field]: value,
    }));
  };
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

function App() {
  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Casa dos Sucos · Transparência Nutricional</p>
        <h1>Informações nutricionais completas de cada suco</h1>
        <p>
          Veja ingredientes, tabela nutricional, alergênicos e benefícios para escolher com
          confiança o suco ideal para sua rotina.
        </p>
      </header>

      <main className="juice-grid" aria-label="Informações nutricionais dos sucos">
        {juices.map((juice) => (
          <article key={juice.id} className="juice-card">
            <h2>{juice.name}</h2>
            <p className="portion">Porção: {juice.portion}</p>

            <section>
              <h3>Ingredientes</h3>
              <ul>
                {juice.ingredients.map((ingredient) => (
                  <li key={ingredient}>{ingredient}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3>Tabela nutricional (por porção)</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Valor energético</th>
                    <td>{juice.nutrition.calories} kcal</td>
                  </tr>
                  <tr>
                    <th>Carboidratos</th>
                    <td>{juice.nutrition.carbs}</td>
                  </tr>
                  <tr>
                    <th>Proteínas</th>
                    <td>{juice.nutrition.proteins}</td>
                  </tr>
                  <tr>
                    <th>Gorduras totais</th>
                    <td>{juice.nutrition.fats}</td>
                  </tr>
                  <tr>
                    <th>Fibras alimentares</th>
                    <td>{juice.nutrition.fibers}</td>
                  </tr>
                  <tr>
                    <th>Sódio</th>
                    <td>{juice.nutrition.sodium}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h3>Alergênicos</h3>
              <p>{juice.allergens}</p>
            </section>

            <section>
              <h3>Benefícios</h3>
              <ul>
                {juice.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
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
          </div>
        </section>

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

        <section id="checkout-rapido" className="section fast-checkout">
          <div className="section-title">
            <h3>Checkout rápido e seguro</h3>
            <p>
              Finalize em uma única página com poucos campos, barra de progresso e compra como
              convidado para reduzir atrito no carrinho.
            </p>
          </div>

          <div className="checkout-progress" aria-label="Progresso do checkout">
            <div className="checkout-progress-bar" style={{ width: `${checkoutProgress}%` }} />
            <span>{checkoutProgress}% concluído</span>
          </div>

          <ol className="checkout-steps" aria-label="Etapas do checkout">
            {checkoutSteps.map((step, index) => (
              <li key={step} className={index <= currentCheckoutStep ? "active" : ""}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={(event) => event.preventDefault()}>
              <h4>Dados para entrega</h4>

              <label className="guest-toggle">
                <input
                  type="checkbox"
                  checked={isGuestCheckout}
                  onChange={(event) => setIsGuestCheckout(event.target.checked)}
                />
                Comprar como convidado (sem criar conta)
              </label>
            </section>
          </article>
        ))}
      </main>
    </div>
import { useMemo, useState } from "react";
import "./App.css";

const catalog = [
  { id: "detox-verde", name: "Suco Verde Detox", category: "detox", description: "Couve, maçã e gengibre para desinchar com sabor.", price: 14.9 },
  { id: "vermelho-energetico", name: "Vermelho Energético", category: "energia", description: "Beterraba, morango e limão para pré-treino natural.", price: 15.9 },
  { id: "laranja-acerola", name: "Laranja + Acerola", category: "imunidade", description: "Dose reforçada de vitamina C para o dia a dia.", price: 12.9 },
  { id: "abacaxi-hortela", name: "Abacaxi + Hortelã", category: "digestivo", description: "Refrescância leve para acompanhar refeições.", price: 13.9 },
  { id: "maca-morango-kids", name: "Maçã + Morango Kids", category: "kids", description: "Sem açúcar adicionado, sabor aprovado pela criançada.", price: 11.9 },
  { id: "shot-imunidade", name: "Shot Imunidade", category: "shots", description: "Gengibre, cúrcuma e limão em dose concentrada.", price: 9.9 },
];

const purchaseSeed = ["detox-verde", "laranja-acerola", "laranja-acerola", "abacaxi-hortela"];

function formatPrice(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function App() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState(purchaseSeed);

  const categoryAffinity = useMemo(() => {
    return purchaseHistory.reduce((acc, productId) => {
      const product = catalog.find((item) => item.id === productId);
      if (!product) return acc;
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [purchaseHistory]);

  const recommendations = useMemo(() => {
    return catalog
      .filter((product) => !purchaseHistory.includes(product.id))
      .sort((a, b) => (categoryAffinity[b.category] ?? 0) - (categoryAffinity[a.category] ?? 0))
      .slice(0, 3);
  }, [categoryAffinity, purchaseHistory]);

  const personalizedMessage = useMemo(() => {
    if (!Object.keys(categoryAffinity).length) {
      return "Experimente nossos combos iniciais e descubra novos sabores naturais.";
    }

    const favoriteCategory = Object.entries(categoryAffinity).sort((a, b) => b[1] - a[1])[0][0];
    const map = {
      detox: "Percebemos que você gosta de opções detox. Selecionamos combinações leves para continuar sua rotina.",
      energia: "Seu histórico mostra preferência por energia natural. Aqui vão sugestões para manter o ritmo.",
      imunidade: "Montamos recomendações com foco em imunidade, alinhadas ao seu histórico de compras.",
      digestivo: "Selecionamos opções digestivas para combinar com os sabores que você mais compra.",
      kids: "Temos novidades para o público kids com base nas escolhas anteriores da sua família.",
      shots: "Reforçamos a seção de shots funcionais com base no seu consumo recente.",
    };

    return map[favoriteCategory] ?? "Selecionamos ofertas personalizadas com base nas suas compras anteriores.";
  }, [categoryAffinity]);

  function handleViewProduct(productId) {
    setRecentlyViewed((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)];
      return next.slice(0, 4);
    });
  }

  function handleBuyProduct(productId) {
    setPurchaseHistory((prev) => [...prev, productId]);
    handleViewProduct(productId);
  }

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Personalização baseada em histórico</p>
        <h1>Casa dos Sucos • Experiência personalizada para aumentar conversão e fidelidade</h1>
        <p>{personalizedMessage}</p>
      </header>

      <main>
        <section>
          <h2>Catálogo</h2>
          <div className="grid">
            {catalog.map((product) => (
              <article key={product.id} className="card">
                <span className="tag">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <strong>{formatPrice(product.price)}</strong>
                <div className="actions">
                  <button onClick={() => handleViewProduct(product.id)}>Ver detalhes</button>
                  <button className="primary" onClick={() => handleBuyProduct(product.id)}>
                    Comprar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="trocas" className="section return-policy">
          <div className="section-title">
            <h3>Política de troca e devolução transparente</h3>
            <p>
              Regras simples, prazos claros e sem letras miúdas para você comprar com confiança.
            </p>
          </div>

          <div className="return-policy-grid">
            {returnPolicySteps.map((step) => (
              <article key={step.title} className="return-policy-card">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </article>
            ))}
          </div>

          <p className="return-policy-note">
            <strong>Sem burocracia:</strong> não exigimos justificativa para devolução no prazo legal,
            e você acompanha cada etapa do processo com atualização por mensagem.
          </p>
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
        <section>
          <h2>Vistos recentemente</h2>
          {recentlyViewed.length === 0 ? (
            <p className="muted">Ainda não há itens vistos nesta sessão.</p>
          ) : (
            <ul className="list">
              {recentlyViewed.map((id) => {
                const product = catalog.find((item) => item.id === id);
                if (!product) return null;
                return <li key={id}>{product.name}</li>;
              })}
            </ul>
          )}
        </section>

        <section>
          <h2>Recomendações com base em compras anteriores</h2>
          {recommendations.length === 0 ? (
            <p className="muted">Você já comprou todo o catálogo atual. Em breve teremos novidades para você.</p>
          ) : (
            <div className="grid">
              {recommendations.map((product) => (
                <article key={product.id} className="card recommendation">
                  <span className="tag">Match com seu perfil</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <strong>{formatPrice(product.price)}</strong>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
const products = [
  {
    id: "detox-verde",
    name: "Suco Verde Detox",
    category: "detox",
    price: 14.9,
    salesCount: 142,
    description: "Couve, maçã verde, pepino e gengibre.",
    complementaryIds: ["shot-imunidade", "mix-castanhas"],
    similarCheaperIds: ["citrico-refresh"],
  },
  {
    id: "vermelho-energetico",
    name: "Suco Vermelho Energético",
    category: "energia",
    price: 16.9,
    salesCount: 125,
    description: "Beterraba, morango e água de coco.",
    complementaryIds: ["barra-proteina", "shot-imunidade"],
    similarCheaperIds: ["citrico-refresh"],
  },
  {
    id: "citrico-refresh",
    name: "Cítrico Refresh",
    category: "energia",
    price: 12.9,
    salesCount: 118,
    description: "Laranja, acerola e limão-siciliano.",
    complementaryIds: ["mix-castanhas"],
    similarCheaperIds: [],
  },
  {
    id: "shot-imunidade",
    name: "Shot de Imunidade",
    category: "shot",
    price: 7.9,
    salesCount: 210,
    description: "Gengibre, cúrcuma, limão e própolis.",
    complementaryIds: [],
    similarCheaperIds: [],
  },
  {
    id: "mix-castanhas",
    name: "Mix de Castanhas",
    category: "snack",
    price: 9.5,
    salesCount: 96,
    description: "Snack natural para acompanhar seu suco.",
    complementaryIds: [],
    similarCheaperIds: [],
  },
  {
    id: "barra-proteina",
    name: "Barra de Proteína",
    category: "snack",
    price: 8.9,
    salesCount: 88,
    description: "Cacau, aveia e proteína vegetal.",
    complementaryIds: [],
    similarCheaperIds: [],
  },
];

const formatBRL = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function App() {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [cartIds, setCartIds] = useState([products[0].id]);

  const catalogById = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    []
  );

  const selectedProduct = catalogById[selectedProductId];

  const alsoBought = useMemo(() => {
    if (!selectedProduct) return [];

    const listed = selectedProduct.complementaryIds
      .map((id) => catalogById[id])
      .filter(Boolean)
      .sort((a, b) => b.salesCount - a.salesCount);

    return listed;
  }, [selectedProduct, catalogById]);

  const similarCheaper = useMemo(() => {
    if (!selectedProduct) return [];

    const explicit = selectedProduct.similarCheaperIds.map((id) => catalogById[id]).filter(Boolean);

    const inferred = products
      .filter(
        (product) =>
          product.id !== selectedProduct.id &&
          product.category === selectedProduct.category &&
          product.price < selectedProduct.price
      )
      .sort((a, b) => a.price - b.price);

    const merged = [...explicit, ...inferred];
    return Array.from(new Map(merged.map((product) => [product.id, product])).values());
  }, [selectedProduct, catalogById]);

        <section id="assinatura" className="subscription">
          <h3>Assinatura ajustável</h3>
          <p>
            Monte seu plano recorrente com os sabores que preferir e altere a composição quando
            quiser, sem burocracia. Segundo tendência destacada pela E-commerce Brasil, o modelo de
            assinatura fortalece a fidelização para produtos com consumo mensal.
          </p>

          <div className="subscription-controls">
            <div className="box-customizer">
              <h4>Escolha seu plano recorrente</h4>
              <div className="recurring-plan-grid">
                {recurringPlans.map((plan) => {
                  const isCurrent = plan.id === selectedRecurringPlan.id;

                  return (
                    <label key={plan.id} className={`recurring-plan ${isCurrent ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="recurring-plan"
                        checked={isCurrent}
                        onChange={() => setSelectedRecurringPlanId(plan.id)}
                      />
                      <div>
                        <strong>{plan.name}</strong>
                        <span>
                          {plan.deliveriesPerMonth} entregas/mês · {plan.bottlesPerDelivery} garrafas por
                          entrega
                        </span>
                        <small>{Math.round(plan.discount * 100)}% OFF em relação ao avulso</small>
                        <p>{plan.audience}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

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
                <strong>Plano ativo:</strong> {selectedRecurringPlan.name}
              </p>
              <p>
                <strong>Estimativa mensal:</strong> {formatCurrency(estimatedMonthlyTotal)}
              </p>
              <p>
                <strong>Entrega:</strong> segunda a sábado, no turno escolhido.
              </p>
              <p>
                <strong>Recorrência:</strong> {selectedRecurringPlan.deliveriesPerMonth} entregas mensais
                com reposição automática.
              </p>
  const cartItems = cartIds.map((id) => catalogById[id]).filter(Boolean);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const addToCart = (productId) => {
    setCartIds((current) => [...current, productId]);
  };

  return (
    <main className="page">
      <header>
        <h1>Casa dos Sucos</h1>
        <p>Sistema de recomendações para aumentar ticket médio com up-selling e cross-selling.</p>
      </header>

      <section className="grid">
        <article className="panel">
          <h2>Catálogo</h2>
          <div className="catalog">
            {products.map((product) => (
              <button
                key={product.id}
                className={`product-card ${selectedProductId === product.id ? "active" : ""}`}
                onClick={() => setSelectedProductId(product.id)}
                type="button"
              >
                <strong>{product.name}</strong>
                <span>{product.description}</span>
                <b>{formatBRL(product.price)}</b>
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Produto selecionado</h2>
          <p className="selected-name">{selectedProduct.name}</p>
          <p>{selectedProduct.description}</p>
          <p className="price">{formatBRL(selectedProduct.price)}</p>
          <button type="button" className="action" onClick={() => addToCart(selectedProduct.id)}>
            Adicionar ao carrinho
          </button>

          <div className="recommendations">
            <section>
              <h3>Quem comprou este produto também comprou</h3>
              {alsoBought.length === 0 ? (
                <p className="empty">Sem combinações no momento.</p>
              ) : (
                <ul>
                  {alsoBought.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{formatBRL(item.price)}</span>
                      </div>
                      <button type="button" onClick={() => addToCart(item.id)}>
                        + Adicionar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <h3>Produtos semelhantes mais baratos</h3>
              {similarCheaper.length === 0 ? (
                <p className="empty">Não há versão mais econômica para este item.</p>
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
        </section>

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
          </div>
        </section>

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
          </div>
        </section>

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
        </section>

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
                  {similarCheaper.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {formatBRL(item.price)} (economize {formatBRL(selectedProduct.price - item.price)})
                        </span>
                      </div>
                      <button type="button" onClick={() => setSelectedProductId(item.id)}>
                        Ver opção
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </article>

        <article className="panel cart">
          <h2>Carrinho</h2>
          <p>Itens: {cartItems.length}</p>
          <p>Total: {formatBRL(cartTotal)}</p>
          <ul>
            {cartItems.map((item, index) => (
              <li key={`${item.id}-${index}`}>
                {item.name} — {formatBRL(item.price)}
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
