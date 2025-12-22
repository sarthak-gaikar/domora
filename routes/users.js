const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// Controller Functions
const usersControllers = require("../controllers/users");
const user = require("../models/user");

router.route("/register")
    .get(usersControllers.registerForm) // Render registration form
    .post(wrapAsync(usersControllers.registerUser)); // Handle user registration

router.route("/login")
    .get(usersControllers.loginForm) // Render login form
    .post( saveRedirectUrl, 
    passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), 
    wrapAsync(usersControllers.loginUser)); // Handle user login

router.route("/logout")
    .get(usersControllers.logoutUser); // Handle user logout

module.exports = router;