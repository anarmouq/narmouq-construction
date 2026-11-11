/* ==========================================================================
   3D MODEL PAGE — one of your 3D model files (in public/projects/) shown
   inside the website, between the top bar and the footer.
   The list of models is `models` in src/data/site.js; each one gets its
   own page and its own entry in the "3D Model" menu.
   ========================================================================== */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function ModelPage({ model }) {
  useEffect(() => {
    document.title = `${model.title}: 3D model | Narmouq Construction`
    document.querySelector('meta[name="description"]')?.setAttribute('content', model.description)
  }, [model])

  return (
    <section className="kitchen" aria-labelledby="model-page-title">
      <div className="wrap kitchen__head">
        <div>
          <nav className="crumbs glass" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/projects">Projects</Link><span aria-hidden="true">/</span>
            <span aria-current="page">{model.label}</span>
          </nav>
          <h1 className="h2" id="model-page-title">{model.title}</h1>
        </div>
        <a className="link-line" href={model.file} target="_blank" rel="noopener">
          Open full screen
        </a>
      </div>
      <div className="wrap">
        <iframe
          key={model.file}
          className="kitchen__frame"
          src={model.file}
          title={`${model.title}: interactive 3D model`}
          allow="fullscreen"
        />
      </div>
    </section>
  )
}
