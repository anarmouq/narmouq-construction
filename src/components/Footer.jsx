/* ==========================================================================
   FOOTER — near-black band with a faint skyline drawn across the bottom,
   the logo on the left and the link columns to its right.
   ========================================================================== */

import { company, nav, services } from '../data/site'
import { Mail, Phone, Pin } from './Icons'
import SmartLink from './SmartLink'
import './Footer.css'

/* A simple line-art skyline used as a watermark behind the footer content. */
function Skyline() {
  return (
    <svg
      className="footer__skyline"
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path d="M0 200 V150 H60 V110 H120 V170 H180 V90 H250 V130 H310 V60 H360 V120 H430 V150 H500 V80 H560 V140 H620 V100 H690 V160 H750 V70 H810 V130 H880 V110 H940 V165 H1010 V95 H1070 V145 H1140 V120 H1200 V200 Z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <Skyline />

      <div className="container footer__grid">
        <div className="footer__brand">
          <SmartLink className="footer__logo" href="/" aria-label={`${company.fullName} — home`}>
            <img src={company.logoFullLight} alt={company.fullName} loading="lazy" />
          </SmartLink>
          <p className="footer__blurb">
            Licensed general contractor delivering residential, commercial and industrial
            projects with clear pricing and dependable programmes.
          </p>
          <div className="footer__social">
            {company.social.map((item) => (
              <a key={item.label} href={item.href} aria-label={item.label}>
                {item.label.charAt(0)}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__col">
          <h4>Navigation</h4>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href}>{item.label}</SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <ul>
            {services.items.slice(0, 5).map((item) => (
              <li key={item.title}>
                <SmartLink href="/services">{item.title}</SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Information</h4>
          <ul className="footer__contact">
            <li>
              <Pin />
              <span>{company.address}</span>
            </li>
            <li>
              <Phone />
              <a href={company.phoneHref}>{company.phone}</a>
            </li>
            <li>
              <Mail />
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <div className="container">
          <p>
            All rights reserved © {new Date().getFullYear()} {company.fullName}
          </p>
        </div>
      </div>
    </footer>
  )
}
