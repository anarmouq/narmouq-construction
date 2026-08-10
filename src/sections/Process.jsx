/* ==========================================================================
   SECTION 04 — PROCESS
   Text & steps: src/data/site.js → `workProcess`
   ========================================================================== */

import { workProcess } from '../data/site'
import Accent from '../components/Accent'
import './Process.css'

export default function Process() {
  return (
    <section className="process section section--light" id="process">
      <div className="container">
        <div className="sec-head" data-reveal>
          <h2>
            <Accent text={workProcess.title} />
          </h2>
          <span className="sec-head__rule" />
          <p>{workProcess.text}</p>
        </div>

        <ol className="process__steps">
          {workProcess.steps.map((step, i) => (
            <li className="step" key={step.number} data-reveal style={{ '--reveal-delay': `${i * 0.1}s` }}>
              <span className="step__number">{step.number}</span>
              <span className="step__dot" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
