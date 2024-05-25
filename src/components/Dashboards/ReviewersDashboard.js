import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewingManuscriptsTable from '../ReviewingManuscriptsTable';
import { firestore } from '../../firebase/firebase';
import logo from '../../assets/img/logo.png';
import '../../assets/css/style.css';

const ReviewerDashboard = () => {
  const [manuscripts, setManuscripts] = useState([]);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        const snapshot = await firestore.collection('ReviewingManuscripts').get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setManuscripts(data);
      } catch (error) {
        console.error('Error fetching manuscripts:', error);
      }
    };

    fetchManuscripts();
  }, []);

  const handleView = async (manuscriptId) => {
    try {
      const docRef = firestore.collection('ReviewingManuscripts').doc(manuscriptId);
      const doc = await docRef.get();
      if (doc.exists) {
        const manuscriptData = doc.data();
        // Open the manuscript document in a new tab (assuming fullPagesUrl is the document URL)
        window.open(manuscriptData.fullPagesUrl, '_blank');
      } else {
        console.log('No such manuscript document!');
      }
    } catch (error) {
      console.error('Error viewing manuscript:', error);
    }
  };

  const handleEdit = async (manuscriptId) => {
    // Implement logic to upload and link a document from local storage
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.docx,.pdf'; // Specify accepted file types
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const storageRef = firestore.storage().ref();
          const fileRef = storageRef.child(`${manuscriptId}/${file.name}`);
          await fileRef.put(file);
          const downloadUrl = await fileRef.getDownloadURL();

          // Update manuscript with the uploaded document's URL
          const docRef = firestore.collection('ReviewingManuscripts').doc(manuscriptId);
          await docRef.update({ fullPagesUrl: downloadUrl });
          console.log(`Document uploaded and linked to manuscript ID: ${manuscriptId}`);
        } catch (error) {
          console.error('Error uploading document:', error);
        }
      }
    };
    fileInput.click(); // Trigger file input dialog
  };

  const handleReject = async (manuscriptId) => {
    try {
      const reviewingRef = firestore.collection('ReviewingManuscripts').doc(manuscriptId);
      const manuscript = (await reviewingRef.get()).data();

      const rejectedRef = firestore.collection('RejectedManuscripts').doc(manuscriptId);
      await rejectedRef.set({ ...manuscript, status: 'Rejected' });

      await reviewingRef.delete();
      console.log(`Manuscript ID ${manuscriptId} rejected and moved to RejectedManuscripts.`);
    } catch (error) {
      console.error('Error rejecting manuscript:', error);
    }
  };

  const handleComplete = async (manuscriptId) => {
    try {
      const reviewingRef = firestore.collection('ReviewingManuscripts').doc(manuscriptId);
      const manuscript = (await reviewingRef.get()).data();

      const submittedRef = firestore.collection('SubmittedManuscripts').doc(manuscriptId);
      const updateData = { status: 'Completed' };
      if (manuscript.fullPagesUrl) {
        updateData.fullPagesUrl = manuscript.fullPagesUrl;
      }
      await submittedRef.update(updateData);

      await reviewingRef.delete();
      console.log(`Manuscript ID ${manuscriptId} marked as completed.`);
    } catch (error) {
      console.error('Error completing manuscript:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li className='header'>
            <img src={logo} alt="Logo" className="dashboard-logo" />
            <span>Manuscript Management System</span>
          </li>
          <hr />
          <li>
            <Link to="/submit-manuscript">Submit Manuscript</Link>
          </li>
          <li>
            <Link to="/view-manuscripts">View Manuscripts</Link>
          </li>
          <li>
            <Link to="/manage-reviewers">Manage Reviewers</Link>
          </li>
          <li>
            <Link to="/manage-users">Manage Users</Link>
          </li>
          {/* Add more sidebar links as needed */}
        </ul>
      </div>
      {/* Render ReviewingManuscriptsTable with action handlers */}
      <ReviewingManuscriptsTable
        manuscripts={manuscripts}
        handleView={handleView}
        handleEdit={handleEdit}
        handleReject={handleReject}
        handleComplete={handleComplete}
      />
    </div>
  );
};

export default ReviewerDashboard;
