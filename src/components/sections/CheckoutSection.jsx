import { useMemo, useRef, useState } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

export function CheckoutSection({ checkout, total, items = [], whatsappPhone = "5511000000000", contact = {} }) {
  const sectionRef = useRef(null);
  const [storageType, setStorageType] = useState("");
  const [deliveryType, setDeliveryType] = useState("");

  const whatsappHref = useMemo(() => {
    const lines = items.length
      ? items.map((item) => `• ${item.quantity}x ${item.name} — ${item.priceLabel}`)
      : [checkout.emptyOrderMessage ?? "Sem itens na cesta."];

    const rawMessage = [
      contact.whatsappIntro ?? "Olá! Quero fechar este pedido:",
      "",
      "🧾 *PEDIDO KA SUCOS*",
      "",
      "🍹 *Itens para produção:*",
      ...lines,
      "",
      "📦 *Detalhes do pedido:*",
      `• ${checkout.temperatureLabel}: *${storageType || checkout.chooseOption}*`,
      `• ${checkout.deliveryLabel}: *${deliveryType || checkout.chooseOption}*`,
      `• ${checkout.totalLabel} *${total}*`,
      "",
      "👩‍🍳 Pode preparar, por favor? Obrigado!",
    ].join("\n");

    return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(rawMessage)}`;
  }, [checkout, contact.whatsappIntro, deliveryType, items, storageType, total, whatsappPhone]);

  useGSAP(
    ({ selector }) => {
      const box = selector(".cta-box")[0];
      const fields = selector(".checkout-form label");
      const totalRow = selector(".checkout-total")[0];

      gsap.set([box, ...fields, totalRow], { opacity: 0, y: 22 });
      gsap.to(box, { opacity: 1, y: 0, duration: 0.55 });
      gsap.to(fields, { opacity: 1, y: 0, duration: 0.42, stagger: 0.07 });
      gsap.to(totalRow, { opacity: 1, y: 0, duration: 0.45 });
    },
    { scope: sectionRef, dependencies: [checkout.title, total] },
  );

  return (
    <section id="finalizar" className="section cta" ref={sectionRef}>
      <motion.div className="container cta-box" whileHover={{ scale: 1.004, y: -2 }}>
        <h2>{checkout.title}</h2>
        <p>{checkout.description}</p>

        <form className="checkout-form" aria-label={checkout.formLabel}>
          <motion.label whileHover={{ x: 2 }}>
            <span>{checkout.temperatureLabel}</span>
            <select value={storageType} onChange={(event) => setStorageType(event.target.value)} name="temperatura">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="refrigerada">{checkout.temperatureOptions.refrigerated}</option>
              <option value="ambiente">{checkout.temperatureOptions.roomTemp}</option>
            </select>
          </motion.label>

          <motion.label whileHover={{ x: 2 }}>
            <span>{checkout.deliveryLabel}</span>
            <select value={deliveryType} onChange={(event) => setDeliveryType(event.target.value)} name="entrega">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="entrega">{checkout.deliveryOptions.delivery}</option>
              <option value="retirada">{checkout.deliveryOptions.pickup}</option>
            </select>
          </motion.label>

        </form>

        <motion.p className="checkout-total" whileHover={{ scale: 1.01 }}>
          {checkout.totalLabel} <strong>{total}</strong>
        </motion.p>

        <motion.a
          className="btn-primary checkout-whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {checkout.cta}
        </motion.a>
      </motion.div>
    </section>
  );
}
