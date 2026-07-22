/**
 * The executive desk — the warm foreground of the cover, full-bleed along the
 * bottom of the dark research room. A large desk in the near foreground, two
 * anglepoise lamps that motivate all the light, and the tall back of an
 * executive chair centred in front of the desk (seen only from behind — the
 * figure at the desk is never the focal point). Impressionistic: dark masses
 * read by their lamp-lit edges, so it stays photographic rather than clipart.
 *
 * Pure SVG (no hooks); scales with viewport width, sits at the bottom of the
 * section. The warm light pools + blooms are layered in CSS behind it.
 */

function Lamp({ x, flip }: { x: number; flip?: boolean }) {
  // an anglepoise; `flip` mirrors it so the right lamp leans the other way
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} 0) scale(${s} 1)`}>
      {/* base */}
      <ellipse cx="0" cy="322" rx="52" ry="12" fill="#0b0806" />
      <ellipse cx="0" cy="318" rx="38" ry="8" fill="#17100a" />
      <rect x="-8" y="300" width="16" height="18" rx="3" fill="#120c08" />
      {/* lower arm */}
      <line x1="0" y1="304" x2="60" y2="150" stroke="#0d0906" strokeWidth="8" strokeLinecap="round" />
      <line x1="0" y1="304" x2="60" y2="150" stroke="#6b5230" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      <circle cx="60" cy="150" r="7" fill="#17100a" stroke="#3a2917" strokeWidth="1.4" />
      {/* upper arm — with a specular streak down the lit side */}
      <line x1="60" y1="150" x2="22" y2="70" stroke="#0d0906" strokeWidth="8" strokeLinecap="round" />
      <line x1="60" y1="150" x2="22" y2="70" stroke="#8a6a3c" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      <line x1="2" y1="304" x2="61" y2="150" stroke="#c99a5a" strokeWidth="0.9" strokeLinecap="round" opacity="0.4" />
      {/* shade — tilted down toward the desk */}
      <g transform="rotate(40 22 70)">
        <path d="M-2 44 L48 44 L36 100 L10 100 Z" fill="#0e0a06" />
        <path d="M-2 44 L48 44 L44 54 L2 54 Z" fill="#2a1c11" />
        {/* hot crescent rim on the shade's inner lip */}
        <path d="M11 99 Q23 104 35 99" stroke="#ffe6b0" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.85" />
        {/* directional throw cone from the mouth of the shade */}
        <path d="M14 100 L50 176 L-4 176 Z" fill="#f6d79a" opacity="0.16" filter="url(#hd-bloom)" className="hero-bulb-bloom" />
        {/* blown-out bulb core */}
        <ellipse cx="23" cy="99" rx="11" ry="4" fill="#fff6e2" className="hero-bulb" />
        <circle cx="23" cy="99" r="3.4" fill="#ffffff" className="hero-bulb" />
        <ellipse cx="23" cy="99" rx="20" ry="9" fill="#ffe6b0" opacity="0.6" filter="url(#hd-bloom)" className="hero-bulb-bloom" />
      </g>
    </g>
  );
}

export function HeroDesk() {
  return (
    <div className="hero-desk" aria-hidden="true">
      <svg
        className="hero-desk-svg"
        viewBox="0 0 1512 440"
        fill="none"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          {/* polished walnut — warm reddish-brown catching the lamp at the back
             edge, deepening to near-black at the front lip */}
          <linearGradient id="hd-wood" x1="0" y1="0" x2="0.15" y2="1">
            <stop offset="0" stopColor="#4a3018" />
            <stop offset="0.22" stopColor="#301c0e" />
            <stop offset="0.55" stopColor="#180d06" />
            <stop offset="1" stopColor="#070402" />
          </linearGradient>
          {/* warm specular reflection of a lamp on the polished desk */}
          <radialGradient id="hd-reflect" cx="0.5" cy="0" r="0.9">
            <stop offset="0" stopColor="#f6c47e" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#c88a44" stopOpacity="0.12" />
            <stop offset="1" stopColor="#c88a44" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hd-chair" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a2c22" />
            <stop offset="0.4" stopColor="#140f0b" />
            <stop offset="0.7" stopColor="#0a0706" />
            <stop offset="1" stopColor="#060403" />
          </linearGradient>
          <filter id="hd-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="hd-bloom" x="-160%" y="-160%" width="420%" height="420%">
            <feGaussianBlur stdDeviation="13" />
          </filter>
        </defs>

        {/* ---- desk surface, receding slightly (near-foreground) ---- */}
        <rect x="0" y="196" width="1512" height="150" fill="url(#hd-wood)" />
        <rect x="0" y="196" width="1512" height="2.5" fill="#8a6338" opacity="0.6" />
        <rect x="0" y="199" width="1512" height="12" fill="#3a2917" opacity="0.42" />
        {/* soft warm reflections of the two lamps on the polished surface */}
        <ellipse cx="560" cy="214" rx="150" ry="120" fill="url(#hd-reflect)" opacity="0.8" />
        <ellipse cx="1236" cy="214" rx="130" ry="112" fill="url(#hd-reflect)" opacity="0.7" />
        {/* faint long grain catching the light */}
        <g stroke="#5c4225" strokeWidth="1" opacity="0.12">
          <line x1="0" y1="234" x2="1512" y2="238" />
          <line x1="0" y1="262" x2="1512" y2="268" />
          <line x1="0" y1="292" x2="1512" y2="300" />
        </g>
        {/* the desk front apron drops into shadow */}
        <rect x="0" y="346" width="1512" height="94" fill="#070403" />

        {/* ---- open notebook + pen (left of centre, under the left lamp) ---- */}
        <g transform="translate(566 236)">
          <path d="M0 92 L16 40 L188 40 L204 92 Z" fill="#0b0806" opacity="0.7" />
          <path d="M18 44 L188 44 L198 74 L102 70 Z" fill="#181009" />
          <path d="M102 70 L8 74 L18 44 L102 44 Z" fill="#1d140b" />
          <line x1="102" y1="44" x2="102" y2="72" stroke="#070504" strokeWidth="2" />
          <path d="M30 53 L96 52 M28 61 L98 60 M26 68 L100 67" stroke="#7a6238" strokeWidth="1" opacity="0.3" />
          <path d="M110 52 L176 53 M110 60 L180 61 M110 67 L182 68" stroke="#7a6238" strokeWidth="1" opacity="0.26" />
          <line x1="120" y1="64" x2="188" y2="48" stroke="#0a0705" strokeWidth="5" strokeLinecap="round" />
          <line x1="120" y1="64" x2="188" y2="48" stroke="#5c4529" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
          <circle cx="188" cy="48" r="3" fill="#8a6636" opacity="0.7" />
        </g>

        {/* ---- coffee cup + steam ---- */}
        <g transform="translate(792 214)">
          <path d="M0 34 L4 84 Q6 96 18 96 L52 96 Q64 96 66 84 L70 34 Z" fill="#140d08" />
          <path d="M0 34 L70 34 L69 42 L1 42 Z" fill="#2c2013" />
          <ellipse cx="35" cy="34" rx="35" ry="8" fill="#0c0805" />
          <ellipse cx="35" cy="34" rx="35" ry="8" stroke="#6b4e2c" strokeWidth="1.4" opacity="0.5" />
          <path d="M70 44 Q92 46 90 66 Q88 82 68 80" stroke="#241811" strokeWidth="7" fill="none" />
          <path className="hero-steam hero-steam--a" d="M26 26 C 20 12, 34 6, 28 -10" stroke="#c9b48f" strokeWidth="2" opacity="0.14" strokeLinecap="round" />
          <path className="hero-steam hero-steam--b" d="M44 26 C 50 10, 36 4, 44 -14" stroke="#c9b48f" strokeWidth="2" opacity="0.12" strokeLinecap="round" />
        </g>

        {/* ---- a single closed journal, left of the chair (clears the card) ---- */}
        <g transform="translate(360 176)">
          <rect x="0" y="18" width="150" height="22" rx="3" fill="#241811" transform="rotate(-2)" />
          <rect x="0" y="18" width="150" height="3" rx="2" fill="#6b4e2c" opacity="0.4" transform="rotate(-2)" />
        </g>

        {/* ---- pen cup (far right) ---- */}
        <g transform="translate(1330 156)">
          <path d="M0 30 L4 90 Q5 98 14 98 L40 98 Q49 98 50 90 L54 30 Z" fill="#120c07" />
          <ellipse cx="27" cy="30" rx="27" ry="6" fill="#0a0705" stroke="#5c4529" strokeWidth="1.1" opacity="0.7" />
          <line x1="18" y1="30" x2="11" y2="-14" stroke="#241811" strokeWidth="4" strokeLinecap="round" />
          <line x1="31" y1="30" x2="37" y2="-18" stroke="#2c2013" strokeWidth="4" strokeLinecap="round" />
          <line x1="27" y1="30" x2="27" y2="-8" stroke="#1c140b" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* ---- the executive chair, centred in front of the desk (seen from
             behind — a high leather back with a headrest, lit on the lamp side) ---- */}
        <g className="hero-chair">
          {/* the back — headrest + shoulders + a slight lumbar waist */}
          <path
            d="M840 440
               L834 244
               Q830 206 856 202
               L860 162
               Q862 104 908 104
               Q954 104 956 162
               L960 202
               Q986 206 982 244
               L976 440 Z"
            fill="url(#hd-chair)"
          />
          {/* broad warm sheen on the lit (left) cheek of the backrest */}
          <path d="M846 440 L842 244 Q840 208 862 204 L866 164 Q868 118 902 110"
            stroke="#a07a44" strokeWidth="6" strokeLinecap="round" opacity="0.28" filter="url(#hd-soft)" />
          <path d="M852 430 L848 246 Q846 212 864 208 L868 168 Q870 126 900 118"
            stroke="#c99a5a" strokeWidth="2" strokeLinecap="round" opacity="0.42" filter="url(#hd-soft)" />
          {/* top rim light along the headrest crown */}
          <path d="M880 108 Q908 100 936 110" stroke="#c99a5a" strokeWidth="2.4" strokeLinecap="round" opacity="0.4" filter="url(#hd-soft)" />
          {/* centre seam + tufting */}
          <line x1="908" y1="150" x2="908" y2="430" stroke="#040302" strokeWidth="2.5" opacity="0.85" />
          <path d="M862 214 Q908 206 954 214 M858 284 Q908 276 958 284 M856 354 Q908 346 960 354"
            stroke="#040302" strokeWidth="1.6" opacity="0.7" fill="none" />
          {/* tuft highlights catching the lamp */}
          <path d="M864 208 Q888 203 906 206 M860 278 Q884 273 906 276 M858 348 Q884 343 906 346"
            stroke="#6a4f2c" strokeWidth="1.3" opacity="0.5" fill="none" />
          {/* headrest highlight */}
          <ellipse cx="896" cy="138" rx="30" ry="17" fill="#3d2e20" opacity="0.7" />
          {/* armrest hints at the base */}
          <path d="M820 440 L826 372 Q828 356 848 356 L848 440 Z" fill="#0e0a07" />
          <path d="M992 440 L986 372 Q984 356 966 356 L966 440 Z" fill="#080605" />
        </g>

        {/* ---- the two lamps (drawn last so their glow reads over the desk) ---- */}
        <Lamp x={556} />
        <Lamp x={1236} flip />
      </svg>
    </div>
  );
}
