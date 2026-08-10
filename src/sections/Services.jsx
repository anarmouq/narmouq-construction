/* ==========================================================================
   SECTION 04 — SERVICES
   A 3D "coverflow" carousel: the middle card is in focus and the cards on
   either side are scaled back and faded out. Move it by clicking a side card,
   using the arrows, dragging the progress bar, swiping, or the arrow keys.
   Text & items: src/data/site.js → `services`
   ========================================================================== */

import { useCallback, useRef, useState } from 'react'
import { company, services } from '../data/site'
import Accent from '../components/Accent'
import { ArrowLeft, ArrowRight } from '../components/Icons'
import './Services.css'

/* How far each ring of cards sits from the middle, how much it shrinks and
   how faded it gets. Index 0 is the focused card. Anything past the last
   entry is hidden. */
const RINGS = [
  { x: 0, scale: 1, opacity: 1 },
  { x: 107, scale: 0.72, opacity: 0.45 },
  { x: 200, scale: 0.55, opacity: 0.22 },
]

export default function Services() {
  const items = services.items
  const count = items.length
  const [active, setActive] = useState(Math.min(2, count - 1))
  const trackRef = useRef(null)
  const swipe = useRef(null)

  const go = useCallback(
    (step) => setActive((current) => (current + step + count) % count),
    [count],
  )

  /* Signed distance from the focused card, wrapping around the ends so the
     carousel is endless in both directions. */
  const offsetOf = (i) => {
    let d = i - active
    if (d > count / 2) d -= count
    if (d < -count / 2) d += count
    return d
  }

  /* ---- Progress bar: click or drag anywhere along the track ------------- */

  const seek = (clientX) => {
    const track = trackRef.current
    if (!track) return
    const { left, width } = track.getBoundingClientRect()
    const ratio = Math.min(Math.max((clientX - left) / width, 0), 1)
    setActive(Math.round(ratio * (count - 1)))
  }

  const startSeek = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    seek(event.clientX)
  }

  const moveSeek = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(event.clientX)
  }

  /* ---- Swiping the cards themselves ------------------------------------ */

  const startSwipe = (event) => {
    swipe.current = event.clientX
  }

  const endSwipe = (event) => {
    if (swipe.current === null) return
    const dx = event.clientX - swipe.current
    swipe.current = null
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(-1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(1)
    }
  }

  return (
    <section className="services section section--light" id="services">
      <div className="container">
        <div className="sec-head" data-reveal>
          <h2>
            <Accent text={services.title} />
          </h2>
          <span className="sec-head__rule" />
        </div>

        <div
          className="svc-stage"
          role="group"
          aria-roledescription="carousel"
          aria-label="Our services"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={startSwipe}
          onPointerUp={endSwipe}
          data-reveal
        >
          {items.map((item, i) => {
            const offset = offsetOf(i)
            const ring = RINGS[Math.abs(offset)] /* undefined = off-stage */
            const focused = offset === 0

            return (
              <article
                className={`svc-card ${focused ? 'is-focused' : ''}`}
                key={item.number}
                aria-hidden={!focused}
                style={{
                  '--x': `${ring ? Math.sign(offset) * ring.x : 0}%`,
                  '--s': ring ? ring.scale : 0.4,
                  opacity: ring ? ring.opacity : 0,
                  visibility: ring ? 'visible' : 'hidden',
                  zIndex: RINGS.length - Math.abs(offset),
                }}
              >
                <button
                  type="button"
                  className="svc-card__hit"
                  tabIndex={focused ? -1 : 0}
                  aria-label={`Show ${item.title}`}
                  onClick={() => setActive(i)}
                />

                <div className="svc-card__media">
                  <img src={item.image} alt="" loading="lazy" />
                  <img className="svc-card__mark" src={company.logoMark} alt="" loading="lazy" />
                </div>

                <div className="svc-card__body">
                  <h3>{item.title}</h3>

                  {/* Collapsed to zero height until this card is in focus, so
                      the side cards stay compact image tiles. */}
                  <div className="svc-card__extra">
                    <div>
                      <p>{item.text}</p>
                      <a className="svc-card__link" href="#contact" tabIndex={focused ? 0 : -1}>
                        Enquire <ArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="svc-controls">
          <button
            className="round-btn"
            type="button"
            aria-label="Previous service"
            onClick={() => go(-1)}
          >
            <ArrowLeft />
          </button>

          <div
            className="svc-track"
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Service"
            aria-valuemin={1}
            aria-valuemax={count}
            aria-valuenow={active + 1}
            aria-valuetext={items[active].title}
            onKeyDown={onKeyDown}
            onPointerDown={startSeek}
            onPointerMove={moveSeek}
          >
            <span
              className="svc-track__thumb"
              style={{
                '--w': `${100 / count}%`,
                '--p': `${(active / (count - 1)) * (100 - 100 / count)}%`,
              }}
            />
          </div>

          <button
            className="round-btn"
            type="button"
            aria-label="Next service"
            onClick={() => go(1)}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  )
}
