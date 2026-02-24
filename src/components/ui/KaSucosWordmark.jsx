export function KaSucosWordmark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 520 170"
      role="img"
      aria-label="KaSucos"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="kaFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd447" />
          <stop offset="34%" stopColor="#ff8d27" />
          <stop offset="56%" stopColor="#b8f41f" />
          <stop offset="100%" stopColor="#6fd61b" />
        </linearGradient>
      </defs>
      <text
        x="18"
        y="122"
        fontFamily="'Baloo 2', 'Cooper Black', 'Arial Black', sans-serif"
        fontSize="112"
        fontWeight="900"
        letterSpacing="0.5"
        fill="url(#kaFill)"
        stroke="#ffffff"
        strokeWidth="16"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        KaSucos
      </text>
      <text
        x="18"
        y="122"
        fontFamily="'Baloo 2', 'Cooper Black', 'Arial Black', sans-serif"
        fontSize="112"
        fontWeight="900"
        letterSpacing="0.5"
        fill="url(#kaFill)"
        stroke="#6a2bd4"
        strokeWidth="11"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        KaSucos
      </text>
    </svg>
  );
}
