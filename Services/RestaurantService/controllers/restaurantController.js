const Restaurant = require('../models/restaurantModel');
const Joi = require('joi');

// Validation Schemas
const restaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  imageUrl: Joi.string().uri().optional().allow(''), // Validate image URL if provided
});

const menuItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(2).max(50).required(),
  imageUrl: Joi.string().uri().optional().allow(''), // Validate image URL if provided
});

// Customer: Get all restaurants (Public access)
const getPublicRestaurants = async (req, res) => {
  try {
    console.log('getPublicRestaurants: Fetching all restaurants (public access)');
    const restaurants = await Restaurant.find().lean();
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
      console.warn('getAdminRestaurants called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
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
      console.warn('getMenuItem called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
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
    const { name, address, imageUrl } = req.body;
    const { error } = restaurantSchema.validate({ name, address, imageUrl });
    if (error) {
      console.error('CreateRestaurant validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('CreateRestaurant called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
    }

    const restaurant = new Restaurant({
      name,
      address,
      imageUrl,
      owner: req.user.userId,
    });
    await restaurant.save();
    console.log('Restaurant created:', restaurant.name, 'by owner:', req.user.userId);
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Error in createRestaurant:', err);
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

// Admin: Update a restaurant (including image)
const updateRestaurant = async (req, res) => {
  try {
    const { name, address, imageUrl } = req.body;
    const { error } = restaurantSchema.validate({ name, address, imageUrl }, { stripUnknown: true });
    if (error) {
      console.error('UpdateRestaurant validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('UpdateRestaurant called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
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
      console.warn('DeleteRestaurant called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
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
    const { name, price, category, imageUrl } = req.body;
    const { error } = menuItemSchema.validate({ name, price, category, imageUrl });
    if (error) {
      console.error('AddMenuItem validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('AddMenuItem called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
    }

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });

    restaurant.menu.push({ name, price, category, imageUrl });
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
      console.warn('getRestaurantDetails called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
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
    const { name, price, category, imageUrl } = req.body;
    const { error } = menuItemSchema.validate({ name, price, category, imageUrl });
    if (error) {
      console.error('UpdateMenuItem validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.user || !req.user.userId) {
      console.warn('UpdateMenuItem called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
    }

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or not owned by user' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    Object.assign(menuItem, { name, price, category, imageUrl });
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
      console.warn('DeleteMenuItem called without req.user.userId. Token decode issue or missing user.');
      return res.status(401).json({ error: 'Unauthorized: User ID not found in token payload' });
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
};