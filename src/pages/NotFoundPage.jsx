/* Shown for any address that is not one of the site's pages. */
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'

export default function NotFoundPage() {
  return (
    <>
      <PageHeader page="notFound" />
      <section className="section section--light">
        <div className="container" style={{ textAlign: 'center' }}>
          <Link className="btn btn--primary" to="/">
            Back to home
          </Link>
        </div>
      </section>
    </>
  )
}
