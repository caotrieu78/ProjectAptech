import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import CategoryService from "../../../services/categoryService";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getAll();
            setCategories(data);
        } catch (error) {
            console.error('Lỗi khi load loại sản phẩm:', error);
        }
    };

    const handleCreate = async () => {
        if (newCategory.trim()) {
            await CategoryService.create({ CategoryName: newCategory });
            setNewCategory('');
            fetchCategories();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá loại này?')) {
            await CategoryService.delete(id);
            fetchCategories();
        }
    };

    const handleEdit = (id, currentName) => {
        setEditingId(id);
        setEditValue(currentName);
    };

    const handleUpdate = async () => {
        if (editValue.trim()) {
            await CategoryService.update(editingId, { CategoryName: editValue });
            setEditingId(null);
            setEditValue('');
            fetchCategories();
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold"> Quản lý loại sản phẩm</h2>

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
                                    <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" onClick={() => handleEdit(cat.id, cat.name)}>
                                        <FaEdit /> Sửa
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={() => handleDelete(cat.id)}>
                                        <FaTrash /> Xoá
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryPage;
