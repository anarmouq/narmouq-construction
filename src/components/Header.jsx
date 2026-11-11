/* ==========================================================================
   TOP BAR — liquid-glass pill fixed to the top of the window, plus the
   mobile menu. Styles: src/styles/style.css ("top bar", "mobile menu").
   Links come from `nav` in src/data/site.js.
   ========================================================================== */

import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { company, nav } from '../data/site'
import { isInternal } from './SmartLink'

/* Site pages get aria-current="page" (the highlight) when you're on them;
   standalone pages like the 3D model are plain links. */
function NavItem({ item, className }) {
  if (!isInternal(item.href)) {
    return <a className={className} href={item.href}>{item.label}</a>
  }
  return (
    <NavLink className={className} to={item.href} end={item.href === '/'}>
      {item.label}
    </NavLink>
  )
}

/* "3D Model" drop-down: opens on hover, on keyboard focus, or with a tap. */
function NavDropdown({ item }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { pathname } = useLocation()
  const active = item.children.some((c) => c.href === pathname)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const away = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const key = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', away)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <li className={`nav__drop${open ? ' is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className={`nav__toggle${active ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <ul className="nav__menu">
        {item.children.map((c) => (
          <li key={c.href}><NavItem item={c} /></li>
        ))}
      </ul>
    </li>
  )
}

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label={`${company.fullName}, home`}>
      <img className="brand__mark" src={company.logoMark} alt="" width="40" height="40" />
      <span className="brand__text">
        <span className="brand__name">NARMOUQ</span>
        <span className="brand__sub">CONSTRUCTION</span>
      </span>
    </Link>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* The menu closes on any page change and with the Escape key. */
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
        <div className="topbar__inner glass glass--refract">
          <Brand />
          <nav className="nav" aria-label="Main">
            <ul>
              {nav.map((item) =>
                item.children ? (
                  <NavDropdown key={item.label} item={item} />
                ) : (
                  <li key={item.href}><NavItem item={item} /></li>
                ),
              )}
            </ul>
          </nav>
          <div className="topbar__actions">
            <Link className="btn btn--ghost btn--sm" to="/contact" data-magnetic="0.2">Get a quote</Link>
            <a className="btn btn--amber btn--sm" href={company.phoneHref} data-magnetic="0.2">
              <svg><use href="#phone" /></svg>Call
            </a>
          </div>
          <button
            className="menu-btn"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      <div className="mobile-menu glass" id="mobile-menu">
        <ul>
          {nav.map((item) =>
            item.children ? (
              <li key={item.label} className="mm-group">
                <span className="mm-group__label">{item.label}</span>
                <ul>
                  {item.children.map((c) => (
                    <li key={c.href}><NavItem item={c} className="mm-link mm-link--sub" /></li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={item.href}><NavItem item={item} className="mm-link" /></li>
            ),
          )}
        </ul>
        <Link className="btn btn--ghost" to="/contact">Get a quote</Link>
        <a className="btn btn--amber" href={company.phoneHref}>
          <svg><use href="#phone" /></svg>Call {company.phone}
        </a>
      </div>
    </>
  )
}
