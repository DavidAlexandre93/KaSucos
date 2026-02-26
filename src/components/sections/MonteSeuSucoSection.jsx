import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

const MAX_COMBINATIONS = 2;
const SPAWN_INTERVAL_MS = 1150;
const FRUIT_FALL_SPEED = 3.6;
const CUP_WIDTH = 210;

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
const randomBetween = (min, max) => min + Math.random() * (max - min);

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

export function MonteSeuSucoSection({ content, onAddCustomJuice }) {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [fallingFruits, setFallingFruits] = useState([]);
  const [cupPosition, setCupPosition] = useState(50);

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

  const moveCup = (nextPercent) => {
    setCupPosition(Math.min(100, Math.max(0, nextPercent)));
  };

  useEffect(() => {
    const handleKeyMove = (event) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setCupPosition((current) => Math.max(0, current - 8));
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setCupPosition((current) => Math.min(100, current + 8));
      }
    };

    window.addEventListener("keydown", handleKeyMove);
    return () => window.removeEventListener("keydown", handleKeyMove);
  }, []);

  useEffect(() => {
    const spawnFruit = () => {
      const randomFruit = content.fruits[Math.floor(Math.random() * content.fruits.length)];
      const fruitKey = normalizeFruitKey(randomFruit);

      setFallingFruits((current) => [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          fruit: randomFruit,
          x: randomBetween(8, 92),
          y: -16,
          icon: FRUIT_EMOJIS[fruitKey] ?? "🍹",
          color: FRUIT_COLORS[fruitKey] ?? DEFAULT_JUICE_COLOR,
        },
      ]);
    };

    spawnFruit();
    const spawnInterval = window.setInterval(spawnFruit, SPAWN_INTERVAL_MS);
    return () => window.clearInterval(spawnInterval);
  }, [content.fruits]);

  useEffect(() => {
    const sceneHeight = sceneRef.current?.clientHeight ?? 410;

    const tick = window.setInterval(() => {
      setFallingFruits((current) =>
        current
          .map((fruit) => ({ ...fruit, y: fruit.y + FRUIT_FALL_SPEED }))
          .filter((fruit) => {
            const fruitCenterX = fruit.x;
            const cupLeft = cupPosition - (CUP_WIDTH / 2 / (sceneRef.current?.clientWidth ?? 1)) * 100;
            const cupRight = cupPosition + (CUP_WIDTH / 2 / (sceneRef.current?.clientWidth ?? 1)) * 100;
            const reachesCup = fruit.y >= 170 && fruit.y <= 245;
            const insideCup = fruitCenterX >= cupLeft + 10 && fruitCenterX <= cupRight - 10;

            if (!canCreate && reachesCup && insideCup) {
              setSelectedFruits((selected) => (selected.length < MAX_COMBINATIONS ? [...selected, fruit.fruit] : selected));
              return false;
            }

            return fruit.y <= sceneHeight;
          }),
      );
    }, 30);

    return () => window.clearInterval(tick);
  }, [canCreate, cupPosition]);

  useGSAP(
    ({ selector }) => {
      const scene = selector(".juice-scene")[0];
      const liquid = selector(".juice-liquid")[0];
      const bubbles = selector(".juice-bubble");
      const droplets = selector(".juice-droplet");
      const fallingFruitElements = selector(".falling-fruit:not([data-animated='true'])");
      const wave = selector(".juice-wave")[0];

      gsap.timeline().fromTo(scene, { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.65 });

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

      fallingFruitElements.forEach((drop) => {
        drop.dataset.animated = "true";

        gsap.fromTo(drop, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.22, ease: "power1.out" });

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
    { scope: sectionRef, dependencies: [selectedFruits.join("|"), fallingFruits.map((drop) => drop.id).join("|")] },
  );

  return (
    <section id="monte-seu-suco" className="section soft" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title">{content.title}</h2>
        <p className="builder-description">{content.description}</p>

        <div className="juice-preview juice-scene" ref={sceneRef} onMouseMove={(event) => {
          if (!sceneRef.current) return;
          const rect = sceneRef.current.getBoundingClientRect();
          moveCup(((event.clientX - rect.left) / rect.width) * 100);
        }}>
          <div className="juice-aura" aria-hidden="true" />

          {fallingFruits.map((fruit) => (
            <span
              key={fruit.id}
              className="falling-fruit"
              style={{ left: `${fruit.x}%`, top: `${fruit.y}px`, background: fruit.color }}
              aria-hidden="true"
            >
              {fruit.icon}
            </span>
          ))}

          <motion.div
            className="juice-cup"
            style={{ left: `${cupPosition}%`, transform: "translateX(-50%)" }}
          >
            <div className="juice-handle" aria-hidden="true" />
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
            <div className="cup-logo" aria-hidden="true">
              <img src="/img/nav/logo.jpeg" alt="" loading="lazy" />
            </div>
          </motion.div>

          <div className="juice-shadow" aria-hidden="true" style={{ left: `${cupPosition}%`, transform: "translateX(-50%)" }} />
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
