const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating Schema
const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
    filename: { type: String, default: 'listingimage' },
    url: { 
        type: String,
        default: "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?...",
        set: (v) => v === "" 
            ? "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?..." 
            : v
        }
    },
    price: Number,
    location: String,
    country: String,
})

// Creating Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
