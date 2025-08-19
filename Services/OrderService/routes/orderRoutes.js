const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson,
  markOrderAsRated,
  getActiveOrder,
} = require('../controllers/orderController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../middleware/validate');

// Customer Routes
router.post('/', authenticate, restrictTo('customer'), validateCreateOrder, createOrder);
router.get('/my-orders', authenticate, restrictTo('customer'), getCustomerOrders);
router.patch('/:orderId/mark-rated', authenticate, restrictTo('customer'), markOrderAsRated);
router.get('/my-active-order', authenticate, restrictTo('customer'), getActiveOrder); // This route will be used by the banner.
router.get('/my-active-order-details', authenticate, restrictTo('customer'), getActiveOrder); // Dedicated route for the active order page.


// Admin Routes (for restaurant owners)
router.get('/restaurant/:restaurantId', authenticate, restrictTo('restaurant_admin'), getRestaurantOrders);
router.put('/:orderId/status', authenticate, restrictTo('restaurant_admin'), validateUpdateOrderStatus, updateOrderStatus);
router.put('/:orderId/assign-delivery', authenticate, restrictTo('restaurant_admin'), assignOrderToDeliveryPerson);

module.exports = router;