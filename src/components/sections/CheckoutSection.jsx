export function CheckoutSection({ checkout, total }) {
  return (
    <section id="finalizar" className="section cta">
      <div className="container cta-box">
        <h2>{checkout.title}</h2>
        <p>{checkout.description}</p>

        <form className="checkout-form" aria-label={checkout.formLabel}>
          <label>
            <span>{checkout.temperatureLabel}</span>
            <select defaultValue="" name="temperatura">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="refrigerada">{checkout.temperatureOptions.refrigerated}</option>
              <option value="ambiente">{checkout.temperatureOptions.roomTemp}</option>
            </select>
          </label>

          <label>
            <span>{checkout.deliveryLabel}</span>
            <select defaultValue="" name="entrega">
              <option value="" disabled>
                {checkout.chooseOption}
              </option>
              <option value="entrega">{checkout.deliveryOptions.delivery}</option>
              <option value="retirada">{checkout.deliveryOptions.pickup}</option>
            </select>
          </label>

          <label>
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
          </label>
        </form>

        <p className="checkout-total">
          {checkout.totalLabel} <strong>{total}</strong>
        </p>

        <a className="btn-primary" href="https://wa.me/5500000000000" target="_blank" rel="noreferrer">
          {checkout.cta}
        </a>
      </div>
    </section>
  );
}
