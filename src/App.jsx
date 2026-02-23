import "./App.css";

const juices = [
  {
    name: "Verde Vital",
    volume: "300 ml",
    description: "Couve, maçã verde, limão e gengibre prensados a frio.",
    price: "R$ 14,90",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=70",
    tag: "Detox",
  },
  {
    name: "Laranja Imune",
    volume: "300 ml",
    description: "Laranja, acerola e cúrcuma para reforçar sua rotina.",
    price: "R$ 13,90",
    image:
      "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=1200&q=70",
    tag: "Imunidade",
  },
  {
    name: "Abacaxi Fresh",
    volume: "300 ml",
    description: "Abacaxi com hortelã, refrescante e sem açúcar.",
    price: "R$ 12,90",
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=70",
    tag: "Refrescante",
  },
  {
    name: "Vermelho Power",
    volume: "500 ml",
    description: "Beterraba, maçã e frutas vermelhas para mais energia.",
    price: "R$ 17,90",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=70",
    tag: "Energia",
  },
];

const combos = [
  {
    title: "Combo Semana Leve",
    detail: "7 sucos de 300 ml",
    price: "R$ 89,90",
  },
  {
    title: "Combo Performance",
    detail: "10 sucos + 2 shots funcionais",
    price: "R$ 129,90",
    highlight: true,
  },
  {
    title: "Combo Família",
    detail: "14 sucos variados",
    price: "R$ 169,90",
  },
];

function App() {
  return (
    <div className="site">
      <header className="topbar">
        <div className="container topbar-inner">
          <a href="#inicio" className="brand">
            <img src="/img/logotipo.png" alt="KaSucos" />
            <span>KaSucos</span>
          </a>
          <nav>
            <a href="#catalogo">Sucos</a>
            <a href="#combos">Combos</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#contato">Contato</a>
          </nav>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="container hero-grid">
          <div>
            <p className="chip">Entrega no mesmo dia*</p>
            <h1>Os sucos mais frescos para sua rotina saudável.</h1>
            <p>
              Produção artesanal, frutas selecionadas e blends funcionais para seu dia render mais.
            </p>
            <div className="hero-actions">
              <a href="#catalogo" className="btn-primary">
                Comprar agora
              </a>
              <a href="#combos" className="btn-ghost">
                Ver combos
              </a>
            </div>
          </div>
          <div className="hero-card">
            <img src="/img/logotipo.png" alt="Logo KaSucos" />
            <h2>KaSucos</h2>
            <p>O sabor da fruta, e o carinho de casa.</p>
          </div>
        </div>
      </section>

      <section id="catalogo" className="section">
        <div className="container">
          <h2 className="section-title">Sucos em destaque</h2>
          <div className="grid cards">
            {juices.map((juice) => (
              <article key={juice.name} className="card">
                <img src={juice.image} alt={juice.name} loading="lazy" />
                <div className="card-body">
                  <span className="tag">{juice.tag}</span>
                  <h3>{juice.name}</h3>
                  <p>{juice.description}</p>
                  <div className="card-footer">
                    <strong>{juice.price}</strong>
                    <span>{juice.volume}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="combos" className="section soft">
        <div className="container">
          <h2 className="section-title">Combos para economizar</h2>
          <div className="grid combos">
            {combos.map((combo) => (
              <article key={combo.title} className={`combo ${combo.highlight ? "highlight" : ""}`}>
                {combo.highlight ? <span className="badge">Mais pedido</span> : null}
                <h3>{combo.title}</h3>
                <p>{combo.detail}</p>
                <strong>{combo.price}</strong>
                <button type="button">Quero este</button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="beneficios" className="section">
        <div className="container benefits">
          <h2 className="section-title">Por que escolher a KaSucos?</h2>
          <ul>
            <li>Sem adição de açúcar e sem conservantes.</li>
            <li>Produção diária com frutas frescas.</li>
            <li>Entrega refrigerada para manter qualidade.</li>
            <li>Atendimento humanizado pelo WhatsApp.</li>
          </ul>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">Quem já provou aprova</h2>
          <div className="grid reviews">
            <blockquote>
              “Sabor incrível e entrega rápida. O Verde Vital virou meu favorito!”
              <cite>— Juliana R.</cite>
            </blockquote>
            <blockquote>
              “Os combos valem muito a pena, qualidade impecável.”
              <cite>— Marcos A.</cite>
            </blockquote>
            <blockquote>
              “Atendimento excelente e sucos realmente naturais.”
              <cite>— Camila P.</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section id="contato" className="section cta">
        <div className="container cta-box">
          <h2>Faça seu pedido agora</h2>
          <p>Peça pelo WhatsApp e receba seus sucos geladinhos na sua casa.</p>
          <a className="btn-primary" href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
            Falar no WhatsApp
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} KaSucos. Todos os direitos reservados.</p>
          <span>*Consulte áreas de entrega.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
