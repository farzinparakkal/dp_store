const express = require('express');
const cart = require('../controllers/CartApi.js');
const {getAllCategories} = require('../controllers/CategoryApi.js');
const {getAllProducts, getProductById, getProductsByCategory, getProductsOnOffer} = require('../controllers/ProductApi.js');
const {getAllOffers} = require('../controllers/OfferApi.js');
const {updateProfile, getProfile} = require('../controllers/UserApi.js');
const {placeOrder} = require('../controllers/OrderApi.js');

const router = express.Router();

// Cart Routes
router.post('/cart', cart.addToCart);
router.get('/cart/:userId', cart.getCartByUserId);
router.delete('/cart/:userId/:productId', cart.removeFromCart);
router.put('/cart/:userId/:productId', cart.updateCartItemQuantity);
router.get('/cart/total/:userId', cart.getCartTotal);
router.delete('/cart/clear/:userId', cart.clearCart);

// Category Routes
router.get('/categories', getAllCategories);

// Product Routes
router.get('/products', getAllProducts);
router.get('/product/:productId', getProductById);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/on-offer', getProductsOnOffer);

// Offer Routes
router.get('/offers', getAllOffers);

// User Profile Routes
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);

// Order Routes
router.post('/order/:userId', placeOrder);
router.get('/orders/:userId', require('../controllers/OrderApi.js').getOrders);

module.exports = router;