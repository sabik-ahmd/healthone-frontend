import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Shield, 
  Truck, 
  Clock, 
  Package,
  ArrowRight,
  Home,
  Tag,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X,
  Heart,
  RotateCcw,
  Gift
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ================= HELPERS ================= */
const formatPrice = (value) => `₹${value.toLocaleString()}`;

/* ================= SKELETON ================= */
function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse"
        >
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector((state) => state.cart?.items || []);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [suggestedProducts] = useState([
    { id: 1, name: "Vitamin C Tablets", price: 299, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae" },
    { id: 2, name: "Face Masks (Pack of 50)", price: 199, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa" },
    { id: 3, name: "First Aid Kit", price: 599, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56" }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  /* ================= PRICE CALCULATION ================= */
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const shipping = items.length === 0 ? 0 : subtotal > 999 ? 0 : 49;
  const convenienceFee = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping + convenienceFee - discount;

  /* ================= SINGLE COUPON ================= */
  // Only one coupon available: HEALTH10 - ₹50 off on orders above ₹500
  const COUPON = {
    code: "HEALTH10",
    discount: 50,
    minOrderValue: 500,
    description: "₹50 off on orders above ₹500",
    active: true
  };

  const handleApplyCoupon = () => {
    // Reset messages
    setCouponError("");
    setCouponSuccess("");
    
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    // Check if coupon matches
    if (couponCode.toUpperCase() !== COUPON.code) {
      setCouponError("Invalid coupon code");
      return;
    }

    if (!COUPON.active) {
      setCouponError("This coupon is no longer active");
      return;
    }

    // Check minimum order value
    if (subtotal < COUPON.minOrderValue) {
      setCouponError(`This coupon requires minimum order of ₹${COUPON.minOrderValue}`);
      return;
    }

    // Apply discount
    setDiscount(COUPON.discount);
    setCouponSuccess(`Coupon applied! You saved ₹${COUPON.discount}`);
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    setCouponError("");
    setCouponSuccess("");
  };

  /* ================= EMPTY CART ================= */
  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Healthcare Cart is Empty
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any healthcare products yet. 
              Browse our verified medicines and essentials.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition shadow-lg"
              >
                <Package className="w-5 h-5" />
                Browse Healthcare Products
              </Link>
              
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>

          {/* Suggested Products */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {suggestedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
                  <div className="h-40 bg-gray-100 rounded-lg mb-4"></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">{formatPrice(product.price)}</span>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Healthcare Cart</h1>
              <p className="text-blue-100">
                Review your medical essentials before checkout
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Package className="w-5 h-5" />
                <span className="font-medium">{items.length} items</span>
              </div>
              <Link
                to="/shop"
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
              >
                <ArrowRight className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items Section */}
          <div className="lg:col-span-2">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                <p className="text-sm text-gray-600">Review and manage your healthcare essentials</p>
              </div>
              
              {loading ? (
                <div className="p-6">
                  <CartSkeleton />
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6"
                      >
                        <div className="flex flex-col sm:flex-row gap-6">
                          {/* Product Image */}
                          <div className="sm:w-32 sm:h-32 w-full h-48">
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-contain p-4"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                                
                                {/* Healthcare Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    Doctor Verified
                                  </span>
                                  {item.prescriptionRequired && (
                                    <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded-full">
                                      <AlertCircle className="w-3 h-3" />
                                      Prescription Required
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xl font-bold text-blue-600 mb-2">
                                  {formatPrice(item.price * item.qty)}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {formatPrice(item.price)} × {item.qty}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => dispatch(decreaseQty(item._id))}
                                    disabled={item.qty === 1}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="px-4 py-2 min-w-[48px] text-center font-bold">
                                    {item.qty}
                                  </span>
                                  <button
                                    onClick={() => dispatch(increaseQty(item._id))}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => dispatch(removeFromCart(item._id))}
                                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Remove</span>
                                  </button>
                                  <button className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-sm font-medium">Save</span>
                                  </button>
                                </div>
                              </div>

                              {/* Stock Status */}
                              <div className="text-sm">
                                <span className={`font-medium ${item.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {item.countInStock > 0 ? `In Stock (${item.countInStock} available)` : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Clear Cart Confirmation Modal */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                  onClick={() => setShowClearConfirm(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Clear Your Cart?</h3>
                        <p className="text-gray-600 text-sm">All items will be removed from your cart.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          dispatch(clearCart());
                          setShowClearConfirm(false);
                        }}
                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Healthcare Assurance */}
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Safe & Secure</h4>
                    <p className="text-sm text-gray-600">100% genuine products</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">Same-day in metros</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <RotateCcw className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Easy Returns</h4>
                    <p className="text-sm text-gray-600">7-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Convenience Fee</span>
                  <span className="font-bold">{formatPrice(convenienceFee)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount (HEALTH10)</span>
                    <span className="font-bold">-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Inclusive of all taxes</p>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Apply Coupon</h3>
                </div>
                
                {/* Available Coupon Info */}
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-green-700">HEALTH10</span>
                    <span className="text-sm text-green-600">•</span>
                    <span className="text-sm text-green-600">₹50 off</span>
                  </div>
                  <p className="text-sm text-green-600">
                    Valid on orders above ₹500
                  </p>
                </div>
                
                {/* Coupon Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                      setCouponSuccess("");
                    }}
                    placeholder="Enter HEALTH10"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={discount > 0}
                  />
                  {discount === 0 ? (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {/* Messages */}
                {couponError && (
                  <p className="text-sm text-red-600 mt-2">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-sm text-green-600 mt-2">{couponSuccess}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/checkout")}
                  disabled={items.length === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Shield className="w-5 h-5" />
                  Proceed to Secure Checkout
                </button>
                
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear Cart
                </button>
                
                <Link
                  to="/shop"
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <ArrowRight className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">🔒 Secure Payment</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">🏥 Licensed Pharmacy</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">🚚 Fast Delivery</span>
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: 2-4 business days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Prescription required items marked clearly</span>
                </div>
                <Link to="/help" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  <span>Contact Healthcare Support</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;