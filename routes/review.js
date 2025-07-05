const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js"); 


//reviews
router.post("/",isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created")
  //res.redirect("/listings/")
  res.redirect(`/listings/${listing._id}`);
}))

//delete reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  let {id, reviewId } = req.params;
  //Remove review reference from Listing.reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual Review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted")
  res.redirect(`/listings/${id}`);

}));

module.exports = router;