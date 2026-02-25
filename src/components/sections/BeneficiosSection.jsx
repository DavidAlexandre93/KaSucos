import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

export function BeneficiosSection({ benefits }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const listItems = selector(".benefits-list li");
      const cta = selector(".benefits-cta")[0];

      gsap.set([cta], { opacity: 0, y: 14 });
      gsap.set(listItems, { opacity: 0, xPercent: -5, y: 8 });

      const timeline = gsap.timeline();
      timeline
        .to(listItems, { opacity: 1, xPercent: 0, y: 0, stagger: 0.1, duration: 0.34 })
        .to(cta, { opacity: 1, y: 0, duration: 0.26 });
    },
    { scope: sectionRef, dependencies: [benefits.items] },
  );

  return (
    <section id="beneficios" className="section" ref={sectionRef}>
      <div className="container benefits">
        <img
          className="benefits-image"
          src="/img/porque-escolher-kasucos/porque-kasucos.png"
          alt="Por que escolher a KaSucos"
          loading="lazy"
        />
        <ul className="benefits-list">
          {benefits.items.map((item) => (
            <motion.li key={item} whileHover={{ x: 5, scale: 1.015, boxShadow: "0 12px 24px rgba(59, 21, 117, 0.16)" }}>
              <span className="benefit-check">✓</span>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>
        <motion.a className="benefits-cta" href="#catalogo" whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
          {benefits.cta ?? "Quero provar agora"}
        </motion.a>
      </div>
    </section>
  );
}
