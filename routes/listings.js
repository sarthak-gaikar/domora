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

// Index Route - All Listings
router.get('/', wrapAsync(async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// New Route - Form to Create Listing
router.get('/new', isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
});

// Create Route - Add Listing
router.post('/', isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log("Validation Result:", result);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    const { title, description, image = {}, price, location, country } = req.body;
    const newListing = new Listing({
        title,
        description,
        image: typeof image === 'string' ? image : image.url || image, // <-- forces string
        price,
        location,
        country
    });

    newListing.owner = req.user._id; // Associate listing with logged-in user
    console.log('New Listing:', newListing);
    await newListing.save();
    console.log("New listing saved to DB:", newListing);
    req.flash('success', 'New listing created successfully!');
    res.redirect('/listings');
})  
);

// Show Route - Single Listing
router.get('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
    console.log(listing.owner.username);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    res.render("./listings/show.ejs", { listing });
}));

// Edit Route - Form to Edit Listing
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Listing ID");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    res.render("listings/edit", { listing });
}));


// Update Route - Apply Edits to Listing
router.put('/:id' , isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Invalid Listing Data");
    // }
    let { id } = req.params;
    const { title, description, image, price, location, country } = req.body;

    const updatedListing = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image,
        price,
        location,
        country
    });

    console.log("Updated listing:", updatedListing);
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete Route - Remove Listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);  
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');  
}));

module.exports = router;