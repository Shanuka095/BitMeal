const Restaurant = require('../models/restaurantModel');
const Joi = require('joi');

// --- Validation Schemas ---
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

const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  likeStatus: Joi.string().valid('liked', 'disliked').optional().allow(null),
});

// --- PUBLIC ROUTES ---

// Get ALL Approved Restaurants (For Customers)
const getPublicRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ 
        $or: [
            { status: 'approved' },
            { status: { $exists: false } } // Handle legacy data
        ]
    })
    .sort({ averageRating: -1, totalRatings: -1 }) // Best rated first
    .lean();
    
    if (!restaurants.length) {
      return res.json({ message: 'No restaurants available', data: [] });
    }
    res.json(restaurants);
  } catch (err) {
    console.error('Error in getPublicRestaurants:', err);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

// Get Specific Restaurant Details (Public)
const getPublicRestaurantDetails = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ 
        _id: req.params.id, 
        $or: [
            { status: 'approved' },
            { status: { $exists: false } } 
        ]
    }).lean();

    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurant details' });
  }
};

// --- RESTAURANT ADMIN ROUTES ---

// Get "My" Restaurants (UPDATED: Added Sorting)
const getAdminRestaurants = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) return res.status(401).json({ error: 'Unauthorized' });
    
    // Sort by newest first
    const restaurants = await Restaurant.find({ owner: req.user.userId })
      .sort({ createdAt: -1 }) 
      .lean();
      
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
};

// Create New Restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;
    const imageUrl = req.file ? req.file.filename : '';
    const { error } = restaurantSchema.validate({ name, address, imageUrl });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = new Restaurant({
      name,
      address,
      imageUrl,
      owner: req.user.userId,
      status: 'pending', // Default to Pending for Super Admin approval
    });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create restaurant' });
  }
};

// Update Restaurant
const updateRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (address) updateFields.address = address;
    if (req.file) updateFields.imageUrl = req.file.filename;

    const query = { _id: req.params.id };
    // Allow Super Admin to update ANY, otherwise only Owner
    if (req.user.role !== 'super_admin') {
        query.owner = req.user.userId;
    }

    const restaurant = await Restaurant.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update restaurant' });
  }
};

// Delete Restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'super_admin') {
        query.owner = req.user.userId;
    }

    const restaurant = await Restaurant.findOneAndDelete(query);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete restaurant' });
  }
};

// Add Menu Item
const addMenuItem = async (req, res) => {
  try {
    const { name, normalPrice, extraPriceForFull, category } = req.body;
    const imageUrl = req.file ? req.file.filename : '';
    
    // Validate
    const { error } = menuItemSchema.validate({
      name, 
      normalPrice: Number(normalPrice), 
      extraPriceForFull: Number(extraPriceForFull || 0), 
      category, 
      imageUrl
    });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    // Check Approval Status (Optional: can be disabled if you want admins to build menu while pending)
    if (restaurant.status && restaurant.status !== 'approved') {
        return res.status(403).json({ error: 'You cannot add menu items until your restaurant is approved.' });
    }

    restaurant.menu.push({
      name,
      normalPrice: Number(normalPrice),
      extraPriceForFull: Number(extraPriceForFull || 0),
      category,
      imageUrl
    });
    await restaurant.save();
    res.status(201).json(restaurant.menu[restaurant.menu.length - 1]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add menu item' });
  }
};

// --- SUPER ADMIN ROUTES ---

const getAllRestaurants = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status === 'pending') {
            query.status = 'pending';
        } else if (status === 'approved') {
            query = { $or: [{ status: 'approved' }, { status: { $exists: false } }] };
        } else if (status === 'rejected') {
            query.status = 'rejected';
        }
        
        const restaurants = await Restaurant.find(query).sort({ createdAt: -1 });
        res.json(restaurants);
    } catch (err) {
        console.error("Super Admin Fetch Error:", err);
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
};

const updateRestaurantStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const restaurant = await Restaurant.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

// --- COMMON HELPERS ---

const getRestaurantDetails = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'super_admin') query.owner = req.user.userId;
    
    const restaurant = await Restaurant.findOne(query).lean();
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch details' });
  }
};

const getMenuItem = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'super_admin') query.owner = req.user.userId;

    const restaurant = await Restaurant.findOne(query);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'super_admin') query.owner = req.user.userId;
    
    const restaurant = await Restaurant.findOne(query);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const menuItem = restaurant.menu.id(req.params.menuId);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    if (req.body.name) menuItem.name = req.body.name;
    if (req.body.normalPrice) menuItem.normalPrice = Number(req.body.normalPrice);
    if (req.body.extraPriceForFull !== undefined) menuItem.extraPriceForFull = Number(req.body.extraPriceForFull);
    if (req.body.category) menuItem.category = req.body.category;
    if (req.file) menuItem.imageUrl = req.file.filename;

    await restaurant.save();
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'super_admin') query.owner = req.user.userId;

    const restaurant = await Restaurant.findOne(query);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    restaurant.menu.pull(req.params.menuId);
    await restaurant.save();
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
};

const submitRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, likeStatus } = req.body;
    const { error } = ratingSchema.validate({ rating, likeStatus });
    if (error) return res.status(400).json({ error: error.details[0].message });

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found.' });

    const currentTotalScore = restaurant.averageRating * restaurant.totalRatings;
    const newTotalRatings = restaurant.totalRatings + 1;
    restaurant.averageRating = (currentTotalScore + rating) / newTotalRatings;
    restaurant.totalRatings = newTotalRatings;

    if (likeStatus === 'liked') restaurant.totalLikes += 1;
    else if (likeStatus === 'disliked') restaurant.totalDislikes += 1;

    await restaurant.save();
    res.json({ message: 'Rating submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit rating' });
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
  getAllRestaurants,
  updateRestaurantStatus
};