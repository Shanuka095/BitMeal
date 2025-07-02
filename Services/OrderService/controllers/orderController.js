const Order = require('../models/orderModel');
const axios = require('axios'); // Import axios for inter-service communication

// Base URL for the RestaurantService (can be an environment variable in production)
const RESTAURANT_SERVICE_URL = 'http://localhost:3003/api/restaurants';

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

    // Optional: Verify if the restaurant exists by calling RestaurantService API
    // This adds robustness but also latency. For now, we'll proceed if Joi validation passes.
    // In a production system, you might want to fetch restaurant details to ensure menu item prices are current.

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
    const adminToken = req.headers.authorization; // Get the original token from the request

    // Verify if the admin owns this restaurant by calling RestaurantService API
    // This is crucial for security and microservice best practices
    let restaurant;
    try {
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/${restaurantId}`, {
        headers: { Authorization: adminToken }, // Pass the admin's token to RestaurantService
      });
      restaurant = restaurantResponse.data;
      // Ensure the fetched restaurant's owner matches the adminId from the token
      if (restaurant.owner.toString() !== adminId) {
        return res.status(403).json({ error: 'Access denied: You do not own this restaurant.' });
      }
    } catch (axiosErr) {
      console.error('Error verifying restaurant ownership with RestaurantService:', axiosErr.response?.data || axiosErr.message);
      return res.status(axiosErr.response?.status || 500).json({ error: 'Failed to verify restaurant ownership.' });
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
    const userToken = req.headers.authorization; // Get the original token from the request

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify if the user is authorized to update this order's status
    // Call RestaurantService to verify restaurant ownership
    let restaurant;
    try {
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/${order.restaurantId}`, {
        headers: { Authorization: userToken }, // Pass the user's token to RestaurantService
      });
      restaurant = restaurantResponse.data;
      if (restaurant.owner.toString() !== userId) {
        return res.status(403).json({ error: 'Access denied: You are not authorized to update this order.' });
      }
    } catch (axiosErr) {
      console.error('Error verifying restaurant ownership for order status update:', axiosErr.response?.data || axiosErr.message);
      return res.status(axiosErr.response?.status || 500).json({ error: 'Failed to verify authorization for order update.' });
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
