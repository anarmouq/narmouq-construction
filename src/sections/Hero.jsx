/* ==========================================================================
   SECTION 01 — HERO
   Text & images: src/data/site.js → `hero`
   The centred logo is `company.logoFullLight` (the white-wordmark version of
   logo.png, generated so it reads on the dark background).
   ========================================================================== */

import { company, hero } from '../data/site'
import { ArrowRight } from '../components/Icons'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__bg">
        <img src={hero.image} alt="" fetchPriority="high" />
        <div className="hero__overlay" />
        <div className="hero__grid" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow">{hero.eyebrow}</p>

          <div className="hero__logo">
            <span className="hero__logo-glow" aria-hidden="true" />
            <img src={company.logoFullLight} alt={company.fullName} fetchPriority="high" />
          </div>

          <span className="hero__rule" aria-hidden="true" />

          <h1>{hero.title}</h1>
          <p className="hero__text">{hero.text}</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label} <ArrowRight />
            </a>
            <a className="btn btn--ghost-light" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      <div className="hero__stats">
        <div className="container hero__stats-grid">
          {hero.highlights.map((item) => (
            <div className="hero__stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to about section">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  )
}
