import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { PATHS } from "./constants/paths";

import AdminLayout from "./Admin/Layout/AdminLayout";
import CategoryPage from "./Admin/Pages/CategoryPage";
import ProductPage from "./Admin/Pages/ProductPage";
import ProductV2Page from "./Admin/Pages/ProductV2Page";
import BranchPage from "./Admin/Pages/BranchPage";
import UserPage from "./Admin/Pages/UserPage";
import ReportPage from "./Admin/Pages/ReportPage";
import FeedbackPage from "./Admin/Pages/FeedbackPage";

import MainLayout from "./Layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Checkout, OrderConfirmation } from "./pages/Checkout"; // Import cả Checkout và OrderConfirmation
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import GuestRoute from "./routes/GuestRoute";
import OderPage from "./Admin/Pages/OderPage";
import SizePage from "./Admin/Pages/ProductV2Page/Size";
import ColorPage from "./Admin/Pages/ProductV2Page/Color";
import ProfileDashboard from "./Admin/Pages/ProfileDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/Product/ProductDetail";
import Cart from "./pages/Cart";
import Shop from "./pages/Shop";
import Blog from "./pages/Blog";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public layout */}
        <Route element={<MainLayout />}>
          <Route path={PATHS.HOME} element={<Home />} />
          <Route path={PATHS.ABOUT} element={<About />} />
          <Route path={PATHS.CONTACT} element={<Contact />} />
          <Route path={PATHS.BLOG} element={<Blog />} />
          <Route
            path={PATHS.PRODUCTDETAIL + "/:productId"}
            element={<ProductDetail />}
          />
          <Route path={PATHS.CART} element={<Cart />} />
          <Route path={PATHS.SHOP} element={<Shop />} />
          <Route path={PATHS.CHECKOUT} element={<Checkout />} />{" "}
          {/* Route cho Checkout */}
          <Route
            path={PATHS.ORDER_CONFIRMATION}
            element={<OrderConfirmation />}
          />{" "}
          {/* Thêm route cho Order Confirmation */}
          <Route
            path={PATHS.LOGIN}
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path={PATHS.REGISTER}
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
        </Route>

        {/* Admin layout (protected) */}
        <Route
          path={PATHS.DASHBOARD}
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path={PATHS.CATEGORY_DASHBOARD} element={<CategoryPage />} />
          <Route path={PATHS.PRODUCT_DASHBOARD} element={<ProductPage />} />
          <Route
            path={PATHS.PRODUCT_V2_DASHBOARD}
            element={<ProductV2Page />}
          />
          <Route path={PATHS.BRANCH_DASHBOARD} element={<BranchPage />} />
          <Route path={PATHS.USER_DASHBOARD} element={<UserPage />} />
          <Route path={PATHS.REPORT_DASHBOARD} element={<ReportPage />} />
          <Route path={PATHS.FEEDBACK_DASHBOARD} element={<FeedbackPage />} />
          <Route path={PATHS.ORDER_DASHBOARD} element={<OderPage />} />
          <Route path={PATHS.COLOR_DASHBOARD} element={<ColorPage />} />
          <Route path={PATHS.SIZE_DASHBOARD} element={<SizePage />} />
          <Route
            path={PATHS.PROFILE_DASHBOARD}
            element={<ProfileDashboard />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
