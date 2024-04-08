// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from './firebase/firebase';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const currentUser = auth.currentUser;

  return (
    
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export default PrivateRoute;
