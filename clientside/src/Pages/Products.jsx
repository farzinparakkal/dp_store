import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Heart, Star, Filter, Search } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await userAPI.getAllCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const addToCart = async (product) => {
    if (!isAuthenticated()) {
      showWarning('Please login to add items to cart');
      return;
    }

    try {
      await userAPI.addToCart({
        userId: user._id,
        productId: product._id,
        quantity: 1,
      });
      showSuccess('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding product to cart');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesOffer = !showOnlyOffers || product.onOffer;
    
    return matchesSearch && matchesCategory && matchesOffer;
  });

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
            <p className="text-gray-600">Discover our premium collection of baby products</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyOffers}
                  onChange={(e) => setShowOnlyOffers(e.target.checked)}
                  className="rounded"
                />
                <span>On Offer Only</span>
              </label>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setShowOnlyOffers(false);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="relative cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">📦</span>
                        </div>
                      )}
                      
                      {product.onOffer && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          OFFER
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-t-lg flex items-center justify-center">
                          <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          className="font-semibold text-lg text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          {product.name}
                        </h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm text-gray-500 ml-1">(4.5)</span>
                        </div>
                        <span className="text-sm text-gray-500">{product.category}</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                          {product.size && (
                            <span className="text-sm text-gray-500 ml-2">({product.size})</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/product/${product._id}`)}
                          className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={product.stock === 0}
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
