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

function App() {
  return (
    <div className="juice-page">
      <header className="topbar">
        <p>Frete grátis acima de R$ 79 · Cupom de boas-vindas: <strong>SUCONOVO10</strong></p>
      </header>

      <nav className="navbar">
        <h1>Casa dos Sucos</h1>
        <ul>
          <li><a href="#catalogo">Catálogo</a></li>
          <li><a href="#beneficios">Benefícios</a></li>
          <li><a href="#assinatura">Assinatura</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
        <button className="cta">Pedir agora</button>
      </nav>

      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Loja online de sucos naturais</p>
            <h2>Sucos frescos para o seu dia, sem açúcar e sem conservantes.</h2>
            <p>
              Inspirado em grandes lojas de sucos, nosso cardápio foi pensado para quem
              busca praticidade, saúde e sabor em cada gole.
            </p>
            <div className="hero-actions">
              <button className="cta">Ver cardápio</button>
              <button className="ghost">Montar combo</button>
            </div>
          </div>
          <div className="hero-highlight">
            <span>Destaque da semana</span>
            <h3>Combo Vitalidade</h3>
            <p>7 sucos funcionais + 3 shots detox por <strong>R$ 99,90</strong>.</p>
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

        <section id="assinatura" className="subscription">
          <h3>Plano semanal de sucos</h3>
          <p>
            Assine e receba kits personalizados de segunda a sábado com até 20% de desconto.
          </p>
          <button className="cta">Quero assinar</button>
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
