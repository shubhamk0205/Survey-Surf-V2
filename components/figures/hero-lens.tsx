/**
 * The precision optical element at the heart of FIG. A — refined until it reads
 * as *glass, not an object*. A large coated element fills the face inside a
 * hairline anodized rim; there is almost no barrel and only one seating line
 * (rings kept to the absolute minimum). The glass is luminous deep optical black
 * with a blue-green AR coating, a faint purple edge, one bright vertical window
 * reflection, one soft horizontal one, and a few faint internal element ghosts —
 * so it behaves like an instrument catching and measuring light rather than a
 * camera lens. Held by a single minimal clamp; the stand is gone.
 *
 * Pure presentational SVG. Focus-breathe + coating drift live in CSS on `.hs-lens`.
 */
export function HeroLens() {
  return (
    <div className="hs-lens" aria-hidden="true">
      <svg
        className="hs-lens-svg"
        viewBox="0 0 300 372"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          {/* dark anodized aluminium — a hairline rim, one bright CNC bevel */}
          <linearGradient id="hs-alu" x1="0.1" y1="0.04" x2="0.9" y2="0.96">
            <stop offset="0" stopColor="#2b2d32" />
            <stop offset="0.12" stopColor="#54575f" />
            <stop offset="0.28" stopColor="#141519" />
            <stop offset="0.58" stopColor="#08090b" />
            <stop offset="0.84" stopColor="#232529" />
            <stop offset="1" stopColor="#0a0b0d" />
          </linearGradient>
          {/* luminous deep optical glass — visibly glass, not a black hole */}
          <radialGradient id="hs-optic" cx="0.44" cy="0.36" r="0.94">
            <stop offset="0" stopColor="#14283a" />
            <stop offset="0.45" stopColor="#0c1b28" />
            <stop offset="0.82" stopColor="#0a141d" />
            <stop offset="1" stopColor="#050b12" />
          </radialGradient>
          {/* anti-reflective coating — blue-green sheen, purple at the edge */}
          <radialGradient id="hs-ar" cx="0.46" cy="0.4" r="0.56">
            <stop offset="0" stopColor="#106a5c" stopOpacity="0" />
            <stop offset="0.48" stopColor="#106a5c" stopOpacity="0" />
            <stop offset="0.72" stopColor="#178a72" stopOpacity="0.24" />
            <stop offset="0.9" stopColor="#155a7c" stopOpacity="0.2" />
            <stop offset="0.98" stopColor="#4a2c68" stopOpacity="0.3" />
            <stop offset="1" stopColor="#4a2c68" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hs-concave" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.74" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="hs-vref" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dfe9ff" stopOpacity="0" />
            <stop offset="0.28" stopColor="#f2f6ff" stopOpacity="0.9" />
            <stop offset="0.62" stopColor="#cdd9f2" stopOpacity="0.5" />
            <stop offset="1" stopColor="#cdd9f2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hs-href" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#cfe0f0" stopOpacity="0" />
            <stop offset="0.5" stopColor="#cfe0f0" stopOpacity="0.42" />
            <stop offset="1" stopColor="#cfe0f0" stopOpacity="0" />
          </linearGradient>
          <filter id="hs-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="hs-soft2" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <g transform="rotate(-5 150 186)">
          {/* the last sliver of barrel — a hair of depth, no machining */}
          <ellipse cx="164" cy="190" rx="121" ry="164" fill="#0a0b0e" />

          {/* the hairline front rim (dark anodized) */}
          <ellipse cx="146" cy="186" rx="121" ry="164" fill="none" stroke="url(#hs-alu)" strokeWidth="6" />
          {/* one bright CNC micro-bevel, top-left only */}
          <path d="M74 96 Q 100 56 152 40" stroke="#9296a0" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
          {/* the single hairline that seats the glass */}
          <ellipse cx="146" cy="186" rx="116" ry="157" fill="none" stroke="#040507" strokeWidth="2.5" />

          {/* the dominant glass element */}
          <ellipse cx="146" cy="186" rx="115" ry="156" fill="url(#hs-optic)" />
          <ellipse className="hs-lens-coat" cx="146" cy="186" rx="115" ry="156" fill="url(#hs-ar)" />
          <ellipse cx="146" cy="186" rx="115" ry="156" fill="url(#hs-concave)" />

          {/* faint internal element ghosts along the optical axis */}
          <g opacity="0.5">
            <ellipse cx="150" cy="192" rx="60" ry="86" fill="none" stroke="#1a7a68" strokeWidth="1" opacity="0.16" />
            <ellipse cx="168" cy="212" rx="18" ry="26" fill="#178a72" opacity="0.07" />
            <ellipse cx="130" cy="164" rx="9" ry="13" fill="#5a76c0" opacity="0.1" />
          </g>

          {/* one soft horizontal reflection (desk lamp / city) */}
          <ellipse cx="150" cy="252" rx="88" ry="15" fill="url(#hs-href)" opacity="0.4" filter="url(#hs-soft)" />
          {/* one bright vertical reflection (the window), crisp, left of centre */}
          <g className="hs-lens-glint">
            <rect x="110" y="66" width="10" height="236" rx="5" fill="url(#hs-vref)" filter="url(#hs-soft)" />
            <rect x="113" y="82" width="3.4" height="204" rx="1.7" fill="#f6f9ff" opacity="0.92" />
          </g>
          {/* warm bounce from the desk lamp, lower-right */}
          <ellipse cx="198" cy="256" rx="16" ry="30" fill="#c8934a" opacity="0.15" filter="url(#hs-soft2)" />

          {/* deep inner shadow seating the glass into the rim */}
          <ellipse cx="146" cy="186" rx="115" ry="156" fill="none" stroke="#000" strokeWidth="4" opacity="0.42" />

          {/* two hairline set-screws (12 + 6 o'clock), very subtle */}
          <g opacity="0.7">
            <circle cx="146" cy="26" r="2.8" fill="#0a0b0d" stroke="#3c4046" strokeWidth="0.9" />
            <circle cx="146" cy="346" r="2.8" fill="#0a0b0d" stroke="#3c4046" strokeWidth="0.9" />
          </g>
        </g>
      </svg>
    </div>
  );
}
