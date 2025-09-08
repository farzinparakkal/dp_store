const cart = require('../MongoDb/models/Cart');

// Add to Cart User
exports.addToCart = async (req, res) => {
  try {
    const cartItem = new Cart(req.body);
    await cartItem.save();
    res.status(201).json({ cartItem });
  } catch (err) {
    res.status(500).json({ error: "Add to cart failed", details: err.message });
  }
};
// Get Cart Items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id });
    res.status(200).json({ cartItems });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart items", details: err.message });
  }
};
// Remove from Cart
// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const result = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Cart or item not found' });
    }

    res.status(200).json({ message: 'Item removed successfully', cart: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Update quantity of an item in the cart
exports.updateCartItemQuantity = async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  try {
    const result = await Cart.findOneAndUpdate(
      { userId, 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Cart or item not found' });
    }

    res.status(200).json({ message: 'Quantity updated', cart: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get total amount of items in the cart
exports.getCartTotal = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: 'Cart is empty or not found' });
    }

    let total = 0;
    cart.items.forEach(item => {
      total += item.quantity * (item.productId.price || 0);
    });

    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get cart by user ID
exports.getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};