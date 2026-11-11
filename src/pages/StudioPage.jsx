/* ==========================================================================
   DESIGN STUDIO PAGE — /design-studio
   Lay out rooms, add furniture and try finishes in 3D, then send the plan
   to the contact form. The studio itself is in src/studio/.
   ========================================================================== */

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Studio from '../studio/Studio'

export default function StudioPage() {
  useEffect(() => {
    document.title = 'Design studio | Narmouq Construction'
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Lay out rooms, add furniture and try floor, wall and fabric finishes in 3D, then send the plan to Narmouq Construction.',
    )
  }, [])

  return (
    <section className="studio-page" aria-labelledby="studio-title">
      <div className="wrap">
        <div className="studio-page__head">
          <div>
            <nav className="crumbs glass" aria-label="Breadcrumb">
              <Link to="/">Home</Link><span aria-hidden="true">/</span>
              <span aria-current="page">Design studio</span>
            </nav>
            <h1 className="h1" id="studio-title">Draw it. Furnish it. Make it yours.</h1>
          </div>
          <p className="lead">
            Lay out rooms, drop in furniture and try every floor, wall and fabric finish in 3D. When it feels right,
            send the plan to our team as the start of your brief.
          </p>
        </div>
        <Studio />
        <p className="studio-page__note">
          Your plan is saved in this browser. Doorways appear where rooms meet, and windows on open outside walls.
        </p>
      </div>
    </section>
  )
}
