// Dependencies
const express = require("express");
const router = express.Router();

// Middleware
const { isLoggedIn } = require("../middleware");
const { isOwner } = require("../middleware");
const { validateListing } = require("../middleware");

// Utilities
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Schema for server-side validation
const { listingSchema, reviewSchema } = require("../schema.js");

// Models
const Listing = require("../models/listing");

// Mongoose
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/domora";

// Controller Functions
const listingsController = require("../controllers/listings");

// Cloudinary storage configuration
const { storage } = require("../cloudConfig.js");

// Multer for handling file uploads
const multer = require("multer");
const upload = multer({ storage }); // Temporary storage for uploaded files

router.route('/')
    .get(wrapAsync(listingsController.index)) // List all listings
    .post(isLoggedIn, validateListing, upload.single("image"), wrapAsync(listingsController.createListing)); // Create a new listing

router.route('/new')
    .get(isLoggedIn, listingsController.newListingForm); // Form to create a new listing

router.route('/:id/edit')
    .get(isLoggedIn, isOwner, wrapAsync(listingsController.editListingForm)); // Form to edit a listing

router.route('/:id')
    .get(wrapAsync(listingsController.showListing)) // Show a specific listing
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.updateListing)) // Update a specific listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingsController.deleteListing)); // Delete a specific listing

module.exports = router;