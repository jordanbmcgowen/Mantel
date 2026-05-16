// app.jsx — root state, navigation, tweaks wiring.

const { useState: useStateA, useEffect: useEffectA } = React;

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);

  const [screen, setScreen]   = useStateA("landing");
  const [drawing, setDrawing] = useStateA("house");
  const [style, setStyle]     = useStateA("matisse");
  const [uploaded, setUploaded] = useStateA(null);
  const [aiResults, setAiResults] = useStateA({});
  const [config, setConfig]   = useStateA({
    size: "M",
    frame: "black",
    personalOn: false,
    name: "",
    age: "",
    date: "",
  });

  // Apply theme + density to root (CSS vars react)
  useEffectA(() => {
    document.body.dataset.theme   = t.theme;
    document.body.dataset.density = t.density;
  }, [t.theme, t.density]);

  // Reset scroll on screen change
  useEffectA(() => { window.scrollTo(0, 0); }, [screen]);

  // step label in header
  const step = (() => {
    switch (screen) {
      case "landing":      return "";
      case "upload":       return "01 — Upload";
      case "processing":   return "01 — Processing";
      case "results":      return "02 — Choose";
      case "detail":       return "02 — Choose";
      case "configure":    return "03 — Configure";
      case "cart":         return "04 — Cart";
      case "checkout":     return "05 — Checkout";
      case "confirmation": return "Complete";
      default:             return "";
    }
  })();

  const go = (next) => setScreen(next);

  return (
    <div className="app">
      <MantelDefs />
      <Header brand={t.brand} screen={screen} step={step} onHome={() => go("landing")}/>

      {screen === "landing" && <Landing go={go} brand={t.brand}/>}
      {screen === "upload" && <Upload go={go} setDrawing={setDrawing} setUploaded={setUploaded} uploaded={uploaded}/>}
      {screen === "processing" && <Processing go={go} drawing={drawing} uploaded={uploaded} setAiResults={setAiResults}/>}
      {screen === "results" && (
        <Results
          go={go}
          drawing={drawing}
          uploaded={uploaded}
          setStyle={setStyle}
          galleryLayout={t.gallery}
          setGalleryLayout={(v) => setTweak("gallery", v)}
          brand={t.brand}
          aiResults={aiResults}
        />
      )}
      {screen === "detail" && <Detail go={go} drawing={drawing} style={style} setStyle={setStyle} aiResults={aiResults} uploaded={uploaded}/>}
      {screen === "configure" && (
        <Configure
          go={go}
          drawing={drawing}
          style={style}
          config={config}
          setConfig={setConfig}
          framePreview={t.framePreview}
          setFramePreview={(v) => setTweak("framePreview", v)}
        />
      )}
      {screen === "cart"         && <Cart go={go} drawing={drawing} style={style} config={config}/>}
      {screen === "checkout"     && <Checkout go={go} drawing={drawing} style={style} config={config}/>}
      {screen === "confirmation" && <Confirmation go={go} drawing={drawing} style={style} config={config} brand={t.brand}/>}

      <footer className="foot">
        <div>© 2026 {t.brand} Studio · Made in Asheville, NC</div>
        <div className="foot-cols">
          <a>Process</a>
          <a>Materials</a>
          <a>FAQ</a>
          <a>Contact</a>
          <a>Instagram</a>
        </div>
      </footer>

      <TweaksPanel>
        <TweakSection label="Brand"/>
        <TweakText
          label="Name"
          value={t.brand}
          onChange={(v) => setTweak("brand", v)}
        />
        <div style={{fontSize: 10.5, color: "rgba(41,38,27,.55)", lineHeight: 1.5, marginTop: -2}}>
          Try: <em>Mantel</em>, <em>Folio</em>, <em>Frieze</em>, <em>Heirloom</em>, <em>Primary</em>.
        </div>

        <TweakSection label="Theme"/>
        <TweakRadio
          label="Aesthetic"
          value={t.theme}
          options={[
            { label: "Boutique", value: "boutique" },
            { label: "Gallery",  value: "gallery"  },
            { label: "Mono",     value: "mono"     },
          ]}
          onChange={(v) => setTweak("theme", v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={[
            { label: "Compact", value: "compact" },
            { label: "Regular", value: "regular" },
            { label: "Airy",    value: "airy"    },
          ]}
          onChange={(v) => setTweak("density", v)}
        />

        <TweakSection label="Results gallery"/>
        <TweakRadio
          label="Layout"
          value={t.gallery}
          options={[
            { label: "Grid",     value: "grid"     },
            { label: "Masonry",  value: "masonry"  },
            { label: "Carousel", value: "carousel" },
          ]}
          onChange={(v) => setTweak("gallery", v)}
        />

        <TweakSection label="Configure preview"/>
        <TweakRadio
          label="Style"
          value={t.framePreview}
          options={[
            { label: "Room", value: "room" },
            { label: "Flat", value: "flat" },
            { label: "Iso",  value: "iso"  },
          ]}
          onChange={(v) => setTweak("framePreview", v)}
        />

        <TweakSection label="Jump to screen"/>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 4}}>
          {[
            ["landing","Landing"],
            ["upload","Upload"],
            ["results","Results"],
            ["detail","Detail"],
            ["configure","Configure"],
            ["cart","Cart"],
            ["checkout","Checkout"],
            ["confirmation","Confirm"],
          ].map(([k, n]) => (
            <button key={k}
              className="twk-field"
              style={{
                cursor: "pointer", textAlign: "left", height: 26,
                background: screen === k ? "#1A1815" : "rgba(255,255,255,.6)",
                color:      screen === k ? "#F1ECE2" : "inherit",
                borderColor: screen === k ? "#1A1815" : "rgba(0,0,0,.1)"
              }}
              onClick={() => go(k)}>
              {n}
            </button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
