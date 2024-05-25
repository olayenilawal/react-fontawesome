import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import SubmitManuscript from './components/SubmitManuscript';
import ViewManuscripts from './components/ViewManuscripts';
import ManageReviewers from './components/ManageReviewers';
import ManageUsers from './components/ManageUsers';
import ManuscriptForm from './components/ManuscriptsForm';
import ViewSingleManuscript from './components/ViewSingleManuscript';
import InviteReviewerPage from './components/InviteReviewerPage';
import ReviewerDashboard from './components/Dashboards/ReviewersDashboard';
import MemberDashboard from './components/Dashboards/MemberDashboard';
import ManuscriptStatusCheck from './components/ManuscriptStatusCheck';
import MembersList from './components/MemberList';
import PrivateRoute from './PrivateRoutes'; // Import PrivateRoute component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/review" element={<ReviewerDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/status" element={<ManuscriptStatusCheck />} />
        <Route path="/dashboard/*" element={<PrivateRoute component={Dashboard} />}>
          <Route path="submit-manuscript" element={<SubmitManuscript />} />
          <Route path="view-manuscripts" element={<ViewManuscripts />} />
          <Route path="manage-reviewers" element={<ManageReviewers />} />
          <Route path="manage-members" element={<ManageReviewers />} />
          <Route path="manage-users" element={<ManageUsers />} />
        </Route>
        <Route path="/form" element={<PrivateRoute component={ManuscriptForm} />} />
        <Route path="/manage-reviewers/:manuscriptId" element={<PrivateRoute component={InviteReviewerPage} />} />
        <Route path="/manage-members/:manuscriptId" element={<PrivateRoute component={MembersList} />} />
      </Routes>
    </Router>
  );
};

export default App;
