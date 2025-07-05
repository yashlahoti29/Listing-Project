const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

router.route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(validateListing,wrapAsync(listingController.createListing));//create route


//New Route (new show ke pehle likha cause show new ke "/new" ko id samajh raha hai)
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .put(isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing)) //update
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Index Route
//router.get("/", wrapAsync(listingController.index));

//show route
//router.get("/:id", wrapAsync(listingController.showListing));

//create route
//router.post("/", validateListing,wrapAsync(listingController.createListing));

//update route
//router.put("/:id",isLoggedIn, isOwner,validateListing, wrapAsync(listingController.updateListing));

//Delete Route
//router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;