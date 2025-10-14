import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import bookingService from '../services/bookingService';
import userService from '../services/userService';
import './AdminBookingsPage.css';

function AdminBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsResponse, techniciansResponse] = await Promise.all([
        bookingService.getAllBookings(),
        userService.getTechnicians()
      ]);
      
      setBookings(bookingsResponse.bookings || []);
      setTechnicians(techniciansResponse.technicians || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update booking status');
    }
  };

  const handleAssignTechnician = async (bookingId, technicianId) => {
    try {
      await bookingService.assignTechnician(bookingId, technicianId);
      fetchData();
    } catch (err) {
      console.error('Error assigning technician:', err);
      alert('Failed to assign technician');
    }
  };

  const getFilteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(b => b.status === filter);
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      'in-progress': 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return classes[status] || '';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  const filteredBookings = getFilteredBookings();
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    inProgress: bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  return (
    <div className="admin-bookings-page">
      <div className="admin-header">
        <h1>Bookings Management</h1>
        <p>View and manage all customer bookings</p>
      </div>

      {error && <div className="error-message">{error}</div>}

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
                <td colSpan="8" className="no-bookings">
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map(booking => (
                <tr key={booking._id}>
                  <td className="ref-number">{booking.referenceNumber}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{booking.customerInfo.name}</div>
                      <div className="customer-email">{booking.customerInfo.email}</div>
                      <div className="customer-phone">{booking.customerInfo.phone}</div>
                    </div>
                  </td>
                  <td className="service-type">
                    {booking.serviceType.replace('-', ' ')}
                    {booking.maintenancePlan && (
                      <span className="plan-badge">{booking.maintenancePlan}</span>
                    )}
                  </td>
                  <td>{formatDate(booking.date)}</td>
                  <td>{booking.timeSlot}</td>
                  <td>
                    <select 
                      className={`status-badge ${getStatusBadgeClass(booking.status)}`}
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
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
                      value={booking.assignedTechnician?._id || ''}
                      onChange={(e) => handleAssignTechnician(booking._id, e.target.value)}
                    >
                      <option value="">Not Assigned</option>
                      {technicians.map(tech => (
                        <option key={tech._id} value={tech._id}>
                          {tech.firstName} {tech.lastName}
                        </option>
                      ))}
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

      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Booking Details</h2>
              <button className="modal-close" onClick={() => setSelectedBooking(null)}>×</button>
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
                <label>Address:</label>
                <p>{selectedBooking.customerInfo.address}</p>
              </div>
              <div className="detail-group">
                <label>Service Type:</label>
                <p className="capitalize">{selectedBooking.serviceType.replace('-', ' ')}</p>
              </div>
              <div className="detail-group">
                <label>Date & Time:</label>
                <p>{formatDate(selectedBooking.date)} - {selectedBooking.timeSlot}</p>
              </div>
              <div className="detail-group">
                <label>Description:</label>
                <p>{selectedBooking.description}</p>
              </div>
              <div className="detail-group">
                <label>Status:</label>
                <p className={`status-badge ${getStatusBadgeClass(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </p>
              </div>
              {selectedBooking.assignedTechnician && (
                <div className="detail-group">
                  <label>Assigned Technician:</label>
                  <p>
                    {selectedBooking.assignedTechnician.firstName} {selectedBooking.assignedTechnician.lastName}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminBookingsPage;
