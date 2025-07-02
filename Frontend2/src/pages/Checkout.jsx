import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../constants/paths";
import CartService from "../services/CartService";
import OrderService from "../services/orderService";
import { FaCheckCircle } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import Loading from "../components/Loading/Loading";

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { clearCart } = useContext(CartContext);
  const { cartItems: initialCartItems = [] } = state || {};
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // Calculate subtotal using useMemo
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.Quantity || 0) * (item.variant?.Price || 0),
      0
    );
  }, [cartItems]);

  // Total is same as subtotal
  const total = subtotal;

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
        total
      };
      setIsLoading(true);
      const response = await OrderService.create(orderData);
      await clearCart();
      setCartItems([]);
      setToast({
        show: true,
        message: "Order placed successfully!",
        type: "success"
      });
      setIsLoading(false);
      navigate(PATHS.ORDER_CONFIRMATION, {
        state: { total, formData, cartItems, orderId: response.orderId }
      });
    } catch (error) {
      console.error("Error placing order:", error);
      setIsLoading(false);
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

  return (
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
        <Loading size="large" message="Loading cart, please wait..." />
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
                  className={`form-control ${
                    formErrors.fullName ? "is-invalid" : ""
                  }`}
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.fullName && (
                  <div className="invalid-feedback">{formErrors.fullName}</div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formErrors.address ? "is-invalid" : ""
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
                  className={`form-control ${
                    formErrors.phone ? "is-invalid" : ""
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
  );
};

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { total, formData, cartItems, orderId } = state || {};
  const currentDateTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    dateStyle: "medium",
    timeStyle: "short"
  });

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
  return (
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
  );
};

export { Checkout, OrderConfirmation };
