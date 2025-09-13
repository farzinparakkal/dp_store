import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, Heart, Star, ArrowLeft, Plus, Minus } from 'lucide-react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await userAPI.getProductById(productId);
      setProduct(response.product);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated()) {
      showWarning('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    try {
      await userAPI.addToCart({
        userId: user._id,
        productId: product._id,
        quantity: quantity,
      });
      showSuccess('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding product to cart');
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Products
          </button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-6xl">📦</span>
                  </div>
                )}
                
                {product.onOffer && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    SPECIAL OFFER
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-600">(4.5 stars)</span>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">Category:</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {product.category}
                    </span>
                  </div>
                  
                  {product.size && (
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-semibold">{product.size}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-gray-800">${product.price}</span>
                      {product.onOffer && (
                        <span className="text-sm text-green-600 ml-2">Special Price!</span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>

                  {product.stock > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 rounded-full hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="p-2 rounded-full hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={addToCart}
                        className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3 text-lg font-semibold"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart - ${(product.price * quantity).toFixed(2)}
                      </button>
                    </div>
                  )}

                  {product.stock === 0 && (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-4 px-6 rounded-lg cursor-not-allowed text-lg font-semibold"
                    >
                      Out of Stock
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Product Features:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Premium quality materials</li>
                    <li>• Safe for babies</li>
                    <li>• Fast delivery available</li>
                    <li>• 30-day return policy</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
