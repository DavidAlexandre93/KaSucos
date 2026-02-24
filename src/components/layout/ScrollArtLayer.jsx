import { useRef } from "react";
import gsap from "../../lib/gsap";
import { ScrollTrigger } from "../../lib/ScrollTrigger";
import { useGSAP } from "../../lib/useGSAP";
import { scrollArtLayers } from "../../constants/scrollArtLayers";

gsap.registerPlugin(ScrollTrigger);

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

      const render = (progress) => {
        layers.forEach((element, index) => {
          const layer = scrollArtLayers[index];
          if (!layer) return;
          const visibility = getRangeVisibility(progress, layer.start, layer.end);
          const phase = clamp((progress - layer.start) / (layer.end - layer.start || 1), 0, 1);

          gsap.set(element, {
            xPercent: layer.baseX,
            yPercent: layer.baseY + (1 - phase) * 7,
            rotate: layer.tilt,
            scale: layer.scale,
            force3D: true,
          });

          const spill = element.querySelector(".scroll-art-image--spill");
          const stream = element.querySelector(".scroll-art-stream");
          const jar = element.querySelector(".scroll-art-image--jar");

          if (spill) gsap.set(spill, { opacity: visibility * 0.35 });
          if (stream) gsap.set(stream, { opacity: visibility });
          if (jar) gsap.set(jar, { opacity: visibility });
        });
      };

      render(0);

      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: ({ progress }) => {
          render(progress);
        },
      });

      return undefined;
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
