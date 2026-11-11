/* ==========================================================================
   FOOTER — skyline line drawing, brand, links and contact details.
   Styles: src/styles/style.css ("footer").
   ========================================================================== */

import { Link } from 'react-router-dom'
import { company, nav } from '../data/site'
import { Brand } from './Header'
import SmartLink from './SmartLink'

const services = [
  ['general', 'General contracting'],
  ['commercial', 'Commercial builds'],
  ['residential', 'Residential projects'],
  ['renovation', 'Renovation and retrofit'],
  ['infrastructure', 'Infrastructure and sitework'],
]

const socialIcons = {
  Facebook: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" /></svg>,
  Instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>,
  LinkedIn: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v2c.6-1.2 2-2.3 4-2.3 3.5 0 4 2.3 4 5.3v7h-4v-6c0-1.5 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H10z" /></svg>,
}

export default function Footer() {
  return (
    <footer className="footer">
      <svg className="footer__skyline" viewBox="0 0 1600 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 170h90v-70h100v110h95V60h110v120h105V40h80v80h120V70h100v130h110V20h100v110h120V90h90v90h110V60h120v80h95v-30h135" fill="none" stroke="rgba(92,200,255,.14)" strokeWidth="1.5" />
        <path d="M0 200h1600" stroke="rgba(237,234,228,.08)" />
      </svg>
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Brand />
          <p>Licensed general contractor delivering residential, commercial and industrial projects with clear pricing and dependable programmes.</p>
          <div className="socials">
            {company.social.map((s) => (
              <a key={s.label} className="glass" href={s.href} aria-label={s.label}>{socialIcons[s.label]}</a>
            ))}
          </div>
        </div>
        <div>
          <h4>Navigation</h4>
          <ul>
            {nav.flatMap((item) => item.children || [item]).map((item) => (
              <li key={item.href}><SmartLink href={item.href}>{item.label}</SmartLink></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            {services.map(([id, label]) => (
              <li key={id}><Link to={`/services#${id}`}>{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Information</h4>
          <ul className="info">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>{company.address}</li>
            <li><svg><use href="#phone" /></svg><a href={company.phoneHref}>{company.phone}</a></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6l8.5 7 8.5-7" /></svg><a href={`mailto:${company.email}`}>{company.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} {company.fullName}. All rights reserved.</span>
        <span>Licensed general contractor, Maryland</span>
      </div>
    </footer>
  )
}
