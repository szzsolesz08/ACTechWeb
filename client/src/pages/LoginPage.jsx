import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './AuthPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(
        loginData.email,
        loginData.password
      )
      console.log('Login successful:', response.user)

      window.dispatchEvent(new Event('storage'))

      navigate('/')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.error || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="page-header">
        <h2>Customer Login</h2>
        <p>Access your account to manage appointments and services.</p>
      </section>

      <div className="auth-container">
        <div className="auth-box">
          <div className="auth-header">
            <h3>Sign In</h3>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <a href="/register">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
