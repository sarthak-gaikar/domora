const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");
const { listingSchema } = require("../schema.js");

// Index Route - All Listings
module.exports.index = async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

// New Route - Form to Create Listing
module.exports.newListingForm = (req, res) => {
    res.render("./listings/new.ejs");
};

// Create Route - Add Listing

module.exports.createListing = async (req, res, next) => {
    console.log("CREATE ROUTE HIT");
    console.log("FILE:", req.file);
    let url = req.file.secure_url;
    let filename = req.file.public_id;

    const { title, description, price, location, country } = req.body;

    const newListing = new Listing({
        title,
        description,
        image: { url, filename },
        price,
        location,
        country,
        owner: req.user._id
    });

    await newListing.save();

    req.flash('success', 'New listing created successfully!');
    res.redirect(`/listings/${newListing._id}`);
};

// Show Route - Single Listing
// module.exports.showListing = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
//     console.log(listing.owner.username);
//     if (!listing) {
//         req.flash('error', 'Listing not found!');
//         return res.redirect('/listings');
//     }

//     res.render("./listings/show.ejs", { listing });
// };

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');

    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    if (!listing.owner) {
        req.flash('error', 'Owner of this listing no longer exists!');
        return res.redirect('/listings');
    }

    res.render("./listings/show.ejs", { listing });
};

// Edit Route - Form to Edit Listing
module.exports.editListingForm = async (req, res, next) => {
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
};

// Update Route - Apply Edits to Listing
module.exports.updateListing = async (req, res) => {
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
};

// Delete Route - Remove Listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);  
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');  
};