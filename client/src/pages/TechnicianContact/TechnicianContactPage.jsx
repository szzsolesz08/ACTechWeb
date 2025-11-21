import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import contactService from '../../services/contactService'
import './TechnicianContactPage.css'

function TechnicianContactPage() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [editingNotes, setEditingNotes] = useState(null)
  const [notesText, setNotesText] = useState('')

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'technician') {
      navigate('/')
      return
    }

    setCurrentUser(user)
    fetchContacts()
  }, [navigate])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await contactService.getAllContacts()

      // Filter contacts assigned to current technician
      const user = authService.getCurrentUser()
      const currentUserId = user.id || user._id

      const myContacts = (response.contacts || []).filter((contact) => {
        if (!contact.assignedTo) {
          return false // Skip unassigned contacts
        }
        const assignedToId =
          contact.assignedTo._id?.toString() ||
          contact.assignedTo.id?.toString()
        const userId = currentUserId?.toString()
        return assignedToId === userId
      })

      setContacts(myContacts)
    } catch (err) {
      console.error('Error fetching contacts:', err)
      setError('Failed to load contact messages')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await contactService.updateContactStatus(contactId, newStatus)
      fetchContacts()
    } catch (err) {
      console.error('Error updating status:', err)
      alert('Failed to update contact status')
    }
  }

  const handleSaveNotes = async (contactId) => {
    try {
      await contactService.updateContactNotes(contactId, notesText)
      setEditingNotes(null)
      setNotesText('')
      fetchContacts()
    } catch (err) {
      console.error('Error updating notes:', err)
      alert('Failed to update notes')
    }
  }

  const getFilteredContacts = () => {
    if (filter === 'all') {
      return contacts
    }
    return contacts.filter((c) => c.status === filter)
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
    return <div className="loading">Loading your assigned contacts...</div>
  }

  const filteredContacts = getFilteredContacts()

  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === 'new').length,
    read: contacts.filter((c) => c.status === 'read').length,
    inProgress: contacts.filter((c) => c.status === 'in-progress').length,
    resolved: contacts.filter((c) => c.status === 'resolved').length,
    closed: contacts.filter((c) => c.status === 'closed').length,
  }

  return (
    <div className="technician-contact-page">
      <div className="technician-header">
        <h1>My Assigned Contact Messages</h1>
        <p>
          Welcome back, {currentUser?.firstName}! Here are the customer
          inquiries assigned to you.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

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
              <th>Customer Name</th>
              <th>Contact Info</th>
              <th>Subject</th>
              <th>Message Preview</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-contacts">
                  {filter === 'all'
                    ? 'No contact messages assigned to you yet'
                    : `No ${filter} messages`}
                </td>
              </tr>
            ) : (
              filteredContacts.map((contact) => (
                <tr key={contact._id}>
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
                      onChange={(e) =>
                        handleStatusChange(contact._id, e.target.value)
                      }
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
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
                <label>Customer Name:</label>
                <p>{selectedContact.name}</p>
              </div>
              <div className="detail-group">
                <label>Email:</label>
                <p>
                  <a href={`mailto:${selectedContact.email}`}>
                    {selectedContact.email}
                  </a>
                </p>
              </div>
              {selectedContact.phone && (
                <div className="detail-group">
                  <label>Phone:</label>
                  <p>
                    <a href={`tel:${selectedContact.phone}`}>
                      {selectedContact.phone}
                    </a>
                  </p>
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
                <label>Customer Message:</label>
                <p className="message-full">{selectedContact.message}</p>
              </div>
              <div className="detail-group">
                <label>Current Status:</label>
                <p>
                  <span
                    className={`status-badge ${getStatusBadgeClass(selectedContact.status)}`}
                  >
                    {selectedContact.status}
                  </span>
                </p>
              </div>
              <div className="detail-group">
                <label>Internal Notes:</label>
                {editingNotes === selectedContact._id ? (
                  <div className="notes-edit">
                    <textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      rows="4"
                      placeholder="Add internal notes about this inquiry..."
                    />
                    <div className="notes-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSaveNotes(selectedContact._id)}
                      >
                        Save Notes
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
                        setEditingNotes(selectedContact._id)
                        setNotesText(selectedContact.notes || '')
                      }}
                    >
                      {selectedContact.notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-action btn-start"
                onClick={() => {
                  handleStatusChange(selectedContact._id, 'in-progress')
                  setSelectedContact(null)
                }}
                disabled={
                  selectedContact.status === 'resolved' ||
                  selectedContact.status === 'closed'
                }
              >
                Start Working
              </button>
              <button
                className="btn-action btn-complete"
                onClick={() => {
                  handleStatusChange(selectedContact._id, 'resolved')
                  setSelectedContact(null)
                }}
                disabled={
                  selectedContact.status === 'resolved' ||
                  selectedContact.status === 'closed'
                }
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TechnicianContactPage
