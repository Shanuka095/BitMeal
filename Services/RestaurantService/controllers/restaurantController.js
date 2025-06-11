const Restaurant = require('../models/restaurantModel');
const Joi = require('joi');

// Validation Schemas
const restaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  owner: Joi.string().required(),
});

const menuItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().min(2).max(50).required(),
});

// Customer: Get all restaurants
const getPublicRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().lean();
    if (!restaurants.length) {
      return res.json({ message: 'No restaurants available', data: [] });
    }
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

const getAdminRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.userId }).lean();
    if (!restaurants.length) {
      return res.json({ message: 'No restaurants found for this admin', data: [] });
    }
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

// Admin: Create a restaurant
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
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

// Admin: Update a restaurant
const updateRestaurant = async (req, res) => {
  try {
    const { error } = restaurantSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

// Admin: Delete a restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

// Admin: Add a menu item
const addMenuItem = async (req, res) => {
  try {
    const { error } = menuItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    restaurant.menu.push(req.body);
    await restaurant.save();
    res.status(201).json(restaurant.menu[restaurant.menu.length - 1]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// Admin: Get restaurant details (including menu)
const getRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId }).lean();
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
};

// Admin: Update a menu item
const updateMenuItem = async (req, res) => {
  try {
    const { error } = menuItemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    Object.assign(menuItem, req.body);
    await restaurant.save();
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

// Admin: Delete a menu item
const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    restaurant.menu.id(req.params.menuId).remove();
    await restaurant.save();
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

module.exports = {
  getPublicRestaurants,
  getAdminRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  getRestaurantDetails,
  updateMenuItem,
  deleteMenuItem,
};