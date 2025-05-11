const Restaurant = require('../models/restaurantModel');

const createRestaurant = async (req, res) => {
  const { name, address, cuisine } = req.body;
  try {
    const restaurant = new Restaurant({
      name,
      address,
      cuisine,
      owner: req.user.userId,
    });
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant created', restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  const { restaurantId, name, description, price, category } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ _id: restaurantId, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or unauthorized' });

    restaurant.menu.push({ name, description, price, category });
    await restaurant.save();
    res.status(201).json({ message: 'Menu item added', menu: restaurant.menu });
  } catch (error) {
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

module.exports = { createRestaurant, addMenuItem, getRestaurants, getRestaurantById };