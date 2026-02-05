import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, MapPin, Heart, Package, LogOut, 
  ChevronRight, Settings, Shield 
} from 'lucide-react';
import api from '../../utils/api';

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Profile',
      icon: <User className="w-5 h-5" />,
      path: '/account/profile',
      description: 'Manage your personal information'
    },
    {
      title: 'Addresses',
      icon: <MapPin className="w-5 h-5" />,
      path: '/account/address',
      description: 'Add or edit your addresses'
    },
    {
      title: 'Wishlist',
      icon: <Heart className="w-5 h-5" />,
      path: '/account/wishlist',
      description: 'View your saved items'
    },
    {
      title: 'Orders',
      icon: <Package className="w-5 h-5" />,
      path: '/account/orders',
      description: 'Track your orders'
    },
    {
      title: 'Security',
      icon: <Shield className="w-5 h-5" />,
      path: '/account/security',
      description: 'Change password & security settings'
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      path: '/account/settings',
      description: 'Account preferences'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <img 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-blue-100">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">My Account</h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between p-3 rounded-lg transition ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        location.pathname === item.path 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm">
              <Outlet context={{ user, setUser, fetchUserProfile }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;