import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, MapPin, Phone, User, Calendar, Clock } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
    deliveryDate: '',
    deliveryTime: ''
  });

  useEffect(() => {
    if (isAuthenticated()) {
      loadCart();
      loadCartTotal();
      loadUserProfile();
    }
  }, [isAuthenticated]);

  // Calculate total whenever cart items change
  useEffect(() => {
    calculateTotalFromItems();
  }, [cartItems]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await userAPI.getProfile(user._id);
      setUserProfile(response.user);
      
      // Pre-populate checkout form with profile data
      setCheckoutForm(prev => ({
        ...prev,
        name: response.user.name || '',
        phone: response.user.phoneNumber || '',
        address: response.user.address || ''
      }));
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await userAPI.getCart(user._id);
      setCartItems(response.cart?.items || []);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartTotal = async () => {
    if (!user) return;
    
    try {
      const response = await userAPI.getCartTotal(user._id);
      setCartTotal(response.total || 0);
    } catch (error) {
      console.error('Error loading cart total:', error);
      // Calculate total from cart items if API fails
      calculateTotalFromItems();
    }
  };

  const calculateTotalFromItems = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    setCartTotal(total);
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Update local state immediately for instant UI response
    const updatedItems = cartItems.map(item => 
      item.productId._id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedItems);
    
    try {
      await userAPI.updateCartQuantity(user._id, productId, newQuantity);
      // Reload to sync with backend
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert on error
      await loadCart();
    }
  };

  const removeFromCart = async (productId) => {
    // Update local state immediately for instant UI response
    const updatedItems = cartItems.filter(item => item.productId._id !== productId);
    setCartItems(updatedItems);
    
    try {
      await userAPI.removeFromCart(user._id, productId);
      // Reload to sync with backend
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Revert on error
      await loadCart();
    }
  };

  const handleFormChange = (field, value) => {
    setCheckoutForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isProfileComplete = () => {
    if (!userProfile) return false;
    return userProfile.name && userProfile.phoneNumber && userProfile.address;
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    try {
      // Prepare order data
      const orderData = {
        customerInfo: {
          name: checkoutForm.name,
          phone: checkoutForm.phone,
          address: checkoutForm.address
        },
        delivery: {
          date: checkoutForm.deliveryDate,
          time: checkoutForm.deliveryTime
        },
        paymentMethod: checkoutForm.paymentMethod,
        cartItems: cartItems,
        totalAmount: cartTotal
      };

      // Place order (cart clearing is handled in the backend)
      const response = await userAPI.placeOrder(user._id, orderData);
      
      // Success - clear cart state immediately
      setCartItems([]);
      setCartTotal(0);
      
      // Reset form
      setCheckoutForm({
        name: '',
        phone: '',
        address: '',
        paymentMethod: 'cash',
        deliveryDate: '',
        deliveryTime: ''
      });

      showSuccess(`Order placed successfully! Order ID: ${response.order.orderId}`);
      
      // Trigger cart update event for navbar
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error placing order:', error);
      console.error('Full error details:', error);
      showError(`Failed to place order: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your cart</p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#edf8f9'}}>
      {/* Navbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Store
            </button>
            <h1 className="text-2xl font-bold text-teal-600">Shopping Cart</h1>
          </div>
        </div>
      </div>
      
      <div className="w-full px-10 py-8">

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
              <p className="mt-4 text-gray-600">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
                <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-teal-500 text-white px-8 py-3 rounded-lg hover:bg-teal-600 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 flex-shrink-0">
                        {item.productId?.image ? (
                          <img
                            src={`http://localhost:5000${item.productId.image}`}
                            alt={item.productId.name}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <span className="text-gray-400 text-2xl">📦</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {item.productId?.name || 'Product'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Size: {item.productId?.size || 'NB'} • {item.productId?.count || '75pcs'} • {item.productId?.category || 'Category'}
                        </p>
                        <p className="text-teal-600 font-bold text-lg">
                          {item.productId?.price || 0} QR each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold text-lg">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(item.productId._id)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                      <p className="text-lg font-bold text-gray-900">
                        Subtotal: {((item.productId?.price || 0) * item.quantity)} QR
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary & Checkout */}
              <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span className="font-semibold">{cartTotal.toFixed(0)} QR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-teal-600">{cartTotal.toFixed(0)} QR</span>
                  </div>
                </div>

                {/* Profile Status */}
                {!isProfileComplete() && (
                  <div className="mb-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Profile is not completed!</span>
                      </div>
                      <p className="text-sm text-amber-600 mb-3">
                        Please complete your profile for faster checkout.
                      </p>
                      <Link 
                        to="/profile" 
                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                      >
                        Complete Profile
                      </Link>
                    </div>
                  </div>
                )}

                {/* Checkout Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={checkoutForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={checkoutForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      placeholder="Enter your delivery address"
                      value={checkoutForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash"
                          checked={checkoutForm.paymentMethod === 'cash'}
                          onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                          className="mr-2 text-teal-600"
                        />
                        <span className="text-sm">💵 Cash on Delivery</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={checkoutForm.paymentMethod === 'card'}
                          onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                          className="mr-2 text-teal-600"
                        />
                        <span className="text-sm">💳 Card on Delivery</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={checkoutForm.deliveryDate}
                        onChange={(e) => handleFormChange('deliveryDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Time *
                    </label>
                    <select
                      value={checkoutForm.deliveryTime}
                      onChange={(e) => handleFormChange('deliveryTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select time slot</option>
                      <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
                      <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
                      <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
                      <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
                      <option value="7:00 PM - 9:00 PM">7:00 PM - 9:00 PM</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={!checkoutForm.address || !checkoutForm.deliveryDate || !checkoutForm.deliveryTime}
                  className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 font-semibold mt-6 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Place Order - {cartTotal.toFixed(0)} QR
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Cart;
