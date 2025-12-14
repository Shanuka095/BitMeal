const express = require('express');
const router = express.Router();
const {
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
  getAllRestaurants,      // Added
  updateRestaurantStatus  // Added
} = require('../controllers/restaurantController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const multer = require('multer');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// --- PUBLIC ROUTES ---
router.get('/public', getPublicRestaurants);
router.get('/public/:id', getPublicRestaurantDetails);

// --- CUSTOMER ROUTES ---
router.post('/:id/rate', authenticate, restrictTo('customer'), submitRating);

// --- MAIN ADMIN ROUTES (Must be before /:id routes) ---
router.get('/admin/all', authenticate, restrictTo('super_admin'), getAllRestaurants);
router.patch('/admin/:id/status', authenticate, restrictTo('super_admin'), updateRestaurantStatus);

// --- RESTAURANT ADMIN ROUTES ---
router.get('/', authenticate, restrictTo('restaurant_admin'), getAdminRestaurants);

// Specific ID routes must come last to avoid conflicts
router.get('/:id', authenticate, restrictTo('restaurant_admin', 'super_admin'), getRestaurantDetails);
router.get('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin', 'super_admin'), getMenuItem);

router.post('/', authenticate, restrictTo('restaurant_admin'), upload.single('image'), createRestaurant);
router.put('/:id', authenticate, restrictTo('restaurant_admin', 'super_admin'), upload.single('image'), updateRestaurant);
router.delete('/:id', authenticate, restrictTo('restaurant_admin', 'super_admin'), deleteRestaurant);

router.post('/:id/menu', authenticate, restrictTo('restaurant_admin'), upload.single('image'), addMenuItem);
router.put('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), upload.single('image'), updateMenuItem);
router.delete('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), deleteMenuItem);

module.exports = router;