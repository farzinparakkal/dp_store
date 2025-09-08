import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
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
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await userAPI.getCart(user._id);
      setCartItems(response.cartItems || []);
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
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await userAPI.updateCartQuantity(user._id, productId, newQuantity);
      await loadCart();
      await loadCartTotal();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await userAPI.removeFromCart(user._id, productId);
      await loadCart();
      await loadCartTotal();
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error removing item from cart');
    }
  };

  const handleFormChange = (field, value) => {
    setCheckoutForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = () => {
    // TODO: Implement order placement
    console.log('Placing order:', checkoutForm);
    alert('Order placement functionality will be implemented soon!');
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
    <div className="min-h-screen bg-gray-50">
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
      
      <div className="max-w-7xl mx-auto px-4 py-8">

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4">
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xl">📦</span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.product?.name || 'Product'}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Size: {item.product?.size || 'N/A'} • {item.product?.category || 'Category'}
                        </p>
                        <p className="text-teal-600 font-semibold mt-1">
                          {item.product?.price || 0} QR each
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        Subtotal: {((item.product?.price || 0) * item.quantity).toFixed(0)} QR
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

                {/* Checkout Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={checkoutForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="Your phone number"
                      value={checkoutForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      <option value="9-12">9:00 AM - 12:00 PM</option>
                      <option value="12-15">12:00 PM - 3:00 PM</option>
                      <option value="15-18">3:00 PM - 6:00 PM</option>
                      <option value="18-21">6:00 PM - 9:00 PM</option>
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
