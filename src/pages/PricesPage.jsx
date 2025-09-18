import React from 'react';
import { Link } from 'react-router-dom';

function PricesPage() {
  return (
    <div className="prices-page">
      <section className="page-header">
        <h2>Our Pricing</h2>
        <p>Transparent and competitive pricing for all your AC needs.</p>
      </section>
      
      <section className="pricing-tables">
        <div className="pricing-category">
          <h3>Service Prices</h3>
          <table className="price-table">
            TODO: Feltölteni a táblázatot
          </table>
        </div>
      </section>
      
      <section className="maintenance-plans">
        <h3>Annual Maintenance Plans</h3>
        <div className="plan-cards">
          <div className="plan-card">
            <h4>Basic Plan</h4>
            <p className="price">$240/year</p>
            <ul>
              <li>2 seasonal check-ups</li>
              <li>Priority scheduling</li>
              <li>10% discount on repairs</li>
            </ul>
            TODO: Button hozzáadása
          </div>
          
          <div className="plan-card featured">
            <h4>Premium Plan</h4>
            <p className="price">$420/year</p>
            <ul>
              <li>4 quarterly check-ups</li>
              <li>Priority emergency service</li>
              <li>20% discount on repairs</li>
              <li>Free filter replacements</li>
              <li>Extended warranty on parts</li>
            </ul>
            TODO: Button hozzáadása
          </div>
        </div>
      </section>

      <section className="pricing-info">
        <div className="price-note">
          <p>
            <strong>Note:</strong> The prices listed below are estimates and may vary depending on specific 
            system requirements, property size, and complexity of the job. Contact us for a personalized quote.
          </p>
        </div>
      </section>
      
      <section className="price-cta">
        <h3>Have you already decided?</h3>
        <p>Click the button below to book your service or contact us for more information.</p>
          <Link to="/booking" className="btn btn-primary">Book Now</Link>
          <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
      </section>
    </div>
  );
}

export default PricesPage;
