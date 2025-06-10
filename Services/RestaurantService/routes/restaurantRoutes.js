// src/routes/restaurantRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRestaurant,
  updateRestaurant,
  removeRestaurant,
  addMenuItem,
  getRestaurants,
  getRestaurantById,
  validateRestaurant,
  validateMenuItem,
} = require('../controllers/restaurantController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');

router.post('/restaurants', authenticate, restrictTo('restaurant_admin'), validateRestaurant, createRestaurant);
router.put('/restaurants/:id', authenticate, restrictTo('restaurant_admin'), validateRestaurant, updateRestaurant);
router.delete('/restaurants/:id', authenticate, restrictTo('restaurant_admin'), removeRestaurant);
router.post('/restaurants/:restaurantId/menu', authenticate, restrictTo('restaurant_admin'), validateMenuItem, addMenuItem); // Ensure correct order
router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id', getRestaurantById);

module.exports = router;