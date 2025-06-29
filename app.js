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
const {listingSchema} = require("./schema.js")
const Review= require("./models/review.js")



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

//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route (new show ke pehle likha cause show new ke "/new" ko id samajh raha hai)
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", validateListing,
  wrapAsync(async (req, res) => {
  
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listingData = req.body.listing;
  await Listing.findByIdAndUpdate(id, listingData, { runValidators: true, new: true });
  res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  //console.log(deletedListing);
  res.redirect("/listings");
}));

//reviews
app.post("/listings/:id/reviews", async(req, res)=>{
  let listing=await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  res.redirect()
})

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