import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import bookingService from '../services/bookingService'
import userService from '../services/userService'
import authService from '../services/authService'
import './BookingPage.css'
import prices from '../utils/Prices'
import units from '../utils/Units'
import { generateInvoice } from '../utils/invoiceGenerator'

function BookingPage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const planParam = queryParams.get('plan')

  const getServiceTypeFromPlan = (plan) => {
    if (plan === 'basic' || plan === 'premium') {
      return 6
    }
    return ''
  }

  const currentUser = authService.getCurrentUser()

  const [bookingData, setBookingData] = useState({
    serviceType: getServiceTypeFromPlan(planParam),
    maintenancePlan: planParam || '',
    unit: '',
    date: '',
    timeSlot: '',
    name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    description: '',
    preferredTechnician: 'any',
    price: 0,
  })

  const [bookingStep, setBookingStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [availableTechnicians, setAvailableTechnicians] = useState([])
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)
  const [loadingTechnicians, setLoadingTechnicians] = useState(false)

  const calculatePrice = (serviceType, unit, maintenancePlan) => {
    let price = 0

    if (serviceType == 1 && unit) {
      const selectedUnit = units.find((u) => u.id == unit)
      const installationService = prices.find((p) => p.id === 1)
      if (selectedUnit) price += selectedUnit.price
      if (installationService) price += installationService.price
    } else if (serviceType >= 2 && serviceType <= 5) {
      const service = prices.find((p) => p.id == serviceType)
      if (service) price = service.price
    } else if (serviceType == 6 && maintenancePlan) {
      const plan = maintenancePlans.find((p) => p.id === maintenancePlan)
      if (plan) price = plan.price
    }

    return price
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    const updatedData = {
      ...bookingData,
      [name]: value,
    }

    if (
      name === 'serviceType' ||
      name === 'unit' ||
      name === 'maintenancePlan'
    ) {
      updatedData.price = calculatePrice(
        name === 'serviceType' ? value : bookingData.serviceType,
        name === 'unit' ? value : bookingData.unit,
        name === 'maintenancePlan' ? value : bookingData.maintenancePlan
      )

      if (name === 'serviceType') {
        updatedData.unit = ''
        updatedData.maintenancePlan = ''
      }
    }

    setBookingData(updatedData)

    if (name === 'date' && value) {
      fetchAvailableTimeSlots(value)
      setBookingData((prev) => ({
        ...prev,
        date: value,
        timeSlot: '',
        preferredTechnician: 'any',
      }))
      setAvailableTechnicians([])
    }

    if (name === 'timeSlot' && value && bookingData.date) {
      fetchAvailableTechnicians(bookingData.date, value)
      setBookingData((prev) => ({
        ...prev,
        timeSlot: value,
        preferredTechnician: 'any',
      }))
    }
  }

  const fetchAvailableTimeSlots = async (date) => {
    try {
      setLoadingTimeSlots(true)
      const response = await bookingService.getAvailableTimeSlots(date)
      setAvailableTimeSlots(response.availableTimeSlots)
    } catch (err) {
      console.error('Error fetching time slots:', err)
      setAvailableTimeSlots([])
    } finally {
      setLoadingTimeSlots(false)
    }
  }

  const fetchAvailableTechnicians = async (date, timeSlot) => {
    try {
      setLoadingTechnicians(true)
      const response = await bookingService.getAvailableTechnicians(
        date,
        timeSlot
      )
      setAvailableTechnicians(response.availableTechnicians)
    } catch (err) {
      console.error('Error fetching technicians:', err)
      setAvailableTechnicians([])
    } finally {
      setLoadingTechnicians(false)
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    setBookingStep(bookingStep + 1)
  }

  const handlePrevStep = (e) => {
    e.preventDefault()
    setBookingStep(bookingStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (
      bookingData.preferredTechnician &&
      bookingData.preferredTechnician !== 'any'
    ) {
      try {
        const response = await bookingService.getAvailableTechnicians(
          bookingData.date,
          bookingData.timeSlot
        )
        const isStillAvailable = response.availableTechnicians.some(
          (tech) => tech._id === bookingData.preferredTechnician
        )

        if (!isStillAvailable) {
          setError(
            'The selected technician is no longer available. Please select another technician.'
          )
          setLoading(false)
          await fetchAvailableTechnicians(
            bookingData.date,
            bookingData.timeSlot
          )
          return
        }
      } catch (err) {
        console.error('Error validating technician availability:', err)
      }
    }

    try {
      const serviceTypeValue =
        serviceTypes.find((s) => s.id == bookingData.serviceType)?.value || ''

      const bookingPayload = {
        ...bookingData,
        serviceType: serviceTypeValue,
      }

      const response = await bookingService.createBooking(bookingPayload)

      setBookingReference(response.booking.referenceNumber)
      setBookingComplete(true)
    } catch (err) {
      console.error('Booking error:', err)

      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map((e) => e.msg).join(', ')
        setError(`Validation error: ${errorMessages}`)
      } else {
        setError(
          err.error ||
            err.details ||
            'Failed to create booking. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const serviceTypes = [
    {
      id: 1,
      value: 'installation',
      name: 'Installation',
      description: 'AC unit + installation service',
    },
    {
      id: 2,
      value: 'repair',
      name: 'Repair',
      description: 'Repair services based on complexity',
    },
    {
      id: 3,
      value: 'maintenance',
      name: 'Maintenance',
      description: 'Seasonal tune-up and preventive maintenance',
    },
    {
      id: 4,
      value: 'inspection',
      name: 'Inspection',
      description: 'Inspection and diagnosis of AC issues',
    },
    {
      id: 5,
      value: 'consultation',
      name: 'Consultation',
      description: 'Consultation and advice on AC issues',
    },
    {
      id: 6,
      value: 'maintenance-plan',
      name: 'Annual Maintenance Plan',
      description: 'Choose from Basic or Premium plans',
    },
  ]

  const maintenancePlans = [
    {
      id: 'basic',
      price: 86000,
      name: 'Basic Plan - 86,000 Ft/year',
      description:
        '2 seasonal check-ups, priority scheduling, 10% discount on repairs',
    },
    {
      id: 'premium',
      price: 151000,
      name: 'Premium Plan - 151,000 Ft/year',
      description:
        '4 quarterly check-ups, priority emergency service, 20% discount on repairs, free filter replacements',
    },
  ]

  const timeSlots = [
    '8:00 - 10:00',
    '10:00 - 12:00',
    '12:00 - 14:00',
    '14:00 - 16:00',
    '16:00 - 18:00',
  ]

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
  const maxDate = threeMonthsLater.toISOString().split('T')[0]

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
            {serviceTypes.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        {bookingData.serviceType == 1 && (
          <div className="form-group">
            <label htmlFor="unit">Select AC Unit</label>
            <select
              id="unit"
              name="unit"
              value={bookingData.unit}
              onChange={handleChange}
              required
            >
              <option value="">Select an AC unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {bookingData.serviceType == 6 && (
          <div className="form-group">
            <label>Select Maintenance Plan</label>
            <div className="plan-selection-grid">
              {maintenancePlans.map((plan) => (
                <label
                  key={plan.id}
                  className={`plan-selection-option ${bookingData.maintenancePlan === plan.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="maintenancePlan"
                    value={plan.id}
                    checked={bookingData.maintenancePlan === plan.id}
                    onChange={handleChange}
                    required
                  />
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-description">{plan.description}</div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">
            Describe your issue or requirements
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={bookingData.description}
            onChange={handleChange}
            placeholder={
              bookingData.serviceType == 6
                ? 'Any additional information or special requirements...'
                : 'Describe your issue or requirements...'
            }
          ></textarea>
        </div>

        {bookingData.price > 0 && (
          <div className="price-summary">
            <h4>Estimated Price</h4>
            <p className="total-price">
              {bookingData.price.toLocaleString('hu-HU')} Ft
            </p>
            {bookingData.serviceType == 1 && bookingData.unit && (
              <div className="price-breakdown">
                <p>
                  • AC Unit:{' '}
                  {units
                    .find((u) => u.id == bookingData.unit)
                    ?.price.toLocaleString('hu-HU')}{' '}
                  Ft
                </p>
                <p>
                  • Installation Service:{' '}
                  {prices
                    .find((p) => p.id === 1)
                    ?.price.toLocaleString('hu-HU')}{' '}
                  Ft
                </p>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </div>
  )

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

        {bookingData.date && (
          <div className="form-group">
            <label>Preferred Time Slot</label>
            {loadingTimeSlots ? (
              <p className="loading-text">Loading available time slots...</p>
            ) : availableTimeSlots.length === 0 ? (
              <p className="no-availability">
                This day is fully booked. Please select another date.
              </p>
            ) : (
              <div className="time-slot-grid">
                {availableTimeSlots.map((slot, index) => (
                  <label
                    key={index}
                    className={`time-slot-option ${bookingData.timeSlot === slot ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      checked={bookingData.timeSlot === slot}
                      onChange={handleChange}
                      required
                    />
                    {slot}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {bookingData.date && bookingData.timeSlot && (
          <div className="form-group">
            <label>Preferred Technician (Optional)</label>
            {loadingTechnicians ? (
              <p className="loading-text">Loading available technicians...</p>
            ) : (
              <div className="technician-grid">
                <label
                  className={`technician-option ${bookingData.preferredTechnician === 'any' ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="preferredTechnician"
                    value="any"
                    checked={bookingData.preferredTechnician === 'any'}
                    onChange={handleChange}
                  />
                  Any Available Technician
                </label>
                {availableTechnicians.map((tech) => (
                  <label
                    key={tech._id}
                    className={`technician-option ${bookingData.preferredTechnician === tech._id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="preferredTechnician"
                      value={tech._id}
                      checked={bookingData.preferredTechnician === tech._id}
                      onChange={handleChange}
                    />
                    {tech.firstName} {tech.lastName}
                  </label>
                ))}
              </div>
            )}
            {availableTechnicians.length === 0 && !loadingTechnicians && (
              <p className="info-text">
                All technicians are booked for this time slot. We'll assign one
                automatically.
              </p>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrevStep}
          >
            Previous Step
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!bookingData.date || !bookingData.timeSlot}
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  )

  const renderStepThree = () => (
    <div className="booking-step">
      <h3>Step 3: Your Information</h3>
      {currentUser && (
        <p className="info-text">
          Your information has been prefilled from your account. You can edit it
          if needed.
        </p>
      )}
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

        {error && <div className="auth-error">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrevStep}
            disabled={loading}
          >
            Previous Step
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Booking...' : 'Complete Booking'}
          </button>
        </div>
      </form>
    </div>
  )

  const handleGenerateInvoice = () => {
    generateInvoice(
      bookingData,
      bookingReference,
      serviceTypes,
      units,
      prices,
      maintenancePlans
    )
  }

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
          <li>
            <strong>Service:</strong>{' '}
            {serviceTypes.find((s) => s.id == bookingData.serviceType)?.name}
          </li>
          {bookingData.price > 0 && (
            <li>
              <strong>Price:</strong>{' '}
              {bookingData.price.toLocaleString('hu-HU')} Ft
            </li>
          )}
          <li>
            <strong>Date:</strong> {bookingData.date}
          </li>
          <li>
            <strong>Time:</strong> {bookingData.timeSlot}
          </li>
        </ul>
      </div>
      <p>You will receive a confirmation email shortly with all the details.</p>
      <p>
        Our team will contact you 24 hours before your appointment to confirm.
      </p>
      <div className="confirmation-actions">
        <button className="btn btn-secondary" onClick={handleGenerateInvoice}>
          Download Invoice (PDF)
        </button>
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = '/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  )

  return (
    <div className="booking-page">
      <section className="page-header">
        <h2>Book a Service</h2>
        <p>Schedule your AC service in a few easy steps.</p>
      </section>

      {!bookingComplete ? (
        <div className="booking-container">
          <div className="booking-progress">
            <div
              className={`progress-step ${bookingStep > 1 ? 'completed' : bookingStep === 1 ? 'active' : ''}`}
            >
              <div className="progress-circle">1</div>
              <div className="progress-label">Service</div>
            </div>
            <div
              className={`progress-step ${bookingStep > 2 ? 'completed' : bookingStep === 2 ? 'active' : ''}`}
            >
              <div className="progress-circle">2</div>
              <div className="progress-label">Date & Time</div>
            </div>
            <div
              className={`progress-step ${bookingStep === 3 ? 'active' : ''}`}
            >
              <div className="progress-circle">3</div>
              <div className="progress-label">Details</div>
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
          <p>
            If you need assistance with your booking, please contact our
            customer service team:
          </p>
          <p>Phone: +36 1 234 5678</p>
          <p>Email: bookings@actechnician.com</p>
        </div>
      </section>
    </div>
  )
}

export default BookingPage
