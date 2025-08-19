const DeliveryPerson = require('../models/DeliveryPerson');
const Joi = require('joi'); // Ensure Joi is imported

// Validation Schemas
const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  likeStatus: Joi.string().valid('liked', 'disliked').optional().allow(null), // Can be 'liked', 'disliked', or null
});
// You might have other validation schemas here, e.g., for create/update delivery person
// const createDeliveryPersonSchema = Joi.object({...});
// const updateDeliveryPersonSchema = Joi.object({...});
// const updateDeliveryPersonStatusSchema = Joi.object({...});


// Admin/Internal: Create a new delivery person
const createDeliveryPerson = async (req, res) => {
  try {
    const { userId, name, phone, vehicleType, licensePlate } = req.body;
    console.log(`DeliveryService (createDeliveryPerson) - Attempting to create delivery person for userId: ${userId}`);

    // Check if a DeliveryPerson profile already exists for this userId
    const existingDeliveryPerson = await DeliveryPerson.findOne({ userId });
    if (existingDeliveryPerson) {
      console.warn(`DeliveryService (createDeliveryPerson) - Delivery person profile for userId ${userId} already exists.`);
      return res.status(409).json({ error: 'A delivery person profile already exists for this user ID.' });
    }

    // Check for unique phone and license plate
    if (await DeliveryPerson.findOne({ phone })) {
      return res.status(400).json({ error: 'Phone number already registered as a delivery person.' });
    }
    if (await DeliveryPerson.findOne({ licensePlate })) {
      return res.status(400).json({ error: 'License plate already registered as a delivery person.' });
    }

    const newDeliveryPerson = new DeliveryPerson({
      userId,
      name,
      phone,
      vehicleType,
      licensePlate,
      // status defaults to 'offline', currentLocation defaults to [0,0]
    });

    await newDeliveryPerson.save();
    console.log(`DeliveryService (createDeliveryPerson) - Successfully created delivery person: ${newDeliveryPerson._id}`);
    res.status(201).json(newDeliveryPerson);
  } catch (error) {
    console.error('DeliveryService (createDeliveryPerson) - Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create delivery person profile' });
  }
};

// Admin/DeliveryPersonnel: Get all delivery persons (Admin) or single (DeliveryPersonnel)
const getAllDeliveryPersons = async (req, res) => {
  try {
    // Admins can see all, delivery personnel can see their own
    if (req.user.role === 'restaurant_admin') {
      const deliveryPersons = await DeliveryPerson.find();
      console.log(`DeliveryService (getAllDeliveryPersons) - Fetched ${deliveryPersons.length} delivery persons for admin.`);
      return res.json(deliveryPersons);
    } else if (req.user.role === 'delivery_personnel') {
      const deliveryPerson = await DeliveryPerson.findOne({ userId: req.user.userId });
      if (!deliveryPerson) {
        return res.status(404).json({ error: 'Delivery person profile not found for this user.' });
      }
      console.log(`DeliveryService (getAllDeliveryPersons) - Fetched profile for delivery personnel: ${deliveryPerson._id}`);
      return res.json([deliveryPerson]); // Return as an array for consistency
    } else {
      return res.status(403).json({ error: 'Access denied: Insufficient role.' });
    }
  } catch (error) {
    console.error('DeliveryService (getAllDeliveryPersons) - Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch delivery persons' });
  }
};

// Admin/DeliveryPersonnel/Customer: Get a single delivery person by ID
const getDeliveryPersonById = async (req, res) => {
  try {
    const { id } = req.params; // ID of the DeliveryPerson document, not userId
    let deliveryPerson;

    // Allow admins to fetch any delivery person by ID
    if (req.user.role === 'restaurant_admin') {
      deliveryPerson = await DeliveryPerson.findById(id);
    }
    // Allow delivery personnel to fetch their own profile by ID
    else if (req.user.role === 'delivery_personnel') {
      deliveryPerson = await DeliveryPerson.findOne({ _id: id, userId: req.user.userId });
    }
    // Allow customers to fetch *any* delivery person by ID (for tracking purposes)
    else if (req.user.role === 'customer') {
      deliveryPerson = await DeliveryPerson.findById(id);
    }
    else { // Fallback for any other unauthorized roles
      return res.status(403).json({ error: 'Access denied: Insufficient role.' });
    }

    if (!deliveryPerson) {
      return res.status(404).json({ error: 'Delivery person not found or not authorized to view.' });
    }
    console.log(`DeliveryService (getDeliveryPersonById) - Fetched delivery person: ${deliveryPerson._id}`);
    res.json(deliveryPerson);
  } catch (error) {
    console.error('DeliveryService (getDeliveryPersonById) - Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch delivery person' });
  }
};

// Admin/DeliveryPersonnel: Update delivery person details
const updateDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params; // ID of the DeliveryPerson document
    const { name, phone, vehicleType, licensePlate, currentLocation, status } = req.body;
    let deliveryPerson;

    // Build update object dynamically
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (vehicleType) updateFields.vehicleType = vehicleType;
    if (licensePlate) updateFields.licensePlate = licensePlate;
    if (currentLocation) updateFields.currentLocation = currentLocation;
    if (status) updateFields.status = status;

    if (req.user.role === 'restaurant_admin') {
      // Admins can update any delivery person by ID
      deliveryPerson = await DeliveryPerson.findByIdAndUpdate(id, updateFields, { new: true, runValidators: true });
    } else if (req.user.role === 'delivery_personnel') {
      // Delivery personnel can only update their own profile linked by userId
      deliveryPerson = await DeliveryPerson.findOneAndUpdate(
        { _id: id, userId: req.user.userId },
        updateFields,
        { new: true, runValidators: true }
      );
    } else {
      return res.status(403).json({ error: 'Access denied: Insufficient role.' });
    }

    if (!deliveryPerson) {
      return res.status(404).json({ error: 'Delivery person not found or not authorized to update.' });
    }
    console.log(`DeliveryService (updateDeliveryPerson) - Updated delivery person: ${deliveryPerson._id}`);
    res.json(deliveryPerson);
  } catch (error) {
    console.error('DeliveryService (updateDeliveryPerson) - Error:', error.message);
    res.status(500).json({ error: 'Failed to update delivery person' });
  }
};

