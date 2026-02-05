import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Save, User, Mail, Phone, Calendar, Edit2 } from 'lucide-react';
import api from '../../utils/api';

const Profile = () => {
  const { user, setUser } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
          <p className="text-gray-600">Update your personal details</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Edit2 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="font-medium">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <p className="text-sm text-gray-500">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span className="font-medium">Mobile Number</span>
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              placeholder="Enter your mobile number"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Date of Birth</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">Gender</label>
            <div className="flex space-x-4">
              {['Male', 'Female', 'Other'].map((gender) => (
                <label key={gender} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;