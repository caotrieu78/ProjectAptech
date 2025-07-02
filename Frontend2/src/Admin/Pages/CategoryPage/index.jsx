import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaUpAlt
} from "react-icons/fa";
import CategoryService from "../../../services/categoryService";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";

const CategoryPage = ({ isSidebarOpen }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const fetchCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (error) {
      showToast("Error loading categories", "error");
    }
  };

  const handleCreate = async () => {
    if (newCategory.trim()) {
      try {
        await CategoryService.create({ CategoryName: newCategory });
        setNewCategory("");
        fetchCategories();
        showToast("Category added successfully");
      } catch (error) {
        showToast("Error adding category", "error");
      }
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await CategoryService.delete(categoryToDelete.id);
      setShowConfirm(false);
      setCategoryToDelete(null);
      fetchCategories();
      showToast("Category deleted successfully");
    } catch (error) {
      showToast("Error deleting category", "error");
    }
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleUpdate = async () => {
    if (editValue.trim()) {
      try {
        await CategoryService.update(editingId, { CategoryName: editValue });
        setEditingId(null);
        setEditValue("");
        fetchCategories();
        showToast("Category updated successfully");
      } catch (error) {
        showToast("Error updating category", "error");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.size > 0) {
      try {
        await Promise.all(
          [...selectedCategories].map((id) => CategoryService.delete(id))
        );
        setSelectedCategories(new Set());
        fetchCategories();
        showToast("Selected categories deleted successfully");
      } catch (error) {
        showToast("Error deleting selected categories", "error");
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCategories = [...filteredCategories].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchCategories();
  }, []);

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
      <h2 className="mb-4 fw-bold text-center">Category Management</h2>

      {/* Control Bar */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group w-auto flex-grow-1">
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="btn btn-outline-primary d-flex align-items-center gap-1"
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}
          Sort
        </button>
        {selectedCategories.size > 0 && (
          <button
            className="btn btn-outline-danger d-flex align-items-center gap-1"
            onClick={() => confirmDelete({ id: [...selectedCategories] })}
          >
            <FaTrash /> Delete Selected
          </button>
        )}
      </div>

      {/* Form to add new */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button
              className="btn btn-primary d-flex align-items-center gap-1"
              onClick={handleCreate}
            >
              <FaPlus /> Add
            </button>
          </div>
        </div>
      </div>

      {/* Category list */}
      <div className="card shadow-sm">
        <ul className="list-group list-group-flush">
          {paginatedCategories.map((cat) => (
            <li
              key={cat.id}
              className="list-group-item d-flex align-items-center"
            >
              <input
                type="checkbox"
                className="form-check-input me-3"
                checked={selectedCategories.has(cat.id)}
                onChange={(e) => {
                  const newSelected = new Set(selectedCategories);
                  if (e.target.checked) {
                    newSelected.add(cat.id);
                  } else {
                    newSelected.delete(cat.id);
                  }
                  setSelectedCategories(newSelected);
                }}
              />
              {editingId === cat.id ? (
                <div className="input-group w-50">
                  <input
                    type="text"
                    className="form-control"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <button
                    className="btn btn-success d-flex align-items-center gap-1"
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
                  <span className="fw-medium flex-grow-1">{cat.name}</span>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                      onClick={() => handleEdit(cat.id, cat.name)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                      onClick={() => confirmDelete(cat)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="card-footer d-flex justify-content-center gap-2 py-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn ${
                currentPage === page ? "btn-primary" : "btn-outline-secondary"
              } px-3`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Confirm deletion modal */}
      <ConfirmModal
        show={showConfirm}
        title="Confirm Deletion"
        message={
          selectedCategories.size > 0
            ? "Are you sure you want to delete the selected categories?"
            : `Are you sure you want to delete the category "${categoryToDelete?.name}"?`
        }
        onConfirm={
          selectedCategories.size > 0 ? handleBulkDelete : handleDeleteConfirmed
        }
        onClose={() => setShowConfirm(false)}
      />

      {/* Display Toast */}
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

export default CategoryPage;
