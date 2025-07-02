import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Component/Sidebar";
import Topbar from "../Component/Topbar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định mở

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768); // Cập nhật ngay khi resize
    };
    handleResize(); // Gọi ngay khi mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Cho phép toggle thủ công
  };

  const sidebarWidth = window.innerWidth >= 768 ? "260px" : "240px";

  return (
    <div style={{ position: "relative", overflowX: "hidden" }}>
      <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Sidebar onClose={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999
          }}
          onClick={toggleSidebar}
        />
      )}
      <div
        style={{
          marginTop: "80px",
          marginLeft: isSidebarOpen ? sidebarWidth : "0",
          transition: "margin-left 0.3s ease",
          padding: window.innerWidth < 768 ? "0.5rem" : "1rem",
          backgroundColor: "#f8f9fa",
          minHeight: "calc(100vh - 80px)",
          boxSizing: "border-box",
          paddingTop: "10px"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
