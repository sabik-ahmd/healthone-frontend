import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Truck, 
  Heart, 
  Stethoscope, 
  Package,
  CheckCircle,
  Users,
  Award,
  Globe,
  Smartphone,
  MessageSquare,
  Star,
  Clock,
  Home,
  ArrowRight
} from "lucide-react";

export default function AuthLayout({ children, type = "auth" }) {
  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Doctor Verified Products",
      description: "Every product verified by medical professionals"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Same-day delivery in major cities"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Health Priority",
      description: "Your well-being is our primary concern"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Genuine Medicines",
      description: "Direct from licensed pharmacies"
    }
  ];

  const stats = [
    { value: "50K+", label: "Happy Patients", icon: <Users className="w-4 h-4" /> },
    { value: "10K+", label: "Verified Products", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "500+", label: "Cities Served", icon: <Globe className="w-4 h-4" /> },
    { value: "24/7", label: "Support", icon: <Clock className="w-4 h-4" /> }
  ];

  const testimonials = [
    {
      text: "HealthOne+ saved my mother's emergency medication needs. Fast delivery and genuine products!",
      author: "Rajesh Kumar, Delhi"
    },
    {
      text: "As a doctor, I recommend HealthOne+ to all my patients for reliable healthcare products.",
      author: "Dr. Priya Sharma, Mumbai"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Left Panel - Healthcare Information */}
      <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-600 text-white p-8 lg:p-12">
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-between">
          
          {/* Header */}
          <div>
            {/* Logo & Navigation */}
            <div className="flex items-center justify-between mb-8 lg:mb-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">HealthOne+</h1>
                  <p className="text-blue-100 text-sm">Healthcare MadeSimple & Reliable</p>
                </div>
              </div>
              
              <Link
                to="/"
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Back to Home</span>
              </Link>
            </div>

            {/* Main Content */}
            <div className="mb-8 lg:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                Your Health Journey
                <span className="block text-blue-100">Starts Here</span>
              </h2>
              
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Join thousands of families who trust HealthOne+ for genuine medicines, 
                doctor consultations, and healthcare essentials delivered safely to their doorstep.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      {stat.icon}
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-sm text-blue-100">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-8 lg:mb-0">
            <h3 className="text-xl font-bold mb-4">Why Choose HealthOne+</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{benefit.title}</h4>
                    <p className="text-sm text-blue-100/80">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="hidden lg:block mt-8 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">Trusted by Patients Nationwide</span>
            </div>
            <div className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-blue-100 italic mb-2">"{testimonial.text}"</p>
                  <p className="text-xs text-blue-200">{testimonial.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="flex flex-wrap gap-4 text-sm">
              <Link to="/about" className="text-blue-100 hover:text-white transition">
                About Us
              </Link>
              <Link to="/contact" className="text-blue-100 hover:text-white transition">
                Contact
              </Link>
              <Link to="/privacy" className="text-blue-100 hover:text-white transition">
                Privacy
              </Link>
              <Link to="/terms" className="text-blue-100 hover:text-white transition">
                Terms
              </Link>
              <Link to="/help" className="text-blue-100 hover:text-white transition">
                Help Center
              </Link>
            </div>
            <p className="text-xs text-blue-200 mt-4">
              © {new Date().getFullYear()} HealthOne+. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">HealthOne+</h1>
                <p className="text-gray-600">Healthcare MadeSimple</p>
              </div>
            </div>
            
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
            {children}
            
            {/* Security Assurance */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Your data is protected</p>
                  <p className="text-xs text-gray-500">
                    HIPAA compliant • 256-bit encryption • Secure servers
                  </p>
                </div>
              </div>
            </div>

            {/* Download App */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-gray-900">Get the App</p>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Download our mobile app for better experience
              </p>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition">
                  <span>📱</span>
                  Google Play
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition">
                  <span>🍎</span>
                  App Store
                </button>
              </div>
            </div>

            {/* Need Help */}
            <div className="mt-6 text-center">
              <Link
                to="/help"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <MessageSquare className="w-4 h-4" />
                Need help? Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .floating-orb {
          animation: float 8s ease-in-out infinite;
        }
        
        .pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}