import React, { useState } from 'react';
import { auth, firestore } from '../firebase/firebase';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import '../assets/css/style.css';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Validate email format using regex
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address.');
      }

      // Validate phone number format (only digits allowed)
      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error('Please enter a valid phone number.');
      }

      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      console.log('User registered:', userCredential.user);

      // Save user data to Firestore after successful signup
      const userId = userCredential.user.uid;
      const userData = { username, email, phoneNumber, role };
      await saveUserDataToFirestore(userId, userData);

      console.log('User data saved successfully!');

      // Show success message
      toast.success('Successful Signup');

      // Clear input fields after successful signup
      setUsername('');
      setEmail('');
      setPhoneNumber('');
      setRole('');
      setPassword('');
    } catch (error) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    }
  };

  // Function to validate email format using regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Function to validate phone number (only digits allowed)
  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d*$/;
    return re.test(phoneNumber);
  };

  // Function to save user data to Firestore collection
  const saveUserDataToFirestore = async (userId, userData) => {
    try {
      await firestore.collection('ManuscriptUsers').doc(userId).set(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="signup-input"
          pattern="\d*"
        />
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="signup-input"
        >
          <option value="">Select Role</option>
          <option value="Chief Editor">Chief Editor</option>
          <option value="Secretary">Secretary</option>
          <option value="Reviewer">Reviewer</option>
          <option value="Member">Member</option>
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
