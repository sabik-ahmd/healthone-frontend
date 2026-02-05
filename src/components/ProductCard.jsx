import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Eye,
  Minus,
  Plus,
  Shield,
  Star,
  Package,
  Truck,
  CheckCircle,
  X,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { wishlistAPI } from "../utils/api";

function ProductCard({ product, loading = false, viewMode = "grid" }) {
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistCheckLoading, setWishlistCheckLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to check if user is authenticated
  const checkUserAuthentication = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      return {
        isAuthenticated: false,
        message: 'Please login to use wishlist'
      };
    }
    
    return {
      isAuthenticated: true,
      user: JSON.parse(user)
    };
  };

  // Debug logging
  useEffect(() => {
    console.log('🛒 ProductCard mounted:', {
      productId: product?._id,
      productName: product?.name,
      isInWishlist,
      userLoggedIn: !!localStorage.getItem('token')
    });
  }, [product, isInWishlist]);

  // Check if product is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product?._id) return;
      
      // Check if user is logged in first
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistCheckLoading(false);
        return; // Don't check if not logged in
      }
      
      try {
        console.log('🔍 Checking wishlist status for product:', product._id);
        const response = await wishlistAPI.checkInWishlist(product._id);
        console.log('Wishlist check response:', response.data);
        setIsInWishlist(response.data.isInWishlist || false);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
        
        // Don't show alert for check status, it's just for UI
        // Only log the error
        if (error.response?.status === 401) {
          console.log('User not authenticated for wishlist check');
        }
      } finally {
        setWishlistCheckLoading(false);
      }
    };

    checkWishlistStatus();
  }, [product?._id]);

  /* ================= SKELETON LOADING ================= */
  if (loading) {
    return viewMode === "list" ? (
      <div className="flex gap-4 bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
        <div className="w-32 h-32 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-xl border border-gray-200 animate-pulse overflow-hidden">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const stock = product.countInStock ?? 10;
  const outOfStock = stock === 0;
  const hasOffer =
    product.originalPrice && product.originalPrice > product.price;
  const discount =
    hasOffer &&
    Math.round(
      ((product.originalPrice - product.price) /
        product.originalPrice) *
        100
    );

  const handleAddToCart = () => {
    if (outOfStock) return;
    dispatch(addToCart({ ...product, qty }));
  };

  const increaseQty = () =>
    setQty((q) => Math.min(stock, q + 1));
  const decreaseQty = () =>
    setQty((q) => Math.max(1, q - 1));

  const handleWishlistToggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (wishlistLoading || !product?._id) return;
    
    // Check if user is logged in
    const authCheck = checkUserAuthentication();
    if (!authCheck.isAuthenticated) {
      alert(authCheck.message);
      
      // Store current page to return after login
      localStorage.setItem('redirectUrl', window.location.pathname);
      window.location.href = '/login';
      return;
    }
    
    setWishlistLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Toggling wishlist for product:', product._id);
      console.log('Product ID:', product._id);
      
      if (isInWishlist) {
        console.log('Removing from wishlist...');
        await wishlistAPI.removeFromWishlist(product._id);
        setIsInWishlist(false);
        console.log('✅ Removed from wishlist');
      } else {
        console.log('Adding to wishlist...');
        await wishlistAPI.addToWishlist(product._id);
        setIsInWishlist(true);
        console.log('✅ Added to wishlist');
      }
    } catch (error) {
      console.error('❌ Wishlist error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Better error messages
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response?.status === 404) {
        alert('Wishlist service is currently unavailable. Please try again later.');
      } else if (error.response?.status === 500) {
        alert('Server error. Please try again in a few moments.');
      } else {
        alert(error.response?.data?.message || 'Failed to update wishlist. Please try again.');
      }
      
      setError(error.message);
    } finally {
      setWishlistLoading(false);
    }
  };

  const getWishlistButton = () => {
    const token = localStorage.getItem('token');
    
    // If not logged in, show grey heart
    if (!token && !wishlistLoading) {
      return (
        <Heart 
          className="w-5 h-5 text-gray-300" 
          title="Login to use wishlist"
        />
      );
    }
    
    if (wishlistLoading) {
      return (
        <div className="w-5 h-5">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      );
    }
    
    return (
      <Heart 
        className={`w-5 h-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      />
    );
  };

  // LIST VIEW LAYOUT
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Image Section */}
          <Link to={`/product/${product._id}`} className="sm:w-1/3">
            <div className="relative h-48 sm:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {hasOffer && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                    {discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
                    NEW
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading || wishlistCheckLoading}
                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white hover:scale-110 transition-all duration-200"
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistCheckLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : (
                  getWishlistButton()
                )}
              </button>
            </div>
          </Link>

          {/* Content Section */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (product.rating || 4)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading || wishlistCheckLoading}
                  className={`p-2 rounded-lg hover:bg-gray-100 transition ${
                    isInWishlist ? "text-red-500 bg-red-50" : "text-gray-400"
                  } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {getWishlistButton()}
                </button>
                <button
                  onClick={() => setQuickView(true)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-3 line-clamp-2">
              {product.description || "High-quality healthcare product from verified sources"}
            </p>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-600">
                  ₹{product.price}
                </span>
                {hasOffer && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock & Actions */}
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className={`font-medium ${outOfStock ? "text-red-600" : "text-green-600"}`}>
                    {outOfStock ? "Out of Stock" : `${stock} in stock`}
                  </span>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQty}
                    disabled={qty === 1}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1.5 min-w-[40px] text-center font-medium">
                    {qty}
                  </span>
                  <button
                    onClick={increaseQty}
                    disabled={qty === stock}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40 rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT (Default)
  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {hasOffer && (
              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                {discount}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
                NEW
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading || wishlistCheckLoading}
              className={`p-2 rounded-full bg-white shadow-lg hover:scale-110 transition ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""} ${
                isInWishlist ? "text-red-500 bg-red-50" : "text-gray-600"
              }`}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              {getWishlistButton()}
            </button>
            <button
              onClick={() => setQuickView(true)}
              className="p-2 rounded-full bg-white shadow-lg text-gray-600 hover:scale-110 transition"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Always visible wishlist button on mobile */}
          <button
            onClick={handleWishlistToggle}
            disabled={wishlistLoading || wishlistCheckLoading}
            className={`absolute top-3 right-3 md:hidden p-2 rounded-full bg-white shadow-lg ${
              isInWishlist ? "text-red-500 bg-red-50" : "text-gray-600"
            } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {getWishlistButton()}
          </button>

          {/* Out of Stock Overlay */}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold bg-red-600 px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h3 className="font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2 h-12">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">{product.category}</span>
            
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{product.rating || 4.0}</span>
            </div>
          </div>

          {/* Healthcare Features */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Shield className="w-3 h-3 text-green-500" />
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Package className="w-3 h-3 text-blue-500" />
              <span>Genuine</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Truck className="w-3 h-3 text-purple-500" />
              <span>Fast Delivery</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">
                ₹{product.price}
              </span>
              {hasOffer && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {outOfStock ? "Currently unavailable" : `${stock} units available`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={decreaseQty}
                disabled={qty === 1}
                className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 min-w-[32px] text-center font-medium">
                {qty}
              </span>
              <button
                onClick={increaseQty}
                disabled={qty === stock}
                className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================= QUICK VIEW MODAL ================= */}
      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setQuickView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading || wishlistCheckLoading}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition ${
                      isInWishlist ? "text-red-500 bg-red-50" : "text-gray-400"
                    } ${wishlistLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {getWishlistButton()}
                  </button>
                  <button
                    onClick={() => setQuickView(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2 gap-8 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                {/* Left - Image */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-contain"
                    />
                  </div>
                  
                  {/* Healthcare Assurance */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Healthcare Assurance
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Doctor verified product</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>From licensed pharmacy</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Secure & safe delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Details */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-500">{product.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{product.rating || 4.0}</span>
                      <span className="text-gray-500">({product.reviews || 0} reviews)</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-blue-600">₹{product.price}</span>
                      {hasOffer && (
                        <>
                          <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                          <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg">
                            Save {discount}%
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-green-600 font-medium">
                      {outOfStock ? "Out of Stock" : `${stock} units available`}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">
                      {product.description || "This healthcare product is verified for quality and safety by our medical team. It meets all regulatory standards and is sourced from trusted suppliers."}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3">Quantity</h4>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={decreaseQty}
                          disabled={qty === 1}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-6 py-2 min-w-[60px] text-center text-lg font-bold">
                          {qty}
                        </span>
                        <button
                          onClick={increaseQty}
                          disabled={qty === stock}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <span className="text-gray-600">
                        Maximum: {stock} units
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        handleAddToCart();
                        setQuickView(false);
                      }}
                      disabled={outOfStock}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3.5 rounded-lg font-bold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50"
                    >
                      <ShoppingCart className="w-6 h-6" />
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-3.5 rounded-lg font-bold hover:bg-blue-50 transition"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProductCard;