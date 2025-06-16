import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage';
import UserModal from './UserModal';
import ImagePreviewModal from '../../Component/ImagePreviewModal';
import UserService from '../../../services/userService';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
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
            showToast('Lỗi khi tải danh sách người dùng', 'error');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const handleCreate = () => {
        setEditUser(null);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setEditUser(user);
        setShowModal(true);
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (editUser) {
                const updated = await UserService.update(editUser.UserID, formData);
                setUsers(prev =>
                    prev.map(user =>
                        user.UserID === editUser.UserID ? updated.user : user
                    )
                );
                showToast('Cập nhật người dùng thành công');
            } else {
                showToast('Chức năng thêm mới chưa được hỗ trợ', 'error');
            }
            setShowModal(false);
        } catch (err) {
            console.error('Lỗi submit:', err);
            showToast('Lỗi khi lưu người dùng', 'error');
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await UserService.delete(userToDelete.UserID);
            setUsers(prev => prev.filter(user => user.UserID !== userToDelete.UserID));
            showToast('Đã xoá người dùng');
            setShowConfirm(false);
            setUserToDelete(null);
        } catch (err) {
            showToast('Lỗi khi xoá người dùng', 'error');
        }
    };

    const handleImageClick = (url) => {
        if (url) setSelectedImage(url);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Quản lý người dùng</h2>
            {/* <div className="mb-3 text-end">
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
                    <FaPlus /> Thêm người dùng
                </button>
            </div> */}

            <ul className="list-group shadow-sm">
                {users.map((user) => (
                    <li key={user.UserID} className="list-group-item d-flex justify-content-between align-items-center flex-wrap p-3">
                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <img
                                src={user.Avatar || 'https://via.placeholder.com/80?text=Avatar'}
                                alt={user.FullName || 'Người dùng'}
                                width="80"
                                height="80"
                                className="img-thumbnail"
                                style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                                onClick={() => handleImageClick(user.Avatar)}
                            />
                            <div>
                                <h5 className="mb-1 fw-bold text-primary">{user.FullName}</h5>
                                <p className="mb-1 text-muted">Email: {user.Email}</p>
                                <small>
                                    <strong>Trạng thái:</strong> {user.IsActive ? 'Hoạt động' : 'Khoá'}<br />
                                    <strong>Vai trò:</strong> {user.role?.RoleName || 'Không xác định'}
                                </small>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-2 mt-md-0">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(user)} title="Sửa">
                                <FaEdit />
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => confirmDelete(user)} title="Xoá">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá người dùng"
                message={`Bạn có chắc chắn muốn xoá "${userToDelete?.FullName}"?`}
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
