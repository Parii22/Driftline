import React, { useMemo } from 'react';
import JourneyCurve from './JourneyCurve';
import { sentimentColor } from '../hooks/journeyUtils';
import { seed } from '../data/seed';
import Features from './sections/Features';
import Pricing from './sections/Pricing';
import SiteFooter from './sections/SiteFooter';

export default function Landing({ onLaunch }) {
  const demo = seed.personas[0].steps;
  const { rows } = useMemo(() => ({ rows: demo.map(s => ({ ...s })) }), []);
  const tiers = [
    { name: "Sketch", price: "$0", per: "forever", blurb: "For trying ideas on a quiet afternoon.", items: ["Unlimited journey maps", "2 personas per map", "Saves to your browser"], cta: "Start mapping", ghost: true },
    { name: "Pro", price: "$9", per: "per month", blurb: "For designers shipping real funnels.", items: ["Unlimited personas", "Friction & drop-off analyzer", "JSON blueprint export", "Funnel retention modelling"], cta: "Go Pro", featured: true },
    { name: "Studio", price: "$29", per: "per month", blurb: "For teams who argue about checkout flows.", items: ["Everything in Pro", "Shared persona library", "Map versioning", "Priority support"], cta: "Talk to us", ghost: true },
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
        <p className="sub">Driftline turns your browser into a UX workshop. Plot each touchpoint a persona crosses, score how it feels, and watch the friction surface.</p>
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

      <Features />

      <Pricing tiers={tiers} onCta={() => onLaunch && onLaunch()} />

      <SiteFooter />
    </div>
  );
}
