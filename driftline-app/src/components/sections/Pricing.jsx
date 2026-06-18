import React from 'react'

export default function Pricing({ tiers = [] , onCta }){
  return (
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
            <button className={"btn full" + (t.ghost ? " ghost" : "")} onClick={() => onCta && onCta(t)}>{t.cta}</button>
          </div>
        ))}
      </div>
    </section>
  )
}
