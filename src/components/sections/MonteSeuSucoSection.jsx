import { useMemo, useRef, useState } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

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

export function MonteSeuSucoSection({ content }) {
  const sectionRef = useRef(null);
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [fruitDrops, setFruitDrops] = useState([]);

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

  const enqueueFruitDrop = (fruit) => {
    const key = normalizeFruitKey(fruit);
    setFruitDrops((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        color: FRUIT_COLORS[key] ?? DEFAULT_JUICE_COLOR,
        icon: FRUIT_EMOJIS[key] ?? "🍹",
      },
    ]);
  };

  const handleToggleFruit = (fruit) => {
    const isSelected = selectedFruits.includes(fruit);

    if (isSelected) {
      setSelectedFruits(selectedFruits.filter((item) => item !== fruit));
      return;
    }

    if (selectedFruits.length < MAX_COMBINATIONS) {
      setSelectedFruits([...selectedFruits, fruit]);
      enqueueFruitDrop(fruit);
    }
  };

  useGSAP(
    ({ selector }) => {
      const scene = selector(".juice-scene")[0];
      const liquid = selector(".juice-liquid")[0];
      const bubbles = selector(".juice-bubble");
      const droplets = selector(".juice-droplet");
      const fruitChips = selector(".fruit-chip");
      const fruitDropElements = selector(".fruit-drop:not([data-animated='true'])");
      const wave = selector(".juice-wave")[0];

      gsap
        .timeline()
        .fromTo(scene, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 })
        .fromTo(fruitChips, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 });

      if (liquid) {
        const liquidLevel = selectedFruits.length === 0 ? 124 : selectedFruits.length === 1 ? 78 : 38;
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

      fruitDropElements.forEach((drop) => {
        drop.dataset.animated = "true";
        const dropId = drop.dataset.dropId;

        gsap
          .timeline({
            onComplete: () => setFruitDrops((current) => current.filter((item) => item.id !== dropId)),
          })
          .fromTo(
            drop,
            { y: -118, x: gsap.utils.random(-42, 42), scale: 0.55, rotate: gsap.utils.random(-34, 34), opacity: 0 },
            { y: -92, scale: 1, opacity: 1, duration: 0.15, ease: "power1.out" },
          )
          .to(drop, { y: 156, rotate: "+=110", duration: 0.62, ease: "power2.in" })
          .to(drop, { opacity: 0, scale: 1.15, duration: 0.14 }, "-=0.08");

        if (liquid) {
          gsap.fromTo(
            liquid,
            { filter: "saturate(1) brightness(1)" },
            { filter: "saturate(1.16) brightness(1.08)", repeat: 1, yoyo: true, duration: 0.2, delay: 0.45 },
          );
        }

        if (wave) {
          gsap.fromTo(wave, { scaleX: 0.82, y: -1 }, { scaleX: 1.08, y: 1, repeat: 1, yoyo: true, duration: 0.2, delay: 0.44 });
        }
      });
    },
    { scope: sectionRef, dependencies: [selectedFruits.join("|"), fruitDrops.map((drop) => drop.id).join("|")] },
  );

  return (
    <section id="monte-seu-suco" className="section soft" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">{content.title}</h2>
        <p className="builder-description">{content.description}</p>

        <div className="juice-preview juice-scene">
          <div className="juice-aura" aria-hidden="true" />
          <img className="juice-bottle juice-bottle--left" src="/img/garrafinha.png" alt="" aria-hidden="true" loading="lazy" />
          <img className="juice-bottle juice-bottle--right" src="/img/garrafinha03.png" alt="" aria-hidden="true" loading="lazy" />

          <motion.div className="juice-cup" whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.25 }}>
            <div className="juice-drop-zone" aria-hidden="true">
              {fruitDrops.map((drop) => (
                <span
                  key={drop.id}
                  className="fruit-drop"
                  data-drop-id={drop.id}
                  style={{ background: drop.color }}
                >
                  {drop.icon}
                </span>
              ))}
            </div>
            <div className="juice-liquid" style={cupFillStyle}>
              <span className="juice-wave" />
              <span className="juice-liquid-glow" />
              <span className="juice-bubble juice-bubble--one" />
              <span className="juice-bubble juice-bubble--two" />
              <span className="juice-bubble juice-bubble--three" />
            </div>
            <div className="juice-lid" />
            <div className="juice-glass-highlight" aria-hidden="true" />
            <div className="juice-glass-reflection" aria-hidden="true" />
            <span className="juice-droplet juice-droplet--one" aria-hidden="true" />
            <span className="juice-droplet juice-droplet--two" aria-hidden="true" />
            <span className="juice-droplet juice-droplet--three" aria-hidden="true" />
            <div className="cup-logo">KaSucos</div>
          </motion.div>

          <div className="juice-shadow" aria-hidden="true" />
        </div>

        <div className="builder-grid">
          {content.fruits.map((fruit) => {
            const active = selectedFruits.includes(fruit);
            const disabled = !active && selectedFruits.length >= MAX_COMBINATIONS;
            const fruitColor = FRUIT_COLORS[normalizeFruitKey(fruit)] ?? DEFAULT_JUICE_COLOR;

            return (
              <motion.button
                key={fruit}
                type="button"
                className={`fruit-chip ${active ? "active" : ""}`.trim()}
                onClick={() => handleToggleFruit(fruit)}
                disabled={disabled}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span className="mini-cup">
                  <span className="mini-cup-liquid" style={{ background: fruitColor }} />
                </span>
                <span>{fruit}</span>
              </motion.button>
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
