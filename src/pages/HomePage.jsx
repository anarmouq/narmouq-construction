/* ==========================================================================
   HOME PAGE — the landing page at "/".
   It gives a taste of each part of the business; the full details live on
   their own pages (About, Services, …). Move, add or delete a line to
   change what the home page shows.
   ========================================================================== */

import Hero from '../sections/Hero'
import About from '../sections/About'
import WhyUs from '../sections/WhyUs'
import Services from '../sections/Services'
import Projects from '../sections/Projects'
import Testimonials from '../sections/Testimonials'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function HomePage() {
  useScrollReveal()

  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <Services />
      <Projects />
      <Testimonials />
    </>
  )
}
