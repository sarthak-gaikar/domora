const Listing = require("../models/listing");
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");

// Create Review for a Listing
module.exports.createReview = async (req, res) => {
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
};

// Delete Review from a Listing
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted review ${reviewId} from listing ${id}`);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}