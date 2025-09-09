// require express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

// require ejs
app.set("view engine", "ejs");
const path = require("path");
app.set("views", path.join(__dirname, "views"));

// require method-override
const MethodOverride = require("method-override");
app.use(MethodOverride("_method"));

// require mongoose
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/domora";
async function main() {
    await mongoose.connect(MONGO_URL);
}

// require body-parser
app.use(express.static(path.join(__dirname, "public")));

// require ejs-mate
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// require models
const Listing = require("./models/listing");
const { url } = require("inspector");

main()
    .then( () => {
        console.log("Connected to DB.");
    })
    .catch((err) => {
        console.log(err);
    });

// root api
app.get('/', (req, res) => {
    res.send('Root');
});

// listings api
app.get('/listings', async (req, res) => { 
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

// new route
app.get('/listings/new', (req, res) => {
    res.render("./listings/new.ejs");
});

// create route for listings
app.post('/listings', async (req, res) => {
    const { title, description, image = {}, price, location, country } = req.body;
    const newListing = new Listing({
        title,
        description,
        image: {
            filename: image.filename || 'listingimage',
            url: image.url || "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?..."
        },
        price,
        location,
        country
    });
    console.log('New Listing:', newListing);
    await newListing.save();
    console.log("New listing saved to DB:", newListing);
    res.redirect('/listings');
});

// show route for listings
app.get('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("./listings/show.ejs", { listing });
});

// Edit route
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    res.render("./listings/edit.ejs", { listing });
});

// Update route
app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const { title, description, image = {}, price, location, country } = req.body;
    const updatedListing = await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image: {
            filename: 'listingimage',
            url: image.url || "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?..."
        },
        price,
        location,
        country
    });
    
    console.log("Updated listing:", updatedListing);
    res.redirect(`/listings/${updatedListing._id}`);
});

// Delete route
app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    const deltedLsitng = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deltedLsitng);  
    res.redirect('/listings');  
});

// start server
app.listen(8080, () => {
    console.log("Server is listening on port 8080...");
});