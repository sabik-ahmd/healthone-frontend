import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Heart,
  Package,
  Search,
  Home,
  Stethoscope,
  Shield,
  Truck,
  ChevronDown,
  MessageSquare,
  MapPin
} from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= SAFE REDUX ================= */
  const auth = useSelector((state) => state.auth ?? {});
  const cartItems = useSelector((state) => state.cart?.items ?? []);
  const user = auth.user ?? null;

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.qty || 0), 0),
    [cartItems]
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setProfileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { to: "/shop", label: "Shop", icon: <Stethoscope className="w-4 h-4" /> },
    { to: "/categories", label: "Categories", icon: <Package className="w-4 h-4" /> },
    { to: "/healthtracker", label: "Health Tracker", icon: <Shield className="w-4 h-4" /> },
    // Removed "Doctor Consult" link
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white shadow-lg border-b border-gray-100" 
        : "bg-gradient-to-r from-blue-50 to-white"
    }`}>
      {/* Top Banner - Simplified */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Truck className="w-3 h-3" />
              <span>Free delivery on orders above ₹499</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>100% Doctor verified products</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">HealthOne+</span>
              <span className="text-xs text-gray-600">Healthcare MadeSimple</span>
            </div>
          </Link>

          {/* SEARCH BAR - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicines, healthcare products..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-700 hover:to-teal-700 transition"
              >
                Search
              </button>
            </form>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* CART */}
            <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </NavLink>

            {/* USER */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-teal-50 text-gray-700 hover:from-blue-100 hover:to-teal-100 transition border border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold truncate max-w-[100px]">
                      {user.name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-500">My Account</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-teal-50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
                          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{user.name || "User"}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <NavLink
                        to="/account/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </NavLink>

                      <NavLink
                        to="/account/orders"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </NavLink>

                      <NavLink
                        to="/account/wishlist"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Wishlist</span>
                      </NavLink>

                      <NavLink
                        to="/account/prescriptions"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                        onClick={() => setProfileOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>My Prescriptions</span>
                      </NavLink>

                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold hover:from-blue-700 hover:to-teal-700 transition shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

            {/* MOBILE TOGGLE */}
            <button
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
              onClick={() => setMobileOpen((m) => !m)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP NAV */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  flex items-center gap-2 py-4 border-b-2 transition
                  ${isActive 
                    ? "border-blue-600 text-blue-600 font-semibold" 
                    : "border-transparent text-gray-600 hover:text-blue-600"
                  }
                `}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`md:hidden transition-all duration-300 ${
        mobileOpen 
          ? "max-h-[500px] opacity-100" 
          : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="bg-white border-t border-gray-200">
          {/* Mobile Search */}
          <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search healthcare products..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
              />
            </form>
          </div>

          {/* Mobile Links */}
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-6 py-4 border-b border-gray-100 transition
                ${isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "hover:bg-gray-50 text-gray-700"
                }
              `}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Auth Links */}
          {!user ? (
            <div className="p-4 border-t">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl border border-blue-600 text-blue-600 text-center font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 text-white text-center font-semibold"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t">
              <div className="space-y-2">
                <NavLink
                  to="/account/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
                >
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </NavLink>
                <NavLink
                  to="/account/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2"
              >
                <X className="w-6 h-6" />
              </button>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicines, healthcare products..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                  autoFocus
                />
              </form>
            </div>
          </div>
          {/* Recent Searches */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Recent Searches</h3>
            <div className="space-y-2">
              {["Vitamin C", "Blood Pressure Monitor", "Baby Care", "Face Masks"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add some CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}

export default Navbar;