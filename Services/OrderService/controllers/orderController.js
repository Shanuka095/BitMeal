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
  }
  catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch customer orders' });
  }
};

// Get the single active order for a customer (for banner and dedicated page)
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

    console.log(`OrderService (getRestaurantOrders) - Fetching orders for restaurantId: ${restaurantId} by adminId: ${adminId}`);
    console.log(`OrderService (getRestaurantOrders) - Admin Token (first 10 chars): ${adminToken ? adminToken.substring(0, 10) : 'N/A'}`);

    let restaurant;
    try {
      // Internal call to RestaurantService to verify ownership
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/${restaurantId}`, {
        headers: { Authorization: adminToken },
      });
      restaurant = restaurantResponse.data;
      console.log(`OrderService (getRestaurantOrders) - RestaurantService response for ID ${restaurantId}:`, restaurant);

      if (restaurant.owner.toString() !== adminId) {
        console.warn(`OrderService (getRestaurantOrders) - Access denied: Admin ${adminId} does not own restaurant ${restaurantId}.`);
        return res.status(403).json({ error: 'Access denied: You do not own this restaurant.' });
      }
    } catch (axiosErr) {
      console.error(`OrderService (getRestaurantOrders) - Error verifying restaurant ownership for ID ${restaurantId}:`, axiosErr.response?.data || axiosErr.message);
      const statusCode = axiosErr.response?.status || 500;
      const errorMessage = axiosErr.response?.data?.error || 'Failed to verify restaurant ownership with RestaurantService.';
      return res.status(statusCode).json({ error: errorMessage });
    }

    const orders = await Order.find({ restaurantId }).sort({ orderDate: -1 }).lean();
    console.log(`Fetched ${orders.length} orders for restaurant ${restaurantId} by admin ${adminId}`);
    res.json(orders);
  } catch (error) {
    console.error('OrderService (getRestaurantOrders) - Unexpected error:', error);
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


    // If status is being set to 'delivered', update driver status to 'available'
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

// Assign a delivery person to an order (Admin)
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

        if (order.status !== 'confirmed' && order.status !== 'preparing') {
            return res.status(400).json({ error: `Cannot assign delivery to an order with status "${order.status}". Order must be pending or confirmed.` });
        }
        
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
        order.status = 'out_for_delivery';
        await order.save();

        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${deliveryPersonId}/status`, { status: 'on_delivery' }, {
                headers: { Authorization: userToken },
            });
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

// Get orders assigned to a specific driver
const getDriverAssignedOrders = async (req, res) => {
    try {
        const driverId = req.user.userId; // The userId of the logged-in driver
        const orders = await Order.find({ deliveryPersonId: driverId, status: { $nin: ['delivered', 'cancelled'] } })
                                  .sort({ orderDate: -1 })
                                  .lean();

        // For each order, fetch relevant restaurant and customer details
        const ordersWithDetails = await Promise.all(orders.map(async (order) => {
            const userToken = req.headers.authorization;
            let restaurantDetails = null;
            let customerDetails = null;

            // Fetch restaurant details
            try {
                const resResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/public/${order.restaurantId}`);
                restaurantDetails = resResponse.data;
                // Simulate restaurant location
                const restaurantCoords = [order.deliveryLocation.coordinates[0] - 0.01, order.deliveryLocation.coordinates[1] + 0.01];
                restaurantDetails.location = { type: 'Point', coordinates: restaurantCoords };
            } catch (err) {
                console.warn(`Could not fetch restaurant details for order ${order._id}:`, err.message);
            }

            // Fetch customer details (only name and phone for driver view)
            try {
                // Assuming UserService has a public profile endpoint or specific driver-view endpoint
                // For now, we'll fetch the full profile and extract what's needed.
                const userResponse = await axios.get(`http://localhost:3002/api/users/profile`, { 
                    headers: { Authorization: userToken },
                });
                customerDetails = {
                    name: userResponse.data.name,
                    phone: userResponse.data.phone,
                    address: userResponse.data.address, // Include address for driver
                };
            } catch (err) {
                console.warn(`Could not fetch customer details for order ${order._id}:`, err.message);
            }

            return {
                ...order,
                restaurant: restaurantDetails,
                customer: customerDetails,
            };
        }));

        console.log(`Fetched ${ordersWithDetails.length} assigned orders for driver ${driverId}`);
        res.json(ordersWithDetails);
    } catch (error) {
        console.error('Error fetching driver assigned orders:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch assigned orders' });
    }
};

// Driver accepts an order
const driverAcceptOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const driverId = req.user.userId;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ error: 'Order not found.' });
        if (order.deliveryPersonId.toString() !== driverId) return res.status(403).json({ error: 'Access denied: Not assigned to this order.' });
        if (order.status !== 'pending' && order.status !== 'confirmed') return res.status(400).json({ error: `Order status is ${order.status}. Cannot accept.` });

        order.status = 'preparing'; // Driver accepts, status moves to preparing
        await order.save();
        console.log(`Driver ${driverId} accepted order ${orderId}. Status: ${order.status}`);
        res.json(order);
    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).json({ error: error.message || 'Failed to accept order' });
    }
};

