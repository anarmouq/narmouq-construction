/* ==========================================================================
   SECTION 03 — WHY US  (light grey band)
   A large serif word on the left, a ticked list of reasons on the right —
   the same layout the reference site uses under its About block.
   Text & reasons: src/data/site.js → `whyUs`
   ========================================================================== */

import { whyUs } from '../data/site'
import Accent from '../components/Accent'
import { ArrowRight, Check } from '../components/Icons'
import './WhyUs.css'

export default function WhyUs() {
  return (
    <section className="why section section--tint" id="why">
      <span className="why__watermark" aria-hidden="true">
        {whyUs.watermark}
      </span>

      <div className="container why__grid">
        <div className="why__intro" data-reveal>
          <h2>
            <Accent text={whyUs.title} />
          </h2>
          <p className="why__text">{whyUs.text}</p>
          <a className="btn btn--dark why__cta" href={whyUs.cta.href}>
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
