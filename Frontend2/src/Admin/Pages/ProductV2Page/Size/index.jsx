import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import SizeService from '../../../../services/sizeService';
import ToastMessage from '../../../../components/ToastMessage';
import ConfirmModal from '../../../../components/ConfirmModal';
import { PATHS } from '../../../../constants/paths';

const SizePage = () => {
    const [sizes, setSizes] = useState([]);
    const [newSize, setNewSize] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const [showConfirm, setShowConfirm] = useState(false);
    const [sizeToDelete, setSizeToDelete] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const fetchSizes = async () => {
        try {
            const data = await SizeService.getAll();
            setSizes(data);
        } catch {
            showToast('Lỗi khi tải danh sách size', 'error');
        }
    };

    const handleCreate = async () => {
        if (newSize.trim()) {
            try {
                await SizeService.create({ SizeName: newSize });
                setNewSize('');
                fetchSizes();
                showToast('Thêm size thành công');
            } catch {
                showToast('Lỗi khi thêm size', 'error');
            }
        }
    };

    const confirmDelete = (size) => {
        setSizeToDelete(size);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await SizeService.delete(sizeToDelete.SizeID);
            setShowConfirm(false);
            setSizeToDelete(null);
            fetchSizes();
            showToast('Đã xoá size');
        } catch {
            showToast('Lỗi khi xoá size', 'error');
        }
    };

    const handleEdit = (id, currentName) => {
        setEditingId(id);
        setEditValue(currentName);
    };

    const handleUpdate = async () => {
        if (editValue.trim()) {
            try {
                await SizeService.update(editingId, { SizeName: editValue });
                setEditingId(null);
                setEditValue('');
                fetchSizes();
                showToast('Cập nhật size thành công');
            } catch {
                showToast('Lỗi khi cập nhật size', 'error');
            }
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Quản lý kích cỡ</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate(PATHS.PRODUCT_V2_DASHBOARD)}>
                    <FaArrowLeft className="me-2" /> Quay về biến thể
                </button>
            </div>

            <div className="input-group mb-4 w-75">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tên size mới"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                />
                <button className="btn btn-primary d-flex align-items-center gap-1" onClick={handleCreate}>
                    <FaPlus /> Thêm
                </button>
            </div>

            <ul className="list-group shadow-sm">
                {sizes.map((size) => (
                    <li key={size.SizeID} className="list-group-item d-flex justify-content-between align-items-center">
                        {editingId === size.SizeID ? (
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
                                <span className="fw-medium">{size.SizeName}</span>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                                        onClick={() => handleEdit(size.SizeID, size.SizeName)}
                                    >
                                        <FaEdit /> Sửa
                                    </button>
                                    <button
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                        onClick={() => confirmDelete(size)}
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
                message={`Bạn có chắc chắn muốn xoá size "${sizeToDelete?.SizeName}"?`}
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

export default SizePage;
