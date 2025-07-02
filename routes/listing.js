const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");


const validateListing= (req, res, next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
  } else{
    next();
  }
}


//Index Route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route (new show ke pehle likha cause show new ke "/new" ko id samajh raha hai)
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
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
  await newListing.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listings");
  
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingData = req.body.listing;
  await Listing.findByIdAndUpdate(id, listingData, { runValidators: true, new: true });
  req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted")
  res.redirect("/listings/:id");
}));


module.exports = router;