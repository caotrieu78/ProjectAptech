import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CartService from "../services/CartService";
import ConfirmModal from "./ConfirmModal";

const CartPanel = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmVariantId, setConfirmVariantId] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const data = await CartService.getAll();
                setCartItems(data);
                setError(null);
                setRetryCount(0);
            } catch (error) {
                console.error("Lỗi khi tải giỏ hàng:", error);
                if (retryCount < 3) {
                    setTimeout(() => setRetryCount(retryCount + 1), 2000);
                } else {
                    setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchCart();
        }
    }, [isOpen, retryCount]);

    const handleQuantity = async (variantId, newQty) => {
        if (newQty < 1) return;
        try {
            await CartService.updateItem(variantId, newQty);
            setCartItems((prev) =>
                prev.map((item) =>
                    item.variant.VariantID === variantId
                        ? { ...item, Quantity: newQty }
                        : item
                )
            );
        } catch (err) {
            console.error("Lỗi cập nhật số lượng:", err);
        }
    };

    const confirmRemoveItem = (variantId) => {
        setConfirmVariantId(variantId);
        setShowConfirm(true);
    };

    const handleRemoveItem = async () => {
        try {
            await CartService.removeItem(confirmVariantId);
            setCartItems((prev) => prev.filter((item) => item.variant.VariantID !== confirmVariantId));
        } catch (err) {
            console.error("Lỗi xóa sản phẩm:", err);
        } finally {
            setShowConfirm(false);
            setConfirmVariantId(null);
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.Quantity * (item.variant?.Price || 0),
        0
    );

    if (!isOpen) return null;

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-end"
            style={{ zIndex: 1055 }}
            onClick={onClose}
        >
            <div
                className="bg-white h-100 p-4 col-12 col-md-5 col-lg-4 shadow-lg"
                style={{ transition: "transform 0.3s ease-in-out" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                    <h4 className="fw-bold mb-0">Giỏ hàng ({cartItems.length} sản phẩm)</h4>
                    <FaTimes
                        role="button"
                        onClick={onClose}
                        className="text-dark"
                        style={{ fontSize: "1.5rem", cursor: "pointer" }}
                    />
                </div>

                {isLoading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger d-flex justify-content-between mt-3">
                        <span>{error}</span>
                        <button className="btn btn-sm btn-danger" onClick={() => setRetryCount(retryCount + 1)}>
                            Thử lại
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted mb-3 fs-5">Giỏ hàng của bạn đang trống!</p>
                        <button className="btn btn-primary" onClick={() => {
                            onClose();
                            navigate("/products");
                        }}>
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                        {cartItems.map((item) => (
                            <div key={item.variant.VariantID} className="card mb-3 shadow-sm">
                                <div className="card-body d-flex align-items-center">
                                    <img
                                        src={item.variant.ImageURL || "https://via.placeholder.com/80"}
                                        alt={item.variant.product?.ProductName || "Sản phẩm"}
                                        className="rounded me-3"
                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-1">{item.variant.product?.ProductName || "Sản phẩm không xác định"}</h6>
                                        <small className="text-muted d-block">
                                            Size: {item.variant.size?.SizeName || "-"} | Màu: {item.variant.color?.ColorName || "-"}
                                        </small>
                                        <div className="d-flex align-items-center mt-2">
                                            <div className="btn-group me-3">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleQuantity(item.variant.VariantID, item.Quantity - 1)}
                                                    disabled={item.Quantity <= 1}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span className="btn btn-outline-secondary btn-sm disabled">
                                                    {item.Quantity}
                                                </span>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleQuantity(item.variant.VariantID, item.Quantity + 1)}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                            <span className="text-primary fw-semibold">
                                                {(item.Quantity * (item.variant?.Price || 0)).toLocaleString("vi-VN")} ₫
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => confirmRemoveItem(item.variant.VariantID)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {cartItems.length > 0 && !error && !isLoading && (
                    <div className="border-top pt-3 mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Tổng cộng:</h5>
                            <h5 className="fw-bold text-primary">{total.toLocaleString("vi-VN")} ₫</h5>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary w-50" onClick={() => {
                                onClose();
                                navigate("/cart");
                            }}>
                                Xem giỏ hàng
                            </button>
                            <button className="btn btn-primary w-50" onClick={() => {
                                onClose();
                                navigate("/checkout");
                            }}>
                                Thanh toán
                            </button>
                        </div>
                    </div>
                )}
                <ConfirmModal
                    show={showConfirm}
                    title="Xác nhận xoá"
                    message="Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?"
                    onConfirm={handleRemoveItem}
                    onClose={() => setShowConfirm(false)}
                />
            </div>
        </div>
    );
};

export default CartPanel;
