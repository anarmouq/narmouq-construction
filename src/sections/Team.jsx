/* ==========================================================================
   SECTION 07 — TEAM
   Three portrait cards. People & photos: src/data/site.js → `team`
   Photos live in public/ as pic1.jpg, pic2.jpg, pic3.jpg. Until those files
   exist the card falls back to a plain grey panel rather than showing the
   browser's broken-image icon.
   ========================================================================== */

import { useState } from 'react'
import { team } from '../data/site'
import Accent from '../components/Accent'
import './Team.css'

export default function Team() {
  const [missing, setMissing] = useState(() => new Set())

  const markMissing = (src) =>
    setMissing((current) => new Set(current).add(src))

  return (
    <section className="team section section--tint" id="team">
      <div className="container">
        <div className="sec-head" data-reveal>
          <h2>
            <Accent text={team.title} />
          </h2>
          <span className="sec-head__rule" />
          <p>{team.text}</p>
        </div>

        <div className="team__grid">
          {team.members.map((member, i) => (
            <article
              className="team-card"
              key={member.name}
              data-reveal
              style={{ '--reveal-delay': `${i * 0.1}s` }}
            >
              <div className="team-card__photo">
                {!missing.has(member.image) && (
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    onError={() => markMissing(member.image)}
                  />
                )}
              </div>

              <div className="team-card__body">
                <h3>{member.name}</h3>
                <span className="team-card__role">{member.role}</span>
                <p>{member.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
