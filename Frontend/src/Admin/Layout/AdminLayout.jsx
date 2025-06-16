import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Component/Sidebar';
import Topbar from '../Component/Topbar';
import '../assets/css/style.css';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div>
            <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

            {isSidebarOpen && (
                <Sidebar onClose={toggleSidebar} />
            )}

            <div
                style={{
                    marginTop: '64px',
                    marginLeft: isSidebarOpen ? '240px' : '0',
                    transition: 'all 0.3s ease',
                    padding: '1rem',
                    backgroundColor: '#f8f9fa',
                    minHeight: 'calc(100vh - 64px)'
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
