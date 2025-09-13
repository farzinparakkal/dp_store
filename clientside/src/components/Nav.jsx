import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { ShoppingCart, User, Package, LogOut, ChevronDown } from 'lucide-react';

const Nav = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated() && user) {
      loadCartCount();
    }
  }, [isAuthenticated, user]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isAuthenticated() && user) {
        loadCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isAuthenticated, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadCartCount = async () => {
    try {
      const response = await userAPI.getCart(user._id);
      // Handle the backend response structure: { cart: { items: [...] } }
      const cartItems = response.cart?.items || [];
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(totalItems);
    } catch (error) {
      console.error('Error loading cart count:', error);
      // Set cart count to 0 on error to prevent UI issues
      setCartCount(0);
    }
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleCart = () => {
    if (isAuthenticated()) {
      navigate('/cart');
    } else {
      navigate('/auth');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate('/profile');
  };

  const handleMyOrders = () => {
    setIsDropdownOpen(false);
    navigate('/my-orders');
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-50 shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo and Store Info */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-cyan-600">Diapers Store</h1>
              <p className="text-base text-gray-600">Premium baby care products</p>
            </div>
          </div>

          {/* Right: Login and Cart */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>

                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name || 'Account'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <button
                      onClick={handleProfile}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleMyOrders}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="text-cyan-500 hover:text-cyan-600 font-small text-sm border border-cyan-400 px-4 py-1 rounded-lg"
              >
                Login
              </button>
            )}

            <button
              onClick={handleCart}
              className="relative flex gap-2 items-center justify-center w-16 h-8 border border-cyan-400 rounded-lg hover:bg-cyan-50 transition"
            >
              {/* Cart Icon */}
              <ShoppingCart className="w-4 h-4 text-cyan-500 hover:text-gray-800" />

              {/* Cart Count */}
              <span className="ml-1 text-cyan-600 font-semibold">
                {isAuthenticated() ? cartCount : 0}
              </span>

              {/* Notification Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full hover:text-gray-800">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;