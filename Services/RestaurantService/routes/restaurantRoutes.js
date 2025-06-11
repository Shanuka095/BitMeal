// Services/RestaurantService/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, addMenuItem, updateMenuItem, deleteMenuItem, getPublicRestaurants } = require('../controllers/restaurantController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');

router.get('/public', getPublicRestaurants); // Public endpoint for all restaurants
router.get('/', authenticate, restrictTo('restaurant_admin'), getRestaurants); // Admin-only endpoint for owned restaurants
router.get('/:id', authenticate, restrictTo('restaurant_admin'), getRestaurantById); // Restrict to admin only
router.post('/', authenticate, restrictTo('restaurant_admin'), createRestaurant);
router.put('/:id', authenticate, restrictTo('restaurant_admin'), updateRestaurant);
router.delete('/:id', authenticate, restrictTo('restaurant_admin'), deleteRestaurant);
router.post('/:id/menu', authenticate, restrictTo('restaurant_admin'), addMenuItem);
router.put('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), updateMenuItem);
router.delete('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), deleteMenuItem);

module.exports = router;