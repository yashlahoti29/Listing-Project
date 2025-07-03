const express = require("express");
const app = express();
const mongoose= require("mongoose");
//const Listing= require("./models/listing.js")
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require('joi');
const {listingSchema, reviewSchema} = require("./schema.js");
//const Review= require("./models/review.js")
//const router = express.Router();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User= require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))



const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(()=> 
    {console.log("connection successful");}
).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}


const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  };



app.get("/", (req, res)=>{
    res.send("root is working");
})


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    //res.locals.currUser = req.user;
  
    next();
  });

// app.get("/demouser", async(req, res)=>{
//   let fakeUser = new User({
//     email:"sviv@gmail.com",
//     username: "lahoti-yash",
//   });
//   let registeredUser=await User.register(fakeUser, "12345");
//   res.send(registeredUser);

// })


app.use("/listings", listingRouter)
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter);


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