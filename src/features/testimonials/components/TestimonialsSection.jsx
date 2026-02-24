export function TestimonialsSection({ t }) {
  return (
    <section className="section testimonials">
      <div className="container">
        <h2 className="section-title">{t.testimonialsTitle}</h2>
        <div className="grid reviews">
          {t.testimonials.map((testimonial) => (
            <blockquote key={testimonial.author}>
              {testimonial.text}
              <cite>{testimonial.author}</cite>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
