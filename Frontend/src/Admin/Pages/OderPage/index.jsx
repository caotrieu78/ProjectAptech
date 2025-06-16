import React, { useEffect, useState } from 'react';
import OrderService from '../../../services/orderService';
import ToastMessage from '../../../components/ToastMessage';
import { FaEye, FaTrash } from 'react-icons/fa';
import OrderModal from './OrderModal';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await OrderService.getAllForAdmin();
            setOrders(data);
        } catch (error) {
            showToast('Lỗi khi tải danh sách đơn hàng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN').format(value) + ' đ';

    const handleDelete = async (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xoá đơn hàng #${id}?`)) return;
        try {
            await OrderService.remove(id);
            showToast('Xoá đơn hàng thành công');
            fetchOrders();
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const handleOpenModal = (order) => {
        setSelectedOrder({ ...order });
    };

    const handleCloseModal = () => {
        setSelectedOrder(null);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return 'secondary';
            case 'Processing': return 'info';
            case 'Shipped': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'dark';
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">
                Danh sách Đơn Hàng <span className="text-secondary fs-6">(admin)</span>
            </h2>

            {loading ? (
                <p>Đang tải đơn hàng...</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Date</th>
                                <th>Payment Status</th>
                                <th>Total</th>
                                {/* Removed: Payment Method */}
                                {/* Removed: Order Status */}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.OrderID}>
                                    <td><input type="checkbox" /></td>
                                    <td><a href="#!" className="text-primary fw-semibold">#{order.OrderID}</a></td>
                                    <td>{order.user?.FullName || order.user?.Username}</td>
                                    <td>{new Date(order.OrderDate).toLocaleString()}</td>
                                    <td>
                                        <span className="badge bg-warning text-dark text-uppercase">
                                            {order.PaymentStatus || 'CHƯA THANH TOÁN'}
                                        </span>
                                    </td>
                                    <td>{formatCurrency(order.TotalAmount)}</td>
                                    {/* Removed: Payment Method */}
                                    {/* Removed: Order Status */}
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-light border rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm"
                                                onClick={() => handleOpenModal(order)}
                                            >
                                                <FaEye className="text-primary" />
                                                <span className="text-primary">Xem</span>
                                            </button>
                                            <button
                                                className="btn btn-light border rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm"
                                                onClick={() => handleDelete(order.OrderID)}
                                            >
                                                <FaTrash className="text-danger" />
                                                <span className="text-danger">Xoá</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && (
                <OrderModal
                    show={true}
                    onHide={handleCloseModal}
                    order={selectedOrder}
                />
            )}

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

export default OrderPage;
