const Joi = require('joi');

const orderItemSchema = Joi.object({
  menuItemId: Joi.string().hex().length(24).required(),
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(1).required(),
  size: Joi.string().valid('normal', 'full').optional(),
});

const createOrderSchema = Joi.object({
  restaurantId: Joi.string().hex().length(24).required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  totalAmount: Joi.number().min(0).required(),
  
  // New fields allowed
  deliveryFee: Joi.number().min(0).optional(),
  serviceFee: Joi.number().min(0).optional(),
  tip: Joi.number().min(0).optional(),

  deliveryAddress: Joi.string().min(0).max(500).allow('').optional(),
  deliveryLocation: Joi.object({
    type: Joi.string().valid('Point').required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled').required(),
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