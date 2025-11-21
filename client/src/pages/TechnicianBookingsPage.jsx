import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import bookingService from '../services/bookingService'
import './TechnicianBookingsPage.css'

function TechnicianBookingsPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Check if user is technician
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

      // Filter bookings for current technician
      const user = authService.getCurrentUser()
      // User object has 'id' field, not '_id'
      const currentUserId = user.id || user._id

      console.log('Current user:', user)
      console.log('Current user ID:', currentUserId)
      console.log('All bookings:', response.bookings)

      const myBookings = (response.bookings || []).filter((booking) => {
        if (!booking.assignedTechnician) {
          return false // Skip unassigned bookings
        }
        const assignedTechId =
          booking.assignedTechnician._id?.toString() ||
          booking.assignedTechnician.id?.toString()
        const userId = currentUserId?.toString()
        console.log(
          'Comparing booking',
          booking.referenceNumber,
          ':',
          assignedTechId,
          'with',
          userId,
          '=',
          assignedTechId === userId
        )
        return assignedTechId === userId
      })

      console.log('Filtered bookings for technician:', myBookings)
      setBookings(myBookings)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus)
      // Refresh bookings
      fetchBookings()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update booking status')
    }
  }

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings
    return bookings.filter((b) => b.status === filter)
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
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    inProgress: bookings.filter((b) => b.status === 'in-progress').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }

  return (
    <div className="technician-bookings-page">
      <div className="technician-header">
        <h1>My Assigned Bookings</h1>
        <p>
          Welcome back, {currentUser?.firstName}! Here are your scheduled jobs.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics Cards */}
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

      {/* Filter Tabs */}
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

      {/* Bookings Table */}
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
                <tr key={booking._id}>
                  <td className="ref-number">{booking.referenceNumber}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">
                        {booking.customerInfo.name}
                      </div>
                      <div className="customer-email">
                        {booking.customerInfo.email}
                      </div>
                      <div className="customer-phone">
                        {booking.customerInfo.phone}
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
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
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

      {/* Booking Details Modal */}
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
                <p>{selectedBooking.customerInfo.name}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>{selectedBooking.customerInfo.email}</p>
              </div>
              <div className="detail-group">
                <label>Phone:</label>
                <p>{selectedBooking.customerInfo.phone}</p>
              </div>
              <div className="detail-group">
                <label>Service Address:</label>
                <p>{selectedBooking.customerInfo.address}</p>
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
                  handleStatusChange(selectedBooking._id, 'in-progress')
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
                  handleStatusChange(selectedBooking._id, 'completed')
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
