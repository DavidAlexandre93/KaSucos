import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

const AUTHORS = ["Juliana R.", "Marcos A.", "Camila P."];

export function DepoimentosSection({ testimonials }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const reviews = selector(".reviews blockquote");
      gsap.set(reviews, { opacity: 0, y: 20 });
      gsap.to(reviews, { opacity: 1, y: 0, stagger: 0.12, duration: 0.55 });
    },
    { scope: sectionRef, dependencies: [testimonials.title] },
  );

  return (
    <section id="depoimentos" className="section testimonials" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title testimonials-title">{testimonials.title}</h2>
        <div className="grid reviews">
          {testimonials.items.map((item, index) => (
            <motion.blockquote key={AUTHORS[index]} whileHover={{ y: -6, rotate: index % 2 === 0 ? -0.8 : 0.8 }}>
              “{item}”
              <cite>— {AUTHORS[index]}</cite>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
