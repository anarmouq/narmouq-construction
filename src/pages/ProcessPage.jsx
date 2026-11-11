import HtmlPage from '../components/HtmlPage'
import html from './html/process.html?raw'

export default function ProcessPage() {
  return (
    <HtmlPage
      html={html}
      title="Our process | Narmouq Construction"
      description="A clear, step-by-step path from first conversation to handover."
    />
  )
}
