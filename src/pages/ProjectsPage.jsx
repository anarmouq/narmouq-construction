import HtmlPage from '../components/HtmlPage'
import html from './html/projects.html?raw'

export default function ProjectsPage() {
  return (
    <HtmlPage
      html={html}
      title="Our projects | Narmouq Construction"
      description="A selection of the homes, offices and spaces Narmouq Construction has built."
    />
  )
}
