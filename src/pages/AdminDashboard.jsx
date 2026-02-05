import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  Bell,
  Search,
  Filter,
  Download,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  ShoppingCart,
  Truck,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  ArrowRight,
  Heart,
  Stethoscope,
  AlertCircle,
  RefreshCw,
  UserCheck,
  FileText,
  AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeProducts: 0,
    pendingOrders: 0,
    todayRevenue: 0,
    growthRate: 0,
    avgOrderValue: 0
  });

  const [customers, setCustomers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("today"); // today, week, month, year

  /* ================= ADMIN AUTH GUARD ================= */
  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        navigate("/login", { replace: true });
        return false;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          navigate("/", { replace: true });
          return false;
        }
        return true;
      } catch {
        navigate("/login", { replace: true });
        return false;
      }
    };

    checkAdminAuth();
  }, [navigate]);

  /* ================= FETCH REAL DATA FROM BACKEND ================= */
  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      setError(null);

      // Fetch dashboard stats
      const statsResponse = await api.get("/admin/dashboard/stats", {
        params: { period: selectedPeriod }
      });

      // Fetch recent customers
      const customersResponse = await api.get("/admin/users/recent", {
        params: { limit: 10 }
      });

      // Fetch recent orders
      const ordersResponse = await api.get("/admin/orders/recent", {
        params: { limit: 10 }
      });

      // Fetch top products
      const productsResponse = await api.get("/admin/products/top", {
        params: { limit: 5 }
      });

      setStats(statsResponse.data);
      setCustomers(customersResponse.data);
      setRecentOrders(ordersResponse.data);
      setTopProducts(productsResponse.data);

      toast.success("Dashboard data refreshed successfully!");
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error.response?.data?.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
      
      // Fallback to empty data
      setStats({
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        activeProducts: 0,
        pendingOrders: 0,
        todayRevenue: 0,
        growthRate: 0,
        avgOrderValue: 0
      });
      setCustomers([]);
      setRecentOrders([]);
      setTopProducts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  /* ================= HANDLE ACTIONS ================= */
  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleViewCustomer = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleExportData = async () => {
    try {
      toast.info("Preparing data export...");
      const response = await api.get("/admin/export/dashboard", {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  /* ================= FORMATTING HELPERS ================= */
  const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;
  const formatNumber = (value) => value.toLocaleString('en-IN');
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /* ================= FILTER CUSTOMERS ================= */
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );
  }, [customers, search]);

  /* ================= LOADING STATE ================= */
  if (loading && !refreshing) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                  <p className="text-blue-100">Manage your healthcare platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>

              {/* Export Button */}
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="text-sm text-red-600 hover:text-red-800 mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatPrice(stats.totalRevenue)}
            icon={<DollarSign className="w-5 h-5" />}
            color="from-emerald-500 to-teal-600"
            change={stats.growthRate}
            period={selectedPeriod}
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(stats.totalOrders)}
            icon={<ShoppingCart className="w-5 h-5" />}
            color="from-blue-500 to-cyan-600"
            change={stats.orderGrowth}
            period={selectedPeriod}
          />
          <StatCard
            title="Active Users"
            value={formatNumber(stats.totalUsers)}
            icon={<Users className="w-5 h-5" />}
            color="from-purple-500 to-pink-600"
            change={stats.userGrowth}
            period={selectedPeriod}
          />
          <StatCard
            title="Avg. Order Value"
            value={formatPrice(stats.avgOrderValue)}
            icon={<TrendingUp className="w-5 h-5" />}
            color="from-amber-500 to-orange-600"
            change={stats.aovGrowth}
            period={selectedPeriod}
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeProducts)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Available for purchase
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.pendingOrders)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Awaiting processing
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.todayRevenue)}</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Revenue generated today
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Orders & Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                      <p className="text-sm text-gray-600">Latest customer orders</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/orders"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent orders found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{order.orderNumber}</span>
                            <OrderStatus status={order.status} />
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.customer?.name || 'Unknown Customer'} • {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                          <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => handleViewOrder(order._id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                          <FileText className="w-4 h-4" />
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-500" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                      <p className="text-sm text-gray-600">Most purchased items</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/products"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              
              {topProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No products data available</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <div key={product._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                              <p className="text-xs text-gray-500">{product.soldCount} sold</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              Stock: {product.stock}
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Rating: {product.rating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Customers & Healthcare Metrics */}
          <div className="space-y-8">
            {/* Recent Customers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Recent Customers</h2>
                      <p className="text-sm text-gray-600">Latest registered users</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search customers..."
                      className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-40"
                    />
                  </div>
                </div>
              </div>
              
              {filteredCustomers.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No customers found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                  {filteredCustomers.map((customer) => (
                    <div key={customer._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">
                          {customer.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                              <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{customer.ordersCount || 0} orders</p>
                              <p className="text-xs text-gray-500">{formatPrice(customer.totalSpent || 0)} spent</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                customer.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                customer.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {customer.role || 'user'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                customer.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {customer.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleViewCustomer(customer._id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Healthcare Platform Status */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Platform Status</h3>
                  <p className="text-blue-100 text-sm">Real-time health metrics</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-4 h-4" />
                    <span>Prescription Orders</span>
                  </div>
                  <span className="font-bold">{stats.prescriptionOrders || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4" />
                    <span>Same-day Deliveries</span>
                  </div>
                  <span className="font-bold">{stats.sameDayDeliveries || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-4 h-4" />
                    <span>Doctor Consults</span>
                  </div>
                  <span className="font-bold">{stats.doctorConsults || 0}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4" />
                    <span>Verified Products</span>
                  </div>
                  <span className="font-bold">{stats.verifiedProducts || 0}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition text-sm font-medium">
                View Detailed Analytics
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/admin/products/new"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Package className="w-6 h-6 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Product</span>
                </Link>
                
                <Link
                  to="/admin/orders"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Manage Orders</span>
                </Link>
                
                <Link
                  to="/admin/users"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Users className="w-6 h-6 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Manage Users</span>
                </Link>
                
                <Link
                  to="/admin/settings"
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
                >
                  <Settings className="w-6 h-6 text-amber-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl mb-8"></div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>
            ))}
          </div>

          {/* Detailed Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-96 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, change, period }) {
  const isPositive = change > 0;
  const changeText = isPositive ? `+${change}%` : `${change}%`;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full backdrop-blur-sm ${
          isPositive ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
        }`}>
          {changeText}
        </span>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-white/80 text-sm">{title}</p>
      <p className="text-white/60 text-xs mt-1">
        vs. last {period === 'today' ? 'day' : period}
      </p>
    </motion.div>
  );
}

function OrderStatus({ status }) {
  const config = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> },
    processing: { color: "bg-blue-100 text-blue-800", icon: <RefreshCw className="w-3 h-3" /> },
    shipped: { color: "bg-purple-100 text-purple-800", icon: <Truck className="w-3 h-3" /> },
    delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
    cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
    refunded: { color: "bg-gray-100 text-gray-800", icon: <DollarSign className="w-3 h-3" /> }
  }[status] || { color: "bg-gray-100 text-gray-800", icon: <Clock className="w-3 h-3" /> };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}