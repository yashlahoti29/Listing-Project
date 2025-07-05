const Listing = require("../models/listing")
const Review = require("../models/review");

//reviews
module.exports.createReview= async(req, res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Created")
  //res.redirect("/listings/")
  res.redirect(`/listings/${listing._id}`);
}


//delete review
module.exports.destroyReview= async (req, res) => {
  let {id, reviewId } = req.params;
  //Remove review reference from Listing.reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual Review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted")
  res.redirect(`/listings/${id}`);

}