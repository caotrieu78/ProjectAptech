import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";
import UserModal from "./UserModal";
import ImagePreviewModal from "../../Component/ImagePreviewModal";
import UserService from "../../../services/userService";

const UserPage = ({ isSidebarOpen }) => {
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err) {
      showToast("Error loading user list", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editUser) {
        const updated = await UserService.update(editUser.UserID, formData);
        setUsers((prev) =>
          prev.map((user) =>
            user.UserID === editUser.UserID ? updated.user : user
          )
        );
        showToast("User updated successfully");
      }
      setShowModal(false);
    } catch (err) {
      showToast("Error saving user", "error");
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await UserService.delete(userToDelete.UserID);
      setUsers((prev) =>
        prev.filter((user) => user.UserID !== userToDelete.UserID)
      );
      showToast("User deleted successfully");
      setShowConfirm(false);
      setUserToDelete(null);
    } catch (err) {
      showToast("Error deleting user", "error");
    }
  };

  const handleImageClick = (url) => {
    if (url) setSelectedImage(url);
  };

  return (
    <div
      className="container-fluid p-4"
      style={{
        marginLeft: isSidebarOpen ? "260px" : "0",
        transition: "margin-left 0.3s ease-in-out",
        width: isSidebarOpen ? "calc(100% - 260px)" : "100%",
        minHeight: "calc(100vh - 70px)"
      }}
    >
      <h2 className="mb-4 fw-bold text-center">User Management</h2>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.UserID}>
                    <td>
                      <img
                        src={
                          user.Avatar ||
                          "https://via.placeholder.com/60?text=Avatar"
                        }
                        alt={user.FullName || "User"}
                        className="rounded"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          cursor: "zoom-in"
                        }}
                        onClick={() => handleImageClick(user.Avatar)}
                      />
                    </td>
                    <td>{user.FullName || "Unknown"}</td>
                    <td>{user.Email || "Unknown"}</td>
                    <td>{user.IsActive ? "Active" : "Locked"}</td>
                    <td>{user.role?.RoleName || "Not specified"}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                          onClick={() => handleEdit(user)}
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => confirmDelete(user)}
                          title="Delete"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${userToDelete?.FullName}"?`}
        onConfirm={handleDeleteConfirmed}
        onClose={() => setShowConfirm(false)}
      />

      <UserModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        initialData={editUser}
      />

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default UserPage;
