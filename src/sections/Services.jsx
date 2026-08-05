/* ==========================================================================
   SECTION 03 — SERVICES
   Text & items: src/data/site.js → `services`
   ========================================================================== */

import { services } from '../data/site'
import { ArrowRight, serviceIcons } from '../components/Icons'
import './Services.css'

export default function Services() {
  return (
    <section className="services section section--tint" id="services">
      <div className="container">
        <div className="section-head section-head--split" data-reveal>
          <div>
            <p className="eyebrow">{services.eyebrow}</p>
            <h2>{services.title}</h2>
            <p>{services.text}</p>
          </div>
          <a className="btn btn--dark" href="#contact">
            Request a quote <ArrowRight />
          </a>
        </div>

        <div className="services__grid">
          {services.items.map((item, i) => {
            const Icon = serviceIcons[item.icon] ?? serviceIcons.building
            return (
              <article
                className="service"
                key={item.number}
                data-reveal
                style={{ '--reveal-delay': `${(i % 3) * 0.1}s` }}
              >
                <div className="service__top">
                  <span className="service__icon">
                    <Icon />
                  </span>
                  <span className="service__number">{item.number}</span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.text}</p>

                <ul className="service__tags">
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>

                <a className="service__link" href="#contact" aria-label={`Enquire about ${item.title}`}>
                  Enquire <ArrowRight />
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
