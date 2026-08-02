import { useEffect, useState } from 'react'
import './App.css'

const services = [
  {
    number: '01',
    title: 'General Contracting',
    text: 'Full project delivery from planning and permits to construction and handover.',
  },
  {
    number: '02',
    title: 'Commercial Builds',
    text: 'Efficient, durable spaces designed for offices, retail, hospitality, and industry.',
  },
  {
    number: '03',
    title: 'Residential Projects',
    text: 'Modern homes built around comfort, strong materials, and precise finishing.',
  },
  {
    number: '04',
    title: 'Renovation',
    text: 'Smart upgrades that improve function, appearance, energy use, and property value.',
  },
]

const projects = [
  {
    title: 'Modern Residence',
    category: 'Residential',
    image:
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Urban Business Center',
    category: 'Commercial',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Site Development',
    category: 'Construction',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=85',
  },
]

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

function MenuIcon({ open }) {
  return (
    <span className={`menu-icon ${open ? 'is-open' : ''}`} aria-hidden="true">
      <span />
      <span />
    </span>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let animationFrame = null

    const updateScroll = () => {
      if (animationFrame) return

      animationFrame = window.requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        animationFrame = null
      })
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScroll)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const logoScale = Math.max(0.7, 1 - scrollY / 1600)
  const logoLift = Math.min(scrollY * 0.16, 85)
  const logoOpacity = Math.max(0.32, 1 - scrollY / 1100)
  const backgroundShift = Math.min(scrollY * 0.17, 180)

  return (
    <div className="site-shell">
      <header className={`topbar ${scrollY > 40 ? 'topbar-scrolled' : ''}`}>
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Narmouq home">
          <img src="/logo.png" alt="Narmouq logo" />
          <span>NARMOUQ</span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <MenuIcon open={menuOpen} />
        </button>

        <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#projects" onClick={closeMenu}>Projects</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Get a quote</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div
            className="hero-grid"
            style={{ transform: `translate3d(0, ${backgroundShift}px, 0)` }}
          />
          <div className="hero-glow" />
          <div className="hero-line hero-line-left" />
          <div className="hero-line hero-line-right" />

          <div
            className="hero-content"
            style={{
              transform: `translate3d(0, ${logoLift}px, 0) scale(${logoScale})`,
              opacity: logoOpacity,
            }}
          >
            <img className="hero-logo" src="/logo.png" alt="Narmouq company logo" />
            <p className="eyebrow">BUILDING WITH PURPOSE</p>
            <h1>NARMOUQ CONSTRUCTION</h1>
            <p className="hero-copy">
              Strong structures. Refined details. Projects delivered with confidence.
            </p>
            <a className="primary-button" href="#projects">
              View our work <ArrowIcon />
            </a>
          </div>

          <a className="scroll-cue" href="#about" aria-label="Scroll to about section">
            <span>SCROLL</span>
            <i />
          </a>
        </section>

        <section className="intro section" id="about">
          <div className="section-label">01 / WHO WE ARE</div>
          <div className="intro-grid">
            <h2>We turn ambitious ideas into lasting places.</h2>
            <div>
              <p>
                Narmouq is a construction company focused on quality execution, clear
                communication, and modern project delivery.
              </p>
              <div className="stats">
                <article><strong>12+</strong><span>Years of experience</span></article>
                <article><strong>80+</strong><span>Completed projects</span></article>
                <article><strong>100%</strong><span>Commitment to quality</span></article>
              </div>
            </div>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-heading">
            <div className="section-label">02 / SERVICES</div>
            <h2>Built for every stage.</h2>
          </div>

          <div className="service-list">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ArrowIcon />
              </article>
            ))}
          </div>
        </section>

        <section className="parallax-panel" aria-label="Construction vision statement">
          <div
            className="parallax-image"
            style={{ transform: `translate3d(0, ${Math.max(-80, 120 - scrollY * 0.045)}px, 0) scale(1.12)` }}
          />
          <div className="parallax-overlay" />
          <div className="parallax-copy">
            <p>OUR STANDARD</p>
            <h2>Plan precisely.<br />Build boldly.</h2>
          </div>
        </section>

        <section className="projects section" id="projects">
          <div className="section-heading projects-heading">
            <div>
              <div className="section-label">03 / SELECTED WORK</div>
              <h2>Projects that speak for themselves.</h2>
            </div>
            <a className="text-link" href="#contact">Start your project <ArrowIcon /></a>
          </div>

          <div className="project-grid">
            {projects.map((project, index) => (
              <article className={`project-card project-${index + 1}`} key={project.title}>
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-shade" />
                <div className="project-info">
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-mark">
            <img src="/logo.png" alt="" aria-hidden="true" />
          </div>
          <div className="contact-content">
            <div className="section-label">04 / CONTACT</div>
            <h2>Let’s build something exceptional.</h2>
            <p>Tell us about your project and we will contact you to discuss the next steps.</p>
            <div className="contact-actions">
              <a className="primary-button light-button" href="mailto:info@narmouq.com">
                info@narmouq.com <ArrowIcon />
              </a>
              <a className="phone-link" href="tel:+962000000000">+962 00 000 0000</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <img src="/logo.png" alt="Narmouq logo" />
          <span>NARMOUQ CONSTRUCTION</span>
        </div>
        <p>© {new Date().getFullYear()} Narmouq. All rights reserved.</p>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  )
}
