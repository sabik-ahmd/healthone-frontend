import { Link, useParams } from "react-router-dom";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { motion } from "framer-motion";

function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-white/70 backdrop-blur-xl
                   border border-white/40 shadow-2xl rounded-3xl p-10 text-center"
      >
        {/* ICON */}
        <div className="flex justify-center mb-5">
          <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full">
            <CheckCircle size={64} />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          Order Confirmed 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Your order has been placed successfully
        </p>

        {/* ORDER ID */}
        <div className="bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <p className="font-mono text-sm text-gray-800 break-all">
            {id}
          </p>
        </div>

        {/* STATUS TIMELINE */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-sm">
          <div className="flex flex-col items-center text-emerald-600">
            <Package size={20} />
            <span className="mt-1 font-medium">Processing</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <Truck size={20} />
            <span className="mt-1">Shipped</span>
          </div>
          <div className="flex flex-col items-center text-gray-400">
            <Home size={20} />
            <span className="mt-1">Delivered</span>
          </div>
        </div>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Thank you for shopping with{" "}
          <span className="font-semibold text-emerald-600">
            HealthOne+
          </span>
          . We’ll notify you when your order is shipped.
        </p>

        {/* ACTIONS */}
        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="block w-full bg-gradient-to-r from-emerald-600 to-cyan-600
                       text-white py-3 rounded-xl font-semibold shadow
                       hover:scale-[1.02] transition"
          >
            View My Orders
          </Link>

          <Link
            to="/shop"
            className="block w-full bg-white border border-emerald-200
                       text-emerald-700 py-3 rounded-xl font-semibold
                       hover:bg-emerald-50 transition"
          >
            Continue Shopping
          </Link>

          <Link
            to="/"
            className="block w-full text-gray-500 text-sm hover:underline"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default OrderSuccess;
