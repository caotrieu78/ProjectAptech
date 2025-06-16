import React, { useEffect } from 'react';

const ToastMessage = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-info',
    }[type] || 'bg-secondary';

    return (
        <div
            className={`toast show text-white ${bgColor} position-fixed bottom-0 end-0 m-4`}
            role="alert"
            style={{ zIndex: 9999 }}
        >
            <div className="d-flex">
                <div className="toast-body">{message}</div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
            </div>
        </div>
    );
};

export default ToastMessage;
