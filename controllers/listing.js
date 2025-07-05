const Listing = require("../models/listing.js");
//const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
//const mapToken = process.env.MAP_TOKEN;
//const geocodingclient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index= async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}


//new route
module.exports.renderNewForm= (req, res) => {
  res.render("listings/new.ejs");
}

//show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).
  populate({path:"reviews", populate:{path: "author"}}).populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//create route
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created")
  res.redirect("/listings");
}  

//Edit Route
module.exports.renderEditForm= async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing does not exist")
    res.redirect(`/listings/${id}`)
  }
  res.render("listings/edit.ejs", { listing });
}

//update
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listingData = req.body.listing;
  await Listing.findByIdAndUpdate(id, listingData, { runValidators: true, new: true });
  req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`);
}

//delete
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted")
  res.redirect("/listings/");
}