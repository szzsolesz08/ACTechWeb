import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h2>Professional AC Services</h2>
          <p>Your comfort is our priority. Expert installation, maintenance, and repair services for all AC systems.</p>
        </div>
      </section>
      
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🔧</div>
          <h3>Repairs</h3>
          <p>Fast and reliable repair services for all AC brands and models.</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">❄️</div>
          <h3>Installation</h3>
          <p>Professional installation of new AC systems for homes and businesses.</p>
        </div>
        
        <div className="feature">
          <div className="feature-icon">🔍</div>
          <h3>Maintenance</h3>
          <p>Regular maintenance to keep your AC running efficiently all year round.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
