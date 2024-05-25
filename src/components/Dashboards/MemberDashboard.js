import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewingManuscriptsTable from '../MembersTable';
import { firestore } from '../../firebase/firebase';
import logo from '../../assets/img/logo.png';
import '../../assets/css/style.css';

const ReviewerDashboard = () => {
  const [manuscripts, setManuscripts] = useState([]);

  useEffect(() => {
    const fetchManuscripts = async () => {
      try {
        const snapshot = await firestore.collection('SubmittedManuscripts').get();
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setManuscripts(data);
      } catch (error) {
        console.error('Error fetching manuscripts:', error);
      }
    };

    fetchManuscripts();
  }, []);

  const handleAction = async (manuscriptId, actionType) => {
    try {
      switch (actionType) {
        case 'View':
          // Fetch manuscript details from Firestore based on ID
          const docRef = firestore.collection('SubmittedManuscripts').doc(manuscriptId);
          const doc = await docRef.get();
          if (doc.exists) {
            const manuscriptData = doc.data();
            console.log('Viewing manuscript:', manuscriptData);
            // Implement logic for viewing manuscript (e.g., open modal)
          } else {
            console.log('No such manuscript document!');
          }
          break;

        case 'Edit':
          // Implement logic for editing manuscript
          console.log(`Editing manuscript with ID: ${manuscriptId}`);
          break;

        case 'Delete':
          // Implement logic for deleting manuscript
          console.log(`Deleting manuscript with ID: ${manuscriptId}`);
          break;

        default:
          console.log('Invalid action type:', actionType);
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  return (
<div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">



        <ul>
          <li className='header'><img src={logo} alt="Logo" className="dashboard-logo" />
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
      {/* <h1>Reviewer Dashboard</h1> */}
      <ReviewingManuscriptsTable manuscripts={manuscripts} handleAction={handleAction} />
    </div>
  );
};

export default ReviewerDashboard;
