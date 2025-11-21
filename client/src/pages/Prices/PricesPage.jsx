import { Link } from 'react-router-dom'
import './PricesPage.css'
import prices from '../../utils/Prices.js'
import units from '../../utils/Units.js'

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
          {units.map((unit) => (
            <div key={unit.id} className="product-card">
              <div className="product-image">
                <img src={unit.image} alt={unit.description} />
              </div>
              <h4>{unit.name}</h4>
              <p className="product-price">
                {unit.price.toLocaleString('hu-HU')} Ft
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pricing-tables">
        <div className="pricing-category">
          <h3>Service Prices</h3>
          <table className="price-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price.id}>
                  <td>{price.name}</td>
                  <td>{price.price} Ft</td>
                  <td>{price.description}</td>
                </tr>
              ))}
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
            <Link to="/booking?plan=basic" className="btn btn-secondary">
              Select Plan
            </Link>
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
            <Link to="/booking?plan=premium" className="btn btn-primary">
              Select Plan
            </Link>
          </div>
        </div>
      </section>

      <section className="pricing-info">
        <div className="price-note">
          <p>
            <strong>Note:</strong> The prices listed below are estimates and may
            vary depending on specific system requirements, property size, and
            complexity of the job. Contact us for a personalized quote.
          </p>
        </div>
      </section>

      <section className="price-cta">
        <h3>Have you already decided?</h3>
        <p>
          Click the button below to book your service or contact us for more
          information.
        </p>
        <Link to="/booking" className="btn btn-primary">
          Book Now
        </Link>
        <Link to="/contact" className="btn btn-secondary">
          Contact Us
        </Link>
      </section>
    </div>
  )
}

export default PricesPage
