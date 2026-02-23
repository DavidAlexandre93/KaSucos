import { useMemo, useState } from "react";
import "./App.css";

const availableFlavors = [
  { id: "detox-verde", name: "Detox Verde", notes: "Couve, maçã e limão", price: 14.9 },
  { id: "laranja-acerola", name: "Laranja + Acerola", notes: "Dose extra de vitamina C", price: 12.9 },
  { id: "abacaxi-hortela", name: "Abacaxi + Hortelã", notes: "Refrescante e digestivo", price: 13.9 },
  { id: "vermelho-energia", name: "Vermelho Energia", notes: "Beterraba e frutas vermelhas", price: 15.9 },
  { id: "maca-morango-kids", name: "Maçã + Morango Kids", notes: "Sem açúcar adicionado", price: 11.9 },
  { id: "maracuja-funcional", name: "Maracujá Funcional", notes: "Leve e calmante", price: 13.4 },
];

const deliveryFrequencies = [
  { id: "weekly", label: "Semanal", description: "Receba toda semana", multiplier: 4 },
  { id: "biweekly", label: "Quinzenal", description: "Receba a cada 15 dias", multiplier: 2 },
  { id: "monthly", label: "Mensal", description: "Receba 1x ao mês", multiplier: 1 },
];

const boxSizes = [
  { id: "6", label: "Caixa com 6 sucos", capacity: 6 },
  { id: "12", label: "Caixa com 12 sucos", capacity: 12 },
  { id: "20", label: "Caixa com 20 sucos", capacity: 20 },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function App() {
  const [selectedBoxSize, setSelectedBoxSize] = useState("12");
  const [selectedFrequency, setSelectedFrequency] = useState("weekly");
  const [selectedFlavors, setSelectedFlavors] = useState({
    "detox-verde": 2,
    "laranja-acerola": 2,
    "abacaxi-hortela": 2,
    "vermelho-energia": 2,
    "maca-morango-kids": 2,
    "maracuja-funcional": 2,
  });

  const currentBox = boxSizes.find((box) => box.id === selectedBoxSize);
  const currentFrequency = deliveryFrequencies.find((option) => option.id === selectedFrequency);

  const totalUnits = useMemo(
    () => Object.values(selectedFlavors).reduce((total, qty) => total + qty, 0),
    [selectedFlavors]
  );

  const boxTotal = useMemo(
    () =>
      availableFlavors.reduce((total, flavor) => {
        const qty = selectedFlavors[flavor.id] || 0;
        return total + qty * flavor.price;
      }, 0),
    [selectedFlavors]
  );

  const monthlyEstimate = useMemo(
    () => boxTotal * (currentFrequency?.multiplier ?? 1),
    [boxTotal, currentFrequency]
  );

  const updateFlavorQty = (flavorId, nextQty) => {
    const safeQty = Math.max(0, Number(nextQty) || 0);
    setSelectedFlavors((current) => ({
      ...current,
      [flavorId]: safeQty,
    }));
  };

  const isAboveCapacity = currentBox ? totalUnits > currentBox.capacity : false;
  const isBelowCapacity = currentBox ? totalUnits < currentBox.capacity : false;

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Personalização de pedidos</p>
        <h1>Monte sua caixa de sucos do seu jeito</h1>
        <p>
          Escolha sabores, ajuste quantidades por sabor e defina a frequência de entrega para
          assinar a caixa personalizada ideal para sua rotina.
        </p>
      </header>

      <main className="layout">
        <section className="card">
          <h2>1) Defina o tipo de caixa</h2>
          <div className="option-grid">
            {boxSizes.map((box) => (
              <label key={box.id} className={`option ${selectedBoxSize === box.id ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="box-size"
                  value={box.id}
                  checked={selectedBoxSize === box.id}
                  onChange={(event) => setSelectedBoxSize(event.target.value)}
                />
                <span>{box.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>2) Selecione sabores da sua caixa personalizada</h2>
          <p className="helper">Distribua as quantidades por sabor:</p>
          <div className="flavors">
            {availableFlavors.map((flavor) => (
              <article key={flavor.id} className="flavor-item">
                <div>
                  <h3>{flavor.name}</h3>
                  <p>{flavor.notes}</p>
                  <small>{formatCurrency(flavor.price)} / unidade</small>
                </div>
                <label className="qty-label">
                  Qtd.
                  <input
                    type="number"
                    min="0"
                    value={selectedFlavors[flavor.id] || 0}
                    onChange={(event) => updateFlavorQty(flavor.id, event.target.value)}
                  />
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>3) Escolha a frequência de entrega</h2>
          <div className="option-grid">
            {deliveryFrequencies.map((frequency) => (
              <label
                key={frequency.id}
                className={`option ${selectedFrequency === frequency.id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={frequency.id}
                  checked={selectedFrequency === frequency.id}
                  onChange={(event) => setSelectedFrequency(event.target.value)}
                />
                <span>{frequency.label}</span>
                <small>{frequency.description}</small>
              </label>
            ))}
          </div>
        </section>

        <aside className="card summary" aria-live="polite">
          <h2>Resumo da assinatura</h2>
          <ul>
            <li>
              <span>Capacidade da caixa</span>
              <strong>{currentBox?.capacity ?? 0} unidades</strong>
            </li>
            <li>
              <span>Unidades selecionadas</span>
              <strong>{totalUnits} unidades</strong>
            </li>
            <li>
              <span>Total da caixa</span>
              <strong>{formatCurrency(boxTotal)}</strong>
            </li>
            <li>
              <span>Frequência</span>
              <strong>{currentFrequency?.label}</strong>
            </li>
            <li>
              <span>Estimativa mensal</span>
              <strong>{formatCurrency(monthlyEstimate)}</strong>
            </li>
          </ul>

          {isAboveCapacity && (
            <p className="alert error">
              Você excedeu a capacidade da caixa. Remova algumas unidades para finalizar.
            </p>
          )}
          {isBelowCapacity && !isAboveCapacity && (
            <p className="alert warning">
              Sua caixa ainda não está completa. Adicione mais sabores para preencher.
            </p>
          )}
          {!isBelowCapacity && !isAboveCapacity && (
            <p className="alert success">Perfeito! Sua caixa personalizada está completa.</p>
          )}

          <button type="button" disabled={isAboveCapacity || isBelowCapacity}>
            Finalizar assinatura personalizada
          </button>
        </aside>
      </main>
    </div>
  );
}

export default App;
