import React, { useState } from 'react';
import '../assets/css/popup.css';

const InvitePopup = ({ onClose, onInviteReviewer }) => {
  const [showPopup, setShowPopup] = useState(false);

  const [reviewerDetails, setReviewerDetails] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    country: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewerDetails({ ...reviewerDetails, [name]: value });
  };

  const handleInvite = () => {
    // Ensure all required fields are filled out
    if (!reviewerDetails.title || !reviewerDetails.firstName || !reviewerDetails.lastName || !reviewerDetails.email) {
      alert('Please fill out all required fields');
      return;
    }

    // Construct the invitation email body
    const subject = `Invitation to Review Manuscript`;
    const body = `Dear ${reviewerDetails.title} ${reviewerDetails.firstName},%0D%0A%0D%0AI hope this email meets you well.%0D%0A%0D%0APlease consider reviewing our manuscript.%0D%0A%0D%0ABest regards,%0D%0ASender`;

    // Construct the mailto URL
    const mailtoUrl = `mailto:${reviewerDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open the default email client with pre-filled details
    window.location.href = mailtoUrl;

    // Call the onInviteReviewer function passed from parent component
    onInviteReviewer();

    // Close the popup after inviting reviewer
    onClose();
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  // List of all countries in the world
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
    'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
    'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
    'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
    'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
    'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
    'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
    'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    // Add more countries as needed
  ];

  return (
    <div>
      <button onClick={togglePopup}>Open Invite Popup</button>
      {showPopup && (
        <div className="popup-container">
          <div className="invite-popup">
            <h3>Invite Reviewer</h3>
            <div>
              {/* Input fields for reviewer details */}
              <input type="text" name="title" placeholder="Title" onChange={handleInputChange} />
              <input type="text" name="firstName" placeholder="First Name" onChange={handleInputChange} />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleInputChange} />
              <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
              <input type="text" name="institution" placeholder="Institution" onChange={handleInputChange} />
              <select name="country" onChange={handleInputChange} value={reviewerDetails.country}>
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button onClick={handleInvite}>Invite Reviewer</button>
              <button onClick={togglePopup}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitePopup;
