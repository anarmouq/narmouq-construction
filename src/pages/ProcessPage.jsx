/* ProcessPage — banner + the section(s) listed below. Add or remove a line to change the page. */
import PageHeader from '../components/PageHeader'
import Process from '../sections/Process'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ProcessPage() {
  useScrollReveal()

  return (
    <>
      <PageHeader page="process" />
      <Process />
    </>
  )
}
