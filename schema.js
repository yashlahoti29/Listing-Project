const Joi = require('joi');

//Schema for listings
module.exports.listingSchema = Joi.object({ 
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(1000),
        image: Joi.string().allow("", null),
    }).required(),
});
