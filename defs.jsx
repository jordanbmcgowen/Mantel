// defs.jsx — Reusable SVG filters and patterns used across the artist lenses.
// Mount <MantelDefs/> once at the App root; lenses reference filters by id.

function MantelDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true"
         style={{position: "absolute", left: -9999, top: -9999, pointerEvents: "none"}}>
      <defs>
        {/* Wobbly scissored edge — Matisse cutouts */}
        <filter id="mt-paper-cut" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="4" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="5.5"/>
        </filter>

        {/* Slight brush wobble — Picasso, Hockney */}
        <filter id="mt-brush" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2"/>
        </filter>

        {/* Heavier brush / oil paint — Picasso */}
        <filter id="mt-oil" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="2" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="3.5"/>
        </filter>

        {/* Watercolor bleed — Klee */}
        <filter id="mt-watercolor" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="0.4" result="blur"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" seed="9" result="t"/>
          <feDisplacementMap in="blur" in2="t" scale="1.8"/>
        </filter>

        {/* Wax crayon — Basquiat */}
        <filter id="mt-crayon" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="5" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="1.5"/>
        </filter>

        {/* Tiny ink wobble — gentle hand-drawn feel for any drawing */}
        <filter id="mt-ink" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="t"/>
          <feDisplacementMap in="SourceGraphic" in2="t" scale="0.8"/>
        </filter>

        {/* Canvas weave texture — sample below to overlay */}
        <pattern id="mt-canvas" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="transparent"/>
          <path d="M0 3 H6 M3 0 V6" stroke="rgba(0,0,0,0.05)" strokeWidth="0.4"/>
        </pattern>

        {/* Halftone dots — Warhol */}
        <pattern id="mt-halftone" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.4" fill="rgba(0,0,0,0.55)"/>
        </pattern>

        {/* Paper noise for kraft / parchment */}
        <filter id="mt-paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" stitchTiles="stitch"/>
          <feColorMatrix values="0 0 0 0 0.18   0 0 0 0 0.10   0 0 0 0 0.04   0 0 0 0.22 0"/>
        </filter>

        {/* Soft glow — Rothko edges */}
        <filter id="mt-soft-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="8"/>
        </filter>

        {/* Strong blur for Rothko bands */}
        <filter id="mt-band-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3"/>
        </filter>

        {/* Vector grid for Pure */}
        <pattern id="mt-vector-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 L 0 0 L 0 20" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.6"/>
        </pattern>
        <pattern id="mt-vector-dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="0.8" fill="rgba(0,0,0,0.18)"/>
        </pattern>

        {/* Pool ripples — Hockney */}
        <pattern id="mt-ripples" x="0" y="0" width="30" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
          <path d="M0 7 q 4 -4 8 0 t 8 0 t 8 0" stroke="rgba(255,255,255,0.85)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </pattern>
      </defs>
    </svg>
  );
}

Object.assign(window, { MantelDefs });
