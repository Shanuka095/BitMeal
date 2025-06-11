// Services/RestaurantService/controllers/restaurantController.js
const Restaurant = require('../models/restaurantModel');
const Joi = require('joi');
const mongoose = require('mongoose');

const menuItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow(''),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(2).max(50).required(),
  available: Joi.boolean().default(true),
}).unknown(false);

const restaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  cuisine: Joi.string().min(2).max(50).required(),
  owner: Joi.string().required(),
  menu: Joi.array().items(menuItemSchema).default([]),
}).unknown(false);

const getPublicRestaurants = async (req, res) => {
  try {
    console.log('Fetching public restaurants'); // Debug log
    const restaurants = await Restaurant.find().lean(); // Fetch all restaurants
    console.log('Public restaurants found:', restaurants); // Debug log
    res.json(restaurants || []);
  } catch (err) {
    console.error('Get public restaurants error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch public restaurants', details: err.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    console.log('Fetching restaurants for user:', req.user); // Debug log
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const restaurants = await Restaurant.find({ owner: req.user.userId }).lean(); // Use lean for performance
    console.log('Restaurants found:', restaurants); // Debug log
    res.json(restaurants || []);
  } catch (err) {
    console.error('Get restaurants error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch restaurants', details: err.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const restaurant = await Restaurant.findOne({ _id: id, owner: req.user.userId }).lean();
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    console.error('Get restaurant by ID error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch restaurant', details: err.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { error } = restaurantSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = new Restaurant({
      ...req.body,
      owner: req.user.userId,
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Create restaurant error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to create restaurant', details: err.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const { error } = restaurantSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: id, owner: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    console.error('Update restaurant error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update restaurant', details: err.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const restaurant = await Restaurant.findOneAndDelete({ _id: id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error('Delete restaurant error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete restaurant', details: err.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }
    const { error } = menuItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or unauthorized' });

    restaurant.menu.push(req.body);
    await restaurant.save();
    res.status(201).json({ message: 'Menu item added successfully', menu: restaurant.menu[restaurant.menu.length - 1] });
  } catch (err) {
    console.error('Add menu item error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to add menu item', details: err.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { menuId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(400).json({ error: 'Invalid restaurant or menu ID' });
    }
    const { error } = menuItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    if (restaurant.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied. You are not the owner of this restaurant' });
    }

    const menuIndex = restaurant.menu.findIndex(item => item._id.toString() === menuId);
    if (menuIndex === -1) return res.status(404).json({ error: 'Menu item not found' });

    restaurant.menu[menuIndex] = { ...restaurant.menu[menuIndex], ...req.body };
    await restaurant.save();

    res.json({ message: 'Menu item updated successfully', menu: restaurant.menu[menuIndex] });
  } catch (err) {
    console.error('Update menu item error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to update menu item', details: err.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id: restaurantId } = req.params;
    const { menuId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(400).json({ error: 'Invalid restaurant or menu ID' });
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== menuId);
    await restaurant.save();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error('Delete menu item error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to delete menu item', details: err.message });
  }
};

module.exports = { getPublicRestaurants, getRestaurants, getRestaurantById, createRestaurant, updateRestaurant, deleteRestaurant, addMenuItem, updateMenuItem, deleteMenuItem };