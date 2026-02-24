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
      scrollArtLayers.map((layer, index) => {
        const visibility = getRangeVisibility(scrollProgress, layer.start, layer.end);
        const phase = getRangePhase(scrollProgress, layer.start, layer.end);
        const settle = (1 - phase) * 7;

        return {
          ...layer,
          opacity: visibility,
          transform: `translate3d(${layer.baseX}%, ${layer.baseY + settle}%, 0) rotate(${layer.tilt}deg) scale(${layer.scale})`,
        };
      }),
    [scrollProgress],
  );

  return (
    <div className="scroll-art" aria-hidden="true">
      {visuals.map((visual) => (
        <div
          key={visual.id}
          className={`scroll-art-item scroll-art-item--${visual.id}`}
          style={{ transform: visual.transform }}
        >
          <div
            className={`scroll-art-stream scroll-art-stream--${visual.flavor}`}
            style={{ opacity: visual.opacity }}
          />
          <img
            className={`scroll-art-image scroll-art-image--jar scroll-art-image--${visual.id}`}
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
            style={{ opacity: visual.opacity }}
          />
        </div>
      ))}
    </div>
  );
}
