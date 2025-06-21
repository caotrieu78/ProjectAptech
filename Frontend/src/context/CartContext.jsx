
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (variant, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.variant.VariantID === variant.VariantID);
            if (existing) {
                return prev.map(item =>
                    item.variant.VariantID === variant.VariantID
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { variant, quantity }];
        });
    };

    const removeFromCart = id => {
        setCartItems(prev => prev.filter(item => item.variant.VariantID !== id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};