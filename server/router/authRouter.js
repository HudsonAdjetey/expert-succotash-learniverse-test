const express = require("express");
const {
  register,
  login,
  refreshToken,
  signOut,
  updateUser,
  createStudent,
} = require("../controllers/AuthController");
const registrationValidationRules = require("../validation/validation");
const protectedRoute = require("../middleware/authMiddleware");
const router = express.Router();

// register users
router.post("/register", registrationValidationRules, register);

// Google users

// login
router.post("/signin", login);

// refresh token
router.post("/refresh", refreshToken);

// signout users
router.post("/signout", signOut);

// update users
router.put("/update", protectedRoute, updateUser);

// REGISTER USER
router.post("/register-student", protectedRoute, createStudent);
module.exports = router;
