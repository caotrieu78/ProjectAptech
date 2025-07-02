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

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.Quantity * (item.variant?.Price || 0),
      0
    );
  }, [cartItems]);

  return (
    <>
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
                <div className="summary-total">
                  <span>Total:</span>
                  <span>{total.toLocaleString("en-US")} $</span>
                </div>
                <button
                  className="checkout-btn mb-2"
                  onClick={() =>
                    navigate(PATHS.CHECKOUT, {
                      state: { cartItems }
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
