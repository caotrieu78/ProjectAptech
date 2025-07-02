import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaArrowLeft
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import ColorService from "../../../../services/colorService";
import ConfirmModal from "../../../../components/ConfirmModal";
import ToastMessage from "../../../../components/ToastMessage";
import { PATHS } from "../../../../constants/paths";

const ColorPage = () => {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [colorToDelete, setColorToDelete] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchColors = async () => {
    try {
      const data = await ColorService.getAll();
      setColors(data);
    } catch {
      showToast("Error loading color list", "error");
    }
  };

  const handleCreate = async () => {
    if (newColor.trim()) {
      try {
        await ColorService.create({ ColorName: newColor });
        setNewColor("");
        fetchColors();
        showToast("Color added successfully");
      } catch {
        showToast("Error adding color", "error");
      }
    }
  };

  const confirmDelete = (color) => {
    setColorToDelete(color);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await ColorService.delete(colorToDelete.ColorID);
      setShowConfirm(false);
      setColorToDelete(null);
      fetchColors();
      showToast("Color deleted successfully");
    } catch {
      showToast("Error deleting color", "error");
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleUpdate = async () => {
    if (editValue.trim()) {
      try {
        await ColorService.update(editingId, { ColorName: editValue });
        setEditingId(null);
        setEditValue("");
        fetchColors();
        showToast("Color updated successfully");
      } catch {
        showToast("Error updating color", "error");
      }
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Color Management</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(PATHS.PRODUCT_V2_DASHBOARD)}
        >
          <FaArrowLeft className="me-2" /> Back to Variants
        </button>
      </div>

      <div className="input-group mb-4 w-75">
        <input
          type="text"
          className="form-control"
          placeholder="New color name"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button
          className="btn btn-primary d-flex align-items-center gap-1"
          onClick={handleCreate}
        >
          <FaPlus /> Add
        </button>
      </div>

      <ul className="list-group shadow-sm">
        {colors.map((color) => (
          <li
            key={color.ColorID}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingId === color.ColorID ? (
              <div className="input-group w-100 me-3">
                <input
                  type="text"
                  className="form-control"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button
                  className="btn btn-success me-2 d-flex align-items-center gap-1"
                  onClick={handleUpdate}
                >
                  <FaSave /> Save
                </button>
                <button
                  className="btn btn-secondary d-flex align-items-center gap-1"
                  onClick={() => setEditingId(null)}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="fw-medium">{color.ColorName}</span>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                    onClick={() => handleEdit(color.ColorID, color.ColorName)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                    onClick={() => confirmDelete(color)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <ConfirmModal
        show={showConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the color "${colorToDelete?.ColorName}"?`}
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

export default ColorPage;
