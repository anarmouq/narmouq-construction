/* ==========================================================================
   SECTION 02 — ABOUT
   Text & images: src/data/site.js → `about`
   ========================================================================== */

import { about } from '../data/site'
import Accent from '../components/Accent'
import { ArrowRight, Check } from '../components/Icons'
import './About.css'

export default function About() {
  return (
    <section className="about section section--light" id="about">
      <div className="container">
        <div className="about__intro" data-reveal>
          <h2 className="about__title">
            <Accent text={about.title} />
          </h2>

          <p className="about__lead">
            <Accent text={about.text} />
          </p>

          <span className="about__divider" aria-hidden="true" />

          <h3 className="about__subtitle">{about.subtitle}</h3>
          <p className="about__subtext">{about.subtext}</p>
        </div>

        <div className="about__grid">
          <div className="about__media" data-reveal>
            <div className="about__photo about__photo--main">
              <img src={about.image} alt="Narmouq site works in progress" loading="lazy" />
            </div>
            <div className="about__photo about__photo--sub">
              <img
                src={about.imageSecondary}
                alt="Narmouq engineers reviewing drawings"
                loading="lazy"
              />
            </div>
            <div className="about__badge">
              <strong>{about.badge.value}</strong>
              <span>{about.badge.label}</span>
            </div>
          </div>

          <div className="about__body" data-reveal style={{ '--reveal-delay': '0.12s' }}>
            <ul className="about__points">
              {about.points.map((point) => (
                <li key={point.title}>
                  <span className="about__check">
                    <Check />
                  </span>
                  <div>
                    <h3>{point.title}</h3>
                    <p>{point.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <ul className="about__stats">
              {about.stats.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>

            <a className="text-link about__link" href="#services">
              Explore our services <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
