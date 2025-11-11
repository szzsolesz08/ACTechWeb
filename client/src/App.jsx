import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

import NavigationBar from './components/NavigationBar'

import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import PricesPage from './pages/PricesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AdminBookingsPage from './pages/AdminBookingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import TechnicianBookingsPage from './pages/TechnicianBookingsPage'
import authService from './services/authService';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      const user = authService.getCurrentUser();
      setCurrentUser(user);
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

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
            <Route path="/technician/bookings" element={<TechnicianBookingsPage />} />
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
