const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "domora-listings", // Folder in Cloudinary to store images
        allowed_formats: ["jpg", "jpeg", "png"], // Allowed image formats
    },
});

module.exports = {
    cloudinary,
    storage,
};