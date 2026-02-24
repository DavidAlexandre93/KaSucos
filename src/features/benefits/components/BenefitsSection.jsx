export function BenefitsSection({ t }) {
  return (
    <section id="beneficios" className="section">
      <div className="container benefits">
        <h2 className="section-title">{t.benefitsTitle}</h2>
        <ul>
          {t.benefitsItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
