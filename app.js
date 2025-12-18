// ==========================
// Import Dependencies
// ==========================

// Express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

// Express-Session
const session = require("express-session");
const sessionConfig = {
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));

// Flash
const flash = require("connect-flash");
app.use(flash());

// Passport (for authentication)
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
});

// Routes
const listings = require("./routes/listings.js")
const reviews = require("./routes/reviews.js")
const users = require("./routes/users.js")

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

// Users Route
app.use('/', users);

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