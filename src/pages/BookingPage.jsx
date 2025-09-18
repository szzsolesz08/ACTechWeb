import React, { useState } from 'react';

function BookingPage() {
  const [bookingData, setBookingData] = useState({
    serviceType: '',
    date: '',
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    preferredTechnician: 'any'
  });

  const [bookingStep, setBookingStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData,
      [name]: value
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setBookingStep(bookingStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setBookingStep(bookingStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingData);
    
    // Generate a random reference number
    const reference = 'AC' + Math.floor(100000 + Math.random() * 900000);
    setBookingReference(reference);
    
    // Show success message
    setBookingComplete(true);
    window.scrollTo(0, 0);
  };

  const serviceTypes = [
    { id: 'installation', name: 'Installation' },
    { id: 'repair', name: 'Repair' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'inspection', name: 'Inspection' },
    { id: 'consultation', name: 'Consultation' }
  ];

  const timeSlots = [
    '8:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '12:00 PM - 2:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

  const technicians = [
    { id: 'any', name: 'Any Available Technician' },
    { id: 'john', name: 'John Smith' },
    { id: 'sarah', name: 'Sarah Johnson' },
    { id: 'mike', name: 'Mike Davis' }
  ];

  // Get tomorrow's date as min date for booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 3 months from now as max date
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const maxDate = threeMonthsLater.toISOString().split('T')[0];

  const renderStepOne = () => (
    <div className="booking-step">
      <h3>Step 1: Select Service</h3>
      <form onSubmit={handleNextStep}>
        <div className="form-group">
          <label htmlFor="serviceType">Service Type</label>
          <select
            id="serviceType"
            name="serviceType"
            value={bookingData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select a service type</option>
            {serviceTypes.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Describe your issue or requirements</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={bookingData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );

  const renderStepTwo = () => (
    <div className="booking-step">
      <h3>Step 2: Choose Date and Time</h3>
      <form onSubmit={handleNextStep}>
        <div className="form-group">
          <label htmlFor="date">Preferred Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={bookingData.date}
            onChange={handleChange}
            min={minDate}
            max={maxDate}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeSlot">Preferred Time Slot</label>
          <select
            id="timeSlot"
            name="timeSlot"
            value={bookingData.timeSlot}
            onChange={handleChange}
            required
          >
            <option value="">Select a time slot</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferredTechnician">Preferred Technician (Optional)</label>
          <select
            id="preferredTechnician"
            name="preferredTechnician"
            value={bookingData.preferredTechnician}
            onChange={handleChange}
          >
            {technicians.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
            Previous Step
          </button>
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </div>
  );

  const renderStepThree = () => (
    <div className="booking-step">
      <h3>Step 3: Your Information</h3>
      TODO: Alap értékek bejelentkezett felhasználónál
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={bookingData.name}
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
            value={bookingData.email}
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
            value={bookingData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Service Address</label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={bookingData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
            Previous Step
          </button>
          <button type="submit" className="btn btn-primary">
            Complete Booking
          </button>
        </div>
      </form>
    </div>
  );

  const renderBookingConfirmation = () => (
    <div className="booking-confirmation">
      <div className="confirmation-icon">✓</div>
      <h3>Booking Confirmed!</h3>
      <p>Thank you for booking with AC Technician Services.</p>
      <div className="booking-reference">
        <p>Your booking reference number:</p>
        <div className="reference-number">{bookingReference}</div>
        <p>Please keep this reference number for your records.</p>
      </div>
      <div className="booking-summary">
        <h4>Booking Details:</h4>
        <ul>
          <li><strong>Service:</strong> {serviceTypes.find(s => s.id === bookingData.serviceType)?.name}</li>
          <li><strong>Date:</strong> {bookingData.date}</li>
          <li><strong>Time:</strong> {bookingData.timeSlot}</li>
        </ul>
      </div>
      <p>You will receive a confirmation email shortly with all the details.</p>
      <p>Our team will contact you 24 hours before your appointment to confirm.</p>
      <button className="btn btn-primary" onClick={() => window.location.href = "/"}>
        Return to Home
      </button>
    </div>
  );

  return (
    <div className="booking-page">
      <section className="page-header">
        <h2>Book a Service</h2>
        <p>Schedule your AC service in a few easy steps.</p>
      </section>
      
      {!bookingComplete ? (
        <div className="booking-container">
          <div className="booking-progress">
            <div className={`progress-step ${bookingStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Service</div>
            </div>
            <div className="progress-bar"></div>
            <div className={`progress-step ${bookingStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Date & Time</div>
            </div>
            <div className="progress-bar"></div>
            <div className={`progress-step ${bookingStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Details</div>
            </div>
          </div>
          
          <div className="booking-form-container">
            {bookingStep === 1 && renderStepOne()}
            {bookingStep === 2 && renderStepTwo()}
            {bookingStep === 3 && renderStepThree()}
          </div>
        </div>
      ) : (
        renderBookingConfirmation()
      )}
      
      <section className="booking-info">        
        <div className="info-card">
          <h3>Need Help?</h3>
          <p>If you need assistance with your booking, please contact our customer service team:</p>
          <p>Phone: +36 1 234 5678</p>
          <p>Email: bookings@actechnician.com</p>
        </div>
      </section>
    </div>
  );
}

export default BookingPage;
