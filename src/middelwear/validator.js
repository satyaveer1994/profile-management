const { body } = require("express-validator");

// Validation rules for profile creation
const createProfileValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
  body("age").isInt({ min: 18 }).withMessage("Age must be at least 18"),
];

// Validation rules for profile update
const updateProfileValidationRules = [
  body("name").optional().notEmpty().withMessage("Name is required"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail(),
  body("age")
    .optional()
    .isInt({ min: 18 })
    .withMessage("Age must be at least 18"),
];

const validateMessageInput = [
  body("sender").notEmpty().withMessage("Sender is required"),
  body("receiver").notEmpty().withMessage("Receiver is required"),
  body("message").notEmpty().withMessage("message is required"),
];

module.exports = {
  createProfileValidationRules,
  updateProfileValidationRules,
  validateMessageInput,
};
