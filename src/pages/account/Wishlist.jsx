// src/pages/account/Wishlist.jsx - Enhanced version
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/wishlist');
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setError('Failed to load your wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (removingId) return;
    
    setRemovingId(productId);
    try {
      await api.delete(`/users/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Failed to remove item from wishlist. Please try again.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (productId) => {
    if (addingToCart) return;
    
    setAddingToCart(productId);
    try {
      await api.post('/cart/add', { productId, quantity: 1 });
      // Optionally remove from wishlist after adding to cart
      // await handleRemove(productId);
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || 'Failed to add item to cart';
      alert(message);
    } finally {
      setAddingToCart(null);
    }
  };

  const calculateDiscount = (originalPrice, sellingPrice) => {
    if (!originalPrice || originalPrice <= sellingPrice) return 0;
    return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchWishlist}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlist.length > 0 
            ? `${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved for later`
            : 'Save items you love for later'
          }
        </p>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => {
            const discount = calculateDiscount(item.originalPrice, item.sellingPrice);
            
            return (
              <div 
                key={item._id} 
                className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Product Image */}
                <Link to={`/products/${item.slug || item._id}`} className="block">
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/300x300'} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300';
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                        {discount}% OFF
                      </span>
                    )}
                    
                    {/* Quick View Button */}
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/products/${item.slug || item._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  
                  {/* Category */}
                  {item.category && (
                    <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                  )}
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(item.rating || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">
                      ({item.ratingCount || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{item.sellingPrice?.toLocaleString()}
                    </span>
                    {item.originalPrice > item.sellingPrice && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.originalPrice?.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-red-600">
                          Save ₹{(item.originalPrice - item.sellingPrice)?.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item._id)}
                      disabled={addingToCart === item._id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      {addingToCart === item._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span className="font-medium">Add to Cart</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={removingId === item._id}
                      className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Remove from wishlist"
                    >
                      {removingId === item._id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-pink-50 flex items-center justify-center">
            <Heart className="w-12 h-12 text-pink-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-8">
            Save items you love by clicking the heart icon on any product
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium">Start Shopping</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;