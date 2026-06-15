import React, { useState, useEffect, useMemo, useRef } from "react";
import './styles.css';

const STAGES = ["Discovery", "Consideration", "Action", "Friction Point"];
const LS_KEY = "driftline-workbench-v1";

const seed = {
  active: 0,
  personas: [
    {             
      name: "First-time Shopper",
      archetype: "Novice user",
      steps: [
        { label: "Lands on homepage", stage: "Discovery", s: 2 },
        { label: "Browses catalog", stage: "Discovery", s: 1 },
        { label: "Compares pricing", stage: "Consideration", s: -1 },
        { label: "Enters card details", stage: "Friction Point", s: -3 },
        { label: "Applies promo code", stage: "Action", s: 1 },
        { label: "Order confirmed", stage: "Action", s: 3 },
      ],
    },
    {
      name: "Returning Power User",
      archetype: "Tech-savvy",
      steps: [
        { label: "Opens saved cart", stage: "Discovery", s: 2 },
        { label: "One-click checkout", stage: "Action", s: 3 },
        { label: "Hits OTP delay", stage: "Friction Point", s: -2 },
        { label: "Payment succeeds", stage: "Action", s: 2 },
      ],
    },
  ],
};

function sentimentColor(s) {
  const stops = [
    [-3, [255, 84, 112]],
    [0, [255, 180, 84]],
    [3, [43, 217, 176]],
  ];
  const t = Math.max(-3, Math.min(3, s));
  const [a, b] = t <= 0 ? [stops[0], stops[1]] : [stops[1], stops[2]];
  const k = (t - a[0]) / (b[0] - a[0] || 1);
  const c = a[1].map((v, i) => Math.round(v + (b[1][i] - v) * k));
  return `rgb(${c.join(",")})`;
}

function computeGeometry(steps, W, H, pad) {
  const n = steps.length;
  const pts = steps.map((st, i) => ({
    x: pad + (n > 1 ? (i * (W - pad * 2)) / (n - 1) : (W - pad * 2) / 2),
    y: H / 2 - (st.s / 3) * (H / 2 - pad),
  }));
  let d = "";
  pts.forEach((p, i) => {
    if (i === 0) d = `M ${p.x} ${p.y}`;
    else {
      const prev = pts[i - 1];
      const mx = (prev.x + p.x) / 2;
      d += ` C ${mx} ${prev.y}, ${mx} ${p.y}, ${p.x} ${p.y}`;
    }
  });
  return { pts, d };
}

function analyze(steps) {
  const t0 = performance.now();
  let retention = 100;
  const rows = steps.map((st, i) => {
    const dF = i === 0 ? 0 : st.s - steps[i - 1].s;
    const dropRisk =
      Math.max(0, (1 - (st.s + 3) / 6)) * 0.18 + Math.max(0, -dF) * 0.06;
    retention *= 1 - dropRisk;
    return { ...st, dF, retention, critical: dF <= -2 };
  });
  const satisfaction = steps.length
    ? Math.round((steps.reduce((a, s) => a + (s.s + 3) / 6, 0) / steps.length) * 100)
    : 0;
  let peak = null;
  rows.forEach((r, i) => {
    if (r.dF < 0 && (!peak || r.dF < rows[peak].dF)) peak = i;
  });
  return { rows, satisfaction, peak, latency: (performance.now() - t0).toFixed(2) };
}

function JourneyCurve({ steps, rows, W = 720, H = 280, dark, animate, onHover, hover }) {
  const pad = 36;
  const { pts, d } = useMemo(() => computeGeometry(steps, W, H, pad), [steps, W, H]);
  const gid = useRef("g" + Math.random().toString(36).slice(2)).current;
  if (!steps.length)
    return (
      <div className="empty">Add a touchpoint to start drawing this persona's emotional line.</div>
    );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="curve" role="img" aria-label="Emotional journey curve">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
          {steps.map((st, i) => (
            <stop key={i} offset={`${(pts[i].x / W) * 100}%`} stopColor={sentimentColor(st.s)} />
          ))}
        </linearGradient>
      </defs>
      <line x1={pad} x2={W - pad} y1={H / 2} y2={H / 2} className={dark ? "base d" : "base"} />
      <path d={d} fill="none" stroke={`url(#${gid})`} strokeWidth="3.5" strokeLinecap="round"
        className={animate ? "draw" : ""} />
      {rows &&
        rows.map((r, i) =>
          r.critical && i > 0 ? (
            <line key={"c" + i} x1={pts[i - 1].x} y1={pts[i - 1].y} x2={pts[i].x} y2={pts[i].y}
              stroke="#FF2E55" strokeWidth="2" strokeDasharray="5 5" opacity="0.85" />
          ) : null
        )}
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => onHover && onHover(i)} onMouseLeave={() => onHover && onHover(null)}>
          <circle cx={p.x} cy={p.y} r="13" fill="transparent" />
          <circle cx={p.x} cy={p.y} r={hover === i ? 7 : 5.5} fill={sentimentColor(steps[i].s)}
            stroke={dark ? "#14172E" : "#fff"} strokeWidth="2.5" />
          {rows && rows[i].critical && (
            <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="#FF2E55" strokeWidth="1.5" />
          )}
        </g>
      ))}
      {hover != null && rows && (
        <g transform={`translate(${Math.min(pts[hover].x, W - 190)}, ${Math.max(pts[hover].y - 64, 8)})`}>
          <rect width="180" height="52" rx="8" className={dark ? "tip d" : "tip"} />
          <text x="10" y="20" className="tipTitle">{steps[hover].label}</text>
          <text x="10" y="38" className="tipMeta">
            ΔF {rows[hover].dF > 0 ? "+" : ""}{rows[hover].dF} · keep {rows[hover].retention.toFixed(0)}%
          </text>
        </g>
      )}
    </svg>
  );
}

