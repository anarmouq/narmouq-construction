import { useEffect } from 'react'

/**
 * Fades elements in as they scroll into view.
 * Add `data-reveal` to any element and it animates automatically.
 * Optional: style={{ '--reveal-delay': '0.1s' }} to stagger items.
 */
export function useScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    items.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/** Tracks page scroll offset (used by the sticky header). */
export function onScroll(callback) {
  let frame = null
  const handler = () => {
    if (frame) return
    frame = window.requestAnimationFrame(() => {
      callback(window.scrollY)
      frame = null
    })
  }
  handler()
  window.addEventListener('scroll', handler, { passive: true })
  return () => {
    window.removeEventListener('scroll', handler)
    if (frame) window.cancelAnimationFrame(frame)
  }
}
