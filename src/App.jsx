import { useMemo, useState } from "react";
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
  const [activeFaq, setActiveFaq] = useState(supportFaqs[0].id);
  const [trackingCode, setTrackingCode] = useState("CSC1024");

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

  const trackingResult = orderTrackingMock[trackingCode.trim().toUpperCase()];

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
            <a href="#catalogo">Catálogo</a>
          </li>
          <li>
            <a href="#beneficios">Benefícios</a>
          </li>
          <li>
            <a href="#entrega-refrigerada">Entrega refrigerada</a>
          </li>
          <li>
            <a href="#combinador">Combinador</a>
          </li>
          <li>
            <a href="#assinatura">Assinatura</a>
          </li>
          <li>
            <a href="#consultoria">Consultoria</a>
          </li>
          <li>
            <a href="#calculadora">Calculadora nutricional</a>
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
          </div>
          <div className="hero-highlight">
            <span>Destaque da semana</span>
            <h3>Combo Vitalidade</h3>
            <p>
              7 sucos funcionais + 3 shots detox por <strong>R$ 99,90</strong>.
            </p>
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
      </main>

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
