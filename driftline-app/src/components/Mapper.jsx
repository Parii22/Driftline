import React, { useState, useMemo } from 'react';
import JourneyCurve from './JourneyCurve';
import { analyze } from '../hooks/journeyUtils';
import { seed, STAGES, LS_KEY } from '../data/seed';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Mapper({ onBack }) {
  const [state, setState] = useLocalStorage(LS_KEY, seed);
  const [form, setForm] = useState({ label: "", stage: STAGES[0], s: 0 });
  const [hover, setHover] = useState(null);

  const persona = state.personas[state.active];
  const { rows, satisfaction, peak, latency } = useMemo(() => analyze(persona.steps), [persona.steps]);

  const patch = (fn) =>
    setState((st) => {
      const personas = st.personas.map((p, i) => i === st.active ? fn(structuredClone(p)) : p);
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
          <button className="btn small ghostInk danger" onClick={() => { localStorage.removeItem(LS_KEY); setState(seed); }}>
            Flush workbench
          </button>
        </div>
      </nav>

      <div className="strip">
        {state.personas.map((p, i) => (
          <button key={i} className={"chip" + (i === state.active ? " on" : "")} onClick={() => setState((st) => ({ ...st, active: i }))}>
            {p.name}<small>{p.archetype}</small>
          </button>
        ))}
        <button className="chip add" onClick={() => setState((st) => ({ active: st.personas.length, personas: [...st.personas, { name: `Persona ${st.personas.length + 1}`, archetype: "New archetype", steps: [] }] }))}>
          + New persona
        </button>
      </div>

      <main className="grid">
        <section className="card stage">
          <div className="cardHead">
            <input className="personaName" value={persona.name} onChange={(e) => patch((p) => ({ ...p, name: e.target.value }))} />
            <input className="personaArch" value={persona.archetype} onChange={(e) => patch((p) => ({ ...p, archetype: e.target.value }))} />
          </div>
          <JourneyCurve steps={persona.steps} rows={rows} hover={hover} onHover={setHover} />
          <div className="builder">
            <input placeholder="Describe the touchpoint — “Enters card details”" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addStep()} />
            <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
            <label className="slider">
              <input type="range" min="-3" max="3" step="1" value={form.s} onChange={(e) => setForm({ ...form, s: e.target.value })} />
              <b style={{ color: "var(--tide)" }}>{form.s > 0 ? "+" + form.s : form.s}</b>
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
                <tr key={i} className={(r.critical ? "crit " : "") + (hover === i ? "hl" : "")} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                  <td>{r.label}</td>
                  <td><span className="stageTag">{r.stage}</span></td>
                  <td>
                    <input type="number" min="-3" max="3" value={r.s} onChange={(e) => patch((p) => { p.steps[i].s = Math.max(-3, Math.min(3, Number(e.target.value) || 0)); return p; })} />
                  </td>
                  <td style={{ color: r.dF < 0 ? "#FF2E55" : "inherit" }}>{i === 0 ? "—" : (r.dF > 0 ? "+" : "") + r.dF}</td>
                  <td>{r.retention.toFixed(0)}%</td>
                  <td>
                    <button className="x" aria-label={`Remove ${r.label}`} onClick={() => patch((p) => ({ ...p, steps: p.steps.filter((_, j) => j !== i) }))}>×</button>
                  </td>
                </tr>
              ))}
              {!rows.length && (<tr><td colSpan="6" className="emptyRow">No touchpoints yet — add one on the left.</td></tr>)}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="hud">
        <div><label>Touchpoints</label><b>{rows.length}</b></div>
        <div><label>Satisfaction index</label><b style={{ color: "#2BD9B0" }}>{satisfaction}%</b></div>
        <div><label>Projected retention</label><b>{rows.length ? rows[rows.length - 1].retention.toFixed(0) + "%" : "—"}</b></div>
        <div><label>Peak friction</label><b className={peak != null ? "critText" : ""}>{peak != null ? `#${peak + 1} ${rows[peak].label}` : "none flagged"}</b></div>
        <div><label>Recompute latency</label><b>{latency} ms</b></div>
      </footer>
    </div>
  );
}
