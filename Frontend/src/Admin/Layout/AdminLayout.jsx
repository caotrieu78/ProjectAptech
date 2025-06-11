import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Component/Sidebar';
import Topbar from '../Component/Topbar';
import '../assets/css/style.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {isSidebarOpen && <Sidebar onClose={toggleSidebar} />}

            <div
                className="d-flex flex-column"
                style={{
                    marginLeft: isSidebarOpen ? '240px' : '0',
                    transition: 'margin-left 0.3s ease',
                }}
            >
                <Topbar onToggleSidebar={toggleSidebar} />
                <div className="p-4 bg-light" style={{ minHeight: '100vh', paddingTop: '64px' }}>
                    <Outlet />
                </div>

            </div>
        </div>
    );
};

export default AdminLayout;
