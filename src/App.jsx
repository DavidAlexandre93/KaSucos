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
  );
}

export default App;
