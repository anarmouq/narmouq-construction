/* ==========================================================================
   MODEL SHOWCASE — a project shown as a live, interactive 3D model.
   The model is a separate page in public/projects/ shown inside a frame.
   It only loads when the visitor clicks "Explore the 3D model", so the
   page stays fast and scrolling isn't captured by the 3D view.
   ========================================================================== */

import { useState } from 'react'
import './ModelShowcase.css'

/* Gold line drawing of the deck, shown before the model loads. */
function DeckDrawing() {
  return (
    <svg className="showcase__drawing" viewBox="0 0 800 420" aria-hidden="true">
      {/* ground */}
      <path className="d-ground" d="M40 360 H760" />
      {/* house wall */}
      <path className="d-faint" d="M110 360 V70 H150 V360" />
      {/* footings */}
      <path className="d-faint" d="M318 360 v26 M498 360 v26 M648 360 v26" />
      {/* posts */}
      <path d="M310 360 V214 M326 360 V214 M490 360 V214 M506 360 V214 M640 360 V214 M656 360 V214" />
      {/* beam + joists + decking */}
      <path d="M150 214 H680 M150 196 H680 M150 178 H690" />
      {/* railing */}
      <path d="M150 178 V128 H690 V178 M200 128 V178 M250 128 V178 M300 128 V178 M350 128 V178 M400 128 V178 M450 128 V178 M500 128 V178 M550 128 V178 M600 128 V178 M650 128 V178" className="d-faint" />
      {/* stair: 10 steps from the deck down to the patio */}
      <path d={`M690 178 ${'h9 v18.2 '.repeat(10)}`} />
      <path className="d-faint" d="M690 196 L780 360" />
      {/* height dimension */}
      <path className="d-dim" d="M70 178 V360 M60 178 H80 M60 360 H80" />
      <text x="62" y="160" className="d-label">10′-9″</text>
    </svg>
  )
}

export default function ModelShowcase({ project }) {
  const [loaded, setLoaded] = useState(false)   // iframe has been added to the page
  const [active, setActive] = useState(false)   // the model is taking mouse/touch input

  const start = () => {
    setLoaded(true)
    setActive(true)
  }

  return (
    <article className="showcase" data-reveal>
      <div className={`showcase__stage ${active ? 'is-active' : ''}`}>
        {loaded ? (
          <iframe
            src={project.model}
            title={`${project.title}, interactive 3D model`}
            allow="fullscreen"
          />
        ) : (
          <DeckDrawing />
        )}

        {!active && (
          <button type="button" className="showcase__start" onClick={start}>
            <span className="showcase__start-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 0v10m0 0 9-5m-9 5-9-5m9 5v10" />
              </svg>
            </span>
            {loaded ? 'Back to the model' : 'Explore the 3D model'}
          </button>
        )}

        {active && (
          <button
            type="button"
            className="showcase__done"
            onClick={() => setActive(false)}
          >
            Done exploring
          </button>
        )}
      </div>

      <div className="showcase__body">
        <div className="showcase__story">
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <p className="showcase__detail">{project.detail}</p>
          <a className="showcase__full" href={project.model} target="_blank" rel="noreferrer">
            Open the model full screen
          </a>
        </div>

        <dl className="showcase__facts">
          {project.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
