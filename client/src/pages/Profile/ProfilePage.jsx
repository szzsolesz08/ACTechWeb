import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import userService from '../../services/userService'
import './ProfilePage.css'

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setEditData({
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      city: currentUser?.city || '',
      zipCode: currentUser?.zipCode || '',
    })
    setLoading(false)
  }, [navigate])

  const handleEditClick = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      city: user?.city || '',
      zipCode: user?.zipCode || '',
    })
    setError('')
    setSuccess('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData({
      ...editData,
      [name]: value,
    })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await userService.updateProfile(editData)

      const updatedUser = response.user

      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      setSuccess('Profile updated successfully!')
      setIsEditing(false)

      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.error || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="profile-page">
      <section className="page-header">
        <h2>My Profile</h2>
        <p>Manage your account information</p>
      </section>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <h3>
              {user?.firstName} {user?.lastName}
            </h3>
            <span className="profile-role">{user?.role}</span>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {!isEditing ? (
            <>
              <div className="profile-info">
                <div className="info-group">
                  <label>First Name</label>
                  <p>{user?.firstName}</p>
                </div>

                <div className="info-group">
                  <label>Last Name</label>
                  <p>{user?.lastName}</p>
                </div>

                <div className="info-group">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>

                <div className="info-group">
                  <label>Phone</label>
                  <p>{user?.phone || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>Address</label>
                  <p>{user?.address || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>City</label>
                  <p>{user?.city || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>ZIP Code</label>
                  <p>{user?.zipCode || 'Not provided'}</p>
                </div>

                <div className="info-group">
                  <label>Role</label>
                  <p className="capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="profile-actions">
                <button className="btn btn-primary" onClick={handleEditClick}>
                  Edit Profile
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/booking')}
                >
                  Book a Service
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSaveProfile} className="profile-edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={editData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={editData.zipCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="profile-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
