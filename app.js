const express = require("express");
const app = express();
const mongoose= require("mongoose");
const Listing= require("./models/listing.js")
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');
const {listingSchema, reviewSchema} = require("./schema.js");
const Review= require("./models/review.js")
const router = express.Router();

const listings= require("./routes/listing.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))


const validateListing= (req, res, next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
  } else{
    next();
  }
}

const validateReview= (req, res, next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg= error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errMsg)
  } else{
    next();
  }
}


const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=> 
    {console.log("connection successful");}
).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res)=>{
    res.send("root is working");
})

// app.get("/testListing", async(req,res)=>{
//     let sample=new Listing({
//         title:"My home",
//         description:"by beach",
//         price: 1222,
//         location:"Pune",
//         country:"India",
//     });
//     await sample.save();
//     res.send("success")
// })

app.use("/listings", listings)

//reviews
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect("/listings")
}))

//delete reviews
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let {id, reviewId } = req.params;
  //Remove review reference from Listing.reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual Review document
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);

}));


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", { err })
}); 


app.listen(8080, ()=> {
    console.log('server listening');
})