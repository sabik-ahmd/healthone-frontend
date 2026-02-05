import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import wishlistReducer from "./wishlistSlice";

const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        auth: authReducer,
        wishlist: wishlistReducer,
    },
    devTools: import.meta.env.MODE !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;