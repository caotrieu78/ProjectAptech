import React, { useEffect, useState, useMemo } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { PATHS } from "../../constants/paths";
import ConfirmModal from "../../components/ConfirmModal";
import { Dropdown } from "react-bootstrap";
import UserService from "../../services/userService";

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
            console.error("❌ Error loading user info:", error);
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

  const goToHome = () => {
    navigate("/");
  };

  const sidebarWidth = useMemo(
    () => (window.innerWidth >= 768 ? "260px" : "240px"),
    [window.innerWidth]
  );
  const topbarLeft = isSidebarOpen ? sidebarWidth : "0";
  const topbarWidth = isSidebarOpen ? `calc(100% - ${sidebarWidth})` : "100%";

  return (
    <>
      <div
        className="topbar px-4 py-2 d-flex justify-content-between align-items-center shadow-sm"
        style={{
          position: "fixed",
          top: 0,
          left: topbarLeft,
          width: topbarWidth,
          height: "70px",
          zIndex: 1002,
          transition: "all 0.3s ease"
        }}
      >
        {/* Sidebar toggle */}
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="btn btn-outline-secondary"
          >
            <FaBars size={20} />
          </button>
        </div>

        {/* Centered Logo */}
        <h4 className="m-0 logo">Maverick Dresses</h4>

        {/* Avatar + Go to Home + Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn-home"
            onClick={goToHome}
            style={{ display: window.innerWidth >= 768 ? "flex" : "none" }}
          >
            <FaHome size={14} /> Go to Home
          </button>
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
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header>
                {user?.FullName || user?.Username || "Administrator"}
              </Dropdown.Header>
              {window.innerWidth < 768 && (
                <Dropdown.Item onClick={goToHome}>
                  <FaHome size={14} /> Go to Home
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={goToProfile}>Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => setShowModal(true)}
                className="text-danger"
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      {/* Confirm logout modal */}
      <ConfirmModal
        show={showModal}
        title="Confirm Logout"
        message="Are you sure you want to log out of the system?"
        onConfirm={handleLogout}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Topbar;
