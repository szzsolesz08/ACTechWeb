import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './NavigationBar.css'

function NavigationBar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      const user = authService.getCurrentUser()
      setIsAuthenticated(authenticated)
      setCurrentUser(user)
    }

    checkAuth()

    window.addEventListener('storage', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
    }
  }, [])

  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [])

  const toggleMobileMenu = () => {
    const newMenuState = !mobileMenuOpen
    setMobileMenuOpen(newMenuState)

    if (newMenuState) {
      document.body.classList.add('menu-open')
    } else {
      document.body.classList.remove('menu-open')
    }
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setCurrentUser(null)
    closeMobileMenu()
    navigate('/')
  }

  return (
    <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/">
            <span className="logo-icon">❄️</span>
            <span className="logo-text">AC Tech</span>
          </Link>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <ul>
            {currentUser?.role !== 'admin' &&
              currentUser?.role !== 'technician' && (
                <>
                  <li>
                    <Link to="/" onClick={closeMobileMenu}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" onClick={closeMobileMenu}>
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link to="/prices" onClick={closeMobileMenu}>
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" onClick={closeMobileMenu}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" onClick={closeMobileMenu}>
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/booking"
                      onClick={closeMobileMenu}
                      className="nav-booking"
                    >
                      Book Now
                    </Link>
                  </li>
                </>
              )}
            {currentUser?.role === 'admin' && (
              <ul>
                <li>
                  <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/bookings" onClick={closeMobileMenu}>
                    Manage Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/admin/contacts" onClick={closeMobileMenu}>
                    Manage Contacts
                  </Link>
                </li>
              </ul>
            )}
            {currentUser?.role === 'technician' && (
              <ul>
                <li>
                  <Link to="/technician/bookings" onClick={closeMobileMenu}>
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link to="/technician/contacts" onClick={closeMobileMenu}>
                    My Contacts
                  </Link>
                </li>
              </ul>
            )}
          </ul>

          <div className="mobile-auth">
            {isAuthenticated ? (
              <>
                {currentUser?.role === 'customer' ||
                  (currentUser?.role === 'technician' && (
                    <Link
                      to="/profile"
                      className="nav-profile"
                      onClick={closeMobileMenu}
                    >
                      My Profile
                    </Link>
                  ))}
                <button className="nav-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="nav-login"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="nav-register"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="nav-auth">
          {isAuthenticated ? (
            <>
              <span className="nav-user-name">
                Hello, {currentUser?.firstName}
              </span>
              {currentUser?.role === 'customer' && (
                <Link to="/profile" className="nav-profile">
                  My Profile
                </Link>
              )}
              <button className="nav-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Login
              </Link>
              <Link to="/register" className="nav-register">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

export default NavigationBar
