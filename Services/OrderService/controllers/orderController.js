const Order = require('../models/orderModel');
const axios = require('axios');

const RESTAURANT_SERVICE_URL = 'http://localhost:3003/api/restaurants';
// NEW: URL for DeliveryService
const DELIVERY_SERVICE_URL = 'http://localhost:3005/api/delivery';

// Create a new order (Customer)
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    const userId = req.user.userId;

    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ error: 'Calculated total does not match provided total amount' });
    }

    const newOrder = new Order({
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'pending',
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
    const userId = req.user.userId;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 }).lean();
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
    const restaurantId = req.params.restaurantId;
    const adminId = req.user.userId;
    const adminToken = req.headers.authorization;

    let restaurant;
    try {
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/${restaurantId}`, {
        headers: { Authorization: adminToken },
      });
      restaurant = restaurantResponse.data;
      if (restaurant.owner.toString() !== adminId) {
        return res.status(403).json({ error: 'Access denied: You do not own this restaurant.' });
      }
    } catch (axiosErr) {
      console.error('Error verifying restaurant ownership with RestaurantService:', axiosErr.response?.data || axiosErr.message);
      return res.status(axiosErr.response?.status || 500).json({ error: 'Failed to verify restaurant ownership.' });
    }

    const orders = await Order.find({ restaurantId }).sort({ orderDate: -1 }).lean();
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
    const userId = req.user.userId;
    const userToken = req.headers.authorization;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let restaurant;
    try {
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/${order.restaurantId}`, {
        headers: { Authorization: userToken },
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

// NEW: Assign a delivery person to an order (Admin)
const assignOrderToDeliveryPerson = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryPersonId } = req.body;
        const userId = req.user.userId;
        const userToken = req.headers.authorization;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found.' });
        }

        // Verify that the order is in a state that can be assigned
        if (order.status !== 'confirmed' && order.status !== 'preparing') {
            return res.status(400).json({ error: `Cannot assign delivery to an order with status "${order.status}".` });
        }
        
        // Verify that the user is the owner of the restaurant for this order
        let restaurant;
        try {
          const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/${order.restaurantId}`, {
            headers: { Authorization: userToken },
          });
          restaurant = restaurantResponse.data;
          if (restaurant.owner.toString() !== userId) {
            return res.status(403).json({ error: 'Access denied: You do not own this restaurant.' });
          }
        } catch (axiosErr) {
          return res.status(axiosErr.response?.status || 500).json({ error: 'Failed to verify restaurant ownership.' });
        }

        // Verify the delivery person exists and is available
        let deliveryPerson;
        try {
            const dpResponse = await axios.get(`${DELIVERY_SERVICE_URL}/${deliveryPersonId}`, {
                headers: { Authorization: userToken }, // Pass admin token
            });
            deliveryPerson = dpResponse.data;
            if (deliveryPerson.status !== 'available') {
                return res.status(400).json({ error: 'Selected delivery person is not available.' });
            }
        } catch (axiosErr) {
            console.error('Error verifying delivery person:', axiosErr.response?.data || axiosErr.message);
            return res.status(axiosErr.response?.status || 500).json({ error: 'Failed to verify delivery person.' });
        }

        // Update the order with the delivery person and change status
        order.deliveryPersonId = deliveryPersonId;
        order.status = 'out_for_delivery';
        await order.save();

        // Update the delivery person's status in DeliveryService
        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${deliveryPersonId}/status`, { status: 'on_delivery' }, {
                headers: { Authorization: userToken }, // Pass admin token
            });
        } catch (axiosErr) {
            console.error('Error updating delivery person status:', axiosErr.response?.data || axiosErr.message);
            // We still return success for the order, but log the error
        }

        console.log(`Order ${orderId} assigned to delivery person ${deliveryPersonId}`);
        res.status(200).json(order);

    } catch (error) {
        console.error('Error assigning delivery person:', error);
        res.status(500).json({ error: error.message || 'Failed to assign delivery person' });
    }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson, // NEW
};