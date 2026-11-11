import HtmlPage from '../components/HtmlPage'
import html from './html/services.html?raw'

export default function ServicesPage() {
  return (
    <HtmlPage
      html={html}
      title="Our services | Narmouq Construction"
      description="General contracting, commercial builds, residential projects, renovation and sitework across Jordan."
    />
  )
}
