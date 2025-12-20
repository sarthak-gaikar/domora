// Models
const Listing = require('./models/listing');
const Review = require('./models/reviews');
const { listingSchema, reviewSchema } = require("./schema.js");

// Utilities
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        // ✅ Store only safe redirect URLs
        if (req.method === "GET") {
            req.session.redirectUrl = req.originalUrl;
        } else {
            // fallback for POST/PUT/DELETE
            req.session.redirectUrl = req.get("Referer") || "/listings";
        }

        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.clearRedirectUrl = (req, res, next) => {
    delete req.session.redirectUrl;
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    };
    next();
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    };
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { reviewId } = req.params;
    let { id } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    };
    next();
}