import React from "react";
import { NavLink } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import {
  FaList,
  FaBox,
  FaUsers,
  FaStore,
  FaChartBar,
  FaComments,
  FaThLarge,
  FaTimes,
  FaClipboardList
} from "react-icons/fa";

const Sidebar = ({ onClose, isSidebarOpen }) => (
  <div className="sidebar-container">
    <div
      className="sidebar text-white d-flex flex-column"
      style={{
        width: isSidebarOpen
          ? window.innerWidth >= 768
            ? "260px"
            : "240px"
          : "0",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        background: isSidebarOpen
          ? "linear-gradient(135deg, #2a5298 0%, #1e3a8a 100%)"
          : "transparent",
        boxShadow: isSidebarOpen ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "none",
        borderRight: isSidebarOpen
          ? "1px solid rgba(255, 255, 255, 0.1)"
          : "none",
        transition: "all 0.3s ease-in-out",
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        visibility: isSidebarOpen ? "visible" : "hidden",
        overflow: "hidden"
      }}
      onClick={(e) => {
        if (isSidebarOpen && window.innerWidth < 768) {
          onClose();
        }
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center p-4 border-bottom"
        style={{ display: isSidebarOpen ? "flex" : "none" }}
      >
        <h2 className="h5 mb-0 fw-bold text-white">MAVERICK DRESSES</h2>
        <button
          onClick={(e) => {
            onClose();
            e.stopPropagation();
          }}
          className="btn btn-close-sidebar d-md-none"
          title="Close"
          style={{ display: isSidebarOpen ? "flex" : "none" }}
        >
          <FaTimes size={18} />
        </button>
      </div>

      <nav
        className="nav flex-column p-3 flex-grow-1 overflow-auto"
        style={{ display: isSidebarOpen ? "block" : "none" }}
      >
        <NavLink
          to={PATHS.CATEGORY_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Categories"
        >
          <FaList size={20} /> <span>Categories</span>
        </NavLink>
        <NavLink
          to={PATHS.PRODUCT_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Products"
        >
          <FaBox size={20} /> <span>Products</span>
        </NavLink>
        <NavLink
          to={PATHS.PRODUCT_V2_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Product Variants"
        >
          <FaThLarge size={20} /> <span>Product Variants</span>
        </NavLink>
        <NavLink
          to={PATHS.ORDER_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Orders"
        >
          <FaClipboardList size={20} /> <span>Orders</span>
        </NavLink>
        <NavLink
          to={PATHS.USER_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Users"
        >
          <FaUsers size={20} /> <span>Users</span>
        </NavLink>
        <NavLink
          to={PATHS.BRANCH_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Branches"
        >
          <FaStore size={20} /> <span>Branches</span>
        </NavLink>
        <NavLink
          to={PATHS.FEEDBACK_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Feedback"
        >
          <FaComments size={20} /> <span>Feedback</span>
        </NavLink>
        <NavLink
          to={PATHS.REPORT_DASHBOARD}
          className={({ isActive }) =>
            `nav-link d-flex align-items-center gap-3 py-2.5 px-4 mb-2 rounded-lg text-white ${
              isActive ? "active" : ""
            }`
          }
          title="Statistics & Reports"
        >
          <FaChartBar size={20} /> <span>Statistics & Reports</span>
        </NavLink>
      </nav>
    </div>

    {isSidebarOpen && window.innerWidth < 768 && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
          cursor: "pointer"
        }}
        onClick={onClose}
      />
    )}
  </div>
);

export default Sidebar;
