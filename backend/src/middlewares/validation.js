const Joi = require("joi");

const validateInput = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
}

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const videoUploadSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  type: Joi.string().valid("SHORT_FORM", "LONG_FORM").required(),
  videoUrl: Joi.string().uri().when("type", {
    is: "LONG_FORM",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  price: Joi.number().min(0).max(10000).when("type", {
    is: "LONG_FORM",
    then: Joi.optional(),
    otherwise: Joi.forbidden(),
  }),
})

const commentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
})

const giftSchema = Joi.object({
  amount: Joi.number().min(1).max(10000).required(),
})

module.exports = { validateInput, registerSchema, loginSchema, videoUploadSchema, commentSchema, giftSchema }