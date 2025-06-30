import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { PATHS } from "../../constants/paths";
import ConfirmModal from "../../components/ConfirmModal";
import { Dropdown } from "react-bootstrap";
import UserService from "../../services/userService";

const logoStyle = {
    animation: "dropDownFade 0.8s ease",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#00c4ff",
    textShadow: "0 0 5px rgba(0, 196, 255, 0.5)"
};

const Topbar = ({ onToggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const localUser = localStorage.getItem("user");
            if (localUser) {
                const parsed = JSON.parse(localUser);
                if (parsed?.UserID) {
                    try {
                        const fullUser = await UserService.getById(parsed.UserID);
                        setUser(fullUser);
                    } catch (error) {
                        console.error("❌ Lỗi tải thông tin người dùng:", error);
                        setUser(parsed);
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
            console.error("❌ Logout failed:", err);
        }
    };

    const goToProfile = () => {
        navigate(PATHS.PROFILE_DASHBOARD || "/profile");
    };

    return (
        <>
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

                .topbar {
                    background: linear-gradient(135deg, #003366 0%, #0066cc 50%, #00c4ff 100%);
                    backdrop-filter: blur(8px);
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                .topbar .btn-outline-secondary {
                    color: #00c4ff;
                    border-color: #00c4ff;
                }

                .topbar .btn-outline-secondary:hover {
                    background-color: #00c4ff;
                    color: #fff;
                    border-color: #00c4ff;
                }

                .topbar .form-control {
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: #fff;
                    backdrop-filter: blur(6px);
                }

                .topbar .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .topbar .dropdown-toggle {
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                    padding: 2px;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(6px);
                }

                .topbar .dropdown-toggle:hover {
                    background: rgba(255, 255, 255, 0.25);
                    box-shadow: 0 0 8px rgba(0, 196, 255, 0.4);
                }

                .topbar .dropdown-menu {
                    background: rgba(0, 51, 102, 0.9);
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }

                .topbar .dropdown-item {
                    color: #00c4ff;
                }

                .topbar .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }

                .topbar .dropdown-item.text-danger {
                    color: #ff4d4d;
                }

                .topbar .dropdown-item.text-danger:hover {
                    color: #ff9999;
                }
            `}</style>

            <div
                className="topbar px-3 py-2 d-flex justify-content-between align-items-center shadow-sm"
                style={{
                    position: "fixed",
                    top: 0,
                    left: isSidebarOpen ? "250px" : "0",
                    width: isSidebarOpen ? "calc(100% - 250px)" : "100%",
                    height: "64px",
                    zIndex: 1001,
                    transition: "all 0.3s ease"
                }}
            >
                {/* Sidebar toggle + search */}
                <div className="d-flex align-items-center gap-3">
                    <button
                        onClick={onToggleSidebar}
                        className="btn btn-outline-secondary"
                    >
                        <FaBars />
                    </button>
                    <input
                        className="form-control"
                        style={{ maxWidth: "250px" }}
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
                        >
                            <img
                                src={user?.Avatar || "/images/admin-avatar.png"}
                                alt="avatar"
                                className="rounded-circle"
                                style={{ width: "36px", height: "36px", objectFit: "cover" }}
                            />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>
                                {user?.FullName || user?.Username || "Quản trị viên"}
                            </Dropdown.Header>
                            <Dropdown.Item onClick={goToProfile}>
                                Thông tin cá nhân
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={() => setShowModal(true)}
                                className="text-danger"
                            >
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
