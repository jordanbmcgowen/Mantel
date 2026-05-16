// drawings.jsx
// Three sample children's drawings, each as a parameterized SVG.
// Every drawing takes a `palette` object so artist-style "lenses" can recolor it,
// and a `line` color for the wobbly outlines that anchor the kid-drawn feel.

const DEFAULT_LINE = "#211d18";

// ─── House with sun, tree, family ────────────────────────────────────────────
function HouseDrawing({ palette, line = DEFAULT_LINE, lineW = 4, monochrome = false, flat = false, style = {} }) {
  const p = palette || {
    bg:   "transparent",
    sky:  "#BCD9E6",
    sun:  "#F4C53A",
    grass:"#7FB069",
    tree: "#3D7A48",
    trunk:"#7A4E2E",
    house:"#C7593D",
    roof: "#3A2F26",
    door: "#3A2F26",
    win:  "#9CC7DB",
    person1:"#F4C53A",
    person2:"#C7593D",
    cloud:"#F5EFE3",
    heart:"#D8456E"
  };
  const L = (c) => monochrome ? line : (c || line);
  const F = (c) => monochrome ? "none" : c;

  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" style={style}>
      {/* sky */}
      {p.sky && <rect x="0" y="0" width="400" height="400" fill={F(p.sky)} />}

      {/* clouds */}
      {!flat && p.cloud && (
        <g fill={F(p.cloud)} stroke={L()} strokeWidth={lineW * 0.6} strokeLinejoin="round">
          <path d="M60 90 q 8 -22 30 -18 q 12 -14 30 -6 q 16 -2 22 12 q 10 8 0 18 z" />
          <path d="M240 60 q 6 -14 22 -12 q 8 -10 22 -4 q 12 0 14 10 q 6 8 -4 14 z" />
        </g>
      )}

      {/* sun */}
      {p.sun && (
        <g>
          <g stroke={L(p.sun)} strokeWidth={lineW * 0.9} strokeLinecap="round">
            <line x1="350" y1="20" x2="350" y2="40" />
            <line x1="350" y1="120" x2="350" y2="140" />
            <line x1="290" y1="80" x2="310" y2="80" />
            <line x1="390" y1="80" x2="410" y2="80" />
            <line x1="312" y1="42" x2="322" y2="52" />
            <line x1="378" y1="108" x2="388" y2="118" />
            <line x1="312" y1="118" x2="322" y2="108" />
            <line x1="378" y1="52" x2="388" y2="42" />
          </g>
          <circle cx="350" cy="80" r="32" fill={F(p.sun)} stroke={L()} strokeWidth={lineW} />
          {!monochrome && !flat && (
            <g stroke={L()} strokeWidth={lineW * 0.6} strokeLinecap="round" fill="none">
              <path d="M338 78 q 4 8 12 0" />
              <circle cx="340" cy="72" r="1.5" fill={line} />
              <circle cx="358" cy="72" r="1.5" fill={line} />
            </g>
          )}
        </g>
      )}

      {/* grass */}
      {p.grass && (
        <path d="M0 340 q 40 -10 90 -2 q 60 12 130 -4 q 80 -16 180 0 L 400 400 L 0 400 Z"
              fill={F(p.grass)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
      )}

      {/* tree */}
      {p.tree && (
        <g>
          <rect x="58" y="240" width="22" height="80" fill={F(p.trunk)} stroke={L()} strokeWidth={lineW} />
          <path d="M30 245 q -8 -42 22 -56 q 4 -28 34 -28 q 28 -8 38 18 q 28 6 22 36 q 8 24 -14 32 q -6 12 -22 8 q -22 8 -38 -2 q -28 6 -42 -8 z"
                fill={F(p.tree)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
        </g>
      )}

      {/* house body */}
      {p.house && (
        <rect x="138" y="220" width="170" height="120" fill={F(p.house)} stroke={L()} strokeWidth={lineW} />
      )}
      {/* roof */}
      {p.roof && (
        <path d="M122 220 L 223 142 L 324 220 Z" fill={F(p.roof)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
      )}
      {/* door */}
      {p.door && (
        <g>
          <rect x="200" y="270" width="44" height="70" fill={F(p.door)} stroke={L()} strokeWidth={lineW} />
          <circle cx="234" cy="306" r="2.5" fill={line} />
        </g>
      )}
      {/* windows */}
      {p.win && (
        <g>
          <rect x="156" y="240" width="34" height="34" fill={F(p.win)} stroke={L()} strokeWidth={lineW} />
          <line x1="173" y1="240" x2="173" y2="274" stroke={L()} strokeWidth={lineW * 0.6} />
          <line x1="156" y1="257" x2="190" y2="257" stroke={L()} strokeWidth={lineW * 0.6} />
          <rect x="258" y="240" width="34" height="34" fill={F(p.win)} stroke={L()} strokeWidth={lineW} />
          <line x1="275" y1="240" x2="275" y2="274" stroke={L()} strokeWidth={lineW * 0.6} />
          <line x1="258" y1="257" x2="292" y2="257" stroke={L()} strokeWidth={lineW * 0.6} />
        </g>
      )}

      {/* figures */}
      {p.person1 && (
        <g stroke={L()} strokeWidth={lineW} strokeLinecap="round" fill="none">
          {/* parent */}
          <circle cx="120" cy="306" r="12" fill={F(p.person1)} />
          <line x1="120" y1="318" x2="120" y2="350" />
          <line x1="120" y1="328" x2="106" y2="342" />
          <line x1="120" y1="328" x2="134" y2="342" />
          <line x1="120" y1="350" x2="112" y2="370" />
          <line x1="120" y1="350" x2="128" y2="370" />
          {/* child */}
          <circle cx="92" cy="332" r="9" fill={F(p.person2)} />
          <line x1="92" y1="341" x2="92" y2="362" />
          <line x1="92" y1="348" x2="80" y2="358" />
          <line x1="92" y1="348" x2="104" y2="358" />
          <line x1="92" y1="362" x2="86" y2="374" />
          <line x1="92" y1="362" x2="98" y2="374" />
        </g>
      )}

      {/* heart */}
      {!monochrome && p.heart && (
        <path d="M40 56 q -10 -10 0 -18 q 8 -6 12 4 q 4 -10 12 -4 q 10 8 0 18 q -6 6 -12 12 q -6 -6 -12 -12 z"
              fill={F(p.heart)} stroke={L()} strokeWidth={lineW * 0.7} />
      )}
    </svg>
  );
}

// ─── Dinosaur ────────────────────────────────────────────────────────────────
function DinoDrawing({ palette, line = DEFAULT_LINE, lineW = 4, monochrome = false, flat = false, style = {} }) {
  const p = palette || {
    bg:    "#F2E7D2",
    sky:   "#EAD9B0",
    dino:  "#6FA86A",
    belly: "#B7D69A",
    spikes:"#3F6B3D",
    eye:   "#FFFFFF",
    pupil: "#1a1815",
    sun:   "#E89A3C",
    plant: "#3F6B3D",
    ground:"#B59765",
    smile: "#E64A3F"
  };
  const L = (c) => monochrome ? line : (c || line);
  const F = (c) => monochrome ? "none" : c;

  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" style={style}>
      {p.sky && <rect x="0" y="0" width="400" height="400" fill={F(p.sky)} />}

      {/* sun */}
      {p.sun && (
        <g>
          <circle cx="80" cy="80" r="26" fill={F(p.sun)} stroke={L()} strokeWidth={lineW} />
          <g stroke={L(p.sun)} strokeWidth={lineW * 0.8} strokeLinecap="round">
            <line x1="80" y1="36" x2="80" y2="46" />
            <line x1="80" y1="114" x2="80" y2="124" />
            <line x1="36" y1="80" x2="46" y2="80" />
            <line x1="114" y1="80" x2="124" y2="80" />
          </g>
        </g>
      )}

      {/* ground */}
      {p.ground && (
        <path d="M0 340 q 100 -16 200 -2 q 100 14 200 -6 L 400 400 L 0 400 Z"
              fill={F(p.ground)} stroke={L()} strokeWidth={lineW} />
      )}

      {/* plants */}
      {p.plant && !flat && (
        <g stroke={L()} strokeWidth={lineW * 0.8} fill={F(p.plant)} strokeLinejoin="round">
          <path d="M40 340 q -4 -22 8 -38 q 14 -12 22 0 q 12 14 0 32 q -8 14 -30 6 z" />
          <path d="M340 350 q -4 -28 14 -42 q 14 -8 22 4 q 8 18 -4 34 q -16 16 -32 4 z" />
        </g>
      )}

      {/* dino body */}
      {p.dino && (
        <g>
          {/* body+tail */}
          <path d="M90 290 q -10 -52 30 -72 q 24 -12 56 -8 q 30 -28 76 -22 q 50 6 60 50 q 20 0 28 24 q 4 26 -22 38 q -10 8 -26 4 q -8 16 -28 16 q -20 0 -26 -16 q -50 8 -90 -2 q -18 14 -36 6 q -28 -2 -22 -18 z"
                fill={F(p.dino)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
          {/* belly */}
          {p.belly && !flat && (
            <path d="M120 274 q 40 -8 80 0 q 40 8 80 -4 q 4 22 -10 34 q -20 12 -64 8 q -50 6 -80 -8 q -10 -10 -6 -30 z"
                  fill={F(p.belly)} stroke="none" />
          )}
          {/* legs */}
          <path d="M132 302 q 0 22 -10 32 q 18 8 24 -8 q 4 14 -2 22 q -16 6 -28 -6 q -10 -16 -2 -42 z"
                fill={F(p.dino)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
          <path d="M220 304 q 0 22 -10 32 q 18 8 24 -8 q 4 14 -2 22 q -16 6 -28 -6 q -10 -16 -2 -42 z"
                fill={F(p.dino)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
          {/* spikes */}
          {p.spikes && (
            <g fill={F(p.spikes)} stroke={L()} strokeWidth={lineW * 0.8} strokeLinejoin="round">
              <path d="M170 216 l 8 -22 l 10 18 z" />
              <path d="M198 206 l 10 -24 l 12 20 z" />
              <path d="M232 200 l 12 -22 l 12 18 z" />
              <path d="M266 200 l 10 -18 l 10 14 z" />
              <path d="M300 220 l 6 -14 l 8 10 z" />
            </g>
          )}
          {/* eye */}
          {p.eye && (
            <g>
              <circle cx="318" cy="218" r="10" fill={F(p.eye)} stroke={L()} strokeWidth={lineW * 0.8} />
              <circle cx="320" cy="220" r="4" fill={F(p.pupil) || line} />
            </g>
          )}
          {/* smile */}
          {p.smile && !monochrome && (
            <path d="M310 240 q 12 10 28 2" fill="none" stroke={F(p.smile)} strokeWidth={lineW * 0.8} strokeLinecap="round" />
          )}
        </g>
      )}
    </svg>
  );
}

// ─── Garden / flowers ────────────────────────────────────────────────────────
function GardenDrawing({ palette, line = DEFAULT_LINE, lineW = 4, monochrome = false, flat = false, style = {} }) {
  const p = palette || {
    sky:    "#F4DCE3",
    flower1:"#E64A6F",
    flower2:"#F4C53A",
    flower3:"#8B5FBF",
    center: "#F4C53A",
    stem:   "#5E8E3E",
    leaf:   "#7FB069",
    pot:    "#C7593D",
    butterfly:"#5B8FD8",
    ground: "#B59765",
    heart:  "#D8456E"
  };
  const L = (c) => monochrome ? line : (c || line);
  const F = (c) => monochrome ? "none" : c;

  const Flower = ({ cx, cy, color, center, petal = 22, rot = 0 }) => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <ellipse key={i} cx="0" cy="-22" rx="14" ry={petal}
                 transform={`rotate(${a})`}
                 fill={F(color)} stroke={L()} strokeWidth={lineW * 0.8} />
      ))}
      <circle r="14" fill={F(center)} stroke={L()} strokeWidth={lineW * 0.8} />
    </g>
  );

  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" style={style}>
      {p.sky && <rect x="0" y="0" width="400" height="400" fill={F(p.sky)} />}

      {/* sun arc */}
      {!flat && (
        <g stroke={L()} strokeWidth={lineW * 0.5} fill="none" opacity={monochrome ? 0.4 : 0.5}>
          <path d="M50 60 q 100 -30 300 0" />
          <path d="M70 80 q 120 -28 260 0" />
        </g>
      )}

      {/* stems */}
      {p.stem && (
        <g stroke={F(p.stem)} strokeWidth={lineW * 1.4} strokeLinecap="round" fill="none">
          <path d="M120 360 q -10 -80 0 -170" />
          <path d="M200 360 q 4 -90 0 -200" />
          <path d="M280 360 q 10 -84 0 -176" />
        </g>
      )}

      {/* leaves */}
      {p.leaf && (
        <g fill={F(p.leaf)} stroke={L()} strokeWidth={lineW * 0.7}>
          <path d="M114 250 q -28 -8 -34 -28 q 14 -12 32 0 q 4 14 2 28 z" />
          <path d="M206 280 q 30 -6 36 -26 q -16 -12 -32 2 q -6 14 -4 24 z" />
          <path d="M276 230 q -28 -6 -34 -26 q 14 -12 32 2 q 4 14 2 24 z" />
        </g>
      )}

      {/* flowers */}
      <Flower cx={120} cy={170} color={p.flower1} center={p.center} rot={5} />
      <Flower cx={200} cy={140} color={p.flower2} center={p.flower1} rot={-8} petal={26} />
      <Flower cx={280} cy={170} color={p.flower3} center={p.center} rot={10} />

      {/* pot */}
      {p.pot && (
        <g>
          <path d="M88 340 L 312 340 L 290 388 L 110 388 Z" fill={F(p.pot)} stroke={L()} strokeWidth={lineW} strokeLinejoin="round" />
          <line x1="84" y1="340" x2="316" y2="340" stroke={L()} strokeWidth={lineW * 1.2} />
        </g>
      )}

      {/* butterfly */}
      {p.butterfly && !monochrome && (
        <g transform="translate(330 130)">
          <ellipse cx="-14" cy="-6" rx="14" ry="18" fill={F(p.butterfly)} stroke={L()} strokeWidth={lineW * 0.7} />
          <ellipse cx="14" cy="-6" rx="14" ry="18" fill={F(p.butterfly)} stroke={L()} strokeWidth={lineW * 0.7} />
          <ellipse cx="-12" cy="14" rx="10" ry="12" fill={F(p.butterfly)} stroke={L()} strokeWidth={lineW * 0.7} />
          <ellipse cx="12" cy="14" rx="10" ry="12" fill={F(p.butterfly)} stroke={L()} strokeWidth={lineW * 0.7} />
          <line x1="0" y1="-14" x2="0" y2="22" stroke={L()} strokeWidth={lineW * 0.9} strokeLinecap="round" />
          <path d="M0 -14 q -4 -10 -10 -8 M0 -14 q 4 -10 10 -8" stroke={L()} strokeWidth={lineW * 0.6} fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* heart */}
      {p.heart && !monochrome && (
        <path d="M60 80 q -10 -10 0 -18 q 8 -6 12 4 q 4 -10 12 -4 q 10 8 0 18 q -6 6 -12 12 q -6 -6 -12 -12 z"
              fill={F(p.heart)} stroke={L()} strokeWidth={lineW * 0.6} />
      )}
    </svg>
  );
}

// Registry — index by id so screens can refer by string
const DRAWINGS = {
  house:  { id: "house",  label: "Home",       artist: "Maya, age 6",   component: HouseDrawing },
  dino:   { id: "dino",   label: "Rex",        artist: "Theo, age 5",   component: DinoDrawing },
  garden: { id: "garden", label: "Garden",     artist: "Iris, age 7",   component: GardenDrawing },
};

Object.assign(window, { HouseDrawing, DinoDrawing, GardenDrawing, DRAWINGS });
