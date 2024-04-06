import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/firebase';
import '../assets/css/DashboardStats.css';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    submitted: 0,
    reviewed: 0,
    underReview: 0,
    rejected: 0,
    processed: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get the total number of submitted manuscripts
        const submittedDocs = await firestore.collection('SubmittedManuscripts').get();
        const submittedCount = submittedDocs.size;

        // Update the stats state with the total number of submitted manuscripts
        setStats((prevStats) => ({
          ...prevStats,
          submitted: submittedCount,
          total: submittedCount, // Set total to the number of submitted manuscripts
        }));
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []); // Fetch stats on component mount

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stat">
        <h3>Review For Proposal</h3>
        <p>{stats.submitted}</p>
      </div>
      <div className="dashboard-stat">
        <h3>Reviewer Invited but not responded</h3>
        <p>{stats.reviewed}</p>
      </div>
      <div className="dashboard-stat">
        <h3>Reviewer reviewed and returned</h3>
        <p>{stats.underReview}</p>
      </div>
      <div className="dashboard-stat">
        <h3>Correction Needed</h3>
        <p>{stats.rejected}</p>
      </div>
      <div className="dashboard-stat">
        <h3>Manuscripts revised</h3>
        <p>{stats.processed}</p>
      </div>
      <div className="dashboard-stat">
        <h3>Total Number of Manuscripts</h3>
        <p>{stats.total}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
