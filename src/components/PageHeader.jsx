/* ==========================================================================
   PAGE HEADER — the dark banner at the top of every inner page
   (About, Services, …). It leaves room for the floating top bar, then shows
   the page title, a short intro and a "Home / Page" trail.
   The wording for each page lives in `pages` in src/data/site.js.
   ========================================================================== */

import { Link } from 'react-router-dom'
import { pages } from '../data/site'
import './PageHeader.css'

export default function PageHeader({ page }) {
  const { title, intro, image } = pages[page]

  return (
    <section className="page-head" style={image ? { '--page-img': `url(${image})` } : undefined}>
      <div className="container page-head__inner">
        <nav className="page-head__trail" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </section>
  )
}
