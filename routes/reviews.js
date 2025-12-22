const express = require("express");
const router = express.Router({ mergeParams: true });

// Utilities
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Models
const Listing = require("../models/listing");
const Review = require("../models/reviews");

// Mongoose
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/domora";

// Middleware
const { validateReview, isReviewAuthor } = require("../middleware");
const { isLoggedIn } = require("../middleware");

// Controller Functions
const reviewsController = require("../controllers/reviews");
const reviews = require("../models/reviews");

// Create Route - Add Review to Listing
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));

// Delete Review Route - Remove Review from Listing
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewsController.deleteReview));

module.exports = router;