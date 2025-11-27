import api from './api'

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create booking' }
    }
  },

  getAllBookings: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const response = await api.get(`/bookings?${params}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch bookings' }
    }
  },

  getBookingByReference: async (referenceNumber) => {
    try {
      const response = await api.get(`/bookings/${referenceNumber}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Booking not found' }
    }
  },

  updateBookingStatus: async (bookingId, status, notes = '') => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/status`, {
        status,
        notes,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update booking status' }
    }
  },

  assignTechnician: async (bookingId, technicianId) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/assign`, {
        technicianId,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to assign technician' }
    }
  },

  getAvailableTimeSlots: async (date) => {
    try {
      const response = await api.get(
        `/bookings/availability/timeslots?date=${date}`
      )
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          error: 'Failed to fetch available time slots',
        }
      )
    }
  },

  getAvailableTechnicians: async (date, timeSlot) => {
    try {
      const response = await api.get(
        `/bookings/availability/technicians?date=${date}&timeSlot=${encodeURIComponent(timeSlot)}`
      )
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          error: 'Failed to fetch available technicians',
        }
      )
    }
  },
}

export default bookingService
