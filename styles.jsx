// styles.jsx
// Ten artist-inspired "lenses" — each transforms a child's drawing into a
// preview that evokes a master artist via palette, scene, texture, and overlay.

// ─── Style metadata ──────────────────────────────────────────────────────────

const STYLES = [
  { id: "pure",     name: "Pure",          artist: "As they drew it",       label: "STUDIO ORIGINAL",
    blurb: "Cleanly vectorized — every wobble and crayon mark preserved, the paper, shadows, and creases dissolved. Scales infinitely without losing a hair of personality.",
    pull:  "The original, just lifted off the paper." },
  { id: "matisse",  name: "Cutout",        artist: "Henri Matisse",         label: "CUTOUT",
    blurb: "Reinterpreted with scissors and gouache — flat shapes torn from colored paper in the vermillions, kelly greens, and cobalts Matisse cut from his bed in the South of France.",
    pull:  "Drawing with scissors." },
  { id: "picasso",  name: "Blue Period",   artist: "Pablo Picasso",         label: "MONOCHROME",
    blurb: "Rebuilt in a single melancholic blue — the weight Picasso reserved for the absinthe drinkers, the harlequins, the friends he'd lost in 1903.",
    pull:  "Everything in one note of blue." },
  { id: "mondrian", name: "Composition",   artist: "Piet Mondrian",         label: "DE STIJL",
    blurb: "Reduced to its primary forces — red, blue, yellow, ruled in heavy black, suspended on white. De Stijl applied to your kid like a Mondrian retrospective.",
    pull:  "Red, yellow, blue, and nothing else." },
  { id: "haring",   name: "Pop Figures",   artist: "Keith Haring",          label: "POP GRAPHIC",
    blurb: "Bold black outlines, radiating energy lines, and flat electric color — the subway-drawing language Haring used to make pure joy legible from across a room.",
    pull:  "Lines that vibrate with life." },
  { id: "hockney",  name: "Pool",          artist: "David Hockney",         label: "POP CALIFORNIA",
    blurb: "Sunlit, flat, and pop — pool ripples in chlorine turquoise, a hot pink that only exists in Los Angeles, a sky bleached to the edge of cyan.",
    pull:  "A bigger splash." },
  { id: "basquiat", name: "Crown",         artist: "Jean-Michel Basquiat",  label: "NEO-EXPRESSIONIST",
    blurb: "On butcher paper, in wax crayon — three-pointed crowns, copyright marks, words slashed and re-spelled. The child as untrained genius.",
    pull:  "The kid as untrained genius." },
  { id: "miro",     name: "Constellation", artist: "Joan Miró",             label: "BIOMORPHIC",
    blurb: "Dissolved into the dream-language — black thread connecting stars, eyes, amoebas, the moon. The drawing barely there, the air around it doing the heavy lifting.",
    pull:  "Floating in the dream-language." },
  { id: "warhol",   name: "Quad",          artist: "Andy Warhol",           label: "POP MULTIPLE",
    blurb: "Four screen prints, four palettes, registration deliberately wrong by a quarter inch. The same drawing four times — celebrity treatment for the fridge.",
    pull:  "Same drawing, four times louder." },
  { id: "klee",     name: "Mosaic",        artist: "Paul Klee",             label: "MOSAIC",
    blurb: "A field of irregular pastel cells, each washed in watercolor — with the drawing inked in a single thin line over the top. Klee's mosaic technique, transposed.",
    pull:  "A line, taken for a walk." },
];

// ─── Palette overrides per (style, drawing) ──────────────────────────────────

