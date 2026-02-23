import { useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: "verde-detox",
    title: "Suco Verde Detox Premium",
    shortDescription:
      "Combinação funcional para começar o dia com leveza: couve, maçã verde, limão tahiti e gengibre fresco.",
    fullDescription:
      "Produzido em pequenos lotes e prensado a frio para preservar aroma, textura e nutrientes. Ideal para rotinas detox, café da manhã leve ou para acompanhar refeições equilibradas.",
    price: 18.9,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1600&q=80",
        alt: "Copo de suco verde com frutas frescas ao redor",
      },
      {
        src: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=1600&q=80",
        alt: "Garrafa de suco verde detox em fundo claro",
      },
      {
        src: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=1600&q=80",
        alt: "Suco verde em alta resolução com hortaliças",
      },
    ],
    videoUrl: "https://www.youtube.com/embed/oBf5D4i8nTA",
    spin360Frames: [
      "https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589734580748-6d4c0e92db2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1603408209093-cd3f7b0f9f55?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { id: "350ml", size: "350 ml", flavor: "Original", stock: "Em estoque", quantity: 22 },
      { id: "500ml", size: "500 ml", flavor: "Original", stock: "Baixo estoque", quantity: 6 },
      { id: "1l", size: "1 L", flavor: "Original", stock: "Sob encomenda", quantity: 0 },
    ],
  },
  {
    id: "vermelho-energetico",
    title: "Vermelho Energético",
    shortDescription:
      "Beterraba, morango e laranja com toque de chia. Sabor intenso e energia natural para pré ou pós-treino.",
    fullDescription:
      "Receita criada para quem precisa de desempenho e recuperação com ingredientes naturais. Equilíbrio entre carboidratos de rápida absorção e antioxidantes.",
    price: 21.9,
    photos: [
      {
        src: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1600&q=80",
        alt: "Suco vermelho em garrafa transparente",
      },
      {
        src: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80",
        alt: "Ingredientes do suco vermelho organizados na mesa",
      },
      {
        src: "https://images.unsplash.com/photo-1464306076886-debede6f5ee7?auto=format&fit=crop&w=1600&q=80",
        alt: "Copo de suco vermelho em close",
      },
    ],
    videoUrl: "https://www.youtube.com/embed/KR5H7Q6MOY0",
    spin360Frames: [
      "https://images.unsplash.com/photo-1570824104453-508955ab713e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
    ],
    variants: [
      { id: "350ml", size: "350 ml", flavor: "Morango + Beterraba", stock: "Em estoque", quantity: 18 },
      { id: "500ml", size: "500 ml", flavor: "Morango + Laranja", stock: "Em estoque", quantity: 13 },
      { id: "1l", size: "1 L", flavor: "Power Blend", stock: "Indisponível", quantity: 0 },
    ],
  },
];

function stockClassName(status) {
  if (status === "Em estoque") return "stock ok";
  if (status === "Baixo estoque" || status === "Sob encomenda") return "stock warn";
  return "stock off";
}

function App() {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [frame, setFrame] = useState(0);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? products[0],
    [selectedProductId],
  );

  const currentVariantSummary = useMemo(() => {
    const available = selectedProduct.variants.filter((variant) => variant.quantity > 0).length;
    return `${available}/${selectedProduct.variants.length} variantes disponíveis`;
  }, [selectedProduct]);

  const currentPhoto = selectedProduct.photos[selectedPhoto] ?? selectedProduct.photos[0];
  const current360Frame =
    selectedProduct.spin360Frames[frame] ?? selectedProduct.spin360Frames[0];

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Página de produto completa</p>
        <h1>Casa dos Sucos · Catálogo com alta conversão</h1>
        <p>
          Títulos e descrições claras, múltiplas fotos em alta resolução, variantes por sabor e
          tamanho, status de estoque em tempo real, vídeos demonstrativos e visualização 360°.
        </p>
      </header>

      <main className="catalog-layout">
        <aside className="product-list" aria-label="Lista de produtos">
          <h2>Produtos</h2>
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className={product.id === selectedProduct.id ? "product-item active" : "product-item"}
              onClick={() => {
                setSelectedProductId(product.id);
                setSelectedPhoto(0);
                setFrame(0);
              }}
            >
              <strong>{product.title}</strong>
              <span>{product.shortDescription}</span>
            </button>
          ))}
        </aside>

        <section className="product-page" aria-live="polite">
          <div className="title-row">
            <div>
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.fullDescription}</p>
            </div>
            <div className="price-box">
              <strong>R$ {selectedProduct.price.toFixed(2)}</strong>
              <small>{currentVariantSummary}</small>
            </div>
          </div>

          <div className="media-grid">
            <article className="gallery-card">
              <img src={currentPhoto.src} alt={currentPhoto.alt} className="hero-photo" />
              <div className="thumbs" role="list" aria-label="Miniaturas da galeria">
                {selectedProduct.photos.map((photo, index) => (
                  <button
                    type="button"
                    key={photo.src}
                    className={index === selectedPhoto ? "thumb active" : "thumb"}
                    onClick={() => setSelectedPhoto(index)}
                  >
                    <img src={photo.src} alt={photo.alt} />
                  </button>
                ))}
              </div>
            </article>

            <article className="video-card">
              <h3>Vídeo do produto</h3>
              <p>Mostre preparo, textura e diferenciais para aumentar engajamento e confiança.</p>
              <iframe
                src={selectedProduct.videoUrl}
                title={`Vídeo do produto ${selectedProduct.title}`}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </article>

            <article className="spin-card">
              <h3>Visualização 360°</h3>
              <p>Arraste para simular rotação da embalagem e reduzir dúvidas antes da compra.</p>
              <img src={current360Frame} alt="Visualização 360 graus da garrafa" className="spin-photo" />
              <label htmlFor="frameRange">Ângulo</label>
              <input
                id="frameRange"
                type="range"
                min="0"
                max={selectedProduct.spin360Frames.length - 1}
                value={frame}
                onChange={(event) => setFrame(Number(event.target.value))}
              />
            </article>
          </div>

          <article className="variants-card">
            <h3>Variantes e estoque</h3>
            <table>
              <thead>
                <tr>
                  <th>Tamanho</th>
                  <th>Sabor</th>
                  <th>Status</th>
                  <th>Disponível</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.variants.map((variant) => (
                  <tr key={variant.id + variant.flavor}>
                    <td>{variant.size}</td>
                    <td>{variant.flavor}</td>
                    <td>
                      <span className={stockClassName(variant.stock)}>{variant.stock}</span>
                    </td>
                    <td>{variant.quantity > 0 ? `${variant.quantity} un.` : "0 un."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
