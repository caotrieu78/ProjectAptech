import React, { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/orderService';

const CartPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await OrderService.getAll();
                const pendingOrders = data.filter(order => order.Status === 'Pending');
                setOrders(pendingOrders);
            } catch (error) {
                console.error('Lỗi khi tải đơn hàng:', error);
            }
        };

        if (isOpen) {
            fetchOrders();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const total = orders.reduce((sum, order) => {
        return sum + order.details.reduce(
            (subSum, item) => subSum + item.Quantity * parseInt(item.variant.Price),
            0
        );
    }, 0);

    return (
        <div
            className="position-fixed top-0 end-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-end"
            style={{ zIndex: 1055 }}
            onClick={onClose}
        >
            <div
                className="bg-white p-4 h-100 cart-slide-in"
                style={{ width: '400px', maxWidth: '100%' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0">Giỏ hàng của bạn</h5>
                    <FaTimes role="button" onClick={onClose} />
                </div>

                <ul className="list-unstyled">
                    {orders.length === 0 ? (
                        <p>Giỏ hàng trống.</p>
                    ) : (
                        orders.map(order =>
                            order.details.map((item, index) => (
                                <li key={`${order.OrderID}-${index}`} className="d-flex mb-3">
                                    <img
                                        src={item.variant.ImageURL || 'https://via.placeholder.com/60'}
                                        alt={item.variant.product?.ProductName || 'Sản phẩm'}
                                        width="60"
                                        className="me-3"
                                    />
                                    <div>
                                        <div className="fw-semibold">
                                            {item.variant.product?.ProductName || 'Sản phẩm'}
                                        </div>
                                        <small>Size: {item.variant.size?.SizeName || '-'} - Màu: {item.variant.color?.ColorName || '-'}</small><br />
                                        <small>{item.Quantity} x {parseInt(item.variant.Price).toLocaleString('vi-VN')} ₫</small>
                                    </div>
                                </li>
                            ))
                        )
                    )}
                </ul>

                {orders.length > 0 && (
                    <>
                        <div className="mb-4">
                            <h6>Tổng cộng: {total.toLocaleString('vi-VN')} ₫</h6>
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-dark w-50"
                                onClick={() => {
                                    onClose();
                                    navigate('/cart');
                                }}
                            >
                                Xem giỏ
                            </button>
                            <button
                                className="btn btn-outline-dark w-50"
                                onClick={() => {
                                    onClose();
                                    navigate('/checkout');
                                }}
                            >
                                Thanh toán
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPanel;
