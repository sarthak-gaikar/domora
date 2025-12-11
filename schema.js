const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required"
    }),
    description: Joi.string().required().messages({
        "string.empty": "Description is required",
        "any.required": "Description is required"
    }),
    image: Joi.string().uri().optional().messages({
        "string.uri": "Image must be a valid URL"
    }).optional(),
    price: Joi.number().required().min(0).messages({
        "number.base": "Price must be a number",
        "number.min": "Price cannot be negative",
        "any.required": "Price is required"
    }),
    location: Joi.string().required().messages({
        "string.empty": "Location is required",
        "any.required": "Location is required"
    }),
    country: Joi.string().required().messages({
        "string.empty": "Country is required",
        "any.required": "Country is required"
    })
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5).messages({
            "number.base": "Rating must be a number",
            "number.min": "Rating must be at least 1",
        }),
        comment: Joi.string().required().messages({
            "string.empty": "Comment is required",
            "any.required": "Comment is required"
        })
    }).required(),
});