// Driver marks order as picked up
const driverPickupOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const driverId = req.user.userId;
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ error: 'Order not found.' });
        if (order.deliveryPersonId.toString() !== driverId) return res.status(403).json({ error: 'Access denied: Not assigned to this order.' });
        if (order.status !== 'preparing') return res.status(400).json({ error: `Order status is ${order.status}. Cannot pick up.` });

        order.status = 'out_for_delivery'; // Driver picked up
        await order.save();
        console.log(`Driver ${driverId} picked up order ${orderId}. Status: ${order.status}`);
        res.json(order);
    }
    catch (error) {
        console.error('Error picking up order:', error);
        res.status(500).json({ error: 'Failed to pick up order' });
    }
};

// Driver marks order as delivered
const driverDeliverOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const driverId = req.user.userId;
        const userToken = req.headers.authorization; // Driver's token
        const order = await Order.findById(orderId);

        if (!order) return res.status(404).json({ error: 'Order not found.' });
        if (order.deliveryPersonId.toString() !== driverId) return res.status(403).json({ error: 'Access denied: Not assigned to this order.' });
        if (order.status !== 'out_for_delivery') return res.status(400).json({ error: `Order status is ${order.status}. Cannot deliver.` });

        order.status = 'delivered'; // Driver delivered
        await order.save();
        console.log(`Driver ${driverId} delivered order ${orderId}. Status: ${order.status}`);

        // Set driver status to 'available' after delivery
        try {
            await axios.patch(`${DELIVERY_SERVICE_URL}/${order.deliveryPersonId}/status`, { status: 'available' }, {
                headers: { Authorization: userToken },
            });
            console.log(`Driver ${order.deliveryPersonId} status updated to 'available' after delivery.`);
        } catch (axiosErr) {
            console.error(`Failed to set driver status to 'available' for ${order.deliveryPersonId}:`, axiosErr.response?.data || axiosErr.message);
        }

        res.json(order);
    } catch (error) {
        console.error('Error delivering order:', error);
        res.status(500).json({ error: 'Failed to deliver order' });
    }
};


// Customer submits combined rating for restaurant and driver for a specific order
const submitCombinedOrderRating = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { restaurantRating, driverRating, restaurantLikeStatus, driverLikeStatus } = req.body;
        const userId = req.user.userId; // Customer's userId
        const userToken = req.headers.authorization;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found.' });
        if (order.userId.toString() !== userId) return res.status(403).json({ error: 'Access denied: You are not authorized to rate this order.' });
        if (order.status !== 'delivered') return res.status(400).json({ error: 'Only delivered orders can be rated.' });

        // Submit Restaurant Rating
        if (!order.restaurantRated && restaurantRating) {
            try {
                await axios.post(`${RESTAURANT_SERVICE_URL}/${order.restaurantId}/rate`, { rating: restaurantRating, likeStatus: restaurantLikeStatus }, { // Pass likeStatus to RestaurantService
                    headers: { Authorization: userToken },
                });
                order.restaurantRated = true;
                order.restaurantLikeStatus = restaurantLikeStatus;
                console.log(`Restaurant ${order.restaurantId} rated by user ${userId}.`);
            } catch (err) {
                console.warn(`Failed to submit restaurant rating for order ${orderId}:`, err.response?.data || err.message);
            }
        }

        // Submit Driver Rating
        if (!order.driverRated && driverRating && order.deliveryPersonId) {
            try {
                await axios.post(`${DELIVERY_SERVICE_URL}/${order.deliveryPersonId}/rate`, { rating: driverRating, likeStatus: driverLikeStatus }, { // Pass likeStatus to DeliveryService
                    headers: { Authorization: userToken },
                });
                order.driverRated = true;
                order.driverLikeStatus = driverLikeStatus;
                console.log(`Driver ${order.deliveryPersonId} rated by user ${userId}.`);
            } catch (err) {
                console.warn(`Failed to submit driver rating for order ${orderId}:`, err.response?.data || err.message);
            }
        }

        // Save order to update rating flags
        await order.save();
        res.json({ message: 'Ratings submitted successfully.' });

    } catch (error) {
        console.error('Error submitting combined order rating:', error);
        res.status(500).json({ error: error.message || 'Failed to submit ratings.' });
    }
};


module.exports = {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson,
  // markOrderAsRated, // REMOVED THIS LINE
  getActiveOrder,
  getDriverAssignedOrders,
  driverAcceptOrder,
  driverPickupOrder,
  driverDeliverOrder,
  submitCombinedOrderRating, // NEW
};
