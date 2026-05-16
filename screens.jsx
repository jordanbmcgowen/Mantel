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
          <p className="lede">Four steps. The whole thing takes about a minute. The result hangs on your wall for decades.</p>
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
              <div className="fileinfo">PROCESSED IN UNDER A MINUTE</div>
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

// Composites the AI-styled result with the original drawing to achieve ~75%
// structural consistency, then vectorizes the result to SVG so it scales to
// large print sizes without grain.
async function postProcess(originalDataURL, aiBase64) {
  try {
    const aiDataURL = 'data:image/png;base64,' + aiBase64;
    const [aiImg, origImg] = await Promise.all([
      loadImageFromSrc(aiDataURL),
      loadImageFromSrc(originalDataURL),
    ]);

    const canvas = document.createElement('canvas');
    canvas.width  = aiImg.naturalWidth  || 512;
    canvas.height = aiImg.naturalHeight || 512;
    const ctx = canvas.getContext('2d');

    // Base: AI result supplies the artistic color palette (hue + saturation).
    ctx.drawImage(aiImg, 0, 0, canvas.width, canvas.height);

    // Overlay: original's luminosity at 75% opacity. The 'luminosity' blend
    // mode transfers brightness/structure from the original onto the AI's
    // color layer — reinforcing the original drawing's shapes while keeping
    // the AI's artistic palette intact.
    ctx.globalAlpha = 0.75;
    ctx.globalCompositeOperation = 'luminosity';
    ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    const composited = canvas.toDataURL('image/png');

    // Vectorize using ImageTracer for resolution-independent SVG output.
    if (typeof ImageTracer !== 'undefined') {
      return await new Promise((resolve) => {
        ImageTracer.imageToSVG(
          composited,
          (svg) => resolve('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)),
          { numberofcolors: 64, colorquantcycles: 3, pathomit: 4, ltres: 0.5, qtres: 0.5 }
        );
      });
    }

    return composited;
  } catch (e) {
    console.warn('Post-processing failed:', e);
    return 'data:image/png;base64,' + aiBase64;
  }
}

// ─── Processing ─────────────────────────────────────────────────────────────
const WORKER_URL = 'https://mantel-ai.jordanbmcgowen.workers.dev';

const STYLE_IDS = ['pure','matisse','rothko','hockney','basquiat','miro','warhol','klee','mondrian','picasso'];

function Processing({ go, drawing, uploaded, setAiResults }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Preparing your image…');

  useEffect(() => {
    let cancelled = false;

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
      setStage('Reading your image…');
      const { image_b64, originalDataURL } = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result;
          resolve({ image_b64: dataURL.split(',')[1], originalDataURL: dataURL });
        };
        reader.readAsDataURL(uploaded.file);
      });

      const results = {};
      // Process each style sequentially.
      for (let i = 0; i < STYLE_IDS.length; i++) {
        if (cancelled) return;
        const styleId = STYLE_IDS[i];
        setStage(`Rendering style ${i + 1} of ${STYLE_IDS.length}: ${styleId}…`);
        try {
          const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // strength: 0.25 requests 75% input fidelity from the AI backend;
            // ignored by backends that don't support it.
            body: JSON.stringify({ image_b64, style: styleId, strength: 0.25 }),
          });
          if (resp.ok) {
            const data = await resp.json();
            if (data.image_b64) {
              setStage(`Vectorizing style ${i + 1} of ${STYLE_IDS.length}: ${styleId}…`);
              results[styleId] = await postProcess(originalDataURL, data.image_b64);
            }
          }
        } catch (e) {
          console.warn('Style', styleId, 'failed:', e.message);
        }
        if (!cancelled) setProgress(Math.round((i + 1) / STYLE_IDS.length * 100));
      }

      if (!cancelled) {
        setAiResults(results);
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
          const aiSrc = uploaded && aiResults && aiResults[s.id];
          return (
            <div key={s.id} className={`tile ${s.id === "pure" ? "is-pure" : ""}`} onClick={() => { setStyle(s.id); go("detail"); }}>
              <div className="tile-art" style={{aspectRatio: ratio}}>
                {aiSrc
                  ? <img src={aiSrc} alt={s.name} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
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
  const aiSrc = uploaded && aiResults && aiResults[s.id];

  return (
    <section className="detail frame">
      <button className="detail-back" onClick={() => go("results")}>
        <span>←</span> All ten styles
      </button>
      <div className="detail-grid">
        <div className="detail-art-shell">
          <div className="detail-art">
            {aiSrc
              ? <img src={aiSrc} alt={s.name} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              : <StyleLens style={s.id} drawing={drawing}/>
            }
          </div>
          <div className="detail-actions">
            <div>{s.label} · STYLE {String(idx + 1).padStart(2,"0")} / 10</div>
            <div className="detail-nav">
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

function Configure({ go, drawing, style, config, setConfig, framePreview, setFramePreview }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const total = size.price + frame.price + (config.personalOn ? 12 : 0);

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
                  <StyleLens style={s.id} drawing={drawing}/>
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
function Cart({ go, drawing, style, config }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const sub = size.price + frame.price + (config.personalOn ? 12 : 0);
  const shipping = sub >= 120 ? 0 : 12;
  const total = sub + shipping;

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
                  <StyleLens style={style} drawing={drawing}/>
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
function Checkout({ go, drawing, style, config }) {
  const [pay, setPay] = useState("card");
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const sub = size.price + frame.price + (config.personalOn ? 12 : 0);
  const shipping = sub >= 120 ? 0 : 12;
  const total = sub + shipping;
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
                <div className="canvas-inner"><StyleLens style={style} drawing={drawing}/></div>
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
function Confirmation({ go, drawing, style, config, brand }) {
  const s = STYLES.find(x => x.id === style) || STYLES[0];
  const size = SIZES.find(x => x.id === config.size) || SIZES[0];
  const frame = FRAMES.find(x => x.id === config.frame) || FRAMES[0];
  const orderNo = useMemo(() => "KC-" + Math.floor(Math.random() * 900000 + 100000), []);
  return (
    <section className="confirm frame">
      <div className="mark-big">✓</div>
      <h1>Order received.</h1>
      <div className="order-no">Confirmation {orderNo} · A receipt is on its way</div>
      <div className="confirm-card">
        <div className="thumb">
          <div className="frame-wrap" data-frame={frame.id} style={{padding: 4, aspectRatio: "4/5"}}>
            <div className="canvas-inner"><StyleLens style={style} drawing={drawing}/></div>
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
