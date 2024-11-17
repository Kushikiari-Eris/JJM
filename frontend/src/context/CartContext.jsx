// CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // cartItemCount is derived from cartItems length
    const cartItemCount = cartItems.length;

    const addItemToCart = (item) => {
        setCartItems((prevItems) => [...prevItems, item]);
    };

    const removeItemFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter(item => item._id !== itemId));
    };

    const resetCart = () => {
        setCartItems([]); // Reset cart items
    };

    return (
        <CartContext.Provider value={{ cartItems, setCartItems, cartItemCount, addItemToCart, removeItemFromCart, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => useContext(CartContext);
