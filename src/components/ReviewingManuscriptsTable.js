import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointer, faEdit, faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { firestore, storage } from '../firebase/firebase';
import '../assets/css/submittedman.css';
import '../assets/css/Reviewer.css';

const ReviewingManuscriptsTable = ({ manuscripts, onHandleAction }) => {
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

  const downloadDocument = async (manuscript) => {
    try {
      // Open the manuscript URL in a new tab
      window.open(manuscript.fullPagesUrl, '_blank');
    } catch (error) {
      console.error('Error downloading manuscript:', error);
    }
  };

  const uploadDocument = async (manuscriptId) => {
    try {
      console.log('Creating file input');
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/pdf';
      fileInput.multiple = true;
      fileInput.addEventListener('change', async (event) => {
        const files = event.target.files;
        console.log('Files selected:', files);
        if (files.length > 0) {
          try {
            const downloadURLs = [];
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              console.log(`Uploading file: ${file.name}`);
              const storageRef = storage.ref(`manuscripts/${manuscriptId}/${file.name}`);
              const uploadTaskSnapshot = await storageRef.put(file);
              const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
              console.log(`File uploaded: ${file.name}, URL: ${downloadURL}`);
              downloadURLs.push(downloadURL);
            }
            await firestore.collection('ReviewingManuscripts').doc(manuscriptId).update({ UpdatedManuscript: downloadURLs });
            console.log('Firestore updated with URLs:', downloadURLs);
            if (typeof onHandleAction === 'function') {
              onHandleAction(manuscriptId, 'Upload');
            }
            window.alert('Document uploaded successfully.');
          } catch (uploadError) {
            console.error('Error uploading manuscript to storage:', uploadError);
          }
        }
      });
      console.log('Triggering file input click');
      fileInput.click();
    } catch (error) {
      console.error('Error uploading manuscript:', error);
    }
    closeConfirmation();
  };


  const rejectManuscript = async (manuscript) => {
    try {
      const reviewingRef = firestore.collection('ReviewingManuscripts');
      const querySnapshot = await reviewingRef.where('id', '==', manuscript.id).get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        // Update status field in ReviewingManuscripts collection
        await doc.ref.update({ status: 'Manuscript rejected' });
        // Trigger action handler if it's a function
        if (typeof onHandleAction === 'function') {
          onHandleAction(doc.id, 'Reject');
        }
        // Alert status updated
        window.alert('Status updated successfully.');
      } else {
        console.error('Document does not exist:', manuscript.id);
      }
    } catch (error) {
      console.error('Error rejecting manuscript:', error);
    }
    closeConfirmation();
  };

  const completeManuscript = async (manuscript) => {
    try {
      const reviewingRef = firestore.collection('ReviewingManuscripts');
      const querySnapshot = await reviewingRef.where('id', '==', manuscript.id).get();

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        // Update status field in ReviewingManuscripts collection
        await doc.ref.update({ status: 'Manuscript reviewed' });
        // Trigger action handler if it's a function
        if (typeof onHandleAction === 'function') {
          onHandleAction(doc.id, 'Complete');
        }
        // Alert status updated
        window.alert('Status updated successfully.');
      } else {
        console.error('Document does not exist:', manuscript.id);
      }
    } catch (error) {
      console.error('Error completing manuscript:', error);
    }
    closeConfirmation();
  };

  const performAction = () => {
    if (selectedAction === 'View') {
      window.open(selectedManuscript.fullPagesUrl, '_blank');
    } else if (selectedAction === 'Reject') {
      rejectManuscript(selectedManuscript);
    } else if (selectedAction === 'Complete') {
      completeManuscript(selectedManuscript);
    }
    closeConfirmation();
  };

  const filteredManuscripts = manuscripts.filter(
    (manuscript) => manuscript.status !== 'Rejected' && manuscript.status !== 'Completed'
  );

  return (
    <div className="manuscripts-table" style={{ marginLeft: '250px' }}>
      <h3>Reviewing Manuscripts</h3>
      <table>
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
          {filteredManuscripts.map((manuscript) => (
            <tr key={manuscript.id}>
              <td>{manuscript.id}</td>
              <td>{manuscript.name}</td>
              <td>{manuscript.email}</td>
              <td>{manuscript.institution}</td>
              <td>{manuscript.contactInfo}</td>
              <td>{manuscript.college}</td>
              <td>
                <div className="action-buttons">
                  <button className="action-button" onClick={() => openConfirmation('View', manuscript)}>
                    <FontAwesomeIcon icon={faHandPointer} />
                  </button>
                  <div className="dropdown">
                    <button className="action-button edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <div className="dropdown-content">
                      <button onClick={() => downloadDocument(manuscript)}>Download Document</button>
                      <button onClick={() => uploadDocument(manuscript.id)}>Upload Document</button>
                    </div>
                  </div>
                  <button className="action-button" onClick={() => openConfirmation('Reject', manuscript)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className="action-button" onClick={() => openConfirmation('Complete', manuscript)}>
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


