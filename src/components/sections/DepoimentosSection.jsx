const AUTHORS = ["Juliana R.", "Marcos A.", "Camila P."];

export function DepoimentosSection({ testimonials }) {
  return (
    <section id="depoimentos" className="section testimonials">
      <div className="container">
        <h2 className="section-title">{testimonials.title}</h2>
        <div className="grid reviews">
          {testimonials.items.map((item, index) => (
            <blockquote key={AUTHORS[index]}>
              “{item}”
              <cite>— {AUTHORS[index]}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
