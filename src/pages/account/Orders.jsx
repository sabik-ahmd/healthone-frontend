import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      // 🔐 AUTH GUARD (PRO LEVEL)
      if (!token) {
        navigate("/login", {
          replace: true,
          state: { from: "/orders" }, // 👈 remember destination
        });
        return;
      }

      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(data);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center font-medium">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">My Orders</h2>
        <p className="text-gray-500 mb-4">
          You haven’t placed any orders yet.
        </p>
        <a
          href="/shop"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border p-5"
          >
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">#{order._id.slice(-6)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">₹{order.totalAmount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mt-4 border-t pt-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm mb-2"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* ACTION */}
            <div className="flex justify-end mt-4">
              <a
                href={`/order/${order._id}`}
                className="text-indigo-600 font-medium hover:underline"
              >
                View Details →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
