const Cart = require('../MongoDb/models/Cart');

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
    const result = await Cart.findOneAndDelete({ userId, productId });

    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed successfully' });
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
      { userId, productId },
      { $set: { quantity } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Quantity updated', cartItem: result });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get total amount of items in the cart
exports.getCartTotal = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await Cart.find({ userId }).populate('productId');
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ total: 0 });
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.productId.price * item.quantity);
    }, 0);

    res.status(200).json({ total });
  } catch (error) {
    console.error('Error getting cart total:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Clear entire cart for a user
exports.clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } },
      { new: true, upsert: true }
    );

    res.status(200).json({ 
      message: 'Cart cleared successfully', 
      cart: result 
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Get cart by user ID
exports.getCartByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await Cart.find({ userId }).populate('productId');
    
    // Return cart structure that matches frontend expectations
    const cart = {
      items: cartItems || []
    };
    
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};