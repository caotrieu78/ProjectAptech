import React, { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { PATHS } from '../../constants/paths';
import ConfirmModal from '../../components/ConfirmModal';
import { Dropdown } from 'react-bootstrap';
import UserService from '../../services/userService'; // ✅ import service để gọi API

const logoStyle = {
    animation: 'dropDownFade 0.8s ease',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0d6efd',
};

const Topbar = ({ onToggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const localUser = localStorage.getItem('user');
            if (localUser) {
                const parsed = JSON.parse(localUser);
                if (parsed?.UserID) {
                    try {
                        const fullUser = await UserService.getById(parsed.UserID);
                        setUser(fullUser);
                    } catch (error) {
                        console.error('❌ Lỗi tải thông tin người dùng:', error);
                        setUser(parsed); // fallback nếu gọi API lỗi
                    }
                } else {
                    setUser(parsed);
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate(PATHS.LOGIN);
        } catch (err) {
            console.error('❌ Logout failed:', err);
        }
    };

    const goToProfile = () => {
        navigate(PATHS.PROFILE_DASHBOARD || '/profile');
    };

    return (
        <>
            {/* CSS animation */}
            <style>{`
                @keyframes dropDownFade {
                    0% {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `}</style>

            <div
                className="bg-white px-3 py-2 d-flex justify-content-between align-items-center shadow-sm"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: isSidebarOpen ? '240px' : '0',
                    width: isSidebarOpen ? 'calc(100% - 240px)' : '100%',
                    height: '64px',
                    zIndex: 1000,
                    transition: 'all 0.3s ease',
                }}
            >
                {/* Sidebar toggle + search */}
                <div className="d-flex align-items-center gap-3">
                    <button onClick={onToggleSidebar} className="btn btn-outline-secondary">
                        <FaBars />
                    </button>
                    <input
                        className="form-control"
                        style={{ maxWidth: '250px' }}
                        placeholder="Tìm kiếm..."
                    />
                </div>

                {/* Centered Logo */}
                <h4 className="m-0 d-none d-md-block" style={logoStyle}>
                    Maverick Dresses
                </h4>

                {/* Avatar + Dropdown */}
                <div className="d-flex align-items-center gap-2">
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="link"
                            id="user-dropdown"
                            className="p-0 border-0"
                            style={{ boxShadow: 'none' }}
                        >
                            <img
                                src={user?.Avatar || '/images/admin-avatar.png'}
                                alt="avatar"
                                className="rounded-circle"
                                style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>
                                {user?.FullName || user?.Username || 'Quản trị viên'}
                            </Dropdown.Header>
                            <Dropdown.Item onClick={goToProfile}>Thông tin cá nhân</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => setShowModal(true)} className="text-danger">
                                Đăng xuất
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            {/* Modal xác nhận đăng xuất */}
            <ConfirmModal
                show={showModal}
                title="Xác nhận đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
                onConfirm={handleLogout}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};
export default Topbar;
