/* ==========================================================================
   SECTION 05 — PROJECTS
   Text & items: src/data/site.js → `projects`
   Add an item with `featured: true` to make it span the large tile.
   ========================================================================== */

import { useState } from 'react'
import { projects } from '../data/site'
import Accent from '../components/Accent'
import { ArrowRight } from '../components/Icons'
import SmartLink from '../components/SmartLink'
import ModelShowcase from '../components/ModelShowcase'
import './Projects.css'

export default function Projects() {
  const [filter, setFilter] = useState('All')

  /* Projects with a 3D model get the large interactive stage; the rest go in the grid. */
  const modelProjects = projects.items.filter((p) => p.model)
  const photoProjects = projects.items.filter((p) => !p.model)

  const categories = ['All', ...new Set(photoProjects.map((p) => p.category))]

  const visible =
    filter === 'All' ? photoProjects : photoProjects.filter((p) => p.category === filter)

  return (
    <section className="projects section section--tint" id="projects">
      <div className="container">
        <div className="sec-head" data-reveal>
          <h2>
            <Accent text={projects.title} />
          </h2>
          <span className="sec-head__rule" />
          <p>{projects.text}</p>
        </div>

        {modelProjects.map((project) => (
          <ModelShowcase key={project.title} project={project} />
        ))}

        {/* Filter buttons: only shown once there are photo projects in more than one category. */}
        {categories.length > 2 && (
        <div className="projects__filters" data-reveal role="tablist" aria-label="Filter projects">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={filter === cat}
              className={filter === cat ? 'is-active' : ''}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        )}

        {/* Photo projects grid: only shown when there are photo projects. */}
        {visible.length > 0 && (
        <div className="projects__grid">
          {visible.map((project, i) => (
            <article
              className={`project ${project.featured ? 'project--wide' : ''}`}
              key={project.title}
              data-reveal
              style={{ '--reveal-delay': `${(i % 3) * 0.09}s` }}
            >
              <img src={project.image} alt={project.title} loading="lazy" />
              <div className="project__shade" />
              <div className="project__info">
                <span className="project__cat">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.meta}</p>
              </div>
              <span className="project__arrow" aria-hidden="true">
                <ArrowRight />
              </span>
            </article>
          ))}
        </div>
        )}

        <div className="projects__cta" data-reveal>
          <SmartLink className="btn btn--dark" href={projects.cta.href}>
            {projects.cta.label} <ArrowRight />
          </SmartLink>
        </div>
      </div>
    </section>
  )
}
