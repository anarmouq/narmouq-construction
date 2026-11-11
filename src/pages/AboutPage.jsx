import HtmlPage from '../components/HtmlPage'
import html from './html/about.html?raw'

export default function AboutPage() {
  return (
    <HtmlPage
      html={html}
      title="About us | Narmouq Construction"
      description="Who we are, how we work, and why clients in Jordan trust Narmouq Construction with their projects."
    />
  )
}
