/* ==========================================================================
   HEADER — floating dark pill bar. It is fixed to the top of the window,
   sits over the hero, and stays in view while the page scrolls.
   Logo on the left, navigation in the middle, phone + quote + call on the right.
   ========================================================================== */

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { company, nav } from '../data/site'
import { onScroll } from '../hooks/useScrollReveal'
import { Phone } from './Icons'
import { isInternal } from './SmartLink'
import './Header.css'

/* A menu link: site pages get the "active" highlight when you're on them;
   anything else (like the 3D model .html file) is a plain link. */
function NavItem({ item, ...rest }) {
  if (!isInternal(item.href)) {
    return (
      <a href={item.href} {...rest}>
        {item.label}
      </a>
    )
  }
  return (
    <NavLink to={item.href} end={item.href === '/'} {...rest}>
      {item.label}
    </NavLink>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => onScroll((y) => setScrolled(y > 20)), [])

  /* Lock page scrolling while the mobile menu is open. */
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  /* Keep everything inside the bar. The bar measures itself and, while its
     contents don't fit, drops one thing at a time (see Header.css, "Fit"):
       fit 0  everything shown
       fit 1  hide the hours + phone block (the Call button stays)
       fit 2  also hide "Get a quote", tighten the links
       fit 3  links move into the menu button
     This works at any screen size, zoom level or font. */
  const headerRef = useRef(null)
  const innerRef = useRef(null)
  const [compact, setCompact] = useState(false)

  useLayoutEffect(() => {
    const header = headerRef.current
    const inner = innerRef.current
    if (!header || !inner) return

    const fit = () => {
      let level = 0
      for (;;) {
        header.dataset.fit = level
        if (level === 3 || inner.scrollWidth <= inner.clientWidth + 1) break
        level++
      }
      setCompact(level === 3)
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(document.documentElement)
    document.fonts?.ready.then(fit)
    return () => ro.disconnect()
  }, [])

  /* Close the menu once the full links fit in the bar again. */
  useEffect(() => {
    if (!compact) setOpen(false)
  }, [compact])

  const close = () => setOpen(false)

  return (
    <>
      <header
        ref={headerRef}
        className={`header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}
      >
        <div className="header__inner container" ref={innerRef}>
          <Link
            className="header__brand"
            to="/"
            onClick={close}
            aria-label={`${company.fullName} — home`}
          >
            <img src={company.logoMark} alt="" width="48" height="40" />
            <span>
              <strong>{company.name}</strong>
              <small>Construction</small>
            </span>
          </Link>

          <nav className="header__nav" aria-label="Main navigation">
            {nav.map((item) => (
              <NavItem key={item.href} item={item} onClick={close} />
            ))}
          </nav>

          <div className="header__actions">
            <a className="header__phone" href={company.phoneHref}>
              <small>{company.hoursShort}</small>
              <span>{company.phone}</span>
            </a>
            <Link className="header__btn header__btn--outline" to="/contact" onClick={close}>
              Get a quote
            </Link>
            <a className="header__btn header__btn--solid" href={company.phoneHref}>
              <Phone />
              Call
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
            <NavItem key={item.href} item={item} onClick={close} style={{ '--i': i }} />
          ))}
        </nav>
        <div className="drawer__foot">
          <Link className="btn btn--primary" to="/contact" onClick={close}>
            Get a quote
          </Link>
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
