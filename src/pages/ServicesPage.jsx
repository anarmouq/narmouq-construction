/* ServicesPage — banner + the section(s) listed below. Add or remove a line to change the page. */
import PageHeader from '../components/PageHeader'
import Services from '../sections/Services'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ServicesPage() {
  useScrollReveal()

  return (
    <>
      <PageHeader page="services" />
      <Services />
    </>
  )
}
