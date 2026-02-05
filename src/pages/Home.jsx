import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { 
  Shield, 
  Truck, 
  RefreshCw, 
  CreditCard, 
  Stethoscope, 
  Baby, 
  Heart, 
  Droplets,
  Activity,
  Sprout,
  ArrowRight,
  Star,
  Clock,
  Package,
  CheckCircle,
  ShoppingBag
} from "lucide-react";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: products = [], loading } = useSelector(
    (state) => state.products || {}
  );

  useEffect(() => {
    if (!products.length) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const categories = [
    { title: "Medicines", icon: <Stethoscope className="w-8 h-8" />, color: "from-blue-500 to-blue-600", bg: "bg-blue-100" },
    { title: "Baby Care", icon: <Baby className="w-8 h-8" />, color: "from-pink-500 to-rose-600", bg: "bg-pink-100" },
    { title: "Health Care", icon: <Heart className="w-8 h-8" />, color: "from-red-500 to-red-600", bg: "bg-red-100" },
    { title: "Skin Care", icon: <Droplets className="w-8 h-8" />, color: "from-purple-500 to-purple-600", bg: "bg-purple-100" },
    { title: "Health Devices", icon: <Activity className="w-8 h-8" />, color: "from-teal-500 to-teal-600", bg: "bg-teal-100" },
    { title: "Nutrition", icon: <Sprout className="w-8 h-8" />, color: "from-green-500 to-green-600", bg: "bg-green-100" },
  ];

  const features = [
    { 
      title: "Doctor Verified", 
      icon: <Shield className="w-6 h-6" />,
      description: "All products verified by medical professionals"
    },
    { 
      title: "Fast Delivery", 
      icon: <Truck className="w-6 h-6" />,
      description: "Same-day delivery in major cities"
    },
    { 
      title: "Easy Returns", 
      icon: <RefreshCw className="w-6 h-6" />,
      description: "7-day return policy"
    },
    { 
      title: "Secure Payments", 
      icon: <CreditCard className="w-6 h-6" />,
      description: "100% secure payment gateway"
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Customers", icon: <Heart className="w-5 h-5" /> },
    { value: "10K+", label: "Products", icon: <Package className="w-5 h-5" /> },
    { value: "500+", label: "Cities Served", icon: <Truck className="w-5 h-5" /> },
    { value: "24/7", label: "Support", icon: <Clock className="w-5 h-5" /> },
  ];

  const featuredProducts = products
    .filter((p) => p.originalPrice && p.originalPrice > p.price)
    .slice(0, 8);

  return (
    <main className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-teal-50 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-blue-200/30 to-teal-200/30 blur-3xl -z-10" />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-medium mb-6">
                <Shield className="w-4 h-4" />
                Trusted Medical Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Healthcare Made
                <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Simple & Reliable
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed">
                Medicines, baby care, healthcare essentials and medical devices — 
                delivered safely to your doorstep.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Doctor verified products</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Licensed pharmacy</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Secure payments</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/shop")}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Shop Products
                </button>
                <button
                  onClick={() => navigate("/categories")}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Browse Categories
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
                    <p className="text-sm text-gray-600">2-4 hours in metro cities</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Quality Assured</h3>
                    <p className="text-sm text-gray-600">100% genuine products</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Secure Payments</h3>
                    <p className="text-sm text-gray-600">SSL encrypted transactions</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">24/7 Support</h3>
                    <p className="text-sm text-gray-600">Medical experts available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-white">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                  </div>
                  <p className="text-blue-100 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find everything you need for your healthcare journey
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.title}
                onClick={() => navigate(`/shop?category=${cat.title}`)}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${cat.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`text-white bg-gradient-to-r ${cat.color} p-3 rounded-lg`}>
                    {cat.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                  {cat.title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Hot Deals & Offers
              </h2>
              <p className="text-gray-600">Quality healthcare products at unbeatable prices</p>
            </div>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 mt-4 md:mt-0"
            >
              View all products
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthOne+
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to making healthcare accessible, reliable, and simple for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white font-medium mb-6">
            <Star className="w-4 h-4" />
            Trusted by 50,000+ Families
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Your Health, Our Responsibility
          </h2>
          
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            From essential medicines to advanced healthcare products, 
            HealthOne+ ensures quality, safety, and timely delivery — every single time.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5" />
              <span>Licensed pharmacy</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5" />
              <span>Doctor-verified products</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5" />
              <span>Secure payments</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="bg-white text-blue-600 px-10 py-3.5 rounded-lg font-bold text-lg hover:bg-gray-50 transition shadow-2xl hover:scale-105 duration-300"
          >
            Start Shopping Today
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;