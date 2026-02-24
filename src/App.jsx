import { useState } from "react";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { BenefitsSection } from "./components/sections/BenefitsSection";
import { CatalogSection } from "./components/sections/CatalogSection";
import { CombosSection } from "./components/sections/CombosSection";
import { ContactSection } from "./components/sections/ContactSection";
import { HeroSection } from "./components/sections/HeroSection";
import { TestimonialsSection } from "./components/sections/TestimonialsSection";
import { ThemeSection } from "./components/sections/ThemeSection";
import { combos, juices } from "./data/catalog";
import { colorThemes } from "./data/themes";
import "./styles/app.css";
import "./App.css";

const colorThemes = {
  roxo: {
    name: "Roxo KaSucos",
    colors: {
      "--purple-900": "#3b1575",
      "--purple-700": "#5f27b2",
      "--purple-100": "#f2ebff",
      "--green-500": "#75cb2f",
      "--yellow-400": "#ffcc21",
      "--orange-500": "#ff8e1e",
      "--text": "#2d184f",
      "--muted": "#5f4b88",
      "--bg-base": "#f7f2ff",
    },
  },
  amarelo: {
    name: "Amarelo Solar",
    colors: {
      "--purple-900": "#45216f",
      "--purple-700": "#6833b8",
      "--purple-100": "#fff8d9",
      "--green-500": "#72c82f",
      "--yellow-400": "#ffd229",
      "--orange-500": "#ff9b24",
      "--text": "#3e2758",
      "--muted": "#6d5788",
      "--bg-base": "#fffaf0",
    },
  },
  verde: {
    name: "Verde Fresh",
    colors: {
      "--purple-900": "#3c1b70",
      "--purple-700": "#5f2fb0",
      "--purple-100": "#ebffe1",
      "--green-500": "#66be2a",
      "--yellow-400": "#ffd53c",
      "--orange-500": "#ff981f",
      "--text": "#2e1c4e",
      "--muted": "#536c56",
      "--bg-base": "#f4fff1",
    },
  },
};

const juices = [
  {
    name: "Verde Vital",
    volume: "300 ml",
    description: "Couve, maçã verde, limão e gengibre prensados a frio.",
    price: "R$ 14,90",
    availability: "Disponível hoje",
    image:
      "/img/garrafinha.png",
    tag: "Detox",
  },
  {
    name: "Laranja Imune",
    volume: "300 ml",
    description: "Laranja, acerola e cúrcuma para reforçar sua rotina.",
    price: "R$ 13,90",
    availability: "Disponível hoje",
    image:
      "/img/garrafinha02.png",
    tag: "Imunidade",
  },
  {
    name: "Abacaxi Fresh",
    volume: "300 ml",
    description: "Abacaxi com hortelã, refrescante e sem açúcar.",
    price: "R$ 12,90",
    availability: "Últimas unidades",
    image:
      "/img/garrafinha03.png",
    tag: "Refrescante",
  },
  {
    name: "Vermelho Power",
    volume: "500 ml",
    description: "Beterraba, maçã e frutas vermelhas para mais energia.",
    price: "R$ 17,90",
    availability: "Disponível hoje",
    image:
      "/img/about.png",
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
  const [selectedTheme, setSelectedTheme] = useState("roxo");

  return (
    <div className="site" style={colorThemes[selectedTheme].colors}>
      <Header />
      <HeroSection />
      <ThemeSection
        colorThemes={colorThemes}
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />
      <CatalogSection juices={juices} />
      <CombosSection combos={combos} />
      <BenefitsSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <header className="topbar">
        <div className="container topbar-inner">
          <a href="#inicio" className="brand">
            <img src="/img/logotipo.jpeg" alt="KaSucos" />
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
              Inspirado no estilo Life Sucos, com catálogo claro dos sabores disponíveis para venda,
              combos e pedido rápido no WhatsApp.
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
            <img src="/img/banner.png" alt="Banner KaSucos" />
            <h2>KaSucos</h2>
            <p>O sabor da fruta, e o carinho de casa.</p>
          </div>
        </div>
      </section>

      <section className="section theme-section">
        <div className="container">
          <h2 className="section-title">Escolha as cores da sua experiência</h2>
          <p className="theme-text">Todas as opções usam a paleta da logo KaSucos.</p>
          <div className="theme-options">
            {Object.entries(colorThemes).map(([key, theme]) => (
              <button
                key={key}
                type="button"
                className={`theme-option ${selectedTheme === key ? "active" : ""}`}
                onClick={() => setSelectedTheme(key)}
              >
                <span>{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="catalogo" className="section">
        <div className="container">
          <h2 className="section-title">Sucos disponíveis para venda</h2>
          <div className="grid cards">
            {juices.map((juice) => (
              <article key={juice.name} className="card">
                <img src={juice.image} alt={juice.name} loading="lazy" />
                <div className="card-body">
                  <span className="tag">{juice.tag}</span>
                  <h3>{juice.name}</h3>
                  <p>{juice.description}</p>
                  <small className="availability">{juice.availability}</small>
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
