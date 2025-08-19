const Order = require('../models/orderModel');
const axios = require('axios');

const RESTAURANT_SERVICE_URL = 'http://localhost:3003/api/restaurants';
const DELIVERY_SERVICE_URL = 'http://localhost:3005/api/delivery';

// Create a new order (Customer)
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress, deliveryLocation } = req.body;
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
      deliveryLocation,
      status: 'pending',
    });

    await newOrder.save();

    console.log(`Order created: ${newOrder._id} for user ${userId} at restaurant ${restaurantId}`);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: `Order validation failed: ${error.message}` });
    }
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

// Get the single active order for a customer
const getActiveOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userToken = req.headers.authorization;

    const activeOrder = await Order.findOne({
      userId,
      status: { $nin: ['delivered', 'cancelled'] }
    }).sort({ orderDate: -1 }).lean();

    if (!activeOrder) {
      console.log(`No active order found for user ${userId}`);
      return res.status(404).json({ message: 'No active order found.' });
    }

    // Fetch restaurant details
    try {
        const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/public/${activeOrder.restaurantId}`);
        activeOrder.restaurant = restaurantResponse.data;
        // Simulate restaurant location near the delivery location for demo purposes
        const restaurantCoords = [activeOrder.deliveryLocation.coordinates[0] - 0.01, activeOrder.deliveryLocation.coordinates[1] + 0.01];
        activeOrder.restaurant.location = {
            type: 'Point',
            coordinates: restaurantCoords
        };

    } catch (err) {
        console.warn(`Could not fetch restaurant details for order ${activeOrder._id}:`, err.message);
        activeOrder.restaurant = null;
    }

    // If a delivery person is assigned, fetch their details
    if (activeOrder.deliveryPersonId) {
        try {
            const driverResponse = await axios.get(`${DELIVERY_SERVICE_URL}/${activeOrder.deliveryPersonId}`, {
                headers: { Authorization: userToken },
            });
            activeOrder.driver = driverResponse.data;
        } catch (err) {
            console.warn(`Could not fetch driver details for order ${activeOrder._id}:`, err.message);
            activeOrder.driver = null;
        }
    }

    console.log(`Active order found for user ${userId}: ${activeOrder._id}`);
    res.json(activeOrder);
  } catch (error) {
    console.error('Error fetching active order:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch active order' });
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

// Update order status (Admin/Delivery Personnel) - UPDATED FOR DRIVER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;
    const userId = req.user.userId;
    const userToken = req.headers.authorization; // Token of the user making the update (admin or driver)

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify ownership for restaurant admin
    if (req.user.role === 'restaurant_admin') {
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
    }
    // Verify for delivery personnel that they are the assigned driver
    else if (req.user.role === 'delivery_personnel') {
        if (order.deliveryPersonId.toString() !== userId) {
            return res.status(403).json({ error: 'Access denied: You are not assigned to this order.' });
        }
    } else {
        return res.status(403).json({ error: 'Access denied: Insufficient role to update order status.' });
    }


    // NEW: If status is being set to 'delivered', update driver status to 'available'
    if (status === 'delivered' && order.deliveryPersonId) {
        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${order.deliveryPersonId}/status`, { status: 'available' }, {
                headers: { Authorization: userToken }, // Use the token of the user who delivered (driver)
            });
            console.log(`Driver ${order.deliveryPersonId} status updated to 'available' after delivery.`);
        } catch (axiosErr) {
            console.error(`Failed to set driver status to 'available' for ${order.deliveryPersonId}:`, axiosErr.response?.data || axiosErr.message);
            // Continue with order status update even if driver status fails
        }
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

// Assign a delivery person to an order (Admin) - UPDATED
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

        // Allow assignment only if order is pending or confirmed
        if (order.status !== 'pending' && order.status !== 'confirmed') {
            return res.status(400).json({ error: `Cannot assign delivery to an order with status "${order.status}". Order must be pending or confirmed.` });
        }
        
        // Verify restaurant ownership
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
                headers: { Authorization: userToken },
            });
            deliveryPerson = dpResponse.data;
            if (deliveryPerson.status !== 'available') {
                return res.status(400).json({ error: 'Selected delivery person is not available.' });
            }
        } catch (axiosErr) {
            console.error('Error verifying delivery person:', axiosErr.response?.data || axiosErr.message);
            return res.status(axiosErr.response?.status || 500).json({ error: 'Failed to verify delivery person.' });
        }

        order.deliveryPersonId = deliveryPersonId;
        // NEW: Status remains 'confirmed' or 'pending' after assignment. Driver will change to 'out_for_delivery'
        // order.status = 'out_for_delivery'; // REMOVED THIS LINE
        await order.save();

        // NEW: Set driver status to 'on_delivery' immediately upon assignment
        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${deliveryPersonId}/status`, { status: 'on_delivery' }, {
                headers: { Authorization: userToken },
            });
            console.log(`Driver ${deliveryPersonId} status set to 'on_delivery' after order assignment.`);
        } catch (axiosErr) {
            console.error('Error updating delivery person status to on_delivery:', axiosErr.response?.data || axiosErr.message);
        }

        console.log(`Order ${orderId} assigned to delivery person ${deliveryPersonId}`);
        res.status(200).json(order);

    } catch (error) {
        console.error('Error assigning delivery person:', error);
        res.status(500).json({ error: error.message || 'Failed to assign delivery person' });
    }
};

// Mark an order as rated
const markOrderAsRated = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied: You are not authorized to rate this order.' });
    }

    if (order.isRated) {
      return res.status(400).json({ error: 'Order has already been rated.' });
    }

    order.isRated = true;
    await order.save();
    console.log(`Order ${orderId} marked as rated by user ${userId}`);
    res.json({ message: 'Order marked as rated successfully.' });

  } catch (error) {
    console.error('Error marking order as rated:', error);
    res.status(500).json({ error: error.message || 'Failed to mark order as rated' });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson,
  markOrderAsRated,
  getActiveOrder,
};
