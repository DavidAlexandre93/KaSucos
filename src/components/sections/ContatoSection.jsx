export function ContatoSection({ contact }) {
  return (
    <section id="contato" className="section cta">
      <div className="container cta-box">
        <h2>{contact.title}</h2>
        <p>{contact.description}</p>
        <a className="btn-primary" href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
          {contact.cta}
        </a>
      </div>
    </section>
  );
}
