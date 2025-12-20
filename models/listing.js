const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

// Creating Schema
const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?...",
        set: (v) => v === "" 
            ? "https://plus.unsplash.com/premium_vector-1721890983105-625c0d32045f?..." 
            : v
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
    console.log("Associated reviews deleted for listing:", listing._id);
})

// Creating Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
