import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userAPI } from '../services/api';
import { Package, Clock, CheckCircle, XCircle, Calendar, MapPin, CreditCard, Phone, User, ArrowLeft, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { io } from 'socket.io-client';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showInfo } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchOrders();
      // Set up polling for real-time updates every 5 seconds
      startPolling();
      // Set up WebSocket connection for instant updates
      setupWebSocket();
    }
    
    return () => {
      stopPolling();
      disconnectWebSocket();
    };
  }, [user]);

  const fetchOrders = async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError('');
      
      const response = await userAPI.getOrders(user._id);
      const newOrders = response.orders || [];
      
      // Check if any order status has changed
      if (orders.length > 0 && isBackgroundRefresh) {
        const statusChanged = newOrders.some(newOrder => {
          const oldOrder = orders.find(o => o._id === newOrder._id);
          return oldOrder && oldOrder.status !== newOrder.status;
        });
        
        if (statusChanged) {
          // Show a brief notification that orders have been updated
          showInfo('Order status updated!');
        }
      }
      
      setOrders(newOrders);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (!isBackgroundRefresh) {
        setError('Failed to load orders');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const startPolling = () => {
    // Clear any existing interval
    stopPolling();
    
    // Set up new interval for polling every 5 seconds
    intervalRef.current = setInterval(() => {
      if (isAuthenticated() && user && document.visibilityState === 'visible') {
        fetchOrders(true); // Background refresh
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };


  const setupWebSocket = () => {
    if (!user) return;
    
    try {
      // Initialize socket connection
      socketRef.current = io('http://localhost:5000', {
        transports: ['websocket', 'polling']
      });
      
      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        // Join user-specific room
        socketRef.current.emit('join-user-room', user._id);
      });
      
      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      });
      
      // Listen for order status updates
      socketRef.current.on('orderStatusUpdate', (data) => {
        console.log('Received order status update:', data);
        
        // Update the specific order in the orders array
        setOrders(prevOrders => {
          const updatedOrders = prevOrders.map(order => {
            if (order._id === data.orderId) {
              return { ...order, status: data.newStatus };
            }
            return order;
          });
          return updatedOrders;
        });
        
        // Show instant notification
        showSuccess(`Order ${data.orderNumber} is now ${data.newStatus}`, 'Instant Update!');
        setLastUpdated(new Date());
      });
      
      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });
      
    } catch (error) {
      console.error('Error setting up WebSocket:', error);
    }
  };
  
  const disconnectWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };
  

  const handleManualRefresh = () => {
    fetchOrders(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#edf8f9'}}>
        <div className="text-center bg-white rounded-lg shadow-md p-8 mx-4 max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#edf8f9'}}>
        <div className="text-center bg-white rounded-lg shadow-md p-8 mx-4 max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#edf8f9'}}>
        <div className="text-center bg-white rounded-lg shadow-md p-8 mx-4 max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{backgroundColor: '#edf8f9'}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              {/* <div className="flex items-center gap-2">
                {isConnected ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs">Live</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orange-600">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs">Polling</span>
                  </div>
                )}
              </div> */}
              
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleManualRefresh}
                disabled={loading || isRefreshing}
                className="flex items-center gap-2 px-3 py-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders • {isConnected ? 'Instant live updates' : 'Auto-updates every 5 seconds'}</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <a 
              href="/"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors inline-flex items-center"
            >
              <Package className="w-5 h-5 mr-2" />
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {item.productId?.image ? (
                                <img 
                                  src={`http://localhost:5000${item.productId.image}`} 
                                  alt={item.productId.name || 'Product'} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {item.productId?.name || 'Product Not Found'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} | Size: {item.productId?.size || 'NB'} | ₹{item.price}
                              </p>
                              {item.productId?.description && (
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {item.productId.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Delivery Info */}
                    <div className="space-y-4">
                      {/* Customer Info */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{order.customerInfo.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{order.customerInfo.phone}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{order.customerInfo.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">Delivery Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Date: {order.delivery.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Time: {order.delivery.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>Payment: {order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
