/* Shared inline SVG icons. Stroke-based so they inherit the current colour. */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export function ArrowRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowLeft(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H6M11 6l-6 6 6 6" />
    </svg>
  )
}

export function ChevronDown(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function Phone(props) {
  return (
    <svg {...base} {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  )
}

export function Mail(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </svg>
  )
}

export function Pin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function Clock(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function Check(props) {
  return (
    <svg {...base} {...props} strokeWidth={2.2}>
      <path d="m4 12 5 5L20 6" />
    </svg>
  )
}

export function Quote(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.5 5C6.5 6.6 4.6 9.4 4.6 12.8c0 3.3 1.9 5.4 4.4 5.4 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.3-3.4-.4 0-.9.1-1 .1.3-1.6 1.8-3.3 3.4-4.2L9.5 5Zm9 0c-3 1.6-4.9 4.4-4.9 7.8 0 3.3 1.9 5.4 4.4 5.4 2.1 0 3.7-1.5 3.7-3.6 0-2-1.4-3.4-3.3-3.4-.4 0-.9.1-1 .1.3-1.6 1.8-3.3 3.4-4.2L18.5 5Z" />
    </svg>
  )
}

/* ---- Service icons ------------------------------------------------------ */

export function IconBuilding(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 21h18M5 21V6l7-3 7 3v15" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h6" />
    </svg>
  )
}

export function IconOffice(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 21h20M4 21V8h8v13M12 21V3h8v18" />
      <path d="M7 12h2M7 16h2M15 8h2M15 12h2M15 16h2" />
    </svg>
  )
}

export function IconHome(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  )
}

export function IconTools(props) {
  return (
    <svg {...base} {...props}>
      <path d="M14.7 6.3a4 4 0 0 0 5.3 5.3L21 21H10.6l-.7-4" />
      <path d="M3 7.5 7.5 3l3 3-2 2 6.5 6.5-2.5 2.5L6 10.5l-2 2-1-5Z" />
    </svg>
  )
}

export function IconCrane(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21h16M7 21V5h3M7 5 3 9M7 5l14 4" />
      <path d="M13 6.5V12M13 12h-2.5M13 12h2.5" />
      <path d="M17 8v4" />
    </svg>
  )
}

export function IconRuler(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="8" width="20" height="8" rx="1.5" transform="rotate(-8 12 12)" />
      <path d="M6.5 9.5v3M10 9v3.5M13.5 8.5v3M17 8v3.5" />
    </svg>
  )
}

/* Name → component map used by the Services section. */
export const serviceIcons = {
  building: IconBuilding,
  office: IconOffice,
  home: IconHome,
  tools: IconTools,
  crane: IconCrane,
  ruler: IconRuler,
}
