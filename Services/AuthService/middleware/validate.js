const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '"email" must be a valid email',
    'any.required': '"email" is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.min': '"password" must be at least 8 characters',
      'string.pattern.base':
        '"password" must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character',
      'any.required': '"password" is required',
    }),
  phone: Joi.string()
    .pattern(/^(07|(\+94)?)(\d{8})$/)
    .required()
    .messages({
      'string.pattern.base': '"phone" number must be 10 digits and start with "07" or "+947" (e.g., 0712345678 or +94712345678)',
      'any.required': '"phone" number is required',
    }),
  name: Joi.string().min(2).max(100).required().messages({ // <-- ADD THIS LINE
    'string.min': '"name" must be at least 2 characters long',
    'string.max': '"name" cannot exceed 100 characters',
    'any.required': '"name" is required',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': '"email" must be a valid email',
    'any.required': '"email" is required',
  }),
  password: Joi.string().required().messages({
    'any.required': '"password" is required',
  }),
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
};
