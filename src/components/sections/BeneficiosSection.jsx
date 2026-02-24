export function BeneficiosSection({ benefits }) {
  return (
    <section id="beneficios" className="section">
      <div className="container benefits">
        <h2 className="section-title">{benefits.title}</h2>
        <ul>
          {benefits.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
