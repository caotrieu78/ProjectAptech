import React, { useEffect, useState, useMemo } from "react";
import {
    FaPlus,
    FaMinus,
    FaTrash,
    FaShoppingCart,
    FaCheckCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CartService from "../services/CartService";
import { PATHS } from "../constants/paths";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);

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
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate(PATHS.LOGIN);
                    setToast({
                        show: true,
                        message: "Session expired. Please log in again.",
                        type: "error"
                    });
                    setTimeout(
                        () => setToast({ show: false, message: "", type: "" }),
                        3000
                    );
                } else if (retryCount < 3) {
                    setTimeout(() => setRetryCount(retryCount + 1), 2000);
                } else {
                    setError("Unable to load cart. Please try again later.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, [retryCount, navigate]);

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
            setToast({
                show: true,
                message: "Quantity updated successfully!",
                type: "success"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        } catch (error) {
            console.error("Error updating quantity:", error);
            setError("Unable to update quantity. Please try again.");
            setToast({
                show: true,
                message: "Unable to update quantity.",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        }
    };

    const handleRemoveItem = async (variantId) => {
        if (
            !window.confirm(
                "Are you sure you want to remove this item from the cart?"
            )
        )
            return;
        try {
            await CartService.removeItem(variantId);
            setCartItems((prev) =>
                prev.filter((item) => item.variant.VariantID !== variantId)
            );
            setToast({
                show: true,
                message: "Item removed from cart successfully!",
                type: "success"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        } catch (error) {
            console.error("Error removing item:", error);
            setError("Unable to remove item. Please try again.");
            setToast({
                show: true,
                message: "Unable to remove item.",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear the entire cart?"))
            return;
        try {
            await CartService.clearCart();
            setCartItems([]);
            setToast({
                show: true,
                message: "Cart cleared successfully!",
                type: "success"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        } catch (error) {
            console.error("Error clearing cart:", error);
            setError("Unable to clear cart. Please try again.");
            setToast({
                show: true,
                message: "Unable to clear cart.",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
        }
    };

    const handleApplyVoucher = () => {
        const validVouchers = ["DISCOUNT10", "SAVE20"];
        if (validVouchers.includes(voucherCode)) {
            setDiscount(voucherCode === "DISCOUNT10" ? 0.1 : 0.2);
            setToast({
                show: true,
                message: "Voucher applied successfully!",
                type: "success"
            });
        } else {
            setDiscount(0);
            setToast({
                show: true,
                message: "Invalid voucher code!",
                type: "error"
            });
        }
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + item.Quantity * (item.variant?.Price || 0),
            0
        );
    }, [cartItems]);

    const total = useMemo(() => {
        const discountAmount = subtotal * discount;
        return subtotal - discountAmount;
    }, [subtotal, discount]);

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .cart-container {
            background: #ffffff;
            border-radius: 12px;
            padding: 2.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin: 2rem auto;
            max-width: 1200px;
            font-family: 'Inter', sans-serif;
          }
          .cart-header {
            font-size: 2.25rem;
            font-weight: 700;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
            letter-spacing: -0.02em;
          }
          .progress-steps {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2.5rem;
            position: relative;
          }
          .progress-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 1;
          }
          .progress-step-circle {
            width: 2.75rem;
            height: 2.75rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 1.25rem;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .progress-step-circle.active {
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            color: #ffffff;
          }
          .progress-step-circle.inactive {
            background: #f1f3f5;
            color: #6b7280;
          }
          .progress-step-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #6b7280;
            margin-top: 0.75rem;
            text-transform: uppercase;
          }
          .progress-connector {
            position: absolute;
            top: 1.375rem;
            height: 0.3rem;
            background: #f1f3f5;
            z-index: 0;
          }
          .progress-connector-fill {
            height: 100%;
            background: linear-gradient(90deg, #2ecc71, #27ae60);
            transition: width 0.4s ease;
            border-radius: 2px;
          }
          .cart-item {
            background: #f8f9fa;
            border-radius: 0.375rem;
            padding: 1.5rem;
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            transition: box-shadow 0.2s ease;
          }
          .cart-item:hover {
            box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
          }
          .cart-item-img {
            width: 5rem;
            height: 5rem;
            object-fit: cover;
            border-radius: 0.25rem;
            border: 1px solid #dee2e6;
            margin-right: 1rem;
          }
          .cart-item-info h5 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #212529;
            margin-bottom: 0.5rem;
          }
          .cart-item-info small {
            font-size: 0.875rem;
            color: #6c757d;
          }
          .quantity-control {
            display: flex;
            align-items: center;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            overflow: hidden;
          }
          .btn-quantity {
            width: 2.5rem;
            height: 2.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: #fff;
            color: #6c757d;
            font-size: 1rem;
            transition: background-color 0.2s ease;
          }
          .btn-quantity:hover {
            background-color: #e9ecef;
          }
          .btn-quantity:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .quantity-display {
            width: 3rem;
            text-align: center;
            font-size: 1rem;
            border: none;
            background: #f8f9fa;
            line-height: 2.5rem;
          }
          .summary-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: sticky;
            top: 2rem;
            border: 1px solid #e5e7eb;
          }
          .summary-title {
            font-size: 1.75rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 1.75rem;
          }
          .summary-total {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
          }
          .voucher-input {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
            background: #f8f9fa;
            padding: 0.75rem;
            border-radius: 0.375rem;
            border: 1px solid #dee2e6;
          }
          .voucher-input input {
            flex-grow: 1;
            border: none;
            background: transparent;
            font-size: 1rem;
            outline: none;
          }
          .voucher-input input:focus {
            box-shadow: none;
          }
          .voucher-input button {
            padding: 0.5rem 1.5rem;
            background: linear-gradient(90deg, #2ecc71, #27ae60);
            color: #fff;
            border: none;
            border-radius: 0.25rem;
            font-size: 1rem;
            transition: all 0.3s ease;
          }
          .voucher-input button:hover {
            background: linear-gradient(90deg, #27ae60, #219653);
            transform: translateY(-1px);
          }
          .checkout-btn {
            background: linear-gradient(90deg, #2563eb, #1e40af);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 1rem 2rem;
            font-size: 1.125rem;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s ease;
            letter-spacing: 0.02em;
          }
          .checkout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
            background: linear-gradient(90deg, #3b82f6, #2563eb);
          }
          .checkout-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          .continue-shopping-btn {
            background: #f8f9fa;
            color: #212529;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 1rem 2rem;
            font-size: 1.125rem;
            font-weight: 600;
            width: 100%;
            margin-top: 1rem;
            transition: background-color 0.2s ease;
          }
          .continue-shopping-btn:hover {
            background-color: #e9ecef;
          }
          .clear-cart-btn {
            background: #dc3545;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            transition: background-color 0.2s ease;
          }
          .clear-cart-btn:hover {
            background: #c82333;
          }
          .toast {
            position: fixed;
            bottom: 1.5rem;
            right: 1.5rem;
            color: #ffffff;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.4s ease-out;
            font-weight: 500;
          }
          .toast.success {
            background: #2ecc71;
          }
          .toast.error {
            background: #dc3545;
          }
          .skeleton {
            background: #e9ecef;
            border-radius: 0.25rem;
            animation: pulse 0.5s infinite ease-in-out;
          }
          .skeleton-img {
            width: 5rem;
            height: 5rem;
            margin-right: 1rem;
          }
          .skeleton-text {
            height: 1.25rem;
            margin-bottom: 0.5rem;
          }
          @keyframes pulse {
            0% { background-color: #e9ecef; }
            50% { background-color: #dee2e6; }
            100% { background-color: #e9ecef; }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @media (max-width: 992px) {
            .cart-container {
              padding: 1.5rem;
            }
            .cart-item-img {
              width: 4rem;
              height: 4rem;
            }
            .cart-item-info h5 {
              font-size: 1rem;
            }
            .cart-item-info small {
              font-size: 0.75rem;
            }
            .btn-quantity {
              width: 2rem;
              height: 2rem;
              font-size: 0.875rem;
            }
            .quantity-display {
              width: 2.5rem;
              font-size: 0.875rem;
              line-height: 2rem;
            }
            .summary-card {
              position: static;
              margin-top: 2rem;
            }
            .clear-cart-btn {
              padding: 0.5rem 1rem;
              font-size: 0.875rem;
            }
            .checkout-btn, .continue-shopping-btn {
              font-size: 1rem;
              padding: 0.5rem 1rem;
            }
            .voucher-input {
              padding: 0.5rem;
            }
            .voucher-input input {
              font-size: 0.875rem;
            }
            .voucher-input button {
              padding: 0.375rem 1rem;
              font-size: 0.875rem;
            }
          }
        `}
            </style>
            <div className="container cart-container">
                <h2 className="cart-header" role="heading" aria-level="2">
                    <FaShoppingCart className="me-2" /> Your Cart
                </h2>

                {/* Progress Bar */}
                <div className="progress-steps">
                    <div
                        className="progress-connector"
                        style={{ left: "2.75rem", right: "2.75rem" }}
                    >
                        <div
                            className="progress-connector-fill"
                            style={{ width: "33%" }}
                        ></div>
                    </div>
                    <div className="progress-step">
                        <div className="progress-step-circle active">1</div>
                        <span className="progress-step-label">Cart</span>
                    </div>
                    <div className="progress-step">
                        <div className="progress-step-circle inactive">2</div>
                        <span className="progress-step-label">Checkout</span>
                    </div>
                    <div className="progress-step">
                        <div className="progress-step-circle inactive">3</div>
                        <span className="progress-step-label">Complete</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="mb-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="cart-item">
                                <div className="skeleton skeleton-img"></div>
                                <div className="flex-grow-1">
                                    <div className="skeleton skeleton-text w-75"></div>
                                    <div className="skeleton skeleton-text w-50"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div
                        className="alert alert-danger d-flex justify-content-between align-items-center mb-4"
                        role="alert"
                    >
                        <span>{error}</span>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => setRetryCount(retryCount + 1)}
                            aria-label="Retry"
                        >
                            Retry
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-5">
                        <p className="text-muted mb-4 fs-5">Your cart is empty!</p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate(PATHS.HOME)}
                            aria-label="Continue shopping"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="mb-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.variant.VariantID}
                                        className="cart-item"
                                        role="listitem"
                                    >
                                        <img
                                            src={
                                                item.variant?.ImageURL ||
                                                "https://via.placeholder.com/80"
                                            }
                                            alt={item.variant?.product?.ProductName || "Product"}
                                            className="cart-item-img"
                                        />
                                        <div className="cart-item-info flex-grow-1">
                                            <h5>
                                                {item.variant?.product?.ProductName ||
                                                    "Unknown Product"}
                                            </h5>
                                            <small>
                                                Size: {item.variant?.size?.SizeName || "-"} | Color:{" "}
                                                {item.variant?.color?.ColorName || "-"}
                                            </small>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="quantity-control me-3">
                                                    <button
                                                        className="btn-quantity"
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
                                                    <span className="quantity-display">
                                                        {item.Quantity}
                                                    </span>
                                                    <button
                                                        className="btn-quantity"
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
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleRemoveItem(item.variant.VariantID)}
                                            aria-label="Remove item"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                className="clear-cart-btn"
                                onClick={handleClearCart}
                                aria-label="Clear cart"
                            >
                                Clear Cart
                            </button>
                        </div>
                        <div className="col-lg-4">
                            <div className="summary-card">
                                <h4 className="summary-title">Order Summary</h4>
                                <div className="voucher-input">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter voucher code"
                                        value={voucherCode}
                                        onChange={(e) => setVoucherCode(e.target.value)}
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleApplyVoucher}
                                    >
                                        Apply
                                    </button>
                                </div>
                                <div className="summary-total">
                                    <span>Subtotal:</span>
                                    <span>{subtotal.toLocaleString("en-US")} $</span>
                                </div>
                                {discount > 0 && (
                                    <div className="summary-total">
                                        <span>Discount ({voucherCode}):</span>
                                        <span>
                                            -{Math.round(subtotal * discount).toLocaleString("en-US")}{" "}
                                            $
                                        </span>
                                    </div>
                                )}
                                <div className="summary-total">
                                    <span>Total:</span>
                                    <span>{total.toLocaleString("en-US")} $</span>
                                </div>
                                <button
                                    className="checkout-btn mb-2"
                                    onClick={() =>
                                        navigate(PATHS.CHECKOUT, {
                                            state: { cartItems, voucherCode, discount }
                                        })
                                    }
                                    aria-label="Proceed to checkout"
                                    disabled={cartItems.length === 0}
                                >
                                    Proceed to Checkout
                                </button>
                                <button
                                    className="continue-shopping-btn"
                                    onClick={() => navigate(PATHS.HOME)}
                                    aria-label="Continue shopping"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {toast.show && (
                    <div
                        className={`toast ${toast.type}`}
                        role="alert"
                        aria-live="assertive"
                    >
                        <FaCheckCircle /> {toast.message}
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
