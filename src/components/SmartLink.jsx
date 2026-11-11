/* ==========================================================================
   SMART LINK — use instead of <a> for any link whose address may be a page
   of this site. Site pages ("/about", "/contact") switch instantly without
   reloading; everything else (tel:, mailto:, https://, .html files) is a
   normal link.
   ========================================================================== */

import { Link } from 'react-router-dom'

/* Standalone pages that live in public/ as their own .html file but are
   linked without ".html". (None at the moment: the kitchen page now opens
   inside the website at /kitchen-model.)
   They need a full page load, not a switch inside the React site. */
export const STANDALONE_PAGES = []

export function isInternal(href = '') {
  return (
    href.startsWith('/') &&
    !href.endsWith('.html') &&
    !STANDALONE_PAGES.includes(href)
  )
}

export default function SmartLink({ href, children, ...rest }) {
  if (isInternal(href)) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
