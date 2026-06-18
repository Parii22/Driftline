import React, { useMemo, useRef } from 'react';
import { computeGeometry, sentimentColor } from '../hooks/journeyUtils';

export default function JourneyCurve({ steps, rows, W = 720, H = 280, dark, animate, onHover, hover }) {
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
