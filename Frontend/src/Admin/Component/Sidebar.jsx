import React from 'react';
import { NavLink } from 'react-router-dom';
import { PATHS } from "../../constants/paths";
import {
    FaList,
    FaBox,
    FaUsers,
    FaStore,
    FaChartBar,
    FaComments,
    FaThLarge,
    FaTimes
} from 'react-icons/fa';

const Sidebar = ({ onClose }) => (
    <div
        className="bg-primary text-white p-3"
        style={{
            width: '240px',
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
        }}
    >
        {/* Header + Close button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">ADMIN</h4>
            <button onClick={onClose} className="btn btn-sm btn-light text-dark d-md-none">
                <FaTimes />
            </button>
        </div>

        {/* Navigation Links */}
        <nav className="nav flex-column">
            <NavLink
                to={PATHS.CATEGORY_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaList /> Danh mục
            </NavLink>

            <NavLink
                to={PATHS.PRODUCT_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaBox /> Sản phẩm
            </NavLink>

            <NavLink
                to={PATHS.PRODUCT_V2_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaThLarge /> Sản phẩm biến thể
            </NavLink>

            <NavLink
                to={PATHS.USER_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaUsers /> Người dùng
            </NavLink>

            <NavLink
                to={PATHS.BRANCH_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaStore /> Chi nhánh
            </NavLink>

            <NavLink
                to={PATHS.REPORT_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaChartBar /> Thống kê & Báo cáo
            </NavLink>

            <NavLink
                to={PATHS.FEEDBACK_DASHBOARD}
                className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 sidebar-link ${isActive ? 'active' : ''}`
                }
            >
                <FaComments /> Feedback
            </NavLink>
        </nav>
    </div>
);

export default Sidebar;
