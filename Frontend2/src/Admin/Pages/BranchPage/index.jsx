import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";
import BranchModal from "./BranchModal";
import BranchService from "../../../services/branchService";

const BranchPage = ({ isSidebarOpen }) => {
  const [branches, setBranches] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editBranch, setEditBranch] = useState(null);

  const fetchBranches = async () => {
    try {
      const data = await BranchService.getAll();
      setBranches(data);
    } catch (err) {
      showToast("Error loading branches", "error");
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleCreate = () => {
    setEditBranch(null);
    setShowModal(true);
  };

  const handleEdit = (branch) => {
    setEditBranch(branch);
    setShowModal(true);
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editBranch) {
        await BranchService.update(editBranch.BranchID, data);
        showToast("Branch updated successfully");
      } else {
        await BranchService.create(data);
        showToast("Branch added successfully");
      }
      setShowModal(false);
      fetchBranches();
    } catch (err) {
      showToast("Error saving branch", "error");
    }
  };

  const confirmDelete = (branch) => {
    setBranchToDelete(branch);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await BranchService.delete(branchToDelete.BranchID);
      setShowConfirm(false);
      setBranchToDelete(null);
      fetchBranches();
      showToast("Branch deleted successfully");
    } catch (err) {
      showToast("Error deleting branch", "error");
    }
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
      <h2 className="mb-4 fw-bold text-center">Branch Management</h2>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleCreate}
        >
          <FaPlus /> Add Branch
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Branch Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch.BranchID}>
                    <td>{branch.BranchName || "Unknown"}</td>
                    <td>{branch.Address || "Not specified"}</td>
                    <td>{branch.City || "Not specified"}</td>
                    <td>{branch.Phone || "Not available"}</td>
                    <td>{branch.Email || "Not available"}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                          onClick={() => handleEdit(branch)}
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => confirmDelete(branch)}
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
        message={`Are you sure you want to delete "${branchToDelete?.BranchName}"?`}
        onConfirm={handleDeleteConfirmed}
        onClose={() => setShowConfirm(false)}
      />

      <BranchModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        initialData={editBranch}
      />

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default BranchPage;
