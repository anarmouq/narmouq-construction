import { useEffect, useState } from 'react'
import { company, nav } from '../data/site'
import { onScroll } from '../hooks/useScrollReveal'
import { Phone } from './Icons'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => onScroll((y) => setScrolled(y > 30)), [])

  /* Lock page scrolling while the mobile menu is open. */
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  /* Close the mobile menu when the viewport grows to desktop size. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 981px)')
    const handler = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
        <div className="header__inner container">
          <a className="header__brand" href="#home" onClick={close} aria-label={`${company.fullName} — home`}>
            <img src={company.logoMark} alt="" width="46" height="46" />
            <span>
              <strong>{company.name}</strong>
              <small>Construction</small>
            </span>
          </a>

          <nav className="header__nav" aria-label="Main navigation">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={close}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <a className="header__phone" href={company.phoneHref}>
              <Phone />
              <span>{company.phone}</span>
            </a>
            <a className="btn btn--primary header__cta" href="#contact">
              Get a quote
            </a>
          </div>

          <button
            className="header__burger"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`drawer ${open ? 'is-open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {nav.map((item, i) => (
            <a key={item.href} href={item.href} onClick={close} style={{ '--i': i }}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="drawer__foot">
          <a className="btn btn--primary" href="#contact" onClick={close}>
            Get a quote
          </a>
          <a className="drawer__phone" href={company.phoneHref}>
            <Phone /> {company.phone}
          </a>
        </div>
      </div>
      <button
        className={`drawer__scrim ${open ? 'is-open' : ''}`}
        onClick={close}
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
      />
    </>
  )
}
