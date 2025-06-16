import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from './constants/paths';

import AdminLayout from './Admin/Layout/AdminLayout';
import CategoryPage from './Admin/Pages/CategoryPage';
import ProductPage from './Admin/Pages/ProductPage';
import ProductV2Page from './Admin/Pages/ProductV2Page';
import BranchPage from './Admin/Pages/BranchPage';
import UserPage from './Admin/Pages/UserPage';
import ReportPage from './Admin/Pages/ReportPage';
import FeedbackPage from './Admin/Pages/FeedbackPage';

import MainLayout from './Layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
import GuestRoute from './routes/GuestRoute';
import OderPage from './Admin/Pages/OderPage';
import SizePage from './Admin/Pages/ProductV2Page/Size';
import ColorPage from './Admin/Pages/ProductV2Page/Color';
import ProfileDashboard from './Admin/Pages/ProfileDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public layout */}
        <Route element={<MainLayout />}>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.LOGIN} element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path={PATHS.REGISTER} element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } />
        </Route>

        {/* Admin layout (protected) */}
        <Route path={PATHS.DASHBOARD} element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route path={PATHS.CATEGORY_DASHBOARD} element={<CategoryPage />} />
          <Route path={PATHS.PRODUCT_DASHBOARD} element={<ProductPage />} />
          <Route path={PATHS.PRODUCT_V2_DASHBOARD} element={<ProductV2Page />} />
          <Route path={PATHS.BRANCH_DASHBOARD} element={<BranchPage />} />
          <Route path={PATHS.USER_DASHBOARD} element={<UserPage />} />
          <Route path={PATHS.REPORT_DASHBOARD} element={<ReportPage />} />
          <Route path={PATHS.FEEDBACK_DASHBOARD} element={<FeedbackPage />} />
          <Route path={PATHS.ORDER_DASHBOARD} element={<OderPage />} />
          <Route path={PATHS.COLOR_DASHBOARD} element={<ColorPage />} />
          <Route path={PATHS.SIZE_DASHBOARD} element={<SizePage />} />
          <Route path={PATHS.PROFILE_DASHBOARD} element={<ProfileDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
      </Routes>
    </Router>
  );
}

export default App;