/* ==========================================================================
   SMART LINK — use instead of <a> for any link whose address may be a page
   of this site. Site pages ("/about", "/contact") switch instantly without
   reloading; everything else (tel:, mailto:, https://, .html files) is a
   normal link.
   ========================================================================== */

import { Link } from 'react-router-dom'

export function isInternal(href = '') {
  return href.startsWith('/') && !href.endsWith('.html')
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
