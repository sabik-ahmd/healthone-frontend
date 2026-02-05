// src/utils/api.js (Corrected version)
import axios from 'axios';

// Get environment variables with fallbacks
const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ENV =
    import.meta.env.VITE_ENV || 'development';

console.log('🌍 API Base URL:', API_BASE_URL);
console.log('🚀 Environment:', ENV);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - add auth token and handle retries
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracking
        config.headers['X-Request-ID'] = Date.now();

        // Log request in development
        if (ENV === 'development') {
            console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, config.params || '');
        }

        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors, retries, and token refresh
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (ENV === 'development') {
            console.log(`📥 ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
    },
    async(error) => {
        const originalRequest = error.config;

        // Log error
        if (ENV === 'development') {
            console.error('API Error:', {
                url: error.config ? error.config.url : 'unknown',
                method: error.config ? error.config.method : 'unknown',
                status: error.response ? error.response.status : 'no response',
                data: error.response ? error.response.data : 'no data',
                message: error.message,
            });
        }

        // Handle 401 Unauthorized (token expired)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken: refreshToken
                    });

                    const responseData = response.data;
                    const newToken = responseData.token;
                    const newRefreshToken = responseData.refreshToken;

                    // Store new tokens
                    localStorage.setItem('token', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Update auth header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');

                // Redirect to login page
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login?session=expired';
                }
                return Promise.reject(refreshError);
            }
        }

        // Handle 429 Too Many Requests with retry
        if (error.response && error.response.status === 429 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Wait for retry-after header or default 5 seconds
            const retryAfter = error.response.headers['retry-after'] || 5;

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(api(originalRequest));
                }, retryAfter * 1000);
            });
        }

        // Handle network errors with retry
        if (!error.response && !originalRequest._retry && originalRequest.method === 'get') {
            originalRequest._retry = true;

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(api(originalRequest));
                }, 1000);
            });
        }

        // Handle other errors
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 400:
                    error.message = data.message || 'Bad Request';
                    break;
                case 403:
                    error.message = data.message || 'Forbidden';
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login?error=unauthorized';
                    break;
                case 404:
                    error.message = data.message || 'Resource not found';
                    break;
                case 422:
                    error.message = data.message || 'Validation failed';
                    break;
                case 500:
                    error.message = 'Server error. Please try again later.';
                    break;
                case 502:
                case 503:
                case 504:
                    error.message = 'Service temporarily unavailable. Please try again.';
                    break;
                default:
                    error.message = data.message || `Error ${status}`;
            }
        } else if (error.request) {
            // Request made but no response
            error.message = 'Network error. Please check your connection.';
        } else {
            // Something happened in setting up the request
            error.message = error.message || 'Request error';
        }

        // Show user-friendly error message (optional)
        if (ENV === 'production' && error.message && !originalRequest._silent) {
            // You could integrate with a notification system here
            console.error('User-facing error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API Helper Functions
const apiHelpers = {
    // Safe API call with error handling
    async safeCall(apiFunction, options) {
        const silent = options && options.silent ? options.silent : false;
        const defaultReturn = options && options.defaultReturn ? options.defaultReturn : null;

        try {
            const response = await apiFunction();
            return response.data;
        } catch (error) {
            if (!silent) {
                console.error('API call failed:', error.message);
            }
            return defaultReturn;
        }
    },

    // File upload helper
    async uploadFile(file, endpoint, onProgress) {
        const formData = new FormData();
        formData.append('file', file);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };

        if (onProgress) {
            config.onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            };
        }

        return api.post(endpoint, formData, config);
    },

    // Batch request helper
    async batchRequests(requests) {
        return Promise.allSettled(requests.map(request =>
            api(request).then(response => response.data)
        ));
    },
};

// Wishlist API Functions
const wishlistAPI = {
    // Get user's wishlist
    getWishlist: function() {
        return api.get('/users/wishlist');
    },

    // Add to wishlist
    addToWishlist: function(productId) {
        return api.post('/users/wishlist', { productId: productId });
    },

    // Remove from wishlist
    removeFromWishlist: function(productId) {
        return api.delete(`/users/wishlist/${productId}`);
    },

    // Check if product is in wishlist
    checkInWishlist: function(productId) {
        return api.get(`/users/wishlist/check/${productId}`);
    },

    // Bulk operations
    addMultipleToWishlist: function(productIds) {
        return api.post('/users/wishlist/bulk', { productIds: productIds });
    },

    removeMultipleFromWishlist: function(productIds) {
        return api.delete('/users/wishlist/bulk', { data: { productIds: productIds } });
    },
};

// Product API Functions
const productAPI = {
    getProducts: function(params) {
        if (!params) params = {};
        return api.get('/products', { params: params });
    },

    getProduct: function(id) {
        return api.get(`/products/${id}`);
    },

    getRelatedProducts: function(id) {
        return api.get(`/products/${id}/related`);
    },

    searchProducts: function(query, params) {
        if (!params) params = {};
        return api.get(`/products/search/${query}`, { params: params });
    },
};

// Cart API Functions
const cartAPI = {
    getCart: function() {
        return api.get('/cart');
    },

    addToCart: function(data) {
        return api.post('/cart', data);
    },

    updateCartItem: function(itemId, data) {
        return api.put(`/cart/${itemId}`, data);
    },

    removeFromCart: function(itemId) {
        return api.delete(`/cart/${itemId}`);
    },

    clearCart: function() {
        return api.delete('/cart');
    },
};

// User API Functions
const userAPI = {
    getProfile: function() {
        return api.get('/users/profile');
    },

    updateProfile: function(data) {
        return api.put('/users/profile', data);
    },

    updateAddress: function(addressId, data) {
        return api.put(`/users/addresses/${addressId}`, data);
    },

    deleteAddress: function(addressId) {
        return api.delete(`/users/addresses/${addressId}`);
    },

    addAddress: function(data) {
        return api.post('/users/addresses', data);
    },

    getOrders: function() {
        return api.get('/users/orders');
    },

    getOrder: function(orderId) {
        return api.get(`/users/orders/${orderId}`);
    },
};

// Auth API Functions
const authAPI = {
    login: function(credentials) {
        return api.post('/auth/login', credentials);
    },

    register: function(userData) {
        return api.post('/auth/register', userData);
    },

    logout: function() {
        return api.post('/auth/logout');
    },

    verifyToken: function() {
        return api.get('/auth/verify');
    },

    forgotPassword: function(email) {
        return api.post('/auth/forgot-password', { email: email });
    },

    resetPassword: function(token, password) {
        return api.post('/auth/reset-password', { token: token, password: password });
    },
};

// Utility function to test connection
const testConnection = async function() {
    try {
        const startTime = Date.now();
        const response = await api.get('/health');
        const endTime = Date.now();

        return {
            success: true,
            status: response.status,
            latency: endTime - startTime,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

// Export everything
export default api;
export {
    apiHelpers,
    wishlistAPI,
    productAPI,
    cartAPI,
    userAPI,
    authAPI,
    testConnection
};