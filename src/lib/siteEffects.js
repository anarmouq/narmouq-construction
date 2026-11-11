/* ==========================================================================
   SITE EFFECTS — the interactions from the style test (assets/js/main.js),
   made to start and stop with each page of the React site.

   initPage(root)   runs on every page change, returns a clean-up function
   initGlobal()     runs once: glass highlight that follows the pointer
   ========================================================================== */

export const MODEL_URL = '/projects/elevated-deck-patio.html'

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = () => window.matchMedia('(pointer: fine)').matches
const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s))

export function initGlobal() {
  /* real liquid refraction only where backdrop SVG filters render (Chromium) */
  if (/Chrome\//.test(navigator.userAgent)) document.documentElement.classList.add('liquid-ok')

  if (!fine()) return () => {}
  const move = (e) => {
    const el = e.target.closest && e.target.closest('.glass')
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%')
    el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%')
  }
  document.addEventListener('pointermove', move, { passive: true })
  return () => document.removeEventListener('pointermove', move)
}

export function initPage(root) {
  const ac = new AbortController()
  const sig = { signal: ac.signal }
  const passive = { passive: true, signal: ac.signal }
  const stops = [() => ac.abort()]
  const noMotion = reduce()

  /* ---------- 3D tilt ---------- */
  if (fine() && !noMotion) {
    $$('[data-tilt]', root).forEach((el) => {
      const MAX = parseFloat(el.dataset.tilt) || 8
      el.addEventListener('pointermove', (e) => {
        if (el.classList.contains('is-live')) return
        if (el.classList.contains('reveal') && !el.classList.contains('in')) return
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        el.classList.add('is-tilting')
        el.style.transform = `perspective(1000px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg)`
      }, sig)
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-tilting')
        el.style.transform = ''
      }, sig)
    })
  }

  /* ---------- magnetic buttons ---------- */
  if (fine() && !noMotion) {
    $$('[data-magnetic]', root).forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.25
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        el.classList.add('is-magnet')
        el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`
      }, sig)
      el.addEventListener('pointerleave', () => {
        el.classList.remove('is-magnet')
        el.style.transform = ''
      }, sig)
    })
  }

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return
      en.target.classList.add('in')
      io.unobserve(en.target)
    })
  }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' })
  $$('.reveal, .drawing, [data-count]', root).forEach((el) => io.observe(el))
  stops.push(() => io.disconnect())

  /* ---------- counters ---------- */
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return
      countIO.unobserve(en.target)
      const el = en.target
      const end = parseFloat(el.dataset.count)
      const suffix = el.dataset.suffix || ''
      if (noMotion) { el.textContent = end + suffix; return }
      const t0 = performance.now(), dur = 1600
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur)
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4))) + suffix
        if (p < 1 && !ac.signal.aborted) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
  }, { threshold: 0.6 })
  $$('[data-count]', root).forEach((el) => countIO.observe(el))
  stops.push(() => countIO.disconnect())

  /* ---------- services coverflow ---------- */
  const flow = $('.flow', root)
  if (flow) {
    const cards = $$('.svc', flow)
    const bar = $('.flow__progress span', root)
    const live = $('.flow__live', root)
    const n = cards.length
    let index = Math.floor(n / 2)

    const layout = () => {
      const narrow = window.innerWidth < 640
      cards.forEach((c, i) => {
        const off = i - index
        const a = Math.abs(off)
        const x = off * (narrow ? 58 : 72)
        const z = -a * (narrow ? 140 : 190)
        const ry = -Math.sign(off) * Math.min(a, 2) * 28
        const sc = a === 0 ? 1 : 0.92
        c.style.transform = `translateX(${x}%) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`
        c.style.zIndex = String(100 - a)
        c.style.opacity = a > 2 ? '0' : a === 2 ? '0.35' : a === 1 ? '0.75' : '1'
        c.style.filter = a === 0 ? 'none' : `brightness(${a === 1 ? 0.6 : 0.4}) saturate(0.6)`
        c.classList.toggle('is-active', a === 0)
        c.setAttribute('aria-hidden', a === 0 ? 'false' : 'true')
        $$('a, button', c).forEach((f) => (f.tabIndex = a === 0 ? 0 : -1))
      })
      if (bar) {
        bar.style.width = 100 / n + '%'
        bar.style.transform = `translateX(${index * 100}%)`
      }
      if (live) live.textContent = `${cards[index].dataset.title}, ${index + 1} of ${n}`
    }
    const go = (d) => { index = (index + d + n) % n; layout() }

    $('.flow__prev', root)?.addEventListener('click', () => go(-1), sig)
    $('.flow__next', root)?.addEventListener('click', () => go(1), sig)
    cards.forEach((c, i) => c.addEventListener('click', (e) => {
      if (i !== index) { e.preventDefault(); e.stopPropagation(); index = i; layout() }
    }, sig))
    flow.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }, sig)

    let sx = null, moved = false
    flow.addEventListener('pointerdown', (e) => { sx = e.clientX; moved = false }, sig)
    window.addEventListener('pointerup', (e) => {
      if (sx === null) return
      const dx = e.clientX - sx
      if (Math.abs(dx) > 50) { go(dx < 0 ? 1 : -1); moved = true }
      sx = null
    }, sig)
    flow.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation() } }, { capture: true, signal: ac.signal })

    window.addEventListener('resize', layout, sig)
    layout()
  }

  /* ---------- testimonials ---------- */
  const quotes = $('.quotes', root)
  if (quotes) {
    const slides = $$('.quote-slide', quotes)
    const dots = $('.dots', quotes)
    let qi = 0, timer
    dots.innerHTML = ''
    const show = (i) => {
      qi = (i + slides.length) % slides.length
      slides.forEach((s, k) => s.classList.toggle('is-active', k === qi))
      $$('button', dots).forEach((b, k) => b.setAttribute('aria-current', String(k === qi)))
    }
    const restart = () => {
      clearInterval(timer)
      if (!noMotion) timer = setInterval(() => show(qi + 1), 7000)
    }
    slides.forEach((_, i) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.setAttribute('aria-label', `Show testimonial ${i + 1}`)
      b.addEventListener('click', () => { show(i); restart() }, sig)
      dots.appendChild(b)
    })
    $('.quotes__prev', quotes).addEventListener('click', () => { show(qi - 1); restart() }, sig)
    $('.quotes__next', quotes).addEventListener('click', () => { show(qi + 1); restart() }, sig)
    quotes.addEventListener('pointerenter', () => clearInterval(timer), sig)
    quotes.addEventListener('pointerleave', restart, sig)
    show(0)
    restart()
    stops.push(() => clearInterval(timer))
  }

  /* ---------- scroll-driven effects (parallax, statement, timeline) ---------- */
  const scrollers = []
  const para = $$('[data-parallax]', root)
  if (para.length && !noMotion) {
    scrollers.push(() => para.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect()
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight
      el.style.transform = `translate3d(0, ${(p * -parseFloat(el.dataset.parallax)).toFixed(1)}px, 0)`
    }))
  }

  const blocks = $$('[data-statement]', root)
  blocks.forEach((p) => {
    if (p.querySelector('.w')) return
    const hl = (p.dataset.highlight || '').split(',').map((s) => s.trim().toLowerCase())
    p.innerHTML = p.textContent.trim().split(/\s+/).map((w) => {
      const clean = w.replace(/[^\w-]/g, '').toLowerCase()
      return `<span class="w${hl.includes(clean) ? ' hl' : ''}">${w}</span>`
    }).join(' ')
  })
  if (blocks.length) {
    if (noMotion) blocks.forEach((p) => $$('.w', p).forEach((w) => w.classList.add('on')))
    else scrollers.push(() => blocks.forEach((p) => {
      const r = p.getBoundingClientRect()
      const vh = window.innerHeight
      const prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
      const ws = $$('.w', p)
      const n = Math.round(prog * ws.length)
      ws.forEach((w, i) => w.classList.toggle('on', i < n))
    }))
  }

  const tl = $('.timeline', root)
  if (tl) {
    const fill = $('.timeline__fill', tl)
    const steps = $$('.step', tl)
    scrollers.push(() => {
      const r = tl.getBoundingClientRect()
      const mid = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height))
      fill?.style.setProperty('--p', p.toFixed(3))
      steps.forEach((s) => {
        const node = $('.step__node', s).getBoundingClientRect()
        s.classList.toggle('is-reached', node.top + node.height / 2 < mid)
      })
    })
  }

  if (scrollers.length) {
    const run = () => scrollers.forEach((f) => f())
    window.addEventListener('scroll', () => requestAnimationFrame(run), passive)
    window.addEventListener('resize', run, sig)
    run()
  }

  /* ---------- contact form: validate, then open the visitor's email app ---------- */
  const card = $('.form-card', root)
  if (card) {
    const form = $('form', card)
    /* A plan sent from the Design Studio starts the visitor's message. */
    try {
      const brief = sessionStorage.getItem('narmouq-studio-brief')
      if (brief) {
        const details = form.elements.details
        if (details && !details.value) details.value = brief
        sessionStorage.removeItem('narmouq-studio-brief')
      }
    } catch { /* storage blocked: the form simply starts empty */ }
    const rules = {
      name: (v) => v.trim().length >= 2 || 'Enter your full name.',
      phone: (v) => /^[+\d][\d\s-]{6,}$/.test(v.trim()) || 'Enter a phone number, for example (410) 555-0123.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter an email address, for example you@email.com.',
      details: (v) => v.trim().length >= 10 || 'Tell us a little about the project: location, size or timeline.',
    }
    const check = (input) => {
      const rule = rules[input.name]
      if (!rule) return true
      const res = rule(input.value)
      const field = input.closest('.field')
      field.classList.toggle('invalid', res !== true)
      $('.err', field).textContent = res === true ? '' : res
      input.setAttribute('aria-invalid', String(res !== true))
      return res === true
    }
    $$('input, textarea', form).forEach((i) => i.addEventListener('blur', () => i.value && check(i), sig))
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const bad = $$('input, textarea', form).filter((i) => !check(i))
      if (bad.length) { bad[0].focus(); return }
      const d = Object.fromEntries(new FormData(form))
      const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nService: ${d.service || 'Not sure yet'}\n\n${d.details}`
      window.location.href = `mailto:info@narmouq.com?subject=${encodeURIComponent('Quote request: ' + (d.service || 'new project'))}&body=${encodeURIComponent(body)}`
      card.classList.add('is-sent')
      $('.form-done h3', card)?.focus()
    }, sig)
    $('[data-again]', card)?.addEventListener('click', () => { form.reset(); card.classList.remove('is-sent') }, sig)
  }

  /* ---------- project drawing: a CTA marked data-embed opens its 3D model right in the frame ---------- */
  $$('.drawing', root).forEach((drawing) => {
    const cta = $('.drawing__cta', drawing)
    if (!cta || !cta.hasAttribute('data-embed')) return // others open as their own page
    cta.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return // let "open in new tab" work
      e.preventDefault()
      drawing.classList.add('is-live')
      drawing.style.transform = ''
      const frame = document.createElement('iframe')
      frame.className = 'drawing__model'
      frame.src = cta.getAttribute('href')
      frame.title = 'Interactive 3D model of the elevated deck and paver patio'
      frame.allow = 'fullscreen'
      const close = document.createElement('button')
      close.type = 'button'
      close.className = 'drawing__close glass'
      close.textContent = 'Back to the drawing'
      close.addEventListener('click', () => {
        frame.remove()
        close.remove()
        drawing.classList.remove('is-live')
        cta.focus()
      })
      drawing.append(frame, close)
      frame.focus()
    }, sig)
  })

  return () => stops.forEach((f) => f())
}
