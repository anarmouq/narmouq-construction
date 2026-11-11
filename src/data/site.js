/* ==========================================================================
   SITE CONTENT
   Every piece of text, number, image and link on the website lives here.
   Edit this file to update the site — you do not need to touch the code.
   ========================================================================== */

export const company = {
  name: 'Narmouq',
  fullName: 'Narmouq Construction',
  tagline: 'Building with purpose',
  logoFull: '/logo.png',            // full lockup on its grey backdrop
  logoFullLight: '/logo-light.png', // full lockup, white wordmark — for dark backgrounds (footer)
  logoMark: '/logo1.png',           // gold mark on a transparent background — works anywhere
  logoMarkDark: '/logo13.png',      // gold mark on the dark navy tile
  phone: '+962 7 0000 0000',
  phoneHref: 'tel:+96270000000',
  whatsapp: 'https://wa.me/96270000000',
  email: 'info@narmouq.com',
  address: 'Amman, Jordan',
  hours: 'Sunday – Thursday, 8:00 – 17:00',
  hoursShort: 'Sun–Thu, 8am–5pm',  // small label above the phone in the header
  social: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
}

/* Main navigation — the order here is the order shown in the header.
   Each link opens its own page. The pages themselves are in src/pages/. */
export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Process', href: '/process' },
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
  { label: '3D Model', href: '/Kitchen_Model.html' },
]

/* Banner at the top of each inner page: title, one-line intro and an
   optional background photo (any image in the public/ folder). */
export const pages = {
  about: {
    title: 'About Us',
    intro: 'Who we are, how we work, and why clients trust us with their projects.',
    image: '/pic1.jpg',
  },
  services: {
    title: 'Our Services',
    intro: 'From new builds to renovations — everything we can deliver for you.',
    image: '/pic2.jpg',
  },
  process: {
    title: 'Our Process',
    intro: 'A clear, step-by-step path from first conversation to handover.',
    image: '/pic3.jpg',
  },
  projects: {
    title: 'Our Projects',
    intro: 'A selection of the homes, offices and spaces we have built.',
    image: '/pic1.jpg',
  },
  team: {
    title: 'Our Team',
    intro: 'The people who plan, manage and build every project.',
    image: '/pic2.jpg',
  },
  contact: {
    title: 'Contact Us',
    intro: 'Tell us about your project and we will get back to you with a quote.',
    image: '/pic3.jpg',
  },
  notFound: {
    title: 'Page not found',
    intro: 'The page you are looking for does not exist or has moved.',
  },
}

/* ---- 01. HERO ----------------------------------------------------------
   A full-bleed slider. Add or remove a `slides` entry and the arrows, dots
   and autoplay all adjust themselves — nothing else needs changing.
   Each headline is written on two lines so it stacks like the reference.  */
export const hero = {
  primaryCta: { label: 'Request a quote', href: '/contact' },
  autoplayMs: 6500,
  slides: [
    {
      line1: 'Building what',
      line2: 'stands for decades.',
      text: 'Residential, commercial and industrial projects delivered on time and on budget.',
      image:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80',
    },
    {
      line1: 'Big projects',
      line2: 'need bigger standards.',
      text: 'Certified materials, tested workmanship and a documented quality checklist on every site.',
      image:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80',
    },
    {
      line1: 'Shaping tomorrow’s',
      line2: 'skyline.',
      text: 'From foundations to final handover — one accountable team from start to finish.',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    },
  ],
}

/* ---- 02. ABOUT ----------------------------------------------------------
   Wrap any word in **double asterisks** to print it in the brand gold,
   the way the reference site highlights key words inside its paragraphs.  */
