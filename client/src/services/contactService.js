import api from './api'

const contactService = {
  getAllContacts: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const response = await api.get(`/contacts?${params}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch contacts' }
    }
  },

  getContactById: async (contactId) => {
    try {
      const response = await api.get(`/contacts/${contactId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Contact not found' }
    }
  },

  updateContactStatus: async (contactId, status) => {
    try {
      const response = await api.patch(`/contacts/${contactId}/status`, {
        status,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update contact status' }
    }
  },

  assignContact: async (contactId, userId) => {
    try {
      const response = await api.patch(`/contacts/${contactId}/assign`, {
        userId,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to assign contact' }
    }
  },

  updateContactNotes: async (contactId, notes) => {
    try {
      const response = await api.patch(`/contacts/${contactId}/notes`, {
        notes,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update notes' }
    }
  },

  deleteContact: async (contactId) => {
    try {
      const response = await api.delete(`/contacts/${contactId}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete contact' }
    }
  },
}

export default contactService
