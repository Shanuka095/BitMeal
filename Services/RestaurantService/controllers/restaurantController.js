// src/controllers/restaurantController.js
const Restaurant = require('../models/restaurantModel');
const Joi = require('joi');

// Validation schemas
const restaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(200).required(),
  cuisine: Joi.string().min(3).max(50).required(),
});

// src/controllers/restaurantController.js
const menuItemSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow(''),
  price: Joi.number().positive().required(),
  category: Joi.string().min(3).max(50).required(),
}).unknown(false); // Reject unexpected fields

// Validation middleware
const validateRestaurant = (req, res, next) => {
  const { error } = restaurantSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateMenuItem = (req, res, next) => {
  console.log('Body:', req.body); // Debug
  const { error } = menuItemSchema.validate(req.body);
  if (error) {
    console.log('Error:', error.details); // Debug
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant({
      name: req.body.name,
      address: req.body.address,
      cuisine: req.body.cuisine,
      owner: req.user.userId,
    });
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created', restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findOne({ _id: id, owner: req.user.userId });
    if (!restaurant) {
      return res.status(403).json({ error: 'Access denied: You do not own this restaurant' });
    }

    restaurant.name = req.body.name || restaurant.name;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.cuisine = req.body.cuisine || restaurant.cuisine;
    await restaurant.save();
    res.json({ message: 'Restaurant created', restaurant });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
};

const removeRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findOneAndDelete({ _id: id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  console.log('Params:', req.params); // Debug
  console.log('Body:', req.body); // Debug
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.restaurantId, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    restaurant.menu.push({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });
    await restaurant.save();
    res.status(201).json({ message: 'Menu item added', menu: restaurant.menu });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select('name address cuisine menu');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findById(id).select('name address cuisine menu');
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRestaurant,
  updateRestaurant,
  removeRestaurant,
  addMenuItem,
  getRestaurants,
  getRestaurantById,
  validateRestaurant,
  validateMenuItem,
};