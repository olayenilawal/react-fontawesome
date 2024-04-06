import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer, faPlus } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import '../assets/css/submittedman.css';
import { firestore } from '../firebase/firebase'; // Adjust the path to your Firebase configuration file


const SubmittedManuscriptsTable = ({ manuscripts, handleAction }) => {
    const [showAbstractPopup, setShowAbstractPopup] = useState(false);
    const [currentAbstract, setCurrentAbstract] = useState('');
  
    const fetchAbstract = async (manuscriptId) => {
        try {
          console.log('Fetching abstract for manuscript ID:', manuscriptId);
          const manuscriptRef = firestore.collection('SubmittedManuscripts').where('ID', '==', manuscriptId);
          const querySnapshot = await manuscriptRef.get();
      
          console.log('Query results:', querySnapshot.docs);
      
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]; // Assuming there's only one matching document
            const data = doc.data();
            const abstract = data.abstract;
      
            if (abstract) {
              setCurrentAbstract(abstract);
              setShowAbstractPopup(true);
            } else {
              console.log('Abstract not found in the manuscript data.');
            }
          } else {
            console.log('No document found for ID:', manuscriptId);
          }
        } catch (error) {
          console.error('Error fetching abstract:', error);
        }
      };
      
  
    const closeAbstractPopup = () => {
      setShowAbstractPopup(false);
      setCurrentAbstract('');
    };
  

  return (
    <div className="manuscripts-table-container">
      <table className="manuscripts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Institution</th>
            <th>Contact Information</th>
            <th>College</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manuscripts.map((manuscript) => (
            <tr key={manuscript.id}>
              <td>{manuscript.id}</td>
              <td>{manuscript.name}</td>
              <td>{manuscript.email}</td>
              <td>{manuscript.institution}</td>
              <td>{manuscript.contactInformation}</td>
              <td>{manuscript.college}</td>
              <td>
                <div className="action-buttons">
                  {/* View Action */}
                  <button className="action-button" onClick={() => handleAction(manuscript.id, 'View')}>
                    <FontAwesomeIcon icon={faHandPointer} />
                  </button>

                  {/* Dropdown with Abstract and other actions */}
                  <div className="action-dropdown">
                  <button onClick={() => fetchAbstract(manuscript.id)}>
                    <FontAwesomeIcon icon={faHandPointer} /> View Abstract
                  </button>
                    <button onClick={() => handleAction(manuscript.id, 'ViewFullManuscript')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Manuscript
                    </button>
                    <button onClick={() => handleAction(manuscript.id, 'ViewPictures')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Pictures
                    </button>
                    <button onClick={() => handleAction(manuscript.id, 'ViewWordDocument')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View Word Document
                    </button>
                    <button onClick={() => handleAction(manuscript.id, 'ViewPDF')}>
                      <FontAwesomeIcon icon={faHandPointer} /> View PDF
                    </button>
                    <button onClick={() => handleAction(manuscript.id, 'InviteReviewer')}>
                      <FontAwesomeIcon icon={faPlus} /> Invite Viewer
                    </button>
                    <button onClick={() => handleAction(manuscript.id, 'Standardize')}>
                      <FontAwesomeIcon icon={faHandPointer} /> Standardize
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    {/* Abstract Popup */}
    {showAbstractPopup && (
        <div className="popup-container">
          <div className="abstract-popup">
            <h3>Abstract</h3>
            <p>{currentAbstract}</p>
            <button onClick={closeAbstractPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedManuscriptsTable;
