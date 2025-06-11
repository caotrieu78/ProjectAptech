import React from 'react';
import { FaBars } from 'react-icons/fa';

const Topbar = ({ onToggleSidebar }) => (
    <div className="bg-white p-3 d-flex justify-content-between align-items-center shadow-sm">
        <div className="d-flex align-items-center gap-3">
            {/* Nút đóng/mở sidebar */}
            <button onClick={onToggleSidebar} className="btn btn-outline-secondary">
                <FaBars />
            </button>
            <input
                className="form-control"
                style={{ maxWidth: '250px' }}
                placeholder="Tìm kiếm..."
            />
        </div>

        <div className="d-flex align-items-center">
            <span className="me-3">Hi, Admin</span>
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRymxMvshP0oE-rFxLaRqkQzq6P6hFLwL6IAw&s"
                alt="avatar"
                className="rounded-circle"
                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
            />
        </div>
    </div>
);

export default Topbar;
