/* AboutPage — banner + the section(s) listed below. Add or remove a line to change the page. */
import PageHeader from '../components/PageHeader'
import About from '../sections/About'
import WhyUs from '../sections/WhyUs'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function AboutPage() {
  useScrollReveal()

  return (
    <>
      <PageHeader page="about" />
      <About />
      <WhyUs />
    </>
  )
}
