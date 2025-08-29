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
} = require('../controllers/restaurantController');
const { authenticate, restrictTo } = require('../middleware/restrictAccess');
const multer = require('multer');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'Uploads/';
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

// Debug: Log the upload instance
console.log('Upload instance in restaurantRoutes.js:', upload);

// Customer: Public access
router.get('/public', getPublicRestaurants);
router.get('/public/:id', getPublicRestaurantDetails);

// Route for submitting restaurant ratings
router.post('/:id/rate', authenticate, restrictTo('customer'), submitRating);

// Admin: Protected routes
router.get('/', authenticate, restrictTo('restaurant_admin'), getAdminRestaurants);
router.get('/:id', authenticate, restrictTo('restaurant_admin'), getRestaurantDetails);
router.get('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), getMenuItem);
router.post('/', authenticate, restrictTo('restaurant_admin'), upload.single('image'), createRestaurant);
router.put('/:id', authenticate, restrictTo('restaurant_admin'), upload.single('image'), updateRestaurant);
router.delete('/:id', authenticate, restrictTo('restaurant_admin'), deleteRestaurant);
router.post('/:id/menu', authenticate, restrictTo('restaurant_admin'), upload.single('image'), addMenuItem);
router.put('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), upload.single('image'), updateMenuItem);
router.delete('/:id/menu/:menuId', authenticate, restrictTo('restaurant_admin'), deleteMenuItem);

module.exports = router;