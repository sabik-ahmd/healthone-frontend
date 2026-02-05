import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

/* ================= FALLBACK DEV DATA ================= */
const TEMP_PRODUCTS = [{
        _id: "1",
        name: "Paracetamol 500mg",
        price: 45,
        originalPrice: 60,
        category: "Medicines",
        image: "https://via.placeholder.com/300",
        countInStock: 25,
        isNew: true,
        description: "Effective pain relief and fever reducer.",
    },
    {
        _id: "2",
        name: "Baby Lotion",
        price: 199,
        originalPrice: 249,
        category: "Baby Care",
        image: "https://via.placeholder.com/300",
        countInStock: 12,
        isNew: false,
        description: "Gentle moisturizing lotion for baby skin.",
    },
    {
        _id: "3",
        name: "Digital Thermometer",
        price: 299,
        originalPrice: 399,
        category: "Devices",
        image: "https://via.placeholder.com/300",
        countInStock: 0,
        isNew: false,
        description: "Fast and accurate temperature measurement.",
    },
    {
        _id: "4",
        name: "Vitamin C Tablets",
        price: 499,
        originalPrice: 699,
        category: "Nutrition",
        image: "https://via.placeholder.com/300",
        countInStock: 30,
        isNew: true,
        description: "Boost immunity with daily vitamin C.",
    },
];

/* ================= FETCH PRODUCTS ================= */
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async(_, thunkAPI) => {
        try {
            const { data } = await api.get("/products");
            return data;
        } catch (err) {
            console.warn("⚠️ Backend not available, using fallback products");
            return TEMP_PRODUCTS;
        }
    }
);

/* ================= INITIAL STATE ================= */
const initialState = {
    list: [], // ✅ CONSISTENT KEY
    loading: false,
    error: null,
};

/* ================= SLICE ================= */
const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

        /* ---------- FETCH PRODUCTS ---------- */
            .addCase(fetchProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.list = action.payload; // ✅ FIXED
        })

        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error =
                action.payload ||
                action.error.message ||
                "Failed to load products";
        });
    },
});

export default productSlice.reducer;