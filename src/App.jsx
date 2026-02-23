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