function Landing({ onLaunch }) {
  const demo = seed.personas[0].steps;
  const { rows } = useMemo(() => analyze(demo), []);
  const tiers = [
    {
      name: "Sketch", price: "$0", per: "forever",
      blurb: "For trying ideas on a quiet afternoon.",
      items: ["Unlimited journey maps", "2 personas per map", "Saves to your browser"],
      cta: "Start mapping", ghost: true,
    },
    {
      name: "Pro", price: "$9", per: "per month",
      blurb: "For designers shipping real funnels.",
      items: ["Unlimited personas", "Friction & drop-off analyzer", "JSON blueprint export", "Funnel retention modelling"],
      cta: "Go Pro", featured: true,
    },
    {
      name: "Studio", price: "$29", per: "per month",
      blurb: "For teams who argue about checkout flows.",
      items: ["Everything in Pro", "Shared persona library", "Map versioning", "Priority support"],
      cta: "Talk to us", ghost: true,
    },
  ];
  return (
    <div className="landing">
      <nav className="nav">
        <span className="logo">driftline<i>.</i></span>
        <div className="navR">
          <a href="#pricing">Pricing</a>
          <button className="btn small" onClick={onLaunch}>Open the mapper</button>
        </div>
      </nav>

      <header className="hero">
        <p className="eyebrow">journey mapping · zero servers</p>
        <h1>Every user leaves<br />an emotional line.<br /><em>Draw it.</em></h1>
        <p className="sub">
          Driftline turns your browser into a UX workshop. Plot each touchpoint a persona
          crosses, score how it feels, and watch the friction surface — privately, locally,
          with nothing sent over the network.
        </p>
        <div className="ctaRow">
          <button className="btn" onClick={onLaunch}>Launch the mapper — it's free</button>
          <span className="hint">No signup. No data leaves this tab.</span>
        </div>
        <div className="heroCurve">
          <JourneyCurve steps={demo} rows={rows} dark animate />
          <div className="heroLabels">
            {demo.map((s, i) => (
              <span key={i} style={{ color: sentimentColor(s.s) }}>{s.label}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="features">
        {[
          ["The trajectory plotter", "Touchpoints become a continuous bezier of feeling — highs in tide green, lows in coral — so the story of a session reads in one glance."],
          ["Friction analyzer", "Driftline computes ΔF between every step. A sentiment cliff of two points or more gets flagged in crimson before your users find it."],
          ["Funnel that updates as you type", "Each step carries a churn coefficient. Reorder, rescore, and the projected retention recalculates in the same frame."],
          ["A workbench that stays put", "Personas, maps, and settings mirror to localStorage. Close the tab on Friday, pick up the exact canvas on Monday."],
        ].map(([t, b], i) => (
          <article key={i}>
            <h3>{t}</h3>
            <p>{b}</p>
          </article>
        ))}
      </section>

      <section className="pricing" id="pricing">
        <h2>Simple, like the architecture.</h2>
        <p className="pSub">Everything runs client-side either way. You're paying for power tools, not our cloud bill.</p>
        <div className="tiers">
          {tiers.map((t) => (
            <div key={t.name} className={"tier" + (t.featured ? " featured" : "")}> 
              <h4>{t.name}</h4>
              <div className="price">{t.price}<span> {t.per}</span></div>
              <p className="blurb">{t.blurb}</p>
              <ul>{t.items.map((x) => <li key={x}>{x}</li>)}</ul>
              <button className={"btn full" + (t.ghost ? " ghost" : "")} onClick={onLaunch}>{t.cta}</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="foot">
        <span className="logo">driftline<i>.</i></span>
        <span>Built for people who care where the frowns happen.</span>
      </footer>
    </div>
  );
}

function Mapper({ onBack }) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seed;
  });
  const [form, setForm] = useState({ label: "", stage: STAGES[0], s: 0 });
  const [hover, setHover] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const persona = state.personas[state.active];
  const { rows, satisfaction, peak, latency } = useMemo(
    () => analyze(persona.steps), [persona.steps]
  );

  const patch = (fn) =>
    setState((st) => {
      const personas = st.personas.map((p, i) =>
        i === st.active ? fn(structuredClone(p)) : p
      );
      return { ...st, personas };
    });

  const addStep = () => {
    if (!form.label.trim()) return;
    patch((p) => ({ ...p, steps: [...p.steps, { ...form, s: Number(form.s), label: form.label.trim() }] }));
    setForm({ label: "", stage: STAGES[0], s: 0 });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "driftline-blueprint.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="app">
      <nav className="nav appNav">
        <button className="linkBtn" onClick={onBack}>← driftline<i>.</i></button>
        <div className="navR">
          <button className="btn small ghostInk" onClick={exportJSON}>Export blueprint</button>
          <button className="btn small ghostInk danger"
            onClick={() => { localStorage.removeItem(LS_KEY); setState(seed); }}>
            Flush workbench
          </button>
        </div>
      </nav>

      <div className="strip">
        {state.personas.map((p, i) => (
          <button key={i}
            className={"chip" + (i === state.active ? " on" : "")}
            onClick={() => setState((st) => ({ ...st, active: i }))}>
            {p.name}<small>{p.archetype}</small>
          </button>
        ))}
        <button className="chip add"
          onClick={() =>
            setState((st) => ({
              active: st.personas.length,
              personas: [...st.personas, { name: `Persona ${st.personas.length + 1}`, archetype: "New archetype", steps: [] }],
            }))
          }>
          + New persona
        </button>
      </div>

      <main className="grid">
        <section className="card stage">
          <div className="cardHead">
            <input className="personaName" value={persona.name}
              onChange={(e) => patch((p) => ({ ...p, name: e.target.value }))} />
            <input className="personaArch" value={persona.archetype}
              onChange={(e) => patch((p) => ({ ...p, archetype: e.target.value }))} />
          </div>
          <JourneyCurve steps={persona.steps} rows={rows} hover={hover} onHover={setHover} />
          <div className="builder">
            <input placeholder="Describe the touchpoint — “Enters card details”"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addStep()} />
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
              {STAGES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <label className="slider">
              <input type="range" min="-3" max="3" step="1" value={form.s}
                onChange={(e) => setForm({ ...form, s: e.target.value })} />
              <b style={{ color: sentimentColor(form.s) }}>{form.s > 0 ? "+" + form.s : form.s}</b>
            </label>
            <button className="btn small" onClick={addStep}>Add step</button>
          </div>
        </section>

        <section className="card matrix">
          <h3>Sentiment matrix</h3>
          <table>
            <thead>
              <tr><th>Step</th><th>Stage</th><th>Feel</th><th>ΔF</th><th>Keep%</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}
                  className={(r.critical ? "crit " : "") + (hover === i ? "hl" : "")}
                  onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <td>{r.label}</td>
                  <td><span className="stageTag">{r.stage}</span></td>
                  <td>
                    <input type="number" min="-3" max="3" value={r.s}
                      onChange={(e) =>
                        patch((p) => {
                          p.steps[i].s = Math.max(-3, Math.min(3, Number(e.target.value) || 0));
                          return p;
                        })
                      } />
                  </td>
                  <td style={{ color: r.dF < 0 ? "#FF2E55" : "inherit" }}>
                    {i === 0 ? "—" : (r.dF > 0 ? "+" : "") + r.dF}
                  </td>
                  <td>{r.retention.toFixed(0)}%</td>
                  <td>
                    <button className="x" aria-label={`Remove ${r.label}`}
                      onClick={() => patch((p) => ({ ...p, steps: p.steps.filter((_, j) => j !== i) }))}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr><td colSpan="6" className="emptyRow">No touchpoints yet — add one on the left.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="hud">
        <div><label>Touchpoints</label><b>{rows.length}</b></div>
        <div><label>Satisfaction index</label>
          <b style={{ color: sentimentColor((satisfaction / 100) * 6 - 3) }}>{satisfaction}%</b>
        </div>
        <div><label>Projected retention</label>
          <b>{rows.length ? rows[rows.length - 1].retention.toFixed(0) + "%" : "—"}</b>
        </div>
        <div><label>Peak friction</label>
          <b className={peak != null ? "critText" : ""}>
            {peak != null ? `#${peak + 1} ${rows[peak].label}` : "none flagged"}
          </b>
        </div>
        <div><label>Recompute latency</label><b>{latency} ms</b></div>
      </footer>
    </div>
  );
}

export default function Driftline() {
  const [mode, setMode] = useState("landing");
  return (
    <>
      {mode === "landing"
        ? <Landing onLaunch={() => setMode("app")} />
        : <Mapper onBack={() => setMode("landing")} />}
    </>
  );
}
// end of Driftline component
