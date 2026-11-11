/* ==========================================================================
   HTML PAGE — shows one page body from src/pages/html/*.html (the content
   of the style-test pages) and switches on its interactions.

   To change wording or pictures on a page, edit its .html file in
   src/pages/html/. Links to site pages ("/about") open without reloading.
   ========================================================================== */

import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { initPage } from '../lib/siteEffects'
import { isInternal } from './SmartLink'

export default function HtmlPage({ html, title, description, onReady }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  const { hash } = useLocation()

  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])

  useLayoutEffect(() => {
    const root = ref.current
    const stopPage = initPage(root)
    const stopExtra = onReady?.(root)
    return () => {
      stopPage()
      stopExtra?.()
    }
  }, [html, onReady])

  /* Jump to "#section" links, e.g. /services#renovation from the footer. */
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [hash, html])

  /* Site links inside the page switch pages instantly. */
  const onClick = (e) => {
    const a = e.target.closest('a')
    if (!a || e.nativeEvent.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || a.target) return
    const href = a.getAttribute('href')
    if (!href || !isInternal(href.split('#')[0] || '/') || href.startsWith('#')) return
    e.preventDefault()
    navigate(href)
  }

  return <div ref={ref} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />
}
