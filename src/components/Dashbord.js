// Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css'; // Import CSS file for Dashboard styles
import logo from '../assets/img/logo.png';
import { firestore } from '../firebase/firebase';
import SubmittedManuscriptsTable from './SubmittedManuscriptsTable';
import DashboardStats from './DashboardStats';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faPen, faList, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';



const Dashboard = ({ children }) => {
  const [manuscripts, setManuscripts] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.width = isOpen ? '0' : '250px';
  };

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
    <div className={`dashboard-container ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
        <div className="header">
        <div className="toggle-arrow" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </div>
          
          <h4 > <img src={logo} alt="Logo" className="dashboard-logo" />Manuscript</h4>
          
        </div>
        <ul>
          <li>
            <Link to="/submit-manuscript">
              <FontAwesomeIcon icon={faPen} className="sidebar-icon" />
              Submit Manuscript
            </Link>
          </li>
          <li>
            <Link to="/view-manuscripts">
              <FontAwesomeIcon icon={faList} className="sidebar-icon" />
              View Manuscripts
            </Link>
          </li>
          <li>
            <Link to="/manage-reviewers">
              <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
              Manage Reviewers
            </Link>
          </li>
          <li>
            <Link to="/manage-users">
              <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
              Manage Users
            </Link>
          </li>
        </ul>
        {/* Optional: Include a Logout button or additional content */}
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