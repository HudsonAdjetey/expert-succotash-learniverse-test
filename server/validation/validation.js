const { check, validationResult } = require("express-validator");

const registrationValidationRules = [
  check("email").isEmail().withMessage("Please enter a valid password"),

  // validate email
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must at least 3 characters long")
    .matches(/^\w+$/)
    .withMessage("Username must contain only alphanumeric"),

  // validate password
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = registrationValidationRules;
