const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
//const {saveRedirectUrl} = require("../middleware.js");

//const userController = require("../controllers/user.js");

router.get("/signup",(req, res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup",async (req, res)=>{
    let {username, email, password}= req.body;
    const newUser= new User({email, username})
    await User.register(newUser, password)
    req.flash('success', "Welcome to Wanderlust!")
    res.redirect("/listings");
})


module.exports = router;
