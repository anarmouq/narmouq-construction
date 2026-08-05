/* ==========================================================================
   SITE CONTENT
   Every piece of text, number, image and link on the website lives here.
   Edit this file to update the site — you do not need to touch the code.
   ========================================================================== */

export const company = {
  name: 'Narmouq',
  fullName: 'Narmouq Construction',
  tagline: 'Building with purpose',
  logoFull: '/logo.png',        // full lockup, dark wordmark — for light backgrounds
  logoFullLight: '/logo-light.png', // full lockup, white wordmark — for dark backgrounds (hero)
  logoMark: '/logo1.png',       // gold mark on dark — used on dark backgrounds
  logoMarkLight: '/logo3.png',  // gold mark on white — used on light backgrounds
  phone: '+962 7 0000 0000',
  phoneHref: 'tel:+96270000000',
  whatsapp: 'https://wa.me/96270000000',
  email: 'info@narmouq.com',
  address: 'Amman, Jordan',
  hours: 'Sunday – Thursday, 8:00 – 17:00',
  social: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
}

/* Main navigation — the order here is the order shown in the header. */
export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/* ---- 01. HERO ---------------------------------------------------------- */
export const hero = {
  title: 'We build what lasts.',
  text: 'Residential, commercial and industrial projects delivered on time, on budget and to a standard we are happy to put our name on.',
  primaryCta: { label: 'Request a quote', href: '#contact' },
  secondaryCta: { label: 'See our work', href: '#projects' },
  image:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
  highlights: [
    { value: '12+', label: 'Years building' },
    { value: '80+', label: 'Projects delivered' },
    { value: '100%', label: 'Safety record' },
  ],
}

/* ---- 02. ABOUT --------------------------------------------------------- */
export const about = {
  eyebrow: 'Who we are',
  title: 'A contractor that treats your project like its own.',
  text: 'From the first site visit to the final handover, one team stays with your project. Clear pricing, weekly progress reports and no surprises — that is how we have grown almost entirely on repeat clients and referrals.',
  points: [
    {
      title: 'One accountable team',
      text: 'A dedicated project manager owns your build from permits through handover.',
    },
    {
      title: 'Transparent pricing',
      text: 'Itemised quotations, approved variations and no hidden line items.',
    },
    {
      title: 'Built to standard',
      text: 'Certified materials, tested workmanship and a documented quality checklist.',
    },
  ],
  image:
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
  imageSecondary:
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  badge: { value: '12', label: 'Years of experience' },
}

/* ---- 03. SERVICES ------------------------------------------------------ */
export const services = {
  eyebrow: 'What we do',
  title: 'Complete construction services.',
  text: 'One contractor for the whole scope — design coordination, permits, structure, finishing and handover.',
  items: [
    {
      number: '01',
      icon: 'building',
      title: 'General Contracting',
      text: 'Full project delivery from planning and permits through construction and handover.',
      tags: ['Permits', 'Site management', 'Handover'],
    },
    {
      number: '02',
      icon: 'office',
      title: 'Commercial Builds',
      text: 'Durable, efficient spaces for offices, retail, hospitality and light industry.',
      tags: ['Fit-out', 'MEP', 'Shell & core'],
    },
    {
      number: '03',
      icon: 'home',
      title: 'Residential Projects',
      text: 'Villas and apartment buildings built around comfort, strong materials and precise finishing.',
      tags: ['Villas', 'Apartments', 'Finishing'],
    },
    {
      number: '04',
      icon: 'tools',
      title: 'Renovation & Retrofit',
      text: 'Structural upgrades and remodels that improve function, appearance and property value.',
      tags: ['Remodel', 'Structural', 'Energy'],
    },
    {
      number: '05',
      icon: 'crane',
      title: 'Infrastructure & Sitework',
      text: 'Excavation, foundations, roads, drainage and site preparation done to spec.',
      tags: ['Excavation', 'Foundations', 'Roads'],
    },
    {
      number: '06',
      icon: 'ruler',
      title: 'Design & Build',
      text: 'A single contract covering design, engineering and construction to save time and cost.',
      tags: ['Concept', 'Engineering', 'Delivery'],
    },
  ],
}

