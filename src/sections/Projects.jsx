/* ==========================================================================
   SECTION 05 — PROJECTS
   Text & items: src/data/site.js → `projects`
   Add an item with `featured: true` to make it span the large tile.
   ========================================================================== */

import { useMemo, useState } from 'react'
import { projects } from '../data/site'
import { ArrowRight } from '../components/Icons'
import './Projects.css'

export default function Projects() {
  const [filter, setFilter] = useState('All')

  const categories = useMemo(
    () => ['All', ...new Set(projects.items.map((p) => p.category))],
    [],
  )

  const visible =
    filter === 'All' ? projects.items : projects.items.filter((p) => p.category === filter)

  return (
    <section className="projects section section--tint" id="projects">
      <div className="container">
        <div className="section-head section-head--split" data-reveal>
          <div>
            <p className="eyebrow">{projects.eyebrow}</p>
            <h2>{projects.title}</h2>
            <p>{projects.text}</p>
          </div>
          <a className="text-link" href={projects.cta.href}>
            {projects.cta.label} <ArrowRight />
          </a>
        </div>

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
      </div>
    </section>
  )
}
