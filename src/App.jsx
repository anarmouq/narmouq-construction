/* ==========================================================================
   NARMOUQ CONSTRUCTION — pages
   Every link in the top bar opens its own page. Each page is a file in
   src/pages/ and is made of sections from src/sections/.
   To add a page: create it in src/pages/, add a <Route> below, and add a
   link to `nav` in src/data/site.js.
   All wording, images and numbers live in src/data/site.js
   ========================================================================== */

import { useEffect } from 'react'
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

/* Start every new page at the top instead of keeping the old scroll spot. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}
