import { useEffect, useMemo, useState } from "react";

const layers = [
  {
    id: "clouds",
    src: "/img/ai/clouds-ai.svg",
    alt: "Ilustração de nuvens geradas por IA",
    speed: 0.22,
    start: 0,
    end: 0.42,
    baseX: -12,
    baseY: 8,
    scale: 1.03,
  },
  {
    id: "fence",
    src: "/img/ai/fence-ai.svg",
    alt: "Ilustração de cercado gerada por IA",
    speed: 0.34,
    start: 0.24,
    end: 0.76,
    baseX: 9,
    baseY: 42,
    scale: 1,
  },
  {
    id: "juice",
    src: "/img/ai/juice-ai.svg",
    alt: "Ilustração de sucos gerada por IA",
    speed: 0.46,
    start: 0.56,
    end: 1,
    baseX: -10,
    baseY: 68,
    scale: 1.07,
  },
];

function rangeVisibility(progress, start, end) {
  if (progress < start || progress > end) return 0;
  const phase = (progress - start) / (end - start || 1);
  const fade = phase < 0.2 ? phase / 0.2 : phase > 0.8 ? (1 - phase) / 0.2 : 1;
  return Math.max(0, Math.min(1, fade));
}

function rangePhase(progress, start, end) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start || 1);
}

export function ScrollArtLayer() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const next = scrollable > 0 ? window.scrollY / scrollable : 0;
      setScrollProgress(Math.max(0, Math.min(1, next)));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const visuals = useMemo(
    () =>
      layers.map((layer) => {
        const visibility = rangeVisibility(scrollProgress, layer.start, layer.end);
        const phase = rangePhase(scrollProgress, layer.start, layer.end);
        const drift = scrollProgress * 120 * layer.speed;
        const pourAngle = layer.id === "juice" ? -14 + Math.sin(phase * Math.PI) * 20 : 0;
        const spillStrength = layer.id === "juice" ? Math.max(0, Math.sin(phase * Math.PI)) : 0;

        return {
          ...layer,
          opacity: visibility,
          transform: `translate3d(${layer.baseX + drift * 0.12}%, ${layer.baseY - drift * 0.15}%, 0) scale(${layer.scale}) rotate(${pourAngle}deg)`,
          spillStrength,
        };
      }),
    [scrollProgress],
  );

  return (
    <div className="scroll-art" aria-hidden="true">
      {visuals.map((visual) => (
        <div key={visual.id} className={`scroll-art-item scroll-art-item--${visual.id}`}>
          <img
            className={`scroll-art-image scroll-art-image--${visual.id}`}
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
            style={{ opacity: visual.opacity, transform: visual.transform }}
          />
          {visual.id === "juice" ? (
            <div
              className="scroll-art-spill"
              style={{
                opacity: Math.min(0.9, visual.opacity * visual.spillStrength),
                transform: `translate3d(${6 + visual.spillStrength * 16}px, ${18 - visual.spillStrength * 14}px, 0) rotate(14deg)`,
              }}
            >
              <span className="scroll-art-spill-drop scroll-art-spill-drop--1" />
              <span className="scroll-art-spill-drop scroll-art-spill-drop--2" />
              <span className="scroll-art-spill-drop scroll-art-spill-drop--3" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
