/* ==========================================================================
   SECTION 06 — WHY US  (dark band)
   Text & reasons: src/data/site.js → `whyUs`
   ========================================================================== */

import { whyUs } from '../data/site'
import { ArrowRight, Check } from '../components/Icons'
import './WhyUs.css'

export default function WhyUs() {
  return (
    <section className="why section section--dark" id="why">
      <div className="why__bg" aria-hidden="true">
        <img src={whyUs.image} alt="" loading="lazy" />
      </div>

      <div className="container why__grid">
        <div className="why__intro" data-reveal>
          <p className="eyebrow">{whyUs.eyebrow}</p>
          <h2>{whyUs.title}</h2>
          <p className="why__text">{whyUs.text}</p>
          <a className="btn btn--primary why__cta" href={whyUs.cta.href}>
            {whyUs.cta.label} <ArrowRight />
          </a>
        </div>

        <ul className="why__list">
          {whyUs.reasons.map((reason, i) => (
            <li key={reason.title} data-reveal style={{ '--reveal-delay': `${i * 0.09}s` }}>
              <span className="why__icon">
                <Check />
              </span>
              <div>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
