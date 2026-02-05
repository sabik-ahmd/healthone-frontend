import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

/* ================= PRICE FORMAT ================= */
const formatPrice = (value) => `₹${value.toLocaleString()}`;

/* ================= SKELETON ================= */
function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-40 bg-gray-200 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  );
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        // 🔐 Token auto-attached
        const { data } = await api.get("/orders/my");

        if (isMounted) {
          setOrders(data || []);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load your orders");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => (isMounted = false);
  }, []);

  /* ================= PAGE WRAPPER ================= */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage your recent purchases
          </p>
        </div>

        {/* ================= LOADING ================= */}
        {loading && <OrdersSkeleton />}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              to="/"
              className="text-emerald-600 hover:underline"
            >
              Go Home
            </Link>
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-2xl font-semibold mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven’t placed any orders.
            </p>
            <Link
              to="/shop"
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg
                         hover:bg-emerald-700 transition font-medium"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* ================= ORDERS ================= */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-6 shadow
                           hover:shadow-lg transition"
              >
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-mono text-sm text-gray-800">
                      {order._id}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-2 text-sm">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-gray-700"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span>
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-5" />

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <span className="text-lg font-semibold">
                    Total: {formatPrice(order.totalAmount)}
                  </span>

                  <span className="inline-flex items-center px-4 py-1.5
                                   rounded-full text-sm font-semibold
                                   bg-emerald-100 text-emerald-700">
                    Paid
                  </span>
                </div>

                {/* ACTION */}
                <div className="mt-5 text-right">
                  <Link
                    to={`/order/${order._id}`}
                    className="text-sm font-medium text-emerald-600
                               hover:underline"
                  >
                    View Order Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyOrders;
