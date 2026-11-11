import HtmlPage from '../components/HtmlPage'
import html from './html/home.html?raw'

/* The hero's 3D tower uses three.js r128, loaded only when the home page opens. */
const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const found = document.querySelector(`script[src="${src}"]`)
    if (found) return found.dataset.loaded ? resolve() : found.addEventListener('load', resolve)
    const s = document.createElement('script')
    s.src = src
    s.onload = () => { s.dataset.loaded = '1'; resolve() }
    s.onerror = reject
    document.head.appendChild(s)
  })

function startHero(root) {
  const canvas = root.querySelector('#hero-canvas')
  if (!canvas) return
  let stop
  let cancelled = false
  loadScript(THREE_URL)
    .then(() => loadScript('/assets/js/hero3d.js'))
    .then(() => { if (!cancelled) stop = window.narmouqHero(canvas) })
    .catch(() => canvas.remove())
  return () => { cancelled = true; stop?.() }
}

export default function HomePage() {
  return (
    <HtmlPage
      html={html}
      title="Narmouq Construction | General contractor in Amman"
      description="Licensed general contractor delivering residential, commercial and industrial projects in Jordan with clear pricing and dependable programmes."
      onReady={startHero}
    />
  )
}
