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
        .to(selector(".splash-wolf"), {
          duration: 0.85,
          yPercent: -6,
          scale: 1.03,
          yoyo: true,
          repeat: 1,
        })
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
        <motion.img
          className="splash-sky"
          src="/img/tela-splash/nuvens-sol.png"
          alt=""
          initial={{ y: -18, opacity: 0.92 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <motion.img
          className="splash-field"
          src="/img/tela-splash/campo-gramado.png"
          alt=""
          initial={{ y: 18, opacity: 0.9 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <div className="splash-picnic">
          <span className="splash-picnic-cloth" />
          <span className="splash-picnic-basket" />
          <img className="splash-wolf" src="/img/tela-splash/lobo-mal.png" alt="Lobo mau fazendo um piquenique" />
        </div>
      </div>
    </div>
  );
}
