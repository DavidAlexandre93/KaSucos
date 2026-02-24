export function ContatoSection({ contact }) {
  const mapsQuery = encodeURIComponent(contact.address);

  return (
    <section id="contato" className="section cta">
      <div className="container contact-grid">
        <div className="cta-box">
          <h2>{contact.title}</h2>
          <p>{contact.description}</p>
          <a className="btn-primary" href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
            {contact.cta}
          </a>
        </div>

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
