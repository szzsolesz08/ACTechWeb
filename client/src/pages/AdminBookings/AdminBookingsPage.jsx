import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import bookingService from '../../services/bookingService'
import userService from '../../services/userService'
import './AdminBookingsPage.css'
import { generateInvoice } from '../../utils/invoiceGenerator'
import units from '../../utils/Units'
import prices from '../../utils/Prices'

function AdminBookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }

    fetchData()
  }, [navigate])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bookingsResponse, techniciansResponse] = await Promise.all([
        bookingService.getAllBookings(),
        userService.getTechnicians(),
      ])

      setBookings(bookingsResponse.bookings || [])
      setTechnicians(techniciansResponse.technicians || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus)
      fetchData()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update booking status')
    }
  }

  const handleAssignTechnician = async (bookingId, technicianId) => {
    try {
      await bookingService.assignTechnician(bookingId, technicianId)
      fetchData()
    } catch (err) {
      console.error('Error assigning technician:', err)
      alert('Failed to assign technician')
    }
  }

  const getFilteredBookings = () => {
    let filtered = bookings

    filtered = filtered.filter((b) => {
      const bookingDate = new Date(b.date)
      return (
        bookingDate.getMonth() === selectedMonth &&
        bookingDate.getFullYear() === selectedYear
      )
    })

    if (filter !== 'all') {
      filtered = filtered.filter((b) => b.status === filter)
    }

    return filtered
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      'in-progress': 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    }
    return classes[status] || ''
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const serviceTypes = [
    { id: 1, value: 'installation', name: 'Installation' },
    { id: 2, value: 'repair', name: 'Repair' },
    { id: 3, value: 'maintenance', name: 'Maintenance' },
    { id: 4, value: 'inspection', name: 'Inspection' },
    { id: 5, value: 'consultation', name: 'Consultation' },
    { id: 6, value: 'maintenance-plan', name: 'Annual Maintenance Plan' },
  ]

  const maintenancePlans = [
    { id: 'basic', price: 86000, name: 'Basic Plan - 86,000 Ft/year' },
    { id: 'premium', price: 151000, name: 'Premium Plan - 151,000 Ft/year' },
  ]

  const handleGenerateInvoice = (booking) => {
    const bookingData = {
      serviceType:
        serviceTypes.find((s) => s.value === booking.serviceType)?.id || '',
      unit: booking.unit || '',
      maintenancePlan: booking.maintenancePlan || '',
      date: booking.date,
      timeSlot: booking.timeSlot,
      name: booking.customerName,
      email: booking.customerEmail,
      phone: booking.customerPhone,
      address: booking.customerAddress,
      description: booking.description,
      price: Number(booking.price) || 0,
    }

    generateInvoice(
      bookingData,
      booking.referenceNumber,
      serviceTypes,
      units,
      prices,
      maintenancePlans
    )
  }

  if (loading) {
    return <div className="loading">Loading bookings...</div>
  }

  const filteredBookings = getFilteredBookings()

  const monthBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date)
    return (
      bookingDate.getMonth() === selectedMonth &&
      bookingDate.getFullYear() === selectedYear
    )
  })

  const stats = {
    total: monthBookings.length,
    pending: monthBookings.filter((b) => b.status === 'pending').length,
    confirmed: monthBookings.filter((b) => b.status === 'confirmed').length,
    inProgress: monthBookings.filter((b) => b.status === 'in-progress').length,
    completed: monthBookings.filter((b) => b.status === 'completed').length,
    cancelled: monthBookings.filter((b) => b.status === 'cancelled').length,
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const currentYear = new Date().getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

  return (
    <div className="admin-bookings-page">
      <div className="admin-header">
        <h1>Bookings Management</h1>
        <p>View and manage all customer bookings</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Month and Year Selector */}
      <div className="month-year-selector">
        <div className="selector-group">
          <label>Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="selector-group">
          <label>Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="selected-period">
          Showing bookings for{' '}
          <strong>
            {monthNames[selectedMonth]} {selectedYear}
          </strong>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-confirmed">
          <div className="stat-value">{stats.confirmed}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="stat-card stat-in-progress">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card stat-cancelled">
          <div className="stat-value">{stats.cancelled}</div>
          <div className="stat-label">Cancelled</div>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button
          className={filter === 'confirmed' ? 'active' : ''}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({stats.confirmed})
        </button>
        <button
          className={filter === 'in-progress' ? 'active' : ''}
          onClick={() => setFilter('in-progress')}
        >
          In Progress ({stats.inProgress})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
        <button
          className={filter === 'cancelled' ? 'active' : ''}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({stats.cancelled})
        </button>
      </div>

      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Customer</th>
              <th>Service Type</th>
              <th>Price</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-bookings">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="ref-number">{booking.referenceNumber}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">
                        {booking.customerName}
                      </div>
                      <div className="customer-email">
                        {booking.customerEmail}
                      </div>
                      <div className="customer-phone">
                        {booking.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="service-type">
                    {booking.serviceType.replace('-', ' ')}
                    {booking.maintenancePlan && (
                      <span className="plan-badge">
                        {booking.maintenancePlan}
                      </span>
                    )}
                    {booking.unit && (
                      <div className="unit-info">
                        Unit:{' '}
                        {units.find((u) => u.id === Number(booking.unit))
                          ?.name || `#${booking.unit}`}
                      </div>
                    )}
                  </td>
                  <td className="price-cell">
                    {Number(booking.price)
                      ? `${Number(booking.price).toLocaleString('hu-HU')} Ft`
                      : 'N/A'}
                  </td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <select
                      className={`status-badge ${getStatusBadgeClass(booking.status)}`}
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="technician-select"
                      value={booking.assignedTechnicianId || ''}
                      onChange={(e) =>
                        handleAssignTechnician(booking.id, e.target.value)
                      }
                    >
                      <option value="">Not Assigned</option>
                      {technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.firstName} {tech.lastName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-view"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        View
                      </button>
                      <button
                        className="btn-invoice"
                        onClick={() => handleGenerateInvoice(booking)}
                        title="Generate Invoice"
                      >
                        📄
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedBooking(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Reference Number:</label>
                <p>{selectedBooking.referenceNumber}</p>
              </div>
              <div className="detail-group">
                <label>Customer Name:</label>
                <p>{selectedBooking.customerName}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>{selectedBooking.customerEmail}</p>
              </div>
              <div className="detail-group">
                <label>Phone:</label>
                <p>{selectedBooking.customerPhone}</p>
              </div>
              <div className="detail-group">
                <label>Address:</label>
                <p>{selectedBooking.customerAddress}</p>
              </div>
              <div className="detail-group">
                <label>Service Type:</label>
                <p className="capitalize">
                  {selectedBooking.serviceType.replace('-', ' ')}
                </p>
              </div>
              {selectedBooking.maintenancePlan && (
                <div className="detail-group">
                  <label>Maintenance Plan:</label>
                  <p className="capitalize">
                    {selectedBooking.maintenancePlan}
                  </p>
                </div>
              )}
              {selectedBooking.unit && (
                <div className="detail-group">
                  <label>AC Unit:</label>
                  <p>
                    {units.find((u) => u.id === Number(selectedBooking.unit))
                      ?.name || `Unit #${selectedBooking.unit}`}
                  </p>
                </div>
              )}
              {selectedBooking.price && (
                <div className="detail-group">
                  <label>Price:</label>
                  <p className="price-highlight">
                    {Number(selectedBooking.price).toLocaleString('hu-HU')} Ft
                  </p>
                </div>
              )}
              <div className="detail-group">
                <label>Date & Time:</label>
                <p>
                  {formatDate(selectedBooking.date)} -{' '}
                  {selectedBooking.timeSlot}
                </p>
              </div>
              <div className="detail-group">
                <label>Description:</label>
                <p>{selectedBooking.description}</p>
              </div>
              <div className="detail-group">
                <label>Status:</label>
                <p
                  className={`status-badge ${getStatusBadgeClass(selectedBooking.status)}`}
                >
                  {selectedBooking.status}
                </p>
              </div>
              {selectedBooking.assignedTechnician && (
                <div className="detail-group">
                  <label>Assigned Technician:</label>
                  <p>
                    {selectedBooking.assignedTechnician.firstName}{' '}
                    {selectedBooking.assignedTechnician.lastName}
                  </p>
                </div>
              )}
              {selectedBooking.notes && (
                <div className="detail-group">
                  <label>Notes:</label>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => handleGenerateInvoice(selectedBooking)}
              >
                Download Invoice (PDF)
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBookingsPage
