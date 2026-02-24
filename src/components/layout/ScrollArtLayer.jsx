import { useMemo } from "react";
import { scrollArtLayers } from "../../constants/scrollArtLayers";
import { useScrollProgress } from "../../hooks/useScrollProgress";

function getRangeVisibility(progress, start, end) {
  if (progress < start || progress > end) return 0;

  const phase = (progress - start) / (end - start || 1);
  const fade = phase < 0.2 ? phase / 0.2 : phase > 0.8 ? (1 - phase) / 0.2 : 1;

  return Math.max(0, Math.min(1, fade));
}

function getRangePhase(progress, start, end) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start || 1);
}

export function ScrollArtLayer() {
  const scrollProgress = useScrollProgress();

  const visuals = useMemo(
    () =>
      scrollArtLayers.map((layer) => {
        const visibility = getRangeVisibility(scrollProgress, layer.start, layer.end);
        const phase = getRangePhase(scrollProgress, layer.start, layer.end);
        const drift = scrollProgress * 120 * layer.speed;
        const pourAngle = layer.id === "juice" ? -14 + Math.sin(phase * Math.PI) * 20 : 0;
        const spillStrength = layer.id === "juice" ? Math.max(0, Math.sin(phase * Math.PI)) : 0;

        return {
          ...layer,
          opacity: visibility,
          transform: `translate3d(${layer.baseX + drift * 0.12}%, ${layer.baseY - drift * 0.15}%, 0) scale(${layer.scale}) rotate(${pourAngle}deg)`,
          filter:
            layer.id === "juice"
              ? `drop-shadow(0 24px 32px rgba(255, 142, 30, ${0.2 + spillStrength * 0.15}))`
              : undefined,
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
            style={{ opacity: visual.opacity, transform: visual.transform, filter: visual.filter }}
          />
        </div>
      ))}
    </div>
  );
}
