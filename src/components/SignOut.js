// SignOut.js
import React from 'react';
import { auth } from '../firebase/firebase'

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log('User signed out');
      // Redirect or show sign out message
    } catch (error) {
      console.error('Error signing out:', error.message);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <div>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default SignOut;
