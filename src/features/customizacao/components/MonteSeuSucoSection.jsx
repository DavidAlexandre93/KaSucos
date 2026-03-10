import { useMemo, useRef, useState } from "react";
import gsap from "@/shared/lib/gsap";
import { motion } from "@/shared/lib/motion";
import { useGSAP } from "@/shared/lib/useGSAP";

const MAX_COMBINATIONS = 2;

const FRUIT_COLORS = {
  acerola: "#ff2b3d",
  laranja: "#ff8f00",
  orange: "#ff8f00",
  abacaxi: "#ffd300",
  pineapple: "#ffd300",
  pina: "#ffd300",
  ananas: "#ffd300",
  limao: "#a7d900",
  lemon: "#a7d900",
  citron: "#a7d900",
  maracuja: "#ffba08",
  "passion fruit": "#ffba08",
  maracuya: "#ffba08",
  "fruit de la passion": "#ffba08",
  goiaba: "#ff4d8d",
  guava: "#ff4d8d",
  guayaba: "#ff4d8d",
  goyave: "#ff4d8d",
  melancia: "#00b24f",
  watermelon: "#00b24f",
  sandia: "#00b24f",
  pasteque: "#00b24f",
  morango: "#ff365f",
  strawberry: "#ff365f",
  fresa: "#ff365f",
  fraise: "#ff365f",
};

const DEFAULT_JUICE_COLOR = "#ff9300";

const FRUIT_EMOJIS = {
  acerola: "🍒",
  laranja: "🍊",
  orange: "🍊",
  abacaxi: "🍍",
  pineapple: "🍍",
  pina: "🍍",
  ananas: "🍍",
  limao: "🍋",
  lemon: "🍋",
  citron: "🍋",
  maracuja: "🥭",
  "passion fruit": "🥭",
  maracuya: "🥭",
  "fruit de la passion": "🥭",
  goiaba: "🍈",
  guava: "🍈",
  guayaba: "🍈",
  goyave: "🍈",
  melancia: "🍉",
  watermelon: "🍉",
  sandia: "🍉",
  pasteque: "🍉",
  morango: "🍓",
  strawberry: "🍓",
  fresa: "🍓",
  fraise: "🍓",
};

const normalizeFruitKey = (value) =>
  value
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase();

export function MonteSeuSucoSection({ content, onAddCustomJuice }) {
  const sectionRef = useRef(null);
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
      background: `linear-gradient(180deg, ${selectedColors[0]} 0%, ${selectedColors[0]} 50%, ${selectedColors[1]} 50%, ${selectedColors[1]} 100%)`,
    };
  }, [selectedFruits]);

  const handleAddCustomJuice = () => {
    if (!canCreate) return;

    onAddCustomJuice?.({
      title: selectedFruits.join(" + "),
      price: content.price,
    });
  };

  const toggleFruit = (fruit) => {
    setSelectedFruits((current) => {
      if (current.includes(fruit)) {
        return current.filter((item) => item !== fruit);
      }

      if (current.length >= MAX_COMBINATIONS) {
        return current;
      }

      return [...current, fruit];
    });
  };

  useGSAP(
    ({ selector }) => {
      const scene = selector(".juice-scene")[0];
      const cup = selector(".juice-cup")[0];
      const liquid = selector(".juice-liquid")[0];
      const bubbles = selector(".juice-bubble");
      const droplets = selector(".juice-droplet");
      const wave = selector(".juice-wave")[0];

      gsap.timeline().fromTo(scene, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 });

      if (liquid) {
        const cupHeight = cup?.offsetHeight || 340;
        const emptyLevel = Math.round(cupHeight * 0.905);
        const singleFruitLevel = Math.round(cupHeight * 0.629);
        const comboLevel = Math.round(cupHeight * 0.318);
        const liquidLevel = selectedFruits.length === 0 ? emptyLevel : selectedFruits.length === 1 ? singleFruitLevel : comboLevel;
        gsap.to(liquid, { "--liquid-level": liquidLevel, duration: 0.72, ease: "power2.out" });
      }

      bubbles.forEach((bubble, index) => {
        gsap.set(bubble, { y: 0, opacity: 0.35 + index * 0.08 });
        gsap.to(bubble, { y: -18 - index * 8, opacity: 0.7, duration: 0.9 + index * 0.08 });
      });

      droplets.forEach((droplet, index) => {
        gsap.set(droplet, { y: 12, opacity: 0 });
        gsap.to(droplet, { y: -10 - index * 6, opacity: 0.85, duration: 0.7 + index * 0.06 });
      });

      if (liquid) {
        gsap.fromTo(
          liquid,
          { filter: "saturate(1) brightness(1)" },
          { filter: "saturate(1.16) brightness(1.08)", repeat: 1, yoyo: true, duration: 0.2, delay: 0.12 },
        );
      }

      if (wave) {
        gsap.fromTo(wave, { scaleX: 0.82, y: -1 }, { scaleX: 1.08, y: 1, repeat: 1, yoyo: true, duration: 0.2, delay: 0.1 });
      }
    },
    { scope: sectionRef, dependencies: [selectedFruits.join("|")] },
  );

  return (
    <section id="monte-seu-suco" className="section soft" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title fruit-ninja-title">{content.title}</h2>
        <p className="builder-description">{content.description}</p>

        <div className="juice-preview juice-scene">
          <div className="juice-aura" aria-hidden="true" />

          <motion.div
            className="juice-cup"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <div className="juice-liquid" style={cupFillStyle}>
              <span className="juice-wave" />
              <span className="juice-liquid-glow" />
              <span className="juice-bubble juice-bubble--one" />
              <span className="juice-bubble juice-bubble--two" />
              <span className="juice-bubble juice-bubble--three" />
            </div>
            <img className="juice-bottle" src="/img/monte/garrafa.svg" alt="" aria-hidden="true" loading="lazy" />
            <span className="juice-droplet juice-droplet--one" aria-hidden="true" />
            <span className="juice-droplet juice-droplet--two" aria-hidden="true" />
            <span className="juice-droplet juice-droplet--three" aria-hidden="true" />
          </motion.div>

          <div className="juice-shadow" aria-hidden="true" style={{ left: "50%", transform: "translateX(-50%)" }} />
        </div>

        <div className="builder-grid">
          {content.fruits.map((fruit) => {
            const fruitKey = normalizeFruitKey(fruit);
            const selected = selectedFruits.includes(fruit);
            return (
              <button
                key={fruit}
                type="button"
                className={`fruit-chip${selected ? " active" : ""}`}
                onClick={() => toggleFruit(fruit)}
                disabled={!selected && selectedFruits.length >= MAX_COMBINATIONS}
              >
                <span className="mini-fruit" style={{ background: FRUIT_COLORS[fruitKey] ?? DEFAULT_JUICE_COLOR }}>
                  {FRUIT_EMOJIS[fruitKey] ?? "🍹"}
                </span>
                <span className="fruit-chip-label">{fruit}</span>
              </button>
            );
          })}
        </div>

        <div className="builder-feedback">
          <p className="builder-limit">{content.limitMessage}</p>
          <div className="builder-result" aria-live="polite">
            {resultText}
          </div>
        </div>

        <motion.button
          type="button"
          className="btn-primary builder-add-button"
          disabled={!canCreate}
          onClick={handleAddCustomJuice}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {content.addToBasket}
        </motion.button>
      </div>
    </section>
  );
}
