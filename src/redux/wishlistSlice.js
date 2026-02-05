import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: [],
    },
    reducers: {
        addToWishlist(state, action) {
            const exists = state.items.find(
                (i) => i._id === action.payload._id
            );
            if (!exists) state.items.push(action.payload);
        },
        removeFromWishlist(state, action) {
            state.items = state.items.filter(
                (i) => i._id !== action.payload
            );
        },
        clearWishlist(state) {
            state.items = [];
        },
    },
});

export const {
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;