const PALETTES = {
  pure: null,

  matisse: {
    house:  { sun:"#F2A93B", grass:"#3F8A4D", tree:"#1E5E3F", trunk:"#2E2E2E",
              house:"#E14B2E", roof:"#2A4FB2", door:"#2E2E2E", win:"#F2A93B",
              person1:"#2A4FB2", person2:"#F2A93B", cloud:"#FFFFFF", heart:"#E14B2E" },
    dino:   { sun:"#F2A93B", dino:"#3F8A4D", belly:"#C1D88B", spikes:"#1E5E3F",
              eye:"#FFFFFF", pupil:"#2A2A2A", plant:"#1E5E3F", ground:"#E14B2E", smile:"#E14B2E" },
    garden: { flower1:"#E14B2E", flower2:"#F2A93B", flower3:"#2A4FB2",
              center:"#F2A93B", stem:"#1E5E3F", leaf:"#3F8A4D", pot:"#E14B2E",
              butterfly:"#2A4FB2", ground:"#F2A93B", heart:"#E14B2E" }
  },

  picasso: {
    house:  { sun:"#A8C5E8", grass:"#0F1E3D", tree:"#152C56", trunk:"#0E1A30",
              house:"#3F6BA5", roof:"#0E1A30", door:"#0E1A30", win:"#7FAFD8",
              person1:"#A8C5E8", person2:"#7FAFD8", cloud:"#5380B8", heart:"#A8C5E8" },
    dino:   { sun:"#A8C5E8", dino:"#3F6BA5", belly:"#7FAFD8", spikes:"#0F1E3D",
              eye:"#A8C5E8", pupil:"#0E1A30", plant:"#0F1E3D", ground:"#152C56", smile:"#A8C5E8" },
    garden: { flower1:"#7FAFD8", flower2:"#A8C5E8", flower3:"#3F6BA5",
              center:"#A8C5E8", stem:"#152C56", leaf:"#0F1E3D", pot:"#3F6BA5",
              butterfly:"#A8C5E8", ground:"#152C56", heart:"#A8C5E8" }
  },

  mondrian: {
    house:  { sun:"#F4C40D", grass:"#F4F0E8", tree:"#1B4FBF", trunk:"#0E0E0D",
              house:"#D62828", roof:"#0E0E0D", door:"#0E0E0D", win:"#F4C40D",
              person1:"#1B4FBF", person2:"#D62828", cloud:"#F4F0E8", heart:"#D62828" },
    dino:   { sun:"#F4C40D", dino:"#1B4FBF", belly:"#F4F0E8", spikes:"#0E0E0D",
              eye:"#F4F0E8", pupil:"#0E0E0D", plant:"#0E0E0D", ground:"#D62828", smile:"#D62828" },
    garden: { flower1:"#D62828", flower2:"#F4C40D", flower3:"#1B4FBF",
              center:"#F4C40D", stem:"#0E0E0D", leaf:"#0E0E0D", pot:"#D62828",
              butterfly:"#1B4FBF", ground:"#F4C40D", heart:"#D62828" }
  },

  hockney: {
    house:  { sun:"#FFD23F", grass:"#3CB7B3", tree:"#0E7C6F", trunk:"#4A2C2A",
              house:"#FF6B6B", roof:"#FF8AB3", door:"#0E7C6F", win:"#FFD23F",
              person1:"#FFD23F", person2:"#FF6B6B", cloud:"#FFFFFF", heart:"#FF6B6B" },
    dino:   { sun:"#FF6B6B", dino:"#3CB7B3", belly:"#A8E6E0", spikes:"#0E7C6F",
              eye:"#FFFFFF", pupil:"#1a1815", plant:"#0E7C6F", ground:"#FFD23F", smile:"#FF6B6B" },
    garden: { flower1:"#FF6B6B", flower2:"#FFD23F", flower3:"#3CB7B3",
              center:"#FFD23F", stem:"#0E7C6F", leaf:"#3CB7B3", pot:"#FF6B6B",
              butterfly:"#FFD23F", ground:"#FFD23F", heart:"#FF6B6B" }
  },

  basquiat: {
    house:  { sun:"#F4C40D", grass:"#2E7A3F", tree:"#1E5630", trunk:"#3A1A0A",
              house:"#C72A1C", roof:"#1A0E08", door:"#1A0E08", win:"#F4C40D",
              person1:"#F4C40D", person2:"#C72A1C", cloud:"#FFFFFF", heart:"#C72A1C" },
    dino:   { sun:"#F4C40D", dino:"#2E7A3F", belly:"#A8C570", spikes:"#1E5630",
              eye:"#FFFFFF", pupil:"#1A0E08", plant:"#1E5630", ground:"#C72A1C", smile:"#C72A1C" },
    garden: { flower1:"#C72A1C", flower2:"#F4C40D", flower3:"#1B4FBF",
              center:"#F4C40D", stem:"#1E5630", leaf:"#2E7A3F", pot:"#C72A1C",
              butterfly:"#1B4FBF", ground:"#F4C40D", heart:"#C72A1C" }
  },

  haring: {
    house:  { sun:"#F5C518", grass:"#12A150", tree:"#0E7A3C", trunk:"#111111",
              house:"#E6352B", roof:"#111111", door:"#111111", win:"#1B6FD6",
              person1:"#1B6FD6", person2:"#E6352B", cloud:"#FFFFFF", heart:"#E6352B" },
    dino:   { sun:"#F5C518", dino:"#12A150", belly:"#8FD06A", spikes:"#0E7A3C",
              eye:"#FFFFFF", pupil:"#111111", plant:"#0E7A3C", ground:"#E6352B", smile:"#E6352B" },
    garden: { flower1:"#E6352B", flower2:"#1B6FD6", flower3:"#12A150",
              center:"#F5C518", stem:"#12A150", leaf:"#0E7A3C", pot:"#E6352B",
              butterfly:"#1B6FD6", ground:"#12A150", heart:"#E6352B" }
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDrawingComponent(drawing) {
  return DRAWINGS[drawing]?.component || HouseDrawing;
}

function noSky(drawing) {
  return { ...defaultsFor(drawing), sky: null, bg: null };
}

function defaultsFor(drawing) {
  if (drawing === "house")  return { sky:"#F4F0E8", sun:"#F4C53A", grass:"#7FB069", tree:"#3D7A48", trunk:"#7A4E2E", house:"#C7593D", roof:"#3A2F26", door:"#3A2F26", win:"#9CC7DB", person1:"#F4C53A", person2:"#C7593D", cloud:"#F5EFE3", heart:"#D8456E" };
  if (drawing === "dino")   return { sky:"#F2E7D2", sun:"#E89A3C", dino:"#6FA86A", belly:"#B7D69A", spikes:"#3F6B3D", eye:"#FFFFFF", pupil:"#1a1815", plant:"#3F6B3D", ground:"#B59765", smile:"#E64A3F" };
  if (drawing === "garden") return { sky:"#F4DCE3", flower1:"#E64A6F", flower2:"#F4C53A", flower3:"#8B5FBF", center:"#F4C53A", stem:"#5E8E3E", leaf:"#7FB069", pot:"#C7593D", butterfly:"#5B8FD8", ground:"#B59765", heart:"#D8456E" };
  return {};
}

// Strip the background-coloring slots so a parent lens shows through.
function paletteOver(drawing, overrides) {
  return { ...defaultsFor(drawing), sky: null, bg: null, ...overrides };
}

// ─── Pure ────────────────────────────────────────────────────────────────────
function StylePure({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-pure">
      {/* vector dot-grid backdrop */}
      <svg className="lens-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect width="100" height="100" fill="url(#mt-vector-dots)"/>
      </svg>
      {/* crop / registration marks */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke="rgba(0,0,0,0.35)" strokeWidth="0.3" fill="none">
          <path d="M3 3 v 4 M3 3 h 4"/>
          <path d="M97 3 v 4 M97 3 h -4"/>
          <path d="M3 97 v -4 M3 97 h 4"/>
          <path d="M97 97 v -4 M97 97 h -4"/>
        </g>
      </svg>
      <div className="lens-inner pure-art">
        <D palette={paletteOver(drawing, { cloud: null })} lineW={4} />
      </div>
      <div className="lens-stamp lens-stamp-tl">
        <span>VECTOR · ∞ scale</span>
      </div>
      <div className="lens-stamp lens-stamp-br">
        <span>01 / 10</span>
      </div>
    </div>
  );
}

// ─── Matisse — Cutout ───────────────────────────────────────────────────────
function StyleMatisse({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-matisse">
      {/* atmospheric warm vignette */}
      <div className="matisse-warmth"/>
      {/* large biomorphic cutout shapes around the drawing */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{filter: "url(#mt-paper-cut)"}}>
        {/* large blue leaf top-left */}
        <path d="M -2 18 q 8 -16 24 -6 q 10 12 -4 22 q -14 8 -22 -2 z" fill="#2A4FB2"/>
        {/* yellow snail spiral bottom-right */}
        <g transform="translate(82 80)">
          <circle r="11" fill="#F2A93B"/>
          <circle r="7" fill="#F1ECE2"/>
          <circle r="4" fill="#F2A93B"/>
        </g>
        {/* small red coral top-right */}
        <path d="M84 4 q 6 4 4 12 q -6 4 -10 -2 q 0 -8 6 -10 z" fill="#E14B2E"/>
        {/* green dancer ribbon bottom-left */}
        <path d="M-2 86 q 14 -10 28 0 q 8 8 -4 14 q -16 4 -24 -4 z" fill="#1E5E3F"/>
      </svg>
      {/* the drawing itself, edges wobbled by the paper-cut filter, no outlines */}
      <div className="matisse-art" style={{filter: "url(#mt-paper-cut)"}}>
        <D palette={paletteOver(drawing, PALETTES.matisse[drawing])} lineW={0.0001} flat />
      </div>
      <div className="lens-signature">Henri M.</div>
    </div>
  );
}

// ─── Picasso — Blue Period + Cubist fragmentation ───────────────────────────
function StylePicasso({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-picasso">
      {/* deep blue wash */}
      <div className="picasso-wash"/>
      {/* drawing rendered in blue with oil-brush wobble */}
      <div className="picasso-art" style={{filter: "url(#mt-oil)"}}>
        <D palette={paletteOver(drawing, PALETTES.picasso[drawing])} line="#020A1A" lineW={3.5} />
      </div>
      {/* cubist fragmentation shards (subtle hue/contrast shifts) */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <clipPath id="cub-1"><polygon points="0,30 38,18 50,52 14,68"/></clipPath>
          <clipPath id="cub-2"><polygon points="55,40 100,28 100,72 60,80"/></clipPath>
          <clipPath id="cub-3"><polygon points="20,72 60,84 50,100 8,98"/></clipPath>
        </defs>
        <rect width="100" height="100" fill="rgba(255,255,255,0.06)" clipPath="url(#cub-1)"/>
        <rect width="100" height="100" fill="rgba(0,0,0,0.18)"     clipPath="url(#cub-2)"/>
        <rect width="100" height="100" fill="rgba(255,255,255,0.04)" clipPath="url(#cub-3)"/>
        {/* shard outlines */}
        <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.25" fill="none">
          <polygon points="0,30 38,18 50,52 14,68"/>
          <polygon points="55,40 100,28 100,72 60,80"/>
          <polygon points="20,72 60,84 50,100 8,98"/>
        </g>
      </svg>
      {/* canvas texture */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none" style={{mixBlendMode: "overlay", opacity: 0.5}}>
        <rect width="100" height="100" fill="url(#mt-canvas)"/>
      </svg>
      <div className="lens-signature picasso-sig">P. Picasso</div>
    </div>
  );
}

// ─── Mondrian — Composition with RYB+K ──────────────────────────────────────
function StyleMondrian({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-mondrian">
      {/* The Mondrian grid composition — solid color blocks + thick black rules */}
      <div className="mondrian-grid">
        <div className="cell red"    style={{background: "#D62828"}}/>
        <div className="cell yellow" style={{background: "#F4C40D"}}/>
        <div className="cell blue"   style={{background: "#1B4FBF"}}/>
        <div className="cell white1" />
        <div className="cell white2" />
        <div className="cell white3" />
        <div className="cell white4" />
      </div>
      {/* The drawing sits in the largest white cell */}
      <div className="mondrian-art">
        <D palette={paletteOver(drawing, PALETTES.mondrian[drawing])} line="#0E0E0D" lineW={5} flat />
      </div>
      <div className="lens-signature mondrian-sig">PM / 1929</div>
    </div>
  );
}

// ─── Haring — Pop Figures ──────────────────────────────────────────────────
function StyleHaring({ drawing }) {
  const D = getDrawingComponent(drawing);
  // Haring's signature radiating "vibration" ticks, scattered around the edges
  // so they frame the figure without crowding it.
  const marks = [[16,22],[84,20],[22,82],[80,84],[50,10],[10,52],[90,56],[38,90]];
  return (
    <div className="lens" style={{background: "#F5C518", position: "relative", overflow: "hidden"}}>
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke="#141414" strokeWidth="1.1" strokeLinecap="round" fill="none">
          {marks.map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <line x1="0" y1="-4" x2="0" y2="-8.5"/>
              <line x1="3.6" y1="-2.6" x2="6.6" y2="-5.6"/>
              <line x1="-3.6" y1="-2.6" x2="-6.6" y2="-5.6"/>
            </g>
          ))}
        </g>
      </svg>
      <div style={{position: "absolute", inset: "7%"}}>
        <D palette={paletteOver(drawing, PALETTES.haring[drawing])} line="#111" lineW={6} flat
           style={{width: "100%", height: "100%"}}/>
      </div>
      <div className="lens-signature">K. Haring</div>
    </div>
  );
}

// ─── Hockney — Pool / Splash ───────────────────────────────────────────────
function StyleHockney({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-hockney">
      {/* sky */}
      <div className="hockney-sky"/>
      {/* sun */}
      <div className="hockney-sun"/>
      {/* pool with ripple pattern */}
      <div className="hockney-pool">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" width="100%" height="100%">
          <rect width="100" height="50" fill="url(#mt-ripples)"/>
        </svg>
      </div>
      {/* deck */}
      <div className="hockney-deck"/>
      {/* palm shadow */}
      <svg className="hockney-palm" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M14 100 L 14 50 q 0 -10 -8 -12 q 14 -4 14 6 q 4 -10 14 -4 q -6 8 -14 8 q 8 -2 12 6 q -10 0 -14 -6 q 0 6 6 12 q -8 -2 -10 -6 L 14 100 Z"
              fill="#0E3A28" opacity="0.85"/>
      </svg>
      {/* the drawing pops over everything */}
      <div className="hockney-art" style={{filter: "url(#mt-brush)"}}>
        <D palette={paletteOver(drawing, PALETTES.hockney[drawing])} line="#3a1a1a" lineW={3} flat />
      </div>
      {/* splash */}
      <svg className="hockney-splash" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g fill="#FFFFFF" opacity="0.92">
          <ellipse cx="78" cy="76" rx="6" ry="2"/>
          <path d="M72 72 q 4 -6 10 -2 q 0 4 -4 4 q -6 -2 -6 -2 z"/>
          <circle cx="86" cy="68" r="1.8"/>
          <circle cx="92" cy="72" r="1"/>
          <circle cx="76" cy="66" r="1.2"/>
          <circle cx="82" cy="62" r="0.8"/>
        </g>
      </svg>
      <div className="lens-signature hockney-sig">DH '76</div>
    </div>
  );
}

// ─── Basquiat — Crown ──────────────────────────────────────────────────────
function StyleBasquiat({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-basquiat">
      {/* kraft paper / underpainting */}
      <div className="basq-paper"/>
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{mixBlendMode: "multiply", opacity: 0.5}}>
        <rect width="100" height="100" filter="url(#mt-paper-noise)"/>
      </svg>
      {/* scribbled color blocks underneath */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="2" y="20" width="38" height="22" fill="#C72A1C" opacity="0.75" transform="rotate(-2 21 31)"/>
        <rect x="58" y="44" width="32" height="18" fill="#F4C40D" opacity="0.85" transform="rotate(3 74 53)"/>
        <rect x="48" y="6"  width="22" height="14" fill="#1B4FBF" opacity="0.7"  transform="rotate(-4 59 13)"/>
      </svg>
      {/* the drawing in crayon wobble */}
      <div className="basq-art" style={{filter: "url(#mt-crayon)"}}>
        <D palette={paletteOver(drawing, PALETTES.basquiat[drawing])} line="#0E0604" lineW={5.5} />
      </div>
      {/* hand-scrawled text & marks */}
      <svg className="basq-overlay" viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{filter: "url(#mt-crayon)"}}>
        {/* crown */}
        <g transform="translate(46 4)">
          <path d="M -10 8 L -6 0 L 0 6 L 6 0 L 10 8 Z" fill="#F4C40D" stroke="#0E0604" strokeWidth="0.5" strokeLinejoin="round"/>
          <circle cx="-6" cy="0" r="0.8" fill="#0E0604"/>
          <circle cx="0"  cy="6" r="0.8" fill="#0E0604"/>
          <circle cx="6"  cy="0" r="0.8" fill="#0E0604"/>
        </g>
        {/* hand-lettered title — slashed and re-spelled */}
        <text x="4" y="14" fontFamily="'JetBrains Mono', monospace" fontSize="4" fill="#0E0604" fontWeight="700" letterSpacing="0.5">UNTITLED©</text>
        <line x1="4" y1="12.4" x2="32" y2="12.4" stroke="#0E0604" strokeWidth="0.4"/>
        <line x1="4" y1="12.8" x2="29" y2="12.8" stroke="#0E0604" strokeWidth="0.3"/>
        {/* tag */}
        <text x="62" y="14" fontFamily="'JetBrains Mono', monospace" fontSize="3" fill="#C72A1C" fontWeight="700" letterSpacing="0.4">SAMO©</text>
        {/* striked words bottom */}
        <text x="4" y="94" fontFamily="'JetBrains Mono', monospace" fontSize="3.4" fill="#0E0604" fontWeight="700" letterSpacing="0.4">HOUSE / NOT HOUSE</text>
        <line x1="4" y1="92.5" x2="22" y2="92.5" stroke="#0E0604" strokeWidth="0.4"/>
        {/* price tag */}
        <text x="78" y="94" fontFamily="'JetBrains Mono', monospace" fontSize="3.4" fill="#0E0604" fontWeight="700">$ 1976</text>
        {/* spiral scribble */}
        <g stroke="#0E0604" strokeWidth="0.5" fill="none">
          <path d="M88 28 q 4 -2 4 2 q 0 4 -4 4 q -6 0 -6 -6 q 0 -8 8 -8"/>
        </g>
        {/* asterisks */}
        <g fill="#0E0604" fontSize="4" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
          <text x="6" y="50">★</text>
          <text x="92" y="50">+</text>
        </g>
      </svg>
      <div className="lens-signature basq-sig">JMB '82</div>
    </div>
  );
}

// ─── Miró — Constellation ──────────────────────────────────────────────────
function StyleMiro({ drawing }) {
  const D = getDrawingComponent(drawing);
  return (
    <div className="lens lens-miro">
      {/* cream stained paper */}
      <div className="miro-paper"/>
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{mixBlendMode: "multiply", opacity: 0.35}}>
        <rect width="100" height="100" filter="url(#mt-paper-noise)"/>
      </svg>
      {/* biomorphic shapes orbiting the drawing */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* connecting black thread */}
        <g stroke="#0E0E0D" strokeWidth="0.4" fill="none">
          <path d="M14 18 q 16 14 30 4 q 12 -14 38 -2"/>
          <path d="M8 60 q 24 -10 36 6 q 16 18 42 4"/>
          <path d="M82 22 q -8 24 6 50"/>
        </g>
        {/* shapes */}
        <circle cx="14" cy="18" r="5"  fill="#D62828"/>
        <circle cx="14" cy="18" r="1.6" fill="#0E0E0D"/>
        <path d="M44 22 q 4 -8 10 -2 q 4 8 -4 10 q -10 0 -6 -8 z" fill="#1B4FBF"/>
        <circle cx="82" cy="22" r="3.5" fill="#0E0E0D"/>
        <path d="M8 60 q 5 -3 8 2 q 1 7 -6 7 q -8 -2 -2 -9 z" fill="#F4C40D"/>
        <path d="M88 78 q 6 -4 10 4 q 2 10 -8 8 q -10 -4 -2 -12 z" fill="#1B4FBF"/>
        {/* stars */}
        <g fill="#D62828">
          <path d="M50 8 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 l 2 -1 z"/>
          <path d="M92 56 l 0.7 1.4 l 1.4 0.7 l -1.4 0.7 l -0.7 1.4 l -0.7 -1.4 l -1.4 -0.7 l 1.4 -0.7 z"/>
        </g>
        <g fill="#0E0E0D">
          <path d="M26 86 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 l 2 -1 z"/>
          <path d="M62 8 l 0.8 1.6 l 1.6 0.8 l -1.6 0.8 l -0.8 1.6 l -0.8 -1.6 l -1.6 -0.8 l 1.6 -0.8 z"/>
        </g>
        {/* moon */}
        <path d="M76 92 a 4 4 0 1 0 -3 -7 a 6 6 0 0 1 3 7" fill="#0E0E0D"/>
      </svg>
      {/* drawing — only the line, no fills */}
      <div className="miro-art" style={{filter: "url(#mt-ink)"}}>
        <D palette={noSky(drawing)} line="#0E0E0D" lineW={2.6} monochrome />
      </div>
      <div className="lens-signature miro-sig">Joan Miró</div>
    </div>
  );
}

// ─── Warhol — Quad ─────────────────────────────────────────────────────────
function StyleWarhol({ drawing }) {
  const D = getDrawingComponent(drawing);
  const quads = [
    { bg: "#FFD23F", line: "#C72A1C", fill: "#C72A1C", off: { x: 1.2, y: 0.6 }, halftone: true },
    { bg: "#3CB7B3", line: "#0E2A52", fill: "#FFD23F", off: { x: -0.8, y: 1.2 } },
    { bg: "#FF6B6B", line: "#1a0a1a", fill: "#7A5AE0", off: { x: 1.6, y: -0.4 } },
    { bg: "#0E0E0D", line: "#FFD23F", fill: "#FF6B6B", off: { x: -1.2, y: 1.6 } },
  ];
  return (
    <div className="lens lens-warhol">
      {quads.map((q, i) => (
        <div className="warhol-tile" key={i} style={{background: q.bg}}>
          {/* registration-misaligned shadow color */}
          <div className="warhol-shadow" style={{transform: `translate(${q.off.x}%, ${q.off.y}%)`}}>
            <D palette={monoPalette(drawing, q.fill, 0.6)} line="transparent" lineW={0} flat />
          </div>
          <D palette={monoPalette(drawing, q.fill)} line={q.line} lineW={3.5} flat />
          {q.halftone && (
            <svg className="warhol-dots" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect width="100" height="100" fill="url(#mt-halftone)" opacity="0.22"/>
            </svg>
          )}
        </div>
      ))}
      <div className="warhol-stamp">EDITION OF 250 · ANDY WARHOL · 1967</div>
    </div>
  );
}

// ─── Klee — Mosaic ─────────────────────────────────────────────────────────
function StyleKlee({ drawing }) {
  const D = getDrawingComponent(drawing);
  // hand-irregular cells, watercolor-washed
  const cells = useMemoCells();
  return (
    <div className="lens lens-klee">
      <div className="klee-grid">
        {cells.map((c, i) => (
          <div key={i} className="klee-cell" style={{
            background: c.color,
            gridColumn: `${c.x + 1} / span ${c.w}`,
            gridRow:    `${c.y + 1} / span ${c.h}`,
            opacity:    c.opacity,
          }}/>
        ))}
      </div>
      {/* watercolor texture overlay */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none"
           style={{mixBlendMode: "multiply", opacity: 0.25}}>
        <rect width="100" height="100" filter="url(#mt-paper-noise)"/>
      </svg>
      {/* Klee-style fish / musical mark in corner */}
      <svg className="lens-deco" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g stroke="#1a1812" strokeWidth="0.35" fill="none" strokeLinecap="round">
          {/* musical/asterisk */}
          <g transform="translate(88 10)">
            <line x1="-3" y1="0" x2="3" y2="0"/>
            <line x1="0" y1="-3" x2="0" y2="3"/>
            <line x1="-2" y1="-2" x2="2" y2="2"/>
            <line x1="-2" y1="2" x2="2" y2="-2"/>
          </g>
          {/* small fish bottom-left */}
          <g transform="translate(10 90)">
            <path d="M -6 0 q 4 -4 10 0 q -4 4 -10 0 z"/>
            <path d="M 4 0 l 4 -2 l -4 2 l 4 2 z"/>
            <circle cx="-2" cy="-1" r="0.4" fill="#1a1812"/>
          </g>
        </g>
      </svg>
      {/* the drawing inked over top */}
      <div className="klee-art" style={{filter: "url(#mt-watercolor)"}}>
        <D palette={noSky(drawing)} line="#1a1812" lineW={2.4} monochrome />
      </div>
      <div className="lens-signature klee-sig">P. Klee</div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function monoPalette(drawing, fill, alpha = 1) {
  const d = defaultsFor(drawing);
  const f = alpha < 1 ? hexA(fill, alpha) : fill;
  const out = {};
  for (const k of Object.keys(d)) {
    if (k === "sky" || k === "bg") out[k] = null;
    else if (k === "eye") out[k] = alpha < 1 ? hexA("#FFFFFF", alpha) : "#FFFFFF";
    else if (k === "pupil") out[k] = alpha < 1 ? "transparent" : "#000";
    else out[k] = f;
  }
  return out;
}

function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0,2), 16);
  const g = parseInt(h.slice(2,4), 16);
  const b = parseInt(h.slice(4,6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function useMemoCells() {
  // deterministic seeded layout — looks irregular but stable across renders
  return React.useMemo(() => {
    const cells = [];
    const palette = [
      "#E8D8B8","#D8C49A","#C9B689","#B8A37A","#D6B89C","#C8A8A0","#A8C3B0","#B4C7D4",
      "#D0B8C2","#BFB6A0","#D9C8B0","#A8B0C8","#C2A684","#B89B7A","#9FB59C","#CDB5B5"
    ];
    const cols = 8, rows = 8;
    const taken = Array.from({length: rows}, () => Array(cols).fill(false));
    let seed = 17;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (taken[y][x]) continue;
        const w = rand() < 0.3 && x < cols - 1 && !taken[y][x+1] ? 2 : 1;
        const h = rand() < 0.25 && y < rows - 1 && !taken[y+1]?.[x] ? 2 : 1;
        // mark taken
        for (let dy = 0; dy < h; dy++)
          for (let dx = 0; dx < w; dx++)
            if (taken[y + dy]) taken[y + dy][x + dx] = true;
        cells.push({
          x, y, w, h,
          color: palette[Math.floor(rand() * palette.length)],
          opacity: 0.85 + rand() * 0.15,
        });
      }
    }
    return cells;
  }, []);
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────
function StyleLens({ style, drawing }) {
  switch (style) {
    case "pure":     return <StylePure     drawing={drawing}/>;
    case "matisse":  return <StyleMatisse  drawing={drawing}/>;
    case "picasso":  return <StylePicasso  drawing={drawing}/>;
    case "mondrian": return <StyleMondrian drawing={drawing}/>;
    case "haring":   return <StyleHaring   drawing={drawing}/>;
    case "hockney":  return <StyleHockney  drawing={drawing}/>;
    case "basquiat": return <StyleBasquiat drawing={drawing}/>;
    case "miro":     return <StyleMiro     drawing={drawing}/>;
    case "warhol":   return <StyleWarhol   drawing={drawing}/>;
    case "klee":     return <StyleKlee     drawing={drawing}/>;
    default:         return <StylePure    drawing={drawing}/>;
  }
}

Object.assign(window, { STYLES, StyleLens, PALETTES, defaultsFor, noSky });
