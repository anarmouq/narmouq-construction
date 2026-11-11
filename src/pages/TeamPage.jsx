import HtmlPage from '../components/HtmlPage'
import html from './html/team.html?raw'

export default function TeamPage() {
  return (
    <HtmlPage
      html={html}
      title="Our team | Narmouq Construction"
      description="The people who plan, manage and build every Narmouq project."
    />
  )
}
