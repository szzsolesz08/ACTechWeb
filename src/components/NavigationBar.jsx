import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

function NavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Effect to ensure scroll lock is removed when component unmounts
  useEffect(() => {
    // Cleanup function to remove scroll lock class if component unmounts
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    // Toggle mobile menu state
    const newMenuState = !mobileMenuOpen;
    setMobileMenuOpen(newMenuState);
    
    // Toggle body scroll lock
    if (newMenuState) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    // Remove body scroll lock
    document.body.classList.remove('menu-open');
  };

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
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><Link to="/services" onClick={closeMobileMenu}>Services</Link></li>
            <li><Link to="/prices" onClick={closeMobileMenu}>Pricing</Link></li>
            <li><Link to="/about" onClick={closeMobileMenu}>About Us</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
            <li><Link to="/booking" onClick={closeMobileMenu} className="nav-booking">Book Now</Link></li>
          </ul>
          
          {/* Mobile auth buttons */}
          <div className="mobile-auth">
            <Link to="/login" className="nav-login" onClick={closeMobileMenu}>Login</Link>
            <Link to="/register" className="nav-register" onClick={closeMobileMenu}>Register</Link>
          </div>
        </div>
        
        <div className="nav-auth">
          <Link to="/login" className="nav-login">Login</Link>
          <Link to="/register" className="nav-register">Register</Link>
        </div>
        
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
