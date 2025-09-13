const express = require('express');
const router = express.Router();
const product = require('../controllers/ProductApi.js');
const offer = require('../controllers/OfferApi.js');
const category = require('../controllers/CategoryApi.js');
const order = require('../controllers/OrderApi.js');

//Product Routes
router.post('/product', product.uploadMiddleware, product.createProduct);
router.get('/product/:productId', product.getProductById); 
router.get('/products', product.getAllProducts);
router.get('/products/category/:category', product.getProductsByCategory);
router.get('/products/offers', product.getProductsOnOffer);
router.delete('/product/:productId', product.deleteProduct);
router.put('/product/:productId', product.uploadMiddleware, product.updateProduct);

// Offer Routes
router.post('/offer', offer.uploadMiddleware, offer.createOffer);
router.get('/offers', offer.getAllOffers);
router.delete('/offer/:offerId', offer.deleteOffer);
router.put('/offer/:offerId', offer.uploadMiddleware, offer.updateOffer);

// Category Routes
router.post('/category', category.createCategory);
router.get('/category/:categoryId', category.getCategoryById);
router.get('/categories', category.getAllCategories);
router.delete('/category/:categoryId', category.deleteCategory);
router.put('/category/:categoryId', category.updateCategory);

// Order Routes
router.get('/orders', order.getAllOrders);
router.get('/orders/stats', order.getOrderStats);
router.put('/orders/:orderId/status', order.updateOrderStatusAdmin);

module.exports = router;