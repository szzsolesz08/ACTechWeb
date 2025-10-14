import React from 'react';
import { Link } from 'react-router-dom';
import './PricesPage.css';
import daikinImage from '../assets/daikin.jpg';
import mitsubishiImage from '../assets/mitsubishi.jpg';
import lgImage from '../assets/lg.jpg';
import panasonicImage from '../assets/panasonic.jpg';
import toshibaImage from '../assets/toshiba.jpg';
import greeImage from '../assets/gree.jpg';

function PricesPage() {
  return (
    <div className="prices-page">
      <section className="page-header">
        <h2>Our Pricing</h2>
        <p>Transparent and competitive pricing for all your AC needs.</p>
      </section>

      <section className="ac-products">
        <h3>AC Units for Sale</h3>
        <div className="product-cards">
          <div className="product-card">
            <div className="product-image">
              <img src={daikinImage} alt="Daikin Perfera AC Unit" />
            </div>
            <h4>Daikin Perfera 2.5 kW</h4>
            <p className="product-price">599 900 Ft</p>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src={mitsubishiImage} alt="Mitsubishi MUZ-AP60VG2 + MSZ-AP60VGK2 Kompakt 6.1 kW" />
            </div>
            <h4>Mitsubishi MUZ-AP60VG2 + MSZ-AP60VGK2 Kompakt 6.1 kW</h4>
            <p className="product-price">720 800 Ft</p>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src={lgImage} alt="LG Artcool Gallery Special 2,5kW" />
            </div>
            <h4>LG Artcool Gallery Special 2,5kW</h4>
            <p className="product-price">519 990 Ft</p>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src={panasonicImage} alt="Panasonic Etherea 2.0 kW" />
            </div>
            <h4>Panasonic Etherea 2.0 kW</h4>
            <p className="product-price">254 000 Ft</p>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src={toshibaImage} alt="Toshiba Seiya 3.5kW" />
            </div>
            <h4>Toshiba Seiya 3.5kW</h4>
            <p className="product-price">351 990 Ft</p>
          </div>

          <div className="product-card">
            <div className="product-image">
              <img src={greeImage} alt="Gree GWH12ACC-K6DNA1D COMFORT X" />
            </div>
            <h4>Gree GWH12ACC-K6DNA1D COMFORT X</h4>
            <p className="product-price">246 000 Ft</p>
          </div>
        </div>
      </section>
      
      <section className="pricing-tables">
        <div className="pricing-category">
          <h3>Service Prices</h3>
          <table className="price-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price Range</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Diagnostic Visit</td>
                <td>27 000 - 54 000 Ft</td>
                <td>Inspection and diagnosis of AC issues</td>
              </tr>
              <tr>
                <td>Regular Maintenance</td>
                <td>43 000 - 65 000 Ft</td>
                <td>Seasonal tune-up and preventive maintenance</td>
              </tr>
              <tr>
                <td>Filter Replacement</td>
                <td>18 000 - 36 000 Ft</td>
                <td>Replacement of AC filters</td>
              </tr>
              <tr>
                <td>Refrigerant Recharge</td>
                <td>54 000 - 144 000 Ft</td>
                <td>Recharge of refrigerant levels</td>
              </tr>
              <tr>
                <td>AC Repair</td>
                <td>54 000 - 288 000+ Ft</td>
                <td>Repair services based on complexity</td>
              </tr>
              <tr>
                <td>Installation Service</td>
                <td>80 000 - 150 000 Ft</td>
                <td>Professional installation service (unit not included)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="maintenance-plans">
        <h3>Annual Maintenance Plans</h3>
        <div className="plan-cards">
          <div className="plan-card">
            <h4>Basic Plan</h4>
            <p className="price">86 000 Ft/year</p>
            <ul>
              <li>2 seasonal check-ups</li>
              <li>Priority scheduling</li>
              <li>10% discount on repairs</li>
            </ul>
            <Link to="/booking?plan=basic" className="btn btn-secondary">Select Plan</Link>
          </div>
          
          <div className="plan-card featured">
            <h4>Premium Plan</h4>
            <p className="price">151 000 Ft/year</p>
            <ul>
              <li>4 quarterly check-ups</li>
              <li>Priority emergency service</li>
              <li>20% discount on repairs</li>
              <li>Free filter replacements</li>
              <li>Extended warranty on parts</li>
            </ul>
            <Link to="/booking?plan=premium" className="btn btn-primary">Select Plan</Link>
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
