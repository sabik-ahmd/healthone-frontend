import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Stethoscope,
  Heart,
  ArrowRight,
  Smartphone,
  UserPlus
} from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error } = useSelector((state) => state.auth || {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ WHERE TO GO AFTER LOGIN
  const redirectTo = location.state?.from || "/";

  /* ================= REDIRECT AFTER LOGIN ================= */
  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate email
    if (!email || !email.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    dispatch(loginUser({ email, password, rememberMe }));
  };

  // Demo login for testing
  const handleDemoLogin = () => {
    setEmail("demo@healthoneplus.com");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Left Side - Healthcare Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-teal-600 text-white p-12">
        <div className="max-w-lg mx-auto flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">HealthOne+</h1>
              <p className="text-blue-100">Healthcare MadeSimple & Reliable</p>
            </div>
          </div>

          {/* Healthcare Message */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-4xl font-bold mb-4">
              Welcome to Your Health Journey
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed">
              Access genuine medicines, doctor consultations, and healthcare essentials 
              from trusted pharmacies. Your health is our priority.
            </p>
          </motion.div>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Doctor Verified Products",
                desc: "All products verified by medical professionals"
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "Secure & Private",
                desc: "Your health data is protected with encryption"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Licensed Pharmacy",
                desc: "Medicines sourced from certified pharmacies"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                  <p className="text-blue-100/80">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* App Download */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-lg font-medium mb-3">Also available on mobile</p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition">
                <Smartphone className="w-5 h-5" />
                <span>Get the Web</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">HealthOne+</h1>
              <p className="text-gray-600">Healthcare MadeSimple</p>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your healthcare dashboard
              </p>
            </div>

            {/* Demo Button */}
            <button
              onClick={handleDemoLogin}
              className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 text-blue-700 rounded-xl font-medium hover:from-blue-100 hover:to-teal-100 transition"
            >
              <UserPlus className="w-5 h-5" />
              Try Demo Account
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or sign in with credentials
                </span>
              </div>
            </div>

            {/* Error Messages */}
            {formError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{formError}</span>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-700 cursor-pointer"
                >
                  Remember me on this device
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing you in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
                  >
                    Create an account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </p>
              </div>

              {/* Terms & Privacy */}
              <p className="text-center text-xs text-gray-500 mt-4">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Healthcare Trust Badge */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Your health information is encrypted and secure
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}