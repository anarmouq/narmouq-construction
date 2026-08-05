# Narmouq Construction — Website

Modern, fully responsive one-page site for Narmouq Construction, built with React + Vite
and deployed on Cloudflare.

## Run it

```powershell
npm install
npm run dev      # local development
npm run build    # production build into dist/
npm run deploy   # build + deploy to Cloudflare
```

## How the project is organised

Every section of the page is its own file, so you can edit one part without touching
anything else.

```
src/
  data/site.js            <-- ALL text, numbers, images and links (edit this first)
  App.jsx                 <-- the page order (move a line to reorder a section)
  index.css               <-- loads the two global stylesheets
  styles/
    theme.css             <-- colours, fonts, spacing  (change the brand look here)
    base.css              <-- resets, buttons, headings, containers
  components/
    Header.jsx / .css     <-- sticky navigation + mobile drawer
    Footer.jsx / .css     <-- footer
    Icons.jsx             <-- all inline SVG icons
  hooks/
    useScrollReveal.js    <-- fade-in-on-scroll behaviour
  sections/
    Hero.jsx / .css          01  #home
    About.jsx / .css         02  #about
    Services.jsx / .css      03  #services
    Process.jsx / .css       04  #process
    Projects.jsx / .css      05  #projects
    WhyUs.jsx / .css         06  #why
    Testimonials.jsx / .css  07  #testimonials
    Contact.jsx / .css       08  #contact
```

## Common edits

| I want to change...                | Open this file |
| ---------------------------------- | -------------- |
| Phone, email, address, social links | `src/data/site.js` → `company` |
| Any wording, service, project, quote | `src/data/site.js` |
| Brand colours or fonts             | `src/styles/theme.css` |
| The order of the sections          | `src/App.jsx` |
| The layout/design of one section   | that section's `.css` file |

## Brand colours

| Token | Value | Used for |
| ----- | ----- | -------- |
| `--amber` | `#f0a81c` | brand accent, buttons, highlights (from the logo) |
| `--ink-900` | `#0b1119` | header, footer, dark bands |
| `--concrete-100` | `#f7f5f1` | alternating section background |

## Notes

- Logos in `public/`: your original `logo.png`, `logo1.png` and `logo3.png` are untouched.
  `logo-light.png` is generated from `logo.png` — same artwork, cropped, with the dark navy
  wordmark turned white so it reads on the dark hero. It is used centred in the hero and in
  the footer. If you ever replace `logo.png`, regenerate this light version to match.
- Project photos use Unsplash URLs as placeholders — swap them for your own photos in
  `src/data/site.js`.
- The contact form has no backend: submitting opens the visitor's mail app with the
  message pre-filled. To use a form service instead, replace the body of `handleSubmit()`
  in `src/sections/Contact.jsx` with a `fetch()` to your endpoint.
