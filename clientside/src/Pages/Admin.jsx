import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Package, ShoppingCart, TrendingUp, Upload, RefreshCw, X, Tag, ShoppingBag } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [productImage, setProductImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingOffer, setEditingOffer] = useState(null);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    size: '',
    stock: '',
    count: '',
    onOffer: false
  });

  // Offer form state
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    isActive: true
  });

  // API Base URL
  const API_BASE = 'http://localhost:5000/api';

  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState({
    totalSales: 0,
    totalOrders: 0,
    deliveredOrders: 0
  });

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminSession = localStorage.getItem('adminSession');

    if (!adminAuth || adminAuth !== 'true' || !adminSession) {
      navigate('/admin-auth');
      return;
    }

    try {
      const session = JSON.parse(adminSession);
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

      if (hoursDiff > 24) {
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminSession');
        navigate('/admin-auth');
        return;
      }
    } catch (error) {
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminSession');
      navigate('/admin-auth');
      return;
    }

    fetchProducts();
    fetchOffers();
    fetchOrderStats();
  }, [navigate]);

  // API Functions
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/products`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Network error while fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/offers`);
      const data = await response.json();
      if (response.ok) {
        setBanners(data.offers || []);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  const fetchOrderStats = async () => {
    try {
      // Placeholder for order stats - you can implement admin order stats endpoint
      setOrders({
        totalSales: 0,
        totalOrders: 0,
        deliveredOrders: 0
      });
    } catch (err) {
      console.error('Error fetching order stats:', err);
    }
  };

  const createProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!productForm.name || !productForm.category || !productForm.price || !productForm.size) {
        setError('Please fill in all required fields (Name, Category, Price, Size)');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description || productForm.name);
      formData.append('price', parseFloat(productForm.price));
      formData.append('category', productForm.category);
      formData.append('size', productForm.size);
      formData.append('stock', parseInt(productForm.stock) || 0);
      formData.append('onOffer', productForm.onOffer);
      
      // Append image file if selected
      if (productImage) {
        formData.append('image', productImage);
      }

      console.log('Sending product data with FormData');

      const response = await fetch(`${API_BASE}/admin/product`, {
        method: 'POST',
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        await fetchProducts(); // Refresh products list
        // Reset form
        setProductForm({
          name: '',
          description: '',
          category: '',
          price: '',
          originalPrice: '',
          size: '',
          stock: '',
          count: '',
          onOffer: false
        });
        setProductImage(null);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || data.details || 'Failed to create product');
        console.error('Product creation failed:', data);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while creating product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!productForm.name || !productForm.category || !productForm.price || !productForm.size) {
        setError('Please fill in all required fields (Name, Category, Price, Size)');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description || productForm.name);
      formData.append('price', parseFloat(productForm.price));
      formData.append('category', productForm.category);
      formData.append('size', productForm.size);
      formData.append('stock', parseInt(productForm.stock) || 0);
      formData.append('onOffer', productForm.onOffer);
      
      // Append image file if selected
      if (productImage) {
        formData.append('image', productImage);
      }

      console.log('Sending product data with FormData');

      const response = await fetch(`${API_BASE}/admin/product/${editingProduct._id}`, {
        method: 'PUT',
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        await fetchProducts(); // Refresh products list
        // Reset form
        setProductForm({
          name: '',
          description: '',
          category: '',
          price: '',
          originalPrice: '',
          size: '',
          stock: '',
          count: '',
          onOffer: false
        });
        setProductImage(null);
        setEditingProduct(null);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || data.details || 'Failed to update product');
        console.error('Product update failed:', data);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while updating product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/product/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchProducts(); // Refresh products list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('Network error while deleting product');
    }
  };

  const handleProductFormChange = (field, value) => {
    setProductForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const renderOrdersTab = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Sales</p>
              <p className="text-2xl font-bold">{orders.totalSales} QR</p>
            </div>
            <div className="text-3xl opacity-80">$</div>
          </div>
        </div>
        
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Orders</p>
              <p className="text-2xl font-bold">{orders.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 opacity-80" />
          </div>
        </div>
        
        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Delivered Orders</p>
              <p className="text-2xl font-bold">{orders.deliveredOrders}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Order Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Order Management
            </h3>
            <button className="flex items-center text-cyan-500 hover:text-cyan-600">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>
        <div className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No orders yet</h4>
          <p className="text-gray-500">Orders will appear here when customers place them</p>
        </div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add New Product */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center">
            {editingProduct ? (
              <Edit className="w-5 h-5 mr-2" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => handleProductFormChange('name', e.target.value)}
              placeholder="e.g. Baby Diapers Size 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              value={productForm.category}
              onChange={(e) => handleProductFormChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option>Select category</option>
              <option>Diapers</option>
              <option>Baby Wipes</option>
              <option>Baby Formula</option>
              <option>Baby Clothing</option>
              <option>Baby Toys</option>
              <option>Baby Care</option>
              <option>Feeding</option>
              <option>Others</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              {productImage ? (
                <img src={URL.createObjectURL(productImage)} alt="Product Image" className="mx-auto mb-4 rounded" />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              )}
              <input
                type="file"
                onChange={(e) => setProductImage(e.target.files[0])}
                className="text-cyan-500 hover:text-cyan-600"
              />
              <span className="text-gray-500 ml-2">{productImage ? productImage.name : 'No file chosen'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (QR) *</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => handleProductFormChange('price', e.target.value)}
                placeholder="75.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (QR)</label>
              <input
                type="number"
                value={productForm.originalPrice}
                onChange={(e) => handleProductFormChange('originalPrice', e.target.value)}
                placeholder="85.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
              <select
                value={productForm.size}
                onChange={(e) => handleProductFormChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option>Newborn (NB)</option>
                <option>Size 1</option>
                <option>Size 2</option>
                <option>Size 3</option>
                <option>Size 4</option>
                <option>Size 5</option>
                <option>Size 6</option>
                <option>Small (S)</option>
                <option>Medium (M)</option>
                <option>Large (L)</option>
                <option>Extra Large (XL)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Count *</label>
              <input
                type="number"
                value={productForm.count}
                onChange={(e) => handleProductFormChange('count', e.target.value)}
                placeholder="70pcs"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Qty</label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => handleProductFormChange('stock', e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={productForm.onOffer}
              onChange={(e) => handleProductFormChange('onOffer', e.target.checked)}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Mark as Special Offer</label>
          </div>
          
          <button
            onClick={editingProduct ? updateProduct : createProduct}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            {loading ? (
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-white"></div>
            ) : (
              editingProduct ? (
                <Edit className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )
            )}
            {loading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Add Product')}
          </button>
        </div>
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Products Management ({products.length} products)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={product.image ? `${API_BASE.replace('/api', '')}${product.image}` : '/api/placeholder/60/60'} 
                    alt={product.name} 
                    className="w-12 h-12 rounded-md object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/60/60';
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">
                      Category: {product.category} • Size: {product.size} • {product.count || '2'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-cyan-600 font-semibold">{product.price} QR</span>
                      {product.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">{product.originalPrice} QR</span>
                      )}
                      <span className="text-green-600 text-sm">Stock: {product.stock}</span>
                      {product.specialOffer && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">Special Offer</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setProductForm({
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        size: product.size,
                        stock: product.stock,
                        count: product.count,
                        onOffer: product.onOffer
                      });
                      setEditingProduct(product);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOffersTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Edit Banner */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center">
            <Edit className="w-5 h-5 mr-2" />
            Edit Banner
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Banner Image *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
              {bannerImage ? (
                <img src={URL.createObjectURL(bannerImage)} alt="Banner Image" className="mx-auto mb-4 rounded" />
              ) : (
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              )}
              <input
                type="file"
                onChange={(e) => setBannerImage(e.target.files[0])}
                className="text-cyan-500 hover:text-cyan-600"
              />
              <span className="text-gray-500 ml-2">{bannerImage ? bannerImage.name : 'No file chosen'}</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
              <Plus className="w-4 h-4 mr-2" />
              Update Banner
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Banner Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Banner Management ({banners.length} banners)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={banner.image} alt="Banner" className="w-20 h-12 rounded-md object-cover bg-gray-200" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${banner.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOffersFormTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add New Offer */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center">
            {editingOffer ? (
              <Edit className="w-5 h-5 mr-2" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            {editingOffer ? 'Edit Offer' : 'Add New Offer'}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Title *</label>
            <input
              type="text"
              value={offerForm.title}
              onChange={(e) => setOfferForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Buy 1 Get 1 Free"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Offer Description *</label>
            <textarea
              value={offerForm.description}
              onChange={(e) => setOfferForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g. Buy 1 Get 1 Free on all baby diapers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%) *</label>
            <input
              type="number"
              value={offerForm.discount}
              onChange={(e) => setOfferForm(prev => ({ ...prev, discount: e.target.value }))}
              placeholder="e.g. 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={offerForm.isActive}
              onChange={(e) => setOfferForm(prev => ({ ...prev, isActive: e.target.checked }))}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">Is Active</label>
          </div>
          
          <button
            onClick={editingOffer ? updateOffer : createOffer}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
          >
            {loading ? (
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-white"></div>
            ) : (
              editingOffer ? (
                <Edit className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )
            )}
            {loading ? (editingOffer ? 'Updating...' : 'Creating...') : (editingOffer ? 'Update Offer' : 'Add Offer')}
          </button>
          
          {editingOffer && (
            <button
              onClick={() => {
                setEditingOffer(null);
                setOfferForm({
                  title: '',
                  description: '',
                  discount: '',
                  isActive: true
                });
                setError('');
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center mt-2"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Offers Management */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-cyan-600 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Offers Management ({banners.length} offers)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={banner.image} alt="Banner" className="w-20 h-12 rounded-md object-cover bg-gray-200" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${banner.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {banner.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setOfferForm({
                        title: banner.title,
                        description: banner.description,
                        discount: banner.discount,
                        isActive: banner.isActive
                      });
                      setEditingOffer(banner);
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const createOffer = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!offerForm.title || !offerForm.description || !offerForm.discount) {
        setError('Please fill in all required fields (Title, Description, Discount)');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', offerForm.title);
      formData.append('description', offerForm.description);
      formData.append('discount', parseFloat(offerForm.discount));
      formData.append('isActive', offerForm.isActive);
      
      // Append image file if selected
      if (bannerImage) {
        formData.append('image', bannerImage);
      }

      console.log('Sending offer data with FormData');

      const response = await fetch(`${API_BASE}/admin/offer`, {
        method: 'POST',
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        await fetchOffers(); // Refresh offers list
        // Reset form
        setOfferForm({
          title: '',
          description: '',
          discount: '',
          isActive: true
        });
        setBannerImage(null);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || data.details || 'Failed to create offer');
        console.error('Offer creation failed:', data);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while creating offer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOffer = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate required fields
      if (!offerForm.title || !offerForm.description || !offerForm.discount) {
        setError('Please fill in all required fields (Title, Description, Discount)');
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', offerForm.title);
      formData.append('description', offerForm.description);
      formData.append('discount', parseFloat(offerForm.discount));
      formData.append('isActive', offerForm.isActive);
      
      // Append image file if selected
      if (bannerImage) {
        formData.append('image', bannerImage);
      }

      console.log('Sending offer data with FormData');

      const response = await fetch(`${API_BASE}/admin/offer/${editingOffer.id}`, {
        method: 'PUT',
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        await fetchOffers(); // Refresh offers list
        // Reset form
        setOfferForm({
          title: '',
          description: '',
          discount: '',
          isActive: true
        });
        setBannerImage(null);
        setEditingOffer(null);
        setError(''); // Clear any previous errors
      } else {
        setError(data.error || data.details || 'Failed to update offer');
        console.error('Offer update failed:', data);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while updating offer: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                A
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage your store</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[20px]">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium border-r border-gray-200 transition-colors ${
                activeTab === 'products'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Package className="w-5 h-5 mr-2" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium border-r border-gray-200 transition-colors ${
                activeTab === 'offers'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Tag className="w-5 h-5 mr-2" />
              Offers
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 flex items-center justify-center px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-teal-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Orders
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'products' && renderProductsTab()}
        {activeTab === 'offers' && renderOffersFormTab()}
      </div>
    </div>
  );
};

export default Admin;