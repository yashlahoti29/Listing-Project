const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");


//Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route (new show ke pehle likha cause show new ke "/new" ko id samajh raha hai)
router.get("/new",isLoggedIn, (req, res) => {
  
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"reviews", populate:{path: "author"}})
  .populate("owner");
  if(!listing){
    req.flash("error", "Listing does not exist")
    res.redirect("/listings")
  }
  res.render("listings/show.ejs", { listing });
}));

//create route
router.post("/", validateListing,
  wrapAsync(async (req, res) => {
  
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listings");
  
}));

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing does not exist")
    res.redirect(`/listings/${id}`)
  }
  res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id",isLoggedIn, isOwner,validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingData = req.body.listing;
  await Listing.findByIdAndUpdate(id, listingData, { runValidators: true, new: true });
  req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted")
  res.redirect("/listings/");
}));


module.exports = router;