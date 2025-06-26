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
                console.error("Error loading cart:", error);
                if (retryCount < 3) {
                    setTimeout(() => setRetryCount(retryCount + 1), 2000);
                } else {
                    setError("Unable to load cart. Please try again later.");
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
            console.error("Error updating quantity:", err);
        }
    };

    const confirmRemoveItem = (variantId) => {
        setConfirmVariantId(variantId);
        setShowConfirm(true);
    };

    const handleRemoveItem = async () => {
        try {
            await CartService.removeItem(confirmVariantId);
            setCartItems((prev) =>
                prev.filter((item) => item.variant.VariantID !== confirmVariantId)
            );
        } catch (err) {
            console.error("Error removing item:", err);
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
        <>
            <style>
                {`
          .cart-panel-overlay {
            z-index: 1055;
            background-color: rgba(0, 0, 0, 0.6);
          }
          .cart-panel {
            transition: transform 0.3s ease-in-out;
            box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
          }
          .cart-panel-header {
            border-bottom: 2px solid #e9ecef;
          }
          .cart-item-card {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            transition: box-shadow 0.2s;
          }
          .cart-item-card:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .cart-item-img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
          }
          .quantity-btn {
            padding: 6px 12px;
            font-size: 14px;
            border-color: #ced4da;
          }
          .quantity-btn:hover {
            background-color: #f8f9fa;
          }
          .quantity-span {
            padding: 6px 16px;
            font-size: 14px;
            border-color: #ced4da;
            background-color: #e9ecef;
          }
          .delete-btn {
            padding: 6px;
            font-size: 16px;
            border-color: #dc3545;
            color: #dc3545;
          }
          .delete-btn:hover {
            background-color: #dc3545;
            color: white;
          }
          .footer-btn {
            padding: 10px;
            font-size: 16px;
            border-radius: 6px;
          }
          .footer-btn-primary:hover {
            background-color: #003087;
            border-color: #003087;
          }
          .footer-btn-secondary:hover {
            background-color: #5a5e61;
            border-color: #5a5e61;
            color: white;
          }
          .error-alert {
            border-radius: 8px;
            font-size: 14px;
          }
          .spinner-container {
            height: 200px;
          }
          .empty-cart {
            padding: 40px 0;
          }
        `}
            </style>
            <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-end cart-panel-overlay"
                onClick={onClose}
                aria-modal="true"
                role="dialog"
            >
                <div
                    className="bg-white h-100 p-4 col-12 col-md-5 col-lg-4 cart-panel"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-2 cart-panel-header">
                        <h4 className="fw-bold mb-0">Cart ({cartItems.length} items)</h4>
                        <button
                            onClick={onClose}
                            className="text-dark"
                            aria-label="Close cart"
                        >
                            <FaTimes style={{ fontSize: "1.5rem" }} />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="text-center my-5 spinner-container">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger d-flex justify-content-between align-items-center mt-3 error-alert">
                            <span>{error}</span>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => setRetryCount(retryCount + 1)}
                            >
                                Retry
                            </button>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div className="text-center py-5 empty-cart">
                            <p className="text-muted mb-3 fs-5">Your cart is empty!</p>
                            <button
                                className="btn btn-primary footer-btn"
                                onClick={() => {
                                    onClose();
                                    navigate("/products");
                                }}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div
                            className="overflow-auto"
                            style={{ maxHeight: "calc(100vh - 200px)" }}
                        >
                            {cartItems.map((item) => (
                                <div
                                    key={item.variant.VariantID}
                                    className="mb-3 cart-item-card"
                                >
                                    <div className="p-3 d-flex align-items-center">
                                        <img
                                            src={
                                                item.variant.ImageURL ||
                                                "https://via.placeholder.com/80"
                                            }
                                            alt={item.variant.product?.ProductName || "Product"}
                                            className="me-3 cart-item-img"
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">
                                                {item.variant.product?.ProductName || "Unknown Product"}
                                            </h6>
                                            <small className="text-muted d-block">
                                                Size: {item.variant.size?.SizeName || "-"} | Color:{" "}
                                                {item.variant.color?.ColorName || "-"}
                                            </small>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="btn-group me-3">
                                                    <button
                                                        className="btn btn-outline-secondary quantity-btn"
                                                        onClick={() =>
                                                            handleQuantity(
                                                                item.variant.VariantID,
                                                                item.Quantity - 1
                                                            )
                                                        }
                                                        disabled={item.Quantity <= 1}
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="btn btn-outline-secondary quantity-span">
                                                        {item.Quantity}
                                                    </span>
                                                    <button
                                                        className="btn btn-outline-secondary quantity-btn"
                                                        onClick={() =>
                                                            handleQuantity(
                                                                item.variant.VariantID,
                                                                item.Quantity + 1
                                                            )
                                                        }
                                                        aria-label="Increase quantity"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                                <span className="text-primary fw-semibold">
                                                    {(
                                                        item.Quantity * (item.variant?.Price || 0)
                                                    ).toLocaleString("en-US")}{" "}
                                                    $
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-outline-danger delete-btn"
                                            onClick={() => confirmRemoveItem(item.variant.VariantID)}
                                            aria-label="Remove item"
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
                                <h5 className="fw-bold mb-0">Total:</h5>
                                <h5 className="fw-bold text-primary">
                                    {total.toLocaleString("en-US")} $
                                </h5>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-outline-secondary w-50 footer-btn footer-btn-secondary"
                                    onClick={() => {
                                        onClose();
                                        navigate("/cart");
                                    }}
                                >
                                    View Cart
                                </button>
                                <button
                                    className="btn btn-primary w-50 footer-btn footer-btn-primary"
                                    onClick={() => {
                                        onClose();
                                        navigate("/checkout");
                                    }}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    )}

                    <ConfirmModal
                        show={showConfirm}
                        title="Confirm Removal"
                        message="Are you sure you want to remove this item from the cart?"
                        onConfirm={handleRemoveItem}
                        onClose={() => setShowConfirm(false)}
                    />
                </div>
            </div>
        </>
    );
};

export default CartPanel;
