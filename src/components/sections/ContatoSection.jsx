import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

export function ContatoSection({ contact }) {
  const mapsQuery = encodeURIComponent(contact.address);
  const sectionRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  useGSAP(
    ({ selector }) => {
      const cta = selector(".cta-box")[0];

      gsap.set(cta, { opacity: 0, y: 24 });
      gsap.to(cta, { opacity: 1, y: 0, duration: 0.6 });
    },
    { scope: sectionRef, dependencies: [contact.title] },
  );

  return (
    <section id="contato" className="section cta" ref={sectionRef}>
      <div className="container contact-grid">
        <motion.div className="cta-box" whileHover={{ scale: 1.01, y: -4 }}>
          <h2>{contact.title}</h2>
          <p>{contact.description}</p>
          <form
            className="contact-form"
            aria-label={contact.formLabel ?? "Formulário de contato"}
            onSubmit={handleSubmit}
          >
            <label>
              {contact.nameLabel ?? "Nome"}
              <input
                type="text"
                name="name"
                placeholder={contact.namePlaceholder ?? "Seu nome"}
                required
              />
            </label>

            <label>
              {contact.emailLabel ?? "E-mail"}
              <input
                type="email"
                name="email"
                placeholder={contact.emailPlaceholder ?? "voce@email.com"}
                required
              />
            </label>

            <label>
              {contact.messageLabel ?? "Mensagem"}
              <textarea
                name="message"
                rows={4}
                placeholder={contact.messagePlaceholder ?? "Como podemos ajudar?"}
                required
              />
            </label>

            <button type="submit" className="btn-secondary">
              {contact.sendLabel ?? "Enviar mensagem"}
            </button>
          </form>
        </motion.div>

        <div id="onde-nos-encontrar" className="map-box">
          <h3>{contact.mapTitle}</h3>
          <p>{contact.address}</p>
          <iframe
            title={contact.mapTitle}
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
