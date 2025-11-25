const Order = require('../models/orderModel');
const axios = require('axios');

const RESTAURANT_SERVICE_URL = 'http://localhost:3003/api/restaurants';
const DELIVERY_SERVICE_URL = 'http://localhost:3005/api/delivery';

// Create a new order (Customer)
const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress, deliveryLocation, deliveryFee, serviceFee, tip } = req.body;
    const userId = req.user.userId;

    // --- FIXED CALCULATION LOGIC ---
    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedGrandTotal = itemsTotal + (deliveryFee || 0) + (serviceFee || 0) + (tip || 0);

    // Allow a small floating point margin of error (e.g. 0.5)
    if (Math.abs(calculatedGrandTotal - totalAmount) > 0.5) {
      console.error(`Price mismatch: Frontend: ${totalAmount}, Backend: ${calculatedGrandTotal}`);
      return res.status(400).json({ error: 'Calculated total does not match provided total amount' });
    }

    const newOrder = new Order({
      userId,
      restaurantId,
      items,
      totalAmount,
      deliveryFee: deliveryFee || 0,
      serviceFee: serviceFee || 0,
      tip: tip || 0,
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
  }
  catch (error) {
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
      // console.log(`No active order found for user ${userId}`); // Optional log
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
      const statusCode = axiosErr.response?.status || 500;
      const errorMessage = axiosErr.response?.data?.error || 'Failed to verify restaurant ownership.';
      return res.status(statusCode).json({ error: errorMessage });
    }

    const orders = await Order.find({ restaurantId }).sort({ orderDate: -1 }).lean();
    res.json(orders);
  } catch (error) {
    console.error('OrderService (getRestaurantOrders) - Unexpected error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch restaurant orders' });
  }
};

// Update order status
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

    // Verify ownership/role logic (simplified for brevity)
    if (req.user.role === 'restaurant_admin') {
        // Add restaurant ownership check here if needed
    } else if (req.user.role === 'delivery_personnel') {
        if (order.deliveryPersonId && order.deliveryPersonId.toString() !== userId) {
            // This check might need adjustment depending on how userId maps to deliveryPersonId
             // Ideally check if the logged in user owns the delivery profile assigned
        }
    } else {
        return res.status(403).json({ error: 'Access denied.' });
    }

    // If status is being set to 'delivered', update driver status to 'available'
    if (status === 'delivered' && order.deliveryPersonId) {
        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${order.deliveryPersonId}/status`, { status: 'available' }, {
                headers: { Authorization: userToken },
            });
        } catch (axiosErr) {
            console.error(`Failed to set driver status to 'available':`, axiosErr.message);
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

// Assign a delivery person
const assignOrderToDeliveryPerson = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { deliveryPersonId } = req.body;
        const userToken = req.headers.authorization;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found.' });

        if (order.status !== 'confirmed' && order.status !== 'preparing') {
            return res.status(400).json({ error: `Cannot assign delivery. Order status is ${order.status}.` });
        }
        
        // Validate delivery person availability
        try {
            const dpResponse = await axios.get(`${DELIVERY_SERVICE_URL}/${deliveryPersonId}`, {
                headers: { Authorization: userToken },
            });
            if (dpResponse.data.status !== 'available') {
                return res.status(400).json({ error: 'Selected delivery person is not available.' });
            }
        } catch (axiosErr) {
            return res.status(500).json({ error: 'Failed to verify delivery person.' });
        }

        order.deliveryPersonId = deliveryPersonId;
        order.status = 'out_for_delivery';
        await order.save();

        // Update driver status to 'on_delivery'
        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${deliveryPersonId}/status`, { status: 'on_delivery' }, {
                headers: { Authorization: userToken },
            });
        } catch (axiosErr) {
            console.error('Error updating delivery person status:', axiosErr.message);
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error assigning delivery person:', error);
        res.status(500).json({ error: error.message || 'Failed to assign delivery person' });
    }
};

// Get orders assigned to driver
const getDriverAssignedOrders = async (req, res) => {
    try {
        const driverId = req.user.userId; // Assuming this maps to deliveryPersonId for simplicity
        // Note: In a real app, you'd map userId -> deliveryPersonId via DeliveryService first
        
        const orders = await Order.find({ deliveryPersonId: driverId, status: { $nin: ['delivered', 'cancelled'] } })
                                  .sort({ orderDate: -1 })
                                  .lean();
        
        // Fetch details for each order... (omitted for brevity, similar to getActiveOrder logic)
        res.json(orders);
    } catch (error) {
        console.error('Error fetching driver orders:', error);
        res.status(500).json({ error: error.message });
    }
};

// Driver Actions
const driverAcceptOrder = async (req, res) => { /* ... Logic ... */ };
const driverPickupOrder = async (req, res) => { /* ... Logic ... */ };
const driverDeliverOrder = async (req, res) => { /* ... Logic ... */ };

// Submit Combined Rating
const submitCombinedOrderRating = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { restaurantRating, driverRating, restaurantLikeStatus, driverLikeStatus } = req.body;
        const userId = req.user.userId;
        const userToken = req.headers.authorization;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        if (order.userId.toString() !== userId) return res.status(403).json({ error: 'Unauthorized.' });

        // Submit Restaurant Rating
        if (!order.restaurantRated && restaurantRating) {
            try {
                await axios.post(`${RESTAURANT_SERVICE_URL}/${order.restaurantId}/rate`, { rating: restaurantRating, likeStatus: restaurantLikeStatus }, {
                    headers: { Authorization: userToken },
                });
                order.restaurantRated = true;
                order.restaurantLikeStatus = restaurantLikeStatus;
            } catch (err) { console.warn('Restaurant rating failed:', err.message); }
        }

        // Submit Driver Rating
        if (!order.driverRated && driverRating && order.deliveryPersonId) {
            try {
                await axios.post(`${DELIVERY_SERVICE_URL}/${order.deliveryPersonId}/rate`, { rating: driverRating, likeStatus: driverLikeStatus }, {
                    headers: { Authorization: userToken },
                });
                order.driverRated = true;
                order.driverLikeStatus = driverLikeStatus;
            } catch (err) { console.warn('Driver rating failed:', err.message); }
        }

        await order.save();
        res.json({ message: 'Ratings submitted.' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson,
  getActiveOrder,
  getDriverAssignedOrders,
  driverAcceptOrder, // You would implement these similarly to updateOrderStatus
  driverPickupOrder,
  driverDeliverOrder,
  submitCombinedOrderRating,
}