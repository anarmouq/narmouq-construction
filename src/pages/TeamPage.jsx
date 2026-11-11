/* TeamPage — banner + the section(s) listed below. Add or remove a line to change the page. */
import PageHeader from '../components/PageHeader'
import Team from '../sections/Team'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function TeamPage() {
  useScrollReveal()

  return (
    <>
      <PageHeader page="team" />
      <Team />
    </>
  )
}
