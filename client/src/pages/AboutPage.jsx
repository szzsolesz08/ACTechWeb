import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

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
            Founded in 2005, AC Technician Services has grown from a small family operation to a leading 
            provider of air conditioning solutions in Hungary. Our journey began when our founder recognized 
            the need for reliable and professional AC services in the community. With a commitment to quality 
            workmanship and customer satisfaction, we've built a reputation for excellence that has allowed us 
            to serve thousands of satisfied customers over the years.
          </p>
        </div>
        
        <div className="about-mission">
          <h3>Our Mission</h3>
          <p>
            To provide exceptional air conditioning services that enhance comfort, improve air quality, 
            and deliver peace of mind to our customers through technical excellence, reliability, and 
            outstanding customer service. We strive to be the most trusted AC service provider in Hungary 
            by consistently exceeding expectations and building lasting relationships with our clients.
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
            <p>Over 25 years of experience in HVAC systems with certifications in all major brands. John's expertise and dedication have been the foundation of our company's success.</p>
          </div>
          
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>Sarah Johnson</h4>
            <p className="member-title">Senior Technician</p>
            <p>Specializing in commercial systems with 15 years of industry experience. Sarah brings technical excellence and problem-solving skills to every project.</p>
          </div>
          
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>Mike Davis</h4>
            <p className="member-title">Installation Specialist</p>
            <p>Expert in new system installations and complex retrofits. Mike ensures every installation is completed to the highest standards with attention to detail.</p>
          </div>
          
          <div className="team-member">
            <div className="member-image placeholder"></div>
            <h4>Lisa Chen</h4>
            <p className="member-title">Customer Service Manager</p>
            <p>Ensuring our customers receive prompt and professional assistance. Lisa coordinates our service team and maintains our commitment to customer satisfaction.</p>
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
