export function CartSection({ labels, items, total, onFinalize }) {
  return (
    <section id="cesta" className="section cart-section">
      <div className="container cart-box">
        <h2>{labels.title}</h2>
        {items.length ? (
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} <small>({item.typeLabel})</small>
                </span>
                <strong>
                  {item.quantity}x {item.priceLabel}
                </strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>{labels.empty}</p>
        )}

        <div className="cart-total">
          <span>{labels.total}</span>
          <strong>{total}</strong>
        </div>

        <button type="button" className="btn-primary" disabled={!items.length} onClick={onFinalize}>
          {labels.finalize}
        </button>
      </div>
    </section>
  );
}
