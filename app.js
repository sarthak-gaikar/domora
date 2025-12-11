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

// Routes
const listings = require("./routes/listings.js")
const reviews = require("./routes/reviews.js")

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

// Listings Route
app.use('/listings', listings);

// Reviews Route
app.use('/listings/:id/reviews', reviews);

// ==========================
// Error Handling Middleware
// ==========================
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