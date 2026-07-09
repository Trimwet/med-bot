import React from 'react'

export const HealthBot = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 320 380"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Illustration of MedBot, a friendly robot mascot wearing a white doctor's coat"
  >
    <style>{`
      @keyframes blink {
        0%, 90%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.1); }
      }
      @keyframes antennaPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .bot-eyes { animation: blink 4s ease-in-out infinite; transform-origin: center 98px; will-change: transform; }
      .bot-antenna { animation: antennaPulse 2s ease-in-out infinite; will-change: opacity; }
      .bot-body { animation: float 3s ease-in-out infinite; will-change: transform; }
    `}</style>

    <g className="bot-body">
      {/* Shadow */}
      <ellipse cx="160" cy="362" rx="92" ry="14" fill="#1B2160" opacity="0.08" />

      {/* Antenna */}
      <line x1="160" y1="40" x2="160" y2="18" stroke="#1B2160" strokeWidth="4" strokeLinecap="round" />
      <circle cx="160" cy="14" r="7" fill="#00A8A8" className="bot-antenna" />

      {/* Coat body */}
      <rect x="140" y="158" width="40" height="30" rx="8" fill="#1B2160" />

      {/* Arms */}
      <g transform="rotate(-10 78 210)">
        <rect x="60" y="185" width="34" height="108" rx="17" fill="#1B2160" />
      </g>
      <g transform="rotate(10 242 210)">
        <rect x="226" y="185" width="34" height="108" rx="17" fill="#1B2160" />
      </g>

      {/* Hands */}
      <circle cx="77" cy="298" r="16" fill="#fff" stroke="#1B2160" strokeWidth="3" />
      <circle cx="243" cy="298" r="16" fill="#fff" stroke="#1B2160" strokeWidth="3" />

      {/* Doctor coat */}
      <rect x="88" y="172" width="144" height="170" rx="32" fill="#fff" stroke="#1B2160" strokeWidth="3" />

      {/* Coat collar */}
      <path d="M132 172 L160 210 L188 172 Z" fill="#fff" stroke="#1B2160" strokeWidth="3" strokeLinejoin="round" />
      <rect x="147" y="176" width="26" height="34" rx="6" fill="#1B2160" />

      {/* Coat buttons */}
      <circle cx="160" cy="255" r="6" fill="#1B2160" />
      <circle cx="160" cy="278" r="6" fill="#1B2160" />

      {/* Stethoscope cross */}
      <rect x="141" y="222" width="38" height="38" rx="8" fill="#fff" stroke="#1B2160" strokeWidth="2.5" />
      <rect x="156" y="230" width="8" height="22" rx="2" fill="#00A8A8" />
      <rect x="149" y="237" width="22" height="8" rx="2" fill="#00A8A8" />

      {/* Head */}
      <rect x="92" y="40" width="136" height="122" rx="30" fill="#1B2160" />
      <rect x="108" y="58" width="104" height="82" rx="20" fill="#fff" />

      {/* Eyes */}
      <g className="bot-eyes">
        <rect x="130" y="86" width="18" height="24" rx="7" fill="#1B2160" />
        <rect x="176" y="86" width="18" height="24" rx="7" fill="#1B2160" />
      </g>

      {/* Smile */}
      <path d="M140 122 Q160 138 180 122" fill="none" stroke="#1B2160" strokeWidth="4" strokeLinecap="round" />
    </g>
  </svg>
)
