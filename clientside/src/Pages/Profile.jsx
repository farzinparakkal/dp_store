import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phoneNumber: '',
    address: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      // navigate('/login');
      return;
    }
    
    if (user) {
      loadProfileData();
    }
  }, [user, isAuthenticated, navigate]);

  const loadProfileData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await userAPI.getProfile(user._id);
      const profileData = response.user;
      
      setFormData({
        email: profileData.email || '',
        name: profileData.name || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      // Fallback to user context data if API fails
      setFormData({
        email: user.email || '',
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const response = await userAPI.updateProfile(user._id, formData);
      console.log('Profile updated:', response);
      
      // Reload profile data to get the latest from database
      await loadProfileData();
      
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#edf8f9'}}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#edf8f9'}}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-teal-600">My Profile</h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your email address" disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Enter your full address"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Profile
                </>
              )}
            </button>
          </form>

          {/* Account Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 space-y-1">
              <p>Account created: {user.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
              <p>Last updated: {user.updatedAt ? formatDate(user.updatedAt) : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
