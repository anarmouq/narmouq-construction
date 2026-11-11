import HtmlPage from '../components/HtmlPage'
import html from './html/contact.html?raw'

export default function ContactPage() {
  return (
    <HtmlPage
      html={html}
      title="Contact us | Narmouq Construction"
      description="Tell us about your project and get a scope, a programme and a clear price within one working day."
    />
  )
}
