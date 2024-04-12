// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashbord';
import SubmitManuscript from './components/SubmitManuscript';
import ViewManuscripts from './components/ViewManuscripts';
import ManageReviewers from './components/ManageReviewers';
import ManageUsers from './components/ManageUsers';
import ManuscriptForm from './components/ManuscriptsForm';
import ViewSingleManuscript from './components/ViewSingleManuscript';
import InviteReviewerPage from './components/InviteReviewerPage';
 // Import InviteReviewerPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="submit-manuscript" element={<SubmitManuscript />} />
          <Route path="view-manuscripts" element={<ViewManuscripts />} />
          <Route path="manage-reviewers" element={<ManageReviewers />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>
        <Route path="/form" element={<ManuscriptForm />} />
        {/* Route for InviteReviewerPage with dynamic manuscriptId parameter */}
        <Route path="/manage-reviewers/:manuscriptId" element={<InviteReviewerPage />} /> {/* Route for InviteReviewerPage */}

      </Routes>
    </Router>
  );
};

export default App;
