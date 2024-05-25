import React, { useState } from 'react';
import { firestore } from '../firebase/firebase';
import '../assets/css/ManuscriptStatusCheck.css'; // Import CSS styles

const ManuscriptStatusCheck = () => {
  const [manuscriptId, setManuscriptId] = useState('');
  const [status, setStatus] = useState('');

  const checkManuscriptStatus = async () => {
    try {
      const docRef = firestore.collection('ReviewingManuscripts').doc(manuscriptId);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        setStatus('Under Review');
      } else {
        setStatus('Pending');
      }
    } catch (error) {
      console.error('Error checking manuscript status:', error);
      setStatus('Error');
    }
  };

  return (
    <div className="container">
      <h2>Manuscript Status Check</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Manuscript ID"
          value={manuscriptId}
          onChange={(e) => setManuscriptId(e.target.value)}
        />
      </div>
      <div className="button-container">
        <button onClick={checkManuscriptStatus}>Check Status</button>
      </div>
      {status && (
        <div className="status-container">
          <h3>Status: {status}</h3>
        </div>
      )}
    </div>
  );
};

export default ManuscriptStatusCheck;
