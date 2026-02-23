import { useMemo, useState } from "react";
import "./App.css";

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