/* ---- 04. PROCESS ------------------------------------------------------- */
export const workProcess = {
  eyebrow: 'How we work',
  title: 'Four clear stages, zero guesswork.',
  text: 'You always know what is happening, what comes next and what it costs.',
  steps: [
    {
      number: '01',
      title: 'Consultation',
      text: 'We visit the site, listen to your requirements and set a realistic scope and budget.',
    },
    {
      number: '02',
      title: 'Design & Quotation',
      text: 'Drawings, material selections and a fully itemised quotation for your approval.',
    },
    {
      number: '03',
      title: 'Construction',
      text: 'Our crew builds to programme with weekly progress reports and site photos.',
    },
    {
      number: '04',
      title: 'Handover & Warranty',
      text: 'Final inspection, snag list closure, documentation and a written workmanship warranty.',
    },
  ],
}

/* ---- 05. PROJECTS ------------------------------------------------------ */
export const projects = {
  eyebrow: 'Selected work',
  title: 'Projects that speak for themselves.',
  text: 'A sample of recent handovers across residential, commercial and infrastructure work.',
  cta: { label: 'Start your project', href: '#contact' },
  items: [
    {
      title: 'Hillside Modern Residence',
      category: 'Residential',
      meta: 'Amman · 620 m²',
      image:
        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=80',
      featured: true,
    },
    {
      title: 'Urban Business Center',
      category: 'Commercial',
      meta: 'Amman · 8 floors',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Industrial Warehouse',
      category: 'Industrial',
      meta: 'Zarqa · 3,400 m²',
      image:
        'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Site Development',
      category: 'Infrastructure',
      meta: 'Madaba · Phase 1',
      image:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80',
    },
    {
      title: 'Retail Fit-out',
      category: 'Commercial',
      meta: 'Amman · 900 m²',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    },
  ],
}

/* ---- 06. WHY US (dark band) -------------------------------------------- */
export const whyUs = {
  eyebrow: 'Why Narmouq',
  title: 'Precision on site. Clarity off it.',
  text: 'We keep the promises that most contractors only make: a fixed programme, an open budget and a site you would be comfortable walking a client through at any hour.',
  cta: { label: 'Talk to our team', href: '#contact' },
  image:
    'https://images.unsplash.com/photo-1590644365607-1c5a0b4a2c4c?auto=format&fit=crop&w=1600&q=80',
  reasons: [
    { title: 'On-time delivery', text: 'Programme-driven scheduling with weekly milestone tracking.' },
    { title: 'Fixed, honest budgets', text: 'Detailed BOQs and written approval before any variation.' },
    { title: 'Safety first', text: 'Certified site supervision and full compliance with local codes.' },
    { title: 'Warranty backed', text: 'Written workmanship warranty and responsive aftercare.' },
  ],
}

/* ---- 07. TESTIMONIALS -------------------------------------------------- */
export const testimonials = {
  eyebrow: 'Client feedback',
  title: 'Trusted by the people we build for.',
  items: [
    {
      quote:
        'They handed over three weeks early and the finishing quality was better than the showroom units we compared it to. Communication was excellent throughout.',
      name: 'Ahmad Khalil',
      role: 'Private villa owner',
    },
    {
      quote:
        'Narmouq managed the permits, the structure and the fit-out for our head office. One point of contact, no finger-pointing, no cost surprises.',
      name: 'Lina Haddad',
      role: 'Operations Director, retail group',
    },
    {
      quote:
        'The site was organised and safe every time I visited. That tells you everything about how a contractor runs their projects.',
      name: 'Omar Saleh',
      role: 'Consulting engineer',
    },
  ],
}

/* ---- 08. CONTACT ------------------------------------------------------- */
export const contact = {
  eyebrow: 'Get in touch',
  title: "Let's build something exceptional.",
  text: 'Send us your project details and we will come back with a scope, a programme and a clear price.',
  serviceOptions: [
    'General Contracting',
    'Commercial Build',
    'Residential Project',
    'Renovation & Retrofit',
    'Infrastructure & Sitework',
    'Design & Build',
  ],
}
