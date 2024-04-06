// SignIn.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import '../assets/css/style.css'; // Import CSS file
import logo from '../assets/img/logo.png'; // Import logo image (adjust path as needed)

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
   // State to control visibility of welcome message
   const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

   useEffect(() => {
     // Trigger typing animation after component mounts
     setShowWelcomeMessage(true);
   }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('User signed in successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  

  return (
    <div className="signin-container">
        {/* Left Section (with logo and welcome message) */}
        <div className="left-section">
          
        <img src={logo} alt="Logo" className="logo" />
        <p className={`welcome-text ${showWelcomeMessage ? 'typing-animation' : ''}`}>
          Welcome to Lagos University Teaching Hospital<br /> Manuscript Management System
        </p>
        
      </div>

      {/* Right Section */}
      <div className="right-section">
        <form className="signin-form" onSubmit={handleSignIn}>
          <h2>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />
          <button type="submit" className="signin-button">
            Sign In
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;