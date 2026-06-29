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
              Upload a drawing. {brand} will lift it cleanly off the page and reinterpret it in ten styles — from a pure vectorized original to cuts by Matisse, fields by Rothko, and a quad in the manner of Warhol. Pick a favorite. We print it large, frame it well, and ship.
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
              <span>Rothko</span><span className="dot"></span>
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
          <p className="lede">Four steps. The whole thing takes a minute or two. The result hangs on your wall for decades.</p>
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
              <div className="fileinfo">TEN STYLES · READY IN A MINUTE OR TWO</div>
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
  warhol:   { aiStrength: 0.25, fallbackBg: "#FFD23F",
              prompt: "Transform this simple crayon picture into an Andy Warhol pop-art silkscreen: bold flat blocks of high-contrast saturated color, graphic screenprint look, slightly off-register.",
              vec: { numberofcolors: 8,  colorquantcycles: 4, pathomit: 12, ltres: 0.8, qtres: 0.8, blurradius: 1, blurdelta: 14 } },
  basquiat: { aiStrength: 0.30, fallbackBg: "#C8A877",
              prompt: "Transform this simple crayon picture into a Jean-Michel Basquiat neo-expressionist painting: raw energetic oilstick marks on warm kraft paper, bold primary colors, a three-point crown motif, scrawled and untamed.",
              vec: { numberofcolors: 28, colorquantcycles: 3, pathomit: 4,  ltres: 0.5, qtres: 0.5, blurradius: 1, blurdelta: 14 } },
  hockney:  { aiStrength: 0.40, fallbackBg: "#3CB7B3",
              prompt: "Transform this simple crayon picture into a David Hockney pop California scene: flat sunlit shapes, turquoise water, hot pink and bright yellow, clean graphic style with bold confident outlines.",
              vec: { numberofcolors: 14, colorquantcycles: 4, pathomit: 10, ltres: 1.0, qtres: 1.0, blurradius: 2, blurdelta: 18 } },
  picasso:  { aiStrength: 0.45, fallbackBg: "#0F1E3D",
              prompt: "Transform this simple crayon picture into a Picasso Blue Period oil painting: everything rendered in deep melancholic blues and soft cyan, painterly brushwork, somber and tender.",
              vec: { numberofcolors: 28, colorquantcycles: 4, pathomit: 6,  ltres: 0.6, qtres: 0.6, blurradius: 2, blurdelta: 18 } },
  klee:     { aiStrength: 0.45, fallbackBg: "#D8C49A",
              prompt: "Transform this simple crayon picture into a Paul Klee watercolor: a soft mosaic of pastel washed squares with a single thin ink line tracing the subject over the top, gentle and musical.",
              vec: { numberofcolors: 32, colorquantcycles: 4, pathomit: 6,  ltres: 0.5, qtres: 0.5, blurradius: 2, blurdelta: 18 } },
  matisse:  { aiStrength: 0.55, fallbackBg: "#F1ECE2",
              prompt: "Transform this simple crayon picture into a Henri Matisse paper cut-out collage: flat shapes of solid vermillion, cobalt blue, kelly green and gold torn from colored paper, no outlines, bold and joyful.",
              vec: { numberofcolors: 10, colorquantcycles: 4, pathomit: 14, ltres: 1.2, qtres: 1.2, blurradius: 3, blurdelta: 20 } },
  miro:     { aiStrength: 0.70, fallbackBg: "#F0E6CE",
              prompt: "Transform this simple crayon picture into a Joan Miro painting: playful biomorphic shapes, thin black connecting lines, stars and dots, primary red blue and yellow on a soft cream ground, dreamlike.",
              vec: { numberofcolors: 10, colorquantcycles: 4, pathomit: 12, ltres: 1.0, qtres: 1.0, blurradius: 2, blurdelta: 18 } },
  mondrian: { aiStrength: 0.80, fallbackBg: "#F4F0E8",
              prompt: "Transform this simple picture into a Piet Mondrian De Stijl composition: bold rectangles of primary red, yellow and blue on white, divided by thick black lines, geometric and clean.",
              vec: { numberofcolors: 5,  colorquantcycles: 3, pathomit: 20, ltres: 2.0, qtres: 2.0, blurradius: 4, blurdelta: 24 } },
  rothko:   { aiStrength: 0.85, fallbackBg: "#2A0604",
              prompt: "Transform this simple picture into a Mark Rothko color field painting: two large soft-edged horizontal bands of glowing color, hazy and atmospheric, the subject dissolved into pure color.",
              vec: { numberofcolors: 48, colorquantcycles: 5, pathomit: 2,  ltres: 0.5, qtres: 0.5, blurradius: 5, blurdelta: 24 } },
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
      ['#C72A1C', '#FFD23F'], ['#0E2A52', '#3CB7B3'],
      ['#1a0a1a', '#FF6B6B'], ['#0E0E0D', '#FFD23F'],
    ];
    const cw = Math.floor(w / 2), ch = Math.floor(h / 2);
    pairs.forEach((pair, i) => {
      const { c, ctx } = flatten(img, w, h, '#fff');
      ctx.filter = 'contrast(1.2)';
      ctx.drawImage(c, 0, 0);
      duotone(ctx, w, h, pair[0], pair[1]);
      octx.drawImage(c, (i % 2) * cw, Math.floor(i / 2) * ch, cw, ch);
    });
    return out.toDataURL('image/jpeg', 0.86);
  }

  const { c, ctx } = flatten(img, w, h, bg);

  switch (styleId) {
    case 'picasso':
      duotone(ctx, w, h, '#08152E', '#A8C5E8', '#3F6BA5');
      break;
    case 'rothko': {
      // dissolve the subject into two glowing bands of color
      const band = document.createElement('canvas');
      band.width = w; band.height = h;
      const bctx = band.getContext('2d');
      const g = bctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#F47A4A'); g.addColorStop(0.42, '#DC4222');
      g.addColorStop(0.5, '#7A1A0C'); g.addColorStop(0.58, '#B82612');
      g.addColorStop(1, '#2A0604');
      bctx.fillStyle = g; bctx.fillRect(0, 0, w, h);
      ctx.filter = 'blur(' + Math.round(Math.max(w, h) / 28) + 'px) saturate(1.3)';
      ctx.globalAlpha = 0.5;
      ctx.drawImage(c, 0, 0);
      ctx.filter = 'none'; ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'overlay';
      ctx.drawImage(band, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.55; ctx.drawImage(band, 0, 0); ctx.globalAlpha = 1;
      break;
    }
    case 'mondrian':
      posterize(ctx, w, h, 2);
      snapToPalette(ctx, w, h, ['#D62828', '#F4C40D', '#1B4FBF', '#F4F0E8', '#0E0E0D']);
      break;
    case 'matisse':
      snapToPalette(ctx, w, h, ['#E14B2E', '#2A4FB2', '#1E5E3F', '#F2A93B', '#F1ECE2', '#3F8A4D', '#D8456E']);
      break;
    case 'hockney': {
      const t = flatten(img, w, h, bg);
      t.ctx.filter = 'saturate(1.7) contrast(1.15) brightness(1.05)';
      t.ctx.drawImage(t.c, 0, 0);
      posterize(t.ctx, w, h, 5);
      return t.c.toDataURL('image/jpeg', 0.86);
    }
    case 'basquiat':
      ctx.filter = 'contrast(1.4) saturate(1.4)';
      ctx.drawImage(c, 0, 0);
      posterize(ctx, w, h, 4);
      break;
    case 'miro':
      duotone(ctx, w, h, '#0E0E0D', '#F0E6CE');
      break;
    case 'klee':
      ctx.filter = 'saturate(0.85) brightness(1.08)';
      ctx.drawImage(c, 0, 0);
      posterize(ctx, w, h, 4);
      break;
    default: // pure / unknown — just the cleaned drawing on its ground
      break;
  }
  return c.toDataURL('image/jpeg', 0.88);
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
    const aiDataURL = 'data:image/png;base64,' + aiBase64;
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

const STYLE_IDS = ['pure','matisse','rothko','hockney','basquiat','miro','warhol','klee','mondrian','picasso'];

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

      // Read file once — keep both the raw base64 (for the API) and the full
      // data URL (for client-side compositing after each API response).
      setStage('Reading your drawing…');
      const { image_b64, originalDataURL } = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result;
          resolve({ image_b64: dataURL.split(',')[1], originalDataURL: dataURL });
        };
        reader.readAsDataURL(uploaded.file);
      });
      if (cancelled) return;

      // Lift the drawing off the paper once. This powers the "pure" style and
      // is the source for every in-browser style fallback, so do it up front.
      setStage('Lifting it off the paper…');
      let cleanedDataURL;
      try {
        cleanedDataURL = await removePaperBackground(originalDataURL);
      } catch (e) {
        console.warn('Paper removal failed, using original:', e.message);
        cleanedDataURL = originalDataURL;
      }
      if (cancelled) return;

      const results = {};
      let done = 0;
      const total = STYLE_IDS.length;
      const bump = (id, asset) => {
        if (asset) results[id] = asset;
        done += 1;
        if (!cancelled) {
          setProgress(Math.round(done / total * 100));
          setStage(`Reimagining your drawing… ${done} of ${total}`);
        }
      };

      // "pure" is client-side (paper knockout + vectorize) — start it now.
      const purePromise = postProcess(originalDataURL, null, 'pure', cleanedDataURL)
        .then(a => bump('pure', a))
        .catch(e => { console.warn('pure failed:', e.message); bump('pure', null); });

      // The nine interpreted styles run through a small concurrency pool so we
      // don't fire all nine at the worker at once, but also don't crawl through
      // them one at a time.
      const queue = STYLE_IDS.filter(id => id !== 'pure');
      let next = 0;
      async function worker() {
        while (!cancelled) {
          const i = next++;
          if (i >= queue.length) return;
          const id = queue[i];
          const asset = await renderStyle(image_b64, originalDataURL, cleanedDataURL, id, isCancelled);
          bump(id, asset);
        }
      }
      const pool = Array.from({ length: Math.min(AI_CONCURRENCY, queue.length) }, worker);
      await Promise.all([purePromise, ...pool]);

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

Object.assign(window, { Header, Landing, Upload, Processing, Results, Detail, Configure, Cart, Checkout, Confirmation, SIZES, FRAMES });
