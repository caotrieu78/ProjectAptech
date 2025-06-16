import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const OrderModal = ({ show, onHide, order }) => {
    if (!order) return null;

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN').format(value) + ' đ';

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết đơn hàng #{order.OrderID}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <h5 className="mb-3">Thông tin đơn hàng</h5>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <strong>Người đặt:</strong><br />
                            {order.user?.FullName || order.user?.Username}
                        </div>
                        <div className="col-md-6">
                            <strong>Ngày đặt:</strong><br />
                            {new Date(order.OrderDate).toLocaleString()}
                        </div>
                        <div className="col-md-6">
                            <strong>Tổng tiền:</strong><br />
                            {formatCurrency(order.TotalAmount)}
                        </div>
                        <div className="col-md-6">
                            <strong>Phương thức thanh toán:</strong><br />
                            {order.PaymentMethod || '---'}
                        </div>
                        <div className="col-md-6">
                            <strong>Trạng thái thanh toán:</strong><br />
                            {order.PaymentStatus || 'CHƯA THANH TOÁN'}
                        </div>
                        <div className="col-md-6">
                            <strong>Trạng thái đơn hàng:</strong><br />
                            {order.Status}
                        </div>
                    </div>
                </div>

                <hr />
                <h5 className="mb-3">Chi tiết sản phẩm</h5>
                {order.details?.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Sản phẩm</th>
                                    <th>Size</th>
                                    <th>Màu</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.details.map((item) => (
                                    <tr key={item.OrderDetailID}>
                                        <td style={{ width: 80 }}>
                                            <img
                                                src={item.variant?.ImageURL}
                                                alt="ảnh"
                                                style={{ width: 60, height: 60, objectFit: 'cover' }}
                                            />
                                        </td>
                                        <td>{item.variant?.product?.ProductName || '---'}</td>
                                        <td>{item.variant?.size?.SizeName || '---'}</td>
                                        <td>{item.variant?.color?.ColorName || '---'}</td>
                                        <td>{item.Quantity}</td>
                                        <td>{formatCurrency(item.Price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Không có sản phẩm nào trong đơn hàng.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderModal;
