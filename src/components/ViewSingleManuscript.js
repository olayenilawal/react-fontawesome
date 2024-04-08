import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase/firebase';

const ViewManuscript = () => {
  const { manuscriptId } = useParams(); // Access the manuscriptId parameter from the URL
  const [manuscript, setManuscript] = useState(null);

  useEffect(() => {
    const fetchManuscript = async () => {
      try {
        const manuscriptRef = firestore.collection('SubmittedManuscripts').doc(manuscriptId);
        const doc = await manuscriptRef.get();

        if (doc.exists) {
          const data = doc.data();
          setManuscript(data);
        } else {
          console.log('Manuscript not found');
        }
      } catch (error) {
        console.error('Error fetching manuscript:', error);
      }
    };

    fetchManuscript(); // Fetch the manuscript details when the component mounts

    return () => {
      // Clean up if needed
    };
  }, [manuscriptId]); // Re-fetch manuscript details when manuscriptId changes

  if (!manuscript) {
    return <div>Loading...</div>; // Show loading indicator while fetching manuscript
  }

  return (
    <div>
      <h1>View Manuscript</h1>
      <p>ID: {manuscript.id}</p>
      <p>Name: {manuscript.name}</p>
      <p>Email: {manuscript.email}</p>
      <p>Institution: {manuscript.institution}</p>
      <p>Contact Information: {manuscript.contactInformation}</p>
      <p>College: {manuscript.college}</p>
      {/* Render other manuscript details as needed */}
    </div>
  );
};

export default ViewManuscript;
