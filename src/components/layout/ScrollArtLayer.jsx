import { useEffect, useMemo, useState } from "react";
import { motion } from "../../lib/motion";
import { scrollArtLayers } from "../../constants/scrollArtLayers";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function getRangeVisibility(progress, start, end) {
  if (progress < start || progress > end) return 0;
  const phase = (progress - start) / (end - start || 1);
  const fade = phase < 0.2 ? phase / 0.2 : phase > 0.8 ? (1 - phase) / 0.2 : 1;
  return clamp(fade, 0, 1);
}

export function ScrollArtLayer() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const visuals = useMemo(
    () =>
      scrollArtLayers.map((layer) => {
        const visibility = getRangeVisibility(progress, layer.start, layer.end);
        const phase = clamp((progress - layer.start) / (layer.end - layer.start || 1), 0, 1);
        return {
          ...layer,
          opacity: visibility,
          transform: `translate3d(${layer.baseX}%, ${layer.baseY + (1 - phase) * 7}%, 0) rotate(${layer.tilt}deg) scale(${layer.scale})`,
        };
      }),
    [progress],
  );

  return (
    <div className="scroll-art" aria-hidden="true">
      {visuals.map((visual) => (
        <motion.div key={visual.id} className={`scroll-art-item scroll-art-item--${visual.id}`} style={{ transform: visual.transform }}>
          <img
            className={`scroll-art-image scroll-art-image--spill scroll-art-image--spill-${visual.flavor}`}
            src={visual.spillSrc}
            alt=""
            loading="lazy"
            style={{ opacity: visual.opacity * 0.35 }}
          />
          <div className={`scroll-art-stream scroll-art-stream--${visual.flavor}`} style={{ opacity: visual.opacity }} />
          <img
            className={`scroll-art-image scroll-art-image--jar scroll-art-image--${visual.id}`}
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
            style={{ opacity: visual.opacity }}
          />
        </motion.div>
      ))}
    </div>
  );
}
