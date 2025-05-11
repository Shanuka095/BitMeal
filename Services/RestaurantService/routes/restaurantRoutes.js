const express = require('express');
const router = express.Router();
const { createRestaurant, addMenuItem, getRestaurants, getRestaurantById } = require('../controllers/restaurantController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');

router.post('/restaurants', authenticate, restrictTo('restaurant_admin'), createRestaurant);
router.post('/restaurants/:restaurantId/menu', authenticate, restrictTo('restaurant_admin'), addMenuItem);
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurantById);

module.exports = router;