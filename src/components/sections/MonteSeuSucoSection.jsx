import { useMemo, useState } from "react";

const MAX_COMBINATIONS = 2;

const FRUIT_COLORS = {
  acerola: "#ea2f2f",
  laranja: "#ff9f1c",
  orange: "#ff9f1c",
  abacaxi: "#ffd447",
  pineapple: "#ffd447",
  pina: "#ffd447",
  ananas: "#ffd447",
  limao: "#b7df4a",
  lemon: "#b7df4a",
  citron: "#b7df4a",
  maracuja: "#f4be34",
  "passion fruit": "#f4be34",
  maracuya: "#f4be34",
  "fruit de la passion": "#f4be34",
  morango: "#f74d6a",
  strawberry: "#f74d6a",
  fresa: "#f74d6a",
  fraise: "#f74d6a",
};

const DEFAULT_JUICE_COLOR = "#ffbf3f";

const normalizeFruitKey = (value) =>
  value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase();

export function MonteSeuSucoSection({ content }) {
  const [selectedFruits, setSelectedFruits] = useState([]);

  const canCreate = selectedFruits.length === MAX_COMBINATIONS;

  const resultText = useMemo(() => {
    if (!canCreate) return content.resultPlaceholder;

    return content.resultReady.replace("{combo}", selectedFruits.join(" + "));
  }, [canCreate, content.resultPlaceholder, content.resultReady, selectedFruits]);

  const cupFillStyle = useMemo(() => {
    if (selectedFruits.length === 0) {
      return { background: DEFAULT_JUICE_COLOR };
    }

    const selectedColors = selectedFruits.map((fruit) => FRUIT_COLORS[normalizeFruitKey(fruit)] ?? DEFAULT_JUICE_COLOR);

    if (selectedColors.length === 1) {
      return { background: selectedColors[0] };
    }

    return {
      background: `linear-gradient(90deg, ${selectedColors[0]} 0%, ${selectedColors[0]} 50%, ${selectedColors[1]} 50%, ${selectedColors[1]} 100%)`,
    };
  }, [selectedFruits]);

  const handleToggleFruit = (fruit) => {
    const isSelected = selectedFruits.includes(fruit);

    if (isSelected) {
      setSelectedFruits(selectedFruits.filter((item) => item !== fruit));
      return;
    }

    if (selectedFruits.length < MAX_COMBINATIONS) {
      setSelectedFruits([...selectedFruits, fruit]);
    }
  };

  return (
    <section id="monte-seu-suco" className="section soft">
      <div className="container">
        <h2 className="section-title">{content.title}</h2>
        <p className="builder-description">{content.description}</p>

        <div className="juice-preview">
          <div className="juice-cup">
            <div className="juice-liquid" style={cupFillStyle} />
            <div className="juice-lid" />
            <div className="cup-logo">KaSucos</div>
          </div>
        </div>

        <div className="builder-grid">
          {content.fruits.map((fruit) => {
            const active = selectedFruits.includes(fruit);
            const disabled = !active && selectedFruits.length >= MAX_COMBINATIONS;
            const fruitColor = FRUIT_COLORS[normalizeFruitKey(fruit)] ?? DEFAULT_JUICE_COLOR;

            return (
              <button
                key={fruit}
                type="button"
                className={`fruit-chip ${active ? "active" : ""}`.trim()}
                onClick={() => handleToggleFruit(fruit)}
                disabled={disabled}
              >
                <span className="mini-cup">
                  <span className="mini-cup-liquid" style={{ background: fruitColor }} />
                </span>
                <span>{fruit}</span>
              </button>
            );
          })}
        </div>

        <p className="builder-limit">{content.limitMessage}</p>
        <div className="builder-result" aria-live="polite">
          {resultText}
        </div>
      </div>
    </section>
  );
}
