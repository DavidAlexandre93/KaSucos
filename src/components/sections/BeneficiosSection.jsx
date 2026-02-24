import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
import { TypingText } from "../ui/TypingText";

export function BeneficiosSection({ benefits }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const badge = selector(".benefits-badge")[0];
      const subtitle = selector(".benefits-subtitle")[0];
      const listItems = selector(".benefits-list li");
      const cta = selector(".benefits-cta")[0];

      gsap.set([badge, subtitle, cta], { opacity: 0, y: 14 });
      gsap.set(listItems, { opacity: 0, xPercent: -5, y: 8 });

      const timeline = gsap.timeline();
      timeline
        .to(badge, { opacity: 1, y: 0, duration: 0.28 })
        .to(subtitle, { opacity: 1, y: 0, duration: 0.28 })
        .to(listItems, { opacity: 1, xPercent: 0, y: 0, stagger: 0.1, duration: 0.34 })
        .to(cta, { opacity: 1, y: 0, duration: 0.26 });
    },
    { scope: sectionRef, dependencies: [benefits.title] },
  );

  return (
    <section id="beneficios" className="section" ref={sectionRef}>
      <div className="container benefits">
        <span className="benefits-badge">{benefits.badge ?? "Escolha inteligente para o seu dia"}</span>
        <TypingText className="section-title" text={benefits.title} highlight />
        <p className="benefits-subtitle">{benefits.subtitle ?? "Mais energia, mais sabor e zero dor de cabeça no pedido."}</p>
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
