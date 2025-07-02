import React, { useEffect, useState } from "react";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";
import { FaTrash } from "react-icons/fa";
import FeedbackService from "../../../services/FeedbackService";

const FeedbackPage = ({ isSidebarOpen }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const data = await FeedbackService.getAll();
      setFeedbacks(data);
    } catch (err) {
      showToast("Error loading feedback", "error");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const confirmDelete = (fb) => {
    setFeedbackToDelete(fb);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await FeedbackService.delete(feedbackToDelete.id);
      setShowConfirm(false);
      setFeedbackToDelete(null);
      fetchFeedbacks();
      showToast("Feedback deleted successfully");
    } catch (err) {
      showToast("Error deleting feedback", "error");
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
      <h2 className="mb-4 fw-bold text-center">Feedback Management</h2>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Email</th>
                  <th>Submitted At</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.Name || "Unknown"}</td>
                    <td>{fb.Message || "Not specified"}</td>
                    <td>{fb.Email || "Not available"}</td>
                    <td>{fb.SubmittedAt || "Not specified"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 mx-auto"
                        title="Delete"
                        onClick={() => confirmDelete(fb)}
                      >
                        <FaTrash /> Delete
                      </button>
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
        message={`Are you sure you want to delete the feedback from "${feedbackToDelete?.Name}"?`}
        onConfirm={handleDeleteConfirmed}
        onClose={() => setShowConfirm(false)}
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

export default FeedbackPage;
