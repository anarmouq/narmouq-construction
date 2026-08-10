/* ==========================================================================
   NARMOUQ CONSTRUCTION — page order
   Each section below is a separate file in src/sections/.
   To reorder the page, move a line. To remove a section, delete its line.
   All wording, images and numbers live in src/data/site.js
   ========================================================================== */

import Header from './components/Header'
import Hero from './sections/Hero'                 // 01 — Hero            #home
import About from './sections/About'               // 02 — About           #about
import WhyUs from './sections/WhyUs'               // 03 — Why us          #why
import Services from './sections/Services'         // 04 — Services        #services
import Projects from './sections/Projects'         // 05 — Projects        #projects
import Process from './sections/Process'           // 06 — Process         #process
import Team from './sections/Team'                 // 07 — Team            #team
import Testimonials from './sections/Testimonials' // 08 — Testimonials    #testimonials
import Contact from './sections/Contact'           // 09 — Contact         #contact
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
        <WhyUs />
        <Services />
        <Projects />
        <Process />
        <Team />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
