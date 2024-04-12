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

        // Get the number of manuscripts in the ReviewingManuscripts collection (invited but not responded)
        const reviewingDocs = await firestore.collection('ReviewingManuscripts').get();
        const reviewingCount = reviewingDocs.size;

        // Calculate the number of manuscripts under "Review For Proposal"
        const reviewForProposalCount = submittedCount - reviewingCount;

        // Update the stats state with the fetched counts
        setStats((prevStats) => ({
          ...prevStats,
          submitted: submittedCount,
          reviewed: reviewingCount,
          underReview: prevStats.underReview, // You need to fetch this value from another source
          rejected: prevStats.rejected, // You need to fetch this value from another source
          processed: prevStats.processed, // You need to fetch this value from another source
          total: submittedCount, // Set total to the number of submitted manuscripts
          reviewForProposal: reviewForProposalCount, // Set the count of manuscripts under "Review For Proposal"
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
        <p>{stats.reviewForProposal}</p>
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
