import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase/firebase';

const InviteReviewerPage = ({ match }) => {
  const [reviewers, setReviewers] = useState([]);

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const manuscriptId = match.params.manuscriptId;
        console.log('Manuscript ID:', manuscriptId); // Log the manuscriptId

        const reviewersRef = firestore.collection('Reviewers').where('manuscriptId', '==', manuscriptId);
        const querySnapshot = await reviewersRef.get();

        if (!querySnapshot.empty) {
          const fetchedReviewers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setReviewers(fetchedReviewers);
        } else {
          console.log('No reviewers found for the manuscript ID:', manuscriptId);
        }
      } catch (error) {
        console.error('Error fetching reviewers:', error);
      }
    };

    fetchReviewers();
  }, [match.params.manuscriptId]);

  return (
    <div>
      <h1>Invite Reviewer Dashboard</h1>
      <h2>Manuscript ID: {match.params.manuscriptId}</h2>
      <div>
        <h3>Reviewers:</h3>
        <ul>
          {reviewers.map((reviewer) => (
            <li key={reviewer.id}>
              <strong>Name:</strong> {reviewer.name}, <strong>Email:</strong> {reviewer.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InviteReviewerPage;
