const Order = require('../models/orderModel');
const Restaurant = require('../../RestaurantService/models/restaurantModel'); // To verify restaurant ownership

// Create a new order (Customer)
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    const userId = req.user.userId; // From authenticated user token

    // Basic validation for items and totalAmount consistency (more robust in frontend/Joi)
    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) { // Allow for small floating point discrepancies
      return res.status(400).json({ error: 'Calculated total does not match provided total amount' });
    }

    // Optional: Verify if the restaurant exists (can be done here or relied on frontend)
    // For a robust system, you'd call RestaurantService to verify restaurant and menu items.
    // For now, we'll assume valid restaurantId and menu items are sent from frontend.

    const newOrder = new Order({
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending', // Default status
    });

    await newOrder.save();
    console.log(`Order created: ${newOrder._id} for user ${userId} at restaurant ${restaurantId}`);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
};

// Get all orders for a specific customer
const getCustomerOrders = async (req, res) => {
  try {
    const userId = req.user.userId; // From authenticated user token
    const orders = await Order.find({ userId }).sort({ orderDate: -1 }).lean(); // Sort by most recent
    console.log(`Fetched ${orders.length} orders for customer ${userId}`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch customer orders' });
  }
};

// Get all orders for a specific restaurant (Admin)
const getRestaurantOrders = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId; // Restaurant ID from URL parameter
    const adminId = req.user.userId; // From authenticated admin token

    // Verify if the admin owns this restaurant
    const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: adminId });
    if (!restaurant) {
      return res.status(403).json({ error: 'Access denied: You do not own this restaurant or it does not exist.' });
    }

    const orders = await Order.find({ restaurantId }).sort({ orderDate: -1 }).lean(); // Sort by most recent
    console.log(`Fetched ${orders.length} orders for restaurant ${restaurantId} by admin ${adminId}`);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch restaurant orders' });
  }
};

// Update order status (Admin/Delivery Personnel)
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const userId = req.user.userId; // User performing the update

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if the user is authorized to update this order's status
    // 1. If it's a restaurant admin, they must own the restaurant associated with the order
    // 2. If it's a delivery personnel (future), they must be assigned to this order
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant || restaurant.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to update this order.' });
    }

    order.status = status;
    await order.save();
    console.log(`Order ${orderId} status updated to ${status} by user ${userId}`);
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message || 'Failed to update order status' });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
};
