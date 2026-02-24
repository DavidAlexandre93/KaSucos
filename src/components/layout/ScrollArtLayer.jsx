import { useEffect, useMemo, useState } from "react";
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
  const [motionTick, setMotionTick] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let frameId;
    const start = performance.now();

    const animate = (time) => {
      setMotionTick((time - start) / 1000);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    let rafId = 0;

    const handleMove = (event) => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        setPointer({ x, y });
        rafId = 0;
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  const visuals = useMemo(
    () =>
      scrollArtLayers.map((layer, index) => {
        const visibility = getRangeVisibility(scrollProgress, layer.start, layer.end);
        const phase = getRangePhase(scrollProgress, layer.start, layer.end);
        const drift = scrollProgress * 120 * layer.speed;
        const orbit = Math.sin(motionTick * (0.5 + layer.speed) + index) * layer.swing;
        const bob = Math.cos(motionTick * (0.65 + layer.speed) + index * 0.7) * layer.float;
        const pointerX = pointer.x * layer.pointerDepth;
        const pointerY = pointer.y * layer.pointerDepth * 0.8;

        return {
          ...layer,
          opacity: visibility,
          transform: `translate3d(${layer.baseX + drift * 0.1 + orbit + pointerX}vw, ${layer.baseY - drift * 0.14 + bob + pointerY}vh, 0) rotate(${orbit * 0.55}deg) scale(${layer.scale + Math.sin(phase * Math.PI) * 0.03})`,
        };
      }),
    [motionTick, pointer.x, pointer.y, scrollProgress],
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
        </div>
      ))}
    </div>
  );
}
