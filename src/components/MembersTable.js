import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer, faEdit, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { firestore } from '../firebase/firebase';
import '../assets/css/submittedman.css';

const ReviewingManuscriptsTable = ({ manuscripts, handleAction }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [selectedAction, setSelectedAction] = useState('');

  const openConfirmation = (action, manuscript) => {
    setSelectedAction(action);
    setSelectedManuscript(manuscript);
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSelectedAction('');
    setSelectedManuscript(null);
  };

  const performAction = async () => {
    if (selectedAction === 'View') {
      try {
        const response = await fetch(selectedManuscript.fullPagesUrl);
        const blob = await response.blob();
  
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedManuscript.id}.pdf`; // Specify the filename for download
        document.body.appendChild(a);
        a.click();
  
        // Clean up
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading manuscript:', error);
      }
    } else if (selectedAction === 'Reject') {
      handleAction(selectedManuscript.id, 'Reject');
    } else if (selectedAction === 'Complete') {
      try {
        const reviewingRef = firestore.collection('ReviewingManuscripts').doc(selectedManuscript.id);
        await reviewingRef.set(selectedManuscript);
        handleAction(selectedManuscript.id, 'Complete');
      } catch (error) {
        console.error('Error completing manuscript:', error);
      }
    }
    closeConfirmation();
  };
  

  return (
    <div className="manuscripts-table" style={{marginLeft: '250px'}}>
      <h3>Member View</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Institution</th>
            {/* <th>Contact Information</th> */}
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
              {/* <td>{manuscript.contactInfo}</td>  */}
              <td>{manuscript.college}</td>
              <td>
                <div className="action-buttons">
                  {/* View Action */}
                  <button
                    className="action-button"
                    onClick={() => openConfirmation('View', manuscript)}
                  >
                    <FontAwesomeIcon icon={faHandPointer} />
                  </button>

                  {/* Edit Action */}
                  <button
                    className="action-button"
                    onClick={() => openConfirmation('Edit', manuscript)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  {/* Reject Action */}
                  <button
                    className="action-button"
                    onClick={() => openConfirmation('Reject', manuscript)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>

                  {/* Complete Action */}
                  <button
                    className="action-button"
                    onClick={() => openConfirmation('Complete', manuscript)}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Do you wish to {selectedAction.toLowerCase()} this manuscript?</p>
          <div className="confirmation-buttons">
            <button onClick={performAction}>Yes</button>
            <button onClick={closeConfirmation}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewingManuscriptsTable;
