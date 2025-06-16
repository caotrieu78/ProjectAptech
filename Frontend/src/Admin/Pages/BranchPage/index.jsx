import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage';
import BranchModal from './BranchModal';
import BranchService from '../../../services/BranchService';

const BranchPage = () => {
    const [branches, setBranches] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [showConfirm, setShowConfirm] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editBranch, setEditBranch] = useState(null);

    const fetchBranches = async () => {
        try {
            const data = await BranchService.getAll();
            setBranches(data);
        } catch (err) {
            showToast('Lỗi khi tải chi nhánh', 'error');
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const showToast = (message, type = 'success') => {
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
                showToast('Cập nhật chi nhánh thành công');
            } else {
                await BranchService.create(data);
                showToast('Thêm chi nhánh thành công');
            }
            setShowModal(false);
            fetchBranches();
        } catch (err) {
            showToast('Lỗi khi lưu chi nhánh', 'error');
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
            showToast('Đã xoá chi nhánh');
        } catch (err) {
            showToast('Lỗi khi xoá chi nhánh', 'error');
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Quản lý chi nhánh</h2>

            <div className="mb-3 text-end">
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
                    <FaPlus /> Thêm chi nhánh
                </button>
            </div>

            <ul className="list-group shadow-sm">
                {branches.map((branch) => (
                    <li key={branch.BranchID} className="list-group-item d-flex justify-content-between align-items-center flex-wrap p-3">
                        <div className="flex-grow-1">
                            <h5 className="mb-1 fw-bold text-primary">{branch.BranchName}</h5>
                            <p className="mb-1 text-muted">{branch.Address}, {branch.City}</p>
                            <small>
                                {branch.Phone || 'Không có'} | {branch.Email || 'Không có'}
                            </small>
                        </div>
                        <div className="d-flex gap-2 mt-2 mt-md-0">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(branch)} title="Sửa">
                                <FaEdit />
                            </button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => confirmDelete(branch)} title="Xoá">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá chi nhánh"
                message={`Bạn có chắc chắn muốn xoá "${branchToDelete?.BranchName}"?`}
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
