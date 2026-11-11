/* Shown for any address that is not one of the site's pages. */
import HtmlPage from '../components/HtmlPage'

const html = `
<section class="page-hero" aria-labelledby="page-title">
  <div class="page-hero__grid blueprint-bg" aria-hidden="true"></div>
  <div class="wrap page-hero__content">
    <nav class="crumbs glass hero__fade d1" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Page not found</span></nav>
    <h1 class="h1 hero__title" id="page-title"><span class="line"><span>Page not found</span></span></h1>
    <p class="lead hero__fade d2">This address is not one of our pages. It may have moved, or the link may be mistyped.</p>
    <div class="hero__ctas hero__fade d3">
      <a class="btn btn--amber" href="/">Back to home <svg class="arrow"><use href="#arrow" /></svg></a>
      <a class="btn btn--ghost" href="/contact">Contact us</a>
    </div>
  </div>
</section>`

export default function NotFoundPage() {
  return <HtmlPage html={html} title="Page not found | Narmouq Construction" description="This page could not be found." />
}
