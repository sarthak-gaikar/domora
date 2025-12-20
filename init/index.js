const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/domora";

main()
    .then( () => {
        console.log("Connected to DB.");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// const initDB = async () => {
//     await Listing.deleteMany({}); 
//     initData.data = initData.data.map((obj) => ({
//         ...obj,
//         owner: "6943b09fa2624e042410fe82" // Sarthak
//     }));

//     await Listing.insertMany(initData.data);
//     console.log("Database initialized with sample data.");
// }

const initDB = async () => {
    await Listing.deleteMany({}); 

    initData.data = initData.data.map((obj) => ({
        ...obj,
        image: typeof obj.image === "object" ? obj.image.url : obj.image,
        owner: "6943b09fa2624e042410fe82" // Sarthak
    }));

    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data.");
};


initDB();