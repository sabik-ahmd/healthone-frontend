import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const item = action.payload;
            const existing = state.items.find(
                (i) => i._id === item._id
            );

            if (existing) {
                existing.qty += 1;
            } else {
                state.items.push({...item, qty: item.qty || 1 });
            }
        },

        increaseQty(state, action) {
            const item = state.items.find(
                (i) => i._id === action.payload
            );
            if (!item) return;
            item.qty += 1;
        },

        decreaseQty(state, action) {
            const item = state.items.find(
                (i) => i._id === action.payload
            );
            if (!item) return;
            if (item.qty > 1) item.qty -= 1;
        },

        removeFromCart(state, action) {
            state.items = state.items.filter(
                (item) => item._id !== action.payload
            );
        },

        clearCart(state) {
            state.items = [];
        },
    },
});

export const {
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;