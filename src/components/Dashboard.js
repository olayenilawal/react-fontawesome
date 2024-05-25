// Dashboard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css'; // Import CSS file for Dashboard styles
import logo from '../assets/img/logo.png';
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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? '' : 'closed'}`}>

        {!isOpen && (
          <span>
            <FontAwesomeIcon icon={faBars} className="toggle-arrow" onClick={toggleSidebar} />
          </span>
        )}
        {isOpen && (
          <>

            <FontAwesomeIcon icon={faTimes} className="toggle-arrow" onClick={toggleSidebar} />
          </>
        )}
        <div className="header">
          <img src={logo} alt="Logo" className="dashboard-logo" /> 
          <h4>
             Manuscript
          </h4>
        </div>
        <ul>
          <li>
            <Link to="/submit-manuscript">
              <FontAwesomeIcon icon={faPen} className="sidebar-icon" />
              <span className="sidebar-text">Submit Manuscript</span>
            </Link>
          </li>
          <li>
            <Link to="/view-manuscripts">
              <FontAwesomeIcon icon={faList} className="sidebar-icon" />
              <span className="sidebar-text">View Manuscripts</span>
            </Link>
          </li>
          <li>
            <Link to="/manage-reviewers">
              <FontAwesomeIcon icon={faUsers} className="sidebar-icon" />
              <span className="sidebar-text">Manage Reviewers</span>
            </Link>
          </li>
          <li>
            <Link to="/manage-users">
              <FontAwesomeIcon icon={faUser} className="sidebar-icon" />
              <span className="sidebar-text">Manage Users</span>
            </Link>
          </li>
        </ul>
      </div>


    </div>
  );
};

export default Dashboard;
