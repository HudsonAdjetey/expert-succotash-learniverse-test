const asyncHandler = require("express-async-handler");
const UserModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RegisteredCoursesModel = require("../model/registeredCourse");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const CourseModel = require("../model/courseModel");

/* REGISTERING AND AUTHENTICATING USER */
const register = asyncHandler(async (req, res) => {
  // register user
  const {
    username,
    email,
    password,
    contact,
    firstName,
    lastName,

    guardian,
    parentContact,
    address,
  } = req.body;

  const userExist = await UserModel.findOne({ email });
  // check if the user exists
  if (userExist) return res.status(403).json({ message: "User already exist" });

  // register a new user
  let user = new UserModel({
    username,
    email,
    password,
    verified: false,
    contact,
    firstName,
    lastName,

    guardian,
    parentContact,
    address,
  });
  const newUser = await user.save();
  if (newUser) {
    // send a cookie
    generateAccessToken(res, newUser._id);
    generateRefreshToken(res, newUser._id);
    res.status(201).json({
      success: true,
      data: {
        userID: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profile: newUser.photoUrl,
        va1: newUser.role,
        contact,
        firstName,
        lastName,
      },
    });
  } else {
    return res.status(409).json({
      success: false,
      error: "Failed to create account",
    });
  }
});
/* REGISTERING AND AUTHENTICATING USER */

/* LOGIN AND AUTHENTICATING USER */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user exists
  let user = await UserModel.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    // generate tokens
    const fullNames = user.firstName + user.lastName;
    generateAccessToken(res, user._id);
    generateRefreshToken(res, user._id);
    return res.status(200).json({
      success: true,
      data: {
        email: user.email,
        username: user.username,
        userID: user._id,
        profile: user.photoUrl,
        contact: user.contact,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: fullNames,
        va1: user.role,
      },
      message: "Logged in successfully",
    });
  } else {
    return res.status(401).send("Invalid credentials");
  }
});
/* LOGIN AND AUTHENTICATING USER */

/* USER SYSTEM LOGOUT */
const signOut = asyncHandler(async (req, res, next) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    success: true,
    message: "Signed out successfully",
  });
});
/* USER SYSTEM LOGOUT */

/* REFRESH TOKEN GENERATION */
const refreshToken = async (req, res) => {
  // Check if the refresh token cookie exists
  const refreshCookie = req.cookies.refresh_token;

  if (!refreshCookie) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found",
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshCookie, process.env.REFRESH_SECRET);

    // Generate a new access token
    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Set the new access token in a cookie or response header
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};
/* REFRESH TOKEN GENERATION */

/* UPDATING USER AND AUTHENTICATING USER */
const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  if (req.body.username?.includes(" ")) {
    return res.status(400).send({ message: "Username cannot have spaces" });
  }
  let userNameArray = req.body.username.split(" ");
  if (userNameArray.length > 1) {
    return res.status(400).send({ message: "Username cannot have spaces" });
  }
  // stop the process if the username is a number
  if (typeof req.body.username == "number") {
    return res.status(404).json({ message: "Username cannot be numbers" });
  }

  if (typeof req.body.username !== "string") {
    return res
      .status(404)
      .json({ message: "Username must be alphabet characters" });
  }

  const pattern = /^[a-zA-Z]/;

  if (!pattern.test(req.body.username)) {
    return res.status(404).json({
      message: "Username must contain alphabet characters",
    });
  }

  // stop the process if the email is a number
  if (!isNaN(req.body.username)) {
    return res.status(400).json({ message: "Username cannot be Numeric" });
  }
  // check if theres already an existing username

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.photoUrl = req.body.photoUrl || user.photoUrl;
    user.contact = req.body.contact || user.contact;

    if (req.body.password) {
      user.password = req.body.password; // Avoid setting password directly
    }

    const userUpdate = await user.save();

    res.status(200).json({
      email: userUpdate.email,
      username: userUpdate.username,
      userID: user._id,
      profile: userUpdate.photoUrl,
      contact: userUpdate.contact,
      firstName: userUpdate.firstName,
      lastName: userUpdate.lastName,
      va1: userUpdate.role,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
});
/* UPDATING USER AND AUTHENTICATING USER */

/* REGISTERING USER === REGISTERING COURSE */
const createStudent = asyncHandler(async (req, res) => {
  // Admin only has control
  const checkAdminUser = await UserModel.findOne({ _id: req.user.id });
  if (checkAdminUser.role !== "Admin" || !checkAdminUser) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
  // CHECK FOR USER EXISTENCE
  let studentExists = await UserModel.findOne({ email: req.body.email });
  if (studentExists) {
    return res.status(409).json({ message: "User already exist." });
  }
  const student = new UserModel({
    ...req.body,
    role: "Student",
    status: "Active",
  });
  const newStudent = await student.save();
  // Register student course info
  const fetchAllClasses = await CourseModel.find();
  const userID = newStudent._id.toString();
  let registeredCourses = [];

  // Retrieve courses from request body and find matching classes
  if (req.body.courses && fetchAllClasses.length > 0) {
    req.body.courses.forEach((item) => {
      const foundClass = fetchAllClasses.find(
        (cla) => item.name.toLowerCase() === cla.name.toLowerCase()
      );

      if (foundClass) {
        item.id = foundClass._id;
        item.link = foundClass.link;
        item.price = foundClass.price;
        item.description = foundClass.description;
        item.duration = foundClass.duration;
        item.time = foundClass.time;
        item.date = foundClass.date;
      }

      registeredCourses.push(item);
    });
  }

  let existingUserCourses = await RegisteredCoursesModel.findOne({
    userID: student._id,
  });
  if (!existingUserCourses) {
    // If no document exists for the user, create a new one
    existingUserCourses = new RegisteredCoursesModel({
      userID: student._id,
      verified: true,
      courses: registeredCourses.map((item) => ({
        ...item,
        currentDate: new Date(),
        expiryDate: calculateExpiryDate(req.body.month),
      })),
    });

    await existingUserCourses.save();
  } else {
    // Check if the user is already registered for any active course in the request
    const activeCourses = existingUserCourses.courses.filter((course) =>
      registeredCourses.some(
        (item) =>
          item.name.toLowerCase() === course.name.toLowerCase() &&
          new Date() < new Date(course.expiryDate)
      )
    );

    if (activeCourses.length > 0) {
      return res.status(400).json({
        message: "User is already registered for an active course",
        activeCourses,
      });
    }

    // If no active course found, add the new courses to the existing document
    existingUserCourses.courses = [
      ...existingUserCourses.courses,
      ...registeredCourses.map((item) => ({
        ...item,
        currentDate: new Date(),
        expiryDate: calculateExpiryDate(req.body.month),
      })),
    ];

    await existingUserCourses.save();
  }

  return res.status(201).json({
    message: "Registered successfully",
  });
});
/* REGISTERING USER === REGISTERING COURSE */

// Function to calculate expiry date based on months
const calculateExpiryDate = (months) => {
  let expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  return expiryDate;
};

module.exports = {
  register,
  login,
  refreshToken,
  signOut,
  updateUser,
  createStudent,
};