// Admin/DeliveryPersonnel: Update delivery person's status (e.g., available, on_delivery, offline)
const updateDeliveryPersonStatus = async (req, res) => {
  try {
    const { id } = req.params; // ID of the DeliveryPerson document
    const { status } = req.body;
    const userId = req.user.userId;
    const userToken = req.headers.authorization;

    if (req.user.role === 'restaurant_admin') {
      // Admins can update any delivery person's status
      deliveryPerson = await DeliveryPerson.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    } else if (req.user.role === 'delivery_personnel') {
      // Delivery personnel can only update their own status
      deliveryPerson = await DeliveryPerson.findOneAndUpdate(
        { _id: id, userId: req.user.userId },
        { status },
        { new: true, runValidators: true }
      );
    } else {
      return res.status(403).json({ error: 'Access denied: Insufficient role.' });
    }

    if (!deliveryPerson) {
      return res.status(404).json({ error: 'Delivery person not found or not authorized to update status.' });
    }
    console.log(`DeliveryService (updateDeliveryPersonStatus) - Updated status for ${deliveryPerson._id} to ${status}`);
    res.json(deliveryPerson);
  } catch (error) {
    console.error('DeliveryService (updateDeliveryPersonStatus) - Error:', error.message);
    res.status(500).json({ error: 'Failed to update delivery person status' });
  }
};

// Admin: Delete a delivery person
const deleteDeliveryPerson = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'restaurant_admin') {
        return res.status(403).json({ error: 'Access denied: Only administrators can delete delivery persons.' });
    }

    const deliveryPerson = await DeliveryPerson.findByIdAndDelete(id);
    if (!deliveryPerson) {
      return res.status(404).json({ error: 'Delivery person not found.' });
    }
    console.log(`DeliveryService (deleteDeliveryPerson) - Deleted delivery person: ${deliveryPerson._id}`);
    res.json({ message: 'Delivery person deleted successfully.' });
  } catch (error) {
    console.error('DeliveryService (deleteDeliveryPerson) - Error:', error.message);
    res.status(500).json({ error: 'Failed to delete delivery person' });
  }
};

// Delivery Person updates their own location
const updateMyGeolocation = async (req, res) => {
    try {
        const { coordinates } = req.body;
        const userId = req.user.userId;

        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ error: 'Invalid coordinates format. Expected [longitude, latitude].' });
        }

        const deliveryPerson = await DeliveryPerson.findOneAndUpdate(
            { userId },
            { currentLocation: { type: 'Point', coordinates } },
            { new: true, runValidators: true }
        );

        if (!deliveryPerson) {
            return res.status(404).json({ error: 'Delivery person profile not found.' });
        }

        console.log(`DeliveryService (updateMyGeolocation) - Updated location for ${deliveryPerson._id}: ${coordinates}`);
        res.json({ message: 'Location updated successfully.', location: deliveryPerson.currentLocation });
    } catch (error) {
        console.error('DeliveryService (updateMyGeolocation) - Error:', error.message);
        res.status(500).json({ error: 'Failed to update location.' });
    }
};

// Submit a rating for a delivery person - UPDATED FOR LIKES
const submitRating = async (req, res) => {
  try {
    const { id } = req.params; // Delivery Person ID
    const { rating, likeStatus } = req.body; // The submitted rating (1-5) and likeStatus
    
    // Validate the incoming rating (and optional likeStatus)
    const { error } = ratingSchema.validate({ rating, likeStatus });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const deliveryPerson = await DeliveryPerson.findById(id);
    if (!deliveryPerson) return res.status(404).json({ error: 'Delivery person not found.' });

    const currentTotalScore = deliveryPerson.averageRating * deliveryPerson.totalRatings;
    const newTotalRatings = deliveryPerson.totalRatings + 1;
    const newAverageRating = (currentTotalScore + rating) / newTotalRatings;

    deliveryPerson.averageRating = newAverageRating;
    deliveryPerson.totalRatings = newTotalRatings;

    // Update likes/dislikes
    if (likeStatus === 'liked') {
        deliveryPerson.totalLikes += 1;
    } else if (likeStatus === 'disliked') {
        deliveryPerson.totalDislikes += 1;
    }
    
    await deliveryPerson.save();
    
    res.json({
      message: 'Rating submitted successfully',
      averageRating: deliveryPerson.averageRating,
      totalRatings: deliveryPerson.totalRatings,
      totalLikes: deliveryPerson.totalLikes,
      totalDislikes: deliveryPerson.totalDislikes,
    });
  } catch (error) {
    console.error('Error submitting driver rating:', error);
    res.status(500).json({ error: 'Failed to submit driver rating.' });
  }
};

module.exports = {
  createDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPerson,
  updateDeliveryPersonStatus,
  deleteDeliveryPerson,
  updateMyGeolocation,
  submitRating,
};
