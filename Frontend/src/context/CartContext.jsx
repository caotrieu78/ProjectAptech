import React, { createContext, useState, useCallback, useEffect } from "react";
import CartService from "../services/CartService";
import Swal from "sweetalert2";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await CartService.getAll();
            setCartItems(data);
            setError(null);
        } catch (err) {
            console.error("Lỗi khi lấy giỏ hàng:", err.message);
            setError("Không thể tải giỏ hàng.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (variant, quantity = 1) => {
        try {
            // Gọi API để thêm sản phẩm
            await CartService.addItem(variant.VariantID, quantity);
            // Tải lại giỏ hàng từ backend để đảm bảo đồng bộ
            await fetchCart();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: err.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const removeFromCart = async (variantId) => {
        try {
            await CartService.removeItem(variantId);
            await fetchCart();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: err.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const updateCartItem = async (variantId, quantity) => {
        try {
            await CartService.updateItem(variantId, quantity);
            await fetchCart();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: err.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const clearCart = async () => {
        try {
            await CartService.clearCart();
            setCartItems([]);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: err.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const cartItemCount = cartItems.reduce(
        (total, item) => total + item.Quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartItem,
                clearCart,
                isLoading,
                error,
                cartItemCount,
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
