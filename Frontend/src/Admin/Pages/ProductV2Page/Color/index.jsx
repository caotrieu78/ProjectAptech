import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import ColorService from '../../../../services/colorService';
import ConfirmModal from '../../../../components/ConfirmModal';
import ToastMessage from '../../../../components/ToastMessage';
import { PATHS } from '../../../../constants/paths';

const ColorPage = () => {
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [colorToDelete, setColorToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchColors = async () => {
        try {
            const data = await ColorService.getAll();
            setColors(data);
        } catch {
            showToast('Lỗi khi tải danh sách màu', 'error');
        }
    };

    const handleCreate = async () => {
        if (newColor.trim()) {
            try {
                await ColorService.create({ ColorName: newColor });
                setNewColor('');
                fetchColors();
                showToast('Thêm màu thành công');
            } catch {
                showToast('Lỗi khi thêm màu', 'error');
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
            showToast('Đã xoá màu');
        } catch {
            showToast('Lỗi khi xoá màu', 'error');
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
                setEditValue('');
                fetchColors();
                showToast('Cập nhật màu thành công');
            } catch {
                showToast('Lỗi khi cập nhật màu', 'error');
            }
        }
    };

    useEffect(() => {
        fetchColors();
    }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý màu sắc</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate(PATHS.PRODUCT_V2_DASHBOARD)}>
                    <FaArrowLeft className="me-2" /> Quay về biến thể
                </button>
            </div>

            <div className="input-group mb-4 w-75">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tên màu mới"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                />
                <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleCreate}>
                    <FaPlus /> Thêm
                </button>
            </div>

            <ul className="list-group shadow-sm">
                {colors.map((color) => (
                    <li key={color.ColorID} className="list-group-item d-flex justify-content-between align-items-center">
                        {editingId === color.ColorID ? (
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
                                <span className="fw-medium">{color.ColorName}</span>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                        onClick={() => handleEdit(color.ColorID, color.ColorName)}
                                    >
                                        <FaEdit /> Sửa
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                        onClick={() => confirmDelete(color)}
                                    >
                                        <FaTrash /> Xoá
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá"
                message={`Bạn có chắc chắn muốn xoá màu "${colorToDelete?.ColorName}"?`}
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
