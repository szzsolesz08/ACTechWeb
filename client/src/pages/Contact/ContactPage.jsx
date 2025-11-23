import React, { useState } from 'react'
import authService from '../../services/authService'
import './ContactPage.css'

function ContactPage() {
  const currentUser = authService.getCurrentUser()

  const [formData, setFormData] = useState({
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    subject: '',
    message: '',
  })

  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit contact message')
      }

      setFormSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      console.error('Error submitting contact form:', err)
      setError(err.message || 'Failed to submit message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      <section className="page-header">
        <h2>Contact Us</h2>
        <p>Get in touch with our team for inquiries, quotes, or emergencies.</p>
      </section>

      <div className="contact-container">
        <section className="contact-info">
          <div className="contact-method">
            <div className="contact-icon">📞</div>
            <h3>Phone</h3>
            <p>Customer Service: +36 1 234 5678</p>
            <p>Emergency Service: +36 1 234 5679</p>
          </div>

          <div className="contact-method">
            <div className="contact-icon">✉️</div>
            <h3>Email</h3>
            <p>General Inquiries: info@actechnician.com</p>
            <p>Support: support@actechnician.com</p>
            <p>Quotes: quotes@actechnician.com</p>
          </div>

          <div className="contact-method">
            <div className="contact-icon">📍</div>
            <h3>Location</h3>
            <p>1111 Budapest, Hungary</p>
            <p>Proba utca 111</p>
            <p>Monday-Friday: 8:00-18:00</p>
            <p>Saturday: 9:00-15:00</p>
            <p>Sunday: Closed (Emergency Services Available)</p>
          </div>
        </section>

        <section className="contact-form">
          <h3>Send Us a Message</h3>
          {formSubmitted ? (
            <div className="form-success">
              <p>
                Thank you for your message! Our team will get back to you
                shortly.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => setFormSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {currentUser && (
                <p className="info-text">
                  Your information has been prefilled from your account. You can
                  edit it if needed.
                </p>
              )}
              {error && (
                <div
                  className="form-error"
                  style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '4px',
                    color: '#c00',
                  }}
                >
                  {error}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="quote">Request a Quote</option>
                  <option value="service">Schedule Service</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </section>
      </div>

      <section className="emergency-contact">
        <div className="emergency-card">
          <h3>Emergency Service Available 24/7</h3>
          <p>
            For urgent AC issues outside normal business hours, call our
            emergency line:
          </p>
          <div className="emergency-number">+36 1 234 5679</div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
