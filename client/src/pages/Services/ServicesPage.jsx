import React from 'react'
import { Link } from 'react-router-dom'
import './ServicesPage.css'

function ServicesPage() {
  return (
    <div className="services-page">
      <section className="page-header">
        <h2>Our AC Services</h2>
        <p>
          We offer comprehensive air conditioning solutions for both residential
          and commercial properties.
        </p>
      </section>

      <section className="services-grid">
        <div className="service-card">
          <div className="service-icon">❄️</div>
          <h3>AC Installation</h3>
          <p>
            Professional installation of all types of air conditioning systems.
            We help you choose the right system for your needs and ensure proper
            installation for optimal performance.
          </p>
          <ul>
            <li>Central air conditioning systems</li>
            <li>Split and mini-split systems</li>
            <li>Window units</li>
            <li>Portable air conditioners</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">🔧</div>
          <h3>AC Repair</h3>
          <p>
            Quick diagnostics and effective repairs for all AC problems. Our
            technicians are trained to work with all major brands and models.
          </p>
          <ul>
            <li>Emergency repair services</li>
            <li>Compressor repairs</li>
            <li>Refrigerant leaks</li>
            <li>Electrical issues</li>
            <li>Thermostat problems</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">🔍</div>
          <h3>Maintenance</h3>
          <p>
            Regular maintenance to extend the life of your AC system and ensure
            peak efficiency. Save on energy costs and prevent unexpected
            breakdowns.
          </p>
          <ul>
            <li>Seasonal tune-ups</li>
            <li>Filter cleaning and replacement</li>
            <li>System inspections</li>
            <li>Performance optimization</li>
            <li>Maintenance plans</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="service-icon">📋</div>
          <h3>Consultation</h3>
          <p>
            Expert advice on choosing the right AC system for your home or
            business. We consider your space, budget, and cooling needs.
          </p>
          <ul>
            <li>Energy efficiency assessments</li>
            <li>System recommendations</li>
            <li>Cost estimates</li>
            <li>Cooling load calculations</li>
          </ul>
        </div>
      </section>

      <section className="service-cta">
        <h3>Ready to schedule a service?</h3>
        <p>Contact us today to book an appointment or request a quote.</p>
        <div className="cta-buttons">
          <Link to="/booking" className="btn btn-primary">
            Book Now
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
