/* ==========================================================================
   SECTION 01 — HERO
   A full-bleed image slider sitting directly under the white header, with the
   headline set low and left and the arrows in the bottom-right corner.
   Slides: src/data/site.js → `hero.slides`
   ========================================================================== */

import { useCallback, useEffect, useState } from 'react'
import { hero } from '../data/site'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import SmartLink from '../components/SmartLink'
import './Hero.css'

export default function Hero() {
  const slides = hero.slides
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (step) => setIndex((current) => (current + step + count) % count),
    [count],
  )

  /* Autoplay — pauses while the pointer is over the hero. */
  useEffect(() => {
    if (paused || count < 2) return undefined
    const id = window.setInterval(() => go(1), hero.autoplayMs)
    return () => window.clearInterval(id)
  }, [paused, count, go])

  const slide = slides[index]

  return (
    <section
      className="hero"
      id="home"
      aria-roledescription="carousel"
      aria-label="Featured work"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero__stage">
        {slides.map((item, i) => (
          <div className={`hero__slide ${i === index ? 'is-active' : ''}`} key={item.image}>
            <img
              src={item.image}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
        <span className="hero__veil" aria-hidden="true" />
      </div>

      <div className="container hero__inner">
        {/* `key` restarts the entrance animation on every slide change. */}
        <div className="hero__copy" key={index}>
          <h1>
            <span>{slide.line1}</span>
            <span>{slide.line2}</span>
          </h1>
          <p>{slide.text}</p>
          <SmartLink className="btn btn--primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label} <ArrowRight />
          </SmartLink>
        </div>
      </div>

      <div className="hero__controls">
        <div className="hero__dots dots">
          {slides.map((item, i) => (
            <button
              key={item.image}
              type="button"
              className={i === index ? 'is-active' : ''}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <div className="hero__arrows">
          <button
            className="round-btn round-btn--light"
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
          >
            <ArrowLeft />
          </button>
          <button
            className="round-btn round-btn--light"
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}
