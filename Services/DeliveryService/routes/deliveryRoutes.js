const express = require('express');
const router = express.Router();
const {
  createDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPerson,
  updateDeliveryPersonStatus,
  deleteDeliveryPerson,
  updateMyGeolocation,
} = require('../controllers/deliveryController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const {
  validateCreateDeliveryPerson,
  validateUpdateDeliveryPerson,
  validateUpdateDeliveryPersonStatus,
} = require('../middleware/validate');

// Admin only: Create a new delivery person profile
router.post(
  '/',
  authenticate,
  restrictTo('restaurant_admin'),
  validateCreateDeliveryPerson,
  createDeliveryPerson
);

// Admin: Get all delivery persons
// Delivery Personnel: Get their own profile
router.get(
  '/',
  authenticate,
  restrictTo('restaurant_admin', 'delivery_personnel'),
  getAllDeliveryPersons
);

// Admin/Delivery Personnel: Get a specific delivery person by ID
router.get(
  '/:id',
  authenticate,
  restrictTo('restaurant_admin', 'delivery_personnel'),
  getDeliveryPersonById
);

// Admin/Delivery Personnel: Update delivery person details
router.put(
  '/:id',
  authenticate,
  restrictTo('restaurant_admin', 'delivery_personnel'),
  validateUpdateDeliveryPerson,
  updateDeliveryPerson
);

// Admin/Delivery Personnel: Update only delivery person's status
router.patch(
  '/:id/status',
  authenticate,
  restrictTo('restaurant_admin', 'delivery_personnel'),
  validateUpdateDeliveryPersonStatus,
  updateDeliveryPersonStatus
);

// Admin only: Delete a delivery person
router.delete(
  '/:id',
  authenticate,
  restrictTo('restaurant_admin'),
  deleteDeliveryPerson
);

// NEW: Update my own location
router.post(
  '/my-location',
  authenticate,
  restrictTo('delivery_personnel'),
  updateMyGeolocation
);

module.exports = router;
