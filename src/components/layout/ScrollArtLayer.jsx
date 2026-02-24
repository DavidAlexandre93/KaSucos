import { useRef } from "react";
import { useGSAP } from "../../lib/useGSAP";
import { scrollArtLayers } from "../../constants/scrollArtLayers";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function getRangeVisibility(progress, start, end) {
  if (progress < start || progress > end) return 0;
  const phase = (progress - start) / (end - start || 1);
  const fade = phase < 0.2 ? phase / 0.2 : phase > 0.8 ? (1 - phase) / 0.2 : 1;
  return clamp(fade, 0, 1);
}

export function ScrollArtLayer() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;

      const layers = Array.from(root.querySelectorAll(".scroll-art-item"));
      let ticking = false;

      const render = () => {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;

        layers.forEach((element, index) => {
          const layer = scrollArtLayers[index];
          if (!layer) return;
          const visibility = getRangeVisibility(progress, layer.start, layer.end);
          const phase = clamp((progress - layer.start) / (layer.end - layer.start || 1), 0, 1);

          element.style.transform = `translate3d(${layer.baseX}%, ${layer.baseY + (1 - phase) * 7}%, 0) rotate(${layer.tilt}deg) scale(${layer.scale})`;

          const spill = element.querySelector(".scroll-art-image--spill");
          const stream = element.querySelector(".scroll-art-stream");
          const jar = element.querySelector(".scroll-art-image--jar");

          if (spill) spill.style.opacity = String(visibility * 0.35);
          if (stream) stream.style.opacity = String(visibility);
          if (jar) jar.style.opacity = String(visibility);
        });

        ticking = false;
      };

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(render);
      };

      render();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="scroll-art" aria-hidden="true" ref={rootRef}>
      {scrollArtLayers.map((visual) => (
        <div key={visual.id} className={`scroll-art-item scroll-art-item--${visual.id}`}>
          <img
            className={`scroll-art-image scroll-art-image--spill scroll-art-image--spill-${visual.flavor}`}
            src={visual.spillSrc}
            alt=""
            loading="lazy"
          />
          <div className={`scroll-art-stream scroll-art-stream--${visual.flavor}`} />
          <img
            className={`scroll-art-image scroll-art-image--jar scroll-art-image--${visual.id}`}
            src={visual.src}
            alt={visual.alt}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
