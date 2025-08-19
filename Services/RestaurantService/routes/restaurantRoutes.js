const express = require('express');
const router = express.Router();
const {
  getPublicRestaurants,
  getPublicRestaurantDetails,
  getAdminRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  getRestaurantDetails,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  submitRating,
} = require('../controllers/restaurantController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');

// Customer: Public access
router.get('/public', getPublicRestaurants);
router.get('/public/:id', getPublicRestaurantDetails);

// Route for submitting restaurant ratings
router.post('/:id/rate', authenticate, restrictTo('customer'), submitRating);

// Admin: Protected routes
router.get('/', authenticate, restrictTo('restaurant_admin'), getAdminRestaurants);
router.get('/:id', authenticate, restrictTo('restaurant_admin'), getRestaurantDetails);
router.get('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), getMenuItem);
router.post('/', authenticate, restrictTo('restaurant_admin'), createRestaurant);
router.put('/:id', authenticate, restrictTo('restaurant_admin'), updateRestaurant);
router.delete('/:id', authenticate, restrictTo('restaurant_admin'), deleteRestaurant);
router.post('/:id/menu', authenticate, restrictTo('restaurant_admin'), addMenuItem);
router.put('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), updateMenuItem);
router.delete('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), deleteMenuItem);

module.exports = router;