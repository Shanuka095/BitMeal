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
  submitRating, // NEW: Import submitRating
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

// Admin/Delivery Personnel/Customer: Get a specific delivery person by ID
router.get(
  '/:id',
  authenticate,
  restrictTo('restaurant_admin', 'delivery_personnel', 'customer'),
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

// Update my own location
router.post(
  '/my-location',
  authenticate,
  restrictTo('delivery_personnel'),
  updateMyGeolocation
);

// NEW: Customer submits a rating for a delivery person
router.post('/:id/rate', authenticate, restrictTo('customer'), submitRating);

module.exports = router;
