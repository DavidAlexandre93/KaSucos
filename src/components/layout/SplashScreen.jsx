import { useEffect, useRef } from "react";
import { motion } from "../../lib/motion";
import gsap from "../../lib/gsap";
import { useGSAP } from "../../lib/useGSAP";

export function SplashScreen({ onComplete }) {
  const scopeRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const tl = gsap.timeline();
      tl.fromTo(
        selector(".splash-screen"),
        { "--reveal-size": "0px", opacity: 1 },
        { duration: 0.3, "--reveal-size": "0px", opacity: 1 },
      )
        .to(selector(".splash-straw"), {
          duration: 1.1,
          yPercent: -16,
          rotate: 8,
        })
        .to(
          selector(".splash-sipper"),
          {
            duration: 0.6,
            scale: 1.04,
            yPercent: -4,
          },
          "<",
        )
        .to(selector(".splash-screen"), {
          duration: 1.5,
          "--reveal-size": "180vmax",
        })
        .to(selector(".splash-screen"), {
          duration: 0.4,
          opacity: 0,
        });
    },
    { scope: scopeRef, dependencies: [] },
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div ref={scopeRef} className="splash-root" aria-hidden="true">
      <div className="splash-screen">
        <motion.div className="splash-juice-wave splash-juice-wave--one" initial={{ x: -30 }} whileInView={{ x: 0 }} />
        <motion.div className="splash-juice-wave splash-juice-wave--two" initial={{ x: 30 }} whileInView={{ x: 0 }} />
        <div className="splash-sipper">
          <span className="splash-head" />
          <span className="splash-body" />
          <span className="splash-arm" />
          <span className="splash-straw" />
        </div>
      </div>
    </div>
  );
}
