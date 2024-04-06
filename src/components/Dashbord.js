// Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css'; // Import CSS file for Dashboard styles
import logo from '../assets/img/logo.png';
import { firestore } from '../firebase/firebase';
import SubmittedManuscriptsTable from './SubmittedManuscriptsTable';
import DashboardStats from './DashboardStats';






const Dashboard = ({ children }) => {
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

      {/* Main Content */}
      <div className="main-content">
        <h2>Dashboard</h2>
        <DashboardStats />
        <SubmittedManuscriptsTable manuscripts={manuscripts} />
        {children}
      </div>
    </div>
  );
};

export default Dashboard;
