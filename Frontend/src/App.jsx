import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './constants/paths';

import CategoryPage from './Admin/Pages/CategoryPage';
import ProductPage from './Admin/Pages/ProductPage';
import ProductV2Page from './Admin/Pages/ProductV2Page';
import BranchPage from './Admin/Pages/BranchPage';
import UserPage from './Admin/Pages/UserPage';
import ReportPage from './Admin/Pages/ReportPage';
import FeedbackPage from './Admin/Pages/FeedbackPage';

import AdminLayout from './Admin/Layout/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect gốc về category */}
        <Route path="/" element={<Navigate to={PATHS.CATEGORY_DASHBOARD} replace />} />

        {/* Admin Layout */}
        <Route path={PATHS.DASHBOARD} element={<AdminLayout />}>
          <Route path={PATHS.CATEGORY_DASHBOARD} element={<CategoryPage />} />
          <Route path={PATHS.PRODUCT_DASHBOARD} element={<ProductPage />} />
          <Route path={PATHS.PRODUCT_V2_DASHBOARD} element={<ProductV2Page />} />
          <Route path={PATHS.BRANCH_DASHBOARD} element={<BranchPage />} />
          <Route path={PATHS.USER_DASHBOARD} element={<UserPage />} />
          <Route path={PATHS.REPORT_DASHBOARD} element={<ReportPage />} />
          <Route path={PATHS.FEEDBACK_DASHBOARD} element={<FeedbackPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
