"use client";
import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: string;
    priceNum: number;
    quantity: number;
    image: string;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: number }
    | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
    | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.items.find((item) => item.id === action.payload.id);
            if (existing) {
                return {
                    items: state.items.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return { items: [...state.items, { ...action.payload, quantity: 1 }] };
        }
        case "REMOVE_ITEM":
            return { items: state.items.filter((item) => item.id !== action.payload) };
        case "UPDATE_QUANTITY":
            if (action.payload.quantity <= 0) {
                return { items: state.items.filter((item) => item.id !== action.payload.id) };
            }
            return {
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case "CLEAR_CART":
            return { items: [] };
        default:
            return state;
    }
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getTotalFormatted: () => string;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
    });

    const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
        dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
    }, []);

    const removeFromCart = useCallback((id: number) => {
        dispatch({ type: "REMOVE_ITEM", payload: id });
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: "CLEAR_CART" });
    }, []);

    const getTotal = useCallback(() => {
        return state.items.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
    }, [state.items]);

    const getTotalFormatted = useCallback(() => {
        return getTotal().toLocaleString("uz-UZ");
    }, [getTotal]);

    const getItemCount = useCallback(() => {
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
    }, [state.items]);

    const value = useMemo(() => ({
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalFormatted,
        getItemCount,
    }), [state.items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getTotalFormatted, getItemCount]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
