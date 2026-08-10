/* ==========================================================================
   SECTION 07 — TESTIMONIALS
   One quote at a time inside a bordered card, with dots and round arrows
   underneath, followed by the scrolling client strip.
   Text, quotes & clients: src/data/site.js → `testimonials`
   ========================================================================== */

import { useCallback, useEffect, useState } from 'react'
import { testimonials } from '../data/site'
import Accent from '../components/Accent'
import { ArrowLeft, ArrowRight, Quote } from '../components/Icons'
import './Testimonials.css'

export default function Testimonials() {
  const items = testimonials.items
  const count = items.length
  const clients = testimonials.clients ?? []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (step) => setIndex((current) => (current + step + count) % count),
    [count],
  )

  useEffect(() => {
    if (paused || count < 2) return undefined
    const id = window.setInterval(() => go(1), testimonials.autoplayMs)
    return () => window.clearInterval(id)
  }, [paused, count, go])

  const item = items[index]

  return (
    <section className="testimonials section section--light" id="testimonials">
      <div className="container">
        <div className="sec-head" data-reveal>
          <h2>
            <Accent text={testimonials.title} />
          </h2>
          <span className="sec-head__rule" />
        </div>

        <div
          className="quote-box"
          data-reveal
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* `key` restarts the fade on every change. */}
          <figure className="quote" key={index}>
            <Quote className="quote__mark" />
            <blockquote>{item.quote}</blockquote>
            <figcaption>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
            </figcaption>
          </figure>

          <div className="quote-box__controls">
            <button
              className="round-btn"
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
            >
              <ArrowLeft />
            </button>

            <div className="dots">
              {items.map((entry, i) => (
                <button
                  key={entry.name}
                  type="button"
                  className={i === index ? 'is-active' : ''}
                  aria-label={`Testimonial ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>

            <button
              className="round-btn"
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Client logo strip — only renders once logos are added to site.js. */}
      {clients.length > 0 && (
        <div className="clients" aria-label="Clients we have worked with">
          <div className="clients__row">
            {/* The list is printed twice so the loop has no visible seam. */}
            {[...clients, ...clients].map((client, i) => (
              <span className="clients__item" key={`${client.name}-${i}`} aria-hidden={i >= clients.length}>
                {client.logo ? (
                  <img src={client.logo} alt={client.name} loading="lazy" />
                ) : (
                  client.name
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
