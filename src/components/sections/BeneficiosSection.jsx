import { TypingText } from "../ui/TypingText";

export function BeneficiosSection({ benefits }) {
  return (
    <section id="beneficios" className="section">
      <div className="container benefits">
        <TypingText className="section-title" text={benefits.title} highlight />
        <ul>
          {benefits.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
