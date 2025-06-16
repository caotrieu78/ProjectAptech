import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import CategoryService from "../../../services/categoryService";
import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage'; // ✅ import toast

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' }); // ✅ toast state

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (error) {
            showToast('Lỗi khi tải danh sách loại sản phẩm', 'error');
        }
    };

    const handleCreate = async () => {
        if (newCategory.trim()) {
            try {
                await CategoryService.create({ CategoryName: newCategory });
                setNewCategory('');
                fetchCategories();
                showToast(' Thêm loại thành công');
            } catch (error) {
                showToast(' Lỗi khi thêm loại', 'error');
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
            showToast(' Đã xoá loại thành công');
        } catch (error) {
            showToast(' Lỗi khi xoá loại', 'error');
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
                setEditValue('');
                fetchCategories();
                showToast('Cập nhật loại thành công');
            } catch (error) {
                showToast('Lỗi khi cập nhật loại', 'error');
            }
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Quản lý loại sản phẩm</h2>

            {/* Form thêm mới */}
            <div className="input-group mb-4 w-75">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tên loại mới"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleCreate}>
                    <FaPlus /> Thêm
                </button>
            </div>

            {/* Danh sách loại */}
            <ul className="list-group shadow-sm">
                {categories.map((cat) => (
                    <li key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editingId === cat.id ? (
                            <div className="input-group w-100 me-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                />
                                <button className="btn btn-success me-2 d-flex align-items-center gap-1" onClick={handleUpdate}>
                                    <FaSave /> Lưu
                                </button>
                                <button className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => setEditingId(null)}>
                                    <FaTimes /> Huỷ
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="fw-medium">{cat.name}</span>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                        onClick={() => handleEdit(cat.id, cat.name)}
                                    >
                                        <FaEdit /> Sửa
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
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

            {/* Modal xác nhận xoá */}
            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá"
                message={`Bạn có chắc chắn muốn xoá loại "${categoryToDelete?.name}"?`}
                onConfirm={handleDeleteConfirmed}
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
