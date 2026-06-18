import React from 'react'

export default function Features(){
  const items = [
    ["The trajectory plotter", "Touchpoints become a continuous bezier of feeling — highs in tide green, lows in coral — so the story of a session reads in one glance."],
    ["Friction analyzer", "Driftline computes ΔF between every step. A sentiment cliff of two points or more gets flagged in crimson before your users find it."],
    ["Funnel that updates as you type", "Each step carries a churn coefficient. Reorder, rescore, and the projected retention recalculates in the same frame."],
    ["A workbench that stays put", "Personas, maps, and settings mirror to localStorage. Close the tab on Friday, pick up the exact canvas on Monday."],
  ];

  return (
    <section className="features">
      {items.map(([t, b], i) => (
        <article key={i}>
          <h3>{t}</h3>
          <p>{b}</p>
        </article>
      ))}
    </section>
  );
}
