// ==========================
// Import Dependencies
// ==========================

// Express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

// Path
const path = require("path");

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Method-Override
const MethodOverride = require("method-override");
app.use(MethodOverride("_method"));

// Mongoose
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/domora";

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS-Mate (for layouts/partials)
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// Models
const Listing = require("./models/listing");
const Review = require("./models/reviews");

// Utilities
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

// Schema for server-side validation
const { listingSchema, reviewSchema } = require("./schema.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewListing.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

// ==========================
// Database Connection
// ==========================
async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB.");
    })
    .catch((err) => {
        console.log(err);
    });

// ==========================
// Routes
// ==========================

// Root Route
app.get('/', (req, res) => {
    res.send('Root');
});

// Index Route - All Listings
app.get('/listings', wrapAsync(async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// New Route - Form to Create Listing
app.get('/listings/new', (req, res) => {
    res.render("./listings/new.ejs");
});

// Create Route - Add Listing
app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
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

    console.log('New Listing:', newListing);
    await newListing.save();
    console.log("New listing saved to DB:", newListing);

    res.redirect('/listings');
})  
);

// Show Route - Single Listing
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');

    if (!listing) {
        return res.status(404).send("Listing not found");
    }

    res.render("./listings/show.ejs", { listing });
}));

// Edit Route - Form to Edit Listing
app.get('/listings/:id/edit', wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(400, "Invalid Listing ID");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/edit", { listing });
}));


// Update Route - Apply Edits to Listing
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
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
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Reviews Routes
// Create Route - Add Review to Listing
app.post('/listings/:id/reviews' , wrapAsync(async (req, res) => {
    let { id } = req.params;
    const { rating, comment } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    // Create a Review document
    const review = new Review({ rating, comment });
    console.log("New Review:", review);
    await review.save();

    // Push review's ObjectId
    listing.reviews.push(review);
    console.log("Updated Listing with new review:", listing);
    await listing.save();

    res.redirect(`/listings/${id}`);
}))

// Delete Review Route - Remove Review from Listing
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    console.log(`Deleted review ${reviewId} from listing ${id}`);

    res.redirect(`/listings/${id}`);
}))

// Delete Route - Remove Listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);  
    res.redirect('/listings');  
}));

// ==========================
// Error Handling Middleware
// ==========================
// for all other routes not defined -> currently not working because of express-regexp version mismatch
// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page Not Found"));
// })

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong"} = err;
    res.render("error.ejs", { statusCode, message });
});

// ==========================
// Start Server
// ==========================
app.listen(8080, () => {
    console.log("Server is listening on port 8080...");
});