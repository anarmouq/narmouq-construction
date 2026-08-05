/* ==========================================================================
   SECTION 07 — TESTIMONIALS
   Text & quotes: src/data/site.js → `testimonials`
   ========================================================================== */

import { testimonials } from '../data/site'
import { Quote } from '../components/Icons'
import './Testimonials.css'

export default function Testimonials() {
  return (
    <section className="testimonials section section--light" id="testimonials">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <p className="eyebrow">{testimonials.eyebrow}</p>
          <h2>{testimonials.title}</h2>
        </div>

        <div className="testimonials__grid">
          {testimonials.items.map((item, i) => (
            <figure
              className="testimonial"
              key={item.name}
              data-reveal
              style={{ '--reveal-delay': `${i * 0.1}s` }}
            >
              <Quote className="testimonial__mark" />
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="testimonial__avatar">{item.name.charAt(0)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
