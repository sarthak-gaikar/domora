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

// Reviews Routes
// Create Route - Add Review to Listing
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const { rating, comment } = req.body.review;

    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    // Create a Review document
    const review = new Review({ rating, comment });
    review.author = req.user._id;
    console.log("New Review:", review);
    await review.save();

    // Push review's ObjectId
    listing.reviews.push(review);
    console.log("Updated Listing with new review:", listing);
    await listing.save();

    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${id}`);
}))

// Delete Review Route - Remove Review from Listing
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted review ${reviewId} from listing ${id}`);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}))

module.exports = router;