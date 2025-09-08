const Order = require('../MongoDb/models/Order');



// Create Orders
exports.createOrder = async (req, res) => {
    try {
        const { orderId, quantity, address } = req.body;
        if (!orderId || !quantity || !address) {
        return res.status(400).json({ error: "All fields are required" });
        }
    
        const newOrder = new Order({
        orderId,
        quantity,
        address,
        userId: req.user._id // Assuming user is authenticated and user ID is available
        });
    
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        res.status(500).json({ error: "Failed to place order", details: err.message });
    }
    };
    
    // Get Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders", details: err.message });
    }
}
// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            return res.status(400).json({ error: "Order ID and status are required" });
        }

        const order = await Order.findOneAndUpdate(
            { _id: orderId, userId: req.user._id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (err) {
        res.status(500).json({ error: "Failed to update order status", details: err.message });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOneAndDelete({ _id: orderId, userId: req.user._id });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete order", details: err.message });
    }
};

// Get Order by user ID
exports.getOrderByUserId = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        if (!orders.length) {
            return res.status(404).json({ error: "No orders found for this user" });
        }
        res.status(200).json({ orders });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders", details: err.message });
    }
};

// get Order by Order ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.find ({ orderId, userId: req.user._id });
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.status(200).json({ order });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch order", details: err.message });
    }
};