export const about = {
  eyebrow: 'Who we are',
  title: 'About **Narmouq** Construction',
  text: 'From the first site visit to the final handover, one team stays with your project. **Clear pricing**, weekly progress reports and no surprises — that is how we have grown almost entirely on repeat clients and referrals.',
  subtitle: 'Building the foundations for a sustainable future',
  subtext: 'A licensed general contractor working across residential, commercial and industrial projects — delivering structures that are engineered to last and finished to a standard we are happy to put our name on.',
  stats: [
    { value: '12+', label: 'Years building' },
    { value: '80+', label: 'Projects delivered' },
    { value: '100%', label: 'Safety record' },
  ],
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

/* ---- 03. SERVICES -------------------------------------------------------
   Shown as a 3D carousel: the middle card is in focus, the cards either side
   are scaled back and faded. Each item needs an `image` — portrait crops
   (roughly 3:4) look best.                                                */
export const services = {
  eyebrow: 'What we do',
  title: 'Our **Services**',
  text: 'One contractor for the whole scope — design coordination, permits, structure, finishing and handover.',
  items: [
    {
      number: '01',
      icon: 'building',
      title: 'General Contracting',
      text: 'Full project delivery from planning and permits through construction and handover.',
      tags: ['Permits', 'Site management', 'Handover'],
      image:
        'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    },
    {
      number: '02',
      icon: 'office',
      title: 'Commercial Builds',
      text: 'Durable, efficient spaces for offices, retail, hospitality and light industry.',
      tags: ['Fit-out', 'MEP', 'Shell & core'],
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    },
    {
      number: '03',
      icon: 'home',
      title: 'Residential Projects',
      text: 'Villas and apartment buildings built around comfort, strong materials and precise finishing.',
      tags: ['Villas', 'Apartments', 'Finishing'],
      image:
        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=80',
    },
    {
      number: '04',
      icon: 'tools',
      title: 'Renovation & Retrofit',
      text: 'Structural upgrades and remodels that improve function, appearance and property value.',
      tags: ['Remodel', 'Structural', 'Energy'],
      image:
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
    },
    {
      number: '05',
      icon: 'crane',
      title: 'Infrastructure & Sitework',
      text: 'Excavation, foundations, roads, drainage and site preparation done to spec.',
      tags: ['Excavation', 'Foundations', 'Roads'],
      image:
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    },
    {
      number: '06',
      icon: 'ruler',
      title: 'Design & Build',
      text: 'A single contract covering design, engineering and construction to save time and cost.',
      tags: ['Concept', 'Engineering', 'Delivery'],
      image:
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    },
  ],
}

/* ---- 04. PROCESS ------------------------------------------------------- */
export const workProcess = {
  eyebrow: 'How we work',
  title: 'How we **Work**',
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
  title: 'Selected **Projects**',
  text: 'Explore our work up close, down to every footing, beam and board.',
  cta: { label: 'Start your project', href: '/contact' },

  /* A project with a `model` gets the big interactive 3D stage at the top.
     The model file lives in public/projects/. */
  items: [
    {
      title: 'Elevated deck & paver patio',
      category: 'Residential',
      model: '/projects/elevated-deck-patio.html',
      summary:
        'A stained wood deck raised 10 ft 9 in above a walk-out basement, with a 16-riser stair down to a new paver patio, retaining walls and a walkway that climbs to the driveway.',
      detail:
        'Turn it, zoom in, and press Build to watch it go up in the same 16 phases we built it in, from the footings to the string lights. Tap any part to see what it is and how it was installed.',
      facts: [
        { label: 'Deck area', value: '362 sq ft' },
        { label: 'Deck height', value: '10 ft 9 in' },
        { label: 'Build phases', value: '16' },
        { label: 'Footings', value: '9, below frost depth' },
        { label: 'Stair', value: '16 risers with a landing' },
      ],
    },
  ],
}

/* ---- 06. WHY US (dark band) -------------------------------------------- */
export const whyUs = {
  eyebrow: 'Why Narmouq',
  title: 'Why **Narmouq**',
  watermark: 'WHY',
  text: 'We keep the promises that most contractors only make: a fixed programme, an open budget and a site you would be comfortable walking a client through at any hour.',
  cta: { label: 'Talk to our team', href: '/contact' },
  image:
    'https://images.unsplash.com/photo-1590644365607-1c5a0b4a2c4c?auto=format&fit=crop&w=1600&q=80',
  reasons: [
    { title: 'On-time delivery', text: 'Programme-driven scheduling with weekly milestone tracking.' },
    { title: 'Fixed, honest budgets', text: 'Detailed BOQs and written approval before any variation.' },
    { title: 'Safety first', text: 'Certified site supervision and full compliance with local codes.' },
    { title: 'Warranty backed', text: 'Written workmanship warranty and responsive aftercare.' },
  ],
}

/* ---- 07. TEAM ------------------------------------------------------------
   PHOTOS: drop pic1.jpg, pic2.jpg and pic3.jpg into the public/ folder and
   they appear here automatically. Until then each card shows a plain grey
   panel instead of a broken image. Portrait crops (roughly 4:5) look best.
   If you save the files as .png instead, change the extensions below.

   The names, roles and bios are still placeholders — replace them with your
   real colleagues. Add or remove a member and the row re-flows on its own. */
export const team = {
  title: 'Meet the **Team**',
  text: 'The people who plan, price and build your project — the same faces from the first site visit to handover.',
  members: [
    {
      name: 'Ammar Narmouq',
      role: 'Founder & Managing Director',
      bio: 'Twelve years running site operations, and the final signature on every quotation we issue.',
      image: '/pic1.jpg',
    },
    {
      name: 'Amr Narmouq',
      role: 'Head of Engineering',
      bio: 'Leads design coordination and structural review, from concept drawings through to as-builts.',
      image: '/pic2.jpg',
    },
    {
      name: 'Hassan Abzakh',
      role: 'HEAD OF IT & SITE OPERATIONS',
      bio: 'Owns the programme on site — scheduling, subcontractors, safety and the weekly progress report.',
      image: '/pic3.jpg',
    },
  ],
}

/* ---- 08. TESTIMONIALS -------------------------------------------------- */
export const testimonials = {
  eyebrow: 'Client feedback',
  title: 'Our Happy **Clients**',
  autoplayMs: 7000,
  /* Client logo wall (the scrolling strip under the quotes).
     Add entries as { name: 'Company', logo: '/clients/company.png' } and drop
     the image files in public/clients/. Leave the array empty and the strip
     simply does not render. */
  clients: [],
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
  title: 'Get in **Touch**',
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
