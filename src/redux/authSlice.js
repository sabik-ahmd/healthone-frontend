// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

/* ================= SAFE STORAGE HELPERS ================= */
const loadUser = () => {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (err) {
        localStorage.removeItem("user");
        return null;
    }
};

const loadToken = () => {
    try {
        return localStorage.getItem("token") || null;
    } catch (err) {
        localStorage.removeItem("token");
        return null;
    }
};

/* ================= INITIAL STATE ================= */
const initialState = {
    user: loadUser(),
    token: loadToken(),
    loading: false,
    error: null,
};

/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
    "auth/login",
    async(credentials, thunkAPI) => {
        try {
            const response = await api.post("/auth/login", credentials);
            const data = response.data;

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message ?
                err.response.data.message :
                "Login failed"
            );
        }
    }
);

/* ================= REGISTER ================= */
export const registerUser = createAsyncThunk(
    "auth/register",
    async(credentials, thunkAPI) => {
        try {
            const response = await api.post("/auth/register", credentials);
            const data = response.data;

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", data.token);

            return data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err &&
                err.response &&
                err.response.data &&
                err.response.data.message ?
                err.response.data.message :
                "Registration failed"
            );
        }
    }
);

/* ================= SLICE ================= */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

/* ================= EXPORT ================= */
export const { logout } = authSlice.actions;
export default authSlice.reducer;