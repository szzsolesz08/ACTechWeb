import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './AuthPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    zipCode: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData({
      ...registerData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!registerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!registerData.email.includes('@') || !registerData.email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/\d/.test(registerData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*]/.test(registerData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (registerData.zipCode && !/^\d{4,6}$/.test(registerData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (4-6 digits)';
    }
    
    if (!registerData.termsAccepted) {
      newErrors.termsAccepted = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        const userData = {
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          confirmPassword: registerData.confirmPassword,
          phone: registerData.phone,
          address: registerData.address,
          city: registerData.city,
          zipCode: registerData.zipCode
        };
        
        const response = await authService.register(userData);
        console.log('Registration successful:', response.user);
        
        window.dispatchEvent(new Event('storage'));
        
        setRegistrationComplete(true);
      } catch (err) {
        console.error('Registration error:', err);
        
        if (err.errors && Array.isArray(err.errors)) {
          const newErrors = {};
          err.errors.forEach(error => {
            newErrors[error.path || 'general'] = error.msg;
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: err.error || 'Registration failed. Please try again.' });
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form has validation errors');
    }
  };

  return (
    <div className="register-page">
      <section className="page-header">
        <h2>Create an Account</h2>
        <p>Join our community of satisfied customers and enjoy premium benefits.</p>
      </section>
      
      {!registrationComplete ? (
        <div className="auth-container">
          <div className="auth-form-container">
            <div className="auth-header">
              <h3>Sign Up</h3>
              <p>Fill in your information to create your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name*</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={registerData.firstName} 
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                    required 
                  />
                  {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name*</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={registerData.lastName} 
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                    required 
                  />
                  {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={registerData.email} 
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    required 
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={registerData.phone} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={registerData.password} 
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    required 
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={registerData.confirmPassword} 
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    required 
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              </div>
              
              <div className="form-section-divider">
                <h4>Address Information (Optional)</h4>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={registerData.address} 
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
                    value={registerData.city} 
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    value={registerData.zipCode} 
                    onChange={handleChange}
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                </div>
              </div>
              
              <div className="form-checkboxes">
                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="termsAccepted" 
                    name="termsAccepted" 
                    checked={registerData.termsAccepted} 
                    onChange={handleChange}
                    className={errors.termsAccepted ? 'error' : ''}
                  />
                  <label htmlFor="termsAccepted">
                    I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>*
                  </label>
                  {errors.termsAccepted && <div className="error-message">{errors.termsAccepted}</div>}
                </div>
              </div>
              
              {errors.general && <div className="auth-error">{errors.general}</div>}
              
              <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="auth-footer">
                <p>Already have an account? <a href="/login">Sign in</a></p>
              </div>
            </form>
          </div>
          
          <div className="auth-benefits">
            <h3>Account Benefits</h3>
            <ul>
              <li>
                <div className="benefit-icon">💨</div>
                <div className="benefit-text">
                  <h4>Fast Booking</h4>
                  <p>Schedule appointments with saved information</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">💰</div>
                <div className="benefit-text">
                  <h4>Exclusive Discounts</h4>
                  <p>Special offers only available to registered customers</p>
                </div>
              </li>
              <li>
                <div className="benefit-icon">🔔</div>
                <div className="benefit-text">
                  <h4>Service Reminders</h4>
                  <p>Timely notifications for optimal AC performance</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="registration-success">
          <div className="success-icon">✓</div>
          <h3>Registration Successful!</h3>
          <p>Thank you for creating an account with AC Technician Services.</p>
          <p>A confirmation email has been sent to <strong>{registerData.email}</strong>.</p>
          <p>Please check your inbox and click the verification link to complete your registration.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Home
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/booking')}>
              Book a Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;
