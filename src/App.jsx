import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import HealthTracker from "./pages/HealthTracker";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import OrderConfirmation from "./pages/OrderConfirmation";

/* ================= ACCOUNT ================= */
import Account from "./pages/account/Account";
import Profile from "./pages/account/Profile";
import Orders from "./pages/account/Orders";
import Wishlist from "./pages/account/Wishlist";
import Address from "./pages/account/Address";

/* ================= LAYOUT ================= */
function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-[#f8fafc]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* AUTH (NO NAVBAR / FOOTER) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MAIN LAYOUT */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/HealthTracker" element={<HealthTracker />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderSuccess />} />
        <Route path="/order/:orderId" element={<OrderConfirmation />} />

        {/* ACCOUNT */}
        <Route path="/account" element={<Account />}>
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="address" element={<Address />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
