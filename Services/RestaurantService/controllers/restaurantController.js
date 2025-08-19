const Restaurant = require('../models/restaurantModel');
const Joi = require('joi');
const axios = require('axios');

// Base URL for the RestaurantService (can be an environment variable in production)
const RESTAURANT_SERVICE_URL = 'http://localhost:3003/api/restaurants';

// Validation Schemas
const restaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  imageUrl: Joi.string().optional().allow(''),
});

const menuItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  normalPrice: Joi.number().min(0).required(),
  extraPriceForFull: Joi.number().min(0).default(0),
  category: Joi.string().min(2).max(50).required(),
  imageUrl: Joi.string().optional().allow(''),
});

// NEW: Schema for rating submission
const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

// Customer: Get all restaurants (Public access) - UPDATED FOR SORTING AND RATINGS
const getPublicRestaurants = async (req, res) => {
  try {
    console.log('getPublicRestaurants: Fetching all restaurants (public access) and sorting by rating.');
    // Fetch all restaurants and sort by averageRating in descending order
    // If averageRating is the same, sort by totalRatings (more ratings means more reliable)
    const restaurants = await Restaurant.find().sort({ averageRating: -1, totalRatings: -1 }).lean();
    if (!restaurants.length) {
      return res.json({ message: 'No restaurants available', data: [] });
    }
    res.json(restaurants);
  } catch (err) {
    console.error('Error in getPublicRestaurants:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

// Customer: Get specific restaurant details (Public access)
const getPublicRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    console.log('Fetched public details for restaurant:', restaurant._id);
    res.json(restaurant);
  } catch (err) {
    console.error('Error in getPublicRestaurantDetails:', err);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
};

// Admin: Get restaurants owned by the logged-in admin
const getAdminRestaurants = async (req, res) => {
  try {
    console.log('getAdminRestaurants - req.user:', req.user);
    if (!req.user || !req.user.userId) {
      console.warn('getAdminRestaurants called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log('Fetching restaurants for userId:', req.user.userId);
    const restaurants = await Restaurant.find({ owner: req.user.userId }).lean();
    if (!restaurants.length) {
      return res.json({ message: 'No restaurants found for this admin', data: [] });
    }
    res.json(restaurants);
  } catch (err) {
    console.error('Error in getAdminRestaurants:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

// Admin: Get a specific menu item
const getMenuItem = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.warn('getMenuItem called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    console.log('Fetched menu item:', menuItem.name, 'for restaurant:', restaurant._id);
    res.json(menuItem);
  } catch (err) {
    console.error('Error in getMenuItem:', err);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
};

// Admin: Create a restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;
    const imageUrl = req.file ? req.file.filename : '';
    const { error } = restaurantSchema.validate({ name, address, imageUrl });
    if (error) {
      console.error('CreateRestaurant validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('CreateRestaurant called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restaurant = new Restaurant({
      name,
      address,
      imageUrl,
      owner: req.user.userId,
    });
    await restaurant.save();
    console.log('Restaurant created:', name, 'by owner:', req.user.userId, 'with imageUrl:', imageUrl);
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Error in createRestaurant:', err);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

// Admin: Update a restaurant (including image)
const updateRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;
    const imageUrl = req.file ? req.file.filename : req.body.imageUrl || '';
    const { error } = restaurantSchema.validate({ name, address, imageUrl }, { stripUnknown: true });
    if (error) {
      console.error('UpdateRestaurant validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('UpdateRestaurant called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { name, address, imageUrl },
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });
    console.log('Restaurant updated:', restaurant._id);
    res.json(restaurant);
  } catch (err) {
    console.error('Error in updateRestaurant:', err);
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

// Admin: Delete a restaurant
const deleteRestaurant = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.warn('DeleteRestaurant called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });
    console.log('Restaurant deleted:', restaurant._id);
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    console.error('Error in deleteRestaurant:', err);
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

// Admin: Add a menu item (including image)
const addMenuItem = async (req, res) => {
  try {
    const { name, normalPrice, extraPriceForFull, category } = req.body;
    const imageUrl = req.file ? req.file.filename : '';

    const parsedNormalPrice = Number(normalPrice);
    const parsedExtraPriceForFull = Number(extraPriceForFull || 0);

    const { error } = menuItemSchema.validate({
      name,
      normalPrice: parsedNormalPrice,
      extraPriceForFull: parsedExtraPriceForFull,
      category,
      imageUrl
    });

    if (error) {
      console.error('AddMenuItem validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('AddMenuItem called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    Object.assign(menuItem, {
      name,
      normalPrice: parsedNormalPrice,
      extraPriceForFull: parsedExtraPriceForFull,
      category,
      imageUrl
    });
    await restaurant.save();
    console.log('Menu item added to restaurant:', restaurant._id);
    res.status(201).json(restaurant.menu[restaurant.menu.length - 1]);
  } catch (err) {
    console.error('Error in addMenuItem:', err);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// Admin: Get restaurant details (including menu)
const getRestaurantDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.warn('getRestaurantDetails called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId }).lean();
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });
    console.log('Fetched details for restaurant:', restaurant._id);
    res.json(restaurant);
  } catch (err) {
    console.error('Error in getRestaurantDetails:', err);
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
};

// Admin: Update a menu item (including image)
const updateMenuItem = async (req, res) => {
  try {
    const { name, normalPrice, extraPriceForFull, category } = req.body;
    const imageUrl = req.file ? req.file.filename : req.body.imageUrl || '';

    const parsedNormalPrice = Number(normalPrice);
    const parsedExtraPriceForFull = Number(extraPriceForFull || 0);

    const { error } = menuItemSchema.validate({
      name,
      normalPrice: parsedNormalPrice,
      extraPriceForFull: parsedExtraPriceForFull,
      category,
      imageUrl
    });
    if (error) {
      console.error('UpdateMenuItem validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('UpdateMenuItem called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    Object.assign(menuItem, {
      name,
      normalPrice: parsedNormalPrice,
      extraPriceForFull: parsedExtraPriceForFull,
      category,
      imageUrl
    });
    await restaurant.save();
    console.log('Menu item updated:', req.params.menuId, 'for restaurant:', restaurant._id);
    res.json(menuItem);
  } catch (err) {
    console.error('Error in updateMenuItem:', err);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// Admin: Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      console.warn('DeleteMenuItem called without req.user.userId.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    menuItem.deleteOne();
    await restaurant.save();
    console.log('Menu item deleted:', req.params.menuId, 'from restaurant:', restaurant._id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    console.error('Error in deleteMenuItem:', err);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

// Submit a rating for a restaurant
const submitRating = async (req, res) => {
  try {
    const { id } = req.params; // Restaurant ID
    const { rating } = req.body; // The submitted rating (1-5)
    const userId = req.user.userId; // Customer's user ID from token

    // Validate the incoming rating
    const { error } = ratingSchema.validate({ rating });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    // Calculate new average rating
    const currentTotalScore = restaurant.averageRating * restaurant.totalRatings;
    const newTotalRatings = restaurant.totalRatings + 1;
    const newAverageRating = (currentTotalScore + rating) / newTotalRatings;

    restaurant.averageRating = newAverageRating;
    restaurant.totalRatings = newTotalRatings;

    await restaurant.save();
    console.log(`Restaurant ${id} rated ${rating} by user ${userId}. New average: ${newAverageRating.toFixed(2)}`);
    res.json({
      message: 'Rating submitted successfully',
      averageRating: restaurant.averageRating,
      totalRatings: restaurant.totalRatings,
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: error.message || 'Failed to submit rating' });
  }
};


module.exports = {
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
};
