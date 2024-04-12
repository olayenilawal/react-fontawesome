import React, { useState } from 'react';
import { auth, firestore } from '../firebase/firebase';
import { toast } from 'react-toastify';
import '../assets/css/signup.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';



const SignUp = () => {
  const [title, setTitle] = useState('');
  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('male'); // State for gender
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address.');
      }

      if (!validatePhoneNumber(phoneNumber)) {
        throw new Error('Please enter a valid phone number.');
      }

      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      console.log('User registered:', userCredential.user);

      const userId = userCredential.user.uid;
      const fullName = `${title}. ${firstname} ${middlename} ${surname}`.trim(); // Combine name parts
      const userData = { name: fullName, email, phoneNumber, role, country, gender }; // Include gender in userData
      await saveUserDataToFirestore(userId, userData);

      console.log('User data saved successfully!');
      toast.success('Successful Signup');

      // Clear input fields after successful signup
      setTitle('');
      setFirstname('');
      setMiddlename('');
      setSurname('');
      setEmail('');
      setPhoneNumber('');
      setRole('');
      setCountry('');
      setPassword('');
      setGender('male'); // Reset gender state
    } catch (error) {
      setError(error.message);
      console.error('Error signing up:', error.message);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const re = /^\d*$/;
    return re.test(phoneNumber);
  };

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
        <div className="row">
          <div className="col-md-6">
            <div className="input_field">
              {/* <FontAwesomeIcon icon={faUser} className="icon" /> */}
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="signup-input"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input_field">
              {/* <FontAwesomeIcon icon={faUser} className="icon" /> */}
              <input
                type="text"
                placeholder="Firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="signup-input"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="input_field">
              {/* <FontAwesomeIcon icon={faUser} className="icon" /> */}
              <input
                type="text"
                placeholder="Middlename"
                value={middlename}
                onChange={(e) => setMiddlename(e.target.value)}
                className="signup-input"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="input_field">
              {/* <FontAwesomeIcon icon={faUser} className="icon" /> */}
              <input
                type="text"
                placeholder="Surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="signup-input"
              />
            </div>
          </div>
        </div>
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
        <div className="row">
          <div>
            <label htmlFor="gender">Gender:</label>
            <div className="radio_option">
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              <label htmlFor="male">Male</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              <label htmlFor="female">Female</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {/* <label htmlFor="country">Country:</label> */}
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="signup-input"
            >
              <option value="">Select Country</option>
              {/* Add options for all countries */}
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              {/* Add more options as needed */}
            </select>
          </div>
            <div className="col-md-6">
            {/* <label htmlFor="role">Role:</label> */}
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
          </div>
         
        </div>
        <div className='col-md-12'>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="signup-input"
            />
          </div>
        <button onClick={handleSignUp} className="signup-button">
          Sign Up
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
