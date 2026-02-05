import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import api from '../../utils/api';

const Address = () => {
  const { user, fetchUserProfile } = useOutletContext();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [defaultLoading, setDefaultLoading] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    isDefault: false
  });

  // Initialize form with user data if editing
  useEffect(() => {
    if (editingId && user?.addresses) {
      const addressToEdit = user.addresses.find(addr => addr._id === editingId);
      if (addressToEdit) {
        setFormData(addressToEdit);
      }
    }
  }, [editingId, user]);

  const validateForm = () => {
    const errors = {};
    const mobileRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!mobileRegex.test(formData.mobile)) errors.mobile = 'Enter a valid 10-digit mobile number';
    if (!pincodeRegex.test(formData.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(formErrors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/users/addresses/${editingId}`, formData);
      } else {
        await api.post('/users/addresses', formData);
      }
      
      await fetchUserProfile();
      resetForm();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving address:', error);
      alert(error.response?.data?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobile: '',
      pincode: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      isDefault: false
    });
    setFormErrors({});
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address._id);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => {
      document.querySelector('#address-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setDeleteLoading(addressId);
    try {
      await api.delete(`/users/addresses/${addressId}`);
      await fetchUserProfile();
    } catch (error) {
      console.error('Error deleting address:', error);
      alert('Failed to delete address');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSetDefault = async (addressId) => {
    setDefaultLoading(addressId);
    try {
      await api.put(`/users/addresses/${addressId}`, { isDefault: true });
      await fetchUserProfile();
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
    } finally {
      setDefaultLoading(null);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const handleAddNewClick = () => {
    resetForm();
    setEditingId(null);
    setShowForm(true);
    // Scroll to form after state update
    setTimeout(() => {
      document.querySelector('#address-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Addresses</h1>
          <p className="text-gray-600">Manage your delivery addresses</p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-start sm:self-center"
          aria-label="Add new address"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Address</span>
        </button>
      </div>

      {/* Address Form */}
      {showForm && (
        <div id="address-form" className="mb-10 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={cancelForm}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close form"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  maxLength="10"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter 6-digit pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  maxLength="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.pincode && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.city && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.state && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Enter nearby landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address *
              </label>
              <textarea
                name="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.address && (
                <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Set as default address</span>
              </label>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{editingId ? 'Updating...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Update Address' : 'Save Address'}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {user?.addresses?.map((address) => (
          <div
            key={address._id}
            className={`border rounded-xl p-5 transition-all duration-200 ${
              address.isDefault 
                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <MapPin className={`w-5 h-5 ${
                  address.isDefault ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{address.fullName}</h3>
                  {address.isDefault && (
                    <span className="inline-block mt-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Default Address
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(address)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                  title="Edit address"
                  aria-label="Edit address"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                  title="Delete address"
                  aria-label="Delete address"
                  disabled={deleteLoading === address._id}
                >
                  {deleteLoading === address._id ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-600" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-gray-600 mb-4">
              <p className="leading-relaxed">{address.address}</p>
              {address.landmark && (
                <p className="text-sm">
                  <span className="font-medium">Landmark:</span> {address.landmark}
                </p>
              )}
              <p>{address.city}, {address.state} - {address.pincode}</p>
              <p className="font-medium pt-2">📱 {address.mobile}</p>
            </div>

            {!address.isDefault && (
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSetDefault(address._id)}
                  disabled={defaultLoading === address._id}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-200 rounded px-2 py-1"
                >
                  {defaultLoading === address._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Setting as default...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Set as Default</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}

        {(!user?.addresses || user.addresses.length === 0) && (
          <div className="lg:col-span-2">
            <div className="text-center py-16 px-4 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No addresses yet</h3>
              <p className="text-gray-600 mb-8">
                Add your first address to make checkout faster and easier
              </p>
              <button
                onClick={handleAddNewClick}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Your First Address</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;