import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";
import { TypingText } from "../ui/TypingText";

export function BeneficiosSection({ benefits }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const listItems = selector(".benefits-list li");
      gsap.set(listItems, { opacity: 0, xPercent: -4 });
      gsap.to(listItems, { opacity: 1, xPercent: 0, stagger: 0.08, duration: 0.4 });
    },
    { scope: sectionRef, dependencies: [benefits.title] },
  );

  return (
    <section id="beneficios" className="section" ref={sectionRef}>
      <div className="container benefits">
        <TypingText className="section-title" text={benefits.title} highlight />
        <ul className="benefits-list">
          {benefits.items.map((item) => (
            <motion.li key={item} whileHover={{ x: 4, scale: 1.01 }}>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
