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

const CategoryPage = () => {
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
            showToast("Lỗi khi tải danh sách loại sản phẩm", "error");
        }
    };

    const handleCreate = async () => {
        if (newCategory.trim()) {
            try {
                await CategoryService.create({ CategoryName: newCategory });
                setNewCategory("");
                fetchCategories();
                showToast("Thêm loại thành công");
            } catch (error) {
                showToast("Lỗi khi thêm loại", "error");
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
            showToast("Đã xoá loại thành công");
        } catch (error) {
            showToast("Lỗi khi xoá loại", "error");
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
                showToast("Cập nhật loại thành công");
            } catch (error) {
                showToast("Lỗi khi cập nhật loại", "error");
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
                showToast("Đã xoá các loại được chọn thành công");
            } catch (error) {
                showToast("Lỗi khi xoá các loại", "error");
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
        <div className="container py-4 category-page">
            <style>{`
                .category-page {
                    position: relative;
                    z-index: 900;
                    background-color: #f5f7fa;
                }

                .category-page h2 {
                    font-size: 1.75rem;
                    color: #333;
                    margin-bottom: 1.5rem;
                    font-weight: 700;
                }

                .dashboard-card {
                    background-color: #fff;
                    border-radius: 10px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    margin-bottom: 1.5rem;
                    transition: all 0.3s ease;
                }

                .dashboard-card:hover {
                    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.1);
                }

                .control-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .form-control-custom {
                    border: 1px solid #ced4da;
                    border-radius: 5px;
                    color: #333;
                    transition: all 0.3s ease;
                    padding: 0.5rem 1rem;
                }

                .form-control-custom:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
                    color: #000;
                }

                .btn-custom {
                    border-radius: 5px;
                    padding: 0.5rem 1rem;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .btn-custom:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
                }

                .btn-primary.btn-custom {
                    background-color: #007bff;
                    border-color: #007bff;
                    color: #fff;
                }

                .btn-primary.btn-custom:hover {
                    background-color: #0056b3;
                    border-color: #0056b3;
                }

                .btn-success.btn-custom {
                    background-color: #28a745;
                    border-color: #28a745;
                    color: #fff;
                }

                .btn-success.btn-custom:hover {
                    background-color: #218838;
                    border-color: #218838;
                }

                .btn-secondary.btn-custom {
                    background-color: #6c757d;
                    border-color: #6c757d;
                    color: #fff;
                }

                .btn-secondary.btn-custom:hover {
                    background-color: #5a6268;
                    border-color: #5a6268;
                }

                .btn-outline-primary.btn-custom {
                    color: #007bff;
                    border-color: #007bff;
                }

                .btn-outline-primary.btn-custom:hover {
                    background-color: #007bff;
                    color: #fff;
                }

                .btn-outline-danger.btn-custom {
                    color: #dc3545;
                    border-color: #dc3545;
                }

                .btn-outline-danger.btn-custom:hover {
                    background-color: #dc3545;
                    color: #fff;
                }

                .category-list {
                    border-radius: 10px;
                    overflow: hidden;
                }

                .list-group-item {
                    background-color: #fff;
                    border: 1px solid #dee2e6;
                    transition: all 0.3s ease;
                    color: #333;
                    padding: 0.75rem 1rem;
                }

                .list-group-item:hover {
                    background-color: #f8f9fa;
                    border-color: #007bff;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                .pagination .btn {
                    padding: 0.25rem 0.75rem;
                    font-size: 0.9rem;
                }

                .search-bar {
                    width: 250px;
                    margin-right: 1rem;
                }
            `}</style>
            <h2>Quản lý loại sản phẩm</h2>

            {/* Control Bar */}
            <div className="control-bar">
                <div>
                    <input
                        type="text"
                        className="form-control form-control-custom search-bar"
                        placeholder="Tìm kiếm loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="btn btn-outline-primary btn-custom ms-2"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                        {sortOrder === "asc" ? <FaSortAlphaDown /> : <FaSortAlphaUpAlt />}{" "}
                        Sắp xếp
                    </button>
                </div>
                {selectedCategories.size > 0 && (
                    <button
                        className="btn btn-outline-danger btn-custom"
                        onClick={() => confirmDelete({ id: [...selectedCategories] })}
                    >
                        <FaTrash /> Xoá đã chọn
                    </button>
                )}
            </div>

            {/* Form thêm mới */}
            <div className="dashboard-card">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control form-control-custom"
                        placeholder="Tên loại mới"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                        className="btn btn-primary btn-custom ms-2 d-flex align-items-center gap-1"
                        onClick={handleCreate}
                    >
                        <FaPlus /> Thêm
                    </button>
                </div>
            </div>

            {/* Danh sách loại */}
            <div className="dashboard-card category-list">
                <ul className="list-group">
                    {paginatedCategories.map((cat) => (
                        <li
                            key={cat.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div className="form-check me-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
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
                            </div>
                            {editingId === cat.id ? (
                                <div className="input-group w-50">
                                    <input
                                        type="text"
                                        className="form-control form-control-custom"
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-success btn-custom ms-2 me-2"
                                        onClick={handleUpdate}
                                    >
                                        <FaSave /> Lưu
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-custom"
                                        onClick={() => setEditingId(null)}
                                    >
                                        <FaTimes /> Huỷ
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="fw-medium">{cat.name}</span>
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-outline-primary btn-sm btn-custom me-2"
                                            onClick={() => handleEdit(cat.id, cat.name)}
                                        >
                                            <FaEdit /> Sửa
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm btn-custom"
                                            onClick={() => confirmDelete(cat)}
                                        >
                                            <FaTrash /> Xoá
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <div className="pagination">
                    <button
                        className="btn btn-outline-primary btn-custom"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            className={`btn btn-outline-primary btn-custom ${currentPage === page ? "btn-primary" : ""
                                }`}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="btn btn-outline-primary btn-custom"
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* Modal xác nhận xoá */}
            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá"
                message={
                    selectedCategories.size > 0
                        ? "Bạn có chắc chắn muốn xoá các loại đã chọn?"
                        : `Bạn có chắc chắn muốn xoá loại "${categoryToDelete?.name}"?`
                }
                onConfirm={
                    selectedCategories.size > 0 ? handleBulkDelete : handleDeleteConfirmed
                }
                onClose={() => setShowConfirm(false)}
            />

            {/* Hiển thị Toast */}
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
