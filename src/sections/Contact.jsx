/* ==========================================================================
   SECTION 08 — CONTACT
   Text & options: src/data/site.js → `contact` and `company`
   NOTE: there is no backend, so submitting opens the visitor's mail app with
   the message pre-filled. To use a real form service, replace the body of
   handleSubmit() with a fetch() to your endpoint.
   ========================================================================== */

import { useState } from 'react'
import { company, contact } from '../data/site'
import Accent from '../components/Accent'
import { ArrowRight, Clock, Mail, Phone, Pin } from '../components/Icons'
import './Contact.css'

const EMPTY = { name: '', email: '', phone: '', service: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setSent(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Service: ${form.service || 'Not specified'}`,
      '',
      form.message,
    ].join('\n')

    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
      `Project enquiry — ${form.name}`,
    )}&body=${encodeURIComponent(body)}`

    setSent(true)
  }

  const details = [
    { icon: Pin, label: 'Office', value: company.address },
    { icon: Phone, label: 'Phone', value: company.phone, href: company.phoneHref },
    { icon: Mail, label: 'Email', value: company.email, href: `mailto:${company.email}` },
    { icon: Clock, label: 'Working hours', value: company.hours },
  ]

  return (
    <section className="contact section section--tint" id="contact">
      <div className="container contact__grid">
        <div className="contact__info" data-reveal>
          <h2 className="contact__title">
            <Accent text={contact.title} />
          </h2>
          <p className="contact__text">{contact.text}</p>

          <ul className="contact__details">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <span className="contact__icon">
                  <Icon />
                </span>
                <div>
                  <small>{label}</small>
                  {href ? <a href={href}>{value}</a> : <span>{value}</span>}
                </div>
              </li>
            ))}
          </ul>

          <a className="contact__whatsapp" href={company.whatsapp} target="_blank" rel="noreferrer">
            Message us on WhatsApp <ArrowRight />
          </a>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} data-reveal style={{ '--reveal-delay': '0.12s' }}>
          <h3>Request a quote</h3>

          <div className="field-row">
            <label className="field">
              <span>Full name *</span>
              <input type="text" required value={form.name} onChange={update('name')} placeholder="Your name" />
            </label>

            <label className="field">
              <span>Phone *</span>
              <input type="tel" required value={form.phone} onChange={update('phone')} placeholder="07 0000 0000" />
            </label>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Email *</span>
              <input type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
            </label>

            <label className="field">
              <span>Service</span>
              <select value={form.service} onChange={update('service')}>
                <option value="">Select a service</option>
                {contact.serviceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Project details *</span>
            <textarea
              required
              rows="5"
              value={form.message}
              onChange={update('message')}
              placeholder="Location, size, timeline and anything else we should know."
            />
          </label>

          <button className="btn btn--primary contact__submit" type="submit">
            Send enquiry <ArrowRight />
          </button>

          <p className={`contact__note ${sent ? 'is-sent' : ''}`} role="status">
            {sent
              ? 'Your mail app should now be open with the message ready to send.'
              : 'We reply to every enquiry within one working day.'}
          </p>
        </form>
      </div>
    </section>
  )
}
