import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import NavigationBar from './components/NavigationBar'

import HomePage from './pages/Home/HomePage'
import ServicesPage from './pages/Services/ServicesPage'
import PricesPage from './pages/Prices/PricesPage'
import AboutPage from './pages/About/AboutPage'
import ContactPage from './pages/Contact/ContactPage'
import BookingPage from './pages/Booking/BookingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ProfilePage from './pages/Profile/ProfilePage'
import AdminBookingsPage from './pages/AdminBookings/AdminBookingsPage'
import AdminDashboardPage from './pages/AdminDashboard/AdminDashboardPage'
import AdminContactPage from './pages/AdminContact/AdminContactPage'
import TechnicianBookingsPage from './pages/TechnicianBookings/TechnicianBookingsPage'
import TechnicianContactPage from './pages/TechnicianContact/TechnicianContactPage'
import authService from './services/authService'

function App() {
  useEffect(() => {
    const checkAuth = () => {
      authService.isAuthenticated()
      authService.getCurrentUser()
    }

    checkAuth()

    window.addEventListener('storage', checkAuth)

    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  return (
    <Router>
      <div className="app-container">
        <NavigationBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/prices" element={<PricesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/contacts" element={<AdminContactPage />} />
            <Route
              path="/technician/bookings"
              element={<TechnicianBookingsPage />}
            />
            <Route
              path="/technician/contacts"
              element={<TechnicianContactPage />}
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>&copy; 2025 AC Technician Services</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
