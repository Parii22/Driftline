export function sentimentColor(s) {
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

export function computeGeometry(steps, W, H, pad) {
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

export function analyze(steps) {
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
