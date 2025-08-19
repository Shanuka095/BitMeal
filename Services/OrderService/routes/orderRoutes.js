const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson,
  markOrderAsRated,
  getActiveOrder, // NEW
} = require('../controllers/orderController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../middleware/validate');

// Customer Routes
router.post('/', authenticate, restrictTo('customer'), validateCreateOrder, createOrder);
router.get('/my-orders', authenticate, restrictTo('customer'), getCustomerOrders);
router.patch('/:orderId/mark-rated', authenticate, restrictTo('customer'), markOrderAsRated);
router.get('/my-active-order', authenticate, restrictTo('customer'), getActiveOrder); // NEW

// Admin Routes (for restaurant owners)
router.get('/restaurant/:restaurantId', authenticate, restrictTo('restaurant_admin'), getRestaurantOrders);
router.put('/:orderId/status', authenticate, restrictTo('restaurant_admin'), validateUpdateOrderStatus, updateOrderStatus);
router.put('/:orderId/assign-delivery', authenticate, restrictTo('restaurant_admin'), assignOrderToDeliveryPerson);

module.exports = router;