/* ProjectsPage — banner + the section(s) listed below. Add or remove a line to change the page. */
import PageHeader from '../components/PageHeader'
import Projects from '../sections/Projects'
import Testimonials from '../sections/Testimonials'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ProjectsPage() {
  useScrollReveal()

  return (
    <>
      <PageHeader page="projects" />
      <Projects />
      <Testimonials />
    </>
  )
}
