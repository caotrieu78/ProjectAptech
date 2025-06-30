import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../constants/paths";
import CartService from "../services/CartService";
import OrderService from "../services/orderService";
import { FaCheckCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const Checkout = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { clearCart } = useContext(CartContext); // Lấy clearCart từ CartContext
    const {
        cartItems: initialCartItems = [],
        voucherCode = "",
        discount = 0
    } = state || {};
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        phone: "",
        paymentMethod: "cod",
        promoCode: voucherCode
    });
    const [formErrors, setFormErrors] = useState({});

    // Calculate subtotal using useMemo
    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + (item.Quantity || 0) * (item.variant?.Price || 0),
            0
        );
    }, [cartItems]);

    // Delivery fee is free
    const deliveryFee = 0;
    const [promoDiscount, setPromoDiscount] = useState(discount * subtotal);
    const total = subtotal - promoDiscount;

    // Update promoDiscount when discount or subtotal changes
    useEffect(() => {
        setPromoDiscount(discount * subtotal);
    }, [discount, subtotal]);

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            setIsLoading(true);
            try {
                const data = await CartService.getAll();
                if (!Array.isArray(data)) {
                    throw new Error("Invalid cart data");
                }
                setCartItems(data);
                setError(null);
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
                        4000
                    );
                } else {
                    setError(
                        error.message || "Unable to load cart. Please try again later."
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCart();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let errors = { ...formErrors };
        switch (name) {
            case "fullName":
                errors.fullName =
                    value.length < 2 ? "Full name must be at least 2 characters" : "";
                break;
            case "address":
                errors.address =
                    value.length < 5 ? "Address must be at least 5 characters" : "";
                break;
            case "phone":
                errors.phone = !/^\d{10,11}$/.test(value)
                    ? "Phone number must be 10-11 digits"
                    : "";
                break;
            default:
                break;
        }
        setFormErrors(errors);
    };

    const validateForm = () => {
        const errors = {};
        if (formData.fullName.length < 2)
            errors.fullName = "Full name must be at least 2 characters";
        if (formData.address.length < 5)
            errors.address = "Address must be at least 5 characters";
        if (!/^\d{10,11}$/.test(formData.phone))
            errors.phone = "Phone number must be 10-11 digits";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleApplyPromo = () => {
        if (formData.promoCode === "DISCOUNT10") {
            setPromoDiscount(subtotal * 0.1);
            setToast({
                show: true,
                message: "Voucher applied successfully!",
                type: "success"
            });
        } else {
            setPromoDiscount(0);
            setToast({
                show: true,
                message: "Invalid voucher code!",
                type: "error"
            });
        }
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setToast({
                show: true,
                message: "Please fill in all required information!",
                type: "error"
            });
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                cartItems,
                ...formData,
                total,
                promoDiscount
            };
            const response = await OrderService.create(orderData);
            await clearCart(); // Gọi clearCart từ CartContext
            setCartItems([]); // Cập nhật state cục bộ
            setToast({
                show: true,
                message: "Order placed successfully!",
                type: "success"
            });
            setTimeout(() => {
                setToast({ show: false, message: "", type: "" });
                navigate(PATHS.ORDER_CONFIRMATION, {
                    state: { total, formData, cartItems, orderId: response.orderId }
                });
            }, 4000);
        } catch (error) {
            console.error("Error placing order:", error);
            if (error.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate(PATHS.LOGIN);
                setToast({
                    show: true,
                    message: "Session expired. Please log in again.",
                    type: "error"
                });
            } else {
                setToast({
                    show: true,
                    message:
                        error.response?.data?.message ||
                        "Order placement failed. Please try again.",
                    type: "error"
                });
            }
            setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const SkeletonLoader = () => (
        <div className="row">
            <div className="col-lg-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="mb-3">
                        <div
                            className="skeleton"
                            style={{ height: "40px", borderRadius: "8px" }}
                        />
                    </div>
                ))}
            </div>
            <div className="col-lg-4">
                <div className="summary-card">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="skeleton mb-2"
                            style={{ height: "20px", borderRadius: "4px" }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .checkout-container {
            background: #ffffff;
            border-radius: 12px;
            padding: 2.5rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin: 2rem auto;
            max-width: 1200px;
            font-family: 'Inter', sans-serif;
          }
          .checkout-header {
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
          .place-order-btn {
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
          .place-order-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
            background: linear-gradient(90deg, #3b82f6, #2563eb);
          }
          .place-order-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
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
          .promo-input-group {
            display: flex;
            gap: 0.75rem;
          }
          .promo-btn {
            background: linear-gradient(90deg, #2ecc71, #27ae60);
            color: #ffffff;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          .promo-btn:hover {
            background: linear-gradient(90deg, #27ae60, #219653);
            transform: translateY(-1px);
          }
          .form-label {
            font-weight: 500;
            color: #374151;
            margin-bottom: 0.5rem;
          }
          .form-control {
            border-radius: 8px;
            border: 1px solid #d1d5db;
            padding: 0.75rem;
            transition: all 0.2s ease;
          }
          .form-control:focus {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .form-select {
            border-radius: 8px;
            border: 1px solid #d1d5db;
            padding: 0.75rem;
          }
          .invalid-feedback {
            font-size: 0.875rem;
            color: #dc2626;
          }
          .skeleton {
            background: #e9ecef;
            border-radius: 0.25rem;
            animation: pulse 0.5s infinite ease-in-out;
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
            .checkout-container {
              padding: 1.5rem;
            }
            .summary-card {
              position: static;
              margin-top: 2rem;
            }
          }
        `}
            </style>
            <div className="container checkout-container">
                <h2 className="checkout-header" role="heading" aria-level="2">
                    Checkout
                </h2>

                <div className="progress-steps">
                    <div
                        className="progress-connector"
                        style={{ left: "2.75rem", right: "2.75rem" }}
                    >
                        <div
                            className="progress-connector-fill"
                            style={{ width: "66%" }}
                        ></div>
                    </div>
                    <div className="progress-step">
                        <div className="progress-step-circle active">1</div>
                        <span className="progress-step-label">Cart</span>
                    </div>
                    <div className="progress-step">
                        <div className="progress-step-circle active">2</div>
                        <span className="progress-step-label">Checkout</span>
                    </div>
                    <div className="progress-step">
                        <div className="progress-step-circle inactive">3</div>
                        <span className="progress-step-label">Complete</span>
                    </div>
                </div>

                {isLoading ? (
                    <SkeletonLoader />
                ) : error ? (
                    <div className="alert alert-danger" role="alert">
                        {error}
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
                            <h4 className="mb-4">Shipping Information</h4>
                            <form onSubmit={handleSubmitOrder}>
                                <div className="mb-3">
                                    <label htmlFor="fullName" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.fullName ? "is-invalid" : ""
                                            }`}
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {formErrors.fullName && (
                                        <div className="invalid-feedback">
                                            {formErrors.fullName}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${formErrors.address ? "is-invalid" : ""
                                            }`}
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {formErrors.address && (
                                        <div className="invalid-feedback">{formErrors.address}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className={`form-control ${formErrors.phone ? "is-invalid" : ""
                                            }`}
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {formErrors.phone && (
                                        <div className="invalid-feedback">{formErrors.phone}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Payment Method</label>
                                    <select
                                        className="form-select"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="cod">Cash on Delivery</option>
                                        <option value="card">Bank Card</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="promoCode" className="form-label">
                                        Voucher Code
                                    </label>
                                    <div className="promo-input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="promoCode"
                                            name="promoCode"
                                            value={formData.promoCode}
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="promo-btn"
                                            onClick={handleApplyPromo}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="place-order-btn"
                                    disabled={isSubmitting || cartItems.length === 0}
                                    aria-label="Place order"
                                >
                                    {isSubmitting ? "Processing..." : "Place Order"}
                                </button>
                            </form>
                        </div>
                        <div className="col-lg-4">
                            <div className="summary-card">
                                <h4 className="summary-title">Order Summary</h4>
                                {cartItems.map((item) => (
                                    <div
                                        key={item.variant?.VariantID || Math.random()}
                                        className="d-flex justify-content-between mb-2"
                                    >
                                        <span>
                                            {item.variant?.product?.ProductName || "Product"} x{" "}
                                            {item.Quantity}
                                        </span>
                                        <span>
                                            {(
                                                item.Quantity * (item.variant?.Price || 0)
                                            ).toLocaleString("en-US")}{" "}
                                            $
                                        </span>
                                    </div>
                                ))}
                                <hr />
                                <div className="summary-total">
                                    <span>Subtotal:</span>
                                    <span>{subtotal.toLocaleString("en-US")} $</span>
                                </div>
                                <div className="summary-total">
                                    <span>Delivery Fee:</span>
                                    <span>Free</span>
                                </div>
                                {promoDiscount > 0 && (
                                    <div className="summary-total">
                                        <span>Discount ({formData.promoCode}):</span>
                                        <span>-{promoDiscount.toLocaleString("en-US")} $</span>
                                    </div>
                                )}
                                <hr />
                                <div className="summary-total">
                                    <span>Total:</span>
                                    <span>{total.toLocaleString("en-US")} $</span>
                                </div>
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

const OrderConfirmation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const { total, formData, cartItems, orderId } = state || {};
    const currentDateTime = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "medium",
        timeStyle: "short"
    });

    useEffect(() => {
        // Simulate loading time (2 seconds)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!total || !formData || !cartItems) {
        return (
            <div className="container confirmation-container">
                <div className="text-center py-5">
                    <p className="text-muted fs-5">
                        No order information available.{" "}
                        <button
                            className="btn-home"
                            onClick={() => navigate(PATHS.HOME)}
                            aria-label="Return to homepage"
                        >
                            Return to Homepage
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container confirmation-container">
                <div className="text-center py-5">
                    <p className="loading-text">Loading, please wait a moment...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .confirmation-container {
            background: #ffffff;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin: 2rem auto;
            max-width: 600px;
            font-family: 'Inter', sans-serif;
            animation: fadeIn 0.5s ease-out;
          }

          .confirmation-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .success-icon {
            color: #28a745;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            animation: bounceIn 0.6s ease-out;
          }

          .confirmation-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1a1a1a;
            margin: 0;
            letter-spacing: -0.02em;
          }

          .confirmation-subtitle {
            font-size: 1rem;
            font-weight: 500;
            color: #6b7280;
            margin: 0.5rem 0;
          }

          .confirmation-card {
            background: #ffffff;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }

          .confirmation-card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 1rem;
          }

          .confirmation-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .confirmation-list-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            font-size: 0.95rem;
            color: #374151;
            border-bottom: 1px solid #f1f3f5;
          }

          .confirmation-list-item:last-child {
            border-bottom: none;
          }

          .confirmation-list-item span:first-child {
            font-weight: 500;
          }

          .confirmation-list-item span:last-child {
            font-weight: 400;
          }

          .btn-home {
            background: #007bff;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .btn-home:hover {
            background: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .loading-text {
            font-size: 1.25rem;
            font-weight: 500;
            color: #6b7280;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }

          @media (max-width: 768px) {
            .confirmation-container {
              padding: 1rem;
              margin: 1rem;
            }

            .confirmation-title {
              font-size: 1.5rem;
            }

            .confirmation-subtitle {
              font-size: 0.9rem;
            }

            .confirmation-card-title {
              font-size: 1.1rem;
            }
          }
        `}
            </style>
            <div className="container confirmation-container">
                <div className="confirmation-header">
                    <FaCheckCircle className="success-icon" />
                    <h2 className="confirmation-title">Thank you for your order!</h2>
                    <p className="confirmation-subtitle">
                        Your order was successfully placed on {currentDateTime}
                    </p>
                    <p className="confirmation-subtitle">Order ID: {orderId || "N/A"}</p>
                </div>

                <div className="confirmation-card">
                    <h4 className="confirmation-card-title">Order Details</h4>
                    <ul className="confirmation-list">
                        <li className="confirmation-list-item">
                            <span>Full Name:</span>
                            <span>{formData.fullName}</span>
                        </li>
                        <li className="confirmation-list-item">
                            <span>Address:</span>
                            <span>{formData.address}</span>
                        </li>
                        <li className="confirmation-list-item">
                            <span>Phone Number:</span>
                            <span>{formData.phone}</span>
                        </li>
                        <li className="confirmation-list-item">
                            <span>Payment Method:</span>
                            <span>
                                {formData.paymentMethod === "cod"
                                    ? "Cash on Delivery"
                                    : "Bank Card"}
                            </span>
                        </li>
                        <li className="confirmation-list-item">
                            <span>Total:</span>
                            <span>{total.toLocaleString("en-US")} $</span>
                        </li>
                    </ul>
                </div>

                <div className="confirmation-card">
                    <h4 className="confirmation-card-title">Purchased Products</h4>
                    <ul className="confirmation-list">
                        {cartItems.map((item) => (
                            <li
                                key={item.variant?.VariantID || Math.random()}
                                className="confirmation-list-item"
                            >
                                <span>
                                    {item.variant?.product?.ProductName || "Product"} x{" "}
                                    {item.Quantity}
                                </span>
                                <span>
                                    {(item.Quantity * (item.variant?.Price || 0)).toLocaleString(
                                        "en-US"
                                    )}{" "}
                                    $
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="text-center">
                    <button
                        className="btn-home"
                        onClick={() => navigate(PATHS.HOME)}
                        aria-label="Return to homepage"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        </>
    );
};

export { Checkout, OrderConfirmation };
