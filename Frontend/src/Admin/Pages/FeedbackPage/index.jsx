import React, { useEffect, useState } from 'react';
import FeedbackService from '../../../services/feedbackService';
import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage';
import { FaTrash } from 'react-icons/fa';

const FeedbackPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [showConfirm, setShowConfirm] = useState(false);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);

    const fetchFeedbacks = async () => {
        try {
            const data = await FeedbackService.getAll();
            setFeedbacks(data);
        } catch (err) {
            showToast('Lỗi khi tải phản hồi', 'error');
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const showToast = (message, type = 'success') => {
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
            showToast('Đã xoá phản hồi');
        } catch (err) {
            showToast('Lỗi khi xoá phản hồi', 'error');
        }
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Quản lý phản hồi</h2>
            <ul className="list-group shadow-sm">
                {feedbacks.map((fb) => (
                    <li
                        key={fb.id}
                        className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row gap-2 p-3"
                    >
                        <div className="flex-grow-1">
                            <h5 className="mb-1 text-primary fw-bold">{fb.Name}</h5>
                            <p className="mb-1">{fb.Message}</p>
                            <small>
                                {fb.Email} |  {fb.SubmittedAt}
                            </small>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-danger btn-sm"
                                title="Xoá"
                                onClick={() => confirmDelete(fb)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá phản hồi"
                message={`Bạn có chắc chắn muốn xoá phản hồi từ "${feedbackToDelete?.Name}"?`}
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
