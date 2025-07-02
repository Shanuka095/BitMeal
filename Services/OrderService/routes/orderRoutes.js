const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../middleware/validate');

// Customer Routes
router.post('/', authenticate, restrictTo('customer'), validateCreateOrder, createOrder);
router.get('/my-orders', authenticate, restrictTo('customer'), getCustomerOrders);

// Admin Routes (for restaurant owners)
// Get orders for a specific restaurant owned by the admin
router.get('/restaurant/:restaurantId', authenticate, restrictTo('restaurant_admin'), getRestaurantOrders);
// Update status of an order (e.g., confirmed, preparing, delivered)
router.put('/:orderId/status', authenticate, restrictTo('restaurant_admin'), validateUpdateOrderStatus, updateOrderStatus);

// Future: Delivery Personnel Routes could be added here

module.exports = router;
