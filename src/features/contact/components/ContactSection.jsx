export function ContactSection({ t }) {
  return (
    <section id="contato" className="section cta">
      <div className="container cta-box">
        <h2>{t.contactTitle}</h2>
        <p>{t.contactDescription}</p>
        <a className="btn-primary" href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
          {t.contactButton}
        </a>
      </div>
    </section>
  );
}
