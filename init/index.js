const mongoose = require("mongoose");
const initData = require("./data"); // your data.js
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/domora";

// 🔥 Connect to DB
main()
    .then(() => {
        console.log("Connected to DB.");
        return initDB(); // run seeding AFTER connection
    })
    .catch((err) => {
        console.log(err);
    });

// DB connection function
async function main() {
    await mongoose.connect(MONGO_URL);
}

// 🔥 IMPORTANT: Use proper ObjectId
const ownerId = new mongoose.Types.ObjectId("6943b09fa2624e042410fe82");

// 🔥 INIT FUNCTION
const initDB = async () => {
    try {
        // 1. Clear old data
        await Listing.deleteMany({});
        console.log("Old listings deleted");

        // 2. Prepare new data (KEEP image intact)
        const newData = initData.data.map((obj) => ({
            ...obj,          // ✅ includes image { url, filename }
            owner: ownerId   // ✅ attach owner
        }));

        // 3. Insert into DB
        await Listing.insertMany(newData);

        console.log("Database initialized successfully");
    } catch (err) {
        console.log("Error initializing DB:", err);
    } finally {
        mongoose.connection.close(); // close connection cleanly
    }
};