/* ==========================================================================
   NARMOUQ CONSTRUCTION — pages
   Design: src/styles/style.css (from the "style test" site).
   Page content: src/pages/html/*.html — edit those to change wording.
   Top bar and footer: src/components/Header.jsx and Footer.jsx.
   Interactions (reveals, carousel, tilt, contact form, 3D model in the
   project drawing): src/lib/siteEffects.js
   ========================================================================== */

import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ProcessPage from './pages/ProcessPage'
import ProjectsPage from './pages/ProjectsPage'
import TeamPage from './pages/TeamPage'
import ContactPage from './pages/ContactPage'
import NotFoundPage from './pages/NotFoundPage'
import ModelPage from './pages/ModelPage'
import { models } from './data/site'
import { initGlobal } from './lib/siteEffects'

/* The design studio (3D editor) is large, so it loads only when its page opens. */
const StudioPage = lazy(() => import('./pages/StudioPage'))

/* Start every new page at the top instead of keeping the old scroll spot. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  useEffect(() => initGlobal(), [])

  return (
    <>
      <a className="sr-only" href="#main">Skip to content</a>
      <ScrollToTop />
      <Header />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {models.map((m) => (
            <Route key={m.path} path={m.path} element={<ModelPage model={m} />} />
          ))}
          <Route path="/design-studio" element={<Suspense fallback={<div className="studio-page" />}><StudioPage /></Suspense>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <div className="grain" aria-hidden="true"></div>
    </>
  )
}
