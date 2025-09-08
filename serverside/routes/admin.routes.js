const express = require('express');
const router = express.Router();
const product = require('../controllers/ProductApi.js');
const offer = require('../controllers/OfferApi.js');
const category = require('../controllers/CategoryApi.js');

//Product Routes
router.post('/product', product.uploadMiddleware, product.createProduct);
router.get('/product/:productId', product.getProductById); 
router.get('/products', product.getAllProducts);
router.delete('/product/:productId', product.deleteProduct);
router.put('/product/:productId', product.uploadMiddleware, product.updateProduct);

// Offer Routes
router.post('/offer', offer.createOffer);
router.get('/offers', offer.getAllOffers);
router.delete('/offer/:offerId', offer.deleteOffer);
router.put('/offer/:offerId', offer.updateOffer);

// Category Routes
router.post('/category', category.createCategory);
router.get('/category/:categoryId', category.getCategoryById);
router.get('/categories', category.getAllCategories);
router.delete('/category/:categoryId', category.deleteCategory);
router.put('/category/:categoryId', category.updateCategory);

module.exports = router;