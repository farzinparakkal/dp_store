const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  size: { type: String },
  stock: { type: Number, default: 0 },
  count: { type: String }, // e.g., "70pcs", "24 pieces"
  originalPrice: { type: Number }, // For showing discounted prices
  onOffer: { type: Boolean, default: false },
  outOfStock: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);