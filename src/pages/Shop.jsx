import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";
import ProductCard from "../components/ProductCard";
import { 
  Filter, 
  Search, 
  X, 
  Truck, 
  Shield, 
  CheckCircle, 
  Package,
  Tag,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Grid,
  List
} from "lucide-react";

/* ================= CONSTANTS ================= */
const CATEGORIES = [
  { name: "All", icon: "🧬", count: 0 },
  { name: "Medicines", icon: "💊", count: 156 },
  { name: "Baby Care", icon: "👶", count: 89 },
  { name: "Health Care", icon: "❤️", count: 234 },
  { name: "Skin Care", icon: "🧴", count: 167 },
  { name: "Devices", icon: "🩺", count: 78 },
  { name: "Nutrition", icon: "🍃", count: 142 },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "priceLow", label: "Price: Low to High" },
  { value: "priceHigh", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2500", min: 1000, max: 2500 },
  { label: "₹2500 - ₹5000", min: 2500, max: 5000 },
  { label: "Over ₹5000", min: 5000, max: 10000 },
];

const PAGE_SIZE = 12;

function Shop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchQuery);

  const { list: products = [], loading } = useSelector(
    (state) => state.products || {}
  );

  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState("newest");
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const availableBrands = useMemo(() => {
    const brandCounts = {};
    products.forEach(p => {
      if (p.brand) {
        brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([brand, count]) => ({ brand, count }));
  }, [products]);

  const processedProducts = useMemo(() => {
    let data = [...products];

    if (category !== "All") {
      data = data.filter((p) => p.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      );
    }

    if (brands.length) {
      data = data.filter((p) => brands.includes(p.brand));
    }

    data = data.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case "priceLow":
        data.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        data.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        data.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "rating":
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        data.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    return data;
  }, [products, category, searchQuery, brands, maxPrice, sortBy]);

  const totalPages = Math.ceil(processedProducts.length / PAGE_SIZE);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return processedProducts.slice(start, start + PAGE_SIZE);
  }, [processedProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [category, brands, maxPrice, sortBy, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  const clearFilters = () => {
    setCategory("All");
    setBrands([]);
    setMaxPrice(10000);
    setSearchInput("");
    navigate("/shop");
  };

  const activeFiltersCount = 
    (category !== "All" ? 1 : 0) + 
    brands.length + 
    (maxPrice < 10000 ? 1 : 0) + 
    (searchQuery ? 1 : 0);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ================= HEADER ================= */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-blue-100 mb-2">
              <span>Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium">Shop</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Healthcare Products
            </h1>
            <p className="text-blue-100 text-lg max-w-3xl">
              Genuine medicines, baby care, medical devices & wellness products — 
              delivered safely from licensed pharmacies.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search medicines, healthcare products..."
                className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-1.5 rounded-md hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Doctor Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Truck className="w-4 h-4" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Package className="w-4 h-4" />
              <span className="text-sm">Quality Assured</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <p className="text-gray-600">
              Showing {Math.min(PAGE_SIZE, paginatedProducts.length)} of {processedProducts.length} products
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${viewMode === "grid" ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${viewMode === "list" ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {category !== "All" && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {category}
                <button onClick={() => setCategory("All")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {brands.map(brand => (
              <span key={brand} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {brand}
                <button onClick={() => setBrands(brands.filter(b => b !== brand))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {maxPrice < 10000 && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                Under ₹{maxPrice}
                <button onClick={() => setMaxPrice(10000)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                Search: "{searchQuery}"
                <button onClick={() => navigate("/shop")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* ================= FILTERS SIDEBAR ================= */}
          <aside className={`
            ${showMobileFilters ? 'fixed inset-0 z-50 bg-black/50' : 'hidden lg:block'}
          `}>
            <div className={`
              bg-white h-full w-full lg:w-80 p-6 overflow-y-auto
              ${showMobileFilters ? 'fixed left-0 top-0 z-50' : 'sticky top-24 rounded-xl shadow-sm border border-gray-100'}
            `}>
              {/* Mobile Header */}
              {showMobileFilters && (
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              )}

              <div className="space-y-8">
                {/* CATEGORIES */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => {
                      const count = cat.name === "All" 
                        ? products.length 
                        : products.filter(p => p.category === cat.name).length;
                      
                      return (
                        <button
                          key={cat.name}
                          onClick={() => {
                            setCategory(cat.name);
                            if (showMobileFilters) setShowMobileFilters(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                            category === cat.name
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="font-medium">{cat.name}</span>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PRICE RANGE */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Price Range
                  </h3>
                  <div className="space-y-3 mb-4">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setMaxPrice(range.max)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          maxPrice === range.max
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{range.label}</span>
                          {maxPrice === range.max && (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>₹0</span>
                      <span className="font-bold text-blue-600">₹{maxPrice}</span>
                      <span>₹10000</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600"
                    />
                  </div>
                </div>

                {/* BRANDS */}
                {availableBrands.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Brands</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {availableBrands.map(({ brand, count }) => (
                        <label
                          key={brand}
                          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={brands.includes(brand)}
                              onChange={() =>
                                setBrands((prev) =>
                                  prev.includes(brand)
                                    ? prev.filter((b) => b !== brand)
                                    : [...prev, brand]
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="font-medium">{brand}</span>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters Button */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full py-3 text-center text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* ================= PRODUCTS GRID ================= */}
          <section className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 animate-pulse border border-gray-100">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search term
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`gap-6 ${viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "flex flex-col space-y-6"}`}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg border font-medium ${
                            page === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Shop;