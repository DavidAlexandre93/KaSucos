import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

export function CheckoutSection({ checkout, total }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const box = selector(".cta-box")[0];
      const fields = selector(".checkout-form label");
      const totalRow = selector(".checkout-total")[0];
      const button = selector(".checkout-action")[0];

      gsap.set([box, ...fields, totalRow, button], { opacity: 0, y: 22 });
      gsap.to(box, { opacity: 1, y: 0, duration: 0.55 });
      gsap.to(fields, { opacity: 1, y: 0, duration: 0.42, stagger: 0.07 });
      gsap.to([totalRow, button], { opacity: 1, y: 0, duration: 0.45, stagger: 0.08 });
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
            <select defaultValue="" name="temperatura">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="refrigerada">{checkout.temperatureOptions.refrigerated}</option>
              <option value="ambiente">{checkout.temperatureOptions.roomTemp}</option>
            </select>
          </motion.label>

          <motion.label whileHover={{ x: 2 }}>
            <span>{checkout.deliveryLabel}</span>
            <select defaultValue="" name="entrega">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="entrega">{checkout.deliveryOptions.delivery}</option>
              <option value="retirada">{checkout.deliveryOptions.pickup}</option>
            </select>
          </motion.label>

          <motion.label whileHover={{ x: 2 }}>
            <span>{checkout.paymentLabel}</span>
            <select defaultValue="" name="pagamento">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="pix">Pix</option>
              <option value="dinheiro">{checkout.paymentOptions.cash}</option>
              <option value="debito">{checkout.paymentOptions.debit}</option>
              <option value="credito">{checkout.paymentOptions.credit}</option>
            </select>
          </motion.label>
        </form>

        <motion.p className="checkout-total" whileHover={{ scale: 1.01 }}>
          {checkout.totalLabel} <strong>{total}</strong>
        </motion.p>

        <motion.a
          className="btn-primary checkout-action"
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {checkout.cta}
        </motion.a>
      </motion.div>
    </section>
  );
}
