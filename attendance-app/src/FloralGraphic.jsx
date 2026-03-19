// A purely decorative SVG graphic extracted here to keep App.jsx clean
export default function FloralGraphic({ className }) {
  return (
    <svg className={className} viewBox="0 0 340 380" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* main stem */}
      <path d="M170 360 Q168 280 170 190" stroke="#c9aab0" strokeWidth="2" strokeLinecap="round"/>
      {/* left branch */}
      <path d="M170 280 Q140 265 120 240" stroke="#c9aab0" strokeWidth="1.5" strokeLinecap="round"/>
      {/* right branch */}
      <path d="M170 250 Q200 235 218 210" stroke="#c9aab0" strokeWidth="1.5" strokeLinecap="round"/>
      {/* leaves */}
      <ellipse cx="128" cy="248" rx="16" ry="10" fill="#b5c4b1" opacity="0.75" transform="rotate(-35 128 248)"/>
      <ellipse cx="215" cy="218" rx="16" ry="10" fill="#b5c4b1" opacity="0.75" transform="rotate(30 215 218)"/>
      <ellipse cx="155" cy="305" rx="13" ry="8" fill="#c3cfbf" opacity="0.6" transform="rotate(-20 155 305)"/>
      <ellipse cx="186" cy="295" rx="12" ry="7" fill="#c3cfbf" opacity="0.6" transform="rotate(15 186 295)"/>
      {/* flower petals (main) */}
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85"/>
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85" transform="rotate(45 170 178)"/>
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85" transform="rotate(90 170 178)"/>
      <ellipse cx="170" cy="155" rx="14" ry="22" fill="#e8b4b8" opacity="0.85" transform="rotate(135 170 178)"/>
      {/* flower center */}
      <circle cx="170" cy="178" r="14" fill="#f5e6e8"/>
      <circle cx="170" cy="178" r="9" fill="#d4a5b0"/>
      <circle cx="170" cy="178" r="5" fill="#c9768e"/>
      {/* small flower top-right */}
      <ellipse cx="248" cy="110" rx="8" ry="13" fill="#e8b4b8" opacity="0.65"/>
      <ellipse cx="248" cy="110" rx="8" ry="13" fill="#e8b4b8" opacity="0.65" transform="rotate(60 248 122)"/>
      <ellipse cx="248" cy="110" rx="8" ry="13" fill="#e8b4b8" opacity="0.65" transform="rotate(120 248 122)"/>
      <circle cx="248" cy="122" r="8" fill="#f5e6e8"/>
      <circle cx="248" cy="122" r="5" fill="#d4a5b0"/>
      {/* small flower left */}
      <ellipse cx="95" cy="170" rx="7" ry="11" fill="#e8c8c0" opacity="0.65"/>
      <ellipse cx="95" cy="170" rx="7" ry="11" fill="#e8c8c0" opacity="0.65" transform="rotate(60 95 180)"/>
      <ellipse cx="95" cy="170" rx="7" ry="11" fill="#e8c8c0" opacity="0.65" transform="rotate(120 95 180)"/>
      <circle cx="95" cy="180" r="7" fill="#f5e6e8"/>
      <circle cx="95" cy="180" r="4" fill="#d4b5b0"/>
      {/* scattered dots */}
      <circle cx="220" cy="330" r="4" fill="#e8b4b8" opacity="0.45"/>
      <circle cx="110" cy="340" r="3" fill="#d4a5b0" opacity="0.4"/>
      <circle cx="260" cy="280" r="3" fill="#b5c4b1" opacity="0.5"/>
      <circle cx="80" cy="300" r="5" fill="#e8b4b8" opacity="0.35"/>
      <circle cx="290" cy="200" r="3" fill="#e8c8c0" opacity="0.4"/>
    </svg>
  );
}
