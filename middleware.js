const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js"); 
const{listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
     //   req.session.redirectUrl = req.originalUrl ;

        req.flash("error","you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();

}