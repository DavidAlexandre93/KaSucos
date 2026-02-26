import { useRef } from "react";
import gsap from "../../lib/gsap";
import { motion } from "../../lib/motion";
import { useGSAP } from "../../lib/useGSAP";

export function CartSection({ labels, items, total, onFinalize, availableJuices = [], onRemoveAvailableJuice }) {
  const sectionRef = useRef(null);

  useGSAP(
    ({ selector }) => {
      const box = selector(".cart-box")[0];
      const rows = selector(".cart-list li");
      const totalRow = selector(".cart-total")[0];
      const action = selector(".cart-finalize")[0];

      gsap.set([box, ...rows, totalRow, action], { opacity: 0, y: 18 });
      gsap.to(box, { opacity: 1, y: 0, duration: 0.55 });
      gsap.to(rows, { opacity: 1, y: 0, duration: 0.42, stagger: 0.06 });
      gsap.to([totalRow, action], { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 });
    },
    { scope: sectionRef, dependencies: [items.length, total] },
  );

  return (
    <section id="cesta" className="section cart-section" ref={sectionRef}>
      <motion.div className="container cart-box" whileHover={{ y: -2, scale: 1.002 }} transition={{ duration: 0.25 }}>
        <h2>{labels.title}</h2>

        {availableJuices.length ? (
          <div className="cart-available">
            <h3>{labels.availableTitle ?? "Sucos disponíveis para venda"}</h3>
            <ul className="cart-available-list">
              {availableJuices.map((juice) => (
                <li key={juice.name}>
                  <span>{juice.name}</span>
                  <div>
                    <strong>{juice.price}</strong>
                    <button type="button" className="btn-secondary btn-remove-juice" onClick={() => onRemoveAvailableJuice?.(juice)}>
                      {labels.removeFromList ?? "Remover"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {items.length ? (
          <ul className="cart-list">
            {items.map((item) => (
              <motion.li key={item.id} whileHover={{ x: 4 }}>
                <span>
                  {item.name} <small>({item.typeLabel})</small>
                </span>
                <strong>
                  {item.quantity}x {item.priceLabel}
                </strong>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p>{labels.empty}</p>
        )}

        <motion.div className="cart-total" whileHover={{ scale: 1.01 }}>
          <span>{labels.total}</span>
          <strong>{total}</strong>
        </motion.div>

        <motion.button
          type="button"
          className="btn-primary cart-finalize"
          disabled={!items.length}
          onClick={onFinalize}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {labels.finalize}
        </motion.button>
      </motion.div>
    </section>
  );
}
