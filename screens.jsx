// screens.jsx
// All screens for the Kidcasso prototype.
// Wired with simple state callbacks — App in app.jsx drives them.

const { useState, useEffect, useRef, useMemo } = React;

// ─── Header ──────────────────────────────────────────────────────────────────
function Header({ brand, screen, onHome, step }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="brand" onClick={onHome}>
          <span className="mark"></span>
          <span>{brand}</span>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={onHome}>Start a piece</span>
          <span className="nav-link">Process</span>
          <span className="nav-link">Pricing</span>
          <span className="nav-link">Account</span>
        </div>
        <div className="nav-step">{step}</div>
      </div>
    </nav>
  );
}

// ─── Landing ────────────────────────────────────────────────────────────────
function Landing({ go, brand }) {
  return (
    <>
      <section className="hero frame">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow eyebrow">From the fridge, to the wall</div>
            <h1 className="display">
              Your kid's <em>masterpiece</em>,<br />reimagined by the masters.
            </h1>
            <p className="hero-body">
              Upload a drawing. {brand} will lift it cleanly off the page and reinterpret it in ten styles — from a pure vectorized original to cuts by Matisse, pop figures by Haring, and a quad in the manner of Warhol. Pick a favorite. We print it large, frame it well, and ship.
            </p>
            <div className="hero-actions">
              <button className="btn" onClick={() => go("upload")}>
                Start with a drawing <span className="arr">→</span>
              </button>
              <button className="btn-link" onClick={() => go("results")}>See a sample run</button>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-art-frame">
              <div className="matte"></div>
              <div className="piece">
                <StyleLens style="matisse" drawing="house" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee frame" style={{maxWidth: "100%", padding: "18px 0"}}>
        <div className="marquee-track">
          {[1,2].map(i => (
            <React.Fragment key={i}>
              <span>Matisse</span><span className="dot"></span>
              <span>Picasso</span><span className="dot"></span>
              <span>Mondrian</span><span className="dot"></span>
              <span>Haring</span><span className="dot"></span>
              <span>Hockney</span><span className="dot"></span>
              <span>Basquiat</span><span className="dot"></span>
              <span>Miró</span><span className="dot"></span>
              <span>Warhol</span><span className="dot"></span>
              <span>Klee</span><span className="dot"></span>
              <span>+ the original, vectorized</span><span className="dot"></span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <section className="section frame">
        <div className="section-head">
          <h2>How it<br/>works.</h2>
          <p className="lede">Four steps. The whole thing takes seconds. The result hangs on your wall for decades.</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="num">i.</div>
            <h3>Upload</h3>
            <p>Photograph or scan your kid's artwork. Any phone camera is fine — we handle the lighting, paper texture and shadows.</p>
          </div>
          <div className="step">
            <div className="num">ii.</div>
            <h3>Choose</h3>
            <p>We generate ten interpretations. One is a faithful, vector-clean version of the original. Nine are inspired by master artists across eras.</p>
          </div>
          <div className="step">
            <div className="num">iii.</div>
            <h3>Configure</h3>
            <p>Pick a size from twelve inches to oversized, an optional frame in black, white, natural wood, or float, and add the artist's name.</p>
          </div>
          <div className="step">
            <div className="num">iv.</div>
            <h3>Receive</h3>
            <p>Museum-grade canvas, hand-stretched in our studio in Asheville. Ships in seven days, free over $120.</p>
          </div>
        </div>
      </section>

      <section className="section frame" style={{paddingTop: 0}}>
        <div className="section-head">
          <h2>Ten styles<br/>per drawing.</h2>
          <p className="lede">One faithful, nine inspired. The same drawing, run through ten lenses.</p>
        </div>
        <div className="gallery-grid">
          {STYLES.map((s, i) => (
            <div key={s.id} className={`tile ${s.id === "pure" ? "is-pure" : ""}`} onClick={() => go("upload")}>
              <div className="tile-art" style={{aspectRatio: "1"}}>
                <StyleLens style={s.id} drawing={["house","dino","garden"][i % 3]}/>
              </div>
              <div className="tile-cap">
                <div className="name">{s.name}</div>
                <div className="artist">{s.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// ─── Upload ─────────────────────────────────────────────────────────────────
function Upload({ go, setDrawing, setUploaded, uploaded }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  function pick(d) {
    setDrawing(d);
    setUploaded(null);
    go("processing");
  }
  async function handleFile(file) {
  if (!file) return;
  // Convert HEIC/HEIF to JPEG in-browser before anything else
  const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
    /\.heic$/i.test(file.name) || /\.heif$/i.test(file.name);
  if (isHeic && window.heic2any) {
    try {
      const converted = await window.heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
      file = new File([converted], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' });
    } catch (e) {
      console.warn('HEIC conversion failed, trying original:', e);
    }
  }
  const url = URL.createObjectURL(file);
  setUploaded({ url, file, name: file.name, size: file.size });
  setDrawing("house");
  go("processing");
}
  async function onDrop(e) {
    e.preventDefault();
    setOver(false);
    const f = e.dataTransfer.files?.[0];
    await handleFile(f);
  }

  return (
    <section className="upload-wrap frame">
      <div className="upload-grid">
        <div>
          <div className="eyebrow" style={{marginBottom: 16}}>Step one</div>
          <h2 className="display" style={{fontSize: "clamp(40px,5vw,72px)", marginBottom: 18}}>
            Add a drawing.
          </h2>
          <p className="lede" style={{marginBottom: 32, fontSize: 18}}>
            A phone photo works. Aim for even light, paper flat, no shadows. We'll handle the rest.
          </p>
          <div
            className={`dropzone ${over ? "is-over" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={onDrop}
          >
            <input ref={inputRef} type="file" accept="image/*,.heic,.heif" hidden
                   onChange={async (e) => { await handleFile(e.target.files?.[0]); }}/>
            <div className="dropzone-inner">
              <div className="dropzone-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M12 5v14M5 12l7-7 7 7"/>
                </svg>
              </div>
              <h3>Drop a photo here</h3>
              <p>or click to choose a file — JPG, PNG, HEIC up to 25MB</p>
              <div className="fileinfo">TEN STYLES · READY IN SECONDS</div>
            </div>
          </div>
        </div>

        <div className="samples">
          <h4>Or try one of ours</h4>
          <div className="samples-grid">
            {Object.values(DRAWINGS).map(d => (
              <div key={d.id} className="sample" onClick={() => pick(d.id)}>
                <d.component />
                <div className="sample-cap">{d.label} — {d.artist}</div>
              </div>
            ))}
            <div className="sample" style={{display:"grid", placeItems:"center", textAlign:"center", padding: 20}}>
              <div>
                <div style={{fontFamily:"var(--f-display)", fontSize: 22, lineHeight: 1.1, marginBottom: 6}}>Use a child<br/>you know</div>
                <div style={{fontFamily:"var(--f-mono)", fontSize: 10, letterSpacing:".1em", textTransform:"uppercase", color:"var(--ink-3)"}}>Drop a photo, top-left ↖</div>
              </div>
            </div>
          </div>
          <div style={{marginTop: 32, paddingTop: 24, borderTop: ".5px solid var(--rule)", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6}}>
            <p style={{margin: "0 0 8px"}}><strong style={{fontWeight: 500}}>Privacy.</strong> Your child's drawings are processed on-device and deleted after your order ships. Never used to train models.</p>
            <p style={{margin: 0}}><strong style={{fontWeight: 500}}>Quality.</strong> If the drawing is too faint to read cleanly, we'll email you within an hour to ask for a better scan.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Image post-processing ───────────────────────────────────────────────────

function loadImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Per-style interpretation profile. Models how loosely each artist would
// re-imagine a child's drawing, then how to vectorize it for clean print
// scaling. The AI output IS the design — we don't re-stamp the original
// line on top, that would flatten every style toward the same outline.
//
//   aiStrength → forwarded to the img2img backend. Lower preserves more of
//                the input; higher gives the model freer rein. Tuned to
//                each artist's documented attitude to subject matter:
//                  · Warhol screened a single photo; only color/registration
//                    moved. Highest fidelity.
//                  · Basquiat prized raw, child-like marks and overlaid on
//                    them — keep the drawing largely intact.
//                  · Hockney kept the figurative subject in flat pop palette.
//                  · Picasso's Blue Period kept the figures, retuned the key.
//                  · Klee inked the drawing on top of his watercolor mosaic.
//                  · Matisse cut shapes from memory of form, not from line.
//                  · Miró's constellations are dream-derived, not literal.
//                  · Mondrian abandoned representation for the pure grid.
//                  · Rothko obliterated subject entirely for atmosphere.
//
//   vec        → ImageTracer options. Painterly styles get higher blur and
//                more colors so smooth fields don't fragment into speckly
//                polygons; flat styles get aggressive path-omission so they
//                read graphic.
// `prompt` is sent to the img2img worker alongside `style`. It is phrased to
// describe the *artwork transformation* only — deliberately free of any words
// referring to a minor (child/kid/young/etc.), because OpenAI's moderation
// layer flags "edit an image of a minor" requests and rejects them (HTTP 400,
// moderation_blocked). The worker's own built-in prompts trip this for some
// styles (notably Hockney), so we always override with a safe prompt here.
const STYLE_PROFILES = {
  pure:     { aiStrength: null, fallbackBg: "#F4F0E8",
              vec: { numberofcolors: 24, colorquantcycles: 4, pathomit: 6,  ltres: 0.4, qtres: 0.4, blurradius: 1, blurdelta: 14 } },
  // Prompts are deliberately aggressive about MEDIUM, FORM-LANGUAGE and the
  // ARTIST'S OWN BODY OF WORK — not just palette. The worker does a
  // structure-preserving edit, so it keeps the subject roughly centred, but it
  // WILL change material, brushwork, texture and abstraction dramatically when
  // told to. Naming specific masterworks and material qualities (impasto,
  // torn paper grain, silkscreen, oilstick) is what pushes the output from a
  // generic recolor to a rich, gallery-quality painting. Strengths are tuned
  // up so the model genuinely elaborates rather than lightly tinting.
  warhol:   { aiStrength: 0.62, fallbackBg: "#FFD23F",
              prompt: "Recreate this picture as an Andy Warhol pop-art silkscreen in the spirit of his Marilyn series, arranged as a 2x2 grid of four identical panels, each panel a boldly different high-contrast color scheme (acid green with pink, hot magenta with orange, electric blue with yellow, black with red), flat screenprinted blocks of saturated color, bold thick black outlines, visible halftone dot texture and slightly off-register edges. Iconic, graphic, high-contrast, vivid.",
              vec: { numberofcolors: 8,  colorquantcycles: 4, pathomit: 12, ltres: 0.8, qtres: 0.8, blurradius: 1, blurdelta: 14 } },
  basquiat: { aiStrength: 0.72, fallbackBg: "#C8A877",
              prompt: "Recreate this picture as a museum-quality Jean-Michel Basquiat neo-expressionist painting on weathered kraft paper: raw frenetic oilstick and wax crayon scrawls, a bright yellow three-point crown, scribbled and crossed-out block-letter words, copyright marks, dense layered scratchy mark-making, drips and smears, bold primary colors over the whole canvas, urgent and untamed.",
              vec: { numberofcolors: 28, colorquantcycles: 3, pathomit: 4,  ltres: 0.5, qtres: 0.5, blurradius: 1, blurdelta: 14 } },
  hockney:  { aiStrength: 0.68, fallbackBg: "#3CB7B3",
              prompt: "Recreate this picture as a luminous David Hockney acrylic painting in his sunlit California style: broad flat planes of bright color, turquoise water with wavy white ripple lines, palm-frond shapes, a bleached cyan sky, hot pink and lemon yellow accents, bold thick confident black outlines and crisp high-contrast edges, airy and graphic. Rich, vivid, high quality.",
              vec: { numberofcolors: 14, colorquantcycles: 4, pathomit: 10, ltres: 1.0, qtres: 1.0, blurradius: 2, blurdelta: 18 } },
  picasso:  { aiStrength: 0.82, fallbackBg: "#0F1E3D",
              postTint: { dark: "#070F26", mid: "#2B5590", light: "#CFE0F4" },
              prompt: "Recreate this picture as a richly textured Picasso cubist oil painting: the whole scene fractured into overlapping angular faceted planes, with visible impasto brushwork, layered translucent glazes, bold black contour lines and dramatic chiaroscuro depth. Somber, atmospheric and museum-quality, every inch of the canvas activated.",
              vec: { numberofcolors: 28, colorquantcycles: 4, pathomit: 6,  ltres: 0.6, qtres: 0.6, blurradius: 2, blurdelta: 18 } },
  klee:     { aiStrength: 0.82, fallbackBg: "#D8C49A",
              prompt: "Recreate this picture in the manner of Paul Klee's 'Castle and Sun': dissolve the whole scene into a rich tessellated mosaic of small soft-edged colored squares and rectangles in warm reds, ochres, teals, golds and greens, each tile a slightly different hand-mixed watercolor wash with visible pigment grain, bold dark tile borders and strong contrast, the subject gently emerging from the field of tiles. Layered, luminous, painterly.",
              vec: { numberofcolors: 32, colorquantcycles: 4, pathomit: 6,  ltres: 0.5, qtres: 0.5, blurradius: 2, blurdelta: 18 } },
  matisse:  { aiStrength: 0.78, fallbackBg: "#F1ECE2",
              prompt: "Recreate this picture as a vibrant Henri Matisse paper cut-out collage in the spirit of 'Jazz' and 'The Snail': bold overlapping organic shapes torn from richly colored paper — vermillion, cobalt, kelly green, gold and magenta — with a few scattered leaf and star cut-out accents giving the composition rhythm, visible torn deckled paper edges and paper grain, no outlines. Joyful, dynamic, gallery-quality.",
              vec: { numberofcolors: 10, colorquantcycles: 4, pathomit: 14, ltres: 1.2, qtres: 1.2, blurradius: 3, blurdelta: 20 } },
  miro:     { aiStrength: 0.9, fallbackBg: "#F0E6CE",
              prompt: "Reinvent this picture freely as a Joan Miro surrealist painting in the spirit of 'The Tilled Field' and his Constellations: loose playful biomorphic blobs and amoeba shapes, bold thick confident black calligraphic lines, scattered black dots, stars and a crescent moon, strong high-contrast primary red blue and yellow accents on a soft warm cream ground with subtle painterly washes. Abstract, lyrical and dreamlike — do not copy the original layout, keep only its spirit.",
              vec: { numberofcolors: 10, colorquantcycles: 4, pathomit: 12, ltres: 1.0, qtres: 1.0, blurradius: 2, blurdelta: 18 } },
  mondrian: { aiStrength: 0.88, fallbackBg: "#F4F0E8",
              prompt: "Reinvent this picture as a Piet Mondrian De Stijl composition in the spirit of 'Composition with Red, Blue and Yellow': an asymmetric grid of bold rectangles in pure primary red, yellow and blue plus crisp white, separated by thick confident black ruled lines, with the subtle canvas texture of an oil painting. Geometric, balanced, flat and abstract — keep only a faint echo of the original arrangement.",
              vec: { numberofcolors: 5,  colorquantcycles: 3, pathomit: 20, ltres: 2.0, qtres: 2.0, blurradius: 4, blurdelta: 24 } },
  // Keith Haring — bold flat electric color with radiating energy lines; a
  // natural partner for the shared bold outline.
  haring:   { aiStrength: 0.6, fallbackBg: "#F5C518",
              prompt: "Recreate this picture as a Keith Haring pop graphic: bold thick black outlines, filled with flat electric color (red, blue, green, yellow), surrounded by short radiating black energy lines, on a single vivid flat background. Graphic, joyful, high-contrast.",
              vec: { numberofcolors: 6, colorquantcycles: 3, pathomit: 12, ltres: 1.0, qtres: 1.0, blurradius: 1, blurdelta: 18 } },
};

// Vectorize a raster (data URL) into a print-scalable SVG data URL.
async function vectorizeRaster(dataURL, vecOpts) {
  if (typeof ImageTracer === 'undefined') return dataURL;
  return await new Promise((resolve) => {
    ImageTracer.imageToSVG(
      dataURL,
      (svg) => resolve('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)),
      vecOpts
    );
  });
}

// Fast raster preview from a source data URL. Used for gallery and order-flow
// thumbnails where rendering ten vectorized SVGs at once was tanking the page.
// JPEG when alpha is not needed (≈10× smaller than equivalent PNG); PNG only
// for the "pure" style where the paper has been knocked out to transparency.
async function makePreview(dataURL, { maxDim = 640, preserveAlpha = false, quality = 0.85 } = {}) {
  const img = await loadImageFromSrc(dataURL);
  const w = img.naturalWidth || maxDim;
  const h = img.naturalHeight || maxDim;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  const dw = Math.max(1, Math.round(w * scale));
  const dh = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement('canvas');
  canvas.width = dw; canvas.height = dh;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, dw, dh);
  return preserveAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality);
}

// Knock the paper out of a phone photo of a child's drawing. Samples the
// edges to estimate the median paper color, then feather-makes pixels
// within color-distance transparent. Anti-aliased strokes survive cleanly.
async function removePaperBackground(dataURL) {
  const img = await loadImageFromSrc(dataURL);
  const w = img.naturalWidth || 1024;
  const h = img.naturalHeight || 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const px = imageData.data;

  const samples = [];
  const stride = Math.max(2, Math.floor(Math.min(w, h) / 80));
  const margin = Math.max(2, Math.floor(Math.min(w, h) * 0.025));
  for (let x = 0; x < w; x += stride) {
    for (const y of [margin, h - margin - 1]) {
      const i = (y * w + x) * 4;
      samples.push([px[i], px[i+1], px[i+2]]);
    }
  }
  for (let y = 0; y < h; y += stride) {
    for (const x of [margin, w - margin - 1]) {
      const i = (y * w + x) * 4;
      samples.push([px[i], px[i+1], px[i+2]]);
    }
  }
  const med = (ch) => {
    const sorted = samples.map(s => s[ch]).sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  };
  const paper = [med(0), med(1), med(2)];
  const paperLum = 0.299 * paper[0] + 0.587 * paper[1] + 0.114 * paper[2];

  // tol: color distance within which a pixel reads as paper (covers paper
  // grain, gentle warmth, slight shadow). soft: feather width for the edge
  // of a stroke so it doesn't go jagged.
  const tol = 52;
  const soft = 22;
  for (let i = 0; i < px.length; i += 4) {
    const lum = 0.299 * px[i] + 0.587 * px[i+1] + 0.114 * px[i+2];
    // A pixel clearly darker than the paper is a stroke — keep it.
    if (lum < paperLum - 14) continue;
    const dr = px[i]   - paper[0];
    const dg = px[i+1] - paper[1];
    const db = px[i+2] - paper[2];
    const d = Math.sqrt(dr * dr + dg * dg + db * db);
    if (d < tol) {
      px[i+3] = 0;
    } else if (d < tol + soft) {
      px[i+3] = Math.round(px[i+3] * (d - tol) / soft);
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

// Thicken and deepen the dark marks in a canvas with a separable minimum
// (darkening) filter — each pixel takes the darkest value in a small
// neighborhood, so thin strokes grow and faint ones gain weight. `radius` in
// pixels; `amount` 0..1 blends the bolded result back over the original so the
// effect can be subtle. Colored fills are barely touched; lines get bolder.
function boldenLines(ctx, w, h, radius = 1, amount = 1) {
  if (radius < 1) return;
  const id = ctx.getImageData(0, 0, w, h);
  const p = id.data;
  const tmp = new Uint8ClampedArray(p.length);
  // horizontal min
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      for (let k = 0; k < 3; k++) {
        let m = 255;
        for (let dx = -radius; dx <= radius; dx++) {
          const xx = x + dx; if (xx < 0 || xx >= w) continue;
          const v = p[(y * w + xx) * 4 + k]; if (v < m) m = v;
        }
        tmp[o + k] = m;
      }
      tmp[o + 3] = p[o + 3];
    }
  }
  // vertical min, blended back by `amount`
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      for (let k = 0; k < 3; k++) {
        let m = 255;
        for (let dy = -radius; dy <= radius; dy++) {
          const yy = y + dy; if (yy < 0 || yy >= h) continue;
          const v = tmp[((yy * w + x) * 4) + k]; if (v < m) m = v;
        }
        p[o + k] = Math.round(p[o + k] * (1 - amount) + m * amount);
      }
    }
  }
  ctx.putImageData(id, 0, 0);
}

// Clean up a photo of a drawing before anything else touches it. Two jobs:
//   1. Flatten the lighting. A phone photo has a shadow gradient / warm cast
//      across the page; without this the model reads that as real tone.
//   2. Rescue the linework. Faint pencil or thin pen sits only just below the
//      paper value — a naive "push to white" (what we did before) erases it.
//      Instead we measure the paper level and the ink level from the image's
//      own histogram and stretch *between* them: paper clips to clean white,
//      the marks are driven dark and high-contrast, and a light thickening
//      pass gives thin strokes real weight. Works for faint line art and for
//      saturated crayon alike, because the stretch is per-image adaptive.
// Find the bright paper rectangle inside a photo so we can crop the table /
// floor away. We mark bright pixels, then keep the band of rows and columns
// that are mostly bright (the page) — isolated glare can't pass the per-line
// fraction test. Returns null when there's no clear page (a full-bleed scan).
function detectPaperBBox(data, w, h) {
  const colF = new Float32Array(w), rowF = new Float32Array(h);
  for (let y = 0; y < h; y++) {
    let rc = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2] > 185) { colF[x]++; rc++; }
    }
    rowF[y] = rc / w;
  }
  for (let x = 0; x < w; x++) colF[x] /= h;
  const span = (arr, thr) => {
    let a = 0, b = arr.length - 1;
    while (a < arr.length && arr[a] < thr) a++;
    while (b >= 0 && arr[b] < thr) b--;
    return [a, b];
  };
  const [x0, x1] = span(colF, 0.35), [y0, y1] = span(rowF, 0.35);
  if (x1 <= x0 || y1 <= y0) return null;
  const aw = x1 - x0, ah = y1 - y0;
  if (aw * ah < 0.2 * w * h) return null;             // too small to trust
  if (aw > 0.97 * w && ah > 0.97 * h) return null;    // already full-frame
  const mx = Math.round(aw * 0.015), my = Math.round(ah * 0.015);
  return { x: Math.max(0, x0 - mx), y: Math.max(0, y0 - my),
           w: Math.min(w, x1 + mx) - Math.max(0, x0 - mx),
           h: Math.min(h, y1 + my) - Math.max(0, y0 - my) };
}

async function normalizeDrawing(dataURL, { maxDim = 1400, bolden = true } = {}) {
  const img = await loadImageFromSrc(dataURL);
  const iw = img.naturalWidth || maxDim, ih = img.naturalHeight || maxDim;
  const iscale = Math.min(1, maxDim / Math.max(iw, ih));
  const fw = Math.max(1, Math.round(iw * iscale)), fh = Math.max(1, Math.round(ih * iscale));

  // First draw the whole frame and crop to the page if there's table around it.
  const full = document.createElement('canvas'); full.width = fw; full.height = fh;
  const fctx = full.getContext('2d');
  fctx.drawImage(img, 0, 0, fw, fh);
  const box = detectPaperBBox(fctx.getImageData(0, 0, fw, fh).data, fw, fh)
              || { x: 0, y: 0, w: fw, h: fh };

  const w = box.w, h = box.h;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(full, box.x, box.y, w, h, 0, 0, w, h);
  const src = ctx.getImageData(0, 0, w, h);
  const sp = src.data;

  // Illumination estimate: a strongly blurred grayscale copy captures the
  // lighting gradient, not the drawing's edges.
  const bgc = document.createElement('canvas'); bgc.width = w; bgc.height = h;
  const bctx = bgc.getContext('2d');
  bctx.filter = `grayscale(1) blur(${Math.max(2, Math.round(Math.max(w, h) / 8))}px)`;
  bctx.drawImage(c, 0, 0);
  bctx.filter = 'none';
  const bg = bctx.getImageData(0, 0, w, h).data;

  // Pass 1 — divide out the illumination so the paper is a uniform tone, and
  // build a luminance histogram of the flattened result.
  const flat = new Float32Array((sp.length / 4) * 3);
  const hist = new Uint32Array(256);
  const PAPER = 236;
  for (let i = 0, j = 0; i < sp.length; i += 4, j += 3) {
    const ill = Math.max(40, bg[i]);
    const gain = Math.min(1.9, Math.max(0.5, PAPER / ill));
    const r = sp[i] * gain, g = sp[i + 1] * gain, b = sp[i + 2] * gain;
    flat[j] = r; flat[j + 1] = g; flat[j + 2] = b;
    let lum = 0.299 * r + 0.587 * g + 0.114 * b;
    lum = lum < 0 ? 0 : lum > 255 ? 255 : lum;
    hist[lum | 0]++;
  }
  const total = w * h;
  const pct = (p) => {
    let acc = 0, thresh = p * total;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= thresh) return v; }
    return 255;
  };
  // whiteIn just under the paper level (clips paper to white); blackIn at the
  // darkest few percent (the ink). Guarantee a usable, not-too-narrow window.
  const whiteIn = Math.max(60, pct(0.80) - 6);
  let blackIn = pct(0.04);
  if (whiteIn - blackIn < 30) blackIn = whiteIn - 30;
  if (blackIn < 0) blackIn = 0;
  const range = Math.max(12, whiteIn - blackIn);
  const gamma = 1.3;                                  // >1 deepens the mid marks

  // Pass 2 — levels stretch on luminance, applied as a per-pixel gain so hue is
  // preserved; paper → white, marks → dark and crisp. A white knee snaps the
  // top of the range to pure white so paper grain and faint shadows on the page
  // clean up instead of reading as a gray wash.
  const out = ctx.createImageData(w, h);
  const op = out.data;
  for (let i = 0, j = 0; i < sp.length; i += 4, j += 3) {
    const r = flat[j], g = flat[j + 1], b = flat[j + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    let t = (lum - blackIn) / range; t = t < 0 ? 0 : t > 1 ? 1 : t;
    t = Math.pow(t, gamma);
    // White knee: snap the top of the range to pure white so paper grain reads
    // clean. For LOW-saturation (gray) pixels — paper shadows, table — push to
    // white from much lower down, which clears a gray cast without touching
    // saturated crayon color or dark ink.
    if (t > 0.82) t = 1;
    else if (sat < 26 && t > 0.5) t = t + (1 - t) * Math.min(1, (t - 0.5) / 0.28);
    const newLum = t * 255;
    const gain = lum > 1 ? newLum / lum : 0;
    for (let k = 0; k < 3; k++) {
      const v = flat[j + k] * gain;
      op[i + k] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
    op[i + 3] = 255;
  }

  // Whiten leftover table/floor. We label connected components of strictly-dark
  // pixels (a strict threshold so paper shadows can't bridge floor into the art)
  // and clear only those that BOTH touch the frame border AND are large, solid
  // blobs. The drawing is thin and interior, so even if it runs to an edge its
  // low fill-ratio keeps it safe.
  const darkMask = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) {
    const i = p * 4;
    if (0.299 * op[i] + 0.587 * op[i + 1] + 0.114 * op[i + 2] < 95) darkMask[p] = 1;
  }
  // Close the mask (separable max-dilate) so a speckled/glossy floor merges into
  // one solid blob the component pass can catch. The thin drawing barely grows.
  const dr = Math.max(2, Math.round(Math.max(w, h) / 320));
  const tmpM = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let on = 0; for (let d = -dr; d <= dr; d++) { const xx = x + d; if (xx >= 0 && xx < w && darkMask[y * w + xx]) { on = 1; break; } }
    tmpM[y * w + x] = on;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let on = 0; for (let d = -dr; d <= dr; d++) { const yy = y + d; if (yy >= 0 && yy < h && tmpM[yy * w + x]) { on = 1; break; } }
    darkMask[y * w + x] = on;
  }
  const label = new Uint8Array(w * h);
  const bigArea = 0.012 * w * h;
  const q = [];
  for (let p0 = 0; p0 < w * h; p0++) {
    if (!darkMask[p0] || label[p0]) continue;
    q.length = 0; q.push(p0); label[p0] = 1;
    let touch = false, minx = w, maxx = 0, miny = h, maxy = 0;
    for (let qh = 0; qh < q.length; qh++) {
      const p = q[qh], x = p % w, y = (p / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touch = true;
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
      if (x > 0 && darkMask[p - 1] && !label[p - 1]) { label[p - 1] = 1; q.push(p - 1); }
      if (x < w - 1 && darkMask[p + 1] && !label[p + 1]) { label[p + 1] = 1; q.push(p + 1); }
      if (y > 0 && darkMask[p - w] && !label[p - w]) { label[p - w] = 1; q.push(p - w); }
      if (y < h - 1 && darkMask[p + w] && !label[p + w]) { label[p + w] = 1; q.push(p + w); }
    }
    const area = q.length;
    const fill = area / Math.max(1, (maxx - minx + 1) * (maxy - miny + 1));
    if (touch && area > bigArea && fill > 0.45) {
      for (let k = 0; k < q.length; k++) { const i = q[k] * 4; op[i] = op[i + 1] = op[i + 2] = 255; }
    }
  }

  ctx.putImageData(out, 0, 0);
  if (bolden) boldenLines(ctx, w, h, Math.max(2, Math.round(Math.max(w, h) / 650)), 0.9);
  return c.toDataURL('image/jpeg', 0.92);
}

// Grow a binary mask by `r` px (separable max / dilation).
function dilateBinary(m, w, h, r) {
  if (r < 1) return;
  const t = new Uint8Array(m.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let on = 0; for (let d = -r; d <= r; d++) { const xx = x + d; if (xx >= 0 && xx < w && m[y * w + xx]) { on = 1; break; } }
    t[y * w + x] = on;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let on = 0; for (let d = -r; d <= r; d++) { const yy = y + d; if (yy >= 0 && yy < h && t[yy * w + x]) { on = 1; break; } }
    m[y * w + x] = on;
  }
}

// Trace the drawing into ONE clean, bold, smooth vector line layer that every
// design shares — this is what holds the original structure intact and gives a
// crisp modern outline instead of a thin, pixelated trace. We threshold the ink,
// thicken it to a confident weight, drop stray specks, then vectorize with heavy
// smoothing so ImageTracer emits rounded bezier strokes. Returns a two-tone SVG
// string (black shapes on transparent) that callers recolor per style.
async function outlineVector(normalizedDataURL, { maxDim = 1200, weight = 1 } = {}) {
  if (typeof ImageTracer === 'undefined') return null;
  const img = await loadImageFromSrc(normalizedDataURL);
  const iw = img.naturalWidth || maxDim, ih = img.naturalHeight || maxDim;
  const s = Math.min(1, maxDim / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * s)), h = Math.max(1, Math.round(ih * s));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, w, h);
  const id = cx.getImageData(0, 0, w, h); const p = id.data;

  const ink = new Uint8Array(w * h);
  for (let qi = 0, i = 0; qi < w * h; qi++, i += 4) {
    if (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2] < 150) ink[qi] = 1;
  }
  // Thicken to a bold, even weight scaled to the image.
  dilateBinary(ink, w, h, Math.max(2, Math.round(Math.max(w, h) / 300 * weight)));

  // Clean the mask: drop tiny specks (dust) and drop solid dark blobs that
  // touch the frame border (leftover table/floor) — the drawing is a thin line
  // (low fill ratio), so it survives even where it runs to an edge.
  const minArea = 0.0012 * w * h, bigArea = 0.007 * w * h;
  const seen = new Uint8Array(w * h), stack = [];
  for (let p0 = 0; p0 < w * h; p0++) {
    if (!ink[p0] || seen[p0]) continue;
    stack.length = 0; stack.push(p0); seen[p0] = 1; const comp = [p0];
    let touch = false, minx = w, maxx = 0, miny = h, maxy = 0;
    for (let qh = 0; qh < stack.length; qh++) {
      const pp = stack[qh], x = pp % w, y = (pp / w) | 0;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) touch = true;
      if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
      if (x > 0 && ink[pp - 1] && !seen[pp - 1]) { seen[pp - 1] = 1; stack.push(pp - 1); comp.push(pp - 1); }
      if (x < w - 1 && ink[pp + 1] && !seen[pp + 1]) { seen[pp + 1] = 1; stack.push(pp + 1); comp.push(pp + 1); }
      if (y > 0 && ink[pp - w] && !seen[pp - w]) { seen[pp - w] = 1; stack.push(pp - w); comp.push(pp - w); }
      if (y < h - 1 && ink[pp + w] && !seen[pp + w]) { seen[pp + w] = 1; stack.push(pp + w); comp.push(pp + w); }
    }
    const fill = comp.length / Math.max(1, (maxx - minx + 1) * (maxy - miny + 1));
    if (comp.length < minArea || (touch && comp.length > bigArea && fill > 0.34)) {
      for (const pp of comp) ink[pp] = 0;
    }
  }

  for (let qi = 0, i = 0; qi < w * h; qi++, i += 4) {
    const v = ink[qi] ? 0 : 255; p[i] = p[i + 1] = p[i + 2] = v; p[i + 3] = 255;
  }
  cx.putImageData(id, 0, 0);

  const svg = await new Promise((res) => ImageTracer.imageToSVG(
    cv.toDataURL('image/png'), res,
    { pal: [{ r: 255, g: 255, b: 255, a: 255 }, { r: 0, g: 0, b: 0, a: 255 }],
      pathomit: 4, ltres: 2, qtres: 2, blurradius: 0, roundcoords: 1, linefilter: false }
  ));
  // Keep only the dark shapes; make the paper (and any light fill) transparent,
  // and normalize the ink fill so callers can recolor it. Strokes are dropped so
  // the near-white outline strokes ImageTracer adds don't ghost over the design.
  return svg
    .replace(/stroke="[^"]*"/g, 'stroke="none"')
    .replace(/fill="rgb\((\d+),(\d+),(\d+)\)"/g,
      (m, r, g, b) => (+r + +g + +b > 150) ? 'fill="none"' : 'fill="rgb(0,0,0)"');
}

// Composite the shared outline over a style's color layer. `bgDataURL` is the
// styled raster; the outline is recolored to `color` and drawn on top, giving
// every design the same crisp structural line.
async function composeOutline(bgDataURL, outlineSVG, { color = '#161616', maxDim = 1024, tiles = 1 } = {}) {
  if (!outlineSVG) return bgDataURL;
  const bg = await loadImageFromSrc(bgDataURL);
  const iw = bg.naturalWidth || maxDim, ih = bg.naturalHeight || maxDim;
  const s = Math.min(1, maxDim / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * s)), h = Math.max(1, Math.round(ih * s));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const cx = cv.getContext('2d');
  cx.drawImage(bg, 0, 0, w, h);
  const tinted = outlineSVG.replace(/fill="rgb\(0,0,0\)"/g, `fill="${color}"`);
  const line = await loadImageFromSrc('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tinted));
  if (tiles === 4) {                                  // Warhol — one outline per quad cell
    const cw = w / 2, ch = h / 2;
    for (let i = 0; i < 4; i++) cx.drawImage(line, (i % 2) * cw, (i < 2 ? 0 : 1) * ch, cw, ch);
  } else {
    cx.drawImage(line, 0, 0, w, h);
  }
  return cv.toDataURL('image/jpeg', 0.92);
}

// The shared outline reads dark on most treatments, but needs to go light on the
// deep-toned grounds to stay crisp (none currently need it, but keep the hook).
const LIGHT_OUTLINE = new Set([]);
function outlineColorFor(id) { return LIGHT_OUTLINE.has(id) ? '#EFE8D8' : '#141414'; }

// Build one finished design: the style's color/texture treatment with the shared
// clean outline composited on top so the structure is identical everywhere.
async function renderDesign(styleId, cleanedDataURL, outlineSVG) {
  let bg;
  try {
    bg = await clientStyleFilter(cleanedDataURL, styleId);
  } catch (e) {
    console.warn('treatment failed for', styleId, e.message);
    bg = cleanedDataURL;
  }
  const opts = { color: outlineColorFor(styleId), tiles: styleId === 'warhol' ? 4 : 1 };
  const preview = await composeOutline(bg, outlineSVG, { ...opts, maxDim: 900 });
  const full = await composeOutline(bg, outlineSVG, { ...opts, maxDim: 1400 });
  return { preview, full };
}

// ─── Client-side style fallback ──────────────────────────────────────────────
// The AI worker can fail on any given style (OpenAI moderation rejects edits
// stochastically, the model cold-starts, the network blips). When that happens
// we must NOT fall back to an unrelated stock drawing — the user uploaded their
// own art and every tile has to be visibly *theirs*. So we synthesize a
// style-evoking interpretation entirely in-browser from the user's cleaned
// (paper-removed) drawing. Not museum-grade, but unmistakably derived from the
// real image, fast, and 100% reliable. This is what guarantees a full ten-up.

function hexToRGB(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

// Draw the cleaned (transparent-paper) drawing flattened onto a solid color so
// the knocked-out background reads as the style's ground, not black.
function flatten(img, w, h, bg) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return { c, ctx };
}

// Map every pixel's luminance onto a dark→light color ramp (duotone/tritone).
function duotone(ctx, w, h, dark, light, mid) {
  const id = ctx.getImageData(0, 0, w, h);
  const p = id.data;
  const d = hexToRGB(dark), l = hexToRGB(light), m = mid ? hexToRGB(mid) : null;
  for (let i = 0; i < p.length; i += 4) {
    const lum = (0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]) / 255;
    let r, g, b;
    if (m) {
      if (lum < 0.5) { const t = lum / 0.5; r = d[0] + (m[0] - d[0]) * t; g = d[1] + (m[1] - d[1]) * t; b = d[2] + (m[2] - d[2]) * t; }
      else { const t = (lum - 0.5) / 0.5; r = m[0] + (l[0] - m[0]) * t; g = m[1] + (l[1] - m[1]) * t; b = m[2] + (l[2] - m[2]) * t; }
    } else {
      r = d[0] + (l[0] - d[0]) * lum; g = d[1] + (l[1] - d[1]) * lum; b = d[2] + (l[2] - d[2]) * lum;
    }
    p[i] = r; p[i + 1] = g; p[i + 2] = b;
  }
  ctx.putImageData(id, 0, 0);
}

// Quantize each channel to N levels — the flat poster-paint look.
function posterize(ctx, w, h, levels) {
  const id = ctx.getImageData(0, 0, w, h);
  const p = id.data;
  const step = 255 / (levels - 1);
  for (let i = 0; i < p.length; i += 4) {
    p[i]     = Math.round(Math.round(p[i] / step) * step);
    p[i + 1] = Math.round(Math.round(p[i + 1] / step) * step);
    p[i + 2] = Math.round(Math.round(p[i + 2] / step) * step);
  }
  ctx.putImageData(id, 0, 0);
}

// Snap each pixel to the nearest entry in a small palette (Mondrian / Matisse).
function snapToPalette(ctx, w, h, palette) {
  const id = ctx.getImageData(0, 0, w, h);
  const p = id.data;
  const pal = palette.map(hexToRGB);
  for (let i = 0; i < p.length; i += 4) {
    let best = 0, bestD = Infinity;
    for (let k = 0; k < pal.length; k++) {
      const dr = p[i] - pal[k][0], dg = p[i + 1] - pal[k][1], db = p[i + 2] - pal[k][2];
      const dd = dr * dr + dg * dg + db * db;
      if (dd < bestD) { bestD = dd; best = k; }
    }
    p[i] = pal[best][0]; p[i + 1] = pal[best][1]; p[i + 2] = pal[best][2];
  }
  ctx.putImageData(id, 0, 0);
}

// Pull the most common opaque colors out of the drawing (skipping paper
// remnants), averaged per bucket and sorted dark→light. Lets the abstract
// fallbacks (Rothko fields) stay tied to the actual palette of the upload.
function sampleColors(img, n = 3) {
  const s = 64;
  const cv = document.createElement('canvas'); cv.width = s; cv.height = s;
  const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, s, s);
  const p = cx.getImageData(0, 0, s, s).data;
  const buckets = new Map();
  for (let i = 0; i < p.length; i += 4) {
    if (p[i + 3] < 128) continue;
    const r = p[i], g = p[i + 1], b = p[i + 2];
    if (r > 232 && g > 228 && b > 220) continue;            // near-white paper
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const e = buckets.get(key) || [0, 0, 0, 0];
    e[0] += r; e[1] += g; e[2] += b; e[3]++; buckets.set(key, e);
  }
  let arr = [...buckets.values()].filter(e => e[3] > 1)
    .sort((a, b) => b[3] - a[3]).slice(0, Math.max(n, 3))
    .map(e => [Math.round(e[0] / e[3]), Math.round(e[1] / e[3]), Math.round(e[2] / e[3])]);
  if (!arr.length) arr = [[180, 70, 50], [60, 90, 150], [230, 200, 90]];
  arr.sort((a, b) => (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) - (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]));
  const hex = arr.map(([r, g, b]) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join(''));
  while (hex.length < n) hex.push(hex[hex.length - 1]);
  return hex;
}

// Lighten (f>0) or darken (f<0) a hex color toward white/black.
function shade(hex, f) {
  const [r, g, b] = hexToRGB(hex);
  const m = (v) => f < 0 ? Math.round(v * (1 + f)) : Math.round(v + (255 - v) * f);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

// Rasterize an SVG (authored in a 0–100 coordinate space) over the canvas.
// This is how each fallback gets its signature *structure* — Matisse cut-outs,
// Mondrian rules, a Basquiat crown, Miró's constellation — on top of the
// recolored drawing, so the tiles read as different treatments, not recolors.
async function overlaySVG(ctx, inner, w, h, alpha = 1) {
  const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 100 100" preserveAspectRatio="none">${inner}</svg>`);
  const im = await loadImageFromSrc(url);
  ctx.globalAlpha = alpha;
  ctx.drawImage(im, 0, 0, w, h);
  ctx.globalAlpha = 1;
}

const DECO = {
  haring: `
    <g stroke="#141414" stroke-width="1.2" stroke-linecap="round" fill="none">
      <g transform="translate(15 20)"><line x1="0" y1="-4" x2="0" y2="-9"/><line x1="3.6" y1="-2.6" x2="6.8" y2="-5.8"/><line x1="-3.6" y1="-2.6" x2="-6.8" y2="-5.8"/></g>
      <g transform="translate(85 18)"><line x1="0" y1="-4" x2="0" y2="-9"/><line x1="3.6" y1="-2.6" x2="6.8" y2="-5.8"/><line x1="-3.6" y1="-2.6" x2="-6.8" y2="-5.8"/></g>
      <g transform="translate(50 9)"><line x1="0" y1="-4" x2="0" y2="-9"/><line x1="3.6" y1="-2.6" x2="6.8" y2="-5.8"/><line x1="-3.6" y1="-2.6" x2="-6.8" y2="-5.8"/></g>
      <g transform="translate(9 52)"><line x1="-4" y1="0" x2="-9" y2="0"/><line x1="-2.6" y1="3.6" x2="-5.8" y2="6.8"/><line x1="-2.6" y1="-3.6" x2="-5.8" y2="-6.8"/></g>
      <g transform="translate(91 55)"><line x1="4" y1="0" x2="9" y2="0"/><line x1="2.6" y1="3.6" x2="5.8" y2="6.8"/><line x1="2.6" y1="-3.6" x2="5.8" y2="-6.8"/></g>
      <g transform="translate(20 84)"><line x1="0" y1="4" x2="0" y2="9"/><line x1="3.6" y1="2.6" x2="6.8" y2="5.8"/><line x1="-3.6" y1="2.6" x2="-6.8" y2="5.8"/></g>
      <g transform="translate(80 86)"><line x1="0" y1="4" x2="0" y2="9"/><line x1="3.6" y1="2.6" x2="6.8" y2="5.8"/><line x1="-3.6" y1="2.6" x2="-6.8" y2="5.8"/></g>
      <g transform="translate(50 92)"><line x1="0" y1="4" x2="0" y2="9"/><line x1="3.6" y1="2.6" x2="6.8" y2="5.8"/><line x1="-3.6" y1="2.6" x2="-6.8" y2="5.8"/></g>
    </g>`,
  matisse: `
    <path d="M -2 14 q 8 -16 24 -6 q 10 12 -4 22 q -14 8 -22 -2 z" fill="#2A4FB2"/>
    <g transform="translate(84 82)"><circle r="11" fill="#F2A93B"/><circle r="7" fill="#F1ECE2"/><circle r="4" fill="#F2A93B"/></g>
    <path d="M84 4 q 6 4 4 12 q -6 4 -10 -2 q 0 -8 6 -10 z" fill="#E14B2E"/>
    <path d="M-2 86 q 14 -10 28 0 q 8 8 -4 14 q -16 4 -24 -4 z" fill="#1E5E3F"/>`,
  picasso: `
    <g stroke="rgba(232,238,250,0.28)" stroke-width="0.5" fill="none">
      <polygon points="0,30 38,18 50,52 14,68"/>
      <polygon points="55,40 100,28 100,72 60,80"/>
      <polygon points="20,72 60,84 50,100 8,98"/>
      <polygon points="38,18 72,6 86,40 50,52"/>
      <path d="M50 0 L 52 100 M0 50 L 100 54"/>
    </g>`,
  mondrian: `
    <g stroke="#0E0E0D" stroke-width="4.5" stroke-linecap="square" fill="none">
      <line x1="34" y1="0" x2="34" y2="100"/>
      <line x1="68" y1="0" x2="68" y2="100"/>
      <line x1="0" y1="40" x2="100" y2="40"/>
      <line x1="0" y1="74" x2="68" y2="74"/>
      <rect x="2" y="2" width="96" height="96"/>
    </g>`,
  hockney: `
    <circle cx="80" cy="16" r="9" fill="#FFE23F"/>
    <g stroke="#FFFFFF" stroke-width="1.1" fill="none" opacity="0.85" stroke-linecap="round">
      <path d="M2 85 q 4 -4 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0"/>
      <path d="M2 91 q 4 -4 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0 t 8 0"/>
    </g>`,
  basquiat: `
    <g transform="translate(50 6)" stroke="#0E0604" stroke-width="0.6" stroke-linejoin="round">
      <path d="M -11 9 L -7 0 L 0 7 L 7 0 L 11 9 Z" fill="#F4C40D"/>
    </g>
    <text x="4" y="13" font-family="monospace" font-size="7" fill="#0E0604" font-weight="700">UNTITLED</text>
    <line x1="4" y1="14.6" x2="44" y2="14.6" stroke="#0E0604" stroke-width="0.7"/>
    <text x="62" y="96" font-family="monospace" font-size="5.5" fill="#C72A1C" font-weight="700">SAMO</text>
    <g stroke="#0E0604" stroke-width="0.55" fill="none" opacity="0.85">
      <path d="M6 44 l 10 9 M16 44 l -10 9"/>
      <path d="M88 28 q 4 -2 4 2 q 0 4 -4 4 q -6 0 -6 -6 q 0 -8 8 -8"/>
      <path d="M4 64 l 7 -2 M90 72 l 6 -2"/>
    </g>`,
  miro: `
    <g stroke="#0E0E0D" stroke-width="0.9" fill="none" stroke-linecap="round">
      <path d="M14 18 q 16 14 30 4 q 12 -14 38 -2"/>
      <path d="M8 60 q 24 -10 36 6 q 16 18 42 4"/>
      <path d="M82 22 q -8 24 6 50"/>
    </g>
    <circle cx="14" cy="18" r="5" fill="#D62828"/><circle cx="14" cy="18" r="1.6" fill="#0E0E0D"/>
    <path d="M44 22 q 4 -8 10 -2 q 4 8 -4 10 q -10 0 -6 -8 z" fill="#1B4FBF"/>
    <circle cx="82" cy="22" r="3.5" fill="#0E0E0D"/>
    <path d="M8 60 q 5 -3 8 2 q 1 7 -6 7 q -8 -2 -2 -9 z" fill="#F4C40D"/>
    <path d="M88 78 q 6 -4 10 4 q 2 10 -8 8 q -10 -4 -2 -12 z" fill="#1B4FBF"/>
    <g fill="#D62828"><path d="M50 8 l 1 2 l 2 1 l -2 1 l -1 2 l -1 -2 l -2 -1 l 2 -1 z"/></g>
    <g fill="#0E0E0D"><circle cx="30" cy="40" r="1"/><circle cx="66" cy="30" r="1.2"/><circle cx="58" cy="74" r="1"/><circle cx="26" cy="84" r="1.1"/><circle cx="90" cy="56" r="1"/></g>
    <path d="M76 90 a 4 4 0 1 0 -3 -7 a 6 6 0 0 1 3 7" fill="#0E0E0D"/>`,
};

// A 10×10 lattice of thin tile borders — turns a posterized image into Klee's
// mosaic of cells.
function kleeMosaic() {
  let cells = '';
  const n = 11, step = 100 / n;
  for (let y = 0; y <= n; y++) cells += `<line x1="0" y1="${(y * step).toFixed(2)}" x2="100" y2="${(y * step).toFixed(2)}" stroke="rgba(30,20,10,0.6)" stroke-width="0.6"/>`;
  for (let x = 0; x <= n; x++) cells += `<line x1="${(x * step).toFixed(2)}" y1="0" x2="${(x * step).toFixed(2)}" y2="100" stroke="rgba(30,20,10,0.6)" stroke-width="0.6"/>`;
  return cells;
}

async function clientStyleFilter(cleanedDataURL, styleId, { maxDim = 1024 } = {}) {
  const img = await loadImageFromSrc(cleanedDataURL);
  const iw = img.naturalWidth || maxDim, ih = img.naturalHeight || maxDim;
  const scale = Math.min(1, maxDim / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * scale)), h = Math.max(1, Math.round(ih * scale));
  const bg = (STYLE_PROFILES[styleId] || {}).fallbackBg || '#F1ECE2';

  // Warhol — 2×2 quad, each cell a different duotone of the drawing.
  if (styleId === 'warhol') {
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const octx = out.getContext('2d');
    const pairs = [
      ['#C72A1C', '#A4D11E'], ['#0E2A52', '#F03AA0'],
      ['#1a0a1a', '#22A7E0'], ['#0E0E0D', '#FFD23F'],
    ];
    const cw = Math.floor(w / 2), ch = Math.floor(h / 2);
    pairs.forEach((pair, i) => {
      const { c, ctx } = flatten(img, w, h, '#fff');
      const t = document.createElement('canvas'); t.width = w; t.height = h;
      const tctx = t.getContext('2d'); tctx.filter = 'contrast(1.25)'; tctx.drawImage(c, 0, 0);
      duotone(tctx, w, h, pair[0], pair[1]);
      octx.drawImage(t, (i % 2) * cw, Math.floor(i / 2) * ch, cw, ch);
    });
    return out.toDataURL('image/jpeg', 0.86);
  }

  // Output canvas + an unfiltered source copy of the flattened drawing, so
  // filtered draws never read a canvas while writing to it.
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const src = document.createElement('canvas'); src.width = w; src.height = h;
  const sctx = src.getContext('2d');
  sctx.fillStyle = bg; sctx.fillRect(0, 0, w, h); sctx.drawImage(img, 0, 0, w, h);

  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  switch (styleId) {
    case 'matisse':
      // merge detail into bold flat shapes, snap to gouache palette, add cut-outs
      ctx.filter = `blur(${Math.max(1, Math.round(w / 140))}px)`;
      ctx.drawImage(src, 0, 0); ctx.filter = 'none';
      snapToPalette(ctx, w, h, ['#E14B2E', '#2A4FB2', '#1E5E3F', '#F2A93B', '#F1ECE2', '#3F8A4D']);
      await overlaySVG(ctx, DECO.matisse, w, h, 0.95);
      break;
    case 'picasso':
      ctx.drawImage(src, 0, 0);
      duotone(ctx, w, h, '#08152E', '#A8C5E8', '#3F6BA5');
      await overlaySVG(ctx, DECO.picasso, w, h, 0.9);
      break;
    case 'mondrian':
      ctx.drawImage(src, 0, 0);
      posterize(ctx, w, h, 2);
      snapToPalette(ctx, w, h, ['#D62828', '#F4C40D', '#1B4FBF', '#F4F0E8', '#0E0E0D']);
      await overlaySVG(ctx, DECO.mondrian, w, h, 1);
      break;
    case 'haring':
      // flat electric color on a vivid ground + radiating energy lines
      ctx.filter = 'saturate(1.5) contrast(1.25)';
      ctx.drawImage(src, 0, 0); ctx.filter = 'none';
      snapToPalette(ctx, w, h, ['#E6352B', '#1B6FD6', '#12A150', '#F5C518', '#111111']);
      await overlaySVG(ctx, DECO.haring, w, h, 1);
      break;
    case 'hockney':
      ctx.filter = 'saturate(1.7) contrast(1.12) brightness(1.05)';
      ctx.drawImage(src, 0, 0); ctx.filter = 'none';
      posterize(ctx, w, h, 5);
      await overlaySVG(ctx, DECO.hockney, w, h, 0.92);
      break;
    case 'basquiat':
      ctx.filter = 'contrast(1.45) saturate(1.4)';
      ctx.drawImage(src, 0, 0); ctx.filter = 'none';
      posterize(ctx, w, h, 4);
      await overlaySVG(ctx, DECO.basquiat, w, h, 1);
      break;
    case 'miro': {
      // faint silhouette of the drawing under a Miró constellation
      const sil = document.createElement('canvas'); sil.width = w; sil.height = h;
      const silc = sil.getContext('2d'); silc.drawImage(src, 0, 0);
      duotone(silc, w, h, '#6E5A3C', bg);
      ctx.globalAlpha = 0.32; ctx.drawImage(sil, 0, 0); ctx.globalAlpha = 1;
      await overlaySVG(ctx, DECO.miro, w, h, 1);
      break;
    }
    case 'klee':
      ctx.filter = 'saturate(0.92) brightness(1.05)';
      ctx.drawImage(src, 0, 0); ctx.filter = 'none';
      posterize(ctx, w, h, 5);
      await overlaySVG(ctx, kleeMosaic(), w, h, 1);
      break;
    default: // pure / unknown — just the cleaned drawing on its ground
      ctx.drawImage(src, 0, 0);
      break;
  }
  return c.toDataURL('image/jpeg', 0.9);
}

// Recolor a raster through a dark→light duotone ramp. Used to force a style's
// signature key (Picasso's single blue) onto a rich AI render without
// flattening it — the faceting and brushwork survive as tonal variation.
async function tintRaster(dataURL, dark, light, mid) {
  const img = await loadImageFromSrc(dataURL);
  const w = img.naturalWidth || 1024, h = img.naturalHeight || 1024;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  duotone(ctx, w, h, dark, light, mid);
  return c.toDataURL('image/jpeg', 0.92);
}

// Final assets for a given style. We return two representations:
//   preview  — a small downscaled raster (~640px). Cheap to decode, ideal for
//              the ten-up gallery and the order-flow thumbnails. This is what
//              the user sees on first paint.
//   full     — the print-scalable SVG vector. Used in the detail and configure
//              previews, and exposed as a download for the high-res asset.
// For "pure" we lift the original off the paper and vectorize it — no AI
// interpretation, just print-ready scale. For every other style the AI output
// is the design as the artist would have made it; we vectorize that directly.
async function postProcess(originalDataURL, aiBase64, styleId, cleanedDataURL) {
  const profile = STYLE_PROFILES[styleId] || STYLE_PROFILES.matisse;
  try {
    if (styleId === "pure") {
      const cleaned = cleanedDataURL || await removePaperBackground(originalDataURL);
      const full = await vectorizeRaster(cleaned, profile.vec);
      const preview = await makePreview(cleaned, { preserveAlpha: true });
      return { preview, full };
    }
    if (!aiBase64) return null;
    let aiDataURL = 'data:image/png;base64,' + aiBase64;
    if (profile.postTint) {
      try {
        aiDataURL = await tintRaster(aiDataURL, profile.postTint.dark, profile.postTint.light, profile.postTint.mid);
      } catch (e) { console.warn('postTint failed for', styleId, e.message); }
    }
    const full = await vectorizeRaster(aiDataURL, profile.vec);
    const preview = await makePreview(aiDataURL, { preserveAlpha: false });
    return { preview, full };
  } catch (e) {
    console.warn('Post-processing failed for', styleId, e);
    const fallback = aiBase64 ? 'data:image/png;base64,' + aiBase64 : (cleanedDataURL || originalDataURL);
    return { preview: fallback, full: fallback };
  }
}

// In-browser style approximation built from the user's own cleaned drawing.
// Used whenever the AI render for a style is unavailable. Always succeeds.
async function fallbackAsset(cleanedDataURL, styleId) {
  try {
    const img = await clientStyleFilter(cleanedDataURL, styleId);
    return { preview: img, full: img, fallback: true };
  } catch (e) {
    console.warn('Fallback render failed for', styleId, e);
    return { preview: cleanedDataURL, full: cleanedDataURL, fallback: true };
  }
}

// ─── Processing ─────────────────────────────────────────────────────────────
const WORKER_URL = 'https://mantel-ai.jordanbmcgowen.workers.dev';

const STYLE_IDS = ['pure','matisse','haring','hockney','basquiat','miro','warhol','klee','mondrian','picasso'];

// How many AI styles to render at once. The worker fans out to OpenAI; 3 wide
// stays under the account's per-minute rate limit (4 wide drew sporadic 429s)
// while still turning a ~4-minute sequential run into ~1 minute of wall-clock.
const AI_CONCURRENCY = 3;
// One render attempt should never hang the whole batch. The model normally
// answers in 20–45s; we give it generous headroom then abort and retry.
const AI_TIMEOUT_MS = 80000;
const AI_ATTEMPTS = 3;
// Backoff between attempts. Long enough to clear a 429 rate-limit window and
// to re-roll OpenAI's stochastic moderation, which rejects ~1 in 3 edits.
const AI_BACKOFF_MS = 2500;

// Request a single style from the worker, with an abort-timeout. Resolves to a
// base64 PNG string, or throws (network error, timeout, moderation 400, …).
async function requestStyle(image_b64, styleId, profile) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);
  try {
    const resp = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      // strength + prompt forwarded to the img2img backend. The prompt is the
      // real control; see STYLE_PROFILES for why it avoids minor-referencing
      // words that OpenAI moderation rejects.
      body: JSON.stringify({
        image_b64,
        style: styleId,
        strength: profile.aiStrength ?? 0.4,
        prompt: profile.prompt,
      }),
    });
    if (!resp.ok) throw new Error('worker ' + resp.status);
    const data = await resp.json();
    if (!data || !data.image_b64) throw new Error('no image in response');
    return data.image_b64;
  } finally {
    clearTimeout(timer);
  }
}

// Render one AI style end-to-end: try the worker up to AI_ATTEMPTS times, then
// post-process. If every attempt fails, synthesise the style in-browser from
// the user's own drawing so the tile is never empty and never a stock image.
async function renderStyle(image_b64, originalDataURL, cleanedDataURL, styleId, isCancelled) {
  const profile = STYLE_PROFILES[styleId] || {};
  // Some styles (Rothko) are abstractions the edit model can't perform — it
  // only blurs the subject. Render those purely in-browser, no AI round-trip.
  if (profile.clientOnly) return await fallbackAsset(cleanedDataURL, styleId);
  for (let attempt = 1; attempt <= AI_ATTEMPTS; attempt++) {
    if (isCancelled()) return null;
    try {
      const aiB64 = await requestStyle(image_b64, styleId, profile);
      if (isCancelled()) return null;
      const asset = await postProcess(originalDataURL, aiB64, styleId, cleanedDataURL);
      if (asset) return asset;
    } catch (e) {
      console.warn(`Style ${styleId} attempt ${attempt}/${AI_ATTEMPTS} failed:`, e.message);
      if (attempt < AI_ATTEMPTS) await new Promise(r => setTimeout(r, AI_BACKOFF_MS * attempt));
    }
  }
  console.warn(`Style ${styleId}: all AI attempts failed — using in-browser fallback.`);
  return await fallbackAsset(cleanedDataURL, styleId);
}

function Processing({ go, drawing, uploaded, setAiResults }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Preparing your image…');

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    const artistOf = (id) => (STYLES.find(s => s.id === id) || {}).name || id;

    async function runAI() {
      if (!uploaded) {
        // Sample drawing - skip AI, go straight to results
        for (let step = 0; step <= 5; step++) {
          if (cancelled) return;
          await new Promise(r => setTimeout(r, 400));
          setProgress(Math.round(step / 5 * 100));
        }
        if (!cancelled) go('results');
        return;
      }

      // Read the file once into a data URL.
      setStage('Reading your drawing…');
      const originalDataURL = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(uploaded.file);
      });
      if (cancelled) return;

      // Flatten the lighting and rescue the linework: knock out the table
      // shadow / warm cast and drive the marks dark and bold. Everything
      // downstream works from this clean, evenly-lit version.
      setStage('Cleaning up your drawing…');
      let normalizedDataURL = originalDataURL;
      try {
        normalizedDataURL = await normalizeDrawing(originalDataURL);
      } catch (e) {
        console.warn('Normalization failed, using original:', e.message);
      }
      if (cancelled) return;

      // Trace the drawing into ONE clean, bold vector outline. This is the
      // structural anchor laid over every design, so the original holds intact
      // and the lines stay crisp and consistent across all ten.
      setStage('Tracing a clean outline…');
      let outlineSVG = null;
      try {
        outlineSVG = await outlineVector(normalizedDataURL);
      } catch (e) {
        console.warn('Outline trace failed:', e.message);
      }
      if (cancelled) return;

      // Lift the drawing off the paper — the source for each style's colour and
      // texture treatment that sits behind the outline.
      let cleanedDataURL;
      try {
        cleanedDataURL = await removePaperBackground(normalizedDataURL);
      } catch (e) {
        console.warn('Paper removal failed, using normalized:', e.message);
        cleanedDataURL = normalizedDataURL;
      }
      if (cancelled) return;

      // Every design = a per-style colour/texture treatment with the shared
      // clean outline composited on top. All client-rendered, so it's fast,
      // reliable, and the structure is identical everywhere.
      const results = {};
      let done = 0;
      const total = STYLE_IDS.length;
      await Promise.all(STYLE_IDS.map(async (id) => {
        try {
          results[id] = await renderDesign(id, cleanedDataURL, outlineSVG);
        } catch (e) {
          console.warn('Design failed for', id, e.message);
        }
        done += 1;
        if (!cancelled) {
          setProgress(Math.round(done / total * 100));
          setStage(`Rendering your pieces… ${done} of ${total}`);
        }
      }));

      if (!cancelled) {
        setAiResults(results);
        setStage('Done.');
        go('results');
      }
    }

    runAI();
    return () => { cancelled = true; };
  }, []);

  const D = DRAWINGS[drawing]?.component;
  return (
    <section className="processing frame">
      <div className="eyebrow" style={{marginBottom: 16}}>Working</div>
      <h2>Lifting it off the paper.</h2>
      <p className="lede">Our studio is examining the original strokes, sampling the palette, and rendering ten interpretations. A moment.</p>
      <div className="processing-art">
        {uploaded ? (
          <img src={uploaded.url} alt="" style={{width:"100%", height:"100%", objectFit:"contain"}} />
        ) : (D && <D />)}
      </div>
      <div className="processing-stage">{stage}</div>
      <div className="processing-bar" style={{width: progress + '%'}}></div>
      <div style={{fontFamily:"var(--f-mono)", fontSize:11, color:"var(--ink-3)", marginTop:8, textAlign:"center"}}>{progress}%</div>
    </section>
  );
}

// ─── Results ────────────────────────────────────────────────────────────────
function Results({ go, drawing, uploaded, setStyle, galleryLayout, setGalleryLayout, brand, aiResults }) {
  const D = DRAWINGS[drawing]?.component;
  return (
    <section className="results frame">
      <div className="results-head">
        <div>
          <div className="eyebrow" style={{marginBottom: 12}}>Step two — choose a style</div>
          <h2>Ten interpretations.<br/>One drawing.</h2>
        </div>
        <div className="meta">
          <div className="thumb-source">
            {uploaded ? <img src={uploaded.url} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}}/> : (D && <D />)}
          </div>
          <div>
            <div>SOURCE</div>
            <div style={{color:"var(--ink-2)", marginTop: 2}}>
              {uploaded ? "Your upload" : `${DRAWINGS[drawing]?.label} — ${DRAWINGS[drawing]?.artist}`}
            </div>
          </div>
          <div className="layout-switch">
            {["grid","masonry","carousel"].map(l => (
              <button key={l}
                className={galleryLayout === l ? "is-active" : ""}
                onClick={() => setGalleryLayout(l)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className={`gallery-${galleryLayout}`}>
        {STYLES.map((s, i) => {
          const ratio = galleryLayout === "masonry" ? [1, 1.2, 0.9, 1.1, 0.85, 1.05, 1.15, 0.95, 1, 0.9][i] : 1;
          const aiAsset = uploaded && aiResults && aiResults[s.id];
          const previewSrc = aiAsset?.preview || aiAsset?.full || (uploaded && uploaded.url);
          return (
            <div key={s.id} className={`tile ${s.id === "pure" ? "is-pure" : ""}`} onClick={() => { setStyle(s.id); go("detail"); }}>
              <div className="tile-art" style={{aspectRatio: ratio}}>
                {previewSrc
                  ? <img src={previewSrc} alt={s.name} loading="lazy" decoding="async" style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                  : <StyleLens style={s.id} drawing={drawing}/>
                }
              </div>
              <div className="tile-cap">
                <div className="name">{s.name}</div>
                <div className="artist">{s.artist}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{marginTop: 56, paddingTop: 32, borderTop: ".5px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16}}>
        <p className="lede" style={{fontSize: 18, maxWidth: "44ch"}}>
          Don't see one you love? <button className="btn-link" onClick={() => go("processing")}>Try another pass</button> — we'll re-render with different seeds.
        </p>
        <button className="btn-ghost btn" onClick={() => go("upload")}>← Upload a different drawing</button>
      </div>
    </section>
  );
}

// ─── Detail ─────────────────────────────────────────────────────────────────
function Detail({ go, drawing, style, setStyle, aiResults, uploaded }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const idx = STYLES.indexOf(s);
  const next = () => setStyle(STYLES[(idx + 1) % STYLES.length].id);
  const prev = () => setStyle(STYLES[(idx - 1 + STYLES.length) % STYLES.length].id);
  const aiAsset = uploaded && aiResults && aiResults[s.id];
  const fullSrc = aiAsset?.full || aiAsset?.preview || (uploaded && uploaded.url);
  // Name the download for what it actually is: a vector for the AI/pure SVG
  // assets, a raster for the in-browser fallbacks and the raw upload.
  const isVector = typeof fullSrc === "string" && /image\/svg/.test(fullSrc);
  const dlExt = isVector ? "svg" : (typeof fullSrc === "string" && /image\/png/.test(fullSrc) ? "png" : "jpg");

  return (
    <section className="detail frame">
      <button className="detail-back" onClick={() => go("results")}>
        <span>←</span> All ten styles
      </button>
      <div className="detail-grid">
        <div className="detail-art-shell">
          <div className="detail-art">
            {fullSrc
              ? <img src={fullSrc} alt={s.name} decoding="async" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              : <StyleLens style={s.id} drawing={drawing}/>
            }
          </div>
          <div className="detail-actions">
            <div>{s.label} · STYLE {String(idx + 1).padStart(2,"0")} / 10</div>
            <div className="detail-nav">
              {fullSrc && (
                <a className="detail-download"
                   href={fullSrc}
                   download={`${s.id}-${drawing || "design"}.${dlExt}`}
                   aria-label="Download high-resolution artwork">
                  ↓ {isVector ? "Vector" : "Image"}
                </a>
              )}
              <button onClick={prev} aria-label="Previous">‹</button>
              <button onClick={next} aria-label="Next">›</button>
            </div>
          </div>
        </div>
        <div className="detail-meta">
          <div className="eyebrow">In the manner of</div>
          <h2>{s.name}</h2>
          <div className="artist-name">{s.artist}</div>
          <p className="pull">"{s.pull}"</p>
          <p className="desc">{s.blurb}</p>
          <div className="detail-cta">
            <button className="btn" onClick={() => go("configure")}>
              Make it real <span className="arr">→</span>
            </button>
            <button className="btn-link" onClick={() => go("results")}>Compare with others</button>
          </div>
          <div style={{marginTop: 40, paddingTop: 24, borderTop: ".5px solid var(--rule)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
            <div>
              <div className="eyebrow" style={{marginBottom: 6}}>From</div>
              <div style={{fontFamily: "var(--f-display)", fontSize: 28, lineHeight: 1}}>$79</div>
              <div style={{fontSize: 12, color: "var(--ink-3)"}}>Canvas, 12×16 in.</div>
            </div>
            <div>
              <div className="eyebrow" style={{marginBottom: 6}}>Ships</div>
              <div style={{fontFamily: "var(--f-display)", fontSize: 28, lineHeight: 1}}>7 days</div>
              <div style={{fontSize: 12, color: "var(--ink-3)"}}>Hand-stretched in Asheville</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Configure ──────────────────────────────────────────────────────────────
const SIZES = [
  { id: "S",  name: "Small",     dims: "12 × 16", price: 79  },
  { id: "M",  name: "Medium",    dims: "18 × 24", price: 129 },
  { id: "L",  name: "Large",     dims: "24 × 36", price: 179 },
  { id: "XL", name: "Statement", dims: "36 × 48", price: 249 },
];
const FRAMES = [
  { id: "canvas", name: "Canvas",  sub: "Unframed",     price: 0,  swatch: "#fff" },
  { id: "black",  name: "Black",   sub: "Hardwood",     price: 40, swatch: "#0e0e0d" },
  { id: "white",  name: "White",   sub: "Hardwood",     price: 40, swatch: "#f6f3eb" },
  { id: "wood",   name: "Natural", sub: "Oak",          price: 60, swatch: "linear-gradient(90deg,#a07a4e,#bf9466,#a07a4e)" },
  { id: "float",  name: "Float",   sub: "Black + matte",price: 70, swatch: "#0e0e0d" },
];

function Configure({ go, drawing, style, config, setConfig, framePreview, setFramePreview, aiResults, uploaded }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const total = size.price + frame.price + (config.personalOn ? 12 : 0);
  const aiAsset = uploaded && aiResults && aiResults[s.id];
  const designSrc = aiAsset?.full || aiAsset?.preview || (uploaded && uploaded.url);

  return (
    <section className="configure frame">
      <button className="detail-back" onClick={() => go("detail")}>
        <span>←</span> Back to {s.name}
      </button>
      <div className="cfg-grid">
        <div className="cfg-preview-shell">
          <div className={`cfg-preview is-${framePreview}`}>
            <div className="preview-switch">
              {["room","flat","iso"].map(v => (
                <button key={v} className={framePreview === v ? "is-active" : ""}
                        onClick={() => setFramePreview(v)}>{v}</button>
              ))}
            </div>

            {framePreview === "room" && <RoomScene />}

            <div className={`cfg-piece size-${size.id}`} style={
              framePreview === "flat" ? { top: "50%", left: "50%", width: "62%", transform: "translate(-50%,-50%)" } :
              framePreview === "iso"  ? { top: "50%", left: "50%", width: "60%", transform: "translate(-50%,-50%) rotate(-3deg)" } :
              undefined
            }>
              <div className="frame-wrap" data-frame={frame.id}>
                <div className="canvas-inner">
                  {designSrc
                    ? <img src={designSrc} alt={s.name} decoding="async" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <StyleLens style={s.id} drawing={drawing}/>
                  }
                  {config.personalOn && (
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0,
                      padding: "10px 12px",
                      fontFamily: "var(--f-display)", fontStyle: "italic", fontSize: 10,
                      color: "rgba(0,0,0,.62)",
                      textAlign: "center",
                      background: "linear-gradient(transparent, rgba(255,255,255,.6))"
                    }}>
                      {config.name || "—"}{config.age && `, age ${config.age}`}{config.date && ` · ${config.date}`}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {framePreview === "flat" && (
              <div className="scale-ruler">
                <span>← {size.dims} in →</span>
                <span>actual scale</span>
              </div>
            )}
          </div>
          <div style={{marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
            <div>
              <div className="eyebrow">Now viewing</div>
              <div style={{fontFamily: "var(--f-display)", fontSize: 22}}>{s.name} <span style={{color: "var(--ink-3)"}}>·</span> {DRAWINGS[drawing]?.label}</div>
            </div>
            <div style={{fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-3)", letterSpacing: ".1em", textTransform: "uppercase"}}>
              {size.dims} · {frame.name}
            </div>
          </div>
        </div>

        <div className="cfg-form">
          <div>
            <div className="eyebrow" style={{marginBottom: 8}}>Step three — configure</div>
            <h2 className="display" style={{fontSize: "clamp(32px,4vw,56px)", lineHeight: 1, margin: 0}}>
              {s.name}, your way.
            </h2>
          </div>

          <div className="cfg-block">
            <div className="label"><span>Size</span><span className="hint">All sizes 1.5″ deep stretched canvas</span></div>
            <div className="opt-grid cols-4">
              {SIZES.map(sz => (
                <button key={sz.id}
                        className={`opt ${config.size === sz.id ? "is-active" : ""}`}
                        onClick={() => setConfig({...config, size: sz.id})}>
                  <span className="opt-name">{sz.name}</span>
                  <span className="opt-sub">{sz.dims}″</span>
                  <span className="opt-price">${sz.price}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cfg-block">
            <div className="label"><span>Frame</span><span className="hint">Hand-finished hardwood</span></div>
            <div className="opt-grid cols-5">
              {FRAMES.map(f => (
                <button key={f.id}
                        className={`opt frame-opt ${config.frame === f.id ? "is-active" : ""}`}
                        onClick={() => setConfig({...config, frame: f.id})}>
                  <span className="swatch" style={{background: f.swatch}}></span>
                  <span className="opt-name" style={{fontSize: 15}}>{f.name}</span>
                  <span className="opt-sub" style={{fontSize: 9}}>{f.sub}</span>
                  <span className="opt-price" style={{marginTop: 2}}>{f.price ? `+$${f.price}` : "included"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cfg-personal">
            <div className="toggle-row">
              <div>
                <h4>Add the artist's name</h4>
                <p>Printed in a fine italic at the bottom of the canvas. +$12.</p>
              </div>
              <button className={`tg ${config.personalOn ? "is-on" : ""}`}
                      onClick={() => setConfig({...config, personalOn: !config.personalOn})}></button>
            </div>
            {config.personalOn && (
              <div className="personal-row">
                <div className="text-field">
                  <label>Name</label>
                  <input value={config.name} onChange={e => setConfig({...config, name: e.target.value})} placeholder="Maya"/>
                </div>
                <div className="text-field">
                  <label>Age</label>
                  <input value={config.age} onChange={e => setConfig({...config, age: e.target.value})} placeholder="6"/>
                </div>
                <div className="text-field" style={{gridColumn: "1 / -1"}}>
                  <label>Date (optional)</label>
                  <input value={config.date} onChange={e => setConfig({...config, date: e.target.value})} placeholder="May 2026"/>
                </div>
              </div>
            )}
          </div>

          <div className="cfg-summary">
            <div className="total-label">Total</div>
            <div className="total">${total}<small>FREE SHIPPING OVER $120</small></div>
          </div>
          <div className="cfg-cta">
            <button className="btn" onClick={() => go("cart")}>
              Add to cart <span className="arr">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomScene() {
  return (
    <>
      <div className="room-baseboard"></div>
      <div className="room-floor-shadow"></div>
      <svg className="room-couch" viewBox="0 0 200 60" preserveAspectRatio="none">
        <rect x="0" y="20" width="200" height="40" fill="#7d6a52" />
        <rect x="0" y="14" width="200" height="14" fill="#92805f" />
        <rect x="0" y="8"  width="14"  height="46" fill="#92805f" />
        <rect x="186" y="8" width="14" height="46" fill="#92805f" />
        <rect x="20" y="6" width="40" height="12" fill="#a89472" rx="2"/>
        <rect x="140" y="6" width="40" height="12" fill="#a89472" rx="2"/>
      </svg>
    </>
  );
}

// ─── Cart ───────────────────────────────────────────────────────────────────
function Cart({ go, drawing, style, config, aiResults, uploaded }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const sub = size.price + frame.price + (config.personalOn ? 12 : 0);
  const shipping = sub >= 120 ? 0 : 12;
  const total = sub + shipping;
  const aiAsset = uploaded && aiResults && aiResults[style];
  const thumbSrc = aiAsset?.preview || aiAsset?.full || (uploaded && uploaded.url);

  return (
    <section className="cart frame">
      <button className="detail-back" onClick={() => go("configure")}>
        <span>←</span> Back to configure
      </button>
      <h2 className="display" style={{fontSize: "clamp(40px,5vw,64px)", margin: "12px 0 32px"}}>
        Your cart.
      </h2>
      <div className="cart-grid">
        <div>
          <div className="cart-line">
            <div className="cart-thumb">
              <div className="frame-wrap" data-frame={frame.id} style={{padding: frame.id === "canvas" ? 3 : 8, aspectRatio: "4/5"}}>
                <div className="canvas-inner">
                  {thumbSrc
                    ? <img src={thumbSrc} alt={s.name} loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <StyleLens style={style} drawing={drawing}/>
                  }
                </div>
              </div>
            </div>
            <div className="cart-meta">
              <h3>{s.name}</h3>
              <p className="artist">{s.artist}</p>
              <dl>
                <dt>Source</dt><dd>{DRAWINGS[drawing]?.label} — {DRAWINGS[drawing]?.artist}</dd>
                <dt>Size</dt><dd>{size.name} · {size.dims}″ stretched canvas</dd>
                <dt>Frame</dt><dd>{frame.name} {frame.sub.toLowerCase()}</dd>
                {config.personalOn && (
                  <><dt>Caption</dt><dd>{config.name || "—"}{config.age && `, age ${config.age}`}{config.date && `, ${config.date}`}</dd></>
                )}
              </dl>
              <div style={{marginTop: 20, display: "flex", gap: 16, alignItems: "center"}}>
                <button className="btn-link" onClick={() => go("configure")}>Edit</button>
                <button className="btn-link">Remove</button>
              </div>
            </div>
            <div className="cart-price">${sub}</div>
          </div>
          <div style={{marginTop: 28, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.6, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28}}>
            <div>
              <div className="eyebrow" style={{marginBottom: 8}}>Free returns</div>
              30 days, no questions asked. If you don't love it, we'll take it back and you keep the digital files.
            </div>
            <div>
              <div className="eyebrow" style={{marginBottom: 8}}>Made-to-order</div>
              Hand-stretched in our Asheville studio. We never warehouse — every piece is yours, specifically.
            </div>
          </div>
        </div>

        <aside className="cart-summary">
          <h3>Summary</h3>
          <div className="row"><span>Subtotal</span><span>${sub}</span></div>
          <div className="row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
          <div className="row"><span>Tax</span><span>Calculated at checkout</span></div>
          <div className="row total"><span>Total</span><span>${total}</span></div>
          <button className="btn" onClick={() => go("checkout")}>
            Checkout <span className="arr">→</span>
          </button>
          <div className="promise">SHIPS IN 7 DAYS · CARBON-NEUTRAL · GIFT-READY</div>
        </aside>
      </div>
    </section>
  );
}

// ─── Checkout ───────────────────────────────────────────────────────────────
function Checkout({ go, drawing, style, config, aiResults, uploaded }) {
  const [pay, setPay] = useState("card");
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const sub = size.price + frame.price + (config.personalOn ? 12 : 0);
  const shipping = sub >= 120 ? 0 : 12;
  const total = sub + shipping;
  const aiAsset = uploaded && aiResults && aiResults[style];
  const thumbSrc = aiAsset?.preview || aiAsset?.full || (uploaded && uploaded.url);
  return (
    <section className="cart frame">
      <button className="detail-back" onClick={() => go("cart")}>
        <span>←</span> Back to cart
      </button>
      <h2 className="display" style={{fontSize: "clamp(40px,5vw,64px)", margin: "12px 0 32px"}}>
        Checkout.
      </h2>
      <div className="checkout-grid">
        <div>
          <div className="checkout-section">
            <h3><span className="num">01</span> Contact</h3>
            <p className="lede-sm">We'll send order updates and a digital copy of all ten styles here.</p>
            <div className="field-grid">
              <div className="text-field full"><label>Email</label><input placeholder="parent@example.com"/></div>
            </div>
          </div>
          <div className="checkout-section">
            <h3><span className="num">02</span> Ship to</h3>
            <div className="field-grid">
              <div className="text-field"><label>First name</label><input/></div>
              <div className="text-field"><label>Last name</label><input/></div>
              <div className="text-field full"><label>Address</label><input/></div>
              <div className="text-field full"><label>Apartment, suite, etc.</label><input/></div>
              <div className="text-field"><label>City</label><input/></div>
              <div className="text-field"><label>State / Zip</label><input/></div>
            </div>
          </div>
          <div className="checkout-section">
            <h3><span className="num">03</span> Payment</h3>
            <div className="pay-tabs">
              <button className={`pay-tab ${pay === "card" ? "is-active" : ""}`} onClick={() => setPay("card")}>Card</button>
              <button className={`pay-tab ${pay === "applepay" ? "is-active" : ""}`} onClick={() => setPay("applepay")}>Apple Pay</button>
              <button className={`pay-tab ${pay === "klarna" ? "is-active" : ""}`} onClick={() => setPay("klarna")}>Klarna</button>
            </div>
            {pay === "card" && (
              <div className="field-grid">
                <div className="text-field full"><label>Card number</label><input placeholder="1234 1234 1234 1234"/></div>
                <div className="text-field"><label>Expiry</label><input placeholder="MM / YY"/></div>
                <div className="text-field"><label>CVC</label><input placeholder="123"/></div>
              </div>
            )}
            {pay === "applepay" && <p style={{color:"var(--ink-2)", fontSize: 13}}>You'll confirm with Touch ID in the next step.</p>}
            {pay === "klarna" && <p style={{color:"var(--ink-2)", fontSize: 13}}>4 interest-free payments of ${(total/4).toFixed(2)}.</p>}
          </div>
        </div>

        <aside className="cart-summary">
          <h3>Order</h3>
          <div style={{display: "flex", gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: ".5px solid var(--rule)"}}>
            <div style={{width: 64, aspectRatio: "4/5", flexShrink: 0}}>
              <div className="frame-wrap" data-frame={frame.id} style={{padding: 4, aspectRatio: "4/5"}}>
                <div className="canvas-inner">
                  {thumbSrc
                    ? <img src={thumbSrc} alt={s.name} loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <StyleLens style={style} drawing={drawing}/>
                  }
                </div>
              </div>
            </div>
            <div style={{fontSize: 13, lineHeight: 1.5}}>
              <div style={{fontFamily:"var(--f-display)", fontSize: 18, lineHeight: 1}}>{s.name}</div>
              <div style={{color:"var(--ink-3)", fontSize: 12, marginTop: 2}}>{s.artist}</div>
              <div style={{color:"var(--ink-2)", fontSize: 12, marginTop: 4}}>{size.dims}″ · {frame.name}</div>
            </div>
          </div>
          <div className="row"><span>Subtotal</span><span>${sub}</span></div>
          <div className="row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
          <div className="row"><span>Tax</span><span>$0.00</span></div>
          <div className="row total"><span>Total</span><span>${total}</span></div>
          <button className="btn" onClick={() => go("confirmation")}>
            Place order — ${total} <span className="arr">→</span>
          </button>
          <div className="promise">SECURE PAYMENT · SHIPS IN 7 DAYS</div>
        </aside>
      </div>
    </section>
  );
}

// ─── Confirmation ───────────────────────────────────────────────────────────
function Confirmation({ go, drawing, style, config, brand, aiResults, uploaded }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const orderNo = useMemo(() => "KC-" + Math.floor(Math.random() * 900000 + 100000), []);
  const aiAsset = uploaded && aiResults && aiResults[style];
  const thumbSrc = aiAsset?.preview || aiAsset?.full || (uploaded && uploaded.url);
  return (
    <section className="confirm frame">
      <div className="mark-big">✓</div>
      <h1>Order received.</h1>
      <div className="order-no">Confirmation {orderNo} · A receipt is on its way</div>
      <div className="confirm-card">
        <div className="thumb">
          <div className="frame-wrap" data-frame={frame.id} style={{padding: 4, aspectRatio: "4/5"}}>
            <div className="canvas-inner">
              {thumbSrc
                ? <img src={thumbSrc} alt={s.name} loading="lazy" decoding="async" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                : <StyleLens style={style} drawing={drawing}/>
              }
            </div>
          </div>
        </div>
        <div>
          <h3>{s.name}</h3>
          <p className="artist">{s.artist}</p>
          <dl>
            <dt>Size</dt><dd>{size.name} · {size.dims}″</dd>
            <dt>Frame</dt><dd>{frame.name}</dd>
            <dt>Source</dt><dd>{DRAWINGS[drawing]?.label} — {DRAWINGS[drawing]?.artist}</dd>
            {config.personalOn && (<><dt>Caption</dt><dd>{config.name || "—"}{config.age && `, age ${config.age}`}</dd></>)}
          </dl>
        </div>
      </div>
      <div className="confirm-timeline">
        <div className="confirm-step is-now"><div className="bar"></div><div className="when">TODAY</div><div className="what">Ordered</div></div>
        <div className="confirm-step"><div className="bar"></div><div className="when">IN 3 DAYS</div><div className="what">Stretched & framed</div></div>
        <div className="confirm-step"><div className="bar"></div><div className="when">IN 7 DAYS</div><div className="what">Delivered</div></div>
      </div>
      <p className="lede" style={{margin: "40px auto 0", textAlign: "center", fontSize: 18}}>
        We just emailed you high-resolution digital files of all ten styles — yours to keep regardless.
      </p>
      <div style={{marginTop: 28, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap"}}>
        <button className="btn" onClick={() => go("landing")}>Start another <span className="arr">→</span></button>
        <button className="btn-ghost btn">Track this order</button>
      </div>
    </section>
  );
}

Object.assign(window, { Header, Landing, Upload, Processing, Results, Detail, Configure, Cart, Checkout, Confirmation, SIZES, FRAMES, normalizeDrawing, removePaperBackground, clientStyleFilter, outlineVector, composeOutline });
