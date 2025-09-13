const Product = require('../MongoDb/models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, JPG, GIF are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Create Product
exports.createProduct = async (req, res) => {
    try {
        console.log('Received product creation request:', req.body);
        console.log('Received files:', req.files);
        
        const { name, description, price, category, size, stock, count, originalPrice, onOffer, outOfStock } = req.body;
        
        console.log('Extracted fields:', { name, description, price, category, size, stock, onOffer, outOfStock });
        
        if (!name || !description || !price || !category) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({ error: "Name, description, price, and category are required" });
        }

        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
            console.log('Image uploaded:', imagePath);
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            image: imagePath,
            size,
            stock,
            count,
            originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
            onOffer: onOffer === 'true' || onOffer === true,
            outOfStock: outOfStock === 'true' || outOfStock === true
        });

        console.log('Created product object:', product);
        
        await product.save();
        console.log('Product saved successfully:', product);
        
        res.status(201).json({ message: "Product created successfully", product: product });
    } catch (err) {
        console.error('Product creation error:', err);
        res.status(500).json({ error: "Failed to create product", details: err.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete product", details: err.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        console.log('Received product update request:', req.body);
        console.log('Received files:', req.file);
        
        const { productId } = req.params;
        const updates = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Handle image upload if new image is provided
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
            console.log('New image uploaded:', updates.image);
        }

        // Convert string values to appropriate types
        if (updates.price) updates.price = parseFloat(updates.price);
        if (updates.originalPrice) updates.originalPrice = parseFloat(updates.originalPrice);
        if (updates.stock) updates.stock = parseInt(updates.stock);
        if (updates.onOffer !== undefined) updates.onOffer = updates.onOffer === 'true' || updates.onOffer === true;
        if (updates.outOfStock !== undefined) updates.outOfStock = updates.outOfStock === 'true' || updates.outOfStock === true;

        Object.assign(product, updates); // Merge changes
        await product.save();

        console.log('Product updated successfully:', product);
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (err) {
        console.error('Product update error:', err);
        res.status(500).json({ error: "Failed to update product", details: err.message });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ product });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch product", details: err.message });
    }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products", details: err.message });
    }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        if (!products.length) {
            return res.status(404).json({ error: "No products found in this category" });
        }
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products by category", details: err.message });
    }
};

// Get Products on Offer
exports.getProductsOnOffer = async (req, res) => {
    try {
        const products = await Product.find({ onOffer: true });
        if (!products.length) {
            return res.status(404).json({ error: "No products on offer found" });
        }
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products on offer", details: err.message });
    }
};

// Export upload middleware
exports.uploadMiddleware = upload.single('image');
