export function BasketSummary({ labels, totalItems }) {
  return (
    <a className="basket-summary" href="#contato" aria-label={labels.ariaLabel} title={labels.ariaLabel}>
      <svg
        className="basket-summary-icon"
        viewBox="0 0 64 64"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 23h52v8H6z" fill="#f5d328" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
        <path d="M10 31h44l-4 24a4 4 0 0 1-4 3H18a4 4 0 0 1-4-3z" fill="#ff5555" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 23 28 7M46 23 36 7" stroke="#111" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 23 30 6M42 23 34 6" stroke="#ff5555" strokeWidth="3" strokeLinecap="round" />
        <rect x="20" y="36" width="4" height="16" rx="2" fill="#eef9ff" stroke="#111" strokeWidth="2" />
        <rect x="30" y="36" width="4" height="16" rx="2" fill="#eef9ff" stroke="#111" strokeWidth="2" />
        <rect x="40" y="36" width="4" height="16" rx="2" fill="#eef9ff" stroke="#111" strokeWidth="2" />
      </svg>
      <span className="basket-summary-count" aria-hidden="true">
        {totalItems}
      </span>
    </a>
  );
}
