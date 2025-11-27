import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import bookingService from '../../services/bookingService'
import './TechnicianBookingsPage.css'

function TechnicianBookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [statusModalData, setStatusModalData] = useState(null)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'technician') {
      navigate('/')
      return
    }

    setCurrentUser(user)
    fetchBookings()
  }, [navigate])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAllBookings()

      const user = authService.getCurrentUser()
      const currentUserId = user.id || user._id

      const myBookings = (response.bookings || []).filter((booking) => {
        if (!booking.assignedTechnician) {
          return false
        }
        const assignedTechId = booking.assignedTechnicianId?.toString()
        const userId = currentUserId?.toString()
        return assignedTechId === userId
      })

      setBookings(myBookings)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus, notes = '') => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus, notes)
      fetchBookings()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update booking status')
    }
  }

  const openStatusModal = (booking, newStatus) => {
    setStatusModalData({
      booking,
      newStatus,
      notes: booking.notes || '',
    })
  }

  const closeStatusModal = () => {
    setStatusModalData(null)
  }

  const confirmStatusChange = async () => {
    if (!statusModalData) return
    await handleStatusChange(
      statusModalData.booking.id,
      statusModalData.newStatus,
      statusModalData.notes || ''
    )
    closeStatusModal()
  }

  const getFilteredBookings = () => {
    let filtered = bookings.filter((b) => {
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

  if (loading) {
    return <div className="loading">Loading your bookings...</div>
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
    <div className="technician-bookings-page">
      <div className="technician-header">
        <h1>My Assigned Bookings</h1>
        <p>
          Welcome back, {currentUser?.firstName}! Here are your scheduled jobs.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

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
          Showing jobs from{' '}
          <strong>
            {monthNames[selectedMonth]} {selectedYear}
          </strong>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Jobs</div>
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
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-bookings">
                  {filter === 'all'
                    ? 'No bookings assigned to you yet'
                    : `No ${filter} bookings`}
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
                  </td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <select
                      className={`status-badge ${getStatusBadgeClass(booking.status)}`}
                      value={booking.status}
                      onChange={(e) => openStatusModal(booking, e.target.value)}
                    >
                      <option key="pending" value="pending">
                        Pending
                      </option>
                      <option key="confirmed" value="confirmed">
                        Confirmed
                      </option>
                      <option key="in-progress" value="in-progress">
                        In Progress
                      </option>
                      <option key="completed" value="completed">
                        Completed
                      </option>
                      <option key="cancelled" value="cancelled">
                        Cancelled
                      </option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {statusModalData && (
        <div className="modal-overlay" onClick={closeStatusModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Job Status</h2>
              <button className="modal-close" onClick={closeStatusModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Job:</label>
                <p>{statusModalData.booking.referenceNumber}</p>
              </div>
              <div className="detail-group">
                <label>New Status:</label>
                <p
                  className={`status-badge ${getStatusBadgeClass(statusModalData.newStatus)}`}
                >
                  {statusModalData.newStatus}
                </p>
              </div>
              <div className="detail-group">
                <label>Internal Notes:</label>
                <textarea
                  rows="4"
                  value={statusModalData.notes}
                  onChange={(e) =>
                    setStatusModalData({
                      ...statusModalData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add notes about this job update (optional)"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeStatusModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={confirmStatusChange}>
                Yes, Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Job Details</h2>
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
                <label>Service Address:</label>
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
              <div className="detail-group">
                <label>Scheduled Date & Time:</label>
                <p>
                  {formatDate(selectedBooking.date)} -{' '}
                  {selectedBooking.timeSlot}
                </p>
              </div>
              <div className="detail-group">
                <label>Customer Description:</label>
                <p>
                  {selectedBooking.description || 'No description provided'}
                </p>
              </div>
              <div className="detail-group">
                <label>Current Status:</label>
                <p
                  className={`status-badge ${getStatusBadgeClass(selectedBooking.status)}`}
                >
                  {selectedBooking.status}
                </p>
              </div>
              {selectedBooking.notes && (
                <div className="detail-group">
                  <label>Notes:</label>
                  <p>{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-action btn-start"
                onClick={() => {
                  openStatusModal(selectedBooking, 'in-progress')
                  setSelectedBooking(null)
                }}
                disabled={
                  selectedBooking.status === 'completed' ||
                  selectedBooking.status === 'cancelled'
                }
              >
                Start Job
              </button>
              <button
                className="btn-action btn-complete"
                onClick={() => {
                  openStatusModal(selectedBooking, 'completed')
                  setSelectedBooking(null)
                }}
                disabled={
                  selectedBooking.status === 'completed' ||
                  selectedBooking.status === 'cancelled'
                }
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TechnicianBookingsPage
