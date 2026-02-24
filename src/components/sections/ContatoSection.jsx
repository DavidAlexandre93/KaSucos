import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

export function ContatoSection({ contact }) {
  const mapsQuery = encodeURIComponent(contact.address);
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const cta = selector(".cta-box")[0];
      const map = selector(".map-box")[0];

      gsap.set([cta, map], { opacity: 0, y: 24 });
      gsap.to(cta, { opacity: 1, y: 0, duration: 0.6 });
      gsap.to(map, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 });
    },
    { scope: sectionRef, dependencies: [contact.title] },
  );

  return (
    <section id="contato" className="section cta" ref={sectionRef}>
      <div className="container contact-grid">
        <motion.div className="cta-box" whileHover={{ scale: 1.01, y: -4 }}>
          <h2>{contact.title}</h2>
          <p>{contact.description}</p>
          <motion.a
            className="btn-primary"
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {contact.cta}
          </motion.a>
        </motion.div>

        <motion.div id="onde-nos-encontrar" className="map-box" whileHover={{ y: -4 }}>
          <h3>{contact.mapTitle}</h3>
          <p>{contact.address}</p>
          <iframe
            title={contact.mapTitle}
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
