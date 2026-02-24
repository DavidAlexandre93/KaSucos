import { motion } from "../../lib/motion";
import { buttonMotion, cardMotion } from "../ui/MotionPrimitives";

export function InicioSection({ hero }) {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-grid">
        <div>
          <motion.p className="chip" whileHover={{ scale: 1.04, rotate: -2 }} transition={{ duration: 0.2 }}>
            {hero.chip}
          </motion.p>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
          <div className="hero-actions">
            <motion.a href="#catalogo" className="btn-primary" {...buttonMotion}>
              {hero.buyNow}
            </motion.a>
            <motion.a href="#combos" className="btn-ghost" {...buttonMotion}>
              {hero.viewCombos}
            </motion.a>
          </div>
        </div>
        <motion.div className="hero-card" {...cardMotion}>
          <img src="/img/logotipo.jpeg" alt="Logo KaSucos" />
          <h2>KaSucos</h2>
          <p>{hero.slogan}</p>
        </motion.div>
      </div>
    </section>
  );
}
