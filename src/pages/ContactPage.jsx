/* ContactPage — banner + the section(s) listed below. Add or remove a line to change the page. */
import PageHeader from '../components/PageHeader'
import Contact from '../sections/Contact'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ContactPage() {
  useScrollReveal()

  return (
    <>
      <PageHeader page="contact" />
      <Contact />
    </>
  )
}
