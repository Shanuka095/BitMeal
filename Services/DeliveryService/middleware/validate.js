const Joi = require('joi');

const createDeliveryPersonSchema = Joi.object({
  userId: Joi.string().hex().length(24).required().messages({
    'string.hex': '"userId" must be a valid hexadecimal string',
    'string.length': '"userId" must be 24 characters long',
    'any.required': '"userId" is required',
  }),
  name: Joi.string().min(3).max(100).required().messages({
    'string.min': '"name" must be at least 3 characters long',
    'string.max': '"name" cannot exceed 100 characters',
    'any.required': '"name" is required',
  }),
  phone: Joi.string()
    .pattern(/^(07|(\+94)?)(\d{8})$/)
    .required()
    .messages({
      'string.pattern.base': '"phone" number must be 10 digits and start with "07" or "+947" (e.g., 0712345678 or +94712345678)',
      'any.required': '"phone" number is required',
    }),
  vehicleType: Joi.string().valid('Motorcycle', 'Car', 'Bicycle', 'Other').required().messages({
    'any.only': '"vehicleType" must be one of "Motorcycle", "Car", "Bicycle", "Other"',
    'any.required': '"vehicleType" is required',
  }),
  licensePlate: Joi.string().min(3).max(20).required().messages({
    'string.min': '"licensePlate" must be at least 3 characters long',
    'string.max': '"licensePlate" cannot exceed 20 characters',
    'any.required': '"licensePlate" is required',
  }),
  // currentLocation and status have defaults in model, can be optional here
  currentLocation: Joi.object({
    type: Joi.string().valid('Point').optional(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional() // [longitude, latitude]
  }).optional(),
  status: Joi.string().valid('available', 'on_delivery', 'offline', 'unavailable').optional()
});

const updateDeliveryPersonSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  phone: Joi.string()
    .pattern(/^(07|(\+94)?)(\d{8})$/)
    .optional(),
  vehicleType: Joi.string().valid('Motorcycle', 'Car', 'Bicycle', 'Other').optional(),
  licensePlate: Joi.string().min(3).max(20).optional(),
  currentLocation: Joi.object({
    type: Joi.string().valid('Point').optional(),
    coordinates: Joi.array().items(Joi.number()).length(2).optional()
  }).optional(),
  status: Joi.string().valid('available', 'on_delivery', 'offline', 'unavailable').optional()
}).min(1); // At least one field is required for update

const updateDeliveryPersonStatusSchema = Joi.object({
  status: Joi.string().valid('available', 'on_delivery', 'offline', 'unavailable').required().messages({
    'any.only': '"status" must be one of "available", "on_delivery", "offline", "unavailable"',
    'any.required': '"status" is required',
  }),
});


// Validation middleware factory
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateDeliveryPerson: validate(createDeliveryPersonSchema),
  validateUpdateDeliveryPerson: validate(updateDeliveryPersonSchema),
  validateUpdateDeliveryPersonStatus: validate(updateDeliveryPersonStatusSchema)
};