import React, { createContext, useState, useCallback, useEffect } from "react";
import CartService from "../services/CartService";
import Swal from "sweetalert2";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setCartItems([]); // Reset cart if no token
      setError(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await CartService.getAll();
      setCartItems(data || []);
      setError(null);
    } catch (err) {
      console.error("Error loading cart:", err.message);
      setError("Unable to load cart.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const resetCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const addToCart = useCallback(
    async (variant, quantity = 1) => {
      try {
        if (quantity <= 0) {
          throw new Error("Quantity must be greater than 0.");
        }

        if (quantity > variant.StockQuantity) {
          throw new Error(
            `Only ${variant.StockQuantity} items available in stock!`
          );
        }

        const existingItem = cartItems.find(
          (item) => item.VariantID === variant.VariantID
        );
        const currentQuantity = existingItem ? existingItem.Quantity : 0;
        const totalRequestedQuantity = currentQuantity + quantity;

        if (totalRequestedQuantity > variant.StockQuantity) {
          throw new Error(
            `Total requested quantity (${totalRequestedQuantity}) exceeds available stock (${variant.StockQuantity})!`
          );
        }

        await CartService.addItem(variant.VariantID, quantity);
        await fetchCart();

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Added to cart!",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("Error adding to cart:", err.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          timer: 2000,
          showConfirmButton: false
        });
        throw err;
      }
    },
    [cartItems, fetchCart]
  );

  const removeFromCart = useCallback(
    async (variantId) => {
      try {
        await CartService.removeItem(variantId);
        await fetchCart();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          timer: 2000,
          showConfirmButton: false
        });
      }
    },
    [fetchCart]
  );

  const updateCartItem = useCallback(
    async (variantId, quantity) => {
      try {
        if (quantity <= 0) {
          throw new Error("Quantity must be greater than 0.");
        }

        const item = cartItems.find((item) => item.VariantID === variantId);
        if (!item) {
          throw new Error("Item does not exist in cart.");
        }

        if (quantity > item.StockQuantity) {
          throw new Error(
            `Only ${item.StockQuantity} items available in stock!`
          );
        }

        await CartService.updateItem(variantId, quantity);
        await fetchCart();
      } catch (err) {
        console.error("Error updating cart:", err.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message,
          timer: 2000,
          showConfirmButton: false
        });
      }
    },
    [cartItems, fetchCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await CartService.clearCart();
      setCartItems([]);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
        timer: 2000,
        showConfirmButton: false
      });
    }
  }, []);

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
        resetCart,
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
