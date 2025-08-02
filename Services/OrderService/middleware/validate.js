const Joi = require('joi');

const orderItemSchema = Joi.object({
  menuItemId: Joi.string().hex().length(24).required().messages({
    'string.hex': '"menuItemId" must be a valid hexadecimal string',
    'string.length': '"menuItemId" must be 24 characters long',
    'any.required': '"menuItemId" is required',
  }),
  name: Joi.string().min(1).max(100).required().messages({
    'string.min': '"item name" must be at least 1 character long',
    'string.max': '"item name" cannot exceed 100 characters',
    'any.required': '"item name" is required',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': '"item price" cannot be negative',
    'any.required': '"item price" is required',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.integer': '"item quantity" must be an integer',
    'number.min': '"item quantity" must be at least 1',
    'any.required': '"item quantity" is required',
  }),
  size: Joi.string().valid('normal', 'full').optional().messages({
    'any.only': '"size" must be either "normal" or "full"',
  }),
});

const createOrderSchema = Joi.object({
  restaurantId: Joi.string().hex().length(24).required().messages({
    'string.hex': '"restaurantId" must be a valid hexadecimal string',
    'string.length': '"restaurantId" must be 24 characters long',
    'any.required': '"restaurantId" is required',
  }),
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.min': 'Order must contain at least one item',
    'any.required': 'Order items are required',
  }),
  totalAmount: Joi.number().min(0).required().messages({
    'number.min': '"totalAmount" cannot be negative',
    'any.required': '"totalAmount" is required',
  }),
  deliveryAddress: Joi.string().min(5).max(255).required().messages({
    'string.min': '"deliveryAddress" must be at least 5 characters long',
    'string.max': '"deliveryAddress" cannot exceed 255 characters',
    'any.required': '"deliveryAddress" is required',
  }),
  // NEW: Add validation for deliveryLocation
  deliveryLocation: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(), // [longitude, latitude]
  }).required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled').required().messages({
    'any.only': 'Invalid order status',
    'any.required': 'Order status is required',
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateOrder: validate(createOrderSchema),
  validateUpdateOrderStatus: validate(updateOrderStatusSchema),
};