import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialCatalog = [
  {
    id: "suco-verde-detox-300ml",
    name: "Suco Verde Detox",
    category: "Detox",
    description:
      "Couve, maçã verde, limão e gengibre prensados a frio para uma rotina leve.",
    price: 14.9,
    stock: 32,
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "laranja-acerola-imunidade-300ml",
    name: "Laranja + Acerola",
    category: "Imunidade",
    description:
      "Blend rico em vitamina C, com sabor cítrico equilibrado e sem açúcar adicionado.",
    price: 12.9,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "abacaxi-hortela-refresh-300ml",
    name: "Abacaxi com Hortelã",
    category: "Refrescante",
    description:
      "Suco tropical refrescante para dias quentes, com aroma natural de hortelã.",
    price: 13.5,
    stock: 26,
    image:
      "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "vermelho-energia-beterraba-500ml",
    name: "Vermelho Energia",
    category: "Energia",
    description:
      "Beterraba, maçã e frutas vermelhas para pré-treino e mais disposição.",
    price: 16.9,
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=70",
  },
];

const storageKey = "kasucos:catalog";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function App() {
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialCatalog;
  });
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedId, setSelectedId] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("produto");
    if (fromUrl && catalog.some((product) => product.id === fromUrl)) {
      setSelectedId(fromUrl);
      return;
    }

    if (!selectedId && catalog.length > 0) {
      setSelectedId(catalog[0].id);
    }
  }, [catalog, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    const selected = catalog.find((item) => item.id === selectedId);
    if (!selected) return;

    const url = new URL(window.location.href);
    url.searchParams.set("produto", selectedId);
    window.history.replaceState({}, "", url);

    document.title = `${selected.name} | KaSucos`;
  }, [selectedId, catalog]);

  const categories = useMemo(() => {
    const unique = new Set(catalog.map((item) => item.category));
    return ["Todos", ...Array.from(unique)];
  }, [catalog]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return catalog
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [catalog, query]);

  const filteredCatalog = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const result = catalog.filter((item) => {
      const categoryMatch = categoryFilter === "Todos" || item.category === categoryFilter;
      const searchMatch =
        !normalized ||
        item.name.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized);

      return categoryMatch && searchMatch;
    });

    if (sortBy === "price-asc") {
      return [...result].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-desc") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "stock") {
      return [...result].sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [catalog, categoryFilter, query, sortBy]);

  const selectedProduct = catalog.find((item) => item.id === selectedId);
  const editingProduct = catalog.find((item) => item.id === editingId) || null;

  const updateProduct = (field, value) => {
    setCatalog((current) =>
      current.map((item) => (item.id === editingId ? { ...item, [field]: value } : item)),
    );
  };

  return (
    <div className="page">
      <a className="skip-link" href="#catalogo">
        Pular para o conteúdo principal
      </a>

      <header className="hero" id="inicio">
        <p className="eyebrow">KaSucos • e-commerce mobile-first</p>
        <h1>Catálogo com SEO, velocidade e navegação clara</h1>
        <p>
          Gestão simples de produtos, busca avançada com auto-sugestão, layout responsivo,
          acessibilidade e identidade visual consistente para aumentar conversão.
        </p>
      </header>

      <nav className="main-nav" aria-label="Navegação principal">
        <a href="#catalogo">Catálogo</a>
        <a href="#pesquisa">Busca avançada</a>
        <a href="#gestao">Gestão de conteúdo</a>
      </nav>

      <div className="breadcrumbs" aria-label="Breadcrumb">
        <span>Home</span>
        <span aria-hidden="true">/</span>
        <span>Catálogo</span>
        {selectedProduct ? (
          <>
            <span aria-hidden="true">/</span>
            <span>{selectedProduct.name}</span>
          </>
        ) : null}
      </div>

      <main className="layout" id="catalogo">
        <section className="card" id="pesquisa" aria-labelledby="busca-title">
          <h2 id="busca-title">Barra de pesquisa avançada</h2>
          <p className="helper">Preenchimento automático, filtros por categoria e ordenação.</p>

          <div className="controls">
            <div>
              <label htmlFor="search">Buscar produto</label>
              <input
                id="search"
                list="product-suggestions"
                type="search"
                value={query}
                placeholder="Ex: detox, acerola..."
                onChange={(event) => setQuery(event.target.value)}
              />
              <datalist id="product-suggestions">
                {suggestions.map((item) => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort">Ordenar por</label>
              <select id="sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="stock">Maior estoque</option>
              </select>
            </div>
          </div>

          <ul className="product-list" aria-live="polite">
            {filteredCatalog.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => setSelectedId(item.id)} className="product-link">
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                  <span>{currency.format(item.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card product-detail" aria-labelledby="detalhes-title">
          <h2 id="detalhes-title">Detalhes do produto</h2>
          {selectedProduct ? (
            <article>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                loading="lazy"
                width="640"
                height="360"
              />
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.description}</p>
              <p>
                <strong>Preço:</strong> {currency.format(selectedProduct.price)}
              </p>
              <p>
                <strong>Estoque:</strong> {selectedProduct.stock} unidades
              </p>
              <p>
                <strong>URL amigável:</strong> <code>/catalogo/{selectedProduct.id}</code>
              </p>
            </article>
          ) : (
            <p>Selecione um produto para visualizar.</p>
          )}
        </section>

        <section className="card" id="gestao" aria-labelledby="gestao-title">
          <h2 id="gestao-title">Gestão de produtos e conteúdo</h2>
          <p className="helper">Edite descrição, preço, imagem e estoque sem sair da página.</p>

          <label htmlFor="edit-product">Produto para editar</label>
          <select
            id="edit-product"
            value={editingId}
            onChange={(event) => setEditingId(event.target.value)}
          >
            <option value="">Selecione...</option>
            {catalog.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {editingProduct ? (
            <form className="edit-form" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                value={editingProduct.description}
                onChange={(event) => updateProduct("description", event.target.value)}
                rows={4}
              />

              <label htmlFor="price">Preço</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.1"
                value={editingProduct.price}
                onChange={(event) => updateProduct("price", Number(event.target.value))}
              />

              <label htmlFor="stock">Estoque</label>
              <input
                id="stock"
                type="number"
                min="0"
                value={editingProduct.stock}
                onChange={(event) => updateProduct("stock", Number(event.target.value))}
              />

              <label htmlFor="image">URL da imagem</label>
              <input
                id="image"
                type="url"
                value={editingProduct.image}
                onChange={(event) => updateProduct("image", event.target.value)}
              />
            </form>
          ) : (
            <p>Selecione um produto para ativar a edição.</p>
          )}
        </section>
      </main>

      <footer className="card footer">
        <h2>Boas práticas implementadas</h2>
        <ul>
          <li>Layout responsivo com foco em uso mobile e botões grandes para toque.</li>
          <li>Contraste de cores alto, tipografia legível e navegação por teclado.</li>
          <li>Imagens com compressão via parâmetros e lazy-loading para desempenho.</li>
          <li>Conteúdo original e semântico para reforço de SEO.</li>
        </ul>
      </footer>
    </div>
  );
}

export default App;
