import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase';

const PrivateRoute = ({ component: Component }) => {
  const currentUser = auth.currentUser;

  return currentUser ? <Component /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
