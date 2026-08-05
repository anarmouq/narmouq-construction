import { company, nav, services } from '../data/site'
import { Mail, Phone, Pin } from './Icons'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a className="footer__logo" href="#home" aria-label={`${company.fullName} — home`}>
            <img src={company.logoFullLight} alt={company.fullName} loading="lazy" />
          </a>
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
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <ul>
            {services.items.slice(0, 5).map((item) => (
              <li key={item.title}>
                <a href="#services">{item.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
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

      <div className="container footer__bar">
        <p>
          © {new Date().getFullYear()} {company.fullName}. All rights reserved.
        </p>
        <a className="footer__top" href="#home">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
