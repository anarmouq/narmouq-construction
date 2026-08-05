/* ==========================================================================
   NARMOUQ CONSTRUCTION — page order
   Each section below is a separate file in src/sections/.
   To reorder the page, move a line. To remove a section, delete its line.
   All wording, images and numbers live in src/data/site.js
   ========================================================================== */

import Header from './components/Header'
import Hero from './sections/Hero'                 // 01 — Hero            #home
import About from './sections/About'               // 02 — About           #about
import Services from './sections/Services'         // 03 — Services        #services
import Process from './sections/Process'           // 04 — Process         #process
import Projects from './sections/Projects'         // 05 — Projects        #projects
import WhyUs from './sections/WhyUs'               // 06 — Why us          #why
import Testimonials from './sections/Testimonials' // 07 — Testimonials    #testimonials
import Contact from './sections/Contact'           // 08 — Contact         #contact
import Footer from './components/Footer'
import { useScrollReveal } from './hooks/useScrollReveal'

export default function App() {
  useScrollReveal()

  return (
    <>
      <Header />

      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Projects />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
