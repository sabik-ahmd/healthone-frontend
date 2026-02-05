import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { clearCart } from "../redux/cartSlice";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Truck,
  Package,
  CreditCard,
  MapPin,
  User,
  Phone,
  Home,
  Building,
  MapPin as Pin,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";

/* ================= RAZORPAY LOADER ================= */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ================= PRICE FORMAT ================= */
const formatPrice = (value) => `₹${value.toLocaleString()}`;

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.items || []);
  const user = useSelector((state) => state.auth?.user || {});

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [saveAddress, setSaveAddress] = useState(true);

  const [address, setAddress] = useState({
    name: user.name || "",
    phone: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    type: "home" // home, work, other
  });

  const [savedAddresses] = useState([
    {
      id: 1,
      type: "home",
      name: "John Doe",
      phone: "+91 98765 43210",
      street: "123 Healthcare Street",
      landmark: "Near Apollo Hospital",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      isDefault: true
    },
    {
      id: 2,
      type: "work",
      name: "John Doe",
      phone: "+91 98765 43211",
      street: "456 Medical Center",
      landmark: "5th Floor, Tower B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400002",
      isDefault: false
    }
  ]);

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  const shipping = cartItems.length === 0 ? 0 : subtotal > 999 ? 0 : 49;
  const convenienceFee = 10;
  const total = subtotal + shipping + convenienceFee;

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isAddressValid = Object.values(address).every(
    (v) => v.toString().trim() !== ""
  );

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr.id);
    setAddress({
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      landmark: addr.landmark,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      type: addr.type
    });
  };

  const paymentMethods = [
    { id: "razorpay", name: "Credit/Debit Card", icon: "💳", description: "Pay with Visa, Mastercard, RuPay" },
    { id: "upi", name: "UPI", icon: "📱", description: "Google Pay, PhonePe, Paytm" },
    { id: "netbanking", name: "Net Banking", icon: "🏦", description: "All major banks supported" },
    { id: "cod", name: "Cash on Delivery", icon: "💵", description: "Pay when you receive" }
  ];

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    if (!isAddressValid) {
      alert("Please fill all address fields");
      return;
    }

    if (!cartItems.length) return;

    if (selectedPayment === "cod") {
      // Handle COD order
      try {
        setLoading(true);
        const orderRes = await fetch("http://localhost:5000/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            address,
            paymentMethod: "cod",
            totalAmount: total
          })
        });

        const data = await orderRes.json();
        
        if (data.success) {
          dispatch(clearCart());
          navigate(`/order/${data.orderId}`, { replace: true });
        }
      } catch (error) {
        alert("Order creation failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Razorpay payment flow
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Payment SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await fetch(
        "http://localhost:5000/api/payment/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total * 100 }),
        }
      );

      const order = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_key",
        amount: order.amount,
        currency: "INR",
        name: "HealthOne+",
        description: "Healthcare Order Payment",
        order_id: order.id,
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user.email || ""
        },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          const verifyRes = await fetch(
            "http://localhost:5000/api/payment/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                cartItems,
                address,
                paymentMethod: selectedPayment,
                totalAmount: total,
              }),
            }
          );

          const data = await verifyRes.json();

          if (data.success) {
            dispatch(clearCart());
            navigate(`/order/${data.orderId}`, { replace: true });
          } else {
            alert("Payment verification failed");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EMPTY CART ================= */
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 flex items-center justify-center">
              <Package className="w-16 h-16 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add healthcare products to your cart before proceeding to checkout.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Shopping
              </Link>
              
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Link>
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Secure Checkout</h1>
              <p className="text-blue-100">
                Complete your healthcare order with confidence
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Secure & Encrypted</span>
              </div>
              <Link
                to="/cart"
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Address</span>
            </div>
            
            <div className={`w-20 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            
            <div className={`w-20 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                  <p className="text-sm text-gray-600">Where should we deliver your healthcare essentials?</p>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Select from saved addresses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {savedAddresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => handleAddressSelect(addr)}
                      className={`p-4 rounded-xl border cursor-pointer transition ${
                        selectedAddress === addr.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {addr.type === 'home' ? <Home className="w-4 h-4 text-blue-600" /> : 
                             addr.type === 'work' ? <Building className="w-4 h-4 text-blue-600" /> :
                             <MapPin className="w-4 h-4 text-blue-600" />}
                          </div>
                          <span className="font-medium capitalize">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Address */}
              <h3 className="font-semibold text-gray-900 mb-4">Or add a new address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Full Name", icon: <User className="w-5 h-5" /> },
                  { name: "phone", label: "Phone Number", icon: <Phone className="w-5 h-5" /> },
                  { name: "street", label: "Street Address", icon: <MapPin className="w-5 h-5" />, colSpan: "md:col-span-2" },
                  { name: "landmark", label: "Landmark", icon: <Pin className="w-5 h-5" /> },
                  { name: "city", label: "City", icon: <Building className="w-5 h-5" /> },
                  { name: "state", label: "State", icon: <MapPin className="w-5 h-5" /> },
                  { name: "pincode", label: "Pincode", icon: <Pin className="w-5 h-5" /> },
                ].map((field) => (
                  <div key={field.name} className={field.colSpan || ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {field.icon}
                      </div>
                      <input
                        name={field.name}
                        value={address[field.name]}
                        placeholder={field.label}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Address Type */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Address Type</label>
                <div className="flex gap-4">
                  {["home", "work", "other"].map(type => (
                    <button
                      key={type}
                      onClick={() => setAddress(prev => ({ ...prev, type }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border capitalize ${
                        address.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type === 'home' ? <Home className="w-4 h-4" /> :
                       type === 'work' ? <Building className="w-4 h-4" /> :
                       <MapPin className="w-4 h-4" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save Address Checkbox */}
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="saveAddress"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700">
                  Save this address for future orders
                </label>
              </div>
            </motion.div>

            {/* Payment Method Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-600">Choose your preferred payment option</p>
                </div>
              </div>

              <div className="space-y-3">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Security Note */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Secure Payment Processing</p>
                    <p className="text-xs text-blue-700">Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                        <p className="font-bold text-blue-600">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
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
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !isAddressValid}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Place Secure Order</span>
                  </>
                )}
              </button>

              {/* Healthcare Assurance */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Doctor verified products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Same-day delivery available</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <RotateCcw className="w-4 h-4 text-purple-500" />
                  <span>7-day easy returns</span>
                </div>
              </div>

              {/* Need Help */}
              <div className="mt-6 text-center">
                <Link to="/help" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                  <AlertCircle className="w-4 h-4" />
                  Need help with your order?
                </Link>
              </div>
            </div>

            {/* Prescription Note */}
            {cartItems.some(item => item.prescriptionRequired) && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-900 mb-1">Prescription Required</h4>
                    <p className="text-sm text-yellow-700">
                      Some items in your cart require a valid prescription. Please upload it after placing your order.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;