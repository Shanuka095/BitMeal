const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getRestaurantOrders,
  updateOrderStatus,
  assignOrderToDeliveryPerson,
  getActiveOrder,
  getDriverAssignedOrders,
  driverAcceptOrder,
  driverPickupOrder,
  driverDeliverOrder,
  submitCombinedOrderRating,
} = require('../controllers/orderController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../middleware/validate');

// Customer Routes
router.post('/', authenticate, restrictTo('customer'), validateCreateOrder, createOrder);
router.get('/my-orders', authenticate, restrictTo('customer'), getCustomerOrders);
router.get('/my-active-order', authenticate, restrictTo('customer'), getActiveOrder);
router.get('/my-active-order-details', authenticate, restrictTo('customer'), getActiveOrder);

// Route for customer to submit combined restaurant and driver rating
router.post('/:orderId/submit-rating', authenticate, restrictTo('customer'), submitCombinedOrderRating);

// Admin Routes (for restaurant owners)
router.get('/restaurant/:restaurantId', authenticate, restrictTo('restaurant_admin'), getRestaurantOrders);
router.put('/:orderId/status', authenticate, restrictTo('restaurant_admin'), validateUpdateOrderStatus, updateOrderStatus);
router.put('/:orderId/assign-delivery', authenticate, restrictTo('restaurant_admin'), assignOrderToDeliveryPerson);

// Driver-specific routes
router.get('/driver-assigned', authenticate, restrictTo('delivery_personnel'), getDriverAssignedOrders);
router.patch('/:orderId/driver-accept', authenticate, restrictTo('delivery_personnel'), driverAcceptOrder);
router.patch('/:orderId/driver-pickup', authenticate, restrictTo('delivery_personnel'), driverPickupOrder);
router.patch('/:orderId/driver-deliver', authenticate, restrictTo('delivery_personnel'), driverDeliverOrder);

module.exports = router;
