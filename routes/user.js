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

router.post("/signup", wrapAsync(async (req, res)=>{
    try{
        let {username, email, password}= req.body;
        const newUser= new User({email, username})
        await User.register(newUser, password)
        req.flash('success', "Welcome to Wanderlust!")
        res.redirect("/listings"); 
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect("/signup");
    }
}))


router.get("/login",(req, res)=>{
    res.render("users/login.ejs");
})


router.post("/login",
    passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
    async (req, res)=>{
    req.flash("success", "Welcome back! You're are logged in");
    res.redirect("/listings")
})

router.get("/logout",(req, res, next)=>{
    req.logOut((err)=>{
        if(err){
          return next(err)
        }
        req.flash("success", "You're Logged out!");
        res.redirect("/listings");
    })
} );

module.exports = router;
