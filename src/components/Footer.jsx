import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Shield,
  Truck,
  CreditCard,
  Users,
  Heart,
  ChevronRight,
  CheckCircle,
  MessageSquare,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

function Footer() {
  const { user } = useSelector((state) => state.auth || {});
  const isAdmin = user?.role === "admin";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscribed(true);
      setEmail("");
      
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const healthcareLinks = [
    {
      title: "Shop by Category",
      links: [
        { name: "Medicines", to: "/shop?category=Medicines" },
        { name: "Baby Care", to: "/shop?category=Baby Care" },
        { name: "Healthcare Devices", to: "/shop?category=Devices" },
        { name: "Nutrition & Supplements", to: "/shop?category=Nutrition" },
        { name: "Personal Care", to: "/shop?category=Personal Care" },
        { name: "First Aid", to: "/shop?category=First Aid" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", to: "/about" },
        { name: "Careers", to: "/careers" },
        { name: "Blog", to: "/blog" },
        { name: "Contact Us", to: "/contact" },
      ]
    }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-gray-900 to-gray-950 text-white"
    >
      {/* Healthcare Assurance Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-teal-600/20 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Doctor Verified</p>
                <p className="text-xs text-gray-300">All products verified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Fast Delivery</p>
                <p className="text-xs text-gray-300">Same day in metros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Secure Payments</p>
                <p className="text-xs text-gray-300">100% safe & secure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">24/7 Support</p>
                <p className="text-xs text-gray-300">Medical experts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">HealthOne+</h2>
                <p className="text-sm text-gray-300">Healthcare MadeSimple & Reliable</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 max-w-md">
              Your trusted partner for genuine medicines, baby care products, 
              healthcare essentials, and medical devices. Delivered safely to 
              your doorstep from licensed pharmacies.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-medium">24/7 Customer Support</p>
                  <p className="text-sm text-gray-300">+91 1800-123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-300">care@healthoneplus.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="font-medium">Corporate Office</p>
                  <p className="text-sm text-gray-300">Mumbai, India</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-8">
              <p className="font-medium mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook className="w-5 h-5" />, label: "Facebook" },
                  { icon: <Twitter className="w-5 h-5" />, label: "Twitter" },
                  { icon: <Instagram className="w-5 h-5" />, label: "Instagram" },
                  { icon: <Linkedin className="w-5 h-5" />, label: "LinkedIn" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition flex items-center justify-center"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Sections */}
          {healthcareLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold mb-4 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.to}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Stay Healthy, Stay Informed</h3>
              <p className="text-gray-300">
                Subscribe to our newsletter for health tips, exclusive offers, and product updates
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-teal-700 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Subscribing...
                  </span>
                ) : subscribed ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Subscribed!
                  </span>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-400 mt-3">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Certifications & Trust Seals */}
      <div className="bg-gray-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">ISO Certified</p>
                <p className="text-xs text-gray-400">Quality Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Licensed Pharmacy</p>
                <p className="text-xs text-gray-400">Govt. Approved</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-gray-400">Medical Experts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">500+ Cities</p>
                <p className="text-xs text-gray-400">Across India</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Links (if admin) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-medium">Admin Panel</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/admin/dashboard" className="text-sm hover:text-blue-300 transition">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-sm hover:text-blue-300 transition">
                  Manage Products
                </Link>
                <Link to="/admin/orders" className="text-sm hover:text-blue-300 transition">
                  View Orders
                </Link>
                <Link to="/admin/users" className="text-sm hover:text-blue-300 transition">
                  Manage Users
                </Link>
                <Link to="/admin/analytics" className="text-sm hover:text-blue-300 transition">
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Copyright */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} HealthOne+. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm">Secure Payment:</span>
              <div className="flex gap-2">
                {["💳", "🏦", "🔒", "📱"].map((icon, index) => (
                  <span key={index} className="text-lg">{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;