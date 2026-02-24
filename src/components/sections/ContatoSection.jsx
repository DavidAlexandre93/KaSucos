const PHONE_NUMBER = "5500000000000";

export function ContatoSection({ contact, pedido }) {
  const totalItems = Object.values(pedido).reduce((total, quantidade) => total + quantidade, 0);

  const itensPedido = Object.entries(pedido)
    .filter(([, quantidade]) => quantidade > 0)
    .map(([nome, quantidade]) => `- ${nome} x${quantidade}`)
    .join("\n");

  const mensagemWhatsapp = itensPedido
    ? `${contact.whatsappIntro}\n${itensPedido}\n\n${contact.whatsappTotalLabel} ${totalItems}`
    : contact.whatsappEmpty;

  const whatsappLink = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensagemWhatsapp)}`;

  return (
    <section id="contato" className="section cta">
      <div className="container cta-box">
        <h2>{contact.title}</h2>
        <p>{contact.description}</p>
        <a className="btn-primary" href={whatsappLink} target="_blank" rel="noreferrer">
          {contact.closeOrderCta}
        </a>
      </div>
    </section>
  );
}
