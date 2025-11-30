import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import contactService from '../../services/contactService'
import userService from '../../services/userService'
import './AdminContactPage.css'

function AdminContactPage() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)
  const [editingNotes, setEditingNotes] = useState(null)
  const [notesText, setNotesText] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [statusModalData, setStatusModalData] = useState(null)

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
      const [contactsResponse, staffResponse] = await Promise.all([
        contactService.getAllContacts(),
        userService.getTechnicians(),
      ])

      setContacts(contactsResponse.contacts || [])
      setStaff(staffResponse.technicians || [])
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (contactId, newStatus, notes = '') => {
    try {
      await contactService.updateContactStatus(contactId, newStatus, notes)
      fetchData()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update contact status')
    }
  }

  const openStatusModal = (contact, newStatus) => {
    setStatusModalData({
      contact,
      newStatus,
      notes: contact.notes || '',
    })
  }

  const closeStatusModal = () => {
    setStatusModalData(null)
  }

  const confirmStatusChange = async () => {
    if (!statusModalData) return
    await handleStatusChange(
      statusModalData.contact.id,
      statusModalData.newStatus,
      statusModalData.notes || ''
    )
    closeStatusModal()
  }

  const handleAssignStaff = async (contactId, userId) => {
    try {
      await contactService.assignContact(contactId, userId)
      fetchData()
    } catch (err) {
      console.error('Error assigning staff:', err)
      alert('Failed to assign contact')
    }
  }

  const handleSaveNotes = async (contactId) => {
    try {
      await contactService.updateContactNotes(contactId, notesText)
      setEditingNotes(null)
      setNotesText('')
      fetchData()
    } catch (err) {
      console.error('Error updating notes:', err)
      alert('Failed to update notes')
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (
      !window.confirm('Are you sure you want to delete this contact message?')
    ) {
      return
    }

    try {
      await contactService.deleteContact(contactId)
      setSelectedContact(null)
      fetchData()
    } catch (err) {
      console.error('Error deleting contact:', err)
      alert('Failed to delete contact message')
    }
  }

  const getFilteredContacts = () => {
    let filtered = contacts.filter((c) => {
      const contactDate = new Date(c.createdAt)
      return (
        contactDate.getMonth() === selectedMonth &&
        contactDate.getFullYear() === selectedYear
      )
    })

    if (filter !== 'all') {
      filtered = filtered.filter((c) => c.status === filter)
    }

    return filtered
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      new: 'status-new',
      read: 'status-read',
      'in-progress': 'status-in-progress',
      resolved: 'status-resolved',
      closed: 'status-closed',
    }
    return classes[status] || ''
  }

  const getSubjectBadgeClass = (subject) => {
    const classes = {
      quote: 'subject-quote',
      service: 'subject-service',
      support: 'subject-support',
      feedback: 'subject-feedback',
      other: 'subject-other',
    }
    return classes[subject] || ''
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="loading">Loading contact messages...</div>
  }

  const filteredContacts = getFilteredContacts()

  const monthContacts = contacts.filter((c) => {
    const contactDate = new Date(c.createdAt)
    return (
      contactDate.getMonth() === selectedMonth &&
      contactDate.getFullYear() === selectedYear
    )
  })

  const stats = {
    total: monthContacts.length,
    new: monthContacts.filter((c) => c.status === 'new').length,
    read: monthContacts.filter((c) => c.status === 'read').length,
    inProgress: monthContacts.filter((c) => c.status === 'in-progress').length,
    resolved: monthContacts.filter((c) => c.status === 'resolved').length,
    closed: monthContacts.filter((c) => c.status === 'closed').length,
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
    <div className="contact-messages-page">
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <p>View and manage customer inquiries</p>
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
          Showing messages from{' '}
          <strong>
            {monthNames[selectedMonth]} {selectedYear}
          </strong>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Messages</div>
        </div>
        <div className="stat-card stat-new">
          <div className="stat-value">{stats.new}</div>
          <div className="stat-label">New</div>
        </div>
        <div className="stat-card stat-read">
          <div className="stat-value">{stats.read}</div>
          <div className="stat-label">Read</div>
        </div>
        <div className="stat-card stat-in-progress">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card stat-closed">
          <div className="stat-value">{stats.closed}</div>
          <div className="stat-label">Closed</div>
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
          className={filter === 'new' ? 'active' : ''}
          onClick={() => setFilter('new')}
        >
          New ({stats.new})
        </button>
        <button
          className={filter === 'read' ? 'active' : ''}
          onClick={() => setFilter('read')}
        >
          Read ({stats.read})
        </button>
        <button
          className={filter === 'in-progress' ? 'active' : ''}
          onClick={() => setFilter('in-progress')}
        >
          In Progress ({stats.inProgress})
        </button>
        <button
          className={filter === 'resolved' ? 'active' : ''}
          onClick={() => setFilter('resolved')}
        >
          Resolved ({stats.resolved})
        </button>
        <button
          className={filter === 'closed' ? 'active' : ''}
          onClick={() => setFilter('closed')}
        >
          Closed ({stats.closed})
        </button>
      </div>

      <div className="contacts-table-container">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Subject</th>
              <th>Message Preview</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr key="no-contacts">
                <td colSpan="8" className="no-contacts">
                  No contact messages found
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="date-cell">{formatDate(contact.createdAt)}</td>
                  <td className="name-cell">{contact.name}</td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-email">{contact.email}</div>
                      {contact.phone && (
                        <div className="contact-phone">{contact.phone}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`subject-badge ${getSubjectBadgeClass(contact.subject)}`}
                    >
                      {contact.subject}
                    </span>
                  </td>
                  <td className="message-preview">
                    {contact.message.substring(0, 80)}
                    {contact.message.length > 80 && '...'}
                  </td>
                  <td>
                    <select
                      className={`status-badge ${getStatusBadgeClass(contact.status)}`}
                      value={contact.status}
                      onChange={(e) => openStatusModal(contact, e.target.value)}
                    >
                      <option key="new" value="new">
                        New
                      </option>
                      <option key="read" value="read">
                        Read
                      </option>
                      <option key="in-progress" value="in-progress">
                        In Progress
                      </option>
                      <option key="resolved" value="resolved">
                        Resolved
                      </option>
                      <option key="closed" value="closed">
                        Closed
                      </option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="staff-select"
                      value={contact.assignedToId || ''}
                      onChange={(e) =>
                        handleAssignStaff(contact.id, e.target.value)
                      }
                    >
                      <option key="not-assigned" value="">
                        Not Assigned
                      </option>
                      {staff.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => setSelectedContact(contact)}
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
              <h2>Update Contact Status</h2>
              <button className="modal-close" onClick={closeStatusModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Contact:</label>
                <p>{statusModalData.contact.name}</p>
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
                  placeholder="Add notes about this customer inquiry (optional)"
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

      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Message Details</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedContact(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-group">
                <label>Received:</label>
                <p>{formatDate(selectedContact.createdAt)}</p>
              </div>
              <div className="detail-group">
                <label>Name:</label>
                <p>{selectedContact.name}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>{selectedContact.email}</p>
              </div>
              {selectedContact.phone && (
                <div className="detail-group">
                  <label>Phone:</label>
                  <p>{selectedContact.phone}</p>
                </div>
              )}
              <div className="detail-group">
                <label>Subject:</label>
                <p>
                  <span
                    className={`subject-badge ${getSubjectBadgeClass(selectedContact.subject)}`}
                  >
                    {selectedContact.subject}
                  </span>
                </p>
              </div>
              <div className="detail-group">
                <label>Message:</label>
                <p className="message-full">{selectedContact.message}</p>
              </div>
              <div className="detail-group">
                <label>Status:</label>
                <p>
                  <span
                    className={`status-badge ${getStatusBadgeClass(selectedContact.status)}`}
                  >
                    {selectedContact.status}
                  </span>
                </p>
              </div>
              {selectedContact.assignedTo && (
                <div className="detail-group">
                  <label>Assigned To:</label>
                  <p>
                    {selectedContact.assignedTo.firstName}{' '}
                    {selectedContact.assignedTo.lastName}
                  </p>
                </div>
              )}
              <div className="detail-group">
                <label>Internal Notes:</label>
                {editingNotes === selectedContact.id ? (
                  <div className="notes-edit">
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows="4"
                      placeholder="Add internal notes..."
                    />
                    <div className="notes-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSaveNotes(selectedContact.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setEditingNotes(null)
                          setNotesText('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="notes-display">
                    <p>{selectedContact.notes || 'No notes yet'}</p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingNotes(selectedContact.id)
                        setNotesText(selectedContact.notes || '')
                      }}
                    >
                      Edit Notes
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteContact(selectedContact.id)}
              >
                Delete Message
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedContact(null)}
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

export default AdminContactPage
