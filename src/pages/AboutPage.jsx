import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="about-page">
      <section className="page-header">
        <h2>About Us</h2>
        <p>Your trusted partner in air conditioning services since 2005.</p>
      </section>
      
      <section className="about-content">
        <div className="about-story">
          <h3>Our Story</h3>
          <p>
            TODO: Leírás
          </p>
        </div>
        
        <div className="about-mission">
          <h3>Our Mission</h3>
          <p>
            TODO: Leírás
          </p>
        </div>
      </section>
      
      <section className="team-section">
        <h3>Meet Our Team</h3>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>John Smith</h4>
            <p className="member-title">Founder & Lead Technician</p>
            <p>TODO: Leírás</p>
          </div>
          
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>Sarah Johnson</h4>
            <p className="member-title">Senior Technician</p>
            <p>TODO: Leírás</p>
          </div>
          
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>Mike Davis</h4>
            <p className="member-title">Installation Specialist</p>
            <p>TODO: Leírás</p>
          </div>
          
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>Lisa Chen</h4>
            <p className="member-title">Customer Service Manager</p>
            <p>TODO: Leírás</p>
          </div>
        </div>
      </section>
      
      <section className="about-cta">
        <h3>Ready to experience our quality service?</h3>
        <p>Join our thousands of satisfied customers by scheduling your AC service today or contact us for more information.</p>
        <Link to="/booking" className="btn btn-primary">Book Now</Link>
        <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
      </section>
    </div>
  );
}

export default AboutPage;
