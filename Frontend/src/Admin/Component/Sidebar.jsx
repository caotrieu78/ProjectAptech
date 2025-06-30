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

const Sidebar = ({ onClose }) => (
    <div className="sidebar-container">
        <div className="sidebar text-white d-flex flex-column">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h2 className="h5 mb-0 fw-bold text-white">ADMIN MAVERICK DRESSES</h2>
                <button
                    onClick={onClose}
                    className="btn btn-close-sidebar d-md-none"
                    title="Close"
                >
                    <FaTimes size={18} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="nav flex-column p-3 flex-grow-1 overflow-auto">
                <NavLink
                    to={PATHS.CATEGORY_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Danh mục"
                >
                    <FaList size={20} /> Danh mục
                </NavLink>

                <NavLink
                    to={PATHS.PRODUCT_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Sản phẩm"
                >
                    <FaBox size={20} /> Sản phẩm
                </NavLink>

                <NavLink
                    to={PATHS.PRODUCT_V2_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Sản phẩm biến thể"
                >
                    <FaThLarge size={20} /> Sản phẩm biến thể
                </NavLink>

                <NavLink
                    to={PATHS.ORDER_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Đơn hàng"
                >
                    <FaClipboardList size={20} /> Đơn hàng
                </NavLink>

                <NavLink
                    to={PATHS.USER_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Người dùng"
                >
                    <FaUsers size={20} /> Người dùng
                </NavLink>

                <NavLink
                    to={PATHS.BRANCH_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Chi nhánh"
                >
                    <FaStore size={20} /> Chi nhánh
                </NavLink>

                <NavLink
                    to={PATHS.FEEDBACK_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Feedback"
                >
                    <FaComments size={20} /> Feedback
                </NavLink>

                <NavLink
                    to={PATHS.REPORT_DASHBOARD}
                    className={({ isActive }) =>
                        `nav-link d-flex align-items-center gap-3 py-2 px-3 mb-2 rounded-3 text-white ${isActive ? "active" : ""
                        }`
                    }
                    title="Thống kê & Báo cáo"
                >
                    <FaChartBar size={20} /> Thống kê & Báo cáo
                </NavLink>
            </nav>
        </div>

        <style>{`
            .sidebar-container {
                position: relative;
                width: 100%;
            }

            .sidebar {
                width: 250px;
                height: 100vh;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 1000;
                background: linear-gradient(135deg, #00c4ff 0%, #0066cc 50%, #003366 100%);
                background-size: 200% 200%;
                animation: gradientFlow 12s ease infinite;
                backdrop-filter: blur(8px);
                box-shadow: 3px 0 15px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @keyframes gradientFlow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            .sidebar .border-bottom {
                border-color: rgba(255, 255, 255, 0.3) !important;
            }

            .sidebar .h5 {
                letter-spacing: 1px;
                text-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
                font-size: 1.2rem;
                background: linear-gradient(90deg, #fff, #b3e5fc);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }

            .sidebar .nav-link {
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(6px);
                border-radius: 10px;
                font-size: 0.95rem;
                font-weight: 500;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .sidebar .nav-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                transition: left 0.4s ease;
            }

            .sidebar .nav-link:hover::before {
                left: 100%;
            }

            .sidebar .nav-link:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: scale(1.03);
                box-shadow: 0 0 12px rgba(0, 196, 255, 0.4);
                color: #fff;
            }

            .sidebar .nav-link.active {
                background: #002d72;
                color: #fff;
                font-weight: 600;
                box-shadow: 0 0 15px rgba(0, 196, 255, 0.6);
            }

            .sidebar .nav-link .gap-3 {
                gap: 12px;
            }

            .sidebar .btn-close-sidebar {
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .sidebar .btn-close-sidebar:hover {
                background: #002d72;
                border-color: #fff;
                transform: scale(1.1);
                box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }

            .sidebar .overflow-auto::-webkit-scrollbar {
                width: 8px;
            }

            .sidebar .overflow-auto::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.5);
                border-radius: 4px;
                box-shadow: 0 0 5px rgba(0, 196, 255, 0.5);
            }

            .sidebar .overflow-auto::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
            }

            /* Push main content */
            .main-content {
                margin-left: 250px;
                transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            @media (max-width: 767.98px) {
                .sidebar {
                    transform: translateX(-100%);
                }
                .sidebar.active {
                    transform: translateX(0);
                }
                .main-content {
                    margin-left: 0;
                }
            }
        `}</style>
    </div>
);

// Assuming this is part of a larger layout, wrap your main content with this class
// Example usage in parent component:
// <div>
//     <Sidebar />
//     <div className="main-content">
//         {/* Your main content here */}
//     </div>
// </div>

export default Sidebar;
